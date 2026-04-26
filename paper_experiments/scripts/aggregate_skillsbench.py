#!/usr/bin/env python3
"""Summarise SkillsBench run directories into a per-task and per-domain table.

Walks every ``skillsbench/runs/<task>/<condition>_<seed>/`` directory
that exists for the given condition, reads cost and call counts from
the compiled TraceCard and reward from ``grading.json``, and prints:

* a per-task human-readable summary,
* a LaTeX-ready block of table rows grouped by domain bucket, and
* a JSON file at ``skillsbench/runs/_aggregate_<condition>.json`` for
  downstream tooling.

Usage
-----
    python aggregate_skillsbench.py
    python aggregate_skillsbench.py --condition costcraft --seed 0
    python aggregate_skillsbench.py --runs-root /alt/path/to/skillsbench/runs
"""
from __future__ import annotations
import argparse
import json
import pathlib
import re
import statistics
import sys


DOMAIN_BUCKETS = {
    "data / finance": [
        "financial-modeling-qa",
        "econ-detrending-correlation",
    ],
    "science": [
        "exoplanet-detection-period",
        "earthquake-plate-calculation",
    ],
    "research / data-eng": [
        "latex-formula-extraction",
    ],
}


def parse_tracecard(path: pathlib.Path) -> dict:
    """Extract total_cost_usd / llm_call_count / tool_call_count from YAML."""
    fields: dict = {}
    if not path.exists():
        return fields
    for row in path.read_text().splitlines():
        m = re.match(r"^(total_cost_usd|llm_call_count|tool_call_count):\s*(.+)$", row)
        if not m:
            continue
        key, value = m.group(1), m.group(2).strip()
        try:
            fields[key] = float(value) if "." in value else int(value)
        except ValueError:
            pass
    return fields


def pull(runs_root: pathlib.Path, task: str, condition: str, seed: int) -> dict:
    folder = runs_root / task / f"{condition}_{seed}"
    if not folder.exists():
        return {"task": task, "status": "missing"}

    record: dict = {"task": task, "status": "ok"}
    try:
        meta = json.loads((folder / "run_meta.json").read_text())
        record["duration_s"] = meta.get("duration_s")
        record["exit_code"] = meta.get("exit_code")
    except FileNotFoundError:
        record["status"] = "no_meta"

    tc = parse_tracecard(folder / "tracecard.yaml")
    record.update({
        "cost_usd": tc.get("total_cost_usd"),
        "llm_calls": tc.get("llm_call_count"),
        "tool_calls": tc.get("tool_call_count"),
        "tracecard_ok": bool(tc),
    })

    try:
        grading = json.loads((folder / "grading.json").read_text())
        record["reward"] = grading.get("reward_raw")
        record["passed"] = grading.get("passed", False)
    except FileNotFoundError:
        record["reward"] = None
        record["passed"] = False

    return record


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    default_runs = pathlib.Path(__file__).resolve().parents[2] / "skillsbench" / "runs"
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--condition", default="baseline_default",
                        help="Condition prefix (folder name before seed).")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--runs-root", type=pathlib.Path, default=default_runs,
                        help=f"Root of SkillsBench runs (default: {default_runs}).")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    per_task: list[dict] = []
    for bucket, tasks in DOMAIN_BUCKETS.items():
        for task in tasks:
            record = pull(args.runs_root, task, args.condition, args.seed)
            record["bucket"] = bucket
            per_task.append(record)

    # Per-domain aggregate
    tex_rows: list[str] = []
    overall = {"run": 0, "passed": 0, "tc_ok": 0, "costs": []}
    for bucket in DOMAIN_BUCKETS:
        rows = [r for r in per_task if r["bucket"] == bucket]
        n = sum(1 for r in rows if r["status"] == "ok")
        passed = sum(1 for r in rows if r.get("passed"))
        tc_ok = sum(1 for r in rows if r.get("tracecard_ok"))
        costs = [r["cost_usd"] for r in rows if r.get("cost_usd") is not None]
        median_cost = f"{statistics.median(costs):.3f}" if costs else "—"
        tex_rows.append(
            f"{bucket:<20s} & {n} & {passed} & {median_cost} & {tc_ok}/{n} \\\\"
        )
        overall["run"] += n
        overall["passed"] += passed
        overall["tc_ok"] += tc_ok
        overall["costs"].extend(costs)

    print("=" * 72)
    print(f"PER-TASK RESULTS (condition={args.condition}_{args.seed})")
    print("=" * 72)
    for r in per_task:
        print(
            f"  {r['task']:<36s}  bucket={r['bucket']:<20s}  "
            f"status={r['status']:<8s}  reward={str(r.get('reward'))[:8]:<8s}  "
            f"cost={str(r.get('cost_usd'))[:8]:<8s}  "
            f"llm={str(r.get('llm_calls'))[:4]:<4s}  "
            f"tool={str(r.get('tool_calls'))[:4]:<4s}  "
            f"tc={r.get('tracecard_ok')}"
        )

    print()
    print("=" * 72)
    print("LATEX TABLE ROWS")
    print("=" * 72)
    for row in tex_rows:
        print(row)
    print("\\midrule")
    total_n = overall["run"]
    total_pass = overall["passed"]
    total_tc = overall["tc_ok"]
    total_median = (f"{statistics.median(overall['costs']):.3f}"
                    if overall["costs"] else "—")
    print(
        f"\\textbf{{Total}}      & {total_n} & {total_pass} & "
        f"{total_median} & {total_tc}/{total_n} \\\\"
    )

    out_path = args.runs_root / f"_aggregate_{args.condition}_{args.seed}.json"
    out_path.write_text(json.dumps({
        "condition": f"{args.condition}_{args.seed}",
        "per_task": per_task,
        "buckets": {b: [r for r in per_task if r["bucket"] == b]
                    for b in DOMAIN_BUCKETS},
        "overall": {
            "run": total_n,
            "passed": total_pass,
            "tracecard_ok": total_tc,
            "median_cost_usd": (statistics.median(overall["costs"])
                                if overall["costs"] else None),
            "mean_cost_usd": (statistics.mean(overall["costs"])
                              if overall["costs"] else None),
        },
    }, indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
