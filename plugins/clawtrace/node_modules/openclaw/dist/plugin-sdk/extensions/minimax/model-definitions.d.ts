import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
export declare const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
export declare const MINIMAX_CN_API_BASE_URL = "https://api.minimaxi.com/anthropic";
export declare const MINIMAX_HOSTED_MODEL_ID = "MiniMax-M2.7";
export declare const MINIMAX_HOSTED_MODEL_REF = "minimax/MiniMax-M2.7";
export declare const DEFAULT_MINIMAX_CONTEXT_WINDOW = 204800;
export declare const DEFAULT_MINIMAX_MAX_TOKENS = 131072;
export declare const MINIMAX_API_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare const MINIMAX_HOSTED_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare const MINIMAX_LM_STUDIO_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare function buildMinimaxModelDefinition(params: {
    id: string;
    name?: string;
    reasoning?: boolean;
    cost: ModelDefinitionConfig["cost"];
    contextWindow: number;
    maxTokens: number;
}): ModelDefinitionConfig;
export declare function buildMinimaxApiModelDefinition(modelId: string): ModelDefinitionConfig;
