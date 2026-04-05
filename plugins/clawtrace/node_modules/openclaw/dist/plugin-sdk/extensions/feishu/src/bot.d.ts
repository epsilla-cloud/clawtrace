import type { ClawdbotConfig, RuntimeEnv } from "../runtime-api.js";
import { type HistoryEntry } from "../runtime-api.js";
import { type FeishuPermissionError } from "./bot-sender-name.js";
import type { FeishuMessageContext } from "./types.js";
export { toMessageResourceType } from "./bot-content.js";
export type FeishuMessageEvent = {
    sender: {
        sender_id: {
            open_id?: string;
            user_id?: string;
            union_id?: string;
        };
        sender_type?: string;
        tenant_key?: string;
    };
    message: {
        message_id: string;
        root_id?: string;
        parent_id?: string;
        thread_id?: string;
        chat_id: string;
        chat_type: "p2p" | "group" | "private";
        message_type: string;
        content: string;
        create_time?: string;
        mentions?: Array<{
            key: string;
            id: {
                open_id?: string;
                user_id?: string;
                union_id?: string;
            };
            name: string;
            tenant_key?: string;
        }>;
    };
};
export type FeishuBotAddedEvent = {
    chat_id: string;
    operator_id: {
        open_id?: string;
        user_id?: string;
        union_id?: string;
    };
    external: boolean;
    operator_tenant_key?: string;
};
export declare function resolveBroadcastAgents(cfg: ClawdbotConfig, peerId: string): string[] | null;
export declare function buildBroadcastSessionKey(baseSessionKey: string, originalAgentId: string, targetAgentId: string): string;
/**
 * Build media payload for inbound context.
 * Similar to Discord's buildDiscordMediaPayload().
 */
export declare function parseFeishuMessageEvent(event: FeishuMessageEvent, botOpenId?: string, _botName?: string): FeishuMessageContext;
export declare function buildFeishuAgentBody(params: {
    ctx: Pick<FeishuMessageContext, "content" | "senderName" | "senderOpenId" | "mentionTargets" | "messageId" | "hasAnyMention">;
    quotedContent?: string;
    permissionErrorForAgent?: FeishuPermissionError;
    botOpenId?: string;
}): string;
export declare function handleFeishuMessage(params: {
    cfg: ClawdbotConfig;
    event: FeishuMessageEvent;
    botOpenId?: string;
    botName?: string;
    runtime?: RuntimeEnv;
    chatHistories?: Map<string, HistoryEntry[]>;
    accountId?: string;
    processingClaimHeld?: boolean;
}): Promise<void>;
