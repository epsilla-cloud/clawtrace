import { getReplyFromConfig } from "openclaw/plugin-sdk/reply-runtime";
import { type RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { monitorWebInbox } from "../inbound.js";
import type { WebMonitorTuning } from "./types.js";
export declare function monitorWebChannel(verbose: boolean, listenerFactory?: typeof monitorWebInbox | undefined, keepAlive?: boolean, replyResolver?: typeof getReplyFromConfig | undefined, runtime?: RuntimeEnv, abortSignal?: AbortSignal, tuning?: WebMonitorTuning): Promise<void>;
