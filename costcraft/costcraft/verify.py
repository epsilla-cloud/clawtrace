"""Build a `verify_fn` that runs a candidate refined skill on one training task,
compares against the cached baseline, and returns a pass/fail + diagnostic signal.

Usage from the orchestrator:

    from costcraft.verify import make_verify_fn
    verify_fn = make_verify_fn(
        verify_task_short="T10",
        baseline_grading_path=Path(".../T10/baseline_default_0/grading.json"),
        baseline_tracecard_path=Path(".../T10/baseline_default_0/tracecard.yaml"),
        out_dir=Path(".../T2/verify_tmp"),
    )
    result = refine_with_verify(..., verify_fn=verify_fn)
"""
from __future__ import annotations
import asyncio
import json
import shutil
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

import yaml

from . import gdpval, workspace as ws
from .runner import run_openclaw
from .grader import agrade_deliverable


# Quality tolerance: accept if Δq ≥ -ε_q (allows small drop if cost win)
DEFAULT_Q_TOLERANCE = 0.05
# Cost ratio: prefer refined if ratio ≤ 1.0 (i.e. same or cheaper)
DEFAULT_COST_TOLERANCE = 1.10  # allow 10% cost increase if quality gains


@dataclass
class VerifyOutcome:
    passed: bool
    delta_q: float
    delta_cost_ratio: float
    baseline_q: float
    refined_q: float
    baseline_cost: float
    refined_cost: float
    diagnostic: str
    refined_run_dir: Path


def _compose_verify_prompt(skill_md: str, task: gdpval.GdpvalTask, work_rel: str) -> str:
    files_block = "\n".join(f"- {work_rel}/{n}" for n in task.reference_file_names)
    return (
        "## Skill context (follow this carefully)\n\n"
        f"{skill_md}\n\n"
        "## Working directory\n\n"
        f"All files for this task live under `{work_rel}/` (relative to your workspace root).\n"
        "Read the reference files from that subdirectory and save every deliverable there.\n"
        "Do NOT save to the workspace root or any other location.\n\n"
        "## Reference files\n\n"
        f"{files_block}\n\n"
        "## Task\n\n"
        f"{task.prompt}"
    )


def run_candidate_on_task(
    *,
    skill_md: str,
    task_short: str,
    out_dir: Path,
    model: str = "openai-codex/gpt-5.4",
    thinking: str = "low",
    timeout_s: int = 900,
) -> tuple[Path, dict]:
    """Run an agent with the given skill on a training task; return (deliverable_dir, run_meta)."""
    t = gdpval.get_task(_resolve_task_id(task_short))
    out_dir.mkdir(parents=True, exist_ok=True)

    # Isolated workspace
    run_dir = ws.prepare(task_short, t.reference_files,
                         run_tag=f"verify_{out_dir.name}")
    input_names = {p.name for p in t.reference_files}
    work_rel = ws.relative_for_prompt(run_dir)
    prompt = _compose_verify_prompt(skill_md, t, work_rel)

    t0 = time.time()
    result = run_openclaw(
        message=prompt,
        workspace_dir=run_dir,
        model=model,
        thinking=thinking,
        timeout_s=timeout_s,
    )
    dur = time.time() - t0

    deliverable_dir = out_dir / "deliverable"
    ws.collect(run_dir, deliverable_dir, ignore_inputs=input_names)

    # Copy OpenClaw session JSONL
    session_src = (Path.home() / ".openclaw" / "agents" / "main" / "sessions"
                   / f"{result.session_id}.jsonl")
    if session_src.exists():
        (out_dir / "trace.jsonl").write_text(session_src.read_text())

    meta = {
        "task_short": task_short,
        "task_id": t.task_id,
        "session_id": result.session_id,
        "exit_code": result.exit_code,
        "duration_s": dur,
        "final_message_head": result.final_message[:2000],
    }
    (out_dir / "run_meta.json").write_text(json.dumps(meta, indent=2))
    return deliverable_dir, meta


def _resolve_task_id(task_short: str) -> str:
    """Map T10 → full UUID via manifest."""
    manifest = yaml.safe_load(
        (Path(__file__).resolve().parents[2] / "TASK_MANIFEST.yaml").read_text()
    )
    for t in manifest["tasks"]:
        if t["id"] == task_short:
            return t["task_id"]
    raise KeyError(task_short)


def _compute_cost_from_trace(trace_path: Path) -> float:
    """Sum per-call cost from an OpenClaw session JSONL."""
    if not trace_path.exists():
        return 0.0
    total = 0.0
    for line in trace_path.read_text().splitlines():
        if not line.strip():
            continue
        try:
            d = json.loads(line)
        except Exception:
            continue
        if d.get("type") != "message":
            continue
        m = d.get("message") or {}
        usage = m.get("usage") or {}
        cost = (usage.get("cost") or {}).get("total")
        if isinstance(cost, (int, float)):
            total += float(cost)
    return total


