import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
export declare const DEEPSEEK_MODEL_CATALOG: ModelDefinitionConfig[];
export declare function buildDeepSeekModelDefinition(model: (typeof DEEPSEEK_MODEL_CATALOG)[number]): ModelDefinitionConfig;
