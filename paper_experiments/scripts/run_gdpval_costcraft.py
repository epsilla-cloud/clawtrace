#!/usr/bin/env python3
"""Reproduce the GDPval CostCraft pivot from §4.8 of the paper.

Loads three GDPval tasks as an evolve set (T10, T3, T2), dispatches
CostCraft analysts, merges the resulting patches into an evolved
SKILL.md, and evaluates both the baseline and the evolved skill on a
three-task held-out split (T4, T5, T7). A single LLM-judge grading
pass is used for pivot speed; multi-round majority voting is
available via ``costcraft.cli grade --rounds N``.

All intermediate artifacts land under ``gdpval/v2_pivot/`` (kept
under that directory name to preserve compatibility with existing
result files referenced in the paper).
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
GDPVAL_RUNS = ROOT / "gdpval" / "runs"
SKILLS_DIR = ROOT / "costcraft" / "costcraft" / "skills"
DEFAULT_SKILL = (SKILLS_DIR / "default_skill.md").read_text()
PIVOT_OUT = ROOT / "gdpval" / "v2_pivot"

sys.path.insert(0, str(ROOT / "costcraft"))
from costcraft.parallel_refine import dispatch_analysts, hierarchical_merge, EvolveItem
from costcraft.tracecard import TraceCard
from costcraft.analysts.patch import dump_patches
from costcraft.guards import static_guard


EVOLVE_IDS = ["T10", "T3", "T2"]
TEST_IDS   = ["T4", "T5", "T7"]


def load_tracecard_from_yaml(run_dir: Path) -> TraceCard | None:
    yf = run_dir / "tracecard.yaml"
    if not yf.exists():
        return None
    d = yaml.safe_load(yf.read_text())
    return TraceCard(
        task_id=d["task_id"],
        model=d["model"],
        total_cost_usd=d.get("total_cost_usd", 0.0),
        total_tokens=d.get("total_tokens", {}),
        llm_call_count=d.get("llm_call_count", 0),
        tool_call_count=d.get("tool_call_count", 0),
        top_cost_spans=d.get("top_cost_spans", []),
        redundant_tool_calls=d.get("redundant_tool_calls", []),
        sub_agents=d.get("sub_agents", []),
        failed_or_repaired_steps=d.get("failed_or_repaired_steps", []),
    )


def load_evolve_item(tid: str) -> EvolveItem:
    base = GDPVAL_RUNS / tid / "baseline_default_0"
    tc = load_tracecard_from_yaml(base)
    grading = json.loads((base / "grading.json").read_text()) if (base / "grading.json").exists() else {}
    traj = (base / "trace.jsonl").read_text() if (base / "trace.jsonl").exists() else ""
    # Find instruction from GDPval dataset adapter
    from costcraft import gdpval as gd
    manifest = yaml.safe_load((ROOT / "TASK_MANIFEST.yaml").read_text())
    task_full_id = next(t["task_id"] for t in manifest["tasks"] if t["id"] == tid)
    task = gd.get_task(task_full_id)
    return EvolveItem(
        task_id=tid,
        instruction=task.prompt,
        trajectory_jsonl=traj,
        tracecard=tc,
        baseline_quality=float(grading.get("normalized", 0.0)),
        grading_items=grading.get("items", []),
    )


def run_eval(task_id: str, condition: str, skill_path: Path) -> dict:
    out_dir = PIVOT_OUT / "eval" / task_id / condition
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp_cond = f"tmp_{condition}"
    t0 = time.time()
    subprocess.run([
        PY, "-m", "costcraft.cli", "run-one",
        "--task", task_id, "--condition", tmp_cond,
        "--skill-path", str(skill_path), "--seed", "0",
    ], cwd=ROOT, capture_output=True, text=True, timeout=1200)
    dur = time.time() - t0

    src_run = GDPVAL_RUNS / task_id / f"{tmp_cond}_0"
    subprocess.run([PY, "-m", "costcraft.cli", "build-tracecard", "--run-dir", str(src_run)],
                   cwd=ROOT, capture_output=True, text=True, timeout=60)
    subprocess.run([PY, "-m", "costcraft.cli", "grade", "--run-dir", str(src_run),
                    "--rounds", "1"],
                   cwd=ROOT, capture_output=True, text=True, timeout=300)

    for fname in ("grading.json", "run_meta.json", "tracecard.yaml"):
        src = src_run / fname
        if src.exists():
            (out_dir / fname).write_text(src.read_text())
    if (src_run / "deliverable").exists():
        import shutil
        shutil.copytree(src_run / "deliverable", out_dir / "deliverable", dirs_exist_ok=True)

    gf = out_dir / "grading.json"
    g = json.loads(gf.read_text()) if gf.exists() else {}
    tcf = out_dir / "tracecard.yaml"
    cost = yaml.safe_load(tcf.read_text()).get("total_cost_usd", 0) if tcf.exists() else 0
    return {
        "task_id": task_id, "condition": condition,
        "q": g.get("normalized"), "cost_usd": cost, "duration_s": dur,
    }


def main():
    PIVOT_OUT.mkdir(parents=True, exist_ok=True)
    print(f"[gdpval-pivot] evolve={EVOLVE_IDS}  test={TEST_IDS}")

    print("\n[stage2] loading evolve items")
    items = [load_evolve_item(tid) for tid in EVOLVE_IDS]
    for it in items:
        print(f"  {it.task_id}: baseline_q={it.baseline_quality:.3f} "
              f"trajectory_chars={len(it.trajectory_jsonl)} "
              f"cost_usd={it.tracecard.total_cost_usd:.4f}")

    print("\n[stage2] dispatching analysts — condition=costcraft")
    t0 = time.time()
    patches = dispatch_analysts(items, include_cost_in_tracecard=True, concurrency=3)
    print(f"  {len(patches)} patches produced in {time.time()-t0:.1f}s")
    dump_patches(patches, PIVOT_OUT / "patches_costcraft_v2.json")

    print("\n[stage3] merging → CostCraft skill")
    cc_skill, stats = hierarchical_merge(DEFAULT_SKILL, patches)
    (PIVOT_OUT / "costcraft_v2_skill.md").write_text(cc_skill)
    g = static_guard(cc_skill)
    print(f"  cc skill: {len(cc_skill)} chars  guard_passed={g.passed}  violations={g.violations}")

    print("\n[stage4] running evals (3 held-out tasks × {baseline, CostCraft} = 6 runs)")
    results = []
    default_skill_path = SKILLS_DIR / "default_skill.md"
    for tid in TEST_IDS:
        for cond_name, skill_path in [
            ("baseline", default_skill_path),
            ("costcraft", PIVOT_OUT / "costcraft_v2_skill.md"),
        ]:
            print(f"  {tid}/{cond_name} ...")
            r = run_eval(tid, cond_name, skill_path)
            results.append(r)
            print(f"    Q={r['q']}  cost=${r['cost_usd']:.4f}  dur={r['duration_s']:.1f}s")

    (PIVOT_OUT / "results.json").write_text(json.dumps(results, indent=2))

    print("\n" + "=" * 80)
    print("GDPVAL CostCraft RESULTS (3 test × 2 conditions)")
    print("=" * 80)
    print(f"{'Task':8s}  {'Condition':15s}  {'Quality':>8s}  {'Cost ($)':>10s}")
    print("-" * 80)
    for tid in TEST_IDS:
        for cond in ["baseline", "costcraft"]:
            r = next((r for r in results if r["task_id"] == tid and r["condition"] == cond), {})
            q = r.get("q")
            q_s = f"{q:.3f}" if q is not None else "—"
            c = r.get("cost_usd", 0) or 0
            print(f"{tid:8s}  {cond:15s}  {q_s:>8s}  {c:>10.4f}")
        print("-" * 80)

    from statistics import median
    for cond in ["baseline", "costcraft"]:
        qs = [r["q"] for r in results if r["condition"] == cond and r["q"] is not None]
        cs = [r["cost_usd"] for r in results if r["condition"] == cond and r.get("cost_usd")]
        q_med = median(qs) if qs else 0
        c_med = median(cs) if cs else 0
        print(f"{cond:15s}: median_Q={q_med:.3f}  median_cost=${c_med:.4f}  N={len(qs)}")

    print("\n[gdpval-costcraft] complete. Artifacts in:", PIVOT_OUT)


if __name__ == "__main__":
    main()
