import { loadConfig } from "../config/config.js";
import type { PluginRegistry } from "./registry.js";
import type { PluginDiagnostic, PluginHookName } from "./types.js";
export type PluginStatusReport = PluginRegistry & {
    workspaceDir?: string;
};
export type PluginCapabilityKind = "cli-backend" | "text-inference" | "speech" | "media-understanding" | "image-generation" | "web-search" | "channel";
export type PluginInspectShape = "hook-only" | "plain-capability" | "hybrid-capability" | "non-capability";
export type PluginCompatibilityNotice = {
    pluginId: string;
    code: "legacy-before-agent-start" | "hook-only";
    severity: "warn" | "info";
    message: string;
};
export type PluginCompatibilitySummary = {
    noticeCount: number;
    pluginCount: number;
};
export type PluginInspectReport = {
    workspaceDir?: string;
    plugin: PluginRegistry["plugins"][number];
    shape: PluginInspectShape;
    capabilityMode: "none" | "plain" | "hybrid";
    capabilityCount: number;
    capabilities: Array<{
        kind: PluginCapabilityKind;
        ids: string[];
    }>;
    typedHooks: Array<{
        name: PluginHookName;
        priority?: number;
    }>;
    customHooks: Array<{
        name: string;
        events: string[];
    }>;
    tools: Array<{
        names: string[];
        optional: boolean;
    }>;
    commands: string[];
    cliCommands: string[];
    services: string[];
    gatewayMethods: string[];
    mcpServers: Array<{
        name: string;
        hasStdioTransport: boolean;
    }>;
    lspServers: Array<{
        name: string;
        hasStdioTransport: boolean;
    }>;
    httpRouteCount: number;
    bundleCapabilities: string[];
    diagnostics: PluginDiagnostic[];
    policy: {
        allowPromptInjection?: boolean;
        allowModelOverride?: boolean;
        allowedModels: string[];
        hasAllowedModelsConfig: boolean;
    };
    usesLegacyBeforeAgentStart: boolean;
    compatibility: PluginCompatibilityNotice[];
};
export declare function buildPluginStatusReport(params?: {
    config?: ReturnType<typeof loadConfig>;
    workspaceDir?: string;
    /** Use an explicit env when plugin roots should resolve independently from process.env. */
    env?: NodeJS.ProcessEnv;
}): PluginStatusReport;
export declare function buildPluginInspectReport(params: {
    id: string;
    config?: ReturnType<typeof loadConfig>;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    report?: PluginStatusReport;
}): PluginInspectReport | null;
export declare function buildAllPluginInspectReports(params?: {
    config?: ReturnType<typeof loadConfig>;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    report?: PluginStatusReport;
}): PluginInspectReport[];
export declare function buildPluginCompatibilityWarnings(params?: {
    config?: ReturnType<typeof loadConfig>;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    report?: PluginStatusReport;
}): string[];
export declare function buildPluginCompatibilityNotices(params?: {
    config?: ReturnType<typeof loadConfig>;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    report?: PluginStatusReport;
}): PluginCompatibilityNotice[];
export declare function formatPluginCompatibilityNotice(notice: PluginCompatibilityNotice): string;
export declare function summarizePluginCompatibility(notices: PluginCompatibilityNotice[]): PluginCompatibilitySummary;
