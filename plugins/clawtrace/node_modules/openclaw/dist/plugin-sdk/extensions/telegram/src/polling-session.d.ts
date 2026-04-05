import { type RunOptions } from "@grammyjs/runner";
import { createTelegramBot } from "./bot.js";
import { type TelegramTransport } from "./fetch.js";
type TelegramPollingSessionOpts = {
    token: string;
    config: Parameters<typeof createTelegramBot>[0]["config"];
    accountId: string;
    runtime: Parameters<typeof createTelegramBot>[0]["runtime"];
    proxyFetch: Parameters<typeof createTelegramBot>[0]["proxyFetch"];
    abortSignal?: AbortSignal;
    runnerOptions: RunOptions<unknown>;
    getLastUpdateId: () => number | null;
    persistUpdateId: (updateId: number) => Promise<void>;
    log: (line: string) => void;
    /** Pre-resolved Telegram transport to reuse across bot instances */
    telegramTransport?: TelegramTransport;
    /** Rebuild Telegram transport after stall/network recovery when marked dirty. */
    createTelegramTransport?: () => TelegramTransport;
};
export declare class TelegramPollingSession {
    #private;
    private readonly opts;
    constructor(opts: TelegramPollingSessionOpts);
    get activeRunner(): import("@grammyjs/runner").RunnerHandle | undefined;
    markForceRestarted(): void;
    markTransportDirty(): void;
    abortActiveFetch(): void;
    runUntilAbort(): Promise<void>;
}
export {};
