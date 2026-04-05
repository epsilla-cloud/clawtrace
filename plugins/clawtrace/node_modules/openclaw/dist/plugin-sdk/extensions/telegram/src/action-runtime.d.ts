import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { type OpenClawConfig } from "../runtime-api.js";
import type { TelegramInlineButtons } from "./button-types.js";
import { createForumTopicTelegram, deleteMessageTelegram, editForumTopicTelegram, editMessageTelegram, reactMessageTelegram, sendMessageTelegram, sendPollTelegram, sendStickerTelegram } from "./send.js";
import { getCacheStats, searchStickers } from "./sticker-cache.js";
export declare const telegramActionRuntime: {
    createForumTopicTelegram: typeof createForumTopicTelegram;
    deleteMessageTelegram: typeof deleteMessageTelegram;
    editForumTopicTelegram: typeof editForumTopicTelegram;
    editMessageTelegram: typeof editMessageTelegram;
    getCacheStats: typeof getCacheStats;
    reactMessageTelegram: typeof reactMessageTelegram;
    searchStickers: typeof searchStickers;
    sendMessageTelegram: typeof sendMessageTelegram;
    sendPollTelegram: typeof sendPollTelegram;
    sendStickerTelegram: typeof sendStickerTelegram;
};
export declare function readTelegramButtons(params: Record<string, unknown>): TelegramInlineButtons | undefined;
export declare function handleTelegramAction(params: Record<string, unknown>, cfg: OpenClawConfig, options?: {
    mediaLocalRoots?: readonly string[];
}): Promise<AgentToolResult<unknown>>;
