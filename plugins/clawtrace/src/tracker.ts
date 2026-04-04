import { randomId } from "./id.js";
import type { ClawTracePluginConfig, IngestEnvelope, IngestEventType, PluginLogger } from "./types.js";
import type { IngestEventSink } from "./event-sink.js";

type SessionStartEvent = { sessionId: string; sessionKey?: string; resumedFrom?: string };
type SessionEndEvent = { sessionId: string; sessionKey?: string; messageCount: number; durationMs?: number };
type SessionContext = { agentId?: string; sessionId: string; sessionKey?: string };

type LlmInputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string;
  systemPrompt?: string;
  prompt: string;
  historyMessages: unknown[];
  imagesCount: number;
};

type LlmOutputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string;
  assistantTexts: string[];
  lastAssistant?: unknown;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
};

type AgentContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  toolCallId?: string;
};

type BeforeToolCallEvent = {
  toolName: string;
  params: Record<string, unknown>;
  runId?: string;
  toolCallId?: string;
};

type AfterToolCallEvent = {
  toolName: string;
  params: Record<string, unknown>;
  runId?: string;
  toolCallId?: string;
  result?: unknown;
  error?: string;
  durationMs?: number;
};

type ToolContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  toolName: string;
  toolCallId?: string;
};

type SubagentSpawnBase = {
  childSessionKey: string;
  agentId: string;
  label?: string;
  mode: "run" | "session";
  threadRequested: boolean;
  requester?: { channel?: string; accountId?: string; to?: string; threadId?: string | number };
};

type SubagentSpawningEvent = SubagentSpawnBase;
type SubagentSpawnedEvent = SubagentSpawnBase & { runId: string };

type SubagentEndedEvent = {
  targetSessionKey: string;
  targetKind: "subagent" | "acp";
  reason: string;
  sendFarewell?: boolean;
  accountId?: string;
  runId?: string;
  endedAt?: number;
  outcome?: "ok" | "error" | "timeout" | "killed" | "reset" | "deleted";
  error?: string;
};

type SubagentContext = {
  runId?: string;
  childSessionKey?: string;
  requesterSessionKey?: string;
};

type AgentEndEvent = {
  messages?: unknown[];
};

type AgentEndContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
};

// ── State types ─────────────────────────────────────────────────────────────

/** Lightweight session metadata — no traceId here; traces are per-run. */
type SessionMeta = {
  agentId?: string;
  sessionKey: string;
};

/**
 * One active Agent Loop (= one trace).
 * traceId IS the runId — one trace per agentic turn.
 */
type RunState = {
  traceId: string;     // = runId from OpenClaw
  rootSpanId: string;  // the session-type root span
  sessionKey: string;
};

type ActiveSpanState = {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
};

type TrackerDeps = {
  sink: IngestEventSink;
  config: ClawTracePluginConfig;
  logger: PluginLogger;
  idFactory?: () => string;
  nowMs?: () => number;
};

type EmitInput = {
  eventType: IngestEventType;
  traceId: string;
  spanId: string;
  parentSpanId?: string | null;
  tsMs?: number;
  payload?: Record<string, unknown>;
};

const pruneUndefined = (input: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    out[key] = value;
  }
  return out;
};

const toIso = (tsMs: number): string => new Date(tsMs).toISOString();

/**
 * Parse the OpenClaw sessionKey to extract the agent identity.
 *
 * Format: agent:<agentId>:<target>
 * Examples:
 *   "agent:main:main"           → agentName="main",   isSubAgent=false
 *   "agent:coding:main"         → agentName="coding",  isSubAgent=false
 *   "agent:main:subagent:550e…" → agentName="main",   isSubAgent=true
 *   "agent:codex:acp:123…"     → agentName="codex",  isSubAgent=true
 *   "unknown"                   → agentName="unknown", isSubAgent=false
 */
