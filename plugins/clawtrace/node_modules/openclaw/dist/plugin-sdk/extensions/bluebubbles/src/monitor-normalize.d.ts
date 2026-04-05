import type { BlueBubblesAttachment } from "./types.js";
export declare function buildMessagePlaceholder(message: NormalizedWebhookMessage): string;
export declare function formatReplyTag(message: {
    replyToId?: string;
    replyToShortId?: string;
}): string | null;
export declare function normalizeParticipantList(raw: unknown): BlueBubblesParticipant[];
export declare function formatGroupMembers(params: {
    participants?: BlueBubblesParticipant[];
    fallback?: BlueBubblesParticipant;
}): string | undefined;
export declare function resolveGroupFlagFromChatGuid(chatGuid?: string | null): boolean | undefined;
export declare function formatGroupAllowlistEntry(params: {
    chatGuid?: string;
    chatId?: number;
    chatIdentifier?: string;
}): string | null;
export type BlueBubblesParticipant = {
    id: string;
    name?: string;
};
export type NormalizedWebhookMessage = {
    text: string;
    senderId: string;
    senderIdExplicit: boolean;
    senderName?: string;
    messageId?: string;
    timestamp?: number;
    isGroup: boolean;
    chatId?: number;
    chatGuid?: string;
    chatIdentifier?: string;
    chatName?: string;
    fromMe?: boolean;
    attachments?: BlueBubblesAttachment[];
    balloonBundleId?: string;
    associatedMessageGuid?: string;
    associatedMessageType?: number;
    associatedMessageEmoji?: string;
    isTapback?: boolean;
    participants?: BlueBubblesParticipant[];
    replyToId?: string;
    replyToBody?: string;
    replyToSender?: string;
};
export type NormalizedWebhookReaction = {
    action: "added" | "removed";
    emoji: string;
    senderId: string;
    senderIdExplicit: boolean;
    senderName?: string;
    messageId: string;
    timestamp?: number;
    isGroup: boolean;
    chatId?: number;
    chatGuid?: string;
    chatIdentifier?: string;
    chatName?: string;
    fromMe?: boolean;
};
export declare function resolveTapbackContext(message: NormalizedWebhookMessage): {
    emojiHint?: string;
    actionHint?: "added" | "removed";
    replyToId?: string;
} | null;
export declare function parseTapbackText(params: {
    text: string;
    emojiHint?: string;
    actionHint?: "added" | "removed";
    requireQuoted?: boolean;
}): {
    emoji: string;
    action: "added" | "removed";
    quotedText: string;
} | null;
export declare function normalizeWebhookMessage(payload: Record<string, unknown>): NormalizedWebhookMessage | null;
export declare function normalizeWebhookReaction(payload: Record<string, unknown>): NormalizedWebhookReaction | null;
