# ClawTrace CEO Product Spec

Last updated: 2026-03-25
Owner: CEO (with Product + Engineering)
Status: Draft v3 (market-informed plan)

## 1) Executive Summary

ClawTrace is observability for AI agents: the fastest way to understand, debug, and improve agent behavior in production.

Positioning: Datadog for AI agents.
Initial wedge: OpenClaw users who are currently blind when agent runs fail across multi-step tool chains.
Long-term position: the neutral, open observability layer for all agent frameworks and model providers.

### The core problem
Teams can see logs but cannot answer quickly:
1. What happened end to end?
2. Why did this run fail?
3. Why did cost/latency spike?
4. What fix will prevent recurrence?

### North-star outcome
Reduce Mean Time To Resolution (MTTR) for agent incidents from hours to minutes.

### Scope Expansion Addendum (2026-03-24): Cloud Trace Cost Layer

Cloud Trace scope now explicitly includes spend attribution as a co-equal surface with reliability:
- users must see where token/cost was consumed across portfolio, workflow, trajectory, and step class
- users must see cost-per-success, not only raw total spend
- users must receive cost-aware next-best-actions that preserve reliability
- this must be embedded in onboarding and control-room flows, not shipped as a disconnected finance page

### Scope Update Addendum (2026-03-25): From Static Trace UI to Closed-Loop Improvement

Current product status is now explicit:
- today's integrated trace UI is mostly a static proof point (OpenClaw logs converted to JSON and rendered)
- backend analytics, recommendation generation, and closed-loop action flow are still being productized

Phase-1 scope update from implementation sync:
1. Keep the OpenClaw wedge, and productize the current demo into a live hosted loop:
   - runtime ingest
   - analysis and insights
   - recommendation delivery
2. Add a ClawTrace recommendation API that can be consumed by an OpenClaw skill.
3. Support recommendation classes that directly map to operator pain:
   - detect conflicts across config/memory/skills
   - reduce model tier where intelligence demand is low (for example routine background tasks)
   - scriptify deterministic repeated paths instead of over-agentizing everything
4. Keep this recommendation-first, with explicit safety controls and rollback.
5. Treat agent self-evolution as an auditable process with:
   - automatic state snapshot before mutation
   - rollback pointer if changes regress quality/cost
   - versioned A/B evaluation on fixed task sets
6. Enforce least-privilege runtime boundaries for local OpenClaw deployments:
   - workspace allowlist path
   - explicit warning that unrestricted local permissions are high risk

Storage scope decision (2026-03-25):
- tracing persistence is cloud data lake only (GCS + Iceberg + PuppyGraph)
- local filesystem storage is not a supported persistence mode for ClawTrace

## 2) Product Principles (First-Principles)

1. Causality over raw telemetry
Users need cause-and-effect, not just bigger log files.

2. Open-by-default architecture
Data should remain in open formats and be portable.

3. Human + agent debugging loop
The product should help humans inspect failures and help agents self-correct safely.

4. Cost visibility is a product feature
Token, latency, and tool costs are first-class dimensions of quality.

5. Actionability beats dashboards
Every incident page should produce a recommended next action.

6. Chat-first by default
Observability starts with a question, not a navigation tree. The first UI is conversation; dashboards and alerts are generated artifacts.

7. Entity health over page sprawl
Users should reason through first-class entities such as agent, tool, session, prompt, deployment, and incident, each with a synthesized health state.

8. Query all context
Agent failures hide in high-cardinality metadata such as prompt version, end user, tool args, memory state, deployment, and workflow path. This context must remain queryable.

9. Investigations are assets
Chats, charts, notes, and cited traces should become reusable investigation artifacts, not disposable sessions.

10. Open and composable control plane
ClawTrace should fit into existing telemetry, data, and incident ecosystems instead of forcing a closed world.

11. State is part of runtime
In agent systems, `AGENTS.md`, `SOUL.md`, memory, config, skills, and plugin versions are part of production state. Observability must capture them as first-class runtime inputs.

12. Evaluation must score process, not just outcome
An agent can produce the right answer through the wrong trajectory. Observability should evaluate utility, trajectory quality, efficiency, safety, robustness, and state integrity together.

13. User feedback is ground truth, not decoration
Production observability should capture explicit and implicit user feedback as a first-class signal for quality, trust, and prioritization.

## 3) ICP and Market Entry

## Primary ICP (first 12 months)