function parseAgentIdentity(sessionKey: string): { agentName: string; isSubAgent: boolean } {
  const parts = sessionKey.split(":");
  const agentName = parts.length >= 2 && parts[0] === "agent" ? parts[1] : sessionKey;
  const isSubAgent = parts.includes("subagent") || parts.includes("acp");
  return { agentName, isSubAgent };
}

export class HookEventTracker {
  /** Session metadata (no trace boundary — just agentId + sessionKey). */
  private readonly sessions = new Map<string, SessionMeta>();

  /**
   * Active agent loops keyed by runId.
   * Each entry is one trace (traceId = runId).
   */
  private readonly activeRuns = new Map<string, RunState>();

  /** In-flight tool calls keyed by toolCallId. */
  private readonly tools = new Map<string, ActiveSpanState>();
  private readonly anonymousToolQueues = new Map<string, string[]>();
  /** Recovers sessionKey when OpenClaw omits it from after_tool_call ctx. */
  private readonly toolCallIdToSessionKey = new Map<string, string>();
  private syntheticToolCallCounter = 0;

  /** In-flight subagent spawns keyed by childSessionKey. */
  private readonly subagents = new Map<string, ActiveSpanState>();

  private readonly sink: IngestEventSink;
  private readonly config: ClawTracePluginConfig;
  private readonly logger: PluginLogger;
  private readonly idFactory: () => string;
  private readonly nowMs: () => number;

  constructor(deps: TrackerDeps) {
    this.sink = deps.sink;
    this.config = deps.config;
    this.logger = deps.logger;
    this.idFactory = deps.idFactory ?? randomId;
    this.nowMs = deps.nowMs ?? Date.now;
  }

  // ── Session lifecycle (metadata only — no trace boundary) ───────────────

  onSessionStart(event: SessionStartEvent, ctx: SessionContext): void {
    const sessionKey = this.sessionKeyFrom(event, ctx);
    this.sessions.set(sessionKey, { agentId: ctx.agentId, sessionKey });
  }

  onSessionEnd(event: SessionEndEvent, ctx: SessionContext): void {
    const sessionKey = this.sessionKeyFrom(event, ctx);

    // Emit session_end for every still-active run in this session
    for (const [runId, run] of this.activeRuns) {
      if (run.sessionKey === sessionKey) {
        this.emit({
          eventType: "session_end",
          traceId: run.traceId,
          spanId: run.rootSpanId,
          parentSpanId: null,
          payload: pruneUndefined({
            sessionId: event.sessionId,
            sessionKey,
            messageCount: event.messageCount,
            durationMs: event.durationMs,
            hook: "session_end",
          }),
        });
        this.cleanupRunState(runId);
      }
    }

    this.sessions.delete(sessionKey);
  }

  // ── Agent loop lifecycle ────────────────────────────────────────────────

  /**
   * Fires when the agent finishes its turn (all tool calls done, reply sent).
   * Emits session_end to close this run's trace.
   */
  onAgentEnd(event: AgentEndEvent, ctx: AgentEndContext): void {
    const runId = ctx.runId;
    if (!runId) return;
    const run = this.activeRuns.get(runId);
    if (!run) return;

    this.emit({
      eventType: "session_end",
      traceId: run.traceId,
      spanId: run.rootSpanId,
      parentSpanId: null,
      payload: pruneUndefined({
        sessionKey: run.sessionKey,
        hook: "agent_end",
      }),
    });

    this.cleanupRunState(runId);
  }

  // ── LLM hooks ───────────────────────────────────────────────────────────

  onLlmInput(event: LlmInputEvent, ctx: AgentContext): void {
    const sessionKey = this.sessionKeyFrom({ sessionId: event.sessionId }, ctx);
    const run = this.ensureRun(event.runId, sessionKey, ctx);

    const span: ActiveSpanState = {
      traceId: run.traceId,
      spanId: this.idFactory(),
      parentSpanId: run.rootSpanId,
    };
    // Store so llm_output can close the same span
    this.tools.set(`llm:${event.runId}`, span);

    this.emit({
      eventType: "llm_before_call",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      payload: pruneUndefined({
        runId: event.runId,
        sessionId: event.sessionId,
        sessionKey,
        provider: event.provider,
        model: event.model,
        systemPrompt: this.config.includePrompts ? event.systemPrompt : undefined,
        prompt: this.config.includePrompts ? event.prompt : undefined,
        historyMessagesCount: event.historyMessages.length,
        imagesCount: event.imagesCount,
        hook: "llm_input",
      }),
    });
  }

