import type { SessionBindingRecord } from "openclaw/plugin-sdk/conversation-runtime";
import type { DiscordMessagePreflightContext, DiscordMessagePreflightParams } from "./message-handler.preflight.types.js";
export type { DiscordMessagePreflightContext, DiscordMessagePreflightParams, } from "./message-handler.preflight.types.js";
export declare function resolvePreflightMentionRequirement(params: {
    shouldRequireMention: boolean;
    bypassMentionRequirement: boolean;
}): boolean;
export declare function shouldIgnoreBoundThreadWebhookMessage(params: {
    accountId?: string;
    threadId?: string;
    webhookId?: string | null;
    threadBinding?: SessionBindingRecord;
}): boolean;
export declare function preflightDiscordMessage(params: DiscordMessagePreflightParams): Promise<DiscordMessagePreflightContext | null>;
