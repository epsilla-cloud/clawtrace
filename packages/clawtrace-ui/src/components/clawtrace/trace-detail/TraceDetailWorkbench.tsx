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
    label: 'Execution Path',
    description: 'Step-by-step run path with grouped repeated calls.',
  },
  {
    id: 'actor_map',
    label: 'Actor Map',
    description: 'Who acted in this run: agents, tools, and models.',
  },
  {
    id: 'step_timeline',
    label: 'Step Timeline',
    description: 'Timing view to spot bottlenecks and waiting time.',
  },
  {
    id: 'run_efficiency',
    label: 'Run Efficiency',
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

      const nodes = detail.entityGraph.nodes.map((node) => {
        const nodeColor =
          node.type === 'actor'
            ? '#3b62bd'
            : node.type === 'tool'
              ? '#6b8f34'
              : '#ba7b2c';

        const baseSymbolSize = node.type === 'actor' ? 54 : node.type === 'model' ? 40 : 34;

        return {
          id: node.id,
          name: node.label,
          value: node.metrics.totalTokens,
          category: node.type,
          symbolSize: baseSymbolSize,
          itemStyle: {
            color: nodeColor,
            borderColor: selectedEntityId === node.id ? '#2e2115' : '#fff',
            borderWidth: selectedEntityId === node.id ? 2 : 1,
            shadowBlur: selectedEntityId === node.id ? 12 : 0,
            shadowColor: 'rgba(32,19,9,0.18)',
          },
          label: {
            show: true,
            color: '#2f2217',
            fontSize: 11,
            formatter: node.type === 'actor' ? `{b}` : `{b}`,
          },
          relatedSpanId: node.relatedSpanId,
          nodeType: node.type,
        };
      });

      const links = detail.entityGraph.links.map((link) => ({
        source: link.source,
        target: link.target,
        lineStyle: {
          color: link.kind === 'spawns' ? '#3b62bd' : '#cab9aa',
          width: link.kind === 'spawns' ? 2 : 1.2,
          type: link.kind === 'spawns' ? 'dashed' : 'solid',
          opacity: 0.85,
        },
      }));

      chartInstance.setOption(
        {
          animation: false,
          tooltip: {
            trigger: 'item',
            formatter: (params: { data?: { name?: string; nodeType?: string } }) => {
              const name = params.data?.name ?? 'node';
              const nodeType = params.data?.nodeType ?? 'node';
              return `${name}<br/>${nodeType}`;
            },
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              roam: true,
              force: {
                repulsion: 320,
                gravity: 0.08,
                edgeLength: [80, 160],
              },
              emphasis: {
                focus: 'adjacency',
              },
              data: nodes,
              links,
              categories: [
                { name: 'actor' },
                { name: 'tool' },
                { name: 'model' },
              ],
              lineStyle: {
                curveness: 0.1,
              },
            },
          ],
        },
        true,
      );

      chartInstance.off('click');
      chartInstance.on('click', (params: unknown) => {
        const payload = params as { dataType?: string; data?: { id?: string; relatedSpanId?: string | null; name?: string } };
        if (payload.dataType !== 'node' || !payload.data?.id) return;
        onSelect(payload.data.id, payload.data.relatedSpanId ?? null, payload.data.name ?? payload.data.id);
      });

      window.addEventListener('resize', onResize);
    })();

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      chartInstance?.dispose();
    };
  }, [detail.entityGraph.links, detail.entityGraph.nodes, onSelect, selectedEntityId]);

  if (!detail.entityGraph.nodes.length) {
    return <div className={styles.viewEmpty}>No entity relationships captured for this run.</div>;
  }

  return <div ref={chartRef} className={styles.actorMapCanvas} aria-label="Actor map" />;
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

      const rows = detail.waterfall.rows.slice(0, 120);
      const categories = rows.map((row, index) => {
        const prefix = row.kind === 'llm_call'
          ? 'M'
          : row.kind === 'tool_call'
            ? 'T'
            : row.kind === 'subagent'
              ? 'S'
              : 'C';
        return `${prefix}${index + 1}`;
      });

      const offsetSeries = rows.map((row) => ({
        value: row.startOffsetMs,
        spanId: row.spanId,
      }));

      const durationSeries = rows.map((row) => ({
        value: row.durationMs,
        spanId: row.spanId,
        label: row.label,
        kind: row.kind,
        tokens: row.totalTokens,
        itemStyle: {
          color:
            row.kind === 'llm_call'
              ? '#a8603f'
              : row.kind === 'tool_call'
                ? '#4d7c45'
                : row.kind === 'subagent'
                  ? '#6a58a6'
                  : '#5f6b7a',
          borderColor: selectedSpanId === row.spanId ? '#2e2115' : 'rgba(255,255,255,0.75)',
          borderWidth: selectedSpanId === row.spanId ? 2 : 1,
          opacity: selectedSpanId && selectedSpanId !== row.spanId ? 0.66 : 0.95,
        },
      }));

      const maxValue = Math.max(...rows.map((row) => row.startOffsetMs + row.durationMs), 1);

      chartInstance.setOption(
        {
          animation: false,
          grid: {
            top: 24,
            left: 54,
            right: 22,
            bottom: 42,
            containLabel: false,
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: { data?: { label?: string; kind?: string; value?: number; tokens?: number } }) => {
              const item = params.data;
              if (!item) return '';
              return [
                `${item.label ?? 'step'}`,
                `${item.kind ?? 'step'} · ${formatDuration(item.value ?? 0)}`,
                `${formatNumber(item.tokens ?? 0)} tokens`,
              ].join('<br/>');
            },
          },
          xAxis: {
            type: 'value',
            min: 0,
            max: maxValue,
            axisLabel: {
              color: '#7e6e62',
              formatter: (value: number) => formatDuration(value),
            },
            splitLine: {
              lineStyle: {
                color: '#eaded3',
                type: 'dashed',
              },
            },
          },
          yAxis: {
            type: 'category',
            inverse: true,
            data: categories,
            axisLabel: {
              color: '#8c7a6b',
              fontSize: 11,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#e5d8cc',
              },
            },
          },
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
              barWidth: 14,
              data: durationSeries,
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
  }, [detail.waterfall.rows, onSelectSpan, selectedSpanId]);

  if (!detail.waterfall.rows.length) {
    return <div className={styles.viewEmpty}>No timed steps captured for this run.</div>;
  }

  return <div ref={chartRef} className={styles.timelineCanvas} aria-label="Step timeline" />;
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
  const childrenByParent = useMemo(() => {
    const map = new Map<string, TraceDetailSpan[]>();
    for (const span of detail.spans) {
      if (!span.parentSpanId) continue;
      const bucket = map.get(span.parentSpanId) ?? [];
      bucket.push(span);
      map.set(span.parentSpanId, bucket);
    }

    for (const bucket of map.values()) {
      bucket.sort((a, b) => a.startMs - b.startMs);
    }

    return map;
  }, [detail.spans]);

  const [openGroupMap, setOpenGroupMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenGroupMap({});
  }, [detail.trace.trajectoryTraceId]);

  function groupKey(span: TraceDetailSpan): string | null {
    if (span.kind === 'tool_call') {
      return `tool:${span.toolName ?? span.name}`;
    }
    if (span.kind === 'llm_call') {
      return `llm:${span.model ?? 'unknown'}`;
    }
    return null;
  }

  function groupedChildren(children: TraceDetailSpan[]): Array<{ key: string; spans: TraceDetailSpan[] }> {
    const groups: Array<{ key: string; spans: TraceDetailSpan[] }> = [];
    let index = 0;

    while (index < children.length) {
      const current = children[index];
      const currentKey = groupKey(current);

      if (currentKey && index + 1 < children.length && groupKey(children[index + 1]) === currentKey) {
        const bucket: TraceDetailSpan[] = [current];
        let cursor = index + 1;
        while (cursor < children.length && groupKey(children[cursor]) === currentKey) {
          bucket.push(children[cursor]);
          cursor += 1;
        }
        groups.push({ key: `${current.parentSpanId ?? 'root'}-${index}-${currentKey}`, spans: bucket });
        index = cursor;
        continue;
      }

      groups.push({ key: `${current.parentSpanId ?? 'root'}-${index}-${current.spanId}`, spans: [current] });
      index += 1;
    }

    return groups;
  }

  function renderNode(span: TraceDetailSpan, depth: number, path: string): ReactNode {
    const children = childrenByParent.get(span.spanId) ?? [];
    const grouped = groupedChildren(children);

    return (
      <Fragment key={span.spanId}>
        <button
          type="button"
          id={`span-${span.spanId}`}
          className={`${styles.treeRow} ${selectedSpanId === span.spanId ? styles.treeRowSelected : ''}`}
          style={{ paddingLeft: `${12 + depth * 18}px` }}
          onClick={() => onSelectSpan(span.spanId)}
        >
          <span className={`${styles.treeKindDot} ${styles[`kindDot${span.kind}`]}`} aria-hidden="true" />
          <span className={styles.treeLabel}>{spanDisplayLabel(span)}</span>
          <span className={styles.treeMeta}>{formatDuration(span.resolvedDurationMs)}</span>
          <span className={styles.treeMeta}>{formatNumber(span.totalTokens)} tok</span>
        </button>

        {grouped.map((group, groupIndex) => {
          if (group.spans.length === 1) {
            return renderNode(group.spans[0], depth + 1, `${path}-${groupIndex}`);
          }

          const opened = openGroupMap[group.key] ?? false;
          const first = group.spans[0];
          const totalTokens = group.spans.reduce((sum, item) => sum + item.totalTokens, 0);
          const totalDuration = group.spans.reduce((sum, item) => sum + item.resolvedDurationMs, 0);

          return (
            <Fragment key={group.key}>
              <button
                type="button"
                className={styles.treeGroupRow}
                style={{ paddingLeft: `${12 + (depth + 1) * 18}px` }}
                onClick={() => {
                  setOpenGroupMap((current) => ({
                    ...current,
                    [group.key]: !opened,
                  }));
                }}
              >
                <span className={styles.treeGroupCaret}>{opened ? '▾' : '▸'}</span>
                <span className={`${styles.treeKindDot} ${styles[`kindDot${first.kind}`]}`} aria-hidden="true" />
                <span className={styles.treeGroupLabel}>{spanDisplayLabel(first)}</span>
                <span className={styles.treeGroupBadge}>×{group.spans.length}</span>
                <span className={styles.treeMeta}>{formatDuration(totalDuration)}</span>
                <span className={styles.treeMeta}>{formatNumber(totalTokens)} tok</span>
              </button>

              {opened ? group.spans.map((groupSpan, innerIndex) => renderNode(groupSpan, depth + 2, `${path}-${groupIndex}-${innerIndex}`)) : null}
            </Fragment>
          );
        })}
      </Fragment>
    );
  }

  if (!detail.spans.length || !detail.callTree.roots.length) {
    return <div className={styles.viewEmpty}>No call tree data available for this run.</div>;
  }

  return (
    <div className={styles.treePanel}>
      {detail.callTree.roots
        .map((rootId) => spanById.get(rootId))
        .filter((span): span is TraceDetailSpan => Boolean(span))
        .map((span, index) => renderNode(span, 0, `root-${index}`))}
    </div>
  );
}

