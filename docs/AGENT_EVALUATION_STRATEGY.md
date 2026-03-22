# ClawTrace Agent Evaluation Strategy

Last updated: 2026-03-22
Owner: Product Strategy
Status: Draft v1

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
- connect all of that back to real traces, state drift, and operational incidents

## 2) What Existing Platforms Cover

## Langfuse

Strengths:
- repeatable evals for LLM application behavior
- datasets, experiments, and live evaluators
- strong connection between traces and eval datasets

Observed emphasis:
- app-level and trace-level evaluation loop
- less explicit trajectory-match machinery in the core docs than LangSmith

## LangSmith

Strengths:
- offline and online evaluation
- datasets sourced from curated cases, production traces, or synthetic generation
- intermediate-step evaluation
- graph evaluation
- multi-turn simulation
- explicit agent trajectory evaluation with:
  - strict match
  - unordered match
  - subset match
  - superset match
  - trajectory LLM-as-judge

Observed emphasis:
- strong developer workflow for agent testing
- still primarily an evaluation product that sits next to observability rather than turning every production run into a multi-axis scorecard

## 3) First-Principles View

An agent run is not just a text output.

It is a policy acting in an environment under constraints:
- it observes
- it plans
- it chooses tools
- it mutates state
- it interacts with users
- it incurs latency and cost
- it may violate policy while still appearing successful

Therefore a correct evaluation system for agents must score more than final answer quality.

It must answer six questions:
1. Did the agent achieve the intended outcome?
2. Did it take an acceptable path to get there?
3. Did it do so efficiently?
4. Did it obey policy and safety constraints?
5. Would it behave consistently on repeat or under small perturbations?
6. What changed when performance regressed?

This implies a critical product principle:
- do not score "success" as outcome-only
- separate nominal completion from policy-compliant completion
- explicitly surface corrupt success, where a run appears successful but violated procedure, policy, or state constraints along the way

## 4) Proposed ClawTrace Evaluation Model

## 4.1 Evaluation layers

### Layer 1: Outcome evaluation

What it measures:
- task success
- exact match or semantic correctness
- end-state correctness
- side-effect correctness

Best methods:
- executable oracles
- database / environment end-state checks
- reference answer checks
- human review for nuanced tasks

### Layer 2: Trajectory evaluation

What it measures:
- required tools called
- forbidden tools avoided
- ordering constraints followed
- argument quality
- recovery from failure
- unnecessary detours or loops

Best methods:
- reference trajectory match
- partial trajectory constraints
- LLM judge with rubric
- rule-based invariants

### Layer 3: Efficiency evaluation

What it measures:
- total cost
- tokens per success
- end-to-end latency
- time to first tool
- number of tool calls
- redundant retries

Best methods:
- trace-derived metrics
- budget thresholds
- Pareto comparisons against a baseline

### Layer 4: Safety and policy evaluation

What it measures:
- policy compliance
- data leakage
- unsafe tool use
- unauthorized actions
- prompt injection susceptibility
- refusal/escalation correctness

Best methods:
- deterministic policy checks
- safety evaluators
- adversarial datasets
- human audit for high-risk cases

### Layer 5: Robustness evaluation

What it measures:
- repeatability across multiple runs
- sensitivity to prompt/model changes
- resilience to tool failures
- recovery after partial environment failure

Best methods:
- repeated trials
- pass^k style metrics
- perturbation testing
- tool fault injection

### Layer 6: State-aware evaluation

What it measures:
- regressions after config, memory, skill, plugin, or prompt changes
- last-known-good state comparison
- memory drift
- policy drift

Best methods:
- run-to-run state diffs
- replay against old snapshots
- compare-by-state-slice analysis

## 4.2 Scorecard axes for every run

Every run in ClawTrace should eventually produce a scorecard with these axes:
- Utility
- Trajectory Quality
- Efficiency
- Safety / Policy Compliance
- Robustness
- State Integrity

Not every run needs every score immediately. Phase 0 can start with deterministic and cheap scores first.

## 5) Metrics We Should Support

## Outcome metrics

- `task_success`
- `goal_state_match`
- `answer_correctness`
- `reference_match`
- `user_feedback_score`
- `resolved_without_human`

## Trajectory metrics

- `required_tools_recall`
- `forbidden_tools_precision`
- `tool_argument_correctness`
- `trajectory_match_strict`
- `trajectory_match_unordered`
- `trajectory_match_subset`
- `trajectory_match_superset`
- `loop_count`
- `dead_end_count`
- `recovery_success`

## Efficiency metrics

