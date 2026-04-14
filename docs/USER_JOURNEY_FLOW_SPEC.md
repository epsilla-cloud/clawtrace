# ClawTrace User Journey Flow Spec

Last updated: 2026-04-14
Owner: Product + Design + Engineering
Status: Live — Phase 0 flows shipped. Phase 1 flows in progress.

---

## Implementation Status Key

> **[SHIPPED]** — live in production
> **[PHASE 1]** — next build cycle
> **[PHASE 2]** — later

---

## 1) Why This Exists

This document defines the end-to-end user journey across ClawTrace flows, starting from onboarding.

Primary objective: move users from "agent feels like a black box" to "I can diagnose and fix failures quickly, and repeated failures decline over time."

---

## 2) Journey Principles

1. Onboarding is a guided connection, not a generic setup wizard.
2. Daily home is a cockpit/trace view, not a chat app. Tracy (AI analyst) is a power tool invoked on specific questions.
3. Every unhealthy state must end in a clear next action.
4. Known vs. unknown evidence must always be explicit.
5. Incidents should become reusable assets (regression tests, alerts, runbooks), not one-off fire drills. *(Phase 1)*
6. Cost must be explainable in the same flow as reliability, not in a separate dashboard context.
7. The product should progress from observe → recommend → safe self-improve, never jumping straight to blind autonomy.

---

## 3) System Flows — Status Overview

| Flow | Status | Primary Surface | User Question |
|---|---|---|---|
| F0 Entry + Connect | **Shipped** | Connect wizard | "Can ClawTrace see my agent?" |
| F1 Guided Audit Warmup | **Shipped** (basic) | Dashboard after connect | "What runs have I had?" |
| F2 First Value Handoff | **Shipped** | Trace list + cockpit | "What should I look at first?" |
| F3 Daily Overview | **Shipped** | Trace list + cockpit | "Are we healthy and within budget?" |
| F4 Live Run Monitoring | **Partial** | Run timeline | "What is happening right now?" |
| F5 Incident Triage | **Shipped** | Trace detail + Tracy | "Why did this fail?" |
| F6 Action + Intervention | **Shipped** (self-evolve) | Self-evolve skill | "What is the safest next step?" |
| F7 Verification + Closure | **Phase 1** | Verification breakdown | "Did this actually work?" |
| F8 Regression + Eval | **Phase 2** | Incident → Eval promotion | "How do we prevent recurrence?" |
| F9 Drift + Time Machine | **Phase 1** | State diff + version timeline | "What changed in config/memory/skills?" |
| F10 Conversational Automation | **Phase 1** | Tracy in investigation drawer | "Create dashboard/alert from this" |
| F11 Feedback Capture | **Phase 2** | Inline feedback controls | "Was this useful/correct?" |
| F12 Closed-Loop Improvement | **Shipped** (basic via self-evolve) | Self-evolve API + OpenClaw skill | "Can the agent improve itself safely?" |

---

## 3.1 Navigation Information Architecture

Left navigation is a persistent app rail across onboarding and operations pages. It is function-first.

### Current shipped structure

The app rail has:
1. Trace list / portfolio view
2. Trace detail (4-view cockpit)
3. Tracy AI chat panel
4. Account / billing / keys

### Phase 1 additions

Full functional rail:
1. Setup & Baseline
2. Daily Operations (trace list + cockpit)
3. Diagnose Issues (incident triage + drift/time-machine)
4. Resolve & Verify (action + verification)
5. Prevention & Eval (regression + eval)
6. Automation (conversational dashboard/alert creation)
7. Feedback Loop

---

## 4) Detailed Flow Specs

## F0 Entry + Connect [SHIPPED]

### Goal
Establish trustworthy data access with minimal friction.

### Current implementation
1. User creates an account at clawtrace.ai.
2. Connect wizard generates an observe key.
3. User installs `@epsilla/clawtrace` plugin and runs `openclaw clawtrace setup`.
4. User restarts the gateway.
5. First run streams automatically; trace appears in the dashboard.

### Time to first trace
Typical: 8–10 minutes from account creation to first trace visible.

### Exit criteria
- Plugin installed and observe key configured
- At least one run has streamed to ClawTrace

---

## F1 Guided Audit Warmup [SHIPPED — basic]

### Goal
Show users their existing run history so they have immediate context.

### Current implementation
- Runs appear automatically after plugin install.
- Tracy can be asked "analyze my recent trajectories" immediately.
- No interactive warmup chat or guided contract building yet (Phase 1).

### Phase 1 additions
- Backfill analysis of last 7–14 days
- Inferred workflow baseline (token spend, error rate, cost per run)
- Initial trust-state per discovered workflow
- "Known vs. unknown" coverage indicator

---

