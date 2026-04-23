"""SpreadsheetBench CLI — mirrors the GDPval CLI with the SB adapter + grader.

Subcommands:
  run-one   — run OpenClaw agent on one SB task, capture trace + deliverable
  grade     — deterministic grade (cell / sheet match, no LLM judge)
"""
from __future__ import annotations
import json
import sys
import time
from dataclasses import asdict
from pathlib import Path

import click

from . import spreadsheetbench as sb
from . import workspace as ws
from .runner import run_openclaw


REPO_ROOT = Path(__file__).resolve().parents[2]
SB_RUNS = REPO_ROOT / "spreadsheetbench" / "runs"
SB_SKILLS_DEFAULT = Path(__file__).resolve().parent / "skills" / "default_skill.md"


def _compose_prompt(skill_md: str, task: sb.SBTask, work_rel: str) -> str:
    files_block = "\n".join(f"- {work_rel}/{n}" for n in task.reference_file_names)
    output_name = f"{task.task_id}_output.xlsx"
    ans_hint = ""
    if task.answer_position:
        ans_hint = (
            f"The answer cell or range is: `{task.answer_position}`. "
            "These cells will be checked against a gold answer. "
            "**Write the final evaluated VALUES into these cells (not just Excel formulas).** "
            "If you use a formula to compute the value, also write the computed value into "
            "the answer cell — the grader opens the xlsx in a non-Excel context and cannot "
            "evaluate formulas.\n"
        )
    kind = task.instruction_type
    return (
        "## Skill context (follow this carefully)\n\n"
        f"{skill_md}\n\n"
        "## Working directory\n\n"
        f"All files for this task live under `{work_rel}/` (relative to your workspace root).\n"
        "Read the reference file(s) from that subdirectory and save every deliverable there.\n"
        "Do NOT save to the workspace root.\n\n"
        "## Input spreadsheet\n\n"
        f"{files_block}\n\n"
        "## Instruction\n\n"
        f"{task.instruction}\n\n"
        "## Output requirement\n\n"
        f"- Task type: **{kind}**\n"
        f"- Produce a modified xlsx file and save it as `{work_rel}/{output_name}`.\n"
        f"- Preserve the rest of the workbook unchanged.\n"
        f"{ans_hint}"
    )


@click.group()
def main():
    """CostCraft SpreadsheetBench CLI."""


@main.command("run-one")
@click.option("--task-id", required=True, help="SB task id, e.g. 59196")
@click.option("--condition", default="baseline_default")
@click.option("--skill-path", type=click.Path(path_type=Path), default=None)
@click.option("--model", default="openai-codex/gpt-5.4")
@click.option("--thinking", default="low")
@click.option("--seed", type=int, default=0)
@click.option("--timeout", type=int, default=900)
def run_one(task_id, condition, skill_path, model, thinking, seed, timeout):
    t = sb.get_task(task_id)
    if not t.reference_files:
        click.echo(f"[ERROR] no reference files for SB task {task_id}", err=True)
        sys.exit(1)
    skill_path = skill_path or SB_SKILLS_DEFAULT
    skill_md = Path(skill_path).read_text()

    run_tag = f"{condition}_{seed}"
    per_run_out = SB_RUNS / task_id / run_tag
    per_run_out.mkdir(parents=True, exist_ok=True)

    run_dir = ws.prepare(f"sb-{task_id}", t.reference_files, run_tag=run_tag)
    input_names = {p.name for p in t.reference_files}
    work_rel = ws.relative_for_prompt(run_dir)
    prompt = _compose_prompt(skill_md, t, work_rel)

    click.echo(f"[sb-run] task={task_id} cond={condition} model={model} work_rel={work_rel}")
    t0 = time.time()
    result = run_openclaw(
        message=prompt,
        workspace_dir=run_dir,
        model=model,
        thinking=thinking,
        timeout_s=timeout,
    )
    dur = time.time() - t0

    deliverable_dir = per_run_out / "deliverable"
    ws.collect(run_dir, deliverable_dir, ignore_inputs=input_names)

    # Copy OpenClaw session jsonl
    session_src = Path.home() / ".openclaw" / "agents" / "main" / "sessions" / f"{result.session_id}.jsonl"
    if session_src.exists():
        (per_run_out / "trace.jsonl").write_text(session_src.read_text())

    meta = {
        "benchmark": "spreadsheetbench",
        "task_id": task_id,
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
    click.echo(f"[done] exit={result.exit_code} dur={dur:.1f}s deliverable={deliverable_dir}")


@main.command("grade")
@click.option("--run-dir", required=True, type=click.Path(path_type=Path, exists=True))
def grade(run_dir):
    from .sb_grader import grade as sb_grade
    run_dir = Path(run_dir)
    meta = json.loads((run_dir / "run_meta.json").read_text())
    t = sb.get_task(meta["task_id"])
    result = sb_grade(t, run_dir / "deliverable")
    out = run_dir / "grading.json"
    out.write_text(json.dumps({
        "task_id": result.task_id,
        "passed": result.passed,
        "normalized": result.normalized,
        "cells_checked": result.cells_checked,
        "cells_matched": result.cells_matched,
        "failure_reason": result.failure_reason,
        "items": [asdict(it) for it in result.items[:50]],
    }, indent=2))
    click.echo(f"[sb-grade] {result.cells_matched}/{result.cells_checked}  "
               f"normalized={result.normalized:.3f}  "
               f"passed={result.passed}  -> {out}")


if __name__ == "__main__":
    main()