- `latency_ms`
- `time_to_first_tool_ms`
- `tool_calls_count`
- `retry_count`
- `tokens_in`
- `tokens_out`
- `cost_usd`
- `cost_per_success`

## Safety metrics

- `policy_violation_count`
- `unsafe_action_attempted`
- `sensitive_data_exposed`
- `abstain_when_uncertain`
- `escalation_correctness`
- `completion_under_policy`
- `corrupt_success_rate`
- `procedural_integrity_score`

## Robustness metrics

- `pass_at_k`
- `variance_in_outcome`
- `variance_in_cost`
- `variance_in_trajectory`
- `fault_injection_recovery_rate`

## State-aware metrics

- `state_change_count_since_last_good`
- `performance_delta_after_state_change`
- `memory_staleness_rate`
- `policy_drift_correlation`

## 6) Golden Test Set Strategy

External benchmarks are useful, but production quality will come from internal goldens.

ClawTrace should encourage users to build a layered golden set:

1. Happy-path goldens
- core business workflows that must succeed

2. Edge-case goldens
- cases with ambiguity, missing inputs, partial failures, unusual tool outputs

3. Safety goldens
- prompt injection
- forbidden requests
- sensitive data handling
- escalation/refusal cases

4. Regression goldens
- traces taken from real incidents that should never repeat

5. State-change goldens
- tests run before and after prompt/config/memory/plugin changes

Each example should support:
- input
- environment seed / setup
- expected outcome
- optional reference trajectory
- allowed tool set
- forbidden actions
- latency and cost budgets
- evaluation rubric

## 7) External Benchmarks We Should Respect But Not Overfit To

## Coding / repo agents

- SWE-bench / SWE-bench Verified
Good for executable coding tasks and repository-level issue resolution.

## General assistant agents

- GAIA
Good for broad tool use, browsing, multimodal reasoning, and long-horizon general assistant behavior.

## Web agents

- WebArena
Good for realistic and reproducible web task completion.

- WorkArena / WorkArena++
Good for browser-based knowledge work tasks and compositional workflow evaluation.

## Broad multi-environment agents

- AgentBench
Good for breadth across diverse environments such as OS, DB, KG, web, and game-like tasks.

## Conversational tool-use agents

- τ-bench / τ²-bench / τ³-bench
Good for multi-turn tool-agent-user interactions with domain rules and end-state verification.

## Safety / procedure

- ST-WebAgentBench
Good for web-agent safety and trustworthiness.

- Procedure-Aware Evaluation (PAE)
Important reminder that apparent task success can hide procedural violations.

## 8) Benchmark Lessons For ClawTrace

1. Outcome-only metrics are not enough.
An agent can "succeed" while violating policy, wasting cost, or taking an unsafe path.

ClawTrace implication:
- score nominal completion and gated completion separately
- show how many "wins" were actually corrupt successes

2. Cost must be a first-class metric.
Accuracy without cost discipline leads to unrealistic systems.

3. Benchmarks are useful for R&D, not enough for production.
Benchmark overfitting, weak holdouts, and simulator artifacts can distort results.

4. Production traces should become evaluation assets.
The best goldens come from real failures and high-value user journeys.

5. Repeatability matters.
Agents are stochastic systems; one successful run is not enough.

## 9) Product Recommendation For ClawTrace

ClawTrace should ship an `Agent Eval` layer that is trace-native and state-aware.

### Phase 0

Ship:
- run scorecards on outcome, trajectory, efficiency, and safety basics
- golden dataset builder from traces
- simple trajectory evaluators:
  - required tool checks
  - forbidden tool checks
  - step count / loop checks
  - budget checks
- gated success scoring:
  - nominal success
  - completion under policy
  - corrupt success flag
- baseline repeated-trial evaluation with `pass@k`

### Phase 1

Ship:
- reference trajectory matching
- LLM-as-judge for trajectory quality
- multi-turn simulation and session-level evaluation
- state-aware regression analysis
- benchmark connectors/importers for common agent benchmarks

### Phase 2

Ship:
- fault injection and recovery evaluation
- policy-aware gated scoring
- leaderboard and compare mode across model/prompt/policy variants
- replay and canary evaluation against prior state snapshots

## 10) Bottom Line

Langfuse and LangSmith prove that evaluation belongs next to observability.
LangSmith in particular shows that trajectory evaluation is already real.

ClawTrace should go one step further:
- score real agent runs, not just offline experiments
- combine outcome and process
- treat cost and safety as co-equal axes
- connect eval regressions to state drift and incidents
- turn production failures into the next golden dataset
