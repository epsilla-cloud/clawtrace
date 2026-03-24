'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlowLeftNav } from '../flow/FlowLeftNav';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import type { OpenClawDiscoverySnapshot } from '../../../lib/openclaw-discovery';
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

type TraceStatus = 'success' | 'failure' | 'running' | 'unknown';
type TraceStatusFilter = 'all' | TraceStatus;
type TraceSortKey = 'trace' | 'agent' | 'workflow' | 'startedAt' | 'status' | 'inputTokens' | 'outputTokens' | 'cost';
type SortDirection = 'asc' | 'desc';

type TraceRow = {
  key: string;
  traceId: string;
  traceName: string;
  sessionKey: string;
  agentName: string;
  workflowId: string;
  workflowName: string;
  startedAtMs: number;
  status: TraceStatus;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
};

type TracyMessageRole = 'assistant' | 'user' | 'system';

type TracyMessage = {
  id: string;
  role: TracyMessageRole;
  text: string;
};

type TracyPrompt = {
  id: 'failures' | 'cost' | 'next-step';
  label: string;
};

type TracyPanelProps = {
  flow: ClawTraceFlowDefinition;
  traceRows: TraceRow[];
  rangeLabel: string;
  rangeSubtitle: string;
  loading: boolean;
};

function tracyRoleClass(role: TracyMessageRole): string {
  if (role === 'assistant') return styles.tracyAssistant;
  if (role === 'user') return styles.tracyUser;
  return styles.tracySystem;
}

function summarizeFailures(traceRows: TraceRow[]): string {
  const failures = traceRows.filter((row) => row.status === 'failure');
  if (!failures.length) {
    const unknownCount = traceRows.filter((row) => row.status === 'unknown').length;
    if (unknownCount > 0) {
      return `Good news: no hard failures in this range. I do see ${unknownCount} unknown run${unknownCount > 1 ? 's' : ''}, so verification depth is still worth tightening.`;
    }
    return 'No hard failures in this range. Reliability is steady right now.';
  }

  const failuresByWorkflow = new Map<string, { count: number; costUsd: number }>();
  for (const row of failures) {
    const current = failuresByWorkflow.get(row.workflowName) ?? { count: 0, costUsd: 0 };
    current.count += 1;
    current.costUsd += row.estimatedCostUsd;
    failuresByWorkflow.set(row.workflowName, current);
  }

  const [topWorkflow, topStats] =
    [...failuresByWorkflow.entries()].sort((a, b) => b[1].count - a[1].count || b[1].costUsd - a[1].costUsd)[0] ?? [];
  const failureRate = traceRows.length ? Math.round((failures.length / traceRows.length) * 100) : 0;

  if (!topWorkflow || !topStats) {
    return `I found ${failures.length} failed run${failures.length > 1 ? 's' : ''} in ${traceRows.length} traces (${failureRate}%).`;
  }

  return [
    `I found ${failures.length} failed run${failures.length > 1 ? 's' : ''} in ${traceRows.length} traces (${failureRate}%).`,
    `Largest concentration is ${topWorkflow} with ${topStats.count} failure${topStats.count > 1 ? 's' : ''} and ${formatCurrency(topStats.costUsd)} burned during failed attempts.`,
    'If we stabilize that path first, you should feel reliability improve quickly.',
  ].join('\n');
}

function summarizeCostLeaks(traceRows: TraceRow[]): string {
  if (!traceRows.length) {
    return 'No trace data yet, so I cannot rank spend leaks yet.';
  }

  const costByWorkflow = new Map<string, number>();
  for (const row of traceRows) {
    costByWorkflow.set(row.workflowName, (costByWorkflow.get(row.workflowName) ?? 0) + row.estimatedCostUsd);
  }
  const [topWorkflowName, topWorkflowCost] = [...costByWorkflow.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  const topRun = [...traceRows].sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd)[0];
  const totalCost = traceRows.reduce((sum, row) => sum + row.estimatedCostUsd, 0);

  if (!topWorkflowName || !topRun) {
    return `Estimated spend for this range is ${formatCurrency(totalCost)}.`;
  }

  const workflowShare = totalCost > 0 ? Math.round((topWorkflowCost / totalCost) * 100) : 0;

  return [
    `Top spend leak is ${topWorkflowName}: ${formatCurrency(topWorkflowCost)} (${workflowShare}% of total).`,
    `Most expensive single run: ${topRun.traceName} at ${formatCurrency(topRun.estimatedCostUsd)} with ${formatNumber(topRun.inputTokens + topRun.outputTokens)} total tokens.`,
    'If we cut prompt bloat or retries there, cost should drop first and fastest.',
  ].join('\n');
}

