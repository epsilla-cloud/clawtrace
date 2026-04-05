export type InteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
export type InteractiveReplyButton = {
    label: string;
    value: string;
    style?: InteractiveButtonStyle;
};
export type InteractiveReplyOption = {
    label: string;
    value: string;
};
export type InteractiveReplyTextBlock = {
    type: "text";
    text: string;
};
export type InteractiveReplyButtonsBlock = {
    type: "buttons";
    buttons: InteractiveReplyButton[];
};
export type InteractiveReplySelectBlock = {
    type: "select";
    placeholder?: string;
    options: InteractiveReplyOption[];
};
export type InteractiveReplyBlock = InteractiveReplyTextBlock | InteractiveReplyButtonsBlock | InteractiveReplySelectBlock;
export type InteractiveReply = {
    blocks: InteractiveReplyBlock[];
};
export declare function normalizeInteractiveReply(raw: unknown): InteractiveReply | undefined;
export declare function hasInteractiveReplyBlocks(value: unknown): value is InteractiveReply;
export declare function hasReplyChannelData(value: unknown): value is Record<string, unknown>;
export declare function hasReplyContent(params: {
    text?: string | null;
    mediaUrl?: string | null;
    mediaUrls?: ReadonlyArray<string | null | undefined>;
    interactive?: unknown;
    hasChannelData?: boolean;
    extraContent?: boolean;
}): boolean;
export declare function hasReplyPayloadContent(payload: {
    text?: string | null;
    mediaUrl?: string | null;
    mediaUrls?: ReadonlyArray<string | null | undefined>;
    interactive?: unknown;
    channelData?: unknown;
}, options?: {
    trimText?: boolean;
    hasChannelData?: boolean;
    extraContent?: boolean;
}): boolean;
export declare function resolveInteractiveTextFallback(params: {
    text?: string;
    interactive?: InteractiveReply;
}): string | undefined;
