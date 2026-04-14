# OpenClaw State Versioning Research

Last updated: 2026-04-14
Owner: Product Strategy
Status: Research complete. Feature is Phase 1 — not yet implemented.

---

> **NOT YET IMPLEMENTED.** This document describes a Phase 1 feature. None of the state capture, diff, or drift detection described here is currently shipped. The UI types (`ClawTraceStateDiffItem`, `ClawTraceStateDiffPanelProps`) exist in the frontend codebase as forward-looking scaffolding, but the backend endpoints, state capture events, and diff views are not live.

---

## 1) Executive Summary

OpenClaw has partial state versioning primitives, but not a unified time machine.

What exists in OpenClaw today:
- Workspace files such as `AGENTS.md`, `SOUL.md`, `MEMORY.md`, daily memory logs, and workspace skills are meant to live in a private git repo.
- ClawHub skills are versioned bundles with install/update by version.
- Plugins support exact versions, dist-tags, and pinned installs.
- Backups can archive config, state, credentials, sessions, and workspaces.
- Hooks can snapshot memory on reset/new and keep an audit trail of commands.

What does not exist today (in OpenClaw or ClawTrace):
- A first-class, run-correlated history of agent state across config, memory, soul, prompts, skills, plugins, and tool policy.
- A single UI or API that answers "what changed between the last good run and this bad run?"
- A documented restore-oriented time-travel workflow across the full state surface.

**Why this matters for ClawTrace:** Many agent failures are not runtime bugs. They're control-plane drift — AGENTS.md changed, memory was compacted, a plugin version changed, a skill instruction changed. Without state history, you can see that behavior changed but cannot explain why.

---

## 2) Current OpenClaw Support By Artifact

### Workspace files: `AGENTS.md`, `SOUL.md`, memory, workspace skills

Support: git-backed, but user-managed. Good for power users; weak for ordinary users without disciplined git usage.

### Config: `~/.openclaw/openclaw.json`

Support: partial. Hot-reload and backup/repair, but no config history, diff, rollback, or run correlation.

### Skills

Support: strong for registry-installed skills (semver, changelogs); weak for local edits unless workspace is in git.

### Plugins

Support: strong for install provenance (pinned exact versions). No unified state snapshot capturing plugin version + config + slot selection for each run.

### Hooks and auditability

Support: useful primitives (memory save on `/new` or `/reset`, command logging). Missing piece: a unified state model plus diff/rollback UX.

---

## 3) First-Principles Assessment

Agent debugging requires two kinds of history:

1. **Execution history** — what the agent did in a run (ClawTrace already captures this)
2. **State history** — what the agent believed, loaded, and was configured with at that moment (not yet captured)

Traditional observability focuses only on execution history. Agent systems need both because many failures come from control-plane drift.

If you can only see traces but not state drift, you cannot reliably answer:
- Why did the behavior change?
- Was this caused by memory, instructions, config, or plugin updates?
- Can I restore the last known good state safely?

---

## 4) Product Recommendation

ClawTrace should add a `State Time Machine` capability as a Phase 1 feature.

This is not a generic backup browser. It is a debugging primitive that answers:
- What changed since the last good run?
- Which state changes correlate with the regression?
- Can I diff the loaded state vector for any two runs?
- Can I restore or replay a prior known-good state safely?

---

## 5) Recommended Product Shape

### Phase 1 (next): Capture and diff

Ship:
- State vector capture on run start/end
- Hashes and metadata for config, workspace files, skills, plugins, and memory inputs
- Run-to-run diff view inside trace investigations
- Correlation between incidents and recent state changes

Do not ship yet:
- Full one-click rollback of arbitrary state

### Phase 2 (later): Inspectable time machine

Ship:
- Entity timeline for config, memory, `AGENTS.md`, `SOUL.md`, skills, plugins, prompts, and deployments
- Last-known-good comparison
- Investigation prompts: "show me everything that changed before error rate spiked"
- Safe exportable state bundles for reproducible debugging

### Phase 3 (later): Guarded restore

Ship:
- Restore recommendations
- Controlled rollback for selected artifacts
- Replay against previous state snapshots in staging or eval mode

Guardrails:
- Never restore secrets blindly
- Separate "observe state" from "mutate state"
- Require confirmation for config/plugin rollback
- Prefer replay/eval before production restore

---

## 5.1 Self-Evolve Productization Addendum

The self-evolve API (`/v1/evolve/ask`) is already live. It handles the recommendation + apply flow. To close the loop safely, ClawTrace should treat agent-driven self-edits as controlled state mutations, not opaque side effects.

Phase 1 additions to the self-evolve path:

1. **Pre-mutation snapshot hook** — before any agent-driven config/memory/skill mutation, capture a snapshot + metadata pointer. Mutation without snapshot should be blocked.

2. **Rollback pointer and reason trail** — store what changed, why, and who/what initiated it (human vs. agent). Link rollback candidate directly from the changed run and its recommendation.

3. **Version-aware A/B evaluation** — support fixed-task comparison across state versions; compare reliability + cost deltas before promoting a new state as default.

4. **Evolution ledger** — preserve a chronological history of recommendations, applied changes, outcomes, and reversions. Make this inspectable in incident and drift workflows.

---

## 6) Proposed ClawTrace Data Model Additions

Fields to add to span/trace schema for state capture:

- `state_snapshot_id`
- `state_parent_snapshot_id`
- `state_vector_hash`
- `config_hash`
- `workspace_commit_sha` (when available)
- `workspace_file_hashes` — for `AGENTS.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `MEMORY.md`
- `memory_snapshot_id`
- `skill_versions`
- `plugin_versions`
- `plugin_slot_selection`
- `model_routing_hash`
- `tool_policy_hash`
- `state_change_reason`
- `state_change_actor` (`human` | `agent`)
- `state_change_origin` (`manual` | `recommendation_api` | `automated_policy`)
- `rollback_snapshot_id`
- `experiment_id` / `ab_trial_id`
- `state_promotion_status` (`candidate` | `promoted` | `rolled_back`)

---

## 7) Bottom Line

OpenClaw already has enough primitives to make a time machine valuable:
- git-backed workspace
- versioned skills
- pinned plugins
- backups
- hooks

But those primitives are fragmented and user-operated.

That gap is exactly where ClawTrace creates leverage:
- unify state provenance
- correlate state with behavior
- diff the control plane
- make rollback and replay safe

This is Phase 1 work. It is not yet implemented.
