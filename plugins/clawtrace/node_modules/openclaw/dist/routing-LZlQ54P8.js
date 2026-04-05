import "./base-session-key-UJINc15Z.js";
import "./message-channel-BaBrchOc.js";
//#region src/routing/default-account-warnings.ts
function formatChannelDefaultAccountPath(channelKey) {
	return `channels.${channelKey}.defaultAccount`;
}
function formatChannelAccountsDefaultPath(channelKey) {
	return `channels.${channelKey}.accounts.default`;
}
function formatSetExplicitDefaultInstruction(channelKey) {
	return `Set ${formatChannelDefaultAccountPath(channelKey)} or add ${formatChannelAccountsDefaultPath(channelKey)}`;
}
function formatSetExplicitDefaultToConfiguredInstruction(params) {
	return `Set ${formatChannelDefaultAccountPath(params.channelKey)} to one of these accounts, or add ${formatChannelAccountsDefaultPath(params.channelKey)}`;
}
//#endregion
//#region src/infra/outbound/thread-id.ts
function normalizeOutboundThreadId(value) {
	if (value == null) return;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return;
		return String(Math.trunc(value));
	}
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
//#endregion
export { formatSetExplicitDefaultToConfiguredInstruction as i, formatChannelAccountsDefaultPath as n, formatSetExplicitDefaultInstruction as r, normalizeOutboundThreadId as t };
