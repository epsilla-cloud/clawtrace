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
  payload_json?: string | null;
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

/* ── Cost pricing table (USD per 1M tokens) ──────────────────────────────── */
const MODEL_PRICING: Array<{ pattern: RegExp; input: number; output: number }> = [
  { pattern: /claude.*opus/i,     input: 15.0,  output: 75.0  },
  { pattern: /claude.*sonnet/i,   input: 3.0,   output: 15.0  },
  { pattern: /claude.*haiku/i,    input: 0.25,  output: 1.25  },
  { pattern: /gpt-4o-mini/i,     input: 0.15,  output: 0.60  },
  { pattern: /gpt-4o/i,          input: 2.5,   output: 10.0  },
  { pattern: /gpt-4/i,           input: 30.0,  output: 60.0  },
  { pattern: /o3-mini/i,         input: 1.1,   output: 4.4   },
  { pattern: /o3/i,              input: 10.0,  output: 40.0  },
  { pattern: /gemini.*flash/i,   input: 0.075, output: 0.30  },
  { pattern: /gemini.*pro/i,     input: 1.25,  output: 5.0   },
  { pattern: /deepseek/i,        input: 0.27,  output: 1.10  },
];
const FALLBACK_PRICING = { input: 4.0, output: 12.0 };

function estimateSpanCost(
  model: string | null,
  tokensIn: number,
  tokensOut: number,
): number {
  if (!model || (tokensIn <= 0 && tokensOut <= 0)) return 0;
  const pricing =
    MODEL_PRICING.find((p) => p.pattern.test(model)) ?? FALLBACK_PRICING;
  return (tokensIn * pricing.input + tokensOut * pricing.output) / 1_000_000;
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

  // Parse payload_json for detail inspection (tool params/results, LLM prompts/responses)
  let payload: Record<string, unknown> = {};
  if (s.payload_json) {
    try { payload = JSON.parse(s.payload_json) as Record<string, unknown>; } catch { /* ignore */ }
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
    toolParams: (payload.params as Record<string, unknown>) ?? null,
    childSessionKey: kind === 'subagent' ? (label !== 'session' ? label : spanId) : null,
    childAgentId: kind === 'subagent' ? (label !== 'session' ? label : spanId) : null,
    provider: (payload.provider as string) ?? null,
    model: kind === 'llm_call' ? (label || (payload.model as string) || null) : null,
    tokensIn: toNum(s.input_tokens),
    tokensOut: toNum(s.output_tokens),
    totalTokens: toNum(s.total_tokens),
    attributes: {
      has_error: s.has_error ?? 0,
      // Surface payload fields for ViewInspector's "Output / response" section
      result: payload.result ?? undefined,
      output: payload.assistantTexts ?? payload.outcome ?? undefined,
      response: payload.lastAssistant ?? undefined,
      error: payload.error ?? undefined,
      // Extra context
      prompt: payload.prompt ?? undefined,
      systemPrompt: payload.systemPrompt ?? undefined,
      usage: payload.usage ?? undefined,
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
