import type { OpenClawConfig } from "openclaw/plugin-sdk/provider-auth";
import { type SsrFPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
export type OllamaEmbeddingProvider = {
    id: string;
    model: string;
    maxInputTokens?: number;
    embedQuery: (text: string) => Promise<number[]>;
    embedBatch: (texts: string[]) => Promise<number[][]>;
};
type OllamaEmbeddingOptions = {
    config: OpenClawConfig;
    agentDir?: string;
    provider?: string;
    remote?: {
        baseUrl?: string;
        apiKey?: unknown;
        headers?: Record<string, string>;
    };
    model: string;
    fallback?: string;
    local?: unknown;
    outputDimensionality?: number;
    taskType?: unknown;
};
export type OllamaEmbeddingClient = {
    baseUrl: string;
    headers: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
    model: string;
    embedBatch: (texts: string[]) => Promise<number[][]>;
};
export declare const DEFAULT_OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";
export declare function createOllamaEmbeddingProvider(options: OllamaEmbeddingOptions): Promise<{
    provider: OllamaEmbeddingProvider;
    client: OllamaEmbeddingClient;
}>;
export {};
