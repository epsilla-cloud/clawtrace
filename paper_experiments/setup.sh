#!/usr/bin/env bash
#
# One-command setup for the ClawTrace paper reproduction bundle.
#
# Verifies prerequisites, installs the costcraft package in editable
# mode, downloads the three benchmark datasets, and creates the
# output directories the scripts expect.
#
# Idempotent: re-running skips anything already in place.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

info()  { printf '\033[1;34m[setup]\033[0m %s\n' "$*"; }
ok()    { printf '\033[1;32m[ok]\033[0m    %s\n' "$*"; }
warn()  { printf '\033[1;33m[warn]\033[0m  %s\n' "$*"; }
fatal() { printf '\033[1;31m[fatal]\033[0m %s\n' "$*" >&2; exit 1; }

# -----------------------------------------------------------------------------
# 1. Prerequisites
# -----------------------------------------------------------------------------

info "checking prerequisites"

command -v python3 >/dev/null || fatal "python3 not on PATH"
py_ver=$(python3 -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")')
case "$py_ver" in
    3.1[0-9]) ok "python $py_ver" ;;
    *)        fatal "need Python >=3.10 (have $py_ver)" ;;
esac

command -v openclaw >/dev/null || fatal \
    "openclaw not on PATH. Install from https://openclaw.ai/install."
ok "openclaw $(openclaw --version 2>&1 | head -1)"

command -v docker >/dev/null || warn \
    "docker not found — SkillsBench grading requires Docker."
if command -v docker >/dev/null; then
    docker info >/dev/null 2>&1 \
        || warn "docker installed but daemon not reachable; start Docker Desktop or dockerd."
    ok "docker $(docker --version)"
fi

command -v git >/dev/null || fatal "git not on PATH"
ok "git $(git --version | awk '{print $3}')"

# -----------------------------------------------------------------------------
# 2. Install the costcraft Python package (editable)
# -----------------------------------------------------------------------------

info "installing the costcraft package in editable mode"
if [ ! -d costcraft ]; then
    fatal "costcraft/ directory not found at repo root — are you on the right branch?"
fi
python3 -m pip install -e ./costcraft >/dev/null || fatal "pip install -e ./costcraft failed"
ok "costcraft installed"

# -----------------------------------------------------------------------------
# 3. Fetch SpreadsheetBench data
# -----------------------------------------------------------------------------

info "setting up SpreadsheetBench"
mkdir -p spreadsheetbench/{data,runs}
if [ ! -f spreadsheetbench/data/dataset.json ]; then
    if command -v git >/dev/null && command -v git-lfs >/dev/null; then
        warn "SpreadsheetBench dataset.json not present."
        warn "Upstream is https://github.com/RUCKBReasoning/SpreadsheetBench."
        warn "Drop dataset.json + reference files into spreadsheetbench/data/ before running the scripts."
    else
        warn "SpreadsheetBench not yet populated (no dataset.json)."
        warn "See https://github.com/RUCKBReasoning/SpreadsheetBench for the dataset."
    fi
else
    ok "SpreadsheetBench dataset.json present"
fi

# -----------------------------------------------------------------------------
# 4. Fetch SkillsBench
# -----------------------------------------------------------------------------

info "setting up SkillsBench"
mkdir -p skillsbench/runs
if [ ! -d skillsbench/repo ]; then
    info "cloning SkillsBench from Hugging Face"
    # The canonical SkillsBench repo ships tasks in repo/tasks/<name>/{environment,solution,tests}.
    # Adjust the URL below if you are mirroring to a different host.
    git clone --depth=1 https://huggingface.co/datasets/Anthropic/SkillsBench skillsbench/repo \
        || warn "git clone failed — see https://huggingface.co/datasets/Anthropic/SkillsBench and place the clone at skillsbench/repo/."
fi
if [ -d skillsbench/repo/tasks ]; then
    ok "SkillsBench tasks: $(ls skillsbench/repo/tasks | wc -l | tr -d ' ')"
fi

# -----------------------------------------------------------------------------
# 5. Fetch GDPval
# -----------------------------------------------------------------------------

info "setting up GDPval"
mkdir -p gdpval/{data,runs}
if [ ! -f gdpval/data/dataset.json ]; then
    warn "GDPval dataset.json not present."
    warn "GDPval is distributed by OpenAI. Place the dataset JSON and referenced deliverable/reference files at gdpval/data/ before running the scripts."
fi

# -----------------------------------------------------------------------------
# 6. Summary
# -----------------------------------------------------------------------------

info "setup complete"
cat <<EOF

Next steps:

    # SkillsBench pilot (5 tasks, ~40 min, ~\$0.40 agent cost)
    python paper_experiments/scripts/run_skillsbench_baseline.py

    # Cross-benchmark skill transfer (§4.7.1 — the main workshop finding)
    python paper_experiments/scripts/run_skillsbench_transfer.py

    # GDPval cost-pathology spot-check (§4.8)
    python paper_experiments/scripts/run_gdpval_costcraft.py

    # Summarise SkillsBench results as LaTeX table rows
    python paper_experiments/scripts/aggregate_skillsbench.py

Each script accepts --help for its full option set. The paper-level
map of what reproduces which section is in paper_experiments/README.md.
EOF
