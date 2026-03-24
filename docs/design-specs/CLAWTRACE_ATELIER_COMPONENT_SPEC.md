---
status: ACTIVE
---
# ClawTrace Atelier Component and Token Spec
Generated on 2026-03-23

## Purpose
This document turns the reviewed design direction into an implementation-ready UI contract for ClawTrace.

Use it when building ClawTrace as an AgentStudio app surface.

It answers four things:
1. Which `Atelier` primitives we inherit directly
2. Which ClawTrace-specific tokens we add on top of `Atelier Operator`
3. Which ClawTrace components need to exist and what each one does
4. How those components compose into desktop, tablet, mobile, onboarding, and investigation flows

This is the implementation companion to `DESIGN.md`.

## Exact Implementation Artifacts
Use these files directly during implementation:
- `docs/design-specs/clawtrace.tokens.css`
- `docs/design-specs/clawtrace.interfaces.ts`

## Scope
In scope:
- token definitions and aliases
- layout measurements
- component boundaries
- screen composition
- state treatment
- accessibility and responsive rules
- recommended AgentStudio file structure

Out of scope:
- final React implementation
- final copywriting for every string
- backend data contracts beyond the fields the UI consumes
- visual polish after implementation (`/design-review` covers that)

## Upstream Design System Inputs
Base system:
- `frontend/src/components/apps/atelier/AtelierApps.tsx`
- `frontend/src/components/apps/atelier/AtelierApps.module.css`
- `frontend/src/components/apps/atelier/index.ts`
- `frontend/src/app/apps/chats/page.tsx`
- `frontend/src/app/apps/workspaces/page.tsx`

Most relevant inherited primitives:
- `AtelierAppRail`
- `AtelierChatSidebar` interaction rhythm
- `AtelierCustomerPanel` detail-panel rhythm
- `AtelierChatComposer` drawer/composer behavior
- `operator` theme tokens from `AtelierApps.module.css`

## Implementation Target in AgentStudio
Recommended file structure when this is moved into AgentStudio:

```text
frontend/src/components/apps/clawtrace/
  ClawTraceApp.tsx
  ClawTrace.module.css
  ClawTraceWorkflowPortfolio.tsx
  ClawTraceWorkflowCard.tsx
  ClawTraceWorkflowCockpit.tsx
  ClawTraceTrustStateBand.tsx
  ClawTracePrimaryActionCard.tsx
  ClawTraceRunStoryTimeline.tsx
  ClawTraceVerificationBreakdown.tsx
  ClawTraceStateDiffPanel.tsx
  ClawTraceIncidentMemoPanel.tsx
  ClawTraceInvestigationDrawer.tsx
  ClawTraceWarmupAuditChat.tsx
  ClawTraceControlDecisionAudit.tsx
  index.ts

frontend/src/app/apps/clawtrace/
  page.tsx
```

## Shell Topology
### Desktop
```text
+-------------+----------------------+--------------------------------------+----------------------+
| Global rail | Workflow portfolio   | Selected workflow cockpit            | Investigation drawer |
| 56 / 170 px | 320-360 px           | fluid / primary center of gravity    | 360-420 px           |
+-------------+----------------------+--------------------------------------+----------------------+
```

### Tablet
```text
+-------------+----------------------+--------------------------------------+
| Global rail | Workflow portfolio   | Selected workflow cockpit            |
| collapsed   | narrower             | drawer overlays from the right       |
+-------------+----------------------+--------------------------------------+
```

### Mobile
```text
Step 1: workflow portfolio
Step 2: selected workflow summary
Step 3: primary next action
Step 4: trust + latest run summary
Step 5: drill down into run story / verification / memo / drawer chat
```

## Token Strategy
### 1. Base alias tokens
These should alias directly to `Atelier Operator` tokens rather than redefining them.

