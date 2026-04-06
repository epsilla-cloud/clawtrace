'use client';

import Image from 'next/image';
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import styles from './TracyPanel.module.css';

/* ── Types ───────────────────────────────────────────────────────────────── */
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
  };
};

const STORAGE_KEY = 'clawtrace:tracy-expanded';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: value < 1 ? 3 : 2,
    maximumFractionDigits: value < 1 ? 3 : 2,
  }).format(value);
}

function parseMarkdownLinks(text: string): Array<string | ReactNode> {
  const nodes: Array<string | ReactNode> = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);
  while (match) {
    const [raw, label, href] = match;
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <a key={`${href}-${match.index}`} href={href} className={styles.inlineLink}
        target="_blank" rel="noreferrer">{label}</a>
    );
    lastIndex = match.index + raw.length;
    match = pattern.exec(text);
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/* ── Inline chart ────────────────────────────────────────────────────────── */
function TracyInlineChart({ chart }: { chart: TracyInlineChartSpec }) {
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
      if (chart.visual === 'pie') {
        chartInstance.setOption({
          animation: false,
          tooltip: { trigger: 'item',
            formatter: (params: { name: string; value: number; percent: number }) =>
              `${params.name}<br/>${chart.mode === 'currency' ? formatCurrency(params.value) : formatNumber(params.value)} (${params.percent}%)`,
          },
          series: [{
            type: 'pie', radius: ['44%', '72%'], center: ['50%', '54%'],
            avoidLabelOverlap: true,
            itemStyle: { borderColor: '#fff', borderWidth: 2 },
            label: { show: false },
            data: chart.categories.map((name, i) => ({ name, value: chart.values[i] ?? 0 })),
          }],
        }, true);
      } else {
        const max = Math.max(...chart.values, 0);
        chartInstance.setOption({
          animation: false,
          grid: { top: 8, right: 8, bottom: 16, left: 8 },
          xAxis: { type: 'category', data: chart.categories, boundaryGap: false, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false } },
          yAxis: { type: 'value', min: 0, max: max > 0 ? max : 1, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
          series: [{ type: 'line', data: chart.values, smooth: 0.32, symbol: 'none',
            lineStyle: { width: 2.2, color: '#8f4f30' },
            areaStyle: { color: 'rgba(143,79,48,0.18)' },
          }],
        }, true);
      }
      window.addEventListener('resize', onResize);
    })();
    return () => { disposed = true; window.removeEventListener('resize', onResize); chartInstance?.dispose(); };
  }, [chart]);

  return (
    <figure className={styles.inlineChart}>
      <figcaption className={styles.inlineChartTitle}>{chart.title}</figcaption>
      <div className={styles.inlineChartCanvas} ref={chartRef} />
    </figure>
  );
}

/* ── Seeded response ─────────────────────────────────────────────────────── */
function buildGreeting(): TracyMessage[] {
  return [
    { id: 'seed-user', role: 'user', text: 'What can you help me with?' },
    {
      id: 'seed-assistant', role: 'assistant',
      text: [
        'I can help you understand your agent trajectories, identify cost hotspots, debug failures, and suggest improvements.',
        'Try asking me about your latest run, cost breakdown, or why a specific step failed.',
      ].join('\n'),
      actions: [
        'Summarize my latest agent run.',
        'Which steps cost the most tokens?',
        'Show me runs that had errors this week.',
      ],
    },
  ];
}

