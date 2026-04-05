//#region extensions/openai/openai-codex-auth-identity.ts
function normalizeNonEmptyString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function decodeCodexJwtPayload(accessToken) {
	const parts = accessToken.split(".");
	if (parts.length !== 3) return null;
	try {
		const decoded = Buffer.from(parts[1], "base64url").toString("utf8");
		const parsed = JSON.parse(decoded);
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function resolveCodexStableSubject(payload) {
	const auth = payload?.["https://api.openai.com/auth"];
	const accountUserId = normalizeNonEmptyString(auth?.chatgpt_account_user_id);
	if (accountUserId) return accountUserId;
	const userId = normalizeNonEmptyString(auth?.chatgpt_user_id) ?? normalizeNonEmptyString(auth?.user_id);
	if (userId) return userId;
	const iss = normalizeNonEmptyString(payload?.iss);
	const sub = normalizeNonEmptyString(payload?.sub);
	if (iss && sub) return `${iss}|${sub}`;
	return sub;
}
function resolveCodexAuthIdentity(params) {
	const payload = decodeCodexJwtPayload(params.accessToken);
	const email = normalizeNonEmptyString(payload?.["https://api.openai.com/profile"]?.email) ?? normalizeNonEmptyString(params.email);
	if (email) return {
		email,
		profileName: email
	};
	const stableSubject = resolveCodexStableSubject(payload);
	if (!stableSubject) return {};
	return { profileName: `id-${Buffer.from(stableSubject).toString("base64url")}` };
}
//#endregion
export { resolveCodexAuthIdentity as n, resolveCodexStableSubject as r, decodeCodexJwtPayload as t };
