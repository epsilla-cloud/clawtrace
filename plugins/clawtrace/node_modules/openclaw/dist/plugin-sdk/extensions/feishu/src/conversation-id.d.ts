export type FeishuGroupSessionScope = "group" | "group_sender" | "group_topic" | "group_topic_sender";
export declare function buildFeishuConversationId(params: {
    chatId: string;
    scope: FeishuGroupSessionScope;
    senderOpenId?: string;
    topicId?: string;
}): string;
export declare function parseFeishuTargetId(raw: unknown): string | undefined;
export declare function parseFeishuDirectConversationId(raw: unknown): string | undefined;
export declare function parseFeishuConversationId(params: {
    conversationId: string;
    parentConversationId?: string;
}): {
    canonicalConversationId: string;
    chatId: string;
    topicId?: string;
    senderOpenId?: string;
    scope: FeishuGroupSessionScope;
} | null;
