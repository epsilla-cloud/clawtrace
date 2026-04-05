import { type RetryConfig } from "openclaw/plugin-sdk/retry-runtime";
export declare class DiscordApiError extends Error {
    status: number;
    retryAfter?: number;
    constructor(message: string, status: number, retryAfter?: number);
}
export type DiscordFetchOptions = {
    retry?: RetryConfig;
    label?: string;
};
export declare function fetchDiscord<T>(path: string, token: string, fetcher?: typeof fetch, options?: DiscordFetchOptions): Promise<T>;
