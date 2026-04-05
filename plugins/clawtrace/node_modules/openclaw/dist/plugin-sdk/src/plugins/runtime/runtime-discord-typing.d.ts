export type CreateDiscordTypingLeaseParams = {
    channelId: string;
    accountId?: string;
    cfg?: ReturnType<typeof import("../../config/config.js").loadConfig>;
    intervalMs?: number;
    pulse: (params: {
        channelId: string;
        accountId?: string;
        cfg?: ReturnType<typeof import("../../config/config.js").loadConfig>;
    }) => Promise<void>;
};
export declare function createDiscordTypingLease(params: CreateDiscordTypingLeaseParams): Promise<{
    refresh: () => Promise<void>;
    stop: () => void;
}>;
