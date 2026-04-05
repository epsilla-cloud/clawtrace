import { Cx as sendPollTelegram, Ex as unpinMessageTelegram, Sx as sendMessageTelegram, Tx as sendTypingTelegram, _x as editMessageReplyMarkupTelegram, hx as deleteMessageTelegram, jb as monitorTelegramProvider, lx as probeTelegram, vx as editMessageTelegram, xx as renameForumTopicTelegram, yx as pinMessageTelegram } from "./auth-profiles-B5ypC5S-.js";
import { t as auditTelegramGroupMembership } from "./audit-B8mjM6l3.js";
//#region src/plugins/runtime/runtime-telegram-ops.runtime.ts
const runtimeTelegramOps = {
	auditGroupMembership: auditTelegramGroupMembership,
	probeTelegram,
	sendMessageTelegram,
	sendPollTelegram,
	monitorTelegramProvider,
	typing: { pulse: sendTypingTelegram },
	conversationActions: {
		editMessage: editMessageTelegram,
		editReplyMarkup: editMessageReplyMarkupTelegram,
		deleteMessage: deleteMessageTelegram,
		renameTopic: renameForumTopicTelegram,
		pinMessage: pinMessageTelegram,
		unpinMessage: unpinMessageTelegram
	}
};
//#endregion
export { runtimeTelegramOps };
