import { g as resolveHomeDir, u as isRecord } from "./utils-BfvDpbwh.js";
import { L as OpenClawSchema, g as readConfigFileSnapshot } from "./auth-profiles-B5ypC5S-.js";
import { t as CONFIG_PATH } from "./paths-Y4UT24Of.js";
import { n as formatConfigIssueLines } from "./issue-format-CfhA-_wV.js";
import { t as note } from "./note-BaFEsQZA.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-config-analysis.ts
function normalizeIssuePath(path) {
	return path.filter((part) => typeof part !== "symbol");
}
function isUnrecognizedKeysIssue(issue) {
	return issue.code === "unrecognized_keys";
}
function formatConfigPath(parts) {
	if (parts.length === 0) return "<root>";
	let out = "";
	for (const part of parts) {
		if (typeof part === "number") {
			out += `[${part}]`;
			continue;
		}
		out = out ? `${out}.${part}` : part;
	}
	return out || "<root>";
}
function resolveConfigPathTarget(root, path) {
	let current = root;
	for (const part of path) {
		if (typeof part === "number") {
			if (!Array.isArray(current)) return null;
			if (part < 0 || part >= current.length) return null;
			current = current[part];
			continue;
		}
		if (!current || typeof current !== "object" || Array.isArray(current)) return null;
		const record = current;
		if (!(part in record)) return null;
		current = record[part];
	}
	return current;
}
function stripUnknownConfigKeys(config) {
	const parsed = OpenClawSchema.safeParse(config);
	if (parsed.success) return {
		config,
		removed: []
	};
	const next = structuredClone(config);
	const removed = [];
	for (const issue of parsed.error.issues) {
		if (!isUnrecognizedKeysIssue(issue)) continue;
		const issuePath = normalizeIssuePath(issue.path);
		const target = resolveConfigPathTarget(next, issuePath);
		if (!target || typeof target !== "object" || Array.isArray(target)) continue;
		const record = target;
		for (const key of issue.keys) {
			if (typeof key !== "string" || !(key in record)) continue;
			delete record[key];
			removed.push(formatConfigPath([...issuePath, key]));
		}
	}
	return {
		config: next,
		removed
	};
}
function noteOpencodeProviderOverrides(cfg) {
	const providers = cfg.models?.providers;
	if (!providers) return;
	const overrides = [];
	if (providers.opencode) overrides.push("opencode");
	if (providers["opencode-zen"]) overrides.push("opencode-zen");
	if (providers["opencode-go"]) overrides.push("opencode-go");
	if (overrides.length === 0) return;
	const lines = overrides.flatMap((id) => {
		const providerLabel = id === "opencode-go" ? "OpenCode Go" : "OpenCode Zen";
		const providerEntry = providers[id];
		const api = isRecord(providerEntry) && typeof providerEntry.api === "string" ? providerEntry.api : void 0;
		return [`- models.providers.${id} is set; this overrides the built-in ${providerLabel} catalog.`, api ? `- models.providers.${id}.api=${api}` : null].filter((line) => Boolean(line));
	});
	lines.push("- Remove these entries to restore per-model API routing + costs (then re-run setup if needed).");
	note(lines.join("\n"), "OpenCode");
}
function noteIncludeConfinementWarning(snapshot) {
	const includeIssue = (snapshot.issues ?? []).find((issue) => issue.message.includes("Include path escapes config directory") || issue.message.includes("Include path resolves outside config directory"));
	if (!includeIssue) return;
	note([
		`- $include paths must stay under: ${path.dirname(snapshot.path ?? CONFIG_PATH)}`,
		"- Move shared include files under that directory and update to relative paths like \"./shared/common.json\".",
		`- Error: ${includeIssue.message}`
	].join("\n"), "Doctor warnings");
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
async function maybeMigrateLegacyConfig() {
	const changes = [];
	const home = resolveHomeDir();
	if (!home) return changes;
	const targetDir = path.join(home, ".openclaw");
	const targetPath = path.join(targetDir, "openclaw.json");
	try {
		await fs.access(targetPath);
		return changes;
	} catch {}
	const legacyCandidates = [path.join(home, ".clawdbot", "clawdbot.json"), path.join(home, ".moldbot", "moldbot.json")];
	let legacyPath = null;
	for (const candidate of legacyCandidates) try {
		await fs.access(candidate);
		legacyPath = candidate;
		break;
	} catch {}
	if (!legacyPath) return changes;
	await fs.mkdir(targetDir, { recursive: true });
	try {
		await fs.copyFile(legacyPath, targetPath, fs.constants.COPYFILE_EXCL);
		changes.push(`Migrated legacy config: ${legacyPath} -> ${targetPath}`);
	} catch {}
	return changes;
}
async function runDoctorConfigPreflight(options = {}) {
	if (options.migrateState !== false) {
		const { autoMigrateLegacyStateDir } = await import("./doctor-state-migrations-DSsiMGLv.js");
		const stateDirResult = await autoMigrateLegacyStateDir({ env: process.env });
		if (stateDirResult.changes.length > 0) note(stateDirResult.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
		if (stateDirResult.warnings.length > 0) note(stateDirResult.warnings.map((entry) => `- ${entry}`).join("\n"), "Doctor warnings");
	}
	if (options.migrateLegacyConfig !== false) {
		const legacyConfigChanges = await maybeMigrateLegacyConfig();
		if (legacyConfigChanges.length > 0) note(legacyConfigChanges.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	}
	const snapshot = await readConfigFileSnapshot();
	const invalidConfigNote = options.invalidConfigNote ?? "Config invalid; doctor will run with best-effort config.";
	if (invalidConfigNote && snapshot.exists && !snapshot.valid && snapshot.legacyIssues.length === 0) {
		note(invalidConfigNote, "Config");
		noteIncludeConfinementWarning(snapshot);
	}
	const warnings = snapshot.warnings ?? [];
	if (warnings.length > 0) note(formatConfigIssueLines(warnings, "-").join("\n"), "Config warnings");
	return {
		snapshot,
		baseConfig: snapshot.config ?? {}
	};
}
//#endregion
export { stripUnknownConfigKeys as a, resolveConfigPathTarget as i, formatConfigPath as n, noteOpencodeProviderOverrides as r, runDoctorConfigPreflight as t };
