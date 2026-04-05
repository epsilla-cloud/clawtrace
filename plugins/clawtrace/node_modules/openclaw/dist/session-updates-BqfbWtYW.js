import { WA as getRemoteSkillEligibility, cj as ensureSkillsWatcher, lj as getSkillsSnapshotVersion, pj as buildWorkspaceSkillSnapshot, vN as updateSessionStore } from "./auth-profiles-B5ypC5S-.js";
import { u as resolveAgentIdFromSessionKey } from "./session-key-BhxcMJEE.js";
import { i as resolveSessionFilePathOptions, r as resolveSessionFilePath } from "./paths-CFxPq48L.js";
import fsSync from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-updates.ts
async function persistSessionEntryUpdate(params) {
	if (!params.sessionStore || !params.sessionKey) return;
	params.sessionStore[params.sessionKey] = {
		...params.sessionStore[params.sessionKey],
		...params.nextEntry
	};
	if (!params.storePath) return;
	await updateSessionStore(params.storePath, (store) => {
		store[params.sessionKey] = {
			...store[params.sessionKey],
			...params.nextEntry
		};
	});
}
async function ensureSkillSnapshot(params) {
	if (process.env.OPENCLAW_TEST_FAST === "1") return {
		sessionEntry: params.sessionEntry,
		skillsSnapshot: params.sessionEntry?.skillsSnapshot,
		systemSent: params.sessionEntry?.systemSent ?? false
	};
	const { sessionEntry, sessionStore, sessionKey, storePath, sessionId, isFirstTurnInSession, workspaceDir, cfg, skillFilter } = params;
	let nextEntry = sessionEntry;
	let systemSent = sessionEntry?.systemSent ?? false;
	const remoteEligibility = getRemoteSkillEligibility();
	const snapshotVersion = getSkillsSnapshotVersion(workspaceDir);
	ensureSkillsWatcher({
		workspaceDir,
		config: cfg
	});
	const shouldRefreshSnapshot = snapshotVersion > 0 && (nextEntry?.skillsSnapshot?.version ?? 0) < snapshotVersion;
	if (isFirstTurnInSession && sessionStore && sessionKey) {
		const current = nextEntry ?? sessionStore[sessionKey] ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		const skillSnapshot = isFirstTurnInSession || !current.skillsSnapshot || shouldRefreshSnapshot ? buildWorkspaceSkillSnapshot(workspaceDir, {
			config: cfg,
			skillFilter,
			eligibility: { remote: remoteEligibility },
			snapshotVersion
		}) : current.skillsSnapshot;
		nextEntry = {
			...current,
			sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now(),
			systemSent: true,
			skillsSnapshot: skillSnapshot
		};
		await persistSessionEntryUpdate({
			sessionStore,
			sessionKey,
			storePath,
			nextEntry
		});
		systemSent = true;
	}
	const skillsSnapshot = shouldRefreshSnapshot ? buildWorkspaceSkillSnapshot(workspaceDir, {
		config: cfg,
		skillFilter,
		eligibility: { remote: remoteEligibility },
		snapshotVersion
	}) : nextEntry?.skillsSnapshot ?? (isFirstTurnInSession ? void 0 : buildWorkspaceSkillSnapshot(workspaceDir, {
		config: cfg,
		skillFilter,
		eligibility: { remote: remoteEligibility },
		snapshotVersion
	}));
	if (skillsSnapshot && sessionStore && sessionKey && !isFirstTurnInSession && (!nextEntry?.skillsSnapshot || shouldRefreshSnapshot)) {
		const current = nextEntry ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		nextEntry = {
			...current,
			sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now(),
			skillsSnapshot
		};
		await persistSessionEntryUpdate({
			sessionStore,
			sessionKey,
			storePath,
			nextEntry
		});
	}
	return {
		sessionEntry: nextEntry,
		skillsSnapshot,
		systemSent
	};
}
async function incrementCompactionCount(params) {
	const { sessionEntry, sessionStore, sessionKey, storePath, now = Date.now(), amount = 1, tokensAfter, newSessionId } = params;
	if (!sessionStore || !sessionKey) return;
	const entry = sessionStore[sessionKey] ?? sessionEntry;
	if (!entry) return;
	const incrementBy = Math.max(0, amount);
	const nextCount = (entry.compactionCount ?? 0) + incrementBy;
	const updates = {
		compactionCount: nextCount,
		updatedAt: now
	};
	if (newSessionId && newSessionId !== entry.sessionId) {
		updates.sessionId = newSessionId;
		updates.sessionFile = resolveCompactionSessionFile({
			entry,
			sessionKey,
			storePath,
			newSessionId
		});
	}
	if (tokensAfter != null && tokensAfter > 0) {
		updates.totalTokens = tokensAfter;
		updates.totalTokensFresh = true;
		updates.inputTokens = void 0;
		updates.outputTokens = void 0;
		updates.cacheRead = void 0;
		updates.cacheWrite = void 0;
	}
	sessionStore[sessionKey] = {
		...entry,
		...updates
	};
	if (storePath) await updateSessionStore(storePath, (store) => {
		store[sessionKey] = {
			...store[sessionKey],
			...updates
		};
	});
	return nextCount;
}
function resolveCompactionSessionFile(params) {
	const pathOpts = resolveSessionFilePathOptions({
		agentId: resolveAgentIdFromSessionKey(params.sessionKey),
		storePath: params.storePath
	});
	const rewrittenSessionFile = rewriteSessionFileForNewSessionId({
		sessionFile: params.entry.sessionFile,
		previousSessionId: params.entry.sessionId,
		nextSessionId: params.newSessionId
	});
	const normalizedRewrittenSessionFile = rewrittenSessionFile && path.isAbsolute(rewrittenSessionFile) ? canonicalizeAbsoluteSessionFilePath(rewrittenSessionFile) : rewrittenSessionFile;
	return resolveSessionFilePath(params.newSessionId, normalizedRewrittenSessionFile ? { sessionFile: normalizedRewrittenSessionFile } : void 0, pathOpts);
}
function canonicalizeAbsoluteSessionFilePath(filePath) {
	const resolved = path.resolve(filePath);
	try {
		const parentDir = fsSync.realpathSync(path.dirname(resolved));
		return path.join(parentDir, path.basename(resolved));
	} catch {
		return resolved;
	}
}
function rewriteSessionFileForNewSessionId(params) {
	const trimmed = params.sessionFile?.trim();
	if (!trimmed) return;
	const base = path.basename(trimmed);
	if (!base.endsWith(".jsonl")) return;
	const withoutExt = base.slice(0, -6);
	if (withoutExt === params.previousSessionId) return path.join(path.dirname(trimmed), `${params.nextSessionId}.jsonl`);
	if (withoutExt.startsWith(`${params.previousSessionId}-topic-`)) return path.join(path.dirname(trimmed), `${params.nextSessionId}${base.slice(params.previousSessionId.length)}`);
	const forkMatch = withoutExt.match(/^(\d{4}-\d{2}-\d{2}T[\w-]+(?:Z|[+-]\d{2}(?:-\d{2})?)?)_(.+)$/);
	if (forkMatch?.[2] === params.previousSessionId) return path.join(path.dirname(trimmed), `${forkMatch[1]}_${params.nextSessionId}.jsonl`);
}
//#endregion
export { incrementCompactionCount as n, ensureSkillSnapshot as t };
