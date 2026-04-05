import type { OpenClawConfig } from "../config/config.js";
type ResolveCommandSecretsResult = {
    resolvedConfig: OpenClawConfig;
    diagnostics: string[];
    targetStatesByPath: Record<string, CommandSecretTargetState>;
    hadUnresolvedTargets: boolean;
};
export type CommandSecretResolutionMode = "enforce_resolved" | "read_only_status" | "read_only_operational";
type LegacyCommandSecretResolutionMode = "strict" | "summary" | "operational_readonly";
type CommandSecretResolutionModeInput = CommandSecretResolutionMode | LegacyCommandSecretResolutionMode;
export type CommandSecretTargetState = "resolved_gateway" | "resolved_local" | "inactive_surface" | "unresolved";
export declare function resolveCommandSecretRefsViaGateway(params: {
    config: OpenClawConfig;
    commandName: string;
    targetIds: Set<string>;
    mode?: CommandSecretResolutionModeInput;
    allowedPaths?: ReadonlySet<string>;
}): Promise<ResolveCommandSecretsResult>;
export {};
