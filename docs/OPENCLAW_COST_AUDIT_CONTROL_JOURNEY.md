# OpenClaw Cost Audit and Cost Control Journey (ClawTrace)

Last updated: 2026-03-24  
Owner: Product + Engineering  
Status: Draft v1 (scope-ready for Phase 1)

## 1) Why This Exists

This document translates a detailed operator walkthrough of OpenClaw cost optimization into a productized ClawTrace journey.

Goal: make cost control repeatable for normal users, not only power users who manually inspect raw provider logs.

## 2) Extracted Practitioner Insights

The source walkthrough repeatedly showed eight practical truths:

1. Total bill is not enough.
Users need per-call attribution: what triggered a call, how much it consumed, and whether it produced useful output.

2. Spend naturally splits into categories.
The observed pattern is usually:
- invisible overhead
- real work done with wrong cost profile
- productive spend

3. Background automation can silently dominate cost.
Heartbeat-style checks and background refresh loops can consume large spend when they load full context repeatedly.

4. Context loading policy is a major cost lever.
Preloading full history and archives on every message creates recurring overhead unrelated to user intent.

5. Model-to-task mismatch causes overpayment.
Using premium models for low-complexity tasks creates avoidable spend without quality gain.

6. Cost discipline needs guardrails, not one-time cleanup.
Without budget caps, call pacing, and loop controls, one bad automation path can drain credits quickly.

7. Caching is multiplicative.
Prompt/context caching increases the benefit of every upstream optimization when stable context is kept stable.

8. Teams that win treat agents as infrastructure.
They run cost audits, enforce controls, and continuously improve routing and workload shape.

## 3) ClawTrace Cost Taxonomy (OpenClaw)

For each workflow/run/step, ClawTrace classifies spend into four buckets:

1. `invisible_overhead`
- background checks
- system/session refreshes
- context/memory compilation with low direct user value

2. `misdirected_spend`
- valid task, wrong model tier
- valid task, bloated context payload
- valid task, excessive retries or fan-out

3. `productive_spend`
- user-intended work
- output accepted/used
- cost and latency within policy

4. `unknown_spend`
- insufficient telemetry to classify confidently
- must be explicit, never silently merged

## 4) Cost Audit Questions in Product

Every cost audit view must answer:

1. What triggered this spend?
2. How much did it cost (tokens + USD)?
3. Did it create useful output?

If any answer is missing, state `unknown` and show why.

## 5) User Journey Overlay: Cost Audit and Cost Control

This overlay runs inside existing flows `F0-F11` from [USER_JOURNEY_FLOW_SPEC](/Users/songrenchu/ClawWork/Projects/clawtrace/docs/USER_JOURNEY_FLOW_SPEC.md).

| Cost Flow | Primary User Intent | Core Product Output | Maps to Existing Flow |
|---|---|---|---|
| C0 Connect Cost Data | "Can ClawTrace see real spend?" | provider usage ingest health + precision (`billed`/`estimated`) | F0 |
| C1 Baseline Audit | "Where did spend go last 7-14 days?" | workflow-level spend baseline + category split | F1 |
| C2 Leak Detection | "What is clearly waste?" | ranked leak list (background overhead, retry loops, context bloat) | F2/F3 |
| C3 Root-Cause Drilldown | "Why is this workflow expensive?" | trajectory and step-level attribution with trigger evidence | F3/F5 |
| C4 Control Recommendations | "What should I change first?" | prioritized cost controls with confidence and expected impact | F5/F6 |
| C5 Safe Apply | "Can I apply without breaking quality?" | policy update preview + risk note + rollback point | F6/F7/F9 |
| C6 Guardrails | "How do I avoid surprise bills?" | budgets, pacing, and spike alerts | F3/F10 |
| C7 Weekly Optimization Loop | "Are we getting more efficient?" | week-over-week cost-per-success and savings attribution | F8/F11 |

## 6) Productized Control Library (from Practitioner Fixes)

ClawTrace should offer these as guided controls, not hidden config trivia:

1. Background Routing Control
- route low-intelligence background checks to low-cost/local path
- objective: minimize paid overhead and preserve paid rate limits for user tasks

2. Context Loading Control
- define startup load allowlist
- keep archives/history/tool dumps on-demand instead of preload

3. Model Routing Control
- default lower-cost model for routine tasks
- escalate only on explicit complexity rules

4. Context Hygiene Control
- detect oversized always-loaded files
- suggest concise operating core + deferred reference files

5. Budget Guardrail Control
- daily/monthly budget caps
- pre-threshold alerts
- anti-cascade policies (max retries, max search fan-out, minimum call delay)

6. Stable Context Caching Control
- mark stable context for cache eligibility
- flag cache-break patterns (frequent edits to stable instructions)

## 7) Core UX Requirements

1. Cost in onboarding
- show baseline split by taxonomy buckets
- call out top 3 avoidable drains immediately

2. Cost in cockpit
- one glance card: total spend, cost-per-success, avoidable-spend ratio
- drilldown into workflow -> trajectory -> step

3. Cost in incident triage
- show failure impact and spend impact together
- include "expensive but successful" as a first-class investigation mode

4. Cost in chat actions
- "Create guardrail from this spike"
- "Show me last week vs this week savings by control"
- "Why did this run cost 3x normal?"

## 8) Phase 1 Scope (Must Ship)

1. Cost taxonomy classification (`invisible_overhead`, `misdirected_spend`, `productive_spend`, `unknown`)
2. Workflow-level and trajectory-level spend attribution
3. Top leak detector cards:
- background loop overhead
- context bloat
- model mismatch
- retry loop inflation
4. Guided recommendation actions with manual confirmation
5. Budget guardrails with alerting
6. Weekly efficiency report

## 9) Phase 1 Acceptance Criteria

1. User can identify highest-cost workflow in under 30 seconds.
2. User can explain at least 70% of spend via taxonomy buckets; unexplained spend is explicitly marked `unknown`.
3. User can apply one control recommendation in under 2 minutes.
4. User sees before/after change in:
- cost per successful run
- avoidable-spend ratio
- retry-loop spend
5. Budget threshold alert triggers before daily cap breach.

## 10) Not in Phase 1

1. Fully automatic self-editing without operator confirmation
2. Provider-perfect billed reconciliation across all model providers
3. Organization-wide chargeback allocation
4. Fully autonomous cost optimization loops
