import { type ChannelMatchSource } from "openclaw/plugin-sdk/channel-targets";
import type { SlackReactionNotificationMode } from "openclaw/plugin-sdk/config-runtime";
import type { SlackMessageEvent } from "../types.js";
export type SlackChannelConfigResolved = {
    allowed: boolean;
    requireMention: boolean;
    allowBots?: boolean;
    users?: Array<string | number>;
    skills?: string[];
    systemPrompt?: string;
    matchKey?: string;
    matchSource?: ChannelMatchSource;
};
export type SlackChannelConfigEntry = {
    enabled?: boolean;
    allow?: boolean;
    requireMention?: boolean;
    allowBots?: boolean;
    users?: Array<string | number>;
    skills?: string[];
    systemPrompt?: string;
};
export type SlackChannelConfigEntries = Record<string, SlackChannelConfigEntry>;
export declare function shouldEmitSlackReactionNotification(params: {
    mode: SlackReactionNotificationMode | undefined;
    botId?: string | null;
    messageAuthorId?: string | null;
    userId: string;
    userName?: string | null;
    allowlist?: Array<string | number> | null;
    allowNameMatching?: boolean;
}): boolean;
export declare function resolveSlackChannelLabel(params: {
    channelId?: string;
    channelName?: string;
}): string;
export declare function resolveSlackChannelConfig(params: {
    channelId: string;
    channelName?: string;
    channels?: SlackChannelConfigEntries;
    channelKeys?: string[];
    defaultRequireMention?: boolean;
    allowNameMatching?: boolean;
}): SlackChannelConfigResolved | null;
export type { SlackMessageEvent };
