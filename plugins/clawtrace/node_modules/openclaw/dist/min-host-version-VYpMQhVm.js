import { u as isRecord } from "./utils-BfvDpbwh.js";
import { s as isPathInside$1 } from "./boundary-path-Ci-Gk9P9.js";
import { i as openBoundaryFileSync, n as matchBoundaryFileOpenFailure } from "./boundary-file-read-7v-hs51G.js";
import { n as MANIFEST_KEY } from "./legacy-names-C7vyNTNf.js";
import { a as parseSemver, n as isAtLeast } from "./runtime-guard-CV-PHKDn.js";
import fsSync from "node:fs";
import path from "node:path";
//#region src/plugins/manifest.ts
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
const PLUGIN_MANIFEST_FILENAMES = [PLUGIN_MANIFEST_FILENAME];
function normalizeStringList(value) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => typeof entry === "string" ? entry.trim() : "").filter(Boolean);
}
function normalizeStringListRecord(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [key, rawValues] of Object.entries(value)) {
		const providerId = typeof key === "string" ? key.trim() : "";
		if (!providerId) continue;
		const values = normalizeStringList(rawValues);
		if (values.length === 0) continue;
		normalized[providerId] = values;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeManifestContracts(value) {
	if (!isRecord(value)) return;
	const speechProviders = normalizeStringList(value.speechProviders);
	const mediaUnderstandingProviders = normalizeStringList(value.mediaUnderstandingProviders);
	const imageGenerationProviders = normalizeStringList(value.imageGenerationProviders);
	const webSearchProviders = normalizeStringList(value.webSearchProviders);
	const tools = normalizeStringList(value.tools);
	const contracts = {
		...speechProviders.length > 0 ? { speechProviders } : {},
		...mediaUnderstandingProviders.length > 0 ? { mediaUnderstandingProviders } : {},
		...imageGenerationProviders.length > 0 ? { imageGenerationProviders } : {},
		...webSearchProviders.length > 0 ? { webSearchProviders } : {},
		...tools.length > 0 ? { tools } : {}
	};
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function normalizeProviderAuthChoices(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = typeof entry.provider === "string" ? entry.provider.trim() : "";
		const method = typeof entry.method === "string" ? entry.method.trim() : "";
		const choiceId = typeof entry.choiceId === "string" ? entry.choiceId.trim() : "";
		if (!provider || !method || !choiceId) continue;
		const choiceLabel = typeof entry.choiceLabel === "string" ? entry.choiceLabel.trim() : "";
		const choiceHint = typeof entry.choiceHint === "string" ? entry.choiceHint.trim() : "";
		const deprecatedChoiceIds = normalizeStringList(entry.deprecatedChoiceIds);
		const groupId = typeof entry.groupId === "string" ? entry.groupId.trim() : "";
		const groupLabel = typeof entry.groupLabel === "string" ? entry.groupLabel.trim() : "";
		const groupHint = typeof entry.groupHint === "string" ? entry.groupHint.trim() : "";
		const optionKey = typeof entry.optionKey === "string" ? entry.optionKey.trim() : "";
		const cliFlag = typeof entry.cliFlag === "string" ? entry.cliFlag.trim() : "";
		const cliOption = typeof entry.cliOption === "string" ? entry.cliOption.trim() : "";
		const cliDescription = typeof entry.cliDescription === "string" ? entry.cliDescription.trim() : "";
		const onboardingScopes = normalizeStringList(entry.onboardingScopes).filter((scope) => scope === "text-inference" || scope === "image-generation");
		normalized.push({
			provider,
			method,
			choiceId,
			...choiceLabel ? { choiceLabel } : {},
			...choiceHint ? { choiceHint } : {},
			...deprecatedChoiceIds.length > 0 ? { deprecatedChoiceIds } : {},
			...groupId ? { groupId } : {},
			...groupLabel ? { groupLabel } : {},
			...groupHint ? { groupHint } : {},
			...optionKey ? { optionKey } : {},
			...cliFlag ? { cliFlag } : {},
			...cliOption ? { cliOption } : {},
			...cliDescription ? { cliDescription } : {},
			...onboardingScopes.length > 0 ? { onboardingScopes } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeChannelConfigs(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [key, rawEntry] of Object.entries(value)) {
		const channelId = typeof key === "string" ? key.trim() : "";
		if (!channelId || !isRecord(rawEntry)) continue;
		const schema = isRecord(rawEntry.schema) ? rawEntry.schema : null;
		if (!schema) continue;
		const uiHints = isRecord(rawEntry.uiHints) ? rawEntry.uiHints : void 0;
		const label = typeof rawEntry.label === "string" ? rawEntry.label.trim() : "";
		const description = typeof rawEntry.description === "string" ? rawEntry.description.trim() : "";
		const preferOver = normalizeStringList(rawEntry.preferOver);
		normalized[channelId] = {
			schema,
			...uiHints ? { uiHints } : {},
			...label ? { label } : {},
			...description ? { description } : {},
			...preferOver.length > 0 ? { preferOver } : {}
		};
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function resolvePluginManifestPath(rootDir) {
	for (const filename of PLUGIN_MANIFEST_FILENAMES) {
		const candidate = path.join(rootDir, filename);
		if (fsSync.existsSync(candidate)) return candidate;
	}
	return path.join(rootDir, PLUGIN_MANIFEST_FILENAME);
}
function loadPluginManifest(rootDir, rejectHardlinks = true) {
	const manifestPath = resolvePluginManifestPath(rootDir);
	const opened = openBoundaryFileSync({
		absolutePath: manifestPath,
		rootPath: rootDir,
		boundaryLabel: "plugin root",
		rejectHardlinks
	});
	if (!opened.ok) return matchBoundaryFileOpenFailure(opened, {
		path: () => ({
			ok: false,
			error: `plugin manifest not found: ${manifestPath}`,
			manifestPath
		}),
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	let raw;
	try {
		raw = JSON.parse(fsSync.readFileSync(opened.fd, "utf-8"));
	} catch (err) {
		return {
			ok: false,
			error: `failed to parse plugin manifest: ${String(err)}`,
			manifestPath
		};
	} finally {
		fsSync.closeSync(opened.fd);
	}
	if (!isRecord(raw)) return {
		ok: false,
		error: "plugin manifest must be an object",
		manifestPath
	};
	const id = typeof raw.id === "string" ? raw.id.trim() : "";
	if (!id) return {
		ok: false,
		error: "plugin manifest requires id",
		manifestPath
	};
	const configSchema = isRecord(raw.configSchema) ? raw.configSchema : null;
	if (!configSchema) return {
		ok: false,
		error: "plugin manifest requires configSchema",
		manifestPath
	};
	const kind = typeof raw.kind === "string" ? raw.kind : void 0;
	const enabledByDefault = raw.enabledByDefault === true;
	const legacyPluginIds = normalizeStringList(raw.legacyPluginIds);
	const autoEnableWhenConfiguredProviders = normalizeStringList(raw.autoEnableWhenConfiguredProviders);
	const name = typeof raw.name === "string" ? raw.name.trim() : void 0;
	const description = typeof raw.description === "string" ? raw.description.trim() : void 0;
	const version = typeof raw.version === "string" ? raw.version.trim() : void 0;
	const channels = normalizeStringList(raw.channels);
	const providers = normalizeStringList(raw.providers);
	const cliBackends = normalizeStringList(raw.cliBackends);
	const providerAuthEnvVars = normalizeStringListRecord(raw.providerAuthEnvVars);
	const providerAuthChoices = normalizeProviderAuthChoices(raw.providerAuthChoices);
	const skills = normalizeStringList(raw.skills);
	const contracts = normalizeManifestContracts(raw.contracts);
	const channelConfigs = normalizeChannelConfigs(raw.channelConfigs);
	let uiHints;
	if (isRecord(raw.uiHints)) uiHints = raw.uiHints;
	return {
		ok: true,
		manifest: {
			id,
			configSchema,
			...enabledByDefault ? { enabledByDefault } : {},
			...legacyPluginIds.length > 0 ? { legacyPluginIds } : {},
			...autoEnableWhenConfiguredProviders.length > 0 ? { autoEnableWhenConfiguredProviders } : {},
			kind,
			channels,
			providers,
			cliBackends,
			providerAuthEnvVars,
			providerAuthChoices,
			skills,
			name,
			description,
			version,
			uiHints,
			contracts,
			channelConfigs
		},
		manifestPath
	};
}
const DEFAULT_PLUGIN_ENTRY_CANDIDATES = [
	"index.ts",
	"index.js",
	"index.mjs",
	"index.cjs"
];
function getPackageManifestMetadata(manifest) {
	if (!manifest) return;
	return manifest[MANIFEST_KEY];
}
function resolvePackageExtensionEntries(manifest) {
	const raw = getPackageManifestMetadata(manifest)?.extensions;
	if (!Array.isArray(raw)) return {
		status: "missing",
		entries: []
	};
	const entries = raw.map((entry) => typeof entry === "string" ? entry.trim() : "").filter(Boolean);
	if (entries.length === 0) return {
		status: "empty",
		entries: []
	};
	return {
		status: "ok",
		entries
	};
}
//#endregion
//#region src/plugins/bundle-manifest.ts
const CODEX_BUNDLE_MANIFEST_RELATIVE_PATH = ".codex-plugin/plugin.json";
const CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH = ".claude-plugin/plugin.json";
const CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH = ".cursor-plugin/plugin.json";
function normalizeString(value) {
	return (typeof value === "string" ? value.trim() : "") || void 0;
}
function normalizePathList(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed ? [trimmed] : [];
	}
	if (!Array.isArray(value)) return [];
	return value.map((entry) => typeof entry === "string" ? entry.trim() : "").filter(Boolean);
}
function normalizeBundlePathList(value) {
	return Array.from(new Set(normalizePathList(value)));
}
function mergeBundlePathLists(...groups) {
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	for (const group of groups) for (const entry of group) {
		if (seen.has(entry)) continue;
		seen.add(entry);
		merged.push(entry);
	}
	return merged;
}
function hasInlineCapabilityValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	if (isRecord(value)) return Object.keys(value).length > 0;
	return value === true;
}
function slugifyPluginId(raw, rootDir) {
	const fallback = path.basename(rootDir);
	return (raw?.trim() || fallback).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "bundle-plugin";
}
function loadBundleManifestFile(params) {
	const manifestPath = path.join(params.rootDir, params.manifestRelativePath);
	const opened = openBoundaryFileSync({
		absolutePath: manifestPath,
		rootPath: params.rootDir,
		boundaryLabel: "plugin root",
		rejectHardlinks: params.rejectHardlinks
	});
	if (!opened.ok) return matchBoundaryFileOpenFailure(opened, {
		path: () => {
			if (params.allowMissing) return {
				ok: true,
				raw: {},
				manifestPath
			};
			return {
				ok: false,
				error: `plugin manifest not found: ${manifestPath}`,
				manifestPath
			};
		},
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	try {
		const raw = JSON.parse(fsSync.readFileSync(opened.fd, "utf-8"));
		if (!isRecord(raw)) return {
			ok: false,
			error: "plugin manifest must be an object",
			manifestPath
		};
		return {
			ok: true,
			raw,
			manifestPath
		};
	} catch (err) {
		return {
			ok: false,
			error: `failed to parse plugin manifest: ${String(err)}`,
			manifestPath
		};
	} finally {
		fsSync.closeSync(opened.fd);
	}
}
function resolveCodexSkillDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.skills);
	if (declared.length > 0) return declared;
	return fsSync.existsSync(path.join(rootDir, "skills")) ? ["skills"] : [];
}
function resolveCodexHookDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.hooks);
	if (declared.length > 0) return declared;
	return fsSync.existsSync(path.join(rootDir, "hooks")) ? ["hooks"] : [];
}
function resolveCursorSkillsRootDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.skills);
	return mergeBundlePathLists(fsSync.existsSync(path.join(rootDir, "skills")) ? ["skills"] : [], declared);
}
function resolveCursorCommandRootDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.commands);
	return mergeBundlePathLists(fsSync.existsSync(path.join(rootDir, ".cursor", "commands")) ? [".cursor/commands"] : [], declared);
}
function resolveCursorSkillDirs(raw, rootDir) {
	return mergeBundlePathLists(resolveCursorSkillsRootDirs(raw, rootDir), resolveCursorCommandRootDirs(raw, rootDir));
}
function resolveCursorAgentDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.subagents ?? raw.agents);
	return mergeBundlePathLists(fsSync.existsSync(path.join(rootDir, ".cursor", "agents")) ? [".cursor/agents"] : [], declared);
}
function hasCursorHookCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.hooks) || fsSync.existsSync(path.join(rootDir, ".cursor", "hooks.json"));
}
function hasCursorRulesCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.rules) || fsSync.existsSync(path.join(rootDir, ".cursor", "rules"));
}
function hasCursorMcpCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.mcpServers) || fsSync.existsSync(path.join(rootDir, ".mcp.json"));
}
function resolveClaudeComponentPaths(raw, key, rootDir, defaults) {
	const declared = normalizeBundlePathList(raw[key]);
	return mergeBundlePathLists(defaults.filter((candidate) => fsSync.existsSync(path.join(rootDir, candidate))), declared);
}
function resolveClaudeSkillsRootDirs(raw, rootDir) {
	return resolveClaudeComponentPaths(raw, "skills", rootDir, ["skills"]);
}
function resolveClaudeCommandRootDirs(raw, rootDir) {
	return resolveClaudeComponentPaths(raw, "commands", rootDir, ["commands"]);
}
function resolveClaudeSkillDirs(raw, rootDir) {
	return mergeBundlePathLists(resolveClaudeSkillsRootDirs(raw, rootDir), resolveClaudeCommandRootDirs(raw, rootDir), resolveClaudeAgentDirs(raw, rootDir), resolveClaudeOutputStylePaths(raw, rootDir));
}
function resolveClaudeAgentDirs(raw, rootDir) {
	return resolveClaudeComponentPaths(raw, "agents", rootDir, ["agents"]);
}
function resolveClaudeHookPaths(raw, rootDir) {
	return resolveClaudeComponentPaths(raw, "hooks", rootDir, ["hooks/hooks.json"]);
}
function resolveClaudeMcpPaths(raw, rootDir) {
	return resolveClaudeComponentPaths(raw, "mcpServers", rootDir, [".mcp.json"]);
}
function resolveClaudeLspPaths(raw, rootDir) {
	return resolveClaudeComponentPaths(raw, "lspServers", rootDir, [".lsp.json"]);
}
function resolveClaudeOutputStylePaths(raw, rootDir) {
	return resolveClaudeComponentPaths(raw, "outputStyles", rootDir, ["output-styles"]);
}
function resolveClaudeSettingsFiles(_raw, rootDir) {
	return fsSync.existsSync(path.join(rootDir, "settings.json")) ? ["settings.json"] : [];
}
function hasClaudeHookCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.hooks) || resolveClaudeHookPaths(raw, rootDir).length > 0;
}
function buildCodexCapabilities(raw, rootDir) {
	const capabilities = [];
	if (resolveCodexSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
	if (resolveCodexHookDirs(raw, rootDir).length > 0) capabilities.push("hooks");
	if (hasInlineCapabilityValue(raw.mcpServers) || fsSync.existsSync(path.join(rootDir, ".mcp.json"))) capabilities.push("mcpServers");
	if (hasInlineCapabilityValue(raw.apps) || fsSync.existsSync(path.join(rootDir, ".app.json"))) capabilities.push("apps");
	return capabilities;
}
function buildClaudeCapabilities(raw, rootDir) {
	const capabilities = [];
	if (resolveClaudeSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
	if (resolveClaudeCommandRootDirs(raw, rootDir).length > 0) capabilities.push("commands");
	if (resolveClaudeAgentDirs(raw, rootDir).length > 0) capabilities.push("agents");
	if (hasClaudeHookCapability(raw, rootDir)) capabilities.push("hooks");
	if (hasInlineCapabilityValue(raw.mcpServers) || resolveClaudeMcpPaths(raw, rootDir).length > 0) capabilities.push("mcpServers");
	if (hasInlineCapabilityValue(raw.lspServers) || resolveClaudeLspPaths(raw, rootDir).length > 0) capabilities.push("lspServers");
	if (hasInlineCapabilityValue(raw.outputStyles) || resolveClaudeOutputStylePaths(raw, rootDir).length > 0) capabilities.push("outputStyles");
	if (resolveClaudeSettingsFiles(raw, rootDir).length > 0) capabilities.push("settings");
	return capabilities;
}
function buildCursorCapabilities(raw, rootDir) {
	const capabilities = [];
	if (resolveCursorSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
	if (resolveCursorCommandRootDirs(raw, rootDir).length > 0) capabilities.push("commands");
	if (resolveCursorAgentDirs(raw, rootDir).length > 0) capabilities.push("agents");
	if (hasCursorHookCapability(raw, rootDir)) capabilities.push("hooks");
	if (hasCursorRulesCapability(raw, rootDir)) capabilities.push("rules");
	if (hasCursorMcpCapability(raw, rootDir)) capabilities.push("mcpServers");
	return capabilities;
}
function loadBundleManifest(params) {
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const manifestRelativePath = params.bundleFormat === "codex" ? CODEX_BUNDLE_MANIFEST_RELATIVE_PATH : params.bundleFormat === "cursor" ? CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH : CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH;
	const loaded = loadBundleManifestFile({
		rootDir: params.rootDir,
		manifestRelativePath,
		rejectHardlinks,
		allowMissing: params.bundleFormat === "claude"
	});
	if (!loaded.ok) return loaded;
	const raw = loaded.raw;
	const interfaceRecord = isRecord(raw.interface) ? raw.interface : void 0;
	const name = normalizeString(raw.name);
	const description = normalizeString(raw.description) ?? normalizeString(raw.shortDescription) ?? normalizeString(interfaceRecord?.shortDescription);
	const version = normalizeString(raw.version);
	if (params.bundleFormat === "codex") {
		const skills = resolveCodexSkillDirs(raw, params.rootDir);
		const hooks = resolveCodexHookDirs(raw, params.rootDir);
		return {
			ok: true,
			manifest: {
				id: slugifyPluginId(name, params.rootDir),
				name,
				description,
				version,
				skills,
				settingsFiles: [],
				hooks,
				bundleFormat: "codex",
				capabilities: buildCodexCapabilities(raw, params.rootDir)
			},
			manifestPath: loaded.manifestPath
		};
	}
	if (params.bundleFormat === "cursor") return {
		ok: true,
		manifest: {
			id: slugifyPluginId(name, params.rootDir),
			name,
			description,
			version,
			skills: resolveCursorSkillDirs(raw, params.rootDir),
			settingsFiles: [],
			hooks: [],
			bundleFormat: "cursor",
			capabilities: buildCursorCapabilities(raw, params.rootDir)
		},
		manifestPath: loaded.manifestPath
	};
	return {
		ok: true,
		manifest: {
			id: slugifyPluginId(name, params.rootDir),
			name,
			description,
			version,
			skills: resolveClaudeSkillDirs(raw, params.rootDir),
			settingsFiles: resolveClaudeSettingsFiles(raw, params.rootDir),
			hooks: resolveClaudeHookPaths(raw, params.rootDir),
			bundleFormat: "claude",
			capabilities: buildClaudeCapabilities(raw, params.rootDir)
		},
		manifestPath: loaded.manifestPath
	};
}
function detectBundleManifestFormat(rootDir) {
	if (fsSync.existsSync(path.join(rootDir, ".codex-plugin/plugin.json"))) return "codex";
	if (fsSync.existsSync(path.join(rootDir, ".cursor-plugin/plugin.json"))) return "cursor";
	if (fsSync.existsSync(path.join(rootDir, ".claude-plugin/plugin.json"))) return "claude";
	if (fsSync.existsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
	if (DEFAULT_PLUGIN_ENTRY_CANDIDATES.some((candidate) => fsSync.existsSync(path.join(rootDir, candidate)))) return null;
	if ([
		path.join(rootDir, "skills"),
		path.join(rootDir, "commands"),
		path.join(rootDir, "agents"),
		path.join(rootDir, "hooks", "hooks.json"),
		path.join(rootDir, ".mcp.json"),
		path.join(rootDir, ".lsp.json"),
		path.join(rootDir, "settings.json")
	].some((candidate) => fsSync.existsSync(candidate))) return "claude";
	return null;
}
//#endregion
//#region src/plugins/path-safety.ts
function isPathInside(baseDir, targetPath) {
	return isPathInside$1(baseDir, targetPath);
}
function safeRealpathSync(targetPath, cache) {
	const cached = cache?.get(targetPath);
	if (cached) return cached;
	try {
		const resolved = fsSync.realpathSync(targetPath);
		cache?.set(targetPath, resolved);
		return resolved;
	} catch {
		return null;
	}
}
function safeStatSync(targetPath) {
	try {
		return fsSync.statSync(targetPath);
	} catch {
		return null;
	}
}
function formatPosixMode(mode) {
	return (mode & 511).toString(8).padStart(3, "0");
}
//#endregion
//#region src/plugins/min-host-version.ts
const MIN_HOST_VERSION_FORMAT = "openclaw.install.minHostVersion must use a semver floor in the form \">=x.y.z\"";
const MIN_HOST_VERSION_RE = /^>=(\d+)\.(\d+)\.(\d+)$/;
function parseMinHostVersionRequirement(raw) {
	if (typeof raw !== "string") return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const match = trimmed.match(MIN_HOST_VERSION_RE);
	if (!match) return null;
	const minimumLabel = `${match[1]}.${match[2]}.${match[3]}`;
	if (!parseSemver(minimumLabel)) return null;
	return {
		raw: trimmed,
		minimumLabel
	};
}
function checkMinHostVersion(params) {
	if (params.minHostVersion === void 0) return {
		ok: true,
		requirement: null
	};
	const requirement = parseMinHostVersionRequirement(params.minHostVersion);
	if (!requirement) return {
		ok: false,
		kind: "invalid",
		error: MIN_HOST_VERSION_FORMAT
	};
	const currentVersion = params.currentVersion?.trim() || "unknown";
	const currentSemver = parseSemver(currentVersion);
	if (!currentSemver) return {
		ok: false,
		kind: "unknown_host_version",
		requirement
	};
	if (!isAtLeast(currentSemver, parseSemver(requirement.minimumLabel))) return {
		ok: false,
		kind: "incompatible",
		requirement,
		currentVersion
	};
	return {
		ok: true,
		requirement
	};
}
//#endregion
export { safeStatSync as a, CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH as c, mergeBundlePathLists as d, normalizeBundlePathList as f, resolvePackageExtensionEntries as g, loadPluginManifest as h, safeRealpathSync as i, detectBundleManifestFormat as l, getPackageManifestMetadata as m, formatPosixMode as n, CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH as o, DEFAULT_PLUGIN_ENTRY_CANDIDATES as p, isPathInside as r, CODEX_BUNDLE_MANIFEST_RELATIVE_PATH as s, checkMinHostVersion as t, loadBundleManifest as u };
