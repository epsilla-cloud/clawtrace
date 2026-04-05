import { g as loggingState } from "./logger-BCzP_yik.js";
import { r as runExec } from "./exec-CLVZ7JOg.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-AHn9tEVf.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-CHwygUj4.js";
import { i as probeGateway } from "./probe-CdF9TAnm.js";
import { t as pickGatewaySelfPresence } from "./gateway-presence-DhAA8_2B.js";
import { existsSync } from "node:fs";
//#region src/commands/status.scan.shared.ts
let gatewayProbeModulePromise;
function loadGatewayProbeModule() {
	gatewayProbeModulePromise ??= import("./status.gateway-probe-B3YumHW0.js");
	return gatewayProbeModulePromise;
}
function hasExplicitMemorySearchConfig(cfg, agentId) {
	if (cfg.agents?.defaults && Object.prototype.hasOwnProperty.call(cfg.agents.defaults, "memorySearch")) return true;
	return (Array.isArray(cfg.agents?.list) ? cfg.agents.list : []).some((agent) => agent?.id === agentId && Object.prototype.hasOwnProperty.call(agent, "memorySearch"));
}
function resolveMemoryPluginStatus(cfg) {
	if (!(cfg.plugins?.enabled !== false)) return {
		enabled: false,
		slot: null,
		reason: "plugins disabled"
	};
	const raw = typeof cfg.plugins?.slots?.memory === "string" ? cfg.plugins.slots.memory.trim() : "";
	if (raw && raw.toLowerCase() === "none") return {
		enabled: false,
		slot: null,
		reason: "plugins.slots.memory=\"none\""
	};
	return {
		enabled: true,
		slot: raw || "memory-core"
	};
}
async function resolveGatewayProbeSnapshot(params) {
	const gatewayConnection = buildGatewayConnectionDetailsWithResolvers({ config: params.cfg });
	const isRemoteMode = params.cfg.gateway?.mode === "remote";
	const remoteUrlRaw = typeof params.cfg.gateway?.remote?.url === "string" ? params.cfg.gateway.remote.url : "";
	const remoteUrlMissing = isRemoteMode && !remoteUrlRaw.trim();
	const gatewayMode = isRemoteMode ? "remote" : "local";
	if (remoteUrlMissing || params.opts.skipProbe) return {
		gatewayConnection,
		remoteUrlMissing,
		gatewayMode,
		gatewayProbeAuth: {},
		gatewayProbeAuthWarning: void 0,
		gatewayProbe: null
	};
	const { resolveGatewayProbeAuthResolution } = await loadGatewayProbeModule();
	const gatewayProbeAuthResolution = await resolveGatewayProbeAuthResolution(params.cfg);
	let gatewayProbeAuthWarning = gatewayProbeAuthResolution.warning;
	const gatewayProbe = await probeGateway({
		url: gatewayConnection.url,
		auth: gatewayProbeAuthResolution.auth,
		timeoutMs: Math.min(params.opts.all ? 5e3 : 2500, params.opts.timeoutMs ?? 1e4),
		detailLevel: "presence"
	}).catch(() => null);
	if (gatewayProbeAuthWarning && gatewayProbe?.ok === false) {
		gatewayProbe.error = gatewayProbe.error ? `${gatewayProbe.error}; ${gatewayProbeAuthWarning}` : gatewayProbeAuthWarning;
		gatewayProbeAuthWarning = void 0;
	}
	return {
		gatewayConnection,
		remoteUrlMissing,
		gatewayMode,
		gatewayProbeAuth: gatewayProbeAuthResolution.auth,
		gatewayProbeAuthWarning,
		gatewayProbe
	};
}
function buildTailscaleHttpsUrl(params) {
	return params.tailscaleMode !== "off" && params.tailscaleDns ? `https://${params.tailscaleDns}${normalizeControlUiBasePath(params.controlUiBasePath)}` : null;
}
async function resolveSharedMemoryStatusSnapshot(params) {
	const { cfg, agentStatus, memoryPlugin } = params;
	if (!memoryPlugin.enabled || !memoryPlugin.slot) return null;
	const agentId = agentStatus.defaultId ?? "main";
	const defaultStorePath = params.requireDefaultStore?.(agentId);
	if (defaultStorePath && !hasExplicitMemorySearchConfig(cfg, agentId) && !existsSync(defaultStorePath)) return null;
	const resolvedMemory = params.resolveMemoryConfig(cfg, agentId);
	if (!resolvedMemory) return null;
	if (!(hasExplicitMemorySearchConfig(cfg, agentId) || existsSync(resolvedMemory.store.path))) return null;
	const { manager } = await params.getMemorySearchManager({
		cfg,
		agentId,
		purpose: "status"
	});
	if (!manager) return null;
	try {
		await manager.probeVectorAvailability();
	} catch {}
	const status = manager.status();
	await manager.close?.().catch(() => {});
	return {
		agentId,
		...status
	};
}
//#endregion
//#region src/commands/status.scan.json-core.ts
let pluginRegistryModulePromise;
let statusScanDepsRuntimeModulePromise;
let statusAgentLocalModulePromise;
let statusSummaryModulePromise;
let statusUpdateModulePromise;
function loadPluginRegistryModule() {
	pluginRegistryModulePromise ??= import("./plugin-registry-BoB3QTNs.js");
	return pluginRegistryModulePromise;
}
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
function buildColdStartUpdateResult() {
	return {
		root: null,
		installKind: "unknown",
		packageManager: "unknown"
	};
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
async function scanStatusJsonCore(params) {
	const { cfg, sourceConfig, secretDiagnostics, hasConfiguredChannels, opts } = params;
	if (hasConfiguredChannels) {
		const { ensurePluginRegistryLoaded } = await loadPluginRegistryModule();
		const previousForceStderr = loggingState.forceConsoleToStderr;
		loggingState.forceConsoleToStderr = true;
		try {
			ensurePluginRegistryLoaded({ scope: "configured-channels" });
		} finally {
			loggingState.forceConsoleToStderr = previousForceStderr;
		}
	}
	const osSummary = params.resolveOsSummary();
	const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
	const updateTimeoutMs = opts.all ? 6500 : 2500;
	const skipColdStartNetworkChecks = params.coldStart && !hasConfiguredChannels && opts.all !== true;
	const updatePromise = skipColdStartNetworkChecks ? Promise.resolve(buildColdStartUpdateResult()) : loadStatusUpdateModule().then(({ getUpdateCheckResult }) => getUpdateCheckResult({
		timeoutMs: updateTimeoutMs,
		fetchGit: true,
		includeRegistry: true
	}));
	const agentStatusPromise = skipColdStartNetworkChecks ? Promise.resolve(buildColdStartAgentLocalStatuses()) : loadStatusAgentLocalModule().then(({ getAgentLocalStatuses }) => getAgentLocalStatuses(cfg));
	const summaryPromise = skipColdStartNetworkChecks ? Promise.resolve(buildColdStartStatusSummary()) : loadStatusSummaryModule().then(({ getStatusSummary }) => getStatusSummary({
		config: cfg,
		sourceConfig
	}));
	const tailscaleDnsPromise = tailscaleMode === "off" ? Promise.resolve(null) : loadStatusScanDepsRuntimeModule().then(({ getTailnetHostname }) => getTailnetHostname((cmd, args) => runExec(cmd, args, {
		timeoutMs: 1200,
		maxBuffer: 2e5
	}))).catch(() => null);
	const gatewayProbePromise = resolveGatewayProbeSnapshot({
		cfg,
		opts: {
			...opts,
			...skipColdStartNetworkChecks ? { skipProbe: true } : {}
		}
	});
	const [tailscaleDns, update, agentStatus, gatewaySnapshot, summary] = await Promise.all([
		tailscaleDnsPromise,
		updatePromise,
		agentStatusPromise,
		gatewayProbePromise,
		summaryPromise
	]);
	const tailscaleHttpsUrl = buildTailscaleHttpsUrl({
		tailscaleMode,
		tailscaleDns,
		controlUiBasePath: cfg.gateway?.controlUi?.basePath
	});
	const { gatewayConnection, remoteUrlMissing, gatewayMode, gatewayProbeAuth, gatewayProbeAuthWarning, gatewayProbe } = gatewaySnapshot;
	const gatewayReachable = gatewayProbe?.ok === true;
	const gatewaySelf = gatewayProbe?.presence ? pickGatewaySelfPresence(gatewayProbe.presence) : null;
	const memoryPlugin = resolveMemoryPluginStatus(cfg);
	return {
		cfg,
		sourceConfig,
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
		channelIssues: [],
		agentStatus,
		channels: {
			rows: [],
			details: []
		},
		summary,
		memory: await params.resolveMemory({
			cfg,
			agentStatus,
			memoryPlugin,
			runtime: params.runtime
		}),
		memoryPlugin,
		pluginCompatibility: []
	};
}
//#endregion
export { resolveMemoryPluginStatus as a, resolveGatewayProbeSnapshot as i, scanStatusJsonCore as n, resolveSharedMemoryStatusSnapshot as o, buildTailscaleHttpsUrl as r, buildColdStartUpdateResult as t };
