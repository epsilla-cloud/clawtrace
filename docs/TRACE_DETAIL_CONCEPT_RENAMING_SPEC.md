# ClawTrace Trace Detail Concept Mapping (OpenClaw Tracing → ICP Language)

Last updated: 2026-04-14 (original: 2026-03-24)
Owner: Product + Design
Status: Implemented and live.

---

## 1) Why This Exists

Our ICP is not a tracing engineer. Primary ICP: founder/operators and small technical teams running revenue-adjacent OpenClaw agents.

These users need answers to:
1. What happened in this run?
2. Why did quality/cost break?
3. What should I change now?

So we keep OpenClaw's data model, but we rename user-facing concepts to outcome-first language.

---

## 2) Translation Layer [IMPLEMENTED]

All four views are live in the trace detail page.

| OpenClaw term | ClawTrace internal term | ICP-facing UI label | Status |
|---|---|---|---|
| Call Tree | `trace_call_tree` | **Execution Path** | **Shipped** |
| Entity Graph | `trace_entity_graph` | **Actor Map** | **Shipped** |
| Waterfall | `trace_waterfall` | **Step Timeline** | **Shipped** |
| Work Index | `trace_work_index` | **Run Efficiency** | **Shipped** |

### Naming rule (active)

1. Internal APIs and data objects keep source-compatible names (`callTree`, `entityGraph`, etc.).
2. UI copy shown to users uses the translated labels above.
3. Only expert tooltips may mention source terms in secondary text.

---

## 3) Detail Pane Renaming [IMPLEMENTED]

The step detail panel uses operator-friendly labels:

| Raw field | User-facing label |
|---|---|
| span | step |
| parentSpanId | parent step |
| sessionKey | run context |
| tool_call | tool action |
| llm_call | model step |
| attributes.error | failure signal |
| tokensIn / tokensOut | input / output tokens |

### Structured sections per selected item [IMPLEMENTED]

1. **What happened** — step type, actor, status, start/end/duration
2. **Cost and load** — input tokens, output tokens, estimated cost
3. **Inputs used** — tool params or model request metadata
4. **Outputs produced** — tool result metadata or model response metadata
5. **Action to improve** — one recommended change linked to reliability or cost control *(Phase 1 — currently empty; Tracy in the panel serves this role)*

If a payload was not collected: shows "Not captured in this run" (not empty block).

---

## 4) Run Efficiency (Work Index) Bands [IMPLEMENTED]

| Score | Band | User-facing label |
|---|---|---|
| 61–100 | High efficiency | **Efficient** |
| 26–60 | Moderate | **Active but heavy** |
| 1–25 | Low | **High spend, low progress** |
| 0 | Idle | **Idle** |

Copy rule: do not say "spinning." Use "high spend, low progress" and show the evidence (tools per model step, tokens per successful action).

---

## 5) Tracy Conversation Framing for Trace Detail [IMPLEMENTED]

Tracy is run-quality focused on this page. Default conversation style:

1. User asks quality/cost question about this run.
2. Tracy answers with:
   - Short verdict
   - Top evidence (1–3 data points)
   - One clickable step link early in the answer
   - Two concrete actions with expected impact

Example prompts that work well:
- "What made this run expensive but still unstable?"
- "Show me the most likely failure step and what to change first."
- "Why did step 4 fail?"

---

## 6) UI/Copy Constraints (Active)

1. Avoid niche tracing vocabulary in primary labels.
2. Keep cost and quality together on the same page.
3. Prioritize next actions over pure telemetry.
4. Keep terms stable with Overview and Control journey docs.

---

## 7) Phase 1 Additions

- "Action to improve" section in detail pane: one recommended change from Tracy pre-loaded based on the step's pattern.
- State diff panel: show what changed in config/memory/skills between this run and the last good run.

---

## 8) Non-Goals

1. Changing underlying storage schema.
2. Rewriting OpenClaw scoring formula.
3. Hiding advanced data from power users.

The goal is language and UX alignment to ICP, not data model divergence.
