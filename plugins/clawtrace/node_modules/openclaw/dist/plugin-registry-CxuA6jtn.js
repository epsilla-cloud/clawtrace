import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { Ds as applyPluginAutoEnable, RN as loadOpenClawPlugins, f as loadConfig } from "./auth-profiles-B5ypC5S-.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { r as getActivePluginRegistry } from "./runtime-DgxFwo8V.js";
import "./logging-S_1ymJjU.js";
import { n as resolveConfiguredChannelPluginIds, t as resolveChannelPluginIds } from "./channel-plugin-ids-BoWNKjWn.js";
//#region src/cli/plugin-registry.ts
const log = createSubsystemLogger("plugins");
let pluginRegistryLoaded = "none";
function scopeRank(scope) {
	switch (scope) {
		case "none": return 0;
		case "configured-channels": return 1;
		case "channels": return 2;
		case "all": return 3;
	}
}
function activeRegistrySatisfiesScope(scope, active, expectedChannelPluginIds) {
	if (!active) return false;
	const activeChannelPluginIds = new Set(active.channels.map((entry) => entry.plugin.id));
	switch (scope) {
		case "configured-channels":
		case "channels": return active.channels.length > 0 && expectedChannelPluginIds.every((pluginId) => activeChannelPluginIds.has(pluginId));
		case "all": return false;
	}
}
function ensurePluginRegistryLoaded(options) {
	const scope = options?.scope ?? "all";
	if (scopeRank(pluginRegistryLoaded) >= scopeRank(scope)) return;
	const resolvedConfig = applyPluginAutoEnable({
		config: loadConfig(),
		env: process.env
	}).config;
	const workspaceDir = resolveAgentWorkspaceDir(resolvedConfig, resolveDefaultAgentId(resolvedConfig));
	const expectedChannelPluginIds = scope === "configured-channels" ? resolveConfiguredChannelPluginIds({
		config: resolvedConfig,
		workspaceDir,
		env: process.env
	}) : scope === "channels" ? resolveChannelPluginIds({
		config: resolvedConfig,
		workspaceDir,
		env: process.env
	}) : [];
	const active = getActivePluginRegistry();
	if (pluginRegistryLoaded === "none" && activeRegistrySatisfiesScope(scope, active, expectedChannelPluginIds)) {
		pluginRegistryLoaded = scope;
		return;
	}
	loadOpenClawPlugins({
		config: resolvedConfig,
		workspaceDir,
		logger: {
			info: (msg) => log.info(msg),
			warn: (msg) => log.warn(msg),
			error: (msg) => log.error(msg),
			debug: (msg) => log.debug(msg)
		},
		throwOnLoadError: true,
		...scope === "configured-channels" ? { onlyPluginIds: expectedChannelPluginIds } : scope === "channels" ? { onlyPluginIds: expectedChannelPluginIds } : {}
	});
	pluginRegistryLoaded = scope;
}
//#endregion
export { ensurePluginRegistryLoaded as t };
