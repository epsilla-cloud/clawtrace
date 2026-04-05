import fsSync from "node:fs";
import path from "node:path";
//#region src/secrets/shared.ts
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function parseEnvValue(raw) {
	const trimmed = raw.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
	return trimmed;
}
function normalizePositiveInt(value, fallback) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.floor(value));
	return Math.max(1, Math.floor(fallback));
}
function parseDotPath(pathname) {
	return pathname.split(".").map((segment) => segment.trim()).filter((segment) => segment.length > 0);
}
function toDotPath(segments) {
	return segments.join(".");
}
function ensureDirForFile(filePath) {
	fsSync.mkdirSync(path.dirname(filePath), {
		recursive: true,
		mode: 448
	});
}
function writeTextFileAtomic(pathname, value, mode = 384) {
	ensureDirForFile(pathname);
	const tempPath = `${pathname}.tmp-${process.pid}-${Date.now()}`;
	fsSync.writeFileSync(tempPath, value, "utf8");
	fsSync.chmodSync(tempPath, mode);
	fsSync.renameSync(tempPath, pathname);
}
function describeUnknownError(err) {
	if (err instanceof Error && err.message.trim().length > 0) return err.message;
	if (typeof err === "string" && err.trim().length > 0) return err;
	if (typeof err === "number" || typeof err === "bigint") return err.toString();
	if (typeof err === "boolean") return err ? "true" : "false";
	try {
		return JSON.stringify(err) ?? "unknown error";
	} catch {
		return "unknown error";
	}
}
//#endregion
export { parseDotPath as a, writeTextFileAtomic as c, normalizePositiveInt as i, isNonEmptyString as n, parseEnvValue as o, isRecord as r, toDotPath as s, describeUnknownError as t };
