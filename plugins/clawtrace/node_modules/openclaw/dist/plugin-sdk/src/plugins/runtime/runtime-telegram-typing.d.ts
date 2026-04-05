import type { OpenClawConfig } from "../../config/config.js";
export type CreateTelegramTypingLeaseParams = {
    to: string;
    accountId?: string;
    cfg?: OpenClawConfig;
    intervalMs?: number;
    messageThreadId?: number;
    pulse: (params: {
        to: string;
        accountId?: string;
        cfg?: OpenClawConfig;
        messageThreadId?: number;
    }) => Promise<unknown>;
};
export declare function createTelegramTypingLease(params: CreateTelegramTypingLeaseParams): Promise<{
    refresh: () => Promise<void>;
    stop: () => void;
}>;
