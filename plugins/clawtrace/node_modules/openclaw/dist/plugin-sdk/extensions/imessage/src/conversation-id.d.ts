import { matchIMessageAcpConversation, normalizeIMessageAcpConversationId, resolveIMessageConversationIdFromTarget } from "openclaw/plugin-sdk/imessage-core";
export { matchIMessageAcpConversation, normalizeIMessageAcpConversationId, resolveIMessageConversationIdFromTarget, };
export declare function resolveIMessageInboundConversationId(params: {
    isGroup: boolean;
    sender: string;
    chatId?: number;
}): string | undefined;
