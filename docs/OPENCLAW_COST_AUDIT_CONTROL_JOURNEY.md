# OpenClaw Cost Audit and Cost Control Journey (ClawTrace)

Last updated: 2026-04-14
Owner: Product + Engineering
Status: C0–C1 shipped. C2–C7 are Phase 1.

---

## Implementation Status Key

> **[SHIPPED]** — live in production
> **[PHASE 1]** — next build cycle
> **[PHASE 2]** — later

---

## 1) Why This Exists

This document translates a detailed operator walkthrough of OpenClaw cost optimization into a productized ClawTrace journey.

Goal: make cost control repeatable for normal users, not only power users who manually inspect raw provider logs.

---

## 2) What Is Shipped Today

### C0 — Connect Cost Data [SHIPPED]

The `@epsilla/clawtrace` plugin captures token counts on every LLM call:
- `usage.input` — fresh input tokens
- `usage.output` — output tokens
- `usage.cacheRead` — cached input tokens (~10% cost)
- `usage.cacheWrite` — tokens written to cache

Cost precision class: **estimated** (computed from model pricing table with 80+ entries). Billed reconciliation is Phase 1.

### C1 — Baseline Audit [SHIPPED]

Every trace shows:
- Total tokens (input + output + cache)
- Estimated cost per span
- Cost visible at trace level and step level
- Per-step breakdown in Step Timeline and Step Detail panel

Users can ask Tracy today: "Why did this run cost so much?" and get a specific per-span breakdown with charts.

### C3 — Root-Cause Drilldown (partial) [SHIPPED via Tracy]

Tracy can answer:
- "Which step cost the most in this trace?"
- "Is my context window growing across sessions?"
- "Which tool is taking the longest or failing most often?"
- "Analyze my last 10 trajectories — where is cost concentrated?"

Tracy does not yet classify spend into taxonomy buckets (C2 is Phase 1).

### C4 — Control Recommendation (basic) [SHIPPED via self-evolve]

`/v1/evolve/ask` and the `clawtrace-self-evolve` skill let agents query Tracy about their own cost patterns and apply fixes. Tracy identifies the highest-impact recommendation (e.g., "truncate tool output to 8,000 chars — will cut 98% of token spikes").

---

## 3) What Is Phase 1

### C2 — Leak Detection [PHASE 1]

Ranked list of obvious waste:
- Background loop overhead (heartbeat sessions accumulating history)
- Context bloat (one call consuming 10× median tokens)
- Model mismatch (premium model used for a 3-token response)
- Retry loop inflation (same tool called 8 times in one run)

Displayed as cockpit cards: "Top 3 cost drains this week."

### C5 — Safe Apply + Verify [PHASE 1]

After applying a cost control:
- Before/after cost-per-success comparison
- Before/after avoidable-spend ratio
- Requires State Time Machine for pre-mutation snapshot

### C6 — Budget Guardrails [PHASE 1]

- Daily/monthly budget caps per agent
- Pre-threshold alerts (Slack/webhook)
- Anti-cascade policies: max retries, max search fan-out, minimum call delay
- Spike detection: alert when a single run exceeds N× moving average

### C7 — Weekly Optimization Loop [PHASE 2]

- Week-over-week cost-per-success trend
- Savings attribution per control applied
- Scheduled efficiency report

---

## 4) Extracted Practitioner Insights

Eight practical truths from OpenClaw operator interviews:

1. **Total bill is not enough.** Users need per-call attribution: what triggered a call, how much it consumed, and whether it produced useful output.

2. **Spend naturally splits into categories.** The observed pattern is usually: invisible overhead, real work with wrong cost profile, productive spend.

3. **Background automation can silently dominate cost.** Heartbeat-style checks loading full context repeatedly can consume large spend unrelated to user tasks. *Confirmed in production: one agent went from 88,902 to 4,046 input tokens per call after removing a stale BOOTSTRAP.md file and fixing context accumulation.*

4. **Context loading policy is a major cost lever.** Preloading full history and archives on every message creates recurring overhead unrelated to user intent.

5. **Model-to-task mismatch causes overpayment.** Using premium models for low-complexity tasks creates avoidable spend without quality gain.

6. **Cost discipline needs guardrails, not one-time cleanup.** Without budget caps and loop controls, one bad automation path can drain credits quickly.

7. **Caching is multiplicative.** Stable prompt/context caching amplifies every upstream optimization.

8. **Loop-back behavior and over-agentic deterministic tasks are expensive.** Scripting repeatable steps reduces avoidable retries, latency, and spend.

---

## 5) ClawTrace Cost Taxonomy [PHASE 1]

For each workflow/run/step, ClawTrace will classify spend into four buckets:

