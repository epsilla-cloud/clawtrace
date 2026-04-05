import type { ThinkLevel, VerboseLevel } from "../../auto-reply/thinking.js";
import { loadConfig } from "../../config/config.js";
import { type SessionEntry } from "../../config/sessions.js";
import { resolveMessageChannel } from "../../utils/message-channel.js";
import { buildWorkspaceSkillSnapshot } from "../skills.js";
import { resolveAgentRunContext } from "./run-context.js";
import type { AgentCommandOpts } from "./types.js";
export type PersistSessionEntryParams = {
    sessionStore: Record<string, SessionEntry>;
    sessionKey: string;
    storePath: string;
    entry: SessionEntry;
    clearedFields?: string[];
};
export declare function persistSessionEntry(params: PersistSessionEntryParams): Promise<void>;
export declare function resolveFallbackRetryPrompt(params: {
    body: string;
    isFallbackRetry: boolean;
}): string;
export declare function prependInternalEventContext(body: string, events: AgentCommandOpts["internalEvents"]): string;
export declare function createAcpVisibleTextAccumulator(): {
    consume(chunk: string): {
        text: string;
        delta: string;
    } | null;
    finalize(): string;
    finalizeRaw(): string;
};
export declare function persistAcpTurnTranscript(params: {
    body: string;
    finalText: string;
    sessionId: string;
    sessionKey: string;
    sessionEntry: SessionEntry | undefined;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    sessionAgentId: string;
    threadId?: string | number;
    sessionCwd: string;
}): Promise<SessionEntry | undefined>;
export declare function runAgentAttempt(params: {
    providerOverride: string;
    modelOverride: string;
    cfg: ReturnType<typeof loadConfig>;
    sessionEntry: SessionEntry | undefined;
    sessionId: string;
    sessionKey: string | undefined;
    sessionAgentId: string;
    sessionFile: string;
    workspaceDir: string;
    body: string;
    isFallbackRetry: boolean;
    resolvedThinkLevel: ThinkLevel;
    timeoutMs: number;
    runId: string;
    opts: AgentCommandOpts & {
        senderIsOwner: boolean;
    };
    runContext: ReturnType<typeof resolveAgentRunContext>;
    spawnedBy: string | undefined;
    messageChannel: ReturnType<typeof resolveMessageChannel>;
    skillsSnapshot: ReturnType<typeof buildWorkspaceSkillSnapshot> | undefined;
    resolvedVerboseLevel: VerboseLevel | undefined;
    agentDir: string;
    onAgentEvent: (evt: {
        stream: string;
        data?: Record<string, unknown>;
    }) => void;
    authProfileProvider: string;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    allowTransientCooldownProbe?: boolean;
}): Promise<import("../pi-embedded.js").EmbeddedPiRunResult>;
export declare function buildAcpResult(params: {
    payloadText: string;
    startedAt: number;
    stopReason?: string;
    abortSignal?: AbortSignal;
}): {
    payloads: import("../../auto-reply/types.ts").ReplyPayload[];
    meta: {
        durationMs: number;
        aborted: boolean;
        stopReason: string | undefined;
    };
};
export declare function emitAcpLifecycleStart(params: {
    runId: string;
    startedAt: number;
}): void;
export declare function emitAcpLifecycleEnd(params: {
    runId: string;
}): void;
export declare function emitAcpLifecycleError(params: {
    runId: string;
    message: string;
}): void;
export declare function emitAcpAssistantDelta(params: {
    runId: string;
    text: string;
    delta: string;
}): void;
