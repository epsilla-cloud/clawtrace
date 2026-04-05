import type { CliBackendPlugin } from "./types.js";
export type PluginCliBackendEntry = CliBackendPlugin & {
    pluginId: string;
};
export declare function resolveRuntimeCliBackends(): PluginCliBackendEntry[];
