# ClawTrace CEO Product Spec

Last updated: 2026-04-14
Owner: CEO (with Product + Engineering)
Status: Live — v1.0 shipped. Phase 1 in progress.

---

## Implementation Status Key

> **[SHIPPED]** — live in production at clawtrace.ai
> **[PHASE 1]** — next major build cycle (current focus)
> **[PHASE 2]** — later

---

## 1) Executive Summary

ClawTrace is the debugging and reliability tool for OpenClaw agents. It captures every agent run as a tree of spans and makes it inspectable — so when a run fails, costs too much, or produces wrong output, you can see exactly what happened and why, instead of reading flat logs.

Positioning: the fastest way to debug a failing OpenClaw agent.
Initial wedge: OpenClaw operators who are blind when runs fail or costs spike.
Long-term position: the open control plane for agent reliability across frameworks.

### The core problem teams have today

1. What happened end to end in this run?
2. Why did this specific run fail?
3. Why did this run cost 40× more than usual?
4. What do I change to prevent recurrence?

Logs cannot answer these. They flatten agent execution — with its nested tool calls, sub-agents, and LLM calls — into a wall of JSON with no structure.

### North-star outcome

Reduce Mean Time To Resolution (MTTR) for agent incidents from hours to minutes.

---

## 2) Product Principles

1. **Causality over raw telemetry** — users need cause-and-effect, not bigger log files.
2. **Open-by-default architecture** — data stays in open formats and is portable.
3. **Human + agent debugging loop** — help humans inspect failures and help agents self-correct safely.
4. **Cost visibility is a product feature** — token, latency, and tool costs are first-class quality dimensions.
5. **Actionability beats dashboards** — every trace view should surface a next action.
6. **Cockpit-first UX, chat as a power tool** — the daily home is a trace/cockpit view; Tracy (AI analyst) is a power tool available on any page, not the primary entry point.
7. **Entity health over page sprawl** — users reason through first-class entities: agent, trace, span, tool call.
8. **Query all context** — agent failures hide in high-cardinality metadata; this context must remain queryable.
9. **Investigations are assets** — chats, charts, notes, and cited traces should become reusable artifacts.
10. **Open and composable control plane** — fit into existing telemetry and data ecosystems.
11. **State is part of runtime** — AGENTS.md, SOUL.md, memory, config, skills, and plugin versions are production state. Observability must capture them. *(Phase 1)*
12. **Evaluation must score process, not just outcome** — trajectory quality, efficiency, safety, and state integrity matter as much as final answer correctness. *(Phase 1+)*
13. **User feedback is ground truth, not decoration** — production feedback is a first-class signal for quality and prioritization. *(Phase 1+)*

---

## 3) ICP and Market Entry

### Primary ICP (first 12 months)

OpenClaw-heavy technical teams (1–20 engineers) running local or self-hosted agents with tool calling, long context, and memory.

Pain profile:
- Repeated agent mistakes
- Opaque runtime behavior
- No way to attribute failures across model/tool/context/memory
- Escalating token spend with weak reliability

### Secondary ICP

Startup AI product teams running multi-agent workflows (support automation, content ops, coding agents, internal copilots).

---

## 4) Product Scope

### V1 Jobs-to-be-Done

**1. Observe [SHIPPED]**
Every run recorded as a tree of spans with full inputs, outputs, token counts, latency, and cost per step. Three views per trace: Execution Path (call tree), Actor Map (entity graph), Step Timeline (Gantt), Run Efficiency (work index).

**2. Diagnose [SHIPPED: basic | PHASE 1: root-cause ranking]**
Tracy, a conversational AI analyst, queries your trajectory data in real time via Cypher over PuppyGraph. Ask "why did my last run cost so much?" and get a specific answer with charts and trace citations. Root-cause ranking and blast-radius analysis are Phase 1.

**3. Improve [SHIPPED: self-evolve API | PHASE 1: diff, eval, guardrails]**
`/v1/evolve/ask` lets OpenClaw agents query Tracy about their own trajectories and self-improve. The `clawtrace-self-evolve` skill wraps this for autonomous periodic review. Bad-vs-good run diff, A/B evaluation, and guardrails are Phase 1.

---

## 4.0 What Is Shipped (v1.0)

**Plugin and ingest**
- `@epsilla/clawtrace@0.1.22` — 8 hook types: `session_start`, `session_end`, `llm_input`, `llm_output`, `before_tool_call`, `after_tool_call`, `subagent_spawning`, `subagent_ended`
- `POST /v1/traces/events` — multi-tenant ingest, partitioned to cloud storage (Azure Blob / GCS / S3)

**Data pipeline**
- Databricks Lakeflow SQL pipeline → 8 Iceberg silver tables every ~3 minutes
- PuppyGraph virtualizing Delta Lake as Cypher-queryable graph (Tenant → Agent → Trace → Span)

