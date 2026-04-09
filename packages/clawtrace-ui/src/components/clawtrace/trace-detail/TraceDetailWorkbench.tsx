'use client';

import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { FlowLeftNav } from '../flow/FlowLeftNav';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import { estimateSpanCost } from '../../../lib/trace-builder';
import type { OpenClawDiscoverySnapshot } from '../../../lib/openclaw-discovery';
import type {
  TraceDetailEntityNode,
  TraceDetailPhase,
  TraceDetailSnapshot,
  TraceDetailSpan,
  TraceDetailSpanKind,
  TraceDetailViewMode,
} from '../../../lib/trace-detail';
import styles from './TraceDetailWorkbench.module.css';

type TraceDetailWorkbenchProps = {
  flow: ClawTraceFlowDefinition;
  allFlows: ClawTraceFlowDefinition[];
  workflowId: string;
  snapshot: OpenClawDiscoverySnapshot | null;
  detail: TraceDetailSnapshot | null;
};

type SelectionSource =
  | {
      type: 'span';
      spanId: string;
      label: string;
    }
  | {
      type: 'entity';
      spanId: string | null;
      entityId: string;
      label: string;
    }
  | {
      type: 'phase';
      spanId: string | null;
      phaseId: string;
      label: string;
    };

type TracyMessageRole = 'assistant' | 'user';

type TracyInlineChartSpec = {
  id: string;
  title: string;
  visual: 'line' | 'pie';
  categories: string[];
  values: number[];
  mode: 'number' | 'currency';
};

type TracyMessage = {
  id: string;
  role: TracyMessageRole;
  text: string;
  charts?: TracyInlineChartSpec[];
  actions?: string[];
  attachments?: string[];
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

type EChartsLike = {
  init: (dom: HTMLDivElement) => {
    setOption: (option: unknown, notMerge?: boolean) => void;
    dispose: () => void;
    resize: () => void;
    on: (eventName: string, handler: (params: unknown) => void) => void;
    off: (eventName: string) => void;
  };
};

const MODE_ITEMS: Array<{ id: TraceDetailViewMode; label: string; description: string }> = [
  {
    id: 'execution_path',
    label: 'Trace',
    description: 'Step-by-step run path.',
  },
  {
    id: 'actor_map',
    label: 'Graph',
    description: 'Who acted in this run: agents, tools, and models.',
  },
  {
    id: 'step_timeline',
    label: 'Timeline',
    description: 'Timing view to spot bottlenecks and waiting time.',
  },
];

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
  if (!valueMs) return 'n/a';
  return new Date(valueMs).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(valueMs: number): string {
  if (!Number.isFinite(valueMs) || valueMs <= 0) {
    return '0ms';
  }
  if (valueMs < 1000) {
    return `${Math.round(valueMs)}ms`;
  }
  const totalSeconds = Math.floor(valueMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  return `${seconds}s`;
}

function formatCompactTokens(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '—';
  }
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return millions >= 10 ? `${Math.round(millions)}M` : `${millions.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return thousands >= 10 ? `${Math.round(thousands)}k` : `${thousands.toFixed(1)}k`;
  }
  return `${Math.round(value)}`;
}

function formatSpanTokenCell(span: TraceDetailSpan): string {
  if (span.kind !== 'llm_call' && span.totalTokens <= 0) {
    return '—';
  }
  return `${formatCompactTokens(span.totalTokens)} tok`;
}

function formatPhaseTime(baseMs: number, valueMs: number): string {
  return formatDuration(Math.max(0, valueMs - baseMs));
}

function statusLabel(status: TraceDetailSnapshot['trace']['status']): string {
  if (status === 'success') return 'Success';
  if (status === 'failure') return 'Failure';
  if (status === 'running') return 'Running';
  return 'Unknown';
}

function statusClass(status: TraceDetailSnapshot['trace']['status']): string {
  if (status === 'success') return styles.statusSuccess;
  if (status === 'failure') return styles.statusFailure;
  if (status === 'running') return styles.statusRunning;
  return styles.statusUnknown;
}

function spanKindLabel(span: TraceDetailSpan): string {
  if (span.kind === 'llm_call') return 'Model step';
  if (span.kind === 'tool_call') return 'Tool action';
  if (span.kind === 'subagent') return 'Subagent handoff';
  return 'Session';
}

function spanDisplayLabel(span: TraceDetailSpan): string {
  if (span.kind === 'llm_call') {
    return span.model ? `Model step · ${span.model}` : 'Model step';
  }
  if (span.kind === 'tool_call') {
    return `Tool action · ${span.toolName ?? span.name}`;
  }
  if (span.kind === 'subagent') {
    return `Subagent handoff · ${span.childAgentId ?? span.childSessionKey ?? 'delegated'}`;
  }
  return `Session · ${span.agentId ?? span.sessionKey ?? span.name}`;
}

/* ── Icon helpers for the tree view ────────────────────────────────────── */
const LLM_ICON_NAMES = [
  'aws','azure','claude','cohere','deepseek','doubao','fireworks','gcp',
  'gemini','glm','gpt','grok','huggingface','kimi','llama','minimax',
  'mistral','ollama','qwen','together',
];

function resolveSpanIcon(span: TraceDetailSpan): string {
  if (span.kind === 'session') return '/icons/session.png';
  if (span.kind === 'tool_call') return '/icons/tool.png';
  if (span.kind === 'subagent') return '/icons/subagent.png';
  const model = (span.model ?? '').toLowerCase();
  const provider = (span.provider ?? '').toLowerCase();
  const match =
    LLM_ICON_NAMES.find((n) => model.includes(n)) ??
    LLM_ICON_NAMES.find((n) => provider.includes(n));
  return match ? `/icons/llms/${match}.png` : '/icons/model.png';
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function spanTreeName(span: TraceDetailSpan): string {
  if (span.kind === 'llm_call') return 'LLM Generation';
  if (span.kind === 'tool_call') {
    const tool = span.toolName ?? span.name;
    return `Use Tool: ${tool}`;
  }
  if (span.kind === 'subagent') {
    const name = span.childAgentId ?? span.childSessionKey ?? '';
    return (!name || UUID_RE.test(name)) ? 'Delegate to Subagent' : name;
  }
  // session
  const name = span.agentId ?? span.sessionKey ?? span.name;
  return (!name || UUID_RE.test(name)) ? 'Session Start' : name;
}

function shortModelName(model: string): string {
  return model.length > 24 ? model.slice(0, 24) + '\u2026' : model;
}

function formatSpanCostValue(span: TraceDetailSpan): string | null {
  if (span.kind !== 'llm_call' || span.totalTokens <= 0) return null;
  const cost = estimateSpanCost(span.model, span.tokensIn, span.tokensOut);
  if (cost <= 0) return null;
  return formatCurrency(cost);
}

function ClockIcon() {
  return (
    <svg className={styles.treeItemPillIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5V8l2.5 1.5" />
    </svg>
  );
}

/* ── Timeline bar colors — exact hex sampled from icon PNG backgrounds ──── */
const KIND_BAR_COLORS: Record<string, string> = {
  session: '#99644b',   /* session.png  rgb(153,100,75) */
  llm_call: '#3b2617',  /* model.png    rgb(59,38,23)   */
  tool_call: '#2b5d5f', /* tool.png     rgb(43,93,95)   */
  subagent: '#473652',  /* subagent.png rgb(71,54,82)   */
};

function niceTimeStep(maxMs: number): number {
  const target = maxMs / 4;
  const steps = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000, 60000, 120000, 300000, 600000];
  return steps.find((s) => s >= target) ?? steps[steps.length - 1]!;
}

function CoinIcon() {
  return (
    <svg className={styles.treeItemPillIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M6 6.5a2.2 2.2 0 0 1 4 0c0 1.5-2 1.5-2 3M8 12v.01" />
    </svg>
  );
}

function buildExecutionParentBySpanId(spans: TraceDetailSpan[]): Map<string, string | null> {
  const spanById = new Map(spans.map((span) => [span.spanId, span]));
  const llmBySession = new Map<string, TraceDetailSpan[]>();

  for (const span of spans) {
    if (span.kind !== 'llm_call') {
      continue;
    }
    const sessionKey = span.sessionKey ?? '__unknown_session__';
    const bucket = llmBySession.get(sessionKey) ?? [];
    bucket.push(span);
    llmBySession.set(sessionKey, bucket);
  }

  for (const bucket of llmBySession.values()) {
    bucket.sort((a, b) => a.startMs - b.startMs);
  }

  const parentBySpan = new Map<string, string | null>();

  for (const span of spans) {
    let parentSpanId = span.parentSpanId ?? null;
    const rawParent = parentSpanId ? spanById.get(parentSpanId) ?? null : null;

    if (span.kind === 'tool_call' && (!rawParent || rawParent.kind === 'session')) {
      const sessionKey = span.sessionKey ?? rawParent?.sessionKey ?? '__unknown_session__';
      const llmCandidates = llmBySession.get(sessionKey) ?? [];

      let chosenParent = llmCandidates
        .filter((candidate) => candidate.startMs <= span.startMs && candidate.resolvedEndMs >= span.startMs)
        .sort((a, b) => b.startMs - a.startMs)[0];

      if (!chosenParent) {
        chosenParent = llmCandidates
          .filter((candidate) => candidate.startMs <= span.startMs)
          .sort((a, b) => b.startMs - a.startMs)[0];
      }

      if (chosenParent) {
        parentSpanId = chosenParent.spanId;
      }
    }

    parentBySpan.set(span.spanId, parentSpanId);
  }

  return parentBySpan;
}

function graphNodeLabel(span: TraceDetailSpan): string {
  if (span.kind === 'llm_call') {
    return span.model ? shortModelName(span.model) : 'LLM';
  }
  return spanTreeName(span);
}

function buildSelectionSummary(source: SelectionSource | null): string {
  if (!source) {
    return 'Selected from this run';
  }
  if (source.type === 'span') {
    return 'Selected from Execution Path/Timeline';
  }
  if (source.type === 'entity') {
    return `Selected from Actor Map (${source.label})`;
  }
  return `Selected from Run Efficiency (${source.label})`;
}

function buildImprovementActions(span: TraceDetailSpan | null): string[] {
  if (!span) {
    return ['Select a step to get a concrete improvement action.'];
  }

  const actions: string[] = [];

  if (span.kind === 'llm_call' && span.tokensIn > 120000) {
    actions.push('Route this step to a smaller model tier when the task does not need deep reasoning.');
  }

  if (span.kind === 'llm_call' && span.totalTokens > 200000) {
    actions.push('Trim always-loaded context and move rarely used memory/history to on-demand retrieval.');
  }

  if (span.kind === 'tool_call' && span.resolvedDurationMs > 15000) {
    actions.push('Add a timeout and backoff policy to this tool action to cap tail latency.');
  }

  if (span.kind === 'tool_call' && !span.hasClosedRecord) {
    actions.push('Capture tool completion records so this action can be verified instead of inferred.');
  }

  if (typeof span.attributes.error === 'string' && span.attributes.error.length > 0) {
    actions.push('Pin a verifier before rerun so this failure pattern is blocked early next time.');
  }

  if (!actions.length) {
    actions.push('Promote this step as a baseline and watch drift against future runs on this path.');
  }

  return actions.slice(0, 3);
}

function extractOutputPayload(span: TraceDetailSpan): Record<string, unknown> | null {
  const keys = ['result', 'output', 'response', 'stdout', 'stderr', 'error'] as const;
  const picked: Record<string, unknown> = {};

  for (const key of keys) {
    const value = span.attributes[key];
    if (value !== undefined && value !== null && value !== '') {
      picked[key] = value;
    }
  }

  return Object.keys(picked).length ? picked : null;
}

function parseMarkdownLinks(
  text: string,
  onSpanLink: (spanId: string) => void,
): Array<string | ReactNode> {
  const nodes: Array<string | ReactNode> = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);

  while (match) {
    const [raw, label, href] = match;
    const index = match.index;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (href.startsWith('#span:')) {
      const spanId = href.replace('#span:', '');
      nodes.push(
        <button
          key={`${href}-${index}`}
          type="button"
          className={styles.inlineLinkButton}
          onClick={() => onSpanLink(spanId)}
        >
          {label}
        </button>,
      );
    } else if (href.startsWith('/')) {
      nodes.push(
        <Link key={`${href}-${index}`} href={href} className={styles.inlineLink}>
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={`${href}-${index}`}
          href={href}
          className={styles.inlineLink}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>,
      );
    }

    lastIndex = index + raw.length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function TracyInlineChart({ chart }: { chart: TracyInlineChartSpec }) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dom = chartRef.current;
    if (!dom) {
      return;
    }

    let disposed = false;
    let chartInstance: ReturnType<EChartsLike['init']> | null = null;

    const onResize = () => {
      chartInstance?.resize();
    };

    void (async () => {
      const echarts = (await import('echarts')) as unknown as EChartsLike;
      if (disposed || !dom) return;
      chartInstance = echarts.init(dom);

      if (chart.visual === 'pie') {
        chartInstance.setOption(
          {
            animation: false,
            tooltip: {
              trigger: 'item',
              formatter: (params: { name: string; value: number; percent: number }) =>
                `${params.name}<br/>${chart.mode === 'currency' ? formatCurrency(params.value) : formatNumber(params.value)} (${params.percent}%)`,
            },
            series: [
              {
                type: 'pie',
                radius: ['44%', '72%'],
                center: ['50%', '54%'],
                avoidLabelOverlap: true,
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                label: {
                  show: false,
                },
                data: chart.categories.map((name, index) => ({
                  name,
                  value: chart.values[index] ?? 0,
                })),
              },
            ],
          },
          true,
        );
      } else {
        const max = Math.max(...chart.values, 0);
        chartInstance.setOption(
          {
            animation: false,
            grid: { top: 8, right: 8, bottom: 16, left: 8 },
            xAxis: {
              type: 'category',
              data: chart.categories,
              boundaryGap: false,
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
            },
            yAxis: {
              type: 'value',
              min: 0,
              max: max > 0 ? max : 1,
              axisLabel: { show: false },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
            },
            series: [
              {
                type: 'line',
                data: chart.values,
                smooth: 0.32,
                symbol: 'none',
                lineStyle: {
                  width: 2.2,
                  color: '#8f4f30',
                },
                areaStyle: {
                  color: 'rgba(143,79,48,0.18)',
                },
              },
            ],
          },
          true,
        );
      }

      window.addEventListener('resize', onResize);
    })();

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      chartInstance?.dispose();
    };
  }, [chart]);

  return (
    <figure className={styles.tracyInlineChart}>
      <figcaption className={styles.tracyInlineChartTitle}>{chart.title}</figcaption>
      <div className={styles.tracyInlineChartCanvas} ref={chartRef} />
    </figure>
  );
}

type TracyRunQualityPanelProps = {
  detail: TraceDetailSnapshot;
  open: boolean;
  onToggleOpen: () => void;
  onSelectSpan: (spanId: string) => void;
};

function buildSeededQualityResponse(detail: TraceDetailSnapshot): Omit<TracyMessage, 'id' | 'role'> {
  const hottestSpan = detail.spans.find((span) => span.spanId === detail.quickInsights.hottestSpanId) ?? detail.spans[0] ?? null;
  const hottestStepLabel = hottestSpan ? spanDisplayLabel(hottestSpan) : 'n/a';

  const byKind = new Map<string, number>();
  for (const span of detail.spans) {
    const bucket = span.kind === 'llm_call'
      ? 'Model steps'
      : span.kind === 'tool_call'
        ? 'Tool actions'
        : span.kind === 'subagent'
          ? 'Subagent handoffs'
          : 'Session control';
    byKind.set(bucket, (byKind.get(bucket) ?? 0) + span.totalTokens);
  }

  const kindBreakdown = [...byKind.entries()].sort((a, b) => b[1] - a[1]);

  const qualityLine = detail.workIndex.phases.map((phase) => phase.score);
  const qualityLabels = detail.workIndex.phases.map((_, index) => `P${index + 1}`);

  const verdict =
    detail.trace.status === 'success'
      ? 'This run completed, but the quality profile is heavier than it should be.'
      : detail.trace.status === 'failure'
        ? 'This run failed, and quality pressure concentrated early.'
        : 'This run is unstable and needs tighter controls before scaling.';

  return {
    text: [
      verdict,
      `Top pressure is in ${kindBreakdown[0]?.[0] ?? 'unknown bucket'} (${formatNumber(kindBreakdown[0]?.[1] ?? 0)} tokens).`,
      `Hottest step: [${hottestStepLabel}](#span:${hottestSpan?.spanId ?? ''}) · ${formatDuration(hottestSpan?.resolvedDurationMs ?? 0)} · ${formatNumber(hottestSpan?.totalTokens ?? 0)} tokens.`,
      `Likely issue: ${detail.quickInsights.likelyIssue}`,
    ].join('\n'),
    charts: [
      {
        id: 'quality-phase-line',
        title: 'Quality by phase',
        visual: 'line',
        categories: qualityLabels,
        values: qualityLine,
        mode: 'number',
      },
      {
        id: 'token-share-pie',
        title: 'Token share',
        visual: 'pie',
        categories: kindBreakdown.map(([name]) => name),
        values: kindBreakdown.map(([, value]) => value),
        mode: 'number',
      },
    ],
    actions: detail.quickInsights.nextActions,
  };
}

