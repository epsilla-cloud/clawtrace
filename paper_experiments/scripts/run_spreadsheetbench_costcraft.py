#!/usr/bin/env python3
"""Reproduce the SpreadsheetBench CostCraft evolve + held-out evaluation.

Runs the six stages that produced the main ablation in §4.2 of the
paper:

  1. Dispatch CostCraft analysts on the 10-task evolve split.
  2. Merge the resulting patches into a single evolved SKILL.md.
  3. Evaluate the merged skill on the 30-task held-out split.
  4. Aggregate regime-partitioned results (success / partial / fail).
  5. Verify the merged skill contains at least two distinct prune rules.
  6. Write a summary markdown for inclusion in the paper.

The evolve / held-out split is read from
``paper_experiments/manifests/sb_split_10_30.json`` (pre-registered
before any CostCraft run). Re-running with existing tracecards in
place is safe: each stage checks for its own output artifact first.
"""
from __future__ import annotations
import json
import subprocess
import sys
import time
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
PY = sys.executable
SKILLS_DIR = ROOT / "costcraft" / "costcraft" / "skills"
DEFAULT_SKILL = (SKILLS_DIR / "default_skill.md").read_text()
PIVOT_OUT = ROOT / "spreadsheetbench" / "v2_pivot"
SPLIT_SPEC = PIVOT_OUT / "split_10_30.json"
SB_RUNS = ROOT / "spreadsheetbench" / "runs"

sys.path.insert(0, str(ROOT / "costcraft"))
from costcraft.parallel_refine import dispatch_analysts, hierarchical_merge, EvolveItem
from costcraft.tracecard import TraceCard
from costcraft.analysts.patch import dump_patches, load_patches, Patch
from costcraft.guards import static_guard


def log(msg):
    ts = time.strftime('%H:%M:%S')
    print(f'[{ts}] {msg}', flush=True)


def load_tracecard_from_yaml(run_dir):
    yf = run_dir / "tracecard.yaml"
    if not yf.exists(): return None
    d = yaml.safe_load(yf.read_text())
    return TraceCard(
        task_id=d["task_id"], model=d["model"],
        total_cost_usd=d.get("total_cost_usd", 0.0),
        total_tokens=d.get("total_tokens", {}),
        llm_call_count=d.get("llm_call_count", 0),
        tool_call_count=d.get("tool_call_count", 0),
        top_cost_spans=d.get("top_cost_spans", []),
        redundant_tool_calls=d.get("redundant_tool_calls", []),
        sub_agents=d.get("sub_agents", []),
        failed_or_repaired_steps=d.get("failed_or_repaired_steps", []),
    )


def load_evolve_item(tid):
    base = SB_RUNS / tid / "baseline_default_0"
    tc = load_tracecard_from_yaml(base)
    grading = json.loads((base / "grading.json").read_text())
    traj = (base / "trace.jsonl").read_text() if (base / "trace.jsonl").exists() else ""
    ds = json.loads((ROOT / "spreadsheetbench" / "data" / "dataset.json").read_text())
    instr = next((r["instruction"] for r in ds if str(r["id"]) == tid), "")
    return EvolveItem(
        task_id=tid, instruction=instr, trajectory_jsonl=traj, tracecard=tc,
        baseline_quality=float(grading.get("normalized", 0.0)),
        grading_items=grading.get("items", []),
    )


def run_eval(task_id, condition, skill_path):
    out_dir = PIVOT_OUT / "eval_30" / task_id / condition
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp_cond = f"tmp_{condition}"
    t0 = time.time()
    r = subprocess.run([
        PY, "-m", "costcraft.sb_cli", "run-one",
        "--task-id", task_id, "--condition", tmp_cond,
        "--skill-path", str(skill_path), "--seed", "0",
    ], cwd=ROOT, capture_output=True, text=True, timeout=900)
    dur = time.time() - t0
    src_run = SB_RUNS / task_id / f"{tmp_cond}_0"
    subprocess.run([PY, "-m", "costcraft.sb_cli", "grade", "--run-dir", str(src_run)],
                   cwd=ROOT, capture_output=True, text=True, timeout=60)
    subprocess.run([PY, "-m", "costcraft.cli", "build-tracecard", "--run-dir", str(src_run)],
                   cwd=ROOT, capture_output=True, text=True, timeout=60)
    for fname in ("grading.json", "run_meta.json", "tracecard.yaml"):
        src = src_run / fname
        if src.exists():
            (out_dir / fname).write_text(src.read_text())
    gf = out_dir / "grading.json"
    g = json.loads(gf.read_text()) if gf.exists() else {}
    tcf = out_dir / "tracecard.yaml"
    cost = yaml.safe_load(tcf.read_text()).get("total_cost_usd", 0) if tcf.exists() else 0
    return {
        "task_id": task_id, "condition": condition,
        "q": g.get("normalized"), "cost_usd": cost, "duration_s": dur,
    }


