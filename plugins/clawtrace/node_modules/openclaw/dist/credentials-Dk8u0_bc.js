import { _D as resolveMatrixCredentialsPath, hD as loadMatrixCredentials } from "./auth-profiles-B5ypC5S-.js";
import { n as writeJsonFileAtomically } from "./json-store-9F5NU8uu.js";
//#region extensions/matrix/src/matrix/credentials.ts
async function saveMatrixCredentials(credentials, env = process.env, accountId) {
	const credPath = resolveMatrixCredentialsPath(env, accountId);
	const existing = loadMatrixCredentials(env, accountId);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await writeJsonFileAtomically(credPath, {
		...credentials,
		createdAt: existing?.createdAt ?? now,
		lastUsedAt: now
	});
}
async function touchMatrixCredentials(env = process.env, accountId) {
	const existing = loadMatrixCredentials(env, accountId);
	if (!existing) return;
	existing.lastUsedAt = (/* @__PURE__ */ new Date()).toISOString();
	await writeJsonFileAtomically(resolveMatrixCredentialsPath(env, accountId), existing);
}
//#endregion
export { saveMatrixCredentials, touchMatrixCredentials };
