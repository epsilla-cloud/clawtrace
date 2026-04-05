import type { PluginLoadOptions } from "./loader.js";
export declare function withBundledPluginAllowlistCompat(params: {
    config: PluginLoadOptions["config"];
    pluginIds: readonly string[];
}): PluginLoadOptions["config"];
export declare function withBundledPluginEnablementCompat(params: {
    config: PluginLoadOptions["config"];
    pluginIds: readonly string[];
}): PluginLoadOptions["config"];
export declare function withBundledPluginVitestCompat(params: {
    config: PluginLoadOptions["config"];
    pluginIds: readonly string[];
    env?: PluginLoadOptions["env"];
}): PluginLoadOptions["config"];
