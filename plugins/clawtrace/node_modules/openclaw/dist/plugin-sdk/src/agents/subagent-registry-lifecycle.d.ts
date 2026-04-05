import { type SubagentRunOutcome } from "./subagent-announce.js";
import { type SubagentLifecycleEndedReason } from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
export declare function createSubagentRegistryLifecycleController(params: {
    runs: Map<string, SubagentRunRecord>;
    resumedRuns: Set<string>;
    subagentAnnounceTimeoutMs: number;
    persist(): void;
    clearPendingLifecycleError(runId: string): void;
    countPendingDescendantRuns(rootSessionKey: string): number;
    suppressAnnounceForSteerRestart(entry?: SubagentRunRecord): boolean;
    shouldEmitEndedHookForRun(args: {
        entry: SubagentRunRecord;
        reason: SubagentLifecycleEndedReason;
    }): boolean;
    emitSubagentEndedHookForRun(args: {
        entry: SubagentRunRecord;
        reason?: SubagentLifecycleEndedReason;
        sendFarewell?: boolean;
        accountId?: string;
    }): Promise<void>;
    notifyContextEngineSubagentEnded(args: {
        childSessionKey: string;
        reason: "completed" | "deleted";
        workspaceDir?: string;
    }): Promise<void>;
    resumeSubagentRun(runId: string): void;
    warn(message: string, meta?: Record<string, unknown>): void;
}): {
    completeCleanupBookkeeping: (cleanupParams: {
        runId: string;
        entry: SubagentRunRecord;
        cleanup: "delete" | "keep";
        completedAt: number;
    }) => void;
    completeSubagentRun: (completeParams: {
        runId: string;
        endedAt?: number;
        outcome: SubagentRunOutcome;
        reason: SubagentLifecycleEndedReason;
        sendFarewell?: boolean;
        accountId?: string;
        triggerCleanup: boolean;
    }) => Promise<void>;
    finalizeResumedAnnounceGiveUp: (giveUpParams: {
        runId: string;
        entry: SubagentRunRecord;
        reason: "retry-limit" | "expiry";
    }) => Promise<void>;
    refreshFrozenResultFromSession: (sessionKey: string) => Promise<boolean>;
    startSubagentAnnounceCleanupFlow: (runId: string, entry: SubagentRunRecord) => boolean;
};
