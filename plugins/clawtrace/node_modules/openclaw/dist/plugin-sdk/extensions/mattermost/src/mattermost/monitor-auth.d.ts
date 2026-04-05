import type { ResolvedMattermostAccount } from "./accounts.js";
import type { MattermostChannel } from "./client.js";
import type { OpenClawConfig } from "./runtime-api.js";
export declare function normalizeMattermostAllowEntry(entry: string): string;
export declare function normalizeMattermostAllowList(entries: Array<string | number>): string[];
export declare function resolveMattermostEffectiveAllowFromLists(params: {
    allowFrom?: Array<string | number> | null;
    groupAllowFrom?: Array<string | number> | null;
    storeAllowFrom?: Array<string | number> | null;
    dmPolicy?: string | null;
}): {
    effectiveAllowFrom: string[];
    effectiveGroupAllowFrom: string[];
};
export declare function isMattermostSenderAllowed(params: {
    senderId: string;
    senderName?: string;
    allowFrom: string[];
    allowNameMatching?: boolean;
}): boolean;
export type MattermostCommandAuthDecision = {
    ok: true;
    commandAuthorized: boolean;
    channelInfo: MattermostChannel;
    kind: "direct" | "group" | "channel";
    chatType: "direct" | "group" | "channel";
    channelName: string;
    channelDisplay: string;
    roomLabel: string;
} | {
    ok: false;
    denyReason: "unknown-channel" | "dm-disabled" | "dm-pairing" | "unauthorized" | "channels-disabled" | "channel-no-allowlist";
    commandAuthorized: false;
    channelInfo: MattermostChannel | null;
    kind: "direct" | "group" | "channel";
    chatType: "direct" | "group" | "channel";
    channelName: string;
    channelDisplay: string;
    roomLabel: string;
};
export declare function authorizeMattermostCommandInvocation(params: {
    account: ResolvedMattermostAccount;
    cfg: OpenClawConfig;
    senderId: string;
    senderName: string;
    channelId: string;
    channelInfo: MattermostChannel | null;
    storeAllowFrom?: Array<string | number> | null;
    allowTextCommands: boolean;
    hasControlCommand: boolean;
}): MattermostCommandAuthDecision;
