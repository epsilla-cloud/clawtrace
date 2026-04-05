import type { OpenClawConfig, ReplyToMode } from "openclaw/plugin-sdk/config-runtime";
import { type RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { type TelegramBotDeps } from "./bot-deps.js";
import { apiThrottler, Bot, sequentialize } from "./bot.runtime.js";
import { type TelegramTransport } from "./fetch.js";
import { getTelegramSequentialKey } from "./sequential-key.js";
export type TelegramBotOptions = {
    token: string;
    accountId?: string;
    runtime?: RuntimeEnv;
    requireMention?: boolean;
    allowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    mediaMaxMb?: number;
    replyToMode?: ReplyToMode;
    proxyFetch?: typeof fetch;
    config?: OpenClawConfig;
    /** Signal to abort in-flight Telegram API fetch requests (e.g. getUpdates) on shutdown. */
    fetchAbortSignal?: AbortSignal;
    updateOffset?: {
        lastUpdateId?: number | null;
        onUpdateId?: (updateId: number) => void | Promise<void>;
    };
    testTimings?: {
        mediaGroupFlushMs?: number;
        textFragmentGapMs?: number;
    };
    /** Pre-resolved Telegram transport to reuse across bot instances. If not provided, creates a new one. */
    telegramTransport?: TelegramTransport;
    telegramDeps?: TelegramBotDeps;
};
export { getTelegramSequentialKey };
type TelegramBotRuntime = {
    Bot: typeof Bot;
    sequentialize: typeof sequentialize;
    apiThrottler: typeof apiThrottler;
};
export declare function setTelegramBotRuntimeForTest(runtime?: TelegramBotRuntime): void;
export declare function createTelegramBot(opts: TelegramBotOptions): Bot<import("grammy").Context, import("grammy").Api<import("grammy").RawApi>>;