def _diagnostic_from_signals(
    *, delta_q: float, delta_cost_ratio: float,
    refined_tracecard: dict | None, baseline_tracecard: dict,
) -> str:
    bits = []
    if delta_q < 0:
        bits.append(f"Quality dropped by {-delta_q:.1%} "
                    "(normalized rubric score). The refined skill produced a worse deliverable.")
    elif delta_q == 0:
        bits.append("Quality is unchanged from the baseline — no improvement.")
    if delta_cost_ratio > 1.1:
        bits.append(f"Cost increased by {(delta_cost_ratio - 1) * 100:.0f}% (ratio={delta_cost_ratio:.2f}).")
    if refined_tracecard:
        rc = refined_tracecard
        bc = baseline_tracecard
        # Compare llm call count, tool calls, redundancy
        dlmm = rc.get("llm_call_count", 0) - bc.get("llm_call_count", 0)
        dtool = rc.get("tool_call_count", 0) - bc.get("tool_call_count", 0)
        if dlmm > 0:
            bits.append(f"The refined run used {dlmm} more LLM turns than the baseline.")
        if dtool > 0:
            bits.append(f"The refined run used {dtool} more tool calls than the baseline.")
        # Note redundancy
        nr = len(rc.get("redundant_tool_calls") or [])
        nb = len(bc.get("redundant_tool_calls") or [])
        if nr > nb:
            bits.append(f"The refined run introduced {nr - nb} new redundant-tool-call cluster(s).")
        # Check for stuck-in-thinking pattern
        refined_final = rc.get("_final_message", "") or ""
        if refined_final.strip().lower() in ("terminated", ""):
            bits.append("The refined run terminated without producing a final text output — possibly "
                        "stuck in a thinking-only loop. The skill should include an explicit "
                        "termination rule like 'never reason for more than 2 consecutive turns without acting'.")
    if not bits:
        bits.append("Metrics did not exceed the acceptance threshold; consider strengthening cost-control instructions.")
    return " ".join(bits)


def make_verify_fn(
    *,
    verify_task_short: str,
    baseline_grading_path: Path,
    baseline_tracecard_path: Path,
    out_dir: Path,
    q_tolerance: float = DEFAULT_Q_TOLERANCE,
    cost_tolerance: float = DEFAULT_COST_TOLERANCE,
    model: str = "openai-codex/gpt-5.4",
    thinking: str = "low",
    timeout_s: int = 900,
) -> Callable[[str], dict]:
    """Return a callable that verifies a candidate refined skill on `verify_task_short`.

    The returned function takes `skill_md: str` and returns a dict with keys:
      passed: bool
      delta_q: float
      delta_cost_ratio: float
      diagnostic: str
    """
    baseline_g = json.loads(baseline_grading_path.read_text())
    baseline_q = float(baseline_g.get("normalized") or 0.0)
    baseline_tc = yaml.safe_load(baseline_tracecard_path.read_text())
    baseline_cost = float(baseline_tc.get("total_cost_usd") or 0.0)

    task = gdpval.get_task(_resolve_task_id(verify_task_short))

    def verify(skill_md: str) -> dict:
        # Run agent with the candidate skill
        run_dir = out_dir / f"v_{int(time.time())}"
        deliverable_dir, meta = run_candidate_on_task(
            skill_md=skill_md,
            task_short=verify_task_short,
            out_dir=run_dir,
            model=model,
            thinking=thinking,
            timeout_s=timeout_s,
        )
        # Compute refined cost from trace
        refined_cost = _compute_cost_from_trace(run_dir / "trace.jsonl")

        # Structural gate: deliverable missing → fail
        files = list(deliverable_dir.iterdir()) if deliverable_dir.exists() else []
        if not files:
            return {
                "passed": False,
                "delta_q": -baseline_q,
                "delta_cost_ratio": (refined_cost / baseline_cost) if baseline_cost > 0 else 99.0,
                "diagnostic": (
                    "The refined skill produced NO deliverable on the verify task "
                    f"({verify_task_short}). The agent likely got stuck in a thinking loop. "
                    "Add an explicit termination rule: 'never reason for more than 2 consecutive "
                    "turns without taking a concrete action; always write the deliverable "
                    "file before ending the session'."
                ),
            }

        # Grade
        refined_grade = asyncio.run(agrade_deliverable(
            task_id=task.task_id,
            rubric_json=task.rubric_json,
            deliverable_dir=deliverable_dir,
        ))
        refined_q = refined_grade.normalized

        delta_q = refined_q - baseline_q
        delta_cost_ratio = (refined_cost / baseline_cost) if baseline_cost > 0 else 1.0

        # ACCEPT rule: Δq ≥ -ε_q AND cost_ratio ≤ cost_tolerance
        passed = (delta_q >= -q_tolerance) and (delta_cost_ratio <= cost_tolerance)

        # Save verify artifact
        (run_dir / "verify_outcome.json").write_text(json.dumps({
            "baseline_q": baseline_q,
            "refined_q": refined_q,
            "delta_q": delta_q,
            "baseline_cost": baseline_cost,
            "refined_cost": refined_cost,
            "delta_cost_ratio": delta_cost_ratio,
            "passed": passed,
        }, indent=2))

        diagnostic = ""
        if not passed:
            diagnostic = _diagnostic_from_signals(
                delta_q=delta_q,
                delta_cost_ratio=delta_cost_ratio,
                refined_tracecard=None,  # keep simple; fetch on demand if needed
                baseline_tracecard=baseline_tc,
            )
        return {
            "passed": passed,
            "delta_q": delta_q,
            "delta_cost_ratio": delta_cost_ratio,
            "diagnostic": diagnostic or "accepted",
        }

    return verify
