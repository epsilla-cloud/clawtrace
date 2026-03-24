'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
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

type TracyMessageRole = 'assistant' | 'user';

type TracyInlineChartSpec = {
  id: string;
  title: string;
  categories: string[];
  values: number[];
  mode: 'number' | 'currency';
  visual: 'line' | 'bar' | 'pie';
};

type TracyMessage = {
  id: string;
  role: TracyMessageRole;
  text: string;
  attachments?: string[];
  charts?: TracyInlineChartSpec[];
  actions?: string[];
};

type TracyPanelProps = {
  flow: ClawTraceFlowDefinition;
  traceRows: TraceRow[];
  rangeLabel: string;
  rangeSubtitle: string;
  loading: boolean;
  trendLabels: string[];
  trendRuns: number[];
  trendCost: number[];
  modelsUsed: string[];
  open: boolean;
  onToggleOpen: () => void;
};

type TracyContext = {
  traceRows: TraceRow[];
  rangeLabel: string;
  rangeSubtitle: string;
  trendLabels: string[];
  trendRuns: number[];
  trendCost: number[];
  modelsUsed: string[];
};

type AttachedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function tracyRoleClass(role: TracyMessageRole): string {
  return role === 'assistant' ? styles.tracyAssistant : styles.tracyUser;
}

function createTracyCharts(context: TracyContext): TracyInlineChartSpec[] {
  return [
    {
      id: 'runs-trend',
      title: 'Run activity',
      categories: context.trendLabels,
      values: context.trendRuns,
      mode: 'number',
      visual: 'line',
    },
    {
      id: 'cost-trend',
      title: 'Cost trend',
      categories: context.trendLabels,
      values: context.trendCost,
      mode: 'currency',
      visual: 'line',
    },
  ];
}

function getWorkflowCostBreakdown(context: TracyContext): Array<{ name: string; costUsd: number; runs: number }> {
  const byWorkflow = new Map<string, { costUsd: number; runs: number }>();
  for (const row of context.traceRows) {
    const current = byWorkflow.get(row.workflowName) ?? { costUsd: 0, runs: 0 };
    current.costUsd += row.estimatedCostUsd;
    current.runs += 1;
    byWorkflow.set(row.workflowName, current);
  }
  return [...byWorkflow.entries()]
    .map(([name, value]) => ({ name, costUsd: value.costUsd, runs: value.runs }))
    .sort((a, b) => b.costUsd - a.costUsd);
}

function buildWorkflowFrequencySeries(context: TracyContext, workflowName: string): number[] {
  const indexByLabel = new Map(context.trendLabels.map((label, index) => [label, index]));
  const values = context.trendLabels.map(() => 0);
  for (const row of context.traceRows) {
    if (row.workflowName !== workflowName) continue;
    const label = formatShortDay(row.startedAtMs);
    const index = indexByLabel.get(label);
    if (index === undefined) continue;
    values[index] += 1;
  }
  return values;
}

function buildCostSharePieChart(context: TracyContext): TracyInlineChartSpec {
  const breakdown = getWorkflowCostBreakdown(context);
  const topItems = breakdown.slice(0, 4);
  const restCost = breakdown.slice(4).reduce((sum, item) => sum + item.costUsd, 0);
  const categories = [...topItems.map((item) => item.name)];
  const values = [...topItems.map((item) => item.costUsd)];
  if (restCost > 0) {
    categories.push('Others');
    values.push(restCost);
  }
  return {
    id: 'cost-share-pie',
    title: 'Cost share',
    categories,
    values,
    mode: 'currency',
    visual: 'pie',
  };
}

function buildFrequencyBarChart(context: TracyContext, workflowName: string): TracyInlineChartSpec {
  return {
    id: 'flow-frequency-bar',
    title: `${workflowName} runs`,
    categories: context.trendLabels,
    values: buildWorkflowFrequencySeries(context, workflowName),
    mode: 'number',
    visual: 'bar',
  };
}