OpenClaw-heavy technical teams (1-20 engineers) running local/self-hosted agents with tool calling, long context, and memory.

Pain profile:
- Repeated agent mistakes
- Opaque runtime behavior
- No standardized way to attribute failures across model/tool/context/memory
- Escalating token spend with weak reliability

## Secondary ICP

Startup AI product teams running multi-agent workflows (support automation, content ops, coding agents, internal copilots).

## 4) Product Scope and UX

## V1 Jobs-to-be-Done

1. Observe
Unified run timeline, call tree, span waterfall, and token/cost/latency drill-down with spend attribution (`workflow -> trajectory -> model/tool/step`).

2. Diagnose
Root-cause assistant with confidence scoring across:
- context overload
- tool errors
- memory drift
- prompt regressions
- model/tool mismatch

3. Improve
Diff bad run vs good run, suggest fix, and validate via eval before release.

## 4.0 OpenClaw Cost Audit and Cost Control Journey

ClawTrace should productize the practical cost-management loop OpenClaw operators are currently doing manually:
1. audit each spend event by `trigger -> tokens/cost -> utility`
2. classify spend into `invisible_overhead`, `misdirected_spend`, `productive_spend`, `unknown`
3. apply guided controls (background routing, context loading policy, model routing, file hygiene, guardrails, caching)
4. verify impact through week-over-week cost-per-success and avoidable-spend reduction

Reference plan: [OPENCLAW_COST_AUDIT_CONTROL_JOURNEY.md](docs/OPENCLAW_COST_AUDIT_CONTROL_JOURNEY.md)

## 4.1 Why Chat-First (First-Principles Analysis)

Debugging agent systems is an iterative hypothesis loop:
1. Form a hypothesis ("it was probably tool retries")
2. Gather evidence (trace spans, timings, payloads)
3. Refine the hypothesis ("actually memory retrieval was stale")
4. Take action (fix prompt/tool/policy and set guardrails)

A dashboard-first product optimizes step 2 but forces high cognitive load for steps 1, 3, and 4. A chat-first product reduces this gap by turning intent directly into evidence and actions.

First-principles rationale:
- Natural language is the lowest-friction query interface under incident pressure.
- Agent failures are cross-modal (trace, logs, cost, memory, tool output), so users need a unifying interaction primitive.
- Most teams do not have time to prebuild the right dashboards before incidents happen.
- "Tell me what changed, why, and what to do" is inherently conversational.

Conclusion:
Chat is the control plane for observability workflows; visualizations are dynamically materialized from conversation state.

## 4.2 Conversational Observability Requirements

Must-have capabilities:
1. Ask and answer over traces
- Example: "Why did run_849 fail after the third tool call?"
- System returns evidence-backed answer with cited spans and confidence.

2. Dynamic visualization from prompts
- Example: "Graph p95 latency by tool for agent seo_writer over 7 days."
- System generates chart and offers "Save as dashboard".

3. Alert creation by conversation
- Example: "Alert me when retry_count > 3 for publish_tool for 5 minutes."
- System translates to a policy, previews scope/noise, and confirms activation.

4. Trace-native drill-in
- Any answer can pivot into call tree, waterfall, and entity graph at exact span/time ranges.

5. Explainable query planning
- Show "how answer was computed" (filters, joins, traversals, sampling, confidence caveats).

## 4.3 Market-Validated Product Decisions

1. Agent Health is the center of gravity
- Inspired by Datadog service health and Dynatrace problem views, ClawTrace should synthesize detector state, eval regressions, alert state, budget breaches, deployment changes, and incidents into one `Agent Health` surface.

2. Structural trace queries are mandatory
- Inspired by Datadog Trace Queries, users need to search for entire runs by span relationships such as downstream tool calls, parent-child sequences, retries, or memory reads before failures.

3. Investigation workspaces must be first-class
- Inspired by Datadog notebooks, Dynatrace notebooks, and Honeycomb Canvas, every investigation should combine chat, charts, notes, queries, and cited traces in a persistent, shareable workspace.

4. Sessions and threads matter as much as spans
- Inspired by Helicone sessions and LangSmith threads, ClawTrace must roll up run-level telemetry into session-level behavior, user journeys, and unit economics.

5. Prebuilt dashboards should exist from day one
- Inspired by Datadog, Grafana, LangSmith, and Helicone, we should ship opinionated dashboards for OpenClaw operations, cost, and failure modes so teams get value before building anything custom.

