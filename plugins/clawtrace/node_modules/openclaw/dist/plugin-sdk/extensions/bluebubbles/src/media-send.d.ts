import { type OpenClawConfig } from "./runtime-api.js";
export declare function sendBlueBubblesMedia(params: {
    cfg: OpenClawConfig;
    to: string;
    mediaUrl?: string;
    mediaPath?: string;
    mediaBuffer?: Uint8Array;
    contentType?: string;
    filename?: string;
    caption?: string;
    replyToId?: string | null;
    accountId?: string;
    asVoice?: boolean;
}): Promise<import("./attachments.js").SendBlueBubblesAttachmentResult>;
