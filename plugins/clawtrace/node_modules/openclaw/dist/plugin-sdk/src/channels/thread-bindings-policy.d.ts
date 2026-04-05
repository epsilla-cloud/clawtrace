import type { OpenClawConfig } from "../config/config.js";
export declare const DISCORD_THREAD_BINDING_CHANNEL = "discord";
export declare const MATRIX_THREAD_BINDING_CHANNEL = "matrix";
export type ThreadBindingSpawnKind = "subagent" | "acp";
export type ThreadBindingSpawnPolicy = {
    channel: string;
    accountId: string;
    enabled: boolean;
    spawnEnabled: boolean;
};
export declare function supportsAutomaticThreadBindingSpawn(channel: string): boolean;
export declare function requiresNativeThreadContextForThreadHere(channel: string): boolean;
export declare function resolveThreadBindingPlacementForCurrentContext(params: {
    channel: string;
    threadId?: string;
}): "current" | "child";
export declare function resolveThreadBindingIdleTimeoutMs(params: {
    channelIdleHoursRaw: unknown;
    sessionIdleHoursRaw: unknown;
}): number;
export declare function resolveThreadBindingMaxAgeMs(params: {
    channelMaxAgeHoursRaw: unknown;
    sessionMaxAgeHoursRaw: unknown;
}): number;
type ThreadBindingLifecycleRecord = {
    boundAt: number;
    lastActivityAt: number;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
};
export declare function resolveThreadBindingLifecycle(params: {
    record: ThreadBindingLifecycleRecord;
    defaultIdleTimeoutMs: number;
    defaultMaxAgeMs: number;
}): {
    expiresAt?: number;
    reason?: "idle-expired" | "max-age-expired";
};
export declare function resolveThreadBindingEffectiveExpiresAt(params: {
    record: ThreadBindingLifecycleRecord;
    defaultIdleTimeoutMs: number;
    defaultMaxAgeMs: number;
}): number | undefined;
export declare function resolveThreadBindingsEnabled(params: {
    channelEnabledRaw: unknown;
    sessionEnabledRaw: unknown;
}): boolean;
export declare function resolveThreadBindingSpawnPolicy(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId?: string;
    kind: ThreadBindingSpawnKind;
}): ThreadBindingSpawnPolicy;
export declare function resolveThreadBindingIdleTimeoutMsForChannel(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId?: string;
}): number;
export declare function resolveThreadBindingMaxAgeMsForChannel(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId?: string;
}): number;
export declare function formatThreadBindingDisabledError(params: {
    channel: string;
    accountId: string;
    kind: ThreadBindingSpawnKind;
}): string;
export declare function formatThreadBindingSpawnDisabledError(params: {
    channel: string;
    accountId: string;
    kind: ThreadBindingSpawnKind;
}): string;
export {};
