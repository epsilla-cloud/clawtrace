import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const TOGETHER_BASE_URL = "https://api.together.xyz/v1";
export declare const TOGETHER_MODEL_CATALOG: ModelDefinitionConfig[];
export declare function buildTogetherModelDefinition(model: (typeof TOGETHER_MODEL_CATALOG)[number]): ModelDefinitionConfig;
