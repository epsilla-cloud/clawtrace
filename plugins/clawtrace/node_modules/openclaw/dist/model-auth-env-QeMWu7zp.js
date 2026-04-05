import { t as isTruthyEnvValue } from "./env-CjUKd1aw.js";
import { i as normalizeProviderIdForAuth } from "./provider-id-Bd9aU9Z8.js";
import { a as sanitizeHostExecEnv } from "./host-env-security-C13NAkuJ.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Caby3smH.js";
import { r as listKnownProviderAuthEnvVarNames, t as PROVIDER_AUTH_ENV_VAR_CANDIDATES } from "./provider-env-vars-DRNd-hHT.js";
import { a as hasAnthropicVertexAvailableAuth } from "./anthropic-vertex-CRO19LKV.js";
import fsSync from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";
import { getEnvApiKey } from "@mariozechner/pi-ai";
//#region src/infra/shell-env.ts
const DEFAULT_TIMEOUT_MS = 15e3;
const DEFAULT_MAX_BUFFER_BYTES = 2 * 1024 * 1024;
const DEFAULT_SHELL = "/bin/sh";
let lastAppliedKeys = [];
let cachedShellPath;
let cachedEtcShells;
function resolveShellExecEnv(env) {
	const execEnv = sanitizeHostExecEnv({ baseEnv: env });
	const home = os.homedir().trim();
	if (home) execEnv.HOME = home;
	else delete execEnv.HOME;
	delete execEnv.ZDOTDIR;
	return execEnv;
}
function resolveTimeoutMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) return DEFAULT_TIMEOUT_MS;
	return Math.max(0, timeoutMs);
}
function readEtcShells() {
	if (cachedEtcShells !== void 0) return cachedEtcShells;
	try {
		const entries = fsSync.readFileSync("/etc/shells", "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#") && path.isAbsolute(line));
		cachedEtcShells = new Set(entries);
	} catch {
		cachedEtcShells = null;
	}
	return cachedEtcShells;
}
function isTrustedShellPath(shell) {
	if (!path.isAbsolute(shell)) return false;
	if (path.normalize(shell) !== shell) return false;
	return readEtcShells()?.has(shell) === true;
}
function resolveShell(env) {
	const shell = env.SHELL?.trim();
	if (shell && isTrustedShellPath(shell)) return shell;
	return DEFAULT_SHELL;
}
function execLoginShellEnvZero(params) {
	return params.exec(params.shell, [
		"-l",
		"-c",
		"env -0"
	], {
		encoding: "buffer",
		timeout: params.timeoutMs,
		maxBuffer: DEFAULT_MAX_BUFFER_BYTES,
		env: params.env,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		]
	});
}
function parseShellEnv(stdout) {
	const shellEnv = /* @__PURE__ */ new Map();
	const parts = stdout.toString("utf8").split("\0");
	for (const part of parts) {
		if (!part) continue;
		const eq = part.indexOf("=");
		if (eq <= 0) continue;
		const key = part.slice(0, eq);
		const value = part.slice(eq + 1);
		if (!key) continue;
		shellEnv.set(key, value);
	}
	return shellEnv;
}
function probeLoginShellEnv(params) {
	const exec = params.exec ?? execFileSync;
	const timeoutMs = resolveTimeoutMs(params.timeoutMs);
	const shell = resolveShell(params.env);
	const execEnv = resolveShellExecEnv(params.env);
	try {
		return {
			ok: true,
			shellEnv: parseShellEnv(execLoginShellEnvZero({
				shell,
				env: execEnv,
				exec,
				timeoutMs
			}))
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : String(err)
		};
	}
}
function loadShellEnvFallback(opts) {
	const logger = opts.logger ?? console;
	if (!opts.enabled) {
		lastAppliedKeys = [];
		return {
			ok: true,
			applied: [],
			skippedReason: "disabled"
		};
	}
	if (opts.expectedKeys.some((key) => Boolean(opts.env[key]?.trim()))) {
		lastAppliedKeys = [];
		return {
			ok: true,
			applied: [],
			skippedReason: "already-has-keys"
		};
	}
	const probe = probeLoginShellEnv({
		env: opts.env,
		timeoutMs: opts.timeoutMs,
		exec: opts.exec
	});
	if (!probe.ok) {
		logger.warn(`[openclaw] shell env fallback failed: ${probe.error}`);
		lastAppliedKeys = [];
		return {
			ok: false,
			error: probe.error,
			applied: []
		};
	}
	const applied = [];
	for (const key of opts.expectedKeys) {
		if (opts.env[key]?.trim()) continue;
		const value = probe.shellEnv.get(key);
		if (!value?.trim()) continue;
		opts.env[key] = value;
		applied.push(key);
	}
	lastAppliedKeys = applied;
	return {
		ok: true,
		applied
	};
}
function shouldEnableShellEnvFallback(env) {
	return isTruthyEnvValue(env.OPENCLAW_LOAD_SHELL_ENV);
}
function shouldDeferShellEnvFallback(env) {
	return isTruthyEnvValue(env.OPENCLAW_DEFER_SHELL_ENV_FALLBACK);
}
function resolveShellEnvFallbackTimeoutMs(env) {
	const raw = env.OPENCLAW_SHELL_ENV_TIMEOUT_MS?.trim();
	if (!raw) return DEFAULT_TIMEOUT_MS;
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed)) return DEFAULT_TIMEOUT_MS;
	return Math.max(0, parsed);
}
function getShellPathFromLoginShell(opts) {
	if (cachedShellPath !== void 0) return cachedShellPath;
	if ((opts.platform ?? process.platform) === "win32") {
		cachedShellPath = null;
		return cachedShellPath;
	}
	const probe = probeLoginShellEnv({
		env: opts.env,
		timeoutMs: opts.timeoutMs,
		exec: opts.exec
	});
	if (!probe.ok) {
		cachedShellPath = null;
		return cachedShellPath;
	}
	const shellPath = probe.shellEnv.get("PATH")?.trim();
	cachedShellPath = shellPath && shellPath.length > 0 ? shellPath : null;
	return cachedShellPath;
}
function getShellEnvAppliedKeys() {
	return [...lastAppliedKeys];
}
//#endregion
//#region src/agents/model-auth-env-vars.ts
const PROVIDER_ENV_API_KEY_CANDIDATES = PROVIDER_AUTH_ENV_VAR_CANDIDATES;
function listKnownProviderEnvApiKeyNames() {
	return listKnownProviderAuthEnvVarNames();
}
//#endregion
//#region src/agents/model-auth-markers.ts
const MINIMAX_OAUTH_MARKER = "minimax-oauth";
const OAUTH_API_KEY_MARKER_PREFIX = "oauth:";
const OLLAMA_LOCAL_AUTH_MARKER = "ollama-local";
const CUSTOM_LOCAL_AUTH_MARKER = "custom-local";
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
const NON_ENV_SECRETREF_MARKER = "secretref-managed";
const SECRETREF_ENV_HEADER_MARKER_PREFIX = "secretref-env:";
const AWS_SDK_ENV_MARKERS = new Set([
	"AWS_BEARER_TOKEN_BEDROCK",
	"AWS_ACCESS_KEY_ID",
	"AWS_PROFILE"
]);
const LEGACY_ENV_API_KEY_MARKERS = [
	"GOOGLE_API_KEY",
	"DEEPSEEK_API_KEY",
	"PERPLEXITY_API_KEY",
	"FIREWORKS_API_KEY",
	"NOVITA_API_KEY",
	"AZURE_OPENAI_API_KEY",
	"AZURE_API_KEY",
	"MINIMAX_CODE_PLAN_KEY"
];
const KNOWN_ENV_API_KEY_MARKERS = new Set([
	...listKnownProviderEnvApiKeyNames(),
	...LEGACY_ENV_API_KEY_MARKERS,
	...AWS_SDK_ENV_MARKERS
]);
function isAwsSdkAuthMarker(value) {
	return AWS_SDK_ENV_MARKERS.has(value.trim());
}
function isKnownEnvApiKeyMarker(value) {
	const trimmed = value.trim();
	return KNOWN_ENV_API_KEY_MARKERS.has(trimmed) && !isAwsSdkAuthMarker(trimmed);
}
function resolveOAuthApiKeyMarker(providerId) {
	return `${OAUTH_API_KEY_MARKER_PREFIX}${providerId.trim()}`;
}
function isOAuthApiKeyMarker(value) {
	return value.trim().startsWith(OAUTH_API_KEY_MARKER_PREFIX);
}
function resolveNonEnvSecretRefApiKeyMarker(_source) {
	return NON_ENV_SECRETREF_MARKER;
}
function resolveNonEnvSecretRefHeaderValueMarker(_source) {
	return NON_ENV_SECRETREF_MARKER;
}
function resolveEnvSecretRefHeaderValueMarker(envVarName) {
	return `${SECRETREF_ENV_HEADER_MARKER_PREFIX}${envVarName.trim()}`;
}
function isSecretRefHeaderValueMarker(value) {
	const trimmed = value.trim();
	return trimmed === "secretref-managed" || trimmed.startsWith("secretref-env:");
}
function isNonSecretApiKeyMarker(value, opts) {
	const trimmed = value.trim();
	if (!trimmed) return false;
	if (trimmed === "minimax-oauth" || isOAuthApiKeyMarker(trimmed) || trimmed === "ollama-local" || trimmed === "custom-local" || trimmed === "gcp-vertex-credentials" || trimmed === "secretref-managed" || isAwsSdkAuthMarker(trimmed)) return true;
	if (opts?.includeEnvVarName === false) return false;
	return KNOWN_ENV_API_KEY_MARKERS.has(trimmed);
}
//#endregion
//#region src/agents/model-auth-env.ts
function resolveEnvApiKey(provider, env = process.env) {
	const normalized = normalizeProviderIdForAuth(provider);
	const applied = new Set(getShellEnvAppliedKeys());
	const pick = (envVar) => {
		const value = normalizeOptionalSecretInput(env[envVar]);
		if (!value) return null;
		return {
			apiKey: value,
			source: applied.has(envVar) ? `shell env: ${envVar}` : `env: ${envVar}`
		};
	};
	const candidates = PROVIDER_ENV_API_KEY_CANDIDATES[normalized];
	if (candidates) for (const envVar of candidates) {
		const resolved = pick(envVar);
		if (resolved) return resolved;
	}
	if (normalized === "google-vertex") {
		const envKey = getEnvApiKey(normalized);
		if (!envKey) return null;
		return {
			apiKey: envKey,
			source: "gcloud adc"
		};
	}
	if (normalized === "anthropic-vertex") {
		if (hasAnthropicVertexAvailableAuth(env)) return {
			apiKey: GCP_VERTEX_CREDENTIALS_MARKER,
			source: "gcloud adc"
		};
		return null;
	}
	return null;
}
//#endregion
export { shouldDeferShellEnvFallback as C, resolveShellEnvFallbackTimeoutMs as S, resolveOAuthApiKeyMarker as _, NON_ENV_SECRETREF_MARKER as a, getShellPathFromLoginShell as b, SECRETREF_ENV_HEADER_MARKER_PREFIX as c, isNonSecretApiKeyMarker as d, isOAuthApiKeyMarker as f, resolveNonEnvSecretRefHeaderValueMarker as g, resolveNonEnvSecretRefApiKeyMarker as h, MINIMAX_OAUTH_MARKER as i, isAwsSdkAuthMarker as l, resolveEnvSecretRefHeaderValueMarker as m, CUSTOM_LOCAL_AUTH_MARKER as n, OAUTH_API_KEY_MARKER_PREFIX as o, isSecretRefHeaderValueMarker as p, GCP_VERTEX_CREDENTIALS_MARKER as r, OLLAMA_LOCAL_AUTH_MARKER as s, resolveEnvApiKey as t, isKnownEnvApiKeyMarker as u, PROVIDER_ENV_API_KEY_CANDIDATES as v, shouldEnableShellEnvFallback as w, loadShellEnvFallback as x, getShellEnvAppliedKeys as y };
