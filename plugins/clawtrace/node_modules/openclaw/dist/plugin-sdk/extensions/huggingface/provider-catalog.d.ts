import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
export { buildHuggingfaceModelDefinition, discoverHuggingfaceModels, HUGGINGFACE_BASE_URL, HUGGINGFACE_MODEL_CATALOG, } from "./models.js";
export declare function buildHuggingfaceProvider(discoveryApiKey?: string): Promise<ModelProviderConfig>;
