import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  type OpenClawDiscoverySnapshot,
  type WorkflowDiscovery,
  type WorkflowTrajectory,
  loadOpenClawDiscoverySnapshot,
} from './openclaw-discovery';

const HOME_DIR = process.env.HOME ?? os.homedir() ?? '';
const DEFAULT_OPENCLAW_PATH = path.join(HOME_DIR, '.openclaw');
const DEFAULT_COST_PER_1K_TOKENS_USD = 0.004;

export type TraceDetailViewMode = 'execution_path' | 'actor_map' | 'step_timeline' | 'run_efficiency';

export type TraceDetailSpanKind = 'session' | 'llm_call' | 'tool_call' | 'subagent';

export type TraceDetailSpan = {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  kind: TraceDetailSpanKind;
  name: string;
  agentId: string | null;
  sessionKey: string | null;
  startMs: number;
  endMs: number | null;
  durationMs: number | null;
  resolvedEndMs: number;
  resolvedDurationMs: number;
  toolName: string | null;
  toolParams: Record<string, unknown> | null;
  childSessionKey: string | null;
  childAgentId: string | null;
  provider: string | null;
  model: string | null;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  attributes: Record<string, unknown>;
  sourceCount: number;
  hasClosedRecord: boolean;
};

export type TraceDetailEntityNodeType = 'actor' | 'tool' | 'model';

export type TraceDetailEntityNode = {
  id: string;
  type: TraceDetailEntityNodeType;
  label: string;
  relatedSpanId: string | null;
  metrics: {
    llmCalls: number;
    toolCalls: number;
    tokensIn: number;
    tokensOut: number;
    totalTokens: number;
  };
};

export type TraceDetailEntityLink = {
  id: string;
  source: string;
  target: string;
  kind: 'uses_tool' | 'uses_model' | 'spawns';
};

export type TraceDetailWaterfallRow = {
  spanId: string;
  label: string;
  kind: TraceDetailSpanKind;
  startOffsetMs: number;
  durationMs: number;
  totalTokens: number;
};

export type TraceDetailPhaseStatus = 'efficient' | 'active_heavy' | 'high_spend_low_progress' | 'idle';

export type TraceDetailPhase = {
  id: string;
  startMs: number;
  endMs: number;
  llmCalls: number;
  toolCalls: number;
  tokens: number;
  subagentSpawns: number;
  toolDensity: number;
  tokenEfficiency: number;
  score: number;
  status: TraceDetailPhaseStatus;
  statusLabel: string;
  representativeSpanId: string | null;
};

export type TraceDetailSnapshot = {
  snapshotGeneratedAtMs: number;
  workflow: {
    id: string;
    name: string;
  };
  trace: {
    trajectoryTraceId: string;
    baseTraceId: string;
    sessionKey: string;
    startedAtMs: number;
    endedAtMs: number;
    durationMs: number;
    status: WorkflowTrajectory['resultStatus'];
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    models: string[];
    signals: string[];
  };
  callTree: {
    roots: string[];
  };
  spans: TraceDetailSpan[];
  entityGraph: {
    nodes: TraceDetailEntityNode[];
    links: TraceDetailEntityLink[];
  };
  waterfall: {
    rows: TraceDetailWaterfallRow[];
    totalDurationMs: number;
  };
  workIndex: {
    averageScore: number;
    phases: TraceDetailPhase[];
  };
  quickInsights: {
    hottestSpanId: string | null;
    longestSpanId: string | null;
    likelyIssue: string;
    nextActions: string[];
  };
};

type RawTraceSpan = {
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  kind?: string;
  name?: string;
  agentId?: string;
  sessionKey?: string;
  startMs?: number;
  endMs?: number;
  durationMs?: number;
  toolName?: string;
  toolParams?: Record<string, unknown>;
  childSessionKey?: string;
  childAgentId?: string;
  provider?: string;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  attributes?: Record<string, unknown>;
};

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return 0;
}

function toRoundedUsd(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function parseBaseTrace(traceId: string): { baseTraceId: string; windowStartMs: number | null } {
  const lastColon = traceId.lastIndexOf(':');
  if (lastColon <= 0) {
    return {
      baseTraceId: traceId,
      windowStartMs: null,
    };
  }

  const suffix = traceId.slice(lastColon + 1);
  if (!/^\d{10,}$/.test(suffix)) {
    return {
      baseTraceId: traceId,
      windowStartMs: null,
    };
  }

  return {
    baseTraceId: traceId.slice(0, lastColon),
    windowStartMs: Number(suffix),
  };
}

async function listJsonlFiles(directoryPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.jsonl'))
      .map((entry) => path.join(directoryPath, entry.name))
      .sort();
  } catch {
    return [];
  }
}

