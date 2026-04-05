import { h as resolveOAuthDir } from "./paths-Y4UT24Of.js";
import { g as DEFAULT_ACCOUNT_ID } from "./session-key-BhxcMJEE.js";
import fsSync from "node:fs";
import path from "node:path";
//#region src/channels/config-presence.ts
const IGNORED_CHANNEL_CONFIG_KEYS = new Set(["defaults", "modelByChannel"]);
const CHANNEL_ENV_PREFIXES = [
	["BLUEBUBBLES_", "bluebubbles"],
	["DISCORD_", "discord"],
	["GOOGLECHAT_", "googlechat"],
	["IRC_", "irc"],
	["LINE_", "line"],
	["MATRIX_", "matrix"],
	["MSTEAMS_", "msteams"],
	["SIGNAL_", "signal"],
	["SLACK_", "slack"],
	["TELEGRAM_", "telegram"],
	["WHATSAPP_", "whatsapp"],
	["ZALOUSER_", "zalouser"],
	["ZALO_", "zalo"]
];
function hasNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function hasMeaningfulChannelConfig(value) {
	if (!isRecord(value)) return false;
	return Object.keys(value).some((key) => key !== "enabled");
}
function hasWhatsAppAuthState(env) {
	try {
		const oauthDir = resolveOAuthDir(env);
		const legacyCreds = path.join(oauthDir, "creds.json");
		if (fsSync.existsSync(legacyCreds)) return true;
		const accountsRoot = path.join(oauthDir, "whatsapp");
		const defaultCreds = path.join(accountsRoot, DEFAULT_ACCOUNT_ID, "creds.json");
		if (fsSync.existsSync(defaultCreds)) return true;
		return fsSync.readdirSync(accountsRoot, { withFileTypes: true }).some((entry) => {
			if (!entry.isDirectory()) return false;
			return fsSync.existsSync(path.join(accountsRoot, entry.name, "creds.json"));
		});
	} catch {
		return false;
	}
}
function listPotentialConfiguredChannelIds(cfg, env = process.env) {
	const configuredChannelIds = /* @__PURE__ */ new Set();
	const channels = isRecord(cfg.channels) ? cfg.channels : null;
	if (channels) for (const [key, value] of Object.entries(channels)) {
		if (IGNORED_CHANNEL_CONFIG_KEYS.has(key)) continue;
		if (hasMeaningfulChannelConfig(value)) configuredChannelIds.add(key);
	}
	for (const [key, value] of Object.entries(env)) {
		if (!hasNonEmptyString(value)) continue;
		for (const [prefix, channelId] of CHANNEL_ENV_PREFIXES) if (key.startsWith(prefix)) configuredChannelIds.add(channelId);
		if (key === "TELEGRAM_BOT_TOKEN") configuredChannelIds.add("telegram");
	}
	if (hasWhatsAppAuthState(env)) configuredChannelIds.add("whatsapp");
	return [...configuredChannelIds];
}
function hasEnvConfiguredChannel(env) {
	for (const [key, value] of Object.entries(env)) {
		if (!hasNonEmptyString(value)) continue;
		if (CHANNEL_ENV_PREFIXES.some(([prefix]) => key.startsWith(prefix)) || key === "TELEGRAM_BOT_TOKEN") return true;
	}
	return hasWhatsAppAuthState(env);
}
function hasPotentialConfiguredChannels(cfg, env = process.env) {
	const channels = isRecord(cfg.channels) ? cfg.channels : null;
	if (channels) for (const [key, value] of Object.entries(channels)) {
		if (IGNORED_CHANNEL_CONFIG_KEYS.has(key)) continue;
		if (hasMeaningfulChannelConfig(value)) return true;
	}
	return hasEnvConfiguredChannel(env);
}
//#endregion
export { hasPotentialConfiguredChannels as n, listPotentialConfiguredChannelIds as r, hasMeaningfulChannelConfig as t };
