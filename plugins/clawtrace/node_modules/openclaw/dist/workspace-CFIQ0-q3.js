import { o as resolveRequiredHomeDir } from "./home-dir-BnP38vVl.js";
import { m as pathExists, v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { C as isCronSessionKey, w as isSubagentSessionKey } from "./session-key-BhxcMJEE.js";
import { r as openBoundaryFile } from "./boundary-file-read-7v-hs51G.js";
import { n as runCommandWithTimeout } from "./exec-CLVZ7JOg.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-C-5WlcYo.js";
import { fileURLToPath } from "node:url";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
//#region src/agents/workspace-templates.ts
const FALLBACK_TEMPLATE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/reference/templates");
let cachedTemplateDir;
let resolvingTemplateDir;
async function resolveWorkspaceTemplateDir(opts) {
	if (cachedTemplateDir) return cachedTemplateDir;
	if (resolvingTemplateDir) return resolvingTemplateDir;
	resolvingTemplateDir = (async () => {
		const moduleUrl = opts?.moduleUrl ?? import.meta.url;
		const argv1 = opts?.argv1 ?? process.argv[1];
		const cwd = opts?.cwd ?? process.cwd();
		const packageRoot = await resolveOpenClawPackageRoot({
			moduleUrl,
			argv1,
			cwd
		});
		const candidates = [
			packageRoot ? path.join(packageRoot, "docs", "reference", "templates") : null,
			cwd ? path.resolve(cwd, "docs", "reference", "templates") : null,
			FALLBACK_TEMPLATE_DIR
		].filter(Boolean);
		for (const candidate of candidates) if (await pathExists(candidate)) {
			cachedTemplateDir = candidate;
			return candidate;
		}
		cachedTemplateDir = candidates[0] ?? FALLBACK_TEMPLATE_DIR;
		return cachedTemplateDir;
	})();
	try {
		return await resolvingTemplateDir;
	} finally {
		resolvingTemplateDir = void 0;
	}
}
//#endregion
//#region src/agents/workspace.ts
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = os.homedir) {
	const home = resolveRequiredHomeDir(env, homedir);
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (profile && profile.toLowerCase() !== "default") return path.join(home, ".openclaw", `workspace-${profile}`);
	return path.join(home, ".openclaw", "workspace");
}
const DEFAULT_AGENT_WORKSPACE_DIR = resolveDefaultAgentWorkspaceDir();
const DEFAULT_AGENTS_FILENAME = "AGENTS.md";
const DEFAULT_SOUL_FILENAME = "SOUL.md";
const DEFAULT_TOOLS_FILENAME = "TOOLS.md";
const DEFAULT_IDENTITY_FILENAME = "IDENTITY.md";
const DEFAULT_USER_FILENAME = "USER.md";
const DEFAULT_HEARTBEAT_FILENAME = "HEARTBEAT.md";
const DEFAULT_BOOTSTRAP_FILENAME = "BOOTSTRAP.md";
const DEFAULT_MEMORY_FILENAME = "MEMORY.md";
const DEFAULT_MEMORY_ALT_FILENAME = "memory.md";
const WORKSPACE_STATE_DIRNAME = ".openclaw";
const WORKSPACE_STATE_FILENAME = "workspace-state.json";
const WORKSPACE_STATE_VERSION = 1;
const workspaceTemplateCache = /* @__PURE__ */ new Map();
let gitAvailabilityPromise = null;
const MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES = 2 * 1024 * 1024;
const workspaceFileCache = /* @__PURE__ */ new Map();
function workspaceFileIdentity(stat, canonicalPath) {
	return `${canonicalPath}|${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}`;
}
async function readWorkspaceFileWithGuards(params) {
	const opened = await openBoundaryFile({
		absolutePath: params.filePath,
		rootPath: params.workspaceDir,
		boundaryLabel: "workspace root",
		maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
	});
	if (!opened.ok) {
		workspaceFileCache.delete(params.filePath);
		return opened;
	}
	const identity = workspaceFileIdentity(opened.stat, opened.path);
	const cached = workspaceFileCache.get(params.filePath);
	if (cached && cached.identity === identity) {
		fsSync.closeSync(opened.fd);
		return {
			ok: true,
			content: cached.content
		};
	}
	try {
		const content = fsSync.readFileSync(opened.fd, "utf-8");
		workspaceFileCache.set(params.filePath, {
			content,
			identity
		});
		return {
			ok: true,
			content
		};
	} catch (error) {
		workspaceFileCache.delete(params.filePath);
		return {
			ok: false,
			reason: "io",
			error
		};
	} finally {
		fsSync.closeSync(opened.fd);
	}
}
function stripFrontMatter(content) {
	if (!content.startsWith("---")) return content;
	const endIndex = content.indexOf("\n---", 3);
	if (endIndex === -1) return content;
	const start = endIndex + 4;
	let trimmed = content.slice(start);
	trimmed = trimmed.replace(/^\s+/, "");
	return trimmed;
}
async function loadTemplate(name) {
	const cached = workspaceTemplateCache.get(name);
	if (cached) return cached;
	const pending = (async () => {
		const templateDir = await resolveWorkspaceTemplateDir();
		const templatePath = path.join(templateDir, name);
		try {
			return stripFrontMatter(await fs.readFile(templatePath, "utf-8"));
		} catch {
			throw new Error(`Missing workspace template: ${name} (${templatePath}). Ensure docs/reference/templates are packaged.`);
		}
	})();
	workspaceTemplateCache.set(name, pending);
	try {
		return await pending;
	} catch (error) {
		workspaceTemplateCache.delete(name);
		throw error;
	}
}
/** Set of recognized bootstrap filenames for runtime validation */
const VALID_BOOTSTRAP_NAMES = new Set([
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_TOOLS_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME,
	DEFAULT_HEARTBEAT_FILENAME,
	DEFAULT_BOOTSTRAP_FILENAME,
	DEFAULT_MEMORY_FILENAME,
	DEFAULT_MEMORY_ALT_FILENAME
]);
async function writeFileIfMissing(filePath, content) {
	try {
		await fs.writeFile(filePath, content, {
			encoding: "utf-8",
			flag: "wx"
		});
		return true;
	} catch (err) {
		if (err.code !== "EEXIST") throw err;
		return false;
	}
}
async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}
function resolveWorkspaceStatePath(dir) {
	return path.join(dir, WORKSPACE_STATE_DIRNAME, WORKSPACE_STATE_FILENAME);
}
function parseWorkspaceSetupState(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		const legacyCompletedAt = typeof parsed.onboardingCompletedAt === "string" ? parsed.onboardingCompletedAt : void 0;
		return {
			version: WORKSPACE_STATE_VERSION,
			bootstrapSeededAt: typeof parsed.bootstrapSeededAt === "string" ? parsed.bootstrapSeededAt : void 0,
			setupCompletedAt: typeof parsed.setupCompletedAt === "string" ? parsed.setupCompletedAt : legacyCompletedAt
		};
	} catch {
		return null;
	}
}
async function readWorkspaceSetupState(statePath) {
	try {
		const raw = await fs.readFile(statePath, "utf-8");
		const parsed = parseWorkspaceSetupState(raw);
		if (parsed && raw.includes("\"onboardingCompletedAt\"") && !raw.includes("\"setupCompletedAt\"") && parsed.setupCompletedAt) await writeWorkspaceSetupState(statePath, parsed);
		return parsed ?? { version: WORKSPACE_STATE_VERSION };
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
		return { version: WORKSPACE_STATE_VERSION };
	}
}
async function readWorkspaceSetupStateForDir(dir) {
	return await readWorkspaceSetupState(resolveWorkspaceStatePath(resolveUserPath(dir)));
}
async function isWorkspaceSetupCompleted(dir) {
	const state = await readWorkspaceSetupStateForDir(dir);
	return typeof state.setupCompletedAt === "string" && state.setupCompletedAt.trim().length > 0;
}
async function writeWorkspaceSetupState(statePath, state) {
	await fs.mkdir(path.dirname(statePath), { recursive: true });
	const payload = `${JSON.stringify(state, null, 2)}\n`;
	const tmpPath = `${statePath}.tmp-${process.pid}-${Date.now().toString(36)}`;
	try {
		await fs.writeFile(tmpPath, payload, { encoding: "utf-8" });
		await fs.rename(tmpPath, statePath);
	} catch (err) {
		await fs.unlink(tmpPath).catch(() => {});
		throw err;
	}
}
async function hasGitRepo(dir) {
	try {
		await fs.stat(path.join(dir, ".git"));
		return true;
	} catch {
		return false;
	}
}
async function isGitAvailable() {
	if (gitAvailabilityPromise) return gitAvailabilityPromise;
	gitAvailabilityPromise = (async () => {
		try {
			return (await runCommandWithTimeout(["git", "--version"], { timeoutMs: 2e3 })).code === 0;
		} catch {
			return false;
		}
	})();
	return gitAvailabilityPromise;
}
async function ensureGitRepo(dir, isBrandNewWorkspace) {
	if (!isBrandNewWorkspace) return;
	if (await hasGitRepo(dir)) return;
	if (!await isGitAvailable()) return;
	try {
		await runCommandWithTimeout(["git", "init"], {
			cwd: dir,
			timeoutMs: 1e4
		});
	} catch {}
}
async function ensureAgentWorkspace(params) {
	const dir = resolveUserPath(params?.dir?.trim() ? params.dir.trim() : DEFAULT_AGENT_WORKSPACE_DIR);
	await fs.mkdir(dir, { recursive: true });
	if (!params?.ensureBootstrapFiles) return { dir };
	const agentsPath = path.join(dir, DEFAULT_AGENTS_FILENAME);
	const soulPath = path.join(dir, DEFAULT_SOUL_FILENAME);
	const toolsPath = path.join(dir, DEFAULT_TOOLS_FILENAME);
	const identityPath = path.join(dir, DEFAULT_IDENTITY_FILENAME);
	const userPath = path.join(dir, DEFAULT_USER_FILENAME);
	const heartbeatPath = path.join(dir, DEFAULT_HEARTBEAT_FILENAME);
	const bootstrapPath = path.join(dir, DEFAULT_BOOTSTRAP_FILENAME);
	const statePath = resolveWorkspaceStatePath(dir);
	const isBrandNewWorkspace = await (async () => {
		const templatePaths = [
			agentsPath,
			soulPath,
			toolsPath,
			identityPath,
			userPath,
			heartbeatPath
		];
		const userContentPaths = [
			path.join(dir, "memory"),
			path.join(dir, DEFAULT_MEMORY_FILENAME),
			path.join(dir, ".git")
		];
		const paths = [...templatePaths, ...userContentPaths];
		return (await Promise.all(paths.map(async (p) => {
			try {
				await fs.access(p);
				return true;
			} catch {
				return false;
			}
		}))).every((v) => !v);
	})();
	const agentsTemplate = await loadTemplate(DEFAULT_AGENTS_FILENAME);
	const soulTemplate = await loadTemplate(DEFAULT_SOUL_FILENAME);
	const toolsTemplate = await loadTemplate(DEFAULT_TOOLS_FILENAME);
	const identityTemplate = await loadTemplate(DEFAULT_IDENTITY_FILENAME);
	const userTemplate = await loadTemplate(DEFAULT_USER_FILENAME);
	const heartbeatTemplate = await loadTemplate(DEFAULT_HEARTBEAT_FILENAME);
	await writeFileIfMissing(agentsPath, agentsTemplate);
	await writeFileIfMissing(soulPath, soulTemplate);
	await writeFileIfMissing(toolsPath, toolsTemplate);
	await writeFileIfMissing(identityPath, identityTemplate);
	await writeFileIfMissing(userPath, userTemplate);
	await writeFileIfMissing(heartbeatPath, heartbeatTemplate);
	let state = await readWorkspaceSetupState(statePath);
	let stateDirty = false;
	const markState = (next) => {
		state = {
			...state,
			...next
		};
		stateDirty = true;
	};
	const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
	let bootstrapExists = await fileExists(bootstrapPath);
	if (!state.bootstrapSeededAt && bootstrapExists) markState({ bootstrapSeededAt: nowIso() });
	if (!state.setupCompletedAt && state.bootstrapSeededAt && !bootstrapExists) markState({ setupCompletedAt: nowIso() });
	if (!state.bootstrapSeededAt && !state.setupCompletedAt && !bootstrapExists) {
		const [identityContent, userContent] = await Promise.all([fs.readFile(identityPath, "utf-8"), fs.readFile(userPath, "utf-8")]);
		const hasUserContent = await (async () => {
			const indicators = [
				path.join(dir, "memory"),
				path.join(dir, DEFAULT_MEMORY_FILENAME),
				path.join(dir, ".git")
			];
			for (const indicator of indicators) try {
				await fs.access(indicator);
				return true;
			} catch {}
			return false;
		})();
		if (identityContent !== identityTemplate || userContent !== userTemplate || hasUserContent) markState({ setupCompletedAt: nowIso() });
		else {
			if (!await writeFileIfMissing(bootstrapPath, await loadTemplate("BOOTSTRAP.md"))) bootstrapExists = await fileExists(bootstrapPath);
			else bootstrapExists = true;
			if (bootstrapExists && !state.bootstrapSeededAt) markState({ bootstrapSeededAt: nowIso() });
		}
	}
	if (stateDirty) await writeWorkspaceSetupState(statePath, state);
	await ensureGitRepo(dir, isBrandNewWorkspace);
	return {
		dir,
		agentsPath,
		soulPath,
		toolsPath,
		identityPath,
		userPath,
		heartbeatPath,
		bootstrapPath
	};
}
async function resolveMemoryBootstrapEntry(resolvedDir) {
	for (const name of [DEFAULT_MEMORY_FILENAME, DEFAULT_MEMORY_ALT_FILENAME]) {
		const filePath = path.join(resolvedDir, name);
		try {
			await fs.access(filePath);
			return {
				name,
				filePath
			};
		} catch {}
	}
	return null;
}
async function loadWorkspaceBootstrapFiles(dir) {
	const resolvedDir = resolveUserPath(dir);
	const entries = [
		{
			name: DEFAULT_AGENTS_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_AGENTS_FILENAME)
		},
		{
			name: DEFAULT_SOUL_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_SOUL_FILENAME)
		},
		{
			name: DEFAULT_TOOLS_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_TOOLS_FILENAME)
		},
		{
			name: DEFAULT_IDENTITY_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_IDENTITY_FILENAME)
		},
		{
			name: DEFAULT_USER_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_USER_FILENAME)
		},
		{
			name: DEFAULT_HEARTBEAT_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_HEARTBEAT_FILENAME)
		},
		{
			name: DEFAULT_BOOTSTRAP_FILENAME,
			filePath: path.join(resolvedDir, DEFAULT_BOOTSTRAP_FILENAME)
		}
	];
	const memoryEntry = await resolveMemoryBootstrapEntry(resolvedDir);
	if (memoryEntry) entries.push(memoryEntry);
	const result = [];
	for (const entry of entries) {
		const loaded = await readWorkspaceFileWithGuards({
			filePath: entry.filePath,
			workspaceDir: resolvedDir
		});
		if (loaded.ok) result.push({
			name: entry.name,
			path: entry.filePath,
			content: loaded.content,
			missing: false
		});
		else result.push({
			name: entry.name,
			path: entry.filePath,
			missing: true
		});
	}
	return result;
}
const MINIMAL_BOOTSTRAP_ALLOWLIST = new Set([
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_TOOLS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
]);
function filterBootstrapFilesForSession(files, sessionKey) {
	if (!sessionKey || !isSubagentSessionKey(sessionKey) && !isCronSessionKey(sessionKey)) return files;
	return files.filter((file) => MINIMAL_BOOTSTRAP_ALLOWLIST.has(file.name));
}
async function loadExtraBootstrapFilesWithDiagnostics(dir, extraPatterns) {
	if (!extraPatterns.length) return {
		files: [],
		diagnostics: []
	};
	const resolvedDir = resolveUserPath(dir);
	const resolvedPaths = /* @__PURE__ */ new Set();
	for (const pattern of extraPatterns) if (pattern.includes("*") || pattern.includes("?") || pattern.includes("{")) try {
		const matches = fs.glob(pattern, { cwd: resolvedDir });
		for await (const m of matches) resolvedPaths.add(m);
	} catch {
		resolvedPaths.add(pattern);
	}
	else resolvedPaths.add(pattern);
	const files = [];
	const diagnostics = [];
	for (const relPath of resolvedPaths) {
		const filePath = path.resolve(resolvedDir, relPath);
		const baseName = path.basename(relPath);
		if (!VALID_BOOTSTRAP_NAMES.has(baseName)) {
			diagnostics.push({
				path: filePath,
				reason: "invalid-bootstrap-filename",
				detail: `unsupported bootstrap basename: ${baseName}`
			});
			continue;
		}
		const loaded = await readWorkspaceFileWithGuards({
			filePath,
			workspaceDir: resolvedDir
		});
		if (loaded.ok) {
			files.push({
				name: baseName,
				path: filePath,
				content: loaded.content,
				missing: false
			});
			continue;
		}
		const reason = loaded.reason === "path" ? "missing" : loaded.reason === "validation" ? "security" : "io";
		diagnostics.push({
			path: filePath,
			reason,
			detail: loaded.error instanceof Error ? loaded.error.message : typeof loaded.error === "string" ? loaded.error : reason
		});
	}
	return {
		files,
		diagnostics
	};
}
//#endregion
export { resolveWorkspaceTemplateDir as _, DEFAULT_IDENTITY_FILENAME as a, DEFAULT_SOUL_FILENAME as c, ensureAgentWorkspace as d, filterBootstrapFilesForSession as f, resolveDefaultAgentWorkspaceDir as g, loadWorkspaceBootstrapFiles as h, DEFAULT_HEARTBEAT_FILENAME as i, DEFAULT_TOOLS_FILENAME as l, loadExtraBootstrapFilesWithDiagnostics as m, DEFAULT_AGENT_WORKSPACE_DIR as n, DEFAULT_MEMORY_ALT_FILENAME as o, isWorkspaceSetupCompleted as p, DEFAULT_BOOTSTRAP_FILENAME as r, DEFAULT_MEMORY_FILENAME as s, DEFAULT_AGENTS_FILENAME as t, DEFAULT_USER_FILENAME as u };
