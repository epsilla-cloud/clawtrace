import { S as sleep, b as shortenHomeInString, t as CONFIG_DIR, x as shortenHomePath } from "./utils-BfvDpbwh.js";
import { KO as callGateway } from "./auth-profiles-B5ypC5S-.js";
import { n as resolveAgentModelPrimaryValue } from "./model-input-C3klK9XF.js";
import { t as CONFIG_PATH } from "./paths-Y4UT24Of.js";
import { n as runCommandWithTimeout } from "./exec-CLVZ7JOg.js";
import { d as ensureAgentWorkspace, n as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-CFIQ0-q3.js";
import { n as VERSION } from "./version-CIMrqUx3.js";
import { _ as GATEWAY_CLIENT_NAMES, g as GATEWAY_CLIENT_MODES } from "./message-channel-BaBrchOc.js";
import { c as resolveSessionTranscriptsDirForAgent } from "./paths-CFxPq48L.js";
import "./setup-binary-KLZwkyo2.js";
import { d as resolveGatewayBindHost, h as pickPrimaryTailnetIPv4, l as pickPrimaryLanIPv4, s as isValidIPv4 } from "./net-BJZF7zzH.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-CHwygUj4.js";
import "./browser-open-C4i2gCRs.js";
import { r as stylePromptTitle } from "./prompt-style-Dfej3yGR.js";
import path from "node:path";
import { inspect } from "node:util";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { cancel, isCancel } from "@clack/prompts";
//#region src/infra/network-discovery-display.ts
function summarizeDisplayNetworkError(error) {
	if (error instanceof Error) {
		const message = error.message.trim();
		if (message) return message;
	}
	return "network interface discovery failed";
}
function fallbackBindHostForDisplay(bindMode, customBindHost) {
	if (bindMode === "lan") return "0.0.0.0";
	if (bindMode === "custom") return customBindHost?.trim() || "0.0.0.0";
	return "127.0.0.1";
}
function pickBestEffortPrimaryLanIPv4() {
	try {
		return pickPrimaryLanIPv4();
	} catch {
		return;
	}
}
function inspectBestEffortPrimaryTailnetIPv4(params) {
	try {
		return { tailnetIPv4: pickPrimaryTailnetIPv4() };
	} catch (error) {
		const prefix = params?.warningPrefix?.trim();
		const warning = prefix ? `${prefix}: ${summarizeDisplayNetworkError(error)}.` : void 0;
		return {
			tailnetIPv4: void 0,
			...warning ? { warning } : {}
		};
	}
}
async function resolveBestEffortGatewayBindHostForDisplay(params) {
	try {
		return { bindHost: await resolveGatewayBindHost(params.bindMode, params.customBindHost) };
	} catch (error) {
		const prefix = params.warningPrefix?.trim();
		const warning = prefix ? `${prefix}: ${summarizeDisplayNetworkError(error)}.` : void 0;
		return {
			bindHost: fallbackBindHostForDisplay(params.bindMode, params.customBindHost),
			...warning ? { warning } : {}
		};
	}
}
//#endregion
//#region src/commands/onboard-helpers.ts
function guardCancel(value, runtime) {
	if (isCancel(value)) {
		cancel(stylePromptTitle("Setup cancelled.") ?? "Setup cancelled.");
		runtime.exit(0);
		throw new Error("unreachable");
	}
	return value;
}
function summarizeExistingConfig(config) {
	const rows = [];
	const defaults = config.agents?.defaults;
	if (defaults?.workspace) rows.push(shortenHomeInString(`workspace: ${defaults.workspace}`));
	if (defaults?.model) {
		const model = resolveAgentModelPrimaryValue(defaults.model);
		if (model) rows.push(shortenHomeInString(`model: ${model}`));
	}
	if (config.gateway?.mode) rows.push(shortenHomeInString(`gateway.mode: ${config.gateway.mode}`));
	if (typeof config.gateway?.port === "number") rows.push(shortenHomeInString(`gateway.port: ${config.gateway.port}`));
	if (config.gateway?.bind) rows.push(shortenHomeInString(`gateway.bind: ${config.gateway.bind}`));
	if (config.gateway?.remote?.url) rows.push(shortenHomeInString(`gateway.remote.url: ${config.gateway.remote.url}`));
	if (config.skills?.install?.nodeManager) rows.push(shortenHomeInString(`skills.nodeManager: ${config.skills.install.nodeManager}`));
	return rows.length ? rows.join("\n") : "No key settings detected.";
}
function randomToken() {
	return crypto.randomBytes(24).toString("hex");
}
function normalizeGatewayTokenInput(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	if (trimmed === "undefined" || trimmed === "null") return "";
	return trimmed;
}
function validateGatewayPasswordInput(value) {
	if (typeof value !== "string") return "Required";
	const trimmed = value.trim();
	if (!trimmed) return "Required";
	if (trimmed === "undefined" || trimmed === "null") return "Cannot be the literal string \"undefined\" or \"null\"";
}
function printWizardHeader(runtime) {
	const header = [
		"▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄",
		"██░▄▄▄░██░▄▄░██░▄▄▄██░▀██░██░▄▄▀██░████░▄▄▀██░███░██",
		"██░███░██░▀▀░██░▄▄▄██░█░█░██░█████░████░▀▀░██░█░█░██",
		"██░▀▀▀░██░█████░▀▀▀██░██▄░██░▀▀▄██░▀▀░█░██░██▄▀▄▀▄██",
		"▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀",
		"                  🦞 OPENCLAW 🦞                    ",
		" "
	].join("\n");
	runtime.log(header);
}
function applyWizardMetadata(cfg, params) {
	const commit = process.env.GIT_COMMIT?.trim() || process.env.GIT_SHA?.trim() || void 0;
	return {
		...cfg,
		wizard: {
			...cfg.wizard,
			lastRunAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastRunVersion: VERSION,
			lastRunCommit: commit,
			lastRunCommand: params.command,
			lastRunMode: params.mode
		}
	};
}
function formatControlUiSshHint(params) {
	const basePath = normalizeControlUiBasePath(params.basePath);
	const uiPath = basePath ? `${basePath}/` : "/";
	const localUrl = `http://localhost:${params.port}${uiPath}`;
	const authedUrl = params.token ? `${localUrl}#token=${encodeURIComponent(params.token)}` : void 0;
	const sshTarget = resolveSshTargetHint();
	return [
		"No GUI detected. Open from your computer:",
		`ssh -N -L ${params.port}:127.0.0.1:${params.port} ${sshTarget}`,
		"Then open:",
		localUrl,
		authedUrl,
		"Docs:",
		"https://docs.openclaw.ai/gateway/remote",
		"https://docs.openclaw.ai/web/control-ui"
	].filter(Boolean).join("\n");
}
function resolveSshTargetHint() {
	return `${process.env.USER || process.env.LOGNAME || "user"}@${(process.env.SSH_CONNECTION?.trim().split(/\s+/))?.[2] ?? "<host>"}`;
}
async function ensureWorkspaceAndSessions(workspaceDir, runtime, options) {
	const ws = await ensureAgentWorkspace({
		dir: workspaceDir,
		ensureBootstrapFiles: !options?.skipBootstrap
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDirForAgent(options?.agentId);
	await fs.mkdir(sessionsDir, { recursive: true });
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
}
function resolveNodeManagerOptions() {
	return [
		{
			value: "npm",
			label: "npm"
		},
		{
			value: "pnpm",
			label: "pnpm"
		},
		{
			value: "bun",
			label: "bun"
		}
	];
}
async function moveToTrash(pathname, runtime) {
	if (!pathname) return;
	try {
		await fs.access(pathname);
	} catch {
		return;
	}
	try {
		await runCommandWithTimeout(["trash", pathname], { timeoutMs: 5e3 });
		runtime.log(`Moved to Trash: ${shortenHomePath(pathname)}`);
	} catch {
		runtime.log(`Failed to move to Trash (manual delete): ${shortenHomePath(pathname)}`);
	}
}
async function handleReset(scope, workspaceDir, runtime) {
	await moveToTrash(CONFIG_PATH, runtime);
	if (scope === "config") return;
	await moveToTrash(path.join(CONFIG_DIR, "credentials"), runtime);
	await moveToTrash(resolveSessionTranscriptsDirForAgent(), runtime);
	if (scope === "full") await moveToTrash(workspaceDir, runtime);
}
async function probeGatewayReachable(params) {
	const url = params.url.trim();
	const timeoutMs = params.timeoutMs ?? 1500;
	try {
		await callGateway({
			url,
			token: params.token,
			password: params.password,
			method: "health",
			timeoutMs,
			clientName: GATEWAY_CLIENT_NAMES.PROBE,
			mode: GATEWAY_CLIENT_MODES.PROBE
		});
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			detail: summarizeError(err)
		};
	}
}
async function waitForGatewayReachable(params) {
	const deadlineMs = params.deadlineMs ?? 15e3;
	const pollMs = params.pollMs ?? 400;
	const probeTimeoutMs = params.probeTimeoutMs ?? 1500;
	const startedAt = Date.now();
	let lastDetail;
	while (Date.now() - startedAt < deadlineMs) {
		const probe = await probeGatewayReachable({
			url: params.url,
			token: params.token,
			password: params.password,
			timeoutMs: probeTimeoutMs
		});
		if (probe.ok) return probe;
		lastDetail = probe.detail;
		await sleep(pollMs);
	}
	return {
		ok: false,
		detail: lastDetail
	};
}
function summarizeError(err) {
	let raw = "unknown error";
	if (err instanceof Error) raw = err.message || raw;
	else if (typeof err === "string") raw = err || raw;
	else if (err !== void 0) raw = inspect(err, { depth: 2 });
	const line = raw.split("\n").map((s) => s.trim()).find(Boolean) ?? raw;
	return line.length > 120 ? `${line.slice(0, 119)}…` : line;
}
const DEFAULT_WORKSPACE = DEFAULT_AGENT_WORKSPACE_DIR;
function resolveControlUiLinks(params) {
	const port = params.port;
	const bind = params.bind ?? "loopback";
	const customBindHost = params.customBindHost?.trim();
	const { tailnetIPv4 } = inspectBestEffortPrimaryTailnetIPv4();
	const host = (() => {
		if (bind === "custom" && customBindHost && isValidIPv4(customBindHost)) return customBindHost;
		if (bind === "tailnet" && tailnetIPv4) return tailnetIPv4 ?? "127.0.0.1";
		if (bind === "lan") return pickBestEffortPrimaryLanIPv4() ?? "127.0.0.1";
		return "127.0.0.1";
	})();
	const basePath = normalizeControlUiBasePath(params.basePath);
	const uiPath = basePath ? `${basePath}/` : "/";
	const wsPath = basePath ? basePath : "";
	return {
		httpUrl: `http://${host}:${port}${uiPath}`,
		wsUrl: `ws://${host}:${port}${wsPath}`
	};
}
//#endregion
export { inspectBestEffortPrimaryTailnetIPv4 as _, guardCancel as a, normalizeGatewayTokenInput as c, randomToken as d, resolveControlUiLinks as f, waitForGatewayReachable as g, validateGatewayPasswordInput as h, formatControlUiSshHint as i, printWizardHeader as l, summarizeExistingConfig as m, applyWizardMetadata as n, handleReset as o, resolveNodeManagerOptions as p, ensureWorkspaceAndSessions as r, moveToTrash as s, DEFAULT_WORKSPACE as t, probeGatewayReachable as u, pickBestEffortPrimaryLanIPv4 as v, resolveBestEffortGatewayBindHostForDisplay as y };
