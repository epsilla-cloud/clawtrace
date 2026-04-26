# costcraft

Python package that powers the experimental pipeline for the ClawTrace / TraceCard / CostCraft paper. Three benchmark CLIs plus shared infrastructure for running OpenClaw agents, compiling TraceCards, and distilling skills.

## Install

```bash
pip install -e .
```

Requires Python ≥ 3.10. Dependencies are declared in `pyproject.toml`.

## Layout

```
costcraft/
├── __init__.py
├── cli.py                  — GDPval CLI + shared build-tracecard / grade subcommands
├── sb_cli.py               — SpreadsheetBench CLI
├── skbench_cli.py          — SkillsBench CLI
├── runner.py               — openclaw agent --local wrapper with ClawTrace env
├── tracecard.py            — deterministic compiler: session JSONL → TraceCard YAML
├── workspace.py            — per-run staging + collection
├── pricing.py              — provider token pricing (snapshot 2026-04-14)
├── ingest_server.py        — local development ingest endpoint
├── parallel_refine.py      — CostCraft analyst dispatch + hierarchical merge
├── refine.py               — single-fold verify-repair loop used by refine tooling
├── grader.py               — GDPval rubric LLM-judge grader
├── sb_grader.py            — SpreadsheetBench deterministic cell/sheet-match grader
├── guards.py               — static guardrails for merged skills
├── gdpval.py               — GDPval task adapter
├── spreadsheetbench.py     — SpreadsheetBench task adapter
├── verify.py               — single-call verify helper used by refine.py
├── trace_export.py         — helpers to read OpenClaw sessions
├── claude.py               — claude-agent-sdk wrapper (no API key required)
├── analysts/
│   ├── patch.py            — Patch dataclass + JSON (de)serialisation
│   ├── success_analyst.py  — Success Analyst (preserve + optional prune)
│   └── error_analyst.py    — Error Analyst (multi-turn ReAct with grader access)
└── skills/
    ├── default_skill.md    — shipping baseline skill
    └── costcraft_prompt.md — prompt shell used by CostCraft analysts
```

## Running experiments

Direct CLI usage for a single task:

```bash
# SpreadsheetBench
python -m costcraft.sb_cli run-one --task-id 48745 --condition baseline_default
python -m costcraft.sb_cli grade --run-dir spreadsheetbench/runs/48745/baseline_default_0

# SkillsBench
python -m costcraft.skbench_cli run-one --task financial-modeling-qa --condition baseline_default
python -m costcraft.skbench_cli grade --run-dir skillsbench/runs/financial-modeling-qa/baseline_default_0

# GDPval
python -m costcraft.cli run-one --task T10 --condition baseline_default
python -m costcraft.cli grade --run-dir gdpval/runs/T10/baseline_default_0 --rounds 3
python -m costcraft.cli build-tracecard --run-dir gdpval/runs/T10/baseline_default_0
```

Batch orchestrators that reproduce the paper's experiments are in `../paper_experiments/scripts/`; each imports from this package and adds the scheduling, cooldowns, and aggregation needed to run a full sweep.

## Local ingest endpoint

To run ClawTrace against a local endpoint instead of the cloud:

```bash
python -m costcraft.ingest_server --out-dir ./_traces
export CLAWTRACE_ENDPOINT=http://127.0.0.1:9789/v1/traces/events
export CLAWTRACE_OBSERVE_KEY=dev-local
```

The runner writes each session to `~/.openclaw/agents/main/sessions/<session_id>.jsonl`; the ingest server captures the plugin's flushed events to `_traces/<trace_id>.jsonl`.

## Artifact layout (per run)

```
<benchmark>/runs/<task_id>/<condition>_<seed>/
├── deliverable/          — files the agent produced
├── trace.jsonl           — OpenClaw session transcript
├── tracecard.yaml        — compiled TraceCard
├── grading.json          — deterministic or LLM-judged grading output
├── run_meta.json         — invocation metadata (model, thinking, skill path, duration, exit code)
├── stdout.log
└── stderr.log
```

All three benchmark CLIs share this layout so aggregation scripts work uniformly.