function ViewInspector({
  detail,
  selection,
  selectedSpan,
}: {
  detail: TraceDetailSnapshot;
  selection: SelectionSource | null;
  selectedSpan: TraceDetailSpan | null;
}) {
  const outputPayload = selectedSpan ? extractOutputPayload(selectedSpan) : null;
  const selectedActions = buildImprovementActions(selectedSpan);

  return (
    <aside className={styles.inspectorCard}>
      <header className={styles.inspectorHeader}>
        <p className={styles.inspectorTitle}>Detail Inspector</p>
        <p className={styles.inspectorSubtitle}>{buildSelectionSummary(selection)}</p>
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
              <pre className={styles.inspectCode}>
{JSON.stringify(
  {
    provider: selectedSpan.provider,
    model: selectedSpan.model,
    tokensIn: selectedSpan.tokensIn,
    attributes: selectedSpan.attributes,
  },
  null,
  2,
)}
              </pre>
            ) : (
              <pre className={styles.inspectCode}>{JSON.stringify(selectedSpan.attributes, null, 2)}</pre>
            )}
          </section>

          <section className={styles.inspectSection}>
            <h3 className={styles.inspectTitle}>Output / response</h3>
            {outputPayload ? (
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

  const modeMeta = MODE_ITEMS.find((item) => item.id === mode) ?? MODE_ITEMS[0];

  return (
    <main className={styles.page}>
      <section className={`${styles.shell} ${tracyOpen ? styles.shellTracyOpen : styles.shellTracyCollapsed}`}>
        <div className={styles.leftRail}>
          <FlowLeftNav flow={flow} allFlows={allFlows} />
        </div>

        <section className={styles.content}>
          <header className={styles.topRow}>
            <div className={styles.topIdentity}>
              <h1 className={styles.pageTitle}>Run Detail</h1>
              <p className={styles.pageSubtitle}>
                {detail.workflow.name} · {formatDate(detail.trace.startedAtMs)}
              </p>
            </div>

            <div className={styles.topActions}>
              <span className={`${styles.statusPill} ${statusClass(detail.trace.status)}`}>
                {statusLabel(detail.trace.status)}
              </span>
              <Link href="/control-room" className={styles.backButtonInline}>
                Back to Overview
              </Link>
            </div>
          </header>

          <section className={styles.traceMetaBar}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Trace</span>
              <span className={styles.metaValue}>{detail.trace.baseTraceId}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Duration</span>
              <span className={styles.metaValue}>{formatDuration(detail.trace.durationMs)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Tokens</span>
              <span className={styles.metaValue}>{formatNumber(detail.trace.totalTokens)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Est. cost</span>
              <span className={styles.metaValue}>{formatCurrency(detail.trace.estimatedCostUsd)}</span>
            </div>
          </section>

          <section className={styles.modeBar}>
            {MODE_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.modeButton} ${mode === item.id ? styles.modeButtonActive : ''}`}
                onClick={() => setMode(item.id)}
              >
                <span className={styles.modeLabel}>{item.label}</span>
                <span className={styles.modeDescription}>{item.description}</span>
              </button>
            ))}
          </section>

          <section className={styles.workspace}>
            <article className={styles.viewCard}>
              <header className={styles.viewCardHeader}>
                <h2 className={styles.viewCardTitle}>{modeMeta.label}</h2>
                <p className={styles.viewCardSubtitle}>{modeMeta.description}</p>
              </header>

              <div className={styles.viewBody}>
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
