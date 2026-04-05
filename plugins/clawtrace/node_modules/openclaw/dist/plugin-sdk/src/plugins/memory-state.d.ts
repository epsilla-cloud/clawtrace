import type { OpenClawConfig } from "../config/config.js";
import type { MemoryCitationsMode } from "../config/types.memory.js";
import type { MemoryEmbeddingProbeResult, MemoryProviderStatus, MemorySyncProgressUpdate } from "../plugin-sdk/memory-core-host-engine-storage.js";
export type MemoryPromptSectionBuilder = (params: {
    availableTools: Set<string>;
    citationsMode?: MemoryCitationsMode;
}) => string[];
export type MemoryFlushPlan = {
    softThresholdTokens: number;
    forceFlushTranscriptBytes: number;
    reserveTokensFloor: number;
    prompt: string;
    systemPrompt: string;
    relativePath: string;
};
export type MemoryFlushPlanResolver = (params: {
    cfg?: OpenClawConfig;
    nowMs?: number;
}) => MemoryFlushPlan | null;
export type RegisteredMemorySearchManager = {
    status(): MemoryProviderStatus;
    probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
    probeVectorAvailability(): Promise<boolean>;
    sync?(params?: {
        reason?: string;
        force?: boolean;
        sessionFiles?: string[];
        progress?: (update: MemorySyncProgressUpdate) => void;
    }): Promise<void>;
    close?(): Promise<void>;
};
export type MemoryRuntimeBackendConfig = {
    backend: "builtin" | "qmd";
    qmd?: object;
};
export type MemoryPluginRuntime = {
    getMemorySearchManager(params: {
        cfg: OpenClawConfig;
        agentId: string;
        purpose?: "default" | "status";
    }): Promise<{
        manager: RegisteredMemorySearchManager | null;
        error?: string;
    }>;
    resolveMemoryBackendConfig(params: {
        cfg: OpenClawConfig;
        agentId: string;
    }): MemoryRuntimeBackendConfig;
    closeAllMemorySearchManagers?(): Promise<void>;
};
type MemoryPluginState = {
    promptBuilder?: MemoryPromptSectionBuilder;
    flushPlanResolver?: MemoryFlushPlanResolver;
    runtime?: MemoryPluginRuntime;
};
export declare function registerMemoryPromptSection(builder: MemoryPromptSectionBuilder): void;
export declare function buildMemoryPromptSection(params: {
    availableTools: Set<string>;
    citationsMode?: MemoryCitationsMode;
}): string[];
export declare function getMemoryPromptSectionBuilder(): MemoryPromptSectionBuilder | undefined;
export declare function registerMemoryFlushPlanResolver(resolver: MemoryFlushPlanResolver): void;
export declare function resolveMemoryFlushPlan(params: {
    cfg?: OpenClawConfig;
    nowMs?: number;
}): MemoryFlushPlan | null;
export declare function getMemoryFlushPlanResolver(): MemoryFlushPlanResolver | undefined;
export declare function registerMemoryRuntime(runtime: MemoryPluginRuntime): void;
export declare function getMemoryRuntime(): MemoryPluginRuntime | undefined;
export declare function hasMemoryRuntime(): boolean;
export declare function restoreMemoryPluginState(state: MemoryPluginState): void;
export declare function clearMemoryPluginState(): void;
export declare const _resetMemoryPluginState: typeof clearMemoryPluginState;
export {};