  onLlmOutput(event: LlmOutputEvent, ctx: AgentContext): void {
    const sessionKey = this.sessionKeyFrom({ sessionId: event.sessionId }, ctx);
    const run = this.ensureRun(event.runId, sessionKey, ctx);

    // Recover the span opened by llm_input, or create a new one
    const llmSpan = this.tools.get(`llm:${event.runId}`);
    const span = llmSpan ?? {
      traceId: run.traceId,
      spanId: this.idFactory(),
      parentSpanId: run.rootSpanId,
    };
    this.tools.delete(`llm:${event.runId}`);

    this.emit({
      eventType: "llm_after_call",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      payload: pruneUndefined({
        runId: event.runId,
        sessionId: event.sessionId,
        sessionKey,
        provider: event.provider,
        model: event.model,
        assistantTexts: event.assistantTexts,
        lastAssistant: event.lastAssistant,
        usage: event.usage,
        hook: "llm_output",
      }),
    });
  }

  // ── Tool hooks ──────────────────────────────────────────────────────────

  onBeforeToolCall(event: BeforeToolCallEvent, ctx: ToolContext): void {
    const sessionKey = this.sessionKeyFrom({}, ctx);
    const runId = event.runId ?? ctx.runId;
    const run = runId ? this.activeRuns.get(runId) : undefined;
    // Parent under the current LLM span if one is active, otherwise root
    const llmSpan = runId ? this.tools.get(`llm:${runId}`) : undefined;
    const parentSpanId = llmSpan?.spanId ?? run?.rootSpanId ?? null;
    const traceId = run?.traceId ?? runId ?? this.idFactory();

    const toolCallId = this.resolveToolCallId(event, ctx) ?? `anon-tool-${this.idFactory()}`;
    const span: ActiveSpanState = {
      traceId,
      spanId: this.idFactory(),
      parentSpanId,
    };
    this.tools.set(toolCallId, span);
    this.toolCallIdToSessionKey.set(toolCallId, sessionKey);

    this.emit({
      eventType: "tool_before_call",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      payload: pruneUndefined({
        runId: runId,
        toolCallId,
        sessionKey,
        toolName: event.toolName,
        params: event.params,
        hook: "before_tool_call",
      }),
    });
  }

  onAfterToolCall(event: AfterToolCallEvent, ctx: ToolContext): void {
    const toolCallId = this.resolveToolCallId(event, ctx, true);
    const ctxSessionKey = this.sessionKeyFrom({}, ctx);
    const sessionKey =
      ctxSessionKey === "unknown" && toolCallId
        ? (this.toolCallIdToSessionKey.get(toolCallId) ?? ctxSessionKey)
        : ctxSessionKey;
    if (toolCallId) this.toolCallIdToSessionKey.delete(toolCallId);

    const runId = event.runId ?? ctx.runId;
    const run = runId ? this.activeRuns.get(runId) : undefined;

    const span =
      (toolCallId ? this.tools.get(toolCallId) : undefined) ??
      (run
        ? { traceId: run.traceId, spanId: this.idFactory(), parentSpanId: run.rootSpanId }
        : { traceId: runId ?? this.idFactory(), spanId: this.idFactory(), parentSpanId: null });

    this.emit({
      eventType: "tool_after_call",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      payload: pruneUndefined({
        runId: runId,
        toolCallId,
        sessionKey,
        toolName: event.toolName,
        params: event.params,
        result: this.config.includeToolResults ? event.result : undefined,
        error: event.error,
        durationMs: event.durationMs,
        hook: "after_tool_call",
      }),
    });

    if (event.error && this.config.emitErrorEvents) {
      this.emit({
        eventType: "error",
        traceId: span.traceId,
        spanId: this.idFactory(),
        parentSpanId: span.spanId,
        payload: {
          source: "tool_after_call",
          toolName: event.toolName,
          toolCallId,
          message: event.error,
        },
      });
    }

    if (toolCallId) this.tools.delete(toolCallId);
  }

