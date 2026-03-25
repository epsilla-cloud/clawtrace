# OpenClaw State Versioning Research

Last updated: 2026-03-25
Owner: Product Strategy
Status: Draft v1

## 1) Executive Summary

OpenClaw has partial state versioning primitives, but not a unified time machine.

What exists today:
- Workspace files such as `AGENTS.md`, `SOUL.md`, `MEMORY.md`, daily memory logs, and workspace skills are meant to live in a private git repo.
- ClawHub skills are versioned bundles with install/update by version.
- Plugins support exact versions, dist-tags, and pinned installs.
- Backups can archive config, state, credentials, sessions, and workspaces.
- Hooks can snapshot memory on reset/new and keep an audit trail of commands.

What does not appear to exist today:
- A first-class, run-correlated history of agent state across config, memory, soul, prompts, skills, plugins, and tool policy.
- A single UI or API that answers "what changed between the last good run and this bad run?"
- A documented restore-oriented time-travel workflow across the full state surface.

## 2) Current OpenClaw Support By Artifact

## Workspace files: `AGENTS.md`, `SOUL.md`, memory, workspace skills

Support level:
- Yes, but mostly through git rather than a dedicated OpenClaw time-machine feature.

Observed behavior:
- The workspace is explicitly treated as private memory.
- OpenClaw recommends putting the workspace in a private git repo for backup and recovery.
- If git is installed, brand-new workspaces are initialized automatically.
- Ongoing history is still user-managed through normal git commits and pushes.

Implication:
- Good for power users.
- Weak for ordinary users because state history depends on disciplined git usage.

## Config: `~/.openclaw/openclaw.json`

Support level:
- Partial.

Observed behavior:
- OpenClaw hot-reloads config and supports full replace (`config.apply`) and partial update (`config.patch`).
- Recovery guidance is backup-driven, not history-driven.
- `openclaw backup create` can archive the active config, state, credentials, sessions, and optionally workspaces.
- CLI docs currently expose `backup create` and `backup verify`, but not a dedicated restore command.
- `openclaw doctor --fix` writes a one-off `openclaw.json.bak`.

Implication:
- OpenClaw supports backup and repair, but not first-class config history, diff, rollback, or run correlation.

## Skills

Support level:
- Strong for registry-installed skills, weak for local edits unless the workspace is in git.

Observed behavior:
- ClawHub skills are versioned bundles with semver history, changelogs, tags, and per-version downloads.
- `openclaw skills install <slug> --version <version>` and `openclaw skills update` provide install-level version control.
- Workspace skills and local overrides still rely on git or manual file management for historical change tracking.

Implication:
- Installed skill versions are traceable.
- Modified local skill instructions are not automatically tied to run history.

## Plugins

Support level:
- Strong for install provenance, weak for full-state history.

Observed behavior:
- Plugins can be installed from exact versions or dist-tags.
- `openclaw plugins install <npm-spec> --pin` stores the resolved exact `name@version`.
- Updates reuse tracked install specs from `plugins.installs`.
- Plugin enable/disable state and config live in main config, so plugin runtime state is still spread across install metadata plus config.

Implication:
- Plugin package provenance is reasonably good.
- There is still no unified "state snapshot" that captures plugin version + config + slot selection + resulting runtime graph for each run.

## Hooks and auditability

Support level:
- Useful primitives, not full versioning.

Observed behavior:
- Bundled hooks can save session context to memory on `/new` or `/reset`.
- Bundled hooks can log commands for auditability.

Implication:
- OpenClaw already has the beginnings of a time machine pipeline.
- The missing piece is a unified state model plus diff/rollback UX.

## 3) First-Principles Assessment

Agent debugging requires two kinds of history:

1. Execution history
- What the agent did in a run.

2. State history
- What the agent believed, loaded, and was configured with at that moment.

Traditional observability usually focuses on execution history. Agent systems need both because many failures come from control-plane drift rather than code regressions:
- `AGENTS.md` changed
- `SOUL.md` changed
- memory was compacted or overwritten
- a plugin version changed
- a skill instruction changed
- a config patch changed tool policy or model routing

If you can only see traces but not state drift, you cannot reliably answer:
- Why did the behavior change?
- Was this caused by memory, instructions, config, or plugin updates?
- Can I restore the last known good state safely?

## 4) Product Recommendation

ClawTrace should add a `State Time Machine` capability.

This should not be a generic backup browser. It should be a debugging primitive that answers:
- What changed since the last good run?
- Which state changes correlate with the regression?
- Can I diff the loaded state vector for any two runs?
- Can I restore or replay a prior known-good state safely?

## 5) Recommended Product Shape

## Phase 0: capture and diff

Ship:
- State vector capture on run start/end
- Hashes and metadata for config, workspace files, skills, plugins, and memory inputs
- Run-to-run diff view inside trace investigations
- Correlation between incidents and recent state changes

Do not ship yet:
- Full one-click rollback of arbitrary state

## Phase 1: inspectable time machine

Ship:
- Entity timeline for config, memory, `AGENTS.md`, `SOUL.md`, skills, plugins, prompts, and deployments
- Last-known-good comparison
- Investigation prompts like "show me everything that changed before error rate spiked"
- Safe exportable state bundles for reproducible debugging

## Phase 2: guarded restore

Ship:
- Restore recommendations
- Controlled rollback for selected artifacts
- Replay against previous state snapshots in staging or eval mode

Guardrails:
- Never restore secrets blindly
- Separate "observe state" from "mutate state"
- Require confirmation for config/plugin rollback
- Prefer replay/eval before production restore

## 5.1) Productization Addendum (2026-03-25): Snapshot + Rollback + A/B Loop

Implementation sync clarified the near-term requirement: ClawTrace should treat OpenClaw self-edits as controlled state mutations, not opaque side effects.

Phase-1 additions:
1. Pre-mutation snapshot hook
- before any agent-driven config/memory/skill mutation, capture a snapshot + metadata pointer
- mutation without snapshot should be blocked

2. Rollback pointer and reason trail
- store what changed, why it changed, and who/what initiated it (human vs agent)
- link rollback candidate directly from the changed run and its recommendation

3. Version-aware A/B evaluation
- support fixed-task comparison across state versions
- compare reliability + cost deltas before promoting a new state as default

4. Evolution ledger
- preserve a chronological history of recommendations, applied changes, outcomes, and reversions
- make this inspectable in incident and drift workflows

## 6) Proposed ClawTrace Data Model Additions

- `state_snapshot_id`
- `state_parent_snapshot_id`
- `state_vector_hash`
- `config_hash`
- `workspace_commit_sha` when available
- `workspace_file_hashes` for `AGENTS.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `MEMORY.md`
- `memory_snapshot_id`
- `skill_versions`
- `plugin_versions`
- `plugin_slot_selection`
- `model_routing_hash`
- `tool_policy_hash`
- `secrets_snapshot_ref` as non-secret metadata only
- `state_change_reason`
- `state_change_actor` (`human` or `agent`)
- `state_change_origin` (`manual`, `recommendation_api`, `automated_policy`)
- `rollback_snapshot_id`
- `experiment_id` / `ab_trial_id`
- `state_promotion_status` (`candidate`, `promoted`, `rolled_back`)

## 7) Bottom Line

OpenClaw already has enough primitives to make a time machine valuable:
- git-backed workspace
- versioned skills
- pinned plugins
- backups
- hooks

But those primitives are fragmented and user-operated.

That gap is exactly where ClawTrace can create leverage:
- unify state provenance
- correlate state with behavior
- diff the control plane
- make rollback and replay safe
