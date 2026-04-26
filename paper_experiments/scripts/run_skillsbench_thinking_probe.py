#!/usr/bin/env python3
"""Probe the effect of raising the OpenClaw thinking level.

Runs three SkillsBench tasks under the default baseline skill with a
higher thinking budget than the main pilot (``medium`` by default,
rather than ``low``). The paper reports this as evidence that raising
thinking does not lift the per-session action budget — agents spend
the additional reasoning on thinking rather than on the final write.

Usage
-----
    python run_skillsbench_thinking_probe.py
    python run_skillsbench_thinking_probe.py --thinking high

Outputs beneath ``skillsbench/runs/<task>/<condition>_<seed>/`` and a
summary JSON at ``skillsbench/runs/_orchestrator_thinking_report.json``.
"""
from __future__ import annotations
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RUNS = ROOT / "skillsbench" / "runs"

DEFAULT_TASKS = [
    ("exoplanet-detection-period", 1800),
    ("econ-detrending-correlation", 1800),
    ("latex-formula-extraction", 1800),
]


def log(line: str, log_path: Path) -> None:
    stamped = f"[{time.strftime('%H:%M:%S')}] {line}"
    print(stamped, flush=True)
    with open(log_path, "a") as fh:
        fh.write(stamped + "\n")


def _read_tracecard(path: Path) -> dict:
    data: dict = {}
    if not path.exists():
        return data
    for row in path.read_text().splitlines():
        key, _, rest = row.partition(":")
        if key in {"total_cost_usd", "llm_call_count", "tool_call_count"}:
            value = rest.strip()
            try:
                data[key] = float(value) if "." in value else int(value)
            except ValueError:
                pass
    return data


def run_task(task: str, timeout: int, *, condition: str, thinking: str,
             seed: int, python: str, log_path: Path) -> dict:
    out_dir = RUNS / task / f"{condition}_{seed}"
    wall_start = time.time()

    log(f"=== {task} === run (thinking={thinking}, timeout={timeout}s)", log_path)
    subprocess.run(
        [python, "-m", "costcraft.skbench_cli", "run-one",
         "--task", task, "--condition", condition,
         "--thinking", thinking, "--timeout", str(timeout),
         "--seed", str(seed)],
        cwd=ROOT,
    )
    subprocess.run(
        [python, "-m", "costcraft.cli", "build-tracecard",
         "--run-dir", str(out_dir)],
        cwd=ROOT, capture_output=True, text=True,
    )
    log(f"    grading via Docker", log_path)
    subprocess.run(
        [python, "-m", "costcraft.skbench_cli", "grade",
         "--run-dir", str(out_dir)],
        cwd=ROOT,
    )

    summary = _read_tracecard(out_dir / "tracecard.yaml")
    try:
        grading = json.loads((out_dir / "grading.json").read_text())
        summary["reward"] = grading.get("reward_raw")
        summary["passed"] = grading.get("passed")
    except FileNotFoundError:
        pass
    summary["wall_s"] = round(time.time() - wall_start, 1)
    log(f"--- {task} done: {summary}", log_path)
    return summary


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--thinking", default="medium",
                        choices=["off", "minimal", "low", "medium", "high", "xhigh"])
    parser.add_argument("--condition", default="baseline_thinking_probe")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--cooldown", type=int, default=120,
                        help="Higher thinking uses more tokens, so a longer cooldown helps.")
    parser.add_argument("--python", default=sys.executable)
    parser.add_argument("--log", default=str(RUNS / "_orchestrator_thinking.log"))
    parser.add_argument("--report", default=str(RUNS / "_orchestrator_thinking_report.json"))
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    log_path = Path(args.log)
    report_path = Path(args.report)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    results: list[dict] = []
    start = time.time()
    log(f"START — tasks={len(DEFAULT_TASKS)} thinking={args.thinking}", log_path)

    for i, (task, timeout) in enumerate(DEFAULT_TASKS):
        summary = run_task(task, timeout,
                           condition=args.condition,
                           thinking=args.thinking,
                           seed=args.seed,
                           python=args.python,
                           log_path=log_path)
        results.append({"task": task, "summary": summary})
        if i < len(DEFAULT_TASKS) - 1:
            log(f"cooldown {args.cooldown}s", log_path)
            time.sleep(args.cooldown)

    report = {
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "thinking": args.thinking,
        "total_wall_s": round(time.time() - start, 1),
        "tasks": results,
    }
    report_path.write_text(json.dumps(report, indent=2))
    log(f"DONE — wrote {report_path}", log_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
