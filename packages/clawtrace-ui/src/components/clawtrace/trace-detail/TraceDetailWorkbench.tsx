'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { FlowLeftNav } from '../flow/FlowLeftNav';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
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
    label: 'Trace View',
    description: 'Step-by-step run path.',
  },
  {
    id: 'actor_map',
    label: 'Call Graph View',
    description: 'Who acted in this run: agents, tools, and models.',
  },
  {
    id: 'step_timeline',
    label: 'Timeline View',
    description: 'Timing view to spot bottlenecks and waiting time.',
  },
  {
    id: 'run_efficiency',
    label: 'Efficiency View',
    description: 'Quality-pressure profile by phase for this run.',
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
  if (valueMs < 60_000) {
    return `${(valueMs / 1000).toFixed(1)}s`;
  }
  return `${(valueMs / 60_000).toFixed(1)}m`;
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

function compactActorNodeLabel(span: TraceDetailSpan): string {
  if (span.kind === 'session') {
    return span.agentId ?? 'session';
  }
  if (span.kind === 'llm_call') {
    return span.model ?? 'model';
  }
  if (span.kind === 'tool_call') {
    return span.toolName ?? span.name.replace(/^tool:/, '');
  }
  return span.childAgentId ?? 'subagent';
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
      label: compactActorNodeLabel(span),
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
    const colors: Record<TraceDetailSpanKind, string> = {
      session: '#2563eb',
      llm_call: '#ca8a04',
      tool_call: '#16a34a',
      subagent: '#9333ea',
    };
    const bgColors: Record<TraceDetailSpanKind, string> = {
      session: '#eff6ff',
      llm_call: '#fefce8',
      tool_call: '#f0fdf4',
      subagent: '#f3e8ff',
    };
    const iconByKind: Record<TraceDetailSpanKind, string> = {
      session: '🤖',
      llm_call: '🧠',
      tool_call: '🔧',
      subagent: '🤖',
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

    const linkEls = links.map((link) => {
      const line = document.createElementNS(ns, 'line');
      line.classList.add(styles.actorGraphLink);
      line.setAttribute('marker-end', `url(#${marker.id})`);
      svg.appendChild(line);
      return line;
    });

    const documentCleanupHandlers: Array<() => void> = [];

    const nodeEls = nodes.map((node) => {
      const group = document.createElementNS(ns, 'g');
      group.classList.add(styles.actorGraphNode);

      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('r', String(node.r));
      circle.setAttribute('fill', bgColors[node.kind] ?? '#ffffff');
      circle.setAttribute('stroke', colors[node.kind] ?? '#9ca3af');
      const isSelected = selectedEntityId === `entity:${node.spanId}`;
      circle.setAttribute('stroke-width', isSelected ? '3' : '2');
      group.appendChild(circle);

      const icon = document.createElementNS(ns, 'text');
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('dy', node.kind === 'session' || node.kind === 'subagent' ? '-4' : '1');
      icon.setAttribute('font-size', node.kind === 'session' || node.kind === 'subagent' ? '16' : '12');
      icon.textContent = iconByKind[node.kind];
      group.appendChild(icon);

      const label = document.createElementNS(ns, 'text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', node.kind === 'session' || node.kind === 'subagent' ? '12' : '24');
      label.setAttribute('fill', colors[node.kind] ?? '#6b7280');
      label.setAttribute('font-size', '10');
      const labelText = node.label.length > 20 ? `${node.label.slice(0, 18)}…` : node.label;
      label.textContent = labelText;
      group.appendChild(label);

      if ((node.kind === 'session' || node.kind === 'subagent') && node.span.sessionKey) {
        const metrics = sessionMetrics.get(node.span.sessionKey);
        if (metrics) {
          const stats = document.createElementNS(ns, 'text');
          stats.classList.add(styles.actorGraphNodeStats);
          stats.setAttribute('text-anchor', 'middle');
          stats.setAttribute('dy', '23');
          stats.textContent = `${metrics.llmCalls} llm / ${metrics.toolCalls} tools`;
          group.appendChild(stats);
        }
      }

      group.addEventListener('click', () => {
        onSelect(`entity:${node.spanId}`, node.spanId, spanDisplayLabel(node.span));
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
      };
      const onMouseUp = () => {
        if (!dragging) return;
        dragging = false;
        node.fixed = false;
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
        let content = `<div class="${styles.actorTooltipTitle}">${esc(spanDisplayLabel(node.span))}</div>`;
        content += `<div class="${styles.actorTooltipRow}">${spanKindLabel(node.span)}</div>`;
        if (node.span.kind === 'llm_call' && node.span.model) {
          content += `<div class="${styles.actorTooltipRow}">Model: ${esc(node.span.model)}</div>`;
        }
        if (node.span.kind === 'tool_call' && node.span.toolName) {
          content += `<div class="${styles.actorTooltipRow}">Tool: ${esc(node.span.toolName)}</div>`;
        }
        content += `<div class="${styles.actorTooltipRow}">${formatDuration(node.span.resolvedDurationMs)} · ${formatNumber(node.span.totalTokens)} tok</div>`;
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

      svg.appendChild(group);
      return group;
    });

    const legend = document.createElement('div');
    legend.className = styles.actorGraphLegend;
    legend.innerHTML = `<span class="${styles.actorLegendSession}">Session</span><span class="${styles.actorLegendModel}">Model</span><span class="${styles.actorLegendTool}">Tool</span>`;
    container.appendChild(svg);
    container.appendChild(legend);

    let rafId = 0;
    let alpha = 1;
    const tick = () => {
      if (alpha < 0.001) return;
      alpha *= 0.982;

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.r + b.r + 36;
          const force = 620 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (!a.fixed) {
            a.vx -= fx;
            a.vy -= fy;
          }
          if (!b.fixed) {
            b.vx += fx;
            b.vy += fy;
          }
          if (dist < minDist) {
            const push = (minDist - dist) * 0.28;
            const px = (dx / dist) * push;
            const py = (dy / dist) * push;
            if (!a.fixed) {
              a.x -= px;
              a.y -= py;
            }
            if (!b.fixed) {
              b.x += px;
              b.y += py;
            }
          }
        }
      }

      for (const link of links) {
        const source = nodes[link.source];
        const target = nodes[link.target];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = source.r + target.r + 64;
        const force = (dist - targetDist) * 0.016;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (!source.fixed) {
          source.vx += fx;
          source.vy += fy;
        }
        if (!target.fixed) {
          target.vx -= fx;
          target.vy -= fy;
        }
      }

      for (const node of nodes) {
        if (node.fixed) continue;
        const centerPull = node.kind === 'session' ? 0.005 : 0.0018;
        node.vx += (cx - node.x) * centerPull;
        node.vy += (cy - node.y) * centerPull;
        node.vx *= 0.84;
        node.vy *= 0.84;
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
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      documentCleanupHandlers.forEach((dispose) => dispose());
      container.innerHTML = '';
    };
  }, [detail.spans, onSelect, selectedEntityId]);

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
  const chartRef = useRef<HTMLDivElement | null>(null);
  const timelineRows = useMemo(() => detail.waterfall.rows.slice(0, 160), [detail.waterfall.rows]);

  const timelineNormalization = useMemo(() => {
    const percentile = (values: number[], ratio: number): number => {
      if (!values.length) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      const index = Math.max(0, Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio)));
      return sorted[index] ?? 0;
    };

    const rowEnds = timelineRows.map((row) => row.startOffsetMs + row.durationMs);
    const nonSessionEnds = timelineRows
      .filter((row) => row.kind !== 'session')
      .map((row) => row.startOffsetMs + row.durationMs);
    const hardMaxEnd = Math.max(...rowEnds, 1);

    let maxAllowedEnd = Math.max(...nonSessionEnds, hardMaxEnd, 1);
    if (nonSessionEnds.length >= 8) {
      const p90End = percentile(nonSessionEnds, 0.9);
      const p98End = percentile(nonSessionEnds, 0.98);
      if (hardMaxEnd > p90End * 4) {
        maxAllowedEnd = Math.max(1, p98End * 1.08, p90End * 1.5);
      }
    }

    const traceDuration = Number.isFinite(detail.trace.durationMs) ? Math.max(0, detail.trace.durationMs) : 0;
    if (traceDuration > 0 && traceDuration <= maxAllowedEnd * 2.2) {
      maxAllowedEnd = Math.max(maxAllowedEnd, traceDuration);
    }

    const rows = timelineRows.map((row) => {
      let normalizedStartMs = Number.isFinite(row.startOffsetMs) ? Math.max(0, row.startOffsetMs) : 0;
      let normalizedDurationMs = Number.isFinite(row.durationMs) ? Math.max(1, row.durationMs) : 1;
      let hadTimeMismatch = false;

      if (normalizedStartMs > maxAllowedEnd) {
        normalizedStartMs = Math.max(0, maxAllowedEnd - 1);
        hadTimeMismatch = true;
      }

      if (normalizedStartMs + normalizedDurationMs > maxAllowedEnd) {
        normalizedDurationMs = Math.max(1, maxAllowedEnd - normalizedStartMs);
        hadTimeMismatch = true;
      }

      return {
        ...row,
        normalizedStartMs,
        normalizedDurationMs,
        hadTimeMismatch,
      };
    });

    const mismatchCount = rows.filter((row) => row.hadTimeMismatch).length;
    const normalizedNonSessionEndMax = Math.max(
      ...rows
        .filter((row) => row.kind !== 'session')
        .map((row) => row.normalizedStartMs + row.normalizedDurationMs),
      0,
    );
    const normalizedMaxEnd = Math.max(
      ...rows.map((row) => row.normalizedStartMs + row.normalizedDurationMs),
      1,
    );

    return {
      rows,
      mismatchCount,
      normalizedNonSessionEndMax,
      normalizedMaxEnd,
      maxAllowedEnd,
    };
  }, [detail.trace.durationMs, timelineRows]);

  const timelineSummary = useMemo(() => {
    const summary = {
      total: timelineRows.length,
      session: 0,
      llm: 0,
      tool: 0,
      subagent: 0,
      mismatched: timelineNormalization.mismatchCount,
    };
    for (const row of timelineRows) {
      if (row.kind === 'session') summary.session += 1;
      if (row.kind === 'llm_call') summary.llm += 1;
      if (row.kind === 'tool_call') summary.tool += 1;
      if (row.kind === 'subagent') summary.subagent += 1;
    }
    return summary;
  }, [timelineNormalization.mismatchCount, timelineRows]);

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

      const rows = timelineNormalization.rows;
      const categories = rows.map((row, index) => {
        const prefix = row.kind === 'llm_call'
          ? 'M'
          : row.kind === 'tool_call'
            ? 'T'
            : row.kind === 'subagent'
              ? 'S'
              : 'C';
        const compactLabel = row.label
          .replace(/^session · /, '')
          .replace(/^model step · /, '')
          .replace(/^tool action · /, '')
          .replace(/^subagent · /, '');
        return `${prefix}${index + 1} · ${compactLabel}`;
      });

      const offsetSeries = rows.map((row) => ({
        value: row.normalizedStartMs,
        spanId: row.spanId,
      }));

      const nonSessionEndMax = timelineNormalization.normalizedNonSessionEndMax;
      const fullEndMax = timelineNormalization.normalizedMaxEnd;
      const maxValue = nonSessionEndMax > 0
        ? Math.max(nonSessionEndMax * 1.06, 1)
        : Math.max(fullEndMax, 1);
      const chartHeight = Math.max(360, dom.clientHeight || 0);
      const gridTopPx = 12;
      const gridBottomPx = 36;
      const availableGridHeightPx = Math.max(120, chartHeight - gridTopPx - gridBottomPx);
      const maxRowHeightPx = 48;
      const gridHeightPx = Math.min(availableGridHeightPx, rows.length * maxRowHeightPx);
      const targetRowPitchPx = 26;
      const visibleRowsByHeight = Math.max(
        10,
        Math.floor(gridHeightPx / targetRowPitchPx),
      );
      const visibleRowCount = Math.max(10, Math.min(visibleRowsByHeight, rows.length, 30));
      const useVerticalZoom = rows.length > visibleRowCount;
      const gridLeftPx = 186;
      const gridRightPx = useVerticalZoom ? 36 : 18;
      const plotWidthPx = Math.max(1, (dom.clientWidth || 960) - gridLeftPx - gridRightPx);
      const minVisibleBarPx = 10;
      const minVisibleDurationMs = (maxValue / plotWidthPx) * minVisibleBarPx;

      const durationSeries = rows.map((row) => {
        const remaining = Math.max(1, maxValue - row.normalizedStartMs);
        const clipped = row.normalizedDurationMs > remaining;
        const rawDuration = clipped ? remaining : row.normalizedDurationMs;
        const minVisibleDuration = Math.min(remaining, Math.max(rawDuration, minVisibleDurationMs));
        const durationWasExpanded = minVisibleDuration > rawDuration + 0.0001;
        const kindColor =
          row.kind === 'llm_call'
            ? '#b26a45'
            : row.kind === 'tool_call'
              ? '#6f9569'
              : row.kind === 'subagent'
                ? '#7663ad'
                : '#667085';
        return {
          value: minVisibleDuration,
          spanId: row.spanId,
          label: row.label,
          kind: row.kind,
          tokens: row.totalTokens,
          clipped,
          durationWasExpanded,
          hadTimeMismatch: row.hadTimeMismatch,
          actualDurationMs: row.durationMs,
          itemStyle: {
            color: kindColor,
            borderRadius: [0, 7, 7, 0],
            borderColor: selectedSpanId === row.spanId ? '#2e2115' : 'rgba(255,255,255,0.72)',
            borderWidth: selectedSpanId === row.spanId ? 2 : 1,
            opacity: selectedSpanId && selectedSpanId !== row.spanId ? 0.56 : 0.94,
            shadowBlur: selectedSpanId === row.spanId ? 10 : 0,
            shadowColor: selectedSpanId === row.spanId ? 'rgba(46,33,21,0.22)' : 'transparent',
          },
        };
      });

      chartInstance.setOption(
        {
          animation: false,
          grid: {
            top: gridTopPx,
            left: 186,
            right: useVerticalZoom ? 36 : 18,
            bottom: gridBottomPx,
            height: gridHeightPx,
            containLabel: false,
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: { data?: { label?: string; kind?: string; value?: number; tokens?: number; clipped?: boolean; durationWasExpanded?: boolean; hadTimeMismatch?: boolean; actualDurationMs?: number } }) => {
              const item = params.data;
              if (!item) return '';
              const kindText =
                item.kind === 'llm_call'
                  ? 'Model step'
                  : item.kind === 'tool_call'
                    ? 'Tool action'
                    : item.kind === 'subagent'
                      ? 'Subagent handoff'
                      : 'Session';
              return [
                `<strong>${item.label ?? 'step'}</strong>`,
                `${kindText} · ${formatDuration(item.actualDurationMs ?? item.value ?? 0)}${item.hadTimeMismatch ? ' (normalized due to span mismatch)' : item.clipped ? ' (clipped for readability)' : item.durationWasExpanded ? ' (rendered with minimum width)' : ''}`,
                `${formatNumber(item.tokens ?? 0)} tokens`,
              ].join('<br/>');
            },
            backgroundColor: '#2b2522',
            borderWidth: 0,
            textStyle: {
              color: '#f7efe9',
              fontSize: 12,
            },
          },
          xAxis: {
            type: 'value',
            min: 0,
            max: maxValue,
            axisLine: {
              lineStyle: {
                color: '#d7c7bb',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#7b6b60',
              fontSize: 12,
              formatter: (value: number) => formatDuration(value),
            },
            splitLine: {
              lineStyle: {
                color: '#eadfd5',
                type: 'dashed',
              },
            },
          },
          yAxis: {
            type: 'category',
            inverse: true,
            data: categories,
            axisLabel: {
              color: '#7e6f63',
              fontSize: 11,
              lineHeight: 16,
              interval: 0,
              formatter: (value: string) => {
                if (value.length <= 28) return value;
                return `${value.slice(0, 27)}…`;
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#e2d4c9',
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(224, 208, 196, 0.35)',
                type: 'solid',
              },
            },
          },
          dataZoom: useVerticalZoom
            ? [
                {
                  type: 'inside',
                  yAxisIndex: 0,
                  startValue: 0,
                  endValue: visibleRowCount - 1,
                  zoomOnMouseWheel: 'shift',
                  moveOnMouseMove: true,
                  moveOnMouseWheel: true,
                },
                {
                  type: 'slider',
                  yAxisIndex: 0,
                  right: 8,
                  top: 12,
                  bottom: 36,
                  width: 10,
                  showDetail: false,
                  brushSelect: false,
                  fillerColor: 'rgba(164,83,43,0.18)',
                  backgroundColor: 'rgba(217,201,188,0.32)',
                  borderColor: 'transparent',
                  handleSize: 0,
                  moveHandleSize: 0,
                  dataBackground: {
                    lineStyle: { color: 'transparent' },
                    areaStyle: { color: 'transparent' },
                  },
                  startValue: 0,
                  endValue: visibleRowCount - 1,
                },
              ]
            : [],
          series: [
            {
              name: 'offset',
              type: 'bar',
              stack: 'timeline',
              data: offsetSeries,
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
              emphasis: {
                disabled: true,
              },
              silent: true,
            },
            {
              name: 'duration',
              type: 'bar',
              stack: 'timeline',
              barWidth: '56%',
              barCategoryGap: '58%',
              data: durationSeries,
              emphasis: {
                focus: 'series',
              },
            },
          ],
        },
        true,
      );

      chartInstance.off('click');
      chartInstance.on('click', (params: unknown) => {
        const payload = params as { seriesName?: string; data?: { spanId?: string } };
        if (payload.seriesName !== 'duration') return;
        const spanId = payload.data?.spanId;
        if (!spanId) return;
        onSelectSpan(spanId);
      });

      window.addEventListener('resize', onResize);
    })();

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      chartInstance?.dispose();
    };
  }, [onSelectSpan, selectedSpanId, timelineNormalization, timelineRows]);

  if (!detail.waterfall.rows.length) {
    return <div className={styles.viewEmpty}>No timed steps captured for this run.</div>;
  }

  return (
    <section className={styles.timelineView}>
      <header className={styles.timelineTopRow}>
        <p className={styles.timelineSummary}>
          {timelineSummary.total} steps · {timelineSummary.session} session · {timelineSummary.llm} model · {timelineSummary.tool} tool
          {timelineSummary.subagent ? ` · ${timelineSummary.subagent} subagent` : ''}
          {timelineSummary.mismatched ? ` · normalized ${timelineSummary.mismatched} span${timelineSummary.mismatched > 1 ? 's' : ''}` : ''}
        </p>
        <div className={styles.timelineLegend}>
          <span className={styles.timelineLegendItem}>
            <span className={`${styles.timelineLegendDot} ${styles.timelineLegendSession}`} />
            Session
          </span>
          <span className={styles.timelineLegendItem}>
            <span className={`${styles.timelineLegendDot} ${styles.timelineLegendModel}`} />
            Model
          </span>
          <span className={styles.timelineLegendItem}>
            <span className={`${styles.timelineLegendDot} ${styles.timelineLegendTool}`} />
            Tool
          </span>
          <span className={styles.timelineLegendItem}>
            <span className={`${styles.timelineLegendDot} ${styles.timelineLegendSubagent}`} />
            Subagent
          </span>
        </div>
      </header>
      <div ref={chartRef} className={styles.timelineCanvas} aria-label="Step timeline" />
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

  function renderNode(span: TraceDetailSpan, depth: number, path: string): ReactNode {
    const children = childrenByParent.get(span.spanId) ?? [];

    return (
      <Fragment key={span.spanId}>
        <button
          type="button"
          id={`span-${span.spanId}`}
          className={`${styles.treeRow} ${selectedSpanId === span.spanId ? styles.treeRowSelected : ''} ${Number(span.attributes.has_error) > 0 ? styles.treeRowError : ''}`}
          style={{ paddingLeft: `${12 + depth * 18}px` }}
          onClick={() => onSelectSpan(span.spanId)}
        >
          <span className={styles.treeStepCell}>
            <span className={`${styles.treeKindDot} ${styles[`kindDot${span.kind}`]}`} aria-hidden="true" />
            <span className={styles.treeLabel}>{spanDisplayLabel(span)}</span>
          </span>
          <span className={styles.treeDuration}>{formatDuration(span.resolvedDurationMs)}</span>
          <span className={styles.treeTokens}>{formatSpanTokenCell(span)}</span>
        </button>

        {children.map((childSpan, childIndex) => renderNode(childSpan, depth + 1, `${path}-${childIndex}`))}
      </Fragment>
    );
  }

  if (!detail.spans.length || !rootSpanIds.length) {
    return <div className={styles.viewEmpty}>No call tree data available for this run.</div>;
  }

  return (
    <div className={styles.treePanel}>
      <header className={styles.treeHeader}>
        <span className={styles.treeHeaderStep}>Step</span>
        <span className={styles.treeHeaderMetric}>Duration</span>
        <span className={styles.treeHeaderMetric}>Tokens (LLM)</span>
      </header>
      <div className={styles.treeRows}>
        {rootSpanIds
          .map((rootId) => spanById.get(rootId))
          .filter((span): span is TraceDetailSpan => Boolean(span))
          .map((span, index) => renderNode(span, 0, `root-${index}`))}
      </div>
    </div>
  );
}

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
  const outputPayload = selectedSpan ? extractOutputPayload(selectedSpan) : null;
  const selectedActions = buildImprovementActions(selectedSpan);

  return (
    <aside className={styles.inspectorCard}>
      <header className={styles.inspectorHeader}>
        <div>
          <p className={styles.inspectorTitle}>Step Detail</p>
          <p className={styles.inspectorSubtitle}>{buildSelectionSummary(selection)}</p>
        </div>
        {onClose && (
          <button type="button" className={styles.inspectorClose} onClick={onClose} aria-label="Close step detail">
            <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </header>

      {selectedSpan ? (
        <div className={styles.inspectorBody}>
          <section className={styles.inspectSection}>
            <h3 className={styles.inspectTitle}>What happened</h3>
            <dl className={styles.inspectGrid}>
              <div>
                <dt>Step</dt>
                <dd>{spanDisplayLabel(selectedSpan)}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{spanKindLabel(selectedSpan)}</dd>
              </div>
              <div>
                <dt>Started</dt>
                <dd>{formatDate(selectedSpan.startMs)}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(selectedSpan.resolvedDurationMs)}</dd>
              </div>
              <div>
                <dt>Actor</dt>
                <dd>{selectedSpan.agentId ?? selectedSpan.sessionKey ?? 'n/a'}</dd>
              </div>
              <div>
                <dt>Span ID</dt>
                <dd className={styles.codeValue}>{selectedSpan.spanId}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.inspectSection}>
            <h3 className={styles.inspectTitle}>Cost and load</h3>
            <dl className={styles.inspectGrid}>
              <div>
                <dt>Input tokens</dt>
                <dd>{formatNumber(selectedSpan.tokensIn)}</dd>
              </div>
              <div>
                <dt>Output tokens</dt>
                <dd>{formatNumber(selectedSpan.tokensOut)}</dd>
              </div>
              <div>
                <dt>Total tokens</dt>
                <dd>{formatNumber(selectedSpan.totalTokens)}</dd>
              </div>
              <div>
                <dt>Estimated step cost</dt>
                <dd>{formatCurrency(detail.trace.totalTokens > 0 ? (detail.trace.estimatedCostUsd * selectedSpan.totalTokens) / detail.trace.totalTokens : 0)}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.inspectSection}>
            <h3 className={styles.inspectTitle}>Input / request</h3>
            {selectedSpan.kind === 'tool_call' ? (
              selectedSpan.toolParams ? (
                <pre className={styles.inspectCode}>{JSON.stringify(selectedSpan.toolParams, null, 2)}</pre>
              ) : (
                <p className={styles.inspectEmpty}>Not captured in this run.</p>
              )
            ) : selectedSpan.kind === 'llm_call' ? (
              typeof selectedSpan.attributes.prompt === 'string' && selectedSpan.attributes.prompt.length > 0 ? (
                <pre className={styles.inspectCode}>{selectedSpan.attributes.prompt as string}</pre>
              ) : (
                <pre className={styles.inspectCode}>
{JSON.stringify(
  {
    provider: selectedSpan.provider,
    model: selectedSpan.model,
    tokensIn: selectedSpan.tokensIn,
  },
  null,
  2,
)}
                </pre>
              )
            ) : (
              <pre className={styles.inspectCode}>{JSON.stringify(selectedSpan.attributes, null, 2)}</pre>
            )}
          </section>

          <section className={styles.inspectSection}>
            <h3 className={styles.inspectTitle}>Output / response</h3>
            {selectedSpan.kind === 'llm_call' && Array.isArray(selectedSpan.attributes.output) && (selectedSpan.attributes.output as string[]).length > 0 ? (
              <pre className={styles.inspectCode}>{(selectedSpan.attributes.output as string[]).join('\n')}</pre>
            ) : outputPayload ? (
              <pre className={styles.inspectCode}>{JSON.stringify(outputPayload, null, 2)}</pre>
            ) : (
              <p className={styles.inspectEmpty}>Not captured in this run.</p>
            )}
          </section>

          <section className={styles.inspectSection}>
            <h3 className={styles.inspectTitle}>Action to improve</h3>
            <ol className={styles.inspectActionList}>
              {selectedActions.map((action) => (
                <li key={action} className={styles.inspectActionItem}>
                  {action}
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : (
        <div className={styles.inspectorBody}>
          <p className={styles.inspectEmpty}>Select a step, actor, or phase to inspect this run deeply.</p>
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
  const [selection, setSelection] = useState<SelectionSource | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

  const spanById = useMemo(
    () => new Map((detail?.spans ?? []).map((span) => [span.spanId, span])),
    [detail?.spans],
  );

  const selectedSpan = useMemo(() => {
    if (!detail) return null;
    if (selection?.spanId) return spanById.get(selection.spanId) ?? null;
    if (detail.quickInsights.hottestSpanId)
      return spanById.get(detail.quickInsights.hottestSpanId) ?? null;
    return detail.spans[0] ?? null;
  }, [detail, selection, spanById]);

  useEffect(() => {
    if (!detail) return;
    const initialSpanId =
      detail.quickInsights.hottestSpanId ?? detail.spans[0]?.spanId ?? null;
    if (!initialSpanId) return;
    setSelection({
      type: 'span',
      spanId: initialSpanId,
      label: spanDisplayLabel(spanById.get(initialSpanId) ?? detail.spans[0]),
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

  const onSelectPhase = (phase: TraceDetailPhase) => {
    setSelectedPhaseId(phase.id);
    if (phase.representativeSpanId) onSelectSpan(phase.representativeSpanId);
    setSelection({
      type: 'phase',
      spanId: phase.representativeSpanId,
      phaseId: phase.id,
      label: phase.statusLabel,
    });
  };

  if (!detail) {
    return (
      <section className={styles.emptyShell} style={{ flex: 1, minWidth: 0 }}>
        <article className={styles.emptyCard}>
          <p className={styles.emptyKicker}>Trace detail</p>
          <h1 className={styles.emptyTitle}>No trace loaded</h1>
          <p className={styles.emptyBody}>
            Could not load trace <code>{decodeURIComponent(workflowId)}</code>.
          </p>
          <Link href="/traces" className={styles.backButton}>
            Back to Traces
          </Link>
        </article>
      </section>
    );
  }

  return (
    <section className={styles.workbenchShell}>
      <section className={styles.content}>
        <header className={styles.topRow}>
          <div className={styles.topIdentity}>
            <h1 className={styles.pageTitle}>Trajectory Detail</h1>
            <code className={styles.traceUuid}>{workflowId.slice(0, 12)}…</code>
          </div>
          <Link href="/traces" className={styles.backButtonInline}>
            ← Back
          </Link>
        </header>

        {/* Button tabs (wide screens) */}
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

        {/* Dropdown tabs (narrow screens) */}
        <div className={styles.modeDropdown}>
          <select className={styles.modeDropdownSelect} value={mode}
            onChange={(e) => setMode(e.target.value as TraceDetailViewMode)}>
            {MODE_ITEMS.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>

        <section className={`${styles.workspace} ${!inspectorOpen ? styles.workspaceNoInspector : ''}`}>
          <article className={styles.viewCard}>
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
              {mode === 'run_efficiency' ? (
                <RunEfficiencyView
                  detail={detail}
                  selectedPhaseId={selectedPhaseId}
                  onSelectPhase={onSelectPhase}
                />
              ) : null}
            </div>
          </article>

          {inspectorOpen && (
            <ViewInspector detail={detail} selection={selection} selectedSpan={selectedSpan}
              onClose={() => setInspectorOpen(false)} />
          )}
        </section>
      </section>
    </section>
  );
}
