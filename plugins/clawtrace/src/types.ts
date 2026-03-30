export type IngestEventType =
  | "session_start"
  | "session_end"
  | "span_start"
  | "span_end"
  | "llm_before_call"
  | "llm_after_call"
  | "tool_before_call"
  | "tool_after_call"
  | "subagent_spawn"
  | "subagent_join"
  | "error";

export type IngestEventPayload = Record<string, unknown>;

export type IngestEvent = {
  eventId: string;
  eventType: IngestEventType;
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  tsMs: number;
  payload: IngestEventPayload;
};

export type IngestEnvelope = {
  schemaVersion: number;
  agentId: string;
  event: IngestEvent;
};

export type PluginLogger = {
  debug?: (message: string) => void;
  info?: (message: string) => void;
  warn?: (message: string) => void;
  error?: (message: string) => void;
};

export type ClawTracePluginConfig = {
  enabled: boolean;
  endpoint: string;
  observeKey: string;
  apiKey: string;
  tenantId: string;
  agentId: string;
  schemaVersion: number;
  requestTimeoutMs: number;
  maxRetries: number;
  retryBackoffMs: number;
  maxQueueSize: number;
  emitErrorEvents: boolean;
  includePrompts: boolean;
  includeToolResults: boolean;
};
