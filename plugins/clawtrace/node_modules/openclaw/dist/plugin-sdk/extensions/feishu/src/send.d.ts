import type { ClawdbotConfig } from "../runtime-api.js";
import type { MentionTarget } from "./mention.js";
import type { FeishuMessageInfo, FeishuSendResult } from "./types.js";
/**
 * Get a message by its ID.
 * Useful for fetching quoted/replied message content.
 */
export declare function getMessageFeishu(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    accountId?: string;
}): Promise<FeishuMessageInfo | null>;
export type FeishuThreadMessageInfo = {
    messageId: string;
    senderId?: string;
    senderType?: string;
    content: string;
    contentType: string;
    createTime?: number;
};
/**
 * List messages in a Feishu thread (topic).
 * Uses container_id_type=thread to directly query thread messages,
 * which includes both the root message and all replies (including bot replies).
 */
export declare function listFeishuThreadMessages(params: {
    cfg: ClawdbotConfig;
    threadId: string;
    currentMessageId?: string;
    /** Exclude the root message (already provided separately as ThreadStarterBody). */
    rootMessageId?: string;
    limit?: number;
    accountId?: string;
}): Promise<FeishuThreadMessageInfo[]>;
export type SendFeishuMessageParams = {
    cfg: ClawdbotConfig;
    to: string;
    text: string;
    replyToMessageId?: string;
    /** When true, reply creates a Feishu topic thread instead of an inline reply */
    replyInThread?: boolean;
    /** Mention target users */
    mentions?: MentionTarget[];
    /** Account ID (optional, uses default if not specified) */
    accountId?: string;
};
export declare function buildFeishuPostMessagePayload(params: {
    messageText: string;
}): {
    content: string;
    msgType: string;
};
export declare function sendMessageFeishu(params: SendFeishuMessageParams): Promise<FeishuSendResult>;
export type SendFeishuCardParams = {
    cfg: ClawdbotConfig;
    to: string;
    card: Record<string, unknown>;
    replyToMessageId?: string;
    /** When true, reply creates a Feishu topic thread instead of an inline reply */
    replyInThread?: boolean;
    accountId?: string;
};
export declare function sendCardFeishu(params: SendFeishuCardParams): Promise<FeishuSendResult>;
export declare function editMessageFeishu(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    text?: string;
    card?: Record<string, unknown>;
    accountId?: string;
}): Promise<{
    messageId: string;
    contentType: "post" | "interactive";
}>;
export declare function updateCardFeishu(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    card: Record<string, unknown>;
    accountId?: string;
}): Promise<void>;
/**
 * Build a Feishu interactive card with markdown content.
 * Cards render markdown properly (code blocks, tables, links, etc.)
 * Uses schema 2.0 format for proper markdown rendering.
 */
export declare function buildMarkdownCard(text: string): Record<string, unknown>;
/** Header configuration for structured Feishu cards. */
export type CardHeaderConfig = {
    /** Header title text, e.g. "💻 Coder" */
    title: string;
    /** Feishu header color template (blue, green, red, orange, purple, grey, etc.). Defaults to "blue". */
    template?: string;
};
export declare function resolveFeishuCardTemplate(template?: string): string | undefined;
/**
 * Build a Feishu interactive card with optional header and note footer.
 * When header/note are omitted, behaves identically to buildMarkdownCard.
 */
export declare function buildStructuredCard(text: string, options?: {
    header?: CardHeaderConfig;
    note?: string;
}): Record<string, unknown>;
/**
 * Send a message as a structured card with optional header and note.
 */
export declare function sendStructuredCardFeishu(params: {
    cfg: ClawdbotConfig;
    to: string;
    text: string;
    replyToMessageId?: string;
    /** When true, reply creates a Feishu topic thread instead of an inline reply */
    replyInThread?: boolean;
    mentions?: MentionTarget[];
    accountId?: string;
    header?: CardHeaderConfig;
    note?: string;
}): Promise<FeishuSendResult>;
/**
 * Send a message as a markdown card (interactive message).
 * This renders markdown properly in Feishu (code blocks, tables, bold/italic, etc.)
 */
export declare function sendMarkdownCardFeishu(params: {
    cfg: ClawdbotConfig;
    to: string;
    text: string;
    replyToMessageId?: string;
    /** When true, reply creates a Feishu topic thread instead of an inline reply */
    replyInThread?: boolean;
    /** Mention target users */
    mentions?: MentionTarget[];
    accountId?: string;
}): Promise<FeishuSendResult>;
