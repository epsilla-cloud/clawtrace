#!/usr/bin/env node
import { t as isMainModule } from "./is-main-Bv5ej4lF.js";
import { N as isRootHelpInvocation, P as isRootVersionInvocation, j as hasHelpOrVersion } from "./logger-BCzP_yik.js";
import { a as parseCliContainerArgs, n as applyCliProfileEnv, o as resolveCliContainerTarget, r as parseCliProfileArgs, t as normalizeWindowsArgv } from "./windows-argv-Du_SFYfh.js";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-CVMjxAUF.js";
import { r as normalizeEnv, t as isTruthyEnvValue } from "./env-CjUKd1aw.js";
import { t as ensureOpenClawExecMarkerOnProcess } from "./openclaw-exec-env-D-qcr6HX.js";
import { t as installProcessWarningFilter } from "./warning-filter-8uCsDS6w.js";
import { enableCompileCache } from "node:module";
import process$1 from "node:process";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
//#region src/cli/respawn-policy.ts
function shouldSkipRespawnForArgv(argv) {
	return hasHelpOrVersion(argv);
}
//#endregion
//#region src/entry.respawn.ts
const EXPERIMENTAL_WARNING_FLAG = "--disable-warning=ExperimentalWarning";
const OPENCLAW_NODE_OPTIONS_READY = "OPENCLAW_NODE_OPTIONS_READY";
const OPENCLAW_NODE_EXTRA_CA_CERTS_READY = "OPENCLAW_NODE_EXTRA_CA_CERTS_READY";
function hasExperimentalWarningSuppressed(params = {}) {
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const nodeOptions = env.NODE_OPTIONS ?? "";
	if (nodeOptions.includes("--disable-warning=ExperimentalWarning") || nodeOptions.includes("--no-warnings")) return true;
	return execArgv.some((arg) => arg === "--disable-warning=ExperimentalWarning" || arg === "--no-warnings");
}
function buildCliRespawnPlan(params = {}) {
	const argv = params.argv ?? process.argv;
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const execPath = params.execPath ?? process.execPath;
	if (shouldSkipRespawnForArgv(argv) || isTruthyEnvValue(env.OPENCLAW_NO_RESPAWN)) return null;
	const childEnv = { ...env };
	const childExecArgv = [...execArgv];
	let needsRespawn = false;
	const autoNodeExtraCaCerts = params.autoNodeExtraCaCerts ?? resolveNodeStartupTlsEnvironment({
		env,
		execPath,
		includeDarwinDefaults: false
	}).NODE_EXTRA_CA_CERTS;
	if (autoNodeExtraCaCerts && !isTruthyEnvValue(env["OPENCLAW_NODE_EXTRA_CA_CERTS_READY"]) && !env.NODE_EXTRA_CA_CERTS) {
		childEnv.NODE_EXTRA_CA_CERTS = autoNodeExtraCaCerts;
		childEnv[OPENCLAW_NODE_EXTRA_CA_CERTS_READY] = "1";
		needsRespawn = true;
	}
	if (!isTruthyEnvValue(env["OPENCLAW_NODE_OPTIONS_READY"]) && !hasExperimentalWarningSuppressed({
		env,
		execArgv
	})) {
		childEnv[OPENCLAW_NODE_OPTIONS_READY] = "1";
		childExecArgv.unshift(EXPERIMENTAL_WARNING_FLAG);
		needsRespawn = true;
	}
	if (!needsRespawn) return null;
	return {
		argv: [...childExecArgv, ...argv.slice(1)],
		env: childEnv
	};
}
//#endregion
//#region src/process/child-process-bridge.ts
const defaultSignals = process$1.platform === "win32" ? [
	"SIGTERM",
	"SIGINT",
	"SIGBREAK"
] : [
	"SIGTERM",
	"SIGINT",
	"SIGHUP",
	"SIGQUIT"
];
function attachChildProcessBridge(child, { signals = defaultSignals, onSignal } = {}) {
	const listeners = /* @__PURE__ */ new Map();
	for (const signal of signals) {
		const listener = () => {
			onSignal?.(signal);
			try {
				child.kill(signal);
			} catch {}
		};
		try {
			process$1.on(signal, listener);
			listeners.set(signal, listener);
		} catch {}
	}
	const detach = () => {
		for (const [signal, listener] of listeners) process$1.off(signal, listener);
		listeners.clear();
	};
	child.once("exit", detach);
	child.once("error", detach);
	return { detach };
}
//#endregion
//#region src/entry.ts
const ENTRY_WRAPPER_PAIRS = [{
	wrapperBasename: "openclaw.mjs",
	entryBasename: "entry.js"
}, {
	wrapperBasename: "openclaw.js",
	entryBasename: "entry.js"
}];
function shouldForceReadOnlyAuthStore(argv) {
	const tokens = argv.slice(2).filter((token) => token.length > 0 && !token.startsWith("-"));
	for (let index = 0; index < tokens.length - 1; index += 1) if (tokens[index] === "secrets" && tokens[index + 1] === "audit") return true;
	return false;
}
if (!isMainModule({
	currentFile: fileURLToPath(import.meta.url),
	wrapperEntryPairs: [...ENTRY_WRAPPER_PAIRS]
})) {} else {
	const { installGaxiosFetchCompat } = await import("./gaxios-fetch-compat-D1iOwLGq.js");
	await installGaxiosFetchCompat();
	process$1.title = "openclaw";
	ensureOpenClawExecMarkerOnProcess();
	installProcessWarningFilter();
	normalizeEnv();
	if (!isTruthyEnvValue(process$1.env.NODE_DISABLE_COMPILE_CACHE)) try {
		enableCompileCache();
	} catch {}
	if (shouldForceReadOnlyAuthStore(process$1.argv)) process$1.env.OPENCLAW_AUTH_STORE_READONLY = "1";
	if (process$1.argv.includes("--no-color")) {
		process$1.env.NO_COLOR = "1";
		process$1.env.FORCE_COLOR = "0";
	}
	function ensureCliRespawnReady() {
		const plan = buildCliRespawnPlan();
		if (!plan) return false;
		const child = spawn(process$1.execPath, plan.argv, {
			stdio: "inherit",
			env: plan.env
		});
		attachChildProcessBridge(child);
		child.once("exit", (code, signal) => {
			if (signal) {
				process$1.exitCode = 1;
				return;
			}
			process$1.exit(code ?? 1);
		});
		child.once("error", (error) => {
			console.error("[openclaw] Failed to respawn CLI:", error instanceof Error ? error.stack ?? error.message : error);
			process$1.exit(1);
		});
		return true;
	}
	function tryHandleRootVersionFastPath(argv) {
		if (resolveCliContainerTarget(argv)) return false;
		if (!isRootVersionInvocation(argv)) return false;
		Promise.all([import("./version-DO2qsQ8F.js"), import("./git-commit-pVLWtl3T.js")]).then(([{ VERSION }, { resolveCommitHash }]) => {
			const commit = resolveCommitHash({ moduleUrl: import.meta.url });
			console.log(commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`);
			process$1.exit(0);
		}).catch((error) => {
			console.error("[openclaw] Failed to resolve version:", error instanceof Error ? error.stack ?? error.message : error);
			process$1.exitCode = 1;
		});
		return true;
	}
	process$1.argv = normalizeWindowsArgv(process$1.argv);
	if (!ensureCliRespawnReady()) {
		const parsedContainer = parseCliContainerArgs(process$1.argv);
		if (!parsedContainer.ok) {
			console.error(`[openclaw] ${parsedContainer.error}`);
			process$1.exit(2);
		}
		const parsed = parseCliProfileArgs(parsedContainer.argv);
		if (!parsed.ok) {
			console.error(`[openclaw] ${parsed.error}`);
			process$1.exit(2);
		}
		if (resolveCliContainerTarget(process$1.argv) && parsed.profile) {
			console.error("[openclaw] --container cannot be combined with --profile/--dev");
			process$1.exit(2);
		}
		if (parsed.profile) {
			applyCliProfileEnv({ profile: parsed.profile });
			process$1.argv = parsed.argv;
		}
		if (!tryHandleRootVersionFastPath(process$1.argv)) runMainOrRootHelp(process$1.argv);
	}
}
function tryHandleRootHelpFastPath(argv, deps = {}) {
	if (resolveCliContainerTarget(argv, deps.env)) return false;
	if (!isRootHelpInvocation(argv)) return false;
	const handleError = deps.onError ?? ((error) => {
		console.error("[openclaw] Failed to display help:", error instanceof Error ? error.stack ?? error.message : error);
		process$1.exitCode = 1;
	});
	if (deps.outputRootHelp) {
		try {
			deps.outputRootHelp();
		} catch (error) {
			handleError(error);
		}
		return true;
	}
	import("./root-help-BlDiiOsm.js").then(({ outputRootHelp }) => {
		outputRootHelp();
	}).catch(handleError);
	return true;
}
function runMainOrRootHelp(argv) {
	if (tryHandleRootHelpFastPath(argv)) return;
	import("./run-main-WhPPYnun.js").then(({ runCli }) => runCli(argv)).catch((error) => {
		console.error("[openclaw] Failed to start CLI:", error instanceof Error ? error.stack ?? error.message : error);
		process$1.exitCode = 1;
	});
}
//#endregion
export { tryHandleRootHelpFastPath };
