import type { ModelCompatConfig } from "openclaw/plugin-sdk/provider-model-shared";
export { buildXaiProvider } from "./provider-catalog.js";
export { applyXaiConfig, applyXaiProviderConfig } from "./onboard.js";
export { buildXaiCatalogModels, buildXaiModelDefinition, resolveXaiCatalogEntry, XAI_BASE_URL, XAI_DEFAULT_CONTEXT_WINDOW, XAI_DEFAULT_MODEL_ID, XAI_DEFAULT_MODEL_REF, XAI_DEFAULT_MAX_TOKENS, } from "./model-definitions.js";
export { isModernXaiModel, resolveXaiForwardCompatModel } from "./provider-models.js";
export { normalizeXaiModelId } from "./model-id.js";
export declare const XAI_TOOL_SCHEMA_PROFILE = "xai";
export declare const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING = "html-entities";
export declare function resolveXaiModelCompatPatch(): ModelCompatConfig;
export declare function applyXaiModelCompat<T extends {
    compat?: unknown;
}>(model: T): T;
