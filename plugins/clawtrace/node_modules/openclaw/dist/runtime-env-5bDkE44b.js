import "./unhandled-rejections-CDJ8dOVP.js";
import "./subsystem-CJEvHE2o.js";
import "./env-CjUKd1aw.js";
import "./globals-0H99T-Tx.js";
import { n as hasEnvHttpProxyConfigured } from "./proxy-env-DHrI5l3m.js";
import "./logging-S_1ymJjU.js";
import "./retry-Dy9LmPnX.js";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import { Agent, EnvHttpProxyAgent, getGlobalDispatcher, setGlobalDispatcher } from "undici";
import { setTimeout } from "node:timers/promises";
import * as net$1 from "node:net";
//#region src/infra/backoff.ts
function computeBackoff(policy, attempt) {
	const base = policy.initialMs * policy.factor ** Math.max(attempt - 1, 0);
	const jitter = base * policy.jitter * Math.random();
	return Math.min(policy.maxMs, Math.round(base + jitter));
}
async function sleepWithAbort(ms, abortSignal) {
	if (ms <= 0) return;
	try {
		await setTimeout(ms, void 0, { signal: abortSignal });
	} catch (err) {
		if (abortSignal?.aborted) throw new Error("aborted", { cause: err });
		throw err;
	}
}
//#endregion
//#region src/infra/wsl.ts
let wslCached = null;
function resetWSLStateForTests() {
	wslCached = null;
}
function isWSLEnv() {
	if (process.env.WSL_INTEROP || process.env.WSL_DISTRO_NAME || process.env.WSLENV) return true;
	return false;
}
/**
* Synchronously check if running in WSL.
* Checks env vars first, then /proc/version.
*/
function isWSLSync() {
	if (process.platform !== "linux") return false;
	if (isWSLEnv()) return true;
	try {
		const release = readFileSync("/proc/version", "utf8").toLowerCase();
		return release.includes("microsoft") || release.includes("wsl");
	} catch {
		return false;
	}
}
/**
* Synchronously check if running in WSL2.
*/
function isWSL2Sync() {
	if (!isWSLSync()) return false;
	try {
		const version = readFileSync("/proc/version", "utf8").toLowerCase();
		return version.includes("wsl2") || version.includes("microsoft-standard");
	} catch {
		return false;
	}
}
async function isWSL() {
	if (wslCached !== null) return wslCached;
	if (process.platform !== "linux") {
		wslCached = false;
		return wslCached;
	}
	if (isWSLEnv()) {
		wslCached = true;
		return wslCached;
	}
	try {
		const release = await fs.readFile("/proc/sys/kernel/osrelease", "utf8");
		wslCached = release.toLowerCase().includes("microsoft") || release.toLowerCase().includes("wsl");
	} catch {
		wslCached = false;
	}
	return wslCached;
}
//#endregion
//#region src/infra/net/undici-global-dispatcher.ts
const DEFAULT_UNDICI_STREAM_TIMEOUT_MS = 1800 * 1e3;
const AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
let lastAppliedTimeoutKey = null;
let lastAppliedProxyBootstrap = false;
function resolveDispatcherKind(dispatcher) {
	const ctorName = dispatcher?.constructor?.name;
	if (typeof ctorName !== "string" || ctorName.length === 0) return "unsupported";
	if (ctorName.includes("EnvHttpProxyAgent")) return "env-proxy";
	if (ctorName.includes("ProxyAgent")) return "unsupported";
	if (ctorName.includes("Agent")) return "agent";
	return "unsupported";
}
function resolveAutoSelectFamily() {
	if (typeof net$1.getDefaultAutoSelectFamily !== "function") return;
	try {
		const systemDefault = net$1.getDefaultAutoSelectFamily();
		if (systemDefault && isWSL2Sync()) return false;
		return systemDefault;
	} catch {
		return;
	}
}
function resolveConnectOptions(autoSelectFamily) {
	if (autoSelectFamily === void 0) return;
	return {
		autoSelectFamily,
		autoSelectFamilyAttemptTimeout: AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS
	};
}
function resolveDispatcherKey(params) {
	const autoSelectToken = params.autoSelectFamily === void 0 ? "na" : params.autoSelectFamily ? "on" : "off";
	return `${params.kind}:${params.timeoutMs}:${autoSelectToken}`;
}
function resolveCurrentDispatcherKind() {
	let dispatcher;
	try {
		dispatcher = getGlobalDispatcher();
	} catch {
		return null;
	}
	const currentKind = resolveDispatcherKind(dispatcher);
	return currentKind === "unsupported" ? null : currentKind;
}
function ensureGlobalUndiciEnvProxyDispatcher() {
	if (!hasEnvHttpProxyConfigured("https")) return;
	if (lastAppliedProxyBootstrap) {
		if (resolveCurrentDispatcherKind() === "env-proxy") return;
		lastAppliedProxyBootstrap = false;
	}
	const currentKind = resolveCurrentDispatcherKind();
	if (currentKind === null) return;
	if (currentKind === "env-proxy") {
		lastAppliedProxyBootstrap = true;
		return;
	}
	try {
		setGlobalDispatcher(new EnvHttpProxyAgent());
		lastAppliedProxyBootstrap = true;
	} catch {}
}
function ensureGlobalUndiciStreamTimeouts(opts) {
	const timeoutMsRaw = opts?.timeoutMs ?? 18e5;
	const timeoutMs = Math.max(1, Math.floor(timeoutMsRaw));
	if (!Number.isFinite(timeoutMsRaw)) return;
	const kind = resolveCurrentDispatcherKind();
	if (kind === null) return;
	const autoSelectFamily = resolveAutoSelectFamily();
	const nextKey = resolveDispatcherKey({
		kind,
		timeoutMs,
		autoSelectFamily
	});
	if (lastAppliedTimeoutKey === nextKey) return;
	const connect = resolveConnectOptions(autoSelectFamily);
	try {
		if (kind === "env-proxy") setGlobalDispatcher(new EnvHttpProxyAgent({
			bodyTimeout: timeoutMs,
			headersTimeout: timeoutMs,
			...connect ? { connect } : {}
		}));
		else setGlobalDispatcher(new Agent({
			bodyTimeout: timeoutMs,
			headersTimeout: timeoutMs,
			...connect ? { connect } : {}
		}));
		lastAppliedTimeoutKey = nextKey;
	} catch {}
}
function resetGlobalUndiciStreamTimeoutsForTests() {
	lastAppliedTimeoutKey = null;
	lastAppliedProxyBootstrap = false;
}
//#endregion
export { isWSL as a, isWSLSync as c, sleepWithAbort as d, resetGlobalUndiciStreamTimeoutsForTests as i, resetWSLStateForTests as l, ensureGlobalUndiciEnvProxyDispatcher as n, isWSL2Sync as o, ensureGlobalUndiciStreamTimeouts as r, isWSLEnv as s, DEFAULT_UNDICI_STREAM_TIMEOUT_MS as t, computeBackoff as u };
