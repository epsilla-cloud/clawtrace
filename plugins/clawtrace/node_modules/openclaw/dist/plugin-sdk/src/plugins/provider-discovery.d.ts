import type { OpenClawConfig } from "../config/config.js";
import type { ModelProviderConfig } from "../config/types.js";
import type { ProviderDiscoveryOrder, ProviderPlugin } from "./types.js";
export declare function resolvePluginDiscoveryProviders(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    onlyPluginIds?: string[];
}): Promise<ProviderPlugin[]>;
export declare function groupPluginDiscoveryProvidersByOrder(providers: ProviderPlugin[]): Record<ProviderDiscoveryOrder, ProviderPlugin[]>;
export declare function normalizePluginDiscoveryResult(params: {
    provider: ProviderPlugin;
    result: {
        provider: ModelProviderConfig;
    } | {
        providers: Record<string, ModelProviderConfig>;
    } | null | undefined;
}): Record<string, ModelProviderConfig>;
export declare function runProviderCatalog(params: {
    provider: ProviderPlugin;
    config: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
    resolveProviderApiKey: (providerId?: string) => {
        apiKey: string | undefined;
        discoveryApiKey?: string;
    };
    resolveProviderAuth: (providerId?: string, options?: {
        oauthMarker?: string;
    }) => {
        apiKey: string | undefined;
        discoveryApiKey?: string;
        mode: "api_key" | "oauth" | "token" | "none";
        source: "env" | "profile" | "none";
        profileId?: string;
    };
}): Promise<import("./types.js").ProviderCatalogResult> | undefined;