function buildTracyReply(query: string, detail: TraceDetailSnapshot): Omit<TracyMessage, 'id' | 'role'> {
  const normalized = query.toLowerCase();
  const hottestSpan = detail.spans.find((span) => span.spanId === detail.quickInsights.hottestSpanId) ?? detail.spans[0] ?? null;

  if (normalized.includes('fail') || normalized.includes('root cause') || normalized.includes('why')) {
    return {
      text: [
        `The likely root issue is concentrated around [${hottestSpan ? spanDisplayLabel(hottestSpan) : 'the hottest step'}](#span:${hottestSpan?.spanId ?? ''}).`,
        `This step carries ${formatNumber(hottestSpan?.totalTokens ?? 0)} tokens and ${formatDuration(hottestSpan?.resolvedDurationMs ?? 0)} runtime.`,
        `${detail.quickInsights.likelyIssue}`,
      ].join('\n'),
      actions: detail.quickInsights.nextActions,
    };
  }

  if (normalized.includes('quality') || normalized.includes('score')) {
    return {
      text: [
        `Average run efficiency score is ${detail.workIndex.averageScore}/100 across ${detail.workIndex.phases.length} phases.`,
        `The lowest-scoring phase is where we should add first verifier and contract tightening.`,
      ].join('\n'),
      charts: [
        {
          id: 'quality-only-line',
          title: 'Run efficiency score',
          visual: 'line',
          categories: detail.workIndex.phases.map((_, index) => `P${index + 1}`),
          values: detail.workIndex.phases.map((phase) => phase.score),
          mode: 'number',
        },
      ],
      actions: ['Add one hard verifier before the lowest-scoring phase.', 'Re-run and compare the same trace path.'],
    };
  }

  if (normalized.includes('cost') || normalized.includes('token')) {
    const bySpan = detail.spans
      .slice()
      .sort((a, b) => b.totalTokens - a.totalTokens)
      .slice(0, 5);

    return {
      text: [
        `Most cost is concentrated in a small number of steps.`,
        `Top step is [${bySpan[0] ? spanDisplayLabel(bySpan[0]) : 'n/a'}](#span:${bySpan[0]?.spanId ?? ''}) with ${formatNumber(bySpan[0]?.totalTokens ?? 0)} tokens.`,
      ].join('\n'),
      charts: [
        {
          id: 'top-span-token-pie',
          title: 'Top token-consuming steps',
          visual: 'pie',
          categories: bySpan.map((span) => span.kind === 'tool_call' ? (span.toolName ?? 'tool') : (span.model ?? span.kind)),
          values: bySpan.map((span) => span.totalTokens),
          mode: 'number',
        },
      ],
      actions: ['Downshift model tier for non-critical reasoning.', 'Reduce repeated tool fan-out in this run path.'],
    };
  }

  return {
    text: [
      `This run looks ${statusLabel(detail.trace.status).toLowerCase()} with ${formatNumber(detail.trace.totalTokens)} total tokens and ${formatCurrency(detail.trace.estimatedCostUsd)} estimated cost.`,
      `If you want, I can break this into root cause, cost cuts, or a fix plan.`,
    ].join('\n'),
    actions: ['Show root cause path', 'Show cost cuts without quality drop'],
  };
}

