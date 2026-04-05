import "./auth-profiles-B5ypC5S-.js";
import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { s as resolveMergedAccountConfig, t as createAccountListHelpers } from "./account-helpers-DklgKoS9.js";
import { n as getZaloUserInfo } from "./zalo-js-B3-1bwTS.js";
//#region extensions/zalouser/src/accounts.ts
const { listAccountIds: listZalouserAccountIds, resolveDefaultAccountId: resolveDefaultZalouserAccountId } = createAccountListHelpers("zalouser");
function mergeZalouserAccountConfig(cfg, accountId) {
	const merged = resolveMergedAccountConfig({
		channelConfig: cfg.channels?.zalouser,
		accounts: (cfg.channels?.zalouser)?.accounts,
		accountId,
		omitKeys: ["defaultAccount"]
	});
	return {
		...merged,
		groupPolicy: merged.groupPolicy ?? "allowlist"
	};
}
function resolveProfile(config, accountId) {
	if (config.profile?.trim()) return config.profile.trim();
	if (process.env.ZALOUSER_PROFILE?.trim()) return process.env.ZALOUSER_PROFILE.trim();
	if (process.env.ZCA_PROFILE?.trim()) return process.env.ZCA_PROFILE.trim();
	if (accountId !== "default") return accountId;
	return "default";
}
function resolveZalouserAccountBase(params) {
	const accountId = normalizeAccountId(params.accountId);
	const baseEnabled = (params.cfg.channels?.zalouser)?.enabled !== false;
	const merged = mergeZalouserAccountConfig(params.cfg, accountId);
	return {
		accountId,
		enabled: baseEnabled && merged.enabled !== false,
		merged,
		profile: resolveProfile(merged, accountId)
	};
}
function resolveZalouserAccountSync(params) {
	const { accountId, enabled, merged, profile } = resolveZalouserAccountBase(params);
	return {
		accountId,
		name: merged.name?.trim() || void 0,
		enabled,
		profile,
		authenticated: false,
		config: merged
	};
}
async function getZcaUserInfo(profile) {
	const info = await getZaloUserInfo(profile);
	if (!info) return null;
	return {
		userId: info.userId,
		displayName: info.displayName
	};
}
//#endregion
export { resolveZalouserAccountSync as i, listZalouserAccountIds as n, resolveDefaultZalouserAccountId as r, getZcaUserInfo as t };
