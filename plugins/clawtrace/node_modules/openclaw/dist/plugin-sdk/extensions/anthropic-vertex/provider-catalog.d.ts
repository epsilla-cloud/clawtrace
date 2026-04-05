import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const ANTHROPIC_VERTEX_DEFAULT_MODEL_ID = "claude-sonnet-4-6";
export declare function buildAnthropicVertexProvider(params?: {
    env?: NodeJS.ProcessEnv;
}): ModelProviderConfig;
