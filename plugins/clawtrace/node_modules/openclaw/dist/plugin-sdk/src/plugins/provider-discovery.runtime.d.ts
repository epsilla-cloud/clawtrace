import type { OpenClawConfig } from "../config/config.js";
import type { ProviderPlugin } from "./types.js";
export declare function resolvePluginDiscoveryProvidersRuntime(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    onlyPluginIds?: string[];
}): ProviderPlugin[];
