import { o as getResolvedLoggerSettings } from "./logger-BCzP_yik.js";
import { h as writeRuntimeJson, m as defaultRuntime } from "./subsystem-CJEvHE2o.js";
import { t as formatDocsLink } from "./links-CNsP_rfF.js";
import { r as theme } from "./theme-D-TumEpz.js";
import { Ds as applyPluginAutoEnable, Em as formatUsageReportLines, FA as createMessageActionDiscoveryContext, IA as resolveMessageActionDiscoveryForPlugin, KO as callGateway, Tm as loadProviderUsageSummary, bw as resolveMessageChannelSelection, f as loadConfig, g as readConfigFileSnapshot, ww as resolveCommandSecretRefsViaGateway, x as writeConfigFile } from "./auth-profiles-B5ypC5S-.js";
import { r as loadAuthProfileStore } from "./store-BpAvd-ka.js";
import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { t as danger } from "./globals-0H99T-Tx.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import { i as resolveChannelDefaultAccountId, r as parseOptionalDelimitedEntries } from "./helpers-GKJz5Xrd.js";
import { c as moveSingleAccountChannelSectionToDefaultAccount } from "./setup-helpers-D9SEfBub.js";
import { n as listChannelPlugins, r as normalizeChannelId, t as getChannelPlugin } from "./plugins-BQ9CTy5q.js";
import { n as hasResolvedCredentialValue, t as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-agcLjuW6.js";
import { o as formatTimeAgo } from "./account-summary-BVeyEc9I.js";
import "./logging-S_1ymJjU.js";
import { n as getChannelsCommandSecretTargetIds } from "./command-secret-targets-DayQlnoD.js";
import { n as withProgress } from "./progress-BWNzIjJW.js";
import { r as listChannelPluginCatalogEntries } from "./catalog-DwkSz2IS.js";
import { t as createClackPrompter } from "./clack-prompter-CrErWfG1.js";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-BFDQyapO.js";
import { n as buildReadOnlySourceChannelAccountSnapshot, t as buildChannelAccountSnapshot } from "./status-CFJcLrdg.js";
import { t as parseLogLine } from "./parse-log-line-BD4N3I1N.js";
import { i as describeBinding, n as applyAgentBindings, t as requireValidConfigSnapshot } from "./config-validation-uSsprHYt.js";
import { a as isCatalogChannelInstalled, n as runCollectedChannelOnboardingPostWriteHooks, t as createChannelOnboardingPostWriteHookCollector } from "./onboard-channels-Dv9JGXWX.js";
import { t as collectChannelStatusIssues } from "./channels-status-issues-BK8XdRAJ.js";
import fs from "node:fs/promises";
//#region src/commands/channels/add-mutators.ts
function applyAccountName(params) {
	const accountId = normalizeAccountId(params.accountId);
	const apply = (params.plugin ?? getChannelPlugin(params.channel))?.setup?.applyAccountName;
	return apply ? apply({
		cfg: params.cfg,
		accountId,
		name: params.name
	}) : params.cfg;
}
function applyChannelAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId);
	const apply = (params.plugin ?? getChannelPlugin(params.channel))?.setup?.applyAccountConfig;
	if (!apply) return params.cfg;
	return apply({
		cfg: params.cfg,
		accountId,
		input: params.input
	});
}
//#endregion
//#region src/commands/channels/shared.ts
async function requireValidConfig(runtime = defaultRuntime, secretResolution) {
	const cfg = await requireValidConfigSnapshot(runtime);
	if (!cfg) return null;
	const { resolvedConfig, diagnostics } = await resolveCommandSecretRefsViaGateway({
		config: cfg,
		commandName: secretResolution?.commandName ?? "channels",
		targetIds: getChannelsCommandSecretTargetIds(),
		mode: secretResolution?.mode
	});
	for (const entry of diagnostics) runtime.log(`[secrets] ${entry}`);
	return resolvedConfig;
}
function formatAccountLabel(params) {
	const base = params.accountId || "default";
	if (params.name?.trim()) return `${base} (${params.name.trim()})`;
	return base;
}
const channelLabel = (channel) => {
	return getChannelPlugin(channel)?.meta.label ?? channel;
};
function formatChannelAccountLabel(params) {
	const channelText = channelLabel(params.channel);
	const accountText = formatAccountLabel({
		accountId: params.accountId,
		name: params.name
	});
	return `${params.channelStyle ? params.channelStyle(channelText) : channelText} ${params.accountStyle ? params.accountStyle(accountText) : accountText}`;
}
function shouldUseWizard(params) {
	return params?.hasFlags === false;
}
//#endregion
//#region src/commands/channels/add.ts
function resolveCatalogChannelEntry(raw, cfg) {
	const trimmed = raw.trim().toLowerCase();
	if (!trimmed) return;
	return listChannelPluginCatalogEntries({ workspaceDir: cfg ? resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)) : void 0 }).find((entry) => {
		if (entry.id.toLowerCase() === trimmed) return true;
		return (entry.meta.aliases ?? []).some((alias) => alias.trim().toLowerCase() === trimmed);
	});
}
async function channelsAddCommand(opts, runtime = defaultRuntime, params) {
	const cfg = await requireValidConfig(runtime);
	if (!cfg) return;
	let nextConfig = cfg;
	if (shouldUseWizard(params)) {
		const [{ buildAgentSummaries }, { setupChannels }] = await Promise.all([import("./agents.config-DjSff0uE.js"), import("./onboard-channels-3dNdKg_D.js")]);
		const prompter = createClackPrompter();
		const postWriteHooks = createChannelOnboardingPostWriteHookCollector();
		let selection = [];
		const accountIds = {};
		const resolvedPlugins = /* @__PURE__ */ new Map();
		await prompter.intro("Channel setup");
		let nextConfig = await setupChannels(cfg, runtime, prompter, {
			allowDisable: false,
			allowSignalInstall: true,
			onPostWriteHook: (hook) => {
				postWriteHooks.collect(hook);
			},
			promptAccountIds: true,
			onSelection: (value) => {
				selection = value;
			},
			onAccountId: (channel, accountId) => {
				accountIds[channel] = accountId;
			},
			onResolvedPlugin: (channel, plugin) => {
				resolvedPlugins.set(channel, plugin);
			}
		});
		if (selection.length === 0) {
			await prompter.outro("No channels selected.");
			return;
		}
		if (await prompter.confirm({
			message: "Add display names for these accounts? (optional)",
			initialValue: false
		})) for (const channel of selection) {
			const accountId = accountIds[channel] ?? "default";
			const plugin = resolvedPlugins.get(channel) ?? getChannelPlugin(channel);
			const account = plugin?.config.resolveAccount(nextConfig, accountId);
			const existingName = (plugin?.config.describeAccount?.(account, nextConfig))?.name ?? account?.name;
			const name = await prompter.text({
				message: `${channel} account name (${accountId})`,
				initialValue: existingName
			});
			if (name?.trim()) nextConfig = applyAccountName({
				cfg: nextConfig,
				channel,
				accountId,
				name,
				plugin
			});
		}
		const bindTargets = selection.map((channel) => ({
			channel,
			accountId: accountIds[channel]?.trim()
		})).filter((value) => Boolean(value.accountId));
		if (bindTargets.length > 0) {
			if (await prompter.confirm({
				message: "Bind configured channel accounts to agents now?",
				initialValue: true
			})) {
				const agentSummaries = buildAgentSummaries(nextConfig);
				const defaultAgentId = resolveDefaultAgentId(nextConfig);
				for (const target of bindTargets) {
					const targetAgentId = await prompter.select({
						message: `Route ${target.channel} account "${target.accountId}" to agent`,
						options: agentSummaries.map((agent) => ({
							value: agent.id,
							label: agent.isDefault ? `${agent.id} (default)` : agent.id
						})),
						initialValue: defaultAgentId
					});
					const bindingResult = applyAgentBindings(nextConfig, [{
						agentId: targetAgentId,
						match: {
							channel: target.channel,
							accountId: target.accountId
						}
					}]);
					nextConfig = bindingResult.config;
					if (bindingResult.added.length > 0 || bindingResult.updated.length > 0) await prompter.note([...bindingResult.added.map((binding) => `Added: ${describeBinding(binding)}`), ...bindingResult.updated.map((binding) => `Updated: ${describeBinding(binding)}`)].join("\n"), "Routing bindings");
					if (bindingResult.conflicts.length > 0) await prompter.note(["Skipped bindings already claimed by another agent:", ...bindingResult.conflicts.map((conflict) => `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)].join("\n"), "Routing bindings");
				}
			}
		}
		await writeConfigFile(nextConfig);
		await runCollectedChannelOnboardingPostWriteHooks({
			hooks: postWriteHooks.drain(),
			cfg: nextConfig,
			runtime
		});
		await prompter.outro("Channels updated.");
		return;
	}
	const rawChannel = String(opts.channel ?? "");
	let channel = normalizeChannelId(rawChannel);
	let catalogEntry = channel ? void 0 : resolveCatalogChannelEntry(rawChannel, nextConfig);
	const resolveWorkspaceDir = () => resolveAgentWorkspaceDir(nextConfig, resolveDefaultAgentId(nextConfig));
	const loadScopedPlugin = async (channelId, pluginId) => {
		const existing = getChannelPlugin(channelId);
		if (existing) return existing;
		const { loadChannelSetupPluginRegistrySnapshotForChannel } = await import("./plugin-install-BKr-aFQO.js");
		const snapshot = loadChannelSetupPluginRegistrySnapshotForChannel({
			cfg: nextConfig,
			runtime,
			channel: channelId,
			...pluginId ? { pluginId } : {},
			workspaceDir: resolveWorkspaceDir()
		});
		return snapshot.channels.find((entry) => entry.plugin.id === channelId)?.plugin ?? snapshot.channelSetups.find((entry) => entry.plugin.id === channelId)?.plugin;
	};
	if (!channel && catalogEntry) {
		const workspaceDir = resolveWorkspaceDir();
		if (!isCatalogChannelInstalled({
			cfg: nextConfig,
			entry: catalogEntry,
			workspaceDir
		})) {
			const { ensureChannelSetupPluginInstalled } = await import("./plugin-install-BKr-aFQO.js");
			const prompter = createClackPrompter();
			const result = await ensureChannelSetupPluginInstalled({
				cfg: nextConfig,
				entry: catalogEntry,
				prompter,
				runtime,
				workspaceDir
			});
			nextConfig = result.cfg;
			if (!result.installed) return;
			catalogEntry = {
				...catalogEntry,
				...result.pluginId ? { pluginId: result.pluginId } : {}
			};
		}
		channel = normalizeChannelId(catalogEntry.id) ?? catalogEntry.id;
	}
	if (!channel) {
		const hint = catalogEntry ? `Plugin ${catalogEntry.meta.label} could not be loaded after install.` : `Unknown channel: ${String(opts.channel ?? "")}`;
		runtime.error(hint);
		runtime.exit(1);
		return;
	}
	const plugin = await loadScopedPlugin(channel, catalogEntry?.pluginId);
	if (!plugin?.setup?.applyAccountConfig) {
		runtime.error(`Channel ${channel} does not support add.`);
		runtime.exit(1);
		return;
	}
	const useEnv = opts.useEnv === true;
	const initialSyncLimit = typeof opts.initialSyncLimit === "number" ? opts.initialSyncLimit : typeof opts.initialSyncLimit === "string" && opts.initialSyncLimit.trim() ? Number.parseInt(opts.initialSyncLimit, 10) : void 0;
	const groupChannels = parseOptionalDelimitedEntries(opts.groupChannels);
	const dmAllowlist = parseOptionalDelimitedEntries(opts.dmAllowlist);
	const input = {
		name: opts.name,
		token: opts.token,
		privateKey: opts.privateKey,
		tokenFile: opts.tokenFile,
		botToken: opts.botToken,
		appToken: opts.appToken,
		signalNumber: opts.signalNumber,
		cliPath: opts.cliPath,
		dbPath: opts.dbPath,
		service: opts.service,
		region: opts.region,
		authDir: opts.authDir,
		httpUrl: opts.httpUrl,
		httpHost: opts.httpHost,
		httpPort: opts.httpPort,
		webhookPath: opts.webhookPath,
		webhookUrl: opts.webhookUrl,
		audienceType: opts.audienceType,
		audience: opts.audience,
		homeserver: opts.homeserver,
		userId: opts.userId,
		accessToken: opts.accessToken,
		password: opts.password,
		deviceName: opts.deviceName,
		initialSyncLimit,
		useEnv,
		ship: opts.ship,
		url: opts.url,
		relayUrls: opts.relayUrls,
		code: opts.code,
		groupChannels,
		dmAllowlist,
		autoDiscoverChannels: opts.autoDiscoverChannels
	};
	const accountId = plugin.setup.resolveAccountId?.({
		cfg: nextConfig,
		accountId: opts.account,
		input
	}) ?? normalizeAccountId(opts.account);
	const validationError = plugin.setup.validateInput?.({
		cfg: nextConfig,
		accountId,
		input
	});
	if (validationError) {
		runtime.error(validationError);
		runtime.exit(1);
		return;
	}
	const prevConfig = nextConfig;
	if (accountId !== "default") nextConfig = moveSingleAccountChannelSectionToDefaultAccount({
		cfg: nextConfig,
		channelKey: channel
	});
	nextConfig = applyChannelAccountConfig({
		cfg: nextConfig,
		channel,
		accountId,
		input,
		plugin
	});
	await plugin.lifecycle?.onAccountConfigChanged?.({
		prevCfg: prevConfig,
		nextCfg: nextConfig,
		accountId,
		runtime
	});
	await writeConfigFile(nextConfig);
	runtime.log(`Added ${channelLabel(channel)} account "${accountId}".`);
	const afterAccountConfigWritten = plugin.setup?.afterAccountConfigWritten;
	if (afterAccountConfigWritten) await runCollectedChannelOnboardingPostWriteHooks({
		hooks: [{
			channel,
			accountId,
			run: async ({ cfg: writtenCfg, runtime: hookRuntime }) => await afterAccountConfigWritten({
				previousCfg: cfg,
				cfg: writtenCfg,
				accountId,
				input,
				runtime: hookRuntime
			})
		}],
		cfg: nextConfig,
		runtime
	});
}
//#endregion
//#region src/commands/channels/capabilities.ts
function normalizeTimeout(raw, fallback = 1e4) {
	const value = typeof raw === "string" ? Number(raw) : Number(raw);
	if (!Number.isFinite(value) || value <= 0) return fallback;
	return value;
}
function formatSupport(capabilities) {
	if (!capabilities) return "unknown";
	const bits = [];
	if (capabilities.chatTypes?.length) bits.push(`chatTypes=${capabilities.chatTypes.join(",")}`);
	if (capabilities.polls) bits.push("polls");
	if (capabilities.reactions) bits.push("reactions");
	if (capabilities.edit) bits.push("edit");
	if (capabilities.unsend) bits.push("unsend");
	if (capabilities.reply) bits.push("reply");
	if (capabilities.effects) bits.push("effects");
	if (capabilities.groupManagement) bits.push("groupManagement");
	if (capabilities.threads) bits.push("threads");
	if (capabilities.media) bits.push("media");
	if (capabilities.nativeCommands) bits.push("nativeCommands");
	if (capabilities.blockStreaming) bits.push("blockStreaming");
	return bits.length ? bits.join(" ") : "none";
}
function formatGenericProbeLines(probe) {
	if (!probe || typeof probe !== "object") return [];
	const probeObj = probe;
	const ok = typeof probeObj.ok === "boolean" ? probeObj.ok : void 0;
	if (ok === true) return [{ text: "Probe: ok" }];
	if (ok === false) return [{
		text: `Probe: failed${typeof probeObj.error === "string" && probeObj.error ? ` (${probeObj.error})` : ""}`,
		tone: "error"
	}];
	return [];
}
function renderDisplayLine(line) {
	switch (line.tone) {
		case "muted": return theme.muted(line.text);
		case "success": return theme.success(line.text);
		case "warn": return theme.warn(line.text);
		case "error": return theme.error(line.text);
		default: return line.text;
	}
}
async function resolveChannelReports(params) {
	const { plugin, cfg, timeoutMs } = params;
	const accountIds = params.accountOverride ? [params.accountOverride] : (() => {
		const ids = plugin.config.listAccountIds(cfg);
		return ids.length > 0 ? ids : [resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds: ids
		})];
	})();
	const reports = [];
	for (const accountId of accountIds) {
		const resolvedAccount = plugin.config.resolveAccount(cfg, accountId);
		const configured = plugin.config.isConfigured ? await plugin.config.isConfigured(resolvedAccount, cfg) : Boolean(resolvedAccount);
		const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(resolvedAccount, cfg) : resolvedAccount.enabled !== false;
		let probe;
		if (configured && enabled && plugin.status?.probeAccount) try {
			probe = await plugin.status.probeAccount({
				account: resolvedAccount,
				timeoutMs,
				cfg
			});
		} catch (err) {
			probe = {
				ok: false,
				error: err instanceof Error ? err.message : String(err)
			};
		}
		const diagnostics = configured && enabled ? await plugin.status?.buildCapabilitiesDiagnostics?.({
			account: resolvedAccount,
			timeoutMs,
			cfg,
			probe,
			target: params.target
		}) : void 0;
		const discoveredActions = resolveMessageActionDiscoveryForPlugin({
			pluginId: plugin.id,
			actions: plugin.actions,
			context: createMessageActionDiscoveryContext({
				cfg,
				accountId
			}),
			includeActions: true
		}).actions;
		const actions = Array.from(new Set([
			"send",
			"broadcast",
			...discoveredActions.map((action) => String(action))
		]));
		reports.push({
			plugin,
			channel: plugin.id,
			accountId,
			accountName: typeof resolvedAccount.name === "string" ? resolvedAccount.name?.trim() || void 0 : void 0,
			configured,
			enabled,
			support: plugin.capabilities,
			probe,
			actions,
			diagnostics
		});
	}
	return reports;
}
async function channelsCapabilitiesCommand(opts, runtime = defaultRuntime) {
	const loadedCfg = await requireValidConfig(runtime);
	if (!loadedCfg) return;
	let cfg = loadedCfg;
	const timeoutMs = normalizeTimeout(opts.timeout, 1e4);
	const rawChannel = typeof opts.channel === "string" ? opts.channel.trim().toLowerCase() : "";
	const rawTarget = typeof opts.target === "string" ? opts.target.trim() : "";
	if (opts.account && (!rawChannel || rawChannel === "all")) {
		runtime.error(danger("--account requires a specific --channel."));
		runtime.exit(1);
		return;
	}
	if (rawTarget && (!rawChannel || rawChannel === "all")) {
		runtime.error(danger("--target requires a specific --channel."));
		runtime.exit(1);
		return;
	}
	const plugins = listChannelPlugins();
	const selected = !rawChannel || rawChannel === "all" ? plugins : await (async () => {
		const resolved = await resolveInstallableChannelPlugin({
			cfg,
			runtime,
			rawChannel,
			allowInstall: true
		});
		if (resolved.configChanged) {
			cfg = resolved.cfg;
			await writeConfigFile(cfg);
		}
		return resolved.plugin ? [resolved.plugin] : null;
	})();
	if (!selected || selected.length === 0) {
		runtime.error(danger(`Unknown channel "${rawChannel}".`));
		runtime.exit(1);
		return;
	}
	const reports = [];
	for (const plugin of selected) {
		const accountOverride = opts.account?.trim() || void 0;
		reports.push(...await resolveChannelReports({
			plugin,
			cfg,
			timeoutMs,
			accountOverride,
			target: rawTarget || void 0
		}));
	}
	if (opts.json) {
		writeRuntimeJson(runtime, { channels: reports });
		return;
	}
	const lines = [];
	for (const report of reports) {
		const label = formatChannelAccountLabel({
			channel: report.channel,
			accountId: report.accountId,
			name: report.accountName,
			channelStyle: theme.accent,
			accountStyle: theme.heading
		});
		lines.push(theme.heading(label));
		lines.push(`Support: ${formatSupport(report.support)}`);
		if (report.actions && report.actions.length > 0) lines.push(`Actions: ${report.actions.join(", ")}`);
		if (report.configured === false || report.enabled === false) {
			const configuredLabel = report.configured === false ? "not configured" : "configured";
			const enabledLabel = report.enabled === false ? "disabled" : "enabled";
			lines.push(`Status: ${configuredLabel}, ${enabledLabel}`);
		}
		const probeLines = report.plugin.status?.formatCapabilitiesProbe?.({ probe: report.probe }) ?? formatGenericProbeLines(report.probe);
		if (probeLines.length > 0) lines.push(...probeLines.map(renderDisplayLine));
		else if (report.configured && report.enabled) lines.push(theme.muted("Probe: unavailable"));
		if (report.diagnostics?.lines?.length) lines.push(...report.diagnostics.lines.map(renderDisplayLine));
		lines.push("");
	}
	runtime.log(lines.join("\n").trimEnd());
}
//#endregion
//#region src/commands/channels/list.ts
const colorValue = (value) => {
	if (value === "none") return theme.error(value);
	if (value === "env") return theme.accent(value);
	return theme.success(value);
};
function formatEnabled(value) {
	return value === false ? theme.error("disabled") : theme.success("enabled");
}
function formatConfigured(value) {
	return value ? theme.success("configured") : theme.warn("not configured");
}
function formatTokenSource(source) {
	return `token=${colorValue(source || "none")}`;
}
function formatSource(label, source) {
	return `${label}=${colorValue(source || "none")}`;
}
function formatLinked(value) {
	return value ? theme.success("linked") : theme.warn("not linked");
}
function shouldShowConfigured(channel) {
	return channel.meta.showConfigured !== false;
}
function formatAccountLine(params) {
	const { channel, snapshot } = params;
	const label = formatChannelAccountLabel({
		channel: channel.id,
		accountId: snapshot.accountId,
		name: snapshot.name,
		channelStyle: theme.accent,
		accountStyle: theme.heading
	});
	const bits = [];
	if (snapshot.linked !== void 0) bits.push(formatLinked(snapshot.linked));
	if (shouldShowConfigured(channel) && typeof snapshot.configured === "boolean") bits.push(formatConfigured(snapshot.configured));
	if (snapshot.tokenSource) bits.push(formatTokenSource(snapshot.tokenSource));
	if (snapshot.botTokenSource) bits.push(formatSource("bot", snapshot.botTokenSource));
	if (snapshot.appTokenSource) bits.push(formatSource("app", snapshot.appTokenSource));
	if (snapshot.baseUrl) bits.push(`base=${theme.muted(snapshot.baseUrl)}`);
	if (typeof snapshot.enabled === "boolean") bits.push(formatEnabled(snapshot.enabled));
	return `- ${label}: ${bits.join(", ")}`;
}
async function loadUsageWithProgress(runtime) {
	try {
		return await withProgress({
			label: "Fetching usage snapshot…",
			indeterminate: true,
			enabled: true
		}, async () => await loadProviderUsageSummary());
	} catch (err) {
		runtime.error(String(err));
		return null;
	}
}
async function channelsListCommand(opts, runtime = defaultRuntime) {
	const cfg = await requireValidConfig(runtime);
	if (!cfg) return;
	const includeUsage = opts.usage !== false;
	const plugins = listChannelPlugins();
	const authStore = loadAuthProfileStore();
	const authProfiles = Object.entries(authStore.profiles).map(([profileId, profile]) => ({
		id: profileId,
		provider: profile.provider,
		type: profile.type,
		isExternal: false
	}));
	if (opts.json) {
		const usage = includeUsage ? await loadProviderUsageSummary() : void 0;
		const chat = {};
		for (const plugin of plugins) chat[plugin.id] = plugin.config.listAccountIds(cfg);
		writeRuntimeJson(runtime, {
			chat,
			auth: authProfiles,
			...usage ? { usage } : {}
		});
		return;
	}
	const lines = [];
	lines.push(theme.heading("Chat channels:"));
	for (const plugin of plugins) {
		const accounts = plugin.config.listAccountIds(cfg);
		if (!accounts || accounts.length === 0) continue;
		for (const accountId of accounts) {
			const snapshot = await buildChannelAccountSnapshot({
				plugin,
				cfg,
				accountId
			});
			lines.push(formatAccountLine({
				channel: plugin,
				snapshot
			}));
		}
	}
	lines.push("");
	lines.push(theme.heading("Auth providers (OAuth + API keys):"));
	if (authProfiles.length === 0) lines.push(theme.muted("- none"));
	else for (const profile of authProfiles) {
		const external = profile.isExternal ? theme.muted(" (synced)") : "";
		lines.push(`- ${theme.accent(profile.id)} (${theme.success(profile.type)}${external})`);
	}
	runtime.log(lines.join("\n"));
	if (includeUsage) {
		runtime.log("");
		const usage = await loadUsageWithProgress(runtime);
		if (usage) {
			const usageLines = formatUsageReportLines(usage);
			if (usageLines.length > 0) {
				usageLines[0] = theme.accent(usageLines[0]);
				runtime.log(usageLines.join("\n"));
			}
		}
	}
	runtime.log("");
	runtime.log(`Docs: ${formatDocsLink("/gateway/configuration", "gateway/configuration")}`);
}
//#endregion
//#region src/commands/channels/logs.ts
const DEFAULT_LIMIT = 200;
const MAX_BYTES = 1e6;
const getChannelSet = () => new Set([...listChannelPlugins().map((plugin) => plugin.id), "all"]);
function parseChannelFilter(raw) {
	const trimmed = raw?.trim().toLowerCase();
	if (!trimmed) return "all";
	return getChannelSet().has(trimmed) ? trimmed : "all";
}
function matchesChannel(line, channel) {
	if (channel === "all") return true;
	const needle = `gateway/channels/${channel}`;
	if (line.subsystem?.includes(needle)) return true;
	if (line.module?.includes(channel)) return true;
	return false;
}
async function readTailLines(file, limit) {
	const stat = await fs.stat(file).catch(() => null);
	if (!stat) return [];
	const size = stat.size;
	const start = Math.max(0, size - MAX_BYTES);
	const handle = await fs.open(file, "r");
	try {
		const length = Math.max(0, size - start);
		if (length === 0) return [];
		const buffer = Buffer.alloc(length);
		const readResult = await handle.read(buffer, 0, length, start);
		let lines = buffer.toString("utf8", 0, readResult.bytesRead).split("\n");
		if (start > 0) lines = lines.slice(1);
		if (lines.length && lines[lines.length - 1] === "") lines = lines.slice(0, -1);
		if (lines.length > limit) lines = lines.slice(lines.length - limit);
		return lines;
	} finally {
		await handle.close();
	}
}
async function channelsLogsCommand(opts, runtime = defaultRuntime) {
	const channel = parseChannelFilter(opts.channel);
	const limitRaw = typeof opts.lines === "string" ? Number(opts.lines) : opts.lines;
	const limit = typeof limitRaw === "number" && Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : DEFAULT_LIMIT;
	const file = getResolvedLoggerSettings().file;
	const filtered = (await readTailLines(file, limit * 4)).map(parseLogLine).filter((line) => Boolean(line)).filter((line) => matchesChannel(line, channel));
	const lines = filtered.slice(Math.max(0, filtered.length - limit));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			file,
			channel,
			lines
		});
		return;
	}
	runtime.log(theme.info(`Log file: ${file}`));
	if (channel !== "all") runtime.log(theme.info(`Channel: ${channel}`));
	if (lines.length === 0) {
		runtime.log(theme.muted("No matching log lines."));
		return;
	}
	for (const line of lines) {
		const ts = line.time ? `${line.time} ` : "";
		const level = line.level ? `${line.level.toLowerCase()} ` : "";
		runtime.log(`${ts}${level}${line.message}`.trim());
	}
}
//#endregion
//#region src/commands/channels/remove.ts
function listAccountIds(cfg, channel) {
	const plugin = getChannelPlugin(channel);
	if (!plugin) return [];
	return plugin.config.listAccountIds(cfg);
}
async function channelsRemoveCommand(opts, runtime = defaultRuntime, params) {
	const loadedCfg = await requireValidConfig(runtime);
	if (!loadedCfg) return;
	let cfg = loadedCfg;
	const useWizard = shouldUseWizard(params);
	const prompter = useWizard ? createClackPrompter() : null;
	const rawChannel = opts.channel?.trim() ?? "";
	let channel = normalizeChannelId(rawChannel);
	let accountId = normalizeAccountId(opts.account);
	const deleteConfig = Boolean(opts.delete);
	if (useWizard && prompter) {
		await prompter.intro("Remove channel account");
		const selectedChannel = await prompter.select({
			message: "Channel",
			options: listChannelPlugins().map((plugin) => ({
				value: plugin.id,
				label: plugin.meta.label
			}))
		});
		channel = selectedChannel;
		accountId = await (async () => {
			const ids = listAccountIds(cfg, selectedChannel);
			return normalizeAccountId(await prompter.select({
				message: "Account",
				options: ids.map((id) => ({
					value: id,
					label: id === "default" ? "default (primary)" : id
				})),
				initialValue: ids[0] ?? "default"
			}));
		})();
		if (!await prompter.confirm({
			message: `Disable ${channelLabel(selectedChannel)} account "${accountId}"? (keeps config)`,
			initialValue: true
		})) {
			await prompter.outro("Cancelled.");
			return;
		}
	} else {
		if (!rawChannel) {
			runtime.error("Channel is required. Use --channel <name>.");
			runtime.exit(1);
			return;
		}
		if (!deleteConfig) {
			const confirm = createClackPrompter();
			const channelPromptLabel = channel ? channelLabel(channel) : rawChannel;
			if (!await confirm.confirm({
				message: `Disable ${channelPromptLabel} account "${accountId}"? (keeps config)`,
				initialValue: true
			})) return;
		}
	}
	const resolvedPluginState = !useWizard && rawChannel ? await resolveInstallableChannelPlugin({
		cfg,
		runtime,
		rawChannel,
		allowInstall: true
	}) : null;
	if (resolvedPluginState?.configChanged) cfg = resolvedPluginState.cfg;
	const resolvedChannel = resolvedPluginState?.channelId ?? channel;
	if (!resolvedChannel) {
		runtime.error(`Unknown channel: ${rawChannel}`);
		runtime.exit(1);
		return;
	}
	channel = resolvedChannel;
	const plugin = resolvedPluginState?.plugin ?? getChannelPlugin(resolvedChannel);
	if (!plugin) {
		runtime.error(`Unknown channel: ${resolvedChannel}`);
		runtime.exit(1);
		return;
	}
	const resolvedChannelId = resolvedChannel;
	const resolvedAccountId = normalizeAccountId(accountId) ?? resolveChannelDefaultAccountId({
		plugin,
		cfg
	});
	const accountKey = resolvedAccountId || "default";
	let next = { ...cfg };
	const prevCfg = cfg;
	if (deleteConfig) {
		if (!plugin.config.deleteAccount) {
			runtime.error(`Channel ${channel} does not support delete.`);
			runtime.exit(1);
			return;
		}
		next = plugin.config.deleteAccount({
			cfg: next,
			accountId: resolvedAccountId
		});
		await plugin.lifecycle?.onAccountRemoved?.({
			prevCfg,
			accountId: resolvedAccountId,
			runtime
		});
	} else {
		if (!plugin.config.setAccountEnabled) {
			runtime.error(`Channel ${channel} does not support disable.`);
			runtime.exit(1);
			return;
		}
		next = plugin.config.setAccountEnabled({
			cfg: next,
			accountId: resolvedAccountId,
			enabled: false
		});
		await plugin.lifecycle?.onAccountConfigChanged?.({
			prevCfg,
			nextCfg: next,
			accountId: resolvedAccountId,
			runtime
		});
	}
	await writeConfigFile(next);
	if (useWizard && prompter) await prompter.outro(deleteConfig ? `Deleted ${channelLabel(resolvedChannelId)} account "${accountKey}".` : `Disabled ${channelLabel(resolvedChannelId)} account "${accountKey}".`);
	else runtime.log(deleteConfig ? `Deleted ${channelLabel(resolvedChannelId)} account "${accountKey}".` : `Disabled ${channelLabel(resolvedChannelId)} account "${accountKey}".`);
}
//#endregion
//#region src/commands/channels/resolve.ts
function resolvePreferredKind(kind) {
	if (!kind || kind === "auto") return;
	if (kind === "user") return "user";
	return "group";
}
function detectAutoKind(input) {
	const trimmed = input.trim();
	if (!trimmed) return "group";
	if (trimmed.startsWith("@")) return "user";
	if (/^<@!?/.test(trimmed)) return "user";
	if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "user";
	if (/^(user|discord|slack|matrix|msteams|teams|zalo|zalouser|googlechat|google-chat|gchat):/i.test(trimmed)) return "user";
	return "group";
}
function formatResolveResult(result) {
	if (!result.resolved || !result.id) return `${result.input} -> unresolved`;
	const name = result.name ? ` (${result.name})` : "";
	const note = result.note ? ` [${result.note}]` : "";
	return `${result.input} -> ${result.id}${name}${note}`;
}
async function channelsResolveCommand(opts, runtime) {
	const { resolvedConfig, diagnostics } = await resolveCommandSecretRefsViaGateway({
		config: loadConfig(),
		commandName: "channels resolve",
		targetIds: getChannelsCommandSecretTargetIds(),
		mode: "read_only_operational"
	});
	let cfg = applyPluginAutoEnable({
		config: resolvedConfig,
		env: process.env
	}).config;
	for (const entry of diagnostics) runtime.log(`[secrets] ${entry}`);
	const entries = (opts.entries ?? []).map((entry) => entry.trim()).filter(Boolean);
	if (entries.length === 0) throw new Error("At least one entry is required.");
	const explicitChannel = opts.channel?.trim();
	const resolvedExplicit = explicitChannel ? await resolveInstallableChannelPlugin({
		cfg,
		runtime,
		rawChannel: explicitChannel,
		allowInstall: true,
		supports: (plugin) => Boolean(plugin.resolver?.resolveTargets)
	}) : null;
	if (resolvedExplicit?.configChanged) {
		cfg = resolvedExplicit.cfg;
		await writeConfigFile(cfg);
	}
	const selection = explicitChannel ? { channel: resolvedExplicit?.channelId } : await resolveMessageChannelSelection({
		cfg,
		channel: opts.channel ?? null
	});
	const plugin = (explicitChannel ? resolvedExplicit?.plugin : void 0) ?? (selection.channel ? getChannelPlugin(selection.channel) : void 0);
	if (!plugin?.resolver?.resolveTargets) {
		const channelText = selection.channel ?? explicitChannel ?? "";
		throw new Error(`Channel ${channelText} does not support resolve.`);
	}
	const preferredKind = resolvePreferredKind(opts.kind);
	let results = [];
	if (preferredKind) results = (await plugin.resolver.resolveTargets({
		cfg,
		accountId: opts.account ?? null,
		inputs: entries,
		kind: preferredKind,
		runtime
	})).map((entry) => ({
		input: entry.input,
		resolved: entry.resolved,
		id: entry.id,
		name: entry.name,
		note: entry.note
	}));
	else {
		const byKind = /* @__PURE__ */ new Map();
		for (const entry of entries) {
			const kind = detectAutoKind(entry);
			byKind.set(kind, [...byKind.get(kind) ?? [], entry]);
		}
		const resolved = [];
		for (const [kind, inputs] of byKind.entries()) {
			const batch = await plugin.resolver.resolveTargets({
				cfg,
				accountId: opts.account ?? null,
				inputs,
				kind,
				runtime
			});
			resolved.push(...batch);
		}
		const byInput = new Map(resolved.map((entry) => [entry.input, entry]));
		results = entries.map((input) => {
			const entry = byInput.get(input);
			return {
				input,
				resolved: entry?.resolved ?? false,
				id: entry?.id,
				name: entry?.name,
				note: entry?.note
			};
		});
	}
	if (opts.json) {
		writeRuntimeJson(runtime, results);
		return;
	}
	for (const result of results) if (result.resolved && result.id) runtime.log(formatResolveResult(result));
	else runtime.error(danger(`${result.input} -> unresolved${result.error ? ` (${result.error})` : result.note ? ` (${result.note})` : ""}`));
}
//#endregion
//#region src/commands/channels/status.ts
function appendEnabledConfiguredLinkedBits(bits, account) {
	if (typeof account.enabled === "boolean") bits.push(account.enabled ? "enabled" : "disabled");
	if (typeof account.configured === "boolean") if (account.configured) {
		bits.push("configured");
		if (hasConfiguredUnavailableCredentialStatus(account)) bits.push("secret unavailable in this command path");
	} else bits.push("not configured");
	if (typeof account.linked === "boolean") bits.push(account.linked ? "linked" : "not linked");
}
function appendModeBit(bits, account) {
	if (typeof account.mode === "string" && account.mode.length > 0) bits.push(`mode:${account.mode}`);
}
function appendTokenSourceBits(bits, account) {
	const appendSourceBit = (label, sourceKey, statusKey) => {
		const source = account[sourceKey];
		if (typeof source !== "string" || !source || source === "none") return;
		const unavailable = account[statusKey] === "configured_unavailable" ? " (unavailable)" : "";
		bits.push(`${label}:${source}${unavailable}`);
	};
	appendSourceBit("token", "tokenSource", "tokenStatus");
	appendSourceBit("bot", "botTokenSource", "botTokenStatus");
	appendSourceBit("app", "appTokenSource", "appTokenStatus");
	appendSourceBit("signing", "signingSecretSource", "signingSecretStatus");
}
function appendBaseUrlBit(bits, account) {
	if (typeof account.baseUrl === "string" && account.baseUrl) bits.push(`url:${account.baseUrl}`);
}
function buildChannelAccountLine(provider, account, bits) {
	return `- ${formatChannelAccountLabel({
		channel: provider,
		accountId: typeof account.accountId === "string" ? account.accountId : "default",
		name: (typeof account.name === "string" ? account.name.trim() : "") || void 0
	})}: ${bits.join(", ")}`;
}
function formatGatewayChannelsStatusLines(payload) {
	const lines = [];
	lines.push(theme.success("Gateway reachable."));
	const accountLines = (provider, accounts) => accounts.map((account) => {
		const bits = [];
		appendEnabledConfiguredLinkedBits(bits, account);
		if (typeof account.running === "boolean") bits.push(account.running ? "running" : "stopped");
		if (typeof account.connected === "boolean") bits.push(account.connected ? "connected" : "disconnected");
		const inboundAt = typeof account.lastInboundAt === "number" && Number.isFinite(account.lastInboundAt) ? account.lastInboundAt : null;
		const outboundAt = typeof account.lastOutboundAt === "number" && Number.isFinite(account.lastOutboundAt) ? account.lastOutboundAt : null;
		if (inboundAt) bits.push(`in:${formatTimeAgo(Date.now() - inboundAt)}`);
		if (outboundAt) bits.push(`out:${formatTimeAgo(Date.now() - outboundAt)}`);
		appendModeBit(bits, account);
		const botUsername = (() => {
			const bot = account.bot;
			const probeBot = account.probe?.bot;
			const raw = bot?.username ?? probeBot?.username ?? "";
			if (typeof raw !== "string") return "";
			const trimmed = raw.trim();
			if (!trimmed) return "";
			return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
		})();
		if (botUsername) bits.push(`bot:${botUsername}`);
		if (typeof account.dmPolicy === "string" && account.dmPolicy.length > 0) bits.push(`dm:${account.dmPolicy}`);
		if (Array.isArray(account.allowFrom) && account.allowFrom.length > 0) bits.push(`allow:${account.allowFrom.slice(0, 2).join(",")}`);
		appendTokenSourceBits(bits, account);
		const messageContent = account.application?.intents?.messageContent;
		if (typeof messageContent === "string" && messageContent.length > 0 && messageContent !== "enabled") bits.push(`intents:content=${messageContent}`);
		if (account.allowUnmentionedGroups === true) bits.push("groups:unmentioned");
		appendBaseUrlBit(bits, account);
		const probe = account.probe;
		if (probe && typeof probe.ok === "boolean") bits.push(probe.ok ? "works" : "probe failed");
		const audit = account.audit;
		if (audit && typeof audit.ok === "boolean") bits.push(audit.ok ? "audit ok" : "audit failed");
		if (typeof account.lastError === "string" && account.lastError) bits.push(`error:${account.lastError}`);
		return buildChannelAccountLine(provider, account, bits);
	});
	const plugins = listChannelPlugins();
	const accountsByChannel = payload.channelAccounts;
	const accountPayloads = {};
	for (const plugin of plugins) {
		const raw = accountsByChannel?.[plugin.id];
		if (Array.isArray(raw)) accountPayloads[plugin.id] = raw;
	}
	for (const plugin of plugins) {
		const accounts = accountPayloads[plugin.id];
		if (accounts && accounts.length > 0) lines.push(...accountLines(plugin.id, accounts));
	}
	lines.push("");
	const issues = collectChannelStatusIssues(payload);
	if (issues.length > 0) {
		lines.push(theme.warn("Warnings:"));
		for (const issue of issues) lines.push(`- ${issue.channel} ${issue.accountId}: ${issue.message}${issue.fix ? ` (${issue.fix})` : ""}`);
		lines.push(`- Run: ${formatCliCommand("openclaw doctor")}`);
		lines.push("");
	}
	lines.push(`Tip: ${formatDocsLink("/cli#status", "status --deep")} adds gateway health probes to status output (requires a reachable gateway).`);
	return lines;
}
async function formatConfigChannelsStatusLines(cfg, meta, opts) {
	const lines = [];
	lines.push(theme.warn("Gateway not reachable; showing config-only status."));
	if (meta.path) lines.push(`Config: ${meta.path}`);
	if (meta.mode) lines.push(`Mode: ${meta.mode}`);
	if (meta.path || meta.mode) lines.push("");
	const accountLines = (provider, accounts) => accounts.map((account) => {
		const bits = [];
		appendEnabledConfiguredLinkedBits(bits, account);
		appendModeBit(bits, account);
		appendTokenSourceBits(bits, account);
		appendBaseUrlBit(bits, account);
		return buildChannelAccountLine(provider, account, bits);
	});
	const plugins = listChannelPlugins();
	const sourceConfig = opts?.sourceConfig ?? cfg;
	for (const plugin of plugins) {
		const accountIds = plugin.config.listAccountIds(cfg);
		if (!accountIds.length) continue;
		const snapshots = [];
		for (const accountId of accountIds) {
			const sourceSnapshot = await buildReadOnlySourceChannelAccountSnapshot({
				plugin,
				cfg: sourceConfig,
				accountId
			});
			const resolvedSnapshot = await buildChannelAccountSnapshot({
				plugin,
				cfg,
				accountId
			});
			snapshots.push(sourceSnapshot && hasConfiguredUnavailableCredentialStatus(sourceSnapshot) && (!hasResolvedCredentialValue(resolvedSnapshot) || sourceSnapshot.configured === true && resolvedSnapshot.configured === false) ? sourceSnapshot : resolvedSnapshot);
		}
		if (snapshots.length > 0) lines.push(...accountLines(plugin.id, snapshots));
	}
	lines.push("");
	lines.push(`Tip: ${formatDocsLink("/cli#status", "status --deep")} adds gateway health probes to status output (requires a reachable gateway).`);
	return lines;
}
async function channelsStatusCommand(opts, runtime = defaultRuntime) {
	const timeoutMs = Number(opts.timeout ?? 1e4);
	const statusLabel = opts.probe ? "Checking channel status (probe)…" : "Checking channel status…";
	if (opts.json !== true && !process.stderr.isTTY) runtime.log(statusLabel);
	try {
		const payload = await withProgress({
			label: statusLabel,
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => await callGateway({
			method: "channels.status",
			params: {
				probe: Boolean(opts.probe),
				timeoutMs
			},
			timeoutMs
		}));
		if (opts.json) {
			writeRuntimeJson(runtime, payload);
			return;
		}
		runtime.log(formatGatewayChannelsStatusLines(payload).join("\n"));
	} catch (err) {
		runtime.error(`Gateway not reachable: ${String(err)}`);
		const cfg = await requireValidConfigSnapshot(runtime);
		if (!cfg) return;
		const { resolvedConfig, diagnostics } = await resolveCommandSecretRefsViaGateway({
			config: cfg,
			commandName: "channels status",
			targetIds: getChannelsCommandSecretTargetIds(),
			mode: "read_only_status"
		});
		for (const entry of diagnostics) runtime.log(`[secrets] ${entry}`);
		const snapshot = await readConfigFileSnapshot();
		const mode = cfg.gateway?.mode === "remote" ? "remote" : "local";
		runtime.log((await formatConfigChannelsStatusLines(resolvedConfig, {
			path: snapshot.path,
			mode
		}, { sourceConfig: cfg })).join("\n"));
	}
}
//#endregion
export { channelsAddCommand, channelsCapabilitiesCommand, channelsListCommand, channelsLogsCommand, channelsRemoveCommand, channelsResolveCommand, channelsStatusCommand };
