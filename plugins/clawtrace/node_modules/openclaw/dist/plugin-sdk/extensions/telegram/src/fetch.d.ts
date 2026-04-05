import type { TelegramNetworkConfig } from "openclaw/plugin-sdk/config-runtime";
import { type PinnedDispatcherPolicy } from "openclaw/plugin-sdk/fetch-runtime";
type TelegramDispatcherAttempt = {
    dispatcherPolicy?: PinnedDispatcherPolicy;
};
export declare function shouldRetryTelegramTransportFallback(err: unknown): boolean;
export type TelegramTransport = {
    fetch: typeof fetch;
    sourceFetch: typeof fetch;
    dispatcherAttempts?: TelegramDispatcherAttempt[];
};
export declare function resolveTelegramTransport(proxyFetch?: typeof fetch, options?: {
    network?: TelegramNetworkConfig;
}): TelegramTransport;
export declare function resolveTelegramFetch(proxyFetch?: typeof fetch, options?: {
    network?: TelegramNetworkConfig;
}): typeof fetch;
/**
 * Resolve the Telegram Bot API base URL from an optional `apiRoot` config value.
 * Returns a trimmed URL without trailing slash, or the standard default.
 */
export declare function resolveTelegramApiBase(apiRoot?: string): string;
export {};
