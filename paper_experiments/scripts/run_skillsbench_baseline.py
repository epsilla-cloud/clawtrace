#!/usr/bin/env python3
"""Reproduce the SkillsBench baseline pilot from §4.7 of the paper.

For each of five SkillsBench tasks spanning three domain buckets, this
script runs the OpenClaw agent under the baseline skill, compiles a
TraceCard from the session log, then grades the deliverable inside the
task's Docker verifier. Results are written beneath
``skillsbench/runs/<task>/<condition>_<seed>/`` with the usual layout
(``deliverable/``, ``trace.jsonl``, ``tracecard.yaml``, ``grading.json``,
``run_meta.json``) and a summary JSON at
``skillsbench/runs/_orchestrator_baseline_report.json``.

Usage
-----
    python run_skillsbench_baseline.py
    python run_skillsbench_baseline.py --thinking medium --cooldown 120
    python run_skillsbench_baseline.py --tasks exoplanet-detection-period \
                                       --tasks latex-formula-extraction

Prerequisites: OpenClaw installed with a provider logged in, Docker
running, and the ``costcraft`` package importable (``pip install -e
costcraft`` from the repository root).
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
    ("exoplanet-detection-period", 1200),
    ("econ-detrending-correlation", 1200),
    ("earthquake-plate-calculation", 1500),
    ("latex-formula-extraction", 1500),
    ("financial-modeling-qa", 1500),
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
    record: dict = {"task": task, "timeout_s": timeout}
    wall_start = time.time()

    log(f"=== {task} === run (timeout={timeout}s)", log_path)
    rc = subprocess.run(
        [python, "-m", "costcraft.skbench_cli", "run-one",
         "--task", task, "--condition", condition,
         "--thinking", thinking, "--timeout", str(timeout),
         "--seed", str(seed)],
        cwd=ROOT,
    ).returncode
    record["rc"] = rc

    if rc == 0:
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

    summary: dict = {}
    try:
        meta = json.loads((out_dir / "run_meta.json").read_text())
        summary["duration_s"] = meta.get("duration_s")
        summary["exit_code"] = meta.get("exit_code")
    except FileNotFoundError:
        pass
    summary.update(_read_tracecard(out_dir / "tracecard.yaml"))
    try:
        grading = json.loads((out_dir / "grading.json").read_text())
        summary["reward"] = grading.get("reward_raw")
        summary["passed"] = grading.get("passed")
        summary["normalized"] = grading.get("normalized")
    except FileNotFoundError:
        pass

    record["summary"] = summary
    record["wall_s"] = round(time.time() - wall_start, 1)
    log(f"--- {task} done: {summary} (wall {record['wall_s']}s)", log_path)
    return record


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--thinking", default="low",
                        choices=["off", "minimal", "low", "medium", "high", "xhigh"],
                        help="OpenClaw thinking level (default: low).")
    parser.add_argument("--condition", default="baseline_default",
                        help="Condition label; becomes part of the output folder name.")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--cooldown", type=int, default=90,
                        help="Seconds to sleep between tasks (default: 90).")
    parser.add_argument("--python", default=sys.executable,
                        help="Python interpreter used to invoke the costcraft CLIs.")
    parser.add_argument("--tasks", action="append", default=None, metavar="NAME",
                        help="Run only the named task(s). May be given multiple times. "
                             "Omit to run the five default tasks.")
    parser.add_argument("--log", default=str(RUNS / "_orchestrator_baseline.log"),
                        help="Path to append progress lines to.")
    parser.add_argument("--report", default=str(RUNS / "_orchestrator_baseline_report.json"),
                        help="Path to write the final summary report to.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    log_path = Path(args.log)
    report_path = Path(args.report)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    if args.tasks:
        requested = set(args.tasks)
        tasks = [(name, timeout) for name, timeout in DEFAULT_TASKS if name in requested]
        if not tasks:
            sys.exit(f"No known tasks matched {sorted(requested)}. "
                     f"Known: {[name for name, _ in DEFAULT_TASKS]}")
    else:
        tasks = DEFAULT_TASKS

    results: list[dict] = []
    start = time.time()
    log(f"START — tasks={len(tasks)} thinking={args.thinking} "
        f"cooldown={args.cooldown}s", log_path)

    for i, (task, timeout) in enumerate(tasks):
        results.append(run_task(task, timeout,
                                condition=args.condition,
                                thinking=args.thinking,
                                seed=args.seed,
                                python=args.python,
                                log_path=log_path))
        if i < len(tasks) - 1:
            log(f"cooldown {args.cooldown}s", log_path)
            time.sleep(args.cooldown)

    report = {
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total_wall_s": round(time.time() - start, 1),
        "tasks": results,
    }
    report_path.write_text(json.dumps(report, indent=2))
    log(f"DONE — wrote {report_path} (wall {report['total_wall_s']}s)", log_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
