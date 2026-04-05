import type { KilocodeModelCatalogEntry } from "openclaw/plugin-sdk/provider-model-shared";
import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const KILOCODE_BASE_URL = "https://api.kilo.ai/api/gateway/";
export declare const KILOCODE_DEFAULT_MODEL_ID = "kilo/auto";
export declare const KILOCODE_DEFAULT_MODEL_REF = "kilocode/kilo/auto";
export declare const KILOCODE_DEFAULT_MODEL_NAME = "Kilo Auto";
export declare const KILOCODE_MODEL_CATALOG: KilocodeModelCatalogEntry[];
export declare const KILOCODE_DEFAULT_CONTEXT_WINDOW = 1000000;
export declare const KILOCODE_DEFAULT_MAX_TOKENS = 128000;
export declare const KILOCODE_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare const KILOCODE_MODELS_URL = "https://api.kilo.ai/api/gateway/models";
export declare function discoverKilocodeModels(): Promise<ModelDefinitionConfig[]>;
export declare function buildKilocodeModelDefinition(): ModelDefinitionConfig;
