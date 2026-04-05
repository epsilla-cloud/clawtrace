import { type DiscordInboundJob } from "./inbound-job.js";
import type { RuntimeEnv } from "./message-handler.preflight.types.js";
import { processDiscordMessage } from "./message-handler.process.js";
import { deliverDiscordReply } from "./reply-delivery.js";
import type { DiscordMonitorStatusSink } from "./status.js";
type DiscordInboundWorkerParams = {
    runtime: RuntimeEnv;
    setStatus?: DiscordMonitorStatusSink;
    abortSignal?: AbortSignal;
    runTimeoutMs?: number;
    __testing?: DiscordInboundWorkerTestingHooks;
};
export type DiscordInboundWorker = {
    enqueue: (job: DiscordInboundJob) => void;
    deactivate: () => void;
};
export type DiscordInboundWorkerTestingHooks = {
    processDiscordMessage?: typeof processDiscordMessage;
    deliverDiscordReply?: typeof deliverDiscordReply;
};
export declare function createDiscordInboundWorker(params: DiscordInboundWorkerParams): DiscordInboundWorker;
export {};
