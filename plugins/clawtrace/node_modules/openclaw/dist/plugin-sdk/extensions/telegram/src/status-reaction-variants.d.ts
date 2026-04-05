import type { ReactionTypeEmoji } from "@grammyjs/types";
import { type StatusReactionEmojis } from "openclaw/plugin-sdk/channel-feedback";
import type { TelegramChatDetails, TelegramGetChat } from "./bot/types.js";
type StatusReactionEmojiKey = keyof Required<StatusReactionEmojis>;
export type TelegramReactionEmoji = ReactionTypeEmoji["emoji"];
export declare const TELEGRAM_STATUS_REACTION_VARIANTS: Record<StatusReactionEmojiKey, string[]>;
export declare function resolveTelegramStatusReactionEmojis(params: {
    initialEmoji: string;
    overrides?: StatusReactionEmojis;
}): Required<StatusReactionEmojis>;
export declare function buildTelegramStatusReactionVariants(emojis: Required<StatusReactionEmojis>): Map<string, string[]>;
export declare function isTelegramSupportedReactionEmoji(emoji: string): emoji is TelegramReactionEmoji;
export declare function extractTelegramAllowedEmojiReactions(chat: TelegramChatDetails | null | undefined): Set<TelegramReactionEmoji> | null | undefined;
export declare function resolveTelegramAllowedEmojiReactions(params: {
    chat: TelegramChatDetails | null | undefined;
    chatId: string | number;
    getChat?: TelegramGetChat;
}): Promise<Set<TelegramReactionEmoji> | null>;
export declare function resolveTelegramReactionVariant(params: {
    requestedEmoji: string;
    variantsByRequestedEmoji: Map<string, string[]>;
    allowedEmojiReactions?: Set<TelegramReactionEmoji> | null;
}): TelegramReactionEmoji | undefined;
export {};
