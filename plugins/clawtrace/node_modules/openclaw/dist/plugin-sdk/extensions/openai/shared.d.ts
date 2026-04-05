import { findCatalogTemplate } from "openclaw/plugin-sdk/provider-catalog-shared";
import { cloneFirstTemplateModel, matchesExactOrPrefix } from "openclaw/plugin-sdk/provider-model-shared";
export declare const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
export declare function isOpenAIApiBaseUrl(baseUrl?: string): boolean;
export { cloneFirstTemplateModel, findCatalogTemplate, matchesExactOrPrefix };
