import type { PluginLoadOptions } from "./loader.js";
import type { PluginWebSearchProviderEntry } from "./types.js";
declare function resetWebSearchProviderSnapshotCacheForTests(): void;
export declare const __testing: {
    readonly resetWebSearchProviderSnapshotCacheForTests: typeof resetWebSearchProviderSnapshotCacheForTests;
};
export declare function resolvePluginWebSearchProviders(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledAllowlistCompat?: boolean;
    onlyPluginIds?: readonly string[];
    activate?: boolean;
    cache?: boolean;
}): PluginWebSearchProviderEntry[];
export declare function resolveRuntimeWebSearchProviders(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledAllowlistCompat?: boolean;
    onlyPluginIds?: readonly string[];
}): PluginWebSearchProviderEntry[];
export {};
