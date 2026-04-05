import type { IrcAccountConfig, IrcChannelConfig } from "./types.js";
import type { IrcInboundMessage } from "./types.js";
export type IrcGroupMatch = {
    allowed: boolean;
    groupConfig?: IrcChannelConfig;
    wildcardConfig?: IrcChannelConfig;
    hasConfiguredGroups: boolean;
};
export type IrcGroupAccessGate = {
    allowed: boolean;
    reason: string;
};
export declare function resolveIrcGroupMatch(params: {
    groups?: Record<string, IrcChannelConfig>;
    target: string;
}): IrcGroupMatch;
export declare function resolveIrcGroupAccessGate(params: {
    groupPolicy: IrcAccountConfig["groupPolicy"];
    groupMatch: IrcGroupMatch;
}): IrcGroupAccessGate;
export declare function resolveIrcRequireMention(params: {
    groupConfig?: IrcChannelConfig;
    wildcardConfig?: IrcChannelConfig;
}): boolean;
export declare function resolveIrcMentionGate(params: {
    isGroup: boolean;
    requireMention: boolean;
    wasMentioned: boolean;
    hasControlCommand: boolean;
    allowTextCommands: boolean;
    commandAuthorized: boolean;
}): {
    shouldSkip: boolean;
    reason: string;
};
export declare function resolveIrcGroupSenderAllowed(params: {
    groupPolicy: IrcAccountConfig["groupPolicy"];
    message: IrcInboundMessage;
    outerAllowFrom: string[];
    innerAllowFrom: string[];
    allowNameMatching?: boolean;
}): boolean;
