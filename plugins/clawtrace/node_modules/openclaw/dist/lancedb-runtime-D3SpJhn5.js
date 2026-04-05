import { _ as resolveStateDir } from "./paths-Y4UT24Of.js";
import "./api-CacYw7ty.js";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import fsSync from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";
//#region extensions/memory-lancedb/lancedb-runtime.ts
const MEMORY_LANCEDB_RUNTIME_MANIFEST = (() => {
	const lanceDbSpec = JSON.parse(fsSync.readFileSync(new URL("./package.json", import.meta.url), "utf8")).dependencies?.["@lancedb/lancedb"];
	if (!lanceDbSpec) throw new Error("memory-lancedb package.json is missing \"@lancedb/lancedb\"");
	return {
		name: "openclaw-memory-lancedb-runtime",
		private: true,
		type: "module",
		dependencies: { "@lancedb/lancedb": lanceDbSpec }
	};
})();
function resolveRuntimeDir(stateDir) {
	return path.join(stateDir, "plugin-runtimes", "memory-lancedb", "lancedb");
}
function readRuntimeManifest(filePath) {
	try {
		return JSON.parse(fsSync.readFileSync(filePath, "utf8"));
	} catch {
		return null;
	}
}
function manifestsMatch(actual, expected) {
	if (!actual) return false;
	return JSON.stringify(actual) === JSON.stringify(expected);
}
function defaultResolveRuntimeEntry(params) {
	const runtimePackagePath = path.join(params.runtimeDir, "package.json");
	if (!manifestsMatch(readRuntimeManifest(runtimePackagePath), params.manifest)) return null;
	try {
		return createRequire(runtimePackagePath).resolve("@lancedb/lancedb");
	} catch {
		return null;
	}
}
function collectSpawnOutput(params) {
	return new Promise((resolve) => {
		const child = spawn(params.command, params.args, {
			cwd: params.cwd,
			env: params.env,
			shell: process.platform === "win32",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (chunk) => {
			stdout += chunk.toString();
		});
		child.stderr.on("data", (chunk) => {
			stderr += chunk.toString();
		});
		child.on("error", (error) => {
			resolve({
				code: null,
				stdout,
				stderr,
				error
			});
		});
		child.on("close", (code) => {
			resolve({
				code,
				stdout,
				stderr
			});
		});
	});
}
async function defaultInstallRuntime(params) {
	const runtimePackagePath = path.join(params.runtimeDir, "package.json");
	if (!manifestsMatch(readRuntimeManifest(runtimePackagePath), params.manifest)) {
		await fsSync.promises.rm(path.join(params.runtimeDir, "node_modules"), {
			recursive: true,
			force: true
		});
		await fsSync.promises.rm(path.join(params.runtimeDir, "package-lock.json"), { force: true });
	}
	await fsSync.promises.mkdir(params.runtimeDir, { recursive: true });
	await fsSync.promises.writeFile(runtimePackagePath, `${JSON.stringify(params.manifest, null, 2)}\n`, "utf8");
	const install = await collectSpawnOutput({
		command: "npm",
		args: [
			"install",
			"--omit=dev",
			"--silent",
			"--ignore-scripts",
			"--package-lock=false"
		],
		cwd: params.runtimeDir,
		env: params.env
	});
	if (install.error) {
		const spawnError = install.error;
		throw new Error(spawnError.code === "ENOENT" ? "npm is required to install the LanceDB runtime but was not found on PATH" : install.error.message);
	}
	if ((install.code ?? 0) !== 0) {
		const detail = install.stderr.trim() || install.stdout.trim();
		throw new Error(detail || `npm exited with code ${install.code ?? "unknown"}`);
	}
	const resolved = defaultResolveRuntimeEntry({
		runtimeDir: params.runtimeDir,
		manifest: params.manifest
	});
	if (!resolved) throw new Error("installed LanceDB runtime is missing the @lancedb/lancedb entry");
	params.logger?.info?.(`memory-lancedb: installed LanceDB runtime under ${params.runtimeDir}`);
	return resolved;
}
function defaultImportResolved(resolvedPath) {
	return import(pathToFileURL(resolvedPath).href);
}
function buildLoadFailureMessage(prefix, error) {
	return `memory-lancedb: ${prefix}. ${String(error)}`;
}
function createLanceDbRuntimeLoader(overrides = {}) {
	const deps = {
		env: overrides.env ?? process.env,
		resolveStateDir: overrides.resolveStateDir ?? resolveStateDir,
		runtimeManifest: overrides.runtimeManifest ?? MEMORY_LANCEDB_RUNTIME_MANIFEST,
		importBundled: overrides.importBundled ?? (() => import("@lancedb/lancedb")),
		importResolved: overrides.importResolved ?? defaultImportResolved,
		resolveRuntimeEntry: overrides.resolveRuntimeEntry ?? defaultResolveRuntimeEntry,
		installRuntime: overrides.installRuntime ?? defaultInstallRuntime
	};
	let loadPromise = null;
	return { async load(logger) {
		if (!loadPromise) loadPromise = (async () => {
			try {
				return await deps.importBundled();
			} catch (bundledError) {
				const runtimeDir = resolveRuntimeDir(deps.resolveStateDir(deps.env, () => deps.env.HOME?.trim() ? deps.env.HOME : os.homedir()));
				const existingRuntime = deps.resolveRuntimeEntry({
					runtimeDir,
					manifest: deps.runtimeManifest
				});
				if (existingRuntime) try {
					return await deps.importResolved(existingRuntime);
				} catch {}
				if (deps.env.OPENCLAW_NIX_MODE === "1") throw new Error(buildLoadFailureMessage("failed to load LanceDB and Nix mode disables auto-install", bundledError), { cause: bundledError });
				logger?.warn?.(`memory-lancedb: bundled LanceDB runtime unavailable (${String(bundledError)}); installing runtime deps under ${runtimeDir}`);
				const installedEntry = await deps.installRuntime({
					runtimeDir,
					manifest: deps.runtimeManifest,
					env: deps.env,
					logger
				});
				try {
					return await deps.importResolved(installedEntry);
				} catch (runtimeError) {
					throw new Error(buildLoadFailureMessage("failed to load LanceDB after installing runtime deps", runtimeError), { cause: runtimeError });
				}
			}
		})().catch((error) => {
			loadPromise = null;
			throw error;
		});
		return await loadPromise;
	} };
}
const defaultLoader = createLanceDbRuntimeLoader();
async function loadLanceDbModule(logger) {
	return await defaultLoader.load(logger);
}
//#endregion
export { loadLanceDbModule as n, createLanceDbRuntimeLoader as t };
