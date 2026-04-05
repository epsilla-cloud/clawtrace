import type { AllowlistMatch, ChannelGroupContext, GroupPolicy, GroupToolPolicyConfig } from "../runtime-api.js";
import type { NextcloudTalkRoomConfig } from "./types.js";
export declare function normalizeNextcloudTalkAllowlist(values: Array<string | number> | undefined): string[];
export declare function resolveNextcloudTalkAllowlistMatch(params: {
    allowFrom: Array<string | number> | undefined;
    senderId: string;
}): AllowlistMatch<"wildcard" | "id">;
export type NextcloudTalkRoomMatch = {
    roomConfig?: NextcloudTalkRoomConfig;
    wildcardConfig?: NextcloudTalkRoomConfig;
    roomKey?: string;
    matchSource?: "direct" | "parent" | "wildcard";
    allowed: boolean;
    allowlistConfigured: boolean;
};
export declare function resolveNextcloudTalkRoomMatch(params: {
    rooms?: Record<string, NextcloudTalkRoomConfig>;
    roomToken: string;
}): NextcloudTalkRoomMatch;
export declare function resolveNextcloudTalkGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
export declare function resolveNextcloudTalkRequireMention(params: {
    roomConfig?: NextcloudTalkRoomConfig;
    wildcardConfig?: NextcloudTalkRoomConfig;
}): boolean;
export declare function resolveNextcloudTalkGroupAllow(params: {
    groupPolicy: GroupPolicy;
    outerAllowFrom: Array<string | number> | undefined;
    innerAllowFrom: Array<string | number> | undefined;
    senderId: string;
}): {
    allowed: boolean;
    outerMatch: AllowlistMatch;
    innerMatch: AllowlistMatch;
};
export declare function resolveNextcloudTalkMentionGate(params: {
    isGroup: boolean;
    requireMention: boolean;
    wasMentioned: boolean;
    allowTextCommands: boolean;
    hasControlCommand: boolean;
    commandAuthorized: boolean;
}): {
    shouldSkip: boolean;
    shouldBypassMention: boolean;
};
