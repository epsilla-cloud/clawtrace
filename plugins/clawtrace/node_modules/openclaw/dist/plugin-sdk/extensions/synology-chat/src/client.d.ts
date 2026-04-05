/**
 * Synology Chat HTTP client.
 * Sends messages TO Synology Chat via the incoming webhook URL.
 */
interface ChatUser {
    user_id: number;
    username: string;
    nickname: string;
}
/**
 * Send a text message to Synology Chat via the incoming webhook.
 *
 * @param incomingUrl - Synology Chat incoming webhook URL
 * @param text - Message text to send
 * @param userId - Optional user ID to mention with @
 * @returns true if sent successfully
 */
export declare function sendMessage(incomingUrl: string, text: string, userId?: string | number, allowInsecureSsl?: boolean): Promise<boolean>;
/**
 * Send a file URL to Synology Chat.
 */
export declare function sendFileUrl(incomingUrl: string, fileUrl: string, userId?: string | number, allowInsecureSsl?: boolean): Promise<boolean>;
/**
 * Fetch the list of Chat users visible to this bot via the user_list API.
 * Results are cached for CACHE_TTL_MS to avoid excessive API calls.
 *
 * The user_list endpoint uses the same base URL as the chatbot API but
 * with method=user_list instead of method=chatbot.
 */
export declare function fetchChatUsers(incomingUrl: string, allowInsecureSsl?: boolean, log?: {
    warn: (...args: unknown[]) => void;
}): Promise<ChatUser[]>;
/**
 * Resolve a mutable webhook username/nickname to the correct Chat API user_id.
 *
 * Synology Chat outgoing webhooks send a user_id that may NOT match the
 * Chat-internal user_id needed by the chatbot API (method=chatbot).
 * The webhook's "username" field corresponds to the Chat user's "nickname".
 *
 * @returns The correct Chat user_id, or undefined if not found
 */
export declare function resolveLegacyWebhookNameToChatUserId(params: {
    incomingUrl: string;
    mutableWebhookUsername: string;
    allowInsecureSsl?: boolean;
    log?: {
        warn: (...args: unknown[]) => void;
    };
}): Promise<number | undefined>;
export {};
