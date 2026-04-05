import type { CoreConfig, NextcloudTalkSendResult } from "./types.js";
type NextcloudTalkSendOpts = {
    baseUrl?: string;
    secret?: string;
    accountId?: string;
    replyTo?: string;
    verbose?: boolean;
    cfg?: CoreConfig;
};
export declare function sendMessageNextcloudTalk(to: string, text: string, opts?: NextcloudTalkSendOpts): Promise<NextcloudTalkSendResult>;
export declare function sendReactionNextcloudTalk(roomToken: string, messageId: string, reaction: string, opts?: Omit<NextcloudTalkSendOpts, "replyTo">): Promise<{
    ok: true;
}>;
export {};
