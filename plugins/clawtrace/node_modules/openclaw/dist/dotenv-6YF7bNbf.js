import { h as resolveConfigDir } from "./utils-BfvDpbwh.js";
import { i as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-C13NAkuJ.js";
import fsSync from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
//#region src/infra/dotenv.ts
const BLOCKED_WORKSPACE_DOTENV_KEYS = new Set([
	"ALL_PROXY",
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"NODE_TLS_REJECT_UNAUTHORIZED",
	"NO_PROXY",
	"OPENCLAW_AGENT_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_HOME",
	"OPENCLAW_OAUTH_DIR",
	"OPENCLAW_PROFILE",
	"OPENCLAW_STATE_DIR",
	"PI_CODING_AGENT_DIR"
]);
const BLOCKED_WORKSPACE_DOTENV_SUFFIXES = ["_BASE_URL"];
function shouldBlockRuntimeDotEnvKey(key) {
	return isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key);
}
function shouldBlockWorkspaceDotEnvKey(key) {
	const upper = key.toUpperCase();
	return shouldBlockRuntimeDotEnvKey(upper) || BLOCKED_WORKSPACE_DOTENV_KEYS.has(upper) || BLOCKED_WORKSPACE_DOTENV_SUFFIXES.some((suffix) => upper.endsWith(suffix));
}
function loadDotEnvFile(params) {
	let content;
	try {
		content = fsSync.readFileSync(params.filePath, "utf8");
	} catch (error) {
		if (!params.quiet) {
			if ((error && typeof error === "object" && "code" in error ? String(error.code) : void 0) !== "ENOENT") console.warn(`[dotenv] Failed to read ${params.filePath}: ${String(error)}`);
		}
		return;
	}
	let parsed;
	try {
		parsed = dotenv.parse(content);
	} catch (error) {
		if (!params.quiet) console.warn(`[dotenv] Failed to parse ${params.filePath}: ${String(error)}`);
		return;
	}
	for (const [rawKey, value] of Object.entries(parsed)) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key || params.shouldBlockKey(key)) continue;
		if (process.env[key] !== void 0) continue;
		process.env[key] = value;
	}
}
function loadRuntimeDotEnvFile(filePath, opts) {
	loadDotEnvFile({
		filePath,
		shouldBlockKey: shouldBlockRuntimeDotEnvKey,
		quiet: opts?.quiet ?? true
	});
}
function loadWorkspaceDotEnvFile(filePath, opts) {
	loadDotEnvFile({
		filePath,
		shouldBlockKey: shouldBlockWorkspaceDotEnvKey,
		quiet: opts?.quiet ?? true
	});
}
function loadDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	loadWorkspaceDotEnvFile(path.join(process.cwd(), ".env"), { quiet });
	loadRuntimeDotEnvFile(path.join(resolveConfigDir(process.env), ".env"), { quiet });
}
//#endregion
export { loadRuntimeDotEnvFile as n, loadWorkspaceDotEnvFile as r, loadDotEnv as t };
