import { h as writeRuntimeJson } from "./subsystem-CJEvHE2o.js";
import { n as withProgress } from "./progress-BWNzIjJW.js";
import { l as resolveUpdateChannelDisplay, s as normalizeUpdateChannel } from "./update-channels-BMzF-XAH.js";
import { n as getNodeDaemonStatusSummary, t as getDaemonStatusSummary } from "./status.daemon-CwO-YxhM.js";
import "./status.summary-BqL8S5aU.js";
//#region src/commands/status.command.ts
let providerUsagePromise;
let securityAuditModulePromise;
let gatewayCallModulePromise;
let statusScanModulePromise;
let statusScanFastJsonModulePromise;
let statusAllModulePromise;
let statusCommandTextRuntimePromise;
function loadProviderUsage() {
	providerUsagePromise ??= import("./provider-usage-Y16sTgxt.js");
	return providerUsagePromise;
}
function loadSecurityAuditModule() {
	securityAuditModulePromise ??= import("./audit.runtime-dpiNVrb0.js");
	return securityAuditModulePromise;
}
function loadGatewayCallModule() {
	gatewayCallModulePromise ??= import("./call-fKq3W9Y5.js");
	return gatewayCallModulePromise;
}
function loadStatusScanModule() {
	statusScanModulePromise ??= import("./status.scan-HyND8QxX.js");
	return statusScanModulePromise;
}
function loadStatusScanFastJsonModule() {
	statusScanFastJsonModulePromise ??= import("./status.scan.fast-json-DW_8-iuV.js");
	return statusScanFastJsonModulePromise;
}
function loadStatusAllModule() {
	statusAllModulePromise ??= import("./status-all-B-U4tj-z.js");
	return statusAllModulePromise;
}
function loadStatusCommandTextRuntime() {
	statusCommandTextRuntimePromise ??= import("./status.command.text-runtime-DashKf_c.js");
	return statusCommandTextRuntimePromise;
}
function resolvePairingRecoveryContext(params) {
	const sanitizeRequestId = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return null;
		if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(trimmed)) return null;
		return trimmed;
	};
	const source = [params.error, params.closeReason].filter((part) => typeof part === "string" && part.trim().length > 0).join(" ");
	if (!source || !/pairing required/i.test(source)) return null;
	const requestIdMatch = source.match(/requestId:\s*([^\s)]+)/i);
	return { requestId: (requestIdMatch && requestIdMatch[1] ? sanitizeRequestId(requestIdMatch[1]) : null) || null };
}
async function statusCommand(opts, runtime) {
	if (opts.all && !opts.json) {
		await loadStatusAllModule().then(({ statusAllCommand }) => statusAllCommand(runtime, { timeoutMs: opts.timeoutMs }));
		return;
	}
	const scan = opts.json ? await loadStatusScanFastJsonModule().then(({ scanStatusJsonFast }) => scanStatusJsonFast({
		timeoutMs: opts.timeoutMs,
		all: opts.all
	}, runtime)) : await loadStatusScanModule().then(({ scanStatus }) => scanStatus({
		json: false,
		timeoutMs: opts.timeoutMs,
		all: opts.all
	}, runtime));
	const runSecurityAudit = async () => await loadSecurityAuditModule().then(({ runSecurityAudit }) => runSecurityAudit({
		config: scan.cfg,
		sourceConfig: scan.sourceConfig,
		deep: false,
		includeFilesystem: true,
		includeChannelSecurity: true
	}));
	const securityAudit = opts.json ? await runSecurityAudit() : await withProgress({
		label: "Running security audit…",
		indeterminate: true,
		enabled: true
	}, async () => await runSecurityAudit());
	const { cfg, osSummary, tailscaleMode, tailscaleDns, tailscaleHttpsUrl, update, gatewayConnection, remoteUrlMissing, gatewayMode, gatewayProbeAuth, gatewayProbeAuthWarning, gatewayProbe, gatewayReachable, gatewaySelf, channelIssues, agentStatus, channels, summary, secretDiagnostics, memory, memoryPlugin, pluginCompatibility } = scan;
	const usage = opts.usage ? await withProgress({
		label: "Fetching usage snapshot…",
		indeterminate: true,
		enabled: opts.json !== true
	}, async () => {
		const { loadProviderUsageSummary } = await loadProviderUsage();
		return await loadProviderUsageSummary({ timeoutMs: opts.timeoutMs });
	}) : void 0;
	const health = opts.deep ? await withProgress({
		label: "Checking gateway health…",
		indeterminate: true,
		enabled: opts.json !== true
	}, async () => {
		const { callGateway } = await loadGatewayCallModule();
		return await callGateway({
			method: "health",
			params: { probe: true },
			timeoutMs: opts.timeoutMs,
			config: scan.cfg
		});
	}) : void 0;
	const lastHeartbeat = opts.deep && gatewayReachable ? await loadGatewayCallModule().then(({ callGateway }) => callGateway({
		method: "last-heartbeat",
		params: {},
		timeoutMs: opts.timeoutMs,
		config: scan.cfg
	})).catch(() => null) : null;
	const channelInfo = resolveUpdateChannelDisplay({
		configChannel: normalizeUpdateChannel(cfg.update?.channel),
		installKind: update.installKind,
		gitTag: update.git?.tag ?? null,
		gitBranch: update.git?.branch ?? null
	});
	if (opts.json) {
		const [daemon, nodeDaemon] = await Promise.all([getDaemonStatusSummary(), getNodeDaemonStatusSummary()]);
		writeRuntimeJson(runtime, {
			...summary,
			os: osSummary,
			update,
			updateChannel: channelInfo.channel,
			updateChannelSource: channelInfo.source,
			memory,
			memoryPlugin,
			gateway: {
				mode: gatewayMode,
				url: gatewayConnection.url,
				urlSource: gatewayConnection.urlSource,
				misconfigured: remoteUrlMissing,
				reachable: gatewayReachable,
				connectLatencyMs: gatewayProbe?.connectLatencyMs ?? null,
				self: gatewaySelf,
				error: gatewayProbe?.error ?? null,
				authWarning: gatewayProbeAuthWarning ?? null
			},
			gatewayService: daemon,
			nodeService: nodeDaemon,
			agents: agentStatus,
			securityAudit,
			secretDiagnostics,
			pluginCompatibility: {
				count: pluginCompatibility.length,
				warnings: pluginCompatibility
			},
			...health || usage || lastHeartbeat ? {
				health,
				usage,
				lastHeartbeat
			} : {}
		});
		return;
	}
	const { formatCliCommand, formatDuration, formatGatewayAuthUsed, formatGitInstallLabel, formatHealthChannelLines, formatKTokens, formatPluginCompatibilityNotice, formatTimeAgo, formatTokensCompact, formatUpdateAvailableHint, formatUpdateOneLiner, getTerminalTableWidth, groupChannelIssuesByChannel, info, renderTable, resolveControlUiLinks, resolveGatewayPort, resolveMemoryCacheSummary, resolveMemoryFtsState, resolveMemoryVectorState, resolveUpdateAvailability, shortenText, summarizePluginCompatibility, theme } = await loadStatusCommandTextRuntime();
	const muted = (value) => theme.muted(value);
	const ok = (value) => theme.success(value);
	const warn = (value) => theme.warn(value);
	if (opts.verbose) {
		const { buildGatewayConnectionDetails } = await loadGatewayCallModule();
		const details = buildGatewayConnectionDetails({ config: scan.cfg });
		runtime.log(info("Gateway connection:"));
		for (const line of details.message.split("\n")) runtime.log(`  ${line}`);
		runtime.log("");
	}
	const tableWidth = getTerminalTableWidth();
	if (secretDiagnostics.length > 0) {
		runtime.log(theme.warn("Secret diagnostics:"));
		for (const entry of secretDiagnostics) runtime.log(`- ${entry}`);
		runtime.log("");
	}
	const dashboard = cfg.gateway?.controlUi?.enabled ?? true ? resolveControlUiLinks({
		port: resolveGatewayPort(cfg),
		bind: cfg.gateway?.bind,
		customBindHost: cfg.gateway?.customBindHost,
		basePath: cfg.gateway?.controlUi?.basePath
	}).httpUrl : "disabled";
	const gatewayValue = (() => {
		const target = remoteUrlMissing ? `fallback ${gatewayConnection.url}` : `${gatewayConnection.url}${gatewayConnection.urlSource ? ` (${gatewayConnection.urlSource})` : ""}`;
		const reach = remoteUrlMissing ? warn("misconfigured (remote.url missing)") : gatewayReachable ? ok(`reachable ${formatDuration(gatewayProbe?.connectLatencyMs)}`) : warn(gatewayProbe?.error ? `unreachable (${gatewayProbe.error})` : "unreachable");
		const auth = gatewayReachable && !remoteUrlMissing ? ` · auth ${formatGatewayAuthUsed(gatewayProbeAuth)}` : "";
		const self = gatewaySelf?.host || gatewaySelf?.version || gatewaySelf?.platform ? [
			gatewaySelf?.host ? gatewaySelf.host : null,
			gatewaySelf?.ip ? `(${gatewaySelf.ip})` : null,
			gatewaySelf?.version ? `app ${gatewaySelf.version}` : null,
			gatewaySelf?.platform ? gatewaySelf.platform : null
		].filter(Boolean).join(" ") : null;
		return `${gatewayMode} · ${target} · ${reach}${auth}${self ? ` · ${self}` : ""}`;
	})();
	const pairingRecovery = resolvePairingRecoveryContext({
		error: gatewayProbe?.error ?? null,
		closeReason: gatewayProbe?.close?.reason ?? null
	});
	const agentsValue = (() => {
		const pending = agentStatus.bootstrapPendingCount > 0 ? `${agentStatus.bootstrapPendingCount} bootstrap file${agentStatus.bootstrapPendingCount === 1 ? "" : "s"} present` : "no bootstrap files";
		const def = agentStatus.agents.find((a) => a.id === agentStatus.defaultId);
		const defActive = def?.lastActiveAgeMs != null ? formatTimeAgo(def.lastActiveAgeMs) : "unknown";
		const defSuffix = def ? ` · default ${def.id} active ${defActive}` : "";
		return `${agentStatus.agents.length} · ${pending} · sessions ${agentStatus.totalSessions}${defSuffix}`;
	})();
	const [daemon, nodeDaemon] = await Promise.all([getDaemonStatusSummary(), getNodeDaemonStatusSummary()]);
	const daemonValue = (() => {
		if (daemon.installed === false) return `${daemon.label} not installed`;
		const installedPrefix = daemon.managedByOpenClaw ? "installed · " : "";
		return `${daemon.label} ${installedPrefix}${daemon.loadedText}${daemon.runtimeShort ? ` · ${daemon.runtimeShort}` : ""}`;
	})();
	const nodeDaemonValue = (() => {
		if (nodeDaemon.installed === false) return `${nodeDaemon.label} not installed`;
		const installedPrefix = nodeDaemon.managedByOpenClaw ? "installed · " : "";
		return `${nodeDaemon.label} ${installedPrefix}${nodeDaemon.loadedText}${nodeDaemon.runtimeShort ? ` · ${nodeDaemon.runtimeShort}` : ""}`;
	})();
	const defaults = summary.sessions.defaults;
	const defaultCtx = defaults.contextTokens ? ` (${formatKTokens(defaults.contextTokens)} ctx)` : "";
	const eventsValue = summary.queuedSystemEvents.length > 0 ? `${summary.queuedSystemEvents.length} queued` : "none";
	const probesValue = health ? ok("enabled") : muted("skipped (use --deep)");
	const heartbeatValue = (() => {
		const parts = summary.heartbeat.agents.map((agent) => {
			if (!agent.enabled || !agent.everyMs) return `disabled (${agent.agentId})`;
			return `${agent.every} (${agent.agentId})`;
		}).filter(Boolean);
		return parts.length > 0 ? parts.join(", ") : "disabled";
	})();
	const lastHeartbeatValue = (() => {
		if (!opts.deep) return null;
		if (!gatewayReachable) return warn("unavailable");
		if (!lastHeartbeat) return muted("none");
		const age = formatTimeAgo(Date.now() - lastHeartbeat.ts);
		const channel = lastHeartbeat.channel ?? "unknown";
		const accountLabel = lastHeartbeat.accountId ? `account ${lastHeartbeat.accountId}` : null;
		return [
			lastHeartbeat.status,
			`${age} ago`,
			channel,
			accountLabel
		].filter(Boolean).join(" · ");
	})();
	const storeLabel = summary.sessions.paths.length > 1 ? `${summary.sessions.paths.length} stores` : summary.sessions.paths[0] ?? "unknown";
	const memoryValue = (() => {
		if (!memoryPlugin.enabled) return muted(`disabled${memoryPlugin.reason ? ` (${memoryPlugin.reason})` : ""}`);
		if (!memory) return muted(`enabled (${memoryPlugin.slot ? `plugin ${memoryPlugin.slot}` : "plugin"}) · unavailable`);
		const parts = [];
		const dirtySuffix = memory.dirty ? ` · ${warn("dirty")}` : "";
		parts.push(`${memory.files} files · ${memory.chunks} chunks${dirtySuffix}`);
		if (memory.sources?.length) parts.push(`sources ${memory.sources.join(", ")}`);
		if (memoryPlugin.slot) parts.push(`plugin ${memoryPlugin.slot}`);
		const colorByTone = (tone, text) => tone === "ok" ? ok(text) : tone === "warn" ? warn(text) : muted(text);
		const vector = memory.vector;
		if (vector) {
			const state = resolveMemoryVectorState(vector);
			const label = state.state === "disabled" ? "vector off" : `vector ${state.state}`;
			parts.push(colorByTone(state.tone, label));
		}
		const fts = memory.fts;
		if (fts) {
			const state = resolveMemoryFtsState(fts);
			const label = state.state === "disabled" ? "fts off" : `fts ${state.state}`;
			parts.push(colorByTone(state.tone, label));
		}
		const cache = memory.cache;
		if (cache) {
			const summary = resolveMemoryCacheSummary(cache);
			parts.push(colorByTone(summary.tone, summary.text));
		}
		return parts.join(" · ");
	})();
	const updateAvailability = resolveUpdateAvailability(update);
	const updateLine = formatUpdateOneLiner(update).replace(/^Update:\s*/i, "");
	const channelLabel = channelInfo.label;
	const gitLabel = formatGitInstallLabel(update);
	const pluginCompatibilitySummary = summarizePluginCompatibility(pluginCompatibility);
	const pluginCompatibilityValue = pluginCompatibilitySummary.noticeCount === 0 ? ok("none") : warn(`${pluginCompatibilitySummary.noticeCount} notice${pluginCompatibilitySummary.noticeCount === 1 ? "" : "s"} · ${pluginCompatibilitySummary.pluginCount} plugin${pluginCompatibilitySummary.pluginCount === 1 ? "" : "s"}`);
	const overviewRows = [
		{
			Item: "Dashboard",
			Value: dashboard
		},
		{
			Item: "OS",
			Value: `${osSummary.label} · node ${process.versions.node}`
		},
		{
			Item: "Tailscale",
			Value: tailscaleMode === "off" ? muted("off") : tailscaleDns && tailscaleHttpsUrl ? `${tailscaleMode} · ${tailscaleDns} · ${tailscaleHttpsUrl}` : warn(`${tailscaleMode} · magicdns unknown`)
		},
		{
			Item: "Channel",
			Value: channelLabel
		},
		...gitLabel ? [{
			Item: "Git",
			Value: gitLabel
		}] : [],
		{
			Item: "Update",
			Value: updateAvailability.available ? warn(`available · ${updateLine}`) : updateLine
		},
		{
			Item: "Gateway",
			Value: gatewayValue
		},
		...gatewayProbeAuthWarning ? [{
			Item: "Gateway auth warning",
			Value: warn(gatewayProbeAuthWarning)
		}] : [],
		{
			Item: "Gateway service",
			Value: daemonValue
		},
		{
			Item: "Node service",
			Value: nodeDaemonValue
		},
		{
			Item: "Agents",
			Value: agentsValue
		},
		{
			Item: "Memory",
			Value: memoryValue
		},
		{
			Item: "Plugin compatibility",
			Value: pluginCompatibilityValue
		},
		{
			Item: "Probes",
			Value: probesValue
		},
		{
			Item: "Events",
			Value: eventsValue
		},
		{
			Item: "Heartbeat",
			Value: heartbeatValue
		},
		...lastHeartbeatValue ? [{
			Item: "Last heartbeat",
			Value: lastHeartbeatValue
		}] : [],
		{
			Item: "Sessions",
			Value: `${summary.sessions.count} active · default ${defaults.model ?? "unknown"}${defaultCtx} · ${storeLabel}`
		}
	];
	runtime.log(theme.heading("OpenClaw status"));
	runtime.log("");
	runtime.log(theme.heading("Overview"));
	runtime.log(renderTable({
		width: tableWidth,
		columns: [{
			key: "Item",
			header: "Item",
			minWidth: 12
		}, {
			key: "Value",
			header: "Value",
			flex: true,
			minWidth: 32
		}],
		rows: overviewRows
	}).trimEnd());
	if (pluginCompatibility.length > 0) {
		runtime.log("");
		runtime.log(theme.heading("Plugin compatibility"));
		for (const notice of pluginCompatibility.slice(0, 8)) {
			const label = notice.severity === "warn" ? theme.warn("WARN") : theme.muted("INFO");
			runtime.log(`  ${label} ${formatPluginCompatibilityNotice(notice)}`);
		}
		if (pluginCompatibility.length > 8) runtime.log(theme.muted(`  … +${pluginCompatibility.length - 8} more`));
	}
	if (pairingRecovery) {
		runtime.log("");
		runtime.log(theme.warn("Gateway pairing approval required."));
		if (pairingRecovery.requestId) runtime.log(theme.muted(`Recovery: ${formatCliCommand(`openclaw devices approve ${pairingRecovery.requestId}`)}`));
		runtime.log(theme.muted(`Fallback: ${formatCliCommand("openclaw devices approve --latest")}`));
		runtime.log(theme.muted(`Inspect: ${formatCliCommand("openclaw devices list")}`));
	}
	runtime.log("");
	runtime.log(theme.heading("Security audit"));
	const fmtSummary = (value) => {
		return [
			theme.error(`${value.critical} critical`),
			theme.warn(`${value.warn} warn`),
			theme.muted(`${value.info} info`)
		].join(" · ");
	};
	runtime.log(theme.muted(`Summary: ${fmtSummary(securityAudit.summary)}`));
	const importantFindings = securityAudit.findings.filter((f) => f.severity === "critical" || f.severity === "warn");
	if (importantFindings.length === 0) runtime.log(theme.muted("No critical or warn findings detected."));
	else {
		const severityLabel = (sev) => {
			if (sev === "critical") return theme.error("CRITICAL");
			if (sev === "warn") return theme.warn("WARN");
			return theme.muted("INFO");
		};
		const sevRank = (sev) => sev === "critical" ? 0 : sev === "warn" ? 1 : 2;
		const sorted = [...importantFindings].toSorted((a, b) => sevRank(a.severity) - sevRank(b.severity));
		const shown = sorted.slice(0, 6);
		for (const f of shown) {
			runtime.log(`  ${severityLabel(f.severity)} ${f.title}`);
			runtime.log(`    ${shortenText(f.detail.replaceAll("\n", " "), 160)}`);
			if (f.remediation?.trim()) runtime.log(`    ${theme.muted(`Fix: ${f.remediation.trim()}`)}`);
		}
		if (sorted.length > shown.length) runtime.log(theme.muted(`… +${sorted.length - shown.length} more`));
	}
	runtime.log(theme.muted(`Full report: ${formatCliCommand("openclaw security audit")}`));
	runtime.log(theme.muted(`Deep probe: ${formatCliCommand("openclaw security audit --deep")}`));
	runtime.log("");
	runtime.log(theme.heading("Channels"));
	const channelIssuesByChannel = groupChannelIssuesByChannel(channelIssues);
	runtime.log(renderTable({
		width: tableWidth,
		columns: [
			{
				key: "Channel",
				header: "Channel",
				minWidth: 10
			},
			{
				key: "Enabled",
				header: "Enabled",
				minWidth: 7
			},
			{
				key: "State",
				header: "State",
				minWidth: 8
			},
			{
				key: "Detail",
				header: "Detail",
				flex: true,
				minWidth: 24
			}
		],
		rows: channels.rows.map((row) => {
			const issues = channelIssuesByChannel.get(row.id) ?? [];
			const effectiveState = row.state === "off" ? "off" : issues.length > 0 ? "warn" : row.state;
			const issueSuffix = issues.length > 0 ? ` · ${warn(`gateway: ${shortenText(issues[0]?.message ?? "issue", 84)}`)}` : "";
			return {
				Channel: row.label,
				Enabled: row.enabled ? ok("ON") : muted("OFF"),
				State: effectiveState === "ok" ? ok("OK") : effectiveState === "warn" ? warn("WARN") : effectiveState === "off" ? muted("OFF") : theme.accentDim("SETUP"),
				Detail: `${row.detail}${issueSuffix}`
			};
		})
	}).trimEnd());
	runtime.log("");
	runtime.log(theme.heading("Sessions"));
	runtime.log(renderTable({
		width: tableWidth,
		columns: [
			{
				key: "Key",
				header: "Key",
				minWidth: 20,
				flex: true
			},
			{
				key: "Kind",
				header: "Kind",
				minWidth: 6
			},
			{
				key: "Age",
				header: "Age",
				minWidth: 9
			},
			{
				key: "Model",
				header: "Model",
				minWidth: 14
			},
			{
				key: "Tokens",
				header: "Tokens",
				minWidth: 16
			}
		],
		rows: summary.sessions.recent.length > 0 ? summary.sessions.recent.map((sess) => ({
			Key: shortenText(sess.key, 32),
			Kind: sess.kind,
			Age: sess.updatedAt ? formatTimeAgo(sess.age) : "no activity",
			Model: sess.model ?? "unknown",
			Tokens: formatTokensCompact(sess)
		})) : [{
			Key: muted("no sessions yet"),
			Kind: "",
			Age: "",
			Model: "",
			Tokens: ""
		}]
	}).trimEnd());
	if (summary.queuedSystemEvents.length > 0) {
		runtime.log("");
		runtime.log(theme.heading("System events"));
		runtime.log(renderTable({
			width: tableWidth,
			columns: [{
				key: "Event",
				header: "Event",
				flex: true,
				minWidth: 24
			}],
			rows: summary.queuedSystemEvents.slice(0, 5).map((event) => ({ Event: event }))
		}).trimEnd());
		if (summary.queuedSystemEvents.length > 5) runtime.log(muted(`… +${summary.queuedSystemEvents.length - 5} more`));
	}
	if (health) {
		runtime.log("");
		runtime.log(theme.heading("Health"));
		const rows = [];
		rows.push({
			Item: "Gateway",
			Status: ok("reachable"),
			Detail: `${health.durationMs}ms`
		});
		for (const line of formatHealthChannelLines(health, { accountMode: "all" })) {
			const colon = line.indexOf(":");
			if (colon === -1) continue;
			const item = line.slice(0, colon).trim();
			const detail = line.slice(colon + 1).trim();
			const normalized = detail.toLowerCase();
			const status = (() => {
				if (normalized.startsWith("ok")) return ok("OK");
				if (normalized.startsWith("failed")) return warn("WARN");
				if (normalized.startsWith("not configured")) return muted("OFF");
				if (normalized.startsWith("configured")) return ok("OK");
				if (normalized.startsWith("linked")) return ok("LINKED");
				if (normalized.startsWith("not linked")) return warn("UNLINKED");
				return warn("WARN");
			})();
			rows.push({
				Item: item,
				Status: status,
				Detail: detail
			});
		}
		runtime.log(renderTable({
			width: tableWidth,
			columns: [
				{
					key: "Item",
					header: "Item",
					minWidth: 10
				},
				{
					key: "Status",
					header: "Status",
					minWidth: 8
				},
				{
					key: "Detail",
					header: "Detail",
					flex: true,
					minWidth: 28
				}
			],
			rows
		}).trimEnd());
	}
	if (usage) {
		const { formatUsageReportLines } = await loadProviderUsage();
		runtime.log("");
		runtime.log(theme.heading("Usage"));
		for (const line of formatUsageReportLines(usage)) runtime.log(line);
	}
	runtime.log("");
	runtime.log("FAQ: https://docs.openclaw.ai/faq");
	runtime.log("Troubleshooting: https://docs.openclaw.ai/troubleshooting");
	runtime.log("");
	const updateHint = formatUpdateAvailableHint(update);
	if (updateHint) {
		runtime.log(theme.warn(updateHint));
		runtime.log("");
	}
	runtime.log("Next steps:");
	runtime.log(`  Need to share?      ${formatCliCommand("openclaw status --all")}`);
	runtime.log(`  Need to debug live? ${formatCliCommand("openclaw logs --follow")}`);
	if (gatewayReachable) runtime.log(`  Need to test channels? ${formatCliCommand("openclaw status --deep")}`);
	else runtime.log(`  Fix reachability first: ${formatCliCommand("openclaw gateway probe")}`);
}
//#endregion
export { statusCommand as t };
