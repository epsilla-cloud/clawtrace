import { spawnSync } from "node:child_process";
import os from "node:os";
//#region src/infra/os-summary.ts
function safeTrim(value) {
	return typeof value === "string" ? value.trim() : "";
}
function macosVersion() {
	return safeTrim(spawnSync("sw_vers", ["-productVersion"], { encoding: "utf-8" }).stdout) || os.release();
}
function resolveOsSummary() {
	const platform = os.platform();
	const release = os.release();
	const arch = os.arch();
	return {
		platform,
		arch,
		release,
		label: (() => {
			if (platform === "darwin") return `macos ${macosVersion()} (${arch})`;
			if (platform === "win32") return `windows ${release} (${arch})`;
			return `${platform} ${release} (${arch})`;
		})()
	};
}
//#endregion
export { resolveOsSummary as t };
