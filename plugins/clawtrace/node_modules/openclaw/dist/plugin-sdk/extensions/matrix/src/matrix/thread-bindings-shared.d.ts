import type { BindingTargetKind, SessionBindingRecord } from "openclaw/plugin-sdk/thread-bindings-runtime";
export type MatrixThreadBindingTargetKind = "subagent" | "acp";
export type MatrixThreadBindingRecord = {
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
    targetKind: MatrixThreadBindingTargetKind;
    targetSessionKey: string;
    agentId?: string;
    label?: string;
    boundBy?: string;
    boundAt: number;
    lastActivityAt: number;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
};
export type MatrixThreadBindingManager = {
    accountId: string;
    getIdleTimeoutMs: () => number;
    getMaxAgeMs: () => number;
    getByConversation: (params: {
        conversationId: string;
        parentConversationId?: string;
    }) => MatrixThreadBindingRecord | undefined;
    listBySessionKey: (targetSessionKey: string) => MatrixThreadBindingRecord[];
    listBindings: () => MatrixThreadBindingRecord[];
    touchBinding: (bindingId: string, at?: number) => MatrixThreadBindingRecord | null;
    setIdleTimeoutBySessionKey: (params: {
        targetSessionKey: string;
        idleTimeoutMs: number;
    }) => MatrixThreadBindingRecord[];
    setMaxAgeBySessionKey: (params: {
        targetSessionKey: string;
        maxAgeMs: number;
    }) => MatrixThreadBindingRecord[];
    stop: () => void;
};
export type MatrixThreadBindingManagerCacheEntry = {
    filePath: string;
    manager: MatrixThreadBindingManager;
};
export declare function resolveBindingKey(params: {
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
}): string;
export declare function toMatrixBindingTargetKind(raw: BindingTargetKind): MatrixThreadBindingTargetKind;
export declare function resolveEffectiveBindingExpiry(params: {
    record: MatrixThreadBindingRecord;
    defaultIdleTimeoutMs: number;
    defaultMaxAgeMs: number;
}): {
    expiresAt?: number;
    reason?: "idle-expired" | "max-age-expired";
};
export declare function toSessionBindingRecord(record: MatrixThreadBindingRecord, defaults: {
    idleTimeoutMs: number;
    maxAgeMs: number;
}): SessionBindingRecord;
export declare function setBindingRecord(record: MatrixThreadBindingRecord): void;
export declare function removeBindingRecord(record: MatrixThreadBindingRecord): MatrixThreadBindingRecord | null;
export declare function listBindingsForAccount(accountId: string): MatrixThreadBindingRecord[];
export declare function getMatrixThreadBindingManagerEntry(accountId: string): MatrixThreadBindingManagerCacheEntry | null;
export declare function setMatrixThreadBindingManagerEntry(accountId: string, entry: MatrixThreadBindingManagerCacheEntry): void;
export declare function deleteMatrixThreadBindingManagerEntry(accountId: string): void;
export declare function getMatrixThreadBindingManager(accountId: string): MatrixThreadBindingManager | null;
export declare function setMatrixThreadBindingIdleTimeoutBySessionKey(params: {
    accountId: string;
    targetSessionKey: string;
    idleTimeoutMs: number;
}): SessionBindingRecord[];
export declare function setMatrixThreadBindingMaxAgeBySessionKey(params: {
    accountId: string;
    targetSessionKey: string;
    maxAgeMs: number;
}): SessionBindingRecord[];
export declare function resetMatrixThreadBindingsForTests(): void;
