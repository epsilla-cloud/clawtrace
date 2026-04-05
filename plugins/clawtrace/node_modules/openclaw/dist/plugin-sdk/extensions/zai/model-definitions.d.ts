import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const ZAI_CODING_GLOBAL_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
export declare const ZAI_CODING_CN_BASE_URL = "https://open.bigmodel.cn/api/coding/paas/v4";
export declare const ZAI_GLOBAL_BASE_URL = "https://api.z.ai/api/paas/v4";
export declare const ZAI_CN_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
export declare const ZAI_DEFAULT_MODEL_ID = "glm-5";
export declare const ZAI_DEFAULT_MODEL_REF = "zai/glm-5";
export declare const ZAI_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare function resolveZaiBaseUrl(endpoint?: string): string;
export declare function buildZaiModelDefinition(params: {
    id: string;
    name?: string;
    reasoning?: boolean;
    input?: ModelDefinitionConfig["input"];
    cost?: ModelDefinitionConfig["cost"];
    contextWindow?: number;
    maxTokens?: number;
}): ModelDefinitionConfig;
