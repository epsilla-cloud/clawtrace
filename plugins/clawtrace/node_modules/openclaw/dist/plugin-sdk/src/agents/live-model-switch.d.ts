import { type SessionEntry } from "../config/sessions.js";
import { type EmbeddedRunModelSwitchRequest } from "./pi-embedded-runner/runs.js";
export type LiveSessionModelSelection = EmbeddedRunModelSwitchRequest;
export declare class LiveSessionModelSwitchError extends Error {
    provider: string;
    model: string;
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
    constructor(selection: LiveSessionModelSelection);
}
export declare function resolveLiveSessionModelSelection(params: {
    cfg?: {
        session?: {
            store?: string;
        };
    } | undefined;
    sessionKey?: string;
    agentId?: string;
    defaultProvider: string;
    defaultModel: string;
}): LiveSessionModelSelection | null;
export declare function requestLiveSessionModelSwitch(params: {
    sessionEntry?: Pick<SessionEntry, "sessionId">;
    selection: LiveSessionModelSelection;
}): boolean;
export declare function consumeLiveSessionModelSwitch(sessionId: string): LiveSessionModelSelection | undefined;
export declare function hasDifferentLiveSessionModelSelection(current: {
    provider: string;
    model: string;
    authProfileId?: string;
    authProfileIdSource?: string;
}, next: LiveSessionModelSelection | null | undefined): next is LiveSessionModelSelection;
