import type { IrcInboundMessage } from "./types.js";
export declare function isChannelTarget(target: string): boolean;
export declare function normalizeIrcMessagingTarget(raw: string): string | undefined;
export declare function looksLikeIrcTargetId(raw: string): boolean;
export declare function normalizeIrcAllowEntry(raw: string): string;
export declare function normalizeIrcAllowlist(entries?: Array<string | number>): string[];
export declare function formatIrcSenderId(message: IrcInboundMessage): string;
export declare function buildIrcAllowlistCandidates(message: IrcInboundMessage, params?: {
    allowNameMatching?: boolean;
}): string[];
export declare function resolveIrcAllowlistMatch(params: {
    allowFrom: string[];
    message: IrcInboundMessage;
    allowNameMatching?: boolean;
}): {
    allowed: boolean;
    source?: string;
};