| ClawTrace token | Source | Purpose |
|---|---|---|
| `--ct-page-bg` | `--page-bg` | workspace background |
| `--ct-panel-bg` | `--panel-bg` | main panel background |
| `--ct-panel-subtle` | `--panel-subtle` | secondary panel surfaces |
| `--ct-panel-sidebar` | `--panel-sidebar` | portfolio / drawer backgrounds |
| `--ct-border` | `--border` | default borders |
| `--ct-text` | `--text` | primary text |
| `--ct-muted` | `--muted` | secondary text |
| `--ct-primary` | `--primary` | primary actions |
| `--ct-primary-strong` | `--primary-strong` | active emphasis |
| `--ct-accent` | `--accent` | selected/active surfaces |
| `--ct-accent-text` | `--accent-text` | selected/active text |
| `--ct-soft` | `--soft` | quiet pills / helpers |
| `--ct-soft-text` | `--soft-text` | quiet labels |
| `--ct-focus` | `--focus` | keyboard focus ring |

### 2. Layout tokens
These are concrete enough to build from immediately.

| Token | Value | Notes |
|---|---:|---|
| `--ct-shell-rail-width` | `56px` | matches Atelier collapsed rail |
| `--ct-shell-rail-width-expanded` | `170px` | matches Atelier expanded rail |
| `--ct-shell-portfolio-width` | `336px` | start between Atelier `320px` sidebar and slightly richer workflow content |
| `--ct-shell-drawer-width` | `384px` | wider than Atelier customer panel to support investigation chat + artifacts |
| `--ct-shell-min-height` | `760px` | inherited from Atelier shell minimum |
| `--ct-shell-radius` | `16px` | inherited shell radius |
| `--ct-panel-radius` | `12px` | default panel radius |
| `--ct-control-radius` | `10px` | controls, tabs, compact buttons |
| `--ct-pill-radius` | `999px` | badges and state pills |
| `--ct-control-height` | `34px` | standard button/input height |
| `--ct-tab-height` | `28px` | compact segmented controls |
| `--ct-page-padding-x` | `18px` | inherited from Atelier page shell |
| `--ct-page-padding-top` | `36px` | inherited from Atelier page shell |
| `--ct-page-padding-bottom` | `72px` | inherited from Atelier page shell |
| `--ct-gap-1` | `4px` | micro spacing |
| `--ct-gap-2` | `8px` | tight spacing |
| `--ct-gap-3` | `12px` | control groups |
| `--ct-gap-4` | `16px` | standard section padding rhythm |
| `--ct-gap-5` | `20px` | larger stack gap |
| `--ct-gap-6` | `24px` | section separation |

### 3. Typography tokens
Continue using the Operator sans base.

| Token | Value | Usage |
|---|---|---|
| `--ct-font-heading` | inherit Operator heading stack | section titles and key labels |
| `--ct-font-body` | inherit Operator body stack | all body content |
| `--ct-text-display` | `clamp(30px, 4vw, 54px)` | page-level title only |
| `--ct-text-section-title` | `22px` | portfolio/cockpit/drawer titles |
| `--ct-text-panel-title` | `18px` | panel headers |
| `--ct-text-body` | `14px` | standard body copy |
| `--ct-text-body-sm` | `13px` | compact support text |
| `--ct-text-meta` | `11px` | timestamps, provenance |
| `--ct-text-micro` | `10px` | uppercase control metadata |

### 4. Shadow tokens
Use Atelier’s soft depth model.

| Token | Value | Usage |
|---|---|---|
| `--ct-shadow-shell` | `inset 0 1px 0 rgba(255,255,255,0.72), 0 18px 34px -30px rgba(15,23,42,0.42)` | full app shell |
| `--ct-shadow-selected` | `0 6px 12px -10px color-mix(in srgb, var(--ct-primary) 42%, transparent)` | active portfolio row / selected item |
| `--ct-shadow-card` | `0 8px 20px -18px rgba(16,24,40,0.35)` | elevated evidence and action cards |
| `--ct-shadow-inline` | `0 1px 2px rgba(16,24,40,0.1)` | active tabs, compact controls |

