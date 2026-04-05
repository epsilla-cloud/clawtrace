export type RaceWithTimeoutAndAbortResult<T> = {
    status: "resolved";
    value: T;
} | {
    status: "timeout";
} | {
    status: "aborted";
};
export declare function raceWithTimeoutAndAbort<T>(promise: Promise<T>, options?: {
    timeoutMs?: number;
    abortSignal?: AbortSignal;
}): Promise<RaceWithTimeoutAndAbortResult<T>>;
export declare function waitForAbortableDelay(delayMs: number, abortSignal?: AbortSignal): Promise<boolean>;
