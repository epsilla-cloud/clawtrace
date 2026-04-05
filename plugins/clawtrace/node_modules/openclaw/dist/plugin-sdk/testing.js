import { n as shouldAckReaction, t as removeAckReactionAfterReply } from "../ack-reactions-EQgNefBf.js";
import { r as it, t as globalExpect } from "../test.p_J6dB8a-By80XNEz.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/plugin-sdk/testing.ts
/** Create a tiny Windows `.cmd` shim fixture for plugin tests that spawn CLIs. */
async function createWindowsCmdShimFixture(params) {
	await fs.mkdir(path.dirname(params.scriptPath), { recursive: true });
	await fs.mkdir(path.dirname(params.shimPath), { recursive: true });
	await fs.writeFile(params.scriptPath, "module.exports = {};\n", "utf8");
	await fs.writeFile(params.shimPath, `@echo off\r\n${params.shimLine}\r\n`, "utf8");
}
/** Install a shared test matrix for target-resolution error handling. */
function installCommonResolveTargetErrorCases(params) {
	const { resolveTarget, implicitAllowFrom } = params;
	it("should error on normalization failure with allowlist (implicit mode)", () => {
		const result = resolveTarget({
			to: "invalid-target",
			mode: "implicit",
			allowFrom: implicitAllowFrom
		});
		globalExpect(result.ok).toBe(false);
		globalExpect(result.error).toBeDefined();
	});
	it("should error when no target provided with allowlist", () => {
		const result = resolveTarget({
			to: void 0,
			mode: "implicit",
			allowFrom: implicitAllowFrom
		});
		globalExpect(result.ok).toBe(false);
		globalExpect(result.error).toBeDefined();
	});
	it("should error when no target and no allowlist", () => {
		const result = resolveTarget({
			to: void 0,
			mode: "explicit",
			allowFrom: []
		});
		globalExpect(result.ok).toBe(false);
		globalExpect(result.error).toBeDefined();
	});
	it("should handle whitespace-only target", () => {
		const result = resolveTarget({
			to: "   ",
			mode: "explicit",
			allowFrom: []
		});
		globalExpect(result.ok).toBe(false);
		globalExpect(result.error).toBeDefined();
	});
}
//#endregion
export { createWindowsCmdShimFixture, installCommonResolveTargetErrorCases, removeAckReactionAfterReply, shouldAckReaction };
