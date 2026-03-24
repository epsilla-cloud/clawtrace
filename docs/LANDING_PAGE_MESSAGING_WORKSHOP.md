# ClawTrace Landing Page Messaging Workshop

Last updated: 2026-03-24  
Status: Implemented in `packages/clawtrace-ui`

## 0) Final Selection

Selected launch headline:

**Make your OpenClaw agents better, cheaper, and faster.**

Selected landing-page structure:

**Sketch 3: Founder-Friendly**

Hero:
- **Make your OpenClaw agents better, cheaper, and faster.**

Subhead:
- **See what failed, where spend leaked, and what to fix first.**

Section: Better
- Less babysitting, fewer repeated mistakes.
- More reliable output from the workflows you already run daily.

Section: Cheaper
- Know exactly why cost spiked this week.
- Fix the biggest leak first instead of guessing.

Section: Faster
- Get from “something is wrong” to “here’s the fix” quickly.
- Spend less time debugging and more time shipping.

CTA:
- **Join Waitlist** (email capture)

## 1) Goal

Pick one primary landing-page message for the first version, then build the page around it.

## 2) Audience for v1

- OpenClaw operators
- founder/operators running daily automations
- teams with repeat agent failures and rising token spend

## 3) Message Options

## Option A (Recommended): Cost Control Without Losing Quality

### Hero
Stop OpenClaw from burning budget in the background.

### Subhead
ClawTrace shows exactly where cost goes in each workflow, flags waste, and helps you fix it without breaking output quality.

### Why this could win
- matches urgent wallet pain
- easy to explain in one sentence
- directly tied to your recent customer interviews and workflow pain

### Risks
- could sound like "just a cost dashboard" if reliability story is weak

## Option B: Reliability Control Room

### Hero
Your OpenClaw workflow should not feel like a black box.

### Subhead
See what happened, why it failed, and what to fix next in one control room.

### Why this could win
- strongest identity fit for long-term product
- avoids being reduced to a budget tool

### Risks
- broad framing; may feel less urgent than direct cost pain

## Option C: Give Founders Their Time Back

### Hero
Get your mornings back from babysitting OpenClaw.

### Subhead
ClawTrace catches repeat mistakes, surfaces the right fix, and helps your workflows run reliably without daily hand-holding.

### Why this could win
- emotionally strong
- highly relatable for founder/operators

### Risks
- less concrete unless backed by hard cost/reliability proof

## 4) Recommended Direction

Use Option A as primary narrative, then anchor it with reliability:

1. Lead with cost control.
2. Prove with workflow-level cost attribution and leak detection.
3. Reinforce that quality stays protected via verification and guardrails.

Short framing:
"Reduce OpenClaw waste first, then improve reliability with the same control loop."

## 5) Landing Page Content Skeleton (for build)

1. Hero: cost pain + promise
2. Social proof/problem reality: black-box + hidden spend
3. "Where your money goes" section (workflow -> run -> step)
4. "Fix the biggest leaks first" section (guided controls)
5. "Protect quality while cutting cost" section (verification + trust state)
6. CTA: install or join early access

## 6) Decision

Landing-page message is approved and ready to build using Sketch 3.

## 7) Implementation Mapping

Implemented files:
- `packages/clawtrace-ui/src/app/page.tsx`
- `packages/clawtrace-ui/src/components/clawtrace/landing/LandingPage.tsx`
- `packages/clawtrace-ui/src/components/clawtrace/landing/LandingPage.module.css`
- `packages/clawtrace-ui/src/app/api/waitlist/route.ts`
