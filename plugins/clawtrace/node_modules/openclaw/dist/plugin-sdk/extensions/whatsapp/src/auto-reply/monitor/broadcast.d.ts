import type { loadConfig } from "openclaw/plugin-sdk/config-runtime";
import type { resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import type { WebInboundMsg } from "../types.js";
import type { GroupHistoryEntry } from "./process-message.js";
export declare function maybeBroadcastMessage(params: {
    cfg: ReturnType<typeof loadConfig>;
    msg: WebInboundMsg;
    peerId: string;
    route: ReturnType<typeof resolveAgentRoute>;
    groupHistoryKey: string;
    groupHistories: Map<string, GroupHistoryEntry[]>;
    processMessage: (msg: WebInboundMsg, route: ReturnType<typeof resolveAgentRoute>, groupHistoryKey: string, opts?: {
        groupHistory?: GroupHistoryEntry[];
        suppressGroupHistoryClear?: boolean;
    }) => Promise<boolean>;
}): Promise<boolean>;