## F2 First Value Handoff [SHIPPED]

### Goal
Land user directly into "what to look at now."

### Current implementation
- Trace list shows recent runs with status, cost, duration.
- User clicks a trace to open the 4-view cockpit.
- Tracy panel is available for immediate questions.

### Phase 1 improvement
- Primary next action card on cockpit landing
- Spend concentration highlight ("this trace cost 40× your average")

---

## F3 Daily Overview [SHIPPED]

### Goal
Support calm daily operations with fast triage.

### Current implementation
1. Trace list shows all recent runs with status indicators.
2. User clicks into any run to open trace detail (Execution Path, Actor Map, Step Timeline, Run Efficiency).
3. Cost visible at trace level (total tokens + estimated cost).
4. Tracy accessible in any trace for deeper questions.

### Phase 1 additions
- Workflow portfolio view (agent-level health summary)
- Spend attribution by workflow/agent/model
- Budget pressure indicator

---

## F4 Live Run Monitoring [PARTIAL]

### Goal
Make in-flight execution legible without log diving.

### Current implementation
- Trace detail views populate after run completes.
- SSE streaming for in-progress updates: partial (backend has SSE; frontend live refresh is limited).

### Phase 1 completion
- Real-time trust-state updates during active run
- Control-plane intervention signals (allow/deny/defer/warn)
- Live span streaming as hooks fire

---

## F5 Incident Triage [SHIPPED]

### Goal
Reach an evidence-backed diagnosis quickly.

### Current implementation
1. User opens a failed trace.
2. Error spans highlighted in Execution Path view.
3. Step detail shows full input/output payload, error message, token counts.
4. Tracy available for: "Why did this fail?" / "Which step caused this?" / "What should I change?"
5. Tracy returns specific span citations, charts, and a concrete recommendation.

### Tracy questions that work today
- "Why did my last run cost so much?"
- "Which tool is failing most often?"
- "What caused the failure in trace {trace_id}?"
- "Which step took the most time?"
- "Is my context window growing across sessions?"

### Phase 1 additions
- Auto-generated incident memo draft
- Evidence stack: timeline, tool/model calls, state diffs, verifier results
- Distinction between runtime failure vs. state drift vs. cost-inefficient retry loop
- Prioritized next action list

---

## 4.1 Trace Detail View Language Contract [SHIPPED]

When a user opens a specific run trace for deep dive, ClawTrace uses ICP-facing labels:

1. **Execution Path** (source concept: Call Tree)
2. **Actor Map** (source concept: Entity Graph)
3. **Step Timeline** (source concept: Waterfall)
4. **Run Efficiency** (source concept: Work Index)

All four views are implemented and live. Reference: `TRACE_DETAIL_CONCEPT_RENAMING_SPEC.md`.

---

## F6 Action + Intervention [SHIPPED via self-evolve]

### Goal
Execute the safest next step with control.

### Current implementation (self-evolve path)
1. OpenClaw agent calls `/v1/evolve/ask` with its observe key.
2. Tracy analyzes the agent's own trajectory data and returns a specific recommendation.
3. Agent applies the fix (e.g., truncate context, cap tool output size).
4. Agent logs the change to MEMORY.md.

### Available action types today
- Apply Tracy's recommendation (context trim, output cap, retry limit)
- Manual code/config change informed by trace evidence

### Phase 1 additions
- Rollback/pin state version (requires State Time Machine)
- Contract/policy adjustment via UI
- Explicit operator confirmation workflow with safety controls
- Pre-mutation state snapshot

---

## F7 Verification + Closure [PHASE 1]

### Goal
Prove whether a fix worked.

### Planned implementation
- Show counts and breakdown: `x/y success`, `z/y fail`, `w/y unknown`
- Allow `Partially Verified` with explicit unknowns
- Preserve verifier-level evidence links
- Before/after cost comparison per control applied

---

## F8 Regression + Eval [PHASE 2]

### Goal
Turn incidents into prevention assets.

### Planned implementation
1. Promote incident trace to regression candidate.
2. Attach expected outcomes + trajectory constraints.
3. Add to workflow scorecard and release gate.

See `AGENT_EVALUATION_STRATEGY.md` for the full evaluation model.

---

## F9 Drift + Time Machine [PHASE 1]

### Goal
Explain long-horizon behavior drift.

### Planned implementation
1. Capture state vector on run start/end: config hash, workspace file hashes, skill versions, plugin versions.
2. Run-to-run diff inside trace investigation.
3. Correlation between state changes and incident onset.
4. Last-known-good comparison view.
5. Offer rollback or forward-fix.

See `OPENCLAW_STATE_VERSIONING_RESEARCH.md` for the full design.

---

## F10 Conversational Automation [PHASE 1]

