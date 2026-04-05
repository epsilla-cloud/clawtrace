import type { loadConfig } from "openclaw/plugin-sdk/config-runtime";
import type { getReplyFromConfig } from "openclaw/plugin-sdk/reply-runtime";
import { type resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import type { getChildLogger } from "openclaw/plugin-sdk/runtime-env";
import type { WebInboundMsg } from "../types.js";
export type GroupHistoryEntry = {
    sender: string;
    body: string;
    timestamp?: number;
    id?: string;
    senderJid?: string;
};
export declare function processMessage(params: {
    cfg: ReturnType<typeof loadConfig>;
    msg: WebInboundMsg;
    route: ReturnType<typeof resolveAgentRoute>;
    groupHistoryKey: string;
    groupHistories: Map<string, GroupHistoryEntry[]>;
    groupMemberNames: Map<string, Map<string, string>>;
    connectionId: string;
    verbose: boolean;
    maxMediaBytes: number;
    replyResolver: typeof getReplyFromConfig;
    replyLogger: ReturnType<typeof getChildLogger>;
    backgroundTasks: Set<Promise<unknown>>;
    rememberSentText: (text: string | undefined, opts: {
        combinedBody?: string;
        combinedBodySessionKey?: string;
        logVerboseMessage?: boolean;
    }) => void;
    echoHas: (key: string) => boolean;
    echoForget: (key: string) => void;
    buildCombinedEchoKey: (p: {
        sessionKey: string;
        combinedBody: string;
    }) => string;
    maxMediaTextChunkLimit?: number;
    groupHistory?: GroupHistoryEntry[];
    suppressGroupHistoryClear?: boolean;
}): Promise<boolean>;