6. Production must feed evaluation
- Inspired by Langfuse, LangSmith, Braintrust, and Phoenix, failed traces should be promotable into datasets, scorecards, and regression tests with minimal friction.

7. Correlations should cross product boundaries
- Inspired by Grafana correlations and Datadog service pivots, users should jump from trace context to related dashboards, incidents, prompts, deployments, or external systems without losing scope.

8. Time machine is a core debugging primitive
- OpenClaw already has partial versioning primitives across git-backed workspaces, versioned skills, pinned plugins, hooks, and backups, but not a unified run-correlated state history. ClawTrace should close that gap with a first-class state timeline and diff workflow.

9. Agent evaluation should be run-native
- Existing platforms like Langfuse and LangSmith validate the importance of datasets, experiments, live evaluators, and even trajectory evaluations. ClawTrace should extend this into run-native scorecards tied directly to traces, state changes, and incidents.

## V1 Surfaces

- Chat Console (primary): conversational analysis, dashboard creation, and alert authoring
- Agent Health: synthesized status per agent, tool, prompt, and deployment
- Investigation Workspace: saved chat, charts, notes, queries, and cited traces
- Eval Studio: golden datasets, trajectory evaluators, scorecards, and experiment comparisons
- State Time Machine: state timeline, run-to-run diffs, and last-known-good comparison
- Run Explorer: searchable list of executions
- Sessions View: session/thread rollups with user-facing cost and outcome metrics
- Trace View: run deep dive across Execution Path, Actor Map, Step Timeline, and Run Efficiency (ICP-facing labels over trace-engineer jargon)
- Incident View: automated failure summary + remediation playbook
- Prebuilt Dashboards: OpenClaw operations, cost, and failure modes
- Cost & Performance: per tenant/agent/model/tool budgets
- Cost Attribution Layer: cost-per-success, retry-loop cost, and explicit `estimated` vs `billed` precision
- Regression Guard: dataset/eval and pre-release gates
- Recommendation API Surface: endpoint(s) for OpenClaw skill consumption of ClawTrace insights/actions

## 5) Business Spec

## 5.1 Open Source Strategy

Goal: use OSS as distribution + trust moat, while monetizing enterprise-grade control and operations.

Open Source (Apache 2.0)
- OpenTelemetry-compatible instrumentation SDKs
- OpenClaw native plugin + CLI trace tools
- Canonical trace/event schema
- Local dev UI (single-tenant)
- Local chat interface for conversational trace Q&A and chart generation
- Basic detectors (timeouts, retries, malformed tool calls)

Commercial Cloud / Enterprise
- Multi-tenant hosted control plane
- RBAC + SSO/SAML + SCIM
- Long retention, tiered storage, governance
- Advanced detectors and anomaly models
- Managed conversational workspace memory + shared chat investigation threads
- Cross-workspace lineage and policy enforcement
- Enterprise support + SLAs

Why this split works
- Community can adopt immediately without lock-in fear.
- Teams graduate to paid when they need security/compliance, governance, and scale.

## 5.2 OpenClaw Community Wedge

Wedge hypothesis:
OpenClaw has high pain intensity around opaque runtime behavior. A zero-friction plugin can create fast adoption.

Wedge mechanics:
1. Install in <5 minutes (`openclaw plugins install clawtrace`).
2. Instant value in local development (trace tree + cost/latency + recent failures).
3. Shareable incident bundles to pull teammates into the workflow.
4. One-click "send to ClawTrace Cloud" for hosted collaboration.

Community GTM tactics:
- Ship a public "Agent Failure Cookbook" built from real traces
- Sponsor weekly OpenClaw office-hours teardown sessions
- Publish benchmark reports: model/tool reliability and cost curves across common tasks
- Create "OpenClaw Health Score" badge for repos

## 5.3 Growth Model

PLG funnel
1. Developer installs plugin
2. Team shares traces
3. Team adopts detectors and budgets
4. Org standardizes observability policy
5. Security/compliance triggers enterprise sale

Growth loops
- Shared incident URLs create inbound invites.
- Saved investigations and scheduled insight digests pull in new teammates and buyers who are not active dashboard users.
- Suggested eval datasets created from failures improve stickiness.
- Production traces promoted into datasets and scorecards create a workflow moat beyond pure debugging.
- Trace-native eval scorecards create an upgrade path from observability to continuous improvement, increasing retention and expansion.
- Public integrations (OpenTelemetry, Langfuse export, SIEM hooks) reduce churn risk.

