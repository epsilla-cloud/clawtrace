/**
 * Feishu Streaming Card - Card Kit streaming API for real-time text output
 */
import type { Client } from "@larksuiteoapi/node-sdk";
import { type CardHeaderConfig } from "./send.js";
import type { FeishuDomain } from "./types.js";
type Credentials = {
    appId: string;
    appSecret: string;
    domain?: FeishuDomain;
};
/** Options for customising the initial streaming card appearance. */
export type StreamingCardOptions = {
    /** Optional header with title and color template. */
    header?: CardHeaderConfig;
    /** Optional grey note footer text. */
    note?: string;
};
/** Optional header for streaming cards (title bar with color template) */
export type StreamingCardHeader = {
    title: string;
    /** Color template: blue, green, red, orange, purple, indigo, wathet, turquoise, yellow, grey, carmine, violet, lime */
    template?: string;
};
type StreamingStartOptions = {
    replyToMessageId?: string;
    replyInThread?: boolean;
    rootId?: string;
    header?: StreamingCardHeader;
};
export declare function mergeStreamingText(previousText: string | undefined, nextText: string | undefined): string;
export declare function resolveStreamingCardSendMode(options?: StreamingStartOptions): "reply" | "create" | "root_create";
/** Streaming card session manager */
export declare class FeishuStreamingSession {
    private client;
    private creds;
    private state;
    private queue;
    private closed;
    private log?;
    private lastUpdateTime;
    private pendingText;
    private flushTimer;
    private updateThrottleMs;
    constructor(client: Client, creds: Credentials, log?: (msg: string) => void);
    start(receiveId: string, receiveIdType?: "open_id" | "user_id" | "union_id" | "email" | "chat_id", options?: StreamingCardOptions & StreamingStartOptions): Promise<void>;
    private updateCardContent;
    update(text: string): Promise<void>;
    private updateNoteContent;
    close(finalText?: string, options?: {
        note?: string;
    }): Promise<void>;
    isActive(): boolean;
}
export {};
