import type { ClawdbotConfig } from "../runtime-api.js";
import type { FeishuMediaInfo } from "./types.js";
export type FeishuMention = {
    key: string;
    id: {
        open_id?: string;
        user_id?: string;
        union_id?: string;
    };
    name: string;
    tenant_key?: string;
};
type FeishuMessageLike = {
    message: {
        content: string;
        message_type: string;
        mentions?: FeishuMention[];
        chat_id: string;
        root_id?: string;
        parent_id?: string;
        thread_id?: string;
        message_id: string;
    };
    sender: {
        sender_id: {
            open_id?: string;
            user_id?: string;
        };
    };
};
export type GroupSessionScope = "group" | "group_sender" | "group_topic" | "group_topic_sender";
type FeishuLogger = {
    (...args: unknown[]): void;
};
export type ResolvedFeishuGroupSession = {
    peerId: string;
    parentPeer: {
        kind: "group";
        id: string;
    } | null;
    groupSessionScope: GroupSessionScope;
    replyInThread: boolean;
    threadReply: boolean;
};
export declare function resolveFeishuGroupSession(params: {
    chatId: string;
    senderOpenId: string;
    messageId: string;
    rootId?: string;
    threadId?: string;
    groupConfig?: {
        groupSessionScope?: GroupSessionScope;
        topicSessionMode?: "enabled" | "disabled";
        replyInThread?: "enabled" | "disabled";
    };
    feishuCfg?: {
        groupSessionScope?: GroupSessionScope;
        topicSessionMode?: "enabled" | "disabled";
        replyInThread?: "enabled" | "disabled";
    };
}): ResolvedFeishuGroupSession;
export declare function parseMessageContent(content: string, messageType: string): string;
export declare function parseMergeForwardContent(params: {
    content: string;
    log?: FeishuLogger;
}): string;
export declare function checkBotMentioned(event: FeishuMessageLike, botOpenId?: string): boolean;
export declare function normalizeMentions(text: string, mentions?: FeishuMention[], botStripId?: string): string;
export declare function normalizeFeishuCommandProbeBody(text: string): string;
export declare function parseMediaKeys(content: string, messageType: string): {
    imageKey?: string;
    fileKey?: string;
    fileName?: string;
};
export declare function toMessageResourceType(messageType: string): "image" | "file";
export declare function resolveFeishuMediaList(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    messageType: string;
    content: string;
    maxBytes: number;
    log?: (msg: string) => void;
    accountId?: string;
}): Promise<FeishuMediaInfo[]>;
export {};