1. `invisible_overhead` — background checks, system/session refreshes, context/memory compilation with low direct user value
2. `misdirected_spend` — valid task, wrong model tier / bloated context / excessive retries or fan-out
3. `productive_spend` — user-intended work, output accepted/used, cost and latency within policy
4. `unknown_spend` — insufficient telemetry to classify confidently (explicit, never silently merged)

---

## 6) User Journey Overlay

This overlay runs inside existing flows F0–F12 from `USER_JOURNEY_FLOW_SPEC.md`.

| Cost Flow | Status | Primary User Intent | Maps to Flow |
|---|---|---|---|
| C0 Connect Cost Data | **Shipped** | "Can ClawTrace see my spend?" | F0 |
| C1 Baseline Audit | **Shipped** | "Where did spend go in this run?" | F1–F3 |
| C2 Leak Detection | **Phase 1** | "What is clearly waste?" | F2–F3 |
| C3 Root-Cause Drilldown | **Shipped** (Tracy) | "Why is this workflow expensive?" | F3–F5 |
| C4 Control Recommendations | **Shipped** (self-evolve) | "What should I change first?" | F5–F6 |
| C5 Safe Apply + Verify | **Phase 1** | "Can I apply without breaking quality?" | F6–F7 |
| C6 Guardrails | **Phase 1** | "How do I avoid surprise bills?" | F3–F10 |
| C7 Weekly Loop | **Phase 2** | "Are we getting more efficient?" | F8–F11 |

---

## 7) Productized Control Library [PHASE 1]

ClawTrace will offer these as guided controls, not hidden config trivia:

1. **Background Routing Control** — route low-intelligence background checks to low-cost/local path
2. **Context Loading Control** — define startup load allowlist; keep archives/history on-demand
3. **Model Routing Control** — default lower-cost model for routine tasks; escalate on complexity rules
4. **Context Hygiene Control** — detect oversized always-loaded files (e.g., stale BOOTSTRAP.md); suggest concise operating core
5. **Budget Guardrail Control** — daily/monthly caps + pre-threshold alerts + anti-cascade policies
6. **Stable Context Caching Control** — mark stable context for cache eligibility; flag cache-break patterns
7. **Loop-Back and Oscillation Control** — detect repeated back-and-forth trajectories with low marginal value
8. **Determinism Scriptification Control** — identify steps that repeatedly succeed via fixed patterns; recommend script handoff

---

## 8) Core UX Requirements

### Cost in onboarding [PHASE 1]
- Show baseline split by taxonomy buckets
- Call out top 3 avoidable drains immediately

### Cost in cockpit [SHIPPED (basic) / PHASE 1 (taxonomy)]
- Per-span cost visible in every trace view
- Phase 1: glance card with cost-per-success and avoidable-spend ratio

### Cost in incident triage [SHIPPED via Tracy]
- Tracy shows failure impact and spend impact together
- "Expensive but successful" is a first-class investigation mode

### Cost in chat actions [SHIPPED]
- "Why did this run cost 3× normal?"
- "Which step ate most of the budget in trace {id}?"
- Phase 1: "Create guardrail from this spike" / "Show me last week vs. this week savings"

---

## 9) Phase 1 Scope (Must Ship)

1. Cost taxonomy classification (`invisible_overhead`, `misdirected_spend`, `productive_spend`, `unknown`)
2. Workflow-level and trajectory-level spend attribution
3. Top leak detector cards: background loop overhead, context bloat, model mismatch, retry loop inflation
4. Guided recommendation actions with manual confirmation
5. Budget guardrails with alerting
6. Cost-per-success metric

## 10) Phase 1 Acceptance Criteria

1. User can identify highest-cost workflow in under 30 seconds.
2. User can explain at least 70% of spend via taxonomy buckets; unexplained spend explicitly marked `unknown`.
3. User can apply one control recommendation in under 2 minutes.
4. User sees before/after change in cost-per-successful-run.
5. Budget threshold alert triggers before daily cap breach.

## 11) Not in Phase 1

1. Fully automatic self-editing without operator confirmation
2. Provider-perfect billed reconciliation across all model providers
3. Organization-wide chargeback allocation
4. Fully autonomous cost optimization loops

---

## 12) Self-Evolve Delivery Path [SHIPPED]

The closed-loop cost control path is live today via the self-evolve API:

1. OpenClaw agent uses `clawtrace-self-evolve` skill to detect a cost spike trigger.
2. Agent calls `/v1/evolve/ask` with the cost spike question template.
3. Tracy queries live trajectory data and returns the root cause with a specific fix.
4. Agent applies the fix (e.g., output truncation, context trim, retry cap).
5. Agent logs the change to MEMORY.md.
6. Next run reflects the improvement.

Phase 1 adds: pre-mutation snapshot, rollback pointer, before/after verification, and the evolution ledger.