function summarizePortfolioOverview(context: TracyContext): string {
  const rows = context.traceRows;
  if (!rows.length) {
    return [
      `I checked ${context.rangeSubtitle.toLowerCase()} but there are no ingested runs yet.`,
      'Once data lands, I will summarize health, spend concentration, and top actions automatically.',
    ].join('\n');
  }

  const successCount = rows.filter((row) => row.status === 'success').length;
  const failureCount = rows.filter((row) => row.status === 'failure').length;
  const unknownCount = rows.filter((row) => row.status === 'unknown').length;
  const totalCost = rows.reduce((sum, row) => sum + row.estimatedCostUsd, 0);
  const successRate = Math.round((successCount / rows.length) * 100);
  const workflowCount = new Set(rows.map((row) => row.workflowName)).size;
  const costByWorkflow = new Map<string, number>();
  for (const row of rows) {
    costByWorkflow.set(row.workflowName, (costByWorkflow.get(row.workflowName) ?? 0) + row.estimatedCostUsd);
  }
  const [topCostWorkflow, topCostValue] = [...costByWorkflow.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['n/a', 0];
  const costShare = totalCost > 0 ? Math.round((topCostValue / totalCost) * 100) : 0;

  const peakRunIndex = context.trendRuns.findIndex((value) => value === Math.max(...context.trendRuns, 0));
  const peakCostIndex = context.trendCost.findIndex((value) => value === Math.max(...context.trendCost, 0));
  const peakRunDay = peakRunIndex >= 0 ? context.trendLabels[peakRunIndex] : 'n/a';
  const peakCostDay = peakCostIndex >= 0 ? context.trendLabels[peakCostIndex] : 'n/a';

  return [
    `I reviewed ${rows.length} runs across ${workflowCount} workflows for ${context.rangeSubtitle.toLowerCase()}.`,
    `Overall reliability is ${successRate}% (${successCount} successful, ${failureCount} failed${unknownCount ? `, ${unknownCount} unknown` : ''}).`,
    `Estimated spend is ${formatCurrency(totalCost)}, with ${topCostWorkflow} driving about ${costShare}% of the total.`,
    `Volume peaked on ${peakRunDay}, while spend peaked on ${peakCostDay}, so cost pressure is driven more by run heaviness than pure run count.`,
  ].join('\n');
}

function summarizeCostPriority(context: TracyContext, hottestTraceHref?: string): string {
  const rows = context.traceRows;
  if (!rows.length) {
    return 'No run data yet, so I cannot rank cost actions.';
  }

  const ranked = getWorkflowCostBreakdown(context);
  const first = ranked[0] ?? { name: 'n/a', costUsd: 0, runs: 0 };
  const second = ranked[1] ?? { name: 'n/a', costUsd: 0, runs: 0 };
  const total = rows.reduce((sum, row) => sum + row.estimatedCostUsd, 0);
  const firstShare = total > 0 ? Math.round((first.costUsd / total) * 100) : 0;
  const highestRun = [...rows].sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd)[0];
  const frequencySeries = buildWorkflowFrequencySeries(context, first.name);
  const peakFrequency = Math.max(...frequencySeries, 0);
  const peakFrequencyDays = context.trendLabels.filter((_, index) => frequencySeries[index] === peakFrequency && peakFrequency > 0);

  return [
    `${first.name} is driving most of your spend: ${formatCurrency(first.costUsd)} (${firstShare}% of total ${context.rangeLabel} cost).`,
    `${second.name !== 'n/a' ? `${second.name} is next at ${formatCurrency(second.costUsd)}.` : 'No clear second cost cluster yet.'}`,
    `${first.name} ran ${first.runs} times in this range, peaking at ${peakFrequency} run${peakFrequency === 1 ? '' : 's'}${peakFrequencyDays.length ? ` on ${peakFrequencyDays.join(', ')}` : ''}.`,
    `Hottest trace: [${highestRun.traceName}](${hottestTraceHref ?? '#'}) · ${formatCurrency(highestRun.estimatedCostUsd)} · ${formatNumber(highestRun.inputTokens + highestRun.outputTokens)} tokens.`,
  ].join('\n');
}

