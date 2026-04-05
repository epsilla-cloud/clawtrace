import type { ChannelMessageActionAdapter } from "openclaw/plugin-sdk/channel-contract";
import { handleTelegramAction } from "./action-runtime.js";
export declare const telegramMessageActionRuntime: {
    handleTelegramAction: typeof handleTelegramAction;
};
export declare const telegramMessageActions: ChannelMessageActionAdapter;
