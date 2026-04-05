import { Type } from "@sinclair/typebox";
//#region src/infra/outbound/message-action-spec.ts
const MESSAGE_ACTION_TARGET_MODE = {
	send: "to",
	broadcast: "none",
	poll: "to",
	"poll-vote": "to",
	react: "to",
	reactions: "to",
	read: "to",
	edit: "to",
	unsend: "to",
	reply: "to",
	sendWithEffect: "to",
	renameGroup: "to",
	setGroupIcon: "to",
	addParticipant: "to",
	removeParticipant: "to",
	leaveGroup: "to",
	sendAttachment: "to",
	delete: "to",
	pin: "to",
	unpin: "to",
	"list-pins": "to",
	permissions: "to",
	"thread-create": "to",
	"thread-list": "none",
	"thread-reply": "to",
	search: "none",
	sticker: "to",
	"sticker-search": "none",
	"member-info": "none",
	"role-info": "none",
	"emoji-list": "none",
	"emoji-upload": "none",
	"sticker-upload": "none",
	"role-add": "none",
	"role-remove": "none",
	"channel-info": "channelId",
	"channel-list": "none",
	"channel-create": "none",
	"channel-edit": "channelId",
	"channel-delete": "channelId",
	"channel-move": "channelId",
	"category-create": "none",
	"category-edit": "none",
	"category-delete": "none",
	"topic-create": "to",
	"topic-edit": "to",
	"voice-status": "none",
	"event-list": "none",
	"event-create": "none",
	timeout: "none",
	kick: "none",
	ban: "none",
	"set-profile": "none",
	"set-presence": "none",
	"download-file": "none",
	"upload-file": "to"
};
const ACTION_TARGET_ALIASES = {
	read: {
		aliases: ["messageId"],
		channels: ["feishu"]
	},
	unsend: { aliases: ["messageId"] },
	edit: { aliases: ["messageId"] },
	pin: {
		aliases: ["messageId"],
		channels: ["feishu"]
	},
	unpin: {
		aliases: ["messageId"],
		channels: ["feishu"]
	},
	"list-pins": {
		aliases: ["chatId"],
		channels: ["feishu"]
	},
	"channel-info": {
		aliases: ["chatId"],
		channels: ["feishu"]
	},
	react: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	renameGroup: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	setGroupIcon: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	addParticipant: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	removeParticipant: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	leaveGroup: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] }
};
function actionRequiresTarget(action) {
	return MESSAGE_ACTION_TARGET_MODE[action] !== "none";
}
function actionHasTarget(action, params, options) {
	if (typeof params.to === "string" ? params.to.trim() : "") return true;
	if (typeof params.channelId === "string" ? params.channelId.trim() : "") return true;
	const spec = ACTION_TARGET_ALIASES[action];
	if (!spec) return false;
	if (spec.channels && (!options?.channel || !spec.channels.includes(options.channel.trim().toLowerCase()))) return false;
	return spec.aliases.some((alias) => {
		const value = params[alias];
		if (typeof value === "string") return value.trim().length > 0;
		if (typeof value === "number") return Number.isFinite(value);
		return false;
	});
}
//#endregion
//#region src/infra/outbound/channel-target.ts
const CHANNEL_TARGET_DESCRIPTION = "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack channel/user, or iMessage handle/chat_id";
const CHANNEL_TARGETS_DESCRIPTION = "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.";
function hasNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function applyTargetToParams(params) {
	const target = typeof params.args.target === "string" ? params.args.target.trim() : "";
	const hasLegacyTo = hasNonEmptyString(params.args.to);
	const hasLegacyChannelId = hasNonEmptyString(params.args.channelId);
	const mode = MESSAGE_ACTION_TARGET_MODE[params.action] ?? "none";
	if (mode !== "none") {
		if (hasLegacyTo || hasLegacyChannelId) throw new Error("Use `target` instead of `to`/`channelId`.");
	} else if (hasLegacyTo) throw new Error("Use `target` for actions that accept a destination.");
	if (!target) return;
	if (mode === "channelId") {
		params.args.channelId = target;
		return;
	}
	if (mode === "to") {
		params.args.to = target;
		return;
	}
	throw new Error(`Action ${params.action} does not accept a target.`);
}
//#endregion
//#region src/agents/schema/typebox.ts
function stringEnum(values, options = {}) {
	const enumValues = Array.isArray(values) ? values : values && typeof values === "object" ? Object.values(values).filter((value) => typeof value === "string") : [];
	return Type.Unsafe({
		type: "string",
		...enumValues.length > 0 ? { enum: [...enumValues] } : {},
		...options
	});
}
function optionalStringEnum(values, options = {}) {
	return Type.Optional(stringEnum(values, options));
}
function channelTargetSchema(options) {
	return Type.String({ description: options?.description ?? "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack channel/user, or iMessage handle/chat_id" });
}
function channelTargetsSchema(options) {
	return Type.Array(channelTargetSchema({ description: options?.description ?? "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available." }));
}
//#endregion
export { CHANNEL_TARGETS_DESCRIPTION as a, actionHasTarget as c, stringEnum as i, actionRequiresTarget as l, channelTargetsSchema as n, CHANNEL_TARGET_DESCRIPTION as o, optionalStringEnum as r, applyTargetToParams as s, channelTargetSchema as t };
