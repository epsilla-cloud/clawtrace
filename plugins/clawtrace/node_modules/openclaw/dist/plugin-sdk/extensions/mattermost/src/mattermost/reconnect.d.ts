export type ReconnectOutcome = "resolved" | "rejected";
export type ShouldReconnectParams = {
    attempt: number;
    delayMs: number;
    outcome: ReconnectOutcome;
    error?: unknown;
};
export type RunWithReconnectOpts = {
    abortSignal?: AbortSignal;
    onError?: (err: unknown) => void;
    onReconnect?: (delayMs: number) => void;
    initialDelayMs?: number;
    maxDelayMs?: number;
    jitterRatio?: number;
    random?: () => number;
    shouldReconnect?: (params: ShouldReconnectParams) => boolean;
};
/**
 * Reconnection loop with exponential backoff.
 *
 * Calls `connectFn` in a while loop. On normal resolve (connection closed),
 * the backoff resets. On thrown error (connection failed), the current delay is
 * used, then doubled for the next retry.
 * The loop exits when `abortSignal` fires.
 */
export declare function runWithReconnect(connectFn: () => Promise<void>, opts?: RunWithReconnectOpts): Promise<void>;