## 5.4 Enterprise Penetration Strategy

Target buyers:
- Economic buyer: VP Eng / Head of AI Platform
- Technical buyer: Staff+ platform engineer
- Security buyer: Security/GRC lead

Land motion (30-60 days):
- Start with one high-pain workflow (support agent, coding agent, or content agent)
- Prove 3 KPIs: MTTR down, repeat-failure rate down, cost/success down

Expand motion (60-180 days):
- Multi-team rollout
- Policy-based routing, redaction, and retention controls
- Cross-framework standardization (OpenClaw + others)

Enterprise requirements:
- BYOC and VPC deployment options
- Data residency and tenant isolation
- Encryption in transit/at rest, KMS support
- Audit logs, tamper-evident event chains
- SOC 2 Type II readiness, optional HIPAA pathway

## 5.5 Packaging and Pricing

1. OSS Self-Hosted: free, community support
2. Pro Cloud: usage-based + seats (small teams)
3. Enterprise: annual contract + platform fee + committed usage

Primary usage meter: traced spans/events
Secondary meters: retention, advanced detectors, eval runs

## 5.6 Strategic Positioning

Against Datadog and Dynatrace:
- We win by being agent-native, chat-first, and centered on run-time graph causality rather than generic service observability with AI bolted on.

Against Grafana:
- We keep the open, composable posture but package the agent workflow out of the box so teams do not need to assemble their own agent observability product.

Against Langfuse, LangSmith, Braintrust, Helicone, and Phoenix:
- We focus more deeply on operational debugging of agent runtime behavior in production, especially for self-hosted and OpenClaw-style systems, while still connecting to evaluation and prompt workflows.

Core strategic claim:
- ClawTrace is the open control plane for agent reliability: conversational investigations, graph-native causality, and production-to-eval feedback in one product.

## 5.7 Business KPIs

Product KPIs:
- MTTR per incident
- Repeat-failure rate (30-day)
- Cost per successful task
- P95 end-to-end run latency
- Trace coverage (% runs with complete causal chain)
- User-rated success and human-takeover rate

Business KPIs:
- OSS -> cloud conversion rate
- Weekly active debugging teams
- Gross retention / expansion
- Payback period on sales-assisted deals

## 6) Technical Spec

## 6.1 Why PuppyGraph on Iceberg

ClawTrace data is naturally graph-shaped:
- agents invoke tools
- sub-agents spawn recursively
- memory and context influence later outcomes
- errors propagate through dependencies

Traditional logs/metrics systems struggle with multi-hop causal questions. A graph query layer makes root-cause analysis straightforward.

Why Apache Iceberg as storage foundation:
- Open table format for large analytical datasets
- Snapshot/time-travel semantics for reproducible postmortems
- Schema and partition evolution without destructive rewrites
- Strong metadata pruning for cost-efficient scans
- Portable across engines and clouds (avoids backend lock-in)

Why PuppyGraph as graph compute layer:
- Query-in-place over existing tables (no mandatory graph ETL/duplication)
- Graph semantics (nodes/edges/path traversal) on top of lakehouse data
- Lower operational complexity than introducing a separate graph database tier early
- Good fit for observability workloads where history depth and relationship traversal both matter

Strategic architecture advantage:
Iceberg gives durable, low-cost, open storage. PuppyGraph gives connected, graph-native reasoning on top. Together, we preserve openness while enabling advanced causality queries.

## 6.2 Reference Architecture

1. Instrumentation and ingest
- OpenClaw plugin hooks session start/end, LLM input/output, tool before/after, sub-agent spawn/end, memory read/write, policy decisions
- OTLP-compatible ingest gateway for non-OpenClaw frameworks

2. Streaming pipeline
- Events published to Kafka (or equivalent)
- Stream processor normalizes schema, enriches tenant/workspace metadata, applies PII redaction policies

3. Storage layers
- Bronze Iceberg tables: raw append-only events
- Silver Iceberg tables: cleaned, standardized spans and dimensions
- Gold Iceberg tables: aggregates (daily KPIs, detector features)

4. Graph layer
- PuppyGraph maps Iceberg tables into graph entities:
  - vertices: run, agent, tool, model, memory node, prompt version, deployment, incident
  - edges: calls, spawns, depends_on, reads_from, writes_to, regressed_after, fixed_by

