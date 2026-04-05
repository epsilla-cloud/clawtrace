import type { MarkdownTableMode } from "openclaw/plugin-sdk/config-runtime";
import type { ChunkMode } from "openclaw/plugin-sdk/reply-runtime";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { type SlackSendIdentity } from "../send.js";
export declare function readSlackReplyBlocks(payload: ReplyPayload): (import("@slack/types").Block | import("@slack/types").KnownBlock)[] | undefined;
export declare function deliverReplies(params: {
    replies: ReplyPayload[];
    target: string;
    token: string;
    accountId?: string;
    runtime: RuntimeEnv;
    textLimit: number;
    replyThreadTs?: string;
    replyToMode: "off" | "first" | "all";
    identity?: SlackSendIdentity;
}): Promise<void>;
export type SlackRespondFn = (payload: {
    text: string;
    response_type?: "ephemeral" | "in_channel";
}) => Promise<unknown>;
/**
 * Compute effective threadTs for a Slack reply based on replyToMode.
 * - "off": stay in thread if already in one, otherwise main channel
 * - "first": first reply goes to thread, subsequent replies to main channel
 * - "all": all replies go to thread
 */
export declare function resolveSlackThreadTs(params: {
    replyToMode: "off" | "first" | "all";
    incomingThreadTs: string | undefined;
    messageTs: string | undefined;
    hasReplied: boolean;
    isThreadReply?: boolean;
}): string | undefined;
type SlackReplyDeliveryPlan = {
    nextThreadTs: () => string | undefined;
    markSent: () => void;
};
export declare function createSlackReplyDeliveryPlan(params: {
    replyToMode: "off" | "first" | "all";
    incomingThreadTs: string | undefined;
    messageTs: string | undefined;
    hasRepliedRef: {
        value: boolean;
    };
    isThreadReply?: boolean;
}): SlackReplyDeliveryPlan;
export declare function deliverSlackSlashReplies(params: {
    replies: ReplyPayload[];
    respond: SlackRespondFn;
    ephemeral: boolean;
    textLimit: number;
    tableMode?: MarkdownTableMode;
    chunkMode?: ChunkMode;
}): Promise<void>;
export {};
