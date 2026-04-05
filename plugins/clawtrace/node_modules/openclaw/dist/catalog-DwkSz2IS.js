import { h as resolveConfigDir, u as isRecord, v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-C-5WlcYo.js";
import { n as MANIFEST_KEY } from "./legacy-names-C7vyNTNf.js";
import { h as loadPluginManifest } from "./min-host-version-VYpMQhVm.js";
import { i as discoverOpenClawPlugins, s as resolveBundledPluginsDir } from "./manifest-registry-BYS0nlrs.js";
import fsSync from "node:fs";
import path from "node:path";
//#region src/channels/plugins/catalog.ts
const ORIGIN_PRIORITY = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
const EXTERNAL_CATALOG_PRIORITY = ORIGIN_PRIORITY.bundled + 1;
const FALLBACK_CATALOG_PRIORITY = EXTERNAL_CATALOG_PRIORITY + 1;
const ENV_CATALOG_PATHS = ["OPENCLAW_PLUGIN_CATALOG_PATHS", "OPENCLAW_MPM_CATALOG_PATHS"];
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
function parseCatalogEntries(raw) {
	if (Array.isArray(raw)) return raw.filter((entry) => isRecord(entry));
	if (!isRecord(raw)) return [];
	const list = raw.entries ?? raw.packages ?? raw.plugins;
	if (!Array.isArray(list)) return [];
	return list.filter((entry) => isRecord(entry));
}
function splitEnvPaths(value) {
	const trimmed = value.trim();
	if (!trimmed) return [];
	return trimmed.split(/[;,]/g).flatMap((chunk) => chunk.split(path.delimiter)).map((entry) => entry.trim()).filter(Boolean);
}
function resolveDefaultCatalogPaths(env) {
	const configDir = resolveConfigDir(env);
	return [
		path.join(configDir, "mpm", "plugins.json"),
		path.join(configDir, "mpm", "catalog.json"),
		path.join(configDir, "plugins", "catalog.json")
	];
}
function resolveExternalCatalogPaths(options) {
	if (options.catalogPaths && options.catalogPaths.length > 0) return options.catalogPaths.map((entry) => entry.trim()).filter(Boolean);
	const env = options.env ?? process.env;
	for (const key of ENV_CATALOG_PATHS) {
		const raw = env[key];
		if (raw && raw.trim()) return splitEnvPaths(raw);
	}
	return resolveDefaultCatalogPaths(env);
}
function loadExternalCatalogEntries(options) {
	return loadCatalogEntriesFromPaths(resolveExternalCatalogPaths(options).map((rawPath) => resolveUserPath(rawPath, options.env ?? process.env)));
}
function loadCatalogEntriesFromPaths(paths) {
	const entries = [];
	for (const resolvedPath of paths) {
		if (!fsSync.existsSync(resolvedPath)) continue;
		try {
			const payload = JSON.parse(fsSync.readFileSync(resolvedPath, "utf-8"));
			entries.push(...parseCatalogEntries(payload));
		} catch {}
	}
	return entries;
}
function resolveOfficialCatalogPaths(options) {
	if (options.officialCatalogPaths && options.officialCatalogPaths.length > 0) return options.officialCatalogPaths.map((entry) => entry.trim()).filter(Boolean);
	const candidates = [resolveOpenClawPackageRootSync({ cwd: process.cwd() }), resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })].filter((entry, index, all) => Boolean(entry) && all.indexOf(entry) === index).map((packageRoot) => path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
	if (process.execPath) {
		const execDir = path.dirname(process.execPath);
		candidates.push(path.join(execDir, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
		candidates.push(path.join(execDir, "channel-catalog.json"));
	}
	return candidates.filter((entry, index, all) => entry && all.indexOf(entry) === index);
}
function loadOfficialCatalogEntries(options) {
	return loadCatalogEntriesFromPaths(resolveOfficialCatalogPaths(options)).map((entry) => buildExternalCatalogEntry(entry)).filter((entry) => Boolean(entry));
}
function toChannelMeta(params) {
	const label = params.channel.label?.trim();
	if (!label) return null;
	const selectionLabel = params.channel.selectionLabel?.trim() || label;
	const detailLabel = params.channel.detailLabel?.trim();
	const docsPath = params.channel.docsPath?.trim() || `/channels/${params.id}`;
	const blurb = params.channel.blurb?.trim() || "";
	const systemImage = params.channel.systemImage?.trim();
	return {
		id: params.id,
		label,
		selectionLabel,
		...detailLabel ? { detailLabel } : {},
		docsPath,
		docsLabel: params.channel.docsLabel?.trim() || void 0,
		blurb,
		...params.channel.aliases ? { aliases: params.channel.aliases } : {},
		...params.channel.preferOver ? { preferOver: params.channel.preferOver } : {},
		...params.channel.order !== void 0 ? { order: params.channel.order } : {},
		...params.channel.selectionDocsPrefix ? { selectionDocsPrefix: params.channel.selectionDocsPrefix } : {},
		...params.channel.selectionDocsOmitLabel !== void 0 ? { selectionDocsOmitLabel: params.channel.selectionDocsOmitLabel } : {},
		...params.channel.selectionExtras ? { selectionExtras: params.channel.selectionExtras } : {},
		...systemImage ? { systemImage } : {},
		...params.channel.markdownCapable !== void 0 ? { markdownCapable: params.channel.markdownCapable } : {},
		...params.channel.showConfigured !== void 0 ? { showConfigured: params.channel.showConfigured } : {},
		...params.channel.quickstartAllowFrom !== void 0 ? { quickstartAllowFrom: params.channel.quickstartAllowFrom } : {},
		...params.channel.forceAccountBinding !== void 0 ? { forceAccountBinding: params.channel.forceAccountBinding } : {},
		...params.channel.preferSessionLookupForAnnounceTarget !== void 0 ? { preferSessionLookupForAnnounceTarget: params.channel.preferSessionLookupForAnnounceTarget } : {}
	};
}
function resolveInstallInfo(params) {
	const npmSpec = params.manifest.install?.npmSpec?.trim() ?? params.packageName?.trim();
	if (!npmSpec) return null;
	let localPath = params.manifest.install?.localPath?.trim() || void 0;
	if (!localPath && params.workspaceDir && params.packageDir) localPath = path.relative(params.workspaceDir, params.packageDir) || void 0;
	const defaultChoice = params.manifest.install?.defaultChoice ?? (localPath ? "local" : "npm");
	return {
		npmSpec,
		...localPath ? { localPath } : {},
		...defaultChoice ? { defaultChoice } : {}
	};
}
function resolveCatalogPluginId(params) {
	const manifestDir = params.packageDir ?? params.rootDir;
	if (manifestDir) {
		const manifest = loadPluginManifest(manifestDir, params.origin !== "bundled");
		if (manifest.ok) return manifest.manifest.id;
	}
}
function buildCatalogEntry(candidate) {
	const manifest = candidate.packageManifest;
	if (!manifest?.channel) return null;
	const id = manifest.channel.id?.trim();
	if (!id) return null;
	const meta = toChannelMeta({
		channel: manifest.channel,
		id
	});
	if (!meta) return null;
	const install = resolveInstallInfo({
		manifest,
		packageName: candidate.packageName,
		packageDir: candidate.packageDir,
		workspaceDir: candidate.workspaceDir
	});
	if (!install) return null;
	const pluginId = resolveCatalogPluginId({
		packageDir: candidate.packageDir,
		rootDir: candidate.rootDir,
		origin: candidate.origin
	});
	return {
		id,
		...pluginId ? { pluginId } : {},
		meta,
		install
	};
}
function buildExternalCatalogEntry(entry) {
	const manifest = entry[MANIFEST_KEY];
	return buildCatalogEntry({
		packageName: entry.name,
		packageManifest: manifest
	});
}
function loadBundledMetadataCatalogEntries(options) {
	const bundledDir = resolveBundledPluginsDir(options.env ?? process.env);
	if (!bundledDir || !fsSync.existsSync(bundledDir)) return [];
	const entries = [];
	for (const dirent of fsSync.readdirSync(bundledDir, { withFileTypes: true })) {
		if (!dirent.isDirectory()) continue;
		const pluginDir = path.join(bundledDir, dirent.name);
		const packageJsonPath = path.join(pluginDir, "package.json");
		if (!fsSync.existsSync(packageJsonPath)) continue;
		let packageJson;
		try {
			packageJson = JSON.parse(fsSync.readFileSync(packageJsonPath, "utf8"));
		} catch {
			continue;
		}
		const entry = buildCatalogEntry({
			packageName: packageJson.name,
			packageDir: pluginDir,
			rootDir: pluginDir,
			origin: "bundled",
			workspaceDir: options.workspaceDir,
			packageManifest: packageJson.openclaw
		});
		if (entry) entries.push(entry);
	}
	return entries;
}
function buildChannelUiCatalog(plugins) {
	const entries = plugins.map((plugin) => {
		const detailLabel = plugin.meta.detailLabel ?? plugin.meta.selectionLabel ?? plugin.meta.label;
		return {
			id: plugin.id,
			label: plugin.meta.label,
			detailLabel,
			...plugin.meta.systemImage ? { systemImage: plugin.meta.systemImage } : {}
		};
	});
	const order = entries.map((entry) => entry.id);
	const labels = {};
	const detailLabels = {};
	const systemImages = {};
	const byId = {};
	for (const entry of entries) {
		labels[entry.id] = entry.label;
		detailLabels[entry.id] = entry.detailLabel;
		if (entry.systemImage) systemImages[entry.id] = entry.systemImage;
		byId[entry.id] = entry;
	}
	return {
		entries,
		order,
		labels,
		detailLabels,
		systemImages,
		byId
	};
}
function listChannelPluginCatalogEntries(options = {}) {
	const discovery = discoverOpenClawPlugins({
		workspaceDir: options.workspaceDir,
		env: options.env
	});
	const resolved = /* @__PURE__ */ new Map();
	for (const candidate of discovery.candidates) {
		const entry = buildCatalogEntry(candidate);
		if (!entry) continue;
		const priority = ORIGIN_PRIORITY[candidate.origin] ?? 99;
		const existing = resolved.get(entry.id);
		if (!existing || priority < existing.priority) resolved.set(entry.id, {
			entry,
			priority
		});
	}
	for (const entry of loadBundledMetadataCatalogEntries(options)) {
		const priority = FALLBACK_CATALOG_PRIORITY;
		const existing = resolved.get(entry.id);
		if (!existing || priority < existing.priority) resolved.set(entry.id, {
			entry,
			priority
		});
	}
	for (const entry of loadOfficialCatalogEntries(options)) {
		const priority = FALLBACK_CATALOG_PRIORITY;
		const existing = resolved.get(entry.id);
		if (!existing || priority < existing.priority) resolved.set(entry.id, {
			entry,
			priority
		});
	}
	const externalEntries = loadExternalCatalogEntries(options).map((entry) => buildExternalCatalogEntry(entry)).filter((entry) => Boolean(entry));
	for (const entry of externalEntries) {
		const priority = EXTERNAL_CATALOG_PRIORITY;
		const existing = resolved.get(entry.id);
		if (!existing || priority < existing.priority) resolved.set(entry.id, {
			entry,
			priority
		});
	}
	return Array.from(resolved.values()).map(({ entry }) => entry).toSorted((a, b) => {
		const orderA = a.meta.order ?? 999;
		const orderB = b.meta.order ?? 999;
		if (orderA !== orderB) return orderA - orderB;
		return a.meta.label.localeCompare(b.meta.label);
	});
}
function getChannelPluginCatalogEntry(id, options = {}) {
	const trimmed = id.trim();
	if (!trimmed) return;
	return listChannelPluginCatalogEntries(options).find((entry) => entry.id === trimmed);
}
//#endregion
export { getChannelPluginCatalogEntry as n, listChannelPluginCatalogEntries as r, buildChannelUiCatalog as t };
