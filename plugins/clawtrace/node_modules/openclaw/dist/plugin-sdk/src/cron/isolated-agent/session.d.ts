import type { OpenClawConfig } from "../../config/config.js";
import { type SessionEntry } from "../../config/sessions.js";
export declare function resolveCronSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    nowMs: number;
    agentId: string;
    forceNew?: boolean;
}): {
    storePath: string;
    store: Record<string, SessionEntry>;
    sessionEntry: SessionEntry;
    systemSent: boolean;
    isNewSession: boolean;
};
