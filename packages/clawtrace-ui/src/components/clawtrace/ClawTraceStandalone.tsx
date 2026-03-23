'use client';

import { useMemo, useState } from 'react';
import type {
  ClawTraceAppProps,
  ClawTraceControlDecisionAuditProps,
  ClawTraceDrawerTab,
  ClawTraceIncidentMemo,
  ClawTraceIncidentMemoPanelProps,
  ClawTracePrimaryActionCardProps,
  ClawTraceRunStoryTimelineProps,
  ClawTraceStateDiffPanelProps,
  ClawTraceTrustState,
  ClawTraceTrustStateBandProps,
  ClawTraceVerificationBreakdownProps,
  ClawTraceWorkflowCardProps,
  ClawTraceWorkflowCockpitModel,
  ClawTraceWorkflowCockpitProps,
  ClawTraceWorkflowFilterBarProps,
  ClawTraceWorkflowFilters,
  ClawTraceWorkflowPortfolioProps,
} from '../../lib/types';
import styles from './ClawTraceStandalone.module.css';

const TRUST_LABEL: Record<ClawTraceTrustState, string> = {
  healthy: 'Healthy',
  at_risk: 'At Risk',
  drifting: 'Drifting',
  blocked: 'Blocked',
  awaiting_confirmation: 'Awaiting Confirmation',
  partially_verified: 'Partially Verified',
  control_plane_issue: 'Control Plane Issue',
};

const TRUST_CLASS: Record<ClawTraceTrustState, string> = {
  healthy: styles.stateHealthy,
  at_risk: styles.stateAtRisk,
  drifting: styles.stateDrifting,
  blocked: styles.stateBlocked,
  awaiting_confirmation: styles.stateAwaiting,
  partially_verified: styles.statePartial,
  control_plane_issue: styles.stateControl,
};

function ClawTraceWorkflowFilterBar({ filters, onFilterChange }: ClawTraceWorkflowFilterBarProps) {
  return (
    <div className={styles.filterRow}>
      <input
        className={styles.filterInput}
        value={filters.query ?? ''}
        onChange={(event) => onFilterChange({ ...filters, query: event.currentTarget.value })}
        placeholder="Filter workflows"
        aria-label="Filter workflows"
      />
      <button
        className={styles.modeButton}
        type="button"
        onClick={() => onFilterChange({ ...filters, onlyAttention: !filters.onlyAttention })}
      >
        {filters.onlyAttention ? 'Attention only' : 'All workflows'}
      </button>
    </div>
  );
}

function ClawTraceWorkflowCard({ workflow, onSelect }: ClawTraceWorkflowCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${workflow.isSelected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(workflow.id)}
      aria-pressed={Boolean(workflow.isSelected)}
    >
      <div className={styles.cardHead}>
        <h3 className={styles.cardName}>{workflow.name}</h3>
        <span className={styles.cardTime}>{workflow.lastUpdatedAt}</span>
      </div>
      <p className={styles.cardSummary}>{workflow.latestSummary}</p>
      <span className={`${styles.badge} ${TRUST_CLASS[workflow.trustState]}`}>{TRUST_LABEL[workflow.trustState]}</span>
    </button>
  );
}

function ClawTraceWorkflowPortfolio({ workflows, filters, onFilterChange, onSelectWorkflow }: ClawTraceWorkflowPortfolioProps) {
  const visible = workflows.filter((workflow) => {
    const byQuery = (filters.query ?? '').trim().length
      ? workflow.name.toLowerCase().includes((filters.query ?? '').trim().toLowerCase()) ||
        workflow.latestSummary.toLowerCase().includes((filters.query ?? '').trim().toLowerCase())
      : true;
    const byAttention = filters.onlyAttention ? Boolean(workflow.hasAttention) : true;
    return byQuery && byAttention;
  });

  return (
    <aside className={styles.portfolio}>
      <header className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Workflows</h2>
        <p className={styles.sectionSub}>Portfolio view with one deep selected cockpit.</p>
      </header>
      <ClawTraceWorkflowFilterBar filters={filters} onFilterChange={onFilterChange} />
      <div className={styles.list}>
        {visible.map((workflow) => (
          <ClawTraceWorkflowCard key={workflow.id} workflow={workflow} onSelect={onSelectWorkflow} />
        ))}
      </div>
    </aside>
  );
}

function ClawTraceTrustStateBand({ state, reason, updatedAt }: ClawTraceTrustStateBandProps) {
  return (
    <div className={`${styles.trustBand} ${TRUST_CLASS[state]}`}>
      <div>
        <div className={styles.trustLabel}>{TRUST_LABEL[state]}</div>
        <p className={styles.trustReason}>{reason}</p>
      </div>
      {updatedAt ? <span className={styles.cardTime}>{updatedAt}</span> : null}
    </div>
  );
}

