import { t as safeParseJsonWithSchema } from "./zod-parse-DgsspuWq.js";
import fsSync from "node:fs";
import { z } from "zod";
//#region src/config/sessions/store-read.ts
const SessionStoreSchema = z.record(z.string(), z.unknown());
function readSessionStoreReadOnly(storePath) {
	try {
		const raw = fsSync.readFileSync(storePath, "utf-8");
		if (!raw.trim()) return {};
		return safeParseJsonWithSchema(SessionStoreSchema, raw) ?? {};
	} catch {
		return {};
	}
}
//#endregion
export { readSessionStoreReadOnly as t };
