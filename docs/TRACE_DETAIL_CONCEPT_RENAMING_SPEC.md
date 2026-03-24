# ClawTrace Trace Detail Concept Mapping (OpenClaw Tracing -> ICP Language)

Last updated: 2026-03-24  
Owner: Product + Design  
Status: Draft v1 (ready to drive trace-detail implementation)

## 1) Why This Exists

We are integrating OpenClaw Tracing's Web UI model into ClawTrace, but our ICP is not a tracing engineer.

Primary ICP from product plan:
- founder/operators and small technical teams running revenue-adjacent OpenClaw agents

These users need answers to:
1. What happened in this run?
2. Why did quality/cost break?
3. What should I change now?

So we keep OpenClaw's data model, but we rename user-facing concepts to outcome-first language.

## 2) Source Concepts Reviewed

Reference: OpenClaw Tracing Web UI and related docs.

Core source concepts:
1. Call Tree: nested span hierarchy; collapse repeated same-tool calls.
2. Entity Graph: force graph of agents, tools, and models with spawn relations.
3. Waterfall: timeline bars for span start/end + duration.
4. Work Index: 0-100 productivity score (tool density + token efficiency + subagent bonus).
5. Auto-refresh: polling + highlight new spans.

## 3) Translation Layer (Required)

| OpenClaw term | ClawTrace internal term | ICP-facing UI label | Why this label works for ICP |
|---|---|---|---|
| Call Tree | `trace_call_tree` | **Execution Path** | "Path" is intuitive for operators and still accurate for hierarchy. |
| Entity Graph | `trace_entity_graph` | **Actor Map** | Emphasizes "who did what" across main agent, subagents, tools, models. |
| Waterfall | `trace_waterfall` | **Step Timeline** | Focuses on time + bottlenecks without infra jargon. |
| Work Index | `trace_work_index` | **Run Efficiency** | Keeps cost+action efficiency meaning without confusing "index" term. |

### Naming rule

1. Internal APIs and data objects may keep source-compatible names (`callTree`, `entityGraph`, etc.).
2. UI copy shown to users must use translated labels above.
3. Only expert tooltips may mention source terms in secondary text.

## 4) Detail Pane Renaming (Deep Dive)

The right-side/inline item detail should avoid raw tracing jargon as primary headers.

Use this mapping:

| Raw field | User-facing label |
|---|---|
| span | step |
| parentSpanId | parent step |
| sessionKey | run context |
| tool_call | tool action |
| llm_call | model step |
| attributes.error | failure signal |
| tokensIn / tokensOut | input / output tokens |

### Structured sections per selected item

1. **What happened**
- step type, actor, status, start/end/duration

2. **Cost and load**
- input tokens, output tokens, estimated cost

3. **Inputs used**
- tool params or model request metadata

4. **Outputs produced**
- tool result metadata or model response metadata

5. **Action to improve**
- one recommended change linked to reliability or cost control

## 5) Run Efficiency (Work Index) Guardrails

We should keep OpenClaw's formula-compatible behavior, but shift user interpretation language.

### Internal computation
- keep source-compatible score logic so results remain comparable

### User-facing bands
- 61-100: **Efficient**
- 26-60: **Active but heavy**
- 1-25: **High spend, low progress**
- 0: **Idle**

### Copy rule
Do not say "spinning" in the default UI. Use "high spend, low progress" and show the evidence (tools per model step, tokens per successful action).

## 6) Tracy Conversation Framing for Trace Detail

For this page, Tracy should be run-quality focused (not generic observability assistant framing).

Default seeded conversation style:
1. user asks quality/cost question about this run
2. Tracy answers with:
- short verdict
- top evidence (1-3 data points)
- one clickable step link early in the answer
- two concrete actions with expected impact

### Example prompt style
- "What made this run expensive but still unstable?"
- "Show me the most likely failure step and what to change first."

### Example response shape
1. Verdict line
2. Evidence bullets
3. "Hottest step" inline link
4. Actions list

## 7) UI/Copy Constraints from Current Product Direction

From existing ClawTrace plan and shipped copy direction:
1. Avoid niche tracing vocabulary in primary labels.
2. Keep cost and quality together on same page.
3. Prioritize next actions over pure telemetry.
4. Keep terms stable with Overview and Control journey docs.

## 8) Implementation Notes (Next Step)

When building trace detail page:
1. 4-mode switcher labels must be:
- Execution Path
- Actor Map
- Step Timeline
- Run Efficiency

2. Mode descriptions should stay one line and outcome-oriented.

3. Extensible detail pane must support current fields now and future full request/response payload capture later.

4. If a payload was not collected, show explicit state:
- "Not captured in this run" (not empty block).

## 9) Non-Goals (for this translation pass)

1. Changing underlying storage schema.
2. Rewriting OpenClaw scoring formula.
3. Hiding advanced data from power users.

The goal is language and UX alignment to ICP, not data model divergence.
