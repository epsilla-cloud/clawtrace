import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-Day5KPIY.js";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import crypto from "node:crypto";
//#region src/plugin-sdk/temp-path.ts
function sanitizePrefix(prefix) {
	return prefix.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "tmp";
}
function sanitizeExtension(extension) {
	if (!extension) return "";
	const token = ((extension.startsWith(".") ? extension : `.${extension}`).match(/[a-zA-Z0-9._-]+$/)?.[0] ?? "").replace(/^[._-]+/, "");
	if (!token) return "";
	return `.${token}`;
}
function sanitizeFileName(fileName) {
	return path.basename(fileName).replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "download.bin";
}
function resolveTempRoot(tmpDir) {
	return tmpDir ?? resolvePreferredOpenClawTmpDir();
}
function isNodeErrorWithCode(err, code) {
	return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
/** Build a unique temp file path with sanitized prefix/extension parts. */
function buildRandomTempFilePath(params) {
	const prefix = sanitizePrefix(params.prefix);
	const extension = sanitizeExtension(params.extension);
	const nowCandidate = params.now;
	const now = typeof nowCandidate === "number" && Number.isFinite(nowCandidate) ? Math.trunc(nowCandidate) : Date.now();
	const uuid = params.uuid?.trim() || crypto.randomUUID();
	return path.join(resolveTempRoot(params.tmpDir), `${prefix}-${now}-${uuid}${extension}`);
}
/** Create a temporary download directory, run the callback, then clean it up best-effort. */
async function withTempDownloadPath(params, fn) {
	const tempRoot = resolveTempRoot(params.tmpDir);
	const prefix = `${sanitizePrefix(params.prefix)}-`;
	const dir = await mkdtemp(path.join(tempRoot, prefix));
	const tmpPath = path.join(dir, sanitizeFileName(params.fileName ?? "download.bin"));
	try {
		return await fn(tmpPath);
	} finally {
		try {
			await rm(dir, {
				recursive: true,
				force: true
			});
		} catch (err) {
			if (!isNodeErrorWithCode(err, "ENOENT")) console.warn(`temp-path cleanup failed for ${dir}: ${String(err)}`);
		}
	}
}
//#endregion
export { withTempDownloadPath as n, buildRandomTempFilePath as t };