### 5. Motion tokens
| Token | Value | Usage |
|---|---:|---|
| `--ct-duration-fast` | `140ms` | hover / active shifts |
| `--ct-duration-medium` | `180ms` | drawer open, workflow selection |
| `--ct-duration-slow` | `240ms` | onboarding warm-up progress |
| `--ct-ease-standard` | `ease` | default movement |
| `--ct-ease-emphasis` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | focus transitions |

### 6. Semantic state tokens
These are the new ClawTrace additions.

```css
.clawtrace {
  --ct-trust-healthy-bg: var(--event);
  --ct-trust-healthy-text: var(--event-text);
  --ct-trust-healthy-border: color-mix(in srgb, var(--event-text) 22%, white);

  --ct-trust-at-risk-bg: #fff4e5;
  --ct-trust-at-risk-text: #9a4a00;
  --ct-trust-at-risk-border: #f2c784;

  --ct-trust-drifting-bg: #eef3ff;
  --ct-trust-drifting-text: var(--primary-strong);
  --ct-trust-drifting-border: #bfd0ff;

  --ct-trust-blocked-bg: #fff1f3;
  --ct-trust-blocked-text: #b42318;
  --ct-trust-blocked-border: #f3b7c0;

  --ct-trust-awaiting-bg: #fff8e8;
  --ct-trust-awaiting-text: #8a5600;
  --ct-trust-awaiting-border: #ead08f;

  --ct-trust-partial-bg: #fff7ed;
  --ct-trust-partial-text: #9a4a00;
  --ct-trust-partial-border: #f0c48f;

  --ct-trust-control-plane-bg: #f5f7fa;
  --ct-trust-control-plane-text: #344054;
  --ct-trust-control-plane-border: #d0d5dd;

  --ct-verify-success-bg: var(--event);
  --ct-verify-success-text: var(--event-text);
  --ct-verify-fail-bg: #fff1f3;
  --ct-verify-fail-text: #b42318;
  --ct-verify-unknown-bg: #f5f7fa;
  --ct-verify-unknown-text: #475467;

  --ct-decision-allow-bg: #e9faee;
  --ct-decision-allow-text: #166534;
  --ct-decision-defer-bg: #fff8e8;
  --ct-decision-defer-text: #8a5600;
  --ct-decision-block-bg: #fff1f3;
  --ct-decision-block-text: #b42318;

  --ct-evidence-callout-bg: color-mix(in srgb, var(--ct-accent) 72%, white);
  --ct-evidence-callout-text: var(--ct-accent-text);
  --ct-evidence-callout-border: color-mix(in srgb, var(--ct-accent-text) 20%, white);
}
```

This same block is also exported as a copy-paste file:
- `docs/design-specs/clawtrace.tokens.css`

## Component Spec
### Reuse directly
| Existing component | Reuse level | Notes |
|---|---|---|
| `AtelierAppRail` | direct reuse with nav extension | add ClawTrace destination into the same app family |
| `AtelierChatComposer` | behavior/style pattern reuse | good basis for investigation drawer composer and onboarding prompts |
| `AtelierCustomerPanel` | layout pattern reuse | good basis for right-side investigation drawer shell |
| `AtelierChatSidebar` | interaction pattern reuse | use its list rhythm, selection states, and filter patterns for workflow portfolio |

### Build new
#### `ClawTraceApp`
Primary app shell for the ClawTrace route.

Responsibilities:
- own selected workflow state
- coordinate portfolio, cockpit, and drawer
- switch between warm-up/onboarding and steady-state workspace
- map desktop/tablet/mobile composition

Consumes:
- workflow list
- selected workflow summary
- selected run and trust state
- drawer open/closed state
- onboarding audit state

#### `ClawTraceWorkflowPortfolio`
Left-column portfolio for discovered workflows.

Responsibilities:
- render workflow list and filters
- support selection
- surface portfolio health without deep detail

States:
- warm-up loading
- healthy portfolio
- some workflows at risk
- filtered/empty result

Rules:
- one selected workflow only
- no deep trace content here
- trust state visible on every row

#### `ClawTraceWorkflowCard`
Single workflow row inside the portfolio.

Required fields:
- workflow name
- trust state
- latest run outcome
- one-line issue or status summary
- 7-day token/cost summary (with `estimated` vs `billed` label)
- latest timestamp
- selected state

