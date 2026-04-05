import { m as defaultRuntime, t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { n as markOpenClawExecEnv } from "./openclaw-exec-env-D-qcr6HX.js";
import { E as isPlainObject, v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { c as normalizeAgentId, u as resolveAgentIdFromSessionKey } from "./session-key-BhxcMJEE.js";
import { t as isBlockedObjectKey } from "./prototype-keys-DECjSrxt.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { i as resolvePathViaExistingAncestorSync } from "./boundary-path-Ci-Gk9P9.js";
import { i as openBoundaryFileSync, t as canUseBoundaryFileOpen } from "./boundary-file-read-7v-hs51G.js";
import { n as isPathInside } from "./scan-paths-hOTASUCw.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import { t as safeParseJsonWithSchema } from "./zod-parse-DgsspuWq.js";
import { n as getProcessStartTime, r as isPidAlive, t as resolveProcessScopedMap } from "./process-scoped-map-COUIpXOR.js";
import { r as writeJsonAtomic } from "./json-files-DMrq2IfK.js";
import { t as getBlockedNetworkModeReason } from "./network-mode-DJFdXkI6.js";
import { d as SANDBOX_BROWSER_REGISTRY_PATH, l as DEFAULT_SANDBOX_IMAGE, p as SANDBOX_REGISTRY_PATH, u as SANDBOX_AGENT_WORKSPACE_MOUNT } from "./config-BWw9Yn0D.js";
import { i as resolveWindowsSpawnProgram, n as materializeWindowsSpawnProgram } from "./windows-spawn-C667jQDQ.js";
import fsSync from "node:fs";
import path, { posix } from "node:path";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import JSON5 from "json5";
import { z } from "zod";
//#region src/config/includes.ts
/**
* Config includes: $include directive for modular configs
*
* @example
* ```json5
* {
*   "$include": "./base.json5",           // single file
*   "$include": ["./a.json5", "./b.json5"] // merge multiple
* }
* ```
*/
const INCLUDE_KEY = "$include";
var ConfigIncludeError = class extends Error {
	constructor(message, includePath, cause) {
		super(message);
		this.includePath = includePath;
		this.cause = cause;
		this.name = "ConfigIncludeError";
	}
};
var CircularIncludeError = class extends ConfigIncludeError {
	constructor(chain) {
		super(`Circular include detected: ${chain.join(" -> ")}`, chain[chain.length - 1]);
		this.chain = chain;
		this.name = "CircularIncludeError";
	}
};
/** Deep merge: arrays concatenate, objects merge recursively, primitives: source wins */
function deepMerge(target, source) {
	if (Array.isArray(target) && Array.isArray(source)) return [...target, ...source];
	if (isPlainObject(target) && isPlainObject(source)) {
		const result = { ...target };
		for (const key of Object.keys(source)) {
			if (isBlockedObjectKey(key)) continue;
			result[key] = key in result ? deepMerge(result[key], source[key]) : source[key];
		}
		return result;
	}
	return source;
}
var IncludeProcessor = class IncludeProcessor {
	constructor(basePath, resolver, rootDir) {
		this.basePath = basePath;
		this.resolver = resolver;
		this.visited = /* @__PURE__ */ new Set();
		this.depth = 0;
		this.visited.add(path.normalize(basePath));
		this.rootDir = path.normalize(rootDir ?? path.dirname(basePath));
		this.rootRealDir = path.normalize(safeRealpath(this.rootDir));
	}
	process(obj) {
		if (Array.isArray(obj)) return obj.map((item) => this.process(item));
		if (!isPlainObject(obj)) return obj;
		if (!("$include" in obj)) return this.processObject(obj);
		return this.processInclude(obj);
	}
	processObject(obj) {
		const result = {};
		for (const [key, value] of Object.entries(obj)) result[key] = this.process(value);
		return result;
	}
	processInclude(obj) {
		const includeValue = obj[INCLUDE_KEY];
		const otherKeys = Object.keys(obj).filter((k) => k !== INCLUDE_KEY);
		const included = this.resolveInclude(includeValue);
		if (otherKeys.length === 0) return included;
		if (!isPlainObject(included)) throw new ConfigIncludeError("Sibling keys require included content to be an object", typeof includeValue === "string" ? includeValue : INCLUDE_KEY);
		const rest = {};
		for (const key of otherKeys) rest[key] = this.process(obj[key]);
		return deepMerge(included, rest);
	}
	resolveInclude(value) {
		if (typeof value === "string") return this.loadFile(value);
		if (Array.isArray(value)) return value.reduce((merged, item) => {
			if (typeof item !== "string") throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof item}`, String(item));
			return deepMerge(merged, this.loadFile(item));
		}, {});
		throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof value}`, String(value));
	}
	loadFile(includePath) {
		const resolvedPath = this.resolvePath(includePath);
		this.checkCircular(resolvedPath);
		this.checkDepth(includePath);
		const raw = this.readFile(includePath, resolvedPath);
		const parsed = this.parseFile(includePath, resolvedPath, raw);
		return this.processNested(resolvedPath, parsed);
	}
	resolvePath(includePath) {
		const configDir = path.dirname(this.basePath);
		const resolved = path.isAbsolute(includePath) ? includePath : path.resolve(configDir, includePath);
		const normalized = path.normalize(resolved);
		if (!isPathInside(this.rootDir, normalized)) throw new ConfigIncludeError(`Include path escapes config directory: ${includePath} (root: ${this.rootDir})`, includePath);
		try {
			const real = fsSync.realpathSync(normalized);
			if (!isPathInside(this.rootRealDir, real)) throw new ConfigIncludeError(`Include path resolves outside config directory (symlink): ${includePath} (root: ${this.rootDir})`, includePath);
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
		}
		return normalized;
	}
	checkCircular(resolvedPath) {
		if (this.visited.has(resolvedPath)) throw new CircularIncludeError([...this.visited, resolvedPath]);
	}
	checkDepth(includePath) {
		if (this.depth >= 10) throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${includePath}`, includePath);
	}
	readFile(includePath, resolvedPath) {
		try {
			if (this.resolver.readFileWithGuards) return this.resolver.readFileWithGuards({
				includePath,
				resolvedPath,
				rootRealDir: this.rootRealDir
			});
			return this.resolver.readFile(resolvedPath);
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
			throw new ConfigIncludeError(`Failed to read include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	parseFile(includePath, resolvedPath, raw) {
		try {
			return this.resolver.parseJson(raw);
		} catch (err) {
			throw new ConfigIncludeError(`Failed to parse include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	processNested(resolvedPath, parsed) {
		const nested = new IncludeProcessor(resolvedPath, this.resolver, this.rootDir);
		nested.visited = new Set([...this.visited, resolvedPath]);
		nested.depth = this.depth + 1;
		return nested.process(parsed);
	}
};
function safeRealpath(target) {
	try {
		return fsSync.realpathSync(target);
	} catch {
		return target;
	}
}
function readConfigIncludeFileWithGuards(params) {
	const ioFs = params.ioFs ?? fsSync;
	const maxBytes = params.maxBytes ?? 2097152;
	if (!canUseBoundaryFileOpen(ioFs)) return ioFs.readFileSync(params.resolvedPath, "utf-8");
	const opened = openBoundaryFileSync({
		absolutePath: params.resolvedPath,
		rootPath: params.rootRealDir,
		rootRealPath: params.rootRealDir,
		boundaryLabel: "config directory",
		skipLexicalRootCheck: true,
		maxBytes,
		ioFs
	});
	if (!opened.ok) {
		if (opened.reason === "validation") throw new ConfigIncludeError(`Include file failed security checks (regular file, max ${maxBytes} bytes, no hardlinks): ${params.includePath}`, params.includePath);
		throw new ConfigIncludeError(`Failed to read include file: ${params.includePath} (resolved: ${params.resolvedPath})`, params.includePath, opened.error instanceof Error ? opened.error : void 0);
	}
	try {
		return ioFs.readFileSync(opened.fd, "utf-8");
	} finally {
		ioFs.closeSync(opened.fd);
	}
}
const defaultResolver = {
	readFile: (p) => fsSync.readFileSync(p, "utf-8"),
	readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => readConfigIncludeFileWithGuards({
		includePath,
		resolvedPath,
		rootRealDir
	}),
	parseJson: (raw) => JSON5.parse(raw)
};
/**
* Resolves all $include directives in a parsed config object.
*/
function resolveConfigIncludes(obj, configPath, resolver = defaultResolver) {
	return new IncludeProcessor(configPath, resolver).process(obj);
}
//#endregion
//#region src/agents/session-write-lock.ts
function isValidLockNumber(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
const CLEANUP_SIGNALS = [
	"SIGINT",
	"SIGTERM",
	"SIGQUIT",
	"SIGABRT"
];
const CLEANUP_STATE_KEY = Symbol.for("openclaw.sessionWriteLockCleanupState");
const HELD_LOCKS_KEY = Symbol.for("openclaw.sessionWriteLockHeldLocks");
const WATCHDOG_STATE_KEY = Symbol.for("openclaw.sessionWriteLockWatchdogState");
const DEFAULT_STALE_MS = 1800 * 1e3;
const DEFAULT_MAX_HOLD_MS = 300 * 1e3;
const DEFAULT_WATCHDOG_INTERVAL_MS = 6e4;
const DEFAULT_TIMEOUT_GRACE_MS = 120 * 1e3;
const MAX_LOCK_HOLD_MS = 2147e6;
const HELD_LOCKS = resolveProcessScopedMap(HELD_LOCKS_KEY);
function resolveCleanupState() {
	const proc = process;
	if (!proc[CLEANUP_STATE_KEY]) proc[CLEANUP_STATE_KEY] = {
		registered: false,
		cleanupHandlers: /* @__PURE__ */ new Map()
	};
	return proc[CLEANUP_STATE_KEY];
}
function resolveWatchdogState() {
	const proc = process;
	if (!proc[WATCHDOG_STATE_KEY]) proc[WATCHDOG_STATE_KEY] = {
		started: false,
		intervalMs: DEFAULT_WATCHDOG_INTERVAL_MS
	};
	return proc[WATCHDOG_STATE_KEY];
}
function resolvePositiveMs(value, fallback, opts = {}) {
	if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return fallback;
	if (value === Number.POSITIVE_INFINITY) return opts.allowInfinity ? value : fallback;
	if (!Number.isFinite(value)) return fallback;
	return value;
}
function resolveSessionLockMaxHoldFromTimeout(params) {
	const minMs = resolvePositiveMs(params.minMs, DEFAULT_MAX_HOLD_MS);
	const timeoutMs = resolvePositiveMs(params.timeoutMs, minMs, { allowInfinity: true });
	if (timeoutMs === Number.POSITIVE_INFINITY) return MAX_LOCK_HOLD_MS;
	const graceMs = resolvePositiveMs(params.graceMs, DEFAULT_TIMEOUT_GRACE_MS);
	return Math.min(MAX_LOCK_HOLD_MS, Math.max(minMs, timeoutMs + graceMs));
}
async function releaseHeldLock(normalizedSessionFile, held, opts = {}) {
	if (HELD_LOCKS.get(normalizedSessionFile) !== held) return false;
	if (opts.force) held.count = 0;
	else {
		held.count -= 1;
		if (held.count > 0) return false;
	}
	if (held.releasePromise) {
		await held.releasePromise.catch(() => void 0);
		return true;
	}
	HELD_LOCKS.delete(normalizedSessionFile);
	held.releasePromise = (async () => {
		try {
			await held.handle.close();
		} catch {}
		try {
			await fs.rm(held.lockPath, { force: true });
		} catch {}
	})();
	try {
		await held.releasePromise;
		return true;
	} finally {
		held.releasePromise = void 0;
		if (HELD_LOCKS.size === 0) stopWatchdogTimer();
	}
}
/**
* Synchronously release all held locks.
* Used during process exit when async operations aren't reliable.
*/
function releaseAllLocksSync() {
	for (const [sessionFile, held] of HELD_LOCKS) {
		held.handle.close().catch(() => void 0);
		try {
			fsSync.rmSync(held.lockPath, { force: true });
		} catch {}
		HELD_LOCKS.delete(sessionFile);
	}
	if (HELD_LOCKS.size === 0) stopWatchdogTimer();
}
async function runLockWatchdogCheck(nowMs = Date.now()) {
	let released = 0;
	for (const [sessionFile, held] of HELD_LOCKS.entries()) {
		const heldForMs = nowMs - held.acquiredAt;
		if (heldForMs <= held.maxHoldMs) continue;
		process.stderr.write(`[session-write-lock] releasing lock held for ${heldForMs}ms (max=${held.maxHoldMs}ms): ${held.lockPath}\n`);
		if (await releaseHeldLock(sessionFile, held, { force: true })) released += 1;
	}
	return released;
}
function stopWatchdogTimer() {
	const watchdogState = resolveWatchdogState();
	if (watchdogState.timer) {
		clearInterval(watchdogState.timer);
		watchdogState.timer = void 0;
	}
	watchdogState.started = false;
}
function ensureWatchdogStarted(intervalMs) {
	const watchdogState = resolveWatchdogState();
	if (watchdogState.started) return;
	watchdogState.started = true;
	watchdogState.intervalMs = intervalMs;
	watchdogState.timer = setInterval(() => {
		runLockWatchdogCheck().catch(() => {});
	}, intervalMs);
	watchdogState.timer.unref?.();
}
function handleTerminationSignal(signal) {
	releaseAllLocksSync();
	const cleanupState = resolveCleanupState();
	if (process.listenerCount(signal) === 1) {
		const handler = cleanupState.cleanupHandlers.get(signal);
		if (handler) {
			process.off(signal, handler);
			cleanupState.cleanupHandlers.delete(signal);
		}
		try {
			process.kill(process.pid, signal);
		} catch {}
	}
}
function registerCleanupHandlers() {
	const cleanupState = resolveCleanupState();
	if (!cleanupState.registered) {
		cleanupState.registered = true;
		process.on("exit", () => {
			releaseAllLocksSync();
		});
	}
	ensureWatchdogStarted(DEFAULT_WATCHDOG_INTERVAL_MS);
	for (const signal of CLEANUP_SIGNALS) {
		if (cleanupState.cleanupHandlers.has(signal)) continue;
		try {
			const handler = () => handleTerminationSignal(signal);
			cleanupState.cleanupHandlers.set(signal, handler);
			process.on(signal, handler);
		} catch {}
	}
}
function unregisterCleanupHandlers() {
	const cleanupState = resolveCleanupState();
	for (const [signal, handler] of cleanupState.cleanupHandlers) process.off(signal, handler);
	cleanupState.cleanupHandlers.clear();
	cleanupState.registered = false;
}
async function readLockPayload(lockPath) {
	try {
		const raw = await fs.readFile(lockPath, "utf8");
		const parsed = JSON.parse(raw);
		const payload = {};
		if (isValidLockNumber(parsed.pid) && parsed.pid > 0) payload.pid = parsed.pid;
		if (typeof parsed.createdAt === "string") payload.createdAt = parsed.createdAt;
		if (isValidLockNumber(parsed.starttime)) payload.starttime = parsed.starttime;
		return payload;
	} catch {
		return null;
	}
}
function inspectLockPayload(payload, staleMs, nowMs) {
	const pid = isValidLockNumber(payload?.pid) && payload.pid > 0 ? payload.pid : null;
	const pidAlive = pid !== null ? isPidAlive(pid) : false;
	const createdAt = typeof payload?.createdAt === "string" ? payload.createdAt : null;
	const createdAtMs = createdAt ? Date.parse(createdAt) : NaN;
	const ageMs = Number.isFinite(createdAtMs) ? Math.max(0, nowMs - createdAtMs) : null;
	const storedStarttime = isValidLockNumber(payload?.starttime) ? payload.starttime : null;
	const pidRecycled = pidAlive && pid !== null && storedStarttime !== null ? (() => {
		const currentStarttime = getProcessStartTime(pid);
		return currentStarttime !== null && currentStarttime !== storedStarttime;
	})() : false;
	const staleReasons = [];
	if (pid === null) staleReasons.push("missing-pid");
	else if (!pidAlive) staleReasons.push("dead-pid");
	else if (pidRecycled) staleReasons.push("recycled-pid");
	if (ageMs === null) staleReasons.push("invalid-createdAt");
	else if (ageMs > staleMs) staleReasons.push("too-old");
	return {
		pid,
		pidAlive,
		createdAt,
		ageMs,
		stale: staleReasons.length > 0,
		staleReasons
	};
}
function lockInspectionNeedsMtimeStaleFallback(details) {
	return details.stale && details.staleReasons.every((reason) => reason === "missing-pid" || reason === "invalid-createdAt");
}
async function shouldReclaimContendedLockFile(lockPath, details, staleMs, nowMs) {
	if (!details.stale) return false;
	if (!lockInspectionNeedsMtimeStaleFallback(details)) return true;
	try {
		const stat = await fs.stat(lockPath);
		return Math.max(0, nowMs - stat.mtimeMs) > staleMs;
	} catch (error) {
		return error?.code !== "ENOENT";
	}
}
function shouldTreatAsOrphanSelfLock(params) {
	if ((isValidLockNumber(params.payload?.pid) ? params.payload.pid : null) !== process.pid) return false;
	if (isValidLockNumber(params.payload?.starttime)) return false;
	return !HELD_LOCKS.has(params.normalizedSessionFile);
}
async function cleanStaleLockFiles(params) {
	const sessionsDir = path.resolve(params.sessionsDir);
	const staleMs = resolvePositiveMs(params.staleMs, DEFAULT_STALE_MS);
	const removeStale = params.removeStale !== false;
	const nowMs = params.nowMs ?? Date.now();
	let entries = [];
	try {
		entries = await fs.readdir(sessionsDir, { withFileTypes: true });
	} catch (err) {
		if (err.code === "ENOENT") return {
			locks: [],
			cleaned: []
		};
		throw err;
	}
	const locks = [];
	const cleaned = [];
	const lockEntries = entries.filter((entry) => entry.name.endsWith(".jsonl.lock")).toSorted((a, b) => a.name.localeCompare(b.name));
	for (const entry of lockEntries) {
		const lockPath = path.join(sessionsDir, entry.name);
		const lockInfo = {
			lockPath,
			...inspectLockPayload(await readLockPayload(lockPath), staleMs, nowMs),
			removed: false
		};
		if (lockInfo.stale && removeStale) {
			await fs.rm(lockPath, { force: true });
			lockInfo.removed = true;
			cleaned.push(lockInfo);
			params.log?.warn?.(`removed stale session lock: ${lockPath} (${lockInfo.staleReasons.join(", ") || "unknown"})`);
		}
		locks.push(lockInfo);
	}
	return {
		locks,
		cleaned
	};
}
async function acquireSessionWriteLock(params) {
	registerCleanupHandlers();
	const timeoutMs = resolvePositiveMs(params.timeoutMs, 1e4, { allowInfinity: true });
	const staleMs = resolvePositiveMs(params.staleMs, DEFAULT_STALE_MS);
	const maxHoldMs = resolvePositiveMs(params.maxHoldMs, DEFAULT_MAX_HOLD_MS);
	const sessionFile = path.resolve(params.sessionFile);
	const sessionDir = path.dirname(sessionFile);
	await fs.mkdir(sessionDir, { recursive: true });
	let normalizedDir = sessionDir;
	try {
		normalizedDir = await fs.realpath(sessionDir);
	} catch {}
	const normalizedSessionFile = path.join(normalizedDir, path.basename(sessionFile));
	const lockPath = `${normalizedSessionFile}.lock`;
	const allowReentrant = params.allowReentrant ?? true;
	const held = HELD_LOCKS.get(normalizedSessionFile);
	if (allowReentrant && held) {
		held.count += 1;
		return { release: async () => {
			await releaseHeldLock(normalizedSessionFile, held);
		} };
	}
	const startedAt = Date.now();
	let attempt = 0;
	while (Date.now() - startedAt < timeoutMs) {
		attempt += 1;
		let handle = null;
		try {
			handle = await fs.open(lockPath, "wx");
			const createdAt = (/* @__PURE__ */ new Date()).toISOString();
			const starttime = getProcessStartTime(process.pid);
			const lockPayload = {
				pid: process.pid,
				createdAt
			};
			if (starttime !== null) lockPayload.starttime = starttime;
			await handle.writeFile(JSON.stringify(lockPayload, null, 2), "utf8");
			const createdHeld = {
				count: 1,
				handle,
				lockPath,
				acquiredAt: Date.now(),
				maxHoldMs
			};
			HELD_LOCKS.set(normalizedSessionFile, createdHeld);
			return { release: async () => {
				await releaseHeldLock(normalizedSessionFile, createdHeld);
			} };
		} catch (err) {
			if (handle) {
				try {
					await handle.close();
				} catch {}
				try {
					await fs.rm(lockPath, { force: true });
				} catch {}
			}
			if (err.code !== "EEXIST") throw err;
			const payload = await readLockPayload(lockPath);
			const nowMs = Date.now();
			const inspected = inspectLockPayload(payload, staleMs, nowMs);
			if (await shouldReclaimContendedLockFile(lockPath, shouldTreatAsOrphanSelfLock({
				payload,
				normalizedSessionFile
			}) ? {
				...inspected,
				stale: true,
				staleReasons: inspected.staleReasons.includes("orphan-self-pid") ? inspected.staleReasons : [...inspected.staleReasons, "orphan-self-pid"]
			} : inspected, staleMs, nowMs)) {
				await fs.rm(lockPath, { force: true });
				continue;
			}
			const delay = Math.min(1e3, 50 * attempt);
			await new Promise((r) => setTimeout(r, delay));
		}
	}
	const payload = await readLockPayload(lockPath);
	const owner = typeof payload?.pid === "number" ? `pid=${payload.pid}` : "unknown";
	throw new Error(`session file locked (timeout ${timeoutMs}ms): ${owner} ${lockPath}`);
}
[...CLEANUP_SIGNALS];
async function drainSessionWriteLockStateForTest() {
	for (const [sessionFile, held] of Array.from(HELD_LOCKS.entries())) await releaseHeldLock(sessionFile, held, { force: true }).catch(() => void 0);
	stopWatchdogTimer();
	unregisterCleanupHandlers();
}
//#endregion
//#region src/agents/sandbox/sanitize-env-vars.ts
const BLOCKED_ENV_VAR_PATTERNS = [
	/^ANTHROPIC_API_KEY$/i,
	/^OPENAI_API_KEY$/i,
	/^GEMINI_API_KEY$/i,
	/^OPENROUTER_API_KEY$/i,
	/^MINIMAX_API_KEY$/i,
	/^ELEVENLABS_API_KEY$/i,
	/^SYNTHETIC_API_KEY$/i,
	/^TELEGRAM_BOT_TOKEN$/i,
	/^DISCORD_BOT_TOKEN$/i,
	/^SLACK_(BOT|APP)_TOKEN$/i,
	/^LINE_CHANNEL_SECRET$/i,
	/^LINE_CHANNEL_ACCESS_TOKEN$/i,
	/^OPENCLAW_GATEWAY_(TOKEN|PASSWORD)$/i,
	/^AWS_(SECRET_ACCESS_KEY|SECRET_KEY|SESSION_TOKEN)$/i,
	/^(GH|GITHUB)_TOKEN$/i,
	/^(AZURE|AZURE_OPENAI|COHERE|AI_GATEWAY|OPENROUTER)_API_KEY$/i,
	/_?(API_KEY|TOKEN|PASSWORD|PRIVATE_KEY|SECRET)$/i
];
const ALLOWED_ENV_VAR_PATTERNS = [
	/^LANG$/,
	/^LC_.*$/i,
	/^PATH$/i,
	/^HOME$/i,
	/^USER$/i,
	/^SHELL$/i,
	/^TERM$/i,
	/^TZ$/i,
	/^NODE_ENV$/i
];
function validateEnvVarValue(value) {
	if (value.includes("\0")) return "Contains null bytes";
	if (value.length > 32768) return "Value exceeds maximum length";
	if (/^[A-Za-z0-9+/=]{80,}$/.test(value)) return "Value looks like base64-encoded credential data";
}
function matchesAnyPattern(value, patterns) {
	return patterns.some((pattern) => pattern.test(value));
}
function sanitizeEnvVars(envVars, options = {}) {
	const allowed = {};
	const blocked = [];
	const warnings = [];
	const blockedPatterns = [...BLOCKED_ENV_VAR_PATTERNS, ...options.customBlockedPatterns ?? []];
	const allowedPatterns = [...ALLOWED_ENV_VAR_PATTERNS, ...options.customAllowedPatterns ?? []];
	for (const [rawKey, value] of Object.entries(envVars)) {
		const key = rawKey.trim();
		if (!key) continue;
		if (matchesAnyPattern(key, blockedPatterns)) {
			blocked.push(key);
			continue;
		}
		if (options.strictMode && !matchesAnyPattern(key, allowedPatterns)) {
			blocked.push(key);
			continue;
		}
		const warning = validateEnvVarValue(value);
		if (warning) {
			if (warning === "Contains null bytes") {
				blocked.push(key);
				continue;
			}
			warnings.push(`${key}: ${warning}`);
		}
		allowed[key] = value;
	}
	return {
		allowed,
		blocked,
		warnings
	};
}
//#endregion
//#region src/agents/workspace-dirs.ts
function listAgentWorkspaceDirs(cfg) {
	const dirs = /* @__PURE__ */ new Set();
	const list = cfg.agents?.list;
	if (Array.isArray(list)) {
		for (const entry of list) if (entry && typeof entry === "object" && typeof entry.id === "string") dirs.add(resolveAgentWorkspaceDir(cfg, entry.id));
	}
	dirs.add(resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)));
	return [...dirs];
}
//#endregion
//#region src/agents/sandbox/hash.ts
function hashTextSha256(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
//#endregion
//#region src/agents/sandbox/config-hash.ts
function normalizeForHash(value) {
	if (value === void 0) return;
	if (Array.isArray(value)) return value.map(normalizeForHash).filter((item) => item !== void 0);
	if (value && typeof value === "object") {
		const entries = Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b));
		const normalized = {};
		for (const [key, entryValue] of entries) {
			const next = normalizeForHash(entryValue);
			if (next !== void 0) normalized[key] = next;
		}
		return normalized;
	}
	return value;
}
function computeSandboxConfigHash(input) {
	return computeHash(input);
}
function computeSandboxBrowserConfigHash(input) {
	return computeHash(input);
}
function computeHash(input) {
	const payload = normalizeForHash(input);
	return hashTextSha256(JSON.stringify(payload));
}
//#endregion
//#region src/agents/sandbox/registry.ts
const RegistryEntrySchema = z.object({ containerName: z.string() }).passthrough();
const RegistryFileSchema = z.object({ entries: z.array(RegistryEntrySchema) });
function normalizeSandboxRegistryEntry(entry) {
	return {
		...entry,
		backendId: entry.backendId?.trim() || "docker",
		runtimeLabel: entry.runtimeLabel?.trim() || entry.containerName,
		configLabelKind: entry.configLabelKind?.trim() || "Image"
	};
}
async function withRegistryLock(registryPath, fn) {
	const lock = await acquireSessionWriteLock({
		sessionFile: registryPath,
		allowReentrant: false
	});
	try {
		return await fn();
	} finally {
		await lock.release();
	}
}
async function readRegistryFromFile(registryPath, mode) {
	try {
		const parsed = safeParseJsonWithSchema(RegistryFileSchema, await fs.readFile(registryPath, "utf-8"));
		if (parsed) return parsed;
		if (mode === "fallback") return { entries: [] };
		throw new Error(`Invalid sandbox registry format: ${registryPath}`);
	} catch (error) {
		if (error?.code === "ENOENT") return { entries: [] };
		if (mode === "fallback") return { entries: [] };
		if (error instanceof Error) throw error;
		throw new Error(`Failed to read sandbox registry file: ${registryPath}`, { cause: error });
	}
}
async function writeRegistryFile(registryPath, registry) {
	await writeJsonAtomic(registryPath, registry, { trailingNewline: true });
}
async function readRegistry() {
	return { entries: (await readRegistryFromFile(SANDBOX_REGISTRY_PATH, "fallback")).entries.map((entry) => normalizeSandboxRegistryEntry(entry)) };
}
function upsertEntry(entries, entry) {
	const existing = entries.find((item) => item.containerName === entry.containerName);
	const next = entries.filter((item) => item.containerName !== entry.containerName);
	next.push({
		...entry,
		backendId: entry.backendId ?? existing?.backendId,
		runtimeLabel: entry.runtimeLabel ?? existing?.runtimeLabel,
		createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
		image: existing?.image ?? entry.image,
		configLabelKind: entry.configLabelKind ?? existing?.configLabelKind,
		configHash: entry.configHash ?? existing?.configHash
	});
	return next;
}
function removeEntry(entries, containerName) {
	return entries.filter((entry) => entry.containerName !== containerName);
}
async function withRegistryMutation(registryPath, mutate) {
	await withRegistryLock(registryPath, async () => {
		const next = mutate((await readRegistryFromFile(registryPath, "strict")).entries);
		if (next === null) return;
		await writeRegistryFile(registryPath, { entries: next });
	});
}
async function updateRegistry(entry) {
	await withRegistryMutation(SANDBOX_REGISTRY_PATH, (entries) => upsertEntry(entries, entry));
}
async function removeRegistryEntry(containerName) {
	await withRegistryMutation(SANDBOX_REGISTRY_PATH, (entries) => {
		const next = removeEntry(entries, containerName);
		if (next.length === entries.length) return null;
		return next;
	});
}
async function readBrowserRegistry() {
	return await readRegistryFromFile(SANDBOX_BROWSER_REGISTRY_PATH, "fallback");
}
async function updateBrowserRegistry(entry) {
	await withRegistryMutation(SANDBOX_BROWSER_REGISTRY_PATH, (entries) => upsertEntry(entries, entry));
}
async function removeBrowserRegistryEntry(containerName) {
	await withRegistryMutation(SANDBOX_BROWSER_REGISTRY_PATH, (entries) => {
		const next = removeEntry(entries, containerName);
		if (next.length === entries.length) return null;
		return next;
	});
}
//#endregion
//#region src/agents/sandbox/shared.ts
function slugifySessionKey(value) {
	const trimmed = value.trim() || "session";
	const hash = hashTextSha256(trimmed).slice(0, 8);
	return `${trimmed.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "session"}-${hash}`;
}
function resolveSandboxWorkspaceDir(root, sessionKey) {
	const resolvedRoot = resolveUserPath(root);
	const slug = slugifySessionKey(sessionKey);
	return path.join(resolvedRoot, slug);
}
function resolveSandboxScopeKey(scope, sessionKey) {
	const trimmed = sessionKey.trim() || "main";
	if (scope === "shared") return "shared";
	if (scope === "session") return trimmed;
	return `agent:${resolveAgentIdFromSessionKey(trimmed)}`;
}
function resolveSandboxAgentId(scopeKey) {
	const trimmed = scopeKey.trim();
	if (!trimmed || trimmed === "shared") return;
	const parts = trimmed.split(":").filter(Boolean);
	if (parts[0] === "agent" && parts[1]) return normalizeAgentId(parts[1]);
	return resolveAgentIdFromSessionKey(trimmed);
}
//#endregion
//#region src/agents/sandbox/bind-spec.ts
function splitSandboxBindSpec(spec) {
	const separator = getHostContainerSeparatorIndex(spec);
	if (separator === -1) return null;
	const host = spec.slice(0, separator);
	const rest = spec.slice(separator + 1);
	const optionsStart = rest.indexOf(":");
	if (optionsStart === -1) return {
		host,
		container: rest,
		options: ""
	};
	return {
		host,
		container: rest.slice(0, optionsStart),
		options: rest.slice(optionsStart + 1)
	};
}
function getHostContainerSeparatorIndex(spec) {
	const hasDriveLetterPrefix = /^[A-Za-z]:[\\/]/.test(spec);
	for (let i = hasDriveLetterPrefix ? 2 : 0; i < spec.length; i += 1) if (spec[i] === ":") return i;
	return -1;
}
//#endregion
//#region src/agents/sandbox/host-paths.ts
function stripWindowsNamespacePrefix(input) {
	if (input.startsWith("\\\\?\\")) {
		const withoutPrefix = input.slice(4);
		if (withoutPrefix.toUpperCase().startsWith("UNC\\")) return `\\\\${withoutPrefix.slice(4)}`;
		return withoutPrefix;
	}
	if (input.startsWith("//?/")) {
		const withoutPrefix = input.slice(4);
		if (withoutPrefix.toUpperCase().startsWith("UNC/")) return `//${withoutPrefix.slice(4)}`;
		return withoutPrefix;
	}
	return input;
}
/**
* Normalize a POSIX host path: resolve `.`, `..`, collapse `//`, strip trailing `/`.
*/
function normalizeSandboxHostPath(raw) {
	const trimmed = stripWindowsNamespacePrefix(raw.trim());
	if (!trimmed) return "/";
	return posix.normalize(trimmed.replaceAll("\\", "/")).replace(/\/+$/, "") || "/";
}
/**
* Resolve a path through the deepest existing ancestor so parent symlinks are honored
* even when the final source leaf does not exist yet.
*/
function resolveSandboxHostPathViaExistingAncestor(sourcePath) {
	if (!sourcePath.startsWith("/")) return sourcePath;
	return normalizeSandboxHostPath(resolvePathViaExistingAncestorSync(sourcePath));
}
//#endregion
//#region src/agents/sandbox/validate-sandbox-security.ts
/**
* Sandbox security validation — blocks dangerous Docker configurations.
*
* Threat model: local-trusted config, but protect against foot-guns and config injection.
* Enforced at runtime when creating sandbox containers.
*/
const BLOCKED_HOST_PATHS = [
	"/etc",
	"/private/etc",
	"/proc",
	"/sys",
	"/dev",
	"/root",
	"/boot",
	"/run",
	"/var/run",
	"/private/var/run",
	"/var/run/docker.sock",
	"/private/var/run/docker.sock",
	"/run/docker.sock"
];
const BLOCKED_SECCOMP_PROFILES = new Set(["unconfined"]);
const BLOCKED_APPARMOR_PROFILES = new Set(["unconfined"]);
const RESERVED_CONTAINER_TARGET_PATHS = ["/workspace", SANDBOX_AGENT_WORKSPACE_MOUNT];
function parseBindSpec(bind) {
	const trimmed = bind.trim();
	const parsed = splitSandboxBindSpec(trimmed);
	if (!parsed) return {
		source: trimmed,
		target: ""
	};
	return {
		source: parsed.host,
		target: parsed.container
	};
}
/**
* Parse the host/source path from a Docker bind mount string.
* Format: `source:target[:mode]`
*/
function parseBindSourcePath(bind) {
	return parseBindSpec(bind).source.trim();
}
function parseBindTargetPath(bind) {
	return parseBindSpec(bind).target.trim();
}
/**
* Normalize a POSIX path: resolve `.`, `..`, collapse `//`, strip trailing `/`.
*/
function normalizeHostPath(raw) {
	return normalizeSandboxHostPath(raw);
}
/**
* String-only blocked-path check (no filesystem I/O).
* Blocks:
* - binds that target blocked paths (equal or under)
* - binds that cover the system root (mounting "/" is never safe)
* - non-absolute source paths (relative / volume names) because they are hard to validate safely
*/
function getBlockedBindReason(bind) {
	const sourceRaw = parseBindSourcePath(bind);
	if (!sourceRaw.startsWith("/")) return {
		kind: "non_absolute",
		sourcePath: sourceRaw
	};
	return getBlockedReasonForSourcePath(normalizeHostPath(sourceRaw));
}
function getBlockedReasonForSourcePath(sourceNormalized) {
	if (sourceNormalized === "/") return {
		kind: "covers",
		blockedPath: "/"
	};
	for (const blocked of BLOCKED_HOST_PATHS) if (sourceNormalized === blocked || sourceNormalized.startsWith(blocked + "/")) return {
		kind: "targets",
		blockedPath: blocked
	};
	return null;
}
function normalizeAllowedRoots(roots) {
	if (!roots?.length) return [];
	const normalized = roots.map((entry) => entry.trim()).filter((entry) => entry.startsWith("/")).map(normalizeHostPath);
	const expanded = /* @__PURE__ */ new Set();
	for (const root of normalized) {
		expanded.add(root);
		const real = resolveSandboxHostPathViaExistingAncestor(root);
		if (real !== root) expanded.add(real);
	}
	return [...expanded];
}
function isPathInsidePosix(root, target) {
	if (root === "/") return true;
	return target === root || target.startsWith(`${root}/`);
}
function getOutsideAllowedRootsReason(sourceNormalized, allowedRoots) {
	if (allowedRoots.length === 0) return null;
	for (const root of allowedRoots) if (isPathInsidePosix(root, sourceNormalized)) return null;
	return {
		kind: "outside_allowed_roots",
		sourcePath: sourceNormalized,
		allowedRoots
	};
}
function getReservedTargetReason(bind) {
	const targetRaw = parseBindTargetPath(bind);
	if (!targetRaw || !targetRaw.startsWith("/")) return null;
	const target = normalizeHostPath(targetRaw);
	for (const reserved of RESERVED_CONTAINER_TARGET_PATHS) if (isPathInsidePosix(reserved, target)) return {
		kind: "reserved_target",
		targetPath: target,
		reservedPath: reserved
	};
	return null;
}
function enforceSourcePathPolicy(params) {
	const blockedReason = getBlockedReasonForSourcePath(params.sourcePath);
	if (blockedReason) throw formatBindBlockedError({
		bind: params.bind,
		reason: blockedReason
	});
	if (params.allowSourcesOutsideAllowedRoots) return;
	const allowedReason = getOutsideAllowedRootsReason(params.sourcePath, params.allowedRoots);
	if (allowedReason) throw formatBindBlockedError({
		bind: params.bind,
		reason: allowedReason
	});
}
function formatBindBlockedError(params) {
	if (params.reason.kind === "non_absolute") return /* @__PURE__ */ new Error(`Sandbox security: bind mount "${params.bind}" uses a non-absolute source path "${params.reason.sourcePath}". Only absolute POSIX paths are supported for sandbox binds.`);
	if (params.reason.kind === "outside_allowed_roots") return /* @__PURE__ */ new Error(`Sandbox security: bind mount "${params.bind}" source "${params.reason.sourcePath}" is outside allowed roots (${params.reason.allowedRoots.join(", ")}). Use a dangerous override only when you fully trust this runtime.`);
	if (params.reason.kind === "reserved_target") return /* @__PURE__ */ new Error(`Sandbox security: bind mount "${params.bind}" targets reserved container path "${params.reason.reservedPath}" (resolved target: "${params.reason.targetPath}"). This can shadow OpenClaw sandbox mounts. Use a dangerous override only when you fully trust this runtime.`);
	const verb = params.reason.kind === "covers" ? "covers" : "targets";
	return /* @__PURE__ */ new Error(`Sandbox security: bind mount "${params.bind}" ${verb} blocked path "${params.reason.blockedPath}". Mounting system directories (or Docker socket paths) into sandbox containers is not allowed. Use project-specific paths instead (e.g. /home/user/myproject).`);
}
/**
* Validate bind mounts — throws if any source path is dangerous.
* Includes a symlink/realpath pass via existing ancestors so non-existent leaf
* paths cannot bypass source-root and blocked-path checks.
*/
function validateBindMounts(binds, options) {
	if (!binds?.length) return;
	const allowedRoots = normalizeAllowedRoots(options?.allowedSourceRoots);
	for (const rawBind of binds) {
		const bind = rawBind.trim();
		if (!bind) continue;
		const blocked = getBlockedBindReason(bind);
		if (blocked) throw formatBindBlockedError({
			bind,
			reason: blocked
		});
		if (!options?.allowReservedContainerTargets) {
			const reservedTarget = getReservedTargetReason(bind);
			if (reservedTarget) throw formatBindBlockedError({
				bind,
				reason: reservedTarget
			});
		}
		const sourceNormalized = normalizeHostPath(parseBindSourcePath(bind));
		enforceSourcePathPolicy({
			bind,
			sourcePath: sourceNormalized,
			allowedRoots,
			allowSourcesOutsideAllowedRoots: options?.allowSourcesOutsideAllowedRoots === true
		});
		enforceSourcePathPolicy({
			bind,
			sourcePath: resolveSandboxHostPathViaExistingAncestor(sourceNormalized),
			allowedRoots,
			allowSourcesOutsideAllowedRoots: options?.allowSourcesOutsideAllowedRoots === true
		});
	}
}
function validateNetworkMode(network, options) {
	const blockedReason = getBlockedNetworkModeReason({
		network,
		allowContainerNamespaceJoin: options?.allowContainerNamespaceJoin
	});
	if (blockedReason === "host") throw new Error(`Sandbox security: network mode "${network}" is blocked. Network "host" mode bypasses container network isolation. Use "bridge" or "none" instead.`);
	if (blockedReason === "container_namespace_join") throw new Error(`Sandbox security: network mode "${network}" is blocked by default. Network "container:*" joins another container namespace and bypasses sandbox network isolation. Use a custom bridge network, or set dangerouslyAllowContainerNamespaceJoin=true only when you fully trust this runtime.`);
}
function validateSeccompProfile(profile) {
	if (profile && BLOCKED_SECCOMP_PROFILES.has(profile.trim().toLowerCase())) throw new Error(`Sandbox security: seccomp profile "${profile}" is blocked. Disabling seccomp removes syscall filtering and weakens sandbox isolation. Use a custom seccomp profile file or omit this setting.`);
}
function validateApparmorProfile(profile) {
	if (profile && BLOCKED_APPARMOR_PROFILES.has(profile.trim().toLowerCase())) throw new Error(`Sandbox security: apparmor profile "${profile}" is blocked. Disabling AppArmor removes mandatory access controls and weakens sandbox isolation. Use a named AppArmor profile or omit this setting.`);
}
function validateSandboxSecurity(cfg) {
	validateBindMounts(cfg.binds, cfg);
	validateNetworkMode(cfg.network, { allowContainerNamespaceJoin: cfg.dangerouslyAllowContainerNamespaceJoin === true });
	validateSeccompProfile(cfg.seccompProfile);
	validateApparmorProfile(cfg.apparmorProfile);
}
//#endregion
//#region src/agents/sandbox/workspace-mounts.ts
function mainWorkspaceMountSuffix(access) {
	return access === "rw" ? "" : ":ro";
}
function agentWorkspaceMountSuffix(access) {
	return access === "ro" ? ":ro" : "";
}
function appendWorkspaceMountArgs(params) {
	const { args, workspaceDir, agentWorkspaceDir, workdir, workspaceAccess } = params;
	args.push("-v", `${workspaceDir}:${workdir}${mainWorkspaceMountSuffix(workspaceAccess)}`);
	if (workspaceAccess !== "none" && workspaceDir !== agentWorkspaceDir) args.push("-v", `${agentWorkspaceDir}:${SANDBOX_AGENT_WORKSPACE_MOUNT}${agentWorkspaceMountSuffix(workspaceAccess)}`);
}
//#endregion
//#region src/agents/sandbox/docker.ts
function createAbortError() {
	const err = /* @__PURE__ */ new Error("Aborted");
	err.name = "AbortError";
	return err;
}
const DEFAULT_DOCKER_SPAWN_RUNTIME = {
	platform: process.platform,
	env: process.env,
	execPath: process.execPath
};
function resolveDockerSpawnInvocation(args, runtime = DEFAULT_DOCKER_SPAWN_RUNTIME) {
	const resolved = materializeWindowsSpawnProgram(resolveWindowsSpawnProgram({
		command: "docker",
		platform: runtime.platform,
		env: runtime.env,
		execPath: runtime.execPath,
		packageName: "docker",
		allowShellFallback: false
	}), args);
	return {
		command: resolved.command,
		args: resolved.argv,
		shell: resolved.shell,
		windowsHide: resolved.windowsHide
	};
}
function execDockerRaw(args, opts) {
	return new Promise((resolve, reject) => {
		const spawnInvocation = resolveDockerSpawnInvocation(args);
		const child = spawn(spawnInvocation.command, spawnInvocation.args, {
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			shell: spawnInvocation.shell,
			windowsHide: spawnInvocation.windowsHide
		});
		const stdoutChunks = [];
		const stderrChunks = [];
		let aborted = false;
		const signal = opts?.signal;
		const handleAbort = () => {
			if (aborted) return;
			aborted = true;
			child.kill("SIGTERM");
		};
		if (signal) if (signal.aborted) handleAbort();
		else signal.addEventListener("abort", handleAbort);
		child.stdout?.on("data", (chunk) => {
			stdoutChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		});
		child.stderr?.on("data", (chunk) => {
			stderrChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		});
		child.on("error", (error) => {
			if (signal) signal.removeEventListener("abort", handleAbort);
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
				reject(Object.assign(/* @__PURE__ */ new Error("Sandbox mode requires Docker, but the \"docker\" command was not found in PATH. Install Docker (and ensure \"docker\" is available), or set `agents.defaults.sandbox.mode=off` to disable sandboxing."), {
					code: "INVALID_CONFIG",
					cause: error
				}));
				return;
			}
			reject(error);
		});
		child.on("close", (code) => {
			if (signal) signal.removeEventListener("abort", handleAbort);
			const stdout = Buffer.concat(stdoutChunks);
			const stderr = Buffer.concat(stderrChunks);
			if (aborted || signal?.aborted) {
				reject(createAbortError());
				return;
			}
			const exitCode = code ?? 0;
			if (exitCode !== 0 && !opts?.allowFailure) {
				const message = stderr.length > 0 ? stderr.toString("utf8").trim() : "";
				reject(Object.assign(new Error(message || `docker ${args.join(" ")} failed`), {
					code: exitCode,
					stdout,
					stderr
				}));
				return;
			}
			resolve({
				stdout,
				stderr,
				code: exitCode
			});
		});
		const stdin = child.stdin;
		if (stdin) if (opts?.input !== void 0) stdin.end(opts.input);
		else stdin.end();
	});
}
const log = createSubsystemLogger("docker");
const HOT_CONTAINER_WINDOW_MS = 300 * 1e3;
async function execDocker(args, opts) {
	const result = await execDockerRaw(args, opts);
	return {
		stdout: result.stdout.toString("utf8"),
		stderr: result.stderr.toString("utf8"),
		code: result.code
	};
}
async function readDockerContainerLabel(containerName, label) {
	const result = await execDocker([
		"inspect",
		"-f",
		`{{ index .Config.Labels "${label}" }}`,
		containerName
	], { allowFailure: true });
	if (result.code !== 0) return null;
	const raw = result.stdout.trim();
	if (!raw || raw === "<no value>") return null;
	return raw;
}
async function readDockerContainerEnvVar(containerName, envVar) {
	const result = await execDocker([
		"inspect",
		"-f",
		"{{range .Config.Env}}{{println .}}{{end}}",
		containerName
	], { allowFailure: true });
	if (result.code !== 0) return null;
	for (const line of result.stdout.split(/\r?\n/)) if (line.startsWith(`${envVar}=`)) return line.slice(envVar.length + 1);
	return null;
}
async function readDockerPort(containerName, port) {
	const result = await execDocker([
		"port",
		containerName,
		`${port}/tcp`
	], { allowFailure: true });
	if (result.code !== 0) return null;
	const match = (result.stdout.trim().split(/\r?\n/)[0] ?? "").match(/:(\d+)\s*$/);
	if (!match) return null;
	const mapped = Number.parseInt(match[1] ?? "", 10);
	return Number.isFinite(mapped) ? mapped : null;
}
async function dockerImageExists(image) {
	const result = await execDocker([
		"image",
		"inspect",
		image
	], { allowFailure: true });
	if (result.code === 0) return true;
	const stderr = result.stderr.trim();
	if (stderr.includes("No such image")) return false;
	throw new Error(`Failed to inspect sandbox image: ${stderr}`);
}
async function ensureDockerImage(image) {
	if (await dockerImageExists(image)) return;
	if (image === "openclaw-sandbox:bookworm-slim") {
		await execDocker(["pull", "debian:bookworm-slim"]);
		await execDocker([
			"tag",
			"debian:bookworm-slim",
			DEFAULT_SANDBOX_IMAGE
		]);
		return;
	}
	throw new Error(`Sandbox image not found: ${image}. Build or pull it first.`);
}
async function dockerContainerState(name) {
	const result = await execDocker([
		"inspect",
		"-f",
		"{{.State.Running}}",
		name
	], { allowFailure: true });
	if (result.code !== 0) return {
		exists: false,
		running: false
	};
	return {
		exists: true,
		running: result.stdout.trim() === "true"
	};
}
function normalizeDockerLimit(value) {
	if (value === void 0 || value === null) return;
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : void 0;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function formatUlimitValue(name, value) {
	if (!name.trim()) return null;
	if (typeof value === "number" || typeof value === "string") {
		const raw = String(value).trim();
		return raw ? `${name}=${raw}` : null;
	}
	const soft = typeof value.soft === "number" ? Math.max(0, value.soft) : void 0;
	const hard = typeof value.hard === "number" ? Math.max(0, value.hard) : void 0;
	if (soft === void 0 && hard === void 0) return null;
	if (soft === void 0) return `${name}=${hard}`;
	if (hard === void 0) return `${name}=${soft}`;
	return `${name}=${soft}:${hard}`;
}
function buildSandboxCreateArgs(params) {
	validateSandboxSecurity({
		...params.cfg,
		allowedSourceRoots: params.bindSourceRoots,
		allowSourcesOutsideAllowedRoots: params.allowSourcesOutsideAllowedRoots ?? params.cfg.dangerouslyAllowExternalBindSources === true,
		allowReservedContainerTargets: params.allowReservedContainerTargets ?? params.cfg.dangerouslyAllowReservedContainerTargets === true,
		dangerouslyAllowContainerNamespaceJoin: params.allowContainerNamespaceJoin ?? params.cfg.dangerouslyAllowContainerNamespaceJoin === true
	});
	const createdAtMs = params.createdAtMs ?? Date.now();
	const args = [
		"create",
		"--name",
		params.name
	];
	args.push("--label", "openclaw.sandbox=1");
	args.push("--label", `openclaw.sessionKey=${params.scopeKey}`);
	args.push("--label", `openclaw.createdAtMs=${createdAtMs}`);
	if (params.configHash) args.push("--label", `openclaw.configHash=${params.configHash}`);
	for (const [key, value] of Object.entries(params.labels ?? {})) if (key && value) args.push("--label", `${key}=${value}`);
	if (params.cfg.readOnlyRoot) args.push("--read-only");
	for (const entry of params.cfg.tmpfs) args.push("--tmpfs", entry);
	if (params.cfg.network) args.push("--network", params.cfg.network);
	if (params.cfg.user) args.push("--user", params.cfg.user);
	const envSanitization = sanitizeEnvVars(params.cfg.env ?? {}, params.envSanitizationOptions);
	if (envSanitization.blocked.length > 0) log.warn(`Blocked sensitive environment variables: ${envSanitization.blocked.join(", ")}`);
	if (envSanitization.warnings.length > 0) log.warn(`Suspicious environment variables: ${envSanitization.warnings.join(", ")}`);
	for (const [key, value] of Object.entries(markOpenClawExecEnv(envSanitization.allowed))) args.push("--env", `${key}=${value}`);
	for (const cap of params.cfg.capDrop) args.push("--cap-drop", cap);
	args.push("--security-opt", "no-new-privileges");
	if (params.cfg.seccompProfile) args.push("--security-opt", `seccomp=${params.cfg.seccompProfile}`);
	if (params.cfg.apparmorProfile) args.push("--security-opt", `apparmor=${params.cfg.apparmorProfile}`);
	for (const entry of params.cfg.dns ?? []) if (entry.trim()) args.push("--dns", entry);
	for (const entry of params.cfg.extraHosts ?? []) if (entry.trim()) args.push("--add-host", entry);
	if (typeof params.cfg.pidsLimit === "number" && params.cfg.pidsLimit > 0) args.push("--pids-limit", String(params.cfg.pidsLimit));
	const memory = normalizeDockerLimit(params.cfg.memory);
	if (memory) args.push("--memory", memory);
	const memorySwap = normalizeDockerLimit(params.cfg.memorySwap);
	if (memorySwap) args.push("--memory-swap", memorySwap);
	if (typeof params.cfg.cpus === "number" && params.cfg.cpus > 0) args.push("--cpus", String(params.cfg.cpus));
	for (const [name, value] of Object.entries(params.cfg.ulimits ?? {})) {
		const formatted = formatUlimitValue(name, value);
		if (formatted) args.push("--ulimit", formatted);
	}
	if (params.includeBinds !== false && params.cfg.binds?.length) for (const bind of params.cfg.binds) args.push("-v", bind);
	return args;
}
function appendCustomBinds(args, cfg) {
	if (!cfg.binds?.length) return;
	for (const bind of cfg.binds) args.push("-v", bind);
}
async function createSandboxContainer(params) {
	const { name, cfg, workspaceDir, scopeKey } = params;
	await ensureDockerImage(cfg.image);
	const args = buildSandboxCreateArgs({
		name,
		cfg,
		scopeKey,
		configHash: params.configHash,
		includeBinds: false,
		bindSourceRoots: [workspaceDir, params.agentWorkspaceDir]
	});
	args.push("--workdir", cfg.workdir);
	appendWorkspaceMountArgs({
		args,
		workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		workdir: cfg.workdir,
		workspaceAccess: params.workspaceAccess
	});
	appendCustomBinds(args, cfg);
	args.push(cfg.image, "sleep", "infinity");
	await execDocker(args);
	await execDocker(["start", name]);
	if (cfg.setupCommand?.trim()) await execDocker([
		"exec",
		"-i",
		name,
		"/bin/sh",
		"-lc",
		cfg.setupCommand
	]);
}
async function readContainerConfigHash(containerName) {
	return await readDockerContainerLabel(containerName, "openclaw.configHash");
}
function formatSandboxRecreateHint(params) {
	if (params.scope === "session") return formatCliCommand(`openclaw sandbox recreate --session ${params.sessionKey}`);
	if (params.scope === "agent") return formatCliCommand(`openclaw sandbox recreate --agent ${resolveSandboxAgentId(params.sessionKey) ?? "main"}`);
	return formatCliCommand("openclaw sandbox recreate --all");
}
async function ensureSandboxContainer(params) {
	const scopeKey = resolveSandboxScopeKey(params.cfg.scope, params.sessionKey);
	const slug = params.cfg.scope === "shared" ? "shared" : slugifySessionKey(scopeKey);
	const containerName = `${params.cfg.docker.containerPrefix}${slug}`.slice(0, 63);
	const expectedHash = computeSandboxConfigHash({
		docker: params.cfg.docker,
		workspaceAccess: params.cfg.workspaceAccess,
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir
	});
	const now = Date.now();
	const state = await dockerContainerState(containerName);
	let hasContainer = state.exists;
	let running = state.running;
	let currentHash = null;
	let hashMismatch = false;
	let registryEntry;
	if (hasContainer) {
		registryEntry = (await readRegistry()).entries.find((entry) => entry.containerName === containerName);
		currentHash = await readContainerConfigHash(containerName);
		if (!currentHash) currentHash = registryEntry?.configHash ?? null;
		hashMismatch = !currentHash || currentHash !== expectedHash;
		if (hashMismatch) {
			const lastUsedAtMs = registryEntry?.lastUsedAtMs;
			if (running && (typeof lastUsedAtMs !== "number" || now - lastUsedAtMs < HOT_CONTAINER_WINDOW_MS)) {
				const hint = formatSandboxRecreateHint({
					scope: params.cfg.scope,
					sessionKey: scopeKey
				});
				defaultRuntime.log(`Sandbox config changed for ${containerName} (recently used). Recreate to apply: ${hint}`);
			} else {
				await execDocker([
					"rm",
					"-f",
					containerName
				], { allowFailure: true });
				hasContainer = false;
				running = false;
			}
		}
	}
	if (!hasContainer) await createSandboxContainer({
		name: containerName,
		cfg: params.cfg.docker,
		workspaceDir: params.workspaceDir,
		workspaceAccess: params.cfg.workspaceAccess,
		agentWorkspaceDir: params.agentWorkspaceDir,
		scopeKey,
		configHash: expectedHash
	});
	else if (!running) await execDocker(["start", containerName]);
	await updateRegistry({
		containerName,
		backendId: "docker",
		runtimeLabel: containerName,
		sessionKey: scopeKey,
		createdAtMs: now,
		lastUsedAtMs: now,
		image: params.cfg.docker.image,
		configLabelKind: "Image",
		configHash: hashMismatch && running ? currentHash ?? void 0 : expectedHash
	});
	return containerName;
}
//#endregion
export { drainSessionWriteLockStateForTest as A, updateRegistry as C, validateEnvVarValue as D, sanitizeEnvVars as E, readConfigIncludeFileWithGuards as F, resolveConfigIncludes as I, CircularIncludeError as M, ConfigIncludeError as N, acquireSessionWriteLock as O, INCLUDE_KEY as P, updateBrowserRegistry as S, listAgentWorkspaceDirs as T, slugifySessionKey as _, execDockerRaw as a, removeBrowserRegistryEntry as b, readDockerPort as c, validateNetworkMode as d, resolveSandboxHostPathViaExistingAncestor as f, resolveSandboxWorkspaceDir as g, resolveSandboxScopeKey as h, execDocker as i, resolveSessionLockMaxHoldFromTimeout as j, cleanStaleLockFiles as k, appendWorkspaceMountArgs as l, resolveSandboxAgentId as m, dockerContainerState as n, readDockerContainerEnvVar as o, splitSandboxBindSpec as p, ensureSandboxContainer as r, readDockerContainerLabel as s, buildSandboxCreateArgs as t, getBlockedBindReason as u, readBrowserRegistry as v, computeSandboxBrowserConfigHash as w, removeRegistryEntry as x, readRegistry as y };
