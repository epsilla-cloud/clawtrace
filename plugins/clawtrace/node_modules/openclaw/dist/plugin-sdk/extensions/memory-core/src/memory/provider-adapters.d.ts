import { DEFAULT_GEMINI_EMBEDDING_MODEL, DEFAULT_LOCAL_MODEL, DEFAULT_MISTRAL_EMBEDDING_MODEL, DEFAULT_OLLAMA_EMBEDDING_MODEL, DEFAULT_OPENAI_EMBEDDING_MODEL, DEFAULT_VOYAGE_EMBEDDING_MODEL, type MemoryEmbeddingProviderAdapter } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
export type BuiltinMemoryEmbeddingProviderDoctorMetadata = {
    providerId: string;
    authProviderId: string;
    envVars: string[];
    transport: "local" | "remote";
    autoSelectPriority?: number;
};
declare function isMissingApiKeyError(err: unknown): boolean;
declare function formatLocalSetupError(err: unknown): string;
declare function canAutoSelectLocal(modelPath?: string): boolean;
export declare const builtinMemoryEmbeddingProviderAdapters: readonly [MemoryEmbeddingProviderAdapter, MemoryEmbeddingProviderAdapter, MemoryEmbeddingProviderAdapter, MemoryEmbeddingProviderAdapter, MemoryEmbeddingProviderAdapter, MemoryEmbeddingProviderAdapter];
export declare function getBuiltinMemoryEmbeddingProviderAdapter(id: string): MemoryEmbeddingProviderAdapter | undefined;
export declare function registerBuiltInMemoryEmbeddingProviders(register: {
    registerMemoryEmbeddingProvider: (adapter: MemoryEmbeddingProviderAdapter) => void;
}): void;
export declare function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId: string): BuiltinMemoryEmbeddingProviderDoctorMetadata | null;
export declare function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata(): Array<BuiltinMemoryEmbeddingProviderDoctorMetadata>;
export { DEFAULT_GEMINI_EMBEDDING_MODEL, DEFAULT_LOCAL_MODEL, DEFAULT_MISTRAL_EMBEDDING_MODEL, DEFAULT_OLLAMA_EMBEDDING_MODEL, DEFAULT_OPENAI_EMBEDDING_MODEL, DEFAULT_VOYAGE_EMBEDDING_MODEL, canAutoSelectLocal, formatLocalSetupError, isMissingApiKeyError, };
