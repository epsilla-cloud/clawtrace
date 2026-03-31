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

type SubagentSpawningEvent = {
  childSessionKey: string;
  agentId: string;
  label?: string;
  mode: "run" | "session";
  threadRequested: boolean;
  requester?: { channel?: string; accountId?: string; to?: string; threadId?: string | number };
};

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

type SessionState = {
  traceId: string;
  spanId: string;
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

export class HookEventTracker {
  private readonly sessions = new Map<string, SessionState>();
  private readonly runs = new Map<string, ActiveSpanState>();
  private readonly tools = new Map<string, ActiveSpanState>();
  private readonly anonymousToolQueues = new Map<string, string[]>();
  private readonly subagents = new Map<string, ActiveSpanState>();
  // Populated at before_tool_call; consumed at after_tool_call to recover
  // session context when OpenClaw omits it from the after hook ctx.
  private readonly toolCallIdToSessionKey = new Map<string, string>();
  private syntheticToolCallCounter = 0;

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

  onSessionStart(event: SessionStartEvent, ctx: SessionContext): void {
    const sessionKey = this.sessionKeyFrom(event, ctx);
    const state: SessionState = {
      traceId: this.idFactory(),
      spanId: this.idFactory(),
      sessionKey,
    };
    this.sessions.set(sessionKey, state);

    this.emit({
      eventType: "session_start",
      traceId: state.traceId,
      spanId: state.spanId,
      parentSpanId: null,
      payload: pruneUndefined({
        sessionId: event.sessionId,
        sessionKey,
        resumedFrom: event.resumedFrom,
        hook: "session_start",
      }),
    });
  }

  onSessionEnd(event: SessionEndEvent, ctx: SessionContext): void {
    const sessionKey = this.sessionKeyFrom(event, ctx);
    const state = this.ensureSession(sessionKey, { sessionId: event.sessionId });

    this.emit({
      eventType: "session_end",
      traceId: state.traceId,
      spanId: state.spanId,
      parentSpanId: null,
      payload: pruneUndefined({
        sessionId: event.sessionId,
        sessionKey,
        messageCount: event.messageCount,
        durationMs: event.durationMs,
        hook: "session_end",
      }),
    });

    this.sessions.delete(sessionKey);
    this.cleanupSessionState(state.traceId, sessionKey);
  }

  onLlmInput(event: LlmInputEvent, ctx: AgentContext): void {
    const sessionKey = this.sessionKeyFrom({ sessionId: event.sessionId }, ctx);
    const session = this.ensureSession(sessionKey, { sessionId: event.sessionId });

    const span: ActiveSpanState = {
      traceId: session.traceId,
      spanId: this.idFactory(),
      parentSpanId: session.spanId,
    };
    this.runs.set(event.runId, span);

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
    const run = this.runs.get(event.runId);
    const sessionKey = this.sessionKeyFrom({ sessionId: event.sessionId }, ctx);
    const fallbackSession = this.ensureSession(sessionKey, { sessionId: event.sessionId });
    const span = run ?? {
      traceId: fallbackSession.traceId,
      spanId: this.idFactory(),
      parentSpanId: fallbackSession.spanId,
    };

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

    this.runs.delete(event.runId);
  }

  onBeforeToolCall(event: BeforeToolCallEvent, ctx: ToolContext): void {
    const sessionKey = this.sessionKeyFrom({}, ctx);
    const session = this.ensureSession(sessionKey, {});
    const run = event.runId ? this.runs.get(event.runId) : undefined;
    const parentSpanId = run?.spanId ?? session.spanId;

    const toolCallId = this.resolveToolCallId(event, ctx) ?? `anon-tool-${this.idFactory()}`;
    const span: ActiveSpanState = {
      traceId: run?.traceId ?? session.traceId,
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
        runId: event.runId ?? ctx.runId,
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
    // OpenClaw does not populate session ctx on after_tool_call — recover from
    // the sessionKey stored when the matching before_tool_call was processed.
    const ctxSessionKey = this.sessionKeyFrom({}, ctx);
    const sessionKey =
      ctxSessionKey === "unknown" && toolCallId
        ? (this.toolCallIdToSessionKey.get(toolCallId) ?? ctxSessionKey)
        : ctxSessionKey;
    if (toolCallId) this.toolCallIdToSessionKey.delete(toolCallId);
    const session = this.ensureSession(sessionKey, {});
    const run = event.runId ? this.runs.get(event.runId) : undefined;
    const span =
      (toolCallId ? this.tools.get(toolCallId) : undefined) ??
      (run
        ? {
            traceId: run.traceId,
            spanId: this.idFactory(),
            parentSpanId: run.spanId,
          }
        : {
            traceId: session.traceId,
            spanId: this.idFactory(),
            parentSpanId: session.spanId,
          });

    this.emit({
      eventType: "tool_after_call",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      payload: pruneUndefined({
        runId: event.runId ?? ctx.runId,
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

  onSubagentSpawning(event: SubagentSpawningEvent, ctx: SubagentContext): void {
    const requesterSessionKey = ctx.requesterSessionKey ?? "unknown";
    const session = this.ensureSession(requesterSessionKey, {});
    const span: ActiveSpanState = {
      traceId: session.traceId,
      spanId: this.idFactory(),
      parentSpanId: session.spanId,
    };
    this.subagents.set(event.childSessionKey, span);

    this.emit({
      eventType: "subagent_spawn",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      payload: pruneUndefined({
        runId: ctx.runId,
        requesterSessionKey,
        childSessionKey: event.childSessionKey,
        subagentId: event.agentId,
        label: event.label,
        mode: event.mode,
        threadRequested: event.threadRequested,
        requester: event.requester,
        hook: "subagent_spawning",
      }),
    });
  }

  onSubagentEnded(event: SubagentEndedEvent, ctx: SubagentContext): void {
    const span = this.subagents.get(event.targetSessionKey);
    const fallbackSession = this.ensureSession(ctx.requesterSessionKey ?? "unknown", {});
    const resolved =
      span ??
      ({
        traceId: fallbackSession.traceId,
        spanId: this.idFactory(),
        parentSpanId: fallbackSession.spanId,
      } as ActiveSpanState);

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

  private sessionKeyFrom(
    event: { sessionKey?: string; sessionId?: string },
    ctx: { sessionKey?: string; sessionId?: string },
  ): string {
    return event.sessionKey ?? ctx.sessionKey ?? event.sessionId ?? ctx.sessionId ?? "unknown";
  }

  private ensureSession(sessionKey: string, payload: Record<string, unknown>): SessionState {
    const existing = this.sessions.get(sessionKey);
    if (existing) return existing;

    const synthetic: SessionState = {
      traceId: this.idFactory(),
      spanId: this.idFactory(),
      sessionKey,
    };
    this.sessions.set(sessionKey, synthetic);

    this.logger.warn?.(`[clawtrace] Missing explicit session_start for ${sessionKey}; emitting synthetic session_start.`);
    this.emit({
      eventType: "session_start",
      traceId: synthetic.traceId,
      spanId: synthetic.spanId,
      parentSpanId: null,
      payload: pruneUndefined({
        sessionKey,
        synthetic: true,
        syntheticReason: "session_state_missing",
        ...payload,
      }),
    });

    return synthetic;
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
      // Fallback: OpenClaw may omit session context on after_tool_call, causing
      // a different queue key than was used at before_tool_call. Scan for any
      // queue matching runId::toolName regardless of session part.
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

  private cleanupSessionState(traceId: string, sessionKey: string): void {
    const runKeysToDelete: string[] = [];
    for (const [runId, run] of this.runs) {
      if (run.traceId === traceId) {
        runKeysToDelete.push(runId);
      }
    }
    for (const runId of runKeysToDelete) this.runs.delete(runId);

    const toolKeysToDelete: string[] = [];
    for (const [toolCallId, tool] of this.tools) {
      if (tool.traceId === traceId) {
        toolKeysToDelete.push(toolCallId);
      }
    }
    for (const toolCallId of toolKeysToDelete) this.tools.delete(toolCallId);

    const subagentKeysToDelete: string[] = [];
    for (const [childSessionKey, subagent] of this.subagents) {
      if (subagent.traceId === traceId) {
        subagentKeysToDelete.push(childSessionKey);
      }
    }
    for (const childSessionKey of subagentKeysToDelete) this.subagents.delete(childSessionKey);

    const anonymousQueueKeysToDelete: string[] = [];
    for (const queueKey of this.anonymousToolQueues.keys()) {
      if (queueKey.endsWith(`::${sessionKey}`)) {
        anonymousQueueKeysToDelete.push(queueKey);
      }
    }
    for (const queueKey of anonymousQueueKeysToDelete) this.anonymousToolQueues.delete(queueKey);

    const toolCallIdsToDelete: string[] = [];
    for (const [toolCallId, sk] of this.toolCallIdToSessionKey) {
      if (sk === sessionKey) toolCallIdsToDelete.push(toolCallId);
    }
    for (const id of toolCallIdsToDelete) this.toolCallIdToSessionKey.delete(id);
  }
}
