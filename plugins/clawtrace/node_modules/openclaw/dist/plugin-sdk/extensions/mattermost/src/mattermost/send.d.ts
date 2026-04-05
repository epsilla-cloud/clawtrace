import { type CreateDmChannelRetryOptions } from "./client.js";
import { type MattermostInteractiveButtonInput } from "./interactions.js";
import { type OpenClawConfig } from "./runtime-api.js";
export type MattermostSendOpts = {
    cfg?: OpenClawConfig;
    botToken?: string;
    baseUrl?: string;
    accountId?: string;
    mediaUrl?: string;
    mediaLocalRoots?: readonly string[];
    replyToId?: string;
    props?: Record<string, unknown>;
    buttons?: Array<unknown>;
    attachmentText?: string;
    /** Retry options for DM channel creation */
    dmRetryOptions?: CreateDmChannelRetryOptions;
};
export type MattermostSendResult = {
    messageId: string;
    channelId: string;
};
export type MattermostReplyButtons = Array<MattermostInteractiveButtonInput | MattermostInteractiveButtonInput[]>;
type MattermostTarget = {
    kind: "channel";
    id: string;
} | {
    kind: "channel-name";
    name: string;
} | {
    kind: "user";
    id?: string;
    username?: string;
};
export declare function parseMattermostTarget(raw: string): MattermostTarget;
export declare function resolveMattermostSendChannelId(to: string, opts?: MattermostSendOpts): Promise<string>;
export declare function sendMessageMattermost(to: string, text: string, opts?: MattermostSendOpts): Promise<MattermostSendResult>;
export {};
