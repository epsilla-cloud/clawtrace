# ClawTrace Landing Page Messaging

Last updated: 2026-04-14
Status: Product is live. Landing page shipped and actively updated.

---

## Current State

The waitlist phase is over. ClawTrace is live at clawtrace.ai with a full product behind it.

The current landing page CTA is **"Get Started Free"** → `/login` (200 free credits, no credit card required). The waitlist form has been removed.

---

## Current Headline and Structure

The live landing page follows the structure from the README rewrite (2026-04-14):

**Opening:** Lead with the real incident — not the product.
> "My OpenClaw agent burned ~40× its normal token budget in under an hour. Root cause: it was appending ~1,500 messages of history to every LLM call. I couldn't see it from logs. Built after that incident."

**Install:** Three commands, immediately after.

**What it shows:** 4 bullets (not a feature table):
- Token usage per step
- Tool calls and retries
- Execution timeline
- Full input/output

**Tracy section:** Conversational AI analyst — ask questions in plain English, get answers with charts.

**Three views:** Execution Path, Actor Map, Step Timeline (screenshots after explanation, not before).

**CTA:** Get Started Free → clawtrace.ai

---

## Messaging Principles (Updated for Live Product)

The original workshop identified the right pain and the right framing. What changed:

1. **No more "join waitlist"** — product is live; CTA is instant signup.
2. **Lead with the incident, not the category** — do not open with "observability platform" or "comprehensive visibility." Open with the bug.
3. **Tracy is the key differentiator** — not dashboards. Ask a question, get an answer with charts. This is what other tools don't have.
4. **Self-evolve loop is a real feature** — the agent that improves itself is live and working. Can be called out as a unique capability.

Kill these phrases everywhere:
- "end-to-end"
- "comprehensive"
- "observability platform"
- "AI agents optimization"
- "solution"

---

## HN-Friendly Framing (2026-04-14)

For Show HN and YC Bookface:

**Problem:** My OpenClaw agent burned 40× normal token budget. Logs showed nothing useful. Built ClawTrace after that incident.

**What it does:** Records every run as a tree of spans. Three views per trace. Ask Tracy (built-in AI analyst) "why did this run cost so much?" and get a specific answer.

**Install:** `openclaw plugins install @epsilla/clawtrace && openclaw clawtrace setup`

**GitHub:** github.com/richard-epsilla/clawtrace

---

## Implementation Files

- `packages/clawtrace-ui/src/app/page.tsx`
- `packages/clawtrace-ui/src/components/clawtrace/landing/LandingPage.tsx`
- `packages/clawtrace-ui/src/components/clawtrace/landing/LandingPage.module.css`
- `packages/clawtrace-ui/src/app/api/waitlist/route.ts` (waitlist endpoint still exists for legacy; not surfaced in UI)

---

## Original Options (For Reference)

The workshop evaluated three options:

**Option A (Recommended): Cost Control Without Losing Quality**
Hero: "Stop OpenClaw from burning budget in the background."
Status: This framing was correct. Cost is still the primary entry pain.

**Option B: Reliability Control Room**
Hero: "Your OpenClaw workflow should not feel like a black box."
Status: Used as the secondary message layer. Reliability is the sustained value, cost is the entry point.

**Option C: Give Founders Their Time Back**
Hero: "Get your mornings back from babysitting OpenClaw."
Status: Still emotionally strong. Used in YC Bookface and deal descriptions.

The decision to lead with cost + reinforce reliability remains correct for the target ICP (founder/operators with rising token bills).
