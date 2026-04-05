import "./utils-BfvDpbwh.js";
//#region src/plugin-sdk/account-core.ts
/** Resolve an account by id, then fall back to the default account when the primary lacks credentials. */
function resolveAccountWithDefaultFallback(params) {
	const hasExplicitAccountId = Boolean(params.accountId?.trim());
	const normalizedAccountId = params.normalizeAccountId(params.accountId);
	const primary = params.resolvePrimary(normalizedAccountId);
	if (hasExplicitAccountId || params.hasCredential(primary)) return primary;
	const fallbackId = params.resolveDefaultAccountId();
	if (fallbackId === normalizedAccountId) return primary;
	const fallback = params.resolvePrimary(fallbackId);
	if (!params.hasCredential(fallback)) return primary;
	return fallback;
}
/** List normalized configured account ids from a raw channel account record map. */
function listConfiguredAccountIds(params) {
	if (!params.accounts) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const key of Object.keys(params.accounts)) {
		if (!key) continue;
		ids.add(params.normalizeAccountId(key));
	}
	return [...ids];
}
//#endregion
export { resolveAccountWithDefaultFallback as n, listConfiguredAccountIds as t };
