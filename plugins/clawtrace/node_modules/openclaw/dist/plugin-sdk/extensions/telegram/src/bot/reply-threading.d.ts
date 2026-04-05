import type { ReplyToMode } from "openclaw/plugin-sdk/config-runtime";
export type DeliveryProgress = {
    hasReplied: boolean;
    hasDelivered: boolean;
};
export declare function createDeliveryProgress(): DeliveryProgress;
export declare function resolveReplyToForSend(params: {
    replyToId?: number;
    replyToMode: ReplyToMode;
    progress: DeliveryProgress;
}): number | undefined;
export declare function markReplyApplied(progress: DeliveryProgress, replyToId?: number): void;
export declare function markDelivered(progress: DeliveryProgress): void;
export declare function sendChunkedTelegramReplyText<TChunk, TReplyMarkup = unknown, TProgress extends DeliveryProgress = DeliveryProgress>(params: {
    chunks: readonly TChunk[];
    progress: TProgress;
    replyToId?: number;
    replyToMode: ReplyToMode;
    replyMarkup?: TReplyMarkup;
    replyQuoteText?: string;
    quoteOnlyOnFirstChunk?: boolean;
    markDelivered?: (progress: TProgress) => void;
    sendChunk: (opts: {
        chunk: TChunk;
        isFirstChunk: boolean;
        replyToMessageId?: number;
        replyMarkup?: TReplyMarkup;
        replyQuoteText?: string;
    }) => Promise<void>;
}): Promise<void>;
