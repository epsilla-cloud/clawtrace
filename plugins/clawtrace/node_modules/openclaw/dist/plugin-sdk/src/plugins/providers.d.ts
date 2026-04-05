import type { PluginLoadOptions } from "./loader.js";
export declare function withBundledProviderVitestCompat(params: {
    config: PluginLoadOptions["config"];
    pluginIds: readonly string[];
    env?: PluginLoadOptions["env"];
}): PluginLoadOptions["config"];
export declare function resolveBundledProviderCompatPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: string[];
}): string[];
export declare function resolveEnabledProviderPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: string[];
}): string[];
export declare const __testing: {
    readonly resolveEnabledProviderPluginIds: typeof resolveEnabledProviderPluginIds;
    readonly resolveBundledProviderCompatPluginIds: typeof resolveBundledProviderCompatPluginIds;
    readonly withBundledProviderVitestCompat: typeof withBundledProviderVitestCompat;
};
export declare function resolveOwningPluginIdsForProvider(params: {
    provider: string;
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): string[] | undefined;
export declare function resolveNonBundledProviderPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): string[];
export declare function resolveCatalogHookProviderPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): string[];
