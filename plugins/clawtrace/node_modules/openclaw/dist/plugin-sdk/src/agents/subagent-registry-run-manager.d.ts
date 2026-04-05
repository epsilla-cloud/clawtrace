import { loadConfig } from "../config/config.js";
import { type DeliveryContext } from "../utils/delivery-context.js";
import type { SubagentRunOutcome } from "./subagent-announce.js";
import { type SubagentLifecycleEndedReason } from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
export declare function createSubagentRunManager(params: {
    runs: Map<string, SubagentRunRecord>;
    resumedRuns: Set<string>;
    endedHookInFlightRunIds: Set<string>;
    persist(): void;
    ensureListener(): void;
    startSweeper(): void;
    stopSweeper(): void;
    resumeSubagentRun(runId: string): void;
    clearPendingLifecycleError(runId: string): void;
    resolveSubagentWaitTimeoutMs(cfg: ReturnType<typeof loadConfig>, runTimeoutSeconds?: number): number;
    notifyContextEngineSubagentEnded(args: {
        childSessionKey: string;
        reason: "completed" | "deleted" | "released";
        workspaceDir?: string;
    }): Promise<void>;
    completeCleanupBookkeeping(args: {
        runId: string;
        entry: SubagentRunRecord;
        cleanup: "delete" | "keep";
        completedAt: number;
    }): void;
    completeSubagentRun(args: {
        runId: string;
        endedAt?: number;
        outcome: SubagentRunOutcome;
        reason: SubagentLifecycleEndedReason;
        sendFarewell?: boolean;
        accountId?: string;
        triggerCleanup: boolean;
    }): Promise<void>;
}): {
    clearSubagentRunSteerRestart: (runId: string) => boolean;
    markSubagentRunForSteerRestart: (runId: string) => boolean;
    markSubagentRunTerminated: (markParams: {
        runId?: string;
        childSessionKey?: string;
        reason?: string;
    }) => number;
    registerSubagentRun: (registerParams: {
        runId: string;
        childSessionKey: string;
        controllerSessionKey?: string;
        requesterSessionKey: string;
        requesterOrigin?: DeliveryContext;
        requesterDisplayKey: string;
        task: string;
        cleanup: "delete" | "keep";
        label?: string;
        model?: string;
        workspaceDir?: string;
        runTimeoutSeconds?: number;
        expectsCompletionMessage?: boolean;
        spawnMode?: "run" | "session";
        attachmentsDir?: string;
        attachmentsRootDir?: string;
        retainAttachmentsOnKeep?: boolean;
    }) => void;
    releaseSubagentRun: (runId: string) => void;
    replaceSubagentRunAfterSteer: (replaceParams: {
        previousRunId: string;
        nextRunId: string;
        fallback?: SubagentRunRecord;
        runTimeoutSeconds?: number;
        preserveFrozenResultFallback?: boolean;
    }) => boolean;
    waitForSubagentCompletion: (runId: string, waitTimeoutMs: number) => Promise<void>;
};