function summarizeIncidentBrief(context: TracyContext): string {
  const latestRisky = [...context.traceRows]
    .filter((row) => row.status === 'failure' || row.status === 'unknown')
    .sort((a, b) => b.startedAtMs - a.startedAtMs)[0];

  if (!latestRisky) {
    return [
      'No active incident pattern in the selected range.',
      'If you want, I can draft a preventive brief focused on cost spikes or verification drift instead.',
    ].join('\n');
  }

  return [
    `Incident summary: ${latestRisky.workflowName} showed a risky run at ${formatDate(latestRisky.startedAtMs)}.`,
    `Run: ${latestRisky.traceName} · status: ${latestRisky.status} · input ${formatNumber(latestRisky.inputTokens)} · output ${formatNumber(latestRisky.outputTokens)} · cost ${formatCurrency(latestRisky.estimatedCostUsd)}.`,
    'Likely impact: reliability confidence drops for this path and reruns can compound spend.',
    'Suggested immediate action: inspect first failing step in run detail and pin one deterministic guard before the next execution.',
  ].join('\n');
}

function summarizeContractAssist(context: TracyContext): string {
  const failures = context.traceRows.filter((row) => row.status === 'failure');
  const unknowns = context.traceRows.filter((row) => row.status === 'unknown');
  const topCost = [...context.traceRows].sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd)[0];
  const modelHint = context.modelsUsed.length ? `Observed model mix: ${context.modelsUsed.join(', ')}.` : 'Model mix unavailable in this snapshot.';

  return [
    'Contract hardening proposal:',
    `1) Add explicit success criteria and verifier checks on ${failures[0]?.workflowName ?? topCost?.workflowName ?? 'the highest-impact workflow'}.`,
    `2) Convert unknown outcomes (${unknowns.length} in range) into explicit pass/fail with one lightweight verifier step.`,
    `3) Add a budget guardrail on high-cost runs above ${topCost ? formatCurrency(topCost.estimatedCostUsd) : '$0.00'} with pre-run warning.`,
    modelHint,
  ].join('\n');
}

function buildTraceDetailHref(row: TraceRow): string {
  return `/control-room/${encodeURIComponent(row.workflowId)}?trace=${encodeURIComponent(row.traceId)}`;
}

function buildTracyResponse(query: string, context: TracyContext): Omit<TracyMessage, 'id' | 'role'> {
  const normalized = query.toLowerCase();
  const baseCharts = createTracyCharts(context);
  const breakdown = getWorkflowCostBreakdown(context);
  const topWorkflow = breakdown[0]?.name ?? 'Top workflow';
  const hottestRun = [...context.traceRows].sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd)[0];
  const hottestTraceHref = hottestRun ? buildTraceDetailHref(hottestRun) : undefined;

  if (normalized.includes('cost') || normalized.includes('spend') || normalized.includes('budget')) {
    return {
      text: summarizeCostPriority(context, hottestTraceHref),
      charts: [buildCostSharePieChart(context), buildFrequencyBarChart(context, topWorkflow)],
      actions: [
        'Switch this flow to a smaller model for routine steps.',
        'Reduce run frequency where output timing does not impact business goals.',
      ],
    };
  }

  if (normalized.includes('frequen') || normalized.includes('often') || normalized.includes('too many')) {
    return {
      text: summarizeCostPriority(context, hottestTraceHref),
      charts: [buildFrequencyBarChart(context, topWorkflow)],
      actions: ['Reduce run frequency for low-impact windows.', 'Set a max daily run cap for this flow.'],
    };
  }

  if (normalized.includes('incident') || normalized.includes('brief') || normalized.includes('failure') || normalized.includes('risky')) {
    return {
      text: `I reviewed the latest risky runs and drafted a short brief.\n${summarizeIncidentBrief(context)}`,
      charts: [baseCharts[0], baseCharts[1]],
      actions: ['Open the latest risky trace detail.', 'Generate and share an incident memo.'],
    };
  }

  if (normalized.includes('contract') || normalized.includes('policy') || normalized.includes('rule')) {
    return {
      text: `I checked drift and repeat patterns, then prepared contract edits.\n${summarizeContractAssist(context)}`,
      actions: ['Apply the contract suggestions to the target flow.', 'Open verification setup and add hard checks.'],
    };
  }

  return {
    text: summarizePortfolioOverview(context),
    charts: baseCharts,
    actions: ['Save as briefing note', 'Create dashboard from this'],
  };
}

