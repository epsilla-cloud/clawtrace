export declare function normalizeBlueBubblesAcpConversationId(conversationId: string): {
    conversationId: string;
} | null;
export declare function matchBlueBubblesAcpConversation(params: {
    bindingConversationId: string;
    conversationId: string;
}): {
    conversationId: string;
    matchPriority: number;
} | null;
export declare function resolveBlueBubblesInboundConversationId(params: {
    isGroup: boolean;
    sender: string;
    chatId?: number | null;
    chatGuid?: string | null;
    chatIdentifier?: string | null;
}): string | undefined;
export declare function resolveBlueBubblesConversationIdFromTarget(target: string): string | undefined;