5. Serving layer
- API service for trace retrieval, incident summaries, and policy checks
- UI for exploration and incident response
- Alerting service (Slack/Email/Webhook/PagerDuty)
- Chat orchestration service (NL -> semantic plan -> query -> explanation -> action)

### Market-Informed Architecture Decisions

- Wide event tables plus graph overlay
ClawTrace should combine Honeycomb-style high-cardinality event querying with PuppyGraph-based relationship traversal, rather than forcing all questions into either a pure graph or pure metric model.

- Structural query and saved views
Queries should be durable artifacts. Chat prompts should compile to reusable structural queries, saved views, dashboards, and alerts.

- Correlation fabric
Every major object should link to related telemetry and workflow artifacts: traces, prompts, evals, incidents, deployments, dashboards, and external systems.

- Investigation persistence
Chat transcripts, chart specs, notes, query plans, and trace citations should be stored as first-class investigation records.

- State vector capture
Every run should capture the effective state vector that shaped behavior: config hash, workspace file hashes, memory snapshot refs, skill versions, plugin versions, slot selection, and tool policy.

- Health synthesis
Agent Health should be computed from detectors, alert states, eval regressions, cost budget breaches, and deployment changes.

- Session rollups
Runs should aggregate cleanly into sessions and threads so we can expose user-facing journeys and unit economics.

## 6.3 Data Model (Canonical)

Core IDs:
- tenant_id, workspace_id, trace_id, span_id, parent_span_id, run_id, session_id, thread_id, agent_id, deployment_id, prompt_id, evaluator_id, dataset_id, investigation_id, state_snapshot_id

Core span kinds:
- session
- llm_call
- tool_call
- memory_op
- retrieval_op
- planner_step
- subagent
- policy_decision
- eval_run
- error

Core dimensions:
- model/provider/version
- prompt_hash/prompt_version
- tool_name/tool_version
- config_hash
- tool_policy_hash
- token_in/token_out/cached_token
- latency_ms/queue_ms/retry_count
- cost_usd (estimated + billed when available)
- outcome_status/severity
- end_user_id/user_feedback
- user_feedback_type/user_feedback_score/user_feedback_text_ref
- human_takeover/reopen_count/retry_same_intent
- release_version/environment
- eval_score_names/eval_score_values
- input/output checksums + optional payload references

Cross-signal entities:
- agent health object
- eval scorecard
- golden dataset
- evaluator
- experiment
- saved view / dashboard panel
- alert rule
- incident
- state snapshot
- state diff
- prompt version
- deployment change

## 6.4 Detection and Diagnosis Engine

Rule-based detectors (V1):
- repeated tool failure loops
- exploding retries
- context window pressure
- latency bottleneck concentration
- cost anomaly per success

Agent Health synthesis (V1):
- combine detector state, active alerts, eval regressions, budget breaches, deployment changes, and incident linkage into a single status per agent/tool/deployment
- expose blast radius in terms of affected sessions, users, and workflows

State drift detectors (V1):
- detect behavior regressions after changes to config, `AGENTS.md`, `SOUL.md`, memory summaries, skill versions, plugin versions, or tool policy
- rank recent state changes by correlation with incident onset

Model-assisted diagnosis (V1.5):
- probable root-cause classification with confidence
- recurring pattern clustering across similar runs
- suggested remediation templates
- blast radius estimate (who else is affected)

## 6.5 Agent Evaluation Architecture

Evaluation layers:
- outcome evaluation
- trajectory evaluation
- efficiency evaluation
- safety and policy evaluation
- robustness evaluation
- state-aware regression evaluation

Evaluation methods:
- executable oracles and end-state checks
- reference-answer comparison
- reference trajectory matching
- rule-based invariants
- LLM-as-judge
- user feedback labeling and calibration
- repeated-trial evaluation (`pass@k`)
- multi-turn simulation
- fault injection and replay
- multi-dimensional gating to distinguish nominal completion from policy-compliant completion

Golden dataset strategy:
- happy-path goldens
- edge-case goldens
- safety and refusal goldens
- regression goldens from real incidents
- state-change goldens for prompt/config/memory/plugin changes
- feedback-derived goldens from negative user reactions and human takeovers

Every high-value workflow should eventually have:
- a versioned golden dataset
- a run scorecard template
- budget thresholds
- required/forbidden tool constraints
- a last-known-good baseline
- a gated success definition that can identify corrupt successes
- a feedback instrumentation plan for explicit and implicit user signals

