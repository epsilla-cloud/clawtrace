import fsSync from "node:fs";
import fs from "node:fs/promises";
//#region src/infra/ports-lsof.ts
const LSOF_CANDIDATES = process.platform === "darwin" ? ["/usr/sbin/lsof", "/usr/bin/lsof"] : ["/usr/bin/lsof", "/usr/sbin/lsof"];
async function canExecute(path) {
	try {
		await fs.access(path, fsSync.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
async function resolveLsofCommand() {
	for (const candidate of LSOF_CANDIDATES) if (await canExecute(candidate)) return candidate;
	return "lsof";
}
function resolveLsofCommandSync() {
	for (const candidate of LSOF_CANDIDATES) try {
		fsSync.accessSync(candidate, fsSync.constants.X_OK);
		return candidate;
	} catch {}
	return "lsof";
}
//#endregion
export { resolveLsofCommandSync as n, resolveLsofCommand as t };
