import { v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { h as resolveOAuthDir } from "./paths-Y4UT24Of.js";
import { _ as normalizeAccountId, g as DEFAULT_ACCOUNT_ID } from "./session-key-BhxcMJEE.js";
import { t as resolveAccountEntry } from "./account-lookup-DdMcO0BU.js";
import { s as resolveMergedAccountConfig, t as createAccountListHelpers } from "./account-helpers-DklgKoS9.js";
import "./account-core-C7GDNJGj.js";
import "./state-paths-Ci8MrEkT.js";
import fsSync from "node:fs";
import path from "node:path";
//#region extensions/whatsapp/src/creds-files.ts
function resolveWebCredsPath(authDir) {
	return path.join(authDir, "creds.json");
}
function resolveWebCredsBackupPath(authDir) {
	return path.join(authDir, "creds.json.bak");
}
function hasWebCredsSync(authDir) {
	try {
		const stats = fsSync.statSync(resolveWebCredsPath(authDir));
		return stats.isFile() && stats.size > 1;
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/whatsapp/src/accounts.ts
const DEFAULT_WHATSAPP_MEDIA_MAX_MB = 50;
const { listConfiguredAccountIds, listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("whatsapp");
const listWhatsAppAccountIds = listAccountIds;
const resolveDefaultWhatsAppAccountId = resolveDefaultAccountId;
function listWhatsAppAuthDirs(cfg) {
	const oauthDir = resolveOAuthDir();
	const whatsappDir = path.join(oauthDir, "whatsapp");
	const authDirs = new Set([oauthDir, path.join(whatsappDir, DEFAULT_ACCOUNT_ID)]);
	const accountIds = listConfiguredAccountIds(cfg);
	for (const accountId of accountIds) authDirs.add(resolveWhatsAppAuthDir({
		cfg,
		accountId
	}).authDir);
	try {
		const entries = fsSync.readdirSync(whatsappDir, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			authDirs.add(path.join(whatsappDir, entry.name));
		}
	} catch {}
	return Array.from(authDirs);
}
function hasAnyWhatsAppAuth(cfg) {
	return listWhatsAppAuthDirs(cfg).some((authDir) => hasWebCredsSync(authDir));
}
function resolveAccountConfig(cfg, accountId) {
	return resolveAccountEntry(cfg.channels?.whatsapp?.accounts, accountId);
}
function resolveDefaultAuthDir(accountId) {
	return path.join(resolveOAuthDir(), "whatsapp", normalizeAccountId(accountId));
}
function resolveLegacyAuthDir() {
	return resolveOAuthDir();
}
function legacyAuthExists(authDir) {
	try {
		return fsSync.existsSync(path.join(authDir, "creds.json"));
	} catch {
		return false;
	}
}
function resolveWhatsAppAuthDir(params) {
	const accountId = params.accountId.trim() || "default";
	const configured = resolveAccountConfig(params.cfg, accountId)?.authDir?.trim();
	if (configured) return {
		authDir: resolveUserPath(configured),
		isLegacy: false
	};
	const defaultDir = resolveDefaultAuthDir(accountId);
	if (accountId === "default") {
		const legacyDir = resolveLegacyAuthDir();
		if (legacyAuthExists(legacyDir) && !legacyAuthExists(defaultDir)) return {
			authDir: legacyDir,
			isLegacy: true
		};
	}
	return {
		authDir: defaultDir,
		isLegacy: false
	};
}
function resolveWhatsAppAccount(params) {
	const rootCfg = params.cfg.channels?.whatsapp;
	const accountId = params.accountId?.trim() || resolveDefaultWhatsAppAccountId(params.cfg);
	const merged = resolveMergedAccountConfig({
		channelConfig: rootCfg,
		accounts: rootCfg?.accounts,
		accountId,
		omitKeys: ["defaultAccount"]
	});
	const enabled = merged.enabled !== false;
	const { authDir, isLegacy } = resolveWhatsAppAuthDir({
		cfg: params.cfg,
		accountId
	});
	return {
		accountId,
		name: merged.name?.trim() || void 0,
		enabled,
		sendReadReceipts: merged.sendReadReceipts ?? true,
		messagePrefix: merged.messagePrefix ?? params.cfg.messages?.messagePrefix,
		defaultTo: merged.defaultTo,
		authDir,
		isLegacyAuthDir: isLegacy,
		selfChatMode: merged.selfChatMode,
		dmPolicy: merged.dmPolicy,
		allowFrom: merged.allowFrom,
		groupAllowFrom: merged.groupAllowFrom,
		groupPolicy: merged.groupPolicy,
		textChunkLimit: merged.textChunkLimit,
		chunkMode: merged.chunkMode,
		mediaMaxMb: merged.mediaMaxMb,
		blockStreaming: merged.blockStreaming,
		ackReaction: merged.ackReaction,
		groups: merged.groups,
		debounceMs: merged.debounceMs
	};
}
function resolveWhatsAppMediaMaxBytes(account) {
	return (typeof account.mediaMaxMb === "number" && account.mediaMaxMb > 0 ? account.mediaMaxMb : 50) * 1024 * 1024;
}
function listEnabledWhatsAppAccounts(cfg) {
	return listWhatsAppAccountIds(cfg).map((accountId) => resolveWhatsAppAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
export { listWhatsAppAuthDirs as a, resolveWhatsAppAuthDir as c, resolveWebCredsBackupPath as d, resolveWebCredsPath as f, listWhatsAppAccountIds as i, resolveWhatsAppMediaMaxBytes as l, hasAnyWhatsAppAuth as n, resolveDefaultWhatsAppAccountId as o, listEnabledWhatsAppAccounts as r, resolveWhatsAppAccount as s, DEFAULT_WHATSAPP_MEDIA_MAX_MB as t, hasWebCredsSync as u };