**Trace views (all 4 shipped)**
- Execution Path — collapsible call tree with per-node cost badges
- Actor Map — force-directed graph of agents, tools, and models
- Step Timeline — Gantt chart of every span
- Run Efficiency — work index with cost/token breakdown

**Step detail**
- Full input/output payload per span
- Token counts (input, output, cache read, cache write)
- Cost estimate (80+ model pricing entries, cache-aware)
- Duration and error state

**Tracy AI analyst**
- `POST /v1/tracy` — conversational analysis over PuppyGraph trajectory data
- SSE streaming, multi-turn sessions via `session_id`
- Generates inline ECharts visualizations
- Context-aware: scopes to agent/trace/tenant automatically

**Self-evolve loop**
- `POST /v1/evolve/ask` — authenticates with observe key, lets agents query Tracy about their own trajectories
- `clawtrace-self-evolve@1.0.1` skill on ClawHub — teaches OpenClaw agents to self-improve autonomously
- HEARTBEAT.md integration for periodic automatic review

**Account infrastructure**
- Multi-tenant auth (JWT + observe keys)
- Credits billing (consumption-based, Stripe integration)
- Deficit guard (blocks ingest and Tracy if credits exhausted)
- Referral system

**Cost attribution [SHIPPED: per-span | PHASE 1: taxonomy + leak detection]**
- Token counts and cost estimate on every span
- Cost displayed at trace and step level
- Cost taxonomy classification (`invisible_overhead`, `misdirected_spend`, etc.) and leak detection are Phase 1

---

## 4.1 What Is Not Yet Shipped

### Phase 1 priorities (in order)

1. **Cost taxonomy and leak detection** — classify spend into `invisible_overhead`, `misdirected_spend`, `productive_spend`, `unknown`; surface top waste items in cockpit
2. **State Time Machine v0** — capture state vector (config hash, workspace file hashes, skill versions, plugin versions) on run start/end; run-to-run diff view inside trace detail
3. **Agent Health page** — synthesized status per agent combining error rate, cost trend, and recent Tracy findings (backend types exist; API endpoint pending)
4. **Investigation Workspace** — save/share chat + charts + notes + cited traces as persistent artifacts
5. **Structural trace queries** — search runs by span relationships (downstream tool calls, retry patterns, etc.)
6. **Budget guardrails** — daily/monthly caps, pre-threshold alerts, anti-cascade policies
7. **Sessions/threads rollups** — aggregate run-level telemetry into session-level user journeys and unit economics

### Phase 2

8. **Agent Eval** — run scorecards, golden datasets, trajectory evaluators, feedback capture
9. **Prebuilt OpenClaw dashboards** — operations, cost, failure modes
10. **Alert engine** — detector-backed alerts with Slack/Webhook notifications
11. **Bad-vs-good run diff** — compare two runs side by side
12. **State timeline explorer** — full entity timeline for config/memory/AGENTS.md/skills/plugins

---

## 4.2 Why Cockpit-First (Not Chat-First) for v1

The original spec called for chat-first UX. The shipped v1 is cockpit-first because:

1. The primary daily action is "scan traces and find the bad one" — a visual task best served by a trace list + cockpit view.
2. Tracy (the AI analyst) is most valuable as a power tool invoked on a specific trace or question, not as the entry point for browsing.
3. Onboarding friction is lower when users land on traces they can immediately click, rather than an empty chat interface.

Chat-first still applies to Tracy interactions: once a user has a specific question about a trace or a cost spike, conversation is the right interface. This is the model in v1 — cockpit as the daily home, Tracy as the investigative power tool.

Chat-first as the *primary navigation paradigm* (F1 guided audit, F10 conversational dashboards, etc.) remains the Phase 1 goal as Tracy's capabilities and user familiarity grow.

---

## 4.3 Conversational Observability Requirements [PHASE 1]

Must-have capabilities for Phase 1 chat-first evolution:

1. Ask and answer over traces — "Why did run_849 fail after the third tool call?" — returns evidence-backed answer with cited spans.
2. Dynamic visualization from prompts — "Graph p95 latency by tool for agent seo_writer over 7 days."
3. Alert creation by conversation — "Alert me when retry_count > 3 for publish_tool."
4. Trace-native drill-in — any answer can pivot into call tree or timeline at exact span ranges.
5. Explainable query planning — show how the answer was computed.

---

## 4.4 Market-Validated Product Decisions