## 6.6 Scalability Plan

Data growth assumptions:
- 10M+ spans/day by end of year 1 in cloud

Scalability approach:
- Partition Iceberg tables by date + tenant + event_family
- Optimize sort/order for trace_id and timestamp locality
- Automatic compaction and file-size management
- Materialized aggregates for common dashboards
- Query federation with workload isolation (interactive vs batch)

Graph query performance:
- Keep hot working sets cached in PuppyGraph and API layer
- Precompute high-value neighborhood indexes for top incident workflows

## 6.7 Cost Model

Design choices to reduce cost:
- Open object storage + Iceberg instead of proprietary lock-in stores
- Separation of storage and compute allows elastic scaling
- Query-in-place avoids full graph duplication ETL in early stages
- Retention tiers: hot (7-30d), warm (90d), cold (1y+)

Unit economics target:
- Gross margin >75% in cloud at scale

## 6.8 Security and Governance

- Workspace and tenant isolation throughout pipeline
- Encryption at rest and in transit
- Fine-grained RBAC on traces, prompts, and tool payloads
- PII detection + redaction pipeline before long-term storage
- Immutable audit logs for investigation and compliance

## 6.9 Build vs Buy Decisions

Build:
- Agent-native schema, detectors, run-diff intelligence, eval integration
- Conversational query planner, chart compiler, and alert-policy generator
- trajectory evaluators, run scorecards, and state-aware regression analysis

Leverage open ecosystem:
- OpenTelemetry for interoperability
- Iceberg ecosystem for table/storage portability
- PuppyGraph for graph query execution on lakehouse data

## 6.10 Chat-First Technical Architecture

End-to-end flow:
1. User intent
- User asks a question in chat (analysis, dashboard, or alert request).

2. Intent and constraint parsing
- Classify request type: `analysis`, `visualize`, `dashboard_create`, `alert_create`, `alert_modify`.
- Extract entities: time range, workspace, agent/tool/model filters, aggregation target.

3. Semantic planning layer
- Translate intent into executable plans:
  - SQL plan (Iceberg aggregates and raw spans)
  - Graph traversal plan (PuppyGraph for dependency/causality hops)
  - Hybrid plan (join graph-derived sets back into tabular metrics)
- Produce a machine-readable "plan card" for explainability.

4. Execution and evidence
- Execute plan with budget-aware query limits and tenant-scoped RBAC checks.
- Return results with provenance:
  - contributing spans
  - detector signals used
  - confidence and caveats

5. Visualization compiler
- Compile query result to chart spec (time series, table, histogram, Sankey, dependency graph).
- Allow one-click persist as dashboard panel with auto-refresh and owner metadata.

6. Investigation workspace compiler
- Persist chat transcripts, chart specs, saved queries, notes, and cited spans as reusable investigation records.
- Allow one-click promotion of an investigation into a dashboard, runbook, or postmortem.

7. Alert compiler
- Convert conversational condition to alert DSL:
  - signal definition
  - threshold/window
  - grouping and dedupe
  - notification policy
- Run "noise preview" on historical data before activation.

8. Continuous learning loop
- Store successful query patterns and user corrections.
- Improve intent parsing and recommended prompts without training on restricted payloads.

Safety and trust guardrails:
- Strict tenant/workspace authorization before query execution.
- PII-aware redaction in chat responses and chart annotations.
- Deterministic fallback mode: if ambiguity is high, return top interpretations and ask for one-click confirmation.

## 6.11 State Time Machine Architecture

Goals:
- capture the effective control-plane state for every run
- diff any two runs or time ranges
- correlate state drift with failures, cost spikes, and latency regressions
- support safe replay and eventual rollback

Capture strategy:
- prefer native provenance when available:
  - workspace git commit SHA
  - pinned skill version
  - pinned plugin install spec