function ClawTracePrimaryActionCard({ action, onPrimaryAction, onSelectSecondaryAction }: ClawTracePrimaryActionCardProps) {
  return (
    <section className={styles.panel}>
      <p className={styles.panelTitle}>Primary Next Action</p>
      <h3 className={styles.actionTitle}>{action.label}</h3>
      <p className={styles.actionWhy}>{action.why}</p>
      <div className={styles.actionButtons}>
        <button className={styles.primaryBtn} type="button" onClick={() => onPrimaryAction(action.id)}>
          Run
        </button>
        {action.secondaryActions?.map((secondary) => (
          <button
            key={secondary.id}
            className={styles.secondaryBtn}
            type="button"
            onClick={() => onSelectSecondaryAction(secondary.id)}
          >
            {secondary.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function ClawTraceRunStoryTimeline({ nodes, onOpenEvidence }: ClawTraceRunStoryTimelineProps) {
  return (
    <section className={styles.panel}>
      <p className={styles.panelTitle}>Run Story</p>
      <div className={styles.timeline}>
        {nodes.map((node) => (
          <button key={node.id} className={styles.timelineItem} type="button" onClick={() => onOpenEvidence(node.id)}>
            <div className={styles.timelineHead}>
              <span className={styles.timelineStep}>{node.stepLabel}</span>
              <span className={styles.timelineTime}>{node.occurredAt}</span>
            </div>
            <p className={styles.timelineText}>{node.explanation}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function ClawTraceVerificationBreakdown({ verification, onOpenVerifier }: ClawTraceVerificationBreakdownProps) {
  const summary = `${verification.successCount} success · ${verification.failCount} fail · ${verification.unknownCount} unknown`;
  return (
    <section className={styles.panel}>
      <p className={styles.panelTitle}>Verification</p>
      <p className={styles.actionWhy}>{verification.headline}</p>
      <p className={styles.cardSummary}>{summary}</p>
      <div className={styles.verifyList}>
        {verification.rows.map((row) => (
          <button key={row.id} className={styles.verifyRow} type="button" onClick={() => onOpenVerifier(row.id)}>
            <span className={styles.verifyName}>{row.label}</span>
            <span
              className={`${styles.verifyPill} ${
                row.state === 'success' ? styles.verifySuccess : row.state === 'fail' ? styles.verifyFail : styles.verifyUnknown
              }`}
            >
              {row.state}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ClawTraceStateDiffPanel({ items, onOpenDiffItem }: ClawTraceStateDiffPanelProps) {
  return (
    <section className={styles.panel}>
      <p className={styles.panelTitle}>State Diff</p>
      <div className={styles.verifyList}>
        {items.map((item) => (
          <button key={item.id} className={styles.verifyRow} type="button" onClick={() => onOpenDiffItem(item.id)}>
            <span className={styles.verifyName}>{item.key}</span>
            <span className={styles.cardTime}>{item.isContractRelevant ? 'contract-relevant' : 'informational'}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ClawTraceIncidentMemoPanel({ memo, onPromoteToRegression }: ClawTraceIncidentMemoPanelProps) {
  return (
    <section className={styles.panel}>
      <p className={styles.panelTitle}>Incident Memo</p>
      <h3 className={styles.actionTitle}>{memo.title}</h3>
      <p className={styles.memoBody}>{memo.impact}</p>
      {onPromoteToRegression ? (
        <div className={styles.actionButtons}>
          <button className={styles.secondaryBtn} type="button" onClick={() => onPromoteToRegression(memo.id)}>
            Promote to regression
          </button>
        </div>
      ) : null}
    </section>
  );
}

function ClawTraceWorkflowCockpit({ model, onPrimaryAction, onSelectSecondaryAction, onOpenMemo }: ClawTraceWorkflowCockpitProps) {
  return (
    <main className={styles.cockpit}>
      <header className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{model.workflowName}</h2>
        <p className={styles.sectionSub}>Contract v{model.contractVersion}</p>
      </header>
      <div className={styles.cockpitBody}>
        <ClawTraceTrustStateBand state={model.trustState} reason={model.trustReason} updatedAt="just now" />
        <ClawTracePrimaryActionCard
          action={model.primaryAction}
          onPrimaryAction={onPrimaryAction}
          onSelectSecondaryAction={onSelectSecondaryAction}
        />
        <ClawTraceVerificationBreakdown verification={model.verification} onOpenVerifier={(id) => onOpenMemo(id)} />
        <ClawTraceRunStoryTimeline nodes={model.timeline} onOpenEvidence={(id) => onOpenMemo(id)} />
        <ClawTraceStateDiffPanel items={model.stateDiff} onOpenDiffItem={(id) => onOpenMemo(id)} />
        {model.latestMemo ? (
          <ClawTraceIncidentMemoPanel memo={model.latestMemo} onPromoteToRegression={(id) => onOpenMemo(id)} />
        ) : null}
      </div>
    </main>
  );
}

function ClawTraceControlDecisionAudit({ records, onOpenRecord }: ClawTraceControlDecisionAuditProps) {
  return (
    <div className={styles.memoList}>
      {records.map((record) => (
        <button key={record.id} className={styles.memoItem} type="button" onClick={() => onOpenRecord(record.id)}>
          <h4 className={styles.memoTitle}>{record.outcome.toUpperCase()}</h4>
          <p className={styles.memoBody}>{record.primaryReason}</p>
        </button>
      ))}
    </div>
  );
}

function ClawTraceInvestigationDrawer({
  open,
  activeTab,
  tabs,
  onTabChange,
  onOpenChange,
  children,
}: {
  open: boolean;
  activeTab: ClawTraceDrawerTab['id'];
  tabs: ClawTraceDrawerTab[];
  onTabChange: (tabId: ClawTraceDrawerTab['id']) => void;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <aside className={`${styles.drawer} ${open ? '' : styles.drawerClosed}`}>
      <header className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Investigation</h2>
        <p className={styles.sectionSub}>Chat partner + artifacts</p>
        <div className={styles.actionButtons}>
          <button className={styles.secondaryBtn} type="button" onClick={() => onOpenChange(!open)}>
            {open ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </header>
      <div className={styles.drawerTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.drawerTab} ${activeTab === tab.id ? styles.drawerTabActive : ''}`}
            type="button"
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.drawerBody}>{children}</div>
    </aside>
  );
}

const mockMemo: ClawTraceIncidentMemo = {
  id: 'memo-1',
  title: 'Cover image step failed verification',
  happened: 'Image tool returned 200 but asset not retrievable from CDN.',
  impact: 'Workflow reached deploy gate with missing cover image; publish deferred.',
  knownEvidence: ['Tool call succeeded', 'Asset URL returned 404'],
  unknownEvidence: ['Whether fallback image template exists'],
  primaryNextAction: 'Re-run image generation with fallback template.',
  followUpActions: ['Promote as regression test'],
  createdAt: '2026-03-23T16:00:00Z',
};

const mockCockpit: ClawTraceWorkflowCockpitModel = {
  workflowId: 'seo-daily',
  workflowName: 'Daily SEO Content Pipeline',
  contractVersion: '7',
  trustState: 'at_risk',
  trustReason: 'Repeated image-generation drift in last 3 runs.',
  primaryAction: {
    id: 'action-rerun-image',
    label: 'Revalidate image step before publish',
    why: 'Image verifier failed in 2 of last 3 runs. Prevent a broken deploy.',
    confidenceLabel: 'High confidence',
    secondaryActions: [
      { id: 'action-open-memo', label: 'Open incident memo' },
      { id: 'action-freeze-deploy', label: 'Freeze deploy gate' },
    ],
  },
  verification: {
    headline: 'Partially verified',
    successCount: 3,
    failCount: 1,
    unknownCount: 1,
    rows: [
      { id: 'ver-article', label: 'Article created', state: 'success' },
      { id: 'ver-image', label: 'Cover image retrievable', state: 'fail' },
      { id: 'ver-commit', label: 'Git commit', state: 'success' },
      { id: 'ver-deploy', label: 'Vercel deploy', state: 'unknown' },
    ],
  },
  timeline: [
    {
      id: 'node-1',
      occurredAt: '09:02',
      stepLabel: 'Preflight',
      statusLabel: 'warn',
      explanation: 'Model/tool mismatch risk detected, run allowed with warning.',
      decisionOutcome: 'warn',
    },
    {
      id: 'node-2',
      occurredAt: '09:07',
      stepLabel: 'Image generation',
      statusLabel: 'fail',
      explanation: 'Returned URL did not verify. Deferred publish gate.',
      decisionOutcome: 'defer',
    },
  ],
  stateDiff: [
    {
      id: 'diff-1',
      key: 'skills/seo-cover-image.md',
      previousValue: 'v14',
      currentValue: 'v15',
      changedAt: '08:50',
      isContractRelevant: true,
      triggeredRevalidation: true,
    },
  ],
  latestMemo: mockMemo,
};

const mockAuditRecords = [
  {
    id: 'audit-1',
    decidedAt: '09:07',
    outcome: 'defer' as const,
    primaryReason: 'Cover image verification failed at mutating publish boundary.',
    rejectedAlternatives: ['allow', 'block'],
    contractVersion: '7',
    actorLabel: 'pre-action hook',
    inputSummary: ['image verifier fail', 'deploy not attempted'],
  },
];

export function ClawTraceStandalone() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<ClawTraceDrawerTab['id']>('investigation');
  const [filters, setFilters] = useState<ClawTraceWorkflowFilters>({ query: '', onlyAttention: false });
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('seo-daily');

  const appModel = useMemo<ClawTraceAppProps>(
    () => ({
      viewport: 'desktop',
      workflows: [
        {
          id: 'seo-daily',
          name: 'Daily SEO Content Pipeline',
          trustState: 'at_risk',
          latestRunState: 'deferred',
          latestSummary: 'Cover image verification failed before publish.',
          lastUpdatedAt: '2m ago',
          hasAttention: true,
          isSelected: selectedWorkflowId === 'seo-daily',
        },
        {
          id: 'news-digest',
          name: 'Morning News Digest',
          trustState: 'healthy',
          latestRunState: 'success',
          latestSummary: 'Completed and delivered at 08:30.',
          lastUpdatedAt: '34m ago',
          hasAttention: false,
          isSelected: selectedWorkflowId === 'news-digest',
        },
        {
          id: 'outreach',
          name: 'Outbound Follow-up Drafting',
          trustState: 'drifting',
          latestRunState: 'success_with_warning',
          latestSummary: 'Prompt drift detected after AGENTS.md update.',
          lastUpdatedAt: '11m ago',
          hasAttention: true,
          isSelected: selectedWorkflowId === 'outreach',
        },
      ],
      selectedWorkflowId,
      onSelectWorkflow: (workflowId: string) => setSelectedWorkflowId(workflowId),
      cockpit: mockCockpit,
      isOnboarding: false,
      isWarmup: false,
      drawerOpen,
      onDrawerOpenChange: setDrawerOpen,
    }),
    [drawerOpen, selectedWorkflowId]
  );

  const selectedCockpit = appModel.cockpit;

  return (
    <div className="operator clawtrace">
      <div className={styles.shellWrap}>
        <section className={styles.shell}>
          <aside className={styles.rail}>
            <div className={styles.railTop}>
              <span className={styles.railIcon}>CT</span>
              <span className={styles.railIcon}>W</span>
              <span className={styles.railIcon}>R</span>
            </div>
            <div className={styles.railBottom}>
              <span className={styles.railIcon}>S</span>
            </div>
          </aside>

          <ClawTraceWorkflowPortfolio
            workflows={appModel.workflows}
            filters={filters}
            onFilterChange={setFilters}
            onSelectWorkflow={appModel.onSelectWorkflow}
          />

          {selectedCockpit ? (
            <ClawTraceWorkflowCockpit
              model={selectedCockpit}
              onPrimaryAction={() => {
                setDrawerOpen(true);
                setActiveTab('evidence');
              }}
              onSelectSecondaryAction={() => {
                setDrawerOpen(true);
                setActiveTab('artifact');
              }}
              onOpenMemo={() => {
                setDrawerOpen(true);
                setActiveTab('artifact');
              }}
            />
          ) : null}

          <ClawTraceInvestigationDrawer
            open={drawerOpen}
            activeTab={activeTab}
            tabs={[
              { id: 'investigation', label: 'Investigation' },
              { id: 'artifact', label: 'Artifacts' },
              { id: 'contract', label: 'Contract' },
              { id: 'evidence', label: 'Evidence' },
            ]}
            onTabChange={setActiveTab}
            onOpenChange={setDrawerOpen}
          >
            {activeTab === 'artifact' ? (
              <div className={styles.memoList}>
                {selectedCockpit?.latestMemo ? (
                  <ClawTraceIncidentMemoPanel memo={selectedCockpit.latestMemo} onPromoteToRegression={() => {}} />
                ) : null}
              </div>
            ) : null}
            {activeTab === 'evidence' ? (
              <ClawTraceControlDecisionAudit records={mockAuditRecords} onOpenRecord={() => {}} />
            ) : null}
            {activeTab === 'investigation' ? (
              <div className={styles.memoItem}>
                <h4 className={styles.memoTitle}>Chat partner</h4>
                <p className={styles.memoBody}>
                  Ask: "Why did this run defer?" or "Create regression from this incident."
                </p>
              </div>
            ) : null}
            {activeTab === 'contract' ? (
              <div className={styles.memoItem}>
                <h4 className={styles.memoTitle}>Workflow contract v{selectedCockpit?.contractVersion}</h4>
                <p className={styles.memoBody}>Mutating publish step requires successful image verifier.</p>
              </div>
            ) : null}
          </ClawTraceInvestigationDrawer>
        </section>
      </div>
    </div>
  );
}
