import "./zod-schema.providers-core-BV8OcGxh.js";
import "./status-helpers-CH_H6L7d.js";
import "./channel-plugin-common-CWL2csZC.js";
import { y as readSnakeCaseParamRaw } from "./common-B7JFWTj2.js";
//#region src/acp/conversation-id.ts
function normalizeConversationText(value) {
	if (typeof value === "string") return value.trim();
	if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") return `${value}`.trim();
	return "";
}
function buildTelegramTopicConversationId(params) {
	const chatId = params.chatId.trim();
	const topicId = params.topicId.trim();
	if (!/^-?\d+$/.test(chatId) || !/^\d+$/.test(topicId)) return null;
	return `${chatId}:topic:${topicId}`;
}
function parseTelegramTopicConversation(params) {
	const conversation = params.conversationId.trim();
	const directMatch = conversation.match(/^(-?\d+):topic:(\d+)$/);
	if (directMatch?.[1] && directMatch[2]) {
		const canonicalConversationId = buildTelegramTopicConversationId({
			chatId: directMatch[1],
			topicId: directMatch[2]
		});
		if (!canonicalConversationId) return null;
		return {
			chatId: directMatch[1],
			topicId: directMatch[2],
			canonicalConversationId
		};
	}
	if (!/^\d+$/.test(conversation)) return null;
	const parent = params.parentConversationId?.trim();
	if (!parent || !/^-?\d+$/.test(parent)) return null;
	const canonicalConversationId = buildTelegramTopicConversationId({
		chatId: parent,
		topicId: conversation
	});
	if (!canonicalConversationId) return null;
	return {
		chatId: parent,
		topicId: conversation,
		canonicalConversationId
	};
}
//#endregion
//#region src/poll-params.ts
const SHARED_POLL_CREATION_PARAM_DEFS = {
	pollQuestion: { kind: "string" },
	pollOption: { kind: "stringArray" },
	pollDurationHours: { kind: "number" },
	pollMulti: { kind: "boolean" }
};
const TELEGRAM_POLL_CREATION_PARAM_DEFS = {
	pollDurationSeconds: { kind: "number" },
	pollAnonymous: { kind: "boolean" },
	pollPublic: { kind: "boolean" }
};
const POLL_CREATION_PARAM_DEFS = {
	...SHARED_POLL_CREATION_PARAM_DEFS,
	...TELEGRAM_POLL_CREATION_PARAM_DEFS
};
const POLL_CREATION_PARAM_NAMES = Object.keys(POLL_CREATION_PARAM_DEFS);
const SHARED_POLL_CREATION_PARAM_NAMES = Object.keys(SHARED_POLL_CREATION_PARAM_DEFS);
function readPollParamRaw(params, key) {
	return readSnakeCaseParamRaw(params, key);
}
function resolveTelegramPollVisibility(params) {
	if (params.pollAnonymous && params.pollPublic) throw new Error("pollAnonymous and pollPublic are mutually exclusive");
	return params.pollAnonymous ? true : params.pollPublic ? false : void 0;
}
function hasPollCreationParams(params) {
	for (const key of POLL_CREATION_PARAM_NAMES) {
		const def = POLL_CREATION_PARAM_DEFS[key];
		const value = readPollParamRaw(params, key);
		if (def.kind === "string" && typeof value === "string" && value.trim().length > 0) return true;
		if (def.kind === "stringArray") {
			if (Array.isArray(value) && value.some((entry) => typeof entry === "string" && entry.trim())) return true;
			if (typeof value === "string" && value.trim().length > 0) return true;
		}
		if (def.kind === "number") {
			if (typeof value === "number" && Number.isFinite(value) && value !== 0) return true;
			if (typeof value === "string") {
				const trimmed = value.trim();
				const parsed = Number(trimmed);
				if (trimmed.length > 0 && Number.isFinite(parsed) && parsed !== 0) return true;
			}
		}
		if (def.kind === "boolean") {
			if (value === true) return true;
			if (typeof value === "string" && value.trim().toLowerCase() === "true") return true;
		}
	}
	return false;
}
//#endregion
export { normalizeConversationText as a, resolveTelegramPollVisibility as i, SHARED_POLL_CREATION_PARAM_NAMES as n, parseTelegramTopicConversation as o, hasPollCreationParams as r, POLL_CREATION_PARAM_DEFS as t };
