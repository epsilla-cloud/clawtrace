#!/usr/bin/env python3
"""Run the baseline agent on every task in the SpreadsheetBench manifest.

For each task listed in ``paper_experiments/manifests/spreadsheetbench_tasks.yaml``
(50 stratified tasks from the 200-sample SpreadsheetBench release),
this script runs the OpenClaw agent under the default baseline skill,
grades the deliverable with the deterministic cell-match verifier,
and compiles a TraceCard. Existing successful runs are skipped by
default so the command can be interrupted and resumed.

Usage
-----
    python run_spreadsheetbench_baseline.py
    python run_spreadsheetbench_baseline.py --no-skip-existing
    python run_spreadsheetbench_baseline.py --manifest path/to/other.yaml
"""
from __future__ import annotations
import argparse
import subprocess
import sys
import time
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_MANIFEST = (ROOT / "paper_experiments" / "manifests"
                    / "spreadsheetbench_tasks.yaml")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST,
                        help=f"Task manifest YAML (default: {DEFAULT_MANIFEST}).")
    parser.add_argument("--condition", default="baseline_default",
                        help="Condition label; becomes part of the output folder name.")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--timeout", type=int, default=1200,
                        help="Per-task wall-time limit in seconds.")
    parser.add_argument("--skip-existing", dest="skip_existing",
                        action="store_true", default=True,
                        help="Skip tasks that already have a non-empty deliverable "
                             "(default: on).")
    parser.add_argument("--no-skip-existing", dest="skip_existing",
                        action="store_false",
                        help="Re-run every task even if a deliverable already exists.")
    parser.add_argument("--python", default=sys.executable)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if not args.manifest.exists():
        sys.exit(f"Task manifest not found: {args.manifest}")

    manifest = yaml.safe_load(args.manifest.read_text())
    tasks = manifest["tasks"]

    for task in tasks:
        task_id = task["task_id"]
        out_dir = (ROOT / "spreadsheetbench" / "runs"
                   / task_id / f"{args.condition}_{args.seed}")
        deliverable = out_dir / "deliverable"
        if (args.skip_existing and deliverable.exists()
                and any(deliverable.iterdir())):
            print(f"[skip] {task_id}: deliverable already exists")
            continue

        label = task.get("id") or task_id
        print(f"\n=== SpreadsheetBench / {task_id} ({label}) ===")
        start = time.time()
        result = subprocess.run(
            [args.python, "-m", "costcraft.sb_cli", "run-one",
             "--task-id", task_id,
             "--condition", args.condition,
             "--seed", str(args.seed)],
            cwd=ROOT, capture_output=True, text=True,
            timeout=args.timeout,
        )
        print(f"  rc={result.returncode} dur={time.time() - start:.1f}s")
        if result.returncode != 0:
            print("  stderr:", result.stderr[-300:])

        subprocess.run(
            [args.python, "-m", "costcraft.sb_cli", "grade",
             "--run-dir", str(out_dir)],
            cwd=ROOT, capture_output=True, text=True, timeout=60,
        )
        subprocess.run(
            [args.python, "-m", "costcraft.cli", "build-tracecard",
             "--run-dir", str(out_dir)],
            cwd=ROOT, capture_output=True, text=True, timeout=60,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
