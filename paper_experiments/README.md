# Reproduction bundle

This directory contains everything needed to reproduce the empirical results. Layout:

```
paper_experiments/
├── README.md            — this file
├── setup.sh             — one-command bootstrap (see §Quickstart)
├── scripts/             — reproduction entry points, one per paper section
├── skills/              — the evolved SKILL.md artifacts used by the experiments
└── manifests/           — task splits and manifests
```

The `costcraft/` directory at the repository root holds the shared Python package that every script imports. It must also be on the same branch.

## Prerequisites

- Python ≥ 3.10
- [OpenClaw](https://openclaw.ai/) CLI with at least one model provider logged in
- Docker (SkillsBench grading runs the task's verifier inside a container)
- Git ≥ 2.30 (used by `setup.sh` to clone the SkillsBench corpus)

## Quickstart

```bash
# From the repository root, on the paper-reproducibility branch:
bash paper_experiments/setup.sh
```

`setup.sh` checks prerequisites, runs `pip install -e costcraft`, creates the output directories, and clones the SkillsBench corpus. SpreadsheetBench and GDPval are licensed/distributed separately; `setup.sh` prints the canonical sources and the on-disk paths each script expects.

Every script in `scripts/` then runs as a normal Python entry point:

```bash
python paper_experiments/scripts/run_skillsbench_baseline.py --help
```

## Map from paper section to reproduction script

| Paper | Script | Approx. wall | Approx. cost |
|-------|--------|--------------|--------------|
| §4.2 — SpreadsheetBench baseline pool | `scripts/run_spreadsheetbench_baseline.py` | 2 h | $5 |
| §4.2 — SpreadsheetBench CostCraft evolve + held-out eval | `scripts/run_spreadsheetbench_costcraft.py` | 3 h | $10 |
| §4.7 — SkillsBench real-agent pilot | `scripts/run_skillsbench_baseline.py` | 40 min | $0.40 |
| §4.7.1 — Cross-benchmark skill transfer | `scripts/run_skillsbench_transfer.py` | 45 min | $0.30 |
| §4.7 — Thinking-level probe (supporting) | `scripts/run_skillsbench_thinking_probe.py` | 25 min | $0.10 |
| §4.8 — GDPval baseline | `scripts/run_gdpval_baseline.py` | 20 min | $0.50 |
| §4.8 — GDPval CostCraft + ablations | `scripts/run_gdpval_costcraft.py` | 30 min | $1.50 |
| §4.9 — Tracing overhead microbench | `scripts/benchmark_tracing_overhead.py` | 1 min | free |
| Summary tables | `scripts/aggregate_skillsbench.py` | seconds | free |

Each script writes per-run artifacts (`deliverable/`, `trace.jsonl`, `tracecard.yaml`, `grading.json`, `run_meta.json`) under `<benchmark>/runs/<task>/<condition>_<seed>/` and an orchestrator summary JSON at `<benchmark>/runs/_orchestrator_<condition>_report.json`.

## Evolved skills

| File | Role |
|------|------|
| `skills/baseline_default.md` | Default baseline skill; shipped with the paper's experiments |
| `skills/costcraft_full.md` | The Full CostCraft skill — CostCraft evolved on 10 SpreadsheetBench tasks with every lane (preserve / prune / repair) merged |
| `skills/costcraft_no_cost_attribution.md` | Ablation: cost fields stripped from the TraceCards the analysts see |
| `skills/costcraft_no_prune.md` | Ablation: prune patches discarded at merge |
| `skills/costcraft_no_counterfactual.md` | Ablation: prune patches admitted without the counterfactual requirement |

The Cost-control section of each CostCraft skill contains the prune rules and is the lane that transfers across benchmarks (paper §4.7.1). The Workflow and Artifact-checklist sections contain SpreadsheetBench-specific correctness patterns and do not transfer; they are the root cause of the preserve-lane regression reported on SkillsBench.

## Manifests

| File | Contents |
|------|----------|
| `manifests/spreadsheetbench_tasks.yaml` | 50-task stratified sample from SpreadsheetBench sample-200 |
| `manifests/sb_split_10_30.json` | Pre-registered 10 evolve / 30 held-out split |
| `manifests/gdpval_tasks.yaml` | Six GDPval tasks used in §4.8 (T2, T3, T4, T5, T7, T10) |

## Key numbers to cross-check

| Benchmark | Result | Paper section |
|-----------|--------|---------------|
| SpreadsheetBench | Full CostCraft: 4 quality regressions / 30; No-prune: 13; No-cost-attribution: 6 | §4.2 F1 + F2 |
| SpreadsheetBench | Success-to-success cost uplift: +22% (Full) vs +49% (No-cost) | §4.2 F1 |
| SpreadsheetBench | Prune-match rate: 2/17 success-to-success held-out | §4.4 |
| SkillsBench | 0/5 reward=1, TraceCard captured 5/5, median cost $0.087 | §4.7 |
| SkillsBench | Median cost −38% under the SB-trained CostCraft skill | §4.7.1 |
| SkillsBench | Preserve-lane regression: pytest pass count drops 5→1 on latex-formula, 3→1 on financial-modeling-qa | §4.7.1 |
| GDPval | CostCraft: median cost −64%, mean tool calls −62% | §4.8 |
| GDPval | Judge returns Q=0 on 22/24 runs (judge-bounded regime) | §4.8 |
| Tracing | ≈0.30% of agent wall time; 0/10 rubric divergences ON vs OFF | §4.9 |

## Supplementary tasks for collaborators

Three small additions that would strengthen the GDPval-related claims:

1. **Judge-variance quantification.** Re-run `costcraft.cli grade --rounds 5` on each of the existing 24 GDPval deliverables. Produces a per-(task, skill) variance / Cohen's κ table that quantifies "Q=0 on 22/24 is judge noise, not failure". Zero new agent runs.
2. **Scale baseline N from 6 to 16.** Add 10 more GDPval baseline tasks (`run_gdpval_baseline.py --manifest your_new_manifest.yaml`). Tightens the −64% median cost claim.
3. **TraceCard heuristic audit on GDPval.** Read the existing `tracecard.yaml` files in `gdpval/runs/*/baseline_default_0/` and tabulate `redundant_tool_calls` cluster precision (mirrors the SpreadsheetBench audit in §3.2). Pure file reading.

## How the code is organised

The scripts in this directory are thin orchestrators that each call into one of three CLIs in the `costcraft` package:

- `costcraft.sb_cli` — SpreadsheetBench: `run-one`, `grade`
- `costcraft.skbench_cli` — SkillsBench: `run-one`, `grade`
- `costcraft.cli` — GDPval + shared utilities: `run-one`, `grade`, `build-tracecard`

Core shared modules:

- `costcraft.runner` — OpenClaw `agent --local` invocation with ClawTrace env vars
- `costcraft.tracecard` — deterministic compiler from session JSONL to TraceCard YAML
- `costcraft.parallel_refine` — CostCraft analyst dispatch and hierarchical merge
- `costcraft.workspace` — isolated staging + collection for each run

All three CLIs share the same per-run artifact layout, so the aggregation scripts work uniformly across benchmarks.