Interaction:
- hover -> light accent tint
- selected -> same active treatment family as `AtelierChatSidebar`
- keyboard selectable

#### `ClawTraceWorkflowCockpit`
Primary center panel for the selected workflow.

Required zones:
1. workflow header
2. trust state band
3. primary next action card
4. run story timeline
5. verification breakdown
6. cost analysis panel (total, avg/run, cost-per-success)
7. trajectory cost breakdown (recent trajectory rows with spend + model context)
8. state diff / drift markers
9. recent incident memo launcher

Rules:
- center panel must dominate the shell visually
- primary next action sits above the fold
- metrics never outrank evidence and next action
- cost values must always show precision class (`estimated` or `billed`)

#### `ClawTraceTrustStateBand`
Persistent, compact, high-clarity state surface.

Supported states:
- `Healthy`
- `At Risk`
- `Drifting`
- `Blocked`
- `Awaiting Confirmation`
- `Partially Verified`
- `Control Plane Issue`

Required slots:
- state label
- one-line explanation
- optional evidence link or timestamp

#### `ClawTracePrimaryActionCard`
The single best next step.

Required content:
- direct action label
- why this is the recommended action
- confidence / evidence basis
- optional secondary actions

Examples:
- `Revalidate before deploy`
- `Review cover-image generation step`
- `Confirm deferred publish`
- `Promote this incident into regression set`

#### `ClawTraceRunStoryTimeline`
Evidence-first control-point story for one run.

Required node types:
- run started
- preflight decision
- mutating step
- verification result
- defer / block / allow decision
- state changed during run
- incident created

Per node fields:
- time
- step label
- status
- token and cost attribution when available
- short explanation
- expandable evidence details

#### `ClawTraceCostAnalysisPanel`
Cost command surface for selected workflow.

Required fields:
- total spend in selected window
- average cost per run
- cost per successful run
- spend precision label (`estimated` or `billed`)

Rules:
- must sit beside reliability evidence, not in a detached finance-only route
- must support direct drill-in to high-cost trajectories and steps

#### `ClawTraceVerificationBreakdown`
Structured verification summary.

Required sections:
- headline outcome
- counts by `success / fail / unknown`
- individual verifier rows
- unknown reason when present

Rules:
- always show the breakdown when status is `Partially Verified`
- never flatten unknowns into soft success

#### `ClawTraceStateDiffPanel`
State drift view between last-known-good and current conditions.

Show:
- what changed
- when it changed
- whether it is contract-relevant
- whether it triggered revalidation

Sources can include:
- config
- memory
- workflow contract version
- skills/plugins/runtime inputs

#### `ClawTraceIncidentMemoPanel`
Structured incident brief.

Sections:
- what happened
- why it matters
- known evidence
- unknown evidence
- primary next action
- optional follow-up actions

Tone:
- operational brief
- not a chat transcript

#### `ClawTraceWarmupAuditChat`
One-time onboarding chat.

Responsibilities:
- connect to OpenClaw environment
- explain discovery progress
- summarize inferred workflows
- propose workflow contract candidates
- request confirmation where needed

Must feel like:
- guided audit
- evidence-led setup

Must not feel like:
- open-ended assistant chat

#### `ClawTraceInvestigationDrawer`
Collapsible right-side drawer after onboarding.

Modes:
- closed
- narrow peek
- expanded

Content modes:
- chat/investigation
- incident artifact view
- contract edit assist
- evidence Q&A

Rules:
- drawer is secondary to the cockpit
- it must not visually overpower the center panel
- on mobile it becomes a route or overlay, not a persistent column

#### `ClawTraceControlDecisionAudit`
Decision inspection panel for allow/defer/block decisions.

Required fields:
- decision outcome
- primary reason
- rejected alternatives summary
- inputs used
- contract version
- actor / trigger
- timestamp

## Screen Composition
### 1. Warm-up onboarding screen
Structure:
- inherited global rail
- center onboarding audit chat
- optional right-side summary rail of discovered workflows once available

