import { _ as normalizeAccountId, g as DEFAULT_ACCOUNT_ID, v as normalizeOptionalAccountId } from "./session-key-BhxcMJEE.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-DdMcO0BU.js";
import { i as listCombinedAccountIds, o as resolveListedDefaultAccountId } from "./account-helpers-DklgKoS9.js";
import { t as listConfiguredAccountIds } from "./account-core-C7GDNJGj.js";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/matrix/src/env-vars.ts
const MATRIX_SCOPED_ENV_SUFFIXES = [
	"HOMESERVER",
	"USER_ID",
	"ACCESS_TOKEN",
	"PASSWORD",
	"DEVICE_ID",
	"DEVICE_NAME"
];
const MATRIX_GLOBAL_ENV_KEYS = MATRIX_SCOPED_ENV_SUFFIXES.map((suffix) => `MATRIX_${suffix}`);
const MATRIX_SCOPED_ENV_RE = new RegExp(`^MATRIX_(.+)_(${MATRIX_SCOPED_ENV_SUFFIXES.join("|")})$`);
function resolveMatrixEnvAccountToken(accountId) {
	return Array.from(normalizeAccountId(accountId)).map((char) => /[a-z0-9]/.test(char) ? char.toUpperCase() : `_X${char.codePointAt(0)?.toString(16).toUpperCase() ?? "00"}_`).join("");
}
function getMatrixScopedEnvVarNames(accountId) {
	const token = resolveMatrixEnvAccountToken(accountId);
	return {
		homeserver: `MATRIX_${token}_HOMESERVER`,
		userId: `MATRIX_${token}_USER_ID`,
		accessToken: `MATRIX_${token}_ACCESS_TOKEN`,
		password: `MATRIX_${token}_PASSWORD`,
		deviceId: `MATRIX_${token}_DEVICE_ID`,
		deviceName: `MATRIX_${token}_DEVICE_NAME`
	};
}
function decodeMatrixEnvAccountToken(token) {
	let decoded = "";
	for (let index = 0; index < token.length;) {
		const hexEscape = /^_X([0-9A-F]+)_/.exec(token.slice(index));
		if (hexEscape) {
			const hex = hexEscape[1];
			const codePoint = hex ? Number.parseInt(hex, 16) : NaN;
			if (!Number.isFinite(codePoint)) return;
			decoded += String.fromCodePoint(codePoint);
			index += hexEscape[0].length;
			continue;
		}
		const char = token[index];
		if (!char || !/[A-Z0-9]/.test(char)) return;
		decoded += char.toLowerCase();
		index += 1;
	}
	const normalized = normalizeOptionalAccountId(decoded);
	if (!normalized) return;
	return resolveMatrixEnvAccountToken(normalized) === token ? normalized : void 0;
}
function listMatrixEnvAccountIds(env = process.env) {
	const ids = /* @__PURE__ */ new Set();
	for (const key of MATRIX_GLOBAL_ENV_KEYS) if (typeof env[key] === "string" && env[key]?.trim()) {
		ids.add(normalizeAccountId("default"));
		break;
	}
	for (const key of Object.keys(env)) {
		const match = MATRIX_SCOPED_ENV_RE.exec(key);
		if (!match) continue;
		const accountId = decodeMatrixEnvAccountToken(match[1]);
		if (accountId) ids.add(accountId);
	}
	return Array.from(ids).toSorted((a, b) => a.localeCompare(b));
}
//#endregion
//#region extensions/matrix/src/account-selection.ts
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function resolveMatrixChannelConfig(cfg) {
	return isRecord(cfg.channels?.matrix) ? cfg.channels.matrix : null;
}
function findMatrixAccountEntry(cfg, accountId) {
	const channel = resolveMatrixChannelConfig(cfg);
	if (!channel) return null;
	const accounts = isRecord(channel.accounts) ? channel.accounts : null;
	if (!accounts) return null;
	const entry = resolveNormalizedAccountEntry(accounts, accountId, normalizeAccountId);
	return isRecord(entry) ? entry : null;
}
function resolveConfiguredMatrixAccountIds(cfg, env = process.env) {
	const channel = resolveMatrixChannelConfig(cfg);
	return listCombinedAccountIds({
		configuredAccountIds: listConfiguredAccountIds({
			accounts: channel && isRecord(channel.accounts) ? channel.accounts : void 0,
			normalizeAccountId
		}),
		additionalAccountIds: listMatrixEnvAccountIds(env),
		fallbackAccountIdWhenEmpty: channel ? DEFAULT_ACCOUNT_ID : void 0
	});
}
function resolveMatrixDefaultOrOnlyAccountId(cfg, env = process.env) {
	const channel = resolveMatrixChannelConfig(cfg);
	if (!channel) return DEFAULT_ACCOUNT_ID;
	const configuredDefault = normalizeOptionalAccountId(typeof channel.defaultAccount === "string" ? channel.defaultAccount : void 0);
	return resolveListedDefaultAccountId({
		accountIds: resolveConfiguredMatrixAccountIds(cfg, env),
		configuredDefaultAccountId: configuredDefault,
		ambiguousFallbackAccountId: DEFAULT_ACCOUNT_ID
	});
}
function requiresExplicitMatrixDefaultAccount(cfg, env = process.env) {
	const channel = resolveMatrixChannelConfig(cfg);
	if (!channel) return false;
	const configuredAccountIds = resolveConfiguredMatrixAccountIds(cfg, env);
	if (configuredAccountIds.length <= 1) return false;
	const configuredDefault = normalizeOptionalAccountId(typeof channel.defaultAccount === "string" ? channel.defaultAccount : void 0);
	return !(configuredDefault && configuredAccountIds.includes(configuredDefault));
}
//#endregion
//#region extensions/matrix/src/storage-paths.ts
function sanitizeMatrixPathSegment(value) {
	return value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
}
function resolveMatrixHomeserverKey(homeserver) {
	try {
		const url = new URL(homeserver);
		if (url.host) return sanitizeMatrixPathSegment(url.host);
	} catch {}
	return sanitizeMatrixPathSegment(homeserver);
}
function hashMatrixAccessToken(accessToken) {
	return crypto.createHash("sha256").update(accessToken).digest("hex").slice(0, 16);
}
function resolveMatrixCredentialsFilename(accountId) {
	const normalized = normalizeAccountId(accountId);
	return normalized === "default" ? "credentials.json" : `credentials-${normalized}.json`;
}
function resolveMatrixCredentialsDir(stateDir) {
	return path.join(stateDir, "credentials", "matrix");
}
function resolveMatrixCredentialsPath(params) {
	return path.join(resolveMatrixCredentialsDir(params.stateDir), resolveMatrixCredentialsFilename(params.accountId));
}
function resolveMatrixLegacyFlatStoreRoot(stateDir) {
	return path.join(stateDir, "matrix");
}
function resolveMatrixLegacyFlatStoragePaths(stateDir) {
	const rootDir = resolveMatrixLegacyFlatStoreRoot(stateDir);
	return {
		rootDir,
		storagePath: path.join(rootDir, "bot-storage.json"),
		cryptoPath: path.join(rootDir, "crypto")
	};
}
function resolveMatrixAccountStorageRoot(params) {
	const accountKey = sanitizeMatrixPathSegment(params.accountId ?? "default");
	const userKey = sanitizeMatrixPathSegment(params.userId);
	const serverKey = resolveMatrixHomeserverKey(params.homeserver);
	const tokenHash = hashMatrixAccessToken(params.accessToken);
	return {
		rootDir: path.join(params.stateDir, "matrix", "accounts", accountKey, `${serverKey}__${userKey}`, tokenHash),
		accountKey,
		tokenHash
	};
}
//#endregion
export { resolveMatrixEnvAccountToken as _, resolveMatrixCredentialsPath as a, resolveMatrixLegacyFlatStoreRoot as c, requiresExplicitMatrixDefaultAccount as d, resolveConfiguredMatrixAccountIds as f, listMatrixEnvAccountIds as g, getMatrixScopedEnvVarNames as h, resolveMatrixCredentialsFilename as i, sanitizeMatrixPathSegment as l, resolveMatrixDefaultOrOnlyAccountId as m, resolveMatrixAccountStorageRoot as n, resolveMatrixHomeserverKey as o, resolveMatrixChannelConfig as p, resolveMatrixCredentialsDir as r, resolveMatrixLegacyFlatStoragePaths as s, hashMatrixAccessToken as t, findMatrixAccountEntry as u };
