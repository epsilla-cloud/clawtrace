type SelfChatCacheKeyParts = {
    accountId: string;
    chatGuid?: string;
    chatIdentifier?: string;
    chatId?: number;
    senderId: string;
};
type SelfChatLookup = SelfChatCacheKeyParts & {
    body?: string;
    timestamp?: number;
};
export declare function rememberBlueBubblesSelfChatCopy(lookup: SelfChatLookup): void;
export declare function hasBlueBubblesSelfChatCopy(lookup: SelfChatLookup): boolean;
export declare function resetBlueBubblesSelfChatCache(): void;
export {};
