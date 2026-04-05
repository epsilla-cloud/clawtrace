import type { ModelDefinitionConfig, ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const MODELSTUDIO_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";
export declare const MODELSTUDIO_GLOBAL_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";
export declare const MODELSTUDIO_CN_BASE_URL = "https://coding.dashscope.aliyuncs.com/v1";
export declare const MODELSTUDIO_STANDARD_CN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
export declare const MODELSTUDIO_STANDARD_GLOBAL_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
export declare const MODELSTUDIO_DEFAULT_MODEL_ID = "qwen3.5-plus";
export declare const MODELSTUDIO_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare const MODELSTUDIO_DEFAULT_MODEL_REF = "modelstudio/qwen3.5-plus";
export declare const MODELSTUDIO_MODEL_CATALOG: ReadonlyArray<ModelDefinitionConfig>;
export declare function isNativeModelStudioBaseUrl(baseUrl: string | undefined): boolean;
export declare function applyModelStudioNativeStreamingUsageCompat(provider: ModelProviderConfig): ModelProviderConfig;
export declare function buildModelStudioModelDefinition(params: {
    id: string;
    name?: string;
    reasoning?: boolean;
    input?: string[];
    cost?: ModelDefinitionConfig["cost"];
    contextWindow?: number;
    maxTokens?: number;
}): ModelDefinitionConfig;
export declare function buildModelStudioDefaultModelDefinition(): ModelDefinitionConfig;
