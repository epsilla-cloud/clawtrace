import { r as resolveSessionFilePath } from "./paths-CFxPq48L.js";
import fsSync from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { CURRENT_SESSION_VERSION, SessionManager } from "@mariozechner/pi-coding-agent";
//#region src/auto-reply/reply/session-fork.runtime.ts
function forkSessionFromParentRuntime(params) {
	const parentSessionFile = resolveSessionFilePath(params.parentEntry.sessionId, params.parentEntry, {
		agentId: params.agentId,
		sessionsDir: params.sessionsDir
	});
	if (!parentSessionFile || !fsSync.existsSync(parentSessionFile)) return null;
	try {
		const manager = SessionManager.open(parentSessionFile);
		const leafId = manager.getLeafId();
		if (leafId) {
			const sessionFile = manager.createBranchedSession(leafId) ?? manager.getSessionFile();
			const sessionId = manager.getSessionId();
			if (sessionFile && sessionId) return {
				sessionId,
				sessionFile
			};
		}
		const sessionId = crypto.randomUUID();
		const timestamp = (/* @__PURE__ */ new Date()).toISOString();
		const fileTimestamp = timestamp.replace(/[:.]/g, "-");
		const sessionFile = path.join(manager.getSessionDir(), `${fileTimestamp}_${sessionId}.jsonl`);
		const header = {
			type: "session",
			version: CURRENT_SESSION_VERSION,
			id: sessionId,
			timestamp,
			cwd: manager.getCwd(),
			parentSession: parentSessionFile
		};
		fsSync.writeFileSync(sessionFile, `${JSON.stringify(header)}\n`, {
			encoding: "utf-8",
			mode: 384,
			flag: "wx"
		});
		return {
			sessionId,
			sessionFile
		};
	} catch {
		return null;
	}
}
//#endregion
export { forkSessionFromParentRuntime };
