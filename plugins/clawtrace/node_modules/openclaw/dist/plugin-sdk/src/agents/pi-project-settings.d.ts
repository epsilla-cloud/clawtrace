import { SettingsManager } from "@mariozechner/pi-coding-agent";
import type { OpenClawConfig } from "../config/config.js";
import type { BundleMcpServerConfig } from "../plugins/bundle-mcp.js";
export declare const DEFAULT_EMBEDDED_PI_PROJECT_SETTINGS_POLICY = "sanitize";
export declare const SANITIZED_PROJECT_PI_KEYS: readonly ["shellPath", "shellCommandPrefix"];
export type EmbeddedPiProjectSettingsPolicy = "trusted" | "sanitize" | "ignore";
type PiSettingsSnapshot = ReturnType<SettingsManager["getGlobalSettings"]> & {
    mcpServers?: Record<string, BundleMcpServerConfig>;
};
export declare function loadEnabledBundlePiSettingsSnapshot(params: {
    cwd: string;
    cfg?: OpenClawConfig;
}): PiSettingsSnapshot;
export declare function resolveEmbeddedPiProjectSettingsPolicy(cfg?: OpenClawConfig): EmbeddedPiProjectSettingsPolicy;
export declare function buildEmbeddedPiSettingsSnapshot(params: {
    globalSettings: PiSettingsSnapshot;
    pluginSettings?: PiSettingsSnapshot;
    projectSettings: PiSettingsSnapshot;
    policy: EmbeddedPiProjectSettingsPolicy;
}): PiSettingsSnapshot;
export declare function createEmbeddedPiSettingsManager(params: {
    cwd: string;
    agentDir: string;
    cfg?: OpenClawConfig;
}): SettingsManager;
export declare function createPreparedEmbeddedPiSettingsManager(params: {
    cwd: string;
    agentDir: string;
    cfg?: OpenClawConfig;
}): SettingsManager;
export {};
