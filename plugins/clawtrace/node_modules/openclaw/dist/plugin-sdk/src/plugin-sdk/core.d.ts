import type { ChannelOutboundAdapter, ChannelPairingAdapter, ChannelSecurityAdapter } from "../channels/plugins/types.adapters.js";
import type { ChannelMessagingAdapter, ChannelOutboundSessionRoute, ChannelPollResult, ChannelThreadingAdapter } from "../channels/plugins/types.core.js";
import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import type { OpenClawConfig } from "../config/config.js";
import type { ReplyToMode } from "../config/types.base.js";
import type { OutboundDeliveryResult } from "../infra/outbound/deliver.js";
import type { PluginRuntime } from "../plugins/runtime/types.js";
import type { OpenClawPluginApi, OpenClawPluginConfigSchema } from "../plugins/types.js";
export type { AnyAgentTool, MediaUnderstandingProviderPlugin, OpenClawPluginApi, OpenClawPluginCommandDefinition, OpenClawPluginConfigSchema, OpenClawPluginDefinition, OpenClawPluginService, OpenClawPluginServiceContext, PluginCommandContext, PluginInteractiveTelegramHandlerContext, PluginLogger, ProviderAuthContext, ProviderAuthDoctorHintContext, ProviderAuthMethod, ProviderAuthMethodNonInteractiveContext, ProviderAuthResult, ProviderAugmentModelCatalogContext, ProviderBuildMissingAuthMessageContext, ProviderBuildUnknownModelHintContext, ProviderBuiltInModelSuppressionContext, ProviderBuiltInModelSuppressionResult, ProviderCacheTtlEligibilityContext, ProviderCatalogContext, ProviderCatalogResult, ProviderDefaultThinkingPolicyContext, ProviderDiscoveryContext, ProviderFetchUsageSnapshotContext, ProviderModernModelPolicyContext, ProviderNormalizeResolvedModelContext, ProviderPrepareDynamicModelContext, ProviderPrepareExtraParamsContext, ProviderPrepareRuntimeAuthContext, ProviderPreparedRuntimeAuth, ProviderResolveDynamicModelContext, ProviderResolvedUsageAuth, ProviderResolveUsageAuthContext, ProviderRuntimeModel, ProviderThinkingPolicyContext, ProviderWrapStreamFnContext, SpeechProviderPlugin, } from "./plugin-entry.js";
export type { OpenClawPluginToolContext, OpenClawPluginToolFactory } from "../plugins/types.js";
export type { OpenClawConfig } from "../config/config.js";
export { isSecretRef } from "../config/types.secrets.js";
export type { GatewayRequestHandlerOptions } from "../gateway/server-methods/types.js";
export type { ChannelOutboundSessionRoute, ChannelMessagingAdapter, } from "../channels/plugins/types.core.js";
export type { ProviderUsageSnapshot, UsageProviderId, UsageWindow, } from "../infra/provider-usage.types.js";
export type { ChannelMessageActionContext } from "../channels/plugins/types.js";
export type { ChannelConfigUiHint, ChannelPlugin } from "../channels/plugins/types.plugin.js";
export type { PluginRuntime } from "../plugins/runtime/types.js";
export { definePluginEntry } from "./plugin-entry.js";
export { buildPluginConfigSchema, emptyPluginConfigSchema } from "../plugins/config-schema.js";
export { KeyedAsyncQueue, enqueueKeyedTask } from "./keyed-async-queue.js";
export { createDedupeCache, resolveGlobalDedupeCache } from "../infra/dedupe.js";
export { generateSecureToken, generateSecureUuid } from "../infra/secure-random.js";
export { delegateCompactionToRuntime } from "../context-engine/delegate.js";
export { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";
export { buildChannelConfigSchema } from "../channels/plugins/config-schema.js";
export { applyAccountNameToChannelSection, migrateBaseNameToDefaultAccount, } from "../channels/plugins/setup-helpers.js";
export { clearAccountEntryFields, deleteAccountFromConfigSection, setAccountEnabledInConfigSection, } from "../channels/plugins/config-helpers.js";
export { formatPairingApproveHint, parseOptionalDelimitedEntries, } from "../channels/plugins/helpers.js";
export { getChatChannelMeta } from "../channels/chat-meta.js";
export { channelTargetSchema, channelTargetsSchema, optionalStringEnum, stringEnum, } from "../agents/schema/typebox.js";
export { DEFAULT_SECRET_FILE_MAX_BYTES, loadSecretFileSync, readSecretFileSync, tryReadSecretFileSync, } from "../infra/secret-file.js";
export type { SecretFileReadOptions, SecretFileReadResult } from "../infra/secret-file.js";
export { resolveGatewayBindUrl } from "../shared/gateway-bind-url.js";
export type { GatewayBindUrlResult } from "../shared/gateway-bind-url.js";
export { resolveGatewayPort } from "../config/paths.js";
export { createSubsystemLogger } from "../logging/subsystem.js";
export { normalizeAtHashSlug, normalizeHyphenSlug } from "../shared/string-normalization.js";
export { resolveTailnetHostWithRunner } from "../shared/tailscale-status.js";
export type { TailscaleStatusCommandResult, TailscaleStatusCommandRunner, } from "../shared/tailscale-status.js";
export { buildAgentSessionKey, type RoutePeer, type RoutePeerKind, } from "../routing/resolve-route.js";
export { resolveThreadSessionKeys } from "../routing/session-key.js";
export type ChannelOutboundSessionRouteParams = Parameters<NonNullable<ChannelMessagingAdapter["resolveOutboundSessionRoute"]>>[0];
/** Remove one of the known provider prefixes from a free-form target string. */
export declare function stripChannelTargetPrefix(raw: string, ...providers: string[]): string;
/** Remove generic target-kind prefixes such as `user:` or `group:`. */
export declare function stripTargetKindPrefix(raw: string): string;
/**
 * Build the canonical outbound session route payload returned by channel
 * message adapters.
 */
export declare function buildChannelOutboundSessionRoute(params: {
    cfg: OpenClawConfig;
    agentId: string;
    channel: string;
    accountId?: string | null;
    peer: {
        kind: "direct" | "group" | "channel";
        id: string;
    };
    chatType: "direct" | "group" | "channel";
    from: string;
    to: string;
    threadId?: string | number;
}): ChannelOutboundSessionRoute;
/** Options for a channel plugin entry that should register a channel capability. */
type DefineChannelPluginEntryOptions<TPlugin = ChannelPlugin> = {
    id: string;
    name: string;
    description: string;
    plugin: TPlugin;
    configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
    setRuntime?: (runtime: PluginRuntime) => void;
    registerFull?: (api: OpenClawPluginApi) => void;
};
type DefinedChannelPluginEntry<TPlugin> = {
    id: string;
    name: string;
    description: string;
    configSchema: OpenClawPluginConfigSchema;
    register: (api: OpenClawPluginApi) => void;
    channelPlugin: TPlugin;
    setChannelRuntime?: (runtime: PluginRuntime) => void;
};
type CreateChannelPluginBaseOptions<TResolvedAccount> = {
    id: ChannelPlugin<TResolvedAccount>["id"];
    meta?: Partial<NonNullable<ChannelPlugin<TResolvedAccount>["meta"]>>;
    setupWizard?: NonNullable<ChannelPlugin<TResolvedAccount>["setupWizard"]>;
    capabilities?: ChannelPlugin<TResolvedAccount>["capabilities"];
    agentPrompt?: ChannelPlugin<TResolvedAccount>["agentPrompt"];
    streaming?: ChannelPlugin<TResolvedAccount>["streaming"];
    reload?: ChannelPlugin<TResolvedAccount>["reload"];
    gatewayMethods?: ChannelPlugin<TResolvedAccount>["gatewayMethods"];
    configSchema?: ChannelPlugin<TResolvedAccount>["configSchema"];
    config?: ChannelPlugin<TResolvedAccount>["config"];
    security?: ChannelPlugin<TResolvedAccount>["security"];
    setup: NonNullable<ChannelPlugin<TResolvedAccount>["setup"]>;
    groups?: ChannelPlugin<TResolvedAccount>["groups"];
};
type CreatedChannelPluginBase<TResolvedAccount> = Pick<ChannelPlugin<TResolvedAccount>, "id" | "meta" | "setup"> & Partial<Pick<ChannelPlugin<TResolvedAccount>, "setupWizard" | "capabilities" | "agentPrompt" | "streaming" | "reload" | "gatewayMethods" | "configSchema" | "config" | "security" | "groups">>;
/**
 * Canonical entry helper for channel plugins.
 *
 * This wraps `definePluginEntry(...)`, registers the channel capability, and
 * optionally exposes extra full-runtime registration such as tools or gateway
 * handlers that only make sense outside setup-only registration modes.
 */
export declare function defineChannelPluginEntry<TPlugin>({ id, name, description, plugin, configSchema, setRuntime, registerFull, }: DefineChannelPluginEntryOptions<TPlugin>): DefinedChannelPluginEntry<TPlugin>;
/**
 * Minimal setup-entry helper for channels that ship a separate `setup-entry.ts`.
 *
 * The setup entry only needs to export `{ plugin }`, but using this helper
 * keeps the shape explicit in examples and generated typings.
 */
export declare function defineSetupPluginEntry<TPlugin>(plugin: TPlugin): {
    plugin: TPlugin;
};
type ChatChannelPluginBase<TResolvedAccount, Probe, Audit> = Omit<ChannelPlugin<TResolvedAccount, Probe, Audit>, "security" | "pairing" | "threading" | "outbound"> & Partial<Pick<ChannelPlugin<TResolvedAccount, Probe, Audit>, "security" | "pairing" | "threading" | "outbound">>;
type ChatChannelSecurityOptions<TResolvedAccount extends {
    accountId?: string | null;
}> = {
    dm: {
        channelKey: string;
        resolvePolicy: (account: TResolvedAccount) => string | null | undefined;
        resolveAllowFrom: (account: TResolvedAccount) => Array<string | number> | null | undefined;
        resolveFallbackAccountId?: (account: TResolvedAccount) => string | null | undefined;
        defaultPolicy?: string;
        allowFromPathSuffix?: string;
        policyPathSuffix?: string;
        approveChannelId?: string;
        approveHint?: string;
        normalizeEntry?: (raw: string) => string;
    };
    collectWarnings?: ChannelSecurityAdapter<TResolvedAccount>["collectWarnings"];
};
type ChatChannelPairingOptions = {
    text: {
        idLabel: string;
        message: string;
        normalizeAllowEntry?: ChannelPairingAdapter["normalizeAllowEntry"];
        notify: (params: Parameters<NonNullable<ChannelPairingAdapter["notifyApproval"]>>[0] & {
            message: string;
        }) => Promise<void> | void;
    };
};
type ChatChannelThreadingReplyModeOptions<TResolvedAccount> = {
    topLevelReplyToMode: string;
} | {
    scopedAccountReplyToMode: {
        resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TResolvedAccount;
        resolveReplyToMode: (account: TResolvedAccount, chatType?: string | null) => ReplyToMode | null | undefined;
        fallback?: ReplyToMode;
    };
} | {
    resolveReplyToMode: NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
};
type ChatChannelThreadingOptions<TResolvedAccount> = ChatChannelThreadingReplyModeOptions<TResolvedAccount> & Omit<ChannelThreadingAdapter, "resolveReplyToMode">;
type ChatChannelAttachedOutboundOptions = {
    base: Omit<ChannelOutboundAdapter, "sendText" | "sendMedia" | "sendPoll">;
    attachedResults: {
        channel: string;
        sendText?: (ctx: Parameters<NonNullable<ChannelOutboundAdapter["sendText"]>>[0]) => MaybePromise<Omit<OutboundDeliveryResult, "channel">>;
        sendMedia?: (ctx: Parameters<NonNullable<ChannelOutboundAdapter["sendMedia"]>>[0]) => MaybePromise<Omit<OutboundDeliveryResult, "channel">>;
        sendPoll?: (ctx: Parameters<NonNullable<ChannelOutboundAdapter["sendPoll"]>>[0]) => MaybePromise<Omit<ChannelPollResult, "channel">>;
    };
};
type MaybePromise<T> = T | Promise<T>;
export declare function createChatChannelPlugin<TResolvedAccount extends {
    accountId?: string | null;
}, Probe = unknown, Audit = unknown>(params: {
    base: ChatChannelPluginBase<TResolvedAccount, Probe, Audit>;
    security?: ChannelSecurityAdapter<TResolvedAccount> | ChatChannelSecurityOptions<TResolvedAccount>;
    pairing?: ChannelPairingAdapter | ChatChannelPairingOptions;
    threading?: ChannelThreadingAdapter | ChatChannelThreadingOptions<TResolvedAccount>;
    outbound?: ChannelOutboundAdapter | ChatChannelAttachedOutboundOptions;
}): ChannelPlugin<TResolvedAccount, Probe, Audit>;
export declare function createChannelPluginBase<TResolvedAccount>(params: CreateChannelPluginBaseOptions<TResolvedAccount>): CreatedChannelPluginBase<TResolvedAccount>;
