import { messagingApi } from "@line/bot-sdk";
import { type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { LineSendResult } from "./types.js";
type Message = messagingApi.Message;
type TextMessage = messagingApi.TextMessage;
type ImageMessage = messagingApi.ImageMessage;
type LocationMessage = messagingApi.LocationMessage;
type FlexContainer = messagingApi.FlexContainer;
type TemplateMessage = messagingApi.TemplateMessage;
type QuickReply = messagingApi.QuickReply;
interface LineSendOpts {
    cfg?: OpenClawConfig;
    channelAccessToken?: string;
    accountId?: string;
    verbose?: boolean;
    mediaUrl?: string;
    replyToken?: string;
}
type LinePushOpts = Pick<LineSendOpts, "cfg" | "channelAccessToken" | "accountId" | "verbose">;
export declare function createImageMessage(originalContentUrl: string, previewImageUrl?: string): ImageMessage;
export declare function createLocationMessage(location: {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
}): LocationMessage;
export declare function sendMessageLine(to: string, text: string, opts?: LineSendOpts): Promise<LineSendResult>;
export declare function pushMessageLine(to: string, text: string, opts?: LineSendOpts): Promise<LineSendResult>;
export declare function replyMessageLine(replyToken: string, messages: Message[], opts?: LinePushOpts): Promise<void>;
export declare function pushMessagesLine(to: string, messages: Message[], opts?: LinePushOpts): Promise<LineSendResult>;
export declare function createFlexMessage(altText: string, contents: messagingApi.FlexContainer): messagingApi.FlexMessage;
export declare function pushImageMessage(to: string, originalContentUrl: string, previewImageUrl?: string, opts?: LinePushOpts): Promise<LineSendResult>;
export declare function pushLocationMessage(to: string, location: {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
}, opts?: LinePushOpts): Promise<LineSendResult>;
export declare function pushFlexMessage(to: string, altText: string, contents: FlexContainer, opts?: LinePushOpts): Promise<LineSendResult>;
export declare function pushTemplateMessage(to: string, template: TemplateMessage, opts?: LinePushOpts): Promise<LineSendResult>;
export declare function pushTextMessageWithQuickReplies(to: string, text: string, quickReplyLabels: string[], opts?: LinePushOpts): Promise<LineSendResult>;
export declare function createQuickReplyItems(labels: string[]): QuickReply;
export declare function createTextMessageWithQuickReplies(text: string, quickReplyLabels: string[]): TextMessage & {
    quickReply: QuickReply;
};
export declare function showLoadingAnimation(chatId: string, opts?: {
    channelAccessToken?: string;
    accountId?: string;
    loadingSeconds?: number;
}): Promise<void>;
export declare function getUserProfile(userId: string, opts?: {
    channelAccessToken?: string;
    accountId?: string;
    useCache?: boolean;
}): Promise<{
    displayName: string;
    pictureUrl?: string;
} | null>;
export declare function getUserDisplayName(userId: string, opts?: {
    channelAccessToken?: string;
    accountId?: string;
}): Promise<string>;
export {};
