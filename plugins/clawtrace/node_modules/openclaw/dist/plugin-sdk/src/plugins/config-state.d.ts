import type { OpenClawConfig } from "../config/config.js";
import type { PluginRecord } from "./registry.js";
export type NormalizedPluginsConfig = {
    enabled: boolean;
    allow: string[];
    deny: string[];
    loadPaths: string[];
    slots: {
        memory?: string | null;
    };
    entries: Record<string, {
        enabled?: boolean;
        hooks?: {
            allowPromptInjection?: boolean;
        };
        subagent?: {
            allowModelOverride?: boolean;
            allowedModels?: string[];
            hasAllowedModelsConfig?: boolean;
        };
        config?: unknown;
    }>;
};
export declare function normalizePluginId(id: string): string;
export declare const normalizePluginsConfig: (config?: OpenClawConfig["plugins"]) => NormalizedPluginsConfig;
export declare const hasExplicitPluginConfig: (plugins?: OpenClawConfig["plugins"]) => boolean;
export declare function applyTestPluginDefaults(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): OpenClawConfig;
export declare function isTestDefaultMemorySlotDisabled(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): boolean;
export declare function resolveEnableState(id: string, origin: PluginRecord["origin"], config: NormalizedPluginsConfig, enabledByDefault?: boolean): {
    enabled: boolean;
    reason?: string;
};
export declare function isBundledChannelEnabledByChannelConfig(cfg: OpenClawConfig | undefined, pluginId: string): boolean;
export declare function resolveEffectiveEnableState(params: {
    id: string;
    origin: PluginRecord["origin"];
    config: NormalizedPluginsConfig;
    rootConfig?: OpenClawConfig;
    enabledByDefault?: boolean;
}): {
    enabled: boolean;
    reason?: string;
};
export declare function resolveMemorySlotDecision(params: {
    id: string;
    kind?: string;
    slot: string | null | undefined;
    selectedId: string | null;
}): {
    enabled: boolean;
    reason?: string;
    selected?: boolean;
};
