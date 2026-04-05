export declare const MATRIX_ANNOTATION_RELATION_TYPE = "m.annotation";
export declare const MATRIX_REACTION_EVENT_TYPE = "m.reaction";
export type MatrixReactionEventContent = {
    "m.relates_to": {
        rel_type: typeof MATRIX_ANNOTATION_RELATION_TYPE;
        event_id: string;
        key: string;
    };
};
export type MatrixReactionSummary = {
    key: string;
    count: number;
    users: string[];
};
export type MatrixReactionAnnotation = {
    key: string;
    eventId?: string;
};
type MatrixReactionEventLike = {
    content?: unknown;
    sender?: string | null;
    event_id?: string | null;
};
export declare function normalizeMatrixReactionMessageId(messageId: string): string;
export declare function normalizeMatrixReactionEmoji(emoji: string): string;
export declare function buildMatrixReactionContent(messageId: string, emoji: string): MatrixReactionEventContent;
export declare function buildMatrixReactionRelationsPath(roomId: string, messageId: string): string;
export declare function extractMatrixReactionAnnotation(content: unknown): MatrixReactionAnnotation | undefined;
export declare function extractMatrixReactionKey(content: unknown): string | undefined;
export declare function summarizeMatrixReactionEvents(events: Iterable<Pick<MatrixReactionEventLike, "content" | "sender">>): MatrixReactionSummary[];
export declare function selectOwnMatrixReactionEventIds(events: Iterable<Pick<MatrixReactionEventLike, "content" | "event_id" | "sender">>, userId: string, emoji?: string): string[];
export {};
