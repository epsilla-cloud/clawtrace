import type { ClawdbotConfig, RuntimeEnv } from "../runtime-api.js";
/**
 * Custom error class for Feishu backoff conditions detected from non-throwing
 * SDK responses. Carries a numeric `.code` so that `isFeishuBackoffError()`
 * recognises it when the error is caught downstream.
 */
export declare class FeishuBackoffError extends Error {
    code: number;
    constructor(code: number);
}
export type TypingIndicatorState = {
    messageId: string;
    reactionId: string | null;
};
/**
 * Check whether an error represents a rate-limit or quota-exceeded condition
 * from the Feishu API that should stop the typing keepalive loop.
 *
 * Handles two shapes:
 * 1. AxiosError with `response.status` and `response.data.code`
 * 2. Feishu SDK error with a top-level `code` property
 */
export declare function isFeishuBackoffError(err: unknown): boolean;
/**
 * Check whether a Feishu SDK response object contains a backoff error code.
 *
 * The Feishu SDK sometimes returns a normal response (no throw) with an
 * API-level error code in the response body. This must be detected so the
 * circuit breaker can trip. See codex review on #28157.
 */
export declare function getBackoffCodeFromResponse(response: unknown): number | undefined;
/**
 * Add a typing indicator (reaction) to a message.
 *
 * Rate-limit and quota errors are re-thrown so the circuit breaker in
 * `createTypingCallbacks` (typing-start-guard) can trip and stop the
 * keepalive loop. See #28062.
 *
 * Also checks for backoff codes in non-throwing SDK responses (#28157).
 */
export declare function addTypingIndicator(params: {
    cfg: ClawdbotConfig;
    messageId: string;
    accountId?: string;
    runtime?: RuntimeEnv;
}): Promise<TypingIndicatorState>;
/**
 * Remove a typing indicator (reaction) from a message.
 *
 * Rate-limit and quota errors are re-thrown for the same reason as above.
 */
export declare function removeTypingIndicator(params: {
    cfg: ClawdbotConfig;
    state: TypingIndicatorState;
    accountId?: string;
    runtime?: RuntimeEnv;
}): Promise<void>;
