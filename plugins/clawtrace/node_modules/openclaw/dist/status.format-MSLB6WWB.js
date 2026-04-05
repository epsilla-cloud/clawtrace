import { r as formatDurationPrecise } from "./format-duration-QPQGNRFx.js";
import { t as formatRuntimeStatusWithDetails } from "./runtime-status-De-_hVZ1.js";
//#region src/commands/status.format.ts
const formatKTokens = (value) => `${(value / 1e3).toFixed(value >= 1e4 ? 0 : 1)}k`;
const formatDuration = (ms) => {
	if (ms == null || !Number.isFinite(ms)) return "unknown";
	return formatDurationPrecise(ms, { decimals: 1 });
};
const formatTokensCompact = (sess) => {
	const used = sess.totalTokens;
	const ctx = sess.contextTokens;
	const cacheRead = sess.cacheRead;
	const cacheWrite = sess.cacheWrite;
	let result = "";
	if (used == null) result = ctx ? `unknown/${formatKTokens(ctx)} (?%)` : "unknown used";
	else if (!ctx) result = `${formatKTokens(used)} used`;
	else {
		const pctLabel = sess.percentUsed != null ? `${sess.percentUsed}%` : "?%";
		result = `${formatKTokens(used)}/${formatKTokens(ctx)} (${pctLabel})`;
	}
	if (typeof cacheRead === "number" && cacheRead > 0) {
		const total = typeof used === "number" ? used : cacheRead + (typeof cacheWrite === "number" ? cacheWrite : 0);
		const hitRate = Math.round(cacheRead / total * 100);
		result += ` · 🗄️ ${hitRate}% cached`;
	}
	return result;
};
const formatDaemonRuntimeShort = (runtime) => {
	if (!runtime) return null;
	const details = [];
	const detail = runtime.detail?.replace(/\s+/g, " ").trim() || "";
	const noisyLaunchctlDetail = runtime.missingUnit === true && detail.toLowerCase().includes("could not find service");
	if (detail && !noisyLaunchctlDetail) details.push(detail);
	return formatRuntimeStatusWithDetails({
		status: runtime.status,
		pid: runtime.pid,
		state: runtime.state,
		details
	});
};
//#endregion
export { formatTokensCompact as i, formatDuration as n, formatKTokens as r, formatDaemonRuntimeShort as t };
