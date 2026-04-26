#!/usr/bin/env python3
"""Run the baseline agent on the six pre-registered GDPval tasks.

For each GDPval task listed in
``paper_experiments/manifests/gdpval_tasks.yaml`` (T2, T3, T4, T5, T7,
T10), this script runs the OpenClaw agent under the default baseline
skill and compiles a TraceCard from the session log. Grading is
deferred to ``run_gdpval_costcraft.py`` or an explicit
``costcraft.cli grade`` invocation because the LLM judge has a
separate cost budget and benefits from multi-round majority voting.

Usage
-----
    python run_gdpval_baseline.py
    python run_gdpval_baseline.py --no-skip-existing
    python run_gdpval_baseline.py --manifest path/to/other.yaml
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
                    / "gdpval_tasks.yaml")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST,
                        help=f"Task manifest YAML (default: {DEFAULT_MANIFEST}).")
    parser.add_argument("--condition", default="baseline_default")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--model", default="openai-codex/gpt-5.4")
    parser.add_argument("--timeout", type=int, default=900)
    parser.add_argument("--skip-existing", dest="skip_existing",
                        action="store_true", default=True)
    parser.add_argument("--no-skip-existing", dest="skip_existing",
                        action="store_false")
    parser.add_argument("--python", default=sys.executable)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if not args.manifest.exists():
        sys.exit(f"Task manifest not found: {args.manifest}")

    manifest = yaml.safe_load(args.manifest.read_text())
    task_ids = [entry["id"] for entry in manifest["tasks"]]

    for task_id in task_ids:
        out_dir = (ROOT / "gdpval" / "runs"
                   / task_id / f"{args.condition}_{args.seed}")
        deliverable = out_dir / "deliverable"
        if (args.skip_existing and deliverable.exists()
                and any(deliverable.iterdir())):
            print(f"[skip] {task_id}: deliverable already exists")
            continue

        print(f"\n=== GDPval / {task_id} ===")
        start = time.time()
        result = subprocess.run(
            [args.python, "-m", "costcraft.cli", "run-one",
             "--task", task_id,
             "--condition", args.condition,
             "--seed", str(args.seed),
             "--model", args.model],
            cwd=ROOT, capture_output=True, text=True,
            timeout=args.timeout,
        )
        print(f"  run rc={result.returncode} dur={time.time() - start:.1f}s")
        if result.returncode != 0:
            print("  stderr:", result.stderr[-500:])
            continue

        tc = subprocess.run(
            [args.python, "-m", "costcraft.cli", "build-tracecard",
             "--run-dir", str(out_dir)],
            cwd=ROOT, capture_output=True, text=True, timeout=60,
        )
        if tc.returncode != 0:
            print("  tracecard failed:", tc.stderr[-400:])
        elif tc.stdout.strip():
            print("  tracecard:", tc.stdout.strip().splitlines()[-1])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
