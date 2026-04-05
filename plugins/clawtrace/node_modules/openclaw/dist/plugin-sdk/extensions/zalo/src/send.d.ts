import type { OpenClawConfig } from "./runtime-api.js";
export type ZaloSendOptions = {
    token?: string;
    accountId?: string;
    cfg?: OpenClawConfig;
    mediaUrl?: string;
    caption?: string;
    verbose?: boolean;
    proxy?: string;
};
export type ZaloSendResult = {
    ok: boolean;
    messageId?: string;
    error?: string;
};
export declare function sendMessageZalo(chatId: string, text: string, options?: ZaloSendOptions): Promise<ZaloSendResult>;
export declare function sendPhotoZalo(chatId: string, photoUrl: string, options?: ZaloSendOptions): Promise<ZaloSendResult>;