function buildReply(query: string): Omit<TracyMessage, 'id' | 'role'> {
  const q = query.toLowerCase();
  if (q.includes('cost') || q.includes('token') || q.includes('expensive')) {
    return {
      text: 'To find your most expensive runs, go to the Dashboard and sort by Input Tokens. The runs with the highest token counts are your cost drivers. Consider routing simpler tasks to smaller models.',
      actions: ['Open Dashboard', 'Show top 5 costliest runs'],
    };
  }
  if (q.includes('error') || q.includes('fail') || q.includes('broke')) {
    return {
      text: 'Check the trace detail for any run — steps with errors are highlighted with a red border in the Execution Path view. The Detail Inspector shows the error message and improvement suggestions.',
      actions: ['Show recent errors', 'How to add retry policies'],
    };
  }
  if (q.includes('subagent') || q.includes('spawn') || q.includes('parallel')) {
    return {
      text: 'Subagent runs appear nested under their parent in the trace hierarchy. Use sessions_spawn to parallelize research tasks — each worker gets its own session and reports back via the announce phase.',
      actions: ['Show a multi-agent trace example'],
    };
  }
  return {
    text: 'I can help with cost analysis, error debugging, and agent optimization. Try asking about a specific run, cost breakdown, or failure pattern.',
    actions: ['Show my latest trajectory', 'What are my cost trends?'],
  };
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function TracyPanel() {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== 'false';
  });
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRef = useRef<BrowserSpeechRecognition | null>(null);
  const [messages, setMessages] = useState<TracyMessage[]>(buildGreeting);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(open));
    // On wide screens, shrink the body so page content pushes left
    const mq = window.matchMedia('(min-width: 901px)');
    document.body.style.transition = 'margin-right 200ms ease-out';
    const apply = () => {
      document.body.style.marginRight = open && mq.matches ? '340px' : '0';
    };
    apply();
    mq.addEventListener('change', apply);
    return () => { mq.removeEventListener('change', apply); document.body.style.marginRight = '0'; };
  }, [open]);

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
      for (let i = 0; i < event.results.length; i += 1) transcript += event.results[i][0]?.transcript ?? '';
      if (transcript.trim()) setDraft((c) => `${c}${c.trim().length ? ' ' : ''}${transcript.trim()}`);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    speechRef.current = recognition;
    return () => { recognition.stop(); speechRef.current = null; };
  }, []);

  const toggleVoice = () => {
    if (!speechRef.current) return;
    if (isListening) { speechRef.current.stop(); setIsListening(false); return; }
    speechRef.current.start(); setIsListening(true);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    if (!files.length) return;
    setAttachments((c) => [...c, ...files.map((f, i) => ({
      id: `${Date.now()}-${i}-${f.name}`, name: f.name, size: f.size, type: f.type,
    }))]);
    event.currentTarget.value = '';
  };

  const removeAttachment = (id: string) => setAttachments((c) => c.filter((a) => a.id !== id));

  const send = () => {
    const text = draft.trim();
    const attachmentNames = attachments.map((f) => f.name);
    if (!text && !attachmentNames.length) return;
    const userText = text || `Attached ${attachmentNames.length} file${attachmentNames.length > 1 ? 's' : ''}.`;
    setMessages((c) => [...c,
      { id: `user-${c.length + 1}`, role: 'user', text: userText, attachments: attachmentNames },
    ]);
    const response = buildReply(`${userText} ${attachmentNames.join(' ')}`.trim());
    setMessages((c) => [...c,
      { id: `assistant-${c.length + 1}`, role: 'assistant', text: response.text, charts: response.charts, actions: response.actions },
    ]);
    setDraft(''); setAttachments([]);
  };

  return (
    <>
      {/* Floating avatar — visible only when collapsed */}
      {!open && (
        <button type="button" className={styles.floatingAvatar} onClick={() => setOpen(true)}
          aria-label="Open Tracy" title="Ask Tracy">
          <Image src="/tracy.png" alt="Tracy" width={36} height={36} className={styles.floatingAvatarImg} />
          <span className={styles.floatingAvatarLabel}>Ask Tracy</span>
        </button>
      )}

      {/* Rail — always rendered, slides in/out */}
      <aside className={`${styles.rail} ${open ? styles.railOpen : styles.railClosed}`}>
        <div className={styles.panel}>
        {/* Handle — mirrors AppNav handle style (left edge, chevron SVG) */}
        <button type="button" className={styles.handle} onClick={() => setOpen(false)}
          aria-label="Collapse Tracy panel">
          <svg viewBox="0 0 8 14" fill="none" aria-hidden="true">
            <path d="M2 1l4 6-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIdentity}>
            <span className={styles.avatarHeader}>
              <Image src="/tracy.png" alt="Tracy" width={28} height={28} className={styles.avatarImage} />
            </span>
            <p className={styles.name}>Tracy</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={() => setOpen(false)} aria-label="Close Tracy">
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" width="14" height="14">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Transcript */}
        <div className={styles.transcript}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'assistant' ? styles.messageRowAssistant : styles.messageRowUser}`}>
              {msg.role === 'assistant' && (
                <span className={styles.avatarBubble}>
                  <Image src="/tracy.png" alt="" width={24} height={24} className={styles.avatarImage} />
                </span>
              )}
              <article className={`${styles.message} ${msg.role === 'assistant' ? styles.messageAssistant : styles.messageUser}`}>
                <p className={styles.sender}>{msg.role === 'assistant' ? 'Tracy' : 'You'}</p>
                <p className={styles.messageText}>
                  {msg.text.split('\n').map((line, i) => (
                    <Fragment key={`${msg.id}-${i}`}>
                      {parseMarkdownLinks(line)}
                      {i < msg.text.split('\n').length - 1 ? <br /> : null}
                    </Fragment>
                  ))}
                </p>
                {msg.attachments?.length ? (
                  <div className={styles.attachmentRow}>
                    {msg.attachments.map((name) => (
                      <span key={`${msg.id}-${name}`} className={styles.attachmentChip}>{name}</span>
                    ))}
                  </div>
                ) : null}
                {msg.charts?.length ? (
                  <div className={styles.chartRow}>
                    {msg.charts.map((chart) => (
                      <TracyInlineChart key={`${msg.id}-${chart.id}`} chart={chart} />
                    ))}
                  </div>
                ) : null}
                {msg.actions?.length ? (
                  <div className={styles.actionBlock}>
                    <p className={styles.actionTitle}>Suggested</p>
                    <ol className={styles.actionList}>
                      {msg.actions.map((action) => (
                        <li key={`${msg.id}-${action}`} className={styles.actionItem}>{action}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </article>
            </div>
          ))}
        </div>

        {/* Composer */}
        <footer className={styles.composer}>
          {attachments.length ? (
            <div className={styles.attachmentRow}>
              {attachments.map((file) => (
                <span key={file.id} className={styles.attachmentChip}>
                  {file.name} ({Math.max(1, Math.round(file.size / 1024))} KB)
                  <button type="button" className={styles.attachmentRemove}
                    onClick={() => removeAttachment(file.id)} aria-label={`Remove ${file.name}`}>×</button>
                </span>
              ))}
            </div>
          ) : null}
          <div className={styles.composerRow}>
            <div className={styles.inputShell}>
              <button type="button" className={styles.iconButton} onClick={openFilePicker} aria-label="Attach files">
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                  <path d="M21.44 11.05l-8.49 8.49a6 6 0 1 1-8.49-8.49l8.49-8.49a4 4 0 0 1 5.66 5.66l-8.5 8.5a2 2 0 1 1-2.82-2.83l7.78-7.78" />
                </svg>
              </button>
              <button type="button"
                className={`${styles.iconButton} ${isListening ? styles.voiceActive : ''}`}
                onClick={toggleVoice} aria-label={isListening ? 'Stop voice' : 'Start voice'} disabled={!voiceSupported}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                  <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
                  <path d="M19 11a7 7 0 0 1-14 0" /><path d="M12 18v3" /><path d="M9 21h6" />
                </svg>
              </button>
              <input type="text" className={styles.textInput} value={draft}
                onChange={(e) => setDraft(e.currentTarget.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
                placeholder="Ask Tracy …" />
            </div>
            <button type="button" className={styles.sendButton} onClick={send}>Send</button>
          </div>
          <input ref={fileInputRef} type="file" multiple onChange={onFilesSelected} className={styles.hiddenInput} />
        </footer>
      </div>
    </aside>
    </>
  );
}