  // ── Subagent hooks ──────────────────────────────────────────────────────

  onSubagentSpawning(event: SubagentSpawningEvent, ctx: SubagentContext): void {
    const parentRunId = ctx.runId;
    const parentRun = parentRunId ? this.activeRuns.get(parentRunId) : undefined;

    const span: ActiveSpanState = {
      traceId: parentRun?.traceId ?? parentRunId ?? this.idFactory(),
      spanId: this.idFactory(),
      parentSpanId: parentRun?.rootSpanId ?? null,
    };
    this.subagents.set(event.childSessionKey, span);
  }

  onSubagentSpawned(event: SubagentSpawnedEvent, ctx: SubagentContext): void {
    const requesterSessionKey = ctx.requesterSessionKey ?? "unknown";
    const parentRunId = ctx.runId;
    const parentRun = parentRunId ? this.activeRuns.get(parentRunId) : undefined;

    const existing = this.subagents.get(event.childSessionKey);
    const span: ActiveSpanState = existing ?? {
      traceId: parentRun?.traceId ?? parentRunId ?? this.idFactory(),
      spanId: this.idFactory(),
      parentSpanId: parentRun?.rootSpanId ?? null,
    };
    if (!existing) this.subagents.set(event.childSessionKey, span);

    this.emit({
      eventType: "subagent_spawn",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      payload: pruneUndefined({
        runId: event.runId,
        requesterSessionKey,
        childSessionKey: event.childSessionKey,
        subagentId: event.agentId,
        label: event.label,
        mode: event.mode,
        threadRequested: event.threadRequested,
        requester: event.requester,
        hook: "subagent_spawned",
      }),
    });
  }

  onSubagentEnded(event: SubagentEndedEvent, ctx: SubagentContext): void {
    const span = this.subagents.get(event.targetSessionKey);
    const parentRunId = ctx.runId;
    const parentRun = parentRunId ? this.activeRuns.get(parentRunId) : undefined;

    const resolved: ActiveSpanState =
      span ?? {
        traceId: parentRun?.traceId ?? parentRunId ?? this.idFactory(),
        spanId: this.idFactory(),
        parentSpanId: parentRun?.rootSpanId ?? null,
      };

    this.emit({
      eventType: "subagent_join",
      traceId: resolved.traceId,
      spanId: resolved.spanId,
      parentSpanId: resolved.parentSpanId,
      payload: pruneUndefined({
        runId: event.runId ?? ctx.runId,
        targetSessionKey: event.targetSessionKey,
        targetKind: event.targetKind,
        reason: event.reason,
        endedAt: event.endedAt,
        sendFarewell: event.sendFarewell,
        accountId: event.accountId,
        outcome: event.outcome,
        error: event.error,
        hook: "subagent_ended",
      }),
    });

    if (event.error && this.config.emitErrorEvents) {
      this.emit({
        eventType: "error",
        traceId: resolved.traceId,
        spanId: this.idFactory(),
        parentSpanId: resolved.spanId,
        payload: {
          source: "subagent_ended",
          targetSessionKey: event.targetSessionKey,
          message: event.error,
        },
      });
    }

    this.subagents.delete(event.targetSessionKey);
  }

  // ── Internals ───────────────────────────────────────────────────────────

  private emit(input: EmitInput): void {
    const tsMs = input.tsMs ?? this.nowMs();
    const envelope: IngestEnvelope = {
      schemaVersion: this.config.schemaVersion,
      agentId: this.config.agentId,
      event: {
        eventId: this.idFactory(),
        eventType: input.eventType,
        traceId: input.traceId,
        spanId: input.spanId,
        parentSpanId: input.parentSpanId ?? null,
        tsMs,
        payload: pruneUndefined({
          ...input.payload,
          pluginId: "clawtrace",
          collectedAtIso: toIso(tsMs),
        }),
      },
    };
    this.sink.enqueue(envelope);
  }

