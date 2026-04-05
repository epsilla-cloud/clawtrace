import { type BackoffPolicy } from "../../../infra/backoff.js";
import type { EmbeddedPiAgentMeta } from "../types.js";
import { type UsageAccumulator } from "../usage-accumulator.js";
type UsageSnapshot = {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
};
export type RuntimeAuthState = {
    sourceApiKey: string;
    authMode: string;
    profileId?: string;
    expiresAt?: number;
    refreshTimer?: ReturnType<typeof setTimeout>;
    refreshInFlight?: Promise<void>;
};
export declare const RUNTIME_AUTH_REFRESH_MARGIN_MS: number;
export declare const RUNTIME_AUTH_REFRESH_RETRY_MS: number;
export declare const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS: number;
export declare const OVERLOAD_FAILOVER_BACKOFF_POLICY: BackoffPolicy;
export declare function scrubAnthropicRefusalMagic(prompt: string): string;
export declare function createCompactionDiagId(): string;
export declare function resolveMaxRunRetryIterations(profileCandidateCount: number): number;
export declare function resolveActiveErrorContext(params: {
    lastAssistant: {
        provider?: string;
        model?: string;
    } | undefined;
    provider: string;
    model: string;
}): {
    provider: string;
    model: string;
};
export declare function buildUsageAgentMetaFields(params: {
    usageAccumulator: UsageAccumulator;
    lastAssistantUsage?: UsageSnapshot | null;
    lastRunPromptUsage: UsageSnapshot | undefined;
    lastTurnTotal?: number;
}): Pick<EmbeddedPiAgentMeta, "usage" | "lastCallUsage" | "promptTokens">;
/**
 * Build agentMeta for error return paths, preserving accumulated usage so that
 * session totalTokens reflects the actual context size rather than going stale.
 * Without this, error returns omit usage and the session keeps whatever
 * totalTokens was set by the previous successful run.
 */
export declare function buildErrorAgentMeta(params: {
    sessionId: string;
    provider: string;
    model: string;
    usageAccumulator: UsageAccumulator;
    lastRunPromptUsage: UsageSnapshot | undefined;
    lastAssistant?: {
        usage?: unknown;
    } | null;
    lastTurnTotal?: number;
}): EmbeddedPiAgentMeta;
export {};
