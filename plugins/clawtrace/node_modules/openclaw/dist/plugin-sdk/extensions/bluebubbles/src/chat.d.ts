import type { OpenClawConfig } from "./runtime-api.js";
export type BlueBubblesChatOpts = {
    serverUrl?: string;
    password?: string;
    accountId?: string;
    timeoutMs?: number;
    cfg?: OpenClawConfig;
};
export declare function markBlueBubblesChatRead(chatGuid: string, opts?: BlueBubblesChatOpts): Promise<void>;
export declare function sendBlueBubblesTyping(chatGuid: string, typing: boolean, opts?: BlueBubblesChatOpts): Promise<void>;
/**
 * Edit a message via BlueBubbles API.
 * Requires macOS 13 (Ventura) or higher with Private API enabled.
 */
export declare function editBlueBubblesMessage(messageGuid: string, newText: string, opts?: BlueBubblesChatOpts & {
    partIndex?: number;
    backwardsCompatMessage?: string;
}): Promise<void>;
/**
 * Unsend (retract) a message via BlueBubbles API.
 * Requires macOS 13 (Ventura) or higher with Private API enabled.
 */
export declare function unsendBlueBubblesMessage(messageGuid: string, opts?: BlueBubblesChatOpts & {
    partIndex?: number;
}): Promise<void>;
/**
 * Rename a group chat via BlueBubbles API.
 */
export declare function renameBlueBubblesChat(chatGuid: string, displayName: string, opts?: BlueBubblesChatOpts): Promise<void>;
/**
 * Add a participant to a group chat via BlueBubbles API.
 */
export declare function addBlueBubblesParticipant(chatGuid: string, address: string, opts?: BlueBubblesChatOpts): Promise<void>;
/**
 * Remove a participant from a group chat via BlueBubbles API.
 */
export declare function removeBlueBubblesParticipant(chatGuid: string, address: string, opts?: BlueBubblesChatOpts): Promise<void>;
/**
 * Leave a group chat via BlueBubbles API.
 */
export declare function leaveBlueBubblesChat(chatGuid: string, opts?: BlueBubblesChatOpts): Promise<void>;
/**
 * Set a group chat's icon/photo via BlueBubbles API.
 * Requires Private API to be enabled.
 */
export declare function setGroupIconBlueBubbles(chatGuid: string, buffer: Uint8Array, filename: string, opts?: BlueBubblesChatOpts & {
    contentType?: string;
}): Promise<void>;
