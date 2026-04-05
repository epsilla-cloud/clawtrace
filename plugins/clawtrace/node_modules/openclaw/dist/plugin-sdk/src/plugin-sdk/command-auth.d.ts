import type { OpenClawConfig } from "../config/config.js";
export { createPreCryptoDirectDmAuthorizer, resolveInboundDirectDmAccessWithRuntime, type DirectDmCommandAuthorizationRuntime, type ResolvedInboundDirectDmAccess, } from "./direct-dm.js";
export { hasControlCommand, hasInlineCommandTokens, isControlCommandMessage, shouldComputeCommandAuthorized, } from "../auto-reply/command-detection.js";
export { buildCommandText, buildCommandTextFromArgs, findCommandByNativeName, getCommandDetection, isCommandEnabled, isCommandMessage, isNativeCommandSurface, listChatCommands, listChatCommandsForConfig, listNativeCommandSpecs, listNativeCommandSpecsForConfig, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenu, resolveTextCommand, serializeCommandArgs, shouldHandleTextCommands, } from "../auto-reply/commands-registry.js";
export type { ChatCommandDefinition, CommandArgChoiceContext, CommandArgDefinition, CommandArgMenuSpec, CommandArgValues, CommandArgs, CommandDetection, CommandNormalizeOptions, CommandScope, NativeCommandSpec, ResolvedCommandArgChoice, ShouldHandleTextCommandsParams, } from "../auto-reply/commands-registry.js";
export { resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveDualTextControlCommandGate, type CommandAuthorizer, type CommandGatingModeWhenAccessGroupsOff, } from "../channels/command-gating.js";
export { resolveNativeCommandSessionTargets, type ResolveNativeCommandSessionTargetsParams, } from "../channels/native-command-session-targets.js";
export { resolveCommandAuthorization, type CommandAuthorization, } from "../auto-reply/command-auth.js";
export { listReservedChatSlashCommandNames, listSkillCommandsForAgents, listSkillCommandsForWorkspace, resolveSkillCommandInvocation, } from "../auto-reply/skill-commands.js";
export { buildCommandsPaginationKeyboard } from "../auto-reply/reply/commands-info.js";
export { buildModelsProviderData, formatModelsAvailableHeader, resolveModelsCommandReply, } from "../auto-reply/reply/commands-models.js";
export type { ModelsProviderData } from "../auto-reply/reply/commands-models.js";
export { resolveStoredModelOverride } from "../auto-reply/reply/model-selection.js";
export type { StoredModelOverride } from "../auto-reply/reply/model-selection.js";
export { buildCommandsMessage, buildCommandsMessagePaginated, buildHelpMessage, } from "../auto-reply/status.js";
export type ResolveSenderCommandAuthorizationParams = {
    cfg: OpenClawConfig;
    rawBody: string;
    isGroup: boolean;
    dmPolicy: string;
    configuredAllowFrom: string[];
    configuredGroupAllowFrom?: string[];
    senderId: string;
    isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
    readAllowFromStore: () => Promise<string[]>;
    shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
    resolveCommandAuthorizedFromAuthorizers: (params: {
        useAccessGroups: boolean;
        authorizers: Array<{
            configured: boolean;
            allowed: boolean;
        }>;
    }) => boolean;
};
export type CommandAuthorizationRuntime = {
    shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
    resolveCommandAuthorizedFromAuthorizers: (params: {
        useAccessGroups: boolean;
        authorizers: Array<{
            configured: boolean;
            allowed: boolean;
        }>;
    }) => boolean;
};
export type ResolveSenderCommandAuthorizationWithRuntimeParams = Omit<ResolveSenderCommandAuthorizationParams, "shouldComputeCommandAuthorized" | "resolveCommandAuthorizedFromAuthorizers"> & {
    runtime: CommandAuthorizationRuntime;
};
/** Fast-path DM command authorization when only policy and sender allowlist state matter. */
export declare function resolveDirectDmAuthorizationOutcome(params: {
    isGroup: boolean;
    dmPolicy: string;
    senderAllowedForCommands: boolean;
}): "disabled" | "unauthorized" | "allowed";
/** Runtime-backed wrapper around sender command authorization for grouped helper surfaces. */
export declare function resolveSenderCommandAuthorizationWithRuntime(params: ResolveSenderCommandAuthorizationWithRuntimeParams): ReturnType<typeof resolveSenderCommandAuthorization>;
/** Compute effective allowlists and command authorization for one inbound sender. */
export declare function resolveSenderCommandAuthorization(params: ResolveSenderCommandAuthorizationParams): Promise<{
    shouldComputeAuth: boolean;
    effectiveAllowFrom: string[];
    effectiveGroupAllowFrom: string[];
    senderAllowedForCommands: boolean;
    commandAuthorized: boolean | undefined;
}>;
