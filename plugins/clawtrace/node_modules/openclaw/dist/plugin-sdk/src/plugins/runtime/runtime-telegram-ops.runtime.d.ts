import { auditTelegramGroupMembership as auditTelegramGroupMembershipImpl, monitorTelegramProvider as monitorTelegramProviderImpl, probeTelegram as probeTelegramImpl } from "../../plugin-sdk/telegram.js";
import { deleteMessageTelegram as deleteMessageTelegramImpl, editMessageReplyMarkupTelegram as editMessageReplyMarkupTelegramImpl, editMessageTelegram as editMessageTelegramImpl, pinMessageTelegram as pinMessageTelegramImpl, renameForumTopicTelegram as renameForumTopicTelegramImpl, sendMessageTelegram as sendMessageTelegramImpl, sendPollTelegram as sendPollTelegramImpl, sendTypingTelegram as sendTypingTelegramImpl, unpinMessageTelegram as unpinMessageTelegramImpl } from "../../plugin-sdk/telegram.js";
export declare const runtimeTelegramOps: {
    auditGroupMembership: typeof auditTelegramGroupMembershipImpl;
    probeTelegram: typeof probeTelegramImpl;
    sendMessageTelegram: typeof sendMessageTelegramImpl;
    sendPollTelegram: typeof sendPollTelegramImpl;
    monitorTelegramProvider: typeof monitorTelegramProviderImpl;
    typing: {
        pulse: typeof sendTypingTelegramImpl;
    };
    conversationActions: {
        editMessage: typeof editMessageTelegramImpl;
        editReplyMarkup: typeof editMessageReplyMarkupTelegramImpl;
        deleteMessage: typeof deleteMessageTelegramImpl;
        renameTopic: typeof renameForumTopicTelegramImpl;
        pinMessage: typeof pinMessageTelegramImpl;
        unpinMessage: typeof unpinMessageTelegramImpl;
    };
};
