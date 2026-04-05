import { type ClawdbotConfig } from "../runtime-api.js";
export type DownloadImageResult = {
    buffer: Buffer;
    contentType?: string;
};
export type DownloadMessageResourceResult = {
    buffer: Buffer;
    contentType?: string;
    fileName?: string;
};
/**
 * Download an image from Feishu using image_key.
 * Used for downloading images sent in messages.
 */
export declare function downloadImageFeishu(params: {
    cfg: ClawdbotConfig;
    imageKey: string;
    accountId?: string;
}): Promise<DownloadImageResult>;
/**
 * Download a message resource (file/image/audio/video) from Feishu.
 * Used for downloading files, audio, and video from messages.
 */
export declare function downloadMessageResourceFeishu(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    fileKey: string;
    type: "image" | "file";
    accountId?: string;
}): Promise<DownloadMessageResourceResult>;
export type UploadImageResult = {
    imageKey: string;
};
export type UploadFileResult = {
    fileKey: string;
};
export type SendMediaResult = {
    messageId: string;
    chatId: string;
};
/**
 * Upload an image to Feishu and get an image_key for sending.
 * Supports: JPEG, PNG, WEBP, GIF, TIFF, BMP, ICO
 */
export declare function uploadImageFeishu(params: {
    cfg: ClawdbotConfig;
    image: Buffer | string;
    imageType?: "message" | "avatar";
    accountId?: string;
}): Promise<UploadImageResult>;
/**
 * Sanitize a filename for safe use in Feishu multipart/form-data uploads.
 * Strips control characters and multipart-injection vectors (CWE-93) while
 * preserving the original UTF-8 display name (Chinese, emoji, etc.).
 *
 * Previous versions percent-encoded non-ASCII characters, but the Feishu
 * `im.file.create` API uses `file_name` as a literal display name — it does
 * NOT decode percent-encoding — so encoded filenames appeared as garbled text
 * in chat (regression in v2026.3.2).
 */
export declare function sanitizeFileNameForUpload(fileName: string): string;
/**
 * Upload a file to Feishu and get a file_key for sending.
 * Max file size: 30MB
 */
export declare function uploadFileFeishu(params: {
    cfg: ClawdbotConfig;
    file: Buffer | string;
    fileName: string;
    fileType: "opus" | "mp4" | "pdf" | "doc" | "xls" | "ppt" | "stream";
    duration?: number;
    accountId?: string;
}): Promise<UploadFileResult>;
/**
 * Send an image message using an image_key
 */
export declare function sendImageFeishu(params: {
    cfg: ClawdbotConfig;
    to: string;
    imageKey: string;
    replyToMessageId?: string;
    replyInThread?: boolean;
    accountId?: string;
}): Promise<SendMediaResult>;
/**
 * Send a file message using a file_key
 */
export declare function sendFileFeishu(params: {
    cfg: ClawdbotConfig;
    to: string;
    fileKey: string;
    /** Use "audio" for audio, "media" for video (mp4), "file" for documents */
    msgType?: "file" | "audio" | "media";
    replyToMessageId?: string;
    replyInThread?: boolean;
    accountId?: string;
}): Promise<SendMediaResult>;
/**
 * Helper to detect file type from extension
 */
export declare function detectFileType(fileName: string): "opus" | "mp4" | "pdf" | "doc" | "xls" | "ppt" | "stream";
/**
 * Upload and send media (image or file) from URL, local path, or buffer.
 * When mediaUrl is a local path, mediaLocalRoots (from core outbound context)
 * must be passed so loadWebMedia allows the path (post CVE-2026-26321).
 */
export declare function sendMediaFeishu(params: {
    cfg: ClawdbotConfig;
    to: string;
    mediaUrl?: string;
    mediaBuffer?: Buffer;
    fileName?: string;
    replyToMessageId?: string;
    replyInThread?: boolean;
    accountId?: string;
    /** Allowed roots for local path reads; required for local filePath to work. */
    mediaLocalRoots?: readonly string[];
}): Promise<SendMediaResult>;
