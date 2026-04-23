"""CostCraft CLI — orchestrates a single task run end-to-end.

Usage:
    python -m costcraft.cli run-one --task T10 --condition baseline_default --out-dir gdpval/runs
    python -m costcraft.cli build-tracecard --run-dir gdpval/runs/T10/baseline_default_0/
    python -m costcraft.cli grade --run-dir gdpval/runs/T10/baseline_default_0/
"""
from __future__ import annotations
import json
import os
import sys
import time
from dataclasses import asdict
from pathlib import Path

import click
import yaml

from . import gdpval
from . import workspace as ws
from . import trace_export
from .pricing import usd_for_usage
from .runner import run_openclaw
from .tracecard import build_tracecard
from .guards import static_guard


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SKILLS_DIR = Path(__file__).resolve().parent / "skills"
GDPVAL_RUNS = REPO_ROOT / "gdpval" / "runs"
TRACE_JSONL_DIR = REPO_ROOT / "costcraft" / "_traces"
TASK_MANIFEST = REPO_ROOT / "TASK_MANIFEST.yaml"


def _load_manifest() -> dict:
    return yaml.safe_load(TASK_MANIFEST.read_text())


def _task_id_for_short(short: str) -> str:
    m = _load_manifest()
    for t in m["tasks"]:
        if t["id"] == short:
            return t["task_id"]
    raise KeyError(f"unknown short task id: {short}")


def _compose_prompt(skill_md: str, task_prompt: str, file_names: list[str], work_rel: str) -> str:
    """Compose final prompt.

    `openclaw agent --local` uses `~/.openclaw/workspace/` as its root, regardless
    of subprocess cwd, so we pass an explicit workspace-relative working dir in
    the prompt and require the agent to read from / save into that subdir.
    """
    files_block = "\n".join(f"- {work_rel}/{n}" for n in file_names)
    return (
        "## Skill context (follow this carefully)\n\n"
        f"{skill_md}\n\n"
        "## Working directory\n\n"
        f"All files for this task live under `{work_rel}/` (relative to your workspace root).\n"
        "Read the reference files from that subdirectory and save every deliverable there too.\n"
        "Do NOT save to the workspace root or any other location.\n\n"
        "## Reference files\n\n"
        f"{files_block}\n\n"
        "## Task\n\n"
        f"{task_prompt}"
    )


@click.group()
def main():
    """CostCraft harness CLI."""


@main.command("run-one")
@click.option("--task", required=True, help="Task short id (e.g., T10) or full task_id")
@click.option("--condition", default="baseline_default")
@click.option("--skill-path", type=click.Path(path_type=Path), default=None,
              help="Path to SKILL.md. Defaults to costcraft/skills/default_skill.md")
@click.option("--model", default="openai-codex/gpt-5.4")
@click.option("--thinking", default="medium")
@click.option("--seed", type=int, default=0)
@click.option("--out-dir", type=click.Path(path_type=Path), default=None)
@click.option("--timeout", type=int, default=900)
def run_one(task, condition, skill_path, model, thinking, seed, out_dir, timeout):
    """Run ONE OpenClaw agent task with the given skill, capture trace + deliverable."""
    task_id = task if "-" in task and len(task) > 10 else _task_id_for_short(task)
    short = task if task.startswith("T") else task_id
    t = gdpval.get_task(task_id)
    if not t.reference_files:
        click.echo(f"[ERROR] no reference files resolved for {task_id}", err=True)
        sys.exit(1)

    skill_path = skill_path or (DEFAULT_SKILLS_DIR / "default_skill.md")
    skill_md = Path(skill_path).read_text()

    run_tag = f"{condition}_{seed}"
    out_dir = out_dir or GDPVAL_RUNS
    per_run_out = Path(out_dir) / short / run_tag
    per_run_out.mkdir(parents=True, exist_ok=True)
    TRACE_JSONL_DIR.mkdir(parents=True, exist_ok=True)

    # Prepare isolated workspace inside ~/.openclaw/workspace/
    run_dir = ws.prepare(short, t.reference_files, run_tag=run_tag)
    input_names = {p.name for p in t.reference_files}
    work_rel = ws.relative_for_prompt(run_dir)
    prompt = _compose_prompt(skill_md, t.prompt, sorted(input_names), work_rel)

    click.echo(f"[run] task={short} cond={condition} model={model} work_rel={work_rel}")
    t0 = time.time()
    result = run_openclaw(
        message=prompt,
        workspace_dir=run_dir,
        model=model,
        thinking=thinking,
        timeout_s=timeout,
    )
    dur = time.time() - t0

    # Collect deliverables
    deliverable_dir = per_run_out / "deliverable"
    ws.collect(run_dir, deliverable_dir, ignore_inputs=input_names)

    # Copy OpenClaw session JSONL as the trace source
    session_src = Path.home() / ".openclaw" / "agents" / "main" / "sessions" / f"{result.session_id}.jsonl"
    trace_dest = per_run_out / "trace.jsonl"
    if session_src.exists():
        trace_dest.write_text(session_src.read_text())

    # Save run metadata
    meta = {
        "task_id": task_id,
        "task_short": short,
        "condition": condition,
        "model": model,
        "thinking": thinking,
        "seed": seed,
        "skill_path": str(skill_path),
        "session_id": result.session_id,
        "trace_id": result.trace_id,
        "exit_code": result.exit_code,
        "duration_s": dur,
        "workspace_dir": str(run_dir),
        "final_message_head": result.final_message[:2000],
    }
    (per_run_out / "run_meta.json").write_text(json.dumps(meta, indent=2))
    (per_run_out / "stdout.log").write_text(result.stdout)
    (per_run_out / "stderr.log").write_text(result.stderr)

    # Copy trace JSONL next to run_meta.json for reproducibility
    trace_src = TRACE_JSONL_DIR / f"{result.trace_id}.jsonl"
    if trace_src.exists():
        (per_run_out / "trace.jsonl").write_text(trace_src.read_text())

    click.echo(f"[done] exit={result.exit_code} dur={dur:.1f}s deliverable={deliverable_dir}")


