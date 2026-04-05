import type { EmbeddingInput } from "../../packages/memory-host-sdk/src/host/embedding-inputs.js";
import type { OpenClawConfig } from "../config/config.js";
import type { SecretInput } from "../config/types.secrets.js";
export type MemoryEmbeddingBatchChunk = {
    text: string;
    embeddingInput?: EmbeddingInput;
};
export type MemoryEmbeddingBatchOptions = {
    agentId: string;
    chunks: MemoryEmbeddingBatchChunk[];
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
    debug: (message: string, data?: Record<string, unknown>) => void;
};
export type MemoryEmbeddingProviderRuntime = {
    id: string;
    cacheKeyData?: Record<string, unknown>;
    batchEmbed?: (options: MemoryEmbeddingBatchOptions) => Promise<number[][] | null>;
};
export type MemoryEmbeddingProvider = {
    id: string;
    model: string;
    maxInputTokens?: number;
    embedQuery: (text: string) => Promise<number[]>;
    embedBatch: (texts: string[]) => Promise<number[][]>;
    embedBatchInputs?: (inputs: EmbeddingInput[]) => Promise<number[][]>;
};
export type MemoryEmbeddingProviderCreateOptions = {
    config: OpenClawConfig;
    agentDir?: string;
    remote?: {
        baseUrl?: string;
        apiKey?: SecretInput;
        headers?: Record<string, string>;
    };
    model: string;
    local?: {
        modelPath?: string;
        modelCacheDir?: string;
    };
    outputDimensionality?: number;
};
export type MemoryEmbeddingProviderCreateResult = {
    provider: MemoryEmbeddingProvider | null;
    runtime?: MemoryEmbeddingProviderRuntime;
};
export type MemoryEmbeddingProviderAdapter = {
    id: string;
    defaultModel?: string;
    transport?: "local" | "remote";
    autoSelectPriority?: number;
    allowExplicitWhenConfiguredAuto?: boolean;
    supportsMultimodalEmbeddings?: (params: {
        model: string;
    }) => boolean;
    create: (options: MemoryEmbeddingProviderCreateOptions) => Promise<MemoryEmbeddingProviderCreateResult>;
    formatSetupError?: (err: unknown) => string;
    shouldContinueAutoSelection?: (err: unknown) => boolean;
};
export type RegisteredMemoryEmbeddingProvider = {
    adapter: MemoryEmbeddingProviderAdapter;
    ownerPluginId?: string;
};
export declare function registerMemoryEmbeddingProvider(adapter: MemoryEmbeddingProviderAdapter, options?: {
    ownerPluginId?: string;
}): void;
export declare function getRegisteredMemoryEmbeddingProvider(id: string): RegisteredMemoryEmbeddingProvider | undefined;
export declare function getMemoryEmbeddingProvider(id: string): MemoryEmbeddingProviderAdapter | undefined;
export declare function listRegisteredMemoryEmbeddingProviders(): RegisteredMemoryEmbeddingProvider[];
export declare function listMemoryEmbeddingProviders(): MemoryEmbeddingProviderAdapter[];
export declare function restoreMemoryEmbeddingProviders(adapters: MemoryEmbeddingProviderAdapter[]): void;
export declare function restoreRegisteredMemoryEmbeddingProviders(entries: RegisteredMemoryEmbeddingProvider[]): void;
export declare function clearMemoryEmbeddingProviders(): void;
export declare const _resetMemoryEmbeddingProviders: typeof clearMemoryEmbeddingProviders;
