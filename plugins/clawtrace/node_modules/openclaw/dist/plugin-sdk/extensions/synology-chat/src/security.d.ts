/**
 * Security module: token validation, rate limiting, input sanitization, user allowlist.
 */
export type DmAuthorizationResult = {
    allowed: true;
} | {
    allowed: false;
    reason: "disabled" | "allowlist-empty" | "not-allowlisted";
};
/**
 * Validate webhook token using constant-time comparison.
 * Prevents timing attacks that could leak token bytes.
 */
export declare function validateToken(received: string, expected: string): boolean;
/**
 * Check if a user ID is in the allowed list.
 * Allowlist mode must be explicit; empty lists should not match any user.
 */
export declare function checkUserAllowed(userId: string, allowedUserIds: string[]): boolean;
/**
 * Resolve DM authorization for a sender across all DM policy modes.
 * Keeps policy semantics in one place so webhook/startup behavior stays consistent.
 */
export declare function authorizeUserForDm(userId: string, dmPolicy: "open" | "allowlist" | "disabled", allowedUserIds: string[]): DmAuthorizationResult;
/**
 * Sanitize user input to prevent prompt injection attacks.
 * Filters known dangerous patterns and truncates long messages.
 */
export declare function sanitizeInput(text: string): string;
/**
 * Sliding window rate limiter per user ID.
 */
export declare class RateLimiter {
    private readonly limiter;
    private readonly limit;
    constructor(limit?: number, windowSeconds?: number, maxTrackedUsers?: number);
    /** Returns true if the request is allowed, false if rate-limited. */
    check(userId: string): boolean;
    /** Exposed for tests and diagnostics. */
    size(): number;
    /** Exposed for tests and account lifecycle cleanup. */
    clear(): void;
    /** Exposed for tests. */
    maxRequests(): number;
}
