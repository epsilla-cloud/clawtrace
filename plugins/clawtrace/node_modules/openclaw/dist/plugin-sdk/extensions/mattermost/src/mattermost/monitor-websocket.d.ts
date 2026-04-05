import WebSocket from "ws";
import { type MattermostPost } from "./client.js";
import type { ChannelAccountSnapshot, RuntimeEnv } from "./runtime-api.js";
export type MattermostEventPayload = {
    event?: string;
    data?: {
        post?: string | MattermostPost;
        reaction?: string | Record<string, unknown>;
        channel_id?: string;
        channel_name?: string;
        channel_display_name?: string;
        channel_type?: string;
        sender_name?: string;
        team_id?: string;
    };
    broadcast?: {
        channel_id?: string;
        team_id?: string;
        user_id?: string;
    };
};
export type MattermostWebSocketLike = {
    on(event: "open", listener: () => void): void;
    on(event: "message", listener: (data: WebSocket.RawData) => void | Promise<void>): void;
    on(event: "close", listener: (code: number, reason: Buffer) => void): void;
    on(event: "error", listener: (err: unknown) => void): void;
    send(data: string): void;
    close(): void;
    terminate(): void;
};
export type MattermostWebSocketFactory = (url: string) => MattermostWebSocketLike;
export declare class WebSocketClosedBeforeOpenError extends Error {
    readonly code: number;
    readonly reason?: string | undefined;
    constructor(code: number, reason?: string | undefined);
}
type CreateMattermostConnectOnceOpts = {
    wsUrl: string;
    botToken: string;
    abortSignal?: AbortSignal;
    statusSink?: (patch: Partial<ChannelAccountSnapshot>) => void;
    runtime: RuntimeEnv;
    nextSeq: () => number;
    onPosted: (post: MattermostPost, payload: MattermostEventPayload) => Promise<void>;
    onReaction?: (payload: MattermostEventPayload) => Promise<void>;
    webSocketFactory?: MattermostWebSocketFactory;
};
export declare const defaultMattermostWebSocketFactory: MattermostWebSocketFactory;
export declare function parsePostedPayload(payload: MattermostEventPayload): {
    payload: MattermostEventPayload;
    post: MattermostPost;
} | null;
export declare function parsePostedEvent(data: WebSocket.RawData): {
    payload: MattermostEventPayload;
    post: MattermostPost;
} | null;
export declare function createMattermostConnectOnce(opts: CreateMattermostConnectOnceOpts): () => Promise<void>;
export {};