function TracyRunQualityPanel({ detail, open, onToggleOpen, onSelectSpan }: TracyRunQualityPanelProps) {
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRef = useRef<BrowserSpeechRecognition | null>(null);

  const seeded = useMemo<TracyMessage[]>(() => {
    const response = buildSeededQualityResponse(detail);
    return [
      {
        id: 'trace-seed-user',
        role: 'user',
        text: 'How healthy is this run, and what should I fix first?',
      },
      {
        id: 'trace-seed-assistant',
        role: 'assistant',
        text: response.text,
        charts: response.charts,
        actions: response.actions,
      },
    ];
  }, [detail]);

  const [messages, setMessages] = useState<TracyMessage[]>(seeded);

  useEffect(() => {
    setMessages(seeded);
  }, [seeded]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechCtor = (window as unknown as {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    }).SpeechRecognition
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
      if (!transcript.trim()) return;
      setDraft((current) => `${current}${current.trim().length ? ' ' : ''}${transcript.trim()}`);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    speechRef.current = recognition;

    return () => {
      recognition.stop();
      speechRef.current = null;
    };
  }, []);

  const toggleVoice = () => {
    if (!speechRef.current) return;
    if (isListening) {
      speechRef.current.stop();
      setIsListening(false);
      return;
    }
    speechRef.current.start();
    setIsListening(true);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    if (!files.length) return;
    setAttachments((current) => [
      ...current,
      ...files.map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    ]);
    event.currentTarget.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => current.filter((item) => item.id !== id));
  };

  const send = () => {
    const text = draft.trim();
    const attachmentNames = attachments.map((file) => file.name);
    if (!text && !attachmentNames.length) return;

    const userText = text || `Attached ${attachmentNames.length} file${attachmentNames.length > 1 ? 's' : ''}.`;

    setMessages((current) => [
      ...current,
      {
        id: `trace-user-${current.length + 1}`,
        role: 'user',
        text: userText,
        attachments: attachmentNames,
      },
    ]);

    const response = buildTracyReply(`${userText} ${attachmentNames.join(' ')}`.trim(), detail);

    setMessages((current) => [
      ...current,
      {
        id: `trace-assistant-${current.length + 1}`,
        role: 'assistant',
        text: response.text,
        charts: response.charts,
        actions: response.actions,
      },
    ]);

    setDraft('');
    setAttachments([]);
  };

  return (
    <aside className={`${styles.tracyPanel} ${open ? styles.tracyExpanded : styles.tracyCollapsed}`}>
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
          <span className={styles.tracyAvatarHeader}>
            <Image
              src="/tracy.png"
              alt="Tracy"
              width={28}
              height={28}
              className={styles.tracyAvatarImage}
            />
          </span>
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
                  <span className={styles.tracyAvatarBubble}>
                    <Image
                      src="/tracy.png"
                      alt=""
                      width={24}
                      height={24}
                      className={styles.tracyAvatarImage}
                    />
                  </span>
                ) : null}

                <article className={`${styles.tracyMessage} ${message.role === 'assistant' ? styles.tracyAssistant : styles.tracyUser}`}>
                  <p className={styles.tracySender}>{message.role === 'assistant' ? 'Tracy' : 'You'}</p>
                  <p className={styles.tracyMessageText}>
                    {message.text.split('\n').map((line, index) => (
                      <Fragment key={`${message.id}-line-${index}`}>
                        {parseMarkdownLinks(line, onSelectSpan)}
                        {index < message.text.split('\n').length - 1 ? <br /> : null}
                      </Fragment>
                    ))}
                  </p>

                  {message.attachments?.length ? (
                    <div className={styles.tracyAttachmentRow}>
                      {message.attachments.map((name) => (
                        <span key={`${message.id}-${name}`} className={styles.tracyAttachmentChip}>
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
                  onClick={openFilePicker}
                  aria-label="Attach files"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.tracyIconSvg}>
                    <path d="M21.44 11.05l-8.49 8.49a6 6 0 1 1-8.49-8.49l8.49-8.49a4 4 0 0 1 5.66 5.66l-8.5 8.5a2 2 0 1 1-2.82-2.83l7.78-7.78" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.tracyIconButton} ${isListening ? styles.tracyVoiceActive : ''}`}
                  onClick={toggleVoice}
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
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask Tracy about this run ..."
                />
              </div>
              <button type="button" className={styles.tracySendButton} onClick={send}>
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

function ActorMapView({
  detail,
  selectedEntityId,
  onSelect,
}: {
  detail: TraceDetailSnapshot;
  selectedEntityId: string | null;
  onSelect: (entityId: string, spanId: string | null, label: string) => void;
}) {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const container = graphRef.current;
    if (!container) return;

    const dedupedBySpanId = new Map<string, TraceDetailSpan>();
    for (const span of detail.spans) {
      const existing = dedupedBySpanId.get(span.spanId);
      if (!existing || span.hasClosedRecord) {
        dedupedBySpanId.set(span.spanId, span);
      }
    }
    const spans = [...dedupedBySpanId.values()].sort((a, b) => a.startMs - b.startMs);
    if (!spans.length) {
      container.innerHTML = '';
      return;
    }

    const parentBySpanId = buildExecutionParentBySpanId(spans);
    const spanById = new Map(spans.map((span) => [span.spanId, span]));

    const sessionMetrics = new Map<string, { llmCalls: number; toolCalls: number }>();
    for (const span of spans) {
      if (!span.sessionKey) continue;
      if (!sessionMetrics.has(span.sessionKey)) {
        sessionMetrics.set(span.sessionKey, { llmCalls: 0, toolCalls: 0 });
      }
      const metrics = sessionMetrics.get(span.sessionKey);
      if (!metrics) continue;
      if (span.kind === 'llm_call') metrics.llmCalls += 1;
      if (span.kind === 'tool_call') metrics.toolCalls += 1;
    }

    const depthCache = new Map<string, number>();
    const resolveDepth = (spanId: string, trail: Set<string> = new Set()): number => {
      const cached = depthCache.get(spanId);
      if (cached !== undefined) return cached;
      if (trail.has(spanId)) return 0;
      trail.add(spanId);
      const parentId = parentBySpanId.get(spanId) ?? null;
      if (!parentId || !spanById.has(parentId)) {
        depthCache.set(spanId, 0);
        return 0;
      }
      const depth = resolveDepth(parentId, trail) + 1;
      depthCache.set(spanId, depth);
      return depth;
    };

    type GraphNode = {
      spanId: string;
      span: TraceDetailSpan;
      label: string;
      kind: TraceDetailSpanKind;
      r: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      depth: number;
      fixed?: boolean;
    };
    type GraphLink = {
      source: number;
      target: number;
      type: 'hierarchy';
    };

    const nodes: GraphNode[] = spans.map((span) => ({
      spanId: span.spanId,
      span,
      label: graphNodeLabel(span),
      kind: span.kind,
      r: span.kind === 'session' ? 34 : span.kind === 'llm_call' ? 19 : span.kind === 'subagent' ? 23 : 12,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      depth: resolveDepth(span.spanId),
    }));
    const nodeIndexBySpanId = new Map(nodes.map((node, index) => [node.spanId, index]));
    const links: GraphLink[] = [];
    for (const span of spans) {
      const parentSpanId = parentBySpanId.get(span.spanId) ?? null;
      if (!parentSpanId) continue;
      const source = nodeIndexBySpanId.get(parentSpanId);
      const target = nodeIndexBySpanId.get(span.spanId);
      if (source == null || target == null) continue;
      links.push({ source, target, type: 'hierarchy' });
    }

    const ns = 'http://www.w3.org/2000/svg';
    const W = Math.max(720, container.clientWidth || 0);
    const H = Math.max(420, container.clientHeight || 0);
    const cx = W / 2;
    const cy = H / 2;
    const strokeColors: Record<TraceDetailSpanKind, string> = {
      session: '#dacbb4',
      llm_call: '#dacbb4',
      tool_call: '#dacbb4',
      subagent: '#dacbb4',
    };
    const labelColors: Record<TraceDetailSpanKind, string> = {
      session: '#5a4534',
      llm_call: '#5a4534',
      tool_call: '#5a4534',
      subagent: '#5a4534',
    };

    container.innerHTML = '';
    const esc = (value: string): string =>
      value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const maxDepth = Math.max(...nodes.map((node) => node.depth), 1);
    const byDepth = new Map<number, GraphNode[]>();
    for (const node of nodes) {
      const bucket = byDepth.get(node.depth) ?? [];
      bucket.push(node);
      byDepth.set(node.depth, bucket);
    }
    for (const [depth, bucket] of byDepth.entries()) {
      bucket.sort((a, b) => a.span.startMs - b.span.startMs);
      const ringRadius = depth === 0 ? 0 : 96 + depth * 52;
      for (let index = 0; index < bucket.length; index += 1) {
        const node = bucket[index];
        const angle = (index / Math.max(bucket.length, 1)) * Math.PI * 2;
        node.x = cx + Math.cos(angle) * ringRadius + (Math.random() - 0.5) * 14;
        node.y = cy + Math.sin(angle) * ringRadius + (Math.random() - 0.5) * 14;
      }
    }

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add(styles.actorSvg);

    const defs = document.createElementNS(ns, 'defs');
    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', `arrowhead-${container.id || 'actor'}`);
    marker.setAttribute('viewBox', '0 0 10 7');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('orient', 'auto');
    const arrow = document.createElementNS(ns, 'path');
    arrow.setAttribute('d', 'M 0 0 L 10 3.5 L 0 7 z');
    arrow.setAttribute('fill', '#9ca3af');
    marker.appendChild(arrow);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Zoom/pan wrapper group
    const zoomGroup = document.createElementNS(ns, 'g');
    svg.appendChild(zoomGroup);
    let zoomScale = 1;
    let panX = 0;
    let panY = 0;
    const applyZoom = () => { zoomGroup.setAttribute('transform', `translate(${panX},${panY}) scale(${zoomScale})`); };

    // Wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * W;
      const my = ((e.clientY - rect.top) / rect.height) * H;
      const oldScale = zoomScale;
      const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      zoomScale = Math.max(0.3, Math.min(5, zoomScale * factor));
      // Zoom toward cursor
      panX = mx - ((mx - panX) / oldScale) * zoomScale;
      panY = my - ((my - panY) / oldScale) * zoomScale;
      applyZoom();
    };
    svg.addEventListener('wheel', onWheel, { passive: false });

    // Middle-mouse or background drag to pan
    let panning = false;
    let panStartX = 0;
    let panStartY = 0;
    const onBgDown = (e: MouseEvent) => {
      if (e.target !== svg && e.target !== zoomGroup) return;
      panning = true;
      panStartX = e.clientX - panX;
      panStartY = e.clientY - panY;
      e.preventDefault();
    };
    const onBgMove = (e: MouseEvent) => {
      if (!panning) return;
      panX = e.clientX - panStartX;
      panY = e.clientY - panStartY;
      applyZoom();
    };
    const onBgUp = () => { panning = false; };
    svg.addEventListener('mousedown', onBgDown);
    document.addEventListener('mousemove', onBgMove);
    document.addEventListener('mouseup', onBgUp);

    const linkEls = links.map((link) => {
      const line = document.createElementNS(ns, 'line');
      line.classList.add(styles.actorGraphLink);
      line.setAttribute('marker-end', `url(#${marker.id})`);
      zoomGroup.appendChild(line);
      return line;
    });

    const documentCleanupHandlers: Array<() => void> = [];

    const nodeEls = nodes.map((node, nodeIdx) => {
      const group = document.createElementNS(ns, 'g');
      group.classList.add(styles.actorGraphNode);

      // Clip path for circular icon
      const clipId = `clip-node-${nodeIdx}`;
      const clip = document.createElementNS(ns, 'clipPath');
      clip.setAttribute('id', clipId);
      const clipCircle = document.createElementNS(ns, 'circle');
      clipCircle.setAttribute('r', String(node.r));
      clipCircle.setAttribute('cx', '0');
      clipCircle.setAttribute('cy', '0');
      clip.appendChild(clipCircle);
      defs.appendChild(clip);

      // Background circle with border
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('r', String(node.r));
      circle.setAttribute('fill', '#fffdf8');
      circle.setAttribute('stroke', strokeColors[node.kind] ?? '#dacbb4');
      circle.setAttribute('stroke-width', '1.5');
      circle.dataset.spanId = node.spanId;
      group.appendChild(circle);

      // Icon image — LLM vendor icons get padding, others fill the circle
      const iconSrc = resolveSpanIcon(node.span);
      const isVendor = iconSrc.includes('/llms/');
      const pad = isVendor ? Math.round(node.r * 0.3) : 0;
      const imgSize = (node.r - pad) * 2;
      const img = document.createElementNS(ns, 'image');
      img.setAttribute('href', iconSrc);
      img.setAttribute('x', String(-node.r + pad));
      img.setAttribute('y', String(-node.r + pad));
      img.setAttribute('width', String(imgSize));
      img.setAttribute('height', String(imgSize));
      img.setAttribute('clip-path', `url(#${clipId})`);
      img.setAttribute('preserveAspectRatio', isVendor ? 'xMidYMid meet' : 'xMidYMid slice');
      group.appendChild(img);

      // Label below the circle
      const label = document.createElementNS(ns, 'text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', String(node.r + 14));
      label.setAttribute('fill', labelColors[node.kind] ?? '#5a4534');
      label.setAttribute('font-size', '10');
      label.setAttribute('font-weight', '500');
      label.textContent = node.label;
      group.appendChild(label);

      group.addEventListener('click', () => {
        onSelectRef.current(`entity:${node.spanId}`, node.spanId, spanDisplayLabel(node.span));
      });

      let dragging = false;
      const onMouseDown = (event: MouseEvent) => {
        dragging = true;
        node.fixed = true;
        event.preventDefault();
      };
      const onMouseMove = (event: MouseEvent) => {
        if (!dragging) return;
        const rect = svg.getBoundingClientRect();
        const scaleX = W / rect.width;
        const scaleY = H / rect.height;
        node.x = (event.clientX - rect.left) * scaleX;
        node.y = (event.clientY - rect.top) * scaleY;
        node.vx = 0;
        node.vy = 0;
        // Update position immediately during drag (even when frozen)
        nodeEls[nodes.indexOf(node)]?.setAttribute('transform', `translate(${node.x},${node.y})`);
        // Update connected links
        links.forEach((link, li) => {
          const src = nodes[link.source];
          const tgt = nodes[link.target];
          const ddx = tgt.x - src.x;
          const ddy = tgt.y - src.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
          linkEls[li].setAttribute('x1', String(src.x));
          linkEls[li].setAttribute('y1', String(src.y));
          linkEls[li].setAttribute('x2', String(tgt.x - (ddx / dd) * tgt.r));
          linkEls[li].setAttribute('y2', String(tgt.y - (ddy / dd) * tgt.r));
        });
      };
      const onMouseUp = () => {
        if (!dragging) return;
        dragging = false;
        // After freeze, keep node fixed at its new position
        if (!frozen) node.fixed = false;
      };
      group.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      documentCleanupHandlers.push(() => document.removeEventListener('mousemove', onMouseMove));
      documentCleanupHandlers.push(() => document.removeEventListener('mouseup', onMouseUp));

      group.addEventListener('mouseenter', () => {
        let tip = container.querySelector<HTMLDivElement>('[data-actor-tooltip="true"]');
        if (!tip) {
          tip = document.createElement('div');
          tip.dataset.actorTooltip = 'true';
          tip.className = styles.actorGraphTooltip;
          container.appendChild(tip);
        }
        const s = node.span;
        let content = `<div class="${styles.actorTooltipTitle}">${esc(graphNodeLabel(s))}</div>`;
        // Same fields as Step Detail badges, per span type
        if (s.kind === 'llm_call') {
          if (s.model) content += `<div class="${styles.actorTooltipRow}">Model: ${esc(s.model)}</div>`;
          content += `<div class="${styles.actorTooltipRow}">Started At: ${esc(formatDate(s.startMs))}</div>`;
          content += `<div class="${styles.actorTooltipRow}">Duration: ${esc(formatDuration(s.resolvedDurationMs))}</div>`;
          if (s.tokensIn > 0) content += `<div class="${styles.actorTooltipRow}">Input Tokens: ${esc(formatCompactTokens(s.tokensIn))}</div>`;
          if (s.tokensOut > 0) content += `<div class="${styles.actorTooltipRow}">Output Tokens: ${esc(formatCompactTokens(s.tokensOut))}</div>`;
          const cost = formatSpanCostValue(s);
          if (cost) content += `<div class="${styles.actorTooltipRow}">Cost: ${esc(cost)}</div>`;
        } else if (s.kind === 'tool_call') {
          content += `<div class="${styles.actorTooltipRow}">Started At: ${esc(formatDate(s.startMs))}</div>`;
          content += `<div class="${styles.actorTooltipRow}">Duration: ${esc(formatDuration(s.resolvedDurationMs))}</div>`;
        } else if (s.kind === 'subagent') {
          content += `<div class="${styles.actorTooltipRow}">Started At: ${esc(formatDate(s.startMs))}</div>`;
          content += `<div class="${styles.actorTooltipRow}">Duration: ${esc(formatDuration(s.resolvedDurationMs))}</div>`;
        } else {
          // session
          content += `<div class="${styles.actorTooltipRow}">Started At: ${esc(formatDate(s.startMs))}</div>`;
        }
        tip.innerHTML = content;
        tip.style.display = 'block';
      });
      group.addEventListener('mouseleave', () => {
        const tip = container.querySelector<HTMLDivElement>('[data-actor-tooltip="true"]');
        if (tip) tip.style.display = 'none';
      });
      group.addEventListener('mousemove', (event) => {
        const tip = container.querySelector<HTMLDivElement>('[data-actor-tooltip="true"]');
        if (!tip) return;
        const rect = container.getBoundingClientRect();
        tip.style.left = `${event.clientX - rect.left + 12}px`;
        tip.style.top = `${event.clientY - rect.top + 12}px`;
      });

      zoomGroup.appendChild(group);
      return group;
    });

    container.appendChild(svg);

    let rafId = 0;
    let alpha = 1;
    let frozen = false;

    // Freeze force layout after 5 seconds — fix all node positions
    const freezeTimer = setTimeout(() => {
      frozen = true;
      alpha = 0;
      for (const node of nodes) node.fixed = true;
    }, 5000);

    const tick = () => {
      if (alpha < 0.001) return;
      if (frozen) return;
      alpha *= 0.982;

      // Repulsion — stronger force pushes nodes apart radially
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.r + b.r + 60;
          const force = 1800 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (!a.fixed) { a.vx -= fx; a.vy -= fy; }
          if (!b.fixed) { b.vx += fx; b.vy += fy; }
          if (dist < minDist) {
            const push = (minDist - dist) * 0.35;
            const px = (dx / dist) * push;
            const py = (dy / dist) * push;
            if (!a.fixed) { a.x -= px; a.y -= py; }
            if (!b.fixed) { b.x += px; b.y += py; }
          }
        }
      }

      // Link spring — longer rest length for spacious layout
      for (const link of links) {
        const source = nodes[link.source];
        const target = nodes[link.target];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = source.r + target.r + 100;
        const force = (dist - targetDist) * 0.012;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (!source.fixed) { source.vx += fx; source.vy += fy; }
        if (!target.fixed) { target.vx -= fx; target.vy -= fy; }
      }

      // Gentle center pull — very weak so nodes spread outward
      for (const node of nodes) {
        if (node.fixed) continue;
        const centerPull = node.kind === 'session' ? 0.004 : 0.001;
        node.vx += (cx - node.x) * centerPull;
        node.vy += (cy - node.y) * centerPull;
        node.vx *= 0.82;
        node.vy *= 0.82;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(node.r + 5, Math.min(W - node.r - 5, node.x));
        node.y = Math.max(node.r + 5, Math.min(H - node.r - 5, node.y));
      }

      links.forEach((link, index) => {
        const source = nodes[link.source];
        const target = nodes[link.target];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const offsetX = (dx / dist) * target.r;
        const offsetY = (dy / dist) * target.r;
        linkEls[index].setAttribute('x1', String(source.x));
        linkEls[index].setAttribute('y1', String(source.y));
        linkEls[index].setAttribute('x2', String(target.x - offsetX));
        linkEls[index].setAttribute('y2', String(target.y - offsetY));
      });

      nodes.forEach((node, index) => {
        nodeEls[index].setAttribute('transform', `translate(${node.x},${node.y})`);
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    const onResize = () => {
      if (frozen) return; // never restart after freeze
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(freezeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('mousedown', onBgDown);
      document.removeEventListener('mousemove', onBgMove);
      document.removeEventListener('mouseup', onBgUp);
      documentCleanupHandlers.forEach((dispose) => dispose());
      container.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.spans]);

  // Highlight selected node without re-creating graph
  useEffect(() => {
    const container = graphRef.current;
    if (!container) return;
    const circles = container.querySelectorAll<SVGCircleElement>('circle[data-span-id]');
    circles.forEach((circle) => {
      const isSelected = selectedEntityId === `entity:${circle.dataset.spanId}`;
      circle.setAttribute('stroke-width', isSelected ? '3' : '1.5');
      circle.setAttribute('stroke', isSelected ? '#8b5e3c' : '#dacbb4');
    });
  }, [selectedEntityId]);

  if (!detail.spans.length) {
    return <div className={styles.viewEmpty}>No entities to graph.</div>;
  }

  return <div ref={graphRef} className={styles.actorMapCanvas} aria-label="Actor map" />;
}

function StepTimelineView({
  detail,
  selectedSpanId,
  onSelectSpan,
}: {
  detail: TraceDetailSnapshot;
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [tooltip, setTooltip] = useState<{ spanId: string; x: number; y: number } | null>(null);

  const spanById = useMemo(
    () => new Map(detail.spans.map((s) => [s.spanId, s])),
    [detail.spans],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Hardcode: session rows always first
  const rows = useMemo(() => {
    const raw = detail.waterfall.rows;
    const sessions = raw.filter((r) => r.kind === 'session');
    const rest = raw.filter((r) => r.kind !== 'session');
    return [...sessions, ...rest];
  }, [detail.waterfall.rows]);

  const BAR_HEIGHT = 28;
  const ROW_HEIGHT = 36;
  const ICON_SIZE = 20;
  const MIN_BAR_WIDTH = BAR_HEIGHT;
  const RIGHT_RESERVE = 220;
  const AXIS_HEIGHT = 28;

  const { pxPerMs, ticks } = useMemo(() => {
    if (!rows.length) return { pxPerMs: 1, ticks: [] };
    const maxEnd = Math.max(...rows.map((r) => r.startOffsetMs + r.durationMs), 1);
    const availW = Math.max(100, containerWidth - RIGHT_RESERVE);
    const scale = availW / maxEnd;
    const step = niceTimeStep(maxEnd);
    const tickMarks: Array<{ ms: number; label: string; left: number }> = [];
    for (let t = 0; t <= maxEnd + step * 0.5; t += step) {
      tickMarks.push({ ms: t, label: formatDuration(t), left: t * scale });
    }
    return { pxPerMs: scale, ticks: tickMarks };
  }, [rows, containerWidth]);

  if (!rows.length) {
    return <div className={styles.viewEmpty}>No timed steps captured for this run.</div>;
  }

  return (
    <section className={styles.timelineView}>
      <div ref={containerRef} className={styles.tlContainer}>
        {/* Time axis header */}
        <div className={styles.tlAxis} style={{ height: AXIS_HEIGHT }}>
          {ticks.map((tick, i) => (
            <span
              key={tick.ms}
              className={styles.tlAxisTick}
              style={{ left: tick.left, transform: i === 0 ? 'none' : 'translateX(-50%)' }}
            >
              {tick.label}
            </span>
          ))}
        </div>

        {/* Scrollable body */}
        <div className={styles.tlBody}>
          <div className={styles.tlBodyInner} style={{ height: rows.length * ROW_HEIGHT + 8 }}>
            {/* Vertical grid lines */}
            {ticks.map((tick) => (
              <div key={tick.ms} className={styles.tlGridLine} style={{ left: tick.left }} />
            ))}

            {/* Rows */}
            {rows.map((row, i) => {
              const span = spanById.get(row.spanId);
              const barLeft = row.startOffsetMs * pxPerMs;
              const barWidth = Math.max(MIN_BAR_WIDTH, row.durationMs * pxPerMs);
              const isWide = barWidth > BAR_HEIGHT * 2;
              const color = KIND_BAR_COLORS[row.kind] ?? '#667085';
              const iconSrc = span ? resolveSpanIcon(span) : '/icons/session.png';
              const isVendorIcon = iconSrc.includes('/llms/');
              const label = span ? spanTreeName(span) : row.label;
              const duration = formatDuration(row.durationMs);
              const isSelected = selectedSpanId === row.spanId;

              return (
                <div
                  key={row.spanId}
                  className={`${styles.tlRow} ${isSelected ? styles.tlRowSelected : ''}`}
                  style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}
                  onClick={() => onSelectSpan(row.spanId)}
                  onMouseEnter={(e) => setTooltip({ spanId: row.spanId, x: e.clientX, y: e.clientY })}
                  onMouseMove={(e) => { if (tooltip?.spanId === row.spanId) setTooltip({ spanId: row.spanId, x: e.clientX, y: e.clientY }); }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Bar */}
                  <div
                    className={`${styles.tlBar} ${isSelected ? styles.tlBarSelected : ''}`}
                    style={{ left: barLeft, width: barWidth, height: BAR_HEIGHT, background: color }}
                  >
                    {isWide ? (
                      <>
                        {isVendorIcon ? (
                          <span className={styles.tlBarIconWrap}>
                            <Image src={iconSrc} width={14} height={14} alt="" unoptimized style={{ borderRadius: 2, objectFit: 'contain' }} />
                          </span>
                        ) : (
                          <Image src={iconSrc} width={ICON_SIZE} height={ICON_SIZE} alt="" className={styles.tlBarIcon} unoptimized />
                        )}
                        <span className={styles.tlBarLabel}>{label}</span>
                      </>
                    ) : (
                      <>
                        {isVendorIcon ? (
                          <span className={styles.tlBarIconWrapCenter}>
                            <Image src={iconSrc} width={14} height={14} alt="" unoptimized style={{ borderRadius: 2, objectFit: 'contain' }} />
                          </span>
                        ) : (
                          <Image src={iconSrc} width={ICON_SIZE} height={ICON_SIZE} alt="" className={styles.tlBarIconCenter} unoptimized />
                        )}
                      </>
                    )}
                  </div>

                  {/* After-bar: outside label + duration */}
                  <div className={styles.tlAfterBar} style={{ left: barLeft + barWidth + 6 }}>
                    {!isWide && <span className={styles.tlOutsideLabel}>{label}</span>}
                    <span className={styles.tlDuration}>{duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (() => {
          const span = spanById.get(tooltip.spanId);
          const row = rows.find((r) => r.spanId === tooltip.spanId);
          if (!span || !row) return null;
          return (
            <div className={styles.tlTooltip} style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}>
              <strong>{spanTreeName(span)}</strong>
              {span.model && <span className={styles.tlTooltipBadge}>{span.model}</span>}
              <br />
              {formatDuration(row.durationMs)}
              {span.totalTokens > 0 && <> · {formatCompactTokens(span.totalTokens)} tokens</>}
            </div>
          );
        })()}
      </div>
    </section>
  );
}

function RunEfficiencyView({
  detail,
  selectedPhaseId,
  onSelectPhase,
}: {
  detail: TraceDetailSnapshot;
  selectedPhaseId: string | null;
  onSelectPhase: (phase: TraceDetailPhase) => void;
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dom = chartRef.current;
    if (!dom) return;

    let disposed = false;
    let chartInstance: ReturnType<EChartsLike['init']> | null = null;

    const onResize = () => chartInstance?.resize();

    void (async () => {
      const echarts = (await import('echarts')) as unknown as EChartsLike;
      if (disposed || !dom) return;
      chartInstance = echarts.init(dom);

      const phases = detail.workIndex.phases;
      const categories = phases.map((_, index) => `P${index + 1}`);
      const values = phases.map((phase) => phase.score);

      chartInstance.setOption(
        {
          animation: false,
          grid: { top: 20, left: 42, right: 18, bottom: 34 },
          tooltip: {
            trigger: 'axis',
            formatter: (params: Array<{ axisValueLabel?: string; value?: number }>) => {
              const item = params[0];
              if (!item) return '';
              return `${item.axisValueLabel}<br/>Score ${Math.round(item.value ?? 0)}/100`;
            },
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              color: '#7d6e63',
            },
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            splitNumber: 4,
            axisLabel: {
              color: '#7d6e63',
            },
            splitLine: {
              lineStyle: {
                color: '#eaded2',
                type: 'dashed',
              },
            },
          },
          series: [
            {
              type: 'line',
              data: values.map((score, index) => ({
                value: score,
                phaseId: phases[index]?.id,
                itemStyle: {
                  color: selectedPhaseId === phases[index]?.id ? '#2e2115' : '#8e4f35',
                  borderColor: '#fff',
                  borderWidth: 2,
                },
              })),
              smooth: 0.34,
              symbolSize: 9,
              lineStyle: {
                width: 2.6,
                color: '#8e4f35',
              },
              areaStyle: {
                color: 'rgba(142,79,53,0.18)',
              },
            },
          ],
        },
        true,
      );

      chartInstance.off('click');
      chartInstance.on('click', (params: unknown) => {
        const payload = params as { data?: { phaseId?: string } };
        const phaseId = payload.data?.phaseId;
        if (!phaseId) return;
        const phase = detail.workIndex.phases.find((item) => item.id === phaseId);
        if (!phase) return;
        onSelectPhase(phase);
      });

      window.addEventListener('resize', onResize);
    })();

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      chartInstance?.dispose();
    };
  }, [detail.workIndex.phases, onSelectPhase, selectedPhaseId]);

  if (!detail.workIndex.phases.length) {
    return <div className={styles.viewEmpty}>No efficiency phases available for this run.</div>;
  }

  return (
    <div className={styles.efficiencyLayout}>
      <div className={styles.efficiencySummaryRow}>
        <article className={styles.efficiencySummaryCard}>
          <p className={styles.efficiencySummaryLabel}>Average score</p>
          <p className={styles.efficiencySummaryValue}>{detail.workIndex.averageScore}</p>
          <p className={styles.efficiencySummaryMeta}>out of 100</p>
        </article>
        <article className={styles.efficiencySummaryCard}>
          <p className={styles.efficiencySummaryLabel}>Phases</p>
          <p className={styles.efficiencySummaryValue}>{detail.workIndex.phases.length}</p>
          <p className={styles.efficiencySummaryMeta}>windowed segments</p>
        </article>
      </div>

      <div className={styles.efficiencyChartCanvas} ref={chartRef} aria-label="Run efficiency" />

      <div className={styles.phaseTableWrap}>
        <table className={styles.phaseTable}>
          <thead>
            <tr>
              <th>Phase</th>
              <th>Score</th>
              <th>Status</th>
              <th>LLM</th>
              <th>Tools</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {detail.workIndex.phases.map((phase, index) => {
              const selected = selectedPhaseId === phase.id;
              return (
                <tr
                  key={phase.id}
                  className={selected ? styles.phaseRowSelected : ''}
                  onClick={() => onSelectPhase(phase)}
                >
                  <td>P{index + 1}</td>
                  <td>{phase.score}</td>
                  <td>
                    <span className={`${styles.phaseStatus} ${styles[`phaseStatus${phase.status}`]}`}>
                      {phase.statusLabel}
                    </span>
                  </td>
                  <td>{phase.llmCalls}</td>
                  <td>{phase.toolCalls}</td>
                  <td>{formatNumber(phase.tokens)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExecutionPathView({
  detail,
  selectedSpanId,
  onSelectSpan,
}: {
  detail: TraceDetailSnapshot;
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
}) {
  const spanById = useMemo(() => new Map(detail.spans.map((span) => [span.spanId, span])), [detail.spans]);
  const executionParentBySpanId = useMemo(() => {
    const parentBySpan = new Map<string, string | null>();
    const llmBySession = new Map<string, TraceDetailSpan[]>();

    for (const span of detail.spans) {
      if (span.kind !== 'llm_call') {
        continue;
      }
      const sessionKey = span.sessionKey ?? '__unknown_session__';
      const bucket = llmBySession.get(sessionKey) ?? [];
      bucket.push(span);
      llmBySession.set(sessionKey, bucket);
    }

    for (const bucket of llmBySession.values()) {
      bucket.sort((a, b) => a.startMs - b.startMs);
    }

    for (const span of detail.spans) {
      let parentSpanId = span.parentSpanId ?? null;
      const rawParent = parentSpanId ? spanById.get(parentSpanId) ?? null : null;

      if (span.kind === 'tool_call' && (!rawParent || rawParent.kind === 'session')) {
        const sessionKey = span.sessionKey ?? rawParent?.sessionKey ?? '__unknown_session__';
        const llmCandidates = llmBySession.get(sessionKey) ?? [];

        let chosenParent = llmCandidates
          .filter((candidate) => candidate.startMs <= span.startMs && candidate.resolvedEndMs >= span.startMs)
          .sort((a, b) => b.startMs - a.startMs)[0];

        if (!chosenParent) {
          chosenParent = llmCandidates
            .filter((candidate) => candidate.startMs <= span.startMs)
            .sort((a, b) => b.startMs - a.startMs)[0];
        }

        if (chosenParent) {
          parentSpanId = chosenParent.spanId;
        }
      }

      parentBySpan.set(span.spanId, parentSpanId);
    }

    return parentBySpan;
  }, [detail.spans, spanById]);

  const rootSpanIds = useMemo(() => {
    return detail.spans
      .filter((span) => {
        const parentSpanId = executionParentBySpanId.get(span.spanId) ?? null;
        return !parentSpanId || !spanById.has(parentSpanId);
      })
      .sort((a, b) => a.startMs - b.startMs)
      .map((span) => span.spanId);
  }, [detail.spans, executionParentBySpanId, spanById]);

  const childrenByParent = useMemo(() => {
    const map = new Map<string, TraceDetailSpan[]>();
    for (const span of detail.spans) {
      const executionParentSpanId = executionParentBySpanId.get(span.spanId) ?? null;
      if (!executionParentSpanId) continue;
      const bucket = map.get(executionParentSpanId) ?? [];
      bucket.push(span);
      map.set(executionParentSpanId, bucket);
    }

    for (const bucket of map.values()) {
      bucket.sort((a, b) => a.startMs - b.startMs);
    }

    return map;
  }, [detail.spans, executionParentBySpanId]);

  // All spans expanded by default
  const allSpanIds = useMemo(() => new Set(detail.spans.map((s) => s.spanId)), [detail.spans]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(allSpanIds));

  // Keep expanded set in sync when spans change
  useEffect(() => {
    setExpandedIds(new Set(detail.spans.map((s) => s.spanId)));
  }, [detail.spans]);

  const rootIdSet = useMemo(() => new Set(rootSpanIds), [rootSpanIds]);

  const toggleExpanded = useCallback((spanId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(spanId)) next.delete(spanId);
      else next.add(spanId);
      return next;
    });
  }, []);

  function renderNode(span: TraceDetailSpan): ReactNode {
    const children = childrenByParent.get(span.spanId) ?? [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(span.spanId);
    const isSelected = selectedSpanId === span.spanId;
    const isError = Number(span.attributes.has_error) > 0;
    const isRoot = rootIdSet.has(span.spanId);
    const iconSrc = resolveSpanIcon(span);
    const isVendorIcon = iconSrc.includes('/llms/');
    const cost = formatSpanCostValue(span);

    return (
      <div key={span.spanId} className={styles.treeNode}>
        {/* Single clickable block covers both rows — so highlight spans everything */}
        <button
          type="button"
          id={`span-${span.spanId}`}
          className={`${styles.treeNodeBlock} ${isSelected ? styles.treeNodeBlockSelected : ''}`}
          onClick={() => onSelectSpan(span.spanId)}
        >
          {/* Icon */}
          {isVendorIcon ? (
            <span className={styles.treeItemIconWrap}>
              <Image src={iconSrc} width={16} height={16} alt="" className={styles.treeItemIconInner} unoptimized />
            </span>
          ) : (
            <Image src={iconSrc} width={24} height={24} alt="" className={styles.treeItemIcon} unoptimized />
          )}

          {/* All labels — wrap naturally to 1–3 rows */}
          <div className={styles.treeNodeContent}>
            <span className={styles.treeItemName}>{spanTreeName(span)}</span>
            {isError && <span className={styles.treeErrorBadge}>Error</span>}
            {span.kind === 'llm_call' && span.model && (
              <span className={styles.treeItemBadge}>{shortModelName(span.model)}</span>
            )}
            {span.kind !== 'session' && (
              <span className={styles.treeMetaDuration}>
                <ClockIcon /> {formatDuration(span.resolvedDurationMs)}
              </span>
            )}
            {(span.tokensIn > 0 || span.tokensOut > 0 || cost) && (
              <span className={styles.treeMetaGroup}>
                {span.tokensIn > 0 && (
                  <span className={styles.treeMetaGroupItem}>In: {formatCompactTokens(span.tokensIn)}</span>
                )}
                {span.tokensOut > 0 && (
                  <>
                    {span.tokensIn > 0 && <span className={styles.treeMetaSep} />}
                    <span className={styles.treeMetaGroupItem}>Out: {formatCompactTokens(span.tokensOut)}</span>
                  </>
                )}
                {cost && (
                  <>
                    {(span.tokensIn > 0 || span.tokensOut > 0) && <span className={styles.treeMetaSep} />}
                    <span className={styles.treeMetaGroupItem}>Cost: {cost}</span>
                  </>
                )}
              </span>
            )}
          </div>

          {/* Chevron — always at top-right */}
          {hasChildren && !isRoot ? (
            <span
              className={styles.treeItemChevron}
              role="button"
              tabIndex={-1}
              onClick={(e) => { e.stopPropagation(); toggleExpanded(span.spanId); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); toggleExpanded(span.spanId); } }}
            >
              {isExpanded ? '\u25BE' : '\u25B8'}
            </span>
          ) : null}
        </button>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className={styles.treeChildGroup}>
            {children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  }

  if (!detail.spans.length || !rootSpanIds.length) {
    return <div className={styles.viewEmpty}>No call tree data available for this run.</div>;
  }

  return (
    <div className={styles.treePanel}>
      <div className={styles.treeRows}>
        {rootSpanIds
          .map((rootId) => spanById.get(rootId))
          .filter((span): span is TraceDetailSpan => Boolean(span))
          .map((span) => renderNode(span))}
      </div>
    </div>
  );
}

/* ── Payload format detection ───────────────────────────────────────────── */
type PayloadFormat = 'markdown' | 'json' | 'command';

/** Command-shaped JSON: has a "command" string field */
function isCommandJson(text: string): string | null {
  try {
    const obj = JSON.parse(text.trim());
    if (obj && typeof obj === 'object' && !Array.isArray(obj) && typeof obj.command === 'string') {
      return obj.command;
    }
  } catch { /* not json */ }
  return null;
}

function detectPayloadFormat(text: string): PayloadFormat {
  const trimmed = text.trim();
  // Command-shaped JSON (e.g. { "command": "...", "yieldMs": 30000 })
  if (isCommandJson(trimmed)) return 'command';
  // Pure JSON (starts with { or [)
  if (/^[\[{]/.test(trimmed)) {
    try { JSON.parse(trimmed); return 'json'; } catch { /* fall through */ }
  }
  // Explicit shell patterns
  if (/^(\$\s|#!\/)/.test(trimmed)) return 'command';
  // Terminal / CLI output: box-drawing chars, ANSI-style output, progress bars
  if (/[│├╮╯╰╭─┌┐└┘┬┤◇◆▶►]/.test(trimmed)) return 'command';
  if (/\r/.test(trimmed)) return 'command'; // carriage returns = progress output
  // Everything else → markdown (the fallback)
  return 'markdown';
}

function formatPayloadLabel(fmt: PayloadFormat): string {
  if (fmt === 'json') return 'JSON';
  if (fmt === 'command') return 'Command';
  return 'Markdown';
}

/** Extract raw input text from a span */
function extractInputText(span: TraceDetailSpan): string {
  if (span.kind === 'tool_call') {
    return span.toolParams ? JSON.stringify(span.toolParams, null, 2) : '';
  }
  if (span.kind === 'llm_call') {
    if (typeof span.attributes.prompt === 'string' && span.attributes.prompt.length > 0) {
      return span.attributes.prompt as string;
    }
    return JSON.stringify({ provider: span.provider, model: span.model, tokensIn: span.tokensIn }, null, 2);
  }
  return JSON.stringify(span.attributes, null, 2);
}

/** Extract raw output text from a span */
function extractOutputText(span: TraceDetailSpan): string {
  if (span.kind === 'llm_call' && Array.isArray(span.attributes.output) && (span.attributes.output as string[]).length > 0) {
    return (span.attributes.output as string[]).join('\n');
  }
  const payload = extractOutputPayload(span);
  if (!payload) return '';
  // Drill into nested structures to find the most useful content
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj = payload as any;
    // Try: result.details.aggregated (tool call outputs from OpenClaw)
    const aggregated = obj?.result?.details?.aggregated;
    if (aggregated !== undefined && aggregated !== null) {
      return typeof aggregated === 'string' ? aggregated : JSON.stringify(aggregated, null, 2);
    }
    // Try: data.details.aggregated (alternative nesting)
    const aggregated2 = obj?.data?.details?.aggregated;
    if (aggregated2 !== undefined && aggregated2 !== null) {
      return typeof aggregated2 === 'string' ? aggregated2 : JSON.stringify(aggregated2, null, 2);
    }
    // Try: result.content[0].text (standard tool result)
    const text = obj?.result?.content?.[0]?.text;
    if (typeof text === 'string' && text.length > 0) return text;
  } catch { /* fall through */ }
  return JSON.stringify(payload, null, 2);
}

/** Custom syntax highlighter style matching the warm Atelier palette */
const atelierHighlightStyle: Record<string, React.CSSProperties> = {
  ...duotoneLight,
  'pre[class*="language-"]': {
    ...(duotoneLight['pre[class*="language-"]'] as React.CSSProperties),
    background: 'transparent',
    margin: 0,
    padding: 0,
    fontSize: '12px',
    lineHeight: '1.55',
  },
  'code[class*="language-"]': {
    ...(duotoneLight['code[class*="language-"]'] as React.CSSProperties),
    background: 'transparent',
    fontSize: '12px',
    lineHeight: '1.55',
  },
};

/* ── Copy-to-clipboard button ──────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);

  return (
    <button type="button" className={styles.copyButton} onClick={handleCopy} aria-label="Copy to clipboard">
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
      )}
    </button>
  );
}

/* ── Rendered content by format ────────────────────────────────────────── */
function PayloadContent({ rawText, format }: { rawText: string; format: PayloadFormat | 'raw' }) {
  if (format === 'command') {
    // Extract command string from JSON wrapper if present
    const cmd = isCommandJson(rawText.trim()) ?? rawText;
    return (
      <SyntaxHighlighter language="bash" style={atelierHighlightStyle} wrapLongLines>
        {cmd}
      </SyntaxHighlighter>
    );
  }
  if (format === 'json') {
    let pretty = rawText;
    try { pretty = JSON.stringify(JSON.parse(rawText), null, 2); } catch { /* keep as-is */ }
    return (
      <SyntaxHighlighter language="json" style={atelierHighlightStyle} wrapLongLines>
        {pretty}
      </SyntaxHighlighter>
    );
  }
  if (format === 'markdown') {
    return (
      <div className={styles.payloadMarkdown}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{rawText}</ReactMarkdown>
      </div>
    );
  }
  // raw
  return <pre className={styles.payloadRaw}>{rawText}</pre>;
}

/* ── Payload section with format toggle + copy ─────────────────────────── */
function PayloadSection({ label, rawText, rawOnly }: { label: string; rawText: string; rawOnly?: boolean }) {
  const autoFormat = useMemo(() => detectPayloadFormat(rawText), [rawText]);
  const [viewMode, setViewMode] = useState<'auto' | 'raw'>('auto');

  // Reset on span change
  useEffect(() => { setViewMode('auto'); }, [rawText]);

  if (!rawText) {
    return (
      <section className={styles.payloadSection}>
        <div className={styles.payloadHeader}>
          <h3 className={styles.inspectTitle}>{label}</h3>
        </div>
        <p className={styles.inspectEmpty}>Not captured in this run.</p>
      </section>
    );
  }

  const activeFormat = rawOnly ? 'raw' : (viewMode === 'auto' ? autoFormat : 'raw');
  const formatLabel = formatPayloadLabel(autoFormat);

  return (
    <section className={styles.payloadSection}>
      <div className={styles.payloadHeader}>
        <h3 className={styles.inspectTitle}>{label}</h3>
        {!rawOnly && (
          <div className={styles.payloadToggle}>
            <button
              type="button"
              className={`${styles.payloadToggleBtn} ${viewMode === 'auto' ? styles.payloadToggleBtnActive : ''}`}
              onClick={() => setViewMode('auto')}
            >
              {formatLabel}
            </button>
            <button
              type="button"
              className={`${styles.payloadToggleBtn} ${viewMode === 'raw' ? styles.payloadToggleBtnActive : ''}`}
              onClick={() => setViewMode('raw')}
            >
              Raw
            </button>
          </div>
        )}
      </div>
      <div className={styles.payloadBox}>
        <CopyButton text={rawText} />
        <PayloadContent rawText={rawText} format={activeFormat} />
      </div>
    </section>
  );
}

/* ── Step Detail panel (redesigned) ────────────────────────────────────── */
function ViewInspector({
  detail,
  selection,
  selectedSpan,
  onClose,
}: {
  detail: TraceDetailSnapshot;
  selection: SelectionSource | null;
  selectedSpan: TraceDetailSpan | null;
  onClose?: () => void;
}) {
  const iconSrc = selectedSpan ? resolveSpanIcon(selectedSpan) : '';
  const isVendorIcon = iconSrc.includes('/llms/');
  const stepName = selectedSpan ? spanTreeName(selectedSpan) : '';
  const inputText = selectedSpan ? extractInputText(selectedSpan) : '';
  const outputText = selectedSpan ? extractOutputText(selectedSpan) : '';

  /* Build metadata badge entries */
  const badges: { label: string; value: string }[] = [];
  if (selectedSpan) {
    if (selectedSpan.model) badges.push({ label: 'Model', value: selectedSpan.model });
    badges.push({ label: 'Started At', value: formatDate(selectedSpan.startMs) });
    if (selectedSpan.kind !== 'session') badges.push({ label: 'Duration', value: formatDuration(selectedSpan.resolvedDurationMs) });
    if (selectedSpan.tokensIn > 0) badges.push({ label: 'Input Tokens', value: formatCompactTokens(selectedSpan.tokensIn) });
    if (selectedSpan.tokensOut > 0) badges.push({ label: 'Output Tokens', value: formatCompactTokens(selectedSpan.tokensOut) });
    const cost = formatSpanCostValue(selectedSpan);
    if (cost) badges.push({ label: 'Cost', value: cost });
  }

  return (
    <aside className={styles.inspectorCard}>
      <header className={styles.inspectorHeader}>
        <p className={styles.inspectorTitle}>Step Detail</p>
        {onClose && (
          <button type="button" className={styles.inspectorClose} onClick={onClose} aria-label="Close step detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        )}
      </header>

      {selectedSpan ? (
        <div className={styles.inspectorBody}>
          {/* Identity: icon + step name */}
          <div className={styles.stepIdentity}>
            {isVendorIcon ? (
              <span className={styles.treeItemIconWrap}>
                <Image src={iconSrc} width={16} height={16} alt="" className={styles.treeItemIconInner} unoptimized />
              </span>
            ) : (
              <Image src={iconSrc} width={24} height={24} alt="" className={styles.treeItemIcon} unoptimized />
            )}
            <span className={styles.stepIdentityName}>{stepName}</span>
          </div>

          {/* Metadata badges */}
          <div className={styles.stepBadges}>
            {badges.map((b) => (
              <span key={b.label} className={styles.stepBadge}>
                {b.label}: {b.value}
              </span>
            ))}
          </div>

          {/* Input */}
          <PayloadSection label="Input" rawText={inputText} />

          {/* Output — exec tool results shown as raw only */}
          <PayloadSection label="Output" rawText={outputText}
            rawOnly={selectedSpan.kind === 'tool_call' && selectedSpan.toolName === 'exec'} />
        </div>
      ) : (
        <div className={styles.inspectorBody}>
          <p className={styles.inspectEmpty}>Select a step to inspect.</p>
        </div>
      )}
    </aside>
  );
}

export function TraceDetailWorkbench({
  flow,
  allFlows,
  workflowId,
  snapshot,
  detail,
}: TraceDetailWorkbenchProps) {
  const [mode, setMode] = useState<TraceDetailViewMode>('execution_path');
  const [tracyOpen, setTracyOpen] = useState(true);
  const [selection, setSelection] = useState<SelectionSource | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

  const spanById = useMemo(() => new Map((detail?.spans ?? []).map((span) => [span.spanId, span])), [detail?.spans]);

  const selectedSpan = useMemo(() => {
    if (!detail) return null;
    if (selection?.spanId) {
      return spanById.get(selection.spanId) ?? null;
    }

    if (detail.quickInsights.hottestSpanId) {
      return spanById.get(detail.quickInsights.hottestSpanId) ?? null;
    }

    return detail.spans[0] ?? null;
  }, [detail, selection, spanById]);

  useEffect(() => {
    if (!detail) return;
    const initialSpanId = detail.quickInsights.hottestSpanId ?? detail.spans[0]?.spanId ?? null;
    if (!initialSpanId) return;
    setSelection({
      type: 'span',
      spanId: initialSpanId,
      label: spanDisplayLabel(spanById.get(initialSpanId) ?? detail.spans[0]),
    });
  }, [detail?.trace.trajectoryTraceId]);

  const onSelectSpan = (spanId: string) => {
    const span = spanById.get(spanId);
    if (!span) return;
    setSelection({
      type: 'span',
      spanId,
      label: spanDisplayLabel(span),
    });
  };

  const onSelectEntity = (entityId: string, spanId: string | null, label: string) => {
    setSelectedEntityId(entityId);
    if (spanId) {
      onSelectSpan(spanId);
    }
    setSelection({
      type: 'entity',
      spanId,
      entityId,
      label,
    });
  };

  const onSelectPhase = (phase: TraceDetailPhase) => {
    setSelectedPhaseId(phase.id);
    if (phase.representativeSpanId) {
      onSelectSpan(phase.representativeSpanId);
    }
    setSelection({
      type: 'phase',
      spanId: phase.representativeSpanId,
      phaseId: phase.id,
      label: phase.statusLabel,
    });
  };

  if (!snapshot || !detail) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyShell}>
          <article className={styles.emptyCard}>
            <p className={styles.emptyKicker}>Trace detail</p>
            <h1 className={styles.emptyTitle}>No trace found for this workflow</h1>
            <p className={styles.emptyBody}>
              I could not resolve a trace run for <code>{decodeURIComponent(workflowId)}</code>. Open a run from Overview and try again.
            </p>
            <Link href="/control-room" className={styles.backButton}>
              Back to Overview
            </Link>
          </article>
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

        <section className={styles.content}>
          <header className={styles.topRow}>
            <div className={styles.topIdentity}>
              <h1 className={styles.pageTitle}>Tracing Detail</h1>
              <p className={styles.pageSubtitle}>
                {detail.workflow.name} · {formatDate(detail.trace.startedAtMs)}
              </p>
            </div>

            <div className={styles.topActions}>
              <Link href="/control-room" className={styles.backButtonInline}>
                Back to Overview
              </Link>
            </div>
          </header>

          <section className={styles.modeSwitcher} role="tablist" aria-label="Trace detail views">
            {MODE_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.modeButton} ${mode === item.id ? styles.modeButtonActive : ''}`}
                onClick={() => setMode(item.id)}
                role="tab"
                aria-selected={mode === item.id}
              >
                <span className={styles.modeLabel}>{item.label}</span>
              </button>
            ))}
          </section>

          <section className={styles.workspace}>
            <article className={styles.viewCard}>
              <div className={`${styles.viewBody} ${mode === 'execution_path' || mode === 'step_timeline' ? styles.viewBodyFlush : ''}`}>
                {mode === 'execution_path' ? (
                  <ExecutionPathView detail={detail} selectedSpanId={selectedSpan?.spanId ?? null} onSelectSpan={onSelectSpan} />
                ) : null}

                {mode === 'actor_map' ? (
                  <ActorMapView
                    detail={detail}
                    selectedEntityId={selectedEntityId}
                    onSelect={(entityId, spanId, label) => onSelectEntity(entityId, spanId, label)}
                  />
                ) : null}

                {mode === 'step_timeline' ? (
                  <StepTimelineView detail={detail} selectedSpanId={selectedSpan?.spanId ?? null} onSelectSpan={onSelectSpan} />
                ) : null}

                {mode === 'run_efficiency' ? (
                  <RunEfficiencyView detail={detail} selectedPhaseId={selectedPhaseId} onSelectPhase={onSelectPhase} />
                ) : null}
              </div>
            </article>

            <ViewInspector detail={detail} selection={selection} selectedSpan={selectedSpan} />
          </section>
        </section>

        <aside className={`${styles.tracyRail} ${tracyOpen ? styles.tracyRailOpen : styles.tracyRailClosed}`}>
          <TracyRunQualityPanel
            detail={detail}
            open={tracyOpen}
            onToggleOpen={() => setTracyOpen((current) => !current)}
            onSelectSpan={onSelectSpan}
          />
        </aside>
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * TraceDetailContent — same 4-view layout but designed to sit INSIDE an
 * AppNav shell (no FlowLeftNav, no <main> wrapper).
 * Use this on the /trace route where AppNav is already the outer nav.
 * ───────────────────────────────────────────────────────────────────────────── */
type TraceDetailContentProps = {
  workflowId: string;
  detail: TraceDetailSnapshot | null;
};

export function TraceDetailContent({ workflowId, detail }: TraceDetailContentProps) {
  const [mode, setMode] = useState<TraceDetailViewMode>('execution_path');
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [splitPct, setSplitPct] = useState(50);
  const workspaceRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const [isNarrowContent, setIsNarrowContent] = useState(false);

  // Track content width via ResizeObserver — overlay inspector when < 760px
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setIsNarrowContent((entry?.contentRect.width ?? 800) < 760);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Close inspector by default on narrow containers (< 760px)
  useEffect(() => {
    const el = contentRef.current;
    if (el && el.offsetWidth < 760) setInspectorOpen(false);
  }, []);
  const [selection, setSelection] = useState<SelectionSource | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const spanById = useMemo(
    () => new Map((detail?.spans ?? []).map((span) => [span.spanId, span])),
    [detail?.spans],
  );

  // Find the first root span, then default to its first child (first step below session start)
  const defaultSpanId = useMemo(() => {
    if (!detail) return null;
    const ids = new Set(detail.spans.map((s) => s.spanId));
    const root = detail.spans
      .filter((s) => !s.parentSpanId || !ids.has(s.parentSpanId))
      .sort((a, b) => a.startMs - b.startMs)[0];
    if (!root) return detail.spans[0]?.spanId ?? null;
    // Find the first child of the root span (first step below Session Start)
    const firstChild = detail.spans
      .filter((s) => s.parentSpanId === root.spanId)
      .sort((a, b) => a.startMs - b.startMs)[0];
    return firstChild?.spanId ?? root.spanId;
  }, [detail]);

  const selectedSpan = useMemo(() => {
    if (!detail) return null;
    if (selection?.spanId) return spanById.get(selection.spanId) ?? null;
    if (defaultSpanId) return spanById.get(defaultSpanId) ?? null;
    return detail.spans[0] ?? null;
  }, [detail, selection, spanById, defaultSpanId]);

  useEffect(() => {
    if (!detail) return;
    const initialSpanId = defaultSpanId ?? detail.spans[0]?.spanId ?? null;
    if (!initialSpanId) return;
    const span = spanById.get(initialSpanId) ?? detail.spans[0];
    setSelection({
      type: 'span',
      spanId: initialSpanId,
      label: spanDisplayLabel(span),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.trace.trajectoryTraceId]);

  const onSelectSpan = (spanId: string) => {
    const span = spanById.get(spanId);
    if (!span) return;
    setSelection({ type: 'span', spanId, label: spanDisplayLabel(span) });
    setInspectorOpen(true);
  };

  const onSelectEntity = (entityId: string, spanId: string | null, label: string) => {
    setSelectedEntityId(entityId);
    if (spanId) onSelectSpan(spanId);
    setSelection({ type: 'entity', spanId, entityId, label });
  };

  if (!detail) {
    return (
      <section className={styles.emptyShell} style={{ flex: 1, minWidth: 0 }}>
        <article className={styles.emptyCard}>
          <p className={styles.emptyKicker}>Trace detail</p>
          <h1 className={styles.emptyTitle}>Trace not found</h1>
          <p className={styles.emptyBody}>
            The trajectory <code>{decodeURIComponent(workflowId)}</code> could not be found or has no recorded spans. It may have expired or the ID may be incorrect.
          </p>
          <Link href="/trace" className={styles.backButton}>
            Back to Agents
          </Link>
        </article>
      </section>
    );
  }

  return (
    <section className={styles.workbenchShell}>
      <section ref={contentRef} className={`${styles.content} ${isNarrowContent ? styles.contentNarrow : ''}`}>
        <section
          ref={workspaceRef}
          className={`${styles.workspace} ${!inspectorOpen ? styles.workspaceNoInspector : ''}`}
          style={inspectorOpen ? { gridTemplateColumns: `${splitPct}% 6px minmax(0, 1fr)` } : undefined}
        >
          <article className={styles.viewCard}>
            {/* Header with centered mode switcher + divider aligned with inspector header */}
            <div className={styles.viewCardHeader}>
              <section className={styles.modeSwitcher} role="tablist" aria-label="Trace detail views">
                {MODE_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.modeButton} ${mode === item.id ? styles.modeButtonActive : ''}`}
                    onClick={() => setMode(item.id)}
                    role="tab"
                    aria-selected={mode === item.id}
                  >
                    <span className={styles.modeLabel}>{item.label}</span>
                  </button>
                ))}
              </section>
            </div>

            <div
              className={`${styles.viewBody} ${
                mode === 'execution_path' || mode === 'step_timeline'
                  ? styles.viewBodyFlush
                  : ''
              }`}
            >
              {mode === 'execution_path' ? (
                <ExecutionPathView
                  detail={detail}
                  selectedSpanId={selectedSpan?.spanId ?? null}
                  onSelectSpan={onSelectSpan}
                />
              ) : null}
              {mode === 'actor_map' ? (
                <ActorMapView
                  detail={detail}
                  selectedEntityId={selectedEntityId}
                  onSelect={onSelectEntity}
                />
              ) : null}
              {mode === 'step_timeline' ? (
                <StepTimelineView
                  detail={detail}
                  selectedSpanId={selectedSpan?.spanId ?? null}
                  onSelectSpan={onSelectSpan}
                />
              ) : null}
            </div>
          </article>

          {inspectorOpen && (
            <>
              <div
                className={styles.divider}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const ws = workspaceRef.current;
                  if (!ws) return;
                  const rect = ws.getBoundingClientRect();
                  const onMove = (ev: MouseEvent) => {
                    const pct = ((ev.clientX - rect.left) / rect.width) * 100;
                    setSplitPct(Math.min(75, Math.max(25, pct)));
                  };
                  const onUp = () => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                  };
                  document.body.style.cursor = 'col-resize';
                  document.body.style.userSelect = 'none';
                  document.addEventListener('mousemove', onMove);
                  document.addEventListener('mouseup', onUp);
                }}
              >
                <span className={styles.dividerDots}>⋮</span>
              </div>
              <ViewInspector detail={detail} selection={selection} selectedSpan={selectedSpan}
                onClose={() => setInspectorOpen(false)} />
            </>
          )}
        </section>
      </section>
    </section>
  );
}
