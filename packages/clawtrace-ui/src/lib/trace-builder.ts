/**
 * trace-builder.ts
 *
 * Pure client-safe functions that build a TraceDetailSnapshot from raw
 * backend API data.  No Node.js imports — safe to use in 'use client' code.
 */
import type {
  TraceDetailPhase,
  TraceDetailPhaseStatus,
  TraceDetailSnapshot,
  TraceDetailSpan,
  TraceDetailSpanKind,
  TraceDetailWaterfallRow,
} from './trace-detail';

/* ── Backend wire types (matching TraceDetailResponse from backend) ────────── */
export type BackendSpanData = {
  span_id: string;
  parent_span_id?: string | null;
  actor_type: string;
  actor_label: string;
  span_start_ts_ms?: number | null;
  span_end_ts_ms?: number | null;
  duration_ms?: number;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  has_error?: number;
  input_payload?: string | null;
  output_payload?: string | null;
};

export type BackendMetaData = {
  trace_id: string;
  agent_id?: string | null;
  trace_start_ts_ms?: number | null;
  trace_end_ts_ms?: number | null;
  duration_ms?: number;
  event_count?: number;
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function toNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Extract plain UUID from PuppyGraph elementId format "Label[uuid]". */
function extractUuid(elementId: string): string {
  const m = elementId.match(/\[(.+)\]/);
  return m ? m[1] : elementId;
}

/* ── Cost pricing table (USD per 1M tokens, updated April 2026) ──────────── */
type ModelPrice = {
  pattern: RegExp;
  input: number;         // fresh input tokens
  output: number;        // output tokens
  cacheRead?: number;    // cached input tokens (typically ~10% of input)
  cacheWrite?: number;   // cache write tokens (some providers charge extra)
};

const MODEL_PRICING: ModelPrice[] = [
  // ── Anthropic Claude ──────────────────────────────────────────────────
  { pattern: /claude.*opus.*4\.[56]/i,   input: 5.0,    output: 25.0,   cacheRead: 0.50,  cacheWrite: 6.25  },
  { pattern: /claude.*opus.*4\.[01]/i,   input: 15.0,   output: 75.0,   cacheRead: 1.50,  cacheWrite: 18.75 },
  { pattern: /claude.*opus/i,            input: 15.0,   output: 75.0,   cacheRead: 1.50,  cacheWrite: 18.75 },
  { pattern: /claude.*sonnet/i,          input: 3.0,    output: 15.0,   cacheRead: 0.30,  cacheWrite: 3.75  },
  { pattern: /claude.*haiku.*4/i,        input: 1.0,    output: 5.0,    cacheRead: 0.10,  cacheWrite: 1.25  },
  { pattern: /claude.*haiku.*3\.5/i,     input: 0.80,   output: 4.0,    cacheRead: 0.08,  cacheWrite: 1.00  },
  { pattern: /claude.*haiku/i,           input: 0.25,   output: 1.25,   cacheRead: 0.03,  cacheWrite: 0.30  },

  // ── OpenAI GPT-5.x ───────────────────────────────────────────────────
  { pattern: /gpt-5\.4-nano/i,          input: 0.20,   output: 1.25,   cacheRead: 0.02   },
  { pattern: /gpt-5\.4-mini/i,          input: 0.75,   output: 4.50,   cacheRead: 0.075  },
  { pattern: /gpt-5\.4/i,               input: 2.50,   output: 15.0,   cacheRead: 0.25   },
  { pattern: /gpt-5\.3/i,               input: 1.75,   output: 14.0,   cacheRead: 0.175  },
  { pattern: /gpt-5\.2/i,               input: 1.75,   output: 14.0,   cacheRead: 0.175  },
  { pattern: /gpt-5-mini/i,             input: 0.25,   output: 2.0,    cacheRead: 0.025  },
  { pattern: /gpt-5/i,                  input: 1.25,   output: 10.0,   cacheRead: 0.125  },

  // ── OpenAI GPT-4.x ───────────────────────────────────────────────────
  { pattern: /gpt-4\.1-nano/i,          input: 0.10,   output: 0.40,   cacheRead: 0.025  },
  { pattern: /gpt-4\.1-mini/i,          input: 0.40,   output: 1.60,   cacheRead: 0.10   },
  { pattern: /gpt-4\.1(?!-)/i,          input: 2.0,    output: 8.0,    cacheRead: 0.50   },
  { pattern: /gpt-4o-mini/i,            input: 0.15,   output: 0.60,   cacheRead: 0.075  },
  { pattern: /gpt-4o/i,                 input: 2.50,   output: 10.0,   cacheRead: 1.25   },
  { pattern: /gpt-4-turbo/i,            input: 10.0,   output: 30.0                      },
  { pattern: /gpt-4/i,                  input: 30.0,   output: 60.0                      },
  { pattern: /gpt-3\.5/i,               input: 0.50,   output: 1.50                      },

  // ── OpenAI reasoning models ───────────────────────────────────────────
  { pattern: /o4-mini/i,                 input: 1.10,   output: 4.40,   cacheRead: 0.275  },
  { pattern: /o3-mini/i,                 input: 1.10,   output: 4.40,   cacheRead: 0.55   },
  { pattern: /o3(?!-mini)/i,             input: 2.0,    output: 8.0,    cacheRead: 0.50   },
  { pattern: /o1-mini/i,                 input: 1.10,   output: 4.40,   cacheRead: 0.55   },
  { pattern: /o1(?!-mini)/i,             input: 15.0,   output: 60.0,   cacheRead: 7.50   },

  // ── Google Gemini ─────────────────────────────────────────────────────
  { pattern: /gemini.*3\.1.*pro/i,       input: 2.0,    output: 12.0,   cacheRead: 0.20   },
  { pattern: /gemini.*3.*flash.*lite/i,  input: 0.25,   output: 1.50,   cacheRead: 0.025  },
  { pattern: /gemini.*3.*flash/i,        input: 0.50,   output: 3.0,    cacheRead: 0.05   },
  { pattern: /gemini.*2\.5.*pro/i,       input: 1.25,   output: 10.0,   cacheRead: 0.125  },
  { pattern: /gemini.*2\.5.*flash/i,     input: 0.30,   output: 2.50,   cacheRead: 0.03   },
  { pattern: /gemini.*2\.0.*flash/i,     input: 0.10,   output: 0.40                      },
  { pattern: /gemini.*1\.5.*pro/i,       input: 1.25,   output: 5.0,    cacheRead: 0.3125 },
  { pattern: /gemini.*1\.5.*flash/i,     input: 0.075,  output: 0.30,   cacheRead: 0.01875 },
  { pattern: /gemini.*flash/i,           input: 0.30,   output: 2.50                      },
  { pattern: /gemini.*pro/i,             input: 1.25,   output: 10.0                      },

  // ── DeepSeek ──────────────────────────────────────────────────────────
  { pattern: /deepseek.*r1|deepseek.*reasoner/i, input: 0.28, output: 0.42, cacheRead: 0.028 },
  { pattern: /deepseek/i,               input: 0.28,   output: 0.42,   cacheRead: 0.028  },

  // ── Mistral ───────────────────────────────────────────────────────────
  { pattern: /mistral.*large/i,          input: 2.0,    output: 6.0,    cacheRead: 0.20   },
  { pattern: /mistral.*medium/i,         input: 2.75,   output: 8.10                      },
  { pattern: /mistral.*small/i,          input: 0.20,   output: 0.60                      },
  { pattern: /codestral/i,              input: 0.30,   output: 0.90                      },

  // ── Alibaba Qwen ──────────────────────────────────────────────────────
  { pattern: /qwen.*3.*max/i,            input: 0.78,   output: 3.90                      },
  { pattern: /qwen.*3\.6.*plus/i,        input: 0.325,  output: 1.95                      },
  { pattern: /qwen.*3\.5.*flash/i,       input: 0.065,  output: 0.26                      },
  { pattern: /qwen.*3\.5.*9b/i,          input: 0.05,   output: 0.15                      },
  { pattern: /qwen.*3\.5/i,              input: 0.26,   output: 1.56                      },
  { pattern: /qwen.*coder/i,             input: 0.12,   output: 0.75,   cacheRead: 0.06   },
  { pattern: /qwen/i,                    input: 0.325,  output: 1.95                      },

  // ── Zhipu GLM ─────────────────────────────────────────────────────────
  { pattern: /glm.*5\.1/i,              input: 1.26,   output: 3.96                      },
  { pattern: /glm.*5.*turbo/i,          input: 1.20,   output: 4.0,    cacheRead: 0.24   },
  { pattern: /glm.*5/i,                 input: 0.72,   output: 2.30                      },
  { pattern: /glm.*4\.7.*flash/i,       input: 0.06,   output: 0.40                      },
  { pattern: /glm.*4/i,                 input: 0.39,   output: 1.75                      },
  { pattern: /glm/i,                    input: 0.72,   output: 2.30                      },

  // ── Moonshot Kimi ─────────────────────────────────────────────────────
  { pattern: /kimi.*k2\.5/i,            input: 0.383,  output: 1.72,   cacheRead: 0.19   },
  { pattern: /kimi.*turbo/i,            input: 1.11,   output: 8.06                      },
  { pattern: /kimi/i,                   input: 0.56,   output: 2.22,   cacheRead: 0.14   },

  // ── Baidu ERNIE ───────────────────────────────────────────────────────
  { pattern: /ernie.*5/i,               input: 0.83,   output: 3.33                      },
  { pattern: /ernie.*4\.5.*turbo/i,     input: 0.11,   output: 0.44                      },
  { pattern: /ernie.*4/i,               input: 0.56,   output: 2.22                      },
  { pattern: /ernie/i,                  input: 0.56,   output: 2.22                      },

  // ── MiniMax ───────────────────────────────────────────────────────────
  { pattern: /minimax.*m2\.[567]/i,     input: 0.30,   output: 1.20,   cacheRead: 0.06   },
  { pattern: /minimax/i,                input: 0.29,   output: 0.95                      },

  // ── Open source / Groq hosted ─────────────────────────────────────────
  { pattern: /llama.*4.*scout/i,         input: 0.11,   output: 0.34                      },
  { pattern: /llama.*3\.3.*70b/i,        input: 0.59,   output: 0.79                      },
  { pattern: /llama.*3\.1.*405b/i,       input: 3.50,   output: 3.50                      },
  { pattern: /llama.*3\.1.*70b/i,        input: 0.59,   output: 0.79                      },
  { pattern: /llama.*3\.1.*8b/i,         input: 0.05,   output: 0.08                      },
  { pattern: /llama/i,                   input: 0.59,   output: 0.79                      },
  { pattern: /mixtral/i,                 input: 0.24,   output: 0.24                      },
  { pattern: /stepfun|step-/i,           input: 0.10,   output: 0.30                      },
];
const FALLBACK_PRICING: ModelPrice = { pattern: /.*/, input: 3.0, output: 10.0, cacheRead: 0.30 };

export function estimateSpanCost(
  model: string | null,
  tokensIn: number,
  tokensOut: number,
  cacheReadTokens = 0,
  cacheWriteTokens = 0,
): number {
  if (!model || (tokensIn <= 0 && tokensOut <= 0 && cacheReadTokens <= 0)) return 0;
  const pricing =
    MODEL_PRICING.find((p) => p.pattern.test(model)) ?? FALLBACK_PRICING;

  // Fresh input tokens = total input minus cache reads (they're cheaper)
  const freshIn = Math.max(0, tokensIn - cacheReadTokens);
  const cacheReadCost = cacheReadTokens * (pricing.cacheRead ?? pricing.input * 0.1);
  const cacheWriteCost = cacheWriteTokens * (pricing.cacheWrite ?? pricing.input);
  const freshInCost = freshIn * pricing.input;
  const outCost = tokensOut * pricing.output;

  return (freshInCost + cacheReadCost + cacheWriteCost + outCost) / 1_000_000;
}

/* ── Span mapping ────────────────────────────────────────────────────────── */

/**
 * Map the silver-table actor_type to TraceDetailSpanKind.
 * Silver table emits exactly: 'llm_call' | 'tool_call' | 'subagent' | 'session'.
 */
function resolveKind(actorType: string): TraceDetailSpanKind {
  switch (actorType) {
    case 'llm_call':  return 'llm_call';
    case 'tool_call': return 'tool_call';
    case 'subagent':  return 'subagent';
    default:          return 'session';
  }
}

function mapBackendSpan(traceUuid: string, s: BackendSpanData): TraceDetailSpan {
  const spanId = extractUuid(s.span_id);
  const parentSpanId = s.parent_span_id ? extractUuid(s.parent_span_id) : null;
  const kind = resolveKind(s.actor_type);
  const startMs = toNum(s.span_start_ts_ms);
  const endMs = s.span_end_ts_ms != null ? toNum(s.span_end_ts_ms) : null;
  const durMs = toNum(s.duration_ms) > 0 ? toNum(s.duration_ms) : null;
  const resolvedEndMs = endMs ?? (durMs ? startMs + durMs : startMs);
  const resolvedDurationMs = Math.max(0, durMs ?? (resolvedEndMs - startMs));
  const label = s.actor_label ?? '';

  // Parse input/output payloads for detail inspection
  let inputPayload: Record<string, unknown> = {};
  let outputPayload: Record<string, unknown> = {};
  if (s.input_payload) {
    try { inputPayload = JSON.parse(s.input_payload) as Record<string, unknown>; } catch { /* ignore */ }
  }
  if (s.output_payload) {
    try { outputPayload = JSON.parse(s.output_payload) as Record<string, unknown>; } catch { /* ignore */ }
  }

  return {
    traceId: traceUuid,
    spanId,
    parentSpanId,
    kind,
    name: label || kind,
    agentId: (kind === 'session' || kind === 'subagent') ? (label !== 'session' ? label : null) : null,
    // Session key for session spans; derived for others in deriveSessionKeys()
    sessionKey: (kind === 'session' || kind === 'subagent') ? (label !== 'session' ? label : spanId) : null,
    startMs,
    endMs,
    durationMs: durMs,
    resolvedEndMs,
    resolvedDurationMs,
    toolName: kind === 'tool_call' ? (label || null) : null,
    toolParams: (inputPayload.params ?? outputPayload.params) as Record<string, unknown> | null ?? null,
    childSessionKey: kind === 'subagent' ? (label !== 'session' ? label : spanId) : null,
    childAgentId: kind === 'subagent' ? (label !== 'session' ? label : spanId) : null,
    provider: (outputPayload.provider ?? inputPayload.provider) as string ?? null,
    model: kind === 'llm_call' ? (label || (outputPayload.model ?? inputPayload.model) as string || null) : null,
    tokensIn: toNum(s.input_tokens),
    tokensOut: toNum(s.output_tokens),
    totalTokens: toNum(s.total_tokens),
    attributes: {
      has_error: s.has_error ?? 0,
      // Input (from before-call payload)
      prompt: inputPayload.prompt ?? undefined,
      systemPrompt: inputPayload.systemPrompt ?? undefined,
      // Output (from after-call payload)
      result: outputPayload.result ?? undefined,
      output: outputPayload.assistantTexts ?? outputPayload.outcome ?? undefined,
      response: outputPayload.lastAssistant ?? undefined,
      error: outputPayload.error ?? undefined,
      usage: outputPayload.usage ?? undefined,
    },
    sourceCount: 1,
    hasClosedRecord: endMs !== null,
  };
}

/**
 * Walk each non-session span up its parent chain to find the nearest session
 * ancestor and copy its sessionKey down.  This enables ExecutionPathView and
 * ActorMapView to group spans correctly.
 */
function deriveSessionKeys(spans: TraceDetailSpan[]): TraceDetailSpan[] {
  const byId = new Map(spans.map((s) => [s.spanId, s]));

  function findSessionKey(span: TraceDetailSpan, seen: Set<string>): string | null {
    if (span.kind === 'session') return span.sessionKey;
    if (seen.has(span.spanId)) return null;
    seen.add(span.spanId);
    const parent = span.parentSpanId ? byId.get(span.parentSpanId) : null;
    if (!parent) return null;
    if (parent.kind === 'session') return parent.sessionKey;
    return findSessionKey(parent, seen);
  }

  return spans.map((span) => {
    if (span.kind === 'session') return span;
    const sessionKey = findSessionKey(span, new Set());
    return sessionKey ? { ...span, sessionKey } : span;
  });
}

/* ── Timing finalisation (mirrors trace-detail.ts) ──────────────────────── */
function finalizeResolvedTiming(
  spans: TraceDetailSpan[],
  windowStartMs: number,
  windowEndMs: number,
): TraceDetailSpan[] {
  const sorted = [...spans].sort((a, b) => a.startMs - b.startMs);

  return sorted.map((span, index) => {
    const explicitEndMs = span.endMs;
    const nextStartMs = sorted
      .slice(index + 1)
      .map((c) => c.startMs)
      .find((s) => s >= span.startMs);

    const fallbackEnd =
      nextStartMs && nextStartMs > span.startMs
        ? nextStartMs
        : windowEndMs > span.startMs
          ? windowEndMs
          : span.startMs;

    const resolvedEndMs = Math.max(span.startMs, explicitEndMs ?? fallbackEnd);

    return {
      ...span,
      resolvedEndMs,
      resolvedDurationMs: Math.max(
        0,
        span.durationMs ?? (resolvedEndMs - span.startMs),
      ),
    };
  });
}

/* ── Waterfall rows ──────────────────────────────────────────────────────── */
function createWaterfallRows(
  spans: TraceDetailSpan[],
  windowStartMs: number,
): TraceDetailWaterfallRow[] {
  return spans
    .slice()
    .sort((a, b) => a.startMs - b.startMs)
    .map((span) => {
      const shortModel = span.model
        ? span.model.replace(/\s+/g, ' ').slice(0, 28)
        : null;
      const label =
        span.kind === 'llm_call'
          ? `model step · ${shortModel ?? 'unknown model'}`
          : span.kind === 'tool_call'
            ? `tool action · ${span.toolName ?? span.name}`
            : span.kind === 'subagent'
              ? `subagent · ${span.childAgentId ?? span.childSessionKey ?? 'delegated'}`
              : `session · ${span.agentId ?? span.sessionKey ?? span.name}`;

      return {
        spanId: span.spanId,
        label,
        kind: span.kind,
        startOffsetMs: Math.max(0, span.startMs - windowStartMs),
        durationMs: Math.max(1, span.resolvedDurationMs),
        totalTokens: span.totalTokens,
      };
    });
}

/* ── Work-index / phases ─────────────────────────────────────────────────── */
function derivePhaseStatus(score: number): {
  status: TraceDetailPhaseStatus;
  label: string;
} {
  if (score === 0) return { status: 'idle', label: 'Idle' };
  if (score <= 25)
    return { status: 'high_spend_low_progress', label: 'High spend, low progress' };
  if (score <= 60) return { status: 'active_heavy', label: 'Active but heavy' };
  return { status: 'efficient', label: 'Efficient' };
}

function createWorkIndex(
  spans: TraceDetailSpan[],
  windowStartMs: number,
  windowEndMs: number,
): { averageScore: number; phases: TraceDetailPhase[] } {
  if (!spans.length || windowEndMs <= windowStartMs) {
    return { averageScore: 0, phases: [] };
  }

  const totalDurationMs = Math.max(1, windowEndMs - windowStartMs);
  const phaseWindowMs = Math.max(5000, totalDurationMs / 10);
  const phases: TraceDetailPhase[] = [];
  let cursor = windowStartMs;
  let phaseIndex = 0;

  while (cursor < windowEndMs) {
    const nextCursor = Math.min(windowEndMs, cursor + phaseWindowMs);
    const inPhase = spans.filter(
      (s) => s.startMs < nextCursor && s.resolvedEndMs > cursor,
    );

    const llmCalls = inPhase.filter((s) => s.kind === 'llm_call').length;
    const toolCalls = inPhase.filter((s) => s.kind === 'tool_call').length;
    const tokens = inPhase.reduce((sum, s) => sum + s.totalTokens, 0);
    const subagentSpawns = inPhase.filter((s) => s.kind === 'subagent').length;
    const toolDensity = toolCalls / Math.max(llmCalls, 1);
    const tokenEfficiency = toolCalls / Math.max(tokens / 1000, 0.1);

    let score = 0;
    if (llmCalls > 0 || toolCalls > 0) {
      score = Math.min(
        100,
        Math.round(
          (Math.min(toolDensity, 5) / 5) * 50 +
            (Math.min(tokenEfficiency, 3) / 3) * 30 +
            (subagentSpawns > 0 ? 20 : 0),
        ),
      );
      if (llmCalls > 0 && toolCalls === 0) score = Math.min(score, 15);
    }

    const phaseStatus = derivePhaseStatus(score);
    const phaseSpansSorted = inPhase
      .slice()
      .sort(
        (a, b) =>
          b.totalTokens - a.totalTokens ||
          b.resolvedDurationMs - a.resolvedDurationMs,
      );

    phases.push({
      id: `phase-${phaseIndex}`,
      startMs: cursor,
      endMs: nextCursor,
      llmCalls,
      toolCalls,
      tokens,
      subagentSpawns,
      toolDensity,
      tokenEfficiency,
      score,
      status: phaseStatus.status,
      statusLabel: phaseStatus.label,
      representativeSpanId: phaseSpansSorted[0]?.spanId ?? null,
    });

    cursor = nextCursor;
    phaseIndex += 1;
  }

  const averageScore = phases.length
    ? Math.round(phases.reduce((sum, p) => sum + p.score, 0) / phases.length)
    : 0;

  return { averageScore, phases };
}

/* ── Quick insights ──────────────────────────────────────────────────────── */
function createQuickInsights(
  spans: TraceDetailSpan[],
): TraceDetailSnapshot['quickInsights'] {
  if (!spans.length) {
    return {
      hottestSpanId: null,
      longestSpanId: null,
      likelyIssue: 'No spans captured for this run.',
      nextActions: [
        'Confirm tracing is enabled and rerun once to collect baseline evidence.',
      ],
    };
  }

  const hottestSpan = spans
    .slice()
    .sort(
      (a, b) =>
        b.totalTokens - a.totalTokens ||
        b.resolvedDurationMs - a.resolvedDurationMs,
    )[0]!;

  const longestSpan = spans
    .slice()
    .sort((a, b) => b.resolvedDurationMs - a.resolvedDurationMs)[0]!;

  const nextActions: string[] = [];

  if (
    (hottestSpan.kind === 'llm_call' && hottestSpan.totalTokens > 150_000) ||
    hottestSpan.tokensIn > 120_000
  ) {
    nextActions.push(
      'Trim always-loaded context and route routine steps to a smaller model tier.',
    );
  }

  if (longestSpan.kind === 'tool_call' && longestSpan.resolvedDurationMs > 15_000) {
    nextActions.push(
      'Add tool timeout + retry policy guard on the slowest tool action.',
    );
  }

  if (
    spans.some(
      (s) =>
        typeof s.attributes.error === 'string' ||
        Number(s.attributes.has_error) > 0,
    )
  ) {
    nextActions.push(
      'Capture failing params/result pair and pin a deterministic verifier before rerun.',
    );
  }

  if (!nextActions.length) {
    nextActions.push(
      'Promote this run into a quality baseline and watch drift against next 7 days of runs.',
    );
  }

  const likelyIssue =
    hottestSpan.kind === 'llm_call'
      ? 'Most pressure is concentrated in one high-token model step.'
      : hottestSpan.kind === 'tool_call'
        ? 'Most pressure is concentrated in one repeated or expensive tool action.'
        : 'Run pressure is distributed; focus on span-level verification for this path.';

  return {
    hottestSpanId: hottestSpan.spanId,
    longestSpanId: longestSpan.spanId,
    likelyIssue,
    nextActions: nextActions.slice(0, 3),
  };
}

/* ── Main builder ────────────────────────────────────────────────────────── */
export function buildSnapshot(
  traceUuid: string,
  meta: BackendMetaData,
  backendSpans: BackendSpanData[],
): TraceDetailSnapshot {
  // 1. Map raw backend spans
  const rawSpans = backendSpans.map((s) => mapBackendSpan(traceUuid, s));

  // 2. Propagate sessionKey from session ancestors to child spans
  const spansWithKeys = deriveSessionKeys(rawSpans);

  // 3. Window bounds
  const startMs =
    toNum(meta.trace_start_ts_ms) ||
    (rawSpans[0]?.startMs ?? Date.now());
  const endMs =
    toNum(meta.trace_end_ts_ms) ||
    Math.max(startMs + 1, ...rawSpans.map((s) => s.resolvedEndMs));

  const windowStartMs = startMs;
  const windowEndMs = Math.max(startMs + 1, endMs);

  // 4. Finalize resolved timing (fill gaps with neighbouring or window end)
  const spans = finalizeResolvedTiming(spansWithKeys, windowStartMs, windowEndMs);

  // 5. Derived views
  const waterfall = createWaterfallRows(spans, windowStartMs);
  const workIndex = createWorkIndex(spans, windowStartMs, windowEndMs);
  const quickInsights = createQuickInsights(spans);

  // 6. Trace-level aggregates
  // No trace-level success/failure — individual span errors are shown per-step.
  const totalTokens = spans.reduce((sum, s) => sum + s.totalTokens, 0);
  const models = [
    ...new Set(spans.filter((s) => s.model).map((s) => s.model as string)),
  ];

  // Cost calculated locally from model + tokens (backend does not store cost)
  const estimatedCostUsd = spans.reduce(
    (sum, s) => sum + estimateSpanCost(s.model, s.tokensIn, s.tokensOut),
    0,
  );

  return {
    snapshotGeneratedAtMs: Date.now(),
    workflow: {
      id: meta.agent_id ?? traceUuid,
      name: meta.agent_id ?? 'Agent run',
    },
    trace: {
      trajectoryTraceId: traceUuid,
      baseTraceId: traceUuid,
      sessionKey: traceUuid,
      startedAtMs: windowStartMs,
      endedAtMs: windowEndMs,
      durationMs: meta.duration_ms ?? windowEndMs - windowStartMs,
      status: 'success',
      inputTokens: spans.reduce((sum, s) => sum + s.tokensIn, 0),
      outputTokens: spans.reduce((sum, s) => sum + s.tokensOut, 0),
      totalTokens,
      estimatedCostUsd,
      models,
      signals: [],
    },
    callTree: { roots: [] },
    spans,
    entityGraph: { nodes: [], links: [] },
    waterfall: {
      rows: waterfall,
      totalDurationMs: windowEndMs - windowStartMs,
    },
    workIndex,
    quickInsights,
  };
}
