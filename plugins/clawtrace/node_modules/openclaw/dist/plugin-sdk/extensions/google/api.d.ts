import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import { type OpenClawConfig } from "openclaw/plugin-sdk/provider-onboard";
import { normalizeAntigravityModelId, normalizeGoogleModelId } from "./model-id.js";
export { normalizeAntigravityModelId, normalizeGoogleModelId };
type GoogleApiCarrier = {
    api?: string | null;
};
type GoogleProviderConfigLike = GoogleApiCarrier & {
    models?: ReadonlyArray<GoogleApiCarrier | null | undefined> | null;
};
export declare const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
export declare function normalizeGoogleApiBaseUrl(baseUrl?: string): string;
export declare function isGoogleGenerativeAiApi(api?: string | null): boolean;
export declare function normalizeGoogleGenerativeAiBaseUrl(baseUrl?: string): string | undefined;
export declare function resolveGoogleGenerativeAiTransport<TApi extends string | null | undefined>(params: {
    api: TApi;
    baseUrl?: string;
}): {
    api: TApi;
    baseUrl?: string;
};
export declare function resolveGoogleGenerativeAiApiOrigin(baseUrl?: string): string;
export declare function shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey: string, provider: GoogleProviderConfigLike): boolean;
export declare function shouldNormalizeGoogleProviderConfig(providerKey: string, provider: GoogleProviderConfigLike): boolean;
export declare function normalizeGoogleProviderConfig(providerKey: string, provider: ModelProviderConfig): ModelProviderConfig;
export declare function parseGeminiAuth(apiKey: string): {
    headers: Record<string, string>;
};
export declare const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
export declare function applyGoogleGeminiModelDefault(cfg: OpenClawConfig): {
    next: OpenClawConfig;
    changed: boolean;
};
