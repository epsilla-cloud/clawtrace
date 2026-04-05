import type { OpenClawConfig } from "./runtime-api.js";
import { type BlueBubblesAttachment } from "./types.js";
export type BlueBubblesAttachmentOpts = {
    serverUrl?: string;
    password?: string;
    accountId?: string;
    timeoutMs?: number;
    cfg?: OpenClawConfig;
};
export declare function downloadBlueBubblesAttachment(attachment: BlueBubblesAttachment, opts?: BlueBubblesAttachmentOpts & {
    maxBytes?: number;
}): Promise<{
    buffer: Uint8Array;
    contentType?: string;
}>;
export type SendBlueBubblesAttachmentResult = {
    messageId: string;
};
/**
 * Send an attachment via BlueBubbles API.
 * Supports sending media files (images, videos, audio, documents) to a chat.
 * When asVoice is true, expects MP3/CAF audio and marks it as an iMessage voice memo.
 */
export declare function sendBlueBubblesAttachment(params: {
    to: string;
    buffer: Uint8Array;
    filename: string;
    contentType?: string;
    caption?: string;
    replyToMessageGuid?: string;
    replyToPartIndex?: number;
    asVoice?: boolean;
    opts?: BlueBubblesAttachmentOpts;
}): Promise<SendBlueBubblesAttachmentResult>;
