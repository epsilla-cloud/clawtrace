'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { FlowLeftNav } from '../flow/FlowLeftNav';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import type { OpenClawDiscoverySnapshot, WorkflowDiscovery } from '../../../lib/openclaw-discovery';
import styles from './WorkflowPortfolio.module.css';

type WorkflowPortfolioProps = {
  initialSnapshot?: OpenClawDiscoverySnapshot | null;
  flow: ClawTraceFlowDefinition;
  allFlows: ClawTraceFlowDefinition[];
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

function formatShortDay(valueMs: number): string {
  return new Date(valueMs).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
}

type TrendPoint = {
  dayStartMs: number;
  label: string;
  runs: number;
  costUsd: number;
};

function buildSevenDayTrend(snapshot: OpenClawDiscoverySnapshot): TrendPoint[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayStartMs = today.getTime();

  const points: TrendPoint[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const dayStartMs = todayStartMs - offset * dayMs;
    points.push({
      dayStartMs,
      label: formatShortDay(dayStartMs),
      runs: 0,
      costUsd: 0,
    });
  }

  const startBoundary = todayStartMs - 6 * dayMs;
  const endBoundary = todayStartMs + dayMs;
  const indexByDay = new Map(points.map((point, index) => [point.dayStartMs, index]));

  for (const workflow of snapshot.workflows) {
    for (const trajectory of workflow.trajectories) {
      const startedAt = trajectory.startedAtMs;
      if (startedAt < startBoundary || startedAt >= endBoundary) {
        continue;
      }

      const bucketDate = new Date(startedAt);
      bucketDate.setHours(0, 0, 0, 0);
      const bucket = indexByDay.get(bucketDate.getTime());
      if (bucket === undefined) {
        continue;
      }

      points[bucket].runs += 1;
      points[bucket].costUsd += trajectory.estimatedCostUsd;
    }
  }

  return points.map((point) => ({
    ...point,
    costUsd: Number(point.costUsd.toFixed(4)),
  }));
}

type TrendChartProps = {
  title: string;
  subtitle: string;
  categories: string[];
  values: number[];
  valueMode: 'number' | 'currency';
  formatValue: (value: number) => string;
};

function TrendChart({ title, subtitle, categories, values, valueMode, formatValue }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const maxValue = Math.max(...values, 0);
  const latest = values.length ? values[values.length - 1] : 0;

  useEffect(() => {
    const node = chartRef.current;
    if (!node) {
      return;
    }

    const chart = echarts.init(node);
    const option: EChartsOption = {
      animation: false,
      grid: {
        left: 34,
        right: 16,
        top: 12,
        bottom: 26,
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const data = Array.isArray(params) && params.length ? params[0] : null;
          if (!data || typeof data !== 'object') {
            return '';
          }

          const item = data as { axisValueLabel?: string; value?: number };
          const value = typeof item.value === 'number' ? item.value : 0;
          return `${item.axisValueLabel ?? ''}<br/>${valueMode === 'currency' ? formatCurrency(value) : formatNumber(value)}`;
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#d7cbc0',
          },
        },
        axisLabel: {
          color: '#7b6d62',
          fontSize: 11,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#ede6df',
          },
        },
        axisLabel: {
          color: '#7b6d62',
          fontSize: 11,
          formatter: (value: number) => (valueMode === 'currency' ? `$${value.toFixed(2)}` : `${value}`),
        },
      },
      series: [
        {
          type: 'line',
          data: values,
          smooth: 0.22,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#99613a',
            width: 2,
          },
          itemStyle: {
            color: '#99613a',
          },
          areaStyle: {
            color: 'rgba(153, 97, 58, 0.12)',
          },
        },
      ],
    };

    chart.setOption(option, true);

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [categories, values, valueMode]);

  return (
    <article className={styles.trendCard}>
      <header>
        <h2 className={styles.trendTitle}>{title}</h2>
        <p className={styles.trendSubtitle}>{subtitle}</p>
      </header>

      <div className={styles.trendPlot}>
        <div className={styles.trendCanvas} ref={chartRef} aria-label={title} />
      </div>

      <div className={styles.trendMeta}>
        <span>Peak {formatValue(maxValue)}</span>
        <span>Latest {formatValue(latest)}</span>
      </div>

      <div className={styles.trendLabels}>
        {categories.map((category) => (
          <span key={`${title}-${category}`}>{category}</span>
        ))}
      </div>
    </article>
  );
}

