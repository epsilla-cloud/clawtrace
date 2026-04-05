/**
 * Zalo Bot API client
 * @see https://bot.zaloplatforms.com/docs
 */
export type ZaloFetch = (input: string, init?: RequestInit) => Promise<Response>;
export type ZaloApiResponse<T = unknown> = {
    ok: boolean;
    result?: T;
    error_code?: number;
    description?: string;
};
export type ZaloBotInfo = {
    id: string;
    name: string;
    avatar?: string;
};
export type ZaloMessage = {
    message_id: string;
    from: {
        id: string;
        name?: string;
        display_name?: string;
        avatar?: string;
        is_bot?: boolean;
    };
    chat: {
        id: string;
        chat_type: "PRIVATE" | "GROUP";
    };
    date: number;
    text?: string;
    photo_url?: string;
    caption?: string;
    sticker?: string;
    message_type?: string;
};
export type ZaloUpdate = {
    event_name: "message.text.received" | "message.image.received" | "message.sticker.received" | "message.unsupported.received";
    message?: ZaloMessage;
};
export type ZaloSendMessageParams = {
    chat_id: string;
    text: string;
};
export type ZaloSendPhotoParams = {
    chat_id: string;
    photo: string;
    caption?: string;
};
export type ZaloSendChatActionParams = {
    chat_id: string;
    action: "typing" | "upload_photo";
};
export type ZaloSetWebhookParams = {
    url: string;
    secret_token: string;
};
export type ZaloWebhookInfo = {
    url?: string;
    updated_at?: number;
    has_custom_certificate?: boolean;
};
export type ZaloGetUpdatesParams = {
    /** Timeout in seconds (passed as string to API) */
    timeout?: number;
};
export declare class ZaloApiError extends Error {
    readonly errorCode?: number | undefined;
    readonly description?: string | undefined;
    constructor(message: string, errorCode?: number | undefined, description?: string | undefined);
    /** True if this is a long-polling timeout (no updates available) */
    get isPollingTimeout(): boolean;
}
/**
 * Call the Zalo Bot API
 */
export declare function callZaloApi<T = unknown>(method: string, token: string, body?: Record<string, unknown>, options?: {
    timeoutMs?: number;
    fetch?: ZaloFetch;
}): Promise<ZaloApiResponse<T>>;
/**
 * Validate bot token and get bot info
 */
export declare function getMe(token: string, timeoutMs?: number, fetcher?: ZaloFetch): Promise<ZaloApiResponse<ZaloBotInfo>>;
/**
 * Send a text message
 */
export declare function sendMessage(token: string, params: ZaloSendMessageParams, fetcher?: ZaloFetch): Promise<ZaloApiResponse<ZaloMessage>>;
/**
 * Send a photo message
 */
export declare function sendPhoto(token: string, params: ZaloSendPhotoParams, fetcher?: ZaloFetch): Promise<ZaloApiResponse<ZaloMessage>>;
/**
 * Send a temporary chat action such as typing.
 */
export declare function sendChatAction(token: string, params: ZaloSendChatActionParams, fetcher?: ZaloFetch, timeoutMs?: number): Promise<ZaloApiResponse<boolean>>;
/**
 * Get updates using long polling (dev/testing only)
 * Note: Zalo returns a single update per call, not an array like Telegram
 */
export declare function getUpdates(token: string, params?: ZaloGetUpdatesParams, fetcher?: ZaloFetch): Promise<ZaloApiResponse<ZaloUpdate>>;
/**
 * Set webhook URL for receiving updates
 */
export declare function setWebhook(token: string, params: ZaloSetWebhookParams, fetcher?: ZaloFetch): Promise<ZaloApiResponse<ZaloWebhookInfo>>;
/**
 * Delete webhook configuration
 */
export declare function deleteWebhook(token: string, fetcher?: ZaloFetch, timeoutMs?: number): Promise<ZaloApiResponse<ZaloWebhookInfo>>;
/**
 * Get current webhook info
 */
export declare function getWebhookInfo(token: string, fetcher?: ZaloFetch): Promise<ZaloApiResponse<ZaloWebhookInfo>>;