async function readRawSpansForTrace(baseTraceId: string, sessionKey: string): Promise<RawTraceSpan[]> {
  const files = await listJsonlFiles(path.join(DEFAULT_OPENCLAW_PATH, 'traces'));
  if (!files.length) {
    return [];
  }

  const rows: RawTraceSpan[] = [];

  for (const filePath of files) {
    let raw = '';
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch {
      continue;
    }

    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    for (const line of lines) {
      if (!line.includes(`"traceId":"${baseTraceId}"`)) {
        continue;
      }

      let parsed: RawTraceSpan | null = null;
      try {
        parsed = JSON.parse(line) as RawTraceSpan;
      } catch {
        parsed = null;
      }

      if (!parsed?.traceId || !parsed?.spanId) {
        continue;
      }
      if (parsed.traceId !== baseTraceId) {
        continue;
      }
      if (parsed.sessionKey && parsed.sessionKey !== sessionKey) {
        continue;
      }

      rows.push(parsed);
    }
  }

  return rows;
}

function mergeRawSpans(rows: RawTraceSpan[]): Map<string, TraceDetailSpan> {
  const byId = new Map<string, TraceDetailSpan>();

  for (const row of rows) {
    if (!row.spanId || !row.traceId || typeof row.startMs !== 'number' || !row.kind) {
      continue;
    }

    const existing = byId.get(row.spanId);
    const normalizedKind = row.kind as TraceDetailSpanKind;

    const rowTokensIn = Math.max(0, toNumber(row.tokensIn));
    const rowTokensOut = Math.max(0, toNumber(row.tokensOut));
    const rowTotalTokensFromAttributes = toNumber(row.attributes?.totalTokens);
    const rowTotalTokens = Math.max(rowTokensIn + rowTokensOut, rowTotalTokensFromAttributes);
    const rowEndMs = typeof row.endMs === 'number' && Number.isFinite(row.endMs) ? row.endMs : null;
    const rowDurationMs = typeof row.durationMs === 'number' && Number.isFinite(row.durationMs) ? row.durationMs : null;

    if (!existing) {
      byId.set(row.spanId, {
        traceId: row.traceId,
        spanId: row.spanId,
        parentSpanId: row.parentSpanId ?? null,
        kind: normalizedKind,
        name: row.name ?? row.kind,
        agentId: row.agentId ?? null,
        sessionKey: row.sessionKey ?? null,
        startMs: row.startMs,
        endMs: rowEndMs,
        durationMs: rowDurationMs,
        resolvedEndMs: rowEndMs ?? row.startMs,
        resolvedDurationMs: Math.max(0, rowDurationMs ?? ((rowEndMs ?? row.startMs) - row.startMs)),
        toolName: row.toolName ?? null,
        toolParams: row.toolParams ?? null,
        childSessionKey: row.childSessionKey ?? null,
        childAgentId: row.childAgentId ?? null,
        provider: row.provider ?? null,
        model: row.model ?? null,
        tokensIn: rowTokensIn,
        tokensOut: rowTokensOut,
        totalTokens: rowTotalTokens,
        cacheReadTokens: Math.max(0, toNumber(row.cacheReadTokens)),
        cacheWriteTokens: Math.max(0, toNumber(row.cacheWriteTokens)),
        attributes: (row.attributes ?? {}) as Record<string, unknown>,
        sourceCount: 1,
        hasClosedRecord: rowEndMs !== null,
      });
      continue;
    }

    const mergedEndMs =
      rowEndMs === null
        ? existing.endMs
        : existing.endMs === null
          ? rowEndMs
          : Math.max(existing.endMs, rowEndMs);

    const mergedDurationMs =
      rowDurationMs === null
        ? existing.durationMs
        : existing.durationMs === null
          ? rowDurationMs
          : Math.max(existing.durationMs, rowDurationMs);

    const mergedAttributes = {
      ...existing.attributes,
      ...(row.attributes ?? {}),
    };

    byId.set(row.spanId, {
      ...existing,
      parentSpanId: existing.parentSpanId ?? row.parentSpanId ?? null,
      kind: existing.kind ?? normalizedKind,
      name: existing.name || row.name ? existing.name || (row.name ?? row.kind ?? 'span') : existing.name,
      agentId: existing.agentId ?? row.agentId ?? null,
      sessionKey: existing.sessionKey ?? row.sessionKey ?? null,
      startMs: Math.min(existing.startMs, row.startMs),
      endMs: mergedEndMs,
      durationMs: mergedDurationMs,
      toolName: existing.toolName ?? row.toolName ?? null,
      toolParams: existing.toolParams ?? row.toolParams ?? null,
      childSessionKey: existing.childSessionKey ?? row.childSessionKey ?? null,
      childAgentId: existing.childAgentId ?? row.childAgentId ?? null,
      provider: existing.provider ?? row.provider ?? null,
      model: existing.model ?? row.model ?? null,
      tokensIn: Math.max(existing.tokensIn, rowTokensIn),
      tokensOut: Math.max(existing.tokensOut, rowTokensOut),
      totalTokens: Math.max(existing.totalTokens, rowTotalTokens),
      attributes: mergedAttributes,
      sourceCount: existing.sourceCount + 1,
      hasClosedRecord: existing.hasClosedRecord || rowEndMs !== null,
    });
  }

  return byId;
}

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
      .map((candidate) => candidate.startMs)
      .find((candidateStart) => candidateStart >= span.startMs);

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
      resolvedDurationMs: Math.max(0, (span.durationMs ?? (resolvedEndMs - span.startMs))),
    };
  });
}