function summarizeNextStep(traceRows: TraceRow[]): string {
  if (!traceRows.length) {
    return 'First move: let one complete day of traces land, then I can prioritize the sharpest intervention.';
  }

  const latestFailure = [...traceRows]
    .filter((row) => row.status === 'failure')
    .sort((a, b) => b.startedAtMs - a.startedAtMs)[0];
  if (latestFailure) {
    return [
      `I would start with ${latestFailure.workflowName}.`,
      `Latest failed run: ${latestFailure.traceName} at ${formatDate(latestFailure.startedAtMs)}.`,
      'Action: open that run detail, inspect the first failed step, and add a deterministic guardrail before rerun.',
    ].join('\n');
  }

  const hottestUnknown = [...traceRows]
    .filter((row) => row.status === 'unknown')
    .sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd)[0];
  if (hottestUnknown) {
    return [
      `No explicit failures right now, so next best move is verification hardening on ${hottestUnknown.workflowName}.`,
      `Highest-cost unknown run: ${hottestUnknown.traceName} at ${formatCurrency(hottestUnknown.estimatedCostUsd)}.`,
      'Action: add a verifier so unknown outcomes resolve into clear success/failure.',
    ].join('\n');
  }

  const highestCost = [...traceRows].sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd)[0];
  return [
    'System health looks stable. Next move is cost tuning.',
    `Start with ${highestCost.workflowName} and its highest-cost run (${formatCurrency(highestCost.estimatedCostUsd)}).`,
    'Action: trim context and cap retries for this path.',
  ].join('\n');
}

function getTracyPrompts(flowId: ClawTraceFlowDefinition['id']): TracyPrompt[] {
  if (flowId === 'f3-control-room') {
    return [
      { id: 'failures', label: 'What failed most recently?' },
      { id: 'cost', label: 'Where is spend leaking?' },
      { id: 'next-step', label: 'What should we fix first?' },
    ];
  }

  return [
    { id: 'next-step', label: 'What is the next best action?' },
    { id: 'failures', label: 'Any reliability hotspots?' },
    { id: 'cost', label: 'Any cost hotspots?' },
  ];
}

function seedTracyMessages(flow: ClawTraceFlowDefinition, traceRows: TraceRow[], rangeLabel: string, rangeSubtitle: string, loading: boolean): TracyMessage[] {
  if (loading) {
    return [
      {
        id: 'tracy-loading-1',
        role: 'assistant',
        text: `Hey, I’m Tracy. I’m syncing telemetry for ${flow.title} now and will surface quick insights in a moment.`,
      },
    ];
  }

  const failures = traceRows.filter((row) => row.status === 'failure').length;
  const success = traceRows.filter((row) => row.status === 'success').length;
  const totalCost = traceRows.reduce((sum, row) => sum + row.estimatedCostUsd, 0);

  return [
    {
      id: 'tracy-seed-1',
      role: 'assistant',
      text: `Hey, I’m Tracy. I’m watching ${flow.title} for you in ${rangeLabel} mode (${rangeSubtitle.toLowerCase()}).`,
    },
    {
      id: 'tracy-seed-2',
      role: 'system',
      text: `${formatNumber(traceRows.length)} runs loaded · ${success} success · ${failures} failure · ${formatCurrency(totalCost)} estimated spend.`,
    },
    {
      id: 'tracy-seed-3',
      role: 'assistant',
      text: 'Ask one of the prompts below and I will break it down like a teammate, not a log parser.',
    },
  ];
}