1. **Agent Health is the center of gravity** — synthesize detector state, eval regressions, cost budget breaches, deployment changes, and incidents into one `Agent Health` surface. *(Phase 1)*
2. **Structural trace queries are mandatory** — search for runs by span relationships. *(Phase 1)*
3. **Investigation workspaces must be first-class** — combine chat, charts, notes, queries, and cited traces in a persistent shareable workspace. *(Phase 1)*
4. **Sessions and threads matter as much as spans** — roll up run-level telemetry into session-level behavior and unit economics. *(Phase 1)*
5. **Prebuilt dashboards from day one** — opinionated dashboards for OpenClaw operations, cost, and failure modes. *(Phase 1)*
6. **Production must feed evaluation** — failed traces promotable into datasets and regression tests. *(Phase 2)*
7. **State time machine is a core debugging primitive** — first-class state timeline and diff workflow closing the gap left by OpenClaw's fragmented versioning primitives. *(Phase 1)*
8. **Agent evaluation should be run-native** — scorecards tied directly to traces, state changes, and incidents. *(Phase 2)*

---

## V1 Surfaces (Shipped vs. Planned)

| Surface | Status |
|---------|--------|
| Trace View (Execution Path, Actor Map, Step Timeline, Run Efficiency) | **Shipped** |
| Tracy AI Analyst (conversational trace Q&A + charts) | **Shipped** |
| Self-Evolve API (`/v1/evolve/ask`) + ClawHub skill | **Shipped** |
| Per-span cost attribution (token counts + cost estimate) | **Shipped** |
| Multi-tenant auth + credits billing | **Shipped** |
| Agent Health page | Phase 1 |
| Cost taxonomy + leak detection | Phase 1 |
| State Time Machine (state diff + drift detection) | Phase 1 |
| Investigation Workspace (persistent save/share) | Phase 1 |
| Structural trace queries + saved views | Phase 1 |
| Budget guardrails + alert engine | Phase 1 |
| Sessions/threads rollups + unit economics | Phase 1 |
| Prebuilt OpenClaw dashboards | Phase 1 |
| Agent Eval (scorecards, golden datasets, feedback capture) | Phase 2 |
| Bad-vs-good run diff | Phase 2 |
| Multi-framework SDKs beyond OpenClaw | Phase 2 |

---

## 5) Business Spec

## 5.1 Open Source Strategy

Open Source (Apache 2.0) — shipped:
- `@epsilla/clawtrace` OpenClaw plugin
- Canonical trace/event schema
- Ingest service (self-hostable)
- Plugin SDK

Commercial Cloud — shipped:
- Multi-tenant hosted control plane at clawtrace.ai
- Consumption-based credits (no seat licenses)
- Tracy AI analyst

Commercial Cloud — planned:
- RBAC + SSO/SAML + SCIM
- Long retention, tiered storage, governance
- Advanced detectors and anomaly models
- Enterprise support + SLAs

## 5.2 OpenClaw Community Wedge

Wedge mechanics (all shipped):
1. Install in <5 minutes (`openclaw plugins install @epsilla/clawtrace`)
2. Instant value: trace tree + cost/latency + error visibility
3. Self-evolve skill for autonomous improvement loop

Community GTM in progress:
- YC Bookface launch
- Show HN
- Public "Agent Failure Cookbook" (planned)
- OpenClaw Health Score badge for repos (planned)

## 5.3 Growth Model

PLG funnel:
1. Developer installs plugin
2. Traces surface immediately; runs start appearing
3. Tracy surfaces a cost spike or failure pattern
4. Self-evolve skill kicks in; agent improves autonomously
5. Team shares traces; teammates onboard
6. Org standardizes on ClawTrace for agent reliability
7. Security/compliance triggers enterprise conversation

## 5.4 Packaging and Pricing

Current:
- **Free tier**: 200 credits at signup
- **Pay-as-you-go**: credits purchased, consumed per traced span and Tracy query
- **No seat licenses**

Planned:
- Pro Cloud: usage-based + team features
- Enterprise: annual contract + platform fee + committed usage

---

## 6) Technical Spec

## 6.1 Current Architecture (Shipped)

```
OpenClaw Agent
  → @epsilla/clawtrace plugin (8 hook types)
  → POST /v1/traces/events (ingest service, Bearer auth)
  → Cloud object storage (GCS/Azure/S3), partitioned by tenant/agent/date/hour
  → Databricks Lakeflow SQL → 8 Iceberg silver tables
  → PuppyGraph (Cypher over Delta Lake)
  → ClawTrace Backend (FastAPI) + Tracy (Anthropic managed agent + MCP)
  → ClawTrace UI (Next.js 15)
```

## 6.2 Why PuppyGraph on Iceberg

Agent execution data is naturally graph-shaped: agents invoke tools, sub-agents spawn recursively, errors propagate through dependencies. PuppyGraph virtualizes the Iceberg tables as a Cypher-queryable graph — no separate graph database, no ETL, no data duplication. Tracy runs live Cypher queries against the same data that powers the trace views.

