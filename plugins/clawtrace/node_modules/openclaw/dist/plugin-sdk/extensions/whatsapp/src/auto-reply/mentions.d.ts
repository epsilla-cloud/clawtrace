import type { loadConfig } from "openclaw/plugin-sdk/config-runtime";
import { type WhatsAppIdentity } from "../identity.js";
import type { WebInboundMsg } from "./types.js";
export type MentionConfig = {
    mentionRegexes: RegExp[];
    allowFrom?: Array<string | number>;
};
export type MentionTargets = {
    normalizedMentions: WhatsAppIdentity[];
    self: WhatsAppIdentity;
};
export declare function buildMentionConfig(cfg: ReturnType<typeof loadConfig>, agentId?: string): MentionConfig;
export declare function resolveMentionTargets(msg: WebInboundMsg, authDir?: string): MentionTargets;
export declare function isBotMentionedFromTargets(msg: WebInboundMsg, mentionCfg: MentionConfig, targets: MentionTargets): boolean;
export declare function debugMention(msg: WebInboundMsg, mentionCfg: MentionConfig, authDir?: string): {
    wasMentioned: boolean;
    details: Record<string, unknown>;
};
export declare function resolveOwnerList(mentionCfg: MentionConfig, selfE164?: string | null): string[];
