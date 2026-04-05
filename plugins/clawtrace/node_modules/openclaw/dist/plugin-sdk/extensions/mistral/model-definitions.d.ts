import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";
export declare const MISTRAL_DEFAULT_MODEL_ID = "mistral-large-latest";
export declare const MISTRAL_DEFAULT_MODEL_REF = "mistral/mistral-large-latest";
export declare const MISTRAL_DEFAULT_CONTEXT_WINDOW = 262144;
export declare const MISTRAL_DEFAULT_MAX_TOKENS = 16384;
export declare const MISTRAL_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare function buildMistralModelDefinition(): ModelDefinitionConfig;
export declare function buildMistralCatalogModels(): ModelDefinitionConfig[];