function deriveSessionLabel(sessionKey: string | null, agentId: string | null): string {
  if (!sessionKey) {
    return agentId ?? 'agent';
  }

  if (sessionKey.includes(':subagent:')) {
    const suffix = sessionKey.split(':subagent:')[1] ?? '';
    return `subagent · ${suffix.slice(0, 8)}`;
  }

  if (sessionKey.includes(':cron:')) {
    const suffix = sessionKey.split(':cron:')[1] ?? '';
    return `cron · ${suffix.slice(0, 8)}`;
  }

  if (sessionKey === 'agent:main:main') {
    return 'main agent';
  }

  return sessionKey.split(':').slice(-1)[0] ?? sessionKey;
}

function createEntityGraph(spans: TraceDetailSpan[]): {
  nodes: TraceDetailEntityNode[];
  links: TraceDetailEntityLink[];
} {
  const shortSpanRef = (spanId: string): string => spanId.slice(0, 4);
  const actorBuckets = new Map<
    string,
    {
      label: string;
      llmCalls: number;
      toolCalls: number;
      tokensIn: number;
      tokensOut: number;
      totalTokens: number;
      representativeSpanId: string | null;
      sessionSpanParentId: string | null;
    }
  >();

  const sessionSpanById = new Map<string, string>();

  for (const span of spans) {
    if (span.kind === 'session') {
      sessionSpanById.set(span.spanId, span.sessionKey ?? span.spanId);
    }

    if (!span.sessionKey) {
      continue;
    }

    const existing = actorBuckets.get(span.sessionKey);
    if (!existing) {
      actorBuckets.set(span.sessionKey, {
        label: deriveSessionLabel(span.sessionKey, span.agentId),
        llmCalls: 0,
        toolCalls: 0,
        tokensIn: 0,
        tokensOut: 0,
        totalTokens: 0,
        representativeSpanId: span.spanId,
        sessionSpanParentId: span.kind === 'session' ? span.parentSpanId : null,
      });
    }

    const bucket = actorBuckets.get(span.sessionKey);
    if (!bucket) continue;

    if (span.kind === 'llm_call') {
      bucket.llmCalls += 1;
      bucket.tokensIn += span.tokensIn;
      bucket.tokensOut += span.tokensOut;
      bucket.totalTokens += span.totalTokens;
      if (!bucket.representativeSpanId) {
        bucket.representativeSpanId = span.spanId;
      }
    }

    if (span.kind === 'tool_call') {
      bucket.toolCalls += 1;
      if (!bucket.representativeSpanId) {
        bucket.representativeSpanId = span.spanId;
      }
    }

    if (span.kind === 'session' && span.parentSpanId) {
      bucket.sessionSpanParentId = span.parentSpanId;
    }
  }

  const nodes: TraceDetailEntityNode[] = [];
  const links: TraceDetailEntityLink[] = [];

  for (const [sessionKey, bucket] of actorBuckets.entries()) {
    nodes.push({
      id: `actor:${sessionKey}`,
      type: 'actor',
      label: bucket.label,
      relatedSpanId: bucket.representativeSpanId,
      metrics: {
        llmCalls: bucket.llmCalls,
        toolCalls: bucket.toolCalls,
        tokensIn: bucket.tokensIn,
        tokensOut: bucket.tokensOut,
        totalTokens: bucket.totalTokens,
      },
    });
  }

  for (const span of spans) {
    if (!span.sessionKey || !actorBuckets.has(span.sessionKey)) {
      continue;
    }
    const actorNodeId = `actor:${span.sessionKey}`;

    if (span.kind === 'tool_call') {
      const toolLabel = span.toolName ?? span.name ?? 'tool';
      const toolNodeId = `tool:${span.spanId}`;
      nodes.push({
        id: toolNodeId,
        type: 'tool',
        label: `${toolLabel} · ${shortSpanRef(span.spanId)}`,
        relatedSpanId: span.spanId,
        metrics: {
          llmCalls: 0,
          toolCalls: 1,
          tokensIn: span.tokensIn,
          tokensOut: span.tokensOut,
          totalTokens: span.totalTokens,
        },
      });
      links.push({
        id: `link:${span.sessionKey}:tool:${span.spanId}`,
        source: actorNodeId,
        target: toolNodeId,
        kind: 'uses_tool',
      });
    }

    if (span.kind === 'llm_call') {
      const modelLabel = span.model ?? 'unknown model';
      const modelNodeId = `model:${span.spanId}`;
      nodes.push({
        id: modelNodeId,
        type: 'model',
        label: `${modelLabel} · ${shortSpanRef(span.spanId)}`,
        relatedSpanId: span.spanId,
        metrics: {
          llmCalls: 1,
          toolCalls: 0,
          tokensIn: span.tokensIn,
          tokensOut: span.tokensOut,
          totalTokens: span.totalTokens,
        },
      });
      links.push({
        id: `link:${span.sessionKey}:model:${span.spanId}`,
        source: actorNodeId,
        target: modelNodeId,
        kind: 'uses_model',
      });
    }
  }

  for (const [sessionKey, bucket] of actorBuckets.entries()) {
    if (!bucket.sessionSpanParentId) continue;
    const parentSessionKey = sessionSpanById.get(bucket.sessionSpanParentId);
    if (!parentSessionKey || !actorBuckets.has(parentSessionKey)) continue;

    links.push({
      id: `link:${parentSessionKey}:spawn:${sessionKey}`,
      source: `actor:${parentSessionKey}`,
      target: `actor:${sessionKey}`,
      kind: 'spawns',
    });
  }

  return {
    nodes,
    links,
  };
}

