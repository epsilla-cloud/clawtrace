import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const CHUTES_BASE_URL = "https://llm.chutes.ai/v1";
export declare const CHUTES_DEFAULT_MODEL_ID = "zai-org/GLM-4.7-TEE";
export declare const CHUTES_DEFAULT_MODEL_REF = "chutes/zai-org/GLM-4.7-TEE";
export declare const CHUTES_MODEL_CATALOG: ModelDefinitionConfig[];
export declare function buildChutesModelDefinition(model: (typeof CHUTES_MODEL_CATALOG)[number]): ModelDefinitionConfig;
export declare function discoverChutesModels(accessToken?: string): Promise<ModelDefinitionConfig[]>;
