import { type ButtonInteraction, type ChannelSelectMenuInteraction, type ComponentData, type MentionableSelectMenuInteraction, type ModalInteraction, type RoleSelectMenuInteraction, type StringSelectMenuInteraction, type UserSelectMenuInteraction } from "@buape/carbon";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { DiscordAccountConfig } from "openclaw/plugin-sdk/config-runtime";
import * as conversationRuntime from "openclaw/plugin-sdk/conversation-runtime";
import { type DiscordComponentEntry, type DiscordModalEntry } from "../components.js";
import { type DiscordGuildEntryResolved, resolveDiscordChannelConfigWithFallback, resolveDiscordGuildEntry } from "./allow-list.js";
import { formatDiscordUserTag } from "./format.js";
export declare const AGENT_BUTTON_KEY = "agent";
export declare const AGENT_SELECT_KEY = "agentsel";
export type DiscordUser = Parameters<typeof formatDiscordUserTag>[0];
export type AgentComponentMessageInteraction = ButtonInteraction | StringSelectMenuInteraction | RoleSelectMenuInteraction | UserSelectMenuInteraction | MentionableSelectMenuInteraction | ChannelSelectMenuInteraction;
export type AgentComponentInteraction = AgentComponentMessageInteraction | ModalInteraction;
export type DiscordChannelContext = {
    channelName: string | undefined;
    channelSlug: string;
    channelType: number | undefined;
    isThread: boolean;
    parentId: string | undefined;
    parentName: string | undefined;
    parentSlug: string;
};
export type AgentComponentContext = {
    cfg: OpenClawConfig;
    accountId: string;
    discordConfig?: DiscordAccountConfig;
    runtime?: import("openclaw/plugin-sdk/runtime-env").RuntimeEnv;
    token?: string;
    guildEntries?: Record<string, DiscordGuildEntryResolved>;
    allowFrom?: string[];
    dmPolicy?: "open" | "pairing" | "allowlist" | "disabled";
};
export type ComponentInteractionContext = NonNullable<Awaited<ReturnType<typeof resolveComponentInteractionContext>>>;
/**
 * The component custom id only carries the logical button id. Channel binding
 * comes from Discord's trusted interaction payload.
 */
export declare function buildAgentButtonCustomId(componentId: string): string;
export declare function buildAgentSelectCustomId(componentId: string): string;
declare const resolvePinnedMainDmOwnerFromAllowlist: typeof conversationRuntime.resolvePinnedMainDmOwnerFromAllowlist;
export declare function resolveAgentComponentRoute(params: {
    ctx: AgentComponentContext;
    rawGuildId: string | undefined;
    memberRoleIds: string[];
    isDirectMessage: boolean;
    userId: string;
    channelId: string;
    parentId: string | undefined;
}): import("openclaw/plugin-sdk/routing").ResolvedAgentRoute;
export declare function ackComponentInteraction(params: {
    interaction: AgentComponentInteraction;
    replyOpts: {
        ephemeral?: boolean;
    };
    label: string;
}): Promise<void>;
export declare function resolveDiscordChannelContext(interaction: AgentComponentInteraction): DiscordChannelContext;
export declare function resolveComponentInteractionContext(params: {
    interaction: AgentComponentInteraction;
    label: string;
    defer?: boolean;
}): Promise<{
    channelId: string;
    user: import("@buape/carbon").User<false>;
    username: string;
    userId: string;
    replyOpts: {
        ephemeral?: undefined;
    } | {
        ephemeral: boolean;
    };
    rawGuildId: string | undefined;
    isDirectMessage: boolean;
    memberRoleIds: string[];
} | null>;
export declare function ensureGuildComponentMemberAllowed(params: {
    interaction: AgentComponentInteraction;
    guildInfo: ReturnType<typeof resolveDiscordGuildEntry>;
    channelId: string;
    rawGuildId: string | undefined;
    channelCtx: DiscordChannelContext;
    memberRoleIds: string[];
    user: DiscordUser;
    replyOpts: {
        ephemeral?: boolean;
    };
    componentLabel: string;
    unauthorizedReply: string;
    allowNameMatching: boolean;
    groupPolicy: "open" | "disabled" | "allowlist";
}): Promise<boolean>;
export declare function ensureComponentUserAllowed(params: {
    entry: DiscordComponentEntry;
    interaction: AgentComponentInteraction;
    user: DiscordUser;
    replyOpts: {
        ephemeral?: boolean;
    };
    componentLabel: string;
    unauthorizedReply: string;
    allowNameMatching: boolean;
}): Promise<boolean>;
export declare function ensureAgentComponentInteractionAllowed(params: {
    ctx: AgentComponentContext;
    interaction: AgentComponentInteraction;
    channelId: string;
    rawGuildId: string | undefined;
    memberRoleIds: string[];
    user: DiscordUser;
    replyOpts: {
        ephemeral?: boolean;
    };
    componentLabel: string;
    unauthorizedReply: string;
}): Promise<{
    parentId: string | undefined;
} | null>;
export declare function parseAgentComponentData(data: ComponentData): {
    componentId: string;
} | null;
export declare function resolveInteractionContextWithDmAuth(params: {
    ctx: AgentComponentContext;
    interaction: AgentComponentInteraction;
    label: string;
    componentLabel: string;
    defer?: boolean;
}): Promise<{
    channelId: string;
    user: import("@buape/carbon").User<false>;
    username: string;
    userId: string;
    replyOpts: {
        ephemeral?: undefined;
    } | {
        ephemeral: boolean;
    };
    rawGuildId: string | undefined;
    isDirectMessage: boolean;
    memberRoleIds: string[];
} | null>;
export declare function parseDiscordComponentData(data: ComponentData, customId?: string): {
    componentId: string;
    modalId?: string;
} | null;
export declare function parseDiscordModalId(data: ComponentData, customId?: string): string | null;
export declare function resolveInteractionCustomId(interaction: AgentComponentInteraction): string | undefined;
export declare function mapSelectValues(entry: DiscordComponentEntry, values: string[]): string[];
export declare function resolveModalFieldValues(field: DiscordModalEntry["fields"][number], interaction: ModalInteraction): string[];
export declare function formatModalSubmissionText(entry: DiscordModalEntry, interaction: ModalInteraction): string;
export declare function resolveDiscordInteractionId(interaction: AgentComponentInteraction): string;
export declare function resolveComponentCommandAuthorized(params: {
    ctx: AgentComponentContext;
    interactionCtx: ComponentInteractionContext;
    channelConfig: ReturnType<typeof resolveDiscordChannelConfigWithFallback>;
    guildInfo: ReturnType<typeof resolveDiscordGuildEntry>;
    allowNameMatching: boolean;
}): boolean;
export { resolveDiscordGuildEntry, resolvePinnedMainDmOwnerFromAllowlist };