function createWaterfallRows(spans: TraceDetailSpan[], windowStartMs: number): TraceDetailWaterfallRow[] {
  const spanById = new Map(spans.map((s) => [s.spanId, s]));
  const spanIds = new Set(spans.map((s) => s.spanId));

  // ── Resolve execution parents (same logic as ExecutionPathView) ──
  // Tool calls whose raw parent is a session get reparented under
  // the closest preceding LLM call in the same session.
  const llmBySession = new Map<string, TraceDetailSpan[]>();
  for (const span of spans) {
    if (span.kind !== 'llm_call') continue;
    const key = span.sessionKey ?? '__unknown_session__';
    const bucket = llmBySession.get(key) ?? [];
    bucket.push(span);
    llmBySession.set(key, bucket);
  }
  for (const bucket of llmBySession.values()) {
    bucket.sort((a, b) => a.startMs - b.startMs);
  }

  const resolvedParent = new Map<string, string | null>();
  for (const span of spans) {
    let parentId = span.parentSpanId ?? null;
    if (parentId && !spanIds.has(parentId)) parentId = null;
    const rawParent = parentId ? spanById.get(parentId) ?? null : null;

    if (span.kind === 'tool_call' && (!rawParent || rawParent.kind === 'session')) {
      const sessionKey = span.sessionKey ?? rawParent?.sessionKey ?? '__unknown_session__';
      const candidates = llmBySession.get(sessionKey) ?? [];
      const chosen =
        candidates
          .filter((c) => c.startMs <= span.startMs && c.resolvedEndMs >= span.startMs)
          .sort((a, b) => b.startMs - a.startMs)[0] ??
        candidates
          .filter((c) => c.startMs <= span.startMs)
          .sort((a, b) => b.startMs - a.startMs)[0];
      if (chosen) parentId = chosen.spanId;
    }

    resolvedParent.set(span.spanId, parentId);
  }

  // ── Build children map from resolved parents ──
  const childrenOf = new Map<string | null, TraceDetailSpan[]>();
  for (const span of spans) {
    const parentKey = resolvedParent.get(span.spanId) ?? null;
    let bucket = childrenOf.get(parentKey);
    if (!bucket) {
      bucket = [];
      childrenOf.set(parentKey, bucket);
    }
    bucket.push(span);
  }

  // Sort children at each level by startMs
  for (const bucket of childrenOf.values()) {
    bucket.sort((a, b) => a.startMs - b.startMs);
  }

  // DFS pre-order traversal — parents appear before their children
  const ordered: TraceDetailSpan[] = [];
  const rootBucket = childrenOf.get(null) ?? [];

  // Debug: log root composition for troubleshooting
  if (typeof console !== 'undefined') {
    console.log('[waterfall] roots:', rootBucket.map((s) => `${s.kind}:${s.name}:${s.spanId.slice(0, 8)}`));
  }

  // Guarantee: session roots always first, then others by startMs
  const sessionRoots = rootBucket.filter((s) => s.kind === 'session');
  const otherRoots = rootBucket.filter((s) => s.kind !== 'session');

  const visit = (spanId: string) => {
    const children = childrenOf.get(spanId);
    if (!children) return;
    for (const child of children) {
      ordered.push(child);
      visit(child.spanId);
    }
  };

  // Visit session roots first, then other roots
  for (const root of sessionRoots) {
    ordered.push(root);
    visit(root.spanId);
  }
  for (const root of otherRoots) {
    ordered.push(root);
    visit(root.spanId);
  }

  return ordered.map((span) => {
    const shortModel = span.model ? span.model.replace(/\s+/g, ' ').slice(0, 28) : null;
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

function derivePhaseStatus(score: number): { status: TraceDetailPhaseStatus; label: string } {
  if (score === 0) {
    return { status: 'idle', label: 'Idle' };
  }
  if (score <= 25) {
    return { status: 'high_spend_low_progress', label: 'High spend, low progress' };
  }
  if (score <= 60) {
    return { status: 'active_heavy', label: 'Active but heavy' };
  }
  return { status: 'efficient', label: 'Efficient' };
}

function createWorkIndex(spans: TraceDetailSpan[], windowStartMs: number, windowEndMs: number): {
  averageScore: number;
  phases: TraceDetailPhase[];
} {
  if (!spans.length || windowEndMs <= windowStartMs) {
    return {
      averageScore: 0,
      phases: [],
    };
  }

  const totalDurationMs = Math.max(1, windowEndMs - windowStartMs);
  const idealWindow = totalDurationMs / 10;
  const phaseWindowMs = Math.max(5000, idealWindow);

  const phases: TraceDetailPhase[] = [];
  let cursor = windowStartMs;
  let phaseIndex = 0;

  while (cursor < windowEndMs) {
    const nextCursor = Math.min(windowEndMs, cursor + phaseWindowMs);
    const inPhase = spans.filter((span) => span.startMs < nextCursor && span.resolvedEndMs > cursor);

    const llmCalls = inPhase.filter((span) => span.kind === 'llm_call').length;
    const toolCalls = inPhase.filter((span) => span.kind === 'tool_call').length;
    const tokens = inPhase.reduce((sum, span) => sum + span.totalTokens, 0);
    const subagentSpawns = inPhase.filter((span) => span.kind === 'subagent').length;

    const toolDensity = toolCalls / Math.max(llmCalls, 1);
    const tokenEfficiency = toolCalls / Math.max(tokens / 1000, 0.1);

    let score = 0;
    if (llmCalls > 0 || toolCalls > 0) {
      score = Math.min(
        100,
        Math.round(
          (Math.min(toolDensity, 5) / 5) * 50
            + (Math.min(tokenEfficiency, 3) / 3) * 30
            + (subagentSpawns > 0 ? 20 : 0),
        ),
      );

      if (llmCalls > 0 && toolCalls === 0) {
        score = Math.min(score, 15);
      }
    }

    const phaseSpansSorted = inPhase
      .slice()
      .sort((a, b) => b.totalTokens - a.totalTokens || b.resolvedDurationMs - a.resolvedDurationMs);

    const phaseStatus = derivePhaseStatus(score);

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
    ? Math.round(phases.reduce((sum, phase) => sum + phase.score, 0) / phases.length)
    : 0;

  return {
    averageScore,
    phases,
  };
}

function createQuickInsights(spans: TraceDetailSpan[]): TraceDetailSnapshot['quickInsights'] {
  if (!spans.length) {
    return {
      hottestSpanId: null,
      longestSpanId: null,
      likelyIssue: 'No spans captured for this run.',
      nextActions: ['Confirm tracing is enabled and rerun once to collect baseline evidence.'],
    };
  }

  const hottestSpan = spans
    .slice()
    .sort((a, b) => b.totalTokens - a.totalTokens || b.resolvedDurationMs - a.resolvedDurationMs)[0];

  const longestSpan = spans.slice().sort((a, b) => b.resolvedDurationMs - a.resolvedDurationMs)[0];

  const nextActions: string[] = [];

  if ((hottestSpan?.kind === 'llm_call' && hottestSpan.totalTokens > 150000) || hottestSpan?.tokensIn > 120000) {
    nextActions.push('Trim always-loaded context and route routine steps to a smaller model tier.');
  }

  if (longestSpan?.kind === 'tool_call' && longestSpan.resolvedDurationMs > 15000) {
    nextActions.push('Add tool timeout + retry policy guard on the slowest tool action.');
  }

  if (spans.some((span) => toNumber(span.attributes?.error) > 0 || typeof span.attributes?.error === 'string')) {
    nextActions.push('Capture failing params/result pair and pin a deterministic verifier before rerun.');
  }

  if (!nextActions.length) {
    nextActions.push('Promote this run into a quality baseline and watch drift against next 7 days of runs.');
  }

  const likelyIssue =
    hottestSpan?.kind === 'llm_call'
      ? 'Most pressure is concentrated in one high-token model step.'
      : hottestSpan?.kind === 'tool_call'
        ? 'Most pressure is concentrated in one repeated or expensive tool action.'
        : 'Run pressure is distributed; focus on span-level verification for this path.';

  return {
    hottestSpanId: hottestSpan?.spanId ?? null,
    longestSpanId: longestSpan?.spanId ?? null,
    likelyIssue,
    nextActions: nextActions.slice(0, 3),
  };
}

function buildCallTreeRoots(spans: TraceDetailSpan[]): string[] {
  const spanIds = new Set(spans.map((span) => span.spanId));
  return spans
    .filter((span) => !span.parentSpanId || !spanIds.has(span.parentSpanId))
    .sort((a, b) => a.startMs - b.startMs)
    .map((span) => span.spanId);
}

function pickTrajectory(workflow: WorkflowDiscovery, selectedTraceId: string | null | undefined): WorkflowTrajectory | null {
  if (!workflow.trajectories.length) {
    return null;
  }

  if (!selectedTraceId) {
    return workflow.trajectories[0] ?? null;
  }

  const exact = workflow.trajectories.find((trajectory) => trajectory.traceId === selectedTraceId);
  if (exact) {
    return exact;
  }

  const prefixMatch = workflow.trajectories.find((trajectory) => trajectory.traceId.startsWith(`${selectedTraceId}:`));
  if (prefixMatch) {
    return prefixMatch;
  }

  const base = parseBaseTrace(selectedTraceId).baseTraceId;
  const baseMatch = workflow.trajectories.find((trajectory) => parseBaseTrace(trajectory.traceId).baseTraceId === base);
  if (baseMatch) {
    return baseMatch;
  }

  return workflow.trajectories[0] ?? null;
}

function selectWindowBounds(params: {
  selectedTrajectory: WorkflowTrajectory;
  mergedSpans: TraceDetailSpan[];
}): {
  windowStartMs: number;
  windowEndMs: number;
  selectedSpans: TraceDetailSpan[];
} {
  const { selectedTrajectory, mergedSpans } = params;
  const spanApproxEnd = (span: TraceDetailSpan): number => {
    if (typeof span.endMs === 'number' && Number.isFinite(span.endMs)) {
      return span.endMs;
    }
    if (typeof span.durationMs === 'number' && Number.isFinite(span.durationMs) && span.durationMs > 0) {
      return span.startMs + span.durationMs;
    }
    return span.startMs;
  };

  const percentile = (values: number[], ratio: number): number => {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.max(0, Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio)));
    return sorted[index] ?? 0;
  };

  const minObservedStart = Math.min(...mergedSpans.map((span) => span.startMs));
  const maxObservedEnd = Math.max(
    ...mergedSpans.map((span) => spanApproxEnd(span)),
    minObservedStart + 1,
  );
  const fallbackStart = Number.isFinite(minObservedStart) ? minObservedStart : selectedTrajectory.startedAtMs;
  const fallbackEnd = Number.isFinite(maxObservedEnd) ? maxObservedEnd : Math.max(selectedTrajectory.endedAtMs, fallbackStart + 1);

  const candidateStart = selectedTrajectory.startedAtMs > 0 ? selectedTrajectory.startedAtMs : fallbackStart;
  const candidateDuration = selectedTrajectory.durationMs > 0
    ? selectedTrajectory.durationMs
    : Math.max(1, selectedTrajectory.endedAtMs - candidateStart);
  const candidateEnd = selectedTrajectory.endedAtMs > candidateStart
    ? selectedTrajectory.endedAtMs
    : candidateStart + Math.max(1, candidateDuration);

  const sortedSpans = mergedSpans
    .slice()
    .sort((a, b) => a.startMs - b.startMs || spanApproxEnd(a) - spanApproxEnd(b));
  const observedDurations = sortedSpans
    .map((span) => Math.max(0, spanApproxEnd(span) - span.startMs))
    .filter((duration) => duration > 0);
  const p90Duration = percentile(observedDurations, 0.9);
  const gapThresholdMs = Math.max(
    120_000,
    Math.min(1_800_000, Math.max(candidateDuration * 3, p90Duration * 8)),
  );

  const clusters: Array<{ startMs: number; endMs: number; spans: TraceDetailSpan[] }> = [];
  for (const span of sortedSpans) {
    const spanStart = span.startMs;
    const spanEnd = spanApproxEnd(span);
    const currentCluster = clusters[clusters.length - 1];
    if (!currentCluster) {
      clusters.push({ startMs: spanStart, endMs: spanEnd, spans: [span] });
      continue;
    }

    if (spanStart - currentCluster.endMs > gapThresholdMs) {
      clusters.push({ startMs: spanStart, endMs: spanEnd, spans: [span] });
      continue;
    }

    currentCluster.spans.push(span);
    currentCluster.endMs = Math.max(currentCluster.endMs, spanEnd);
  }

  const targetStart = Number.isFinite(candidateStart) ? candidateStart : fallbackStart;
  const targetEnd = Number.isFinite(candidateEnd) && candidateEnd > targetStart
    ? candidateEnd
    : Math.max(targetStart + 1, fallbackEnd);

  const selectedCluster = clusters.length
    ? clusters
      .slice()
      .sort((a, b) => {
        const overlapA = Math.max(0, Math.min(a.endMs, targetEnd) - Math.max(a.startMs, targetStart));
        const overlapB = Math.max(0, Math.min(b.endMs, targetEnd) - Math.max(b.startMs, targetStart));
        if (overlapA !== overlapB) {
          return overlapB - overlapA;
        }
        const distanceA = Math.abs(a.startMs - targetStart);
        const distanceB = Math.abs(b.startMs - targetStart);
        if (distanceA !== distanceB) {
          return distanceA - distanceB;
        }
        return b.spans.length - a.spans.length;
      })[0]
    : null;

  const windowStartMs = selectedCluster?.startMs ?? targetStart ?? fallbackStart;
  const windowEndMs = Math.max(windowStartMs + 1, selectedCluster?.endMs ?? targetEnd ?? fallbackEnd);

  const selectedByTime = mergedSpans.filter(
    (span) => span.startMs <= windowEndMs && spanApproxEnd(span) >= windowStartMs,
  );

  if (!selectedByTime.length) {
    return {
      windowStartMs,
      windowEndMs,
      selectedSpans: mergedSpans,
    };
  }

  const allById = new Map(mergedSpans.map((span) => [span.spanId, span]));
  const selectedById = new Map(selectedByTime.map((span) => [span.spanId, span]));

  for (const span of selectedByTime) {
    let parentSpanId = span.parentSpanId;
    while (parentSpanId) {
      const parent = allById.get(parentSpanId);
      if (!parent) break;
      if (!selectedById.has(parent.spanId)) {
        selectedById.set(parent.spanId, parent);
      }
      parentSpanId = parent.parentSpanId;
    }
  }

  return {
    windowStartMs,
    windowEndMs,
    selectedSpans: Array.from(selectedById.values()),
  };
}

function estimateCostUsd(totalTokens: number, model: string | null): number {
  if (!totalTokens || totalTokens <= 0) {
    return 0;
  }

  const modelKey = model?.toLowerCase() ?? '';
  const rateByModel: Record<string, number> = {
    'gemini-3.1-pro-preview': 0.008,
    'gpt-5.4': 0.015,
    'gpt-5.2': 0.012,
    'claude-opus-4': 0.02,
  };
  const rate = rateByModel[modelKey] ?? DEFAULT_COST_PER_1K_TOKENS_USD;
  return toRoundedUsd((Math.max(totalTokens, 0) / 1000) * rate);
}

export async function loadTraceDetailSnapshot(input: {
  workflowId: string;
  selectedTraceId?: string | null;
  snapshot?: OpenClawDiscoverySnapshot | null;
}): Promise<TraceDetailSnapshot | null> {
  const snapshot = input.snapshot ?? await loadOpenClawDiscoverySnapshot();
  const workflow = snapshot.workflows.find((candidate) => candidate.id === input.workflowId);

  if (!workflow) {
    return null;
  }

  const selectedTrajectory = pickTrajectory(workflow, input.selectedTraceId ?? null);
  if (!selectedTrajectory) {
    return null;
  }

  const parsed = parseBaseTrace(selectedTrajectory.traceId);
  const baseTraceId = parsed.baseTraceId;
  const spanRows = await readRawSpansForTrace(baseTraceId, selectedTrajectory.sessionKey);
  if (!spanRows.length) {
    return {
      snapshotGeneratedAtMs: snapshot.generatedAtMs,
      workflow: {
        id: workflow.id,
        name: workflow.name,
      },
      trace: {
        trajectoryTraceId: selectedTrajectory.traceId,
        baseTraceId,
        sessionKey: selectedTrajectory.sessionKey,
        startedAtMs: selectedTrajectory.startedAtMs,
        endedAtMs: selectedTrajectory.endedAtMs,
        durationMs: selectedTrajectory.durationMs,
        status: selectedTrajectory.resultStatus,
        inputTokens: selectedTrajectory.inputTokens,
        outputTokens: selectedTrajectory.outputTokens,
        totalTokens: selectedTrajectory.totalTokens,
        estimatedCostUsd: selectedTrajectory.estimatedCostUsd,
        models: selectedTrajectory.models,
        signals: selectedTrajectory.signals,
      },
      callTree: {
        roots: [],
      },
      spans: [],
      entityGraph: {
        nodes: [],
        links: [],
      },
      waterfall: {
        rows: [],
        totalDurationMs: Math.max(1, selectedTrajectory.durationMs),
      },
      workIndex: {
        averageScore: 0,
        phases: [],
      },
      quickInsights: {
        hottestSpanId: null,
        longestSpanId: null,
        likelyIssue: 'No trace spans captured for this run yet.',
        nextActions: ['Verify the tracing plugin interception path and rerun this trace once.'],
      },
    };
  }

  const mergedMap = mergeRawSpans(spanRows);
  const mergedSpans = Array.from(mergedMap.values());

  const { windowStartMs, windowEndMs, selectedSpans } = selectWindowBounds({
    selectedTrajectory,
    mergedSpans,
  });

  const finalizedSpans = finalizeResolvedTiming(selectedSpans, windowStartMs, windowEndMs);
  const callTreeRoots = buildCallTreeRoots(finalizedSpans);
  const entityGraph = createEntityGraph(finalizedSpans);
  const waterfallRows = createWaterfallRows(finalizedSpans, windowStartMs);
  const workIndex = createWorkIndex(finalizedSpans, windowStartMs, windowEndMs);
  const quickInsights = createQuickInsights(finalizedSpans);

  const totalTokens = finalizedSpans.reduce((sum, span) => sum + span.totalTokens, 0);
  const modelForCost = finalizedSpans.find((span) => span.kind === 'llm_call' && span.model)?.model ?? selectedTrajectory.costModel ?? null;
  const estimatedCostUsd = estimateCostUsd(totalTokens, modelForCost);

  const inputTokens = finalizedSpans
    .filter((span) => span.kind === 'llm_call')
    .reduce((sum, span) => sum + span.tokensIn, 0);

  const outputTokens = finalizedSpans
    .filter((span) => span.kind === 'llm_call')
    .reduce((sum, span) => sum + span.tokensOut, 0);

  const models = Array.from(
    new Set(
      finalizedSpans
        .filter((span) => span.model)
        .map((span) => span.model as string),
    ),
  );

  return {
    snapshotGeneratedAtMs: snapshot.generatedAtMs,
    workflow: {
      id: workflow.id,
      name: workflow.name,
    },
    trace: {
      trajectoryTraceId: selectedTrajectory.traceId,
      baseTraceId,
      sessionKey: selectedTrajectory.sessionKey,
      startedAtMs: windowStartMs,
      endedAtMs: windowEndMs,
      durationMs: Math.max(1, windowEndMs - windowStartMs),
      status: selectedTrajectory.resultStatus,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCostUsd: estimatedCostUsd || selectedTrajectory.estimatedCostUsd,
      models: models.length ? models : selectedTrajectory.models,
      signals: selectedTrajectory.signals,
    },
    callTree: {
      roots: callTreeRoots,
    },
    spans: finalizedSpans,
    entityGraph,
    waterfall: {
      rows: waterfallRows,
      totalDurationMs: Math.max(1, windowEndMs - windowStartMs),
    },
    workIndex,
    quickInsights,
  };
}
