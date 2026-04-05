import type { OpenClawConfig } from "../../../config/config.js";
export declare const ATTEMPT_CACHE_TTL_CUSTOM_TYPE = "openclaw.cache-ttl";
export declare function composeSystemPromptWithHookContext(params: {
    baseSystemPrompt?: string;
    prependSystemContext?: string;
    appendSystemContext?: string;
}): string | undefined;
export declare function resolveAttemptSpawnWorkspaceDir(params: {
    sandbox?: {
        enabled?: boolean;
        workspaceAccess?: string;
    } | null;
    resolvedWorkspace: string;
}): string | undefined;
export declare function shouldUseOpenAIWebSocketTransport(params: {
    provider: string;
    modelApi?: string | null;
}): boolean;
export declare function shouldAppendAttemptCacheTtl(params: {
    timedOutDuringCompaction: boolean;
    compactionOccurredThisAttempt: boolean;
    config?: OpenClawConfig;
    provider: string;
    modelId: string;
    isCacheTtlEligibleProvider: (provider: string, modelId: string) => boolean;
}): boolean;
export declare function appendAttemptCacheTtlIfNeeded(params: {
    sessionManager: {
        appendCustomEntry?: (customType: string, data: unknown) => void;
    };
    timedOutDuringCompaction: boolean;
    compactionOccurredThisAttempt: boolean;
    config?: OpenClawConfig;
    provider: string;
    modelId: string;
    isCacheTtlEligibleProvider: (provider: string, modelId: string) => boolean;
    now?: number;
}): boolean;
