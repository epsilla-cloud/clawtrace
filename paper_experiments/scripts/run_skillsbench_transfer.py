#!/usr/bin/env python3
"""Reproduce the cross-benchmark skill-transfer experiment from §4.7.1.

Runs the same five SkillsBench tasks used by
``run_skillsbench_baseline.py`` under the SpreadsheetBench-trained
CostCraft skill rather than the default baseline skill. The resulting
per-task cost, LLM call count, tool call count, and pytest pass count
can be compared against the baseline run to replicate the paper's
finding that the prune lane of a distilled skill transfers across
benchmarks while the preserve / Workflow lane does not.

The CostCraft skill must exist at the path provided via ``--skill``
(default: ``paper_experiments/skills/costcraft_full.md``).

Usage
-----
    python run_skillsbench_transfer.py
    python run_skillsbench_transfer.py --skill path/to/other/skill.md
    python run_skillsbench_transfer.py --condition costcraft_alt --seed 1

Outputs land under
``skillsbench/runs/<task>/<condition>_<seed>/`` and a summary JSON at
``skillsbench/runs/_orchestrator_transfer_report.json``.
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
DEFAULT_SKILL = ROOT / "paper_experiments" / "skills" / "costcraft_full.md"

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


def run_task(task: str, timeout: int, *, condition: str, skill: Path,
             thinking: str, seed: int, python: str, log_path: Path) -> dict:
    out_dir = RUNS / task / f"{condition}_{seed}"
    record: dict = {"task": task, "timeout_s": timeout}
    wall_start = time.time()

    log(f"=== {task} === run (skill={skill.name}, timeout={timeout}s)", log_path)
    subprocess.run(
        [python, "-m", "costcraft.skbench_cli", "run-one",
         "--task", task, "--condition", condition,
         "--skill-path", str(skill),
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

    summary: dict = {}
    try:
        meta = json.loads((out_dir / "run_meta.json").read_text())
        summary["duration_s"] = meta.get("duration_s")
    except FileNotFoundError:
        pass
    summary.update(_read_tracecard(out_dir / "tracecard.yaml"))
    try:
        grading = json.loads((out_dir / "grading.json").read_text())
        summary["reward"] = grading.get("reward_raw")
        summary["passed"] = grading.get("passed")
    except FileNotFoundError:
        pass

    record["summary"] = summary
    record["wall_s"] = round(time.time() - wall_start, 1)
    log(f"--- {task} done: {summary} (wall {record['wall_s']}s)", log_path)
    return record


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--skill", type=Path, default=DEFAULT_SKILL,
                        help=f"Path to the skill markdown (default: {DEFAULT_SKILL}).")
    parser.add_argument("--thinking", default="low",
                        choices=["off", "minimal", "low", "medium", "high", "xhigh"])
    parser.add_argument("--condition", default="costcraft",
                        help="Condition label; becomes part of the output folder name.")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--cooldown", type=int, default=90)
    parser.add_argument("--python", default=sys.executable)
    parser.add_argument("--tasks", action="append", default=None, metavar="NAME")
    parser.add_argument("--log", default=str(RUNS / "_orchestrator_transfer.log"))
    parser.add_argument("--report", default=str(RUNS / "_orchestrator_transfer_report.json"))
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if not args.skill.exists():
        sys.exit(f"Skill file not found: {args.skill}")

    log_path = Path(args.log)
    report_path = Path(args.report)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    if args.tasks:
        requested = set(args.tasks)
        tasks = [(name, t) for name, t in DEFAULT_TASKS if name in requested]
        if not tasks:
            sys.exit(f"No known tasks matched {sorted(requested)}.")
    else:
        tasks = DEFAULT_TASKS

    results: list[dict] = []
    start = time.time()
    log(f"START — tasks={len(tasks)} skill={args.skill.name} "
        f"thinking={args.thinking}", log_path)

    for i, (task, timeout) in enumerate(tasks):
        results.append(run_task(task, timeout,
                                condition=args.condition,
                                skill=args.skill,
                                thinking=args.thinking,
                                seed=args.seed,
                                python=args.python,
                                log_path=log_path))
        if i < len(tasks) - 1:
            log(f"cooldown {args.cooldown}s", log_path)
            time.sleep(args.cooldown)

    report = {
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "skill": str(args.skill),
        "condition": args.condition,
        "total_wall_s": round(time.time() - start, 1),
        "tasks": results,
    }
    report_path.write_text(json.dumps(report, indent=2))
    log(f"DONE — wrote {report_path}", log_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
