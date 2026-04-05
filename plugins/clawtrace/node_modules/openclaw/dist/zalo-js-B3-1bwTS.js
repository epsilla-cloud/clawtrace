import { Pt as loadOutboundMediaFromUrl } from "./auth-profiles-B5ypC5S-.js";
import { _ as resolveStateDir$1 } from "./paths-Y4UT24Of.js";
import "./state-paths-Ci8MrEkT.js";
import "./runtime-api-I7yZkEIc.js";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region extensions/zalouser/src/zca-constants.ts
const ThreadType = {
	User: 0,
	Group: 1
};
const LoginQRCallbackEventType = {
	QRCodeGenerated: 0,
	QRCodeExpired: 1,
	QRCodeScanned: 2,
	QRCodeDeclined: 3,
	GotLoginInfo: 4
};
const Reactions = {
	HEART: "/-heart",
	LIKE: "/-strong",
	HAHA: ":>",
	WOW: ":o",
	CRY: ":-((",
	ANGRY: ":-h",
	NONE: ""
};
const TextStyle = {
	Bold: "b",
	Italic: "i",
	Underline: "u",
	StrikeThrough: "s",
	Red: "c_db342e",
	Orange: "c_f27806",
	Yellow: "c_f7b503",
	Green: "c_15a85f",
	Small: "f_13",
	Big: "f_18",
	UnorderedList: "lst_1",
	OrderedList: "lst_2",
	Indent: "ind_$"
};
//#endregion
//#region extensions/zalouser/src/reaction.ts
const REACTION_ALIAS_MAP = new Map([
	["like", Reactions.LIKE],
	["👍", Reactions.LIKE],
	[":+1:", Reactions.LIKE],
	["heart", Reactions.HEART],
	["❤️", Reactions.HEART],
	["<3", Reactions.HEART],
	["haha", Reactions.HAHA],
	["laugh", Reactions.HAHA],
	["😂", Reactions.HAHA],
	["wow", Reactions.WOW],
	["😮", Reactions.WOW],
	["cry", Reactions.CRY],
	["😢", Reactions.CRY],
	["angry", Reactions.ANGRY],
	["😡", Reactions.ANGRY]
]);
function normalizeZaloReactionIcon(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return Reactions.LIKE;
	return REACTION_ALIAS_MAP.get(trimmed.toLowerCase()) ?? REACTION_ALIAS_MAP.get(trimmed) ?? trimmed;
}
//#endregion
//#region extensions/zalouser/src/zca-client.ts
let zcaJsRuntimePromise = null;
async function loadZcaJsRuntime() {
	zcaJsRuntimePromise ??= import("./dist-DpIHVcAZ.js").then((mod) => mod);
	return await zcaJsRuntimePromise;
}
async function createZalo(options) {
	const Zalo = (await loadZcaJsRuntime()).Zalo;
	return new Zalo(options);
}
//#endregion
//#region extensions/zalouser/src/zalo-js.ts
const API_LOGIN_TIMEOUT_MS = 2e4;
const QR_LOGIN_TTL_MS = 3 * 6e4;
const DEFAULT_QR_START_TIMEOUT_MS = 3e4;
const DEFAULT_QR_WAIT_TIMEOUT_MS = 12e4;
const GROUP_INFO_CHUNK_SIZE = 80;
const GROUP_CONTEXT_CACHE_TTL_MS = 5 * 6e4;
const GROUP_CONTEXT_CACHE_MAX_ENTRIES = 500;
const LISTENER_WATCHDOG_INTERVAL_MS = 3e4;
const LISTENER_WATCHDOG_MAX_GAP_MS = 35e3;
const apiByProfile = /* @__PURE__ */ new Map();
const apiInitByProfile = /* @__PURE__ */ new Map();
const activeQrLogins = /* @__PURE__ */ new Map();
const activeListeners = /* @__PURE__ */ new Map();
const groupContextCache = /* @__PURE__ */ new Map();
function resolveStateDir(env = process.env) {
	return resolveStateDir$1(env, os.homedir);
}
function resolveCredentialsDir(env = process.env) {
	return path.join(resolveStateDir(env), "credentials", "zalouser");
}
function credentialsFilename(profile) {
	const trimmed = profile.trim().toLowerCase();
	if (!trimmed || trimmed === "default") return "credentials.json";
	return `credentials-${encodeURIComponent(trimmed)}.json`;
}
function resolveCredentialsPath(profile, env = process.env) {
	return path.join(resolveCredentialsDir(env), credentialsFilename(profile));
}
function withTimeout(promise, timeoutMs, label) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(label));
		}, timeoutMs);
		promise.then((result) => {
			clearTimeout(timer);
			resolve(result);
		}).catch((err) => {
			clearTimeout(timer);
			reject(err);
		});
	});
}
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function normalizeProfile(profile) {
	const trimmed = profile?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : "default";
}
function toErrorMessage(error) {
	if (error instanceof Error) return error.message;
	return String(error);
}
function clampTextStyles(text, styles) {
	if (!styles || styles.length === 0) return;
	const maxLength = text.length;
	const clamped = styles.map((style) => {
		const start = Math.max(0, Math.min(style.start, maxLength));
		const end = Math.min(style.start + style.len, maxLength);
		if (end <= start) return null;
		if (style.st === TextStyle.Indent) return {
			start,
			len: end - start,
			st: style.st,
			indentSize: style.indentSize
		};
		return {
			start,
			len: end - start,
			st: style.st
		};
	}).filter((style) => style !== null);
	return clamped.length > 0 ? clamped : void 0;
}
function toNumberId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(Math.trunc(value));
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.length > 0) return trimmed.replace(/_\d+$/, "");
	}
	return "";
}
function toStringValue(value) {
	if (typeof value === "string") return value.trim();
	if (typeof value === "number" && Number.isFinite(value)) return String(Math.trunc(value));
	return "";
}
function normalizeAccountInfoUser(info) {
	if (!info || typeof info !== "object") return null;
	if ("profile" in info) {
		const profile = info.profile;
		if (profile && typeof profile === "object") return profile;
		return null;
	}
	return info;
}
function toInteger(value, fallback = 0) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
	const parsed = Number.parseInt(String(value ?? ""), 10);
	if (!Number.isFinite(parsed)) return fallback;
	return Math.trunc(parsed);
}
function normalizeMessageContent(content) {
	if (typeof content === "string") return content;
	if (!content || typeof content !== "object") return "";
	const record = content;
	const combined = [
		typeof record.title === "string" ? record.title.trim() : "",
		typeof record.description === "string" ? record.description.trim() : "",
		typeof record.href === "string" ? record.href.trim() : ""
	].filter(Boolean).join("\n").trim();
	if (combined) return combined;
	try {
		return JSON.stringify(content);
	} catch {
		return "";
	}
}
function resolveInboundTimestamp(rawTs) {
	if (typeof rawTs === "number" && Number.isFinite(rawTs)) return rawTs > 0xe8d4a51000 ? rawTs : rawTs * 1e3;
	const parsed = Number.parseInt(String(rawTs ?? ""), 10);
	if (!Number.isFinite(parsed) || parsed <= 0) return Date.now();
	return parsed > 0xe8d4a51000 ? parsed : parsed * 1e3;
}
function extractMentionIds(rawMentions) {
	if (!Array.isArray(rawMentions)) return [];
	const sink = /* @__PURE__ */ new Set();
	for (const entry of rawMentions) {
		if (!entry || typeof entry !== "object") continue;
		const id = toNumberId(entry.uid);
		if (id) sink.add(id);
	}
	return Array.from(sink);
}
function toNonNegativeInteger(value) {
	if (typeof value === "number" && Number.isFinite(value)) {
		const normalized = Math.trunc(value);
		return normalized >= 0 ? normalized : null;
	}
	if (typeof value === "string" && value.trim().length > 0) {
		const parsed = Number.parseInt(value.trim(), 10);
		if (Number.isFinite(parsed)) return parsed >= 0 ? parsed : null;
	}
	return null;
}
function extractOwnMentionSpans(rawMentions, ownUserId, contentLength) {
	if (!Array.isArray(rawMentions) || !ownUserId || contentLength <= 0) return [];
	const spans = [];
	for (const entry of rawMentions) {
		if (!entry || typeof entry !== "object") continue;
		const record = entry;
		const uid = toNumberId(record.uid);
		if (!uid || uid !== ownUserId) continue;
		const startRaw = toNonNegativeInteger(record.pos ?? record.start ?? record.offset);
		const lengthRaw = toNonNegativeInteger(record.len ?? record.length);
		if (startRaw === null || lengthRaw === null || lengthRaw <= 0) continue;
		const start = Math.min(startRaw, contentLength);
		const end = Math.min(start + lengthRaw, contentLength);
		if (end <= start) continue;
		spans.push({
			start,
			end
		});
	}
	if (spans.length <= 1) return spans;
	spans.sort((a, b) => a.start - b.start);
	const merged = [];
	for (const span of spans) {
		const last = merged[merged.length - 1];
		if (!last || span.start > last.end) {
			merged.push({ ...span });
			continue;
		}
		last.end = Math.max(last.end, span.end);
	}
	return merged;
}
function stripOwnMentionsForCommandBody(content, rawMentions, ownUserId) {
	if (!content || !ownUserId) return content;
	const spans = extractOwnMentionSpans(rawMentions, ownUserId, content.length);
	if (spans.length === 0) return stripLeadingAtMentionForCommand(content);
	let cursor = 0;
	let output = "";
	for (const span of spans) {
		if (span.start > cursor) output += content.slice(cursor, span.start);
		cursor = Math.max(cursor, span.end);
	}
	if (cursor < content.length) output += content.slice(cursor);
	return output.replace(/\s+/g, " ").trim();
}
function stripLeadingAtMentionForCommand(content) {
	const fallbackMatch = content.match(/^\s*@[^\s]+(?:\s+|[:,-]\s*)([/!][\s\S]*)$/);
	if (!fallbackMatch) return content;
	return fallbackMatch[1].trim();
}
function resolveGroupNameFromMessageData(data) {
	const candidates = [
		data.groupName,
		data.gName,
		data.idToName,
		data.threadName,
		data.roomName
	];
	for (const candidate of candidates) {
		const value = toStringValue(candidate);
		if (value) return value;
	}
}
function buildEventMessage(data) {
	const msgId = toStringValue(data.msgId);
	const cliMsgId = toStringValue(data.cliMsgId);
	const uidFrom = toStringValue(data.uidFrom);
	const idTo = toStringValue(data.idTo);
	if (!msgId || !cliMsgId || !uidFrom || !idTo) return;
	return {
		msgId,
		cliMsgId,
		uidFrom,
		idTo,
		msgType: toStringValue(data.msgType) || "webchat",
		st: toInteger(data.st, 0),
		at: toInteger(data.at, 0),
		cmd: toInteger(data.cmd, 0),
		ts: toStringValue(data.ts) || Date.now()
	};
}
function extractSendMessageId(result) {
	if (!result || typeof result !== "object") return;
	const payload = result;
	const direct = payload.msgId;
	if (direct !== void 0 && direct !== null) return String(direct);
	const primary = payload.message?.msgId;
	if (primary !== void 0 && primary !== null) return String(primary);
	const attachmentId = payload.attachment?.[0]?.msgId;
	if (attachmentId !== void 0 && attachmentId !== null) return String(attachmentId);
}
function resolveMediaFileName(params) {
	const explicit = params.fileName?.trim();
	if (explicit) return explicit;
	try {
		const parsed = new URL(params.mediaUrl);
		const fromPath = path.basename(parsed.pathname).trim();
		if (fromPath) return fromPath;
	} catch {}
	return `upload.${params.contentType === "image/png" ? "png" : params.contentType === "image/webp" ? "webp" : params.contentType === "image/jpeg" ? "jpg" : params.contentType === "video/mp4" ? "mp4" : params.contentType === "audio/mpeg" ? "mp3" : params.contentType === "audio/ogg" ? "ogg" : params.contentType === "audio/wav" ? "wav" : params.kind === "video" ? "mp4" : params.kind === "audio" ? "mp3" : params.kind === "image" ? "jpg" : "bin"}`;
}
function resolveUploadedVoiceAsset(uploaded) {
	for (const item of uploaded) {
		if (!item || typeof item !== "object") continue;
		const fileType = item.fileType?.toLowerCase();
		const fileUrl = item.fileUrl?.trim();
		if (!fileUrl) continue;
		if (fileType === "others" || fileType === "video") return {
			fileUrl,
			fileName: item.fileName?.trim() || void 0
		};
	}
}
function buildZaloVoicePlaybackUrl(asset) {
	return asset.fileUrl.trim();
}
function mapFriend(friend) {
	return {
		userId: String(friend.userId),
		displayName: friend.displayName || friend.zaloName || friend.username || String(friend.userId),
		avatar: friend.avatar || void 0
	};
}
function mapGroup(groupId, group) {
	const totalMember = typeof group.totalMember === "number" && Number.isFinite(group.totalMember) ? group.totalMember : void 0;
	return {
		groupId: String(groupId),
		name: group.name?.trim() || String(groupId),
		memberCount: totalMember
	};
}
function readCredentials(profile) {
	const filePath = resolveCredentialsPath(profile);
	try {
		if (!fsSync.existsSync(filePath)) return null;
		const raw = fsSync.readFileSync(filePath, "utf-8");
		const parsed = JSON.parse(raw);
		if (typeof parsed.imei !== "string" || !parsed.imei || !parsed.cookie || typeof parsed.userAgent !== "string" || !parsed.userAgent) return null;
		return {
			imei: parsed.imei,
			cookie: parsed.cookie,
			userAgent: parsed.userAgent,
			language: typeof parsed.language === "string" ? parsed.language : void 0,
			createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : (/* @__PURE__ */ new Date()).toISOString(),
			lastUsedAt: typeof parsed.lastUsedAt === "string" ? parsed.lastUsedAt : void 0
		};
	} catch {
		return null;
	}
}
function touchCredentials(profile) {
	const existing = readCredentials(profile);
	if (!existing) return;
	const next = {
		...existing,
		lastUsedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const dir = resolveCredentialsDir();
	fsSync.mkdirSync(dir, { recursive: true });
	fsSync.writeFileSync(resolveCredentialsPath(profile), JSON.stringify(next, null, 2), "utf-8");
}
function writeCredentials(profile, credentials) {
	const dir = resolveCredentialsDir();
	fsSync.mkdirSync(dir, { recursive: true });
	const existing = readCredentials(profile);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const next = {
		...credentials,
		createdAt: existing?.createdAt ?? now,
		lastUsedAt: now
	};
	fsSync.writeFileSync(resolveCredentialsPath(profile), JSON.stringify(next, null, 2), "utf-8");
}
function clearCredentials(profile) {
	const filePath = resolveCredentialsPath(profile);
	try {
		if (fsSync.existsSync(filePath)) {
			fsSync.unlinkSync(filePath);
			return true;
		}
	} catch {}
	return false;
}
async function ensureApi(profileInput, timeoutMs = API_LOGIN_TIMEOUT_MS) {
	const profile = normalizeProfile(profileInput);
	const cached = apiByProfile.get(profile);
	if (cached) return cached;
	const pending = apiInitByProfile.get(profile);
	if (pending) return await pending;
	const initPromise = (async () => {
		const stored = readCredentials(profile);
		if (!stored) throw new Error(`No saved Zalo session for profile \"${profile}\"`);
		const api = await withTimeout((await createZalo({
			logging: false,
			selfListen: false
		})).login({
			imei: stored.imei,
			cookie: stored.cookie,
			userAgent: stored.userAgent,
			language: stored.language
		}), timeoutMs, `Timed out restoring Zalo session for profile \"${profile}\"`);
		apiByProfile.set(profile, api);
		touchCredentials(profile);
		return api;
	})();
	apiInitByProfile.set(profile, initPromise);
	try {
		return await initPromise;
	} catch (error) {
		apiByProfile.delete(profile);
		throw error;
	} finally {
		apiInitByProfile.delete(profile);
	}
}
function invalidateApi(profileInput) {
	const profile = normalizeProfile(profileInput);
	const api = apiByProfile.get(profile);
	if (api) try {
		api.listener.stop();
	} catch {}
	apiByProfile.delete(profile);
	apiInitByProfile.delete(profile);
}
function isQrLoginFresh(login) {
	return Date.now() - login.startedAt < QR_LOGIN_TTL_MS;
}
function resetQrLogin(profileInput) {
	const profile = normalizeProfile(profileInput);
	const active = activeQrLogins.get(profile);
	if (!active) return;
	try {
		active.abort?.();
	} catch {}
	activeQrLogins.delete(profile);
}
async function fetchGroupsByIds(api, ids) {
	const result = /* @__PURE__ */ new Map();
	for (let index = 0; index < ids.length; index += GROUP_INFO_CHUNK_SIZE) {
		const chunk = ids.slice(index, index + GROUP_INFO_CHUNK_SIZE);
		if (chunk.length === 0) continue;
		const map = (await api.getGroupInfo(chunk)).gridInfoMap ?? {};
		for (const [groupId, info] of Object.entries(map)) result.set(groupId, info);
	}
	return result;
}
function makeGroupContextCacheKey(profile, groupId) {
	return `${profile}:${groupId}`;
}
function readCachedGroupContext(profile, groupId) {
	const key = makeGroupContextCacheKey(profile, groupId);
	const cached = groupContextCache.get(key);
	if (!cached) return null;
	if (cached.expiresAt <= Date.now()) {
		groupContextCache.delete(key);
		return null;
	}
	groupContextCache.delete(key);
	groupContextCache.set(key, cached);
	return cached.value;
}
function trimGroupContextCache(now) {
	for (const [key, value] of groupContextCache) {
		if (value.expiresAt > now) continue;
		groupContextCache.delete(key);
	}
	while (groupContextCache.size > GROUP_CONTEXT_CACHE_MAX_ENTRIES) {
		const oldestKey = groupContextCache.keys().next().value;
		if (!oldestKey) break;
		groupContextCache.delete(oldestKey);
	}
}
function writeCachedGroupContext(profile, context) {
	const now = Date.now();
	const key = makeGroupContextCacheKey(profile, context.groupId);
	if (groupContextCache.has(key)) groupContextCache.delete(key);
	groupContextCache.set(key, {
		value: context,
		expiresAt: now + GROUP_CONTEXT_CACHE_TTL_MS
	});
	trimGroupContextCache(now);
}
function clearCachedGroupContext(profile) {
	for (const key of groupContextCache.keys()) if (key.startsWith(`${profile}:`)) groupContextCache.delete(key);
}
function extractGroupMembersFromInfo(groupInfo) {
	if (!groupInfo || !Array.isArray(groupInfo.currentMems)) return;
	const members = groupInfo.currentMems.map((member) => {
		if (!member || typeof member !== "object") return "";
		const record = member;
		return toStringValue(record.dName) || toStringValue(record.zaloName);
	}).filter(Boolean);
	if (members.length === 0) return;
	return members;
}
function toInboundMessage(message, ownUserId) {
	const data = message.data;
	const isGroup = message.type === ThreadType.Group;
	const senderId = toNumberId(data.uidFrom);
	const threadId = isGroup ? toNumberId(data.idTo) : toNumberId(data.uidFrom) || toNumberId(data.idTo);
	if (!threadId || !senderId) return null;
	const content = normalizeMessageContent(data.content);
	const normalizedOwnUserId = toNumberId(ownUserId);
	const mentionIds = extractMentionIds(data.mentions);
	const quoteOwnerId = data.quote && typeof data.quote === "object" ? toNumberId(data.quote.ownerId) : "";
	const hasAnyMention = mentionIds.length > 0;
	const canResolveExplicitMention = Boolean(normalizedOwnUserId);
	const wasExplicitlyMentioned = Boolean(normalizedOwnUserId && mentionIds.some((id) => id === normalizedOwnUserId));
	const commandContent = wasExplicitlyMentioned ? stripOwnMentionsForCommandBody(content, data.mentions, normalizedOwnUserId) : hasAnyMention && !canResolveExplicitMention ? stripLeadingAtMentionForCommand(content) : content;
	const implicitMention = Boolean(normalizedOwnUserId && quoteOwnerId && quoteOwnerId === normalizedOwnUserId);
	const eventMessage = buildEventMessage(data);
	return {
		threadId,
		isGroup,
		senderId,
		senderName: typeof data.dName === "string" ? data.dName.trim() || void 0 : void 0,
		groupName: isGroup ? resolveGroupNameFromMessageData(data) : void 0,
		content,
		commandContent,
		timestampMs: resolveInboundTimestamp(data.ts),
		msgId: typeof data.msgId === "string" ? data.msgId : void 0,
		cliMsgId: typeof data.cliMsgId === "string" ? data.cliMsgId : void 0,
		hasAnyMention,
		canResolveExplicitMention,
		wasExplicitlyMentioned,
		implicitMention,
		eventMessage,
		raw: message
	};
}
function zalouserSessionExists(profileInput) {
	return readCredentials(normalizeProfile(profileInput)) !== null;
}
async function checkZaloAuthenticated(profileInput) {
	const profile = normalizeProfile(profileInput);
	if (!zalouserSessionExists(profile)) return false;
	try {
		await withTimeout((await ensureApi(profile, 12e3)).fetchAccountInfo(), 12e3, "Timed out checking Zalo session");
		return true;
	} catch {
		invalidateApi(profile);
		return false;
	}
}
async function getZaloUserInfo(profileInput) {
	const user = normalizeAccountInfoUser(await (await ensureApi(normalizeProfile(profileInput))).fetchAccountInfo());
	if (!user?.userId) return null;
	return {
		userId: String(user.userId),
		displayName: user.displayName || user.zaloName || String(user.userId),
		avatar: user.avatar || void 0
	};
}
async function listZaloFriends(profileInput) {
	return (await (await ensureApi(normalizeProfile(profileInput))).getAllFriends()).map(mapFriend);
}
async function listZaloFriendsMatching(profileInput, query) {
	const friends = await listZaloFriends(profileInput);
	const q = query?.trim().toLowerCase();
	if (!q) return friends;
	return friends.map((friend) => {
		const id = friend.userId.toLowerCase();
		const name = friend.displayName.toLowerCase();
		return {
			friend,
			exact: id === q || name === q,
			includes: id.includes(q) || name.includes(q)
		};
	}).filter((entry) => entry.includes).sort((a, b) => Number(b.exact) - Number(a.exact)).map((entry) => entry.friend);
}
async function listZaloGroups(profileInput) {
	const api = await ensureApi(normalizeProfile(profileInput));
	const allGroups = await api.getAllGroups();
	const ids = Object.keys(allGroups.gridVerMap ?? {});
	if (ids.length === 0) return [];
	const details = await fetchGroupsByIds(api, ids);
	const rows = [];
	for (const id of ids) {
		const info = details.get(id);
		if (!info) {
			rows.push({
				groupId: id,
				name: id
			});
			continue;
		}
		rows.push(mapGroup(id, info));
	}
	return rows;
}
async function listZaloGroupsMatching(profileInput, query) {
	const groups = await listZaloGroups(profileInput);
	const q = query?.trim().toLowerCase();
	if (!q) return groups;
	return groups.filter((group) => {
		const id = group.groupId.toLowerCase();
		const name = group.name.toLowerCase();
		return id.includes(q) || name.includes(q);
	});
}
async function listZaloGroupMembers(profileInput, groupId) {
	const api = await ensureApi(normalizeProfile(profileInput));
	const groupInfo = (await api.getGroupInfo(groupId)).gridInfoMap?.[groupId];
	if (!groupInfo) return [];
	const memberIds = Array.isArray(groupInfo.memberIds) ? groupInfo.memberIds.map((id) => toNumberId(id)).filter(Boolean) : [];
	const memVerIds = Array.isArray(groupInfo.memVerList) ? groupInfo.memVerList.map((id) => toNumberId(id)).filter(Boolean) : [];
	const currentMembers = Array.isArray(groupInfo.currentMems) ? groupInfo.currentMems : [];
	const currentById = /* @__PURE__ */ new Map();
	for (const member of currentMembers) {
		const id = toNumberId(member?.id);
		if (!id) continue;
		currentById.set(id, {
			displayName: member.dName?.trim() || member.zaloName?.trim() || void 0,
			avatar: member.avatar || void 0
		});
	}
	const uniqueIds = Array.from(new Set([
		...memberIds,
		...memVerIds,
		...currentById.keys()
	]));
	const profileMap = /* @__PURE__ */ new Map();
	if (uniqueIds.length > 0) {
		const profileEntries = (await api.getGroupMembersInfo(uniqueIds)).profiles;
		for (const [rawId, profileValue] of Object.entries(profileEntries)) {
			const id = toNumberId(rawId) || toNumberId(profileValue?.id);
			if (!id || !profileValue) continue;
			profileMap.set(id, {
				displayName: profileValue.displayName?.trim() || profileValue.zaloName?.trim() || void 0,
				avatar: profileValue.avatar || void 0
			});
		}
	}
	return uniqueIds.map((id) => ({
		userId: id,
		displayName: profileMap.get(id)?.displayName || currentById.get(id)?.displayName || id,
		avatar: profileMap.get(id)?.avatar || currentById.get(id)?.avatar
	}));
}
async function resolveZaloGroupContext(profileInput, groupId) {
	const profile = normalizeProfile(profileInput);
	const normalizedGroupId = toNumberId(groupId) || groupId.trim();
	if (!normalizedGroupId) throw new Error("groupId is required");
	const cached = readCachedGroupContext(profile, normalizedGroupId);
	if (cached) return cached;
	const groupInfo = (await (await ensureApi(profile)).getGroupInfo(normalizedGroupId)).gridInfoMap?.[normalizedGroupId];
	const context = {
		groupId: normalizedGroupId,
		name: groupInfo?.name?.trim() || void 0,
		members: extractGroupMembersFromInfo(groupInfo)
	};
	writeCachedGroupContext(profile, context);
	return context;
}
async function sendZaloTextMessage(threadId, text, options = {}) {
	const profile = normalizeProfile(options.profile);
	const trimmedThreadId = threadId.trim();
	if (!trimmedThreadId) return {
		ok: false,
		error: "No threadId provided"
	};
	const api = await ensureApi(profile);
	const type = options.isGroup ? ThreadType.Group : ThreadType.User;
	try {
		if (options.mediaUrl?.trim()) {
			const media = await loadOutboundMediaFromUrl(options.mediaUrl.trim(), { mediaLocalRoots: options.mediaLocalRoots });
			const fileName = resolveMediaFileName({
				mediaUrl: options.mediaUrl,
				fileName: media.fileName,
				contentType: media.contentType,
				kind: media.kind
			});
			const payloadText = (text || options.caption || "").slice(0, 2e3);
			const textStyles = clampTextStyles(payloadText, options.textStyles);
			if (media.kind === "audio") {
				let textMessageId;
				if (payloadText) textMessageId = extractSendMessageId(await api.sendMessage(textStyles ? {
					msg: payloadText,
					styles: textStyles
				} : payloadText, trimmedThreadId, type));
				const attachmentFileName = fileName.includes(".") ? fileName : `${fileName}.bin`;
				const voiceAsset = resolveUploadedVoiceAsset(await api.uploadAttachment([{
					data: media.buffer,
					filename: attachmentFileName,
					metadata: { totalSize: media.buffer.length }
				}], trimmedThreadId, type));
				if (!voiceAsset) throw new Error("Failed to resolve uploaded audio URL for voice message");
				const voiceUrl = buildZaloVoicePlaybackUrl(voiceAsset);
				return {
					ok: true,
					messageId: extractSendMessageId(await api.sendVoice({ voiceUrl }, trimmedThreadId, type)) ?? textMessageId
				};
			}
			return {
				ok: true,
				messageId: extractSendMessageId(await api.sendMessage({
					msg: payloadText,
					...textStyles ? { styles: textStyles } : {},
					attachments: [{
						data: media.buffer,
						filename: fileName.includes(".") ? fileName : `${fileName}.bin`,
						metadata: { totalSize: media.buffer.length }
					}]
				}, trimmedThreadId, type))
			};
		}
		const payloadText = text.slice(0, 2e3);
		const textStyles = clampTextStyles(payloadText, options.textStyles);
		return {
			ok: true,
			messageId: extractSendMessageId(await api.sendMessage(textStyles ? {
				msg: payloadText,
				styles: textStyles
			} : payloadText, trimmedThreadId, type))
		};
	} catch (error) {
		return {
			ok: false,
			error: toErrorMessage(error)
		};
	}
}
async function sendZaloTypingEvent(threadId, options = {}) {
	const profile = normalizeProfile(options.profile);
	const trimmedThreadId = threadId.trim();
	if (!trimmedThreadId) throw new Error("No threadId provided");
	const api = await ensureApi(profile);
	const type = options.isGroup ? ThreadType.Group : ThreadType.User;
	if ("sendTypingEvent" in api && typeof api.sendTypingEvent === "function") {
		await api.sendTypingEvent(trimmedThreadId, type);
		return;
	}
	throw new Error("Zalo typing indicator is not supported by current API session");
}
async function resolveOwnUserId(api) {
	try {
		const resolved = toNumberId(normalizeAccountInfoUser(await api.fetchAccountInfo())?.userId);
		if (resolved) return resolved;
	} catch {}
	try {
		const ownId = toNumberId(api.getOwnId());
		if (ownId) return ownId;
	} catch {}
	return "";
}
async function sendZaloReaction(params) {
	const profile = normalizeProfile(params.profile);
	const threadId = params.threadId.trim();
	const msgId = toStringValue(params.msgId);
	const cliMsgId = toStringValue(params.cliMsgId);
	if (!threadId || !msgId || !cliMsgId) return {
		ok: false,
		error: "threadId, msgId, and cliMsgId are required"
	};
	try {
		const api = await ensureApi(profile);
		const type = params.isGroup ? ThreadType.Group : ThreadType.User;
		const icon = params.remove ? {
			rType: -1,
			source: 6,
			icon: ""
		} : normalizeZaloReactionIcon(params.emoji);
		await api.addReaction(icon, {
			data: {
				msgId,
				cliMsgId
			},
			threadId,
			type
		});
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: toErrorMessage(error)
		};
	}
}
async function sendZaloDeliveredEvent(params) {
	const api = await ensureApi(normalizeProfile(params.profile));
	const type = params.isGroup ? ThreadType.Group : ThreadType.User;
	await api.sendDeliveredEvent(params.isSeen === true, params.message, type);
}
async function sendZaloSeenEvent(params) {
	const api = await ensureApi(normalizeProfile(params.profile));
	const type = params.isGroup ? ThreadType.Group : ThreadType.User;
	await api.sendSeenEvent(params.message, type);
}
async function sendZaloLink(threadId, url, options = {}) {
	const profile = normalizeProfile(options.profile);
	const trimmedThreadId = threadId.trim();
	const trimmedUrl = url.trim();
	if (!trimmedThreadId) return {
		ok: false,
		error: "No threadId provided"
	};
	if (!trimmedUrl) return {
		ok: false,
		error: "No URL provided"
	};
	try {
		const api = await ensureApi(profile);
		const type = options.isGroup ? ThreadType.Group : ThreadType.User;
		const response = await api.sendLink({
			link: trimmedUrl,
			msg: options.caption
		}, trimmedThreadId, type);
		return {
			ok: true,
			messageId: String(response.msgId)
		};
	} catch (error) {
		return {
			ok: false,
			error: toErrorMessage(error)
		};
	}
}
async function startZaloQrLogin(params) {
	const profile = normalizeProfile(params.profile);
	if (!params.force && await checkZaloAuthenticated(profile)) {
		const info = await getZaloUserInfo(profile).catch(() => null);
		return { message: `Zalo is already linked${info?.displayName ? ` (${info.displayName})` : ""}.` };
	}
	if (params.force) await logoutZaloProfile(profile);
	const existing = activeQrLogins.get(profile);
	if (existing && isQrLoginFresh(existing)) {
		if (existing.qrDataUrl) return {
			qrDataUrl: existing.qrDataUrl,
			message: "QR already active. Scan it with the Zalo app."
		};
	} else if (existing) resetQrLogin(profile);
	if (!activeQrLogins.has(profile)) {
		const login = {
			id: randomUUID(),
			profile,
			startedAt: Date.now(),
			connected: false,
			waitPromise: Promise.resolve()
		};
		login.waitPromise = (async () => {
			let capturedCredentials = null;
			try {
				const api = await (await createZalo({
					logging: false,
					selfListen: false
				})).loginQR(void 0, (event) => {
					const current = activeQrLogins.get(profile);
					if (!current || current.id !== login.id) return;
					if (event.actions?.abort) current.abort = () => {
						try {
							event.actions?.abort?.();
						} catch {}
					};
					switch (event.type) {
						case LoginQRCallbackEventType.QRCodeGenerated: {
							const image = event.data.image.replace(/^data:image\/png;base64,/, "");
							current.qrDataUrl = image.startsWith("data:image") ? image : `data:image/png;base64,${image}`;
							break;
						}
						case LoginQRCallbackEventType.QRCodeExpired:
							try {
								event.actions.retry();
							} catch {
								current.error = "QR expired before confirmation. Start login again.";
							}
							break;
						case LoginQRCallbackEventType.QRCodeDeclined:
							current.error = "QR login was declined on the phone.";
							break;
						case LoginQRCallbackEventType.GotLoginInfo:
							capturedCredentials = {
								imei: event.data.imei,
								cookie: event.data.cookie,
								userAgent: event.data.userAgent
							};
							break;
						default: break;
					}
				});
				const current = activeQrLogins.get(profile);
				if (!current || current.id !== login.id) return;
				if (!capturedCredentials) {
					const ctx = api.getContext();
					const cookieJson = api.getCookie().toJSON();
					capturedCredentials = {
						imei: ctx.imei,
						cookie: cookieJson?.cookies ?? [],
						userAgent: ctx.userAgent,
						language: ctx.language
					};
				}
				writeCredentials(profile, capturedCredentials);
				invalidateApi(profile);
				apiByProfile.set(profile, api);
				current.connected = true;
			} catch (error) {
				const current = activeQrLogins.get(profile);
				if (current && current.id === login.id) current.error = toErrorMessage(error);
			}
		})();
		activeQrLogins.set(profile, login);
	}
	const active = activeQrLogins.get(profile);
	if (!active) return { message: "Failed to initialize Zalo QR login." };
	const timeoutMs = Math.max(params.timeoutMs ?? DEFAULT_QR_START_TIMEOUT_MS, 3e3);
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (active.error) {
			resetQrLogin(profile);
			return { message: `Failed to start QR login: ${active.error}` };
		}
		if (active.connected) {
			resetQrLogin(profile);
			return { message: "Zalo already connected." };
		}
		if (active.qrDataUrl) return {
			qrDataUrl: active.qrDataUrl,
			message: "Scan this QR with the Zalo app."
		};
		await delay(150);
	}
	return { message: "Still preparing QR. Call wait to continue checking login status." };
}
async function waitForZaloQrLogin(params) {
	const profile = normalizeProfile(params.profile);
	const active = activeQrLogins.get(profile);
	if (!active) {
		const connected = await checkZaloAuthenticated(profile);
		return {
			connected,
			message: connected ? "Zalo session is ready." : "No active Zalo QR login in progress."
		};
	}
	if (!isQrLoginFresh(active)) {
		resetQrLogin(profile);
		return {
			connected: false,
			message: "QR login expired. Start again to generate a fresh QR code."
		};
	}
	const timeoutMs = Math.max(params.timeoutMs ?? DEFAULT_QR_WAIT_TIMEOUT_MS, 1e3);
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (active.error) {
			const message = `Zalo login failed: ${active.error}`;
			resetQrLogin(profile);
			return {
				connected: false,
				message
			};
		}
		if (active.connected) {
			resetQrLogin(profile);
			return {
				connected: true,
				message: "Login successful."
			};
		}
		await Promise.race([active.waitPromise, delay(400)]);
	}
	return {
		connected: false,
		message: "Still waiting for QR scan confirmation."
	};
}
async function logoutZaloProfile(profileInput) {
	const profile = normalizeProfile(profileInput);
	resetQrLogin(profile);
	clearCachedGroupContext(profile);
	const listener = activeListeners.get(profile);
	if (listener) {
		try {
			listener.stop();
		} catch {}
		activeListeners.delete(profile);
	}
	invalidateApi(profile);
	const cleared = clearCredentials(profile);
	return {
		cleared,
		loggedOut: true,
		message: cleared ? "Logged out and cleared local session." : "No local session to clear."
	};
}
async function startZaloListener(params) {
	const profile = normalizeProfile(params.profile);
	const existing = activeListeners.get(profile);
	if (existing) throw new Error(`Zalo listener already running for profile \"${profile}\" (account \"${existing.accountId}\")`);
	const api = await ensureApi(profile);
	const ownUserId = await resolveOwnUserId(api);
	let stopped = false;
	let watchdogTimer = null;
	let lastWatchdogTickAt = Date.now();
	const cleanup = () => {
		if (stopped) return;
		stopped = true;
		if (watchdogTimer) {
			clearInterval(watchdogTimer);
			watchdogTimer = null;
		}
		try {
			api.listener.off("message", onMessage);
			api.listener.off("error", onError);
			api.listener.off("closed", onClosed);
		} catch {}
		try {
			api.listener.stop();
		} catch {}
		activeListeners.delete(profile);
	};
	const onMessage = (incoming) => {
		if (incoming.isSelf) return;
		const normalized = toInboundMessage(incoming, ownUserId);
		if (!normalized) return;
		params.onMessage(normalized);
	};
	const failListener = (error) => {
		if (stopped || params.abortSignal.aborted) return;
		cleanup();
		invalidateApi(profile);
		params.onError(error);
	};
	const onError = (error) => {
		failListener(error instanceof Error ? error : new Error(String(error)));
	};
	const onClosed = (code, reason) => {
		failListener(/* @__PURE__ */ new Error(`Zalo listener closed (${code}): ${reason || "no reason"}`));
	};
	api.listener.on("message", onMessage);
	api.listener.on("error", onError);
	api.listener.on("closed", onClosed);
	try {
		api.listener.start({ retryOnClose: false });
	} catch (error) {
		cleanup();
		throw error;
	}
	watchdogTimer = setInterval(() => {
		if (stopped || params.abortSignal.aborted) return;
		const now = Date.now();
		const gapMs = now - lastWatchdogTickAt;
		lastWatchdogTickAt = now;
		if (gapMs <= LISTENER_WATCHDOG_MAX_GAP_MS) return;
		failListener(/* @__PURE__ */ new Error(`Zalo listener watchdog gap detected (${Math.round(gapMs / 1e3)}s): forcing reconnect`));
	}, LISTENER_WATCHDOG_INTERVAL_MS);
	watchdogTimer.unref?.();
	params.abortSignal.addEventListener("abort", () => {
		cleanup();
	}, { once: true });
	activeListeners.set(profile, {
		profile,
		accountId: params.accountId,
		stop: cleanup
	});
	return { stop: cleanup };
}
async function resolveZaloGroupsByEntries(params) {
	const groups = await listZaloGroups(params.profile);
	const byName = /* @__PURE__ */ new Map();
	for (const group of groups) {
		const key = group.name.trim().toLowerCase();
		if (!key) continue;
		const list = byName.get(key) ?? [];
		list.push(group);
		byName.set(key, list);
	}
	return params.entries.map((input) => {
		const trimmed = input.trim();
		if (!trimmed) return {
			input,
			resolved: false
		};
		if (/^\d+$/.test(trimmed)) return {
			input,
			resolved: true,
			id: trimmed
		};
		const match = (byName.get(trimmed.toLowerCase()) ?? [])[0];
		return match ? {
			input,
			resolved: true,
			id: match.groupId
		} : {
			input,
			resolved: false
		};
	});
}
async function resolveZaloAllowFromEntries(params) {
	const friends = await listZaloFriends(params.profile);
	const byName = /* @__PURE__ */ new Map();
	for (const friend of friends) {
		const key = friend.displayName.trim().toLowerCase();
		if (!key) continue;
		const list = byName.get(key) ?? [];
		list.push(friend);
		byName.set(key, list);
	}
	return params.entries.map((input) => {
		const trimmed = input.trim();
		if (!trimmed) return {
			input,
			resolved: false
		};
		if (/^\d+$/.test(trimmed)) return {
			input,
			resolved: true,
			id: trimmed
		};
		const matches = byName.get(trimmed.toLowerCase()) ?? [];
		const match = matches[0];
		if (!match) return {
			input,
			resolved: false
		};
		return {
			input,
			resolved: true,
			id: match.userId,
			note: matches.length > 1 ? "multiple matches; chose first" : void 0
		};
	});
}
//#endregion
export { sendZaloTypingEvent as _, listZaloGroupMembers as a, waitForZaloQrLogin as b, logoutZaloProfile as c, resolveZaloGroupsByEntries as d, sendZaloDeliveredEvent as f, sendZaloTextMessage as g, sendZaloSeenEvent as h, listZaloFriendsMatching as i, resolveZaloAllowFromEntries as l, sendZaloReaction as m, getZaloUserInfo as n, listZaloGroups as o, sendZaloLink as p, listZaloFriends as r, listZaloGroupsMatching as s, checkZaloAuthenticated as t, resolveZaloGroupContext as u, startZaloListener as v, TextStyle as x, startZaloQrLogin as y };