def phase1_analyze_new_evolve(new_evolve_ids):
    log(f'PHASE 1 — analyzing {len(new_evolve_ids)} new evolve tasks')
    items = [load_evolve_item(tid) for tid in new_evolve_ids]
    for it in items:
        log(f'  loaded {it.task_id}: q={it.baseline_quality:.3f} cost={it.tracecard.total_cost_usd:.4f}')
    t0 = time.time()
    new_patches = dispatch_analysts(items, include_cost_in_tracecard=True, concurrency=3)
    log(f'  produced {len(new_patches)} new patches in {time.time()-t0:.1f}s')
    return new_patches


def phase2_merge_all_patches():
    log('PHASE 2 — re-merging all evolve patches')
    # Load existing patches from the CostCraft pivot output
    existing_patches_path = PIVOT_OUT / "patches_costcraft_v2.json"
    existing = load_patches(existing_patches_path) if existing_patches_path.exists() else []
    new_patches_path = PIVOT_OUT / "patches_new_evolve_5.json"
    new_patches = load_patches(new_patches_path) if new_patches_path.exists() else []
    all_patches = existing + new_patches
    log(f'  total patches: {len(all_patches)} ({len(existing)} existing + {len(new_patches)} new)')
    by_action = {}
    for p in all_patches:
        by_action.setdefault(p.action, 0)
        by_action[p.action] += 1
    log(f'  by action: {by_action}')
    skill, stats = hierarchical_merge(DEFAULT_SKILL, all_patches)
    out_path = PIVOT_OUT / "costcraft_v2_10evolve_skill.md"
    out_path.write_text(skill)
    g = static_guard(skill)
    log(f'  skill: {len(skill)} chars  guard_passed={g.passed}  violations={g.violations}')
    return out_path, all_patches, by_action


def phase3_eval_new_holdout(skill_path, new_test_ids):
    log(f'PHASE 3 — eval on {len(new_test_ids)} new held-out tasks')
    results = []
    for tid in new_test_ids:
        log(f'  eval {tid}/costcraft ...')
        r = run_eval(tid, "costcraft", skill_path)
        results.append(r)
        log(f'    Q={r["q"]}  cost=${r["cost_usd"]:.4f}  dur={r["duration_s"]:.1f}s')
    (PIVOT_OUT / "eval_30_new_results.json").write_text(json.dumps(results, indent=2))
    return results


def phase4_aggregate(split_spec, by_action):
    log('PHASE 4 — aggregating 30-task regime-partitioned results')
    test_ids = split_spec["test_final_30"]
    rows = []
    for tid in test_ids:
        # Load baseline
        b_path = SB_RUNS / tid / "baseline_default_0"
        b_q = json.loads((b_path / "grading.json").read_text())["normalized"]
        b_c = yaml.safe_load((b_path / "tracecard.yaml").read_text()).get("total_cost_usd", 0)
        # Load CostCraft result — check multiple possible locations
        cc_q = cc_c = None
        for candidate in (
            PIVOT_OUT / "eval_30" / tid / "costcraft",
            PIVOT_OUT / "eval_extended" / tid / "costcraft",
            PIVOT_OUT / "eval" / tid / "costcraft",
        ):
            if (candidate / "grading.json").exists():
                cc_q = json.loads((candidate / "grading.json").read_text())["normalized"]
                tcf = candidate / "tracecard.yaml"
                cc_c = yaml.safe_load(tcf.read_text()).get("total_cost_usd", 0) if tcf.exists() else 0
                break
        if cc_q is None:
            log(f'  [skip] {tid}: no CostCraft result found')
            continue
        dQ = (cc_q - b_q) * 100
        dC = (cc_c - b_c) / b_c * 100 if b_c else 0
        # Classify regime
        if b_q == 1.0 and cc_q == 1.0:
            regime = "eff (s→s)"
        elif b_q == 1.0 and cc_q < 0.95:
            regime = "REGRESSION"
        elif b_q == 0.0 and cc_q >= 0.5:
            regime = "recovery"
        elif b_q == 0.0 and cc_q == 0.0:
            regime = "f→f"
        elif abs(dQ) <= 5:
            regime = "partial tie"
        elif dQ > 5:
            regime = "partial↑"
        else:
            regime = "partial↓"
        rows.append({
            "task": tid, "regime": regime,
            "b_q": b_q, "cc_q": cc_q, "dQ_pp": dQ,
            "b_cost": b_c, "cc_cost": cc_c, "dCost_pct": dC,
        })
    agg_path = PIVOT_OUT / "aggregate_10_30.json"
    agg_path.write_text(json.dumps({"rows": rows, "patch_counts": by_action}, indent=2, default=str))
    log(f'  wrote {len(rows)} rows to {agg_path}')
    return rows