function answerTracyPrompt(promptId: TracyPrompt['id'], traceRows: TraceRow[]): string {
  if (promptId === 'failures') return summarizeFailures(traceRows);
  if (promptId === 'cost') return summarizeCostLeaks(traceRows);
  return summarizeNextStep(traceRows);
}

function TracyPanel({ flow, traceRows, rangeLabel, rangeSubtitle, loading }: TracyPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const prompts = useMemo(() => getTracyPrompts(flow.id), [flow.id]);
  const seededMessages = useMemo(
    () => seedTracyMessages(flow, traceRows, rangeLabel, rangeSubtitle, loading),
    [flow, loading, rangeLabel, rangeSubtitle, traceRows],
  );
  const [messages, setMessages] = useState<TracyMessage[]>(seededMessages);

  useEffect(() => {
    setMessages(seededMessages);
  }, [seededMessages]);

  const onPrompt = (prompt: TracyPrompt) => {
    const response = answerTracyPrompt(prompt.id, traceRows);
    setMessages((current) => [
      ...current,
      {
        id: `tracy-user-${current.length + 1}`,
        role: 'user',
        text: prompt.label,
      },
      {
        id: `tracy-assistant-${current.length + 1}`,
        role: 'assistant',
        text: response,
      },
    ]);
  };

  return (
    <aside className={`${styles.tracyPanel} ${expanded ? styles.tracyExpanded : styles.tracyCollapsed}`} aria-label="Tracy side chat">
      <header className={styles.tracyHeader}>
        <div>
          <p className={styles.tracyName}>Tracy</p>
          <p className={styles.tracySubtitle}>Human-like copilot for this page</p>
        </div>
        <button
          type="button"
          className={styles.tracyToggle}
          onClick={() => setExpanded((current) => !current)}
          aria-label={expanded ? 'Collapse Tracy panel' : 'Expand Tracy panel'}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide' : 'Show'}
        </button>
      </header>

      {expanded ? (
        <>
          <div className={styles.tracyTranscript}>
            {messages.map((message) => (
              <article key={message.id} className={`${styles.tracyMessage} ${tracyRoleClass(message.role)}`}>
                <p className={styles.tracyMessageRole}>{message.role}</p>
                <p className={styles.tracyMessageText}>{message.text}</p>
              </article>
            ))}
          </div>

          <footer className={styles.tracyComposer}>
            <p className={styles.tracyPromptLabel}>Sample questions</p>
            <div className={styles.tracyPromptList}>
              {prompts.map((prompt) => (
                <button key={prompt.id} type="button" className={styles.tracyPromptButton} onClick={() => onPrompt(prompt)}>
                  {prompt.label}
                </button>
              ))}
            </div>
          </footer>
        </>
      ) : (
        <div className={styles.tracyCollapsedBody}>
          <p className={styles.tracyCollapsedText}>Tracy is standing by with run insights.</p>
        </div>
      )}
    </aside>
  );
}

function getAgentLabelFromSessionKey(sessionKey: string): string {
  const normalized = sessionKey.toLowerCase();
  if (normalized.includes(':telegram:')) return 'Telegram Agent';
  if (normalized.includes(':cron:')) return 'Cron Agent';
  if (normalized.includes(':subagent:')) return 'Subagent';
  if (normalized === 'agent:main:main') return 'Main Agent';
  if (normalized.startsWith('agent:main:')) return 'Main Agent';
  return 'External Agent';
}

function formatTraceName(traceId: string, signals: string[]): string {
  const shortTraceId = traceId.split(':')[0].slice(0, 8);
  if (!signals.length) {
    return `trace-${shortTraceId}`;
  }
  return `${signals[0].replace(/_/g, ' ')} · ${shortTraceId}`;
}

function normalizeTraceStatus(status: string | undefined): TraceStatus {
  if (status === 'success' || status === 'failure' || status === 'running') {
    return status;
  }
  return 'unknown';
}

function defaultSortDirection(sortKey: TraceSortKey): SortDirection {
  if (sortKey === 'startedAt' || sortKey === 'inputTokens' || sortKey === 'outputTokens' || sortKey === 'cost') {
    return 'desc';
  }
  return 'asc';
}

const TRACE_STATUS_LABEL: Record<TraceStatus, string> = {
  success: 'Success',
  failure: 'Failure',
  running: 'Running',
  unknown: 'Unknown',
};

