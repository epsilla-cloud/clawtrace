import { t as splitArgsPreservingQuotes } from "./arg-split-CVLyl9eX.js";
import fsSync from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
//#region src/infra/windows-install-roots.ts
const DEFAULT_SYSTEM_ROOT = "C:\\Windows";
const DEFAULT_PROGRAM_FILES = "C:\\Program Files";
const DEFAULT_PROGRAM_FILES_X86 = "C:\\Program Files (x86)";
const WINDOWS_NT_CURRENT_VERSION_KEY = "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion";
const WINDOWS_CURRENT_VERSION_KEY = "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion";
const REG_QUERY_TIMEOUT_MS = 5e3;
let queryRegistryValueFn = defaultQueryRegistryValue;
let isReadableFileFn = defaultIsReadableFile;
let cachedProcessInstallRoots = null;
function defaultIsReadableFile(filePath) {
	try {
		fsSync.accessSync(filePath, fsSync.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
function trimTrailingSeparators(value) {
	const parsed = path.win32.parse(value);
	let trimmed = value;
	while (trimmed.length > parsed.root.length && /[\\/]/.test(trimmed.at(-1) ?? "")) trimmed = trimmed.slice(0, -1);
	return trimmed;
}
/**
* Windows install roots should be local absolute directories, not drive-relative
* paths, UNC shares, or PATH-like lists that could widen trust unexpectedly.
*/
function normalizeWindowsInstallRoot(raw) {
	if (typeof raw !== "string") return null;
	const trimmed = raw.trim();
	if (!trimmed || trimmed.includes("\0") || trimmed.includes("\r") || trimmed.includes("\n") || trimmed.includes(";")) return null;
	const normalized = trimTrailingSeparators(path.win32.normalize(trimmed));
	if (!path.win32.isAbsolute(normalized) || normalized.startsWith("\\\\")) return null;
	const parsed = path.win32.parse(normalized);
	if (!/^[A-Za-z]:\\$/.test(parsed.root)) return null;
	if (normalized.length <= parsed.root.length) return null;
	return normalized;
}
function getEnvValueCaseInsensitive(env, expectedKey) {
	const direct = env[expectedKey];
	if (direct !== void 0) return direct;
	const upper = expectedKey.toUpperCase();
	const actualKey = Object.keys(env).find((key) => key.toUpperCase() === upper);
	return actualKey ? env[actualKey] : void 0;
}
function getWindowsRegExeCandidates(env) {
	const seen = /* @__PURE__ */ new Set();
	const candidates = [];
	for (const root of [
		normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "SystemRoot")),
		normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "WINDIR")),
		DEFAULT_SYSTEM_ROOT
	]) {
		if (!root) continue;
		const key = root.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		candidates.push(path.win32.join(root, "System32", "reg.exe"));
	}
	return candidates;
}
function locateWindowsRegExe(env = process.env) {
	for (const candidate of getWindowsRegExeCandidates(env)) if (isReadableFileFn(candidate)) return candidate;
	return null;
}
function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function parseRegQueryValue(stdout, valueName) {
	const pattern = new RegExp(`^\\s*${escapeRegex(valueName)}\\s+REG_[A-Z0-9_]+\\s+(.+)$`, "im");
	return stdout.match(pattern)?.[1]?.trim() || null;
}
function runRegQuery(regExe, key, valueName, use64BitView) {
	const args = [
		"query",
		key,
		"/v",
		valueName
	];
	if (use64BitView) args.push("/reg:64");
	return execFileSync(regExe, args, {
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		],
		timeout: REG_QUERY_TIMEOUT_MS,
		windowsHide: true
	});
}
function defaultQueryRegistryValue(key, valueName) {
	const regExe = locateWindowsRegExe(process.env);
	if (!regExe) return null;
	for (const use64BitView of [true, false]) try {
		const parsed = parseRegQueryValue(runRegQuery(regExe, key, valueName, use64BitView), valueName);
		if (parsed) return parsed;
	} catch {}
	return null;
}
function getRegistryInstallRoots() {
	return {
		systemRoot: normalizeWindowsInstallRoot(queryRegistryValueFn(WINDOWS_NT_CURRENT_VERSION_KEY, "SystemRoot") ?? void 0) ?? void 0,
		programFiles: normalizeWindowsInstallRoot(queryRegistryValueFn(WINDOWS_CURRENT_VERSION_KEY, "ProgramFilesDir") ?? void 0) ?? void 0,
		programFilesX86: normalizeWindowsInstallRoot(queryRegistryValueFn(WINDOWS_CURRENT_VERSION_KEY, "ProgramFilesDir (x86)") ?? void 0) ?? void 0,
		programW6432: normalizeWindowsInstallRoot(queryRegistryValueFn(WINDOWS_CURRENT_VERSION_KEY, "ProgramW6432Dir") ?? void 0) ?? void 0
	};
}
function buildWindowsInstallRoots(env, useRegistryRoots) {
	const registryRoots = useRegistryRoots ? getRegistryInstallRoots() : {};
	const envProgramW6432 = normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "ProgramW6432"));
	const programW6432 = registryRoots.programW6432 ?? envProgramW6432 ?? null;
	return {
		systemRoot: registryRoots.systemRoot ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "SystemRoot")) ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "WINDIR")) ?? DEFAULT_SYSTEM_ROOT,
		programFiles: registryRoots.programFiles ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "ProgramFiles")) ?? programW6432 ?? DEFAULT_PROGRAM_FILES,
		programFilesX86: registryRoots.programFilesX86 ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "ProgramFiles(x86)")) ?? DEFAULT_PROGRAM_FILES_X86,
		programW6432
	};
}
function getWindowsInstallRoots(env = process.env) {
	if (env === process.env) {
		cachedProcessInstallRoots ??= buildWindowsInstallRoots(env, true);
		return cachedProcessInstallRoots;
	}
	return buildWindowsInstallRoots(env, false);
}
function getWindowsProgramFilesRoots(env = process.env) {
	const roots = getWindowsInstallRoots(env);
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const value of [
		roots.programW6432,
		roots.programFiles,
		roots.programFilesX86
	]) {
		if (!value) continue;
		const key = value.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		result.push(value);
	}
	return result;
}
//#endregion
//#region src/daemon/cmd-set.ts
function assertNoCmdLineBreak(value, field) {
	if (/[\r\n]/.test(value)) throw new Error(`${field} cannot contain CR or LF in Windows task scripts.`);
}
function escapeCmdSetAssignmentComponent(value) {
	return value.replace(/\^/g, "^^").replace(/%/g, "%%").replace(/!/g, "^!").replace(/"/g, "^\"");
}
function unescapeCmdSetAssignmentComponent(value) {
	let out = "";
	for (let i = 0; i < value.length; i += 1) {
		const ch = value[i];
		const next = value[i + 1];
		if (ch === "^" && (next === "^" || next === "\"" || next === "!")) {
			out += next;
			i += 1;
			continue;
		}
		if (ch === "%" && next === "%") {
			out += "%";
			i += 1;
			continue;
		}
		out += ch;
	}
	return out;
}
function parseCmdSetAssignment(line) {
	const raw = line.trim();
	if (!raw) return null;
	const quoted = raw.startsWith("\"") && raw.endsWith("\"") && raw.length >= 2;
	const assignment = quoted ? raw.slice(1, -1) : raw;
	const index = assignment.indexOf("=");
	if (index <= 0) return null;
	const key = assignment.slice(0, index).trim();
	const value = assignment.slice(index + 1).trim();
	if (!key) return null;
	if (!quoted) return {
		key,
		value
	};
	return {
		key: unescapeCmdSetAssignmentComponent(key),
		value: unescapeCmdSetAssignmentComponent(value)
	};
}
function renderCmdSetAssignment(key, value) {
	assertNoCmdLineBreak(key, "Environment variable name");
	assertNoCmdLineBreak(value, "Environment variable value");
	return `set "${escapeCmdSetAssignmentComponent(key)}=${escapeCmdSetAssignmentComponent(value)}"`;
}
//#endregion
//#region src/daemon/cmd-argv.ts
function quoteCmdScriptArg(value) {
	assertNoCmdLineBreak(value, "Command argument");
	if (!value) return "\"\"";
	const escaped = value.replace(/"/g, "\\\"").replace(/%/g, "%%").replace(/!/g, "^!");
	if (!/[ \t"&|<>^()%!]/g.test(value)) return escaped;
	return `"${escaped}"`;
}
function unescapeCmdScriptArg(value) {
	return value.replace(/\^!/g, "!").replace(/%%/g, "%");
}
function parseCmdScriptCommandLine(value) {
	return splitArgsPreservingQuotes(value, { escapeMode: "backslash-quote-only" }).map(unescapeCmdScriptArg);
}
//#endregion
export { renderCmdSetAssignment as a, parseCmdSetAssignment as i, quoteCmdScriptArg as n, getWindowsInstallRoots as o, assertNoCmdLineBreak as r, getWindowsProgramFilesRoots as s, parseCmdScriptCommandLine as t };
