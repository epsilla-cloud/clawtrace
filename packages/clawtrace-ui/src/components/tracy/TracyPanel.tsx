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

/* ── Context extraction from URL ────────────────────────────────────────── */
function usePageContext(): { agentId?: string; traceId?: string; pageData?: Record<string, unknown> } {
  const pathname = usePathname();
  // /trace/[agentId] → agent dashboard
  // /trace/[agentId]/[trajectoryId] → trace detail
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'trace' && parts.length >= 3) {
    return { agentId: parts[1], traceId: parts[2] };
  }
  if (parts[0] === 'trace' && parts.length === 2) {
    return { agentId: parts[1] };
  }
  return {};
}

/* ── ECharts renderer for <Chart> blocks ────────────────────────────────── */
function InlineEChart({ config }: { config: string }) {
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
      try {
        inst = echarts.init(dom);
        inst.setOption(JSON.parse(config), true);
        window.addEventListener('resize', onResize);
      } catch { /* ignore bad config */ }
    })();
    return () => { disposed = true; window.removeEventListener('resize', onResize); inst?.dispose(); };
  }, [config]);
  return <div ref={ref} className={styles.echartCanvas} />;
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
  if (!steps.length) return null;

  const lastStep = steps[steps.length - 1];
  const label = active
    ? lastStep.type === 'tool_use'
      ? `Querying: ${lastStep.tool ?? 'tool'}...`
      : lastStep.type === 'tool_result'
        ? 'Processing results...'
        : lastStep.type === 'thinking'
          ? 'Thinking...'
          : 'Working...'
    : `${steps.length} step${steps.length > 1 ? 's' : ''}`;

  return (
    <div className={styles.reasoningBar}>
      <button
        type="button"
        className={styles.reasoningToggle}
        onClick={() => setExpanded((e) => !e)}
      >
        {active && <span className={styles.reasoningPulse} />}
        <span className={styles.reasoningLabel}>{label}</span>
        <svg
          viewBox="0 0 10 6"
          className={`${styles.reasoningChevron} ${expanded ? styles.reasoningChevronOpen : ''}`}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {expanded && (
        <div className={styles.reasoningSteps}>
          {steps.map((step, i) => (
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

/* ── Markdown message renderer ──────────────────────────────────────────── */
function MessageContent({ text }: { text: string }) {
  const blocks = splitChartBlocks(text);
  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'chart' ? (
          <InlineEChart key={i} config={block.content} />
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
  const [harnessSessionId, setHarnessSessionId] = useState<string | undefined>();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { agentId, traceId } = usePageContext();

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(open));
    const mq = window.matchMedia('(min-width: 901px)');
    document.body.style.transition = 'margin-right 200ms ease-out';
    const apply = () => {
      document.body.style.marginRight = open && mq.matches ? '340px' : '0';
    };
    apply();
    mq.addEventListener('change', apply);
    return () => { mq.removeEventListener('change', apply); document.body.style.marginRight = '0'; };
  }, [open]);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading) return;
    setDraft('');
    setLoading(true);

    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;

    // Add user message
    setMessages((prev) => [...prev, { id: userId, role: 'user', text }]);

    // Add empty streaming assistant message
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', text: '', reasoning: [], streaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(
        text,
        agentId,
        traceId,
        undefined,
        harnessSessionId,
        (type, data) => {
          if (type === 'session') {
            setHarnessSessionId(data.session_id as string);
          } else if (type === 'text') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, text: m.text + (data.text as string) }
                  : m,
              ),
            );
          } else if (type === 'text_delta') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, text: m.text + (data.text as string) }
                  : m,
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
                  ? {
                      ...m,
                      text: m.text || `Error: ${data.message ?? 'Unknown error'}`,
                      streaming: false,
                    }
                  : m,
              ),
            );
          } else if (type === 'done') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, streaming: false } : m,
              ),
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
      // Mark as done in case stream ended without 'done' event
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && m.streaming ? { ...m, streaming: false } : m,
        ),
      );
    }
  }, [draft, loading, agentId, traceId, harnessSessionId]);

  return (
    <>
      {/* Floating avatar — visible only when collapsed */}
      {!open && (
        <button
          type="button"
          className={styles.floatingAvatar}
          onClick={() => setOpen(true)}
          aria-label="Open Tracy"
          title="Ask Tracy"
        >
          <Image src="/tracy.png" alt="Tracy" width={36} height={36} className={styles.floatingAvatarImg} />
          <span className={styles.floatingAvatarLabel}>Ask Tracy</span>
        </button>
      )}

      {/* Rail — always rendered, slides in/out */}
      <aside className={`${styles.rail} ${open ? styles.railOpen : styles.railClosed}`}>
        <div className={styles.panel}>
          {/* Handle */}
          <button
            type="button"
            className={styles.handle}
            onClick={() => setOpen(false)}
            aria-label="Collapse Tracy panel"
          >
            <svg viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M2 1l4 6-4 6" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
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
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              aria-label="Close Tracy"
            >
              <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" width="14" height="14">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          {/* Transcript */}
          <div className={styles.transcript} ref={transcriptRef}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <Image src="/tracy.png" alt="" width={48} height={48} className={styles.emptyAvatar} />
                <p className={styles.emptyTitle}>Hi, I'm Tracy</p>
                <p className={styles.emptyDesc}>
                  I can help you understand your agent trajectories, find cost hotspots,
                  debug failures, and suggest improvements.
                </p>
                <div className={styles.emptyActions}>
                  {['Which trace cost the most?', 'Show error trends', 'How to reduce costs?'].map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={styles.emptyAction}
                      onClick={() => { setDraft(q); }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.role === 'assistant' ? styles.messageRowAssistant : styles.messageRowUser
                }`}
              >
                {msg.role === 'assistant' && (
                  <span className={styles.avatarBubble}>
                    <Image src="/tracy.png" alt="" width={24} height={24} className={styles.avatarImage} />
                  </span>
                )}
                <article
                  className={`${styles.message} ${
                    msg.role === 'assistant' ? styles.messageAssistant : styles.messageUser
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className={styles.messageText}>{msg.text}</p>
                  ) : (
                    <>
                      {/* Reasoning steps */}
                      {(msg.reasoning?.length ?? 0) > 0 && (
                        <ReasoningBar
                          steps={msg.reasoning!}
                          active={msg.streaming ?? false}
                        />
                      )}
                      {/* Response text */}
                      {msg.text ? (
                        <MessageContent text={msg.text} />
                      ) : msg.streaming ? (
                        <span className={styles.streamingCursor} />
                      ) : null}
                    </>
                  )}
                </article>
              </div>
            ))}
          </div>

          {/* Composer */}
          <footer className={styles.composer}>
            <div className={styles.composerRow}>
              <div className={styles.inputShell}>
                <input
                  type="text"
                  className={styles.textInput}
                  value={draft}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder="Ask Tracy..."
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                className={styles.sendButton}
                onClick={() => void send()}
                disabled={loading || !draft.trim()}
              >
                {loading ? (
                  <span className={styles.sendSpinner} />
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </footer>
        </div>
      </aside>
    </>
  );
}
