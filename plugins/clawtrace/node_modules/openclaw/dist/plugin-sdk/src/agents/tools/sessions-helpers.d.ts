export type { AgentToAgentPolicy, SessionAccessAction, SessionAccessResult, SessionToolsVisibility, } from "./sessions-access.js";
export { createAgentToAgentPolicy, createSessionVisibilityGuard, resolveEffectiveSessionToolsVisibility, resolveSandboxSessionToolsVisibility, resolveSandboxedSessionToolContext, resolveSessionToolsVisibility, } from "./sessions-access.js";
export type { SessionReferenceResolution } from "./sessions-resolution.js";
export { isRequesterSpawnedSessionVisible, isResolvedSessionVisibleToRequester, listSpawnedSessionKeys, looksLikeSessionId, looksLikeSessionKey, resolveDisplaySessionKey, resolveInternalSessionKey, resolveMainSessionAlias, resolveSessionReference, resolveVisibleSessionReference, shouldResolveSessionIdInput, shouldVerifyRequesterSpawnedSessionVisibility, } from "./sessions-resolution.js";
import { type OpenClawConfig } from "../../config/config.js";
export type SessionKind = "main" | "group" | "cron" | "hook" | "node" | "other";
export type SessionListDeliveryContext = {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
};
export type SessionRunStatus = "running" | "done" | "failed" | "killed" | "timeout";
export type SessionListRow = {
    key: string;
    kind: SessionKind;
    channel: string;
    origin?: {
        provider?: string;
        accountId?: string;
    };
    spawnedBy?: string;
    label?: string;
    displayName?: string;
    parentSessionKey?: string;
    deliveryContext?: SessionListDeliveryContext;
    updatedAt?: number | null;
    sessionId?: string;
    model?: string;
    contextTokens?: number | null;
    totalTokens?: number | null;
    estimatedCostUsd?: number;
    status?: SessionRunStatus;
    startedAt?: number;
    endedAt?: number;
    runtimeMs?: number;
    childSessions?: string[];
    thinkingLevel?: string;
    fastMode?: boolean;
    verboseLevel?: string;
    reasoningLevel?: string;
    elevatedLevel?: string;
    responseUsage?: string;
    systemSent?: boolean;
    abortedLastRun?: boolean;
    sendPolicy?: string;
    lastChannel?: string;
    lastTo?: string;
    lastAccountId?: string;
    transcriptPath?: string;
    messages?: unknown[];
};
export declare function resolveSessionToolContext(opts?: {
    agentSessionKey?: string;
    sandboxed?: boolean;
    config?: OpenClawConfig;
}): {
    mainKey: string;
    alias: string;
    visibility: "spawned" | "all";
    requesterInternalKey: string | undefined;
    effectiveRequesterKey: string;
    restrictToSpawned: boolean;
    cfg: OpenClawConfig;
};
export declare function classifySessionKind(params: {
    key: string;
    gatewayKind?: string | null;
    alias: string;
    mainKey: string;
}): SessionKind;
export declare function deriveChannel(params: {
    key: string;
    kind: SessionKind;
    channel?: string | null;
    lastChannel?: string | null;
}): string;
export declare function stripToolMessages(messages: unknown[]): unknown[];
/**
 * Sanitize text content to strip tool call markers and thinking tags.
 * This ensures user-facing text doesn't leak internal tool representations.
 */
export declare function sanitizeTextContent(text: string): string;
export declare function extractAssistantText(message: unknown): string | undefined;
