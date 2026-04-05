import type { OpenClawConfig } from "../config/config.js";
import type { PluginWebSearchProviderEntry, WebSearchProviderToolDefinition } from "../plugins/types.js";
import type { RuntimeWebSearchMetadata } from "../secrets/runtime-web-tools.types.js";
type WebSearchConfig = NonNullable<OpenClawConfig["tools"]>["web"] extends infer Web ? Web extends {
    search?: infer Search;
} ? Search : undefined : undefined;
export type ResolveWebSearchDefinitionParams = {
    config?: OpenClawConfig;
    sandboxed?: boolean;
    runtimeWebSearch?: RuntimeWebSearchMetadata;
    providerId?: string;
    preferRuntimeProviders?: boolean;
};
export type RunWebSearchParams = ResolveWebSearchDefinitionParams & {
    args: Record<string, unknown>;
};
declare function resolveSearchConfig(cfg?: OpenClawConfig): WebSearchConfig;
export declare function resolveWebSearchEnabled(params: {
    search?: WebSearchConfig;
    sandboxed?: boolean;
}): boolean;
export declare function listWebSearchProviders(params?: {
    config?: OpenClawConfig;
}): PluginWebSearchProviderEntry[];
export declare function listConfiguredWebSearchProviders(params?: {
    config?: OpenClawConfig;
}): PluginWebSearchProviderEntry[];
export declare function resolveWebSearchProviderId(params: {
    search?: WebSearchConfig;
    config?: OpenClawConfig;
    providers?: PluginWebSearchProviderEntry[];
}): string;
export declare function resolveWebSearchDefinition(options?: ResolveWebSearchDefinitionParams): {
    provider: PluginWebSearchProviderEntry;
    definition: WebSearchProviderToolDefinition;
} | null;
export declare function runWebSearch(params: RunWebSearchParams): Promise<{
    provider: string;
    result: Record<string, unknown>;
}>;
export declare const __testing: {
    resolveSearchConfig: typeof resolveSearchConfig;
    resolveSearchProvider: typeof resolveWebSearchProviderId;
    resolveWebSearchProviderId: typeof resolveWebSearchProviderId;
};
export {};
