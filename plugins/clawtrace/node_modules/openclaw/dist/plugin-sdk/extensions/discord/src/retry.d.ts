import { type RetryConfig, type RetryRunner } from "openclaw/plugin-sdk/retry-runtime";
export declare const DISCORD_RETRY_DEFAULTS: {
    attempts: number;
    minDelayMs: number;
    maxDelayMs: number;
    jitter: number;
};
export declare function createDiscordRetryRunner(params: {
    retry?: RetryConfig;
    configRetry?: RetryConfig;
    verbose?: boolean;
}): RetryRunner;
