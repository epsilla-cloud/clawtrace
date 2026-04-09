'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './TracyPanel.module.css';

/* ── Types ───────────────────────────────────────────────────────────────── */
type ReasoningStep = {
  type: 'thinking' | 'tool_use' | 'tool_result' | 'error';
  text?: string;
  tool?: string;
  input?: Record<string, unknown>;
  message?: string;
};

type TracyMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  reasoning?: ReasoningStep[];
  streaming?: boolean;
};

type EChartsLike = {
  init: (dom: HTMLDivElement) => {
    setOption: (option: unknown, notMerge?: boolean) => void;
    dispose: () => void;
    resize: () => void;
  };
};

const STORAGE_KEY = 'clawtrace:tracy-expanded';
const SESSION_KEY = 'clawtrace:tracy-session';

/* ── Context extraction from URL ────────────────────────────────────────── */
function usePageContext(): {
  agentId?: string;
  traceId?: string;
  page: 'agents' | 'dashboard' | 'trajectory' | 'account' | 'billing' | 'general';
} {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);

  if (parts[0] === 'trace' && parts.length >= 3) {
    return { agentId: parts[1], traceId: parts[2], page: 'trajectory' };
  }
  if (parts[0] === 'trace' && parts.length === 2) {
    return { agentId: parts[1], page: 'dashboard' };
  }
  if (parts[0] === 'trace' && parts.length === 1) {
    return { page: 'agents' };
  }
  if (parts[0] === 'account') return { page: 'account' };
  if (parts[0] === 'billing') return { page: 'billing' };
  return { page: 'general' };
}

function getStarterQuestions(page: string): string[] {
  switch (page) {
    case 'agents':
      return [
        'How many agents do I have connected?',
        'Which agent was most recently active?',
        'Compare token usage across my agents',
      ];
    case 'dashboard':
      return [
        'Which trajectory cost the most tokens?',
        'What types of work does this agent do?',
        'Show me error trends for this agent',
      ];
    case 'trajectory':
      return [
        'What is this trajectory doing?',
        'Where is the bottleneck in this trace?',
        'How can I optimize this run?',
      ];
    case 'account':
      return [
        'How do I refer a friend?',
        'What rewards do I get for referrals?',
        'How do I update my profile?',
      ];
    case 'billing':
      return [
        'Which credit pack is the best value?',
        'How much am I spending per day?',
        'When will my credits run out?',
      ];
    default:
      return [
        'Which trace cost the most?',
        'Show me error trends',
        'How can I reduce costs?',
      ];
  }
}

/* ── ECharts renderer ───────────────────────────────────────────────────── */
function parseEChartsConfig(raw: string): unknown | null {
  // ECharts configs from Tracy may contain JS functions (e.g. formatter)
  // JSON.parse can't handle these, so use eval-based parsing
  try {
    return JSON.parse(raw);
  } catch {
    try {
      // eslint-disable-next-line no-eval
      return (0, eval)('(' + raw + ')');
    } catch {
      return null;
    }
  }
}

function InlineEChart({ config, onExpand }: { config: string; onExpand: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const dom = ref.current;
    if (!dom) return;
    let disposed = false;
    let inst: ReturnType<EChartsLike['init']> | null = null;
    const onResize = () => inst?.resize();
    void (async () => {
      const echarts = (await import('echarts')) as unknown as EChartsLike;
      if (disposed || !dom) return;
      const parsed = parseEChartsConfig(config);
      if (!parsed) return;
      inst = echarts.init(dom);
      inst.setOption(parsed, true);
      window.addEventListener('resize', onResize);
    })();
    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      inst?.dispose();
    };
  }, [config]);
  return (
    <div className={styles.echartWrap} onClick={onExpand} title="Click to expand">
      <div ref={ref} className={styles.echartCanvas} />
      <span className={styles.echartExpand}>&#x26F6;</span>
    </div>
  );
}

/* Fullscreen chart overlay */
function ChartOverlay({ config, onClose }: { config: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const dom = ref.current;
    if (!dom) return;
    let disposed = false;
    let inst: ReturnType<EChartsLike['init']> | null = null;
    const onResize = () => inst?.resize();
    void (async () => {
      const echarts = (await import('echarts')) as unknown as EChartsLike;
      if (disposed || !dom) return;
      const parsed = parseEChartsConfig(config);
      if (!parsed) return;
      inst = echarts.init(dom);
      inst.setOption(parsed, true);
      window.addEventListener('resize', onResize);
    })();
    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      inst?.dispose();
    };
  }, [config]);
  return (
    <div className={styles.chartOverlay} onClick={onClose}>
      <div className={styles.chartOverlayInner} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.chartOverlayClose} onClick={onClose}>
          &#x2715;
        </button>
        <div ref={ref} className={styles.chartOverlayCanvas} />
      </div>
    </div>
  );
}