function formatAgentMetrics(agent: WorkflowDiscovery): string {
  return `${agent.runStats7d.success}/${agent.runStats7d.total} success · ${formatNumber(agent.tokenStats7d.total)} tokens · ${formatCurrency(agent.costStats7d.totalUsd)}`;
}

export function WorkflowPortfolio({ initialSnapshot, flow, allFlows }: WorkflowPortfolioProps) {
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
  const trend = snapshot ? buildSevenDayTrend(snapshot) : [];
  const trendLabels = trend.map((point) => point.label);
  const trendRuns = trend.map((point) => point.runs);
  const trendCost = trend.map((point) => point.costUsd);
  const totalSuccessfulRuns = agents.reduce((sum, agent) => sum + agent.runStats7d.success, 0);
  const totalRuns = agents.reduce((sum, agent) => sum + agent.runStats7d.total, 0);
  const portfolioSuccessRate = totalRuns > 0 ? Math.round((totalSuccessfulRuns / totalRuns) * 100) : 0;

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
        <section className={styles.shell}>
          <div className={styles.leftRail}>
            <FlowLeftNav flow={flow} allFlows={allFlows} />
          </div>

          <section className={styles.dashboard}>
            <header className={styles.summaryBar}>
              <div className={styles.summaryMetric}>
                <span className={styles.summaryLabel}>Discovery</span>
                <span className={styles.summaryValue}>{loadingSnapshot ? 'Loading' : 'Unavailable'}</span>
              </div>
            </header>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.leftRail}>
          <FlowLeftNav flow={flow} allFlows={allFlows} />
        </div>

        <section className={styles.dashboard}>
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
            <div className={styles.summaryMetric}>
              <span className={styles.summaryLabel}>Success Rate (7d)</span>
              <span className={styles.summaryValue}>{portfolioSuccessRate}%</span>
            </div>
          </header>

          <header className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>Agent Dashboard</h1>
            <p className={styles.sectionSubtitle}>High-level trends first, then a clean table to jump into agent details.</p>
          </header>

          <section className={styles.trendsGrid}>
            <TrendChart
              title="Agent runs over time"
              subtitle="Last 7 days"
              categories={trendLabels}
              values={trendRuns}
              valueMode="number"
              formatValue={(value) => formatNumber(value)}
            />
            <TrendChart
              title="Token cost over time"
              subtitle="Estimated USD, last 7 days"
              categories={trendLabels}
              values={trendCost}
              valueMode="currency"
              formatValue={(value) => formatCurrency(value)}
            />
          </section>

          <section className={styles.tableSection}>
            <div className={styles.tableToolbar}>
              <input
                className={styles.filterInput}
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Filter agents"
                aria-label="Filter agents"
              />
            </div>

            {visibleAgents.length ? (
              <div className={styles.tableWrap}>
                <table className={styles.agentTable}>
                  <thead>
                    <tr>
                      <th>Agent name</th>
                      <th>Last run</th>
                      <th>High-level metrics</th>
                      <th>Tags</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleAgents.map((agent) => (
                      <tr key={agent.id}>
                        <td className={styles.agentNameCell}>{agent.name}</td>
                        <td>{agent.latestRun ? formatDate(agent.latestRun.atMs) : 'n/a'}</td>
                        <td>{formatAgentMetrics(agent)}</td>
                        <td>
                          <div className={styles.tagRow}>
                            <span className={`${styles.statusPill} ${TRUST_CLASS[agent.trustState]}`}>{TRUST_LABEL[agent.trustState]}</span>
                            {agent.failureThemes.slice(0, 2).map((theme) => (
                              <span key={`${agent.id}-${theme}`} className={styles.tag}>
                                {theme.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <Link href={`/control-room/${encodeURIComponent(agent.id)}`} className={styles.detailsLink}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <article className={styles.emptyCard}>
                <p className={styles.emptyTitle}>No agents match this filter.</p>
                <p className={styles.emptyBody}>Try a different search term or clear the filter.</p>
              </article>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
