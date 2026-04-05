import { BD as resolveConfiguredAcpBindingRecord, CD as updateMatrixAccountConfig, CE as isStrictDirectMembership, CP as getSessionBindingService, DE as setActiveMatrixClient, IE as formatPollAsText, JE as resolveMatrixAccount, KE as resolveConfiguredMatrixBotUserIds, Mj as toLocationContext, RE as isPollEventType, SE as hasDirectMatrixMemberFlag, TE as readJoinedMatrixMembers, VE as parsePollStartContent, WE as resolveMatrixTargets, YE as resolveMatrixAccountConfig, _E as sendReadReceiptMatrix, aD as resolveMatrixStateFilePath, bE as inspectMatrixDirectRooms, cD as resolveMatrixAuthContext, dD as LogService, fD as createAsyncLock, hE as sendMessageMatrix, jE as extractMatrixReactionAnnotation, jj as formatLocationText, kE as MATRIX_REACTION_EVENT_TYPE, mE as reactMatrixMessage, nD as releaseSharedClientInstance, oD as resolveMatrixStoragePaths, pE as createMatrixThreadBindingManager, rD as resolveSharedMatrixClient, sD as resolveMatrixAuth, vD as isBunRuntime, vE as sendTypingMatrix, wE as isStrictDirectRoom, zD as ensureConfiguredAcpBindingReady, zE as isPollStartType } from "./auth-profiles-B5ypC5S-.js";
import { u as resolveAgentIdFromSessionKey } from "./session-key-BhxcMJEE.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy, t as GROUP_POLICY_BLOCKED_LABEL } from "./runtime-group-policy-Bde7-o8k.js";
import { u as resolveControlCommandGate } from "./dm-policy-shared-C8YuyjhK.js";
import { n as formatAllowlistMatchMeta } from "./allowlist-match-CSOSv_ih.js";
import { n as writeJsonFileAtomically, t as readJsonFileWithFallback } from "./json-store-9F5NU8uu.js";
import { t as resolveAckReaction } from "./identity-DAzQ7qLa.js";
import { c as logInboundDrop, l as logTypingFailure } from "./channel-feedback-rIf58luM.js";
import { c as buildAllowlistResolutionSummary, d as patchAllowlistUsersInConfigEntries, f as summarizeMapping, l as canonicalizeAllowlistWithResolvedIds, s as addAllowlistUserEntriesFromConfigEntry } from "./allow-from-C4_uNVuH.js";
import { c as getAgentScopedMediaLocalRoots } from "./web-media-BN6zO1RF.js";
import { n as createTypingCallbacks, o as createReplyPrefixOptions } from "./channel-reply-pipeline-DFacxqeY.js";
import { c as resolveThreadBindingIdleTimeoutMsForChannel, d as resolveThreadBindingMaxAgeMsForChannel } from "./thread-bindings-runtime-CKTjKiOz.js";
import { n as getMatrixRuntime } from "./runtime-api-BefOImIc.js";
import { i as resolveMatrixRoomConfig, n as normalizeMatrixUserId, r as resolveMatrixAllowListMatch, t as normalizeMatrixAllowList } from "./allowlist-CpNb5vl4.js";
import { n as summarizeMatrixDeviceHealth } from "./device-health-DtpOWJhJ.js";
import { t as syncMatrixOwnProfile } from "./profile-Bs9NUoaC.js";
import { t as formatMatrixEncryptedEventDisabledWarning } from "./encryption-guidance-CskwrNMl.js";
import { a as formatMatrixMessageText, i as formatMatrixMediaUnavailableText, n as fetchMatrixPollSnapshot, o as resolveMatrixMessageAttachment, s as resolveMatrixMessageBody } from "./poll-summary-DsAL-stm.js";
import path from "node:path";
import os from "node:os";
import { format } from "node:util";
import fs from "node:fs/promises";
//#region extensions/matrix/src/matrix/monitor/auto-join.ts
function registerMatrixAutoJoin(params) {
	const { client, accountConfig, runtime } = params;
	const core = getMatrixRuntime();
	const logVerbose = (message) => {
		if (!core.logging.shouldLogVerbose()) return;
		runtime.log?.(message);
	};
	const autoJoin = accountConfig.autoJoin ?? "off";
	const rawAllowlist = (accountConfig.autoJoinAllowlist ?? []).map((entry) => String(entry).trim()).filter(Boolean);
	const autoJoinAllowlist = new Set(rawAllowlist);
	const allowedRoomIds = new Set(rawAllowlist.filter((entry) => entry.startsWith("!")));
	const allowedAliases = rawAllowlist.filter((entry) => entry.startsWith("#"));
	const resolvedAliasRoomIds = /* @__PURE__ */ new Map();
	if (autoJoin === "off") return;
	if (autoJoin === "always") logVerbose("matrix: auto-join enabled for all invites");
	else logVerbose("matrix: auto-join enabled for allowlist invites");
	const resolveAllowedAliasRoomId = async (alias) => {
		if (resolvedAliasRoomIds.has(alias)) return resolvedAliasRoomIds.get(alias) ?? null;
		const resolved = await params.client.resolveRoom(alias);
		if (resolved) resolvedAliasRoomIds.set(alias, resolved);
		return resolved;
	};
	const resolveAllowedAliasRoomIds = async () => {
		return (await Promise.all(allowedAliases.map(async (alias) => {
			try {
				return await resolveAllowedAliasRoomId(alias);
			} catch (err) {
				runtime.error?.(`matrix: failed resolving allowlisted alias ${alias}: ${String(err)}`);
				return null;
			}
		}))).filter((roomId) => Boolean(roomId));
	};
	client.on("room.invite", async (roomId, _inviteEvent) => {
		if (autoJoin === "allowlist") {
			const allowedAliasRoomIds = await resolveAllowedAliasRoomIds();
			if (!(autoJoinAllowlist.has("*") || allowedRoomIds.has(roomId) || allowedAliasRoomIds.some((resolvedRoomId) => resolvedRoomId === roomId))) {
				logVerbose(`matrix: invite ignored (not in allowlist) room=${roomId}`);
				return;
			}
		}
		try {
			await client.joinRoom(roomId);
			logVerbose(`matrix: joined room ${roomId}`);
		} catch (err) {
			runtime.error?.(`matrix: failed to join room ${roomId}: ${String(err)}`);
		}
	});
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/config.ts
function normalizeMatrixUserLookupEntry(raw) {
	return raw.replace(/^matrix:/i, "").replace(/^user:/i, "").trim();
}
function normalizeMatrixRoomLookupEntry(raw) {
	return raw.replace(/^matrix:/i, "").replace(/^(room|channel):/i, "").trim();
}
function isMatrixQualifiedUserId(value) {
	return value.startsWith("@") && value.includes(":");
}
function filterResolvedMatrixAllowlistEntries(entries) {
	return entries.filter((entry) => {
		const trimmed = entry.trim();
		if (!trimmed) return false;
		if (trimmed === "*") return true;
		return isMatrixQualifiedUserId(normalizeMatrixUserLookupEntry(trimmed));
	});
}
function sanitizeMatrixRoomUserAllowlists(entries) {
	const nextEntries = { ...entries };
	for (const [roomKey, roomConfig] of Object.entries(entries)) {
		const users = roomConfig?.users;
		if (!Array.isArray(users)) continue;
		nextEntries[roomKey] = {
			...roomConfig,
			users: filterResolvedMatrixAllowlistEntries(users.map(String))
		};
	}
	return nextEntries;
}
async function resolveMatrixMonitorUserEntries(params) {
	const directMatches = [];
	const pending = [];
	for (const entry of params.entries) {
		const input = String(entry).trim();
		if (!input) continue;
		const query = normalizeMatrixUserLookupEntry(input);
		if (!query || query === "*") continue;
		if (isMatrixQualifiedUserId(query)) {
			directMatches.push({
				input,
				resolved: true,
				id: normalizeMatrixUserId(query)
			});
			continue;
		}
		pending.push({
			input,
			query
		});
	}
	(pending.length === 0 ? [] : await params.resolveTargets({
		cfg: params.cfg,
		accountId: params.accountId,
		inputs: pending.map((entry) => entry.query),
		kind: "user",
		runtime: params.runtime
	})).forEach((entry, index) => {
		const source = pending[index];
		if (!source) return;
		directMatches.push({
			input: source.input,
			resolved: entry.resolved,
			id: entry.id ? normalizeMatrixUserId(entry.id) : void 0
		});
	});
	return buildAllowlistResolutionSummary(directMatches);
}
async function resolveMatrixMonitorUserAllowlist(params) {
	const allowList = (params.list ?? []).map(String);
	if (allowList.length === 0) return allowList;
	const resolution = await resolveMatrixMonitorUserEntries({
		cfg: params.cfg,
		accountId: params.accountId,
		entries: allowList,
		runtime: params.runtime,
		resolveTargets: params.resolveTargets
	});
	const canonicalized = canonicalizeAllowlistWithResolvedIds({
		existing: allowList,
		resolvedMap: resolution.resolvedMap
	});
	summarizeMapping(params.label, resolution.mapping, resolution.unresolved, params.runtime);
	if (resolution.unresolved.length > 0) params.runtime.log?.(`${params.label} entries must be full Matrix IDs (example: @user:server). Unresolved entries are ignored.`);
	return filterResolvedMatrixAllowlistEntries(canonicalized);
}
async function resolveMatrixMonitorRoomsConfig(params) {
	const roomsConfig = params.roomsConfig;
	if (!roomsConfig || Object.keys(roomsConfig).length === 0) return roomsConfig;
	const mapping = [];
	const unresolved = [];
	const nextRooms = {};
	if (roomsConfig["*"]) nextRooms["*"] = roomsConfig["*"];
	const pending = [];
	for (const [entry, roomConfig] of Object.entries(roomsConfig)) {
		if (entry === "*") continue;
		const input = entry.trim();
		if (!input) continue;
		const cleaned = normalizeMatrixRoomLookupEntry(input);
		if (!cleaned) {
			unresolved.push(entry);
			continue;
		}
		if (cleaned.startsWith("!") && cleaned.includes(":")) {
			if (!nextRooms[cleaned]) nextRooms[cleaned] = roomConfig;
			if (cleaned !== input) mapping.push(`${input}→${cleaned}`);
			continue;
		}
		pending.push({
			input,
			query: cleaned,
			config: roomConfig
		});
	}
	if (pending.length > 0) (await params.resolveTargets({
		cfg: params.cfg,
		accountId: params.accountId,
		inputs: pending.map((entry) => entry.query),
		kind: "group",
		runtime: params.runtime
	})).forEach((entry, index) => {
		const source = pending[index];
		if (!source) return;
		if (entry.resolved && entry.id) {
			const roomKey = normalizeMatrixRoomLookupEntry(entry.id);
			if (!nextRooms[roomKey]) nextRooms[roomKey] = source.config;
			mapping.push(`${source.input}→${roomKey}`);
		} else unresolved.push(source.input);
	});
	summarizeMapping("matrix rooms", mapping, unresolved, params.runtime);
	if (unresolved.length > 0) params.runtime.log?.("matrix rooms must be room IDs or aliases (example: !room:server or #alias:server). Unresolved entries are ignored.");
	const roomUsers = /* @__PURE__ */ new Set();
	for (const roomConfig of Object.values(nextRooms)) addAllowlistUserEntriesFromConfigEntry(roomUsers, roomConfig);
	if (roomUsers.size === 0) return nextRooms;
	const resolution = await resolveMatrixMonitorUserEntries({
		cfg: params.cfg,
		accountId: params.accountId,
		entries: Array.from(roomUsers),
		runtime: params.runtime,
		resolveTargets: params.resolveTargets
	});
	summarizeMapping("matrix room users", resolution.mapping, resolution.unresolved, params.runtime);
	if (resolution.unresolved.length > 0) params.runtime.log?.("matrix room users entries must be full Matrix IDs (example: @user:server). Unresolved entries are ignored.");
	return sanitizeMatrixRoomUserAllowlists(patchAllowlistUsersInConfigEntries({
		entries: nextRooms,
		resolvedMap: resolution.resolvedMap,
		strategy: "canonicalize"
	}));
}
async function resolveMatrixMonitorConfig(params) {
	const resolveTargets = params.resolveTargets ?? resolveMatrixTargets;
	const [allowFrom, groupAllowFrom, roomsConfig] = await Promise.all([
		resolveMatrixMonitorUserAllowlist({
			cfg: params.cfg,
			accountId: params.accountId,
			label: "matrix dm allowlist",
			list: params.allowFrom,
			runtime: params.runtime,
			resolveTargets
		}),
		resolveMatrixMonitorUserAllowlist({
			cfg: params.cfg,
			accountId: params.accountId,
			label: "matrix group allowlist",
			list: params.groupAllowFrom,
			runtime: params.runtime,
			resolveTargets
		}),
		resolveMatrixMonitorRoomsConfig({
			cfg: params.cfg,
			accountId: params.accountId,
			roomsConfig: params.roomsConfig,
			runtime: params.runtime,
			resolveTargets
		})
	]);
	return {
		allowFrom,
		groupAllowFrom,
		roomsConfig
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/direct.ts
const DM_CACHE_TTL_MS = 3e4;
const MAX_TRACKED_DM_ROOMS = 1024;
function rememberBounded$1(map, key, value) {
	map.set(key, value);
	if (map.size > MAX_TRACKED_DM_ROOMS) {
		const oldest = map.keys().next().value;
		if (typeof oldest === "string") map.delete(oldest);
	}
}
function createDirectRoomTracker(client, opts = {}) {
	const log = opts.log ?? (() => {});
	let lastDmUpdateMs = 0;
	let hasSeededDmCache = false;
	let cachedSelfUserId = null;
	const joinedMembersCache = /* @__PURE__ */ new Map();
	const directMemberFlagCache = /* @__PURE__ */ new Map();
	const ensureSelfUserId = async () => {
		if (cachedSelfUserId) return cachedSelfUserId;
		try {
			cachedSelfUserId = await client.getUserId();
		} catch {
			cachedSelfUserId = null;
		}
		return cachedSelfUserId;
	};
	const refreshDmCache = async () => {
		const now = Date.now();
		if (now - lastDmUpdateMs < DM_CACHE_TTL_MS) return;
		lastDmUpdateMs = now;
		hasSeededDmCache = await client.dms.update() || hasSeededDmCache;
	};
	const resolveJoinedMembers = async (roomId) => {
		const cached = joinedMembersCache.get(roomId);
		const now = Date.now();
		if (cached && now - cached.ts < DM_CACHE_TTL_MS) return cached.members;
		try {
			const normalized = await readJoinedMatrixMembers(client, roomId);
			if (!normalized) throw new Error("membership unavailable");
			rememberBounded$1(joinedMembersCache, roomId, {
				members: normalized,
				ts: now
			});
			return normalized;
		} catch (err) {
			log(`matrix: dm member lookup failed room=${roomId} (${String(err)})`);
			return null;
		}
	};
	const resolveDirectMemberFlag = async (roomId, userId) => {
		const normalizedUserId = userId?.trim();
		if (!normalizedUserId) return false;
		const cacheKey = `${roomId}\n${normalizedUserId}`;
		const cached = directMemberFlagCache.get(cacheKey);
		const now = Date.now();
		if (cached && now - cached.ts < DM_CACHE_TTL_MS) return cached.isDirect;
		const isDirect = await hasDirectMatrixMemberFlag(client, roomId, normalizedUserId);
		rememberBounded$1(directMemberFlagCache, cacheKey, {
			isDirect,
			ts: now
		});
		return isDirect;
	};
	return {
		invalidateRoom: (roomId) => {
			joinedMembersCache.delete(roomId);
			for (const key of directMemberFlagCache.keys()) if (key.startsWith(`${roomId}\n`)) directMemberFlagCache.delete(key);
			lastDmUpdateMs = 0;
			log(`matrix: invalidated dm cache room=${roomId}`);
		},
		isDirectMessage: async (params) => {
			const { roomId, senderId } = params;
			const selfUserId = params.selfUserId ?? await ensureSelfUserId();
			const joinedMembers = await resolveJoinedMembers(roomId);
			const strictDirectMembership = isStrictDirectMembership({
				selfUserId,
				remoteUserId: senderId,
				joinedMembers
			});
			try {
				await refreshDmCache();
			} catch (err) {
				log(`matrix: dm cache refresh failed (${String(err)})`);
			}
			if (client.dms.isDm(roomId)) {
				if (strictDirectMembership) {
					log(`matrix: dm detected via m.direct room=${roomId}`);
					return true;
				}
				log(`matrix: ignoring stale m.direct classification room=${roomId}`);
			}
			if (strictDirectMembership) {
				if (await resolveDirectMemberFlag(roomId, senderId) || await resolveDirectMemberFlag(roomId, selfUserId)) {
					log(`matrix: dm detected via member state room=${roomId}`);
					return true;
				}
				if (!hasSeededDmCache) {
					log(`matrix: dm detected via exact 2-member fallback before dm cache seed room=${roomId}`);
					return true;
				}
			}
			log(`matrix: dm check room=${roomId} result=group members=${joinedMembers?.length ?? "unknown"}`);
			return false;
		}
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/types.ts
const EventType = {
	RoomMessage: "m.room.message",
	RoomMessageEncrypted: "m.room.encrypted",
	RoomMember: "m.room.member",
	Location: "m.location",
	Reaction: MATRIX_REACTION_EVENT_TYPE
};
const RelationType = {
	Replace: "m.replace",
	Thread: "m.thread"
};
//#endregion
//#region extensions/matrix/src/matrix/monitor/access-state.ts
function resolveMatrixMonitorAccessState(params) {
	const effectiveAllowFrom = normalizeMatrixAllowList([...params.allowFrom, ...params.storeAllowFrom]);
	const effectiveGroupAllowFrom = normalizeMatrixAllowList(params.groupAllowFrom);
	const effectiveRoomUsers = normalizeMatrixAllowList(params.roomUsers);
	const directAllowMatch = resolveMatrixAllowListMatch({
		allowList: effectiveAllowFrom,
		userId: params.senderId
	});
	const roomUserMatch = params.isRoom && effectiveRoomUsers.length > 0 ? resolveMatrixAllowListMatch({
		allowList: effectiveRoomUsers,
		userId: params.senderId
	}) : null;
	const groupAllowMatch = effectiveGroupAllowFrom.length > 0 ? resolveMatrixAllowListMatch({
		allowList: effectiveGroupAllowFrom,
		userId: params.senderId
	}) : null;
	return {
		effectiveAllowFrom,
		effectiveGroupAllowFrom,
		effectiveRoomUsers,
		groupAllowConfigured: effectiveGroupAllowFrom.length > 0,
		directAllowMatch,
		roomUserMatch,
		groupAllowMatch,
		commandAuthorizers: [
			{
				configured: effectiveAllowFrom.length > 0,
				allowed: directAllowMatch.allowed
			},
			{
				configured: effectiveRoomUsers.length > 0,
				allowed: roomUserMatch?.allowed ?? false
			},
			{
				configured: effectiveGroupAllowFrom.length > 0,
				allowed: groupAllowMatch?.allowed ?? false
			}
		]
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/verification-utils.ts
const VERIFICATION_EVENT_PREFIX = "m.key.verification.";
const VERIFICATION_REQUEST_MSGTYPE = "m.key.verification.request";
const VERIFICATION_NOTICE_PREFIXES = [
	"Matrix verification request received from ",
	"Matrix verification is ready with ",
	"Matrix verification started with ",
	"Matrix verification completed with ",
	"Matrix verification cancelled by ",
	"Matrix verification SAS with "
];
function trimMaybeString$1(input) {
	return typeof input === "string" ? input.trim() : "";
}
function isMatrixVerificationEventType(type) {
	return trimMaybeString$1(type).startsWith(VERIFICATION_EVENT_PREFIX);
}
function isMatrixVerificationRequestMsgType(msgtype) {
	return trimMaybeString$1(msgtype) === VERIFICATION_REQUEST_MSGTYPE;
}
function isMatrixVerificationNoticeBody(body) {
	const text = trimMaybeString$1(body);
	return VERIFICATION_NOTICE_PREFIXES.some((prefix) => text.startsWith(prefix));
}
function isMatrixVerificationRoomMessage(content) {
	return isMatrixVerificationRequestMsgType(content.msgtype) || trimMaybeString$1(content.msgtype) === "m.notice" && isMatrixVerificationNoticeBody(content.body);
}
const matrixVerificationConstants = {
	eventPrefix: VERIFICATION_EVENT_PREFIX,
	requestMsgtype: VERIFICATION_REQUEST_MSGTYPE
};
//#endregion
//#region extensions/matrix/src/matrix/monitor/verification-events.ts
const MAX_TRACKED_VERIFICATION_EVENTS = 1024;
const SAS_NOTICE_RETRY_DELAY_MS = 750;
const VERIFICATION_EVENT_STARTUP_GRACE_MS = 3e4;
function trimMaybeString(input) {
	if (typeof input !== "string") return null;
	const trimmed = input.trim();
	return trimmed.length > 0 ? trimmed : null;
}
function readVerificationSignal(event) {
	const type = trimMaybeString(event?.type) ?? "";
	const content = event?.content ?? {};
	const msgtype = trimMaybeString(content.msgtype) ?? "";
	const relatedEventId = trimMaybeString(content["m.relates_to"]?.event_id);
	const transactionId = trimMaybeString(content.transaction_id);
	if (type === EventType.RoomMessage && isMatrixVerificationRequestMsgType(msgtype)) return {
		stage: "request",
		flowId: trimMaybeString(event.event_id) ?? transactionId ?? relatedEventId
	};
	if (!isMatrixVerificationEventType(type)) return null;
	const flowId = transactionId ?? relatedEventId ?? trimMaybeString(event.event_id);
	if (type === `${matrixVerificationConstants.eventPrefix}request`) return {
		stage: "request",
		flowId
	};
	if (type === `${matrixVerificationConstants.eventPrefix}ready`) return {
		stage: "ready",
		flowId
	};
	if (type === "m.key.verification.start") return {
		stage: "start",
		flowId
	};
	if (type === "m.key.verification.cancel") return {
		stage: "cancel",
		flowId
	};
	if (type === "m.key.verification.done") return {
		stage: "done",
		flowId
	};
	return {
		stage: "other",
		flowId
	};
}
function formatVerificationStageNotice(params) {
	const { stage, senderId, event } = params;
	const content = event.content;
	switch (stage) {
		case "request": return `Matrix verification request received from ${senderId}. Open "Verify by emoji" in your Matrix client to continue.`;
		case "ready": return `Matrix verification is ready with ${senderId}. Choose "Verify by emoji" to reveal the emoji sequence.`;
		case "start": return `Matrix verification started with ${senderId}.`;
		case "done": return `Matrix verification completed with ${senderId}.`;
		case "cancel": {
			const code = trimMaybeString(content.code);
			const reason = trimMaybeString(content.reason);
			if (code && reason) return `Matrix verification cancelled by ${senderId} (${code}: ${reason}).`;
			if (reason) return `Matrix verification cancelled by ${senderId} (${reason}).`;
			return `Matrix verification cancelled by ${senderId}.`;
		}
		default: return null;
	}
}
function formatVerificationSasNotice(summary) {
	const sas = summary.sas;
	if (!sas) return null;
	const emojiLine = Array.isArray(sas.emoji) && sas.emoji.length > 0 ? `SAS emoji: ${sas.emoji.map(([emoji, name]) => `${trimMaybeString(emoji) ?? "?"} ${trimMaybeString(name) ?? "?"}`).join(" | ")}` : null;
	const decimalLine = Array.isArray(sas.decimal) && sas.decimal.length === 3 ? `SAS decimal: ${sas.decimal.join(" ")}` : null;
	if (!emojiLine && !decimalLine) return null;
	const lines = [`Matrix verification SAS with ${summary.otherUserId}:`];
	if (emojiLine) lines.push(emojiLine);
	if (decimalLine) lines.push(decimalLine);
	lines.push("If both sides match, choose 'They match' in your Matrix app.");
	return lines.join("\n");
}
function resolveVerificationFlowCandidates(params) {
	const { event, flowId } = params;
	const content = event.content;
	const candidates = /* @__PURE__ */ new Set();
	const add = (value) => {
		const normalized = trimMaybeString(value);
		if (normalized) candidates.add(normalized);
	};
	add(flowId);
	add(event.event_id);
	add(content.transaction_id);
	add(content["m.relates_to"]?.event_id);
	return Array.from(candidates);
}
function resolveSummaryRecency(summary) {
	const ts = Date.parse(summary.updatedAt ?? "");
	return Number.isFinite(ts) ? ts : 0;
}
function isActiveVerificationSummary(summary) {
	if (summary.completed === true) return false;
	if (summary.phaseName === "cancelled" || summary.phaseName === "done") return false;
	if (typeof summary.phase === "number" && summary.phase >= 4) return false;
	return true;
}
async function resolveVerificationSummaryForSignal(client, params) {
	if (!client.crypto) return null;
	await client.crypto.ensureVerificationDmTracked({
		roomId: params.roomId,
		userId: params.senderId
	}).catch(() => null);
	const list = await client.crypto.listVerifications();
	if (list.length === 0) return null;
	const candidates = resolveVerificationFlowCandidates({
		event: params.event,
		flowId: params.flowId
	});
	const byTransactionId = list.find((entry) => candidates.some((candidate) => entry.transactionId === candidate));
	if (byTransactionId) return byTransactionId;
	const activeRoomId = trimMaybeString((await inspectMatrixDirectRooms({
		client,
		remoteUserId: params.senderId
	}).catch(() => null))?.activeRoomId);
	if (activeRoomId) {
		if (activeRoomId !== params.roomId) return null;
	} else if (!await isStrictDirectRoom({
		client,
		roomId: params.roomId,
		remoteUserId: params.senderId
	})) return null;
	const activeByUser = list.filter((entry) => entry.otherUserId === params.senderId && isActiveVerificationSummary(entry)).sort((a, b) => resolveSummaryRecency(b) - resolveSummaryRecency(a));
	const activeInRoom = activeByUser.filter((entry) => {
		return trimMaybeString(entry.roomId) === params.roomId;
	});
	if (activeInRoom.length > 0) return activeInRoom[0] ?? null;
	return activeByUser[0] ?? null;
}
async function resolveVerificationSasNoticeForSignal(client, params) {
	const summary = await resolveVerificationSummaryForSignal(client, params);
	const immediateNotice = summary && isActiveVerificationSummary(summary) ? formatVerificationSasNotice(summary) : null;
	if (immediateNotice || params.stage !== "ready" && params.stage !== "start") return {
		summary,
		sasNotice: immediateNotice
	};
	await new Promise((resolve) => setTimeout(resolve, SAS_NOTICE_RETRY_DELAY_MS));
	const retriedSummary = await resolveVerificationSummaryForSignal(client, params);
	return {
		summary: retriedSummary,
		sasNotice: retriedSummary && isActiveVerificationSummary(retriedSummary) ? formatVerificationSasNotice(retriedSummary) : null
	};
}
function trackBounded(set, value) {
	if (!value || set.has(value)) return false;
	set.add(value);
	if (set.size > MAX_TRACKED_VERIFICATION_EVENTS) {
		const oldest = set.values().next().value;
		if (typeof oldest === "string") set.delete(oldest);
	}
	return true;
}
async function sendVerificationNotice(params) {
	const roomId = trimMaybeString(params.roomId);
	if (!roomId) return;
	try {
		await params.client.sendMessage(roomId, {
			msgtype: "m.notice",
			body: params.body
		});
	} catch (err) {
		params.logVerboseMessage(`matrix: failed sending verification notice room=${roomId}: ${String(err)}`);
	}
}
async function isVerificationNoticeAuthorized(params) {
	if (!params.dmEnabled || params.dmPolicy === "disabled") {
		params.logVerboseMessage(`matrix: blocked verification sender ${params.senderId} (dmPolicy=${params.dmPolicy}, dmEnabled=${String(params.dmEnabled)})`);
		return false;
	}
	if (params.dmPolicy === "open") return true;
	const storeAllowFrom = await params.readStoreAllowFrom();
	if (resolveMatrixMonitorAccessState({
		allowFrom: params.allowFrom,
		storeAllowFrom,
		groupAllowFrom: [],
		roomUsers: [],
		senderId: params.senderId,
		isRoom: false
	}).directAllowMatch.allowed) return true;
	params.logVerboseMessage(`matrix: blocked verification sender ${params.senderId} (dmPolicy=${params.dmPolicy})`);
	return false;
}
function createMatrixVerificationEventRouter(params) {
	const routerStartedAtMs = Date.now();
	const routedVerificationEvents = /* @__PURE__ */ new Set();
	const routedVerificationSasFingerprints = /* @__PURE__ */ new Set();
	const routedVerificationStageNotices = /* @__PURE__ */ new Set();
	const verificationFlowRooms = /* @__PURE__ */ new Map();
	const verificationUserRooms = /* @__PURE__ */ new Map();
	async function resolveActiveDirectRoomId(remoteUserId) {
		return trimMaybeString((await inspectMatrixDirectRooms({
			client: params.client,
			remoteUserId
		}).catch(() => null))?.activeRoomId);
	}
	function shouldEmitVerificationEventNotice(event) {
		const eventTs = typeof event.origin_server_ts === "number" && Number.isFinite(event.origin_server_ts) ? event.origin_server_ts : null;
		if (eventTs === null) return true;
		return eventTs >= routerStartedAtMs - VERIFICATION_EVENT_STARTUP_GRACE_MS;
	}
	function rememberVerificationRoom(roomId, event, flowId) {
		for (const candidate of resolveVerificationFlowCandidates({
			event,
			flowId
		})) {
			verificationFlowRooms.set(candidate, roomId);
			if (verificationFlowRooms.size > MAX_TRACKED_VERIFICATION_EVENTS) {
				const oldest = verificationFlowRooms.keys().next().value;
				if (typeof oldest === "string") verificationFlowRooms.delete(oldest);
			}
		}
	}
	function rememberVerificationUserRoom(remoteUserId, roomId) {
		const normalizedUserId = trimMaybeString(remoteUserId);
		const normalizedRoomId = trimMaybeString(roomId);
		if (!normalizedUserId || !normalizedRoomId) return;
		verificationUserRooms.delete(normalizedUserId);
		verificationUserRooms.set(normalizedUserId, normalizedRoomId);
		if (verificationUserRooms.size > MAX_TRACKED_VERIFICATION_EVENTS) {
			const oldest = verificationUserRooms.keys().next().value;
			if (typeof oldest === "string") verificationUserRooms.delete(oldest);
		}
	}
	async function resolveSummaryRoomId(summary) {
		const mappedRoomId = trimMaybeString(summary.roomId) ?? trimMaybeString(summary.transactionId ? verificationFlowRooms.get(summary.transactionId) : null) ?? trimMaybeString(verificationFlowRooms.get(summary.id));
		if (mappedRoomId) return mappedRoomId;
		const remoteUserId = trimMaybeString(summary.otherUserId);
		if (!remoteUserId) return null;
		const recentRoomId = trimMaybeString(verificationUserRooms.get(remoteUserId));
		const activeRoomId = await resolveActiveDirectRoomId(remoteUserId);
		if (recentRoomId && activeRoomId && recentRoomId === activeRoomId) return recentRoomId;
		if (activeRoomId) return activeRoomId;
		if (recentRoomId && await isStrictDirectRoom({
			client: params.client,
			roomId: recentRoomId,
			remoteUserId
		})) return recentRoomId;
		return null;
	}
	async function routeVerificationSummary(summary) {
		const roomId = await resolveSummaryRoomId(summary);
		if (!roomId || !isActiveVerificationSummary(summary)) return;
		if (!await isStrictDirectRoom({
			client: params.client,
			roomId,
			remoteUserId: summary.otherUserId
		})) {
			params.logVerboseMessage(`matrix: ignoring verification summary outside strict DM room=${roomId} sender=${summary.otherUserId}`);
			return;
		}
		if (!await isVerificationNoticeAuthorized({
			senderId: summary.otherUserId,
			allowFrom: params.allowFrom,
			dmEnabled: params.dmEnabled,
			dmPolicy: params.dmPolicy,
			readStoreAllowFrom: params.readStoreAllowFrom,
			logVerboseMessage: params.logVerboseMessage
		})) return;
		const sasNotice = formatVerificationSasNotice(summary);
		if (!sasNotice) return;
		if (!trackBounded(routedVerificationSasFingerprints, `${summary.id}:${JSON.stringify(summary.sas)}`)) return;
		await sendVerificationNotice({
			client: params.client,
			roomId,
			body: sasNotice,
			logVerboseMessage: params.logVerboseMessage
		});
	}
	function routeVerificationEvent(roomId, event) {
		const senderId = trimMaybeString(event?.sender);
		if (!senderId) return false;
		const signal = readVerificationSignal(event);
		if (!signal) return false;
		rememberVerificationRoom(roomId, event, signal.flowId);
		(async () => {
			if (!shouldEmitVerificationEventNotice(event)) {
				params.logVerboseMessage(`matrix: ignoring historical verification event room=${roomId} id=${event.event_id ?? "unknown"} type=${event.type ?? "unknown"}`);
				return;
			}
			const flowId = signal.flowId;
			const sourceFingerprint = trimMaybeString(event?.event_id) ?? `${senderId}:${event.type}:${flowId ?? "none"}`;
			if (!await isStrictDirectRoom({
				client: params.client,
				roomId,
				remoteUserId: senderId
			})) {
				params.logVerboseMessage(`matrix: ignoring verification event outside strict DM room=${roomId} sender=${senderId}`);
				return;
			}
			if (!await isVerificationNoticeAuthorized({
				senderId,
				allowFrom: params.allowFrom,
				dmEnabled: params.dmEnabled,
				dmPolicy: params.dmPolicy,
				readStoreAllowFrom: params.readStoreAllowFrom,
				logVerboseMessage: params.logVerboseMessage
			})) return;
			rememberVerificationUserRoom(senderId, roomId);
			if (!trackBounded(routedVerificationEvents, sourceFingerprint)) return;
			const stageNotice = formatVerificationStageNotice({
				stage: signal.stage,
				senderId,
				event
			});
			const { summary, sasNotice } = await resolveVerificationSasNoticeForSignal(params.client, {
				roomId,
				event,
				senderId,
				flowId,
				stage: signal.stage
			}).catch(() => ({
				summary: null,
				sasNotice: null
			}));
			const notices = [];
			if (stageNotice) {
				if (trackBounded(routedVerificationStageNotices, `${roomId}:${senderId}:${flowId ?? sourceFingerprint}:${signal.stage}`)) notices.push(stageNotice);
			}
			if (summary && sasNotice) {
				if (trackBounded(routedVerificationSasFingerprints, `${summary.id}:${JSON.stringify(summary.sas)}`)) notices.push(sasNotice);
			}
			if (notices.length === 0) return;
			for (const body of notices) await sendVerificationNotice({
				client: params.client,
				roomId,
				body,
				logVerboseMessage: params.logVerboseMessage
			});
		})().catch((err) => {
			params.logVerboseMessage(`matrix: failed routing verification event: ${String(err)}`);
		});
		return true;
	}
	return {
		routeVerificationEvent,
		routeVerificationSummary
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/events.ts
function formatMatrixSelfDecryptionHint(accountId) {
	return `matrix: failed to decrypt a message from this same Matrix user. This usually means another Matrix device did not share the room key, or another OpenClaw runtime is using the same account. Check 'openclaw matrix verify status --verbose --account ${accountId}' and 'openclaw matrix devices list --account ${accountId}'.`;
}
async function resolveMatrixSelfUserId(client, logVerboseMessage) {
	if (typeof client.getUserId !== "function") return null;
	try {
		return await client.getUserId() ?? null;
	} catch (err) {
		logVerboseMessage(`matrix: failed resolving self user id for decrypt warning: ${String(err)}`);
		return null;
	}
}
function registerMatrixMonitorEvents(params) {
	const { cfg, client, auth, allowFrom, dmEnabled, dmPolicy, readStoreAllowFrom, directTracker, logVerboseMessage, warnedEncryptedRooms, warnedCryptoMissingRooms, logger, formatNativeDependencyHint, onRoomMessage } = params;
	const { routeVerificationEvent, routeVerificationSummary } = createMatrixVerificationEventRouter({
		client,
		allowFrom,
		dmEnabled,
		dmPolicy,
		readStoreAllowFrom,
		logVerboseMessage
	});
	client.on("room.message", (roomId, event) => {
		if (routeVerificationEvent(roomId, event)) return;
		onRoomMessage(roomId, event);
	});
	client.on("room.encrypted_event", (roomId, event) => {
		const eventId = event?.event_id ?? "unknown";
		logVerboseMessage(`matrix: encrypted event room=${roomId} type=${event?.type ?? "unknown"} id=${eventId}`);
	});
	client.on("room.decrypted_event", (roomId, event) => {
		const eventId = event?.event_id ?? "unknown";
		logVerboseMessage(`matrix: decrypted event room=${roomId} type=${event?.type ?? "unknown"} id=${eventId}`);
	});
	client.on("room.failed_decryption", async (roomId, event, error) => {
		const selfUserId = await resolveMatrixSelfUserId(client, logVerboseMessage);
		const sender = typeof event.sender === "string" ? event.sender : null;
		const senderMatchesOwnUser = Boolean(selfUserId && sender && selfUserId === sender);
		logger.warn("Failed to decrypt message", {
			roomId,
			eventId: event.event_id,
			sender,
			senderMatchesOwnUser,
			error: error.message
		});
		if (senderMatchesOwnUser) logger.warn(formatMatrixSelfDecryptionHint(auth.accountId), {
			roomId,
			eventId: event.event_id,
			sender
		});
		logVerboseMessage(`matrix: failed decrypt room=${roomId} id=${event.event_id ?? "unknown"} error=${error.message}`);
	});
	client.on("verification.summary", (summary) => {
		routeVerificationSummary(summary);
	});
	client.on("room.invite", (roomId, event) => {
		directTracker?.invalidateRoom(roomId);
		const eventId = event?.event_id ?? "unknown";
		const sender = event?.sender ?? "unknown";
		const isDirect = (event?.content)?.is_direct === true;
		logVerboseMessage(`matrix: invite room=${roomId} sender=${sender} direct=${String(isDirect)} id=${eventId}`);
	});
	client.on("room.join", (roomId, event) => {
		directTracker?.invalidateRoom(roomId);
		logVerboseMessage(`matrix: join room=${roomId} id=${event?.event_id ?? "unknown"}`);
	});
	client.on("room.event", (roomId, event) => {
		const eventType = event?.type ?? "unknown";
		if (eventType === EventType.RoomMessageEncrypted) {
			logVerboseMessage(`matrix: encrypted raw event room=${roomId} id=${event?.event_id ?? "unknown"}`);
			if (auth.encryption !== true && !warnedEncryptedRooms.has(roomId)) {
				warnedEncryptedRooms.add(roomId);
				const warning = formatMatrixEncryptedEventDisabledWarning(cfg, auth.accountId);
				logger.warn(warning, { roomId });
			}
			if (auth.encryption === true && !client.crypto && !warnedCryptoMissingRooms.has(roomId)) {
				warnedCryptoMissingRooms.add(roomId);
				const warning = `matrix: encryption enabled but crypto is unavailable; ${formatNativeDependencyHint({
					packageName: "@matrix-org/matrix-sdk-crypto-nodejs",
					manager: "pnpm",
					downloadCommand: "node node_modules/@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js"
				})}`;
				logger.warn(warning, { roomId });
			}
			return;
		}
		if (eventType === EventType.RoomMember) {
			directTracker?.invalidateRoom(roomId);
			const membership = (event?.content)?.membership;
			logVerboseMessage(`matrix: member event room=${roomId} stateKey=${event.state_key ?? ""} membership=${membership ?? "unknown"}`);
		}
		if (eventType === EventType.Reaction) {
			onRoomMessage(roomId, event);
			return;
		}
		routeVerificationEvent(roomId, event);
	});
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/ack-config.ts
function resolveMatrixAckReactionConfig(params) {
	const matrixConfig = params.cfg.channels?.matrix;
	const accountConfig = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return {
		ackReaction: resolveAckReaction(params.cfg, params.agentId, {
			channel: "matrix",
			accountId: params.accountId ?? void 0
		}).trim(),
		ackReactionScope: accountConfig.ackReactionScope ?? matrixConfig?.ackReactionScope ?? params.cfg.messages?.ackReactionScope ?? "group-mentions"
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/location.ts
function parseGeoUri(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	if (!trimmed.toLowerCase().startsWith("geo:")) return null;
	const [coordsPart, ...paramParts] = trimmed.slice(4).split(";");
	const coords = coordsPart.split(",");
	if (coords.length < 2) return null;
	const latitude = Number.parseFloat(coords[0] ?? "");
	const longitude = Number.parseFloat(coords[1] ?? "");
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
	const params = /* @__PURE__ */ new Map();
	for (const part of paramParts) {
		const segment = part.trim();
		if (!segment) continue;
		const eqIndex = segment.indexOf("=");
		const rawKey = eqIndex === -1 ? segment : segment.slice(0, eqIndex);
		const rawValue = eqIndex === -1 ? "" : segment.slice(eqIndex + 1);
		const key = rawKey.trim().toLowerCase();
		if (!key) continue;
		const valuePart = rawValue.trim();
		params.set(key, valuePart ? decodeURIComponent(valuePart) : "");
	}
	const accuracyRaw = params.get("u");
	const accuracy = accuracyRaw ? Number.parseFloat(accuracyRaw) : void 0;
	return {
		latitude,
		longitude,
		accuracy: Number.isFinite(accuracy) ? accuracy : void 0
	};
}
function resolveMatrixLocation(params) {
	const { eventType, content } = params;
	if (!(eventType === EventType.Location || eventType === EventType.RoomMessage && content.msgtype === EventType.Location)) return null;
	const geoUri = typeof content.geo_uri === "string" ? content.geo_uri.trim() : "";
	if (!geoUri) return null;
	const parsed = parseGeoUri(geoUri);
	if (!parsed) return null;
	const caption = typeof content.body === "string" ? content.body.trim() : "";
	const location = {
		latitude: parsed.latitude,
		longitude: parsed.longitude,
		accuracy: parsed.accuracy,
		caption: caption || void 0,
		source: "pin",
		isLive: false
	};
	return {
		text: formatLocationText(location),
		context: toLocationContext(location)
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/media.ts
const MATRIX_MEDIA_DOWNLOAD_IDLE_TIMEOUT_MS = 3e4;
async function fetchMatrixMediaBuffer(params) {
	try {
		return { buffer: await params.client.downloadContent(params.mxcUrl, {
			maxBytes: params.maxBytes,
			readIdleTimeoutMs: MATRIX_MEDIA_DOWNLOAD_IDLE_TIMEOUT_MS
		}) };
	} catch (err) {
		throw new Error(`Matrix media download failed: ${String(err)}`, { cause: err });
	}
}
/**
* Download and decrypt encrypted media from a Matrix room.
* Uses the Matrix crypto adapter's decryptMedia helper.
*/
async function fetchEncryptedMediaBuffer(params) {
	if (!params.client.crypto) throw new Error("Cannot decrypt media: crypto not enabled");
	const decrypted = await params.client.crypto.decryptMedia(params.file, {
		maxBytes: params.maxBytes,
		readIdleTimeoutMs: MATRIX_MEDIA_DOWNLOAD_IDLE_TIMEOUT_MS
	});
	if (decrypted.byteLength > params.maxBytes) throw new Error("Matrix media exceeds configured size limit");
	return { buffer: decrypted };
}
async function downloadMatrixMedia(params) {
	let fetched;
	if (typeof params.sizeBytes === "number" && params.sizeBytes > params.maxBytes) throw new Error("Matrix media exceeds configured size limit");
	if (params.file) fetched = await fetchEncryptedMediaBuffer({
		client: params.client,
		file: params.file,
		maxBytes: params.maxBytes
	});
	else fetched = await fetchMatrixMediaBuffer({
		client: params.client,
		mxcUrl: params.mxcUrl,
		maxBytes: params.maxBytes
	});
	if (!fetched) return null;
	const headerType = params.contentType ?? void 0;
	const saved = await getMatrixRuntime().channel.media.saveMediaBuffer(fetched.buffer, headerType, "inbound", params.maxBytes, params.originalFilename);
	return {
		path: saved.path,
		contentType: saved.contentType,
		placeholder: "[matrix media]"
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/mentions.ts
const HTML_ENTITY_REPLACEMENTS = {
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	nbsp: " ",
	quot: "\""
};
const MAX_UNICODE_SCALAR_VALUE = 1114111;
function decodeNumericHtmlEntity(match, rawValue, radix) {
	const codePoint = Number.parseInt(rawValue, radix);
	if (!Number.isSafeInteger(codePoint) || codePoint < 0 || codePoint > MAX_UNICODE_SCALAR_VALUE || codePoint >= 55296 && codePoint <= 57343) return match;
	return String.fromCodePoint(codePoint);
}
function decodeHtmlEntities(value) {
	return value.replace(/&(#x?[0-9a-f]+|\w+);/gi, (match, entity) => {
		const normalized = entity.toLowerCase();
		if (normalized.startsWith("#x")) return decodeNumericHtmlEntity(match, normalized.slice(2), 16);
		if (normalized.startsWith("#")) return decodeNumericHtmlEntity(match, normalized.slice(1), 10);
		return HTML_ENTITY_REPLACEMENTS[normalized] ?? match;
	});
}
function normalizeVisibleMentionText(value) {
	return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "")).replace(/\s+/g, " ").trim().toLowerCase();
}
function extractVisibleMentionText(value) {
	return normalizeVisibleMentionText(value ?? "");
}
function resolveMatrixUserLocalpart(userId) {
	const trimmed = userId.trim();
	if (!trimmed.startsWith("@")) return null;
	const colonIndex = trimmed.indexOf(":");
	if (colonIndex <= 1) return null;
	return trimmed.slice(1, colonIndex).trim() || null;
}
function isVisibleMentionLabel(params) {
	const cleaned = extractVisibleMentionText(params.text);
	if (!cleaned) return false;
	if (params.mentionRegexes.some((pattern) => pattern.test(cleaned))) return true;
	const localpart = resolveMatrixUserLocalpart(params.userId);
	return [
		extractVisibleMentionText(params.userId),
		localpart ? extractVisibleMentionText(localpart) : null,
		localpart ? extractVisibleMentionText(`@${localpart}`) : null,
		params.displayName ? extractVisibleMentionText(params.displayName) : null
	].filter((value) => Boolean(value)).includes(cleaned);
}
function hasVisibleRoomMention(value) {
	const cleaned = extractVisibleMentionText(value);
	return /(^|[^a-z0-9_])@room\b/i.test(cleaned);
}
/**
* Check if formatted_body contains a matrix.to link whose visible label still
* looks like a real mention for the given user. Do not trust href alone, since
* senders can hide arbitrary matrix.to links behind unrelated link text.
* Many Matrix clients (including Element) use HTML links in formatted_body instead of
* or in addition to the m.mentions field.
*/
function checkFormattedBodyMention(params) {
	if (!params.formattedBody || !params.userId) return false;
	for (const match of params.formattedBody.matchAll(/<a\b[^>]*href=(["'])(https:\/\/matrix\.to\/#[^"']+)\1[^>]*>(.*?)<\/a>/gis)) {
		const href = match[2];
		const visibleLabel = match[3] ?? "";
		if (!href) continue;
		try {
			const parsed = new URL(href);
			if (decodeURIComponent(parsed.hash.replace(/^#\/?/, "").trim()) !== params.userId.trim()) continue;
			if (isVisibleMentionLabel({
				text: visibleLabel,
				userId: params.userId,
				mentionRegexes: params.mentionRegexes,
				displayName: params.displayName
			})) return true;
		} catch {
			continue;
		}
	}
	return false;
}
function resolveMentions(params) {
	const mentions = params.content["m.mentions"];
	const mentionedUsers = Array.isArray(mentions?.user_ids) ? new Set(mentions.user_ids) : /* @__PURE__ */ new Set();
	const textMentioned = getMatrixRuntime().channel.mentions.matchesMentionPatterns(params.text ?? "", params.mentionRegexes);
	const visibleRoomMention = hasVisibleRoomMention(params.text) || hasVisibleRoomMention(params.content.formatted_body);
	const mentionedInFormattedBody = params.userId ? checkFormattedBodyMention({
		formattedBody: params.content.formatted_body,
		userId: params.userId,
		displayName: params.displayName,
		mentionRegexes: params.mentionRegexes
	}) : false;
	const metadataBackedUserMention = Boolean(params.userId && mentionedUsers.has(params.userId) && (mentionedInFormattedBody || textMentioned));
	const metadataBackedRoomMention = Boolean(mentions?.room) && visibleRoomMention;
	const explicitMention = mentionedInFormattedBody || metadataBackedUserMention || metadataBackedRoomMention;
	return {
		wasMentioned: explicitMention || textMentioned || visibleRoomMention,
		hasExplicitMention: explicitMention
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/route.ts
function resolveMatrixInboundRoute(params) {
	const baseRoute = params.resolveAgentRoute({
		cfg: params.cfg,
		channel: "matrix",
		accountId: params.accountId,
		peer: {
			kind: params.isDirectMessage ? "direct" : "channel",
			id: params.isDirectMessage ? params.senderId : params.roomId
		},
		parentPeer: params.isDirectMessage ? {
			kind: "channel",
			id: params.roomId
		} : void 0
	});
	const bindingConversationId = params.threadRootId && params.threadRootId !== params.messageId ? params.threadRootId : params.roomId;
	const bindingParentConversationId = bindingConversationId === params.roomId ? void 0 : params.roomId;
	const runtimeBinding = getSessionBindingService().resolveByConversation({
		channel: "matrix",
		accountId: params.accountId,
		conversationId: bindingConversationId,
		parentConversationId: bindingParentConversationId
	});
	const boundSessionKey = runtimeBinding?.targetSessionKey?.trim();
	if (runtimeBinding && boundSessionKey) return {
		route: {
			...baseRoute,
			sessionKey: boundSessionKey,
			agentId: resolveAgentIdFromSessionKey(boundSessionKey) || baseRoute.agentId,
			matchedBy: "binding.channel"
		},
		configuredBinding: null,
		runtimeBindingId: runtimeBinding.bindingId
	};
	const configuredBinding = runtimeBinding == null ? resolveConfiguredAcpBindingRecord({
		cfg: params.cfg,
		channel: "matrix",
		accountId: params.accountId,
		conversationId: bindingConversationId,
		parentConversationId: bindingParentConversationId
	}) : null;
	const configuredSessionKey = configuredBinding?.record.targetSessionKey?.trim();
	return {
		route: configuredBinding && configuredSessionKey ? {
			...baseRoute,
			sessionKey: configuredSessionKey,
			agentId: resolveAgentIdFromSessionKey(configuredSessionKey) || configuredBinding.spec.agentId || baseRoute.agentId,
			matchedBy: "binding.channel"
		} : baseRoute,
		configuredBinding,
		runtimeBindingId: null
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/threads.ts
function resolveMatrixThreadTarget(params) {
	const { threadReplies, messageId, threadRootId } = params;
	if (threadReplies === "off") return;
	const isThreadRoot = params.isThreadRoot === true;
	const hasInboundThread = Boolean(threadRootId && threadRootId !== messageId && !isThreadRoot);
	if (threadReplies === "inbound") return hasInboundThread ? threadRootId : void 0;
	if (threadReplies === "always") return threadRootId ?? messageId;
}
function resolveMatrixThreadRootId(params) {
	const relates = params.content["m.relates_to"];
	if (!relates || typeof relates !== "object") return;
	if ("rel_type" in relates && relates.rel_type === RelationType.Thread) {
		if ("event_id" in relates && typeof relates.event_id === "string") return relates.event_id;
		if ("m.in_reply_to" in relates && typeof relates["m.in_reply_to"] === "object" && relates["m.in_reply_to"] && "event_id" in relates["m.in_reply_to"] && typeof relates["m.in_reply_to"].event_id === "string") return relates["m.in_reply_to"].event_id;
	}
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/reaction-events.ts
function resolveMatrixReactionNotificationMode(params) {
	const matrixConfig = params.cfg.channels?.matrix;
	return resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	}).reactionNotifications ?? matrixConfig?.reactionNotifications ?? "own";
}
async function handleInboundMatrixReaction(params) {
	const notificationMode = resolveMatrixReactionNotificationMode({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (notificationMode === "off") return;
	const reaction = extractMatrixReactionAnnotation(params.event.content);
	if (!reaction?.eventId) return;
	const targetEvent = await params.client.getEvent(params.roomId, reaction.eventId).catch((err) => {
		params.logVerboseMessage(`matrix: failed resolving reaction target room=${params.roomId} id=${reaction.eventId}: ${String(err)}`);
		return null;
	});
	const targetSender = targetEvent && typeof targetEvent.sender === "string" ? targetEvent.sender.trim() : "";
	if (!targetSender) return;
	if (notificationMode === "own" && targetSender !== params.selfUserId) return;
	const targetContent = targetEvent && targetEvent.content && typeof targetEvent.content === "object" ? targetEvent.content : void 0;
	const threadRootId = targetContent ? resolveMatrixThreadRootId({
		event: targetEvent,
		content: targetContent
	}) : void 0;
	const { route, runtimeBindingId } = resolveMatrixInboundRoute({
		cfg: params.cfg,
		accountId: params.accountId,
		roomId: params.roomId,
		senderId: params.senderId,
		isDirectMessage: params.isDirectMessage,
		messageId: reaction.eventId,
		threadRootId,
		eventTs: params.event.origin_server_ts,
		resolveAgentRoute: params.core.channel.routing.resolveAgentRoute
	});
	if (runtimeBindingId) getSessionBindingService().touch(runtimeBindingId, params.event.origin_server_ts);
	const text = `Matrix reaction added: ${reaction.key} by ${params.senderLabel} on msg ${reaction.eventId}`;
	params.core.system.enqueueSystemEvent(text, {
		sessionKey: route.sessionKey,
		contextKey: `matrix:reaction:add:${params.roomId}:${reaction.eventId}:${params.senderId}:${reaction.key}`
	});
	params.logVerboseMessage(`matrix: reaction event enqueued room=${params.roomId} target=${reaction.eventId} sender=${params.senderId} emoji=${reaction.key}`);
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/replies.ts
const THINKING_TAG_RE = /<\s*\/?\s*(?:think(?:ing)?|thought|antthinking)\b[^<>]*>/gi;
const THINKING_BLOCK_RE = /<\s*(?:think(?:ing)?|thought|antthinking)\b[^<>]*>[\s\S]*?<\s*\/\s*(?:think(?:ing)?|thought|antthinking)\s*>/gi;
function shouldSuppressReasoningReplyText(text) {
	if (typeof text !== "string") return false;
	const trimmedStart = text.trimStart();
	if (!trimmedStart) return false;
	if (trimmedStart.toLowerCase().startsWith("reasoning:")) return true;
	THINKING_TAG_RE.lastIndex = 0;
	if (!THINKING_TAG_RE.test(text)) return false;
	THINKING_BLOCK_RE.lastIndex = 0;
	const withoutThinkingBlocks = text.replace(THINKING_BLOCK_RE, "");
	THINKING_TAG_RE.lastIndex = 0;
	return !withoutThinkingBlocks.replace(THINKING_TAG_RE, "").trim();
}
async function deliverMatrixReplies(params) {
	const core = getMatrixRuntime();
	const tableMode = params.tableMode ?? core.channel.text.resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "matrix",
		accountId: params.accountId
	});
	const logVerbose = (message) => {
		if (core.logging.shouldLogVerbose()) params.runtime.log?.(message);
	};
	const chunkLimit = Math.min(params.textLimit, 4e3);
	const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "matrix", params.accountId);
	let hasReplied = false;
	for (const reply of params.replies) {
		if (reply.isReasoning === true || shouldSuppressReasoningReplyText(reply.text)) {
			logVerbose("matrix reply suppressed as reasoning-only");
			continue;
		}
		const hasMedia = Boolean(reply?.mediaUrl) || (reply?.mediaUrls?.length ?? 0) > 0;
		if (!reply?.text && !hasMedia) {
			if (reply?.audioAsVoice) {
				logVerbose("matrix reply has audioAsVoice without media/text; skipping");
				continue;
			}
			params.runtime.error?.("matrix reply missing text/media");
			continue;
		}
		const replyToIdRaw = reply.replyToId?.trim();
		const replyToId = params.threadId || params.replyToMode === "off" ? void 0 : replyToIdRaw;
		const rawText = reply.text ?? "";
		const text = core.channel.text.convertMarkdownTables(rawText, tableMode);
		const mediaList = reply.mediaUrls?.length ? reply.mediaUrls : reply.mediaUrl ? [reply.mediaUrl] : [];
		const shouldIncludeReply = (id) => Boolean(id) && (params.replyToMode === "all" || !hasReplied);
		const replyToIdForReply = shouldIncludeReply(replyToId) ? replyToId : void 0;
		if (mediaList.length === 0) {
			let sentTextChunk = false;
			for (const chunk of core.channel.text.chunkMarkdownTextWithMode(text, chunkLimit, chunkMode)) {
				const trimmed = chunk.trim();
				if (!trimmed) continue;
				await sendMessageMatrix(params.roomId, trimmed, {
					client: params.client,
					cfg: params.cfg,
					replyToId: replyToIdForReply,
					threadId: params.threadId,
					accountId: params.accountId
				});
				sentTextChunk = true;
			}
			if (replyToIdForReply && !hasReplied && sentTextChunk) hasReplied = true;
			continue;
		}
		let first = true;
		for (const mediaUrl of mediaList) {
			const caption = first ? text : "";
			await sendMessageMatrix(params.roomId, caption, {
				client: params.client,
				cfg: params.cfg,
				mediaUrl,
				mediaLocalRoots: params.mediaLocalRoots,
				replyToId: replyToIdForReply,
				threadId: params.threadId,
				audioAsVoice: reply.audioAsVoice,
				accountId: params.accountId
			});
			first = false;
		}
		if (replyToIdForReply && !hasReplied) hasReplied = true;
	}
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/context-summary.ts
function trimMatrixMaybeString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function summarizeMatrixMessageContextEvent(event) {
	if (isPollStartType(event.type)) {
		const pollSummary = parsePollStartContent(event.content);
		if (pollSummary) return formatPollAsText(pollSummary);
	}
	const content = event.content;
	return formatMatrixMessageText({
		body: resolveMatrixMessageBody({
			body: trimMatrixMaybeString(content.body),
			filename: trimMatrixMaybeString(content.filename),
			msgtype: trimMatrixMaybeString(content.msgtype)
		}),
		attachment: resolveMatrixMessageAttachment({
			body: trimMatrixMaybeString(content.body),
			filename: trimMatrixMaybeString(content.filename),
			msgtype: trimMatrixMaybeString(content.msgtype)
		})
	});
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/reply-context.ts
const MAX_CACHED_REPLY_CONTEXTS = 256;
const MAX_REPLY_BODY_LENGTH = 500;
function truncateReplyBody(value) {
	if (value.length <= MAX_REPLY_BODY_LENGTH) return value;
	return `${value.slice(0, MAX_REPLY_BODY_LENGTH - 3)}...`;
}
function summarizeMatrixReplyEvent(event) {
	const body = summarizeMatrixMessageContextEvent(event);
	return body ? truncateReplyBody(body) : void 0;
}
/**
* Creates a cached resolver that fetches the body and sender of a replied-to
* Matrix event. This allows the agent to see the content of the message being
* replied to, not just its event ID.
*/
function createMatrixReplyContextResolver(params) {
	const cache = /* @__PURE__ */ new Map();
	const remember = (key, value) => {
		cache.set(key, value);
		if (cache.size > MAX_CACHED_REPLY_CONTEXTS) {
			const oldest = cache.keys().next().value;
			if (typeof oldest === "string") cache.delete(oldest);
		}
		return value;
	};
	return async (input) => {
		const cacheKey = `${input.roomId}:${input.eventId}`;
		const cached = cache.get(cacheKey);
		if (cached) {
			cache.delete(cacheKey);
			cache.set(cacheKey, cached);
			return cached;
		}
		const event = await params.client.getEvent(input.roomId, input.eventId).catch((err) => {
			params.logVerboseMessage(`matrix: failed resolving reply context room=${input.roomId} id=${input.eventId}: ${String(err)}`);
			return null;
		});
		if (!event) return {};
		const rawEvent = event;
		if (rawEvent.unsigned?.redacted_because) return remember(cacheKey, {});
		const replyToBody = summarizeMatrixReplyEvent(rawEvent);
		if (!replyToBody) return remember(cacheKey, {});
		const senderId = trimMatrixMaybeString(rawEvent.sender);
		return remember(cacheKey, {
			replyToBody,
			replyToSender: (senderId && await params.getMemberDisplayName(input.roomId, senderId).catch(() => void 0)) ?? senderId
		});
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/thread-context.ts
const MAX_TRACKED_THREAD_STARTERS = 256;
const MAX_THREAD_STARTER_BODY_LENGTH = 500;
function truncateThreadStarterBody(value) {
	if (value.length <= MAX_THREAD_STARTER_BODY_LENGTH) return value;
	return `${value.slice(0, MAX_THREAD_STARTER_BODY_LENGTH - 3)}...`;
}
function summarizeMatrixThreadStarterEvent(event) {
	const body = summarizeMatrixMessageContextEvent(event);
	if (body) return truncateThreadStarterBody(body);
	const content = event.content;
	const msgtype = trimMatrixMaybeString(content.msgtype);
	if (msgtype) return `Matrix ${msgtype} message`;
	const eventType = trimMatrixMaybeString(event.type);
	return eventType ? `Matrix ${eventType} event` : void 0;
}
function formatMatrixThreadStarterBody(params) {
	const senderLabel = params.senderName ?? params.senderId ?? "unknown sender";
	const lines = [`Matrix thread root ${params.threadRootId} from ${senderLabel}:`];
	if (params.summary) lines.push(params.summary);
	return lines.join("\n");
}
function createMatrixThreadContextResolver(params) {
	const cache = /* @__PURE__ */ new Map();
	const remember = (key, value) => {
		cache.set(key, value);
		if (cache.size > MAX_TRACKED_THREAD_STARTERS) {
			const oldest = cache.keys().next().value;
			if (typeof oldest === "string") cache.delete(oldest);
		}
		return value;
	};
	return async (input) => {
		const cacheKey = `${input.roomId}:${input.threadRootId}`;
		const cached = cache.get(cacheKey);
		if (cached) return cached;
		const rootEvent = await params.client.getEvent(input.roomId, input.threadRootId).catch((err) => {
			params.logVerboseMessage(`matrix: failed resolving thread root room=${input.roomId} id=${input.threadRootId}: ${String(err)}`);
			return null;
		});
		if (!rootEvent) return { threadStarterBody: `Matrix thread root ${input.threadRootId}` };
		const rawEvent = rootEvent;
		const senderId = trimMatrixMaybeString(rawEvent.sender);
		const senderName = senderId && await params.getMemberDisplayName(input.roomId, senderId).catch(() => void 0);
		const senderLabel = senderName ?? senderId;
		const summary = summarizeMatrixThreadStarterEvent(rawEvent);
		return remember(cacheKey, {
			threadStarterBody: formatMatrixThreadStarterBody({
				threadRootId: input.threadRootId,
				senderId,
				senderName,
				summary
			}),
			senderLabel,
			summary
		});
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/handler.ts
const ALLOW_FROM_STORE_CACHE_TTL_MS = 3e4;
const PAIRING_REPLY_COOLDOWN_MS = 5 * 6e4;
const MAX_TRACKED_PAIRING_REPLY_SENDERS = 512;
function resolveMatrixMentionPrecheckText(params) {
	if (params.locationText?.trim()) return params.locationText.trim();
	if (typeof params.content.body === "string" && params.content.body.trim()) return params.content.body.trim();
	if (isPollStartType(params.eventType)) {
		const parsed = parsePollStartContent(params.content);
		if (parsed) return formatPollAsText(parsed);
	}
	return "";
}
function resolveMatrixInboundBodyText(params) {
	if (params.mediaPlaceholder) return params.rawBody || params.mediaPlaceholder;
	if (!params.mediaDownloadFailed || !params.hadMediaUrl) return params.rawBody;
	return formatMatrixMediaUnavailableText({
		body: params.rawBody,
		filename: params.filename,
		msgtype: params.msgtype
	});
}
function resolveMatrixAllowBotsMode(value) {
	if (value === true) return "all";
	if (value === "mentions") return "mentions";
	return "off";
}
function createMatrixRoomMessageHandler(params) {
	const { client, core, cfg, accountId, runtime, logger, logVerboseMessage, allowFrom, groupAllowFrom = [], roomsConfig, accountAllowBots, configuredBotUserIds = /* @__PURE__ */ new Set(), mentionRegexes, groupPolicy, replyToMode, threadReplies, dmEnabled, dmPolicy, textLimit, mediaMaxBytes, startupMs, startupGraceMs, dropPreStartupMessages, inboundDeduper, directTracker, getRoomInfo, getMemberDisplayName, needsRoomAliasesForConfig } = params;
	let cachedStoreAllowFrom = null;
	const pairingReplySentAtMsBySender = /* @__PURE__ */ new Map();
	const resolveThreadContext = createMatrixThreadContextResolver({
		client,
		getMemberDisplayName,
		logVerboseMessage
	});
	const resolveReplyContext = createMatrixReplyContextResolver({
		client,
		getMemberDisplayName,
		logVerboseMessage
	});
	const readStoreAllowFrom = async () => {
		const now = Date.now();
		if (cachedStoreAllowFrom && now < cachedStoreAllowFrom.expiresAtMs) return cachedStoreAllowFrom.value;
		const value = await core.channel.pairing.readAllowFromStore({
			channel: "matrix",
			env: process.env,
			accountId
		}).catch(() => []);
		cachedStoreAllowFrom = {
			value,
			expiresAtMs: now + ALLOW_FROM_STORE_CACHE_TTL_MS
		};
		return value;
	};
	const shouldSendPairingReply = (senderId, created) => {
		const now = Date.now();
		if (created) {
			pairingReplySentAtMsBySender.set(senderId, now);
			return true;
		}
		const lastSentAtMs = pairingReplySentAtMsBySender.get(senderId);
		if (typeof lastSentAtMs === "number" && now - lastSentAtMs < PAIRING_REPLY_COOLDOWN_MS) return false;
		pairingReplySentAtMsBySender.set(senderId, now);
		if (pairingReplySentAtMsBySender.size > MAX_TRACKED_PAIRING_REPLY_SENDERS) {
			const oldestSender = pairingReplySentAtMsBySender.keys().next().value;
			if (typeof oldestSender === "string") pairingReplySentAtMsBySender.delete(oldestSender);
		}
		return true;
	};
	return async (roomId, event) => {
		const eventId = typeof event.event_id === "string" ? event.event_id.trim() : "";
		let claimedInboundEvent = false;
		try {
			const eventType = event.type;
			if (eventType === EventType.RoomMessageEncrypted) return;
			const isPollEvent = isPollEventType(eventType);
			const isReactionEvent = eventType === EventType.Reaction;
			const locationContent = event.content;
			const isLocationEvent = eventType === EventType.Location || eventType === EventType.RoomMessage && locationContent.msgtype === EventType.Location;
			if (eventType !== EventType.RoomMessage && !isPollEvent && !isLocationEvent && !isReactionEvent) return;
			logVerboseMessage(`matrix: inbound event room=${roomId} type=${eventType} id=${event.event_id ?? "unknown"}`);
			if (event.unsigned?.redacted_because) return;
			const senderId = event.sender;
			if (!senderId) return;
			const selfUserId = await client.getUserId();
			if (senderId === selfUserId) return;
			const eventTs = event.origin_server_ts;
			const eventAge = event.unsigned?.age;
			const commitInboundEventIfClaimed = async () => {
				if (!claimedInboundEvent || !inboundDeduper || !eventId) return;
				await inboundDeduper.commitEvent({
					roomId,
					eventId
				});
				claimedInboundEvent = false;
			};
			if (dropPreStartupMessages) {
				if (typeof eventTs === "number" && eventTs < startupMs - startupGraceMs) return;
				if (typeof eventTs !== "number" && typeof eventAge === "number" && eventAge > startupGraceMs) return;
			}
			let content = event.content;
			if (eventType === EventType.RoomMessage && isMatrixVerificationRoomMessage({
				msgtype: content.msgtype,
				body: content.body
			})) {
				logVerboseMessage(`matrix: skip verification/system room message room=${roomId}`);
				return;
			}
			const locationPayload = resolveMatrixLocation({
				eventType,
				content
			});
			const relates = content["m.relates_to"];
			if (relates && "rel_type" in relates) {
				if (relates.rel_type === RelationType.Replace) return;
			}
			if (eventId && inboundDeduper) {
				claimedInboundEvent = inboundDeduper.claimEvent({
					roomId,
					eventId
				});
				if (!claimedInboundEvent) {
					logVerboseMessage(`matrix: skip duplicate inbound event room=${roomId} id=${eventId}`);
					return;
				}
			}
			const isDirectMessage = await directTracker.isDirectMessage({
				roomId,
				senderId,
				selfUserId
			});
			const isRoom = !isDirectMessage;
			if (isRoom && groupPolicy === "disabled") {
				await commitInboundEventIfClaimed();
				return;
			}
			const roomInfoForConfig = isRoom && needsRoomAliasesForConfig ? await getRoomInfo(roomId, { includeAliases: true }) : void 0;
			const roomAliasesForConfig = roomInfoForConfig ? [roomInfoForConfig.canonicalAlias ?? "", ...roomInfoForConfig.altAliases].filter(Boolean) : [];
			const roomConfigInfo = isRoom ? resolveMatrixRoomConfig({
				rooms: roomsConfig,
				roomId,
				aliases: roomAliasesForConfig
			}) : void 0;
			const roomConfig = roomConfigInfo?.config;
			const allowBotsMode = resolveMatrixAllowBotsMode(roomConfig?.allowBots ?? accountAllowBots);
			const isConfiguredBotSender = configuredBotUserIds.has(senderId);
			const roomMatchMeta = roomConfigInfo ? `matchKey=${roomConfigInfo.matchKey ?? "none"} matchSource=${roomConfigInfo.matchSource ?? "none"}` : "matchKey=none matchSource=none";
			if (isConfiguredBotSender && allowBotsMode === "off") {
				logVerboseMessage(`matrix: drop configured bot sender=${senderId} (allowBots=false${isDirectMessage ? "" : `, ${roomMatchMeta}`})`);
				await commitInboundEventIfClaimed();
				return;
			}
			if (isRoom && roomConfig && !roomConfigInfo?.allowed) {
				logVerboseMessage(`matrix: room disabled room=${roomId} (${roomMatchMeta})`);
				await commitInboundEventIfClaimed();
				return;
			}
			if (isRoom && groupPolicy === "allowlist") {
				if (!roomConfigInfo?.allowlistConfigured) {
					logVerboseMessage(`matrix: drop room message (no allowlist, ${roomMatchMeta})`);
					await commitInboundEventIfClaimed();
					return;
				}
				if (!roomConfig) {
					logVerboseMessage(`matrix: drop room message (not in allowlist, ${roomMatchMeta})`);
					await commitInboundEventIfClaimed();
					return;
				}
			}
			let senderNamePromise = null;
			const getSenderName = async () => {
				senderNamePromise ??= getMemberDisplayName(roomId, senderId).catch(() => senderId);
				return await senderNamePromise;
			};
			const { effectiveAllowFrom, effectiveGroupAllowFrom, effectiveRoomUsers, groupAllowConfigured, directAllowMatch, roomUserMatch, groupAllowMatch, commandAuthorizers } = resolveMatrixMonitorAccessState({
				allowFrom,
				storeAllowFrom: await readStoreAllowFrom(),
				groupAllowFrom,
				roomUsers: roomConfig?.users ?? [],
				senderId,
				isRoom
			});
			if (isDirectMessage) {
				if (!dmEnabled || dmPolicy === "disabled") {
					await commitInboundEventIfClaimed();
					return;
				}
				if (dmPolicy !== "open") {
					const allowMatchMeta = formatAllowlistMatchMeta(directAllowMatch);
					if (!directAllowMatch.allowed) {
						if (!isReactionEvent && dmPolicy === "pairing") {
							const senderName = await getSenderName();
							const { code, created } = await core.channel.pairing.upsertPairingRequest({
								channel: "matrix",
								id: senderId,
								accountId,
								meta: { name: senderName }
							});
							if (shouldSendPairingReply(senderId, created)) {
								const pairingReply = core.channel.pairing.buildPairingReply({
									channel: "matrix",
									idLine: `Your Matrix user id: ${senderId}`,
									code
								});
								logVerboseMessage(created ? `matrix pairing request sender=${senderId} name=${senderName ?? "unknown"} (${allowMatchMeta})` : `matrix pairing reminder sender=${senderId} name=${senderName ?? "unknown"} (${allowMatchMeta})`);
								try {
									await sendMessageMatrix(`room:${roomId}`, created ? pairingReply : `${pairingReply}\n\nPairing request is still pending approval. Reusing existing code.`, {
										client,
										cfg,
										accountId
									});
									await commitInboundEventIfClaimed();
								} catch (err) {
									logVerboseMessage(`matrix pairing reply failed for ${senderId}: ${String(err)}`);
									return;
								}
							} else {
								logVerboseMessage(`matrix pairing reminder suppressed sender=${senderId} (cooldown)`);
								await commitInboundEventIfClaimed();
							}
						}
						if (isReactionEvent || dmPolicy !== "pairing") {
							logVerboseMessage(`matrix: blocked ${isReactionEvent ? "reaction" : "dm"} sender ${senderId} (dmPolicy=${dmPolicy}, ${allowMatchMeta})`);
							await commitInboundEventIfClaimed();
						}
						return;
					}
				}
			}
			if (isRoom && roomUserMatch && !roomUserMatch.allowed) {
				logVerboseMessage(`matrix: blocked sender ${senderId} (room users allowlist, ${roomMatchMeta}, ${formatAllowlistMatchMeta(roomUserMatch)})`);
				await commitInboundEventIfClaimed();
				return;
			}
			if (isRoom && groupPolicy === "allowlist" && effectiveRoomUsers.length === 0 && groupAllowConfigured) {
				if (groupAllowMatch && !groupAllowMatch.allowed) {
					logVerboseMessage(`matrix: blocked sender ${senderId} (groupAllowFrom, ${roomMatchMeta}, ${formatAllowlistMatchMeta(groupAllowMatch)})`);
					await commitInboundEventIfClaimed();
					return;
				}
			}
			if (isRoom) logVerboseMessage(`matrix: allow room ${roomId} (${roomMatchMeta})`);
			if (isReactionEvent) {
				await handleInboundMatrixReaction({
					client,
					core,
					cfg,
					accountId,
					roomId,
					event,
					senderId,
					senderLabel: await getSenderName(),
					selfUserId,
					isDirectMessage,
					logVerboseMessage
				});
				await commitInboundEventIfClaimed();
				return;
			}
			const mentionPrecheckText = resolveMatrixMentionPrecheckText({
				eventType,
				content,
				locationText: locationPayload?.text
			});
			const contentUrl = "url" in content && typeof content.url === "string" ? content.url : void 0;
			const contentFile = "file" in content && content.file && typeof content.file === "object" ? content.file : void 0;
			const mediaUrl = contentUrl ?? contentFile?.url;
			if (!mentionPrecheckText && !mediaUrl && !isPollEvent) {
				await commitInboundEventIfClaimed();
				return;
			}
			const _messageId = event.event_id ?? "";
			const _threadRootId = resolveMatrixThreadRootId({
				event,
				content
			});
			const { route: _route, configuredBinding: _configuredBinding, runtimeBindingId: _runtimeBindingId } = resolveMatrixInboundRoute({
				cfg,
				accountId,
				roomId,
				senderId,
				isDirectMessage,
				messageId: _messageId,
				threadRootId: _threadRootId,
				eventTs: eventTs ?? void 0,
				resolveAgentRoute: core.channel.routing.resolveAgentRoute
			});
			const agentMentionRegexes = core.channel.mentions.buildMentionRegexes(cfg, _route.agentId);
			const selfDisplayName = content.formatted_body ? await getMemberDisplayName(roomId, selfUserId).catch(() => void 0) : void 0;
			const { wasMentioned, hasExplicitMention } = resolveMentions({
				content,
				userId: selfUserId,
				displayName: selfDisplayName,
				text: mentionPrecheckText,
				mentionRegexes: agentMentionRegexes
			});
			if (isConfiguredBotSender && allowBotsMode === "mentions" && !isDirectMessage && !wasMentioned) {
				logVerboseMessage(`matrix: drop configured bot sender=${senderId} (allowBots=mentions, missing mention, ${roomMatchMeta})`);
				await commitInboundEventIfClaimed();
				return;
			}
			const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
				cfg,
				surface: "matrix"
			});
			const useAccessGroups = cfg.commands?.useAccessGroups !== false;
			const hasControlCommandInMessage = core.channel.text.hasControlCommand(mentionPrecheckText, cfg);
			const commandGate = resolveControlCommandGate({
				useAccessGroups,
				authorizers: commandAuthorizers,
				allowTextCommands,
				hasControlCommand: hasControlCommandInMessage
			});
			const commandAuthorized = commandGate.commandAuthorized;
			if (isRoom && commandGate.shouldBlock) {
				logInboundDrop({
					log: logVerboseMessage,
					channel: "matrix",
					reason: "control command (unauthorized)",
					target: senderId
				});
				await commitInboundEventIfClaimed();
				return;
			}
			const shouldRequireMention = isRoom ? roomConfig?.autoReply === true ? false : roomConfig?.autoReply === false ? true : typeof roomConfig?.requireMention === "boolean" ? roomConfig?.requireMention : true : false;
			const shouldBypassMention = allowTextCommands && isRoom && shouldRequireMention && !wasMentioned && !hasExplicitMention && commandAuthorized && hasControlCommandInMessage;
			const canDetectMention = agentMentionRegexes.length > 0 || hasExplicitMention;
			if (isRoom && shouldRequireMention && !wasMentioned && !shouldBypassMention) {
				logger.info("skipping room message", {
					roomId,
					reason: "no-mention"
				});
				await commitInboundEventIfClaimed();
				return;
			}
			if (isPollEvent) {
				const pollSnapshot = await fetchMatrixPollSnapshot(client, roomId, event).catch((err) => {
					logVerboseMessage(`matrix: failed resolving poll snapshot room=${roomId} id=${event.event_id ?? "unknown"}: ${String(err)}`);
					return null;
				});
				if (!pollSnapshot) return;
				content = {
					msgtype: "m.text",
					body: pollSnapshot.text
				};
			}
			let media = null;
			let mediaDownloadFailed = false;
			const finalContentUrl = "url" in content && typeof content.url === "string" ? content.url : void 0;
			const finalContentFile = "file" in content && content.file && typeof content.file === "object" ? content.file : void 0;
			const finalMediaUrl = finalContentUrl ?? finalContentFile?.url;
			const contentBody = typeof content.body === "string" ? content.body.trim() : "";
			const originalFilename = (typeof content.filename === "string" ? content.filename.trim() : "") || contentBody || void 0;
			const contentInfo = "info" in content && content.info && typeof content.info === "object" ? content.info : void 0;
			const contentType = contentInfo?.mimetype;
			const contentSize = typeof contentInfo?.size === "number" ? contentInfo.size : void 0;
			if (finalMediaUrl?.startsWith("mxc://")) try {
				media = await downloadMatrixMedia({
					client,
					mxcUrl: finalMediaUrl,
					contentType,
					sizeBytes: contentSize,
					maxBytes: mediaMaxBytes,
					file: finalContentFile,
					originalFilename
				});
			} catch (err) {
				mediaDownloadFailed = true;
				const errorText = err instanceof Error ? err.message : String(err);
				logVerboseMessage(`matrix: media download failed room=${roomId} id=${event.event_id ?? "unknown"} type=${content.msgtype} error=${errorText}`);
				logger.warn("matrix media download failed", {
					roomId,
					eventId: event.event_id,
					msgtype: content.msgtype,
					encrypted: Boolean(finalContentFile),
					error: errorText
				});
			}
			const bodyText = resolveMatrixInboundBodyText({
				rawBody: locationPayload?.text ?? contentBody,
				filename: typeof content.filename === "string" ? content.filename : void 0,
				mediaPlaceholder: media?.placeholder,
				msgtype: content.msgtype,
				hadMediaUrl: Boolean(finalMediaUrl),
				mediaDownloadFailed
			});
			if (!bodyText) {
				await commitInboundEventIfClaimed();
				return;
			}
			const senderName = await getSenderName();
			const roomName = (isRoom ? await getRoomInfo(roomId) : void 0)?.name;
			const replyToEventId = content["m.relates_to"]?.["m.in_reply_to"]?.event_id;
			const threadTarget = resolveMatrixThreadTarget({
				threadReplies,
				messageId: _messageId,
				threadRootId: _threadRootId,
				isThreadRoot: false
			});
			const threadContext = _threadRootId ? await resolveThreadContext({
				roomId,
				threadRootId: _threadRootId
			}) : void 0;
			const replyContext = replyToEventId && replyToEventId === _threadRootId && threadContext?.summary ? {
				replyToBody: threadContext.summary,
				replyToSender: threadContext.senderLabel
			} : replyToEventId ? await resolveReplyContext({
				roomId,
				eventId: replyToEventId
			}) : void 0;
			if (_configuredBinding) {
				if (!(await ensureConfiguredAcpBindingReady({
					cfg,
					configuredBinding: _configuredBinding
				})).ok) {
					logInboundDrop({
						log: logVerboseMessage,
						channel: "matrix",
						reason: "configured ACP binding unavailable",
						target: _configuredBinding.spec.conversationId
					});
					return;
				}
			}
			if (_runtimeBindingId) getSessionBindingService().touch(_runtimeBindingId, eventTs ?? void 0);
			const envelopeFrom = isDirectMessage ? senderName : roomName ?? roomId;
			const textWithId = `${bodyText}\n[matrix event id: ${_messageId} room: ${roomId}]`;
			const storePath = core.channel.session.resolveStorePath(cfg.session?.store, { agentId: _route.agentId });
			const envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(cfg);
			const previousTimestamp = core.channel.session.readSessionUpdatedAt({
				storePath,
				sessionKey: _route.sessionKey
			});
			const body = core.channel.reply.formatAgentEnvelope({
				channel: "Matrix",
				from: envelopeFrom,
				timestamp: eventTs ?? void 0,
				previousTimestamp,
				envelope: envelopeOptions,
				body: textWithId
			});
			const groupSystemPrompt = roomConfig?.systemPrompt?.trim() || void 0;
			const ctxPayload = core.channel.reply.finalizeInboundContext({
				Body: body,
				RawBody: bodyText,
				CommandBody: bodyText,
				From: isDirectMessage ? `matrix:${senderId}` : `matrix:channel:${roomId}`,
				To: `room:${roomId}`,
				SessionKey: _route.sessionKey,
				AccountId: _route.accountId,
				ChatType: isDirectMessage ? "direct" : "channel",
				ConversationLabel: envelopeFrom,
				SenderName: senderName,
				SenderId: senderId,
				SenderUsername: senderId.split(":")[0]?.replace(/^@/, ""),
				GroupSubject: isRoom ? roomName ?? roomId : void 0,
				GroupId: isRoom ? roomId : void 0,
				GroupSystemPrompt: isRoom ? groupSystemPrompt : void 0,
				Provider: "matrix",
				Surface: "matrix",
				WasMentioned: isRoom ? wasMentioned : void 0,
				MessageSid: _messageId,
				ReplyToId: threadTarget ? void 0 : replyToEventId ?? void 0,
				ReplyToBody: replyContext?.replyToBody,
				ReplyToSender: replyContext?.replyToSender,
				MessageThreadId: threadTarget,
				ThreadStarterBody: threadContext?.threadStarterBody,
				Timestamp: eventTs ?? void 0,
				MediaPath: media?.path,
				MediaType: media?.contentType,
				MediaUrl: media?.path,
				...locationPayload?.context,
				CommandAuthorized: commandAuthorized,
				CommandSource: "text",
				OriginatingChannel: "matrix",
				OriginatingTo: `room:${roomId}`
			});
			await core.channel.session.recordInboundSession({
				storePath,
				sessionKey: ctxPayload.SessionKey ?? _route.sessionKey,
				ctx: ctxPayload,
				updateLastRoute: isDirectMessage ? {
					sessionKey: _route.mainSessionKey,
					channel: "matrix",
					to: `room:${roomId}`,
					accountId: _route.accountId
				} : void 0,
				onRecordError: (err) => {
					logger.warn("failed updating session meta", {
						error: String(err),
						storePath,
						sessionKey: ctxPayload.SessionKey ?? _route.sessionKey
					});
				}
			});
			logVerboseMessage(`matrix inbound: room=${roomId} from=${senderId} preview="${bodyText.slice(0, 200).replace(/\n/g, "\\n")}"`);
			const { ackReaction, ackReactionScope: ackScope } = resolveMatrixAckReactionConfig({
				cfg,
				agentId: _route.agentId,
				accountId
			});
			const shouldAckReaction = () => Boolean(ackReaction && core.channel.reactions.shouldAckReaction({
				scope: ackScope,
				isDirect: isDirectMessage,
				isGroup: isRoom,
				isMentionableGroup: isRoom,
				requireMention: Boolean(shouldRequireMention),
				canDetectMention,
				effectiveWasMentioned: wasMentioned || shouldBypassMention,
				shouldBypassMention
			}));
			if (shouldAckReaction() && _messageId) reactMatrixMessage(roomId, _messageId, ackReaction, client).catch((err) => {
				logVerboseMessage(`matrix react failed for room ${roomId}: ${String(err)}`);
			});
			const replyTarget = ctxPayload.To;
			if (!replyTarget) {
				runtime.error?.("matrix: missing reply target");
				return;
			}
			if (_messageId) sendReadReceiptMatrix(roomId, _messageId, client).catch((err) => {
				logVerboseMessage(`matrix: read receipt failed room=${roomId} id=${_messageId}: ${String(err)}`);
			});
			const tableMode = core.channel.text.resolveMarkdownTableMode({
				cfg,
				channel: "matrix",
				accountId: _route.accountId
			});
			const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, _route.agentId);
			let finalReplyDeliveryFailed = false;
			let nonFinalReplyDeliveryFailed = false;
			const { onModelSelected, ...prefixOptions } = createReplyPrefixOptions({
				cfg,
				agentId: _route.agentId,
				channel: "matrix",
				accountId: _route.accountId
			});
			const typingCallbacks = createTypingCallbacks({
				start: () => sendTypingMatrix(roomId, true, void 0, client),
				stop: () => sendTypingMatrix(roomId, false, void 0, client),
				onStartError: (err) => {
					logTypingFailure({
						log: logVerboseMessage,
						channel: "matrix",
						action: "start",
						target: roomId,
						error: err
					});
				},
				onStopError: (err) => {
					logTypingFailure({
						log: logVerboseMessage,
						channel: "matrix",
						action: "stop",
						target: roomId,
						error: err
					});
				}
			});
			const { dispatcher, replyOptions, markDispatchIdle, markRunComplete } = core.channel.reply.createReplyDispatcherWithTyping({
				...prefixOptions,
				humanDelay: core.channel.reply.resolveHumanDelayConfig(cfg, _route.agentId),
				deliver: async (payload) => {
					await deliverMatrixReplies({
						cfg,
						replies: [payload],
						roomId,
						client,
						runtime,
						textLimit,
						replyToMode,
						threadId: threadTarget,
						accountId: _route.accountId,
						mediaLocalRoots,
						tableMode
					});
				},
				onError: (err, info) => {
					if (info.kind === "final") finalReplyDeliveryFailed = true;
					else nonFinalReplyDeliveryFailed = true;
					runtime.error?.(`matrix ${info.kind} reply failed: ${String(err)}`);
				},
				onReplyStart: typingCallbacks.onReplyStart,
				onIdle: typingCallbacks.onIdle
			});
			const { queuedFinal, counts } = await core.channel.reply.withReplyDispatcher({
				dispatcher,
				onSettled: () => {
					markDispatchIdle();
				},
				run: async () => {
					try {
						return await core.channel.reply.dispatchReplyFromConfig({
							ctx: ctxPayload,
							cfg,
							dispatcher,
							replyOptions: {
								...replyOptions,
								skillFilter: roomConfig?.skills,
								onModelSelected
							}
						});
					} finally {
						markRunComplete();
					}
				}
			});
			if (finalReplyDeliveryFailed) {
				logVerboseMessage(`matrix: final reply delivery failed room=${roomId} id=${_messageId}; leaving event uncommitted`);
				return;
			}
			if (!queuedFinal && nonFinalReplyDeliveryFailed) {
				logVerboseMessage(`matrix: non-final reply delivery failed room=${roomId} id=${_messageId}; leaving event uncommitted`);
				return;
			}
			if (!queuedFinal) {
				await commitInboundEventIfClaimed();
				return;
			}
			const finalCount = counts.final;
			logVerboseMessage(`matrix: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${replyTarget}`);
			await commitInboundEventIfClaimed();
		} catch (err) {
			runtime.error?.(`matrix handler failed: ${String(err)}`);
		} finally {
			if (claimedInboundEvent && inboundDeduper && eventId) inboundDeduper.releaseEvent({
				roomId,
				eventId
			});
		}
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/inbound-dedupe.ts
const INBOUND_DEDUPE_FILENAME = "inbound-dedupe.json";
const STORE_VERSION = 1;
const DEFAULT_MAX_ENTRIES = 2e4;
const DEFAULT_TTL_MS = 720 * 60 * 60 * 1e3;
const PERSIST_DEBOUNCE_MS = 250;
function normalizeEventPart(value) {
	return value.trim();
}
function buildEventKey(params) {
	const roomId = normalizeEventPart(params.roomId);
	const eventId = normalizeEventPart(params.eventId);
	return roomId && eventId ? `${roomId}|${eventId}` : "";
}
function resolveInboundDedupeStatePath(params) {
	return resolveMatrixStateFilePath({
		auth: params.auth,
		env: params.env,
		stateDir: params.stateDir,
		filename: INBOUND_DEDUPE_FILENAME
	});
}
function normalizeTimestamp(raw) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
	return Math.max(0, Math.floor(raw));
}
function pruneSeenEvents(params) {
	const { seen, ttlMs, maxEntries, nowMs } = params;
	if (ttlMs > 0) {
		const cutoff = nowMs - ttlMs;
		for (const [key, ts] of seen) if (ts < cutoff) seen.delete(key);
	}
	const max = Math.max(0, Math.floor(maxEntries));
	if (max <= 0) {
		seen.clear();
		return;
	}
	while (seen.size > max) {
		const oldestKey = seen.keys().next().value;
		if (typeof oldestKey !== "string") break;
		seen.delete(oldestKey);
	}
}
function toStoredState(params) {
	pruneSeenEvents(params);
	return {
		version: STORE_VERSION,
		entries: Array.from(params.seen.entries()).map(([key, ts]) => ({
			key,
			ts
		}))
	};
}
async function readStoredState(storagePath) {
	const { value } = await readJsonFileWithFallback(storagePath, null);
	if (value?.version !== STORE_VERSION || !Array.isArray(value.entries)) return null;
	return value;
}
async function createMatrixInboundEventDeduper(params) {
	const nowMs = params.nowMs ?? (() => Date.now());
	const ttlMs = typeof params.ttlMs === "number" && Number.isFinite(params.ttlMs) ? Math.max(0, Math.floor(params.ttlMs)) : DEFAULT_TTL_MS;
	const maxEntries = typeof params.maxEntries === "number" && Number.isFinite(params.maxEntries) ? Math.max(0, Math.floor(params.maxEntries)) : DEFAULT_MAX_ENTRIES;
	const storagePath = params.storagePath ?? resolveInboundDedupeStatePath({
		auth: params.auth,
		env: params.env,
		stateDir: params.stateDir
	});
	const seen = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Set();
	const persistLock = createAsyncLock();
	try {
		const stored = await readStoredState(storagePath);
		for (const entry of stored?.entries ?? []) {
			if (!entry || typeof entry.key !== "string") continue;
			const key = entry.key.trim();
			const ts = normalizeTimestamp(entry.ts);
			if (!key || ts === null) continue;
			seen.set(key, ts);
		}
		pruneSeenEvents({
			seen,
			ttlMs,
			maxEntries,
			nowMs: nowMs()
		});
	} catch (err) {
		LogService.warn("MatrixInboundDedupe", "Failed loading Matrix inbound dedupe store:", err);
	}
	let dirty = false;
	let persistTimer = null;
	let persistPromise = null;
	const persist = async () => {
		dirty = false;
		const payload = toStoredState({
			seen,
			ttlMs,
			maxEntries,
			nowMs: nowMs()
		});
		try {
			await persistLock(async () => {
				await writeJsonFileAtomically(storagePath, payload);
			});
		} catch (err) {
			dirty = true;
			throw err;
		}
	};
	const flush = async () => {
		if (persistTimer) {
			clearTimeout(persistTimer);
			persistTimer = null;
		}
		while (dirty || persistPromise) {
			if (dirty && !persistPromise) persistPromise = persist().finally(() => {
				persistPromise = null;
			});
			await persistPromise;
		}
	};
	const schedulePersist = () => {
		dirty = true;
		if (persistTimer) return;
		persistTimer = setTimeout(() => {
			persistTimer = null;
			flush().catch((err) => {
				LogService.warn("MatrixInboundDedupe", "Failed persisting Matrix inbound dedupe store:", err);
			});
		}, PERSIST_DEBOUNCE_MS);
		persistTimer.unref?.();
	};
	return {
		claimEvent: ({ roomId, eventId }) => {
			const key = buildEventKey({
				roomId,
				eventId
			});
			if (!key) return true;
			pruneSeenEvents({
				seen,
				ttlMs,
				maxEntries,
				nowMs: nowMs()
			});
			if (seen.has(key) || pending.has(key)) return false;
			pending.add(key);
			return true;
		},
		commitEvent: async ({ roomId, eventId }) => {
			const key = buildEventKey({
				roomId,
				eventId
			});
			if (!key) return;
			pending.delete(key);
			const ts = nowMs();
			seen.delete(key);
			seen.set(key, ts);
			pruneSeenEvents({
				seen,
				ttlMs,
				maxEntries,
				nowMs: nowMs()
			});
			schedulePersist();
		},
		releaseEvent: ({ roomId, eventId }) => {
			const key = buildEventKey({
				roomId,
				eventId
			});
			if (!key) return;
			pending.delete(key);
		},
		flush,
		stop: async () => {
			try {
				await flush();
			} catch (err) {
				LogService.warn("MatrixInboundDedupe", "Failed to flush Matrix inbound dedupe store during stop():", err);
			}
		}
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/room-info.ts
const MAX_TRACKED_ROOM_INFO = 1024;
const MAX_TRACKED_MEMBER_DISPLAY_NAMES = 4096;
function rememberBounded(map, key, value, maxEntries) {
	map.set(key, value);
	if (map.size > maxEntries) {
		const oldest = map.keys().next().value;
		if (typeof oldest === "string") map.delete(oldest);
	}
}
function createMatrixRoomInfoResolver(client) {
	const roomNameCache = /* @__PURE__ */ new Map();
	const roomAliasCache = /* @__PURE__ */ new Map();
	const memberDisplayNameCache = /* @__PURE__ */ new Map();
	const getRoomName = async (roomId) => {
		if (roomNameCache.has(roomId)) return roomNameCache.get(roomId);
		let name;
		try {
			const nameState = await client.getRoomStateEvent(roomId, "m.room.name", "").catch(() => null);
			if (nameState && typeof nameState.name === "string") name = nameState.name;
		} catch {}
		rememberBounded(roomNameCache, roomId, name, MAX_TRACKED_ROOM_INFO);
		return name;
	};
	const getRoomAliases = async (roomId) => {
		const cached = roomAliasCache.get(roomId);
		if (cached) return cached;
		let canonicalAlias;
		let altAliases = [];
		try {
			const aliasState = await client.getRoomStateEvent(roomId, "m.room.canonical_alias", "").catch(() => null);
			if (aliasState && typeof aliasState.alias === "string") canonicalAlias = aliasState.alias;
			const rawAliases = aliasState?.alt_aliases;
			if (Array.isArray(rawAliases)) altAliases = rawAliases.filter((entry) => typeof entry === "string");
		} catch {}
		const info = {
			canonicalAlias,
			altAliases
		};
		rememberBounded(roomAliasCache, roomId, info, MAX_TRACKED_ROOM_INFO);
		return info;
	};
	const getRoomInfo = async (roomId, opts = {}) => {
		const name = await getRoomName(roomId);
		if (!opts.includeAliases) return {
			name,
			altAliases: []
		};
		return {
			name,
			...await getRoomAliases(roomId)
		};
	};
	const getMemberDisplayName = async (roomId, userId) => {
		const cacheKey = `${roomId}:${userId}`;
		if (memberDisplayNameCache.has(cacheKey)) return memberDisplayNameCache.get(cacheKey) ?? userId;
		const memberState = await client.getRoomStateEvent(roomId, "m.room.member", userId).catch(() => null);
		const displayName = memberState && typeof memberState.displayname === "string" ? memberState.displayname : userId;
		rememberBounded(memberDisplayNameCache, cacheKey, displayName, MAX_TRACKED_MEMBER_DISPLAY_NAMES);
		return displayName;
	};
	return {
		getRoomInfo,
		getMemberDisplayName
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/legacy-crypto-restore.ts
function isMigrationState(value) {
	return Boolean(value) && typeof value === "object" && value.version === 1;
}
async function resolvePendingMigrationStatePath(params) {
	const { rootDir } = resolveMatrixStoragePaths({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		accountId: params.auth.accountId,
		deviceId: params.auth.deviceId,
		stateDir: params.stateDir
	});
	const directStatePath = path.join(rootDir, "legacy-crypto-migration.json");
	const { value: directValue } = await readJsonFileWithFallback(directStatePath, null);
	if (isMigrationState(directValue) && directValue.restoreStatus === "pending") return {
		statePath: directStatePath,
		value: directValue
	};
	const accountStorageDir = path.dirname(rootDir);
	let siblingEntries = [];
	try {
		siblingEntries = (await fs.readdir(accountStorageDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).filter((entry) => path.join(accountStorageDir, entry) !== rootDir).toSorted((left, right) => left.localeCompare(right));
	} catch {
		return {
			statePath: directStatePath,
			value: directValue
		};
	}
	for (const sibling of siblingEntries) {
		const siblingStatePath = path.join(accountStorageDir, sibling, "legacy-crypto-migration.json");
		const { value } = await readJsonFileWithFallback(siblingStatePath, null);
		if (isMigrationState(value) && value.restoreStatus === "pending") return {
			statePath: siblingStatePath,
			value
		};
	}
	return {
		statePath: directStatePath,
		value: directValue
	};
}
async function maybeRestoreLegacyMatrixBackup(params) {
	const env = params.env ?? process.env;
	const { statePath, value } = await resolvePendingMigrationStatePath({
		stateDir: params.stateDir ?? getMatrixRuntime().state.resolveStateDir(env, os.homedir),
		auth: params.auth
	});
	if (!isMigrationState(value) || value.restoreStatus !== "pending") return { kind: "skipped" };
	const restore = await params.client.restoreRoomKeyBackup();
	const localOnlyKeys = value.roomKeyCounts && value.roomKeyCounts.total > value.roomKeyCounts.backedUp ? value.roomKeyCounts.total - value.roomKeyCounts.backedUp : 0;
	if (restore.success) {
		await writeJsonFileAtomically(statePath, {
			...value,
			restoreStatus: "completed",
			restoredAt: restore.restoredAt ?? (/* @__PURE__ */ new Date()).toISOString(),
			importedCount: restore.imported,
			totalCount: restore.total,
			lastError: null
		});
		return {
			kind: "restored",
			imported: restore.imported,
			total: restore.total,
			localOnlyKeys
		};
	}
	await writeJsonFileAtomically(statePath, {
		...value,
		lastError: restore.error ?? "unknown"
	});
	return {
		kind: "failed",
		error: restore.error ?? "unknown",
		localOnlyKeys
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/startup-verification.ts
const STARTUP_VERIFICATION_STATE_FILENAME = "startup-verification.json";
const DEFAULT_STARTUP_VERIFICATION_MODE = "if-unverified";
const DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS = 24;
const DEFAULT_STARTUP_VERIFICATION_FAILURE_COOLDOWN_MS = 3600 * 1e3;
function normalizeCooldownHours(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS;
	return Math.max(0, value);
}
function resolveStartupVerificationStatePath(params) {
	const storagePaths = resolveMatrixStoragePaths({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		accountId: params.auth.accountId,
		deviceId: params.auth.deviceId,
		env: params.env
	});
	return path.join(storagePaths.rootDir, STARTUP_VERIFICATION_STATE_FILENAME);
}
async function readStartupVerificationState(filePath) {
	const { value } = await readJsonFileWithFallback(filePath, null);
	return value && typeof value === "object" ? value : null;
}
async function clearStartupVerificationState(filePath) {
	await fs.rm(filePath, { force: true }).catch(() => {});
}
function resolveStateCooldownMs(state, cooldownMs) {
	if (state?.outcome === "failed") return Math.min(cooldownMs, DEFAULT_STARTUP_VERIFICATION_FAILURE_COOLDOWN_MS);
	return cooldownMs;
}
function resolveRetryAfterMs(params) {
	const attemptedAtMs = Date.parse(params.attemptedAt ?? "");
	if (!Number.isFinite(attemptedAtMs)) return;
	const remaining = attemptedAtMs + params.cooldownMs - params.nowMs;
	return remaining > 0 ? remaining : void 0;
}
function shouldHonorCooldown(params) {
	if (!params.state || params.stateCooldownMs <= 0) return false;
	if (params.state.userId && params.verification.userId && params.state.userId !== params.verification.userId) return false;
	if (params.state.deviceId && params.verification.deviceId && params.state.deviceId !== params.verification.deviceId) return false;
	return resolveRetryAfterMs({
		attemptedAt: params.state.attemptedAt,
		cooldownMs: params.stateCooldownMs,
		nowMs: params.nowMs
	}) !== void 0;
}
function hasPendingSelfVerification(verifications) {
	return verifications.some((entry) => entry.isSelfVerification === true && entry.completed !== true && entry.pending !== false);
}
async function ensureMatrixStartupVerification(params) {
	if (params.auth.encryption !== true || !params.client.crypto) return { kind: "unsupported" };
	const verification = await params.client.getOwnDeviceVerificationStatus();
	const statePath = params.stateFilePath ?? resolveStartupVerificationStatePath({
		auth: params.auth,
		env: params.env
	});
	if (verification.verified) {
		await clearStartupVerificationState(statePath);
		return {
			kind: "verified",
			verification
		};
	}
	if ((params.accountConfig.startupVerification ?? DEFAULT_STARTUP_VERIFICATION_MODE) === "off") {
		await clearStartupVerificationState(statePath);
		return {
			kind: "disabled",
			verification
		};
	}
	if (hasPendingSelfVerification(await params.client.crypto.listVerifications().catch(() => []))) return {
		kind: "pending",
		verification
	};
	const cooldownMs = normalizeCooldownHours(params.accountConfig.startupVerificationCooldownHours) * 60 * 60 * 1e3;
	const nowMs = params.nowMs ?? Date.now();
	const state = await readStartupVerificationState(statePath);
	const stateCooldownMs = resolveStateCooldownMs(state, cooldownMs);
	if (shouldHonorCooldown({
		state,
		verification,
		stateCooldownMs,
		nowMs
	})) return {
		kind: "cooldown",
		verification,
		retryAfterMs: resolveRetryAfterMs({
			attemptedAt: state?.attemptedAt,
			cooldownMs: stateCooldownMs,
			nowMs
		})
	};
	try {
		const request = await params.client.crypto.requestVerification({ ownUser: true });
		await writeJsonFileAtomically(statePath, {
			userId: verification.userId,
			deviceId: verification.deviceId,
			attemptedAt: new Date(nowMs).toISOString(),
			outcome: "requested",
			requestId: request.id,
			transactionId: request.transactionId
		});
		return {
			kind: "requested",
			verification,
			requestId: request.id,
			transactionId: request.transactionId ?? void 0
		};
	} catch (err) {
		const error = err instanceof Error ? err.message : String(err);
		await writeJsonFileAtomically(statePath, {
			userId: verification.userId,
			deviceId: verification.deviceId,
			attemptedAt: new Date(nowMs).toISOString(),
			outcome: "failed",
			error
		}).catch(() => {});
		return {
			kind: "request-failed",
			verification,
			error
		};
	}
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/startup.ts
async function runMatrixStartupMaintenance(params) {
	try {
		const profileSync = await syncMatrixOwnProfile({
			client: params.client,
			userId: params.auth.userId,
			displayName: params.accountConfig.name,
			avatarUrl: params.accountConfig.avatarUrl,
			loadAvatarFromUrl: async (url, maxBytes) => await params.loadWebMedia(url, maxBytes)
		});
		if (profileSync.displayNameUpdated) params.logger.info(`matrix: profile display name updated for ${params.auth.userId}`);
		if (profileSync.avatarUpdated) params.logger.info(`matrix: profile avatar updated for ${params.auth.userId}`);
		if (profileSync.convertedAvatarFromHttp && profileSync.resolvedAvatarUrl && params.accountConfig.avatarUrl !== profileSync.resolvedAvatarUrl) {
			const updatedCfg = updateMatrixAccountConfig(params.loadConfig(), params.accountId, { avatarUrl: profileSync.resolvedAvatarUrl });
			await params.writeConfigFile(updatedCfg);
			params.logVerboseMessage(`matrix: persisted converted avatar URL for account ${params.accountId} (${profileSync.resolvedAvatarUrl})`);
		}
	} catch (err) {
		params.logger.warn("matrix: failed to sync profile from config", { error: String(err) });
	}
	if (!(params.auth.encryption && params.client.crypto)) return;
	try {
		const deviceHealth = summarizeMatrixDeviceHealth(await params.client.listOwnDevices());
		if (deviceHealth.staleOpenClawDevices.length > 0) params.logger.warn(`matrix: stale OpenClaw devices detected for ${params.auth.userId}: ${deviceHealth.staleOpenClawDevices.map((device) => device.deviceId).join(", ")}. Run 'openclaw matrix devices prune-stale --account ${params.effectiveAccountId}' to keep encrypted-room trust healthy.`);
	} catch (err) {
		params.logger.debug?.("Failed to inspect matrix device hygiene (non-fatal)", { error: String(err) });
	}
	try {
		const startupVerification = await ensureMatrixStartupVerification({
			client: params.client,
			auth: params.auth,
			accountConfig: params.accountConfig,
			env: params.env
		});
		if (startupVerification.kind === "verified") params.logger.info("matrix: device is verified by its owner and ready for encrypted rooms");
		else if (startupVerification.kind === "disabled" || startupVerification.kind === "cooldown" || startupVerification.kind === "pending" || startupVerification.kind === "request-failed") {
			params.logger.info("matrix: device not verified — run 'openclaw matrix verify device <key>' to enable E2EE");
			if (startupVerification.kind === "pending") params.logger.info("matrix: startup verification request is already pending; finish it in another Matrix client");
			else if (startupVerification.kind === "cooldown") params.logVerboseMessage(`matrix: skipped startup verification request due to cooldown (retryAfterMs=${startupVerification.retryAfterMs ?? 0})`);
			else if (startupVerification.kind === "request-failed") params.logger.debug?.("Matrix startup verification request failed (non-fatal)", { error: startupVerification.error ?? "unknown" });
		} else if (startupVerification.kind === "requested") params.logger.info("matrix: device not verified — requested verification in another Matrix client");
	} catch (err) {
		params.logger.debug?.("Failed to resolve matrix verification status (non-fatal)", { error: String(err) });
	}
	try {
		const legacyCryptoRestore = await maybeRestoreLegacyMatrixBackup({
			client: params.client,
			auth: params.auth,
			env: params.env
		});
		if (legacyCryptoRestore.kind === "restored") {
			params.logger.info(`matrix: restored ${legacyCryptoRestore.imported}/${legacyCryptoRestore.total} room key(s) from legacy encrypted-state backup`);
			if (legacyCryptoRestore.localOnlyKeys > 0) params.logger.warn(`matrix: ${legacyCryptoRestore.localOnlyKeys} legacy local-only room key(s) were never backed up and could not be restored automatically`);
		} else if (legacyCryptoRestore.kind === "failed") {
			params.logger.warn(`matrix: failed restoring room keys from legacy encrypted-state backup: ${legacyCryptoRestore.error}`);
			if (legacyCryptoRestore.localOnlyKeys > 0) params.logger.warn(`matrix: ${legacyCryptoRestore.localOnlyKeys} legacy local-only room key(s) were never backed up and may remain unavailable until manually recovered`);
		}
	} catch (err) {
		params.logger.warn("matrix: failed restoring legacy encrypted-state backup", { error: String(err) });
	}
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/index.ts
const DEFAULT_MEDIA_MAX_MB = 20;
async function monitorMatrixProvider(opts = {}) {
	if (isBunRuntime()) throw new Error("Matrix provider requires Node (bun runtime not supported)");
	const core = getMatrixRuntime();
	let cfg = core.config.loadConfig();
	if (cfg.channels?.["matrix"]?.enabled === false) return;
	const logger = core.logging.getChildLogger({ module: "matrix-auto-reply" });
	const formatRuntimeMessage = (...args) => format(...args);
	const runtime = opts.runtime ?? {
		log: (...args) => {
			logger.info(formatRuntimeMessage(...args));
		},
		error: (...args) => {
			logger.error(formatRuntimeMessage(...args));
		},
		exit: (code) => {
			throw new Error(`exit ${code}`);
		}
	};
	const logVerboseMessage = (message) => {
		if (!core.logging.shouldLogVerbose()) return;
		logger.debug?.(message);
	};
	const effectiveAccountId = resolveMatrixAuthContext({
		cfg,
		accountId: opts.accountId
	}).accountId;
	const account = resolveMatrixAccount({
		cfg,
		accountId: effectiveAccountId
	});
	const accountConfig = account.config;
	const allowlistOnly = accountConfig.allowlistOnly === true;
	const accountAllowBots = accountConfig.allowBots;
	let allowFrom = (accountConfig.dm?.allowFrom ?? []).map(String);
	let groupAllowFrom = (accountConfig.groupAllowFrom ?? []).map(String);
	let roomsConfig = accountConfig.groups ?? accountConfig.rooms;
	let needsRoomAliasesForConfig = false;
	const configuredBotUserIds = resolveConfiguredMatrixBotUserIds({
		cfg,
		accountId: effectiveAccountId
	});
	({allowFrom, groupAllowFrom, roomsConfig} = await resolveMatrixMonitorConfig({
		cfg,
		accountId: effectiveAccountId,
		allowFrom,
		groupAllowFrom,
		roomsConfig,
		runtime
	}));
	needsRoomAliasesForConfig = Boolean(roomsConfig && Object.keys(roomsConfig).some((key) => key.trim().startsWith("#")));
	cfg = {
		...cfg,
		channels: {
			...cfg.channels,
			matrix: {
				...cfg.channels?.["matrix"],
				dm: {
					...cfg.channels?.["matrix"]?.dm,
					allowFrom
				},
				groupAllowFrom,
				...roomsConfig ? { groups: roomsConfig } : {}
			}
		}
	};
	const auth = await resolveMatrixAuth({
		cfg,
		accountId: effectiveAccountId
	});
	const resolvedInitialSyncLimit = typeof opts.initialSyncLimit === "number" ? Math.max(0, Math.floor(opts.initialSyncLimit)) : auth.initialSyncLimit;
	const authWithLimit = resolvedInitialSyncLimit === auth.initialSyncLimit ? auth : {
		...auth,
		initialSyncLimit: resolvedInitialSyncLimit
	};
	const client = await resolveSharedMatrixClient({
		cfg,
		auth: authWithLimit,
		startClient: false,
		accountId: auth.accountId
	});
	setActiveMatrixClient(client, auth.accountId);
	let cleanedUp = false;
	let threadBindingManager = null;
	const inboundDeduper = await createMatrixInboundEventDeduper({
		auth,
		env: process.env
	});
	const inFlightRoomMessages = /* @__PURE__ */ new Set();
	const waitForInFlightRoomMessages = async () => {
		while (inFlightRoomMessages.size > 0) await Promise.allSettled(Array.from(inFlightRoomMessages));
	};
	const cleanup = async () => {
		if (cleanedUp) return;
		cleanedUp = true;
		try {
			client.stopSyncWithoutPersist();
			await client.drainPendingDecryptions("matrix monitor shutdown");
			await waitForInFlightRoomMessages();
			threadBindingManager?.stop();
			await inboundDeduper.stop();
			await releaseSharedClientInstance(client, "persist");
		} finally {
			setActiveMatrixClient(null, auth.accountId);
		}
	};
	const mentionRegexes = core.channel.mentions.buildMentionRegexes(cfg);
	const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
	const { groupPolicy: groupPolicyRaw, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.["matrix"] !== void 0,
		groupPolicy: accountConfig.groupPolicy,
		defaultGroupPolicy
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "matrix",
		accountId: account.accountId,
		blockedLabel: GROUP_POLICY_BLOCKED_LABEL.room,
		log: (message) => logVerboseMessage(message)
	});
	const groupPolicy = allowlistOnly && groupPolicyRaw === "open" ? "allowlist" : groupPolicyRaw;
	const replyToMode = opts.replyToMode ?? accountConfig.replyToMode ?? "off";
	const threadReplies = accountConfig.threadReplies ?? "inbound";
	const threadBindingIdleTimeoutMs = resolveThreadBindingIdleTimeoutMsForChannel({
		cfg,
		channel: "matrix",
		accountId: account.accountId
	});
	const threadBindingMaxAgeMs = resolveThreadBindingMaxAgeMsForChannel({
		cfg,
		channel: "matrix",
		accountId: account.accountId
	});
	const dmConfig = accountConfig.dm;
	const dmEnabled = dmConfig?.enabled ?? true;
	const dmPolicyRaw = dmConfig?.policy ?? "pairing";
	const dmPolicy = allowlistOnly && dmPolicyRaw !== "disabled" ? "allowlist" : dmPolicyRaw;
	const textLimit = core.channel.text.resolveTextChunkLimit(cfg, "matrix", account.accountId);
	const mediaMaxMb = opts.mediaMaxMb ?? accountConfig.mediaMaxMb ?? DEFAULT_MEDIA_MAX_MB;
	const mediaMaxBytes = Math.max(1, mediaMaxMb) * 1024 * 1024;
	const startupMs = Date.now();
	const startupGraceMs = 0;
	const dropPreStartupMessages = !client.hasPersistedSyncState();
	const directTracker = createDirectRoomTracker(client, { log: logVerboseMessage });
	registerMatrixAutoJoin({
		client,
		accountConfig,
		runtime
	});
	const warnedEncryptedRooms = /* @__PURE__ */ new Set();
	const warnedCryptoMissingRooms = /* @__PURE__ */ new Set();
	const { getRoomInfo, getMemberDisplayName } = createMatrixRoomInfoResolver(client);
	const handleRoomMessage = createMatrixRoomMessageHandler({
		client,
		core,
		cfg,
		accountId: account.accountId,
		runtime,
		logger,
		logVerboseMessage,
		allowFrom,
		groupAllowFrom,
		roomsConfig,
		accountAllowBots,
		configuredBotUserIds,
		mentionRegexes,
		groupPolicy,
		replyToMode,
		threadReplies,
		dmEnabled,
		dmPolicy,
		textLimit,
		mediaMaxBytes,
		startupMs,
		startupGraceMs,
		dropPreStartupMessages,
		inboundDeduper,
		directTracker,
		getRoomInfo,
		getMemberDisplayName,
		needsRoomAliasesForConfig
	});
	const trackRoomMessage = (roomId, event) => {
		const task = Promise.resolve(handleRoomMessage(roomId, event)).finally(() => {
			inFlightRoomMessages.delete(task);
		});
		inFlightRoomMessages.add(task);
		return task;
	};
	try {
		threadBindingManager = await createMatrixThreadBindingManager({
			accountId: account.accountId,
			auth,
			client,
			env: process.env,
			idleTimeoutMs: threadBindingIdleTimeoutMs,
			maxAgeMs: threadBindingMaxAgeMs,
			logVerboseMessage
		});
		logVerboseMessage(`matrix: thread bindings ready account=${threadBindingManager.accountId} idleMs=${threadBindingIdleTimeoutMs} maxAgeMs=${threadBindingMaxAgeMs}`);
		registerMatrixMonitorEvents({
			cfg,
			client,
			auth,
			allowFrom,
			dmEnabled,
			dmPolicy,
			readStoreAllowFrom: async () => await core.channel.pairing.readAllowFromStore({
				channel: "matrix",
				env: process.env,
				accountId: account.accountId
			}).catch(() => []),
			directTracker,
			logVerboseMessage,
			warnedEncryptedRooms,
			warnedCryptoMissingRooms,
			logger,
			formatNativeDependencyHint: core.system.formatNativeDependencyHint,
			onRoomMessage: trackRoomMessage
		});
		logVerboseMessage("matrix: starting client");
		await resolveSharedMatrixClient({
			cfg,
			auth: authWithLimit,
			accountId: auth.accountId
		});
		logVerboseMessage("matrix: client started");
		logger.info(`matrix: logged in as ${auth.userId}`);
		await runMatrixStartupMaintenance({
			client,
			auth,
			accountId: account.accountId,
			effectiveAccountId,
			accountConfig,
			logger,
			logVerboseMessage,
			loadConfig: () => core.config.loadConfig(),
			writeConfigFile: async (nextCfg) => await core.config.writeConfigFile(nextCfg),
			loadWebMedia: async (url, maxBytes) => await core.media.loadWebMedia(url, maxBytes),
			env: process.env
		});
		await new Promise((resolve) => {
			const stopAndResolve = async () => {
				try {
					logVerboseMessage("matrix: stopping client");
					await cleanup();
				} catch (err) {
					logger.warn("matrix: failed during monitor shutdown cleanup", { error: String(err) });
				} finally {
					resolve();
				}
			};
			if (opts.abortSignal?.aborted) {
				stopAndResolve();
				return;
			}
			opts.abortSignal?.addEventListener("abort", () => {
				stopAndResolve();
			}, { once: true });
		});
	} catch (err) {
		await cleanup();
		throw err;
	}
}
//#endregion
export { monitorMatrixProvider };
