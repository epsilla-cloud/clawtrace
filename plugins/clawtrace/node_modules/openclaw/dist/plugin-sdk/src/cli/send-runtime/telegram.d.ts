import { sendMessageTelegram as sendMessageTelegramImpl } from "../../plugin-sdk/telegram-runtime.js";
export declare const runtimeSend: {
    sendMessage: typeof sendMessageTelegramImpl;
};
