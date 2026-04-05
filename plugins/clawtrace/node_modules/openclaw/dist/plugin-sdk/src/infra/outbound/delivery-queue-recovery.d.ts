import type { OpenClawConfig } from "../../config/config.js";
import { type QueuedDelivery, type QueuedDeliveryPayload } from "./delivery-queue-storage.js";
export type RecoverySummary = {
    recovered: number;
    failed: number;
    skippedMaxRetries: number;
    deferredBackoff: number;
};
export type DeliverFn = (params: {
    cfg: OpenClawConfig;
} & QueuedDeliveryPayload & {
    skipQueue?: boolean;
}) => Promise<unknown>;
export interface RecoveryLogger {
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
}
declare const MAX_RETRIES = 5;
/** Compute the backoff delay in ms for a given retry count. */
export declare function computeBackoffMs(retryCount: number): number;
export declare function isEntryEligibleForRecoveryRetry(entry: QueuedDelivery, now: number): {
    eligible: true;
} | {
    eligible: false;
    remainingBackoffMs: number;
};
export declare function isPermanentDeliveryError(error: string): boolean;
/**
 * On gateway startup, scan the delivery queue and retry any pending entries.
 * Uses exponential backoff and moves entries that exceed MAX_RETRIES to failed/.
 */
export declare function recoverPendingDeliveries(opts: {
    deliver: DeliverFn;
    log: RecoveryLogger;
    cfg: OpenClawConfig;
    stateDir?: string;
    /** Maximum wall-clock time for recovery in ms. Remaining entries are deferred to next startup. Default: 60 000. */
    maxRecoveryMs?: number;
}): Promise<RecoverySummary>;
export { MAX_RETRIES };