- fall back to synthetic snapshots when native provenance is missing:
  - file hashes for `AGENTS.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `MEMORY.md`
  - config hash and selected sub-hashes
  - memory snapshot refs and summary hashes

Snapshot points:
- gateway config change
- plugin install/update/enable/disable
- skill install/update
- workspace file change
- run start
- run end
- manual checkpoint or incident creation

Diff surfaces:
- last good run vs current run
- before/after deployment
- before/after prompt or memory change
- incident onset window

Restore strategy:
- Phase 0: observe only
- Phase 1: export/import and replay against prior snapshots
- Phase 2: guarded rollback for selected artifact classes with confirmation and audit logging

## 7) Roadmap

## Phase 0 (0-6 weeks): OpenClaw wedge MVP
- OpenClaw plugin GA
- Chat-first console v0 (trace Q&A, generated charts, "save dashboard", "create alert")
- Investigation workspace v0 (save/share chat + charts + notes + cited traces)
- Agent Health page v0
- Agent Eval v0 (run scorecards + golden dataset builder)
- User feedback capture v0 (thumbs, confirmation, takeover, retry/reopen heuristics)
- State Time Machine v0 (state vector capture + run-to-run diff)
- Run explorer + trace view + cost/latency baseline
- Sessions/threads rollups + unit economics baseline
- Prebuilt OpenClaw dashboards (operations, cost, failure modes)
- Structural trace query templates + saved views
- JSONL + Iceberg sink, basic PuppyGraph mapping
- Top 5 detectors
- baseline trajectory evaluators and budget evaluators
- Alert policy engine v0 with Slack/Webhook notifications
- Explainability panel showing query plan + cited spans per answer

Exit criteria:
- 5 design partners using daily
- MTTR reduced >=40% on target workflows
- >=50% of incident investigations started from chat
- >=70% of incidents show a correlated state diff when state changed recently
- every design partner has at least one golden dataset for a core workflow
- feedback coverage on >=60% of user-facing runs for design-partner workflows
- >=60% of incidents end with a saved investigation, dashboard, or alert artifact
- Median time from question -> first chart <=30 seconds
- Alert false-positive rate <=15% for v0 detector-backed alerts

## Phase 1 (6-16 weeks): Team product
- Incident view with root-cause hypotheses
- Bad-vs-good run diff
- reference trajectory matching and compare mode
- multi-turn simulation and repeated-trial evals
- State timeline explorer + last-known-good compare
- Scheduled insights reports and failure clustering
- Production-to-eval dataset builder
- Cross-source correlations to external logs, APM, and warehouses
- Alerts + budget policies
- Hosted cloud alpha

Exit criteria:
- 20 active teams
- weekly active team retention >=60%

## Phase 2 (4-9 months): Enterprise readiness
- SSO/SCIM/RBAC
- BYOC/VPC deployment
- Compliance package + audit tooling
- Multi-framework SDKs beyond OpenClaw

Exit criteria:
- 3 enterprise lighthouse customers
- first six-figure annual contract

## 8) Risks and Mitigations

1. Risk: Community fragmentation across agent frameworks
Mitigation: keep schema and ingest open; make OpenClaw the wedge, not the boundary.

2. Risk: "just use existing APM" objection
Mitigation: prove agent-specific causality and remediation workflows that generic APM cannot do well.

3. Risk: Graph query latency at high scale
Mitigation: workload isolation, caching, precomputed neighborhoods, and gold-table shortcuts.

4. Risk: Commodity pressure from larger platforms
Mitigation: open-data architecture + best-in-class diagnosis loops + community distribution moat.

## 9) Immediate Execution Plan (Next 14 Days)

1. Publish canonical event schema v0.1
2. Define entity model for `Agent Health`, sessions/threads, deployments, prompts, evals, and incidents
3. Define state snapshot schema for config, workspace files, memory, skills, plugins, and tool policy
4. Define eval scorecard schema and golden dataset format for agent runs
5. Define feedback event schema for explicit and implicit user feedback on runs and sessions
6. Define conversational intent schema + plan-card contract and structural trace query IR
7. Build chat-first MVP for 3 "golden" incident workflows end-to-end
8. Implement investigation workspace, state diff view, eval scorecards, feedback capture, prebuilt dashboards, and alert compiler with preview/confirm UX
9. Harden OpenClaw plugin install/docs and launch design partner program (10 teams)

## 10) Definition of Success (12 Months)

ClawTrace is considered successful if:
- It is the default observability plugin recommended in OpenClaw community channels.
- Teams can diagnose most incidents in one workflow without raw log spelunking.
- Most incidents produce a reusable artifact such as an investigation, dashboard, alert, or regression dataset.
- Teams use ClawTrace to turn production traces into golden datasets and to score both outcomes and trajectories of core agent workflows.
- Teams use explicit and implicit user feedback to calibrate agent quality and to prioritize regressions that matter to real users.
- Enterprise customers adopt it as a policy/governance layer for agent reliability.
- The architecture remains open, portable, and economically scalable.