/* ── Parse <Chart>{...}</Chart> blocks from text ────────────────────────── */
function splitChartBlocks(text: string): Array<{ type: 'text' | 'chart'; content: string }> {
  const blocks: Array<{ type: 'text' | 'chart'; content: string }> = [];
  const pattern = /<Chart>([\s\S]*?)<\/Chart>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);
  while (match) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    blocks.push({ type: 'chart', content: match[1] });
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }
  if (lastIndex < text.length) {
    blocks.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return blocks;
}

/* ── Reasoning steps — collapsible bar ──────────────────────────────────── */
function ReasoningBar({ steps, active }: { steps: ReasoningStep[]; active: boolean }) {
  const [expanded, setExpanded] = useState(false);
  // Filter out empty thinking steps
  const meaningful = steps.filter(
    (s) => !(s.type === 'thinking' && !s.text),
  );
  if (!meaningful.length && !active) return null;

  const lastStep = meaningful.length ? meaningful[meaningful.length - 1] : steps[steps.length - 1];
  const label = active
    ? lastStep?.type === 'tool_use'
      ? `Querying: ${lastStep.tool ?? 'tool'}...`
      : lastStep?.type === 'tool_result'
        ? 'Processing results...'
        : 'Thinking...'
    : `${meaningful.length} step${meaningful.length !== 1 ? 's' : ''}`;

  return (
    <div className={styles.reasoningBar}>
      <button
        type="button"
        className={styles.reasoningToggle}
        onClick={() => setExpanded((e) => !e)}
      >
        {active && <span className={styles.reasoningPulse} />}
        <span className={styles.reasoningLabel}>{label}</span>
        {meaningful.length > 0 && (
          <svg
            viewBox="0 0 10 6"
            className={`${styles.reasoningChevron} ${expanded ? styles.reasoningChevronOpen : ''}`}
          >
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {expanded && meaningful.length > 0 && (
        <div className={styles.reasoningSteps}>
          {meaningful.map((step, i) => (
            <div key={i} className={styles.reasoningStep}>
              {step.type === 'tool_use' && (
                <span className={styles.stepTool}>
                  <span className={styles.stepIcon}>&#9881;</span>
                  {step.tool}
                </span>
              )}
              {step.type === 'tool_result' && (
                <span className={styles.stepResult}>
                  <span className={styles.stepIcon}>&#10003;</span>
                  {(step.text?.length ?? 0) > 120
                    ? step.text!.slice(0, 120) + '...'
                    : step.text ?? 'Done'}
                </span>
              )}
              {step.type === 'thinking' && step.text && (
                <span className={styles.stepThinking}>{step.text}</span>
              )}
              {step.type === 'error' && (
                <span className={styles.stepError}>{step.message ?? 'Error'}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Typing animation hook ──────────────────────────────────────────────── */
function useTypingAnimation(fullText: string, streaming: boolean): string {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (streaming) {
      // While streaming, show everything immediately
      setDisplayed(fullText);
      indexRef.current = fullText.length;
      return;
    }
    if (indexRef.current >= fullText.length) {
      setDisplayed(fullText);
      return;
    }
    // Animate remaining text
    const remaining = fullText.length - indexRef.current;
    // Speed: fast for long texts, slow for short
    const charDelay = remaining > 500 ? 2 : remaining > 200 ? 5 : 10;
    // Batch size: larger for long texts
    const batchSize = remaining > 500 ? 20 : remaining > 200 ? 8 : 3;

    const timer = setInterval(() => {
      indexRef.current = Math.min(indexRef.current + batchSize, fullText.length);
      setDisplayed(fullText.slice(0, indexRef.current));
      if (indexRef.current >= fullText.length) clearInterval(timer);
    }, charDelay);
    return () => clearInterval(timer);
  }, [fullText, streaming]);

  return displayed;
}

/* ── Markdown message renderer ──────────────────────────────────────────── */
function MessageContent({
  text,
  streaming,
  onExpandChart,
}: {
  text: string;
  streaming?: boolean;
  onExpandChart: (config: string) => void;
}) {
  const displayed = useTypingAnimation(text, streaming ?? false);
  const blocks = splitChartBlocks(displayed);
  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'chart' ? (
          <InlineEChart
            key={i}
            config={block.content}
            onExpand={() => onExpandChart(block.content)}
          />
        ) : (
          <div key={i} className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
          </div>
        ),
      )}
    </>
  );
}

/* ── SSE stream handler ─────────────────────────────────────────────────── */
async function streamChat(
  message: string,
  agentId: string | undefined,
  traceId: string | undefined,
  localContext: Record<string, unknown> | undefined,
  sessionId: string | undefined,
  onEvent: (type: string, data: Record<string, unknown>) => void,
  signal: AbortSignal,
) {
  const res = await fetch('/api/tracy/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      agent_id: agentId,
      trace_id: traceId,
      local_context: localContext,
      session_id: sessionId,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    onEvent('error', { message: `HTTP ${res.status}` });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    let eventType = '';
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith('data: ') && eventType) {
        try {
          const data = JSON.parse(line.slice(6));
          onEvent(eventType, data);
        } catch { /* skip */ }
        eventType = '';
      }
    }
  }
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function TracyPanel() {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<TracyMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [harnessSessionId, setHarnessSessionId] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem(SESSION_KEY) ?? undefined;
  });
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { agentId, traceId, page } = usePageContext();
  const starters = getStarterQuestions(page);

  // Scroll to bottom
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Load previous conversation on mount
  useEffect(() => {
    if (historyLoaded) return;
    setHistoryLoaded(true);
    void (async () => {
      try {
        const sessRes = await fetch('/api/tracy/sessions?limit=1', { cache: 'no-store' });
        if (!sessRes.ok) return;
        const { sessions } = await sessRes.json();
        if (!sessions?.length) return;
        const sess = sessions[0];
        const msgRes = await fetch(`/api/tracy/sessions/${sess.id}/messages`, { cache: 'no-store' });
        if (!msgRes.ok) return;
        const { messages: dbMsgs } = await msgRes.json();
        if (!dbMsgs?.length) return;
        const loaded: TracyMessage[] = dbMsgs.map((m: Record<string, unknown>, i: number) => ({
          id: `hist-${i}`,
          role: m.role as string,
          text: m.role === 'user' ? (m.raw_message as string) : (m.response_text as string) ?? '',
          reasoning: m.reasoning_steps
            ? (typeof m.reasoning_steps === 'string'
                ? JSON.parse(m.reasoning_steps)
                : m.reasoning_steps)
            : undefined,
          streaming: false,
        }));
        setMessages(loaded);
        setHarnessSessionId(sess.harness_session_id);
        localStorage.setItem(SESSION_KEY, sess.harness_session_id);
      } catch { /* ignore */ }
    })();
  }, [historyLoaded]);

  // Panel open/close margin management
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(open));
    const mq = window.matchMedia('(min-width: 901px)');
    document.body.style.transition = 'margin-right 200ms ease-out';
    const apply = () => {
      document.body.style.marginRight = open && mq.matches ? '510px' : '0';
    };
    apply();
    mq.addEventListener('change', apply);
    return () => { mq.removeEventListener('change', apply); document.body.style.marginRight = '0'; };
  }, [open]);

  const clearConversation = useCallback(async () => {
    // Soft-delete ALL sessions so none reload on refresh
    try {
      const sessRes = await fetch('/api/tracy/sessions?limit=100', { cache: 'no-store' });
      if (sessRes.ok) {
        const { sessions } = await sessRes.json();
        if (sessions?.length) {
          await Promise.all(
            sessions.map((s: { id: string }) =>
              fetch(`/api/tracy/sessions/${s.id}`, { method: 'DELETE' }),
            ),
          );
        }
      }
    } catch { /* best-effort */ }
    setMessages([]);
    setHarnessSessionId(undefined);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading) return;
    setDraft('');
    setLoading(true);

    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;

    setMessages((prev) => [...prev, { id: userId, role: 'user', text }]);
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', text: '', reasoning: [], streaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(
        text, agentId, traceId, undefined, harnessSessionId,
        (type, data) => {
          if (type === 'session') {
            const sid = data.session_id as string;
            setHarnessSessionId(sid);
            localStorage.setItem(SESSION_KEY, sid);
          } else if (type === 'text' || type === 'text_delta') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, text: m.text + (data.text as string) } : m,
              ),
            );
          } else if (type === 'tool_use' || type === 'tool_result' || type === 'thinking') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, reasoning: [...(m.reasoning ?? []), data as ReasoningStep] }
                  : m,
              ),
            );
          } else if (type === 'error') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, text: m.text || `Error: ${data.message ?? 'Unknown error'}`, streaming: false }
                  : m,
              ),
            );
          } else if (type === 'done') {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
            );
          }
        },
        controller.signal,
      );
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, text: m.text || 'Connection error. Please try again.', streaming: false }
              : m,
          ),
        );
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId && m.streaming ? { ...m, streaming: false } : m)),
      );
    }
  }, [draft, loading, agentId, traceId, harnessSessionId]);

  return (
    <>
      {!open && (
        <button type="button" className={styles.floatingAvatar} onClick={() => setOpen(true)}
          aria-label="Open Tracy" title="Ask Tracy">
          <Image src="/tracy.png" alt="Tracy" width={36} height={36} className={styles.floatingAvatarImg} />
          <span className={styles.floatingAvatarLabel}>Ask Tracy</span>
        </button>
      )}

      <aside className={`${styles.rail} ${open ? styles.railOpen : styles.railClosed}`}>
        <div className={styles.panel}>
          <button type="button" className={styles.handle} onClick={() => setOpen(false)}
            aria-label="Collapse Tracy panel">
            <svg viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M2 1l4 6-4 6" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <header className={styles.header}>
            <div className={styles.headerIdentity}>
              <span className={styles.avatarHeader}>
                <Image src="/tracy.png" alt="Tracy" width={28} height={28} className={styles.avatarImage} />
              </span>
              <p className={styles.name}>Tracy</p>
              <span className={styles.subtitle}>Your OpenClaw Doctor Agent</span>
            </div>
            <div className={styles.headerActions}>
              {messages.length > 0 && (
                <button type="button" className={styles.clearButton} onClick={() => void clearConversation()}
                  aria-label="Clear conversation" title="New conversation">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor"
                    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4h12M5.3 4V2.7a1.3 1.3 0 011.4-1.4h2.6a1.3 1.3 0 011.4 1.4V4M13 4v9.3a1.3 1.3 0 01-1.3 1.4H4.3A1.3 1.3 0 013 13.3V4" />
                  </svg>
                </button>
              )}
              <button type="button" className={styles.closeButton} onClick={() => setOpen(false)}
                aria-label="Close Tracy">
                <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" width="14" height="14">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          <div className={styles.transcript} ref={transcriptRef}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <Image src="/tracy.png" alt="" width={48} height={48} className={styles.emptyAvatar} />
                <p className={styles.emptyTitle}>Hi, I'm Tracy</p>
                <p className={styles.emptyDesc}>
                  Your OpenClaw Doctor Agent. I can analyze your agent trajectories,
                  find cost hotspots, debug failures, and suggest improvements.
                </p>
                <div className={styles.emptyActions}>
                  {starters.map((q) => (
                    <button key={q} type="button" className={styles.emptyAction}
                      onClick={() => { setDraft(q); }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id}
                className={`${styles.messageRow} ${msg.role === 'assistant' ? styles.messageRowAssistant : styles.messageRowUser}`}>
                {msg.role === 'assistant' && (
                  <span className={styles.avatarBubble}>
                    <Image src="/tracy.png" alt="" width={24} height={24} className={styles.avatarImage} />
                  </span>
                )}
                <article className={`${styles.message} ${msg.role === 'assistant' ? styles.messageAssistant : styles.messageUser}`}>
                  {msg.role === 'user' ? (
                    <p className={styles.messageText}>{msg.text}</p>
                  ) : (
                    <>
                      {(msg.reasoning?.length ?? 0) > 0 && (
                        <ReasoningBar steps={msg.reasoning!} active={msg.streaming ?? false} />
                      )}
                      {msg.text ? (
                        <MessageContent text={msg.text} streaming={msg.streaming}
                          onExpandChart={setExpandedChart} />
                      ) : msg.streaming ? (
                        <span className={styles.streamingCursor} />
                      ) : null}
                    </>
                  )}
                </article>
              </div>
            ))}
          </div>

          <footer className={styles.composer}>
            <div className={styles.composerRow}>
              <div className={styles.inputShell}>
                <input type="text" className={styles.textInput} value={draft}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.currentTarget.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void send(); } }}
                  placeholder="Ask Tracy..." disabled={loading} />
              </div>
              <button type="button" className={styles.sendButton} onClick={() => void send()}
                disabled={loading || !draft.trim()}>
                {loading ? <span className={styles.sendSpinner} /> : 'Send'}
              </button>
            </div>
          </footer>
        </div>
      </aside>

      {expandedChart && (
        <ChartOverlay config={expandedChart} onClose={() => setExpandedChart(null)} />
      )}
    </>
  );
}
