import { _ as resolveStateDir } from "./paths-Y4UT24Of.js";
import path from "node:path";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
//#region src/shared/operator-scope-compat.ts
const OPERATOR_ROLE = "operator";
const OPERATOR_ADMIN_SCOPE = "operator.admin";
const OPERATOR_READ_SCOPE = "operator.read";
const OPERATOR_WRITE_SCOPE = "operator.write";
const OPERATOR_SCOPE_PREFIX = "operator.";
function normalizeScopeList(scopes) {
	const out = /* @__PURE__ */ new Set();
	for (const scope of scopes) {
		const trimmed = scope.trim();
		if (trimmed) out.add(trimmed);
	}
	return [...out];
}
function operatorScopeSatisfied(requestedScope, granted) {
	if (granted.has(OPERATOR_ADMIN_SCOPE) && requestedScope.startsWith(OPERATOR_SCOPE_PREFIX)) return true;
	if (requestedScope === OPERATOR_READ_SCOPE) return granted.has(OPERATOR_READ_SCOPE) || granted.has(OPERATOR_WRITE_SCOPE);
	if (requestedScope === OPERATOR_WRITE_SCOPE) return granted.has(OPERATOR_WRITE_SCOPE);
	return granted.has(requestedScope);
}
function roleScopesAllow(params) {
	const requested = normalizeScopeList(params.requestedScopes);
	if (requested.length === 0) return true;
	const allowed = normalizeScopeList(params.allowedScopes);
	if (allowed.length === 0) return false;
	const allowedSet = new Set(allowed);
	if (params.role.trim() !== OPERATOR_ROLE) return requested.every((scope) => allowedSet.has(scope));
	return requested.every((scope) => operatorScopeSatisfied(scope, allowedSet));
}
function resolveMissingRequestedScope(params) {
	for (const scope of params.requestedScopes) if (!roleScopesAllow({
		role: params.role,
		requestedScopes: [scope],
		allowedScopes: params.allowedScopes
	})) return scope;
	return null;
}
//#endregion
//#region src/infra/pairing-files.ts
function resolvePairingPaths(baseDir, subdir) {
	const root = baseDir ?? resolveStateDir();
	const dir = path.join(root, subdir);
	return {
		dir,
		pendingPath: path.join(dir, "pending.json"),
		pairedPath: path.join(dir, "paired.json")
	};
}
function pruneExpiredPending(pendingById, nowMs, ttlMs) {
	for (const [id, req] of Object.entries(pendingById)) if (nowMs - req.ts > ttlMs) delete pendingById[id];
}
async function upsertPendingPairingRequest(params) {
	const existing = Object.values(params.pendingById).find(params.isExisting);
	if (existing) return {
		status: "pending",
		request: existing,
		created: false
	};
	const request = params.createRequest(params.isRepair);
	params.pendingById[request.requestId] = request;
	await params.persist();
	return {
		status: "pending",
		request,
		created: true
	};
}
//#endregion
//#region src/infra/pairing-pending.ts
async function rejectPendingPairingRequest(params) {
	const state = await params.loadState();
	const pending = state.pendingById[params.requestId];
	if (!pending) return null;
	delete state.pendingById[params.requestId];
	await params.persistState(state);
	return {
		requestId: params.requestId,
		[params.idKey]: params.getId(pending)
	};
}
//#endregion
//#region src/security/secret-equal.ts
function safeEqualSecret(provided, expected) {
	if (typeof provided !== "string" || typeof expected !== "string") return false;
	const hash = (s) => createHash("sha256").update(s).digest();
	return timingSafeEqual(hash(provided), hash(expected));
}
function generatePairingToken() {
	return randomBytes(32).toString("base64url");
}
function verifyPairingToken(provided, expected) {
	if (provided.trim().length === 0 || expected.trim().length === 0) return false;
	return safeEqualSecret(provided, expected);
}
//#endregion
export { pruneExpiredPending as a, resolveMissingRequestedScope as c, rejectPendingPairingRequest as i, roleScopesAllow as l, verifyPairingToken as n, resolvePairingPaths as o, safeEqualSecret as r, upsertPendingPairingRequest as s, generatePairingToken as t };
