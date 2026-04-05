import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { t as CONFIG_DIR, v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { i as openBoundaryFileSync } from "./boundary-file-read-7v-hs51G.js";
import { r as isPathInsideWithRealpath } from "./scan-paths-hOTASUCw.js";
import { a as normalizePluginsConfig, o as resolveEffectiveEnableState, s as resolveMemorySlotDecision } from "./config-state-DDbfQQX4.js";
import { n as MANIFEST_KEY } from "./legacy-names-C7vyNTNf.js";
import { n as loadPluginManifestRegistry } from "./manifest-registry-BYS0nlrs.js";
import { i as resolveOpenClawMetadata, n as resolveHookInvocationPolicy, t as parseFrontmatter } from "./frontmatter-Bm0INNq-.js";
import { a as resolveHookEntries } from "./config-4U-qZUbS.js";
import { fileURLToPath } from "node:url";
import fsSync from "node:fs";
import path from "node:path";
//#region src/hooks/bundled-dir.ts
function resolveBundledHooksDir() {
	const override = process.env.OPENCLAW_BUNDLED_HOOKS_DIR?.trim();
	if (override) return override;
	try {
		const execDir = path.dirname(process.execPath);
		const sibling = path.join(execDir, "hooks", "bundled");
		if (fsSync.existsSync(sibling)) return sibling;
	} catch {}
	try {
		const moduleDir = path.dirname(fileURLToPath(import.meta.url));
		const distBundled = path.join(moduleDir, "bundled");
		if (fsSync.existsSync(distBundled)) return distBundled;
	} catch {}
	try {
		const moduleDir = path.dirname(fileURLToPath(import.meta.url));
		const root = path.resolve(moduleDir, "..", "..");
		const srcBundled = path.join(root, "src", "hooks", "bundled");
		if (fsSync.existsSync(srcBundled)) return srcBundled;
	} catch {}
}
//#endregion
//#region src/hooks/plugin-hooks.ts
const log$1 = createSubsystemLogger("hooks");
function resolvePluginHookDirs(params) {
	const workspaceDir = (params.workspaceDir ?? "").trim();
	if (!workspaceDir) return [];
	const registry = loadPluginManifestRegistry({
		workspaceDir,
		config: params.config,
		cache: false
	});
	if (registry.plugins.length === 0) return [];
	const normalizedPlugins = normalizePluginsConfig(params.config?.plugins);
	const memorySlot = normalizedPlugins.slots.memory;
	let selectedMemoryPluginId = null;
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const record of registry.plugins) {
		if (!record.hooks || record.hooks.length === 0) continue;
		if (!resolveEffectiveEnableState({
			id: record.id,
			origin: record.origin,
			config: normalizedPlugins,
			rootConfig: params.config
		}).enabled) continue;
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: selectedMemoryPluginId
		});
		if (!memoryDecision.enabled) continue;
		if (memoryDecision.selected && record.kind === "memory") selectedMemoryPluginId = record.id;
		for (const raw of record.hooks) {
			const trimmed = raw.trim();
			if (!trimmed) continue;
			const candidate = path.resolve(record.rootDir, trimmed);
			if (!fsSync.existsSync(candidate)) {
				log$1.warn(`plugin hook path not found (${record.id}): ${candidate}`);
				continue;
			}
			if (!isPathInsideWithRealpath(record.rootDir, candidate, { requireRealpath: true })) {
				log$1.warn(`plugin hook path escapes plugin root (${record.id}): ${candidate}`);
				continue;
			}
			if (seen.has(candidate)) continue;
			seen.add(candidate);
			resolved.push({
				dir: candidate,
				pluginId: record.id
			});
		}
	}
	return resolved;
}
//#endregion
//#region src/hooks/workspace.ts
const log = createSubsystemLogger("hooks/workspace");
function readHookPackageManifest(dir) {
	const raw = readBoundaryFileUtf8({
		absolutePath: path.join(dir, "package.json"),
		rootPath: dir,
		boundaryLabel: "hook package directory"
	});
	if (raw === null) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function resolvePackageHooks(manifest) {
	const raw = manifest[MANIFEST_KEY]?.hooks;
	if (!Array.isArray(raw)) return [];
	return raw.map((entry) => typeof entry === "string" ? entry.trim() : "").filter(Boolean);
}
function resolveContainedDir(baseDir, targetDir) {
	const base = path.resolve(baseDir);
	const resolved = path.resolve(baseDir, targetDir);
	if (!isPathInsideWithRealpath(base, resolved, { requireRealpath: true })) return null;
	return resolved;
}
function loadHookFromDir(params) {
	const hookMdPath = path.join(params.hookDir, "HOOK.md");
	const content = readBoundaryFileUtf8({
		absolutePath: hookMdPath,
		rootPath: params.hookDir,
		boundaryLabel: "hook directory"
	});
	if (content === null) return null;
	try {
		const frontmatter = parseFrontmatter(content);
		const name = frontmatter.name || params.nameHint || path.basename(params.hookDir);
		const description = frontmatter.description || "";
		const handlerCandidates = [
			"handler.ts",
			"handler.js",
			"index.ts",
			"index.js"
		];
		let handlerPath;
		for (const candidate of handlerCandidates) {
			const safeCandidatePath = resolveBoundaryFilePath({
				absolutePath: path.join(params.hookDir, candidate),
				rootPath: params.hookDir,
				boundaryLabel: "hook directory"
			});
			if (safeCandidatePath) {
				handlerPath = safeCandidatePath;
				break;
			}
		}
		if (!handlerPath) {
			log.warn(`Hook "${name}" has HOOK.md but no handler file in ${params.hookDir}`);
			return null;
		}
		let baseDir = params.hookDir;
		try {
			baseDir = fsSync.realpathSync.native(params.hookDir);
		} catch {}
		return {
			hook: {
				name,
				description,
				source: params.source,
				pluginId: params.pluginId,
				filePath: hookMdPath,
				baseDir,
				handlerPath
			},
			frontmatter
		};
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		log.warn(`Failed to load hook from ${params.hookDir}: ${message}`);
		return null;
	}
}
/**
* Scan a directory for hooks (subdirectories containing HOOK.md)
*/
function loadHooksFromDir(params) {
	const { dir, source, pluginId } = params;
	if (!fsSync.existsSync(dir)) return [];
	if (!fsSync.statSync(dir).isDirectory()) return [];
	const hooks = [];
	const entries = fsSync.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const hookDir = path.join(dir, entry.name);
		const manifest = readHookPackageManifest(hookDir);
		const packageHooks = manifest ? resolvePackageHooks(manifest) : [];
		if (packageHooks.length > 0) {
			for (const hookPath of packageHooks) {
				const resolvedHookDir = resolveContainedDir(hookDir, hookPath);
				if (!resolvedHookDir) {
					log.warn(`Ignoring out-of-package hook path "${hookPath}" in ${hookDir} (must be within package directory)`);
					continue;
				}
				const hook = loadHookFromDir({
					hookDir: resolvedHookDir,
					source,
					pluginId,
					nameHint: path.basename(resolvedHookDir)
				});
				if (hook) hooks.push(hook);
			}
			continue;
		}
		const hook = loadHookFromDir({
			hookDir,
			source,
			pluginId,
			nameHint: entry.name
		});
		if (hook) hooks.push(hook);
	}
	return hooks;
}
function loadHookEntriesFromDir(params) {
	return loadHooksFromDir({
		dir: params.dir,
		source: params.source,
		pluginId: params.pluginId
	}).map(({ hook, frontmatter }) => {
		return {
			hook: {
				...hook,
				source: params.source,
				pluginId: params.pluginId
			},
			frontmatter,
			metadata: resolveOpenClawMetadata(frontmatter),
			invocation: resolveHookInvocationPolicy(frontmatter)
		};
	});
}
function discoverWorkspaceHookEntries(workspaceDir, opts) {
	const managedHooksDir = opts?.managedHooksDir ?? path.join(CONFIG_DIR, "hooks");
	const workspaceHooksDir = path.join(workspaceDir, "hooks");
	const bundledHooksDir = opts?.bundledHooksDir ?? resolveBundledHooksDir();
	const extraDirs = (opts?.config?.hooks?.internal?.load?.extraDirs ?? []).map((d) => typeof d === "string" ? d.trim() : "").filter(Boolean);
	const pluginHookDirs = resolvePluginHookDirs({
		workspaceDir,
		config: opts?.config
	});
	const bundledHooks = bundledHooksDir ? loadHookEntriesFromDir({
		dir: bundledHooksDir,
		source: "openclaw-bundled"
	}) : [];
	const extraHooks = extraDirs.flatMap((dir) => {
		return loadHookEntriesFromDir({
			dir: resolveUserPath(dir),
			source: "openclaw-managed"
		});
	});
	const pluginHooks = pluginHookDirs.flatMap(({ dir, pluginId }) => loadHookEntriesFromDir({
		dir,
		source: "openclaw-plugin",
		pluginId
	}));
	const managedHooks = loadHookEntriesFromDir({
		dir: managedHooksDir,
		source: "openclaw-managed"
	});
	const workspaceHooks = loadHookEntriesFromDir({
		dir: workspaceHooksDir,
		source: "openclaw-workspace"
	});
	return [
		...extraHooks,
		...bundledHooks,
		...pluginHooks,
		...managedHooks,
		...workspaceHooks
	];
}
function loadWorkspaceHookEntries(workspaceDir, opts) {
	return resolveHookEntries(opts?.entries ?? discoverWorkspaceHookEntries(workspaceDir, opts), { onCollisionIgnored: ({ name, kept, ignored }) => {
		log.warn(`Ignoring ${ignored.hook.source} hook "${name}" because it cannot override ${kept.hook.source} hook code`);
	} });
}
function readBoundaryFileUtf8(params) {
	return withOpenedBoundaryFileSync(params, (opened) => {
		try {
			return fsSync.readFileSync(opened.fd, "utf-8");
		} catch {
			return null;
		}
	});
}
function withOpenedBoundaryFileSync(params, read) {
	const opened = openBoundaryFileSync({
		absolutePath: params.absolutePath,
		rootPath: params.rootPath,
		boundaryLabel: params.boundaryLabel
	});
	if (!opened.ok) return null;
	try {
		return read({
			fd: opened.fd,
			path: opened.path
		});
	} finally {
		fsSync.closeSync(opened.fd);
	}
}
function resolveBoundaryFilePath(params) {
	return withOpenedBoundaryFileSync(params, (opened) => opened.path);
}
//#endregion
export { loadWorkspaceHookEntries as t };
