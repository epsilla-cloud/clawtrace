'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { OpenClawDiscoverySnapshot, WorkflowDiscovery } from '../../../lib/openclaw-discovery';
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 3 : 2,
    maximumFractionDigits: value < 1 ? 3 : 2,
  }).format(value);
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

function cardSubtitle(agent: WorkflowDiscovery): string {
  return `${agent.runStats7d.success}/${agent.runStats7d.total} success in 7d`;
}

export function WorkflowPortfolio({ initialSnapshot }: WorkflowPortfolioProps) {
  const [snapshot, setSnapshot] = useState<OpenClawDiscoverySnapshot | null>(initialSnapshot ?? null);
  const [loadingSnapshot, setLoadingSnapshot] = useState<boolean>(!initialSnapshot);
  const [query, setQuery] = useState('');

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

  const agents = snapshot?.workflows ?? [];
  const metrics = snapshot?.metrics;

  const visibleAgents = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle.length) {
      return agents;
    }

    return agents.filter((agent) => {
      return (
        agent.name.toLowerCase().includes(needle) ||
        agent.failureThemes.join(' ').toLowerCase().includes(needle) ||
        agent.inferredGoals.join(' ').toLowerCase().includes(needle)
      );
    });
  }, [query, agents]);

  if (!snapshot || !metrics) {
    return (
      <main className={styles.page}>
        <header className={styles.summaryBar}>
          <div className={styles.summaryMetric}>
            <span className={styles.summaryLabel}>Discovery</span>
            <span className={styles.summaryValue}>{loadingSnapshot ? 'Loading' : 'Unavailable'}</span>
          </div>
        </header>

        <section className={styles.dashboard}>
          <header className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>Agent Dashboard</h1>
            <p className={styles.sectionSubtitle}>
              {loadingSnapshot
                ? 'Importing your OpenClaw agents and runs...'
                : 'Unable to load discovery snapshot. Verify local paths and refresh.'}
            </p>
          </header>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.summaryBar}>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>Agents</span>
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
          <span className={styles.summaryLabel}>Est. Cost (7d)</span>
          <span className={styles.summaryValue}>{formatCurrency(metrics.estimatedCostUsdLast7d)}</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>Active Runs</span>
          <span className={styles.summaryValue}>{formatNumber(metrics.activeTrajectories)}</span>
        </div>
      </header>

      <section className={styles.dashboard}>
        <header className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>Agent Dashboard</h1>
          <p className={styles.sectionSubtitle}>All agents in one list. Open a card to inspect details on the next page.</p>
        </header>

        <div className={styles.filterRow}>
          <input
            className={styles.filterInput}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Filter agents"
            aria-label="Filter agents"
          />
        </div>

        {visibleAgents.length ? (
          <div className={styles.cardGrid}>
            {visibleAgents.map((agent) => (
              <article key={agent.id} className={styles.agentCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.agentName}>{agent.name}</h2>
                  <span className={`${styles.statusPill} ${TRUST_CLASS[agent.trustState]}`}>{TRUST_LABEL[agent.trustState]}</span>
                </div>

                <p className={styles.cardSubtitle}>{cardSubtitle(agent)}</p>

                <div className={styles.cardStats}>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatLabel}>Est. Cost (7d)</span>
                    <span className={styles.cardStatValue}>{formatCurrency(agent.costStats7d.totalUsd)}</span>
                  </div>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatLabel}>Last Run</span>
                    <span className={styles.cardStatValue}>{agent.latestRun ? formatDate(agent.latestRun.atMs) : 'n/a'}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/control-room/${encodeURIComponent(agent.id)}`} className={styles.detailsLink}>
                    Open details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className={styles.emptyCard}>
            <p className={styles.emptyTitle}>No agents match this filter.</p>
            <p className={styles.emptyBody}>Try a different search term or clear the filter.</p>
          </article>
        )}
      </section>
    </main>
  );
}