## 6.3 Data Model (Current Silver Tables)

Shipped:
- `pg_traces` — one row per trace: tenant_id, agent_id, trace_id, start_time, end_time, total_tokens, input_tokens, output_tokens, has_error, status
- `pg_spans` — one row per span: span_id, trace_id, span_type, name, start_time, end_time, input_tokens, output_tokens, cost, status, error_message, input_payload, output_payload
- `pg_agents` — agent registry
- `pg_sessions` — session groupings
- `pg_tool_calls` — tool call detail
- `events_all` — raw event table (all hook types)

Planned for Phase 1:
- State snapshot fields: `state_snapshot_id`, `config_hash`, `workspace_commit_sha`, `workspace_file_hashes`, `skill_versions`, `plugin_versions`
- Session rollup tables: `pg_sessions_rollup`, `pg_thread_economics`

## 6.4 Detection Engine [PHASE 1]

Rule-based detectors (Phase 1):
- repeated tool failure loops
- exploding retries
- context window pressure
- latency bottleneck concentration
- cost anomaly per success

State drift detectors (Phase 1):
- detect behavior regressions after config/AGENTS.md/SOUL.md/memory/skill/plugin changes
- rank recent state changes by correlation with incident onset

## 6.5 Agent Evaluation Architecture [PHASE 2]

See `AGENT_EVALUATION_STRATEGY.md` for the full evaluation model. Phase 2 target: run scorecards on outcome, trajectory, efficiency, and safety.

## 6.6 Scalability Plan

Data growth target: 10M+ spans/day by end of year 1.

Approach:
- Partition Iceberg tables by date + tenant + event_family
- Z-order clustering by trace_id + timestamp for query locality
- Automatic compaction and file-size management
- Materialized aggregates for common dashboard queries
- Query federation with workload isolation (interactive vs. batch)

---

## 7) Roadmap

## Phase 0 — OpenClaw Wedge MVP [COMPLETE]

- OpenClaw plugin GA (`@epsilla/clawtrace@0.1.22`)
- Ingest pipeline (cloud storage → Databricks → PuppyGraph)
- 4-view trace detail (Execution Path, Actor Map, Step Timeline, Run Efficiency)
- Tracy AI analyst (`/v1/tracy` + MCP server)
- Self-evolve API (`/v1/evolve/ask`) + ClawHub skill (`clawtrace-self-evolve@1.0.1`)
- Per-span cost attribution
- Credits billing + Stripe integration
- Multi-tenant auth + observe keys
- Landing page + connect wizard + documentation

Exit status: Product is live at clawtrace.ai. Initial users onboarding.

## Phase 1 — Team Product [IN PROGRESS]

1. Cost taxonomy + leak detection (C1–C3 in cost journey)
2. State Time Machine v0 — state vector capture + run-to-run diff
3. Agent Health page with synthesized status
4. Investigation Workspace — persistent save/share artifacts
5. Budget guardrails and alert engine
6. Sessions/threads rollups + unit economics
7. Prebuilt OpenClaw dashboards
8. Structural trace query templates
9. Bad-vs-good run diff
10. Root-cause assistant with confidence scoring

Exit criteria:
- 20 active teams
- MTTR reduced ≥40% on target workflows
- Weekly active team retention ≥60%

## Phase 2 — Enterprise Readiness

- Agent Eval (scorecards, golden datasets, trajectory evaluators, feedback capture)
- SSO/SCIM/RBAC
- BYOC/VPC deployment
- Compliance package + audit tooling
- Multi-framework SDKs beyond OpenClaw

Exit criteria:
- 3 enterprise lighthouse customers
- First six-figure annual contract

---

## 8) Risks and Mitigations

1. **Risk: Community fragmentation across agent frameworks**
Mitigation: keep schema and ingest open; OpenClaw is the wedge, not the boundary.

2. **Risk: "just use existing APM" objection**
Mitigation: prove agent-specific causality and remediation workflows that generic APM cannot do.

3. **Risk: Graph query latency at high scale**
Mitigation: workload isolation, caching, precomputed neighborhoods, gold-table shortcuts.

4. **Risk: Commodity pressure from larger platforms**
Mitigation: open-data architecture + best-in-class diagnosis loops + community moat.

---

## 9) Definition of Success (12 Months)

ClawTrace is considered successful if:
- It is the default observability plugin recommended in OpenClaw community channels.
- Teams can diagnose most incidents without raw log spelunking.
- Most incidents produce a reusable artifact — investigation, dashboard, alert, or regression dataset.
- Teams use ClawTrace to turn production traces into golden datasets and score trajectory quality.
- Enterprise customers adopt it as a policy/governance layer for agent reliability.
- The architecture remains open, portable, and economically scalable.
