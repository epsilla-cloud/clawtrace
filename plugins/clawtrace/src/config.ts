import { isUuid } from "./id.js";
import { DEFAULT_INGEST_ENDPOINT } from "./setup.js";
import type { ClawTracePluginConfig, PluginLogger } from "./types.js";

const DEFAULTS = {
  enabled: true,
  schemaVersion: 1,
  requestTimeoutMs: 5000,
  maxRetries: 2,
  retryBackoffMs: 250,
  maxQueueSize: 2000,
  emitErrorEvents: true,
  includePrompts: true,
  includeToolResults: true,
} as const;

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const asBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
};

const asInt = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const maybeWarn = (logger: PluginLogger, message: string): void => {
  logger.warn?.(message);
};

export const resolvePluginConfig = (
  rawPluginConfig: Record<string, unknown> | undefined,
  env: Record<string, string | undefined>,
  logger: PluginLogger,
): ClawTracePluginConfig => {
  const cfg = rawPluginConfig ?? {};
  const enabled = asBoolean(cfg.enabled) ?? asBoolean(env.CLAWTRACE_ENABLED) ?? DEFAULTS.enabled;

  const endpoint = asString(cfg.endpoint) ?? asString(env.CLAWTRACE_ENDPOINT) ?? DEFAULT_INGEST_ENDPOINT;
  const apiKey = asString(cfg.apiKey) ?? asString(env.CLAWTRACE_API_KEY) ?? "";
  const agentId = asString(cfg.agentId) ?? asString(env.CLAWTRACE_AGENT_ID) ?? "";

  const schemaVersion = clamp(
    asInt(cfg.schemaVersion) ?? asInt(env.CLAWTRACE_SCHEMA_VERSION) ?? DEFAULTS.schemaVersion,
    1,
    1000,
  );
  const requestTimeoutMs = clamp(
    asInt(cfg.requestTimeoutMs) ?? asInt(env.CLAWTRACE_REQUEST_TIMEOUT_MS) ?? DEFAULTS.requestTimeoutMs,
    500,
    60000,
  );
  const maxRetries = clamp(asInt(cfg.maxRetries) ?? asInt(env.CLAWTRACE_MAX_RETRIES) ?? DEFAULTS.maxRetries, 0, 10);
  const retryBackoffMs = clamp(
    asInt(cfg.retryBackoffMs) ?? asInt(env.CLAWTRACE_RETRY_BACKOFF_MS) ?? DEFAULTS.retryBackoffMs,
    50,
    10000,
  );
  const maxQueueSize = clamp(
    asInt(cfg.maxQueueSize) ?? asInt(env.CLAWTRACE_MAX_QUEUE_SIZE) ?? DEFAULTS.maxQueueSize,
    10,
    100000,
  );
  const emitErrorEvents =
    asBoolean(cfg.emitErrorEvents) ?? asBoolean(env.CLAWTRACE_EMIT_ERROR_EVENTS) ?? DEFAULTS.emitErrorEvents;
  const includePrompts = asBoolean(cfg.includePrompts) ?? asBoolean(env.CLAWTRACE_INCLUDE_PROMPTS) ?? DEFAULTS.includePrompts;
  const includeToolResults =
    asBoolean(cfg.includeToolResults) ??
    asBoolean(env.CLAWTRACE_INCLUDE_TOOL_RESULTS) ??
    DEFAULTS.includeToolResults;

  if (enabled) {
    if (!endpoint) maybeWarn(logger, "[clawtrace] Missing config: endpoint (or env CLAWTRACE_ENDPOINT).");
    if (!apiKey) maybeWarn(logger, "[clawtrace] Missing config: apiKey (or env CLAWTRACE_API_KEY).");
    if (!agentId) maybeWarn(logger, "[clawtrace] Missing config: agentId (or env CLAWTRACE_AGENT_ID).");
    if (agentId && !isUuid(agentId)) {
      maybeWarn(logger, `[clawtrace] agentId must be UUID. Current value: ${agentId}`);
    }
  }

  const finalizedEnabled = enabled && Boolean(endpoint && apiKey && agentId && isUuid(agentId));
  if (enabled && !finalizedEnabled) {
    maybeWarn(logger, "[clawtrace] Plugin disabled at runtime due to incomplete or invalid config.");
  }

  return {
    enabled: finalizedEnabled,
    endpoint,
    apiKey,
    agentId,
    schemaVersion,
    requestTimeoutMs,
    maxRetries,
    retryBackoffMs,
    maxQueueSize,
    emitErrorEvents,
    includePrompts,
    includeToolResults,
  };
};
