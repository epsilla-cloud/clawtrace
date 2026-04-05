import type { Bot } from "grammy";
import type { OpenClawConfig, ReplyToMode, TelegramAccountConfig } from "openclaw/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { type TelegramBotDeps } from "./bot-deps.js";
import type { TelegramMessageContext } from "./bot-message-context.js";
import type { TelegramBotOptions } from "./bot.js";
import type { TelegramStreamMode } from "./bot/types.js";
export declare function pruneStickerMediaFromContext(ctxPayload: {
    MediaPath?: string;
    MediaUrl?: string;
    MediaType?: string;
    MediaPaths?: string[];
    MediaUrls?: string[];
    MediaTypes?: string[];
}, opts?: {
    stickerMediaIncluded?: boolean;
}): void;
type DispatchTelegramMessageParams = {
    context: TelegramMessageContext;
    bot: Bot;
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    replyToMode: ReplyToMode;
    streamMode: TelegramStreamMode;
    textLimit: number;
    telegramCfg: TelegramAccountConfig;
    telegramDeps?: TelegramBotDeps;
    opts: Pick<TelegramBotOptions, "token">;
};
export declare const dispatchTelegramMessage: ({ context, bot, cfg, runtime, replyToMode, streamMode, textLimit, telegramCfg, telegramDeps, opts, }: DispatchTelegramMessageParams) => Promise<void>;
export {};
