import { t as isTruthyEnvValue } from "../../env-CjUKd1aw.js";
import { Ay as withFetchPreconnect, dN as drainSessionStoreLockQueuesForTest, uN as clearSessionStoreCacheForTest } from "../../auth-profiles-B5ypC5S-.js";
import { A as drainSessionWriteLockStateForTest } from "../../docker-CqsUMWoC.js";
import { n as drainFileLockStateForTest } from "../../file-lock-COakxmwX.js";
import "../../file-lock-W6hRDEpI.js";
import { n as vi, t as globalExpect } from "../../test.p_J6dB8a-By80XNEz.js";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
//#region src/agents/live-test-helpers.ts
function isLiveTestEnabled(extraEnvVars = [], env = process.env) {
	return [
		...extraEnvVars,
		"LIVE",
		"OPENCLAW_LIVE_TEST"
	].some((name) => isTruthyEnvValue(env[name]));
}
//#endregion
//#region src/cli/test-runtime-capture.ts
function normalizeRuntimeStdout(value) {
	return value.endsWith("\n") ? value.slice(0, -1) : value;
}
function stringifyRuntimeJson(value, space = 2) {
	return JSON.stringify(value, null, space > 0 ? space : void 0);
}
function createCliRuntimeCapture() {
	const runtimeLogs = [];
	const runtimeErrors = [];
	const stringifyArgs = (args) => args.map((value) => String(value)).join(" ");
	const defaultRuntime = {
		log: vi.fn((...args) => {
			runtimeLogs.push(stringifyArgs(args));
		}),
		error: vi.fn((...args) => {
			runtimeErrors.push(stringifyArgs(args));
		}),
		writeStdout: vi.fn((value) => {
			defaultRuntime.log(normalizeRuntimeStdout(value));
		}),
		writeJson: vi.fn((value, space = 2) => {
			defaultRuntime.log(stringifyRuntimeJson(value, space));
		}),
		exit: vi.fn((code) => {
			throw new Error(`__exit__:${code}`);
		})
	};
	return {
		runtimeLogs,
		runtimeErrors,
		defaultRuntime,
		resetRuntimeCapture: () => {
			runtimeLogs.length = 0;
			runtimeErrors.length = 0;
		}
	};
}
//#endregion
//#region src/test-utils/auth-token-assertions.ts
function expectGeneratedTokenPersistedToGatewayAuth(params) {
	globalExpect(params.generatedToken).toMatch(/^[0-9a-f]{48}$/);
	globalExpect(params.authToken).toBe(params.generatedToken);
	globalExpect(params.persistedConfig?.gateway?.auth?.mode).toBe("token");
	globalExpect(params.persistedConfig?.gateway?.auth?.token).toBe(params.generatedToken);
}
//#endregion
//#region src/test-utils/env.ts
function captureEnv(keys) {
	const snapshot = /* @__PURE__ */ new Map();
	for (const key of keys) snapshot.set(key, process.env[key]);
	return { restore() {
		for (const [key, value] of snapshot) if (value === void 0) delete process.env[key];
		else process.env[key] = value;
	} };
}
function applyEnvValues(env) {
	for (const [key, value] of Object.entries(env)) if (value === void 0) delete process.env[key];
	else process.env[key] = value;
}
function withEnv(env, fn) {
	const snapshot = captureEnv(Object.keys(env));
	try {
		applyEnvValues(env);
		return fn();
	} finally {
		snapshot.restore();
	}
}
async function withEnvAsync(env, fn) {
	const snapshot = captureEnv(Object.keys(env));
	try {
		applyEnvValues(env);
		return await fn();
	} finally {
		snapshot.restore();
	}
}
//#endregion
//#region src/test-utils/session-state-cleanup.ts
async function cleanupSessionStateForTest() {
	await drainSessionStoreLockQueuesForTest();
	clearSessionStoreCacheForTest();
	await drainFileLockStateForTest();
	await drainSessionWriteLockStateForTest();
}
//#endregion
//#region src/test-utils/temp-home.ts
const HOME_ENV_KEYS = [
	"HOME",
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"OPENCLAW_STATE_DIR"
];
async function createTempHomeEnv(prefix) {
	const home = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
	await fs.mkdir(path.join(home, ".openclaw"), { recursive: true });
	const snapshot = captureEnv([...HOME_ENV_KEYS]);
	process.env.HOME = home;
	process.env.USERPROFILE = home;
	process.env.OPENCLAW_STATE_DIR = path.join(home, ".openclaw");
	if (process.platform === "win32") {
		const match = home.match(/^([A-Za-z]:)(.*)$/);
		if (match) {
			process.env.HOMEDRIVE = match[1];
			process.env.HOMEPATH = match[2] || "\\";
		}
	}
	return {
		home,
		restore: async () => {
			await cleanupSessionStateForTest().catch(() => void 0);
			snapshot.restore();
			await fs.rm(home, {
				recursive: true,
				force: true
			});
		}
	};
}
//#endregion
export { createCliRuntimeCapture, createTempHomeEnv, expectGeneratedTokenPersistedToGatewayAuth, isLiveTestEnabled, withEnv, withEnvAsync, withFetchPreconnect };
