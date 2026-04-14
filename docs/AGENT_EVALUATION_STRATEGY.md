# ClawTrace Agent Evaluation Strategy

Last updated: 2026-04-14 (original: 2026-03-22)
Owner: Product Strategy
Status: Phase 2. Not yet implemented. Research and model complete.

---

> **NOT YET IMPLEMENTED.** This document describes the Phase 2 evaluation feature set. Nothing in this document is currently live. The research and product model are complete and ready to build when Phase 1 (State Time Machine, Agent Health, cost taxonomy) ships.

---

## 1) Executive Summary

Current LLM observability products already support important evaluation workflows:
- Langfuse supports datasets, experiments, and live evaluators.
- LangSmith supports offline and online evaluation, intermediate-step evaluation, graph evaluation, multi-turn simulation, and explicit trajectory evaluation.

The opportunity for ClawTrace is not to reinvent eval from scratch. It is to make evaluation agent-native and run-native:
- evaluate outcomes
- evaluate trajectories
- evaluate efficiency
- evaluate safety and policy adherence
- evaluate robustness and consistency
- evaluate real user satisfaction and correction signals
- connect all of that back to real traces, state drift, and operational incidents

ClawTrace has a structural advantage: the self-evolve loop (`/v1/evolve/ask`) is already live. Once eval ships, it closes the final loop — agents can run their own evals against golden datasets and promote or roll back changes based on scores.

---

## 2) What Existing Platforms Cover

### Langfuse

Strengths: repeatable evals, datasets, experiments, live evaluators, strong trace-to-dataset connection.

### LangSmith

Strengths: offline and online evaluation, datasets from curated cases, production traces, or synthetic generation; intermediate-step evaluation; graph evaluation; multi-turn simulation; explicit agent trajectory evaluation with strict match, unordered match, subset match, superset match, and trajectory LLM-as-judge.

---

## 3) First-Principles View

An agent run is not just a text output. It is a policy acting in an environment under constraints. A correct evaluation system must score six things:

1. Did the agent achieve the intended outcome?
2. Did it take an acceptable path to get there?
3. Did it do so efficiently?
4. Did it obey policy and safety constraints?
5. Would it behave consistently on repeat or under small perturbations?
6. What changed when performance regressed?

Critical principle: do not score "success" as outcome-only. Separate nominal completion from policy-compliant completion. Explicitly surface **corrupt success** — where a run appears successful but violated procedure, policy, or state constraints along the way.

---

## 4) Proposed ClawTrace Evaluation Model

### 4.1 Evaluation Layers

**Layer 1: Outcome evaluation**
- Task success, exact match or semantic correctness, end-state correctness
- Methods: executable oracles, database/environment end-state checks, reference answer checks, human review

**Layer 2: Trajectory evaluation**
- Required tools called, forbidden tools avoided, ordering constraints, argument quality, recovery from failure, unnecessary detours or loops
- Methods: reference trajectory match, partial constraints, LLM judge with rubric, rule-based invariants

**Layer 3: Efficiency evaluation**
- Total cost, tokens per success, end-to-end latency, time to first tool, tool call count, redundant retries
- Methods: trace-derived metrics, budget thresholds, Pareto comparisons against baseline

**Layer 4: Safety and policy evaluation**
- Policy compliance, data leakage, unsafe tool use, unauthorized actions, prompt injection susceptibility, refusal/escalation correctness
- Methods: deterministic policy checks, safety evaluators, adversarial datasets, human audit for high-risk cases

**Layer 5: Robustness evaluation**
- Repeatability, sensitivity to prompt/model changes, resilience to tool failures, recovery after partial environment failure
- Methods: repeated trials, pass^k metrics, perturbation testing, tool fault injection

**Layer 6: State-aware evaluation**
- Regressions after config/memory/skill/plugin/prompt changes, last-known-good comparison, memory drift, policy drift
- Methods: run-to-run state diffs, replay against old snapshots, compare-by-state-slice analysis
- Dependency: requires State Time Machine (Phase 1) before this layer can ship

### 4.2 Scorecard Axes Per Run

Every run in ClawTrace should eventually produce a scorecard with:
- Utility
- Trajectory Quality
- Efficiency
- Safety / Policy Compliance
- Robustness
- State Integrity

Not every run needs every score immediately. Phase 2 start: deterministic and cheap scores first.

---

## 5) Metrics To Support

### Outcome metrics
`task_success`, `goal_state_match`, `answer_correctness`, `reference_match`, `user_feedback_score`, `resolved_without_human`, `thumbs_up_rate`, `thumbs_down_rate`, `task_acceptance_rate`

