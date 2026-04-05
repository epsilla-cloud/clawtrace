import type { PluginLoadOptions } from "./loader.js";
import type { PluginWebSearchProviderEntry } from "./types.js";
export declare function resolveBundledWebSearchPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): string[];
export declare function listBundledWebSearchPluginIds(): string[];
export declare function listBundledWebSearchProviders(): PluginWebSearchProviderEntry[];
export declare function resolveBundledWebSearchPluginId(providerId: string | undefined): string | undefined;
