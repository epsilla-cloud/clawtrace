export type ClawTraceFlowId =
  | 'f0-connect'
  | 'f1-audit'
  | 'f2-handoff'
  | 'f3-control-room'
  | 'f4-live-run'
  | 'f5-triage'
  | 'f6-intervention'
  | 'f7-verification'
  | 'f8-regression'
  | 'f9-time-machine'
  | 'f10-automation'
  | 'f11-feedback';

export type ClawTraceFlowModule = {
  title: string;
  description: string;
};

export type ClawTraceFlowTransition = {
  label: string;
  target: ClawTraceFlowId;
};

export type ClawTraceFlowDefinition = {
  id: ClawTraceFlowId;
  order: number;
  route: string;
  phase: 'Onboarding' | 'Operate' | 'Improve';
  title: string;
  subtitle: string;
  firstTimeHint: string;
  userQuestion: string;
  modules: ClawTraceFlowModule[];
  transitions?: ClawTraceFlowTransition[];
  primaryActionLabel: string;
  successChecks: string[];
};

export const CLAWTRACE_FLOW_PAGES: ClawTraceFlowDefinition[] = [
  {
    id: 'f0-connect',
    order: 0,
    route: '/onboarding/connect',
    phase: 'Onboarding',
    title: 'Connect OpenClaw Workspace',
    subtitle: 'Page 1 of the journey. One job: establish trustworthy connectivity.',
    firstTimeHint: 'Do not configure alerts or dashboards yet. First guarantee data visibility.',
    userQuestion: 'Can ClawTrace see my workflows and recent runs?',
    modules: [
      {
        title: 'Connection Scope',
        description: 'Choose workspace, auth scope, and environment boundaries before ingestion starts.',
      },
      {
        title: 'Workflow Discovery',
        description: 'List detected workflows and show which have enough execution history for analysis.',
      },
      {
        title: 'Ingestion Health Check',
        description: 'Validate event ingest path and report any missing permissions or blind spots.',
      },
    ],
    transitions: [
      {
        label: 'Connection ready',
        target: 'f1-audit',
      },
    ],
    primaryActionLabel: 'Continue to Guided Audit',
    successChecks: [
      'Connection is healthy',
      'At least one workflow discovered',
      'Recent run ingestion verified',
    ],
  },
  {
    id: 'f1-audit',
    order: 1,
    route: '/onboarding/audit',
    phase: 'Onboarding',
    title: 'Guided Audit Warmup',
    subtitle: 'Page 2. Convert history into an initial reliability map.',
    firstTimeHint: 'This is evidence-first setup. Confirm only high-impact assumptions.',
    userQuestion: 'What did ClawTrace infer from my historical runs?',
    modules: [
      {
        title: 'Run Backfill',
        description: 'Backfill recent runs and create first pass traces with known vs unknown coverage.',
      },
      {
        title: 'Contract Inference',
        description: 'Infer workflow boundaries, critical steps, mutating actions, and verifier candidates.',
      },
      {
        title: 'Trust Baseline',
        description: 'Assign initial trust-state to each workflow before daily monitoring begins.',
      },
    ],
    transitions: [
      {
        label: 'Baseline confirmed',
        target: 'f2-handoff',
      },
    ],
    primaryActionLabel: 'Confirm Baseline and Handoff',
    successChecks: [
      'Initial contract version created',
      'Trust baseline visible for all discovered workflows',
      'Unknowns explicitly labeled',
    ],
  },
  {
    id: 'f2-handoff',
    order: 2,
    route: '/onboarding/handoff',
    phase: 'Onboarding',
    title: 'First-Value Handoff',
    subtitle: 'Page 3. Put the user on one clear workflow with one clear next action.',
    firstTimeHint: 'First-time users should understand where to click within 10 seconds.',
    userQuestion: 'What should I do first after setup?',
    modules: [
      {
        title: 'Selected Workflow',
        description: 'Choose one workflow as the starting cockpit and explain why it is selected.',
      },
      {
        title: 'Primary Next Action',
        description: 'Show one recommended action with reason and expected impact.',
      },
      {
        title: 'Verification Baseline',
        description: 'Show how success/failure/unknown will be measured from now on.',
      },
    ],
    transitions: [
      {
        label: 'Onboarding complete',
        target: 'f3-control-room',
      },
    ],
    primaryActionLabel: 'Open Daily Overview',
    successChecks: [
      'One workflow selected',
      'Primary action is clear',
      'Verification criteria visible',
    ],
  },
  {
    id: 'f3-control-room',
    order: 3,
    route: '/traces',
    phase: 'Operate',
    title: 'Daily Overview',
    subtitle: 'Page 4. Calm, scanable daily operations view.',
    firstTimeHint: 'This page is for triage and prioritization, not deep investigation.',
    userQuestion: 'Are we healthy right now, and where should I focus?',
    modules: [
      {
        title: 'Workflow Portfolio',
        description: 'Scan all workflows quickly by trust-state and most recent outcome.',
      },
      {
        title: 'Focused Cockpit',
        description: 'Keep one selected workflow deep to avoid context overload.',
      },
      {
        title: 'Escalation Entry',
        description: 'Open investigation drawer only when risk or uncertainty requires it.',
      },
    ],
    transitions: [
      {
        label: 'Scheduled or manual run starts',
        target: 'f4-live-run',
      },
      {
        label: 'Trust degrades or alert fires',
        target: 'f5-triage',
      },
      {
        label: 'Behavior drift detected',
        target: 'f9-time-machine',
      },
      {
        label: 'User asks in chat',
        target: 'f10-automation',
      },
      {
        label: 'User feedback event',
        target: 'f11-feedback',
      },
    ],
    primaryActionLabel: 'Start Live Run Monitoring',
    successChecks: [
      'User can identify top-risk workflow fast',
      'One focused cockpit is active',
      'Escalation path is obvious',
    ],
  },
  {
    id: 'f4-live-run',
    order: 4,
    route: '/runs/live',
    phase: 'Operate',
    title: 'Live Run Monitoring',
    subtitle: 'Page 5. Follow one in-flight run without digging through logs.',
    firstTimeHint: 'Show progression and interventions as a readable story, not raw events.',
    userQuestion: 'What is happening in this run right now?',
    modules: [
      {
        title: 'Run Story Timeline',
        description: 'Render control points and key step transitions in chronological order.',
      },
      {
        title: 'Trust-State Changes',
        description: 'Show trust transitions when confidence drops or risks increase.',
      },
      {
        title: 'Control Decisions',
        description: 'Label allow/deny/defer/warn decisions with evidence and timestamp.',
      },
    ],
    transitions: [
      {
        label: 'Verified success',
        target: 'f3-control-room',
      },
      {
        label: 'Partial or unknown outcome',
        target: 'f7-verification',
      },
      {
        label: 'Fail, defer, or block',
        target: 'f5-triage',
      },
    ],
    primaryActionLabel: 'Open Incident Triage if Needed',
    successChecks: [
      'Current run status is obvious',
      'Decision rationale is inspectable',
      'Escalation to triage is one click',
    ],
  },
  {
    id: 'f5-triage',
    order: 5,
    route: '/incident/triage',
    phase: 'Operate',
    title: 'Incident Triage',
    subtitle: 'Page 6. Rapid diagnosis with evidence-first root-cause framing.',
    firstTimeHint: 'Separate runtime failures from state-drift causes before prescribing action.',
    userQuestion: 'Why did this fail and what changed?',
    modules: [
      {
        title: 'Incident Memo Draft',
        description: 'Auto-draft a concise incident memo from deterministic facts.',
      },
      {
        title: 'Evidence Stack',
        description: 'Group traces, tool/model calls, verifier outputs, and state diffs in one place.',
      },
      {
        title: 'Hypothesis and Priority',
        description: 'Generate ranked hypotheses and a single recommended intervention.',
      },
    ],
    transitions: [
      {
        label: 'Action selected',
        target: 'f6-intervention',
      },
    ],
    primaryActionLabel: 'Execute Recommended Intervention',
    successChecks: [
      'Primary root-cause hypothesis is explicit',
      'Known vs unknown evidence is clear',
      'Action recommendation is actionable',
    ],
  },
  {
    id: 'f6-intervention',
    order: 6,
    route: '/action/intervention',
    phase: 'Operate',
    title: 'Action and Intervention',
    subtitle: 'Page 7. Execute safe next steps with control.',
    firstTimeHint: 'One action per page. Avoid stacking retries, policy edits, and rollbacks together.',
    userQuestion: 'What is the safest next step to recover?',
    modules: [
      {
        title: 'Intervention Choice',
        description: 'Pick rerun, gate, rollback, policy update, or manual confirmation path.',
      },
      {
        title: 'Safety Guardrails',
        description: 'Show side-effect risk and required confirmation before mutating actions.',
      },
      {
        title: 'Execution Journal',
        description: 'Record action outcome and idempotency key for replay safety.',
      },
    ],
    transitions: [
      {
        label: 'Action executed',
        target: 'f7-verification',
      },
    ],
    primaryActionLabel: 'Move to Verification',
    successChecks: [
      'Intervention outcome is logged',
      'Side effects are journaled',
      'Next verification step is ready',
    ],
  },
  {
    id: 'f7-verification',
    order: 7,
    route: '/verification/closure',
    phase: 'Operate',
    title: 'Verification and Closure',
    subtitle: 'Page 8. Confirm whether the fix actually worked.',
    firstTimeHint: 'Do not collapse uncertain states. Unknown must stay visible.',
    userQuestion: 'Did this intervention actually resolve the issue?',
    modules: [
      {
        title: 'Verifier Breakdown',
        description: 'Show x/y success, z/y fail, and w/y unknown with explicit labels.',
      },
      {
        title: 'Partial Verification',
        description: 'Support partially verified outcomes without pretending certainty.',
      },
      {
        title: 'Closure Decision',
        description: 'Route to normal operations or escalation based on verification evidence.',
      },
    ],
    transitions: [
      {
        label: 'Stable success',
        target: 'f3-control-room',
      },
      {
        label: 'Repeated or severe failure',
        target: 'f8-regression',
      },
      {
        label: 'Unresolved failure',
        target: 'f5-triage',
      },
    ],
    primaryActionLabel: 'Promote to Regression if Repeated',
    successChecks: [
      'Verification status is unambiguous',
      'Unknowns are retained',
      'Next path (close/escalate) is explicit',
    ],
  },
  {
    id: 'f8-regression',
    order: 8,
    route: '/eval/regression',
    phase: 'Improve',
    title: 'Regression and Evaluation',
    subtitle: 'Page 9. Convert repeated incidents into prevention assets.',
    firstTimeHint: 'This page is about preventing recurrence, not debugging the current run.',
    userQuestion: 'How do we stop this from happening again?',
    modules: [
      {
        title: 'Incident Promotion',
        description: 'Promote high-value failures into regression candidates.',
      },
      {
        title: 'Trajectory Constraints',
        description: 'Define expected path quality and unacceptable trajectory patterns.',
      },
      {
        title: 'Release Gate Link',
        description: 'Attach scorecard checks to release or deployment gates.',
      },
    ],
    transitions: [
      {
        label: 'Guardrail attached',
        target: 'f3-control-room',
      },
    ],
    primaryActionLabel: 'Open Time Machine for Drift',
    successChecks: [
      'Regression case created',
      'Eval criteria are explicit',
      'Guardrail is attached to workflow lifecycle',
    ],
  },
  {
    id: 'f9-time-machine',
    order: 9,
    route: '/drift/time-machine',
    phase: 'Improve',
    title: 'Drift and Time Machine',
    subtitle: 'Page 10. Explain behavior drift across state versions.',
    firstTimeHint: 'Show what changed first, then speculate on why it mattered.',
    userQuestion: 'Which state changes caused behavior drift?',
    modules: [
      {
        title: 'State Timeline',
        description: 'Track config, memory, soul, agent.md, skills, and plugins over time.',
      },
      {
        title: 'Last-Known-Good Diff',
        description: 'Compare current state against last stable run context.',
      },
      {
        title: 'Rollback or Forward Fix',
        description: 'Offer controlled rollback or targeted corrective update paths.',
      },
    ],
    transitions: [
      {
        label: 'Drift controlled',
        target: 'f3-control-room',
      },
      {
        label: 'Drift unresolved',
        target: 'f5-triage',
      },
    ],
    primaryActionLabel: 'Return to Overview',
    successChecks: [
      'Drift source is identified',
      'Fix path is selected',
      'State integrity is restored',
    ],
  },
  {
    id: 'f10-automation',
    order: 10,
    route: '/automation/chat',
    phase: 'Improve',
    title: 'Conversational Automation',
    subtitle: 'Page 11. Create dashboards, alerts, and briefs from chat.',
    firstTimeHint: 'Conversation should generate artifacts, not just answers.',
    userQuestion: 'Can I turn this investigation into reusable monitoring?',
    modules: [
      {
        title: 'Dashboard Creation',
        description: 'Generate visualizations from natural-language trace queries.',
      },
      {
        title: 'Alert Authoring',
        description: 'Create alert rules with scope and noise preview before activation.',
      },
      {
        title: 'Investigation Briefs',
        description: 'Save evidence-backed summaries for team handoff and review.',
      },
    ],
    transitions: [
      {
        label: 'Artifact saved',
        target: 'f3-control-room',
      },
    ],
    primaryActionLabel: 'Capture User Feedback',
    successChecks: [
      'Artifact created from conversation',
      'Artifact previewed before save',
      'Artifact linked to source run/evidence',
    ],
  },
  {
    id: 'f11-feedback',
    order: 11,
    route: '/feedback',
    phase: 'Improve',
    title: 'Feedback Capture',
    subtitle: 'Page 12. Close the loop with explicit and implicit user signal.',
    firstTimeHint: 'Keep feedback lightweight so users can submit in seconds.',
    userQuestion: 'Was this diagnosis and action actually useful?',
    modules: [
      {
        title: 'Explicit Feedback',
        description: 'Capture useful/wrong/unclear signals with short contextual notes.',
      },
      {
        title: 'Implicit Signals',
        description: 'Track overrides, retries, and resolution time as behavioral quality signal.',
      },
      {
        title: 'Learning Linkage',
        description: 'Attach feedback to incidents, actions, and eval backlog priorities.',
      },
    ],
    transitions: [
      {
        label: 'High-value learning',
        target: 'f8-regression',
      },
      {
        label: 'Normal return',
        target: 'f3-control-room',
      },
    ],
    primaryActionLabel: 'Restart Journey at Overview',
    successChecks: [
      'Feedback attached to a concrete run',
      'Signal categorized for product/eval loops',
      'User can return to operations immediately',
    ],
  },
];

const FLOW_ROUTE_MAP = new Map(CLAWTRACE_FLOW_PAGES.map((flow) => [flow.route, flow]));

export function getFlowBySegments(segments: string[]): ClawTraceFlowDefinition | null {
  const route = `/${segments.join('/')}`;
  return FLOW_ROUTE_MAP.get(route) ?? null;
}

export function getAdjacentFlow(flowId: ClawTraceFlowId, direction: -1 | 1): ClawTraceFlowDefinition | null {
  const currentIndex = CLAWTRACE_FLOW_PAGES.findIndex((flow) => flow.id === flowId);
  if (currentIndex === -1) {
    return null;
  }
  return CLAWTRACE_FLOW_PAGES[currentIndex + direction] ?? null;
}

export function getFlowSegments(flow: ClawTraceFlowDefinition): string[] {
  return flow.route.split('/').filter(Boolean);
}
