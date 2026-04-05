type BlueBubblesReplyCacheEntry = {
    accountId: string;
    messageId: string;
    shortId: string;
    chatGuid?: string;
    chatIdentifier?: string;
    chatId?: number;
    senderLabel?: string;
    body?: string;
    timestamp: number;
};
export declare function rememberBlueBubblesReplyCache(entry: Omit<BlueBubblesReplyCacheEntry, "shortId">): BlueBubblesReplyCacheEntry;
/**
 * Resolves a short message ID (e.g., "1", "2") to a full BlueBubbles GUID.
 * Returns the input unchanged if it's already a GUID or not found in the mapping.
 */
export declare function resolveBlueBubblesMessageId(shortOrUuid: string, opts?: {
    requireKnownShortId?: boolean;
}): string;
/**
 * Resets the short ID state. Only use in tests.
 * @internal
 */
export declare function _resetBlueBubblesShortIdState(): void;
/**
 * Gets the short ID for a message GUID, if one exists.
 */
export declare function getShortIdForUuid(uuid: string): string | undefined;
export declare function resolveReplyContextFromCache(params: {
    accountId: string;
    replyToId: string;
    chatGuid?: string;
    chatIdentifier?: string;
    chatId?: number;
}): BlueBubblesReplyCacheEntry | null;
export {};
