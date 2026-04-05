import { type IncomingMessage, type Server } from "node:http";
import { type RuntimeEnv } from "../runtime-api.js";
import type { CoreConfig, NextcloudTalkInboundMessage, NextcloudTalkWebhookServerOptions } from "./types.js";
export declare function readNextcloudTalkWebhookBody(req: IncomingMessage, maxBodyBytes: number): Promise<string>;
export declare function createNextcloudTalkWebhookServer(opts: NextcloudTalkWebhookServerOptions): {
    server: Server;
    start: () => Promise<void>;
    stop: () => void;
};
export type NextcloudTalkMonitorOptions = {
    accountId?: string;
    config?: CoreConfig;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    onMessage?: (message: NextcloudTalkInboundMessage) => void | Promise<void>;
    statusSink?: (patch: {
        lastInboundAt?: number;
        lastOutboundAt?: number;
    }) => void;
};
export declare function monitorNextcloudTalkProvider(opts: NextcloudTalkMonitorOptions): Promise<{
    stop: () => void;
}>;
