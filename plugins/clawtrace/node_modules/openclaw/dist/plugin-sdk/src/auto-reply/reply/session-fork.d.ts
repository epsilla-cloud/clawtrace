import type { OpenClawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions/types.js";
export declare function resolveParentForkMaxTokens(cfg: OpenClawConfig): number;
export declare function forkSessionFromParent(params: {
    parentEntry: SessionEntry;
    agentId: string;
    sessionsDir: string;
}): Promise<{
    sessionId: string;
    sessionFile: string;
} | null>;
