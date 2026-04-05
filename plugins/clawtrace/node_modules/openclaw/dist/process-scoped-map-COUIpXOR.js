import fsSync from "node:fs";
//#region src/shared/pid-alive.ts
function isValidPid(pid) {
	return Number.isInteger(pid) && pid > 0;
}
/**
* Check if a process is a zombie on Linux by reading /proc/<pid>/status.
* Returns false on non-Linux platforms or if the proc file can't be read.
*/
function isZombieProcess(pid) {
	if (process.platform !== "linux") return false;
	try {
		return fsSync.readFileSync(`/proc/${pid}/status`, "utf8").match(/^State:\s+(\S)/m)?.[1] === "Z";
	} catch {
		return false;
	}
}
function isPidAlive(pid) {
	if (!isValidPid(pid)) return false;
	try {
		process.kill(pid, 0);
	} catch {
		return false;
	}
	if (isZombieProcess(pid)) return false;
	return true;
}
/**
* Read the process start time (field 22 "starttime") from /proc/<pid>/stat.
* Returns the value in clock ticks since system boot, or null on non-Linux
* platforms or if the proc file can't be read.
*
* This is used to detect PID recycling: if two readings for the same PID
* return different starttimes, the PID has been reused by a different process.
*/
function getProcessStartTime(pid) {
	if (process.platform !== "linux") return null;
	if (!isValidPid(pid)) return null;
	try {
		const stat = fsSync.readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEndIndex = stat.lastIndexOf(")");
		if (commEndIndex < 0) return null;
		const fields = stat.slice(commEndIndex + 1).trimStart().split(/\s+/);
		const starttime = Number(fields[19]);
		return Number.isInteger(starttime) && starttime >= 0 ? starttime : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/shared/process-scoped-map.ts
function resolveProcessScopedMap(key) {
	const proc = process;
	const existing = proc[key];
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	proc[key] = created;
	return created;
}
//#endregion
export { getProcessStartTime as n, isPidAlive as r, resolveProcessScopedMap as t };
