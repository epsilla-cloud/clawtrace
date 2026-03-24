'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import type {
  OpenClawDiscoverySnapshot,
  WorkflowDiscovery,
  WorkflowRecommendation,
} from '../../../lib/openclaw-discovery';
import { FlowLeftNav } from '../flow/FlowLeftNav';
import styles from './OnboardingGuidedConversation.module.css';

type OnboardingMessageRole = 'assistant' | 'system' | 'user';

type OnboardingMessage = {
  id: string;
  role: OnboardingMessageRole;
  text: string;
};

type OnboardingGuidedConversationProps = {
  flow: ClawTraceFlowDefinition;
  allFlows: ClawTraceFlowDefinition[];
  initialSnapshot?: OpenClawDiscoverySnapshot | null;
  previousFlow: ClawTraceFlowDefinition | null;
  nextFlow: ClawTraceFlowDefinition | null;
};

function roleClass(role: OnboardingMessageRole) {
  if (role === 'assistant') return styles.assistant;
  if (role === 'user') return styles.user;
  return styles.system;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 3 : 2,
    maximumFractionDigits: value < 1 ? 3 : 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatDate(valueMs: number): string {
  if (!valueMs) {
    return 'n/a';
  }
  return new Date(valueMs).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toStatusLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function recommendationPreview(recommendations: WorkflowRecommendation[], limit = 2): string {
  if (!recommendations.length) {
    return 'No additional controls suggested yet.';
  }
  return recommendations
    .slice(0, limit)
    .map((item) => item.label)
    .join('; ');
}

function buildTranscript(flowId: string, snapshot: OpenClawDiscoverySnapshot): OnboardingMessage[] {
  const primaryWorkflow = snapshot.workflows[0];

  if (flowId === 'f0-connect') {
    const workflowNames = snapshot.workflows.map((item) => item.name).join(', ');

    return [
      {
        id: 'f0-a1',
        role: 'assistant',
        text: `Connected to local OpenClaw runtime at ${snapshot.openclawPath}. I also linked workspace context at ${snapshot.workspacePath}.`,
      },
      {
        id: 'f0-s1',
        role: 'system',
        text: `Import complete: ${snapshot.metrics.workflowCount} workflows discovered, ${formatNumber(snapshot.metrics.runsLast7d)} runs in last 7 days, ${formatNumber(snapshot.metrics.tokensLast7d)} tokens consumed, estimated ${formatCurrency(snapshot.metrics.estimatedCostUsdLast7d)} spend, ${snapshot.metrics.modelsUsed.length} models used.`,
      },
      {
        id: 'f0-a2',
        role: 'assistant',
        text: workflowNames.length
          ? `Discovered workflows: ${workflowNames}. I am loading their latest trajectories and trust posture now.`
          : 'No cron workflows were discovered yet. I can still monitor raw trajectories as they arrive.',
      },
      {
        id: 'f0-a3',
        role: 'assistant',
        text: primaryWorkflow
          ? `Before we lock controls, tell me your top business outcome for ${primaryWorkflow.name}. I already inferred a starting hypothesis you can edit.`
          : 'Share your top business outcome and I will bootstrap the first workflow contract around it.',
      },
    ];
  }

  if (flowId === 'f1-audit') {
    const portfolioGoals = snapshot.inferredPortfolioGoals.join(' | ');
    const riskWorkflow = snapshot.workflows.find((item) => item.trustState === 'blocked' || item.trustState === 'at_risk') ?? primaryWorkflow;
    const highestCostWorkflow = [...snapshot.workflows].sort((a, b) => b.costStats7d.totalUsd - a.costStats7d.totalUsd)[0];

    return [
      {
        id: 'f1-a1',
        role: 'assistant',
        text: 'Guided audit is complete. I inferred workflow goals, risk boundaries, and control points from your real run history and instruction files.',
      },
      {
        id: 'f1-s1',
        role: 'system',
        text: portfolioGoals.length
          ? `Inferred goals: ${portfolioGoals}`
          : 'No explicit goals inferred yet. Add one measurable business outcome to seed contract generation.',
      },
      {
        id: 'f1-s2',
        role: 'system',
        text: riskWorkflow
          ? `${riskWorkflow.name}: ${riskWorkflow.runStats7d.failed}/${riskWorkflow.runStats7d.total} failed runs in 7d. Top failure themes: ${riskWorkflow.failureThemes.join(', ') || 'none flagged'}.`
          : 'No workflow risk themes detected yet.',
      },
      {
        id: 'f1-s3',
        role: 'system',
        text: highestCostWorkflow
          ? `Highest estimated spend: ${highestCostWorkflow.name} at ${formatCurrency(highestCostWorkflow.costStats7d.totalUsd)} in 7d.`
          : 'No cost data available yet.',
      },
      {
        id: 'f1-a2',
        role: 'assistant',
        text: 'I labeled known vs unknown evidence and prepared a first contract posture. Confirm the goal and I will tune strictness for mutating boundaries and cost guardrails.',
      },
    ];
  }

  const workflowForHandoff = primaryWorkflow;

  return [
    {
      id: 'f2-a1',
      role: 'assistant',
      text: 'First-value handoff is ready. I prepared reliability controls based on your actual trajectories and repeated failure patterns.',
    },
    {
      id: 'f2-s1',
      role: 'system',
      text: workflowForHandoff
        ? `${workflowForHandoff.name}: success rate ${formatPercent(workflowForHandoff.runStats7d.successRate)} in last 7 days, ${workflowForHandoff.trajectories.length} recent trajectories imported, estimated spend ${formatCurrency(workflowForHandoff.costStats7d.totalUsd)}.`
        : 'No workflow selected yet.',
    },
    {
      id: 'f2-s2',
      role: 'system',
      text: workflowForHandoff
        ? `Recommended controls: ${recommendationPreview(workflowForHandoff.recommendations, 3)}.`
        : 'Recommended controls will appear once at least one workflow is discovered.',
    },
    {
      id: 'f2-a2',
      role: 'assistant',
      text: 'Open the portfolio to monitor all workflows, inspect trajectories, and apply these recommendations directly from the control room.',
    },
  ];
}

function quickReplies(flowId: string, snapshot: OpenClawDiscoverySnapshot): string[] {
  const primaryWorkflow = snapshot.workflows[0];

  if (flowId === 'f0-connect') {
    return [
      snapshot.inferredPortfolioGoals[0] ?? 'Reduce daily manual intervention to under 5 minutes.',
      snapshot.inferredPortfolioGoals[1] ?? 'Improve reliability of daily publishing workflow.',
      'Show imported workflows, trajectories, and cost breakdown',
    ];
  }

  if (flowId === 'f1-audit') {
    return [
      primaryWorkflow?.inferredGoals[0] ?? 'Prioritize deployment safety over speed.',
      primaryWorkflow?.failureThemes[0]
        ? `Prioritize fixing ${toStatusLabel(primaryWorkflow.failureThemes[0])}`
        : 'Prioritize repeated failure prevention',
      'Proceed with recommended contract posture',
    ];
  }

  return [
    'Apply recommended controls',
    'Open workflow portfolio',
    'Tune alerts after first week',
  ];
}

function workflowSummary(workflow: WorkflowDiscovery): string {
  return `${workflow.runStats7d.success}/${workflow.runStats7d.total} success in 7d · ${workflow.trajectories.length} trajectories · ${formatCurrency(workflow.costStats7d.totalUsd)} est`;
}

export function OnboardingGuidedConversation({
  flow,
  allFlows,
  initialSnapshot,
  previousFlow,
  nextFlow,
}: OnboardingGuidedConversationProps) {
  const [snapshot, setSnapshot] = useState<OpenClawDiscoverySnapshot | null>(initialSnapshot ?? null);
  const [loadingSnapshot, setLoadingSnapshot] = useState<boolean>(!initialSnapshot);
  const [draft, setDraft] = useState('');
  const [manualMessages, setManualMessages] = useState<OnboardingMessage[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadSnapshot() {
      if (snapshot) {
        return;
      }

      setLoadingSnapshot(true);
      try {
        const response = await fetch('/api/discovery', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Discovery API failed with ${response.status}`);
        }
        const data = (await response.json()) as OpenClawDiscoverySnapshot;
        if (isMounted) {
          setSnapshot(data);
        }
      } catch {
        if (isMounted) {
          setSnapshot(null);
        }
      } finally {
        if (isMounted) {
          setLoadingSnapshot(false);
        }
      }
    }

    void loadSnapshot();

    return () => {
      isMounted = false;
    };
  }, [snapshot]);

  const transcript = useMemo(() => {
    if (!snapshot) {
      return [
        {
          id: 'loading-1',
          role: 'assistant' as const,
          text: loadingSnapshot
            ? 'Connecting to local OpenClaw telemetry and importing workflow traces...'
            : 'Unable to load OpenClaw snapshot right now. Verify local paths and refresh.',
        },
      ];
    }
    return [...buildTranscript(flow.id, snapshot), ...manualMessages];
  }, [flow.id, loadingSnapshot, manualMessages, snapshot]);

  const replies = useMemo(() => {
    if (!snapshot) {
      return [];
    }
    return quickReplies(flow.id, snapshot);
  }, [flow.id, snapshot]);

  const onQuickReply = (reply: string) => {
    setDraft(reply);
  };

  const onSend = () => {
    const trimmed = draft.trim();
    if (!trimmed.length) {
      return;
    }

    setManualMessages((current) => [
      ...current,
      {
        id: `manual-user-${current.length + 1}`,
        role: 'user',
        text: trimmed,
      },
      {
        id: `manual-assistant-${current.length + 1}`,
        role: 'assistant',
        text: 'Captured. I will use this preference to tune contract strictness and recommendation ranking.',
      },
    ]);
    setDraft('');
  };

  const continueHref = flow.id === 'f2-handoff' ? '/control-room' : nextFlow?.route ?? '/control-room';

  if (!snapshot) {
    return (
      <main className={styles.page}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <p className={styles.connectionLine}>OpenClaw import: {loadingSnapshot ? 'Loading' : 'Unavailable'}</p>
            <p className={styles.pathLine}>~/.openclaw</p>
          </div>
          <p className={styles.topBarHint}>Onboarding guided chat</p>
        </header>
        <section className={styles.shell}>
          <div className={styles.leftRail}>
            <FlowLeftNav flow={flow} allFlows={allFlows} />
          </div>

          <section className={styles.layout}>
            <section className={styles.chatPanel}>
              <header className={styles.chatHeader}>
                <h1 className={styles.chatTitle}>{flow.title}</h1>
                <p className={styles.chatSubtitle}>Preparing onboarding context from local telemetry.</p>
              </header>
              <div className={styles.transcript}>
                {transcript.map((message) => (
                  <article key={message.id} className={`${styles.message} ${roleClass(message.role)}`}>
                    <p className={styles.messageRole}>{message.role}</p>
                    <p className={styles.messageText}>{message.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <p className={styles.connectionLine}>OpenClaw import: {toStatusLabel(snapshot.importHealth)}</p>
          <p className={styles.pathLine}>{snapshot.openclawPath}</p>
        </div>
        <p className={styles.topBarHint}>Onboarding: guided conversation + evidence import</p>
      </header>

      <section className={styles.shell}>
        <div className={styles.leftRail}>
          <FlowLeftNav flow={flow} allFlows={allFlows} />
        </div>

        <section className={styles.layout}>
          <section className={styles.chatPanel}>
            <header className={styles.chatHeader}>
              <h1 className={styles.chatTitle}>{flow.title}</h1>
              <p className={styles.chatSubtitle}>Grounded in live workspace telemetry, traces, and workflow state.</p>
            </header>

            <div className={styles.transcript}>
              {transcript.map((message) => (
                <article key={message.id} className={`${styles.message} ${roleClass(message.role)}`}>
                  <p className={styles.messageRole}>{message.role}</p>
                  <p className={styles.messageText}>{message.text}</p>
                </article>
              ))}
            </div>

            <footer className={styles.composer}>
              <div className={styles.quickReplies}>
                {replies.map((reply) => (
                  <button key={reply} type="button" className={styles.quickReply} onClick={() => onQuickReply(reply)}>
                    {reply}
                  </button>
                ))}
              </div>

              <div className={styles.composerRow}>
                <input
                  className={styles.input}
                  value={draft}
                  onChange={(event) => setDraft(event.currentTarget.value)}
                  placeholder="Confirm or edit your high-level goal"
                  aria-label="Onboarding goal response"
                />
                <button className={styles.sendButton} type="button" onClick={onSend}>
                  Save
                </button>
              </div>
            </footer>
          </section>

          <aside className={styles.sidePanel}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Imported Metrics</h2>
              <div className={styles.metricGrid}>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Workflows</span>
                  <span className={styles.metricValue}>{formatNumber(snapshot.metrics.workflowCount)}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Runs (7d)</span>
                  <span className={styles.metricValue}>{formatNumber(snapshot.metrics.runsLast7d)}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Tokens (7d)</span>
                  <span className={styles.metricValue}>{formatNumber(snapshot.metrics.tokensLast7d)}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Est. Cost (7d)</span>
                  <span className={styles.metricValue}>{formatCurrency(snapshot.metrics.estimatedCostUsdLast7d)}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricLabel}>Models</span>
                  <span className={styles.metricValue}>{snapshot.metrics.modelsUsed.length}</span>
                </div>
              </div>
            </article>

            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Workflow Discovery</h2>
              <ul className={styles.list}>
                {snapshot.workflows.map((workflow) => (
                  <li key={workflow.id} className={styles.listItem}>
                    <p className={styles.listTitle}>{workflow.name}</p>
                    <p className={styles.listBody}>{workflowSummary(workflow)}</p>
                    <p className={styles.listMeta}>Last run: {workflow.latestRun ? formatDate(workflow.latestRun.atMs) : 'n/a'}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.card}>
              <h2 className={styles.cardTitle}>Inferred Goals</h2>
              <ul className={styles.checkList}>
                {snapshot.inferredPortfolioGoals.map((goal) => (
                  <li key={goal} className={styles.checkItem}>
                    {goal}
                  </li>
                ))}
              </ul>
            </article>

            {flow.id === 'f2-handoff' ? (
              <article className={styles.card}>
                <h2 className={styles.cardTitle}>Recommended Control Posture</h2>
                <ul className={styles.list}>
                  {(snapshot.workflows[0]?.recommendations ?? []).map((recommendation) => (
                    <li key={recommendation.id} className={styles.listItem}>
                      <p className={styles.listTitle}>{recommendation.label}</p>
                      <p className={styles.listBody}>{recommendation.detail}</p>
                      <p className={styles.listMeta}>{recommendation.suggestedSetting}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}

            <div className={styles.actions}>
              {previousFlow ? (
                <Link className={styles.secondaryButton} href={previousFlow.route}>
                  Back
                </Link>
              ) : null}
              <Link className={styles.primaryButton} href={continueHref}>
                {flow.id === 'f2-handoff' ? 'Open Agent Dashboard' : flow.primaryActionLabel}
              </Link>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