### Trajectory metrics
`required_tools_recall`, `forbidden_tools_precision`, `tool_argument_correctness`, `trajectory_match_strict`, `trajectory_match_unordered`, `trajectory_match_subset`, `trajectory_match_superset`, `loop_count`, `dead_end_count`, `recovery_success`

### Efficiency metrics
`latency_ms`, `time_to_first_tool_ms`, `tool_calls_count`, `retry_count`, `tokens_in`, `tokens_out`, `cost_usd`, `cost_per_success`

### Safety metrics
`policy_violation_count`, `unsafe_action_attempted`, `sensitive_data_exposed`, `abstain_when_uncertain`, `escalation_correctness`, `completion_under_policy`, `corrupt_success_rate`, `procedural_integrity_score`

### Robustness metrics
`pass_at_k`, `variance_in_outcome`, `variance_in_cost`, `variance_in_trajectory`, `fault_injection_recovery_rate`

### State-aware metrics
`state_change_count_since_last_good`, `performance_delta_after_state_change`, `memory_staleness_rate`, `policy_drift_correlation`

### User feedback signals

Explicit: thumbs up/down, star rating, free-text complaint or praise, user-confirmed resolution.

Implicit: user retries the same intent, user edits or rewrites the output, human takeover after agent response, reopen rate, abandonment, time to accept.

---

## 6) Golden Test Set Strategy

ClawTrace should encourage users to build a layered golden set:

1. **Happy-path goldens** — core business workflows that must succeed
2. **Edge-case goldens** — cases with ambiguity, missing inputs, partial failures
3. **Safety goldens** — prompt injection, forbidden requests, sensitive data handling, escalation/refusal
4. **Regression goldens** — traces from real incidents that should never repeat
5. **State-change goldens** — tests run before and after prompt/config/memory/plugin changes

Each example supports: input, environment seed, expected outcome, optional reference trajectory, allowed tool set, forbidden actions, latency and cost budgets, evaluation rubric, expected user-visible success criteria.

---

## 7) External Benchmarks to Respect But Not Overfit To

- **SWE-bench / SWE-bench Verified** — coding and repository-level issue resolution
- **GAIA** — broad tool use, browsing, multimodal reasoning, long-horizon general assistant behavior
- **WebArena** — realistic and reproducible web task completion
- **WorkArena / WorkArena++** — browser-based knowledge work and compositional workflow evaluation
- **AgentBench** — breadth across diverse environments (OS, DB, KG, web, game-like tasks)
- **τ-bench / τ²-bench / τ³-bench** — multi-turn tool-agent-user interactions with domain rules and end-state verification
- **ST-WebAgentBench** — web-agent safety and trustworthiness
- **Procedure-Aware Evaluation (PAE)** — apparent task success can hide procedural violations

---

## 8) Benchmark Lessons For ClawTrace

1. **Outcome-only metrics are not enough.** Score nominal completion and gated completion separately.
2. **Cost must be a first-class metric.** Accuracy without cost discipline leads to unrealistic systems.
3. **Benchmarks are useful for R&D, not enough for production.** Best goldens come from real failures.
4. **Production traces should become evaluation assets.** Negative user feedback → candidate regression goldens.
5. **Repeatability matters.** One successful run is not enough for stochastic systems.

---

## 9) Build Sequence

### Phase 2 (initial eval ship)

- Run scorecards on outcome, trajectory, efficiency, and safety basics
- Golden dataset builder from traces
- Feedback capture v0: thumbs up/down, user-confirmed resolution, human takeover, retry/reopen heuristics
- Simple trajectory evaluators: required tool checks, forbidden tool checks, step count/loop checks, budget checks
- Gated success scoring: nominal success, completion under policy, corrupt success flag
- Baseline repeated-trial evaluation (`pass@k`)

### Phase 2 (continued)

- Reference trajectory matching
- LLM-as-judge for trajectory quality
- Multi-turn simulation and session-level evaluation
- State-aware regression analysis (requires State Time Machine)
- Benchmark connectors for common agent benchmarks

### Phase 3

- Fault injection and recovery evaluation
- Policy-aware gated scoring
- Leaderboard and compare mode across model/prompt/policy variants
- Replay and canary evaluation against prior state snapshots

---

## 10) Connection to Self-Evolve Loop

The self-evolve API (`/v1/evolve/ask`) is already live and gives agents access to Tracy's trajectory analysis. When eval ships, the loop becomes fully closed:

1. Agent runs a task.
2. ClawTrace captures the trace.
3. Eval scorecard runs automatically.
4. If score drops below threshold, Tracy identifies the regression and recommends a fix.
5. Agent queries `/v1/evolve/ask`, gets the recommendation, applies it.
6. Version-aware A/B eval runs to confirm improvement before promoting.
7. Evolution ledger records the change.

This is the long vision: agents that continuously improve their reliability, cost, and safety based on their own production trajectory data.
