import { type ChatChannelId } from "./ids.js";
import type { ChannelMeta } from "./plugins/types.js";
export type ChatChannelMeta = ChannelMeta;
export declare const CHAT_CHANNEL_ALIASES: Record<string, ChatChannelId>;
export declare function listChatChannels(): ChatChannelMeta[];
export declare function listChatChannelAliases(): string[];
export declare function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta;
export declare function normalizeChatChannelId(raw?: string | null): ChatChannelId | null;
