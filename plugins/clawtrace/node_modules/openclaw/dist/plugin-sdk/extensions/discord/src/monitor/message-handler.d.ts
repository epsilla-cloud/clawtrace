import { type DiscordInboundWorkerTestingHooks } from "./inbound-worker.js";
import type { DiscordMessageHandler } from "./listeners.js";
import { preflightDiscordMessage } from "./message-handler.preflight.js";
import type { DiscordMessagePreflightParams } from "./message-handler.preflight.types.js";
import type { DiscordMonitorStatusSink } from "./status.js";
type DiscordMessageHandlerParams = Omit<DiscordMessagePreflightParams, "ackReactionScope" | "groupPolicy" | "data" | "client"> & {
    setStatus?: DiscordMonitorStatusSink;
    abortSignal?: AbortSignal;
    workerRunTimeoutMs?: number;
    __testing?: DiscordMessageHandlerTestingHooks;
};
type DiscordMessageHandlerTestingHooks = DiscordInboundWorkerTestingHooks & {
    preflightDiscordMessage?: typeof preflightDiscordMessage;
};
export type DiscordMessageHandlerWithLifecycle = DiscordMessageHandler & {
    deactivate: () => void;
};
export declare function createDiscordMessageHandler(params: DiscordMessageHandlerParams): DiscordMessageHandlerWithLifecycle;
export {};
