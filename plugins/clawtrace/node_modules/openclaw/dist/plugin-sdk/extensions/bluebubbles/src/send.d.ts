import type { OpenClawConfig } from "./runtime-api.js";
import { type BlueBubblesSendTarget } from "./types.js";
export type BlueBubblesSendOpts = {
    serverUrl?: string;
    password?: string;
    accountId?: string;
    timeoutMs?: number;
    cfg?: OpenClawConfig;
    /** Message GUID to reply to (reply threading) */
    replyToMessageGuid?: string;
    /** Part index for reply (default: 0) */
    replyToPartIndex?: number;
    /** Effect ID or short name for message effects (e.g., "slam", "balloons") */
    effectId?: string;
};
export type BlueBubblesSendResult = {
    messageId: string;
};
export declare function resolveChatGuidForTarget(params: {
    baseUrl: string;
    password: string;
    timeoutMs?: number;
    target: BlueBubblesSendTarget;
    allowPrivateNetwork?: boolean;
}): Promise<string | null>;
/**
 * Creates a new DM chat for the given address and returns the chat GUID.
 * Requires Private API to be enabled in BlueBubbles.
 *
 * If a `message` is provided it is sent as the initial message in the new chat;
 * otherwise an empty-string message body is used (BlueBubbles still creates the
 * chat but will not deliver a visible bubble).
 */
export declare function createChatForHandle(params: {
    baseUrl: string;
    password: string;
    address: string;
    message?: string;
    timeoutMs?: number;
    allowPrivateNetwork?: boolean;
}): Promise<{
    chatGuid: string | null;
    messageId: string;
}>;
export declare function sendMessageBlueBubbles(to: string, text: string, opts?: BlueBubblesSendOpts): Promise<BlueBubblesSendResult>;
