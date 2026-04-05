import { type IrcClient } from "./client.js";
import type { RuntimeEnv } from "./runtime-api.js";
import type { CoreConfig, IrcInboundMessage } from "./types.js";
export type IrcMonitorOptions = {
    accountId?: string;
    config?: CoreConfig;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    statusSink?: (patch: {
        lastInboundAt?: number;
        lastOutboundAt?: number;
    }) => void;
    onMessage?: (message: IrcInboundMessage, client: IrcClient) => void | Promise<void>;
};
export declare function resolveIrcInboundTarget(params: {
    target: string;
    senderNick: string;
}): {
    isGroup: boolean;
    target: string;
    rawTarget: string;
};
export declare function monitorIrcProvider(opts: IrcMonitorOptions): Promise<{
    stop: () => void;
}>;
