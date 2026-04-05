import { h as loadPluginManifest } from "./min-host-version-VYpMQhVm.js";
import { i as discoverOpenClawPlugins } from "./manifest-registry-BYS0nlrs.js";
//#region src/plugins/bundled-sources.ts
function findBundledPluginSourceInMap(params) {
	const targetValue = params.lookup.value.trim();
	if (!targetValue) return;
	if (params.lookup.kind === "pluginId") return params.bundled.get(targetValue);
	for (const source of params.bundled.values()) if (source.npmSpec === targetValue) return source;
}
function resolveBundledPluginSources(params) {
	const discovery = discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const bundled = /* @__PURE__ */ new Map();
	for (const candidate of discovery.candidates) {
		if (candidate.origin !== "bundled") continue;
		const manifest = loadPluginManifest(candidate.rootDir, false);
		if (!manifest.ok) continue;
		const pluginId = manifest.manifest.id;
		if (bundled.has(pluginId)) continue;
		const npmSpec = candidate.packageManifest?.install?.npmSpec?.trim() || candidate.packageName?.trim() || void 0;
		bundled.set(pluginId, {
			pluginId,
			localPath: candidate.rootDir,
			npmSpec
		});
	}
	return bundled;
}
function findBundledPluginSource(params) {
	return findBundledPluginSourceInMap({
		bundled: resolveBundledPluginSources({
			workspaceDir: params.workspaceDir,
			env: params.env
		}),
		lookup: params.lookup
	});
}
//#endregion
export { findBundledPluginSourceInMap as n, resolveBundledPluginSources as r, findBundledPluginSource as t };
