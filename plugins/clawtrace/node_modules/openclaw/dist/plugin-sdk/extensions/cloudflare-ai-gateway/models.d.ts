import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const CLOUDFLARE_AI_GATEWAY_PROVIDER_ID = "cloudflare-ai-gateway";
export declare const CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_ID = "claude-sonnet-4-5";
export declare const CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF = "cloudflare-ai-gateway/claude-sonnet-4-5";
export declare function buildCloudflareAiGatewayModelDefinition(params?: {
    id?: string;
    name?: string;
    reasoning?: boolean;
    input?: Array<"text" | "image">;
}): ModelDefinitionConfig;
export declare function resolveCloudflareAiGatewayBaseUrl(params: {
    accountId: string;
    gatewayId: string;
}): string;