function seedTracyMessages(flow: ClawTraceFlowDefinition, context: TracyContext, loading: boolean): TracyMessage[] {
  if (loading) {
    return [
      {
        id: 'tracy-loading-1',
        role: 'assistant',
        text: `Hey, I’m Tracy. I’m syncing data for ${flow.title} and preparing your first briefing.`,
      },
    ];
  }

  const firstQuestion = 'Why are my costs so high in the last seven days?';
  const firstResponse = buildTracyResponse(firstQuestion, context);

  return [
    {
      id: 'tracy-seed-user-1',
      role: 'user',
      text: firstQuestion,
    },
    {
      id: 'tracy-seed-assistant-1',
      role: 'assistant',
      text: firstResponse.text,
      charts: firstResponse.charts,
      actions: firstResponse.actions,
    },
  ];
}

function TracyAvatar({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? styles.tracyAvatarBubble : styles.tracyAvatarHeader} aria-hidden="true">
      <Image
        src="/tracy.png"
        alt=""
        width={compact ? 24 : 28}
        height={compact ? 24 : 28}
        className={styles.tracyAvatarImage}
      />
    </span>
  );
}

function renderTextLineWithLinks(line: string) {
  const nodes: Array<string | ReactNode> = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = linkPattern.exec(line);

  while (match) {
    const [raw, label, href] = match;
    const index = match.index;
    if (index > lastIndex) {
      nodes.push(line.slice(lastIndex, index));
    }
    if (href.startsWith('/')) {
      nodes.push(
        <Link key={`${href}-${index}`} href={href} className={styles.tracyInlineLink}>
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={`${href}-${index}`}
          href={href}
          className={styles.tracyInlineLink}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>,
      );
    }
    lastIndex = index + raw.length;
    match = linkPattern.exec(line);
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

function TracyMessageText({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <p className={styles.tracyMessageText}>
      {lines.map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {renderTextLineWithLinks(line)}
          {index < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </p>
  );
}

function TracyInlineChart({ chart }: { chart: TracyInlineChartSpec }) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = chartRef.current;
    if (!node) {
      return;
    }

    let canceled = false;
    let chartInstance: { setOption: (option: unknown, notMerge?: boolean) => void; resize: () => void; dispose: () => void } | null = null;

    const onResize = () => chartInstance?.resize();

    const maxValue = Math.max(...chart.values, 0);
    const yAxisMax = getNiceYAxisMax(maxValue);
    const isCost = chart.mode === 'currency';
    const lineColor = isCost ? '#9d4f46' : '#835130';

    const option =
      chart.visual === 'pie'
        ? {
            animation: false,
            tooltip: {
              trigger: 'item',
              formatter: (params: { name: string; value: number; percent: number }) =>
                `${params.name}<br/>${formatCurrency(params.value)} (${params.percent}%)`,
            },
            series: [
              {
                type: 'pie',
                radius: ['42%', '72%'],
                center: ['50%', '52%'],
                avoidLabelOverlap: true,
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                label: {
                  show: false,
                },
                data: chart.categories.map((name, index) => ({ name, value: chart.values[index] ?? 0 })),
              },
            ],
          }
        : {
            animation: false,
            grid: { left: 8, right: 8, top: 8, bottom: chart.visual === 'bar' ? 20 : 8 },
            xAxis: {
              type: 'category',
              data: chart.categories,
              show: chart.visual === 'bar',
              boundaryGap: chart.visual === 'bar',
              axisLabel:
                chart.visual === 'bar'
                  ? {
                      color: '#7a6a5e',
                      fontSize: 10,
                    }
                  : undefined,
              axisLine:
                chart.visual === 'bar'
                  ? {
                      lineStyle: {
                        color: '#d8cdc5',
                      },
                    }
                  : undefined,
            },
            yAxis: {
              type: 'value',
              show: false,
              min: 0,
              max: yAxisMax,
            },
            series: [
              chart.visual === 'bar'
                ? {
                    type: 'bar',
                    data: chart.values,
                    barWidth: '54%',
                    itemStyle: {
                      color: 'rgba(131,81,48,0.65)',
                      borderRadius: [4, 4, 0, 0],
                    },
                  }
                : {
                    type: 'line',
                    data: chart.values,
                    smooth: 0.35,
                    symbol: 'none',
                    lineStyle: { color: lineColor, width: 2.2 },
                    areaStyle: {
                      color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                          { offset: 0, color: isCost ? 'rgba(157,79,70,0.22)' : 'rgba(131,81,48,0.20)' },
                          { offset: 1, color: isCost ? 'rgba(157,79,70,0.03)' : 'rgba(131,81,48,0.03)' },
                        ],
                      },
                    },
                  },
            ],
          };

    void (async () => {
      const echarts = await import('echarts');
      if (canceled || !node) return;
      chartInstance = echarts.init(node);
      chartInstance.setOption(option, true);
      window.addEventListener('resize', onResize);
    })();

    return () => {
      canceled = true;
      window.removeEventListener('resize', onResize);
      chartInstance?.dispose();
    };
  }, [chart.categories, chart.mode, chart.values]);

  return (
    <figure className={styles.tracyInlineChart}>
      <figcaption className={styles.tracyInlineTitle}>
        <span>{chart.title}</span>
      </figcaption>
      <div
        className={styles.tracyInlineCanvas}
        style={{ height: chart.visual === 'pie' ? 152 : chart.visual === 'bar' ? 96 : 74 }}
        ref={chartRef}
        aria-label={chart.title}
      />
    </figure>
  );
}

