import type { OpenClawConfig } from "./runtime-api.js";
export type BlueBubblesHistoryEntry = {
    sender: string;
    body: string;
    timestamp?: number;
    messageId?: string;
};
export type BlueBubblesHistoryFetchResult = {
    entries: BlueBubblesHistoryEntry[];
    /**
     * True when at least one API path returned a recognized response shape.
     * False means all attempts failed or returned unusable data.
     */
    resolved: boolean;
};
export type BlueBubblesMessageData = {
    guid?: string;
    text?: string;
    handle_id?: string;
    is_from_me?: boolean;
    date_created?: number;
    date_delivered?: number;
    associated_message_guid?: string;
    sender?: {
        address?: string;
        display_name?: string;
    };
};
export type BlueBubblesChatOpts = {
    serverUrl?: string;
    password?: string;
    accountId?: string;
    timeoutMs?: number;
    cfg?: OpenClawConfig;
};
/**
 * Fetch message history from BlueBubbles API for a specific chat.
 * This provides the initial backfill for both group chats and DMs.
 */
export declare function fetchBlueBubblesHistory(chatIdentifier: string, limit: number, opts?: BlueBubblesChatOpts): Promise<BlueBubblesHistoryFetchResult>;
