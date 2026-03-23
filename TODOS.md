# TODOS

## Workflow Control

### Progressive Autonomy / Approval Modes

**What:** Add workflow- or step-level execution modes such as `observe`, `recommend`, `confirm`, and `auto-run`.

**Why:** This extends ClawTrace from reliability control into governed execution once teams trust the control loop and want policy-aware autonomy.

**Context:** This was explicitly deferred during the CEO review for the workflow reliability control loop. The MVP should stay focused on one critical workflow with preflight, canary, verification, trust state, and incident artifacts. After that wedge is proven, progressive autonomy becomes a natural next layer for enterprise governance and gradual delegation.

**Effort:** M
**Priority:** P2
**Depends on:** Proven workflow control loop adoption and trusted gating behavior in production
