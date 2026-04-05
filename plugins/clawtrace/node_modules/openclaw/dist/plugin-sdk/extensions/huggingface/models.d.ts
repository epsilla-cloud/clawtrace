import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const HUGGINGFACE_BASE_URL = "https://router.huggingface.co/v1";
export declare const HUGGINGFACE_POLICY_SUFFIXES: readonly ["cheapest", "fastest"];
export declare const HUGGINGFACE_MODEL_CATALOG: ModelDefinitionConfig[];
export declare function isHuggingfacePolicyLocked(modelRef: string): boolean;
export declare function buildHuggingfaceModelDefinition(model: (typeof HUGGINGFACE_MODEL_CATALOG)[number]): ModelDefinitionConfig;
export declare function discoverHuggingfaceModels(apiKey: string): Promise<ModelDefinitionConfig[]>;
