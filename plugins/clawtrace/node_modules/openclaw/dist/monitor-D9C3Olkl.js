import { s as __toESM } from "./chunk-iyeSoAlh.js";
import { $n as resolveFeishuReplyPolicy, An as sendMessageFeishu, CP as getSessionBindingService, Cr as createFeishuWSClient, Dn as resolveFeishuCardTemplate, Dr as resolveFeishuRuntimeAccount, En as listFeishuThreadMessages, Er as resolveFeishuAccount, Fn as buildMentionedCardContent, JP as buildAgentMediaPayload, Ln as extractMentionTargets, Nn as parsePostContent, On as sendCardFeishu, Pn as normalizeFeishuExternalKey, Qn as resolveFeishuGroupConfig, Sr as createFeishuClient, Tn as getMessageFeishu, Tr as listEnabledFeishuAccounts, Un as isMentionForwardRequest, Wn as getFeishuRuntime, Xn as isFeishuGroupAllowed, Zn as resolveFeishuAllowlistMatch, _r as buildFeishuConversationId, ar as decodeFeishuCardAction, bC as ensureConfiguredBindingRouteReady, fr as probeFeishu, ir as createFeishuCardInteractionEnvelope, jn as sendStructuredCardFeishu, lr as createFeishuThreadBindingManager, mr as waitForAbortableDelay, nr as resolveReceiveIdType, or as createPersistentDedupe, pr as raceWithTimeoutAndAbort, rr as buildFeishuCardActionTextFallback, vn as downloadMessageResourceFeishu, wr as require_lib, xC as resolveConfiguredBindingRoute, xn as sendMediaFeishu, xr as createEventDispatcher } from "./auth-profiles-B5ypC5S-.js";
import { c as normalizeAgentId, u as resolveAgentIdFromSessionKey } from "./session-key-BhxcMJEE.js";
import { r as deriveLastRoutePolicy } from "./base-session-key-UJINc15Z.js";
import { t as createDedupeCache } from "./dedupe-BKm1HFA-.js";
import { n as createChannelPairingController } from "./channel-pairing-cpi9_8zd.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, i as resolveOpenProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "./runtime-group-policy-Bde7-o8k.js";
import { t as readJsonFileWithFallback } from "./json-store-9F5NU8uu.js";
import "./routing-LZlQ54P8.js";
import { n as resolveAgentOutboundIdentity } from "./outbound-runtime-B03J2h4O.js";
import { l as logTypingFailure } from "./channel-feedback-rIf58luM.js";
import { n as fetchWithSsrFGuard } from "./fetch-guard-dgUzueSW.js";
import { f as WEBHOOK_RATE_LIMIT_DEFAULTS, h as createWebhookAnomalyTracker, m as createFixedWindowRateLimiter, u as WEBHOOK_ANOMALY_COUNTER_DEFAULTS } from "./webhook-ingress-CTk9JGVm.js";
import { h as sendMediaWithLeadingCaption, m as resolveTextChunksWithFallback, p as resolveSendableOutboundReplyParts } from "./reply-payload-CJqP_sJ6.js";
import { a as createReplyPrefixContext, t as createChannelReplyPipeline } from "./channel-reply-pipeline-DFacxqeY.js";
import { a as isRequestBodyLimitError, c as requestBodyErrorToText, i as installRequestBodyLimitGuard, s as readRequestBodyWithLimit } from "./http-body-JDY8COhf.js";
import { r as applyBasicWebhookRequestGuards } from "./webhook-request-guards-BcAHiveC.js";
import { a as buildPendingHistoryContextFromMap, s as clearHistoryEntriesIfEnabled, u as recordPendingHistoryEntryIfEnabled } from "./reply-history-Zf0VECih.js";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import * as http from "http";
import * as crypto$1 from "crypto";
//#region extensions/feishu/src/bot-content.ts
function resolveFeishuGroupSession(params) {
	const { chatId, senderOpenId, messageId, rootId, threadId, groupConfig, feishuCfg } = params;
	const normalizedThreadId = threadId?.trim();
	const normalizedRootId = rootId?.trim();
	const threadReply = Boolean(normalizedThreadId || normalizedRootId);
	const replyInThread = (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled" || threadReply;
	const legacyTopicSessionMode = groupConfig?.topicSessionMode ?? feishuCfg?.topicSessionMode ?? "disabled";
	const groupSessionScope = groupConfig?.groupSessionScope ?? feishuCfg?.groupSessionScope ?? (legacyTopicSessionMode === "enabled" ? "group_topic" : "group");
	const topicScope = groupSessionScope === "group_topic" || groupSessionScope === "group_topic_sender" ? normalizedRootId ?? normalizedThreadId ?? (replyInThread ? messageId : null) : null;
	let peerId = chatId;
	switch (groupSessionScope) {
		case "group_sender":
			peerId = buildFeishuConversationId({
				chatId,
				scope: "group_sender",
				senderOpenId
			});
			break;
		case "group_topic":
			peerId = topicScope ? buildFeishuConversationId({
				chatId,
				scope: "group_topic",
				topicId: topicScope
			}) : chatId;
			break;
		case "group_topic_sender":
			peerId = topicScope ? buildFeishuConversationId({
				chatId,
				scope: "group_topic_sender",
				topicId: topicScope,
				senderOpenId
			}) : buildFeishuConversationId({
				chatId,
				scope: "group_sender",
				senderOpenId
			});
			break;
		default:
			peerId = chatId;
			break;
	}
	return {
		peerId,
		parentPeer: topicScope && (groupSessionScope === "group_topic" || groupSessionScope === "group_topic_sender") ? {
			kind: "group",
			id: chatId
		} : null,
		groupSessionScope,
		replyInThread,
		threadReply
	};
}
function parseMessageContent(content, messageType) {
	if (messageType === "post") return parsePostContent(content).textContent;
	try {
		const parsed = JSON.parse(content);
		if (messageType === "text") return parsed.text || "";
		if (messageType === "share_chat") {
			if (parsed && typeof parsed === "object") {
				const share = parsed;
				if (typeof share.body === "string" && share.body.trim()) return share.body.trim();
				if (typeof share.summary === "string" && share.summary.trim()) return share.summary.trim();
				if (typeof share.share_chat_id === "string" && share.share_chat_id.trim()) return `[Forwarded message: ${share.share_chat_id.trim()}]`;
			}
			return "[Forwarded message]";
		}
		if (messageType === "merge_forward") return "[Merged and Forwarded Message - loading...]";
		return content;
	} catch {
		return content;
	}
}
function formatSubMessageContent(content, contentType) {
	try {
		const parsed = JSON.parse(content);
		switch (contentType) {
			case "text": return parsed.text || content;
			case "post": return parsePostContent(content).textContent;
			case "image": return "[Image]";
			case "file": return `[File: ${parsed.file_name || "unknown"}]`;
			case "audio": return "[Audio]";
			case "video": return "[Video]";
			case "sticker": return "[Sticker]";
			case "merge_forward": return "[Nested Merged Forward]";
			default: return `[${contentType}]`;
		}
	} catch {
		return content;
	}
}
function parseMergeForwardContent(params) {
	const { content, log } = params;
	const maxMessages = 50;
	log?.("feishu: parsing merge_forward sub-messages from API response");
	let items;
	try {
		items = JSON.parse(content);
	} catch {
		log?.("feishu: merge_forward items parse failed");
		return "[Merged and Forwarded Message - parse error]";
	}
	if (!Array.isArray(items) || items.length === 0) return "[Merged and Forwarded Message - no sub-messages]";
	const subMessages = items.filter((item) => item.upper_message_id);
	if (subMessages.length === 0) return "[Merged and Forwarded Message - no sub-messages found]";
	log?.(`feishu: merge_forward contains ${subMessages.length} sub-messages`);
	subMessages.sort((a, b) => parseInt(a.create_time || "0", 10) - parseInt(b.create_time || "0", 10));
	const lines = ["[Merged and Forwarded Messages]"];
	for (const item of subMessages.slice(0, maxMessages)) lines.push(`- ${formatSubMessageContent(item.body?.content || "", item.msg_type || "text")}`);
	if (subMessages.length > maxMessages) lines.push(`... and ${subMessages.length - maxMessages} more messages`);
	return lines.join("\n");
}
function checkBotMentioned(event, botOpenId) {
	if (!botOpenId) return false;
	if ((event.message.content ?? "").includes("@_all")) return true;
	const mentions = event.message.mentions ?? [];
	if (mentions.length > 0) return mentions.some((mention) => mention.id.open_id === botOpenId);
	if (event.message.message_type === "post") return parsePostContent(event.message.content).mentionedOpenIds.some((id) => id === botOpenId);
	return false;
}
function normalizeMentions(text, mentions, botStripId) {
	if (!mentions || mentions.length === 0) return text;
	const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const escapeName = (value) => value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let result = text;
	for (const mention of mentions) {
		const mentionId = mention.id.open_id;
		const replacement = botStripId && mentionId === botStripId ? "" : mentionId ? `<at user_id="${mentionId}">${escapeName(mention.name)}</at>` : `@${mention.name}`;
		result = result.replace(new RegExp(escaped(mention.key), "g"), () => replacement).trim();
	}
	return result;
}
function normalizeFeishuCommandProbeBody(text) {
	if (!text) return "";
	return text.replace(/<at\b[^>]*>[^<]*<\/at>/giu, " ").replace(/(^|\s)@[^/\s]+(?=\s|$|\/)/gu, "$1").replace(/\s+/g, " ").trim();
}
function parseMediaKeys(content, messageType) {
	try {
		const parsed = JSON.parse(content);
		const imageKey = normalizeFeishuExternalKey(parsed.image_key);
		const fileKey = normalizeFeishuExternalKey(parsed.file_key);
		switch (messageType) {
			case "image": return {
				imageKey,
				fileName: parsed.file_name
			};
			case "file":
			case "audio":
			case "sticker": return {
				fileKey,
				fileName: parsed.file_name
			};
			case "video":
			case "media": return {
				fileKey,
				imageKey,
				fileName: parsed.file_name
			};
			default: return {};
		}
	} catch {
		return {};
	}
}
function toMessageResourceType(messageType) {
	return messageType === "image" ? "image" : "file";
}
function inferPlaceholder(messageType) {
	switch (messageType) {
		case "image": return "<media:image>";
		case "file": return "<media:document>";
		case "audio": return "<media:audio>";
		case "video":
		case "media": return "<media:video>";
		case "sticker": return "<media:sticker>";
		default: return "<media:document>";
	}
}
async function resolveFeishuMediaList(params) {
	const { cfg, messageId, messageType, content, maxBytes, log, accountId } = params;
	if (![
		"image",
		"file",
		"audio",
		"video",
		"media",
		"sticker",
		"post"
	].includes(messageType)) return [];
	const out = [];
	const core = getFeishuRuntime();
	if (messageType === "post") {
		const { imageKeys, mediaKeys } = parsePostContent(content);
		if (imageKeys.length === 0 && mediaKeys.length === 0) return [];
		if (imageKeys.length > 0) log?.(`feishu: post message contains ${imageKeys.length} embedded image(s)`);
		if (mediaKeys.length > 0) log?.(`feishu: post message contains ${mediaKeys.length} embedded media file(s)`);
		for (const imageKey of imageKeys) try {
			const result = await downloadMessageResourceFeishu({
				cfg,
				messageId,
				fileKey: imageKey,
				type: "image",
				accountId
			});
			const contentType = result.contentType ?? await core.media.detectMime({ buffer: result.buffer });
			const saved = await core.channel.media.saveMediaBuffer(result.buffer, contentType, "inbound", maxBytes);
			out.push({
				path: saved.path,
				contentType: saved.contentType,
				placeholder: "<media:image>"
			});
			log?.(`feishu: downloaded embedded image ${imageKey}, saved to ${saved.path}`);
		} catch (err) {
			log?.(`feishu: failed to download embedded image ${imageKey}: ${String(err)}`);
		}
		for (const media of mediaKeys) try {
			const result = await downloadMessageResourceFeishu({
				cfg,
				messageId,
				fileKey: media.fileKey,
				type: "file",
				accountId
			});
			const contentType = result.contentType ?? await core.media.detectMime({ buffer: result.buffer });
			const saved = await core.channel.media.saveMediaBuffer(result.buffer, contentType, "inbound", maxBytes);
			out.push({
				path: saved.path,
				contentType: saved.contentType,
				placeholder: "<media:video>"
			});
			log?.(`feishu: downloaded embedded media ${media.fileKey}, saved to ${saved.path}`);
		} catch (err) {
			log?.(`feishu: failed to download embedded media ${media.fileKey}: ${String(err)}`);
		}
		return out;
	}
	const mediaKeys = parseMediaKeys(content, messageType);
	if (!mediaKeys.imageKey && !mediaKeys.fileKey) return [];
	try {
		const fileKey = mediaKeys.fileKey || mediaKeys.imageKey;
		if (!fileKey) return [];
		const result = await downloadMessageResourceFeishu({
			cfg,
			messageId,
			fileKey,
			type: toMessageResourceType(messageType),
			accountId
		});
		const contentType = result.contentType ?? await core.media.detectMime({ buffer: result.buffer });
		const saved = await core.channel.media.saveMediaBuffer(result.buffer, contentType, "inbound", maxBytes, result.fileName || mediaKeys.fileName);
		out.push({
			path: saved.path,
			contentType: saved.contentType,
			placeholder: inferPlaceholder(messageType)
		});
		log?.(`feishu: downloaded ${messageType} media, saved to ${saved.path}`);
	} catch (err) {
		log?.(`feishu: failed to download ${messageType} media: ${String(err)}`);
	}
	return out;
}
//#endregion
//#region extensions/feishu/src/bot-sender-name.ts
const IGNORED_PERMISSION_SCOPE_TOKENS = ["contact:contact.base:readonly"];
const FEISHU_SCOPE_CORRECTIONS = { "contact:contact.base:readonly": "contact:user.base:readonly" };
const SENDER_NAME_TTL_MS = 600 * 1e3;
const senderNameCache = /* @__PURE__ */ new Map();
function correctFeishuScopeInUrl(url) {
	let corrected = url;
	for (const [wrong, right] of Object.entries(FEISHU_SCOPE_CORRECTIONS)) {
		corrected = corrected.replaceAll(encodeURIComponent(wrong), encodeURIComponent(right));
		corrected = corrected.replaceAll(wrong, right);
	}
	return corrected;
}
function shouldSuppressPermissionErrorNotice(permissionError) {
	const message = permissionError.message.toLowerCase();
	return IGNORED_PERMISSION_SCOPE_TOKENS.some((token) => message.includes(token));
}
function extractPermissionError(err) {
	if (!err || typeof err !== "object") return null;
	const data = err.response?.data;
	if (!data || typeof data !== "object") return null;
	const feishuErr = data;
	if (feishuErr.code !== 99991672) return null;
	const msg = feishuErr.msg ?? "";
	const urlMatch = msg.match(/https:\/\/[^\s,]+\/app\/[^\s,]+/);
	return {
		code: feishuErr.code,
		message: msg,
		grantUrl: urlMatch?.[0] ? correctFeishuScopeInUrl(urlMatch[0]) : void 0
	};
}
function resolveSenderLookupIdType(senderId) {
	const trimmed = senderId.trim();
	if (trimmed.startsWith("ou_")) return "open_id";
	if (trimmed.startsWith("on_")) return "union_id";
	return "user_id";
}
async function resolveFeishuSenderName(params) {
	const { account, senderId, log } = params;
	if (!account.configured) return {};
	const normalizedSenderId = senderId.trim();
	if (!normalizedSenderId) return {};
	const cached = senderNameCache.get(normalizedSenderId);
	const now = Date.now();
	if (cached && cached.expireAt > now) return { name: cached.name };
	try {
		const client = createFeishuClient(account);
		const userIdType = resolveSenderLookupIdType(normalizedSenderId);
		const user = (await client.contact.user.get({
			path: { user_id: normalizedSenderId },
			params: { user_id_type: userIdType }
		})).data?.user;
		const name = user?.name ?? user?.nickname ?? user?.en_name;
		if (name) {
			senderNameCache.set(normalizedSenderId, {
				name,
				expireAt: now + SENDER_NAME_TTL_MS
			});
			return { name };
		}
		return {};
	} catch (err) {
		const permErr = extractPermissionError(err);
		if (permErr) {
			if (shouldSuppressPermissionErrorNotice(permErr)) {
				log(`feishu: ignoring stale permission scope error: ${permErr.message}`);
				return {};
			}
			log(`feishu: permission error resolving sender name: code=${permErr.code}`);
			return { permissionError: permErr };
		}
		log(`feishu: failed to resolve sender name for ${normalizedSenderId}: ${String(err)}`);
		return {};
	}
}
//#endregion
//#region extensions/feishu/src/dedup.ts
const DEDUP_TTL_MS = 1440 * 60 * 1e3;
const MEMORY_MAX_SIZE = 1e3;
const FILE_MAX_ENTRIES = 1e4;
const EVENT_DEDUP_TTL_MS = 300 * 1e3;
const EVENT_MEMORY_MAX_SIZE = 2e3;
const memoryDedupe = createDedupeCache({
	ttlMs: DEDUP_TTL_MS,
	maxSize: MEMORY_MAX_SIZE
});
const processingClaims = createDedupeCache({
	ttlMs: EVENT_DEDUP_TTL_MS,
	maxSize: EVENT_MEMORY_MAX_SIZE
});
function resolveStateDirFromEnv(env = process.env) {
	const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
	if (stateOverride) return stateOverride;
	if (env.VITEST || env.NODE_ENV === "test") return path.join(os.tmpdir(), ["openclaw-vitest", String(process.pid)].join("-"));
	return path.join(os.homedir(), ".openclaw");
}
function resolveNamespaceFilePath(namespace) {
	const safe = namespace.replace(/[^a-zA-Z0-9_-]/g, "_");
	return path.join(resolveStateDirFromEnv(), "feishu", "dedup", `${safe}.json`);
}
const persistentDedupe = createPersistentDedupe({
	ttlMs: DEDUP_TTL_MS,
	memoryMaxSize: MEMORY_MAX_SIZE,
	fileMaxEntries: FILE_MAX_ENTRIES,
	resolveFilePath: resolveNamespaceFilePath
});
function resolveEventDedupeKey(namespace, messageId) {
	const trimmed = messageId?.trim();
	if (!trimmed) return null;
	return `${namespace}:${trimmed}`;
}
function normalizeMessageId(messageId) {
	const trimmed = messageId?.trim();
	return trimmed ? trimmed : null;
}
function resolveMemoryDedupeKey(namespace, messageId) {
	const trimmed = normalizeMessageId(messageId);
	if (!trimmed) return null;
	return `${namespace}:${trimmed}`;
}
function tryBeginFeishuMessageProcessing(messageId, namespace = "global") {
	return !processingClaims.check(resolveEventDedupeKey(namespace, messageId));
}
function releaseFeishuMessageProcessing(messageId, namespace = "global") {
	processingClaims.delete(resolveEventDedupeKey(namespace, messageId));
}
async function finalizeFeishuMessageProcessing(params) {
	const { messageId, namespace = "global", log, claimHeld = false } = params;
	const normalizedMessageId = normalizeMessageId(messageId);
	const memoryKey = resolveMemoryDedupeKey(namespace, messageId);
	if (!memoryKey || !normalizedMessageId) return false;
	if (!claimHeld && !tryBeginFeishuMessageProcessing(normalizedMessageId, namespace)) return false;
	if (!tryRecordMessage(memoryKey)) {
		releaseFeishuMessageProcessing(normalizedMessageId, namespace);
		return false;
	}
	if (!await tryRecordMessagePersistent(normalizedMessageId, namespace, log)) {
		releaseFeishuMessageProcessing(normalizedMessageId, namespace);
		return false;
	}
	return true;
}
async function recordProcessedFeishuMessage(messageId, namespace = "global", log) {
	const normalizedMessageId = normalizeMessageId(messageId);
	const memoryKey = resolveMemoryDedupeKey(namespace, messageId);
	if (!memoryKey || !normalizedMessageId) return false;
	tryRecordMessage(memoryKey);
	return await tryRecordMessagePersistent(normalizedMessageId, namespace, log);
}
async function hasProcessedFeishuMessage(messageId, namespace = "global", log) {
	const normalizedMessageId = normalizeMessageId(messageId);
	const memoryKey = resolveMemoryDedupeKey(namespace, messageId);
	if (!memoryKey || !normalizedMessageId) return false;
	if (hasRecordedMessage(memoryKey)) return true;
	return hasRecordedMessagePersistent(normalizedMessageId, namespace, log);
}
/**
* Synchronous dedup — memory only.
* Kept for backward compatibility; prefer {@link tryRecordMessagePersistent}.
*/
function tryRecordMessage(messageId) {
	return !memoryDedupe.check(messageId);
}
function hasRecordedMessage(messageId) {
	const trimmed = messageId.trim();
	if (!trimmed) return false;
	return memoryDedupe.peek(trimmed);
}
async function tryRecordMessagePersistent(messageId, namespace = "global", log) {
	return persistentDedupe.checkAndRecord(messageId, {
		namespace,
		onDiskError: (error) => {
			log?.(`feishu-dedup: disk error, falling back to memory: ${String(error)}`);
		}
	});
}
async function hasRecordedMessagePersistent(messageId, namespace = "global", log) {
	const trimmed = messageId.trim();
	if (!trimmed) return false;
	const now = Date.now();
	const filePath = resolveNamespaceFilePath(namespace);
	try {
		const { value } = await readJsonFileWithFallback(filePath, {});
		const seenAt = value[trimmed];
		if (typeof seenAt !== "number" || !Number.isFinite(seenAt)) return false;
		return DEDUP_TTL_MS <= 0 || now - seenAt < DEDUP_TTL_MS;
	} catch (error) {
		log?.(`feishu-dedup: persistent peek failed: ${String(error)}`);
		return false;
	}
}
async function warmupDedupFromDisk(namespace, log) {
	return persistentDedupe.warmup(namespace, (error) => {
		log?.(`feishu-dedup: warmup disk error: ${String(error)}`);
	});
}
//#endregion
//#region extensions/feishu/src/dynamic-agent.ts
/**
* Check if a dynamic agent should be created for a DM user and create it if needed.
* This creates a unique agent instance with its own workspace for each DM user.
*/
async function maybeCreateDynamicAgent(params) {
	const { cfg, runtime, senderOpenId, dynamicCfg, log } = params;
	const existingBindings = cfg.bindings ?? [];
	if (existingBindings.some((b) => b.match?.channel === "feishu" && b.match?.peer?.kind === "direct" && b.match?.peer?.id === senderOpenId)) return {
		created: false,
		updatedCfg: cfg
	};
	if (dynamicCfg.maxAgents !== void 0) {
		if ((cfg.agents?.list ?? []).filter((a) => a.id.startsWith("feishu-")).length >= dynamicCfg.maxAgents) {
			log(`feishu: maxAgents limit (${dynamicCfg.maxAgents}) reached, not creating agent for ${senderOpenId}`);
			return {
				created: false,
				updatedCfg: cfg
			};
		}
	}
	const agentId = `feishu-${senderOpenId}`;
	if ((cfg.agents?.list ?? []).find((a) => a.id === agentId)) {
		log(`feishu: agent "${agentId}" exists, adding missing binding for ${senderOpenId}`);
		const updatedCfg = {
			...cfg,
			bindings: [...existingBindings, {
				agentId,
				match: {
					channel: "feishu",
					peer: {
						kind: "direct",
						id: senderOpenId
					}
				}
			}]
		};
		await runtime.config.writeConfigFile(updatedCfg);
		return {
			created: true,
			updatedCfg,
			agentId
		};
	}
	const workspaceTemplate = dynamicCfg.workspaceTemplate ?? "~/.openclaw/workspace-{agentId}";
	const agentDirTemplate = dynamicCfg.agentDirTemplate ?? "~/.openclaw/agents/{agentId}/agent";
	const workspace = resolveUserPath(workspaceTemplate.replace("{userId}", senderOpenId).replace("{agentId}", agentId));
	const agentDir = resolveUserPath(agentDirTemplate.replace("{userId}", senderOpenId).replace("{agentId}", agentId));
	log(`feishu: creating dynamic agent "${agentId}" for user ${senderOpenId}`);
	log(`  workspace: ${workspace}`);
	log(`  agentDir: ${agentDir}`);
	await fsSync.promises.mkdir(workspace, { recursive: true });
	await fsSync.promises.mkdir(agentDir, { recursive: true });
	const updatedCfg = {
		...cfg,
		agents: {
			...cfg.agents,
			list: [...cfg.agents?.list ?? [], {
				id: agentId,
				workspace,
				agentDir
			}]
		},
		bindings: [...existingBindings, {
			agentId,
			match: {
				channel: "feishu",
				peer: {
					kind: "direct",
					id: senderOpenId
				}
			}
		}]
	};
	await runtime.config.writeConfigFile(updatedCfg);
	return {
		created: true,
		updatedCfg,
		agentId
	};
}
/**
* Resolve a path that may start with ~ to the user's home directory.
*/
function resolveUserPath(p) {
	if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
	return p;
}
//#endregion
//#region extensions/feishu/src/streaming-card.ts
const tokenCache = /* @__PURE__ */ new Map();
function resolveApiBase(domain) {
	if (domain === "lark") return "https://open.larksuite.com/open-apis";
	if (domain && domain !== "feishu" && domain.startsWith("http")) return `${domain.replace(/\/+$/, "")}/open-apis`;
	return "https://open.feishu.cn/open-apis";
}
function resolveAllowedHostnames(domain) {
	if (domain === "lark") return ["open.larksuite.com"];
	if (domain && domain !== "feishu" && domain.startsWith("http")) try {
		return [new URL(domain).hostname];
	} catch {
		return [];
	}
	return ["open.feishu.cn"];
}
async function getToken(creds) {
	const key = `${creds.domain ?? "feishu"}|${creds.appId}`;
	const cached = tokenCache.get(key);
	if (cached && cached.expiresAt > Date.now() + 6e4) return cached.token;
	const { response, release } = await fetchWithSsrFGuard({
		url: `${resolveApiBase(creds.domain)}/auth/v3/tenant_access_token/internal`,
		init: {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				app_id: creds.appId,
				app_secret: creds.appSecret
			})
		},
		policy: { allowedHostnames: resolveAllowedHostnames(creds.domain) },
		auditContext: "feishu.streaming-card.token"
	});
	if (!response.ok) {
		await release();
		throw new Error(`Token request failed with HTTP ${response.status}`);
	}
	const data = await response.json();
	await release();
	if (data.code !== 0 || !data.tenant_access_token) throw new Error(`Token error: ${data.msg}`);
	tokenCache.set(key, {
		token: data.tenant_access_token,
		expiresAt: Date.now() + (data.expire ?? 7200) * 1e3
	});
	return data.tenant_access_token;
}
function truncateSummary(text, max = 50) {
	if (!text) return "";
	const clean = text.replace(/\n/g, " ").trim();
	return clean.length <= max ? clean : clean.slice(0, max - 3) + "...";
}
function mergeStreamingText(previousText, nextText) {
	const previous = typeof previousText === "string" ? previousText : "";
	const next = typeof nextText === "string" ? nextText : "";
	if (!next) return previous;
	if (!previous || next === previous) return next;
	if (next.startsWith(previous)) return next;
	if (previous.startsWith(next)) return previous;
	if (next.includes(previous)) return next;
	if (previous.includes(next)) return previous;
	const maxOverlap = Math.min(previous.length, next.length);
	for (let overlap = maxOverlap; overlap > 0; overlap -= 1) if (previous.slice(-overlap) === next.slice(0, overlap)) return `${previous}${next.slice(overlap)}`;
	return `${previous}${next}`;
}
function resolveStreamingCardSendMode(options) {
	if (options?.replyToMessageId) return "reply";
	if (options?.rootId) return "root_create";
	return "create";
}
/** Streaming card session manager */
var FeishuStreamingSession = class {
	constructor(client, creds, log) {
		this.state = null;
		this.queue = Promise.resolve();
		this.closed = false;
		this.lastUpdateTime = 0;
		this.pendingText = null;
		this.flushTimer = null;
		this.updateThrottleMs = 100;
		this.client = client;
		this.creds = creds;
		this.log = log;
	}
	async start(receiveId, receiveIdType = "chat_id", options) {
		if (this.state) return;
		const apiBase = resolveApiBase(this.creds.domain);
		const elements = [{
			tag: "markdown",
			content: "⏳ Thinking...",
			element_id: "content"
		}];
		if (options?.note) {
			elements.push({ tag: "hr" });
			elements.push({
				tag: "markdown",
				content: `<font color='grey'>${options.note}</font>`,
				element_id: "note"
			});
		}
		const cardJson = {
			schema: "2.0",
			config: {
				streaming_mode: true,
				summary: { content: "[Generating...]" },
				streaming_config: {
					print_frequency_ms: { default: 50 },
					print_step: { default: 1 }
				}
			},
			body: { elements }
		};
		if (options?.header) cardJson.header = {
			title: {
				tag: "plain_text",
				content: options.header.title
			},
			template: resolveFeishuCardTemplate(options.header.template) ?? "blue"
		};
		const { response: createRes, release: releaseCreate } = await fetchWithSsrFGuard({
			url: `${apiBase}/cardkit/v1/cards`,
			init: {
				method: "POST",
				headers: {
					Authorization: `Bearer ${await getToken(this.creds)}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					type: "card_json",
					data: JSON.stringify(cardJson)
				})
			},
			policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
			auditContext: "feishu.streaming-card.create"
		});
		if (!createRes.ok) {
			await releaseCreate();
			throw new Error(`Create card request failed with HTTP ${createRes.status}`);
		}
		const createData = await createRes.json();
		await releaseCreate();
		if (createData.code !== 0 || !createData.data?.card_id) throw new Error(`Create card failed: ${createData.msg}`);
		const cardId = createData.data.card_id;
		const cardContent = JSON.stringify({
			type: "card",
			data: { card_id: cardId }
		});
		let sendRes;
		const sendOptions = options ?? {};
		const sendMode = resolveStreamingCardSendMode(sendOptions);
		if (sendMode === "reply") sendRes = await this.client.im.message.reply({
			path: { message_id: sendOptions.replyToMessageId },
			data: {
				msg_type: "interactive",
				content: cardContent,
				...sendOptions.replyInThread ? { reply_in_thread: true } : {}
			}
		});
		else if (sendMode === "root_create") sendRes = await this.client.im.message.create({
			params: { receive_id_type: receiveIdType },
			data: Object.assign({
				receive_id: receiveId,
				msg_type: "interactive",
				content: cardContent
			}, { root_id: sendOptions.rootId })
		});
		else sendRes = await this.client.im.message.create({
			params: { receive_id_type: receiveIdType },
			data: {
				receive_id: receiveId,
				msg_type: "interactive",
				content: cardContent
			}
		});
		if (sendRes.code !== 0 || !sendRes.data?.message_id) throw new Error(`Send card failed: ${sendRes.msg}`);
		this.state = {
			cardId,
			messageId: sendRes.data.message_id,
			sequence: 1,
			currentText: "",
			hasNote: !!options?.note
		};
		this.log?.(`Started streaming: cardId=${cardId}, messageId=${sendRes.data.message_id}`);
	}
	async updateCardContent(text, onError) {
		if (!this.state) return;
		const apiBase = resolveApiBase(this.creds.domain);
		this.state.sequence += 1;
		await fetchWithSsrFGuard({
			url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/content/content`,
			init: {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${await getToken(this.creds)}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					content: text,
					sequence: this.state.sequence,
					uuid: `s_${this.state.cardId}_${this.state.sequence}`
				})
			},
			policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
			auditContext: "feishu.streaming-card.update"
		}).then(async ({ release }) => {
			await release();
		}).catch((error) => onError?.(error));
	}
	async update(text) {
		if (!this.state || this.closed) return;
		const mergedInput = mergeStreamingText(this.pendingText ?? this.state.currentText, text);
		if (!mergedInput || mergedInput === this.state.currentText) return;
		const now = Date.now();
		if (now - this.lastUpdateTime < this.updateThrottleMs) {
			this.pendingText = mergedInput;
			return;
		}
		this.pendingText = null;
		this.lastUpdateTime = now;
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}
		this.queue = this.queue.then(async () => {
			if (!this.state || this.closed) return;
			const mergedText = mergeStreamingText(this.state.currentText, mergedInput);
			if (!mergedText || mergedText === this.state.currentText) return;
			this.state.currentText = mergedText;
			await this.updateCardContent(mergedText, (e) => this.log?.(`Update failed: ${String(e)}`));
		});
		await this.queue;
	}
	async updateNoteContent(note) {
		if (!this.state || !this.state.hasNote) return;
		const apiBase = resolveApiBase(this.creds.domain);
		this.state.sequence += 1;
		await fetchWithSsrFGuard({
			url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/note/content`,
			init: {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${await getToken(this.creds)}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					content: `<font color='grey'>${note}</font>`,
					sequence: this.state.sequence,
					uuid: `n_${this.state.cardId}_${this.state.sequence}`
				})
			},
			policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
			auditContext: "feishu.streaming-card.note-update"
		}).then(async ({ release }) => {
			await release();
		}).catch((e) => this.log?.(`Note update failed: ${String(e)}`));
	}
	async close(finalText, options) {
		if (!this.state || this.closed) return;
		this.closed = true;
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}
		await this.queue;
		const pendingMerged = mergeStreamingText(this.state.currentText, this.pendingText ?? void 0);
		const text = finalText ? mergeStreamingText(pendingMerged, finalText) : pendingMerged;
		const apiBase = resolveApiBase(this.creds.domain);
		if (text && text !== this.state.currentText) {
			await this.updateCardContent(text);
			this.state.currentText = text;
		}
		if (options?.note) await this.updateNoteContent(options.note);
		this.state.sequence += 1;
		await fetchWithSsrFGuard({
			url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/settings`,
			init: {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${await getToken(this.creds)}`,
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify({
					settings: JSON.stringify({ config: {
						streaming_mode: false,
						summary: { content: truncateSummary(text) }
					} }),
					sequence: this.state.sequence,
					uuid: `c_${this.state.cardId}_${this.state.sequence}`
				})
			},
			policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
			auditContext: "feishu.streaming-card.close"
		}).then(async ({ release }) => {
			await release();
		}).catch((e) => this.log?.(`Close failed: ${String(e)}`));
		const finalState = this.state;
		this.state = null;
		this.pendingText = null;
		this.log?.(`Closed streaming: cardId=${finalState.cardId}`);
	}
	isActive() {
		return this.state !== null && !this.closed;
	}
};
//#endregion
//#region extensions/feishu/src/typing.ts
const TYPING_EMOJI = "Typing";
/**
* Feishu API error codes that indicate the caller should back off.
* These must propagate to the typing circuit breaker so the keepalive loop
* can trip and stop retrying.
*
* - 99991400: Rate limit (too many requests per second)
* - 99991403: Monthly API call quota exceeded
* - 429: Standard HTTP 429 returned as a Feishu SDK error code
*
* @see https://open.feishu.cn/document/server-docs/api-call-guide/generic-error-code
*/
const FEISHU_BACKOFF_CODES = new Set([
	99991400,
	99991403,
	429
]);
/**
* Custom error class for Feishu backoff conditions detected from non-throwing
* SDK responses. Carries a numeric `.code` so that `isFeishuBackoffError()`
* recognises it when the error is caught downstream.
*/
var FeishuBackoffError = class extends Error {
	constructor(code) {
		super(`Feishu API backoff: code ${code}`);
		this.name = "FeishuBackoffError";
		this.code = code;
	}
};
/**
* Check whether an error represents a rate-limit or quota-exceeded condition
* from the Feishu API that should stop the typing keepalive loop.
*
* Handles two shapes:
* 1. AxiosError with `response.status` and `response.data.code`
* 2. Feishu SDK error with a top-level `code` property
*/
function isFeishuBackoffError(err) {
	if (typeof err !== "object" || err === null) return false;
	const response = err.response;
	if (response) {
		if (response.status === 429) return true;
		if (typeof response.data?.code === "number" && FEISHU_BACKOFF_CODES.has(response.data.code)) return true;
	}
	const code = err.code;
	if (typeof code === "number" && FEISHU_BACKOFF_CODES.has(code)) return true;
	return false;
}
/**
* Check whether a Feishu SDK response object contains a backoff error code.
*
* The Feishu SDK sometimes returns a normal response (no throw) with an
* API-level error code in the response body. This must be detected so the
* circuit breaker can trip. See codex review on #28157.
*/
function getBackoffCodeFromResponse(response) {
	if (typeof response !== "object" || response === null) return;
	const code = response.code;
	if (typeof code === "number" && FEISHU_BACKOFF_CODES.has(code)) return code;
}
/**
* Add a typing indicator (reaction) to a message.
*
* Rate-limit and quota errors are re-thrown so the circuit breaker in
* `createTypingCallbacks` (typing-start-guard) can trip and stop the
* keepalive loop. See #28062.
*
* Also checks for backoff codes in non-throwing SDK responses (#28157).
*/
async function addTypingIndicator(params) {
	const { cfg, messageId, accountId, runtime } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) return {
		messageId,
		reactionId: null
	};
	const client = createFeishuClient(account);
	try {
		const response = await client.im.messageReaction.create({
			path: { message_id: messageId },
			data: { reaction_type: { emoji_type: TYPING_EMOJI } }
		});
		const backoffCode = getBackoffCodeFromResponse(response);
		if (backoffCode !== void 0) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] typing indicator response contains backoff code ${backoffCode}, stopping keepalive`);
			throw new FeishuBackoffError(backoffCode);
		}
		return {
			messageId,
			reactionId: response.data?.reaction_id ?? null
		};
	} catch (err) {
		if (isFeishuBackoffError(err)) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.("[feishu] typing indicator hit rate-limit/quota, stopping keepalive");
			throw err;
		}
		if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] failed to add typing indicator: ${String(err)}`);
		return {
			messageId,
			reactionId: null
		};
	}
}
/**
* Remove a typing indicator (reaction) from a message.
*
* Rate-limit and quota errors are re-thrown for the same reason as above.
*/
async function removeTypingIndicator(params) {
	const { cfg, state, accountId, runtime } = params;
	if (!state.reactionId) return;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) return;
	const client = createFeishuClient(account);
	try {
		const backoffCode = getBackoffCodeFromResponse(await client.im.messageReaction.delete({ path: {
			message_id: state.messageId,
			reaction_id: state.reactionId
		} }));
		if (backoffCode !== void 0) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] typing indicator removal response contains backoff code ${backoffCode}, stopping keepalive`);
			throw new FeishuBackoffError(backoffCode);
		}
	} catch (err) {
		if (isFeishuBackoffError(err)) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.("[feishu] typing indicator removal hit rate-limit/quota, stopping keepalive");
			throw err;
		}
		if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] failed to remove typing indicator: ${String(err)}`);
	}
}
//#endregion
//#region extensions/feishu/src/reply-dispatcher.ts
/** Detect if text contains markdown elements that benefit from card rendering */
function shouldUseCard(text) {
	return /```[\s\S]*?```/.test(text) || /\|.+\|[\r\n]+\|[-:| ]+\|/.test(text);
}
/** Maximum age (ms) for a message to receive a typing indicator reaction.
* Messages older than this are likely replays after context compaction (#30418). */
const TYPING_INDICATOR_MAX_AGE_MS = 2 * 6e4;
const MS_EPOCH_MIN = 0xe8d4a51000;
function normalizeEpochMs(timestamp) {
	if (!Number.isFinite(timestamp) || timestamp === void 0 || timestamp <= 0) return;
	return timestamp < MS_EPOCH_MIN ? timestamp * 1e3 : timestamp;
}
/** Build a card header from agent identity config. */
function resolveCardHeader(agentId, identity) {
	const name = identity?.name?.trim() || agentId;
	const emoji = identity?.emoji?.trim();
	return {
		title: emoji ? `${emoji} ${name}` : name,
		template: identity?.theme ?? "blue"
	};
}
/** Build a card note footer from agent identity and model context. */
function resolveCardNote(agentId, identity, prefixCtx) {
	const parts = [`Agent: ${identity?.name?.trim() || agentId}`];
	if (prefixCtx.model) parts.push(`Model: ${prefixCtx.model}`);
	if (prefixCtx.provider) parts.push(`Provider: ${prefixCtx.provider}`);
	return parts.join(" | ");
}
function createFeishuReplyDispatcher(params) {
	const core = getFeishuRuntime();
	const { cfg, agentId, chatId, replyToMessageId, skipReplyToInMessages, replyInThread, threadReply, rootId, mentionTargets, accountId, identity } = params;
	const sendReplyToMessageId = skipReplyToInMessages ? void 0 : replyToMessageId;
	const threadReplyMode = threadReply === true;
	const effectiveReplyInThread = threadReplyMode ? true : replyInThread;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	const prefixContext = createReplyPrefixContext({
		cfg,
		agentId
	});
	let typingState = null;
	const { typingCallbacks } = createChannelReplyPipeline({
		cfg,
		agentId,
		channel: "feishu",
		accountId,
		typing: {
			start: async () => {
				if (!(account.config.typingIndicator ?? true)) return;
				if (!replyToMessageId) return;
				const messageCreateTimeMs = normalizeEpochMs(params.messageCreateTimeMs);
				if (messageCreateTimeMs !== void 0 && Date.now() - messageCreateTimeMs > TYPING_INDICATOR_MAX_AGE_MS) return;
				if (typingState?.reactionId) return;
				typingState = await addTypingIndicator({
					cfg,
					messageId: replyToMessageId,
					accountId,
					runtime: params.runtime
				});
			},
			stop: async () => {
				if (!typingState) return;
				await removeTypingIndicator({
					cfg,
					state: typingState,
					accountId,
					runtime: params.runtime
				});
				typingState = null;
			},
			onStartError: (err) => logTypingFailure({
				log: (message) => params.runtime.log?.(message),
				channel: "feishu",
				action: "start",
				error: err
			}),
			onStopError: (err) => logTypingFailure({
				log: (message) => params.runtime.log?.(message),
				channel: "feishu",
				action: "stop",
				error: err
			})
		}
	});
	const textChunkLimit = core.channel.text.resolveTextChunkLimit(cfg, "feishu", accountId, { fallbackLimit: 4e3 });
	const chunkMode = core.channel.text.resolveChunkMode(cfg, "feishu");
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg,
		channel: "feishu"
	});
	const renderMode = account.config?.renderMode ?? "auto";
	const streamingEnabled = !threadReplyMode && account.config?.streaming !== false && renderMode !== "raw";
	let streaming = null;
	let streamText = "";
	let lastPartial = "";
	let reasoningText = "";
	const deliveredFinalTexts = /* @__PURE__ */ new Set();
	let partialUpdateQueue = Promise.resolve();
	let streamingStartPromise = null;
	const formatReasoningPrefix = (thinking) => {
		if (!thinking) return "";
		return `> 💭 **Thinking**\n${thinking.replace(/^Reasoning:\n/, "").replace(/^_(.*)_$/gm, "$1").split("\n").map((line) => `> ${line}`).join("\n")}`;
	};
	const buildCombinedStreamText = (thinking, answer) => {
		const parts = [];
		if (thinking) parts.push(formatReasoningPrefix(thinking));
		if (thinking && answer) parts.push("\n\n---\n\n");
		if (answer) parts.push(answer);
		return parts.join("");
	};
	const flushStreamingCardUpdate = (combined) => {
		partialUpdateQueue = partialUpdateQueue.then(async () => {
			if (streamingStartPromise) await streamingStartPromise;
			if (streaming?.isActive()) await streaming.update(combined);
		});
	};
	const queueStreamingUpdate = (nextText, options) => {
		if (!nextText) return;
		if (options?.dedupeWithLastPartial && nextText === lastPartial) return;
		if (options?.dedupeWithLastPartial) lastPartial = nextText;
		streamText = (options?.mode ?? "snapshot") === "delta" ? `${streamText}${nextText}` : mergeStreamingText(streamText, nextText);
		flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
	};
	const queueReasoningUpdate = (nextThinking) => {
		if (!nextThinking) return;
		reasoningText = nextThinking;
		flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
	};
	const startStreaming = () => {
		if (!streamingEnabled || streamingStartPromise || streaming) return;
		streamingStartPromise = (async () => {
			const creds = account.appId && account.appSecret ? {
				appId: account.appId,
				appSecret: account.appSecret,
				domain: account.domain
			} : null;
			if (!creds) return;
			streaming = new FeishuStreamingSession(createFeishuClient(account), creds, (message) => params.runtime.log?.(`feishu[${account.accountId}] ${message}`));
			try {
				const cardHeader = resolveCardHeader(agentId, identity);
				const cardNote = resolveCardNote(agentId, identity, prefixContext.prefixContext);
				await streaming.start(chatId, resolveReceiveIdType(chatId), {
					replyToMessageId,
					replyInThread: effectiveReplyInThread,
					rootId,
					header: cardHeader,
					note: cardNote
				});
			} catch (error) {
				params.runtime.error?.(`feishu: streaming start failed: ${String(error)}`);
				streaming = null;
				streamingStartPromise = null;
			}
		})();
	};
	const closeStreaming = async () => {
		if (streamingStartPromise) await streamingStartPromise;
		await partialUpdateQueue;
		if (streaming?.isActive()) {
			let text = buildCombinedStreamText(reasoningText, streamText);
			if (mentionTargets?.length) text = buildMentionedCardContent(mentionTargets, text);
			const finalNote = resolveCardNote(agentId, identity, prefixContext.prefixContext);
			await streaming.close(text, { note: finalNote });
		}
		streaming = null;
		streamingStartPromise = null;
		streamText = "";
		lastPartial = "";
		reasoningText = "";
	};
	const sendChunkedTextReply = async (params) => {
		const chunkSource = params.useCard ? params.text : core.channel.text.convertMarkdownTables(params.text, tableMode);
		const chunks = resolveTextChunksWithFallback(chunkSource, core.channel.text.chunkTextWithMode(chunkSource, textChunkLimit, chunkMode));
		for (const [index, chunk] of chunks.entries()) await params.sendChunk({
			chunk,
			isFirst: index === 0
		});
		if (params.infoKind === "final") deliveredFinalTexts.add(params.text);
	};
	const sendMediaReplies = async (payload) => {
		await sendMediaWithLeadingCaption({
			mediaUrls: resolveSendableOutboundReplyParts(payload).mediaUrls,
			caption: "",
			send: async ({ mediaUrl }) => {
				await sendMediaFeishu({
					cfg,
					to: chatId,
					mediaUrl,
					replyToMessageId: sendReplyToMessageId,
					replyInThread: effectiveReplyInThread,
					accountId
				});
			}
		});
	};
	const { dispatcher, replyOptions, markDispatchIdle } = core.channel.reply.createReplyDispatcherWithTyping({
		responsePrefix: prefixContext.responsePrefix,
		responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
		humanDelay: core.channel.reply.resolveHumanDelayConfig(cfg, agentId),
		onReplyStart: async () => {
			deliveredFinalTexts.clear();
			if (streamingEnabled && renderMode === "card") startStreaming();
			await typingCallbacks?.onReplyStart?.();
		},
		deliver: async (payload, info) => {
			const reply = resolveSendableOutboundReplyParts(payload);
			const text = reply.text;
			const hasText = reply.hasText;
			const hasMedia = reply.hasMedia;
			const skipTextForDuplicateFinal = info?.kind === "final" && hasText && deliveredFinalTexts.has(text);
			const shouldDeliverText = hasText && !skipTextForDuplicateFinal;
			if (!shouldDeliverText && !hasMedia) return;
			if (shouldDeliverText) {
				const useCard = renderMode === "card" || renderMode === "auto" && shouldUseCard(text);
				if (info?.kind === "block") {
					if (!(streamingEnabled && useCard)) return;
					startStreaming();
					if (streamingStartPromise) await streamingStartPromise;
				}
				if (info?.kind === "final" && streamingEnabled && useCard) {
					startStreaming();
					if (streamingStartPromise) await streamingStartPromise;
				}
				if (streaming?.isActive()) {
					if (info?.kind === "block") queueStreamingUpdate(text, { mode: "delta" });
					if (info?.kind === "final") {
						streamText = mergeStreamingText(streamText, text);
						await closeStreaming();
						deliveredFinalTexts.add(text);
					}
					if (hasMedia) await sendMediaReplies(payload);
					return;
				}
				if (useCard) {
					const cardHeader = resolveCardHeader(agentId, identity);
					const cardNote = resolveCardNote(agentId, identity, prefixContext.prefixContext);
					await sendChunkedTextReply({
						text,
						useCard: true,
						infoKind: info?.kind,
						sendChunk: async ({ chunk, isFirst }) => {
							await sendStructuredCardFeishu({
								cfg,
								to: chatId,
								text: chunk,
								replyToMessageId: sendReplyToMessageId,
								replyInThread: effectiveReplyInThread,
								mentions: isFirst ? mentionTargets : void 0,
								accountId,
								header: cardHeader,
								note: cardNote
							});
						}
					});
				} else await sendChunkedTextReply({
					text,
					useCard: false,
					infoKind: info?.kind,
					sendChunk: async ({ chunk, isFirst }) => {
						await sendMessageFeishu({
							cfg,
							to: chatId,
							text: chunk,
							replyToMessageId: sendReplyToMessageId,
							replyInThread: effectiveReplyInThread,
							mentions: isFirst ? mentionTargets : void 0,
							accountId
						});
					}
				});
			}
			if (hasMedia) await sendMediaReplies(payload);
		},
		onError: async (error, info) => {
			params.runtime.error?.(`feishu[${account.accountId}] ${info.kind} reply failed: ${String(error)}`);
			await closeStreaming();
			typingCallbacks?.onIdle?.();
		},
		onIdle: async () => {
			await closeStreaming();
			typingCallbacks?.onIdle?.();
		},
		onCleanup: () => {
			typingCallbacks?.onCleanup?.();
		}
	});
	return {
		dispatcher,
		replyOptions: {
			...replyOptions,
			onModelSelected: prefixContext.onModelSelected,
			disableBlockStreaming: true,
			onPartialReply: streamingEnabled ? (payload) => {
				if (!payload.text) return;
				queueStreamingUpdate(payload.text, {
					dedupeWithLastPartial: true,
					mode: "snapshot"
				});
			} : void 0,
			onReasoningStream: streamingEnabled ? (payload) => {
				if (!payload.text) return;
				startStreaming();
				queueReasoningUpdate(payload.text);
			} : void 0,
			onReasoningEnd: streamingEnabled ? () => {} : void 0
		},
		markDispatchIdle
	};
}
//#endregion
//#region extensions/feishu/src/bot.ts
const permissionErrorNotifiedAt = /* @__PURE__ */ new Map();
const PERMISSION_ERROR_COOLDOWN_MS = 300 * 1e3;
function resolveBroadcastAgents(cfg, peerId) {
	const broadcast = cfg.broadcast;
	if (!broadcast || typeof broadcast !== "object") return null;
	const agents = broadcast[peerId];
	if (!Array.isArray(agents) || agents.length === 0) return null;
	return agents;
}
function buildBroadcastSessionKey(baseSessionKey, originalAgentId, targetAgentId) {
	const prefix = `agent:${originalAgentId}:`;
	if (baseSessionKey.startsWith(prefix)) return `agent:${targetAgentId}:${baseSessionKey.slice(prefix.length)}`;
	return baseSessionKey;
}
/**
* Build media payload for inbound context.
* Similar to Discord's buildDiscordMediaPayload().
*/
function parseFeishuMessageEvent(event, botOpenId, _botName) {
	const rawContent = parseMessageContent(event.message.content, event.message.message_type);
	const mentionedBot = checkBotMentioned(event, botOpenId);
	const hasAnyMention = (event.message.mentions?.length ?? 0) > 0;
	const content = normalizeMentions(rawContent, event.message.mentions, botOpenId);
	const senderOpenId = event.sender.sender_id.open_id?.trim();
	const senderUserId = event.sender.sender_id.user_id?.trim();
	const senderFallbackId = senderOpenId || senderUserId || "";
	const ctx = {
		chatId: event.message.chat_id,
		messageId: event.message.message_id,
		senderId: senderUserId || senderOpenId || "",
		senderOpenId: senderFallbackId,
		chatType: event.message.chat_type,
		mentionedBot,
		hasAnyMention,
		rootId: event.message.root_id || void 0,
		parentId: event.message.parent_id || void 0,
		threadId: event.message.thread_id || void 0,
		content,
		contentType: event.message.message_type
	};
	if (isMentionForwardRequest(event, botOpenId)) {
		const mentionTargets = extractMentionTargets(event, botOpenId);
		if (mentionTargets.length > 0) ctx.mentionTargets = mentionTargets;
	}
	return ctx;
}
function buildFeishuAgentBody(params) {
	const { ctx, quotedContent, permissionErrorForAgent, botOpenId } = params;
	let messageBody = ctx.content;
	if (quotedContent) messageBody = `[Replying to: "${quotedContent}"]\n\n${ctx.content}`;
	messageBody = `${ctx.senderName ?? ctx.senderOpenId}: ${messageBody}`;
	if (ctx.hasAnyMention) {
		const botIdHint = botOpenId?.trim();
		messageBody += "\n\n[System: The content may include mention tags in the form <at user_id=\"...\">name</at>. Treat these as real mentions of Feishu entities (users or bots).]";
		if (botIdHint) messageBody += `\n[System: If user_id is "${botIdHint}", that mention refers to you.]`;
	}
	if (ctx.mentionTargets && ctx.mentionTargets.length > 0) {
		const targetNames = ctx.mentionTargets.map((t) => t.name).join(", ");
		messageBody += `\n\n[System: Your reply will automatically @mention: ${targetNames}. Do not write @xxx yourself.]`;
	}
	messageBody = `[message_id: ${ctx.messageId}]\n${messageBody}`;
	if (permissionErrorForAgent) {
		const grantUrl = permissionErrorForAgent.grantUrl ?? "";
		messageBody += `\n\n[System: The bot encountered a Feishu API permission error. Please inform the user about this issue and provide the permission grant URL for the admin to authorize. Permission grant URL: ${grantUrl}]`;
	}
	return messageBody;
}
async function handleFeishuMessage(params) {
	const { cfg, event, botOpenId, botName, runtime, chatHistories, accountId, processingClaimHeld = false } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	const feishuCfg = account.config;
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const messageId = event.message.message_id;
	if (!await finalizeFeishuMessageProcessing({
		messageId,
		namespace: account.accountId,
		log,
		claimHeld: processingClaimHeld
	})) {
		log(`feishu: skipping duplicate message ${messageId}`);
		return;
	}
	let ctx = parseFeishuMessageEvent(event, botOpenId, botName);
	const isGroup = ctx.chatType === "group";
	const isDirect = !isGroup;
	const senderUserId = event.sender.sender_id.user_id?.trim() || void 0;
	if (event.message.message_type === "merge_forward") {
		log(`feishu[${account.accountId}]: processing merge_forward message, fetching full content via API`);
		try {
			const response = await createFeishuClient(account).im.message.get({ path: { message_id: event.message.message_id } });
			if (response.code === 0 && response.data?.items && response.data.items.length > 0) {
				log(`feishu[${account.accountId}]: merge_forward API returned ${response.data.items.length} items`);
				const expandedContent = parseMergeForwardContent({
					content: JSON.stringify(response.data.items),
					log
				});
				ctx = {
					...ctx,
					content: expandedContent
				};
			} else {
				log(`feishu[${account.accountId}]: merge_forward API returned no items`);
				ctx = {
					...ctx,
					content: "[Merged and Forwarded Message - could not fetch]"
				};
			}
		} catch (err) {
			log(`feishu[${account.accountId}]: merge_forward fetch failed: ${String(err)}`);
			ctx = {
				...ctx,
				content: "[Merged and Forwarded Message - fetch error]"
			};
		}
	}
	let permissionErrorForAgent;
	if (feishuCfg?.resolveSenderNames ?? true) {
		const senderResult = await resolveFeishuSenderName({
			account,
			senderId: ctx.senderOpenId,
			log
		});
		if (senderResult.name) ctx = {
			...ctx,
			senderName: senderResult.name
		};
		if (senderResult.permissionError) {
			const appKey = account.appId ?? "default";
			const now = Date.now();
			if (now - (permissionErrorNotifiedAt.get(appKey) ?? 0) > PERMISSION_ERROR_COOLDOWN_MS) {
				permissionErrorNotifiedAt.set(appKey, now);
				permissionErrorForAgent = senderResult.permissionError;
			}
		}
	}
	log(`feishu[${account.accountId}]: received message from ${ctx.senderOpenId} in ${ctx.chatId} (${ctx.chatType})`);
	if (ctx.mentionTargets && ctx.mentionTargets.length > 0) {
		const names = ctx.mentionTargets.map((t) => t.name).join(", ");
		log(`feishu[${account.accountId}]: detected @ forward request, targets: [${names}]`);
	}
	const historyLimit = Math.max(0, feishuCfg?.historyLimit ?? cfg.messages?.groupChat?.historyLimit ?? 50);
	const groupConfig = isGroup ? resolveFeishuGroupConfig({
		cfg: feishuCfg,
		groupId: ctx.chatId
	}) : void 0;
	const groupSession = isGroup ? resolveFeishuGroupSession({
		chatId: ctx.chatId,
		senderOpenId: ctx.senderOpenId,
		messageId: ctx.messageId,
		rootId: ctx.rootId,
		threadId: ctx.threadId,
		groupConfig,
		feishuCfg
	}) : null;
	const groupHistoryKey = isGroup ? groupSession?.peerId ?? ctx.chatId : void 0;
	const dmPolicy = feishuCfg?.dmPolicy ?? "pairing";
	const configAllowFrom = feishuCfg?.allowFrom ?? [];
	const useAccessGroups = cfg.commands?.useAccessGroups !== false;
	const rawBroadcastAgents = isGroup ? resolveBroadcastAgents(cfg, ctx.chatId) : null;
	const broadcastAgents = rawBroadcastAgents ? [...new Set(rawBroadcastAgents.map((id) => normalizeAgentId(id)))] : null;
	const messageCreateTimeMs = event.message.create_time ? parseInt(event.message.create_time, 10) : Date.now();
	let requireMention = false;
	if (isGroup) {
		if (groupConfig?.enabled === false) {
			log(`feishu[${account.accountId}]: group ${ctx.chatId} is disabled`);
			return;
		}
		const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
		const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy({
			providerConfigPresent: cfg.channels?.feishu !== void 0,
			groupPolicy: feishuCfg?.groupPolicy,
			defaultGroupPolicy
		});
		warnMissingProviderGroupPolicyFallbackOnce({
			providerMissingFallbackApplied,
			providerKey: "feishu",
			accountId: account.accountId,
			log
		});
		if (!isFeishuGroupAllowed({
			groupPolicy,
			allowFrom: feishuCfg?.groupAllowFrom ?? [],
			senderId: ctx.chatId,
			senderName: void 0
		})) {
			log(`feishu[${account.accountId}]: group ${ctx.chatId} not in groupAllowFrom (groupPolicy=${groupPolicy})`);
			return;
		}
		const perGroupSenderAllowFrom = groupConfig?.allowFrom ?? [];
		const globalSenderAllowFrom = feishuCfg?.groupSenderAllowFrom ?? [];
		const effectiveSenderAllowFrom = perGroupSenderAllowFrom.length > 0 ? perGroupSenderAllowFrom : globalSenderAllowFrom;
		if (effectiveSenderAllowFrom.length > 0) {
			if (!isFeishuGroupAllowed({
				groupPolicy: "allowlist",
				allowFrom: effectiveSenderAllowFrom,
				senderId: ctx.senderOpenId,
				senderIds: [senderUserId],
				senderName: ctx.senderName
			})) {
				log(`feishu: sender ${ctx.senderOpenId} not in group ${ctx.chatId} sender allowlist`);
				return;
			}
		}
		({requireMention} = resolveFeishuReplyPolicy({
			isDirectMessage: false,
			cfg,
			accountId: account.accountId,
			groupId: ctx.chatId,
			groupPolicy
		}));
		if (requireMention && !ctx.mentionedBot) {
			log(`feishu[${account.accountId}]: message in group ${ctx.chatId} did not mention bot`);
			if (!broadcastAgents && chatHistories && groupHistoryKey) recordPendingHistoryEntryIfEnabled({
				historyMap: chatHistories,
				historyKey: groupHistoryKey,
				limit: historyLimit,
				entry: {
					sender: ctx.senderOpenId,
					body: `${ctx.senderName ?? ctx.senderOpenId}: ${ctx.content}`,
					timestamp: messageCreateTimeMs,
					messageId: ctx.messageId
				}
			});
			return;
		}
	}
	try {
		const core = getFeishuRuntime();
		const pairing = createChannelPairingController({
			core,
			channel: "feishu",
			accountId: account.accountId
		});
		const commandProbeBody = isGroup ? normalizeFeishuCommandProbeBody(ctx.content) : ctx.content;
		const shouldComputeCommandAuthorized = core.channel.commands.shouldComputeCommandAuthorized(commandProbeBody, cfg);
		const storeAllowFrom = !isGroup && dmPolicy !== "allowlist" && (dmPolicy !== "open" || shouldComputeCommandAuthorized) ? await pairing.readAllowFromStore().catch(() => []) : [];
		const effectiveDmAllowFrom = [...configAllowFrom, ...storeAllowFrom];
		const dmAllowed = resolveFeishuAllowlistMatch({
			allowFrom: effectiveDmAllowFrom,
			senderId: ctx.senderOpenId,
			senderIds: [senderUserId],
			senderName: ctx.senderName
		}).allowed;
		if (isDirect && dmPolicy !== "open" && !dmAllowed) {
			if (dmPolicy === "pairing") await pairing.issueChallenge({
				senderId: ctx.senderOpenId,
				senderIdLine: `Your Feishu user id: ${ctx.senderOpenId}`,
				meta: { name: ctx.senderName },
				onCreated: () => {
					log(`feishu[${account.accountId}]: pairing request sender=${ctx.senderOpenId}`);
				},
				sendPairingReply: async (text) => {
					await sendMessageFeishu({
						cfg,
						to: `chat:${ctx.chatId}`,
						text,
						accountId: account.accountId
					});
				},
				onReplyError: (err) => {
					log(`feishu[${account.accountId}]: pairing reply failed for ${ctx.senderOpenId}: ${String(err)}`);
				}
			});
			else log(`feishu[${account.accountId}]: blocked unauthorized sender ${ctx.senderOpenId} (dmPolicy=${dmPolicy})`);
			return;
		}
		const commandAllowFrom = isGroup ? groupConfig?.allowFrom ?? configAllowFrom : effectiveDmAllowFrom;
		const senderAllowedForCommands = resolveFeishuAllowlistMatch({
			allowFrom: commandAllowFrom,
			senderId: ctx.senderOpenId,
			senderIds: [senderUserId],
			senderName: ctx.senderName
		}).allowed;
		const commandAuthorized = shouldComputeCommandAuthorized ? core.channel.commands.resolveCommandAuthorizedFromAuthorizers({
			useAccessGroups,
			authorizers: [{
				configured: commandAllowFrom.length > 0,
				allowed: senderAllowedForCommands
			}]
		}) : void 0;
		const feishuFrom = `feishu:${ctx.senderOpenId}`;
		const feishuTo = isGroup ? `chat:${ctx.chatId}` : `user:${ctx.senderOpenId}`;
		const peerId = isGroup ? groupSession?.peerId ?? ctx.chatId : ctx.senderOpenId;
		const parentPeer = isGroup ? groupSession?.parentPeer ?? null : null;
		const replyInThread = isGroup ? groupSession?.replyInThread ?? false : false;
		const feishuAcpConversationSupported = !isGroup || groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender";
		if (isGroup && groupSession) log(`feishu[${account.accountId}]: group session scope=${groupSession.groupSessionScope}, peer=${peerId}`);
		let route = core.channel.routing.resolveAgentRoute({
			cfg,
			channel: "feishu",
			accountId: account.accountId,
			peer: {
				kind: isGroup ? "group" : "direct",
				id: peerId
			},
			parentPeer
		});
		let effectiveCfg = cfg;
		if (!isGroup && route.matchedBy === "default") {
			const dynamicCfg = feishuCfg?.dynamicAgentCreation;
			if (dynamicCfg?.enabled) {
				const result = await maybeCreateDynamicAgent({
					cfg,
					runtime: getFeishuRuntime(),
					senderOpenId: ctx.senderOpenId,
					dynamicCfg,
					log: (msg) => log(msg)
				});
				if (result.created) {
					effectiveCfg = result.updatedCfg;
					route = core.channel.routing.resolveAgentRoute({
						cfg: result.updatedCfg,
						channel: "feishu",
						accountId: account.accountId,
						peer: {
							kind: "direct",
							id: ctx.senderOpenId
						}
					});
					log(`feishu[${account.accountId}]: dynamic agent created, new route: ${route.sessionKey}`);
				}
			}
		}
		const currentConversationId = peerId;
		const parentConversationId = isGroup ? parentPeer?.id ?? ctx.chatId : void 0;
		let configuredBinding = null;
		if (feishuAcpConversationSupported) {
			const configuredRoute = resolveConfiguredBindingRoute({
				cfg: effectiveCfg,
				route,
				conversation: {
					channel: "feishu",
					accountId: account.accountId,
					conversationId: currentConversationId,
					parentConversationId
				}
			});
			configuredBinding = configuredRoute.bindingResolution;
			route = configuredRoute.route;
			const threadBinding = getSessionBindingService().resolveByConversation({
				channel: "feishu",
				accountId: account.accountId,
				conversationId: currentConversationId,
				...parentConversationId ? { parentConversationId } : {}
			});
			const boundSessionKey = threadBinding?.targetSessionKey?.trim();
			if (threadBinding && boundSessionKey) {
				route = {
					...route,
					sessionKey: boundSessionKey,
					agentId: resolveAgentIdFromSessionKey(boundSessionKey) || route.agentId,
					lastRoutePolicy: deriveLastRoutePolicy({
						sessionKey: boundSessionKey,
						mainSessionKey: route.mainSessionKey
					}),
					matchedBy: "binding.channel"
				};
				configuredBinding = null;
				getSessionBindingService().touch(threadBinding.bindingId);
				log(`feishu[${account.accountId}]: routed via bound conversation ${currentConversationId} -> ${boundSessionKey}`);
			}
		}
		if (configuredBinding) {
			const ensured = await ensureConfiguredBindingRouteReady({
				cfg: effectiveCfg,
				bindingResolution: configuredBinding
			});
			if (!ensured.ok) {
				const replyTargetMessageId = isGroup && (groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender") ? ctx.rootId ?? ctx.messageId : ctx.messageId;
				await sendMessageFeishu({
					cfg: effectiveCfg,
					to: `chat:${ctx.chatId}`,
					text: `⚠️ Failed to initialize the configured ACP session for this Feishu conversation: ${ensured.error}`,
					replyToMessageId: replyTargetMessageId,
					replyInThread: isGroup ? groupSession?.replyInThread ?? false : false,
					accountId: account.accountId
				}).catch((err) => {
					log(`feishu[${account.accountId}]: failed to send ACP init error reply: ${String(err)}`);
				});
				return;
			}
		}
		const preview = ctx.content.replace(/\s+/g, " ").slice(0, 160);
		const inboundLabel = isGroup ? `Feishu[${account.accountId}] message in group ${ctx.chatId}` : `Feishu[${account.accountId}] DM from ${ctx.senderOpenId}`;
		log(`feishu[${account.accountId}]: ${inboundLabel}: ${preview}`);
		const mediaMaxBytes = (feishuCfg?.mediaMaxMb ?? 30) * 1024 * 1024;
		const mediaPayload = buildAgentMediaPayload(await resolveFeishuMediaList({
			cfg,
			messageId: ctx.messageId,
			messageType: event.message.message_type,
			content: event.message.content,
			maxBytes: mediaMaxBytes,
			log,
			accountId: account.accountId
		}));
		let quotedMessageInfo = null;
		let quotedContent;
		if (ctx.parentId) try {
			quotedMessageInfo = await getMessageFeishu({
				cfg,
				messageId: ctx.parentId,
				accountId: account.accountId
			});
			if (quotedMessageInfo) {
				quotedContent = quotedMessageInfo.content;
				log(`feishu[${account.accountId}]: fetched quoted message: ${quotedContent?.slice(0, 100)}`);
			}
		} catch (err) {
			log(`feishu[${account.accountId}]: failed to fetch quoted message: ${String(err)}`);
		}
		const isTopicSessionForThread = isGroup && (groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender");
		const envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(cfg);
		const messageBody = buildFeishuAgentBody({
			ctx,
			quotedContent,
			permissionErrorForAgent,
			botOpenId
		});
		const envelopeFrom = isGroup ? `${ctx.chatId}:${ctx.senderOpenId}` : ctx.senderOpenId;
		if (permissionErrorForAgent) log(`feishu[${account.accountId}]: appending permission error notice to message body`);
		let combinedBody = core.channel.reply.formatAgentEnvelope({
			channel: "Feishu",
			from: envelopeFrom,
			timestamp: /* @__PURE__ */ new Date(),
			envelope: envelopeOptions,
			body: messageBody
		});
		const historyKey = groupHistoryKey;
		if (isGroup && historyKey && chatHistories) combinedBody = buildPendingHistoryContextFromMap({
			historyMap: chatHistories,
			historyKey,
			limit: historyLimit,
			currentMessage: combinedBody,
			formatEntry: (entry) => core.channel.reply.formatAgentEnvelope({
				channel: "Feishu",
				from: `${ctx.chatId}:${entry.sender}`,
				timestamp: entry.timestamp,
				body: entry.body,
				envelope: envelopeOptions
			})
		});
		const inboundHistory = isGroup && historyKey && historyLimit > 0 && chatHistories ? (chatHistories.get(historyKey) ?? []).map((entry) => ({
			sender: entry.sender,
			body: entry.body,
			timestamp: entry.timestamp
		})) : void 0;
		const threadContextBySessionKey = /* @__PURE__ */ new Map();
		let rootMessageInfo;
		let rootMessageFetched = false;
		const getRootMessageInfo = async () => {
			if (!ctx.rootId) return null;
			if (!rootMessageFetched) {
				rootMessageFetched = true;
				if (ctx.rootId === ctx.parentId && quotedMessageInfo) rootMessageInfo = quotedMessageInfo;
				else try {
					rootMessageInfo = await getMessageFeishu({
						cfg,
						messageId: ctx.rootId,
						accountId: account.accountId
					});
				} catch (err) {
					log(`feishu[${account.accountId}]: failed to fetch root message: ${String(err)}`);
					rootMessageInfo = null;
				}
			}
			return rootMessageInfo ?? null;
		};
		const resolveThreadContextForAgent = async (agentId, agentSessionKey) => {
			const cached = threadContextBySessionKey.get(agentSessionKey);
			if (cached) return cached;
			const threadContext = { threadLabel: (ctx.rootId || ctx.threadId) && isTopicSessionForThread ? `Feishu thread in ${ctx.chatId}` : void 0 };
			if (!(ctx.rootId || ctx.threadId) || !isTopicSessionForThread) {
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			const storePath = core.channel.session.resolveStorePath(cfg.session?.store, { agentId });
			if (core.channel.session.readSessionUpdatedAt({
				storePath,
				sessionKey: agentSessionKey
			})) {
				log(`feishu[${account.accountId}]: skipping thread bootstrap for existing session ${agentSessionKey}`);
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			const rootMsg = await getRootMessageInfo();
			let feishuThreadId = ctx.threadId ?? rootMsg?.threadId;
			if (feishuThreadId) log(`feishu[${account.accountId}]: resolved thread ID: ${feishuThreadId}`);
			if (!feishuThreadId) {
				log(`feishu[${account.accountId}]: no threadId found for root message ${ctx.rootId ?? "none"}, skipping thread history`);
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			try {
				const threadMessages = await listFeishuThreadMessages({
					cfg,
					threadId: feishuThreadId,
					currentMessageId: ctx.messageId,
					rootMessageId: ctx.rootId,
					limit: 20,
					accountId: account.accountId
				});
				const senderScoped = groupSession?.groupSessionScope === "group_topic_sender";
				const senderIds = new Set([ctx.senderOpenId, senderUserId].map((id) => id?.trim()).filter((id) => id !== void 0 && id.length > 0));
				const relevantMessages = (senderScoped ? threadMessages.filter((msg) => msg.senderType === "app" || msg.senderId !== void 0 && senderIds.has(msg.senderId.trim())) : threadMessages) ?? [];
				const threadStarterBody = rootMsg?.content ?? relevantMessages[0]?.content;
				const historyMessages = Boolean(rootMsg?.content || ctx.rootId) ? relevantMessages : relevantMessages.slice(1);
				const historyParts = historyMessages.map((msg) => {
					const role = msg.senderType === "app" ? "assistant" : "user";
					return core.channel.reply.formatAgentEnvelope({
						channel: "Feishu",
						from: `${msg.senderId ?? "Unknown"} (${role})`,
						timestamp: msg.createTime,
						body: msg.content,
						envelope: envelopeOptions
					});
				});
				threadContext.threadStarterBody = threadStarterBody;
				threadContext.threadHistoryBody = historyParts.length > 0 ? historyParts.join("\n\n") : void 0;
				log(`feishu[${account.accountId}]: populated thread bootstrap with starter=${threadStarterBody ? "yes" : "no"} history=${historyMessages.length}`);
			} catch (err) {
				log(`feishu[${account.accountId}]: failed to fetch thread history: ${String(err)}`);
			}
			threadContextBySessionKey.set(agentSessionKey, threadContext);
			return threadContext;
		};
		const buildCtxPayloadForAgent = async (agentId, agentSessionKey, agentAccountId, wasMentioned) => {
			const threadContext = await resolveThreadContextForAgent(agentId, agentSessionKey);
			return core.channel.reply.finalizeInboundContext({
				Body: combinedBody,
				BodyForAgent: messageBody,
				InboundHistory: inboundHistory,
				ReplyToId: ctx.parentId,
				RootMessageId: ctx.rootId,
				RawBody: ctx.content,
				CommandBody: ctx.content,
				From: feishuFrom,
				To: feishuTo,
				SessionKey: agentSessionKey,
				AccountId: agentAccountId,
				ChatType: isGroup ? "group" : "direct",
				GroupSubject: isGroup ? ctx.chatId : void 0,
				SenderName: ctx.senderName ?? ctx.senderOpenId,
				SenderId: ctx.senderOpenId,
				Provider: "feishu",
				Surface: "feishu",
				MessageSid: ctx.messageId,
				ReplyToBody: quotedContent ?? void 0,
				ThreadStarterBody: threadContext.threadStarterBody,
				ThreadHistoryBody: threadContext.threadHistoryBody,
				ThreadLabel: threadContext.threadLabel,
				MessageThreadId: ctx.rootId && isTopicSessionForThread ? ctx.rootId : void 0,
				Timestamp: messageCreateTimeMs,
				WasMentioned: wasMentioned,
				CommandAuthorized: commandAuthorized,
				OriginatingChannel: "feishu",
				OriginatingTo: feishuTo,
				GroupSystemPrompt: isGroup ? groupConfig?.systemPrompt?.trim() || void 0 : void 0,
				...mediaPayload
			});
		};
		const isTopicSession = isGroup && (groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender");
		const configReplyInThread = isGroup && (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled";
		const replyTargetMessageId = isTopicSession || configReplyInThread ? ctx.rootId ?? ctx.messageId : ctx.messageId;
		const threadReply = isGroup ? groupSession?.threadReply ?? false : false;
		if (broadcastAgents) {
			if (!await tryRecordMessagePersistent(ctx.messageId, "broadcast", log)) {
				log(`feishu[${account.accountId}]: broadcast already claimed by another account for message ${ctx.messageId}; skipping`);
				return;
			}
			const strategy = cfg.broadcast?.strategy || "parallel";
			const activeAgentId = ctx.mentionedBot || !requireMention ? normalizeAgentId(route.agentId) : null;
			const agentIds = (cfg.agents?.list ?? []).map((a) => normalizeAgentId(a.id));
			const hasKnownAgents = agentIds.length > 0;
			log(`feishu[${account.accountId}]: broadcasting to ${broadcastAgents.length} agents (strategy=${strategy}, active=${activeAgentId ?? "none"})`);
			const dispatchForAgent = async (agentId) => {
				if (hasKnownAgents && !agentIds.includes(normalizeAgentId(agentId))) {
					log(`feishu[${account.accountId}]: broadcast agent ${agentId} not found in agents.list; skipping`);
					return;
				}
				const agentSessionKey = buildBroadcastSessionKey(route.sessionKey, route.agentId, agentId);
				const agentCtx = await buildCtxPayloadForAgent(agentId, agentSessionKey, route.accountId, ctx.mentionedBot && agentId === activeAgentId);
				if (agentId === activeAgentId) {
					const identity = resolveAgentOutboundIdentity(cfg, agentId);
					const { dispatcher, replyOptions, markDispatchIdle } = createFeishuReplyDispatcher({
						cfg,
						agentId,
						runtime,
						chatId: ctx.chatId,
						replyToMessageId: replyTargetMessageId,
						skipReplyToInMessages: !isGroup,
						replyInThread,
						rootId: ctx.rootId,
						threadReply,
						mentionTargets: ctx.mentionTargets,
						accountId: account.accountId,
						identity,
						messageCreateTimeMs
					});
					log(`feishu[${account.accountId}]: broadcast active dispatch agent=${agentId} (session=${agentSessionKey})`);
					await core.channel.reply.withReplyDispatcher({
						dispatcher,
						onSettled: () => markDispatchIdle(),
						run: () => core.channel.reply.dispatchReplyFromConfig({
							ctx: agentCtx,
							cfg,
							dispatcher,
							replyOptions
						})
					});
				} else {
					delete agentCtx.CommandAuthorized;
					const noopDispatcher = {
						sendToolResult: () => false,
						sendBlockReply: () => false,
						sendFinalReply: () => false,
						waitForIdle: async () => {},
						getQueuedCounts: () => ({
							tool: 0,
							block: 0,
							final: 0
						}),
						getFailedCounts: () => ({
							tool: 0,
							block: 0,
							final: 0
						}),
						markComplete: () => {}
					};
					log(`feishu[${account.accountId}]: broadcast observer dispatch agent=${agentId} (session=${agentSessionKey})`);
					await core.channel.reply.withReplyDispatcher({
						dispatcher: noopDispatcher,
						run: () => core.channel.reply.dispatchReplyFromConfig({
							ctx: agentCtx,
							cfg,
							dispatcher: noopDispatcher
						})
					});
				}
			};
			if (strategy === "sequential") for (const agentId of broadcastAgents) try {
				await dispatchForAgent(agentId);
			} catch (err) {
				log(`feishu[${account.accountId}]: broadcast dispatch failed for agent=${agentId}: ${String(err)}`);
			}
			else {
				const results = await Promise.allSettled(broadcastAgents.map(dispatchForAgent));
				for (let i = 0; i < results.length; i++) if (results[i].status === "rejected") log(`feishu[${account.accountId}]: broadcast dispatch failed for agent=${broadcastAgents[i]}: ${String(results[i].reason)}`);
			}
			if (isGroup && historyKey && chatHistories) clearHistoryEntriesIfEnabled({
				historyMap: chatHistories,
				historyKey,
				limit: historyLimit
			});
			log(`feishu[${account.accountId}]: broadcast dispatch complete for ${broadcastAgents.length} agents`);
		} else {
			const ctxPayload = await buildCtxPayloadForAgent(route.agentId, route.sessionKey, route.accountId, ctx.mentionedBot);
			const identity = resolveAgentOutboundIdentity(cfg, route.agentId);
			const { dispatcher, replyOptions, markDispatchIdle } = createFeishuReplyDispatcher({
				cfg,
				agentId: route.agentId,
				runtime,
				chatId: ctx.chatId,
				replyToMessageId: replyTargetMessageId,
				skipReplyToInMessages: !isGroup,
				replyInThread,
				rootId: ctx.rootId,
				threadReply,
				mentionTargets: ctx.mentionTargets,
				accountId: account.accountId,
				identity,
				messageCreateTimeMs
			});
			log(`feishu[${account.accountId}]: dispatching to agent (session=${route.sessionKey})`);
			const { queuedFinal, counts } = await core.channel.reply.withReplyDispatcher({
				dispatcher,
				onSettled: () => {
					markDispatchIdle();
				},
				run: () => core.channel.reply.dispatchReplyFromConfig({
					ctx: ctxPayload,
					cfg,
					dispatcher,
					replyOptions
				})
			});
			if (isGroup && historyKey && chatHistories) clearHistoryEntriesIfEnabled({
				historyMap: chatHistories,
				historyKey,
				limit: historyLimit
			});
			log(`feishu[${account.accountId}]: dispatch complete (queuedFinal=${queuedFinal}, replies=${counts.final})`);
		}
	} catch (err) {
		error(`feishu[${account.accountId}]: failed to dispatch message: ${String(err)}`);
	}
}
//#endregion
//#region extensions/feishu/src/card-ux-shared.ts
function buildFeishuCardButton(params) {
	return {
		tag: "button",
		text: {
			tag: "plain_text",
			content: params.label
		},
		type: params.type ?? "default",
		value: params.value
	};
}
function buildFeishuCardInteractionContext(params) {
	return {
		u: params.operatorOpenId,
		...params.chatId ? { h: params.chatId } : {},
		...params.sessionKey ? { s: params.sessionKey } : {},
		e: params.expiresAt,
		...params.chatType ? { t: params.chatType } : {}
	};
}
//#endregion
//#region extensions/feishu/src/card-ux-approval.ts
const FEISHU_APPROVAL_REQUEST_ACTION = "feishu.quick_actions.request_approval";
const FEISHU_APPROVAL_CONFIRM_ACTION = "feishu.approval.confirm";
const FEISHU_APPROVAL_CANCEL_ACTION = "feishu.approval.cancel";
function createApprovalCard(params) {
	const context = buildFeishuCardInteractionContext(params);
	return {
		schema: "2.0",
		config: { wide_screen_mode: true },
		header: {
			title: {
				tag: "plain_text",
				content: "Confirm action"
			},
			template: "orange"
		},
		body: { elements: [{
			tag: "markdown",
			content: params.prompt
		}, {
			tag: "action",
			actions: [buildFeishuCardButton({
				label: params.confirmLabel ?? "Confirm",
				type: "primary",
				value: createFeishuCardInteractionEnvelope({
					k: "quick",
					a: FEISHU_APPROVAL_CONFIRM_ACTION,
					q: params.command,
					c: context
				})
			}), buildFeishuCardButton({
				label: params.cancelLabel ?? "Cancel",
				value: createFeishuCardInteractionEnvelope({
					k: "button",
					a: FEISHU_APPROVAL_CANCEL_ACTION,
					c: context
				})
			})]
		}] }
	};
}
//#endregion
//#region extensions/feishu/src/card-action.ts
const FEISHU_APPROVAL_CARD_TTL_MS = 5 * 6e4;
const FEISHU_CARD_ACTION_TOKEN_TTL_MS = 15 * 6e4;
const processedCardActionTokens = /* @__PURE__ */ new Map();
function pruneProcessedCardActionTokens(now) {
	for (const [key, entry] of processedCardActionTokens.entries()) if (entry.expiresAt <= now) processedCardActionTokens.delete(key);
}
function beginFeishuCardActionToken(params) {
	const now = params.now ?? Date.now();
	pruneProcessedCardActionTokens(now);
	const normalizedToken = params.token.trim();
	if (!normalizedToken) return true;
	const key = `${params.accountId}:${normalizedToken}`;
	const existing = processedCardActionTokens.get(key);
	if (existing && existing.expiresAt > now) return false;
	processedCardActionTokens.set(key, {
		status: "inflight",
		expiresAt: now + FEISHU_CARD_ACTION_TOKEN_TTL_MS
	});
	return true;
}
function completeFeishuCardActionToken(params) {
	const now = params.now ?? Date.now();
	const normalizedToken = params.token.trim();
	if (!normalizedToken) return;
	processedCardActionTokens.set(`${params.accountId}:${normalizedToken}`, {
		status: "completed",
		expiresAt: now + FEISHU_CARD_ACTION_TOKEN_TTL_MS
	});
}
function releaseFeishuCardActionToken(params) {
	const normalizedToken = params.token.trim();
	if (!normalizedToken) return;
	processedCardActionTokens.delete(`${params.accountId}:${normalizedToken}`);
}
function buildSyntheticMessageEvent(event, content, chatType) {
	return {
		sender: { sender_id: {
			open_id: event.operator.open_id,
			user_id: event.operator.user_id,
			union_id: event.operator.union_id
		} },
		message: {
			message_id: `card-action-${event.token}`,
			chat_id: event.context.chat_id || event.operator.open_id,
			chat_type: chatType ?? (event.context.chat_id ? "group" : "p2p"),
			message_type: "text",
			content: JSON.stringify({ text: content })
		}
	};
}
function resolveCallbackTarget(event) {
	const chatId = event.context.chat_id?.trim();
	if (chatId) return `chat:${chatId}`;
	return `user:${event.operator.open_id}`;
}
async function dispatchSyntheticCommand(params) {
	await handleFeishuMessage({
		cfg: params.cfg,
		event: buildSyntheticMessageEvent(params.event, params.command, params.chatType),
		botOpenId: params.botOpenId,
		runtime: params.runtime,
		accountId: params.accountId
	});
}
async function sendInvalidInteractionNotice(params) {
	const reasonText = params.reason === "stale" ? "This card action has expired. Open a fresh launcher card and try again." : params.reason === "wrong_user" ? "This card action belongs to a different user." : params.reason === "wrong_conversation" ? "This card action belongs to a different conversation." : "This card action payload is invalid.";
	await sendMessageFeishu({
		cfg: params.cfg,
		to: resolveCallbackTarget(params.event),
		text: `⚠️ ${reasonText}`,
		accountId: params.accountId
	});
}
async function handleFeishuCardAction(params) {
	const { cfg, event, runtime, accountId } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	const log = runtime?.log ?? console.log;
	const decoded = decodeFeishuCardAction({ event });
	if (!beginFeishuCardActionToken({
		token: event.token,
		accountId: account.accountId
	})) {
		log(`feishu[${account.accountId}]: skipping duplicate card action token ${event.token}`);
		return;
	}
	try {
		if (decoded.kind === "invalid") {
			log(`feishu[${account.accountId}]: rejected card action from ${event.operator.open_id}: ${decoded.reason}`);
			await sendInvalidInteractionNotice({
				cfg,
				event,
				reason: decoded.reason,
				accountId
			});
			completeFeishuCardActionToken({
				token: event.token,
				accountId: account.accountId
			});
			return;
		}
		if (decoded.kind === "structured") {
			const { envelope } = decoded;
			log(`feishu[${account.accountId}]: handling structured card action ${envelope.a} from ${event.operator.open_id}`);
			if (envelope.a === "feishu.quick_actions.request_approval") {
				const command = typeof envelope.m?.command === "string" ? envelope.m.command.trim() : "";
				if (!command) {
					await sendInvalidInteractionNotice({
						cfg,
						event,
						reason: "malformed",
						accountId
					});
					completeFeishuCardActionToken({
						token: event.token,
						accountId: account.accountId
					});
					return;
				}
				const prompt = typeof envelope.m?.prompt === "string" && envelope.m.prompt.trim() ? envelope.m.prompt : `Run \`${command}\` in this Feishu conversation?`;
				await sendCardFeishu({
					cfg,
					to: resolveCallbackTarget(event),
					card: createApprovalCard({
						operatorOpenId: event.operator.open_id,
						chatId: event.context.chat_id || void 0,
						command,
						prompt,
						sessionKey: envelope.c?.s,
						expiresAt: Date.now() + FEISHU_APPROVAL_CARD_TTL_MS,
						chatType: envelope.c?.t ?? (event.context.chat_id ? "group" : "p2p"),
						confirmLabel: command === "/reset" ? "Reset" : "Confirm"
					}),
					accountId
				});
				completeFeishuCardActionToken({
					token: event.token,
					accountId: account.accountId
				});
				return;
			}
			if (envelope.a === "feishu.approval.cancel") {
				await sendMessageFeishu({
					cfg,
					to: resolveCallbackTarget(event),
					text: "Cancelled.",
					accountId
				});
				completeFeishuCardActionToken({
					token: event.token,
					accountId: account.accountId
				});
				return;
			}
			if (envelope.a === "feishu.approval.confirm" || envelope.k === "quick") {
				const command = envelope.q?.trim();
				if (!command) {
					await sendInvalidInteractionNotice({
						cfg,
						event,
						reason: "malformed",
						accountId
					});
					completeFeishuCardActionToken({
						token: event.token,
						accountId: account.accountId
					});
					return;
				}
				await dispatchSyntheticCommand({
					cfg,
					event,
					command,
					botOpenId: params.botOpenId,
					runtime,
					accountId,
					chatType: envelope.c?.t ?? (event.context.chat_id ? "group" : "p2p")
				});
				completeFeishuCardActionToken({
					token: event.token,
					accountId: account.accountId
				});
				return;
			}
			await sendInvalidInteractionNotice({
				cfg,
				event,
				reason: "malformed",
				accountId
			});
			completeFeishuCardActionToken({
				token: event.token,
				accountId: account.accountId
			});
			return;
		}
		const content = buildFeishuCardActionTextFallback(event);
		log(`feishu[${account.accountId}]: handling card action from ${event.operator.open_id}: ${content}`);
		await dispatchSyntheticCommand({
			cfg,
			event,
			command: content,
			botOpenId: params.botOpenId,
			runtime,
			accountId
		});
		completeFeishuCardActionToken({
			token: event.token,
			accountId: account.accountId
		});
	} catch (err) {
		releaseFeishuCardActionToken({
			token: event.token,
			accountId: account.accountId
		});
		throw err;
	}
}
//#endregion
//#region extensions/feishu/src/card-ux-launcher.ts
const FEISHU_QUICK_ACTION_CARD_TTL_MS = 10 * 6e4;
const QUICK_ACTION_MENU_KEYS = new Set([
	"quick-actions",
	"quick_actions",
	"launcher"
]);
function isFeishuQuickActionMenuEventKey(eventKey) {
	return QUICK_ACTION_MENU_KEYS.has(eventKey.trim().toLowerCase());
}
function createQuickActionLauncherCard(params) {
	const context = buildFeishuCardInteractionContext(params);
	return {
		schema: "2.0",
		config: { wide_screen_mode: true },
		header: {
			title: {
				tag: "plain_text",
				content: "Quick actions"
			},
			template: "indigo"
		},
		body: { elements: [{
			tag: "markdown",
			content: "Run common actions without typing raw commands."
		}, {
			tag: "action",
			actions: [
				buildFeishuCardButton({
					label: "Help",
					value: createFeishuCardInteractionEnvelope({
						k: "quick",
						a: "feishu.quick_actions.help",
						q: "/help",
						c: context
					})
				}),
				buildFeishuCardButton({
					label: "New session",
					type: "primary",
					value: createFeishuCardInteractionEnvelope({
						k: "meta",
						a: FEISHU_APPROVAL_REQUEST_ACTION,
						m: {
							command: "/new",
							prompt: "Start a fresh session? This will reset the current chat context."
						},
						c: context
					})
				}),
				buildFeishuCardButton({
					label: "Reset",
					type: "danger",
					value: createFeishuCardInteractionEnvelope({
						k: "meta",
						a: FEISHU_APPROVAL_REQUEST_ACTION,
						m: {
							command: "/reset",
							prompt: "Reset this session now? Any active conversation state will be cleared."
						},
						c: context
					})
				})
			]
		}] }
	};
}
async function maybeHandleFeishuQuickActionMenu(params) {
	if (!isFeishuQuickActionMenuEventKey(params.eventKey)) return false;
	const expiresAt = (params.now ?? Date.now()) + FEISHU_QUICK_ACTION_CARD_TTL_MS;
	try {
		await sendCardFeishu({
			cfg: params.cfg,
			to: `user:${params.operatorOpenId}`,
			card: createQuickActionLauncherCard({
				operatorOpenId: params.operatorOpenId,
				expiresAt,
				chatType: "p2p"
			}),
			accountId: params.accountId
		});
	} catch (err) {
		params.runtime?.log?.(`feishu[${params.accountId ?? "default"}]: failed to open quick-action launcher for ${params.operatorOpenId}: ${String(err)}`);
		return false;
	}
	params.runtime?.log?.(`feishu[${params.accountId ?? "default"}]: opened quick-action launcher for ${params.operatorOpenId}`);
	return true;
}
//#endregion
//#region extensions/feishu/src/monitor.startup.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS = 3e4;
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV = "OPENCLAW_FEISHU_STARTUP_PROBE_TIMEOUT_MS";
function resolveStartupProbeTimeoutMs() {
	const raw = process.env[FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV];
	if (raw) {
		const parsed = Number(raw);
		if (Number.isFinite(parsed) && parsed > 0) return Math.floor(parsed);
		console.warn(`[feishu] ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV}="${raw}" is invalid; using default ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS}ms`);
	}
	return FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS;
}
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS = resolveStartupProbeTimeoutMs();
function isTimeoutErrorMessage(message) {
	return message?.toLowerCase().includes("timeout") || message?.toLowerCase().includes("timed out") ? true : false;
}
function isAbortErrorMessage(message) {
	return message?.toLowerCase().includes("aborted") ?? false;
}
async function fetchBotIdentityForMonitor(account, options = {}) {
	if (options.abortSignal?.aborted) return {};
	const timeoutMs = options.timeoutMs ?? FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS;
	const result = await probeFeishu(account, {
		timeoutMs,
		abortSignal: options.abortSignal
	});
	if (result.ok) return {
		botOpenId: result.botOpenId,
		botName: result.botName
	};
	if (options.abortSignal?.aborted || isAbortErrorMessage(result.error)) return {};
	if (isTimeoutErrorMessage(result.error)) (options.runtime?.error ?? console.error)(`feishu[${account.accountId}]: bot info probe timed out after ${timeoutMs}ms; continuing startup`);
	return {};
}
//#endregion
//#region extensions/feishu/src/monitor.state.ts
const wsClients = /* @__PURE__ */ new Map();
const httpServers = /* @__PURE__ */ new Map();
const botOpenIds = /* @__PURE__ */ new Map();
const botNames = /* @__PURE__ */ new Map();
const FEISHU_WEBHOOK_MAX_BODY_BYTES = 64 * 1024;
const FEISHU_WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS = {
	windowMs: 6e4,
	maxRequests: 120,
	maxTrackedKeys: 4096
};
const FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS = {
	maxTrackedKeys: 4096,
	ttlMs: 360 * 6e4,
	logEvery: 25
};
function coercePositiveInt(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const normalized = Math.floor(value);
	return normalized > 0 ? normalized : fallback;
}
function resolveFeishuWebhookRateLimitDefaultsForTest(defaults) {
	const resolved = defaults;
	return {
		windowMs: coercePositiveInt(resolved?.windowMs, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.windowMs),
		maxRequests: coercePositiveInt(resolved?.maxRequests, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxRequests),
		maxTrackedKeys: coercePositiveInt(resolved?.maxTrackedKeys, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxTrackedKeys)
	};
}
function resolveFeishuWebhookAnomalyDefaultsForTest(defaults) {
	const resolved = defaults;
	return {
		maxTrackedKeys: coercePositiveInt(resolved?.maxTrackedKeys, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.maxTrackedKeys),
		ttlMs: coercePositiveInt(resolved?.ttlMs, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.ttlMs),
		logEvery: coercePositiveInt(resolved?.logEvery, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.logEvery)
	};
}
const feishuWebhookRateLimitDefaults = resolveFeishuWebhookRateLimitDefaultsForTest(WEBHOOK_RATE_LIMIT_DEFAULTS);
const feishuWebhookAnomalyDefaults = resolveFeishuWebhookAnomalyDefaultsForTest(WEBHOOK_ANOMALY_COUNTER_DEFAULTS);
const feishuWebhookRateLimiter = createFixedWindowRateLimiter({
	windowMs: feishuWebhookRateLimitDefaults.windowMs,
	maxRequests: feishuWebhookRateLimitDefaults.maxRequests,
	maxTrackedKeys: feishuWebhookRateLimitDefaults.maxTrackedKeys
});
const feishuWebhookAnomalyTracker = createWebhookAnomalyTracker({
	maxTrackedKeys: feishuWebhookAnomalyDefaults.maxTrackedKeys,
	ttlMs: feishuWebhookAnomalyDefaults.ttlMs,
	logEvery: feishuWebhookAnomalyDefaults.logEvery
});
function closeWsClient(client) {
	if (!client) return;
	try {
		client.close();
	} catch {}
}
function clearFeishuWebhookRateLimitStateForTest() {
	feishuWebhookRateLimiter.clear();
	feishuWebhookAnomalyTracker.clear();
}
function getFeishuWebhookRateLimitStateSizeForTest() {
	return feishuWebhookRateLimiter.size();
}
function isWebhookRateLimitedForTest(key, nowMs) {
	return feishuWebhookRateLimiter.isRateLimited(key, nowMs);
}
function recordWebhookStatus(runtime, accountId, path, statusCode) {
	feishuWebhookAnomalyTracker.record({
		key: `${accountId}:${path}:${statusCode}`,
		statusCode,
		log: runtime?.log ?? console.log,
		message: (count) => `feishu[${accountId}]: webhook anomaly path=${path} status=${statusCode} count=${count}`
	});
}
function stopFeishuMonitorState(accountId) {
	if (accountId) {
		closeWsClient(wsClients.get(accountId));
		wsClients.delete(accountId);
		const server = httpServers.get(accountId);
		if (server) {
			server.close();
			httpServers.delete(accountId);
		}
		botOpenIds.delete(accountId);
		botNames.delete(accountId);
		return;
	}
	for (const client of wsClients.values()) closeWsClient(client);
	wsClients.clear();
	for (const server of httpServers.values()) server.close();
	httpServers.clear();
	botOpenIds.clear();
	botNames.clear();
}
//#endregion
//#region extensions/feishu/src/monitor.bot-identity.ts
const BOT_IDENTITY_RETRY_DELAYS_MS = [
	6e4,
	12e4,
	3e5,
	6e5,
	9e5
];
function applyBotIdentityState(accountId, identity) {
	const botOpenId = identity.botOpenId?.trim() || void 0;
	const botName = identity.botName?.trim() || void 0;
	botOpenIds.set(accountId, botOpenId ?? "");
	if (botName) botNames.set(accountId, botName);
	else botNames.delete(accountId);
	return {
		botOpenId,
		botName
	};
}
async function retryBotIdentityProbe(account, accountId, runtime, abortSignal) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	for (let i = 0; i < BOT_IDENTITY_RETRY_DELAYS_MS.length; i += 1) {
		if (abortSignal?.aborted) return;
		if (!await waitForAbortableDelay(BOT_IDENTITY_RETRY_DELAYS_MS[i], abortSignal)) return;
		const resolved = applyBotIdentityState(accountId, await fetchBotIdentityForMonitor(account, {
			runtime,
			abortSignal
		}));
		if (resolved.botOpenId) {
			log(`feishu[${accountId}]: bot open_id recovered via background retry: ${resolved.botOpenId}`);
			return;
		}
		const nextDelay = BOT_IDENTITY_RETRY_DELAYS_MS[i + 1];
		error(`feishu[${accountId}]: bot identity background retry ${i + 1}/${BOT_IDENTITY_RETRY_DELAYS_MS.length} failed` + (nextDelay ? `; next attempt in ${nextDelay / 1e3}s` : ""));
	}
	error(`feishu[${accountId}]: bot identity background retry exhausted; requireMention group messages may be skipped until restart`);
}
function startBotIdentityRecovery(params) {
	const { account, accountId, runtime, abortSignal } = params;
	const log = runtime?.log ?? console.log;
	log(`feishu[${accountId}]: bot open_id unknown; starting background retry (delays: ${BOT_IDENTITY_RETRY_DELAYS_MS.map((delay) => `${delay / 1e3}s`).join(", ")})`);
	log(`feishu[${accountId}]: requireMention group messages stay gated until bot identity recovery succeeds`);
	retryBotIdentityProbe(account, accountId, runtime, abortSignal);
}
//#endregion
//#region extensions/feishu/src/monitor.transport.ts
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
function isFeishuWebhookPayload(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function timingSafeEqualString(left, right) {
	const leftBuffer = Buffer.from(left, "utf8");
	const rightBuffer = Buffer.from(right, "utf8");
	if (leftBuffer.length !== rightBuffer.length) return false;
	return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
function buildFeishuWebhookEnvelope(req, payload) {
	return Object.assign(Object.create({ headers: req.headers }), payload);
}
function parseFeishuWebhookPayload(rawBody) {
	try {
		const parsed = JSON.parse(rawBody);
		return isFeishuWebhookPayload(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function isFeishuWebhookSignatureValid(params) {
	const encryptKey = params.encryptKey?.trim();
	if (!encryptKey) return true;
	const timestampHeader = params.headers["x-lark-request-timestamp"];
	const nonceHeader = params.headers["x-lark-request-nonce"];
	const signatureHeader = params.headers["x-lark-signature"];
	const timestamp = Array.isArray(timestampHeader) ? timestampHeader[0] : timestampHeader;
	const nonce = Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader;
	const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
	if (!timestamp || !nonce || !signature) return false;
	return timingSafeEqualString(crypto.createHash("sha256").update(timestamp + nonce + encryptKey + params.rawBody).digest("hex"), signature);
}
function respondText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.end(body);
}
async function monitorWebSocket({ account, accountId, runtime, abortSignal, eventDispatcher }) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	log(`feishu[${accountId}]: starting WebSocket connection...`);
	const wsClient = createFeishuWSClient(account);
	wsClients.set(accountId, wsClient);
	return new Promise((resolve, reject) => {
		let cleanedUp = false;
		const cleanup = () => {
			if (cleanedUp) return;
			cleanedUp = true;
			abortSignal?.removeEventListener("abort", handleAbort);
			try {
				wsClient.close();
			} catch (err) {
				error(`feishu[${accountId}]: error closing WebSocket client: ${String(err)}`);
			} finally {
				wsClients.delete(accountId);
				botOpenIds.delete(accountId);
				botNames.delete(accountId);
			}
		};
		function handleAbort() {
			log(`feishu[${accountId}]: abort signal received, stopping`);
			cleanup();
			resolve();
		}
		if (abortSignal?.aborted) {
			cleanup();
			resolve();
			return;
		}
		abortSignal?.addEventListener("abort", handleAbort, { once: true });
		try {
			wsClient.start({ eventDispatcher });
			log(`feishu[${accountId}]: WebSocket client started`);
		} catch (err) {
			cleanup();
			reject(err);
		}
	});
}
async function monitorWebhook({ account, accountId, runtime, abortSignal, eventDispatcher }) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const port = account.config.webhookPort ?? 3e3;
	const path = account.config.webhookPath ?? "/feishu/events";
	const host = account.config.webhookHost ?? "127.0.0.1";
	log(`feishu[${accountId}]: starting Webhook server on ${host}:${port}, path ${path}...`);
	const server = http.createServer();
	server.on("request", (req, res) => {
		res.on("finish", () => {
			recordWebhookStatus(runtime, accountId, path, res.statusCode);
		});
		if (!applyBasicWebhookRequestGuards({
			req,
			res,
			rateLimiter: feishuWebhookRateLimiter,
			rateLimitKey: `${accountId}:${path}:${req.socket.remoteAddress ?? "unknown"}`,
			nowMs: Date.now(),
			requireJsonContentType: true
		})) return;
		const guard = installRequestBodyLimitGuard(req, res, {
			maxBytes: FEISHU_WEBHOOK_MAX_BODY_BYTES,
			timeoutMs: FEISHU_WEBHOOK_BODY_TIMEOUT_MS,
			responseFormat: "text"
		});
		if (guard.isTripped()) return;
		(async () => {
			try {
				const rawBody = await readRequestBodyWithLimit(req, {
					maxBytes: FEISHU_WEBHOOK_MAX_BODY_BYTES,
					timeoutMs: FEISHU_WEBHOOK_BODY_TIMEOUT_MS
				});
				if (guard.isTripped() || res.writableEnded) return;
				if (!isFeishuWebhookSignatureValid({
					headers: req.headers,
					rawBody,
					encryptKey: account.encryptKey
				})) {
					respondText(res, 401, "Invalid signature");
					return;
				}
				const payload = parseFeishuWebhookPayload(rawBody);
				if (!payload) {
					respondText(res, 400, "Invalid JSON");
					return;
				}
				const { isChallenge, challenge } = import_lib.generateChallenge(payload, { encryptKey: account.encryptKey ?? "" });
				if (isChallenge) {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.end(JSON.stringify(challenge));
					return;
				}
				const value = await eventDispatcher.invoke(buildFeishuWebhookEnvelope(req, payload), { needCheck: false });
				if (!res.headersSent) {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.end(JSON.stringify(value));
				}
			} catch (err) {
				if (isRequestBodyLimitError(err)) {
					if (!res.headersSent) respondText(res, err.statusCode, requestBodyErrorToText(err.code));
					return;
				}
				if (!guard.isTripped()) {
					error(`feishu[${accountId}]: webhook handler error: ${String(err)}`);
					if (!res.headersSent) respondText(res, 500, "Internal Server Error");
				}
			} finally {
				guard.dispose();
			}
		})();
	});
	httpServers.set(accountId, server);
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			server.close();
			httpServers.delete(accountId);
			botOpenIds.delete(accountId);
			botNames.delete(accountId);
		};
		const handleAbort = () => {
			log(`feishu[${accountId}]: abort signal received, stopping Webhook server`);
			cleanup();
			resolve();
		};
		if (abortSignal?.aborted) {
			cleanup();
			resolve();
			return;
		}
		abortSignal?.addEventListener("abort", handleAbort, { once: true });
		server.listen(port, host, () => {
			log(`feishu[${accountId}]: Webhook server listening on ${host}:${port}`);
		});
		server.on("error", (err) => {
			error(`feishu[${accountId}]: Webhook server error: ${err}`);
			abortSignal?.removeEventListener("abort", handleAbort);
			reject(err);
		});
	});
}
//#endregion
//#region extensions/feishu/src/monitor.account.ts
const FEISHU_REACTION_VERIFY_TIMEOUT_MS = 1500;
async function resolveReactionSyntheticEvent(params) {
	const { cfg, accountId, event, botOpenId, fetchMessage = getMessageFeishu, verificationTimeoutMs = FEISHU_REACTION_VERIFY_TIMEOUT_MS, logger, uuid = () => crypto$1.randomUUID(), action = "created" } = params;
	const emoji = event.reaction_type?.emoji_type;
	const messageId = event.message_id;
	const senderId = event.user_id?.open_id;
	if (!emoji || !messageId || !senderId) return null;
	const reactionNotifications = resolveFeishuAccount({
		cfg,
		accountId
	}).config.reactionNotifications ?? "own";
	if (reactionNotifications === "off") return null;
	if (event.operator_type === "app" || senderId === botOpenId) return null;
	if (emoji === "Typing") return null;
	if (reactionNotifications === "own" && !botOpenId) {
		logger?.(`feishu[${accountId}]: bot open_id unavailable, skipping reaction ${emoji} on ${messageId}`);
		return null;
	}
	const reactedMsg = await raceWithTimeoutAndAbort(fetchMessage({
		cfg,
		messageId,
		accountId
	}), { timeoutMs: verificationTimeoutMs }).then((result) => result.status === "resolved" ? result.value : null).catch(() => null);
	const isBotMessage = reactedMsg?.senderType === "app" || reactedMsg?.senderOpenId === botOpenId;
	if (!reactedMsg || reactionNotifications === "own" && !isBotMessage) {
		logger?.(`feishu[${accountId}]: ignoring reaction on non-bot/unverified message ${messageId} (sender: ${reactedMsg?.senderOpenId ?? "unknown"})`);
		return null;
	}
	const fallbackChatType = reactedMsg.chatType;
	const resolvedChatType = normalizeFeishuChatType(event.chat_type) ?? fallbackChatType;
	if (!resolvedChatType) {
		logger?.(`feishu[${accountId}]: skipping reaction ${emoji} on ${messageId} without chat type context`);
		return null;
	}
	const syntheticChatIdRaw = event.chat_id ?? reactedMsg.chatId;
	const syntheticChatId = syntheticChatIdRaw?.trim() ? syntheticChatIdRaw : `p2p:${senderId}`;
	const syntheticChatType = resolvedChatType;
	return {
		sender: {
			sender_id: { open_id: senderId },
			sender_type: "user"
		},
		message: {
			message_id: `${messageId}:reaction:${emoji}:${uuid()}`,
			chat_id: syntheticChatId,
			chat_type: syntheticChatType,
			message_type: "text",
			content: JSON.stringify({ text: action === "deleted" ? `[removed reaction ${emoji} from message ${messageId}]` : `[reacted with ${emoji} to message ${messageId}]` })
		}
	};
}
function normalizeFeishuChatType(value) {
	return value === "group" || value === "private" || value === "p2p" ? value : void 0;
}
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function readString(value) {
	return typeof value === "string" ? value : void 0;
}
function readStringOrNumber(value) {
	return typeof value === "string" || typeof value === "number" ? value : void 0;
}
function parseFeishuMessageEventPayload(value) {
	if (!isRecord(value)) return null;
	const sender = value.sender;
	const message = value.message;
	if (!isRecord(sender) || !isRecord(message)) return null;
	const senderId = sender.sender_id;
	if (!isRecord(senderId)) return null;
	const messageId = readString(message.message_id);
	const chatId = readString(message.chat_id);
	const chatType = normalizeFeishuChatType(message.chat_type);
	const messageType = readString(message.message_type);
	const content = readString(message.content);
	if (!messageId || !chatId || !chatType || !messageType || !content) return null;
	return value;
}
function parseFeishuBotAddedEventPayload(value) {
	if (!isRecord(value) || !readString(value.chat_id) || !isRecord(value.operator_id)) return null;
	return value;
}
function parseFeishuBotRemovedChatId(value) {
	if (!isRecord(value)) return null;
	return readString(value.chat_id) ?? null;
}
function parseFeishuBotMenuEvent(value) {
	if (!isRecord(value)) return null;
	const operator = value.operator;
	if (operator !== void 0 && !isRecord(operator)) return null;
	return {
		event_key: readString(value.event_key),
		timestamp: readStringOrNumber(value.timestamp),
		operator: operator ? {
			operator_name: readString(operator.operator_name),
			operator_id: isRecord(operator.operator_id) ? {
				open_id: readString(operator.operator_id.open_id),
				user_id: readString(operator.operator_id.user_id),
				union_id: readString(operator.operator_id.union_id)
			} : void 0
		} : void 0
	};
}
function parseFeishuCardActionEventPayload(value) {
	if (!isRecord(value)) return null;
	const operator = value.operator;
	const action = value.action;
	const context = value.context;
	if (!isRecord(operator) || !isRecord(action) || !isRecord(context)) return null;
	const token = readString(value.token);
	const openId = readString(operator.open_id);
	const userId = readString(operator.user_id);
	const unionId = readString(operator.union_id);
	const tag = readString(action.tag);
	const actionValue = action.value;
	const contextOpenId = readString(context.open_id);
	const contextUserId = readString(context.user_id);
	const chatId = readString(context.chat_id);
	if (!token || !openId || !userId || !unionId || !tag || !isRecord(actionValue) || !contextOpenId || !contextUserId || !chatId) return null;
	return {
		operator: {
			open_id: openId,
			user_id: userId,
			union_id: unionId
		},
		token,
		action: {
			value: actionValue,
			tag
		},
		context: {
			open_id: contextOpenId,
			user_id: contextUserId,
			chat_id: chatId
		}
	};
}
/**
* Per-chat serial queue that ensures messages from the same chat are processed
* in arrival order while allowing different chats to run concurrently.
*/
function createChatQueue() {
	const queues = /* @__PURE__ */ new Map();
	return (chatId, task) => {
		const next = (queues.get(chatId) ?? Promise.resolve()).then(task, task);
		queues.set(chatId, next);
		next.finally(() => {
			if (queues.get(chatId) === next) queues.delete(chatId);
		});
		return next;
	};
}
function mergeFeishuDebounceMentions(entries) {
	const merged = /* @__PURE__ */ new Map();
	for (const entry of entries) for (const mention of entry.message.mentions ?? []) {
		const stableId = mention.id.open_id?.trim() || mention.id.user_id?.trim() || mention.id.union_id?.trim();
		const mentionName = mention.name?.trim();
		const mentionKey = mention.key?.trim();
		const fallback = mentionName && mentionKey ? `${mentionName}|${mentionKey}` : mentionName || mentionKey;
		const key = stableId || fallback;
		if (!key || merged.has(key)) continue;
		merged.set(key, mention);
	}
	if (merged.size === 0) return;
	return Array.from(merged.values());
}
function dedupeFeishuDebounceEntriesByMessageId(entries) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const entry of entries) {
		const messageId = entry.message.message_id?.trim();
		if (!messageId) {
			deduped.push(entry);
			continue;
		}
		if (seen.has(messageId)) continue;
		seen.add(messageId);
		deduped.push(entry);
	}
	return deduped;
}
function resolveFeishuDebounceMentions(params) {
	const { entries, botOpenId } = params;
	if (entries.length === 0) return;
	for (let index = entries.length - 1; index >= 0; index -= 1) {
		const entry = entries[index];
		if (isMentionForwardRequest(entry, botOpenId)) return mergeFeishuDebounceMentions([entry]);
	}
	const merged = mergeFeishuDebounceMentions(entries);
	if (!merged) return;
	const normalizedBotOpenId = botOpenId?.trim();
	if (!normalizedBotOpenId) return;
	const botMentions = merged.filter((mention) => mention.id.open_id?.trim() === normalizedBotOpenId);
	return botMentions.length > 0 ? botMentions : void 0;
}
function registerEventHandlers(eventDispatcher, context) {
	const { cfg, accountId, runtime, chatHistories, fireAndForget } = context;
	const core = getFeishuRuntime();
	const inboundDebounceMs = core.channel.debounce.resolveInboundDebounceMs({
		cfg,
		channel: "feishu"
	});
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const enqueue = createChatQueue();
	const runFeishuHandler = async (params) => {
		if (fireAndForget) {
			params.task().catch((err) => {
				error(`${params.errorMessage}: ${String(err)}`);
			});
			return;
		}
		try {
			await params.task();
		} catch (err) {
			error(`${params.errorMessage}: ${String(err)}`);
		}
	};
	const dispatchFeishuMessage = async (event) => {
		const chatId = event.message.chat_id?.trim() || "unknown";
		const task = () => handleFeishuMessage({
			cfg,
			event,
			botOpenId: botOpenIds.get(accountId),
			botName: botNames.get(accountId),
			runtime,
			chatHistories,
			accountId,
			processingClaimHeld: true
		});
		await enqueue(chatId, task);
	};
	const resolveSenderDebounceId = (event) => {
		return event.sender.sender_id.open_id?.trim() || event.sender.sender_id.user_id?.trim() || void 0;
	};
	const resolveDebounceText = (event) => {
		return parseFeishuMessageEvent(event, botOpenIds.get(accountId), botNames.get(accountId)).content.trim();
	};
	const recordSuppressedMessageIds = async (entries, dispatchMessageId) => {
		const keepMessageId = dispatchMessageId?.trim();
		const suppressedIds = new Set(entries.map((entry) => entry.message.message_id?.trim()).filter((id) => Boolean(id) && (!keepMessageId || id !== keepMessageId)));
		if (suppressedIds.size === 0) return;
		for (const messageId of suppressedIds) try {
			await recordProcessedFeishuMessage(messageId, accountId, log);
		} catch (err) {
			error(`feishu[${accountId}]: failed to record merged dedupe id ${messageId}: ${String(err)}`);
		}
	};
	const isMessageAlreadyProcessed = async (entry) => {
		return await hasProcessedFeishuMessage(entry.message.message_id, accountId, log);
	};
	const inboundDebouncer = core.channel.debounce.createInboundDebouncer({
		debounceMs: inboundDebounceMs,
		buildKey: (event) => {
			const chatId = event.message.chat_id?.trim();
			const senderId = resolveSenderDebounceId(event);
			if (!chatId || !senderId) return null;
			const rootId = event.message.root_id?.trim();
			return `feishu:${accountId}:${chatId}:${rootId ? `thread:${rootId}` : "chat"}:${senderId}`;
		},
		shouldDebounce: (event) => {
			if (event.message.message_type !== "text") return false;
			const text = resolveDebounceText(event);
			if (!text) return false;
			return !core.channel.text.hasControlCommand(text, cfg);
		},
		onFlush: async (entries) => {
			const last = entries.at(-1);
			if (!last) return;
			if (entries.length === 1) {
				await dispatchFeishuMessage(last);
				return;
			}
			const dedupedEntries = dedupeFeishuDebounceEntriesByMessageId(entries);
			const freshEntries = [];
			for (const entry of dedupedEntries) if (!await isMessageAlreadyProcessed(entry)) freshEntries.push(entry);
			const dispatchEntry = freshEntries.at(-1);
			if (!dispatchEntry) return;
			await recordSuppressedMessageIds(dedupedEntries, dispatchEntry.message.message_id);
			const combinedText = freshEntries.map((entry) => resolveDebounceText(entry)).filter(Boolean).join("\n");
			const mergedMentions = resolveFeishuDebounceMentions({
				entries: freshEntries,
				botOpenId: botOpenIds.get(accountId)
			});
			if (!combinedText.trim()) {
				await dispatchFeishuMessage({
					...dispatchEntry,
					message: {
						...dispatchEntry.message,
						mentions: mergedMentions ?? dispatchEntry.message.mentions
					}
				});
				return;
			}
			await dispatchFeishuMessage({
				...dispatchEntry,
				message: {
					...dispatchEntry.message,
					message_type: "text",
					content: JSON.stringify({ text: combinedText }),
					mentions: mergedMentions ?? dispatchEntry.message.mentions
				}
			});
		},
		onError: (err, entries) => {
			for (const entry of entries) releaseFeishuMessageProcessing(entry.message.message_id, accountId);
			error(`feishu[${accountId}]: inbound debounce flush failed: ${String(err)}`);
		}
	});
	eventDispatcher.register({
		"im.message.receive_v1": async (data) => {
			const event = parseFeishuMessageEventPayload(data);
			if (!event) {
				error(`feishu[${accountId}]: ignoring malformed message event payload`);
				return;
			}
			const messageId = event.message?.message_id?.trim();
			if (!tryBeginFeishuMessageProcessing(messageId, accountId)) {
				log(`feishu[${accountId}]: dropping duplicate event for message ${messageId}`);
				return;
			}
			const processMessage = async () => {
				await inboundDebouncer.enqueue(event);
			};
			if (fireAndForget) {
				processMessage().catch((err) => {
					releaseFeishuMessageProcessing(messageId, accountId);
					error(`feishu[${accountId}]: error handling message: ${String(err)}`);
				});
				return;
			}
			try {
				await processMessage();
			} catch (err) {
				releaseFeishuMessageProcessing(messageId, accountId);
				error(`feishu[${accountId}]: error handling message: ${String(err)}`);
			}
		},
		"im.message.message_read_v1": async () => {},
		"im.chat.member.bot.added_v1": async (data) => {
			try {
				const event = parseFeishuBotAddedEventPayload(data);
				if (!event) return;
				log(`feishu[${accountId}]: bot added to chat ${event.chat_id}`);
			} catch (err) {
				error(`feishu[${accountId}]: error handling bot added event: ${String(err)}`);
			}
		},
		"im.chat.member.bot.deleted_v1": async (data) => {
			try {
				const chatId = parseFeishuBotRemovedChatId(data);
				if (!chatId) return;
				log(`feishu[${accountId}]: bot removed from chat ${chatId}`);
			} catch (err) {
				error(`feishu[${accountId}]: error handling bot removed event: ${String(err)}`);
			}
		},
		"im.message.reaction.created_v1": async (data) => {
			await runFeishuHandler({
				errorMessage: `feishu[${accountId}]: error handling reaction event`,
				task: async () => {
					const event = data;
					const myBotId = botOpenIds.get(accountId);
					const syntheticEvent = await resolveReactionSyntheticEvent({
						cfg,
						accountId,
						event,
						botOpenId: myBotId,
						logger: log
					});
					if (!syntheticEvent) return;
					await handleFeishuMessage({
						cfg,
						event: syntheticEvent,
						botOpenId: myBotId,
						botName: botNames.get(accountId),
						runtime,
						chatHistories,
						accountId
					});
				}
			});
		},
		"im.message.reaction.deleted_v1": async (data) => {
			await runFeishuHandler({
				errorMessage: `feishu[${accountId}]: error handling reaction removal event`,
				task: async () => {
					const event = data;
					const myBotId = botOpenIds.get(accountId);
					const syntheticEvent = await resolveReactionSyntheticEvent({
						cfg,
						accountId,
						event,
						botOpenId: myBotId,
						logger: log,
						action: "deleted"
					});
					if (!syntheticEvent) return;
					await handleFeishuMessage({
						cfg,
						event: syntheticEvent,
						botOpenId: myBotId,
						botName: botNames.get(accountId),
						runtime,
						chatHistories,
						accountId
					});
				}
			});
		},
		"application.bot.menu_v6": async (data) => {
			try {
				const event = parseFeishuBotMenuEvent(data);
				if (!event) return;
				const operatorOpenId = event.operator?.operator_id?.open_id?.trim();
				const eventKey = event.event_key?.trim();
				if (!operatorOpenId || !eventKey) return;
				const syntheticEvent = {
					sender: {
						sender_id: {
							open_id: operatorOpenId,
							user_id: event.operator?.operator_id?.user_id,
							union_id: event.operator?.operator_id?.union_id
						},
						sender_type: "user"
					},
					message: {
						message_id: `bot-menu:${eventKey}:${event.timestamp ?? Date.now()}`,
						chat_id: `p2p:${operatorOpenId}`,
						chat_type: "p2p",
						message_type: "text",
						content: JSON.stringify({ text: `/menu ${eventKey}` })
					}
				};
				const syntheticMessageId = syntheticEvent.message.message_id;
				if (await hasProcessedFeishuMessage(syntheticMessageId, accountId, log)) {
					log(`feishu[${accountId}]: dropping duplicate bot-menu event for ${syntheticMessageId}`);
					return;
				}
				if (!tryBeginFeishuMessageProcessing(syntheticMessageId, accountId)) {
					log(`feishu[${accountId}]: dropping in-flight bot-menu event for ${syntheticMessageId}`);
					return;
				}
				const handleLegacyMenu = () => handleFeishuMessage({
					cfg,
					event: syntheticEvent,
					botOpenId: botOpenIds.get(accountId),
					botName: botNames.get(accountId),
					runtime,
					chatHistories,
					accountId,
					processingClaimHeld: true
				});
				const promise = maybeHandleFeishuQuickActionMenu({
					cfg,
					eventKey,
					operatorOpenId,
					runtime,
					accountId
				}).then(async (handledMenu) => {
					if (handledMenu) {
						await recordProcessedFeishuMessage(syntheticMessageId, accountId, log);
						releaseFeishuMessageProcessing(syntheticMessageId, accountId);
						return;
					}
					return await handleLegacyMenu();
				}).catch((err) => {
					releaseFeishuMessageProcessing(syntheticMessageId, accountId);
					throw err;
				});
				if (fireAndForget) {
					promise.catch((err) => {
						error(`feishu[${accountId}]: error handling bot menu event: ${String(err)}`);
					});
					return;
				}
				await promise;
			} catch (err) {
				error(`feishu[${accountId}]: error handling bot menu event: ${String(err)}`);
			}
		},
		"card.action.trigger": async (data) => {
			try {
				const event = parseFeishuCardActionEventPayload(data);
				if (!event) {
					error(`feishu[${accountId}]: ignoring malformed card action payload`);
					return;
				}
				const promise = handleFeishuCardAction({
					cfg,
					event,
					botOpenId: botOpenIds.get(accountId),
					runtime,
					accountId
				});
				if (fireAndForget) promise.catch((err) => {
					error(`feishu[${accountId}]: error handling card action: ${String(err)}`);
				});
				else await promise;
			} catch (err) {
				error(`feishu[${accountId}]: error handling card action: ${String(err)}`);
			}
		}
	});
}
async function monitorSingleAccount(params) {
	const { cfg, account, runtime, abortSignal } = params;
	const { accountId } = account;
	const log = runtime?.log ?? console.log;
	const botOpenIdSource = params.botOpenIdSource ?? { kind: "fetch" };
	const { botOpenId } = applyBotIdentityState(accountId, botOpenIdSource.kind === "prefetched" ? {
		botOpenId: botOpenIdSource.botOpenId,
		botName: botOpenIdSource.botName
	} : await fetchBotIdentityForMonitor(account, {
		runtime,
		abortSignal
	}));
	log(`feishu[${accountId}]: bot open_id resolved: ${botOpenId ?? "unknown"}`);
	if (!botOpenId && !abortSignal?.aborted) startBotIdentityRecovery({
		account,
		accountId,
		runtime,
		abortSignal
	});
	const connectionMode = account.config.connectionMode ?? "websocket";
	if (connectionMode === "webhook" && !account.verificationToken?.trim()) throw new Error(`Feishu account "${accountId}" webhook mode requires verificationToken`);
	if (connectionMode === "webhook" && !account.encryptKey?.trim()) throw new Error(`Feishu account "${accountId}" webhook mode requires encryptKey`);
	const warmupCount = await warmupDedupFromDisk(accountId, log);
	if (warmupCount > 0) log(`feishu[${accountId}]: dedup warmup loaded ${warmupCount} entries from disk`);
	let threadBindingManager = null;
	try {
		const eventDispatcher = createEventDispatcher(account);
		const chatHistories = /* @__PURE__ */ new Map();
		threadBindingManager = createFeishuThreadBindingManager({
			accountId,
			cfg
		});
		registerEventHandlers(eventDispatcher, {
			cfg,
			accountId,
			runtime,
			chatHistories,
			fireAndForget: true
		});
		if (connectionMode === "webhook") return await monitorWebhook({
			account,
			accountId,
			runtime,
			abortSignal,
			eventDispatcher
		});
		return await monitorWebSocket({
			account,
			accountId,
			runtime,
			abortSignal,
			eventDispatcher
		});
	} finally {
		threadBindingManager?.stop();
	}
}
//#endregion
//#region extensions/feishu/src/monitor.ts
async function monitorFeishuProvider(opts = {}) {
	const cfg = opts.config;
	if (!cfg) throw new Error("Config is required for Feishu monitor");
	const log = opts.runtime?.log ?? console.log;
	if (opts.accountId) {
		const account = resolveFeishuRuntimeAccount({
			cfg,
			accountId: opts.accountId
		}, { requireEventSecrets: true });
		if (!account.enabled || !account.configured) throw new Error(`Feishu account "${opts.accountId}" not configured or disabled`);
		return monitorSingleAccount({
			cfg,
			account,
			runtime: opts.runtime,
			abortSignal: opts.abortSignal
		});
	}
	const accounts = listEnabledFeishuAccounts(cfg);
	if (accounts.length === 0) throw new Error("No enabled Feishu accounts configured");
	log(`feishu: starting ${accounts.length} account(s): ${accounts.map((a) => a.accountId).join(", ")}`);
	const monitorPromises = [];
	for (const account of accounts) {
		if (opts.abortSignal?.aborted) {
			log("feishu: abort signal received during startup preflight; stopping startup");
			break;
		}
		const { botOpenId, botName } = await fetchBotIdentityForMonitor(account, {
			runtime: opts.runtime,
			abortSignal: opts.abortSignal
		});
		if (opts.abortSignal?.aborted) {
			log("feishu: abort signal received during startup preflight; stopping startup");
			break;
		}
		monitorPromises.push(monitorSingleAccount({
			cfg,
			account,
			runtime: opts.runtime,
			abortSignal: opts.abortSignal,
			botOpenIdSource: {
				kind: "prefetched",
				botOpenId,
				botName
			}
		}));
	}
	await Promise.all(monitorPromises);
}
function stopFeishuMonitor(accountId) {
	stopFeishuMonitorState(accountId);
}
//#endregion
export { clearFeishuWebhookRateLimitStateForTest, getFeishuWebhookRateLimitStateSizeForTest, isWebhookRateLimitedForTest, monitorFeishuProvider, resolveReactionSyntheticEvent, stopFeishuMonitor };
