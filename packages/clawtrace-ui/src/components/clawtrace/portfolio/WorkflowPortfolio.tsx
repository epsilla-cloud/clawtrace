'use client';

import { useEffect, useMemo, useState } from 'react';
import type { OpenClawDiscoverySnapshot, WorkflowDiscovery, WorkflowTrajectory } from '../../../lib/openclaw-discovery';
import styles from './WorkflowPortfolio.module.css';

type WorkflowPortfolioProps = {
  initialSnapshot?: OpenClawDiscoverySnapshot | null;
};

const TRUST_LABEL: Record<WorkflowDiscovery['trustState'], string> = {
  healthy: 'Healthy',
  at_risk: 'At Risk',
  drifting: 'Drifting',
  blocked: 'Blocked',
  awaiting_confirmation: 'Awaiting Confirmation',
  partially_verified: 'Partially Verified',
};

const TRUST_CLASS: Record<WorkflowDiscovery['trustState'], string> = {
  healthy: styles.stateHealthy,
  at_risk: styles.stateAtRisk,
  drifting: styles.stateDrifting,
  blocked: styles.stateBlocked,
  awaiting_confirmation: styles.stateAwaiting,
  partially_verified: styles.statePartial,
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
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

function formatDuration(durationMs: number): string {
  if (!durationMs) {
    return 'n/a';
  }
  const seconds = Math.round(durationMs / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  return `${minutes}m ${remainSeconds}s`;
}

function workflowSubtitle(workflow: WorkflowDiscovery): string {
  return `${workflow.runStats7d.success}/${workflow.runStats7d.total} success in 7d`;
}

function trajectoryRow(trajectory: WorkflowTrajectory) {
  return `${trajectory.llmCalls} LLM · ${trajectory.toolCalls} tools · ${formatNumber(trajectory.totalTokens)} tokens`;
}

export function WorkflowPortfolio({ initialSnapshot }: WorkflowPortfolioProps) {
  const [snapshot, setSnapshot] = useState<OpenClawDiscoverySnapshot | null>(initialSnapshot ?? null);
  const [loadingSnapshot, setLoadingSnapshot] = useState<boolean>(!initialSnapshot);
  const [query, setQuery] = useState('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(initialSnapshot?.workflows[0]?.id ?? null);

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
          if (!selectedWorkflowId) {
            setSelectedWorkflowId(data.workflows[0]?.id ?? null);
          }
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
  }, [selectedWorkflowId, snapshot]);

  const workflows = snapshot?.workflows ?? [];
  const metrics = snapshot?.metrics;
  const versioning = snapshot?.versioning;

  const visibleWorkflows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle.length) {
      return workflows;
    }

    return workflows.filter((workflow) => {
      return (
        workflow.name.toLowerCase().includes(needle) ||
        workflow.failureThemes.join(' ').toLowerCase().includes(needle) ||
        workflow.inferredGoals.join(' ').toLowerCase().includes(needle)
      );
    });
  }, [query, workflows]);

  const selectedWorkflow = useMemo(() => {
    if (!selectedWorkflowId) {
      return visibleWorkflows[0] ?? null;
    }
    return workflows.find((workflow) => workflow.id === selectedWorkflowId) ?? visibleWorkflows[0] ?? null;
  }, [selectedWorkflowId, visibleWorkflows, workflows]);

  if (!snapshot || !metrics || !versioning) {
    return (
      <main className={styles.page}>
        <header className={styles.summaryBar}>
          <div className={styles.summaryMetric}>
            <span className={styles.summaryLabel}>Discovery</span>
            <span className={styles.summaryValue}>{loadingSnapshot ? 'Loading' : 'Unavailable'}</span>
          </div>
        </header>
        <section className={styles.layout}>
          <section className={styles.cockpit}>
            <header className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>Workflow Portfolio</h1>
              <p className={styles.sectionSubtitle}>
                {loadingSnapshot
                  ? 'Importing real OpenClaw workflows and trajectories...'
                  : 'Unable to load discovery snapshot. Verify local paths and refresh.'}
              </p>
            </header>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.summaryBar}>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>Workflows</span>
          <span className={styles.summaryValue}>{formatNumber(metrics.workflowCount)}</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>Runs (7d)</span>
          <span className={styles.summaryValue}>{formatNumber(metrics.runsLast7d)}</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>Tokens (7d)</span>
          <span className={styles.summaryValue}>{formatNumber(metrics.tokensLast7d)}</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>Active Trajectories</span>
          <span className={styles.summaryValue}>{formatNumber(metrics.activeTrajectories)}</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>Models</span>
          <span className={styles.summaryValue}>{formatNumber(metrics.modelsUsed.length)}</span>
        </div>
      </header>

      <section className={styles.layout}>
        <aside className={styles.portfolio}>
          <header className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>Workflow Portfolio</h1>
            <p className={styles.sectionSubtitle}>Discovered from your local OpenClaw cron and trace history.</p>
          </header>

          <div className={styles.filterRow}>
            <input
              className={styles.filterInput}
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Filter workflows"
              aria-label="Filter workflows"
            />
          </div>

          <div className={styles.workflowList}>
            {visibleWorkflows.map((workflow) => (
              <button
                key={workflow.id}
                type="button"
                className={`${styles.workflowCard} ${workflow.id === selectedWorkflow?.id ? styles.workflowCardSelected : ''}`}
                onClick={() => setSelectedWorkflowId(workflow.id)}
                aria-pressed={workflow.id === selectedWorkflow?.id}
              >
                <div className={styles.workflowCardHeader}>
                  <h2 className={styles.workflowName}>{workflow.name}</h2>
                  <span className={`${styles.statusPill} ${TRUST_CLASS[workflow.trustState]}`}>{TRUST_LABEL[workflow.trustState]}</span>
                </div>
                <p className={styles.workflowMeta}>{workflowSubtitle(workflow)}</p>
                <p className={styles.workflowMeta}>Schedule: {workflow.scheduleLabel}</p>
                <p className={styles.workflowMeta}>Last run: {workflow.latestRun ? formatDate(workflow.latestRun.atMs) : 'n/a'}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className={styles.cockpit}>
          {selectedWorkflow ? (
            <>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{selectedWorkflow.name}</h2>
                <p className={styles.sectionSubtitle}>{selectedWorkflow.trustReason}</p>
              </header>

              <div className={styles.cockpitGrid}>
                <article className={styles.panel}>
                  <h3 className={styles.panelTitle}>Inferred Goals</h3>
                  <ul className={styles.tagList}>
                    {selectedWorkflow.inferredGoals.map((goal) => (
                      <li key={goal} className={styles.tagItem}>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className={styles.panel}>
                  <h3 className={styles.panelTitle}>Run Health (7d)</h3>
                  <div className={styles.metricGrid}>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Success</span>
                      <span className={styles.metricValue}>{formatNumber(selectedWorkflow.runStats7d.success)}</span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Failed</span>
                      <span className={styles.metricValue}>{formatNumber(selectedWorkflow.runStats7d.failed)}</span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Unknown</span>
                      <span className={styles.metricValue}>{formatNumber(selectedWorkflow.runStats7d.unknown)}</span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Success Rate</span>
                      <span className={styles.metricValue}>{formatPercent(selectedWorkflow.runStats7d.successRate)}</span>
                    </div>
                  </div>
                </article>

                <article className={styles.panel}>
                  <h3 className={styles.panelTitle}>Model Usage</h3>
                  <ul className={styles.modelList}>
                    {selectedWorkflow.modelUsage.map((item) => (
                      <li key={item.model} className={styles.modelItem}>
                        <span>{item.model}</span>
                        <span>{item.count} runs</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className={styles.panelWide}>
                  <h3 className={styles.panelTitle}>Recent Trajectories</h3>
                  {selectedWorkflow.trajectories.length ? (
                    <div className={styles.trajectoryList}>
                      {selectedWorkflow.trajectories.map((trajectory) => (
                        <div key={trajectory.traceId} className={styles.trajectoryRow}>
                          <div>
                            <p className={styles.trajectoryTitle}>{trajectory.traceId}</p>
                            <p className={styles.trajectoryMeta}>{trajectoryRow(trajectory)}</p>
                          </div>
                          <div className={styles.trajectoryStats}>
                            <span>{trajectory.status}</span>
                            <span>{formatDuration(trajectory.durationMs)}</span>
                            <span>{formatDate(trajectory.startedAtMs)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyState}>No trajectories captured for this workflow yet.</p>
                  )}
                </article>
              </div>
            </>
          ) : (
            <article className={styles.panelWide}>
              <h2 className={styles.sectionTitle}>No workflow selected</h2>
              <p className={styles.emptyState}>Connect an OpenClaw workflow to start trajectory monitoring.</p>
            </article>
          )}
        </section>

        <aside className={styles.recommendationRail}>
          {selectedWorkflow ? (
            <>
              <article className={styles.panel}>
                <h3 className={styles.panelTitle}>Recommended Configuration</h3>
                <ul className={styles.recommendationList}>
                  {selectedWorkflow.recommendations.map((recommendation) => (
                    <li key={recommendation.id} className={styles.recommendationItem}>
                      <p className={styles.recommendationTitle}>{recommendation.label}</p>
                      <p className={styles.recommendationBody}>{recommendation.detail}</p>
                      <p className={styles.recommendationMeta}>{recommendation.suggestedSetting}</p>
                    </li>
                  ))}
                </ul>
              </article>

              <article className={styles.panel}>
                <h3 className={styles.panelTitle}>State Versioning</h3>
                <p className={styles.recommendationBody}>
                  Config audit stream: {versioning.configAuditEnabled ? 'enabled' : 'not found'} · {versioning.configChanges7d}{' '}
                  changes in 7d.
                </p>
                <ul className={styles.stateList}>
                  {versioning.stateFiles.map((stateFile) => (
                    <li key={stateFile.filePath} className={styles.stateItem}>
                      <span>{stateFile.filePath.split('/').pop()}</span>
                      <span>{stateFile.exists ? 'tracked' : 'missing'}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className={styles.panel}>
                <h3 className={styles.panelTitle}>Immediate Focus</h3>
                <p className={styles.recommendationBody}>
                  Prioritize deterministic checks at mutating boundaries before publish/deploy. Then promote repeated failures into regression evals.
                </p>
              </article>
            </>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
