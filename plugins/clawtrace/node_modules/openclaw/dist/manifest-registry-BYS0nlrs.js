import { h as resolveConfigDir, v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { i as openBoundaryFileSync, n as matchBoundaryFileOpenFailure } from "./boundary-file-read-7v-hs51G.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-C-5WlcYo.js";
import { o as resolveCompatibilityHostVersion } from "./version-CIMrqUx3.js";
import { c as resolveBundledPluginGeneratedPath, s as BUNDLED_PLUGIN_METADATA } from "./bundled-capability-metadata-CsnlKsfe.js";
import { a as normalizePluginsConfig } from "./config-state-DDbfQQX4.js";
import { a as safeStatSync, g as resolvePackageExtensionEntries, h as loadPluginManifest, i as safeRealpathSync, l as detectBundleManifestFormat, m as getPackageManifestMetadata, n as formatPosixMode, p as DEFAULT_PLUGIN_ENTRY_CANDIDATES, r as isPathInside, t as checkMinHostVersion, u as loadBundleManifest } from "./min-host-version-VYpMQhVm.js";
import { fileURLToPath } from "node:url";
import fsSync from "node:fs";
import path from "node:path";
//#region src/plugins/bundled-dir.ts
function isSourceCheckoutRoot(packageRoot) {
	return fsSync.existsSync(path.join(packageRoot, ".git")) && fsSync.existsSync(path.join(packageRoot, "src")) && fsSync.existsSync(path.join(packageRoot, "extensions"));
}
function resolveBundledDirFromPackageRoot(packageRoot, preferSourceCheckout) {
	const sourceExtensionsDir = path.join(packageRoot, "extensions");
	const builtExtensionsDir = path.join(packageRoot, "dist", "extensions");
	if ((preferSourceCheckout || isSourceCheckoutRoot(packageRoot)) && fsSync.existsSync(sourceExtensionsDir)) return sourceExtensionsDir;
	const runtimeExtensionsDir = path.join(packageRoot, "dist-runtime", "extensions");
	if (fsSync.existsSync(runtimeExtensionsDir) && fsSync.existsSync(builtExtensionsDir)) return runtimeExtensionsDir;
	if (fsSync.existsSync(builtExtensionsDir)) return builtExtensionsDir;
}
function resolveBundledPluginsDir(env = process.env) {
	const override = env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
	if (override) {
		const resolvedOverride = resolveUserPath(override, env);
		if (fsSync.existsSync(resolvedOverride)) return resolvedOverride;
		try {
			const argvPackageRoot = resolveOpenClawPackageRootSync({ argv1: process.argv[1] });
			if (argvPackageRoot && !isSourceCheckoutRoot(argvPackageRoot)) {
				const argvFallback = resolveBundledDirFromPackageRoot(argvPackageRoot, false);
				if (argvFallback) return argvFallback;
			}
		} catch {}
		return resolvedOverride;
	}
	const preferSourceCheckout = Boolean(env.VITEST);
	try {
		const packageRoots = [
			resolveOpenClawPackageRootSync({ argv1: process.argv[1] }),
			resolveOpenClawPackageRootSync({ cwd: process.cwd() }),
			resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })
		].filter((entry, index, all) => Boolean(entry) && all.indexOf(entry) === index);
		for (const packageRoot of packageRoots) {
			const bundledDir = resolveBundledDirFromPackageRoot(packageRoot, preferSourceCheckout);
			if (bundledDir) return bundledDir;
		}
	} catch {}
	try {
		const execDir = path.dirname(process.execPath);
		const siblingBuilt = path.join(execDir, "dist", "extensions");
		if (fsSync.existsSync(siblingBuilt)) return siblingBuilt;
		const sibling = path.join(execDir, "extensions");
		if (fsSync.existsSync(sibling)) return sibling;
	} catch {}
	try {
		let cursor = path.dirname(fileURLToPath(import.meta.url));
		for (let i = 0; i < 6; i += 1) {
			const candidate = path.join(cursor, "extensions");
			if (fsSync.existsSync(candidate)) return candidate;
			const parent = path.dirname(cursor);
			if (parent === cursor) break;
			cursor = parent;
		}
	} catch {}
}
//#endregion
//#region src/plugins/roots.ts
function resolvePluginSourceRoots(params) {
	const env = params.env ?? process.env;
	const workspaceRoot = params.workspaceDir ? resolveUserPath(params.workspaceDir, env) : void 0;
	return {
		stock: resolveBundledPluginsDir(env),
		global: path.join(resolveConfigDir(env), "extensions"),
		workspace: workspaceRoot ? path.join(workspaceRoot, ".openclaw", "extensions") : void 0
	};
}
function resolvePluginCacheInputs(params) {
	const env = params.env ?? process.env;
	return {
		roots: resolvePluginSourceRoots({
			workspaceDir: params.workspaceDir,
			env
		}),
		loadPaths: (params.loadPaths ?? []).filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter(Boolean).map((entry) => resolveUserPath(entry, env))
	};
}
//#endregion
//#region src/plugins/discovery.ts
const EXTENSION_EXTS = new Set([
	".ts",
	".js",
	".mts",
	".cts",
	".mjs",
	".cjs"
]);
const discoveryCache = /* @__PURE__ */ new Map();
const DEFAULT_DISCOVERY_CACHE_MS = 1e3;
function clearPluginDiscoveryCache() {
	discoveryCache.clear();
}
function resolveDiscoveryCacheMs(env) {
	const raw = env.OPENCLAW_PLUGIN_DISCOVERY_CACHE_MS?.trim();
	if (raw === "" || raw === "0") return 0;
	if (!raw) return DEFAULT_DISCOVERY_CACHE_MS;
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed)) return DEFAULT_DISCOVERY_CACHE_MS;
	return Math.max(0, parsed);
}
function shouldUseDiscoveryCache(env) {
	if (env.OPENCLAW_DISABLE_PLUGIN_DISCOVERY_CACHE?.trim()) return false;
	return resolveDiscoveryCacheMs(env) > 0;
}
function buildDiscoveryCacheKey(params) {
	const { roots, loadPaths } = resolvePluginCacheInputs({
		workspaceDir: params.workspaceDir,
		loadPaths: params.extraPaths,
		env: params.env
	});
	const workspaceKey = roots.workspace ?? "";
	const configExtensionsRoot = roots.global ?? "";
	const bundledRoot = roots.stock ?? "";
	return `${workspaceKey}::${params.ownershipUid ?? currentUid() ?? "none"}::${configExtensionsRoot}::${bundledRoot}::${JSON.stringify(loadPaths)}`;
}
function currentUid(overrideUid) {
	if (overrideUid !== void 0) return overrideUid;
	if (process.platform === "win32") return null;
	if (typeof process.getuid !== "function") return null;
	return process.getuid();
}
function checkSourceEscapesRoot(params) {
	const sourceRealPath = safeRealpathSync(params.source);
	const rootRealPath = safeRealpathSync(params.rootDir);
	if (!sourceRealPath || !rootRealPath) return null;
	if (isPathInside(rootRealPath, sourceRealPath)) return null;
	return {
		reason: "source_escapes_root",
		sourcePath: params.source,
		rootPath: params.rootDir,
		targetPath: params.source,
		sourceRealPath,
		rootRealPath
	};
}
function checkPathStatAndPermissions(params) {
	if (process.platform === "win32") return null;
	const pathsToCheck = [params.rootDir, params.source];
	const seen = /* @__PURE__ */ new Set();
	for (const targetPath of pathsToCheck) {
		const normalized = path.resolve(targetPath);
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		let stat = safeStatSync(targetPath);
		if (!stat) return {
			reason: "path_stat_failed",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath
		};
		let modeBits = stat.mode & 511;
		if ((modeBits & 2) !== 0 && params.origin === "bundled") try {
			fsSync.chmodSync(targetPath, modeBits & -19);
			const repairedStat = safeStatSync(targetPath);
			if (!repairedStat) return {
				reason: "path_stat_failed",
				sourcePath: params.source,
				rootPath: params.rootDir,
				targetPath
			};
			stat = repairedStat;
			modeBits = repairedStat.mode & 511;
		} catch {}
		if ((modeBits & 2) !== 0) return {
			reason: "path_world_writable",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath,
			modeBits
		};
		if (params.origin !== "bundled" && params.uid !== null && typeof stat.uid === "number" && stat.uid !== params.uid && stat.uid !== 0) return {
			reason: "path_suspicious_ownership",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath,
			foundUid: stat.uid,
			expectedUid: params.uid
		};
	}
	return null;
}
function findCandidateBlockIssue(params) {
	const escaped = checkSourceEscapesRoot({
		source: params.source,
		rootDir: params.rootDir
	});
	if (escaped) return escaped;
	return checkPathStatAndPermissions({
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		uid: currentUid(params.ownershipUid)
	});
}
function formatCandidateBlockMessage(issue) {
	if (issue.reason === "source_escapes_root") return `blocked plugin candidate: source escapes plugin root (${issue.sourcePath} -> ${issue.sourceRealPath}; root=${issue.rootRealPath})`;
	if (issue.reason === "path_stat_failed") return `blocked plugin candidate: cannot stat path (${issue.targetPath})`;
	if (issue.reason === "path_world_writable") return `blocked plugin candidate: world-writable path (${issue.targetPath}, mode=${formatPosixMode(issue.modeBits ?? 0)})`;
	return `blocked plugin candidate: suspicious ownership (${issue.targetPath}, uid=${issue.foundUid}, expected uid=${issue.expectedUid} or root)`;
}
function isUnsafePluginCandidate(params) {
	const issue = findCandidateBlockIssue({
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		ownershipUid: params.ownershipUid
	});
	if (!issue) return false;
	params.diagnostics.push({
		level: "warn",
		source: issue.targetPath,
		message: formatCandidateBlockMessage(issue)
	});
	return true;
}
function isExtensionFile(filePath) {
	const ext = path.extname(filePath);
	if (!EXTENSION_EXTS.has(ext)) return false;
	return !filePath.endsWith(".d.ts");
}
function shouldIgnoreScannedDirectory(dirName) {
	const normalized = dirName.trim().toLowerCase();
	if (!normalized) return true;
	if (normalized.endsWith(".bak")) return true;
	if (normalized.includes(".backup-")) return true;
	if (normalized.includes(".disabled")) return true;
	return false;
}
function readPackageManifest(dir, rejectHardlinks = true) {
	const opened = openBoundaryFileSync({
		absolutePath: path.join(dir, "package.json"),
		rootPath: dir,
		boundaryLabel: "plugin package directory",
		rejectHardlinks
	});
	if (!opened.ok) return null;
	try {
		const raw = fsSync.readFileSync(opened.fd, "utf-8");
		return JSON.parse(raw);
	} catch {
		return null;
	} finally {
		fsSync.closeSync(opened.fd);
	}
}
function deriveIdHint(params) {
	const base = path.basename(params.filePath, path.extname(params.filePath));
	const rawManifestId = params.manifestId?.trim();
	if (rawManifestId) return params.hasMultipleExtensions ? `${rawManifestId}/${base}` : rawManifestId;
	const rawPackageName = params.packageName?.trim();
	if (!rawPackageName) return base;
	const unscoped = rawPackageName.includes("/") ? rawPackageName.split("/").pop() ?? rawPackageName : rawPackageName;
	const normalizedPackageId = unscoped.endsWith("-provider") && unscoped.length > 9 ? unscoped.slice(0, -9) : unscoped;
	if (!params.hasMultipleExtensions) return normalizedPackageId;
	return `${normalizedPackageId}/${base}`;
}
function resolveIdHintManifestId(rootDir, rejectHardlinks) {
	const manifest = loadPluginManifest(rootDir, rejectHardlinks);
	return manifest.ok ? manifest.manifest.id : void 0;
}
function addCandidate(params) {
	const resolved = path.resolve(params.source);
	if (params.seen.has(resolved)) return;
	const resolvedRoot = safeRealpathSync(params.rootDir) ?? path.resolve(params.rootDir);
	if (isUnsafePluginCandidate({
		source: resolved,
		rootDir: resolvedRoot,
		origin: params.origin,
		diagnostics: params.diagnostics,
		ownershipUid: params.ownershipUid
	})) return;
	params.seen.add(resolved);
	const manifest = params.manifest ?? null;
	params.candidates.push({
		idHint: params.idHint,
		source: resolved,
		setupSource: params.setupSource,
		rootDir: resolvedRoot,
		origin: params.origin,
		format: params.format ?? "openclaw",
		bundleFormat: params.bundleFormat,
		workspaceDir: params.workspaceDir,
		packageName: manifest?.name?.trim() || void 0,
		packageVersion: manifest?.version?.trim() || void 0,
		packageDescription: manifest?.description?.trim() || void 0,
		packageDir: params.packageDir,
		packageManifest: getPackageManifestMetadata(manifest ?? void 0),
		bundledManifest: params.bundledManifest,
		bundledManifestPath: params.bundledManifestPath
	});
}
function discoverBundleInRoot(params) {
	const bundleFormat = detectBundleManifestFormat(params.rootDir);
	if (!bundleFormat) return "none";
	const bundleManifest = loadBundleManifest({
		rootDir: params.rootDir,
		bundleFormat,
		rejectHardlinks: params.origin !== "bundled"
	});
	if (!bundleManifest.ok) {
		params.diagnostics.push({
			level: "error",
			message: bundleManifest.error,
			source: bundleManifest.manifestPath
		});
		return "invalid";
	}
	addCandidate({
		candidates: params.candidates,
		diagnostics: params.diagnostics,
		seen: params.seen,
		idHint: bundleManifest.manifest.id,
		source: params.rootDir,
		rootDir: params.rootDir,
		origin: params.origin,
		format: "bundle",
		bundleFormat,
		ownershipUid: params.ownershipUid,
		workspaceDir: params.workspaceDir
	});
	return "added";
}
function resolvePackageEntrySource(params) {
	const opened = openBoundaryFileSync({
		absolutePath: path.resolve(params.packageDir, params.entryPath),
		rootPath: params.packageDir,
		boundaryLabel: "plugin package directory",
		rejectHardlinks: params.rejectHardlinks ?? true
	});
	if (!opened.ok) return matchBoundaryFileOpenFailure(opened, {
		path: () => null,
		io: () => {
			params.diagnostics.push({
				level: "warn",
				message: `extension entry unreadable (I/O error): ${params.entryPath}`,
				source: params.sourceLabel
			});
			return null;
		},
		fallback: () => {
			params.diagnostics.push({
				level: "error",
				message: `extension entry escapes package directory: ${params.entryPath}`,
				source: params.sourceLabel
			});
			return null;
		}
	});
	const safeSource = opened.path;
	fsSync.closeSync(opened.fd);
	return safeSource;
}
function discoverInDirectory(params) {
	if (!fsSync.existsSync(params.dir)) return;
	let entries = [];
	try {
		entries = fsSync.readdirSync(params.dir, { withFileTypes: true });
	} catch (err) {
		params.diagnostics.push({
			level: "warn",
			message: `failed to read extensions dir: ${params.dir} (${String(err)})`,
			source: params.dir
		});
		return;
	}
	for (const entry of entries) {
		const fullPath = path.join(params.dir, entry.name);
		if (entry.isFile()) {
			if (!isExtensionFile(fullPath)) continue;
			addCandidate({
				candidates: params.candidates,
				diagnostics: params.diagnostics,
				seen: params.seen,
				idHint: path.basename(entry.name, path.extname(entry.name)),
				source: fullPath,
				rootDir: path.dirname(fullPath),
				origin: params.origin,
				ownershipUid: params.ownershipUid,
				workspaceDir: params.workspaceDir
			});
		}
		if (!entry.isDirectory()) continue;
		if (params.skipDirectories?.has(entry.name)) continue;
		if (shouldIgnoreScannedDirectory(entry.name)) continue;
		const rejectHardlinks = params.origin !== "bundled";
		const manifest = readPackageManifest(fullPath, rejectHardlinks);
		const extensionResolution = resolvePackageExtensionEntries(manifest ?? void 0);
		const extensions = extensionResolution.status === "ok" ? extensionResolution.entries : [];
		const manifestId = resolveIdHintManifestId(fullPath, rejectHardlinks);
		const setupEntryPath = getPackageManifestMetadata(manifest ?? void 0)?.setupEntry;
		const setupSource = typeof setupEntryPath === "string" && setupEntryPath.trim().length > 0 ? resolvePackageEntrySource({
			packageDir: fullPath,
			entryPath: setupEntryPath,
			sourceLabel: fullPath,
			diagnostics: params.diagnostics,
			rejectHardlinks
		}) : null;
		if (extensions.length > 0) {
			for (const extPath of extensions) {
				const resolved = resolvePackageEntrySource({
					packageDir: fullPath,
					entryPath: extPath,
					sourceLabel: fullPath,
					diagnostics: params.diagnostics,
					rejectHardlinks
				});
				if (!resolved) continue;
				addCandidate({
					candidates: params.candidates,
					diagnostics: params.diagnostics,
					seen: params.seen,
					idHint: deriveIdHint({
						filePath: resolved,
						manifestId,
						packageName: manifest?.name,
						hasMultipleExtensions: extensions.length > 1
					}),
					source: resolved,
					...setupSource ? { setupSource } : {},
					rootDir: fullPath,
					origin: params.origin,
					ownershipUid: params.ownershipUid,
					workspaceDir: params.workspaceDir,
					manifest,
					packageDir: fullPath
				});
			}
			continue;
		}
		if (discoverBundleInRoot({
			rootDir: fullPath,
			origin: params.origin,
			ownershipUid: params.ownershipUid,
			workspaceDir: params.workspaceDir,
			candidates: params.candidates,
			diagnostics: params.diagnostics,
			seen: params.seen
		}) === "added") continue;
		const indexFile = [...DEFAULT_PLUGIN_ENTRY_CANDIDATES].map((candidate) => path.join(fullPath, candidate)).find((candidate) => fsSync.existsSync(candidate));
		if (indexFile && isExtensionFile(indexFile)) addCandidate({
			candidates: params.candidates,
			diagnostics: params.diagnostics,
			seen: params.seen,
			idHint: entry.name,
			source: indexFile,
			...setupSource ? { setupSource } : {},
			rootDir: fullPath,
			origin: params.origin,
			ownershipUid: params.ownershipUid,
			workspaceDir: params.workspaceDir,
			manifest,
			packageDir: fullPath
		});
	}
}
function discoverFromPath(params) {
	const resolved = resolveUserPath(params.rawPath, params.env);
	if (!fsSync.existsSync(resolved)) {
		params.diagnostics.push({
			level: "error",
			message: `plugin path not found: ${resolved}`,
			source: resolved
		});
		return;
	}
	const stat = fsSync.statSync(resolved);
	if (stat.isFile()) {
		if (!isExtensionFile(resolved)) {
			params.diagnostics.push({
				level: "error",
				message: `plugin path is not a supported file: ${resolved}`,
				source: resolved
			});
			return;
		}
		addCandidate({
			candidates: params.candidates,
			diagnostics: params.diagnostics,
			seen: params.seen,
			idHint: path.basename(resolved, path.extname(resolved)),
			source: resolved,
			rootDir: path.dirname(resolved),
			origin: params.origin,
			ownershipUid: params.ownershipUid,
			workspaceDir: params.workspaceDir
		});
		return;
	}
	if (stat.isDirectory()) {
		const rejectHardlinks = params.origin !== "bundled";
		const manifest = readPackageManifest(resolved, rejectHardlinks);
		const extensionResolution = resolvePackageExtensionEntries(manifest ?? void 0);
		const extensions = extensionResolution.status === "ok" ? extensionResolution.entries : [];
		const manifestId = resolveIdHintManifestId(resolved, rejectHardlinks);
		const setupEntryPath = getPackageManifestMetadata(manifest ?? void 0)?.setupEntry;
		const setupSource = typeof setupEntryPath === "string" && setupEntryPath.trim().length > 0 ? resolvePackageEntrySource({
			packageDir: resolved,
			entryPath: setupEntryPath,
			sourceLabel: resolved,
			diagnostics: params.diagnostics,
			rejectHardlinks
		}) : null;
		if (extensions.length > 0) {
			for (const extPath of extensions) {
				const source = resolvePackageEntrySource({
					packageDir: resolved,
					entryPath: extPath,
					sourceLabel: resolved,
					diagnostics: params.diagnostics,
					rejectHardlinks
				});
				if (!source) continue;
				addCandidate({
					candidates: params.candidates,
					diagnostics: params.diagnostics,
					seen: params.seen,
					idHint: deriveIdHint({
						filePath: source,
						manifestId,
						packageName: manifest?.name,
						hasMultipleExtensions: extensions.length > 1
					}),
					source,
					...setupSource ? { setupSource } : {},
					rootDir: resolved,
					origin: params.origin,
					ownershipUid: params.ownershipUid,
					workspaceDir: params.workspaceDir,
					manifest,
					packageDir: resolved
				});
			}
			return;
		}
		if (discoverBundleInRoot({
			rootDir: resolved,
			origin: params.origin,
			ownershipUid: params.ownershipUid,
			workspaceDir: params.workspaceDir,
			candidates: params.candidates,
			diagnostics: params.diagnostics,
			seen: params.seen
		}) === "added") return;
		const indexFile = [...DEFAULT_PLUGIN_ENTRY_CANDIDATES].map((candidate) => path.join(resolved, candidate)).find((candidate) => fsSync.existsSync(candidate));
		if (indexFile && isExtensionFile(indexFile)) {
			addCandidate({
				candidates: params.candidates,
				diagnostics: params.diagnostics,
				seen: params.seen,
				idHint: path.basename(resolved),
				source: indexFile,
				...setupSource ? { setupSource } : {},
				rootDir: resolved,
				origin: params.origin,
				ownershipUid: params.ownershipUid,
				workspaceDir: params.workspaceDir,
				manifest,
				packageDir: resolved
			});
			return;
		}
		discoverInDirectory({
			dir: resolved,
			origin: params.origin,
			ownershipUid: params.ownershipUid,
			workspaceDir: params.workspaceDir,
			candidates: params.candidates,
			diagnostics: params.diagnostics,
			seen: params.seen
		});
		return;
	}
}
function discoverBundledMetadataInDirectory(params) {
	if (!fsSync.existsSync(params.dir)) return null;
	const coveredDirectories = /* @__PURE__ */ new Set();
	for (const entry of BUNDLED_PLUGIN_METADATA) {
		const rootDir = path.join(params.dir, entry.dirName);
		if (!fsSync.existsSync(rootDir)) continue;
		coveredDirectories.add(entry.dirName);
		const source = resolveBundledPluginGeneratedPath(rootDir, entry.source);
		if (!source) continue;
		const setupSource = resolveBundledPluginGeneratedPath(rootDir, entry.setupSource);
		const packageManifest = readPackageManifest(rootDir, false);
		addCandidate({
			candidates: params.candidates,
			diagnostics: params.diagnostics,
			seen: params.seen,
			idHint: entry.idHint,
			source,
			...setupSource ? { setupSource } : {},
			rootDir,
			origin: "bundled",
			ownershipUid: params.ownershipUid,
			manifest: {
				...packageManifest,
				...!packageManifest?.name && entry.packageName ? { name: entry.packageName } : {},
				...!packageManifest?.version && entry.packageVersion ? { version: entry.packageVersion } : {},
				...!packageManifest?.description && entry.packageDescription ? { description: entry.packageDescription } : {},
				...!packageManifest?.openclaw && entry.packageManifest ? { openclaw: entry.packageManifest } : {}
			},
			packageDir: rootDir,
			bundledManifest: entry.manifest,
			bundledManifestPath: path.join(rootDir, "openclaw.plugin.json")
		});
	}
	return coveredDirectories;
}
function discoverOpenClawPlugins(params) {
	const env = params.env ?? process.env;
	const cacheEnabled = params.cache !== false && shouldUseDiscoveryCache(env);
	const cacheKey = buildDiscoveryCacheKey({
		workspaceDir: params.workspaceDir,
		extraPaths: params.extraPaths,
		ownershipUid: params.ownershipUid,
		env
	});
	if (cacheEnabled) {
		const cached = discoveryCache.get(cacheKey);
		if (cached && cached.expiresAt > Date.now()) return cached.result;
	}
	const candidates = [];
	const diagnostics = [];
	const seen = /* @__PURE__ */ new Set();
	const workspaceDir = params.workspaceDir?.trim();
	const workspaceRoot = workspaceDir ? resolveUserPath(workspaceDir, env) : void 0;
	const roots = resolvePluginSourceRoots({
		workspaceDir: workspaceRoot,
		env
	});
	const extra = params.extraPaths ?? [];
	for (const extraPath of extra) {
		if (typeof extraPath !== "string") continue;
		const trimmed = extraPath.trim();
		if (!trimmed) continue;
		discoverFromPath({
			rawPath: trimmed,
			origin: "config",
			ownershipUid: params.ownershipUid,
			workspaceDir: workspaceDir?.trim() || void 0,
			env,
			candidates,
			diagnostics,
			seen
		});
	}
	if (roots.workspace && workspaceRoot) discoverInDirectory({
		dir: roots.workspace,
		origin: "workspace",
		ownershipUid: params.ownershipUid,
		workspaceDir: workspaceRoot,
		candidates,
		diagnostics,
		seen
	});
	if (roots.stock) {
		const coveredBundledDirectories = discoverBundledMetadataInDirectory({
			dir: roots.stock,
			ownershipUid: params.ownershipUid,
			candidates,
			diagnostics,
			seen
		});
		discoverInDirectory({
			dir: roots.stock,
			origin: "bundled",
			ownershipUid: params.ownershipUid,
			candidates,
			diagnostics,
			seen,
			...coveredBundledDirectories ? { skipDirectories: coveredBundledDirectories } : {}
		});
	}
	discoverInDirectory({
		dir: roots.global,
		origin: "global",
		ownershipUid: params.ownershipUid,
		candidates,
		diagnostics,
		seen
	});
	const result = {
		candidates,
		diagnostics
	};
	if (cacheEnabled) {
		const ttl = resolveDiscoveryCacheMs(env);
		if (ttl > 0) discoveryCache.set(cacheKey, {
			expiresAt: Date.now() + ttl,
			result
		});
	}
	return result;
}
//#endregion
//#region src/plugins/manifest-registry.ts
const PLUGIN_ORIGIN_RANK = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
const registryCache = /* @__PURE__ */ new Map();
const DEFAULT_MANIFEST_CACHE_MS = 1e3;
function clearPluginManifestRegistryCache() {
	registryCache.clear();
}
function resolveManifestCacheMs(env) {
	const raw = env.OPENCLAW_PLUGIN_MANIFEST_CACHE_MS?.trim();
	if (raw === "" || raw === "0") return 0;
	if (!raw) return DEFAULT_MANIFEST_CACHE_MS;
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed)) return DEFAULT_MANIFEST_CACHE_MS;
	return Math.max(0, parsed);
}
function shouldUseManifestCache(env) {
	if (env.OPENCLAW_DISABLE_PLUGIN_MANIFEST_CACHE?.trim()) return false;
	return resolveManifestCacheMs(env) > 0;
}
function buildCacheKey(params) {
	const { roots, loadPaths } = resolvePluginCacheInputs({
		workspaceDir: params.workspaceDir,
		loadPaths: params.plugins.loadPaths,
		env: params.env
	});
	return `${roots.workspace ?? ""}::${roots.global}::${roots.stock ?? ""}::${resolveCompatibilityHostVersion(params.env)}::${JSON.stringify(loadPaths)}`;
}
function safeStatMtimeMs(filePath) {
	try {
		return fsSync.statSync(filePath).mtimeMs;
	} catch {
		return null;
	}
}
function normalizeManifestLabel(raw) {
	const trimmed = raw?.trim();
	return trimmed ? trimmed : void 0;
}
function normalizePreferredPluginIds(raw) {
	if (!Array.isArray(raw)) return;
	const values = raw.map((entry) => typeof entry === "string" ? entry.trim() : "").filter(Boolean);
	return values.length > 0 ? values : void 0;
}
function mergePackageChannelMetaIntoChannelConfigs(params) {
	const channelId = params.packageChannel?.id?.trim();
	if (!channelId || !params.channelConfigs?.[channelId]) return params.channelConfigs;
	const existing = params.channelConfigs[channelId];
	const label = existing.label ?? (typeof params.packageChannel?.label === "string" ? params.packageChannel.label.trim() : "");
	const description = existing.description ?? (typeof params.packageChannel?.blurb === "string" ? params.packageChannel.blurb.trim() : "");
	const preferOver = existing.preferOver ?? normalizePreferredPluginIds(params.packageChannel?.preferOver);
	return {
		...params.channelConfigs,
		[channelId]: {
			...existing,
			...label ? { label } : {},
			...description ? { description } : {},
			...preferOver?.length ? { preferOver } : {}
		}
	};
}
function isCompatiblePluginIdHint(idHint, manifestId) {
	const normalizedHint = idHint?.trim();
	if (!normalizedHint) return true;
	if (normalizedHint === manifestId) return true;
	return normalizedHint === `${manifestId}-provider` || normalizedHint === `${manifestId}-plugin` || normalizedHint === `${manifestId}-sandbox` || normalizedHint === `${manifestId}-media-understanding`;
}
function buildRecord(params) {
	const channelConfigs = mergePackageChannelMetaIntoChannelConfigs({
		channelConfigs: params.manifest.channelConfigs,
		packageChannel: params.candidate.packageManifest?.channel
	});
	return {
		id: params.manifest.id,
		name: normalizeManifestLabel(params.manifest.name) ?? params.candidate.packageName,
		description: normalizeManifestLabel(params.manifest.description) ?? params.candidate.packageDescription,
		version: normalizeManifestLabel(params.manifest.version) ?? params.candidate.packageVersion,
		enabledByDefault: params.manifest.enabledByDefault === true ? true : void 0,
		autoEnableWhenConfiguredProviders: params.manifest.autoEnableWhenConfiguredProviders,
		format: params.candidate.format ?? "openclaw",
		bundleFormat: params.candidate.bundleFormat,
		kind: params.manifest.kind,
		channels: params.manifest.channels ?? [],
		providers: params.manifest.providers ?? [],
		cliBackends: params.manifest.cliBackends ?? [],
		providerAuthEnvVars: params.manifest.providerAuthEnvVars,
		providerAuthChoices: params.manifest.providerAuthChoices,
		skills: params.manifest.skills ?? [],
		settingsFiles: [],
		hooks: [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		setupSource: params.candidate.setupSource,
		startupDeferConfiguredChannelFullLoadUntilAfterListen: params.candidate.packageManifest?.startup?.deferConfiguredChannelFullLoadUntilAfterListen === true,
		manifestPath: params.manifestPath,
		schemaCacheKey: params.schemaCacheKey,
		configSchema: params.configSchema,
		configUiHints: params.manifest.uiHints,
		contracts: params.manifest.contracts,
		channelConfigs,
		...params.candidate.packageManifest?.channel?.id ? { channelCatalogMeta: {
			id: params.candidate.packageManifest.channel.id,
			...typeof params.candidate.packageManifest.channel.label === "string" ? { label: params.candidate.packageManifest.channel.label } : {},
			...typeof params.candidate.packageManifest.channel.blurb === "string" ? { blurb: params.candidate.packageManifest.channel.blurb } : {},
			...params.candidate.packageManifest.channel.preferOver ? { preferOver: params.candidate.packageManifest.channel.preferOver } : {}
		} } : {}
	};
}
function buildBundleRecord(params) {
	return {
		id: params.manifest.id,
		name: normalizeManifestLabel(params.manifest.name) ?? params.candidate.idHint,
		description: normalizeManifestLabel(params.manifest.description),
		version: normalizeManifestLabel(params.manifest.version),
		format: "bundle",
		bundleFormat: params.candidate.bundleFormat,
		bundleCapabilities: params.manifest.capabilities,
		channels: [],
		providers: [],
		cliBackends: [],
		skills: params.manifest.skills ?? [],
		settingsFiles: params.manifest.settingsFiles ?? [],
		hooks: params.manifest.hooks ?? [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		manifestPath: params.manifestPath,
		schemaCacheKey: void 0,
		configSchema: void 0,
		configUiHints: void 0,
		channelConfigs: void 0
	};
}
function matchesInstalledPluginRecord(params) {
	if (params.candidate.origin !== "global") return false;
	const record = params.config?.plugins?.installs?.[params.pluginId];
	if (!record) return false;
	const candidateSource = resolveUserPath(params.candidate.source, params.env);
	const trackedPaths = [record.installPath, record.sourcePath].filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => resolveUserPath(entry, params.env));
	if (trackedPaths.length === 0) return false;
	return trackedPaths.some((trackedPath) => {
		return candidateSource === trackedPath || isPathInside(trackedPath, candidateSource);
	});
}
function resolveDuplicatePrecedenceRank(params) {
	if (params.candidate.origin === "config") return 0;
	if (params.candidate.origin === "global" && matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		config: params.config,
		env: params.env
	})) return 1;
	if (params.candidate.origin === "bundled") return 2;
	if (params.candidate.origin === "workspace") return 3;
	return 4;
}
function loadPluginManifestRegistry(params = {}) {
	const config = params.config ?? {};
	const normalized = normalizePluginsConfig(config.plugins);
	const env = params.env ?? process.env;
	const cacheKey = buildCacheKey({
		workspaceDir: params.workspaceDir,
		plugins: normalized,
		env
	});
	const cacheEnabled = params.cache !== false && shouldUseManifestCache(env);
	if (cacheEnabled) {
		const cached = registryCache.get(cacheKey);
		if (cached && cached.expiresAt > Date.now()) return cached.registry;
	}
	const discovery = params.candidates ? {
		candidates: params.candidates,
		diagnostics: params.diagnostics ?? []
	} : discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalized.loadPaths,
		cache: params.cache,
		env
	});
	const diagnostics = [...discovery.diagnostics];
	const candidates = discovery.candidates;
	const records = [];
	const seenIds = /* @__PURE__ */ new Map();
	const realpathCache = /* @__PURE__ */ new Map();
	const currentHostVersion = resolveCompatibilityHostVersion(env);
	for (const candidate of candidates) {
		const rejectHardlinks = candidate.origin !== "bundled";
		const isBundleRecord = (candidate.format ?? "openclaw") === "bundle";
		const manifestRes = candidate.origin === "bundled" && candidate.bundledManifest && candidate.bundledManifestPath ? {
			ok: true,
			manifest: candidate.bundledManifest,
			manifestPath: candidate.bundledManifestPath
		} : isBundleRecord && candidate.bundleFormat ? loadBundleManifest({
			rootDir: candidate.rootDir,
			bundleFormat: candidate.bundleFormat,
			rejectHardlinks
		}) : loadPluginManifest(candidate.rootDir, rejectHardlinks);
		if (!manifestRes.ok) {
			diagnostics.push({
				level: "error",
				message: manifestRes.error,
				source: manifestRes.manifestPath
			});
			continue;
		}
		const manifest = manifestRes.manifest;
		const minHostVersionCheck = checkMinHostVersion({
			currentVersion: currentHostVersion,
			minHostVersion: candidate.packageManifest?.install?.minHostVersion
		});
		if (!minHostVersionCheck.ok) {
			const packageManifestSource = path.join(candidate.packageDir ?? candidate.rootDir, "package.json");
			diagnostics.push({
				level: minHostVersionCheck.kind === "unknown_host_version" ? "warn" : "error",
				pluginId: manifest.id,
				source: packageManifestSource,
				message: minHostVersionCheck.kind === "invalid" ? `plugin manifest invalid | ${minHostVersionCheck.error}` : minHostVersionCheck.kind === "unknown_host_version" ? `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined; skipping load` : `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}; skipping load`
			});
			continue;
		}
		if (!isCompatiblePluginIdHint(candidate.idHint, manifest.id)) diagnostics.push({
			level: "warn",
			pluginId: manifest.id,
			source: candidate.source,
			message: `plugin id mismatch (manifest uses "${manifest.id}", entry hints "${candidate.idHint}")`
		});
		const configSchema = "configSchema" in manifest ? manifest.configSchema : void 0;
		const schemaCacheKey = (() => {
			if (!configSchema) return;
			const manifestMtime = safeStatMtimeMs(manifestRes.manifestPath);
			return manifestMtime ? `${manifestRes.manifestPath}:${manifestMtime}` : manifestRes.manifestPath;
		})();
		const existing = seenIds.get(manifest.id);
		if (existing) {
			const samePath = existing.candidate.rootDir === candidate.rootDir;
			if ((() => {
				if (samePath) return true;
				const existingReal = safeRealpathSync(existing.candidate.rootDir, realpathCache);
				const candidateReal = safeRealpathSync(candidate.rootDir, realpathCache);
				return Boolean(existingReal && candidateReal && existingReal === candidateReal);
			})()) {
				if (PLUGIN_ORIGIN_RANK[candidate.origin] < PLUGIN_ORIGIN_RANK[existing.candidate.origin]) {
					records[existing.recordIndex] = isBundleRecord ? buildBundleRecord({
						manifest,
						candidate,
						manifestPath: manifestRes.manifestPath
					}) : buildRecord({
						manifest,
						candidate,
						manifestPath: manifestRes.manifestPath,
						schemaCacheKey,
						configSchema
					});
					seenIds.set(manifest.id, {
						candidate,
						recordIndex: existing.recordIndex
					});
				}
				continue;
			}
			diagnostics.push({
				level: "warn",
				pluginId: manifest.id,
				source: candidate.source,
				message: resolveDuplicatePrecedenceRank({
					pluginId: manifest.id,
					candidate,
					config,
					env
				}) < resolveDuplicatePrecedenceRank({
					pluginId: manifest.id,
					candidate: existing.candidate,
					config,
					env
				}) ? `duplicate plugin id detected; ${existing.candidate.origin} plugin will be overridden by ${candidate.origin} plugin (${candidate.source})` : `duplicate plugin id detected; ${candidate.origin} plugin will be overridden by ${existing.candidate.origin} plugin (${candidate.source})`
			});
		} else seenIds.set(manifest.id, {
			candidate,
			recordIndex: records.length
		});
		records.push(isBundleRecord ? buildBundleRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath
		}) : buildRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			schemaCacheKey,
			configSchema
		}));
	}
	const registry = {
		plugins: records,
		diagnostics
	};
	if (cacheEnabled) {
		const ttl = resolveManifestCacheMs(env);
		if (ttl > 0) registryCache.set(cacheKey, {
			expiresAt: Date.now() + ttl,
			registry
		});
	}
	return registry;
}
//#endregion
export { resolvePluginCacheInputs as a, discoverOpenClawPlugins as i, loadPluginManifestRegistry as n, resolvePluginSourceRoots as o, clearPluginDiscoveryCache as r, resolveBundledPluginsDir as s, clearPluginManifestRegistryCache as t };
