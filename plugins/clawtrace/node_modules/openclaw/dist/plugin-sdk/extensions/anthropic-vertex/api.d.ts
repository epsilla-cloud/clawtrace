import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
export { ANTHROPIC_VERTEX_DEFAULT_MODEL_ID, buildAnthropicVertexProvider, } from "./provider-catalog.js";
export { hasAnthropicVertexAvailableAuth, hasAnthropicVertexCredentials, resolveAnthropicVertexClientRegion, resolveAnthropicVertexConfigApiKey, resolveAnthropicVertexProjectId, resolveAnthropicVertexRegion, resolveAnthropicVertexRegionFromBaseUrl, } from "./region.js";
export declare function mergeImplicitAnthropicVertexProvider(params: {
    existing: ModelProviderConfig | undefined;
    implicit: ModelProviderConfig;
}): ModelProviderConfig;
export declare function resolveImplicitAnthropicVertexProvider(params?: {
    env?: NodeJS.ProcessEnv;
}): ModelProviderConfig | null;
