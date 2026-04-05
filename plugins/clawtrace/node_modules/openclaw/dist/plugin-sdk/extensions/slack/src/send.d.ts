import { type Block, type KnownBlock, type WebClient } from "@slack/web-api";
import { type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
export type SlackSendIdentity = {
    username?: string;
    iconUrl?: string;
    iconEmoji?: string;
};
type SlackSendOpts = {
    cfg?: OpenClawConfig;
    token?: string;
    accountId?: string;
    mediaUrl?: string;
    uploadFileName?: string;
    uploadTitle?: string;
    mediaLocalRoots?: readonly string[];
    client?: WebClient;
    threadTs?: string;
    identity?: SlackSendIdentity;
    blocks?: (Block | KnownBlock)[];
};
export type SlackSendResult = {
    messageId: string;
    channelId: string;
};
export declare function clearSlackDmChannelCache(): void;
export declare function sendMessageSlack(to: string, message: string, opts?: SlackSendOpts): Promise<SlackSendResult>;
export {};
