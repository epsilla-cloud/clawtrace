# ClawTrace CEO Product Spec

Last updated: 2026-03-22
Owner: CEO (with Product + Engineering)
Status: Draft v2 (chat-first addendum)

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
Unified run timeline, call tree, span waterfall, token/cost/latency drill-down.

2. Diagnose
Root-cause assistant with confidence scoring across:
- context overload
- tool errors
- memory drift
- prompt regressions
- model/tool mismatch

3. Improve
Diff bad run vs good run, suggest fix, and validate via eval before release.

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

## V1 Surfaces

- Chat Console (primary): conversational analysis, dashboard creation, and alert authoring
- Run Explorer: searchable list of executions
- Trace View: hierarchical spans + timeline + graph
- Incident View: automated failure summary + remediation playbook
- Cost & Performance: per tenant/agent/model/tool budgets
- Regression Guard: dataset/eval and pre-release gates

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
- Suggested eval datasets created from failures improve stickiness.
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

## 5.6 Business KPIs

Product KPIs:
- MTTR per incident
- Repeat-failure rate (30-day)
- Cost per successful task
- P95 end-to-end run latency
- Trace coverage (% runs with complete causal chain)

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

## 6.3 Data Model (Canonical)

Core IDs:
- tenant_id, workspace_id, trace_id, span_id, parent_span_id, run_id, agent_id

Core span kinds:
- session
- llm_call
- tool_call
- memory_op
- planner_step
- subagent
- policy_decision
- error

Core dimensions:
- model/provider/version
- prompt_hash/prompt_version
- tool_name/tool_version
- token_in/token_out/cached_token
- latency_ms/queue_ms/retry_count
- cost_usd (estimated + billed when available)
- input/output checksums + optional payload references

## 6.4 Detection and Diagnosis Engine

Rule-based detectors (V1):
- repeated tool failure loops
- exploding retries
- context window pressure
- latency bottleneck concentration
- cost anomaly per success

Model-assisted diagnosis (V1.5):
- probable root-cause classification with confidence
- suggested remediation templates
- blast radius estimate (who else is affected)

## 6.5 Scalability Plan

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

## 6.6 Cost Model

Design choices to reduce cost:
- Open object storage + Iceberg instead of proprietary lock-in stores
- Separation of storage and compute allows elastic scaling
- Query-in-place avoids full graph duplication ETL in early stages
- Retention tiers: hot (7-30d), warm (90d), cold (1y+)

Unit economics target:
- Gross margin >75% in cloud at scale

## 6.7 Security and Governance

- Workspace and tenant isolation throughout pipeline
- Encryption at rest and in transit
- Fine-grained RBAC on traces, prompts, and tool payloads
- PII detection + redaction pipeline before long-term storage
- Immutable audit logs for investigation and compliance

## 6.8 Build vs Buy Decisions

Build:
- Agent-native schema, detectors, run-diff intelligence, eval integration
- Conversational query planner, chart compiler, and alert-policy generator

Leverage open ecosystem:
- OpenTelemetry for interoperability
- Iceberg ecosystem for table/storage portability
- PuppyGraph for graph query execution on lakehouse data

## 6.9 Chat-First Technical Architecture

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

6. Alert compiler
- Convert conversational condition to alert DSL:
  - signal definition
  - threshold/window
  - grouping and dedupe
  - notification policy
- Run "noise preview" on historical data before activation.

7. Continuous learning loop
- Store successful query patterns and user corrections.
- Improve intent parsing and recommended prompts without training on restricted payloads.

Safety and trust guardrails:
- Strict tenant/workspace authorization before query execution.
- PII-aware redaction in chat responses and chart annotations.
- Deterministic fallback mode: if ambiguity is high, return top interpretations and ask for one-click confirmation.

## 7) Roadmap

## Phase 0 (0-6 weeks): OpenClaw wedge MVP
- OpenClaw plugin GA
- Chat-first console v0 (trace Q&A, generated charts, "save dashboard", "create alert")
- Run explorer + trace view + cost/latency baseline
- JSONL + Iceberg sink, basic PuppyGraph mapping
- Top 5 detectors
- Alert policy engine v0 with Slack/Webhook notifications
- Explainability panel showing query plan + cited spans per answer

Exit criteria:
- 5 design partners using daily
- MTTR reduced >=40% on target workflows
- >=50% of incident investigations started from chat
- Median time from question -> first chart <=30 seconds
- Alert false-positive rate <=15% for v0 detector-backed alerts

## Phase 1 (6-16 weeks): Team product
- Incident view with root-cause hypotheses
- Bad-vs-good run diff
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
2. Define conversational intent schema + plan-card contract (`analysis`, `visualize`, `dashboard_create`, `alert_create`)
3. Build chat-first MVP for 3 "golden" incident workflows end-to-end
4. Implement dashboard compiler + alert compiler with preview/confirm UX
5. Harden OpenClaw plugin install/docs and launch design partner program (10 teams)

## 10) Definition of Success (12 Months)

ClawTrace is considered successful if:
- It is the default observability plugin recommended in OpenClaw community channels.
- Teams can diagnose most incidents in one workflow without raw log spelunking.
- Enterprise customers adopt it as a policy/governance layer for agent reliability.
- The architecture remains open, portable, and economically scalable.
