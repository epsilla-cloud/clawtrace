import { type OpenClawConfig } from "openclaw/plugin-sdk/provider-onboard";
export declare function buildCloudflareAiGatewayConfigPatch(params: {
    accountId: string;
    gatewayId: string;
}): {
    models: {
        providers: {
            "cloudflare-ai-gateway": {
                baseUrl: string;
                api: "anthropic-messages";
                models: import("openclaw/plugin-sdk/provider-onboard").ModelDefinitionConfig[];
            };
        };
    };
    agents: {
        defaults: {
            models: {
                "cloudflare-ai-gateway/claude-sonnet-4-5": {
                    alias: string;
                };
            };
        };
    };
};
export declare function applyCloudflareAiGatewayProviderConfig(cfg: OpenClawConfig, params?: {
    accountId?: string;
    gatewayId?: string;
}): OpenClawConfig;
export declare function applyCloudflareAiGatewayConfig(cfg: OpenClawConfig, params?: {
    accountId?: string;
    gatewayId?: string;
}): OpenClawConfig;
