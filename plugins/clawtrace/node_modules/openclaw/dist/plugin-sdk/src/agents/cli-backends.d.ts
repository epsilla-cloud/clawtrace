import type { OpenClawConfig } from "../config/config.js";
import type { CliBackendConfig } from "../config/types.js";
export type ResolvedCliBackend = {
    id: string;
    config: CliBackendConfig;
    bundleMcp: boolean;
    pluginId?: string;
};
export declare function resolveCliBackendIds(cfg?: OpenClawConfig): Set<string>;
export declare function resolveCliBackendConfig(provider: string, cfg?: OpenClawConfig): ResolvedCliBackend | null;
