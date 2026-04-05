import type { OpenClawConfig } from "../config/config.js";
export type ConversationBindingContext = {
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
    threadId?: string;
};
export type ResolveConversationBindingContextInput = {
    cfg: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
    chatType?: string | null;
    threadId?: string | number | null;
    threadParentId?: string | null;
    senderId?: string | null;
    sessionKey?: string | null;
    parentSessionKey?: string | null;
    originatingTo?: string | null;
    commandTo?: string | null;
    fallbackTo?: string | null;
    from?: string | null;
    nativeChannelId?: string | null;
};
export declare function resolveConversationBindingContext(params: ResolveConversationBindingContextInput): ConversationBindingContext | null;
