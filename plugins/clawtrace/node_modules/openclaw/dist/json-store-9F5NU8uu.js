import { y as safeParseJson } from "./utils-BfvDpbwh.js";
import { r as writeJsonAtomic } from "./json-files-DMrq2IfK.js";
import fsSync from "node:fs";
//#region src/plugin-sdk/json-store.ts
/** Read JSON from disk and fall back cleanly when the file is missing or invalid. */
async function readJsonFileWithFallback(filePath, fallback) {
	try {
		const parsed = safeParseJson(await fsSync.promises.readFile(filePath, "utf-8"));
		if (parsed == null) return {
			value: fallback,
			exists: true
		};
		return {
			value: parsed,
			exists: true
		};
	} catch (err) {
		if (err.code === "ENOENT") return {
			value: fallback,
			exists: false
		};
		return {
			value: fallback,
			exists: false
		};
	}
}
/** Write JSON with secure file permissions and atomic replacement semantics. */
async function writeJsonFileAtomically(filePath, value) {
	await writeJsonAtomic(filePath, value, {
		mode: 384,
		trailingNewline: true,
		ensureDirMode: 448
	});
}
//#endregion
export { writeJsonFileAtomically as n, readJsonFileWithFallback as t };