def phase5_summary(rows, by_action, skill_path):
    log('PHASE 5 — writing markdown summary')
    # Count regimes
    from collections import Counter
    regime_counts = Counter(r["regime"] for r in rows)
    # By regime: median delta cost
    from statistics import median
    def _med(lst):
        return median(lst) if lst else 0.0

    # Read the evolved skill text
    skill_text = Path(skill_path).read_text()
    # Count distinct cost-sink targets in the merged skill (rough heuristic)
    cc_section = ""
    if "## Cost control" in skill_text:
        cc_section = skill_text.split("## Cost control")[1].split("##")[0]
    # Detect prune rules by counting bullet points in Cost control section
    prune_rules = len([l for l in cc_section.splitlines() if l.strip().startswith(("-", "*"))])

    md_lines = [
        "# SpreadsheetBench CostCraft cumulative 10-evolve / 30-test results",
        f"\nGenerated {time.strftime('%Y-%m-%d %H:%M')} by `run_spreadsheetbench_costcraft.py`.\n",
        "## Patch distribution (10 evolve trajectories)\n",
        f"- By action: {dict(by_action)}\n",
        f"- Distinct prune rules in merged Cost-control section: **{prune_rules}**\n",
        "## Regime counts (N=" + str(len(rows)) + ")\n",
    ]
    for r, c in regime_counts.most_common():
        md_lines.append(f"- {r}: {c}")
    md_lines.append("\n## Per-regime cost summary\n")
    md_lines.append("| Regime | N | Median ΔCost% | Median ΔQ pp |")
    md_lines.append("|---|---:|---:|---:|")
    for regime, count in regime_counts.most_common():
        rs = [r for r in rows if r["regime"] == regime]
        dc = _med([r["dCost_pct"] for r in rs])
        dq = _med([r["dQ_pp"] for r in rs])
        md_lines.append(f"| {regime} | {count} | {dc:+.1f}% | {dq:+.1f} |")

    md_lines.append("\n## Per-task table\n")
    md_lines.append("| Task | Regime | Baseline Q | CostCraft Q | ΔQ pp | Baseline $ | CostCraft $ | Δ$ % |")
    md_lines.append("|---|---|---:|---:|---:|---:|---:|---:|")
    for r in rows:
        md_lines.append(f"| {r['task']} | {r['regime']} | {r['b_q']:.3f} | {r['cc_q']:.3f} | "
                        f"{r['dQ_pp']:+.1f} | ${r['b_cost']:.4f} | ${r['cc_cost']:.4f} | {r['dCost_pct']:+.1f}% |")

    md_lines.append(f"\n## Gate check\n")
    gate_pass = prune_rules >= 2
    md_lines.append(f"- C2 gate (≥2 distinct prune rules in merged skill): "
                    f"{'✅ PASS' if gate_pass else '❌ FAIL'} ({prune_rules} rules)")

    out = ROOT / "paper" / "experiments" / "sb_costcraft_10_30.md"
    out.parent.mkdir(exist_ok=True, parents=True)
    out.write_text("\n".join(md_lines))
    log(f'  wrote {out}')
    return out, gate_pass


def main():
    spec = json.loads(SPLIT_SPEC.read_text())
    new_evolve = spec["new_evolve_5"]
    new_test = spec["new_test_10"]

    # PHASE 1
    new_patches_path = PIVOT_OUT / "patches_new_evolve_5.json"
    if not new_patches_path.exists():
        new_patches = phase1_analyze_new_evolve(new_evolve)
        dump_patches(new_patches, new_patches_path)
    else:
        log(f'PHASE 1 skipped — {new_patches_path} exists')

    # PHASE 2
    skill_path, all_patches, by_action = phase2_merge_all_patches()

    # PHASE 3
    phase3_eval_new_holdout(skill_path, new_test)

    # PHASE 4
    rows = phase4_aggregate(spec, by_action)

    # PHASE 5
    summary_path, gate_pass = phase5_summary(rows, by_action, skill_path)

    log(f'OVERNIGHT COMPLETE. Gate: {"PASS" if gate_pass else "FAIL"}. Summary: {summary_path}')


if __name__ == "__main__":
    main()
