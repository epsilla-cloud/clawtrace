import type { ReactNode } from 'react';

export type ClawTraceViewport = 'desktop' | 'tablet' | 'mobile';

export type ClawTraceTrustState =
  | 'healthy'
  | 'at_risk'
  | 'drifting'
  | 'blocked'
  | 'awaiting_confirmation'
  | 'partially_verified'
  | 'control_plane_issue';

export type ClawTraceDecisionOutcome = 'allow' | 'defer' | 'block' | 'warn';

export type ClawTraceVerificationState = 'success' | 'fail' | 'unknown';

export interface ClawTraceOption {
  id: string;
  label: string;
  description?: string;
}

export interface ClawTraceWorkflowListItem {
  id: string;
  name: string;
  trustState: ClawTraceTrustState;
  latestRunState: string;
  latestSummary: string;
  lastUpdatedAt: string;
  isSelected?: boolean;
  hasAttention?: boolean;
}

export interface ClawTraceWorkflowFilters {
  query?: string;
  trustStates?: ClawTraceTrustState[];
  onlyAttention?: boolean;
}

export interface ClawTraceWorkflowVerificationRow {
  id: string;
  label: string;
  state: ClawTraceVerificationState;
  detail?: string;
  verifiedAt?: string;
}

export interface ClawTraceWorkflowVerification {
  headline: string;
  successCount: number;
  failCount: number;
  unknownCount: number;
  rows: ClawTraceWorkflowVerificationRow[];
}

export interface ClawTracePrimaryAction {
  id: string;
  label: string;
  why: string;
  confidenceLabel?: string;
  secondaryActions?: ClawTraceOption[];
}

export interface ClawTraceTimelineNode {
  id: string;
  occurredAt: string;
  stepLabel: string;
  statusLabel: string;
  explanation: string;
  evidenceItems?: string[];
  decisionOutcome?: ClawTraceDecisionOutcome;
}

export interface ClawTraceStateDiffItem {
  id: string;
  key: string;
  previousValue?: string;
  currentValue?: string;
  changedAt?: string;
  isContractRelevant: boolean;
  triggeredRevalidation: boolean;
}

export interface ClawTraceDecisionAuditRecord {
  id: string;
  decidedAt: string;
  outcome: ClawTraceDecisionOutcome;
  primaryReason: string;
  rejectedAlternatives: string[];
  contractVersion: string;
  actorLabel: string;
  inputSummary: string[];
}

export interface ClawTraceIncidentMemo {
  id: string;
  title: string;
  happened: string;
  impact: string;
  knownEvidence: string[];
  unknownEvidence: string[];
  primaryNextAction: string;
  followUpActions?: string[];
  createdAt: string;
}

export interface ClawTraceWorkflowCockpitModel {
  workflowId: string;
  workflowName: string;
  contractVersion: string;
  trustState: ClawTraceTrustState;
  trustReason: string;
  primaryAction: ClawTracePrimaryAction;
  verification: ClawTraceWorkflowVerification;
  timeline: ClawTraceTimelineNode[];
  stateDiff: ClawTraceStateDiffItem[];
  latestMemo?: ClawTraceIncidentMemo;
}

export interface ClawTraceOnboardingProgress {
  connectionStateLabel: string;
  discoveryProgressLabel: string;
  inferredWorkflowCount: number;
  needsConfirmation: boolean;
}

export interface ClawTraceOnboardingMessage {
  id: string;
  role: 'system' | 'assistant' | 'user';
  content: string;
  createdAt: string;
}

export interface ClawTraceDrawerTab {
  id: 'investigation' | 'artifact' | 'contract' | 'evidence';
  label: string;
}

export interface ClawTraceAppProps {
  viewport: ClawTraceViewport;
  workflows: ClawTraceWorkflowListItem[];
  selectedWorkflowId?: string;
  onSelectWorkflow: (workflowId: string) => void;
  cockpit?: ClawTraceWorkflowCockpitModel;
  isOnboarding: boolean;
  isWarmup: boolean;
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

export interface ClawTraceWorkflowPortfolioProps {
  workflows: ClawTraceWorkflowListItem[];
  filters: ClawTraceWorkflowFilters;
  onFilterChange: (filters: ClawTraceWorkflowFilters) => void;
  onSelectWorkflow: (workflowId: string) => void;
}

export interface ClawTraceWorkflowCardProps {
  workflow: ClawTraceWorkflowListItem;
  onSelect: (workflowId: string) => void;
}

export interface ClawTraceWorkflowCockpitProps {
  model: ClawTraceWorkflowCockpitModel;
  onPrimaryAction: (actionId: string) => void;
  onSelectSecondaryAction: (actionId: string) => void;
  onOpenMemo: (memoId: string) => void;
}

export interface ClawTraceTrustStateBandProps {
  state: ClawTraceTrustState;
  reason: string;
  evidenceHref?: string;
  updatedAt?: string;
}

export interface ClawTracePrimaryActionCardProps {
  action: ClawTracePrimaryAction;
  onPrimaryAction: (actionId: string) => void;
  onSelectSecondaryAction: (actionId: string) => void;
}

export interface ClawTraceRunStoryTimelineProps {
  nodes: ClawTraceTimelineNode[];
  onOpenEvidence: (nodeId: string) => void;
}

export interface ClawTraceVerificationBreakdownProps {
  verification: ClawTraceWorkflowVerification;
  onOpenVerifier: (verifierId: string) => void;
}

export interface ClawTraceStateDiffPanelProps {
  items: ClawTraceStateDiffItem[];
  onOpenDiffItem: (itemId: string) => void;
}

export interface ClawTraceIncidentMemoPanelProps {
  memo: ClawTraceIncidentMemo;
  onPromoteToRegression?: (memoId: string) => void;
}

export interface ClawTraceWarmupAuditChatProps {
  progress: ClawTraceOnboardingProgress;
  messages: ClawTraceOnboardingMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onConfirmInference: (workflowId: string) => void;
}

export interface ClawTraceInvestigationDrawerProps {
  open: boolean;
  activeTab: ClawTraceDrawerTab['id'];
  tabs: ClawTraceDrawerTab[];
  onTabChange: (tabId: ClawTraceDrawerTab['id']) => void;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

export interface ClawTraceControlDecisionAuditProps {
  records: ClawTraceDecisionAuditRecord[];
  onOpenRecord: (recordId: string) => void;
}

export interface ClawTraceWorkflowFilterBarProps {
  filters: ClawTraceWorkflowFilters;
  onFilterChange: (filters: ClawTraceWorkflowFilters) => void;
}