Priority order:
1. connection state
2. discovery progress
3. inferred workflows
4. confirmation prompts

### 2. Main workspace screen
Structure:
- global rail
- workflow portfolio
- selected workflow cockpit
- collapsible investigation drawer

Above-the-fold content in cockpit:
1. workflow identity
2. trust state band
3. primary next action
4. latest run headline

### 3. Incident-focused state
When a workflow is blocked or awaiting confirmation:
- increase trust band prominence
- pin primary next action at top
- open or suggest drawer if explanation is needed
- visually subordinate healthy portfolio items

### 4. Mobile triage screen
Default mobile order:
1. workflow portfolio list
2. selected workflow trust state
3. primary next action
4. latest run summary
5. routes to timeline / verification / memo / drawer

## State Matrix
| State | Visual treatment | Required action affordance | Tone |
|---|---|---|---|
| Healthy | calm green/neutral | view workflow | quiet |
| At Risk | warm warning band | inspect issue | attentive |
| Drifting | cool accent + diff emphasis | review changes | analytical |
| Blocked | danger band + strong CTA | resolve before rerun | firm |
| Awaiting Confirmation | amber operational band | confirm or deny | careful |
| Partially Verified | amber-neutral band + verifier breakdown | inspect unknown checks | precise |
| Control Plane Issue | muted neutral-danger | inspect ClawTrace issue | honest |

## Accessibility Contract
Every new ClawTrace component must satisfy:
- keyboard navigability
- visible focus ring using `--ct-focus`
- readable text contrast in every state token pairing
- state labels never rely on color alone
- drawers and overlays support escape/close behavior
- timeline nodes and verifier rows are screen-reader labelable
- mobile primary action reachable without scrolling through nonessential detail

## Responsive Contract
### Desktop
- persistent rail, portfolio, cockpit
- drawer may be collapsed or expanded

### Tablet
- rail collapses sooner
- drawer becomes overlay
- portfolio remains visible until very narrow widths

### Mobile
- one-column triage
- cockpit subpanels become routes/accordions
- drawer content becomes overlay route

## Data Contract Handoff for Engineering
Minimum UI data for the first slice:

```ts
interface WorkflowListItem {
  id: string;
  name: string;
  trustState: 'healthy' | 'at_risk' | 'drifting' | 'blocked' | 'awaiting_confirmation' | 'partially_verified' | 'control_plane_issue';
  latestRunState: string;
  latestSummary: string;
  lastUpdatedAt: string;
}

interface WorkflowCockpitModel {
  workflowId: string;
  workflowName: string;
  contractVersion: string;
  trustState: WorkflowListItem['trustState'];
  trustReason: string;
  primaryAction: {
    label: string;
    why: string;
    secondaryActions?: string[];
  };
  verification: {
    headline: string;
    successCount: number;
    failCount: number;
    unknownCount: number;
  };
}
```

The real engineering schema can be richer, but the UI should not need much more than this to begin building the first vertical slice.

A full prop/interface contract for all planned ClawTrace components is available at:
- `docs/design-specs/clawtrace.interfaces.ts`

## Build Order
### Step 1: shell and token scaffolding
- create ClawTrace route
- create `ClawTrace.module.css`
- inherit Operator tokens
- add ClawTrace semantic token layer

### Step 2: shell composition
- app rail reuse
- portfolio column
- cockpit scaffold
- drawer scaffold

### Step 3: core workflow surfaces
- workflow card
- trust state band
- primary action card
- verification breakdown

### Step 4: deep evidence surfaces
- run story timeline
- state diff panel
- incident memo panel
- control decision audit

### Step 5: onboarding and mobile
- warm-up audit chat
- mobile triage route behavior
- accessibility pass

## Hand-back to AgentStudio
When this spec is implemented in ClawTrace first and later moved into AgentStudio:
- preserve token names where possible
- keep new ClawTrace components in a dedicated app folder
- upstream shared improvements to Atelier primitives separately from ClawTrace-specific features
- avoid baking workflow-specific semantics into generic Atelier components unless they are truly reusable across apps
