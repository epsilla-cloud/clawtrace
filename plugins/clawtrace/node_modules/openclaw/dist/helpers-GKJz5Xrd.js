import "./session-key-BhxcMJEE.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
//#region src/channels/plugins/helpers.ts
function resolveChannelDefaultAccountId(params) {
	const accountIds = params.accountIds ?? params.plugin.config.listAccountIds(params.cfg);
	return params.plugin.config.defaultAccountId?.(params.cfg) ?? accountIds[0] ?? "default";
}
function formatPairingApproveHint(channelId) {
	return `Approve via: ${formatCliCommand(`openclaw pairing list ${channelId}`)} / ${formatCliCommand(`openclaw pairing approve ${channelId} <code>`)}`;
}
function parseOptionalDelimitedEntries(value) {
	if (!value?.trim()) return;
	const parsed = value.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
	return parsed.length > 0 ? parsed : void 0;
}
function buildAccountScopedDmSecurityPolicy(params) {
	const resolvedAccountId = params.accountId ?? params.fallbackAccountId ?? "default";
	const channelConfig = params.cfg.channels?.[params.channelKey];
	const basePath = Boolean(channelConfig?.accounts?.[resolvedAccountId]) ? `channels.${params.channelKey}.accounts.${resolvedAccountId}.` : `channels.${params.channelKey}.`;
	const allowFromPath = `${basePath}${params.allowFromPathSuffix ?? ""}`;
	const policyPath = params.policyPathSuffix != null ? `${basePath}${params.policyPathSuffix}` : void 0;
	return {
		policy: params.policy ?? params.defaultPolicy ?? "pairing",
		allowFrom: params.allowFrom ?? [],
		policyPath,
		allowFromPath,
		approveHint: params.approveHint ?? formatPairingApproveHint(params.approveChannelId ?? params.channelKey),
		normalizeEntry: params.normalizeEntry
	};
}
//#endregion
export { resolveChannelDefaultAccountId as i, formatPairingApproveHint as n, parseOptionalDelimitedEntries as r, buildAccountScopedDmSecurityPolicy as t };
