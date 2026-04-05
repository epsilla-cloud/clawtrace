import * as grammy from "grammy";
declare const FALLBACK_ALL_UPDATE_TYPES: readonly ["message", "edited_message", "channel_post", "edited_channel_post", "business_connection", "business_message", "edited_business_message", "deleted_business_messages", "message_reaction", "message_reaction_count", "inline_query", "chosen_inline_result", "callback_query", "shipping_query", "pre_checkout_query", "poll", "poll_answer", "my_chat_member", "chat_member", "chat_join_request"];
export type TelegramUpdateType = (typeof FALLBACK_ALL_UPDATE_TYPES)[number] | (typeof grammy.API_CONSTANTS.ALL_UPDATE_TYPES)[number];
export declare const DEFAULT_TELEGRAM_UPDATE_TYPES: ReadonlyArray<TelegramUpdateType>;
export declare function resolveTelegramAllowedUpdates(): ReadonlyArray<TelegramUpdateType>;
export {};
