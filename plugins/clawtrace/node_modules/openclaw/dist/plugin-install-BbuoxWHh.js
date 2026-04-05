import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { Ds as applyPluginAutoEnable, RN as loadOpenClawPlugins, zA as createPluginLoaderLogger } from "./auth-profiles-B5ypC5S-.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { n as enablePluginInConfig } from "./provider-web-search-I-919IKa.js";
import "./runtime-DgxFwo8V.js";
import { r as clearPluginDiscoveryCache } from "./manifest-registry-BYS0nlrs.js";
import { r as installPluginFromNpmSpec } from "./install-ByeIRSW_.js";
import { n as recordPluginInstall, t as buildNpmResolutionInstallFields } from "./installs-DN8Cz1b5.js";
import { n as resolveBundledInstallPlanForCatalogEntry } from "./plugin-install-plan-e7CNIXsL.js";
import { n as findBundledPluginSourceInMap, r as resolveBundledPluginSources } from "./bundled-sources-BCjEcE0z.js";
import fsSync from "node:fs";
import path from "node:path";
//#region src/commands/channel-setup/plugin-install.ts
function hasGitWorkspace(workspaceDir) {
	const candidates = /* @__PURE__ */ new Set();
	candidates.add(path.join(process.cwd(), ".git"));
	if (workspaceDir && workspaceDir !== process.cwd()) candidates.add(path.join(workspaceDir, ".git"));
	for (const candidate of candidates) if (fsSync.existsSync(candidate)) return true;
	return false;
}
function resolveLocalPath(entry, workspaceDir, allowLocal) {
	if (!allowLocal) return null;
	const raw = entry.install.localPath?.trim();
	if (!raw) return null;
	const candidates = /* @__PURE__ */ new Set();
	candidates.add(path.resolve(process.cwd(), raw));
	if (workspaceDir && workspaceDir !== process.cwd()) candidates.add(path.resolve(workspaceDir, raw));
	for (const candidate of candidates) if (fsSync.existsSync(candidate)) return candidate;
	return null;
}
function addPluginLoadPath(cfg, pluginPath) {
	const existing = cfg.plugins?.load?.paths ?? [];
	const merged = Array.from(new Set([...existing, pluginPath]));
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			load: {
				...cfg.plugins?.load,
				paths: merged
			}
		}
	};
}
async function promptInstallChoice(params) {
	const { entry, localPath, prompter, defaultChoice } = params;
	const localOptions = localPath ? [{
		value: "local",
		label: "Use local plugin path",
		hint: localPath
	}] : [];
	const options = [
		{
			value: "npm",
			label: `Download from npm (${entry.install.npmSpec})`
		},
		...localOptions,
		{
			value: "skip",
			label: "Skip for now"
		}
	];
	const initialValue = defaultChoice === "local" && !localPath ? "npm" : defaultChoice;
	return await prompter.select({
		message: `Install ${entry.meta.label} plugin?`,
		options,
		initialValue
	});
}
function resolveInstallDefaultChoice(params) {
	const { cfg, entry, localPath, bundledLocalPath } = params;
	if (bundledLocalPath) return "local";
	const updateChannel = cfg.update?.channel;
	if (updateChannel === "dev") return localPath ? "local" : "npm";
	if (updateChannel === "stable" || updateChannel === "beta") return "npm";
	const entryDefault = entry.install.defaultChoice;
	if (entryDefault === "local") return localPath ? "local" : "npm";
	if (entryDefault === "npm") return "npm";
	return localPath ? "local" : "npm";
}
async function ensureChannelSetupPluginInstalled(params) {
	const { entry, prompter, runtime, workspaceDir } = params;
	let next = params.cfg;
	const allowLocal = hasGitWorkspace(workspaceDir);
	const bundledSources = resolveBundledPluginSources({ workspaceDir });
	const bundledLocalPath = resolveBundledInstallPlanForCatalogEntry({
		pluginId: entry.id,
		npmSpec: entry.install.npmSpec,
		findBundledSource: (lookup) => findBundledPluginSourceInMap({
			bundled: bundledSources,
			lookup
		})
	})?.bundledSource.localPath ?? null;
	const localPath = bundledLocalPath ?? resolveLocalPath(entry, workspaceDir, allowLocal);
	const choice = await promptInstallChoice({
		entry,
		localPath,
		defaultChoice: resolveInstallDefaultChoice({
			cfg: next,
			entry,
			localPath,
			bundledLocalPath
		}),
		prompter
	});
	if (choice === "skip") return {
		cfg: next,
		installed: false
	};
	if (choice === "local" && localPath) {
		next = addPluginLoadPath(next, localPath);
		const pluginId = entry.pluginId ?? entry.id;
		next = enablePluginInConfig(next, pluginId).config;
		return {
			cfg: next,
			installed: true,
			pluginId
		};
	}
	const result = await installPluginFromNpmSpec({
		spec: entry.install.npmSpec,
		logger: {
			info: (msg) => runtime.log?.(msg),
			warn: (msg) => runtime.log?.(msg)
		}
	});
	if (result.ok) {
		next = enablePluginInConfig(next, result.pluginId).config;
		next = recordPluginInstall(next, {
			pluginId: result.pluginId,
			source: "npm",
			spec: entry.install.npmSpec,
			installPath: result.targetDir,
			version: result.version,
			...buildNpmResolutionInstallFields(result.npmResolution)
		});
		return {
			cfg: next,
			installed: true,
			pluginId: result.pluginId
		};
	}
	await prompter.note(`Failed to install ${entry.install.npmSpec}: ${result.error}`, "Plugin install");
	if (localPath) {
		if (await prompter.confirm({
			message: `Use local plugin path instead? (${localPath})`,
			initialValue: true
		})) {
			next = addPluginLoadPath(next, localPath);
			const pluginId = entry.pluginId ?? entry.id;
			next = enablePluginInConfig(next, pluginId).config;
			return {
				cfg: next,
				installed: true,
				pluginId
			};
		}
	}
	runtime.error?.(`Plugin install failed: ${result.error}`);
	return {
		cfg: next,
		installed: false
	};
}
function loadChannelSetupPluginRegistry(params) {
	clearPluginDiscoveryCache();
	const resolvedConfig = applyPluginAutoEnable({
		config: params.cfg,
		env: process.env
	}).config;
	return loadOpenClawPlugins({
		config: resolvedConfig,
		workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(resolvedConfig, resolveDefaultAgentId(resolvedConfig)),
		cache: false,
		logger: createPluginLoaderLogger(createSubsystemLogger("plugins")),
		onlyPluginIds: params.onlyPluginIds,
		includeSetupOnlyChannelPlugins: true,
		activate: params.activate
	});
}
function loadChannelSetupPluginRegistrySnapshotForChannel(params) {
	return loadChannelSetupPluginRegistry({
		...params,
		onlyPluginIds: [params.pluginId ?? params.channel],
		activate: false
	});
}
//#endregion
export { loadChannelSetupPluginRegistrySnapshotForChannel as n, ensureChannelSetupPluginInstalled as t };
