import type { TSchema } from "@sinclair/typebox";
import type { OpenClawConfig } from "../../config/config.js";
import { getChannelPlugin } from "./index.js";
import type { ChannelMessageCapability } from "./message-capabilities.js";
import type { ChannelMessageActionDiscoveryContext, ChannelMessageActionName, ChannelMessageToolSchemaContribution } from "./types.js";
export type ChannelMessageActionDiscoveryInput = {
    cfg?: OpenClawConfig;
    channel?: string | null;
    currentChannelProvider?: string | null;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
};
type ChannelActions = NonNullable<NonNullable<ReturnType<typeof getChannelPlugin>>["actions"]>;
export declare function resolveMessageActionDiscoveryChannelId(raw?: string | null): string | undefined;
export declare function createMessageActionDiscoveryContext(params: ChannelMessageActionDiscoveryInput): ChannelMessageActionDiscoveryContext;
type ResolvedChannelMessageActionDiscovery = {
    actions: ChannelMessageActionName[];
    capabilities: readonly ChannelMessageCapability[];
    schemaContributions: ChannelMessageToolSchemaContribution[];
};
export declare function resolveMessageActionDiscoveryForPlugin(params: {
    pluginId: string;
    actions?: ChannelActions;
    context: ChannelMessageActionDiscoveryContext;
    includeActions?: boolean;
    includeCapabilities?: boolean;
    includeSchema?: boolean;
}): ResolvedChannelMessageActionDiscovery;
export declare function listChannelMessageActions(cfg: OpenClawConfig): ChannelMessageActionName[];
export declare function listChannelMessageCapabilities(cfg: OpenClawConfig): ChannelMessageCapability[];
export declare function listChannelMessageCapabilitiesForChannel(params: {
    cfg: OpenClawConfig;
    channel?: string;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
}): ChannelMessageCapability[];
export declare function resolveChannelMessageToolSchemaProperties(params: {
    cfg: OpenClawConfig;
    channel?: string;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
}): Record<string, TSchema>;
export declare function channelSupportsMessageCapability(cfg: OpenClawConfig, capability: ChannelMessageCapability): boolean;
export declare function channelSupportsMessageCapabilityForChannel(params: {
    cfg: OpenClawConfig;
    channel?: string;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
}, capability: ChannelMessageCapability): boolean;
export declare const __testing: {
    resetLoggedMessageActionErrors(): void;
};
export {};