### Goal
Let users create observability assets from natural language.

### Planned outcomes
- Create dashboard from trace query
- Create alert rule from incident pattern
- Create cost guardrail alert from spend spike pattern
- Create shareable investigation brief

### Current partial implementation
Tracy can answer these questions conversationally today. Saving answers as persistent dashboard/alert artifacts is Phase 1.

---

## F11 Feedback Capture [PHASE 2]

### Goal
Use user signal to improve reliability recommendations.

### Planned inputs
- Explicit: thumbs up/down, "wrong diagnosis", "helpful"
- Implicit: manual override, repeated retry loops, time-to-resolution

---

## F12 Closed-Loop Improvement [SHIPPED — basic]

### Goal
Convert passive observability into safe, auditable agent improvement.

### Current implementation
1. `/v1/evolve/ask` endpoint — agents query Tracy about their own trajectories.
2. `clawtrace-self-evolve@1.0.1` skill on ClawHub — teaches agents to detect triggers (cost spike, failure, periodic review) and call Tracy automatically.
3. HEARTBEAT.md integration — periodic autonomous review without user prompting.

The agent-driven self-improvement loop is live. The auditable mutation trail (pre-mutation snapshot, rollback pointer, evolution ledger) is Phase 1.

### Required safety constraints (current)
1. Recommendations require human confirmation for structural changes.
2. Mutations tracked in MEMORY.md by the agent.
3. Recommendations include confidence + expected tradeoff.

### Phase 1 additions
- Pre-mutation snapshot hook (block mutation without snapshot)
- Rollback pointer and reason trail
- Version-aware A/B evaluation before promoting a new state
- Evolution ledger (chronological history of recommendations, applied changes, outcomes, reversions)

---

## 5) Transition Map

```mermaid
stateDiagram-v2
    [*] --> F0_Connect
    F0_Connect --> F3_DailyControlRoom: first trace appears

    F3_DailyControlRoom --> F4_LiveRun: run starts
    F3_DailyControlRoom --> F5_IncidentTriage: user opens a failed trace

    F4_LiveRun --> F3_DailyControlRoom: run completes
    F4_LiveRun --> F5_IncidentTriage: failure detected

    F5_IncidentTriage --> F6_Action: recommendation accepted
    F5_IncidentTriage --> F12_SelfEvolve: agent queries /v1/evolve/ask

    F6_Action --> F3_DailyControlRoom: change applied
    F12_SelfEvolve --> F3_DailyControlRoom: recommendation applied + logged

    note right of F1_Warmup: Phase 1 — guided baseline audit
    note right of F7_Verification: Phase 1 — before/after proof
    note right of F9_DriftTimeMachine: Phase 1 — state diff + drift detection
    note right of F8_RegressionEval: Phase 2 — eval studio + golden datasets
```

---

## 6) Cost Audit and Cost Control Overlay

Cost control is not a separate app section. It overlays the same journey and surfaces.

| Cost Step | Status | User Question |
|---|---|---|
| C0 Connect Cost Data | **Shipped** | "Can ClawTrace see my spend?" |
| C1 Baseline Audit | **Shipped** | "Where did spend go in this run?" |
| C2 Leak Detection | **Phase 1** | "What is obvious waste?" |
| C3 Root-Cause Drilldown | **Shipped** (via Tracy) | "Why is this run expensive?" |
| C4 Control Recommendation | **Shipped** (via self-evolve) | "What should I change first?" |
| C5 Safe Apply + Verify | **Phase 1** | "Did this reduce spend safely?" |
| C6 Guardrails | **Phase 1** | "How do I prevent surprise bills?" |
| C7 Weekly Loop | **Phase 2** | "Are we improving?" |

Reference: `OPENCLAW_COST_AUDIT_CONTROL_JOURNEY.md`.

---

## 7) Phase 1 Build Sequence

1. F9: State Time Machine v0 — state vector capture + diff view inside trace detail.
2. F3 improvement: Cost taxonomy + leak detection in cockpit.
3. F7: Verification + closure states.
4. F10: Conversational artifact generation (save as dashboard/alert).
5. F4 completion: Live run monitoring with real-time span streaming.

---

## 8) Product KPIs By Journey

Shipped metrics (measurable today):
- Time to first trace (F0)
- Token/cost per run
- Tracy session engagement rate
- Self-evolve skill adoption rate

Phase 1 metrics:
- MTTR incident (F5 → F7)
- Repeat-failure rate per workflow (F7/F8)
- Cost per successful run
- Avoidable-spend ratio
- Daily triage time (F3)

---

## 9) Out of Scope

- Multi-framework onboarding beyond OpenClaw in Phase 1
- Deep enterprise admin console design (separate doc)
- Autonomous self-healing without operator-visible control points
