import type { TelegramNetworkConfig } from "../runtime-api.js";
export declare function resolveTelegramChatLookupFetch(params?: {
    proxyUrl?: string;
    network?: TelegramNetworkConfig;
}): typeof fetch;
export declare function lookupTelegramChatId(params: {
    token: string;
    chatId: string;
    signal?: AbortSignal;
    apiRoot?: string;
    proxyUrl?: string;
    network?: TelegramNetworkConfig;
}): Promise<string | null>;
export declare function fetchTelegramChatId(params: {
    token: string;
    chatId: string;
    signal?: AbortSignal;
    apiRoot?: string;
    fetchImpl?: typeof fetch;
}): Promise<string | null>;