const TRACE_STATUS_CLASS: Record<TraceStatus, string> = {
  success: styles.traceStatusSuccess,
  failure: styles.traceStatusFailure,
  running: styles.traceStatusRunning,
  unknown: styles.traceStatusUnknown,
};

export function WorkflowPortfolio({ initialSnapshot, flow, allFlows }: WorkflowPortfolioProps) {
  const [snapshot, setSnapshot] = useState<OpenClawDiscoverySnapshot | null>(initialSnapshot ?? null);
  const [loadingSnapshot, setLoadingSnapshot] = useState<boolean>(!initialSnapshot);
  const [traceQuery, setTraceQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [workflowFilter, setWorkflowFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<TraceStatusFilter>('all');
  const [sortKey, setSortKey] = useState<TraceSortKey>('startedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
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

  const traceRows = useMemo<TraceRow[]>(() => {
    if (!snapshot) {
      return [];
    }

    return snapshot.workflows.flatMap((workflow) =>
      workflow.trajectories
        .filter(
          (trajectory) =>
            trajectory.startedAtMs >= resolvedRange.startMs && trajectory.startedAtMs < resolvedRange.endExclusiveMs
        )
        .map((trajectory) => {
          const status = normalizeTraceStatus(trajectory.resultStatus);
          return {
            key: `${workflow.id}:${trajectory.traceId}:${trajectory.startedAtMs}`,
            traceId: trajectory.traceId,
            traceName: formatTraceName(trajectory.traceId, trajectory.signals),
            sessionKey: trajectory.sessionKey,
            agentName: getAgentLabelFromSessionKey(trajectory.sessionKey),
            workflowId: workflow.id,
            workflowName: workflow.name,
            startedAtMs: trajectory.startedAtMs,
            status,
            inputTokens: Math.max(0, trajectory.inputTokens),
            outputTokens: Math.max(0, trajectory.outputTokens),
            estimatedCostUsd: trajectory.estimatedCostUsd,
          };
        }),
    );
  }, [snapshot, resolvedRange]);

  const agentOptions = useMemo(
    () => ['all', ...Array.from(new Set(traceRows.map((row) => row.agentName))).sort()],
    [traceRows],
  );
  const workflowOptions = useMemo(
    () => ['all', ...Array.from(new Set(traceRows.map((row) => row.workflowName))).sort()],
    [traceRows],
  );

  const filteredTraceRows = useMemo(() => {
    const needle = traceQuery.trim().toLowerCase();

    return traceRows.filter((row) => {
      if (agentFilter !== 'all' && row.agentName !== agentFilter) {
        return false;
      }
      if (workflowFilter !== 'all' && row.workflowName !== workflowFilter) {
        return false;
      }
      if (statusFilter !== 'all' && row.status !== statusFilter) {
        return false;
      }
      if (!needle) {
        return true;
      }

      const haystack = `${row.traceName} ${row.traceId} ${row.sessionKey} ${row.agentName} ${row.workflowName} ${row.status}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [traceRows, traceQuery, agentFilter, workflowFilter, statusFilter]);

  const sortedTraceRows = useMemo(() => {
    const items = [...filteredTraceRows];
    const statusOrder: Record<TraceStatus, number> = {
      failure: 0,
      running: 1,
      unknown: 2,
      success: 3,
    };

    items.sort((a, b) => {
      let result = 0;
      switch (sortKey) {
        case 'trace':
          result = a.traceName.localeCompare(b.traceName);
          break;
        case 'agent':
          result = a.agentName.localeCompare(b.agentName);
          break;
        case 'workflow':
          result = a.workflowName.localeCompare(b.workflowName);
          break;
        case 'startedAt':
          result = a.startedAtMs - b.startedAtMs;
          break;
        case 'status':
          result = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'inputTokens':
          result = a.inputTokens - b.inputTokens;
          break;
        case 'outputTokens':
          result = a.outputTokens - b.outputTokens;
          break;
        case 'cost':
          result = a.estimatedCostUsd - b.estimatedCostUsd;
          break;
        default:
          result = 0;
      }

      return sortDirection === 'asc' ? result : -result;
    });

    return items;
  }, [filteredTraceRows, sortKey, sortDirection]);

  function handleSort(nextSortKey: TraceSortKey) {
    if (sortKey === nextSortKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(nextSortKey);
    setSortDirection(defaultSortDirection(nextSortKey));
  }

  function sortIndicator(nextSortKey: TraceSortKey): string {
    if (sortKey !== nextSortKey) {
      return '';
    }
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  }

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

          <aside className={styles.tracyRail}>
            <TracyPanel
              flow={flow}
              traceRows={[]}
              rangeLabel={resolvedRange.label}
              rangeSubtitle={resolvedRange.subtitle}
              loading={loadingSnapshot}
            />
          </aside>
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
                value={traceQuery}
                onChange={(event) => setTraceQuery(event.currentTarget.value)}
                placeholder="Filter by trace id/name"
                aria-label="Filter traces"
              />
              <select
                className={styles.filterSelect}
                value={agentFilter}
                onChange={(event) => setAgentFilter(event.currentTarget.value)}
                aria-label="Filter by agent"
              >
                {agentOptions.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent === 'all' ? 'All agents' : agent}
                  </option>
                ))}
              </select>
              <select
                className={styles.filterSelect}
                value={workflowFilter}
                onChange={(event) => setWorkflowFilter(event.currentTarget.value)}
                aria-label="Filter by workflow"
              >
                {workflowOptions.map((workflowName) => (
                  <option key={workflowName} value={workflowName}>
                    {workflowName === 'all' ? 'All workflows' : workflowName}
                  </option>
                ))}
              </select>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.currentTarget.value as TraceStatusFilter)}
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="running">Running</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {sortedTraceRows.length ? (
              <div className={styles.tableWrap}>
                <table className={styles.agentTable}>
                  <thead>
                    <tr>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('trace')}>
                          {`Trace${sortIndicator('trace')}`}
                        </button>
                      </th>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('agent')}>
                          {`Agent${sortIndicator('agent')}`}
                        </button>
                      </th>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('workflow')}>
                          {`Workflow${sortIndicator('workflow')}`}
                        </button>
                      </th>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('startedAt')}>
                          {`Started${sortIndicator('startedAt')}`}
                        </button>
                      </th>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('status')}>
                          {`Status${sortIndicator('status')}`}
                        </button>
                      </th>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('inputTokens')}>
                          {`Input Tokens${sortIndicator('inputTokens')}`}
                        </button>
                      </th>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('outputTokens')}>
                          {`Output Tokens${sortIndicator('outputTokens')}`}
                        </button>
                      </th>
                      <th>
                        <button type="button" className={styles.sortButton} onClick={() => handleSort('cost')}>
                          {`Est. Cost${sortIndicator('cost')}`}
                        </button>
                      </th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTraceRows.map((row) => (
                      <tr key={row.key}>
                        <td className={styles.agentNameCell}>{row.traceName}</td>
                        <td>{row.agentName}</td>
                        <td>{row.workflowName}</td>
                        <td>{formatDate(row.startedAtMs)}</td>
                        <td>
                          <span className={`${styles.statusPill} ${TRACE_STATUS_CLASS[row.status]}`}>
                            {TRACE_STATUS_LABEL[row.status]}
                          </span>
                        </td>
                        <td>{formatNumber(row.inputTokens)}</td>
                        <td>{formatNumber(row.outputTokens)}</td>
                        <td>{formatCurrency(row.estimatedCostUsd)}</td>
                        <td>
                          <Link href={`/control-room/${encodeURIComponent(row.workflowId)}`} className={styles.detailsLink}>
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
                <p className={styles.emptyTitle}>No traces match this filter.</p>
                <p className={styles.emptyBody}>Try a different search term or clear the filter.</p>
              </article>
            )}
          </section>
        </section>

        <aside className={styles.tracyRail}>
          <TracyPanel
            flow={flow}
            traceRows={traceRows}
            rangeLabel={resolvedRange.label}
            rangeSubtitle={resolvedRange.subtitle}
            loading={false}
          />
        </aside>
      </section>
    </main>
  );
}