@main.command("build-tracecard")
@click.option("--run-dir", required=True, type=click.Path(path_type=Path, exists=True))
def build_tc(run_dir):
    from .tracecard import build_tracecard_from_session
    run_dir = Path(run_dir)
    meta = json.loads((run_dir / "run_meta.json").read_text())
    trace_path = run_dir / "trace.jsonl"
    if not trace_path.exists():
        click.echo(f"[ERROR] no trace.jsonl in {run_dir}", err=True)
        sys.exit(1)
    records = [json.loads(l) for l in trace_path.read_text().splitlines() if l.strip()]
    # Prefer task_short (GDPval) but fall back to task_id (SpreadsheetBench)
    task_id = meta.get("task_short") or meta.get("task_id") or "unknown"
    card = build_tracecard_from_session(
        task_id=task_id,
        session_records=records,
        final_message=meta.get("final_message_head", ""),
    )
    out = run_dir / "tracecard.yaml"
    out.write_text(yaml.safe_dump(card.to_yaml_friendly(), sort_keys=False, allow_unicode=True, width=120))
    click.echo(f"[tracecard] wrote {out}  cost=${card.total_cost_usd:.4f} tokens={sum(card.total_tokens.values())}")


@main.command("grade")
@click.option("--run-dir", required=True, type=click.Path(path_type=Path, exists=True))
@click.option("--rounds", type=int, default=1, help="Number of judge rounds (majority vote)")
def grade(run_dir, rounds):
    from .grader import grade_deliverable, grade_deliverable_n_times
    run_dir = Path(run_dir)
    meta = json.loads((run_dir / "run_meta.json").read_text())
    t = gdpval.get_task(meta["task_id"])
    if rounds <= 1:
        result = grade_deliverable(
            task_id=meta["task_id"],
            rubric_json=t.rubric_json,
            deliverable_dir=run_dir / "deliverable",
        )
        per_round = None
    else:
        result, per_rounds = grade_deliverable_n_times(
            task_id=meta["task_id"],
            rubric_json=t.rubric_json,
            deliverable_dir=run_dir / "deliverable",
            n_rounds=rounds,
        )
        # Save per-round for analysis
        for i, r in enumerate(per_rounds):
            (run_dir / f"grading_round_{i}.json").write_text(json.dumps({
                "task_id": r.task_id,
                "total_points": r.total_points,
                "max_points": r.max_points,
                "normalized": r.normalized,
                "items": [asdict(it) for it in r.items],
            }, indent=2))
    out = run_dir / "grading.json"
    out.write_text(json.dumps({
        "task_id": result.task_id,
        "total_points": result.total_points,
        "max_points": result.max_points,
        "normalized": result.normalized,
        "rounds": rounds,
        "items": [asdict(i) for i in result.items],
    }, indent=2))
    click.echo(f"[grade] {result.total_points}/{result.max_points}  normalized={result.normalized:.3f}  rounds={rounds} -> {out}")


if __name__ == "__main__":
    main()