function TracyPanel({
  flow,
  traceRows,
  rangeLabel,
  rangeSubtitle,
  loading,
  trendLabels,
  trendRuns,
  trendCost,
  modelsUsed,
  open,
  onToggleOpen,
}: TracyPanelProps) {
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRef = useRef<BrowserSpeechRecognition | null>(null);

  const context = useMemo<TracyContext>(
    () => ({
      traceRows,
      rangeLabel,
      rangeSubtitle,
      trendLabels,
      trendRuns,
      trendCost,
      modelsUsed,
    }),
    [modelsUsed, rangeLabel, rangeSubtitle, traceRows, trendCost, trendLabels, trendRuns],
  );

  const seededMessages = useMemo(() => seedTracyMessages(flow, context, loading), [context, flow, loading]);
  const [messages, setMessages] = useState<TracyMessage[]>(seededMessages);

  useEffect(() => {
    setMessages(seededMessages);
  }, [seededMessages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechCtor = (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognition; webkitSpeechRecognition?: new () => BrowserSpeechRecognition }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => BrowserSpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechCtor) return;
    setVoiceSupported(true);
    const recognition = new SpeechCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0]?.transcript ?? '';
      }
      if (!transcript.trim().length) return;
      setDraft((current) => {
        const spacer = current.trim().length ? ' ' : '';
        return `${current}${spacer}${transcript.trim()}`;
      });
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    speechRef.current = recognition;
    return () => {
      recognition.stop();
      speechRef.current = null;
    };
  }, []);

  const pushAssistantMessage = (query: string) => {
    const assistantPayload = buildTracyResponse(query, context);
    setMessages((current) => [
      ...current,
      {
        id: `tracy-assistant-${current.length + 1}`,
        role: 'assistant',
        text: assistantPayload.text,
        charts: assistantPayload.charts,
        actions: assistantPayload.actions,
      },
    ]);
  };

  const onVoiceToggle = () => {
    if (!speechRef.current) return;
    if (isListening) {
      speechRef.current.stop();
      setIsListening(false);
      return;
    }
    speechRef.current.start();
    setIsListening(true);
  };

  const onPickFiles = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(event.currentTarget.files ?? []);
    if (!list.length) return;
    setAttachments((current) => [
      ...current,
      ...list.map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    ]);
    event.currentTarget.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => current.filter((file) => file.id !== id));
  };

  const onSend = () => {
    const text = draft.trim();
    const attachmentNames = attachments.map((file) => file.name);
    if (!text && !attachmentNames.length) return;

    const userText = text.length ? text : `Attached ${attachmentNames.length} file${attachmentNames.length > 1 ? 's' : ''}.`;
    setMessages((current) => [
      ...current,
      {
        id: `tracy-user-${current.length + 1}`,
        role: 'user',
        text: userText,
        attachments: attachmentNames,
      },
    ]);

    const responseQuery = `${userText} ${attachmentNames.join(' ')}`.trim();
    setDraft('');
    setAttachments([]);
    pushAssistantMessage(responseQuery);
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <aside className={`${styles.tracyPanel} ${open ? styles.tracyExpanded : styles.tracyCollapsed}`} aria-label="Tracy side chat">
      <button
        type="button"
        className={styles.tracyEdgeToggle}
        onClick={onToggleOpen}
        aria-label={open ? 'Collapse Tracy panel' : 'Expand Tracy panel'}
        aria-expanded={open}
      >
        <span className={styles.tracyEdgeToggleGlyph}>{open ? '⟩' : '⟨'}</span>
      </button>
      <header className={styles.tracyHeader}>
        <div className={styles.tracyHeaderIdentity}>
          <TracyAvatar />
          <p className={styles.tracyName}>Tracy</p>
        </div>
      </header>

      {open ? (
        <>
          <div className={styles.tracyTranscript}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.tracyMessageRow} ${
                  message.role === 'assistant' ? styles.tracyMessageRowAssistant : styles.tracyMessageRowUser
                }`}
              >
                {message.role === 'assistant' ? (
                  <TracyAvatar compact />
                ) : null}
                <article className={`${styles.tracyMessage} ${tracyRoleClass(message.role)}`}>
                  <p className={styles.tracySender}>{message.role === 'assistant' ? 'Tracy' : 'You'}</p>
                  <TracyMessageText text={message.text} />

                  {message.attachments?.length ? (
                    <div className={styles.tracyAttachmentRow}>
                      {message.attachments.map((name) => (
                        <span key={name} className={styles.tracyAttachmentChip}>
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {message.charts?.length ? (
                    <div className={styles.tracyChartRow}>
                      {message.charts.map((chart) => (
                        <TracyInlineChart key={`${message.id}-${chart.id}`} chart={chart} />
                      ))}
                    </div>
                  ) : null}

                  {message.actions?.length ? (
                    <div className={styles.tracyActionTextBlock}>
                      <p className={styles.tracyActionTitle}>Recommended actions</p>
                      <ol className={styles.tracyActionList}>
                        {message.actions.map((action) => (
                          <li key={`${message.id}-${action}`} className={styles.tracyActionItem}>
                            {action}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}

                </article>
              </div>
            ))}
          </div>

          <footer className={styles.tracyComposer}>
            {attachments.length ? (
              <div className={styles.tracyAttachmentRow}>
                {attachments.map((file) => (
                  <span key={file.id} className={styles.tracyAttachmentChip}>
                    {file.name} ({Math.max(1, Math.round(file.size / 1024))} KB)
                    <button
                      type="button"
                      className={styles.tracyAttachmentRemove}
                      onClick={() => removeAttachment(file.id)}
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            <div className={styles.tracyComposerRow}>
              <div className={styles.tracyInputShell}>
                <button
                  type="button"
                  className={styles.tracyIconButton}
                  onClick={onPickFiles}
                  aria-label="Attach files"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.tracyIconSvg}>
                    <path d="M21.44 11.05l-8.49 8.49a6 6 0 1 1-8.49-8.49l8.49-8.49a4 4 0 0 1 5.66 5.66l-8.5 8.5a2 2 0 1 1-2.82-2.83l7.78-7.78" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.tracyIconButton} ${isListening ? styles.tracyVoiceActive : ''}`}
                  onClick={onVoiceToggle}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  disabled={!voiceSupported}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.tracyIconSvg}>
                    <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
                    <path d="M19 11a7 7 0 0 1-14 0" />
                    <path d="M12 18v3" />
                    <path d="M9 21h6" />
                  </svg>
                </button>
                <input
                  type="text"
                  className={styles.tracyTextInput}
                  value={draft}
                  onChange={(event) => setDraft(event.currentTarget.value)}
                  onKeyDown={onComposerKeyDown}
                  placeholder="Ask Tracy about my agents ..."
                />
              </div>
              <button type="button" className={styles.tracySendButton} onClick={onSend}>
                Send
              </button>
            </div>

            <input ref={fileInputRef} type="file" multiple onChange={onFilesSelected} className={styles.tracyHiddenInput} />
          </footer>
        </>
      ) : null}
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

