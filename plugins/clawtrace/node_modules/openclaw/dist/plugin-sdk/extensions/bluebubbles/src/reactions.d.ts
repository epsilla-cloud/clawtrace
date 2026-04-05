import type { OpenClawConfig } from "./runtime-api.js";
export type BlueBubblesReactionOpts = {
    serverUrl?: string;
    password?: string;
    accountId?: string;
    timeoutMs?: number;
    cfg?: OpenClawConfig;
};
export declare function normalizeBlueBubblesReactionInput(emoji: string, remove?: boolean): string;
export declare function sendBlueBubblesReaction(params: {
    chatGuid: string;
    messageGuid: string;
    emoji: string;
    remove?: boolean;
    partIndex?: number;
    opts?: BlueBubblesReactionOpts;
}): Promise<void>;
