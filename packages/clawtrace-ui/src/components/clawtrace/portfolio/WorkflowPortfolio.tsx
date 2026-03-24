'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlowLeftNav } from '../flow/FlowLeftNav';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import type { OpenClawDiscoverySnapshot, WorkflowDiscovery } from '../../../lib/openclaw-discovery';
import styles from './WorkflowPortfolio.module.css';

type WorkflowPortfolioProps = {
  initialSnapshot?: OpenClawDiscoverySnapshot | null;
  flow: ClawTraceFlowDefinition;
  allFlows: ClawTraceFlowDefinition[];
};

type TimeRangeKey = '1d' | '7d' | '30d' | 'custom';

type ResolvedTimeRange = {
  startMs: number;
  endExclusiveMs: number;
  dayCount: number;
  label: string;
  subtitle: string;
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

function getDayStartMs(valueMs: number): number {
  const date = new Date(valueMs);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function parseIsoDateToDayStartMs(isoDate: string): number | null {
  if (!isoDate) {
    return null;
  }
  const parts = isoDate.split('-').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }
  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function toIsoDate(valueMs: number): string {
  const date = new Date(valueMs);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function resolveTimeRange(rangeKey: TimeRangeKey, customStartIso: string, customEndIso: string): ResolvedTimeRange {
  const dayMs = 24 * 60 * 60 * 1000;
  const todayStartMs = getDayStartMs(Date.now());
  const tomorrowStartMs = todayStartMs + dayMs;

  if (rangeKey === 'custom') {
    const customStartMs = parseIsoDateToDayStartMs(customStartIso);
    const customEndMs = parseIsoDateToDayStartMs(customEndIso);

    if (customStartMs !== null && customEndMs !== null) {
      const orderedStart = Math.min(customStartMs, customEndMs);
      const orderedEnd = Math.max(customStartMs, customEndMs);
      const endExclusiveMs = orderedEnd + dayMs;
      const dayCount = Math.max(1, Math.round((endExclusiveMs - orderedStart) / dayMs));
      return {
        startMs: orderedStart,
        endExclusiveMs,
        dayCount,
        label: 'Custom',
        subtitle: `${formatShortDay(orderedStart)} - ${formatShortDay(orderedEnd)}`,
      };
    }
  }

  if (rangeKey === '1d') {
    return {
      startMs: todayStartMs,
      endExclusiveMs: tomorrowStartMs,
      dayCount: 1,
      label: '1d',
      subtitle: 'Last 1 day',
    };
  }

  if (rangeKey === '30d') {
    return {
      startMs: todayStartMs - 29 * dayMs,
      endExclusiveMs: tomorrowStartMs,
      dayCount: 30,
      label: '30d',
      subtitle: 'Last 30 days',
    };
  }

  return {
    startMs: todayStartMs - 6 * dayMs,
    endExclusiveMs: tomorrowStartMs,
    dayCount: 7,
    label: '7d',
    subtitle: 'Last 7 days',
  };
}

function buildTrend(snapshot: OpenClawDiscoverySnapshot, range: ResolvedTimeRange): TrendPoint[] {
  const dayMs = 24 * 60 * 60 * 1000;
  const points: TrendPoint[] = [];
  for (let dayOffset = 0; dayOffset < range.dayCount; dayOffset += 1) {
    const dayStartMs = range.startMs + dayOffset * dayMs;
    points.push({
      dayStartMs,
      label: formatShortDay(dayStartMs),
      runs: 0,
      costUsd: 0,
    });
  }

  const indexByDay = new Map(points.map((point, index) => [point.dayStartMs, index]));

  for (const workflow of snapshot.workflows) {
    for (const trajectory of workflow.trajectories) {
      const startedAt = trajectory.startedAtMs;
      if (startedAt < range.startMs || startedAt >= range.endExclusiveMs) {
        continue;
      }

      const bucket = indexByDay.get(getDayStartMs(startedAt));
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
};

function getNiceYAxisMax(value: number): number {
  if (value <= 0) {
    return 1;
  }

  const power = 10 ** Math.floor(Math.log10(value));
  const normalized = value / power;

  if (normalized <= 1) return 1 * power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}

function TrendChart({ title, subtitle, categories, values, valueMode }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const maxValue = Math.max(...values, 0);
  const yAxisMax = getNiceYAxisMax(maxValue);
  const isCost = valueMode === 'currency';
  const lineColor = isCost ? '#9d4f46' : '#835130';
  const areaColorTop = isCost ? 'rgba(157, 79, 70, 0.22)' : 'rgba(131, 81, 48, 0.24)';
  const areaColorBottom = isCost ? 'rgba(157, 79, 70, 0.03)' : 'rgba(131, 81, 48, 0.03)';

  useEffect(() => {
    const node = chartRef.current;
    if (!node) {
      return;
    }

    let chart: { setOption: (option: unknown, notMerge?: boolean) => void; resize: () => void; dispose: () => void } | null = null;
    let canceled = false;

    const option = {
      animation: false,
      grid: {
        left: 44,
        right: 20,
        top: 16,
        bottom: 34,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#bca89a',
            width: 1,
          },
        },
        backgroundColor: '#2b2522',
        borderWidth: 0,
        textStyle: {
          color: '#f7efe9',
          fontSize: 12,
        },
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
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#d2c2b7',
            width: 1.2,
          },
        },
        axisLabel: {
          color: '#786a60',
          fontSize: 12,
          margin: 14,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: yAxisMax,
        splitNumber: 3,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#e8ddd5',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#7a6a5e',
          fontSize: 11,
          margin: 10,
          formatter: (value: number) => {
            if (valueMode === 'currency') {
              if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
              return `$${Math.round(value)}`;
            }
            return `${Math.round(value)}`;
          },
        },
      },
      series: [
        {
          type: 'line',
          data: values,
          smooth: 0.32,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: {
            color: lineColor,
            width: 3.2,
          },
          itemStyle: {
            color: '#fff',
            borderColor: lineColor,
            borderWidth: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: areaColorTop },
                { offset: 1, color: areaColorBottom },
              ],
            },
          },
        },
      ],
    };

    const onResize = () => {
      chart?.resize();
    };

    void (async () => {
      const echarts = await import('echarts');
      if (canceled || !node) {
        return;
      }

      chart = echarts.init(node);
      chart.setOption(option, true);
      window.addEventListener('resize', onResize);
    })();

    return () => {
      canceled = true;
      window.removeEventListener('resize', onResize);
      chart?.dispose();
    };
  }, [categories, values, valueMode]);

  return (
    <article className={styles.trendCard}>
      <header className={styles.trendHeader}>
        <div>
          <h2 className={styles.trendTitle}>{title}</h2>
          <p className={styles.trendSubtitle}>{subtitle}</p>
        </div>
      </header>

      <div className={styles.trendPlot}>
        <div className={styles.trendCanvas} ref={chartRef} aria-label={title} />
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
  const todayIso = useMemo(() => toIsoDate(Date.now()), []);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('7d');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return toIsoDate(date.getTime());
  });
  const [customEndDate, setCustomEndDate] = useState<string>(todayIso);

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
  const resolvedRange = useMemo(
    () => resolveTimeRange(timeRange, customStartDate, customEndDate),
    [timeRange, customStartDate, customEndDate]
  );
  const trend = snapshot ? buildTrend(snapshot, resolvedRange) : [];
  const trendLabels = trend.map((point) => point.label);
  const trendRuns = trend.map((point) => point.runs);
  const trendCost = trend.map((point) => point.costUsd);
  const rangeTrajectories = useMemo(() => {
    if (!snapshot) {
      return [];
    }
    return snapshot.workflows.flatMap((workflow) =>
      workflow.trajectories.filter(
        (trajectory) =>
          trajectory.startedAtMs >= resolvedRange.startMs && trajectory.startedAtMs < resolvedRange.endExclusiveMs
      )
    );
  }, [snapshot, resolvedRange]);
  const runsInRange = rangeTrajectories.length;
  const tokensInRange = rangeTrajectories.reduce((sum, trajectory) => sum + trajectory.totalTokens, 0);
  const costInRange = rangeTrajectories.reduce((sum, trajectory) => sum + trajectory.estimatedCostUsd, 0);
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
          <header className={styles.pageTopRow}>
            <h1 className={styles.pageTitle}>Control Room</h1>
            <div className={styles.rangeControls}>
              <label className={styles.rangeLabel} htmlFor="control-room-range-select">
                Time range
              </label>
              <select
                id="control-room-range-select"
                className={styles.rangeSelect}
                value={timeRange}
                onChange={(event) => setTimeRange(event.currentTarget.value as TimeRangeKey)}
                aria-label="Select time range"
              >
                <option value="1d">1 day</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="custom">Custom</option>
              </select>
              {timeRange === 'custom' ? (
                <div className={styles.customRangeRow}>
                  <input
                    className={styles.dateInput}
                    type="date"
                    value={customStartDate}
                    max={customEndDate}
                    onChange={(event) => setCustomStartDate(event.currentTarget.value)}
                    aria-label="Custom start date"
                  />
                  <span className={styles.dateSeparator}>to</span>
                  <input
                    className={styles.dateInput}
                    type="date"
                    value={customEndDate}
                    min={customStartDate}
                    max={todayIso}
                    onChange={(event) => setCustomEndDate(event.currentTarget.value)}
                    aria-label="Custom end date"
                  />
                </div>
              ) : null}
            </div>
          </header>
          <header className={styles.summaryBar}>
            <div className={`${styles.summaryMetric} ${styles.metricToneNeutral}`}>
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
          <header className={styles.pageTopRow}>
            <h1 className={styles.pageTitle}>Control Room</h1>
            <div className={styles.rangeControls}>
              <label className={styles.rangeLabel} htmlFor="control-room-range-select">
                Time range
              </label>
              <select
                id="control-room-range-select"
                className={styles.rangeSelect}
                value={timeRange}
                onChange={(event) => setTimeRange(event.currentTarget.value as TimeRangeKey)}
                aria-label="Select time range"
              >
                <option value="1d">1 day</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="custom">Custom</option>
              </select>
              {timeRange === 'custom' ? (
                <div className={styles.customRangeRow}>
                  <input
                    className={styles.dateInput}
                    type="date"
                    value={customStartDate}
                    max={customEndDate}
                    onChange={(event) => setCustomStartDate(event.currentTarget.value)}
                    aria-label="Custom start date"
                  />
                  <span className={styles.dateSeparator}>to</span>
                  <input
                    className={styles.dateInput}
                    type="date"
                    value={customEndDate}
                    min={customStartDate}
                    max={todayIso}
                    onChange={(event) => setCustomEndDate(event.currentTarget.value)}
                    aria-label="Custom end date"
                  />
                </div>
              ) : null}
            </div>
          </header>
          <header className={styles.summaryBar}>
            <div className={`${styles.summaryMetric} ${styles.metricTonePrimary}`}>
              <span className={styles.summaryLabel}>Agents</span>
              <span className={styles.summaryValue}>{formatNumber(metrics.workflowCount)}</span>
            </div>
            <div className={`${styles.summaryMetric} ${styles.metricToneWarn}`}>
              <span className={styles.summaryLabel}>Runs ({resolvedRange.label})</span>
              <span className={styles.summaryValue}>{formatNumber(runsInRange)}</span>
            </div>
            <div className={`${styles.summaryMetric} ${styles.metricToneBlue}`}>
              <span className={styles.summaryLabel}>Tokens ({resolvedRange.label})</span>
              <span className={styles.summaryValue}>{formatNumber(tokensInRange)}</span>
            </div>
            <div className={`${styles.summaryMetric} ${styles.metricToneCost}`}>
              <span className={styles.summaryLabel}>Est. Cost ({resolvedRange.label})</span>
              <span className={styles.summaryValue}>{formatCurrency(costInRange)}</span>
            </div>
            <div className={`${styles.summaryMetric} ${styles.metricToneSuccess}`}>
              <span className={styles.summaryLabel}>Success Rate (7d)</span>
              <span className={styles.summaryValue}>{portfolioSuccessRate}%</span>
            </div>
          </header>

          <section className={styles.trendsGrid}>
            <TrendChart
              title="Agent runs over time"
              subtitle={resolvedRange.subtitle}
              categories={trendLabels}
              values={trendRuns}
              valueMode="number"
            />
            <TrendChart
              title="Token cost over time"
              subtitle={`Estimated USD, ${resolvedRange.subtitle}`}
              categories={trendLabels}
              values={trendCost}
              valueMode="currency"
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
