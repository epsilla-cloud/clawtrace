import type { PluginRuntime } from "./types.js";
/**
 * Set the process-global gateway subagent runtime.
 * Called during gateway startup so that gateway-bindable plugin runtimes can
 * resolve subagent methods dynamically even when their registry was cached
 * before the gateway finished loading plugins.
 */
export declare function setGatewaySubagentRuntime(subagent: PluginRuntime["subagent"]): void;
/**
 * Reset the process-global gateway subagent runtime.
 * Used by tests to avoid leaking gateway state across module reloads.
 */
export declare function clearGatewaySubagentRuntime(): void;
export type CreatePluginRuntimeOptions = {
    subagent?: PluginRuntime["subagent"];
    allowGatewaySubagentBinding?: boolean;
};
export declare function createPluginRuntime(_options?: CreatePluginRuntimeOptions): PluginRuntime;
export type { PluginRuntime } from "./types.js";