function normalizeTraceStatus(
  status: string | undefined,
  inputTokens: number,
  outputTokens: number,
): TraceStatus {
  // Hard rule: zero-token runs are treated as failed executions.
  if (inputTokens === 0 && outputTokens === 0) {
    return 'failure';
  }

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
  const [tracyOpen, setTracyOpen] = useState(true);
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
          const status = normalizeTraceStatus(
            trajectory.resultStatus,
            Math.max(0, trajectory.inputTokens),
            Math.max(0, trajectory.outputTokens),
          );
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
        <section className={`${styles.shell} ${tracyOpen ? styles.shellTracyOpen : styles.shellTracyCollapsed}`}>
          <div className={styles.leftRail}>
            <FlowLeftNav flow={flow} allFlows={allFlows} />
          </div>

          <section className={styles.dashboard}>
            <header className={styles.pageTopRow}>
              <h1 className={styles.pageTitle}>Overview</h1>
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

          <aside className={`${styles.tracyRail} ${tracyOpen ? styles.tracyRailOpen : styles.tracyRailClosed}`}>
            <TracyPanel
              flow={flow}
              traceRows={[]}
              rangeLabel={resolvedRange.label}
              rangeSubtitle={resolvedRange.subtitle}
              loading={loadingSnapshot}
              trendLabels={trendLabels}
              trendRuns={trendRuns}
              trendCost={trendCost}
              modelsUsed={[]}
              open={tracyOpen}
              onToggleOpen={() => setTracyOpen((current) => !current)}
            />
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={`${styles.shell} ${tracyOpen ? styles.shellTracyOpen : styles.shellTracyCollapsed}`}>
        <div className={styles.leftRail}>
          <FlowLeftNav flow={flow} allFlows={allFlows} />
        </div>

        <section className={styles.dashboard}>
          <header className={styles.pageTopRow}>
            <h1 className={styles.pageTitle}>Overview</h1>
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

        <aside className={`${styles.tracyRail} ${tracyOpen ? styles.tracyRailOpen : styles.tracyRailClosed}`}>
          <TracyPanel
            flow={flow}
            traceRows={traceRows}
            rangeLabel={resolvedRange.label}
            rangeSubtitle={resolvedRange.subtitle}
            loading={false}
            trendLabels={trendLabels}
            trendRuns={trendRuns}
            trendCost={trendCost}
            modelsUsed={metrics.modelsUsed}
            open={tracyOpen}
            onToggleOpen={() => setTracyOpen((current) => !current)}
          />
        </aside>
      </section>
    </main>
  );
}