  /**
   * Ensure an active run exists for this runId.
   * If it's the first event for this runId, create a new trace (traceId = runId)
   * and emit a session_start root span.
   */
  private ensureRun(runId: string, sessionKey: string, ctx: AgentContext): RunState {
    const existing = this.activeRuns.get(runId);
    if (existing) return existing;

    const rootSpanId = this.idFactory();
    const run: RunState = {
      traceId: runId,
      rootSpanId,
      sessionKey,
    };
    this.activeRuns.set(runId, run);

    // Parse agent identity from sessionKey
    // Format: agent:<agentId>:<target> e.g. "agent:main:main", "agent:codex:subagent:550e..."
    const identity = parseAgentIdentity(sessionKey);

    // Emit the root span (session type) for this agent loop
    this.emit({
      eventType: "session_start",
      traceId: runId,
      spanId: rootSpanId,
      parentSpanId: null,
      payload: pruneUndefined({
        sessionKey,
        agentId: ctx.agentId,
        agentName: identity.agentName,
        isSubAgent: identity.isSubAgent || undefined,
        sessionId: ctx.sessionId,
        runId,
        hook: "agent_loop_start",
      }),
    });

    return run;
  }

  private sessionKeyFrom(
    event: { sessionKey?: string; sessionId?: string },
    ctx: { sessionKey?: string; sessionId?: string },
  ): string {
    return event.sessionKey ?? ctx.sessionKey ?? event.sessionId ?? ctx.sessionId ?? "unknown";
  }

  private cleanupRunState(runId: string): void {
    const run = this.activeRuns.get(runId);
    if (!run) return;
    this.activeRuns.delete(runId);

    // Clean up tool/subagent state associated with this trace
    for (const [key, span] of this.tools) {
      if (span.traceId === run.traceId) this.tools.delete(key);
    }
    for (const [key, span] of this.subagents) {
      if (span.traceId === run.traceId) this.subagents.delete(key);
    }
    for (const [key] of this.anonymousToolQueues) {
      if (key.endsWith(`::${run.sessionKey}`)) this.anonymousToolQueues.delete(key);
    }
    for (const [key, sk] of this.toolCallIdToSessionKey) {
      if (sk === run.sessionKey) this.toolCallIdToSessionKey.delete(key);
    }
  }

  private resolveToolCallId(
    event: { runId?: string; toolName: string; toolCallId?: string },
    ctx: { runId?: string; toolName?: string; toolCallId?: string; sessionKey?: string; sessionId?: string },
    consumeAnonymous = false,
  ): string | undefined {
    const explicit = event.toolCallId ?? ctx.toolCallId;
    if (explicit) return explicit;

    const queueKey = this.anonymousQueueKey(event.runId ?? ctx.runId, event.toolName, ctx);
    const queue = this.anonymousToolQueues.get(queueKey) ?? [];
    this.anonymousToolQueues.set(queueKey, queue);

    if (consumeAnonymous) {
      const id = queue.shift();
      if (id) return id;
      const prefix = `${event.runId ?? ctx.runId ?? "run:unknown"}::${event.toolName}::`;
      for (const [key, q] of this.anonymousToolQueues) {
        if (key !== queueKey && key.startsWith(prefix) && q.length > 0) {
          return q.shift();
        }
      }
      return undefined;
    }

    this.syntheticToolCallCounter += 1;
    const generated = `anon-${this.syntheticToolCallCounter}-${this.idFactory()}`;
    queue.push(generated);
    return generated;
  }

  private anonymousQueueKey(
    runId: string | undefined,
    toolName: string,
    ctx: { sessionKey?: string; sessionId?: string },
  ): string {
    const sessionPart = ctx.sessionKey ?? ctx.sessionId ?? "unknown";
    return `${runId ?? "run:unknown"}::${toolName}::${sessionPart}`;
  }
}
