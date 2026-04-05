//#region extensions/discord/src/session-key-normalization.ts
function normalizeDiscordChatType(raw) {
	const normalized = (raw ?? "").trim().toLowerCase();
	if (!normalized) return;
	if (normalized === "dm") return "direct";
	if (normalized === "group" || normalized === "channel" || normalized === "direct") return normalized;
}
function normalizeExplicitDiscordSessionKey(sessionKey, ctx) {
	let normalized = sessionKey.trim().toLowerCase();
	if (normalizeDiscordChatType(ctx.ChatType) !== "direct") return normalized;
	normalized = normalized.replace(/^(discord:)dm:/, "$1direct:");
	normalized = normalized.replace(/^(agent:[^:]+:discord:)dm:/, "$1direct:");
	const match = normalized.match(/^((?:agent:[^:]+:)?)discord:channel:([^:]+)$/);
	if (!match) return normalized;
	const from = (ctx.From ?? "").trim().toLowerCase();
	const senderId = (ctx.SenderId ?? "").trim().toLowerCase();
	const fromDiscordId = from.startsWith("discord:") && !from.includes(":channel:") && !from.includes(":group:") ? from.slice(8) : "";
	const directId = senderId || fromDiscordId;
	return directId && directId === match[2] ? `${match[1]}discord:direct:${match[2]}` : normalized;
}
//#endregion
export { normalizeExplicitDiscordSessionKey as t };
