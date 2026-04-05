import { h as readBestEffortConfig, ww as resolveCommandSecretRefsViaGateway } from "./auth-profiles-B5ypC5S-.js";
import { o as resolveConfigPath } from "./paths-Y4UT24Of.js";
import { r as runExec } from "./exec-CLVZ7JOg.js";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-D7Gi17j0.js";
import { n as hasPotentialConfiguredChannels } from "./config-presence-WO62X0wj.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C7gfehPk.js";
import { s as getStatusCommandSecretTargetIds } from "./command-secret-targets-DayQlnoD.js";
import { n as withProgress } from "./progress-BWNzIjJW.js";
import { n as buildPluginCompatibilityNotices } from "./status-B5b8fy8e.js";
import { t as pickGatewaySelfPresence } from "./gateway-presence-DhAA8_2B.js";
import { t as resolveOsSummary } from "./os-summary-Bux4XXY-.js";
import { a as resolveMemoryPluginStatus, i as resolveGatewayProbeSnapshot, n as scanStatusJsonCore, o as resolveSharedMemoryStatusSnapshot, r as buildTailscaleHttpsUrl, t as buildColdStartUpdateResult } from "./status.scan.json-core-CQrRBsad.js";
import { existsSync } from "node:fs";
//#region src/commands/status.scan.ts
let statusScanDepsRuntimeModulePromise;
let statusAgentLocalModulePromise;
let statusSummaryModulePromise;
let statusUpdateModulePromise;
let gatewayCallModulePromise;
const loadStatusScanRuntimeModule = createLazyRuntimeSurface(() => import("./status.scan.runtime-BJTAq8e2.js"), ({ statusScanRuntime }) => statusScanRuntime);
function loadStatusScanDepsRuntimeModule() {
	statusScanDepsRuntimeModulePromise ??= import("./status.scan.deps.runtime-B2Wyqzr8.js");
	return statusScanDepsRuntimeModulePromise;
}
function loadStatusAgentLocalModule() {
	statusAgentLocalModulePromise ??= import("./status.agent-local-BkTtYaBU.js");
	return statusAgentLocalModulePromise;
}
function loadStatusSummaryModule() {
	statusSummaryModulePromise ??= import("./status.summary-Cf2vjFxC.js");
	return statusSummaryModulePromise;
}
function loadStatusUpdateModule() {
	statusUpdateModulePromise ??= import("./status.update-Blsqi3V-.js");
	return statusUpdateModulePromise;
}
function loadGatewayCallModule() {
	gatewayCallModulePromise ??= import("./call-fKq3W9Y5.js");
	return gatewayCallModulePromise;
}
function deferResult(promise) {
	return promise.then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
}
function unwrapDeferredResult(result) {
	if (!result.ok) throw result.error;
	return result.value;
}
function isMissingConfigColdStart() {
	return !existsSync(resolveConfigPath(process.env));
}
async function resolveChannelsStatus(params) {
	if (!params.gatewayReachable) return null;
	const { callGateway } = await loadGatewayCallModule();
	return await callGateway({
		config: params.cfg,
		method: "channels.status",
		params: {
			probe: false,
			timeoutMs: Math.min(8e3, params.opts.timeoutMs ?? 1e4)
		},
		timeoutMs: Math.min(params.opts.all ? 5e3 : 2500, params.opts.timeoutMs ?? 1e4)
	}).catch(() => null);
}
async function resolveMemoryStatusSnapshot(params) {
	const { getMemorySearchManager } = await loadStatusScanDepsRuntimeModule();
	return await resolveSharedMemoryStatusSnapshot({
		cfg: params.cfg,
		agentStatus: params.agentStatus,
		memoryPlugin: params.memoryPlugin,
		resolveMemoryConfig: resolveMemorySearchConfig,
		getMemorySearchManager
	});
}
function buildColdStartAgentLocalStatuses() {
	return {
		defaultId: "main",
		agents: [],
		totalSessions: 0,
		bootstrapPendingCount: 0
	};
}
function buildColdStartStatusSummary() {
	return {
		runtimeVersion: null,
		heartbeat: {
			defaultAgentId: "main",
			agents: []
		},
		channelSummary: [],
		queuedSystemEvents: [],
		sessions: {
			paths: [],
			count: 0,
			defaults: {
				model: null,
				contextTokens: null
			},
			recent: [],
			byAgent: []
		}
	};
}
async function scanStatusJsonFast(opts) {
	const coldStart = isMissingConfigColdStart();
	const loadedRaw = await readBestEffortConfig();
	const { resolvedConfig: cfg, diagnostics: secretDiagnostics } = await resolveCommandSecretRefsViaGateway({
		config: loadedRaw,
		commandName: "status --json",
		targetIds: getStatusCommandSecretTargetIds(),
		mode: "read_only_status"
	});
	return await scanStatusJsonCore({
		coldStart,
		cfg,
		sourceConfig: loadedRaw,
		secretDiagnostics,
		hasConfiguredChannels: hasPotentialConfiguredChannels(cfg),
		opts,
		resolveOsSummary,
		resolveMemory: async ({ cfg, agentStatus, memoryPlugin }) => await resolveMemoryStatusSnapshot({
			cfg,
			agentStatus,
			memoryPlugin
		}),
		runtime: opts.runtime
	});
}
async function scanStatus(opts, _runtime) {
	if (opts.json) return await scanStatusJsonFast({
		timeoutMs: opts.timeoutMs,
		all: opts.all,
		runtime: _runtime
	});
	return await withProgress({
		label: "Scanning status…",
		total: 11,
		enabled: true
	}, async (progress) => {
		const coldStart = isMissingConfigColdStart();
		progress.setLabel("Loading config…");
		const loadedRaw = await readBestEffortConfig();
		const { resolvedConfig: cfg, diagnostics: secretDiagnostics } = await resolveCommandSecretRefsViaGateway({
			config: loadedRaw,
			commandName: "status",
			targetIds: getStatusCommandSecretTargetIds(),
			mode: "read_only_status"
		});
		const hasConfiguredChannels = hasPotentialConfiguredChannels(cfg);
		const skipColdStartNetworkChecks = coldStart && !hasConfiguredChannels && opts.all !== true;
		const osSummary = resolveOsSummary();
		const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
		const tailscaleDnsPromise = tailscaleMode === "off" ? Promise.resolve(null) : loadStatusScanDepsRuntimeModule().then(({ getTailnetHostname }) => getTailnetHostname((cmd, args) => runExec(cmd, args, {
			timeoutMs: 1200,
			maxBuffer: 2e5
		}))).catch(() => null);
		const updateTimeoutMs = opts.all ? 6500 : 2500;
		const updatePromise = deferResult(skipColdStartNetworkChecks ? Promise.resolve(buildColdStartUpdateResult()) : loadStatusUpdateModule().then(({ getUpdateCheckResult }) => getUpdateCheckResult({
			timeoutMs: updateTimeoutMs,
			fetchGit: true,
			includeRegistry: true
		})));
		const agentStatusPromise = deferResult(skipColdStartNetworkChecks ? Promise.resolve(buildColdStartAgentLocalStatuses()) : loadStatusAgentLocalModule().then(({ getAgentLocalStatuses }) => getAgentLocalStatuses(cfg)));
		const summaryPromise = deferResult(skipColdStartNetworkChecks ? Promise.resolve(buildColdStartStatusSummary()) : loadStatusSummaryModule().then(({ getStatusSummary }) => getStatusSummary({
			config: cfg,
			sourceConfig: loadedRaw
		})));
		progress.tick();
		progress.setLabel("Checking Tailscale…");
		const tailscaleDns = await tailscaleDnsPromise;
		const tailscaleHttpsUrl = buildTailscaleHttpsUrl({
			tailscaleMode,
			tailscaleDns,
			controlUiBasePath: cfg.gateway?.controlUi?.basePath
		});
		progress.tick();
		progress.setLabel("Checking for updates…");
		const update = unwrapDeferredResult(await updatePromise);
		progress.tick();
		progress.setLabel("Resolving agents…");
		const agentStatus = unwrapDeferredResult(await agentStatusPromise);
		progress.tick();
		progress.setLabel("Probing gateway…");
		const { gatewayConnection, remoteUrlMissing, gatewayMode, gatewayProbeAuth, gatewayProbeAuthWarning, gatewayProbe } = await resolveGatewayProbeSnapshot({
			cfg,
			opts: {
				...opts,
				...skipColdStartNetworkChecks ? { skipProbe: true } : {}
			}
		});
		const gatewayReachable = gatewayProbe?.ok === true;
		const gatewaySelf = gatewayProbe?.presence ? pickGatewaySelfPresence(gatewayProbe.presence) : null;
		progress.tick();
		progress.setLabel("Querying channel status…");
		const channelsStatus = await resolveChannelsStatus({
			cfg,
			gatewayReachable,
			opts
		});
		const { collectChannelStatusIssues, buildChannelsTable } = await loadStatusScanRuntimeModule();
		const channelIssues = channelsStatus ? collectChannelStatusIssues(channelsStatus) : [];
		progress.tick();
		progress.setLabel("Summarizing channels…");
		const channels = await buildChannelsTable(cfg, {
			showSecrets: process.env.OPENCLAW_SHOW_SECRETS?.trim() !== "0",
			sourceConfig: loadedRaw
		});
		progress.tick();
		progress.setLabel("Checking memory…");
		const memoryPlugin = resolveMemoryPluginStatus(cfg);
		const memory = await resolveMemoryStatusSnapshot({
			cfg,
			agentStatus,
			memoryPlugin
		});
		progress.tick();
		progress.setLabel("Checking plugins…");
		const pluginCompatibility = buildPluginCompatibilityNotices({ config: cfg });
		progress.tick();
		progress.setLabel("Reading sessions…");
		const summary = unwrapDeferredResult(await summaryPromise);
		progress.tick();
		progress.setLabel("Rendering…");
		progress.tick();
		return {
			cfg,
			sourceConfig: loadedRaw,
			secretDiagnostics,
			osSummary,
			tailscaleMode,
			tailscaleDns,
			tailscaleHttpsUrl,
			update,
			gatewayConnection,
			remoteUrlMissing,
			gatewayMode,
			gatewayProbeAuth,
			gatewayProbeAuthWarning,
			gatewayProbe,
			gatewayReachable,
			gatewaySelf,
			channelIssues,
			agentStatus,
			channels,
			summary,
			memory,
			memoryPlugin,
			pluginCompatibility
		};
	});
}
//#endregion
export { scanStatus };
