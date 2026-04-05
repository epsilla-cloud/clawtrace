import { Aj as resolveInboundSessionEnvelopeContext, Zj as dispatchReplyFromConfigWithSettledDispatcher } from "./auth-profiles-B5ypC5S-.js";
import { g as DEFAULT_ACCOUNT_ID } from "./session-key-BhxcMJEE.js";
import { f as createDraftStreamLoop, n as keepHttpServerTaskAlive } from "./channel-lifecycle-CSsB8ys6.js";
import { n as createChannelPairingController } from "./channel-pairing-cpi9_8zd.js";
import { r as resolveDefaultGroupPolicy } from "./runtime-group-policy-Bde7-o8k.js";
import { a as resolveSenderScopedGroupPolicy, i as evaluateSenderGroupAccessForPolicy } from "./group-access-CyGNdCph.js";
import { d as resolveDualTextControlCommandGate, n as readStoreAllowFromForDmPolicy, o as resolveDmGroupAccessWithLists, s as resolveEffectiveAllowFromLists } from "./dm-policy-shared-C8YuyjhK.js";
import { n as formatAllowlistMatchMeta } from "./allowlist-match-CSOSv_ih.js";
import { c as logInboundDrop, l as logTypingFailure } from "./channel-feedback-rIf58luM.js";
import { a as resolveChannelMediaMaxBytes, n as resolveMentionGating } from "./text-chunking-DzwxNDbL.js";
import { f as summarizeMapping, u as mergeAllowlist } from "./allow-from-C4_uNVuH.js";
import { n as fetchWithSsrFGuard } from "./fetch-guard-dgUzueSW.js";
import { x as buildMediaPayload } from "./reply-payload-CJqP_sJ6.js";
import { t as createChannelReplyPipeline } from "./channel-reply-pipeline-DFacxqeY.js";
import { n as DEFAULT_WEBHOOK_MAX_BODY_BYTES } from "./http-body-JDY8COhf.js";
import { a as buildPendingHistoryContextFromMap, s as clearHistoryEntriesIfEnabled, u as recordPendingHistoryEntryIfEnabled } from "./reply-history-Zf0VECih.js";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-BgMtk6C_.js";
import "./runtime-api-CMECrhfj.js";
import { a as resolveMSTeamsRouteConfig, i as resolveMSTeamsReplyPolicy, n as resolveMSTeamsAllowlistMatch, t as isMSTeamsGroupAllowed } from "./policy-DS8LR3d-.js";
import { A as isRecord, C as IMG_SRC_RE, D as inferPlaceholder, E as extractInlineImageCandidates, F as resolveRequestUrl, I as safeFetchWithPolicy, L as safeHostForUrl, M as normalizeContentType, N as resolveAttachmentFetchPolicy, O as isDownloadableAttachment, P as resolveMediaSsrfPolicy, S as GRAPH_ROOT, T as extractHtmlFromAttachment, _ as loadMSTeamsSdkWithAuth, f as resolveMSTeamsCredentials, g as createMSTeamsTokenProvider, h as createMSTeamsAdapter, i as fetchGraphJson, j as isUrlAllowed, k as isLikelyImageAttachment, m as createBotFrameworkJwtValidator, w as applyAuthorizationHeaderForUrl, x as ATTACHMENT_TAG_RE, y as getMSTeamsRuntime } from "./graph-users-DrDnmDGP.js";
import { o as resolveMSTeamsChannelAllowlist, s as resolveMSTeamsUserAllowlist } from "./resolve-allowlist-Dp10HjSj.js";
import { S as createMSTeamsConversationStoreFs, _ as classifyMSTeamsSendError, b as createMSTeamsPollStoreFs, c as renderReplyPayloadsToMessages, d as withRevokedProxyFallback, f as getPendingUpload, g as uploadToConsentUrl, h as parseFileConsentInvoke, l as sendMSTeamsMessages, m as buildFileInfoCard, p as removePendingUpload, s as buildConversationReference, u as AI_GENERATED_ENTITY, v as formatMSTeamsSendErrorHint, x as extractMSTeamsPollVote, y as formatUnknownError } from "./probe-EcuO21_J.js";
//#region extensions/msteams/src/feedback-reflection-prompt.ts
/** Max chars of the thumbed-down response to include in the reflection prompt. */
const MAX_RESPONSE_CHARS = 500;
function buildReflectionPrompt(params) {
	const parts = ["A user indicated your previous response wasn't helpful."];
	if (params.thumbedDownResponse) {
		const truncated = params.thumbedDownResponse.length > MAX_RESPONSE_CHARS ? `${params.thumbedDownResponse.slice(0, MAX_RESPONSE_CHARS)}...` : params.thumbedDownResponse;
		parts.push(`\nYour response was:\n> ${truncated}`);
	}
	if (params.userComment) parts.push(`\nUser's comment: "${params.userComment}"`);
	parts.push("\nBriefly reflect: what could you improve? Consider tone, length, accuracy, relevance, and specificity. Reply with a single JSON object only, no markdown or prose, using this exact shape:\n{\"learning\":\"...\",\"followUp\":false,\"userMessage\":\"\"}\n- learning: a short internal adjustment note (1-2 sentences) for your future behavior in this conversation.\n- followUp: true only if the user needs a direct follow-up message.\n- userMessage: only the exact user-facing message to send; empty string when followUp is false.");
	return parts.join("\n");
}
function parseBooleanLike(value) {
	if (typeof value === "boolean") return value;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if (normalized === "true" || normalized === "yes") return true;
		if (normalized === "false" || normalized === "no") return false;
	}
}
function parseStructuredReflectionValue(value) {
	if (value == null || typeof value !== "object" || Array.isArray(value)) return null;
	const candidate = value;
	const learning = typeof candidate.learning === "string" ? candidate.learning.trim() : void 0;
	if (!learning) return null;
	return {
		learning,
		followUp: parseBooleanLike(candidate.followUp) ?? false,
		userMessage: typeof candidate.userMessage === "string" && candidate.userMessage.trim() ? candidate.userMessage.trim() : void 0
	};
}
function parseReflectionResponse(text) {
	const trimmed = text.trim();
	if (!trimmed) return null;
	const candidates = [trimmed, ...trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.slice(1, 2) ?? []];
	for (const candidateText of candidates) {
		const candidate = candidateText.trim();
		if (!candidate) continue;
		try {
			const parsed = parseStructuredReflectionValue(JSON.parse(candidate));
			if (parsed) return parsed;
		} catch {}
	}
	return {
		learning: trimmed,
		followUp: false
	};
}
/** Tracks last reflection time per session to enforce cooldown. */
const lastReflectionBySession = /* @__PURE__ */ new Map();
/** Maximum cooldown entries before pruning expired ones. */
const MAX_COOLDOWN_ENTRIES = 500;
function sanitizeSessionKey(sessionKey) {
	return sessionKey.replace(/[^a-zA-Z0-9_-]/g, "_");
}
/** Prune expired cooldown entries to prevent unbounded memory growth. */
function pruneExpiredCooldowns(cooldownMs) {
	if (lastReflectionBySession.size <= MAX_COOLDOWN_ENTRIES) return;
	const now = Date.now();
	for (const [key, time] of lastReflectionBySession) if (now - time >= cooldownMs) lastReflectionBySession.delete(key);
}
/** Check if a reflection is allowed (cooldown not active). */
function isReflectionAllowed(sessionKey, cooldownMs) {
	const cooldown = cooldownMs ?? 3e5;
	const lastTime = lastReflectionBySession.get(sessionKey);
	if (lastTime == null) return true;
	return Date.now() - lastTime >= cooldown;
}
/** Record that a reflection was run for a session. */
function recordReflectionTime(sessionKey, cooldownMs) {
	lastReflectionBySession.set(sessionKey, Date.now());
	pruneExpiredCooldowns(cooldownMs ?? 3e5);
}
/** Store a learning derived from feedback reflection in a session companion file. */
async function storeSessionLearning(params) {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const learningsFile = path.join(params.storePath, `${sanitizeSessionKey(params.sessionKey)}.learnings.json`);
	let learnings = [];
	try {
		const existing = await fs.readFile(learningsFile, "utf-8");
		const parsed = JSON.parse(existing);
		if (Array.isArray(parsed)) learnings = parsed;
	} catch {}
	learnings.push(params.learning);
	if (learnings.length > 10) learnings = learnings.slice(-10);
	await fs.mkdir(path.dirname(learningsFile), { recursive: true });
	await fs.writeFile(learningsFile, JSON.stringify(learnings, null, 2), "utf-8");
}
//#endregion
//#region extensions/msteams/src/feedback-reflection.ts
/**
* Background reflection triggered by negative user feedback (thumbs-down).
*
* Flow:
* 1. User thumbs-down -> invoke handler acks immediately
* 2. This module runs in the background (fire-and-forget)
* 3. Reads recent session context
* 4. Sends a synthetic reflection prompt to the agent
* 5. Stores the derived learning in session
* 6. Optionally sends a proactive follow-up to the user
*/
function buildFeedbackEvent(params) {
	return {
		type: "custom",
		event: "feedback",
		ts: Date.now(),
		messageId: params.messageId,
		value: params.value,
		comment: params.comment,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		conversationId: params.conversationId
	};
}
function buildReflectionContext(params) {
	const core = getMSTeamsRuntime();
	const envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(params.cfg);
	const body = core.channel.reply.formatAgentEnvelope({
		channel: "Teams",
		from: "system",
		body: params.reflectionPrompt,
		envelope: envelopeOptions
	});
	return { ctxPayload: core.channel.reply.finalizeInboundContext({
		Body: body,
		BodyForAgent: params.reflectionPrompt,
		RawBody: params.reflectionPrompt,
		CommandBody: params.reflectionPrompt,
		From: `msteams:system:${params.conversationId}`,
		To: `conversation:${params.conversationId}`,
		SessionKey: params.sessionKey,
		ChatType: "direct",
		SenderName: "system",
		SenderId: "system",
		Provider: "msteams",
		Surface: "msteams",
		Timestamp: Date.now(),
		WasMentioned: true,
		CommandAuthorized: false,
		OriginatingChannel: "msteams",
		OriginatingTo: `conversation:${params.conversationId}`
	}) };
}
function createReflectionCaptureDispatcher(params) {
	const core = getMSTeamsRuntime();
	let response = "";
	const { dispatcher, replyOptions } = core.channel.reply.createReplyDispatcherWithTyping({
		deliver: async (payload) => {
			if (payload.text) response += (response ? "\n" : "") + payload.text;
		},
		typingCallbacks: {
			onReplyStart: async () => {},
			onIdle: () => {},
			onCleanup: () => {}
		},
		humanDelay: core.channel.reply.resolveHumanDelayConfig(params.cfg, params.agentId),
		onError: (err) => {
			params.log.debug?.("reflection reply error", { error: String(err) });
		}
	});
	return {
		dispatcher,
		replyOptions,
		readResponse: () => response
	};
}
async function sendReflectionFollowUp(params) {
	const proactiveRef = {
		...buildConversationReference(params.conversationRef),
		activityId: void 0
	};
	await params.adapter.continueConversation(params.appId, proactiveRef, async (ctx) => {
		await ctx.sendActivity({
			type: "message",
			text: params.userMessage
		});
	});
}
/**
* Run a background reflection after negative feedback.
* This is designed to be called fire-and-forget (don't await in the invoke handler).
*/
async function runFeedbackReflection(params) {
	const { cfg, log, sessionKey } = params;
	const cooldownMs = cfg.channels?.msteams?.feedbackReflectionCooldownMs ?? 3e5;
	if (!isReflectionAllowed(sessionKey, cooldownMs)) {
		log.debug?.("skipping reflection (cooldown active)", { sessionKey });
		return;
	}
	const reflectionPrompt = buildReflectionPrompt({
		thumbedDownResponse: params.thumbedDownResponse,
		userComment: params.userComment
	});
	const storePath = getMSTeamsRuntime().channel.session.resolveStorePath(cfg.session?.store, { agentId: params.agentId });
	const { ctxPayload } = buildReflectionContext({
		cfg,
		conversationId: params.conversationId,
		sessionKey: params.sessionKey,
		reflectionPrompt
	});
	const capture = createReflectionCaptureDispatcher({
		cfg,
		agentId: params.agentId,
		log
	});
	try {
		await dispatchReplyFromConfigWithSettledDispatcher({
			ctxPayload,
			cfg,
			dispatcher: capture.dispatcher,
			onSettled: () => {},
			replyOptions: capture.replyOptions
		});
	} catch (err) {
		log.error("reflection dispatch failed", { error: String(err) });
		return;
	}
	const reflectionResponse = capture.readResponse().trim();
	if (!reflectionResponse) {
		log.debug?.("reflection produced no output");
		return;
	}
	const parsedReflection = parseReflectionResponse(reflectionResponse);
	if (!parsedReflection) {
		log.debug?.("reflection produced no structured output");
		return;
	}
	recordReflectionTime(sessionKey, cooldownMs);
	log.info("reflection complete", {
		sessionKey,
		responseLength: reflectionResponse.length,
		followUp: parsedReflection.followUp
	});
	try {
		await storeSessionLearning({
			storePath,
			sessionKey: params.sessionKey,
			learning: parsedReflection.learning
		});
	} catch (err) {
		log.debug?.("failed to store reflection learning", { error: String(err) });
	}
	const conversationType = params.conversationRef.conversation?.conversationType?.toLowerCase();
	if (!(conversationType === "personal" && parsedReflection.followUp && Boolean(parsedReflection.userMessage))) {
		if (parsedReflection.followUp && conversationType !== "personal") log.debug?.("skipping reflection follow-up outside direct message", {
			sessionKey,
			conversationType
		});
		return;
	}
	try {
		await sendReflectionFollowUp({
			adapter: params.adapter,
			appId: params.appId,
			conversationRef: params.conversationRef,
			userMessage: parsedReflection.userMessage
		});
		log.info("sent reflection follow-up", { sessionKey });
	} catch (err) {
		log.debug?.("failed to send reflection follow-up", { error: String(err) });
	}
}
//#endregion
//#region extensions/msteams/src/inbound.ts
/**
* Decode common HTML entities to plain text.
*/
function decodeHtmlEntities(html) {
	return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}
/**
* Strip HTML tags, preserving text content.
*/
function htmlToPlainText(html) {
	return decodeHtmlEntities(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}
/**
* Extract quote info from MS Teams HTML reply attachments.
* Teams wraps quoted content in a blockquote with itemtype="http://schema.skype.com/Reply".
*/
function extractMSTeamsQuoteInfo(attachments) {
	for (const att of attachments) {
		const content = typeof att.content === "string" ? att.content : typeof att.content === "object" && att.content !== null ? String(att.content.text ?? att.content.body ?? "") : "";
		if (!content) continue;
		if (!content.includes("http://schema.skype.com/Reply")) continue;
		const senderMatch = /<strong[^>]*itemprop=["']mri["'][^>]*>(.*?)<\/strong>/i.exec(content);
		const sender = senderMatch?.[1] ? htmlToPlainText(senderMatch[1]) : void 0;
		const bodyMatch = /<p[^>]*itemprop=["']copy["'][^>]*>(.*?)<\/p>/is.exec(content);
		const body = bodyMatch?.[1] ? htmlToPlainText(bodyMatch[1]) : void 0;
		if (body) return {
			sender: sender ?? "unknown",
			body
		};
	}
}
function normalizeMSTeamsConversationId(raw) {
	return raw.split(";")[0] ?? raw;
}
function extractMSTeamsConversationMessageId(raw) {
	if (!raw) return;
	return (/(?:^|;)messageid=([^;]+)/i.exec(raw)?.[1]?.trim() ?? "") || void 0;
}
function parseMSTeamsActivityTimestamp(value) {
	if (!value) return;
	if (value instanceof Date) return value;
	if (typeof value !== "string") return;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? void 0 : date;
}
function stripMSTeamsMentionTags(text) {
	return text.replace(/<at[^>]*>.*?<\/at>/gi, "").trim();
}
function wasMSTeamsBotMentioned(activity) {
	const botId = activity.recipient?.id;
	if (!botId) return false;
	return (activity.entities ?? []).some((e) => e.type === "mention" && e.mentioned?.id === botId);
}
//#endregion
//#region extensions/msteams/src/monitor-handler/access.ts
async function resolveMSTeamsSenderAccess(params) {
	const activity = params.activity;
	const msteamsCfg = params.cfg.channels?.msteams;
	const conversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "unknown");
	const convType = activity.conversation?.conversationType?.toLowerCase();
	const isDirectMessage = convType === "personal" || !convType && !activity.conversation?.isGroup;
	const senderId = activity.from?.aadObjectId ?? activity.from?.id ?? "unknown";
	const senderName = activity.from?.name ?? activity.from?.id ?? senderId;
	const pairing = createChannelPairingController({
		core: getMSTeamsRuntime(),
		channel: "msteams",
		accountId: DEFAULT_ACCOUNT_ID
	});
	const dmPolicy = msteamsCfg?.dmPolicy ?? "pairing";
	const storedAllowFrom = await readStoreAllowFromForDmPolicy({
		provider: "msteams",
		accountId: pairing.accountId,
		dmPolicy,
		readStore: pairing.readStoreForDmPolicy
	});
	const configuredDmAllowFrom = (msteamsCfg?.allowFrom ?? []).map((entry) => String(entry));
	const groupAllowFrom = msteamsCfg?.groupAllowFrom;
	const resolvedAllowFromLists = resolveEffectiveAllowFromLists({
		allowFrom: configuredDmAllowFrom,
		groupAllowFrom,
		storeAllowFrom: storedAllowFrom,
		dmPolicy
	});
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const groupPolicy = !isDirectMessage && msteamsCfg ? msteamsCfg.groupPolicy ?? defaultGroupPolicy ?? "allowlist" : "disabled";
	const effectiveGroupAllowFrom = resolvedAllowFromLists.effectiveGroupAllowFrom;
	const allowNameMatching = isDangerousNameMatchingEnabled(msteamsCfg);
	const channelGate = resolveMSTeamsRouteConfig({
		cfg: msteamsCfg,
		teamId: activity.channelData?.team?.id,
		teamName: activity.channelData?.team?.name,
		conversationId,
		channelName: activity.channelData?.channel?.name,
		allowNameMatching
	});
	const senderGroupPolicy = channelGate.allowlistConfigured && effectiveGroupAllowFrom.length === 0 ? groupPolicy : resolveSenderScopedGroupPolicy({
		groupPolicy,
		groupAllowFrom: effectiveGroupAllowFrom
	});
	const access = resolveDmGroupAccessWithLists({
		isGroup: !isDirectMessage,
		dmPolicy,
		groupPolicy: senderGroupPolicy,
		allowFrom: configuredDmAllowFrom,
		groupAllowFrom,
		storeAllowFrom: storedAllowFrom,
		groupAllowFromFallbackToAllowFrom: false,
		isSenderAllowed: (allowFrom) => resolveMSTeamsAllowlistMatch({
			allowFrom,
			senderId,
			senderName,
			allowNameMatching
		}).allowed
	});
	return {
		msteamsCfg,
		pairing,
		isDirectMessage,
		conversationId,
		senderId,
		senderName,
		dmPolicy,
		channelGate,
		access,
		senderGroupAccess: evaluateSenderGroupAccessForPolicy({
			groupPolicy,
			groupAllowFrom: effectiveGroupAllowFrom,
			senderId,
			isSenderAllowed: (_senderId, allowFrom) => resolveMSTeamsAllowlistMatch({
				allowFrom,
				senderId,
				senderName,
				allowNameMatching
			}).allowed
		}),
		configuredDmAllowFrom,
		effectiveDmAllowFrom: access.effectiveAllowFrom,
		effectiveGroupAllowFrom,
		allowNameMatching,
		groupPolicy
	};
}
//#endregion
//#region extensions/msteams/src/attachments/remote-media.ts
async function downloadAndStoreMSTeamsRemoteMedia(params) {
	const fetched = await getMSTeamsRuntime().channel.media.fetchRemoteMedia({
		url: params.url,
		fetchImpl: params.fetchImpl,
		filePathHint: params.filePathHint,
		maxBytes: params.maxBytes,
		ssrfPolicy: params.ssrfPolicy
	});
	const mime = await getMSTeamsRuntime().media.detectMime({
		buffer: fetched.buffer,
		headerMime: fetched.contentType ?? params.contentTypeHint,
		filePath: params.filePathHint
	});
	const originalFilename = params.preserveFilenames ? params.filePathHint : void 0;
	const saved = await getMSTeamsRuntime().channel.media.saveMediaBuffer(fetched.buffer, mime ?? params.contentTypeHint, "inbound", params.maxBytes, originalFilename);
	return {
		path: saved.path,
		contentType: saved.contentType,
		placeholder: params.placeholder ?? inferPlaceholder({
			contentType: saved.contentType,
			fileName: params.filePathHint
		})
	};
}
//#endregion
//#region extensions/msteams/src/attachments/download.ts
function resolveDownloadCandidate(att) {
	const contentType = normalizeContentType(att.contentType);
	const name = typeof att.name === "string" ? att.name.trim() : "";
	if (contentType === "application/vnd.microsoft.teams.file.download.info") {
		if (!isRecord(att.content)) return null;
		const downloadUrl = typeof att.content.downloadUrl === "string" ? att.content.downloadUrl.trim() : "";
		if (!downloadUrl) return null;
		const fileType = typeof att.content.fileType === "string" ? att.content.fileType.trim() : "";
		const uniqueId = typeof att.content.uniqueId === "string" ? att.content.uniqueId.trim() : "";
		const fileName = typeof att.content.fileName === "string" ? att.content.fileName.trim() : "";
		const fileHint = name || fileName || (uniqueId && fileType ? `${uniqueId}.${fileType}` : "");
		return {
			url: downloadUrl,
			fileHint: fileHint || void 0,
			contentTypeHint: void 0,
			placeholder: inferPlaceholder({
				contentType,
				fileName: fileHint,
				fileType
			})
		};
	}
	const contentUrl = typeof att.contentUrl === "string" ? att.contentUrl.trim() : "";
	if (!contentUrl) return null;
	return {
		url: contentUrl,
		fileHint: name || void 0,
		contentTypeHint: contentType,
		placeholder: inferPlaceholder({
			contentType,
			fileName: name
		})
	};
}
function scopeCandidatesForUrl(url) {
	try {
		const host = new URL(url).hostname.toLowerCase();
		return host.endsWith("graph.microsoft.com") || host.endsWith("sharepoint.com") || host.endsWith("1drv.ms") || host.includes("sharepoint") ? ["https://graph.microsoft.com", "https://api.botframework.com"] : ["https://api.botframework.com", "https://graph.microsoft.com"];
	} catch {
		return ["https://api.botframework.com", "https://graph.microsoft.com"];
	}
}
function isRedirectStatus(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
async function fetchWithAuthFallback(params) {
	const firstAttempt = await safeFetchWithPolicy({
		url: params.url,
		policy: params.policy,
		fetchFn: params.fetchFn,
		requestInit: params.requestInit
	});
	if (firstAttempt.ok) return firstAttempt;
	if (!params.tokenProvider) return firstAttempt;
	if (firstAttempt.status !== 401 && firstAttempt.status !== 403) return firstAttempt;
	if (!isUrlAllowed(params.url, params.policy.authAllowHosts)) return firstAttempt;
	const scopes = scopeCandidatesForUrl(params.url);
	const fetchFn = params.fetchFn ?? fetch;
	for (const scope of scopes) try {
		const token = await params.tokenProvider.getAccessToken(scope);
		const authHeaders = new Headers(params.requestInit?.headers);
		authHeaders.set("Authorization", `Bearer ${token}`);
		const authAttempt = await safeFetchWithPolicy({
			url: params.url,
			policy: params.policy,
			fetchFn,
			requestInit: {
				...params.requestInit,
				headers: authHeaders
			}
		});
		if (authAttempt.ok) return authAttempt;
		if (isRedirectStatus(authAttempt.status)) return authAttempt;
		if (authAttempt.status !== 401 && authAttempt.status !== 403) continue;
	} catch {}
	return firstAttempt;
}
/**
* Download all file attachments from a Teams message (images, documents, etc.).
* Renamed from downloadMSTeamsImageAttachments to support all file types.
*/
async function downloadMSTeamsAttachments(params) {
	const list = Array.isArray(params.attachments) ? params.attachments : [];
	if (list.length === 0) return [];
	const policy = resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const allowHosts = policy.allowHosts;
	const ssrfPolicy = resolveMediaSsrfPolicy(allowHosts);
	const candidates = list.filter(isDownloadableAttachment).map(resolveDownloadCandidate).filter(Boolean);
	const inlineCandidates = extractInlineImageCandidates(list);
	const seenUrls = /* @__PURE__ */ new Set();
	for (const inline of inlineCandidates) if (inline.kind === "url") {
		if (!isUrlAllowed(inline.url, allowHosts)) continue;
		if (seenUrls.has(inline.url)) continue;
		seenUrls.add(inline.url);
		candidates.push({
			url: inline.url,
			fileHint: inline.fileHint,
			contentTypeHint: inline.contentType,
			placeholder: inline.placeholder
		});
	}
	if (candidates.length === 0 && inlineCandidates.length === 0) return [];
	const out = [];
	for (const inline of inlineCandidates) {
		if (inline.kind !== "data") continue;
		if (inline.data.byteLength > params.maxBytes) continue;
		try {
			const saved = await getMSTeamsRuntime().channel.media.saveMediaBuffer(inline.data, inline.contentType, "inbound", params.maxBytes);
			out.push({
				path: saved.path,
				contentType: saved.contentType,
				placeholder: inline.placeholder
			});
		} catch {}
	}
	for (const candidate of candidates) {
		if (!isUrlAllowed(candidate.url, allowHosts)) continue;
		try {
			const media = await downloadAndStoreMSTeamsRemoteMedia({
				url: candidate.url,
				filePathHint: candidate.fileHint ?? candidate.url,
				maxBytes: params.maxBytes,
				contentTypeHint: candidate.contentTypeHint,
				placeholder: candidate.placeholder,
				preserveFilenames: params.preserveFilenames,
				ssrfPolicy,
				fetchImpl: (input, init) => fetchWithAuthFallback({
					url: resolveRequestUrl(input),
					tokenProvider: params.tokenProvider,
					fetchFn: params.fetchFn,
					requestInit: init,
					policy
				})
			});
			out.push(media);
		} catch {}
	}
	return out;
}
//#endregion
//#region extensions/msteams/src/attachments/graph.ts
function readNestedString(value, keys) {
	let current = value;
	for (const key of keys) {
		if (!isRecord(current)) return;
		current = current[key];
	}
	return typeof current === "string" && current.trim() ? current.trim() : void 0;
}
function buildMSTeamsGraphMessageUrls(params) {
	const conversationType = params.conversationType?.trim().toLowerCase() ?? "";
	const messageIdCandidates = /* @__PURE__ */ new Set();
	const pushCandidate = (value) => {
		const trimmed = typeof value === "string" ? value.trim() : "";
		if (trimmed) messageIdCandidates.add(trimmed);
	};
	pushCandidate(params.messageId);
	pushCandidate(params.conversationMessageId);
	pushCandidate(readNestedString(params.channelData, ["messageId"]));
	pushCandidate(readNestedString(params.channelData, ["teamsMessageId"]));
	const replyToId = typeof params.replyToId === "string" ? params.replyToId.trim() : "";
	if (conversationType === "channel") {
		const teamId = readNestedString(params.channelData, ["team", "id"]) ?? readNestedString(params.channelData, ["teamId"]);
		const channelId = readNestedString(params.channelData, ["channel", "id"]) ?? readNestedString(params.channelData, ["channelId"]) ?? readNestedString(params.channelData, ["teamsChannelId"]);
		if (!teamId || !channelId) return [];
		const urls = [];
		if (replyToId) for (const candidate of messageIdCandidates) {
			if (candidate === replyToId) continue;
			urls.push(`${GRAPH_ROOT}/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(replyToId)}/replies/${encodeURIComponent(candidate)}`);
		}
		if (messageIdCandidates.size === 0 && replyToId) messageIdCandidates.add(replyToId);
		for (const candidate of messageIdCandidates) urls.push(`${GRAPH_ROOT}/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(candidate)}`);
		return Array.from(new Set(urls));
	}
	const chatId = params.conversationId?.trim() || readNestedString(params.channelData, ["chatId"]);
	if (!chatId) return [];
	if (messageIdCandidates.size === 0 && replyToId) messageIdCandidates.add(replyToId);
	const urls = Array.from(messageIdCandidates).map((candidate) => `${GRAPH_ROOT}/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(candidate)}`);
	return Array.from(new Set(urls));
}
async function fetchGraphCollection(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		fetchImpl: fetchFn,
		init: { headers: { Authorization: `Bearer ${params.accessToken}` } },
		policy: params.ssrfPolicy,
		auditContext: "msteams.graph.collection"
	});
	try {
		const status = response.status;
		if (!response.ok) return {
			status,
			items: []
		};
		try {
			const data = await response.json();
			return {
				status,
				items: Array.isArray(data.value) ? data.value : []
			};
		} catch {
			return {
				status,
				items: []
			};
		}
	} finally {
		await release();
	}
}
function normalizeGraphAttachment(att) {
	let content = att.content;
	if (typeof content === "string") try {
		content = JSON.parse(content);
	} catch {}
	return {
		contentType: normalizeContentType(att.contentType) ?? void 0,
		contentUrl: att.contentUrl ?? void 0,
		name: att.name ?? void 0,
		thumbnailUrl: att.thumbnailUrl ?? void 0,
		content
	};
}
/**
* Download all hosted content from a Teams message (images, documents, etc.).
* Renamed from downloadGraphHostedImages to support all file types.
*/
async function downloadGraphHostedContent(params) {
	const hosted = await fetchGraphCollection({
		url: `${params.messageUrl}/hostedContents`,
		accessToken: params.accessToken,
		fetchFn: params.fetchFn,
		ssrfPolicy: params.ssrfPolicy
	});
	if (hosted.items.length === 0) return {
		media: [],
		status: hosted.status,
		count: 0
	};
	const out = [];
	for (const item of hosted.items) {
		const contentBytes = typeof item.contentBytes === "string" ? item.contentBytes : "";
		if (!contentBytes) continue;
		let buffer;
		try {
			buffer = Buffer.from(contentBytes, "base64");
		} catch {
			continue;
		}
		if (buffer.byteLength > params.maxBytes) continue;
		const mime = await getMSTeamsRuntime().media.detectMime({
			buffer,
			headerMime: item.contentType ?? void 0
		});
		try {
			const saved = await getMSTeamsRuntime().channel.media.saveMediaBuffer(buffer, mime ?? item.contentType ?? void 0, "inbound", params.maxBytes);
			out.push({
				path: saved.path,
				contentType: saved.contentType,
				placeholder: inferPlaceholder({ contentType: saved.contentType })
			});
		} catch {}
	}
	return {
		media: out,
		status: hosted.status,
		count: hosted.items.length
	};
}
async function downloadMSTeamsGraphMedia(params) {
	if (!params.messageUrl || !params.tokenProvider) return { media: [] };
	const policy = resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const ssrfPolicy = resolveMediaSsrfPolicy(policy.allowHosts);
	const messageUrl = params.messageUrl;
	let accessToken;
	try {
		accessToken = await params.tokenProvider.getAccessToken("https://graph.microsoft.com");
	} catch {
		return {
			media: [],
			messageUrl,
			tokenError: true
		};
	}
	const fetchFn = params.fetchFn ?? fetch;
	const sharePointMedia = [];
	const downloadedReferenceUrls = /* @__PURE__ */ new Set();
	try {
		const { response: msgRes, release } = await fetchWithSsrFGuard({
			url: messageUrl,
			fetchImpl: fetchFn,
			init: { headers: { Authorization: `Bearer ${accessToken}` } },
			policy: ssrfPolicy,
			auditContext: "msteams.graph.message"
		});
		try {
			if (msgRes.ok) {
				const spAttachments = ((await msgRes.json()).attachments ?? []).filter((a) => a.contentType === "reference" && a.contentUrl && a.name);
				for (const att of spAttachments) {
					const name = att.name ?? "file";
					try {
						const shareUrl = att.contentUrl;
						if (!isUrlAllowed(shareUrl, policy.allowHosts)) continue;
						const media = await downloadAndStoreMSTeamsRemoteMedia({
							url: `${GRAPH_ROOT}/shares/u!${Buffer.from(shareUrl).toString("base64url")}/driveItem/content`,
							filePathHint: name,
							maxBytes: params.maxBytes,
							contentTypeHint: "application/octet-stream",
							preserveFilenames: params.preserveFilenames,
							ssrfPolicy,
							fetchImpl: async (input, init) => {
								const requestUrl = resolveRequestUrl(input);
								const headers = new Headers(init?.headers);
								applyAuthorizationHeaderForUrl({
									headers,
									url: requestUrl,
									authAllowHosts: policy.authAllowHosts,
									bearerToken: accessToken
								});
								return await safeFetchWithPolicy({
									url: requestUrl,
									policy,
									fetchFn,
									requestInit: {
										...init,
										headers
									}
								});
							}
						});
						sharePointMedia.push(media);
						downloadedReferenceUrls.add(shareUrl);
					} catch {}
				}
			}
		} finally {
			await release();
		}
	} catch {}
	const hosted = await downloadGraphHostedContent({
		accessToken,
		messageUrl,
		maxBytes: params.maxBytes,
		fetchFn: params.fetchFn,
		preserveFilenames: params.preserveFilenames,
		ssrfPolicy
	});
	const attachments = await fetchGraphCollection({
		url: `${messageUrl}/attachments`,
		accessToken,
		fetchFn: params.fetchFn,
		ssrfPolicy
	});
	const normalizedAttachments = attachments.items.map(normalizeGraphAttachment);
	const filteredAttachments = sharePointMedia.length > 0 ? normalizedAttachments.filter((att) => {
		if (att.contentType?.toLowerCase() !== "reference") return true;
		const url = typeof att.contentUrl === "string" ? att.contentUrl : "";
		if (!url) return true;
		return !downloadedReferenceUrls.has(url);
	}) : normalizedAttachments;
	const attachmentMedia = await downloadMSTeamsAttachments({
		attachments: filteredAttachments,
		maxBytes: params.maxBytes,
		tokenProvider: params.tokenProvider,
		allowHosts: policy.allowHosts,
		authAllowHosts: policy.authAllowHosts,
		fetchFn: params.fetchFn,
		preserveFilenames: params.preserveFilenames
	});
	return {
		media: [
			...sharePointMedia,
			...hosted.media,
			...attachmentMedia
		],
		hostedCount: hosted.count,
		attachmentCount: filteredAttachments.length + sharePointMedia.length,
		hostedStatus: hosted.status,
		attachmentStatus: attachments.status,
		messageUrl
	};
}
//#endregion
//#region extensions/msteams/src/attachments/html.ts
function summarizeMSTeamsHtmlAttachments(attachments) {
	const list = Array.isArray(attachments) ? attachments : [];
	if (list.length === 0) return;
	let htmlAttachments = 0;
	let imgTags = 0;
	let dataImages = 0;
	let cidImages = 0;
	const srcHosts = /* @__PURE__ */ new Set();
	let attachmentTags = 0;
	const attachmentIds = /* @__PURE__ */ new Set();
	for (const att of list) {
		const html = extractHtmlFromAttachment(att);
		if (!html) continue;
		htmlAttachments += 1;
		IMG_SRC_RE.lastIndex = 0;
		let match = IMG_SRC_RE.exec(html);
		while (match) {
			imgTags += 1;
			const src = match[1]?.trim();
			if (src) if (src.startsWith("data:")) dataImages += 1;
			else if (src.startsWith("cid:")) cidImages += 1;
			else srcHosts.add(safeHostForUrl(src));
			match = IMG_SRC_RE.exec(html);
		}
		ATTACHMENT_TAG_RE.lastIndex = 0;
		let attachmentMatch = ATTACHMENT_TAG_RE.exec(html);
		while (attachmentMatch) {
			attachmentTags += 1;
			const id = attachmentMatch[1]?.trim();
			if (id) attachmentIds.add(id);
			attachmentMatch = ATTACHMENT_TAG_RE.exec(html);
		}
	}
	if (htmlAttachments === 0) return;
	return {
		htmlAttachments,
		imgTags,
		dataImages,
		cidImages,
		srcHosts: Array.from(srcHosts).slice(0, 5),
		attachmentTags,
		attachmentIds: Array.from(attachmentIds).slice(0, 5)
	};
}
function buildMSTeamsAttachmentPlaceholder(attachments) {
	const list = Array.isArray(attachments) ? attachments : [];
	if (list.length === 0) return "";
	const totalImages = list.filter(isLikelyImageAttachment).length + extractInlineImageCandidates(list).length;
	if (totalImages > 0) return `<media:image>${totalImages > 1 ? ` (${totalImages} images)` : ""}`;
	const count = list.length;
	return `<media:document>${count > 1 ? ` (${count} files)` : ""}`;
}
//#endregion
//#region extensions/msteams/src/attachments/payload.ts
function buildMSTeamsMediaPayload(mediaList) {
	return buildMediaPayload(mediaList, { preserveMediaTypeCardinality: true });
}
//#endregion
//#region extensions/msteams/src/graph-thread.ts
const teamGroupIdCache = /* @__PURE__ */ new Map();
const CACHE_TTL_MS = 600 * 1e3;
/**
* Strip HTML tags from Teams message content, preserving @mention display names.
* Teams wraps mentions in <at>Name</at> tags.
*/
function stripHtmlFromTeamsMessage(html) {
	let text = html.replace(/<at[^>]*>(.*?)<\/at>/gi, "@$1");
	text = text.replace(/<[^>]*>/g, " ");
	text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
	return text.replace(/\s+/g, " ").trim();
}
/**
* Resolve the Azure AD group GUID for a Teams conversation team ID.
* Results are cached with a TTL to avoid repeated Graph API calls.
*/
async function resolveTeamGroupId(token, conversationTeamId) {
	const cached = teamGroupIdCache.get(conversationTeamId);
	if (cached && cached.expiresAt > Date.now()) return cached.groupId;
	try {
		const groupId = (await fetchGraphJson({
			token,
			path: `/teams/${encodeURIComponent(conversationTeamId)}?$select=id`
		})).id ?? conversationTeamId;
		teamGroupIdCache.set(conversationTeamId, {
			groupId,
			expiresAt: Date.now() + CACHE_TTL_MS
		});
		return groupId;
	} catch {
		return conversationTeamId;
	}
}
/**
* Fetch a single channel message (the parent/root of a thread).
* Returns undefined on error so callers can degrade gracefully.
*/
async function fetchChannelMessage(token, groupId, channelId, messageId) {
	const path = `/teams/${encodeURIComponent(groupId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}?$select=id,from,body,createdDateTime`;
	try {
		return await fetchGraphJson({
			token,
			path
		});
	} catch {
		return;
	}
}
/**
* Fetch thread replies for a channel message, ordered chronologically.
*
* **Limitation:** The Graph API replies endpoint (`/messages/{id}/replies`) does not
* support `$orderby`, so results are always returned in ascending (oldest-first) order.
* Combined with the `$top` cap of 50, this means only the **oldest 50 replies** are
* returned for long threads — newer replies are silently omitted. There is currently no
* Graph API workaround for this; pagination via `@odata.nextLink` can retrieve more
* replies but still in ascending order only.
*/
async function fetchThreadReplies(token, groupId, channelId, messageId, limit = 50) {
	return (await fetchGraphJson({
		token,
		path: `/teams/${encodeURIComponent(groupId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/replies?$top=${Math.min(Math.max(limit, 1), 50)}&$select=id,from,body,createdDateTime`
	})).value ?? [];
}
/**
* Format thread messages into a context string for the agent.
* Skips the current message (by id) and blank messages.
*/
function formatThreadContext(messages, currentMessageId) {
	const lines = [];
	for (const msg of messages) {
		if (msg.id && msg.id === currentMessageId) continue;
		const sender = msg.from?.user?.displayName ?? msg.from?.application?.displayName ?? "unknown";
		const contentType = msg.body?.contentType ?? "text";
		const rawContent = msg.body?.content ?? "";
		const content = contentType === "html" ? stripHtmlFromTeamsMessage(rawContent) : rawContent.trim();
		if (!content) continue;
		lines.push(`${sender}: ${content}`);
	}
	return lines.join("\n");
}
//#endregion
//#region extensions/msteams/src/streaming-message.ts
/**
* Teams streaming message using the streaminfo entity protocol.
*
* Follows the official Teams SDK pattern:
* 1. First chunk → POST a typing activity with streaminfo entity (streamType: "streaming")
* 2. Subsequent chunks → POST typing activities with streaminfo + incrementing streamSequence
* 3. Finalize → POST a message activity with streaminfo (streamType: "final")
*
* Uses the shared draft-stream-loop for throttling (avoids rate limits).
*/
/** Default throttle interval between stream updates (ms).
* Teams docs recommend buffering tokens for 1.5-2s; limit is 1 req/s. */
const DEFAULT_THROTTLE_MS = 1500;
/** Minimum chars before sending the first streaming message. */
const MIN_INITIAL_CHARS = 20;
/** Teams message text limit. */
const TEAMS_MAX_CHARS = 4e3;
function extractId(response) {
	if (response && typeof response === "object" && "id" in response) {
		const id = response.id;
		return typeof id === "string" ? id : void 0;
	}
}
function buildStreamInfoEntity(streamId, streamType, streamSequence) {
	const entity = {
		type: "streaminfo",
		streamType
	};
	if (streamId) entity.streamId = streamId;
	if (streamSequence != null) entity.streamSequence = streamSequence;
	return entity;
}
var TeamsHttpStream = class {
	constructor(options) {
		this.accumulatedText = "";
		this.streamId = void 0;
		this.sequenceNumber = 0;
		this.stopped = false;
		this.finalized = false;
		this.streamFailed = false;
		this.lastStreamedText = "";
		this.sendActivity = options.sendActivity;
		this.feedbackLoopEnabled = options.feedbackLoopEnabled ?? false;
		this.onError = options.onError;
		this.loop = createDraftStreamLoop({
			throttleMs: options.throttleMs ?? DEFAULT_THROTTLE_MS,
			isStopped: () => this.stopped,
			sendOrEditStreamMessage: (text) => this.pushStreamChunk(text)
		});
	}
	/**
	* Send an informative status update (blue progress bar in Teams).
	* Call this immediately when a message is received, before LLM starts generating.
	* Establishes the stream so subsequent chunks continue from this stream ID.
	*/
	async sendInformativeUpdate(text) {
		if (this.stopped || this.finalized) return;
		this.sequenceNumber++;
		const activity = {
			type: "typing",
			text,
			entities: [buildStreamInfoEntity(this.streamId, "informative", this.sequenceNumber)]
		};
		try {
			const response = await this.sendActivity(activity);
			if (!this.streamId) this.streamId = extractId(response);
		} catch (err) {
			this.onError?.(err);
		}
	}
	/**
	* Ingest partial text from the LLM token stream.
	* Called by onPartialReply — accumulates text and throttles updates.
	*/
	update(text) {
		if (this.stopped || this.finalized) return;
		this.accumulatedText = text;
		if (!this.streamId && this.accumulatedText.length < MIN_INITIAL_CHARS) return;
		if (this.accumulatedText.length > TEAMS_MAX_CHARS) {
			this.streamFailed = true;
			this.finalize();
			return;
		}
		this.loop.update(this.accumulatedText);
	}
	/**
	* Finalize the stream — send the final message activity.
	*/
	async finalize() {
		if (this.finalized) return;
		this.finalized = true;
		this.stopped = true;
		this.loop.stop();
		await this.loop.waitForInFlight();
		if (!this.accumulatedText.trim()) return;
		if (this.streamFailed) {
			if (this.streamId) try {
				await this.sendActivity({
					type: "message",
					text: this.lastStreamedText || "",
					channelData: { feedbackLoopEnabled: this.feedbackLoopEnabled },
					entities: [AI_GENERATED_ENTITY, buildStreamInfoEntity(this.streamId, "final")]
				});
			} catch {}
			return;
		}
		try {
			const entities = [AI_GENERATED_ENTITY];
			if (this.streamId) entities.push(buildStreamInfoEntity(this.streamId, "final"));
			const finalActivity = {
				type: "message",
				text: this.accumulatedText,
				channelData: { feedbackLoopEnabled: this.feedbackLoopEnabled },
				entities
			};
			await this.sendActivity(finalActivity);
		} catch (err) {
			this.onError?.(err);
		}
	}
	/** Whether streaming successfully delivered content (at least one chunk sent, not failed). */
	get hasContent() {
		return this.accumulatedText.length > 0 && !this.streamFailed;
	}
	/** Whether the stream has been finalized. */
	get isFinalized() {
		return this.finalized;
	}
	/** Whether streaming fell back (not used in this implementation). */
	get isFallback() {
		return false;
	}
	/**
	* Send a single streaming chunk as a typing activity with streaminfo.
	* Per the Teams REST API spec:
	* - First chunk: no streamId, streamSequence=1 → returns 201 with { id: streamId }
	* - Subsequent chunks: include streamId, increment streamSequence → returns 202
	*/
	async pushStreamChunk(text) {
		if (this.stopped && !this.finalized) return false;
		this.sequenceNumber++;
		const activity = {
			type: "typing",
			text,
			entities: [buildStreamInfoEntity(this.streamId, "streaming", this.sequenceNumber)]
		};
		try {
			const response = await this.sendActivity(activity);
			if (!this.streamId) this.streamId = extractId(response);
			this.lastStreamedText = text;
			return true;
		} catch (err) {
			const axiosData = err?.response;
			const statusCode = axiosData?.status ?? err?.statusCode;
			const responseBody = axiosData?.data ? JSON.stringify(axiosData.data).slice(0, 300) : "";
			const msg = err instanceof Error ? err.message : String(err);
			this.onError?.(/* @__PURE__ */ new Error(`stream POST failed (HTTP ${statusCode ?? "?"}): ${msg}${responseBody ? ` body=${responseBody}` : ""}`));
			this.streamFailed = true;
			return false;
		}
	}
};
//#endregion
//#region extensions/msteams/src/reply-stream-controller.ts
const INFORMATIVE_STATUS_TEXTS = [
	"Thinking...",
	"Working on that...",
	"Checking the details...",
	"Putting an answer together..."
];
function pickInformativeStatusText(random = Math.random) {
	return INFORMATIVE_STATUS_TEXTS[Math.floor(random() * INFORMATIVE_STATUS_TEXTS.length)] ?? INFORMATIVE_STATUS_TEXTS[0];
}
function createTeamsReplyStreamController(params) {
	const stream = params.conversationType?.toLowerCase() === "personal" ? new TeamsHttpStream({
		sendActivity: (activity) => params.context.sendActivity(activity),
		feedbackLoopEnabled: params.feedbackLoopEnabled,
		onError: (err) => {
			params.log.debug?.(`stream error: ${err instanceof Error ? err.message : String(err)}`);
		}
	}) : void 0;
	let streamReceivedTokens = false;
	let informativeUpdateSent = false;
	let pendingFinalize;
	return {
		async onReplyStart() {
			if (!stream || informativeUpdateSent) return;
			informativeUpdateSent = true;
			await stream.sendInformativeUpdate(pickInformativeStatusText(params.random));
		},
		onPartialReply(payload) {
			if (!stream || !payload.text) return;
			streamReceivedTokens = true;
			stream.update(payload.text);
		},
		preparePayload(payload) {
			if (!stream || !streamReceivedTokens || !stream.hasContent || stream.isFinalized) return payload;
			streamReceivedTokens = false;
			pendingFinalize = stream.finalize();
			if (!Boolean(payload.mediaUrl || payload.mediaUrls?.length)) return;
			return {
				...payload,
				text: void 0
			};
		},
		async finalize() {
			await pendingFinalize;
			await stream?.finalize();
		},
		hasStream() {
			return Boolean(stream);
		}
	};
}
//#endregion
//#region extensions/msteams/src/reply-dispatcher.ts
function createMSTeamsReplyDispatcher(params) {
	const core = getMSTeamsRuntime();
	const msteamsCfg = params.cfg.channels?.msteams;
	const conversationType = params.conversationRef.conversation?.conversationType?.toLowerCase();
	const sendTypingIndicator = conversationType === "personal" || conversationType === "groupchat" ? async () => {
		await withRevokedProxyFallback({
			run: async () => {
				await params.context.sendActivity({ type: "typing" });
			},
			onRevoked: async () => {
				const baseRef = buildConversationReference(params.conversationRef);
				await params.adapter.continueConversation(params.appId, {
					...baseRef,
					activityId: void 0
				}, async (ctx) => {
					await ctx.sendActivity({ type: "typing" });
				});
			},
			onRevokedLog: () => {
				params.log.debug?.("turn context revoked, sending typing via proactive messaging");
			}
		});
	} : async () => {};
	const { onModelSelected, typingCallbacks, ...replyPipeline } = createChannelReplyPipeline({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "msteams",
		accountId: params.accountId,
		typing: {
			start: sendTypingIndicator,
			onStartError: (err) => {
				logTypingFailure({
					log: (message) => params.log.debug?.(message),
					channel: "msteams",
					action: "start",
					error: err
				});
			}
		}
	});
	const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "msteams");
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "msteams"
	});
	const mediaMaxBytes = resolveChannelMediaMaxBytes({
		cfg: params.cfg,
		resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb
	});
	const feedbackLoopEnabled = params.cfg.channels?.msteams?.feedbackEnabled !== false;
	const streamController = createTeamsReplyStreamController({
		conversationType,
		context: params.context,
		feedbackLoopEnabled,
		log: params.log
	});
	const blockStreamingEnabled = typeof msteamsCfg?.blockStreaming === "boolean" ? msteamsCfg.blockStreaming : false;
	const pendingMessages = [];
	const sendMessages = async (messages) => {
		return sendMSTeamsMessages({
			replyStyle: params.replyStyle,
			adapter: params.adapter,
			appId: params.appId,
			conversationRef: params.conversationRef,
			context: params.context,
			messages,
			retry: {},
			onRetry: (event) => {
				params.log.debug?.("retrying send", {
					replyStyle: params.replyStyle,
					...event
				});
			},
			tokenProvider: params.tokenProvider,
			sharePointSiteId: params.sharePointSiteId,
			mediaMaxBytes,
			feedbackLoopEnabled
		});
	};
	const flushPendingMessages = async () => {
		if (pendingMessages.length === 0) return;
		const toSend = pendingMessages.splice(0);
		const total = toSend.length;
		let ids;
		try {
			ids = await sendMessages(toSend);
		} catch {
			ids = [];
			let failed = 0;
			for (const msg of toSend) try {
				const msgIds = await sendMessages([msg]);
				ids.push(...msgIds);
			} catch {
				failed += 1;
				params.log.debug?.("individual message send failed, continuing with remaining blocks");
			}
			if (failed > 0) params.log.warn?.(`failed to deliver ${failed} of ${total} message blocks`, {
				failed,
				total
			});
		}
		if (ids.length > 0) params.onSentMessageIds?.(ids);
	};
	const { dispatcher, replyOptions, markDispatchIdle: baseMarkDispatchIdle } = core.channel.reply.createReplyDispatcherWithTyping({
		...replyPipeline,
		humanDelay: core.channel.reply.resolveHumanDelayConfig(params.cfg, params.agentId),
		onReplyStart: async () => {
			await streamController.onReplyStart();
			await typingCallbacks?.onReplyStart?.();
		},
		typingCallbacks,
		deliver: async (payload) => {
			const preparedPayload = streamController.preparePayload(payload);
			if (!preparedPayload) return;
			const messages = renderReplyPayloadsToMessages([preparedPayload], {
				textChunkLimit: params.textLimit,
				chunkText: true,
				mediaMode: "split",
				tableMode,
				chunkMode
			});
			pendingMessages.push(...messages);
			if (blockStreamingEnabled) await flushPendingMessages();
		},
		onError: (err, info) => {
			const errMsg = formatUnknownError(err);
			const classification = classifyMSTeamsSendError(err);
			const hint = formatMSTeamsSendErrorHint(classification);
			params.runtime.error?.(`msteams ${info.kind} reply failed: ${errMsg}${hint ? ` (${hint})` : ""}`);
			params.log.error("reply failed", {
				kind: info.kind,
				error: errMsg,
				classification,
				hint
			});
		}
	});
	const markDispatchIdle = () => {
		return flushPendingMessages().catch((err) => {
			const errMsg = formatUnknownError(err);
			const classification = classifyMSTeamsSendError(err);
			const hint = formatMSTeamsSendErrorHint(classification);
			params.runtime.error?.(`msteams flush reply failed: ${errMsg}${hint ? ` (${hint})` : ""}`);
			params.log.error("flush reply failed", {
				error: errMsg,
				classification,
				hint
			});
		}).then(() => {
			return streamController.finalize().catch((err) => {
				params.log.debug?.("stream finalize failed", { error: String(err) });
			});
		}).finally(() => {
			baseMarkDispatchIdle();
		});
	};
	return {
		dispatcher,
		replyOptions: {
			...replyOptions,
			...streamController.hasStream() ? { onPartialReply: (payload) => streamController.onPartialReply(payload) } : {},
			disableBlockStreaming: typeof msteamsCfg?.blockStreaming === "boolean" ? !msteamsCfg.blockStreaming : void 0,
			onModelSelected
		},
		markDispatchIdle
	};
}
//#endregion
//#region extensions/msteams/src/sent-message-cache.ts
const TTL_MS = 1440 * 60 * 1e3;
const MSTEAMS_SENT_MESSAGES_KEY = Symbol.for("openclaw.msteamsSentMessages");
let sentMessageCache;
function getSentMessageCache() {
	if (!sentMessageCache) {
		const globalStore = globalThis;
		sentMessageCache = globalStore[MSTEAMS_SENT_MESSAGES_KEY] ?? /* @__PURE__ */ new Map();
		globalStore[MSTEAMS_SENT_MESSAGES_KEY] = sentMessageCache;
	}
	return sentMessageCache;
}
function cleanupExpired(scopeKey, entry, now) {
	for (const [id, timestamp] of entry) if (now - timestamp > TTL_MS) entry.delete(id);
	if (entry.size === 0) getSentMessageCache().delete(scopeKey);
}
function recordMSTeamsSentMessage(conversationId, messageId) {
	if (!conversationId || !messageId) return;
	const now = Date.now();
	const store = getSentMessageCache();
	let entry = store.get(conversationId);
	if (!entry) {
		entry = /* @__PURE__ */ new Map();
		store.set(conversationId, entry);
	}
	entry.set(messageId, now);
	if (entry.size > 200) cleanupExpired(conversationId, entry, now);
}
function wasMSTeamsMessageSent(conversationId, messageId) {
	const entry = getSentMessageCache().get(conversationId);
	if (!entry) return false;
	cleanupExpired(conversationId, entry, Date.now());
	return entry.has(messageId);
}
//#endregion
//#region extensions/msteams/src/monitor-handler/inbound-media.ts
async function resolveMSTeamsInboundMedia(params) {
	const { attachments, htmlSummary, maxBytes, tokenProvider, allowHosts, conversationType, conversationId, conversationMessageId, activity, log, preserveFilenames } = params;
	let mediaList = await downloadMSTeamsAttachments({
		attachments,
		maxBytes,
		tokenProvider,
		allowHosts,
		authAllowHosts: params.authAllowHosts,
		preserveFilenames
	});
	if (mediaList.length === 0) {
		if (attachments.length > 0 && attachments.every((att) => String(att.contentType ?? "").startsWith("text/html"))) {
			const messageUrls = buildMSTeamsGraphMessageUrls({
				conversationType,
				conversationId,
				messageId: activity.id ?? void 0,
				replyToId: activity.replyToId ?? void 0,
				conversationMessageId,
				channelData: activity.channelData
			});
			if (messageUrls.length === 0) log.debug?.("graph message url unavailable", {
				conversationType,
				hasChannelData: Boolean(activity.channelData),
				messageId: activity.id ?? void 0,
				replyToId: activity.replyToId ?? void 0
			});
			else {
				const attempts = [];
				for (const messageUrl of messageUrls) {
					const graphMedia = await downloadMSTeamsGraphMedia({
						messageUrl,
						tokenProvider,
						maxBytes,
						allowHosts,
						authAllowHosts: params.authAllowHosts,
						preserveFilenames
					});
					attempts.push({
						url: messageUrl,
						hostedStatus: graphMedia.hostedStatus,
						attachmentStatus: graphMedia.attachmentStatus,
						hostedCount: graphMedia.hostedCount,
						attachmentCount: graphMedia.attachmentCount,
						tokenError: graphMedia.tokenError
					});
					if (graphMedia.media.length > 0) {
						mediaList = graphMedia.media;
						break;
					}
					if (graphMedia.tokenError) break;
				}
				if (mediaList.length === 0) log.debug?.("graph media fetch empty", { attempts });
			}
		}
	}
	if (mediaList.length > 0) log.debug?.("downloaded attachments", { count: mediaList.length });
	else if (htmlSummary?.imgTags) log.debug?.("inline images detected but none downloaded", {
		imgTags: htmlSummary.imgTags,
		srcHosts: htmlSummary.srcHosts,
		dataImages: htmlSummary.dataImages,
		cidImages: htmlSummary.cidImages
	});
	return mediaList;
}
//#endregion
//#region extensions/msteams/src/monitor-handler/message-handler.ts
function createMSTeamsMessageHandler(deps) {
	const { cfg, runtime, appId, adapter, tokenProvider, textLimit, mediaMaxBytes, conversationStore, pollStore, log } = deps;
	const core = getMSTeamsRuntime();
	const logVerboseMessage = (message) => {
		if (core.logging.shouldLogVerbose()) log.debug?.(message);
	};
	const msteamsCfg = cfg.channels?.msteams;
	const historyLimit = Math.max(0, msteamsCfg?.historyLimit ?? cfg.messages?.groupChat?.historyLimit ?? 50);
	const conversationHistories = /* @__PURE__ */ new Map();
	const inboundDebounceMs = core.channel.debounce.resolveInboundDebounceMs({
		cfg,
		channel: "msteams"
	});
	const handleTeamsMessageNow = async (params) => {
		const context = params.context;
		const activity = context.activity;
		const rawText = params.rawText;
		const text = params.text;
		const attachments = params.attachments;
		const attachmentPlaceholder = buildMSTeamsAttachmentPlaceholder(attachments);
		const rawBody = text || attachmentPlaceholder;
		const quoteInfo = extractMSTeamsQuoteInfo(attachments);
		const from = activity.from;
		const conversation = activity.conversation;
		const attachmentTypes = attachments.map((att) => typeof att.contentType === "string" ? att.contentType : void 0).filter(Boolean).slice(0, 3);
		const htmlSummary = summarizeMSTeamsHtmlAttachments(attachments);
		log.info("received message", {
			rawText: rawText.slice(0, 50),
			text: text.slice(0, 50),
			attachments: attachments.length,
			attachmentTypes,
			from: from?.id,
			conversation: conversation?.id
		});
		if (htmlSummary) log.debug?.("html attachment summary", htmlSummary);
		if (!from?.id) {
			log.debug?.("skipping message without from.id");
			return;
		}
		const rawConversationId = conversation?.id ?? "";
		const conversationId = normalizeMSTeamsConversationId(rawConversationId);
		const conversationMessageId = extractMSTeamsConversationMessageId(rawConversationId);
		const conversationType = conversation?.conversationType ?? "personal";
		const teamId = activity.channelData?.team?.id;
		const { dmPolicy, senderId, senderName, pairing, isDirectMessage, channelGate, access, configuredDmAllowFrom, effectiveDmAllowFrom, effectiveGroupAllowFrom, allowNameMatching, groupPolicy } = await resolveMSTeamsSenderAccess({
			cfg,
			activity
		});
		const useAccessGroups = cfg.commands?.useAccessGroups !== false;
		const isChannel = conversationType === "channel";
		if (isDirectMessage && msteamsCfg && access.decision !== "allow") {
			if (access.reason === "dmPolicy=disabled") {
				log.info("dropping dm (dms disabled)", {
					sender: senderId,
					label: senderName
				});
				log.debug?.("dropping dm (dms disabled)");
				return;
			}
			const allowMatch = resolveMSTeamsAllowlistMatch({
				allowFrom: effectiveDmAllowFrom,
				senderId,
				senderName,
				allowNameMatching
			});
			if (access.decision === "pairing") {
				if (await pairing.upsertPairingRequest({
					id: senderId,
					meta: { name: senderName }
				})) log.info("msteams pairing request created", {
					sender: senderId,
					label: senderName
				});
			}
			log.debug?.("dropping dm (not allowlisted)", {
				sender: senderId,
				label: senderName,
				allowlistMatch: formatAllowlistMatchMeta(allowMatch)
			});
			log.info("dropping dm (not allowlisted)", {
				sender: senderId,
				label: senderName,
				dmPolicy,
				reason: access.reason,
				allowlistMatch: formatAllowlistMatchMeta(allowMatch)
			});
			return;
		}
		if (!isDirectMessage && msteamsCfg) {
			if (channelGate.allowlistConfigured && !channelGate.allowed) {
				log.info("dropping group message (not in team/channel allowlist)", {
					conversationId,
					teamKey: channelGate.teamKey ?? "none",
					channelKey: channelGate.channelKey ?? "none",
					channelMatchKey: channelGate.channelMatchKey ?? "none",
					channelMatchSource: channelGate.channelMatchSource ?? "none"
				});
				log.debug?.("dropping group message (not in team/channel allowlist)", {
					conversationId,
					teamKey: channelGate.teamKey ?? "none",
					channelKey: channelGate.channelKey ?? "none",
					channelMatchKey: channelGate.channelMatchKey ?? "none",
					channelMatchSource: channelGate.channelMatchSource ?? "none"
				});
				return;
			}
			const senderGroupAccess = evaluateSenderGroupAccessForPolicy({
				groupPolicy,
				groupAllowFrom: effectiveGroupAllowFrom,
				senderId,
				isSenderAllowed: (_senderId, allowFrom) => resolveMSTeamsAllowlistMatch({
					allowFrom,
					senderId,
					senderName,
					allowNameMatching
				}).allowed
			});
			if (!senderGroupAccess.allowed && senderGroupAccess.reason === "disabled") {
				log.info("dropping group message (groupPolicy: disabled)", { conversationId });
				log.debug?.("dropping group message (groupPolicy: disabled)", { conversationId });
				return;
			}
			if (!senderGroupAccess.allowed && senderGroupAccess.reason === "empty_allowlist") {
				log.info("dropping group message (groupPolicy: allowlist, no allowlist)", { conversationId });
				log.debug?.("dropping group message (groupPolicy: allowlist, no allowlist)", { conversationId });
				return;
			}
			if (!senderGroupAccess.allowed && senderGroupAccess.reason === "sender_not_allowlisted") {
				const allowMatch = resolveMSTeamsAllowlistMatch({
					allowFrom: effectiveGroupAllowFrom,
					senderId,
					senderName,
					allowNameMatching
				});
				log.debug?.("dropping group message (not in groupAllowFrom)", {
					sender: senderId,
					label: senderName,
					allowlistMatch: formatAllowlistMatchMeta(allowMatch)
				});
				log.info("dropping group message (not in groupAllowFrom)", {
					sender: senderId,
					label: senderName,
					allowlistMatch: formatAllowlistMatchMeta(allowMatch)
				});
				return;
			}
		}
		const commandDmAllowFrom = isDirectMessage ? effectiveDmAllowFrom : configuredDmAllowFrom;
		const ownerAllowedForCommands = isMSTeamsGroupAllowed({
			groupPolicy: "allowlist",
			allowFrom: commandDmAllowFrom,
			senderId,
			senderName,
			allowNameMatching
		});
		const groupAllowedForCommands = isMSTeamsGroupAllowed({
			groupPolicy: "allowlist",
			allowFrom: effectiveGroupAllowFrom,
			senderId,
			senderName,
			allowNameMatching
		});
		const { commandAuthorized, shouldBlock } = resolveDualTextControlCommandGate({
			useAccessGroups,
			primaryConfigured: commandDmAllowFrom.length > 0,
			primaryAllowed: ownerAllowedForCommands,
			secondaryConfigured: effectiveGroupAllowFrom.length > 0,
			secondaryAllowed: groupAllowedForCommands,
			hasControlCommand: core.channel.text.hasControlCommand(text, cfg)
		});
		if (shouldBlock) {
			logInboundDrop({
				log: logVerboseMessage,
				channel: "msteams",
				reason: "control command (unauthorized)",
				target: senderId
			});
			return;
		}
		const clientInfo = activity.entities?.find((e) => e.type === "clientInfo");
		const agent = activity.recipient;
		const conversationRef = {
			activityId: activity.id,
			user: {
				id: from.id,
				name: from.name,
				aadObjectId: from.aadObjectId
			},
			agent,
			bot: agent ? {
				id: agent.id,
				name: agent.name
			} : void 0,
			conversation: {
				id: conversationId,
				conversationType,
				tenantId: conversation?.tenantId
			},
			teamId,
			channelId: activity.channelId,
			serviceUrl: activity.serviceUrl,
			locale: activity.locale,
			...clientInfo?.timezone ? { timezone: clientInfo.timezone } : {}
		};
		conversationStore.upsert(conversationId, conversationRef).catch((err) => {
			log.debug?.("failed to save conversation reference", { error: formatUnknownError(err) });
		});
		const pollVote = extractMSTeamsPollVote(activity);
		if (pollVote) {
			try {
				if (!await pollStore.recordVote({
					pollId: pollVote.pollId,
					voterId: senderId,
					selections: pollVote.selections
				})) log.debug?.("poll vote ignored (poll not found)", { pollId: pollVote.pollId });
				else log.info("recorded poll vote", {
					pollId: pollVote.pollId,
					voter: senderId,
					selections: pollVote.selections
				});
			} catch (err) {
				log.error("failed to record poll vote", {
					pollId: pollVote.pollId,
					error: formatUnknownError(err)
				});
			}
			return;
		}
		if (!rawBody) {
			log.debug?.("skipping empty message after stripping mentions");
			return;
		}
		const teamsFrom = isDirectMessage ? `msteams:${senderId}` : isChannel ? `msteams:channel:${conversationId}` : `msteams:group:${conversationId}`;
		const teamsTo = isDirectMessage ? `user:${senderId}` : `conversation:${conversationId}`;
		const route = core.channel.routing.resolveAgentRoute({
			cfg,
			channel: "msteams",
			peer: {
				kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
				id: isDirectMessage ? senderId : conversationId
			}
		});
		const preview = rawBody.replace(/\s+/g, " ").slice(0, 160);
		const inboundLabel = isDirectMessage ? `Teams DM from ${senderName}` : `Teams message in ${conversationType} from ${senderName}`;
		core.system.enqueueSystemEvent(`${inboundLabel}: ${preview}`, {
			sessionKey: route.sessionKey,
			contextKey: `msteams:message:${conversationId}:${activity.id ?? "unknown"}`
		});
		const channelId = conversationId;
		const { teamConfig, channelConfig } = channelGate;
		const { requireMention, replyStyle } = resolveMSTeamsReplyPolicy({
			isDirectMessage,
			globalConfig: msteamsCfg,
			teamConfig,
			channelConfig
		});
		const timestamp = parseMSTeamsActivityTimestamp(activity.timestamp);
		if (!isDirectMessage) {
			const mentionGate = resolveMentionGating({
				requireMention: Boolean(requireMention),
				canDetectMention: true,
				wasMentioned: params.wasMentioned,
				implicitMention: params.implicitMention,
				shouldBypassMention: false
			});
			const mentioned = mentionGate.effectiveWasMentioned;
			if (requireMention && mentionGate.shouldSkip) {
				log.debug?.("skipping message (mention required)", {
					teamId,
					channelId,
					requireMention,
					mentioned
				});
				recordPendingHistoryEntryIfEnabled({
					historyMap: conversationHistories,
					historyKey: conversationId,
					limit: historyLimit,
					entry: {
						sender: senderName,
						body: rawBody,
						timestamp: timestamp?.getTime(),
						messageId: activity.id ?? void 0
					}
				});
				return;
			}
		}
		const mediaPayload = buildMSTeamsMediaPayload(await resolveMSTeamsInboundMedia({
			attachments,
			htmlSummary: htmlSummary ?? void 0,
			maxBytes: mediaMaxBytes,
			tokenProvider,
			allowHosts: msteamsCfg?.mediaAllowHosts,
			authAllowHosts: msteamsCfg?.mediaAuthAllowHosts,
			conversationType,
			conversationId,
			conversationMessageId: conversationMessageId ?? void 0,
			activity: {
				id: activity.id,
				replyToId: activity.replyToId,
				channelData: activity.channelData
			},
			log,
			preserveFilenames: cfg.media?.preserveFilenames
		}));
		let threadContext;
		if (activity.replyToId && isChannel && teamId) try {
			const graphToken = await tokenProvider.getAccessToken("https://graph.microsoft.com");
			const groupId = await resolveTeamGroupId(graphToken, teamId);
			const [parentMsg, replies] = await Promise.all([fetchChannelMessage(graphToken, groupId, conversationId, activity.replyToId), fetchThreadReplies(graphToken, groupId, conversationId, activity.replyToId)]);
			const formatted = formatThreadContext(parentMsg ? [parentMsg, ...replies] : replies, activity.id);
			if (formatted) threadContext = formatted;
		} catch (err) {
			log.debug?.("failed to fetch thread history", { error: String(err) });
		}
		const envelopeFrom = isDirectMessage ? senderName : conversationType;
		const { storePath, envelopeOptions, previousTimestamp } = resolveInboundSessionEnvelopeContext({
			cfg,
			agentId: route.agentId,
			sessionKey: route.sessionKey
		});
		let combinedBody = core.channel.reply.formatAgentEnvelope({
			channel: "Teams",
			from: envelopeFrom,
			timestamp,
			previousTimestamp,
			envelope: envelopeOptions,
			body: rawBody
		});
		const isRoomish = !isDirectMessage;
		const historyKey = isRoomish ? conversationId : void 0;
		if (isRoomish && historyKey) combinedBody = buildPendingHistoryContextFromMap({
			historyMap: conversationHistories,
			historyKey,
			limit: historyLimit,
			currentMessage: combinedBody,
			formatEntry: (entry) => core.channel.reply.formatAgentEnvelope({
				channel: "Teams",
				from: conversationType,
				timestamp: entry.timestamp,
				body: `${entry.sender}: ${entry.body}${entry.messageId ? ` [id:${entry.messageId}]` : ""}`,
				envelope: envelopeOptions
			})
		});
		const inboundHistory = isRoomish && historyKey && historyLimit > 0 ? (conversationHistories.get(historyKey) ?? []).map((entry) => ({
			sender: entry.sender,
			body: entry.body,
			timestamp: entry.timestamp
		})) : void 0;
		const commandBody = text.trim();
		const bodyForAgent = threadContext ? `[Thread history]\n${threadContext}\n[/Thread history]\n\n${rawBody}` : rawBody;
		const ctxPayload = core.channel.reply.finalizeInboundContext({
			Body: combinedBody,
			BodyForAgent: bodyForAgent,
			InboundHistory: inboundHistory,
			RawBody: rawBody,
			CommandBody: commandBody,
			BodyForCommands: commandBody,
			From: teamsFrom,
			To: teamsTo,
			SessionKey: route.sessionKey,
			AccountId: route.accountId,
			ChatType: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
			ConversationLabel: envelopeFrom,
			GroupSubject: !isDirectMessage ? conversationType : void 0,
			SenderName: senderName,
			SenderId: senderId,
			Provider: "msteams",
			Surface: "msteams",
			MessageSid: activity.id,
			Timestamp: timestamp?.getTime() ?? Date.now(),
			WasMentioned: isDirectMessage || params.wasMentioned || params.implicitMention,
			CommandAuthorized: commandAuthorized,
			OriginatingChannel: "msteams",
			OriginatingTo: teamsTo,
			ReplyToId: activity.replyToId ?? void 0,
			ReplyToBody: quoteInfo?.body,
			ReplyToSender: quoteInfo?.sender,
			ReplyToIsQuote: quoteInfo ? true : void 0,
			...mediaPayload
		});
		await core.channel.session.recordInboundSession({
			storePath,
			sessionKey: ctxPayload.SessionKey ?? route.sessionKey,
			ctx: ctxPayload,
			onRecordError: (err) => {
				logVerboseMessage(`msteams: failed updating session meta: ${String(err)}`);
			}
		});
		logVerboseMessage(`msteams inbound: from=${ctxPayload.From} preview="${preview}"`);
		const sharePointSiteId = msteamsCfg?.sharePointSiteId;
		const { dispatcher, replyOptions, markDispatchIdle } = createMSTeamsReplyDispatcher({
			cfg,
			agentId: route.agentId,
			accountId: route.accountId,
			runtime,
			log,
			adapter,
			appId,
			conversationRef,
			context,
			replyStyle,
			textLimit,
			onSentMessageIds: (ids) => {
				for (const id of ids) recordMSTeamsSentMessage(conversationId, id);
			},
			tokenProvider,
			sharePointSiteId
		});
		const senderTimezone = clientInfo?.timezone || conversationRef.timezone;
		const configOverride = senderTimezone && !cfg.agents?.defaults?.userTimezone ? { agents: { defaults: {
			...cfg.agents?.defaults,
			userTimezone: senderTimezone
		} } } : void 0;
		log.info("dispatching to agent", { sessionKey: route.sessionKey });
		try {
			const { queuedFinal, counts } = await dispatchReplyFromConfigWithSettledDispatcher({
				cfg,
				ctxPayload,
				dispatcher,
				onSettled: () => markDispatchIdle(),
				replyOptions,
				configOverride
			});
			log.info("dispatch complete", {
				queuedFinal,
				counts
			});
			if (!queuedFinal) {
				if (isRoomish && historyKey) clearHistoryEntriesIfEnabled({
					historyMap: conversationHistories,
					historyKey,
					limit: historyLimit
				});
				return;
			}
			const finalCount = counts.final;
			logVerboseMessage(`msteams: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${teamsTo}`);
			if (isRoomish && historyKey) clearHistoryEntriesIfEnabled({
				historyMap: conversationHistories,
				historyKey,
				limit: historyLimit
			});
		} catch (err) {
			log.error("dispatch failed", { error: String(err) });
			runtime.error?.(`msteams dispatch failed: ${String(err)}`);
			try {
				await context.sendActivity(`⚠️ Agent failed: ${err instanceof Error ? err.message : String(err)}`);
			} catch {}
		}
	};
	const inboundDebouncer = core.channel.debounce.createInboundDebouncer({
		debounceMs: inboundDebounceMs,
		buildKey: (entry) => {
			const conversationId = normalizeMSTeamsConversationId(entry.context.activity.conversation?.id ?? "");
			const senderId = entry.context.activity.from?.aadObjectId ?? entry.context.activity.from?.id ?? "";
			if (!senderId || !conversationId) return null;
			return `msteams:${appId}:${conversationId}:${senderId}`;
		},
		shouldDebounce: (entry) => {
			if (!entry.text.trim()) return false;
			if (entry.attachments.length > 0) return false;
			return !core.channel.text.hasControlCommand(entry.text, cfg);
		},
		onFlush: async (entries) => {
			const last = entries.at(-1);
			if (!last) return;
			if (entries.length === 1) {
				await handleTeamsMessageNow(last);
				return;
			}
			const combinedText = entries.map((entry) => entry.text).filter(Boolean).join("\n");
			if (!combinedText.trim()) return;
			const combinedRawText = entries.map((entry) => entry.rawText).filter(Boolean).join("\n");
			const wasMentioned = entries.some((entry) => entry.wasMentioned);
			const implicitMention = entries.some((entry) => entry.implicitMention);
			await handleTeamsMessageNow({
				context: last.context,
				rawText: combinedRawText,
				text: combinedText,
				attachments: [],
				wasMentioned,
				implicitMention
			});
		},
		onError: (err) => {
			runtime.error?.(`msteams debounce flush failed: ${String(err)}`);
		}
	});
	return async function handleTeamsMessage(context) {
		const activity = context.activity;
		const rawText = activity.text?.trim() ?? "";
		const text = stripMSTeamsMentionTags(rawText);
		const attachments = Array.isArray(activity.attachments) ? activity.attachments : [];
		const wasMentioned = wasMSTeamsBotMentioned(activity);
		const conversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
		const replyToId = activity.replyToId ?? void 0;
		const implicitMention = Boolean(conversationId && replyToId && wasMSTeamsMessageSent(conversationId, replyToId));
		await inboundDebouncer.enqueue({
			context,
			rawText,
			text,
			attachments,
			wasMentioned,
			implicitMention
		});
	};
}
//#endregion
//#region extensions/msteams/src/welcome-card.ts
/**
* Builds an Adaptive Card for welcoming users when the bot is added to a conversation.
*/
const DEFAULT_PROMPT_STARTERS = [
	"What can you do?",
	"Summarize my last meeting",
	"Help me draft an email"
];
/**
* Build a welcome Adaptive Card for 1:1 personal chats.
*/
function buildWelcomeCard(options) {
	const botName = options?.botName || "OpenClaw";
	const starters = options?.promptStarters?.length ? options.promptStarters : DEFAULT_PROMPT_STARTERS;
	return {
		type: "AdaptiveCard",
		version: "1.5",
		body: [{
			type: "TextBlock",
			text: `Hi! I'm ${botName}.`,
			weight: "bolder",
			size: "medium"
		}, {
			type: "TextBlock",
			text: "I can help you with questions, tasks, and more. Here are some things to try:",
			wrap: true
		}],
		actions: starters.map((label) => ({
			type: "Action.Submit",
			title: label,
			data: { msteams: {
				type: "imBack",
				value: label
			} }
		}))
	};
}
/**
* Build a brief welcome message for group chats (when the bot is @mentioned).
*/
function buildGroupWelcomeText(botName) {
	const name = botName || "OpenClaw";
	return `Hi! I'm ${name}. Mention me with @${name} to get started.`;
}
//#endregion
//#region extensions/msteams/src/monitor-handler.ts
async function isFeedbackInvokeAuthorized(context, deps) {
	const resolved = await resolveMSTeamsSenderAccess({
		cfg: deps.cfg,
		activity: context.activity
	});
	const { msteamsCfg, isDirectMessage, conversationId, senderId } = resolved;
	if (!msteamsCfg) return true;
	if (isDirectMessage && resolved.access.decision !== "allow") {
		deps.log.debug?.("dropping feedback invoke (dm sender not allowlisted)", {
			sender: senderId,
			conversationId
		});
		return false;
	}
	if (!isDirectMessage && resolved.channelGate.allowlistConfigured && !resolved.channelGate.allowed) {
		deps.log.debug?.("dropping feedback invoke (not in team/channel allowlist)", {
			conversationId,
			teamKey: resolved.channelGate.teamKey ?? "none",
			channelKey: resolved.channelGate.channelKey ?? "none"
		});
		return false;
	}
	if (!isDirectMessage && !resolved.senderGroupAccess.allowed) {
		deps.log.debug?.("dropping feedback invoke (group sender not allowlisted)", {
			sender: senderId,
			conversationId
		});
		return false;
	}
	return true;
}
/**
* Handle fileConsent/invoke activities for large file uploads.
*/
async function handleFileConsentInvoke(context, log) {
	const expiredUploadMessage = "The file upload request has expired. Please try sending the file again.";
	const activity = context.activity;
	if (activity.type !== "invoke" || activity.name !== "fileConsent/invoke") return false;
	const consentResponse = parseFileConsentInvoke(activity);
	if (!consentResponse) {
		log.debug?.("invalid file consent invoke", { value: activity.value });
		return false;
	}
	const uploadId = typeof consentResponse.context?.uploadId === "string" ? consentResponse.context.uploadId : void 0;
	const pendingFile = getPendingUpload(uploadId);
	if (pendingFile) {
		const pendingConversationId = normalizeMSTeamsConversationId(pendingFile.conversationId);
		const invokeConversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
		if (!invokeConversationId || pendingConversationId !== invokeConversationId) {
			log.info("file consent conversation mismatch", {
				uploadId,
				expectedConversationId: pendingConversationId,
				receivedConversationId: invokeConversationId || void 0
			});
			if (consentResponse.action === "accept") await context.sendActivity(expiredUploadMessage);
			return true;
		}
	}
	if (consentResponse.action === "accept" && consentResponse.uploadInfo) if (pendingFile) {
		log.debug?.("user accepted file consent, uploading", {
			uploadId,
			filename: pendingFile.filename,
			size: pendingFile.buffer.length
		});
		try {
			await uploadToConsentUrl({
				url: consentResponse.uploadInfo.uploadUrl,
				buffer: pendingFile.buffer,
				contentType: pendingFile.contentType
			});
			const fileInfoCard = buildFileInfoCard({
				filename: consentResponse.uploadInfo.name,
				contentUrl: consentResponse.uploadInfo.contentUrl,
				uniqueId: consentResponse.uploadInfo.uniqueId,
				fileType: consentResponse.uploadInfo.fileType
			});
			await context.sendActivity({
				type: "message",
				attachments: [fileInfoCard]
			});
			log.info("file upload complete", {
				uploadId,
				filename: consentResponse.uploadInfo.name,
				uniqueId: consentResponse.uploadInfo.uniqueId
			});
		} catch (err) {
			log.debug?.("file upload failed", {
				uploadId,
				error: String(err)
			});
			await context.sendActivity(`File upload failed: ${String(err)}`);
		} finally {
			removePendingUpload(uploadId);
		}
	} else {
		log.debug?.("pending file not found for consent", { uploadId });
		await context.sendActivity(expiredUploadMessage);
	}
	else {
		log.debug?.("user declined file consent", { uploadId });
		removePendingUpload(uploadId);
	}
	return true;
}
/**
* Parse and handle feedback invoke activities (thumbs up/down).
* Returns true if the activity was a feedback invoke, false otherwise.
*/
async function handleFeedbackInvoke(context, deps) {
	const activity = context.activity;
	const value = activity.value;
	if (!value) return false;
	if (value.actionName !== "feedback") return false;
	const reaction = value.actionValue?.reaction;
	if (reaction !== "like" && reaction !== "dislike") {
		deps.log.debug?.("ignoring feedback with unknown reaction", { reaction });
		return false;
	}
	const msteamsCfg = deps.cfg.channels?.msteams;
	if (msteamsCfg?.feedbackEnabled === false) {
		deps.log.debug?.("feedback handling disabled");
		return true;
	}
	if (!await isFeedbackInvokeAuthorized(context, deps)) return true;
	let userComment;
	if (value.actionValue?.feedback) try {
		userComment = JSON.parse(value.actionValue.feedback).feedbackText || void 0;
	} catch {}
	const conversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "unknown");
	const senderId = activity.from?.aadObjectId ?? activity.from?.id ?? "unknown";
	const messageId = value.replyToId ?? activity.replyToId ?? "unknown";
	const isNegative = reaction === "dislike";
	const convType = activity.conversation?.conversationType?.toLowerCase();
	const isDirectMessage = convType === "personal" || !convType && !activity.conversation?.isGroup;
	const isChannel = convType === "channel";
	const core = getMSTeamsRuntime();
	const route = core.channel.routing.resolveAgentRoute({
		cfg: deps.cfg,
		channel: "msteams",
		peer: {
			kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
			id: isDirectMessage ? senderId : conversationId
		}
	});
	const feedbackEvent = buildFeedbackEvent({
		messageId,
		value: isNegative ? "negative" : "positive",
		comment: userComment,
		sessionKey: route.sessionKey,
		agentId: route.agentId,
		conversationId
	});
	deps.log.info("received feedback", {
		value: feedbackEvent.value,
		messageId,
		conversationId,
		hasComment: Boolean(userComment)
	});
	try {
		const storePath = core.channel.session.resolveStorePath(deps.cfg.session?.store, { agentId: route.agentId });
		const fs = await import("node:fs/promises");
		const pathMod = await import("node:path");
		const safeKey = route.sessionKey.replace(/[^a-zA-Z0-9_-]/g, "_");
		const transcriptFile = pathMod.join(storePath, `${safeKey}.jsonl`);
		await fs.appendFile(transcriptFile, JSON.stringify(feedbackEvent) + "\n", "utf-8").catch(() => {});
	} catch {}
	const conversationRef = {
		activityId: activity.id,
		user: {
			id: activity.from?.id,
			name: activity.from?.name,
			aadObjectId: activity.from?.aadObjectId
		},
		agent: activity.recipient ? {
			id: activity.recipient.id,
			name: activity.recipient.name
		} : void 0,
		bot: activity.recipient ? {
			id: activity.recipient.id,
			name: activity.recipient.name
		} : void 0,
		conversation: {
			id: conversationId,
			conversationType: activity.conversation?.conversationType,
			tenantId: activity.conversation?.tenantId
		},
		channelId: activity.channelId ?? "msteams",
		serviceUrl: activity.serviceUrl,
		locale: activity.locale
	};
	if (isNegative && msteamsCfg?.feedbackReflection !== false) runFeedbackReflection({
		cfg: deps.cfg,
		adapter: deps.adapter,
		appId: deps.appId,
		conversationRef,
		sessionKey: route.sessionKey,
		agentId: route.agentId,
		conversationId,
		feedbackMessageId: messageId,
		userComment,
		log: deps.log
	}).catch((err) => {
		deps.log.error("feedback reflection failed", { error: String(err) });
	});
	return true;
}
function registerMSTeamsHandlers(handler, deps) {
	const handleTeamsMessage = createMSTeamsMessageHandler(deps);
	const originalRun = handler.run;
	if (originalRun) handler.run = async (context) => {
		const ctx = context;
		if (ctx.activity?.type === "invoke" && ctx.activity?.name === "fileConsent/invoke") {
			await ctx.sendActivity({
				type: "invokeResponse",
				value: { status: 200 }
			});
			try {
				await withRevokedProxyFallback({
					run: async () => await handleFileConsentInvoke(ctx, deps.log),
					onRevoked: async () => true,
					onRevokedLog: () => {
						deps.log.debug?.("turn context revoked during file consent invoke; skipping delayed response");
					}
				});
			} catch (err) {
				deps.log.debug?.("file consent handler error", { error: String(err) });
			}
			return;
		}
		if (ctx.activity?.type === "invoke" && ctx.activity?.name === "message/submitAction") {
			if (await handleFeedbackInvoke(ctx, deps)) return;
		}
		return originalRun.call(handler, context);
	};
	handler.onMessage(async (context, next) => {
		try {
			await handleTeamsMessage(context);
		} catch (err) {
			deps.runtime.error?.(`msteams handler failed: ${String(err)}`);
		}
		await next();
	});
	handler.onMembersAdded(async (context, next) => {
		const ctx = context;
		const membersAdded = ctx.activity?.membersAdded ?? [];
		const botId = ctx.activity?.recipient?.id;
		const msteamsCfg = deps.cfg.channels?.msteams;
		for (const member of membersAdded) if (member.id === botId) {
			const isPersonal = (ctx.activity?.conversation?.conversationType?.toLowerCase() ?? "personal") === "personal";
			if (isPersonal && msteamsCfg?.welcomeCard !== false) {
				const card = buildWelcomeCard({
					botName: ctx.activity?.recipient?.name ?? void 0,
					promptStarters: msteamsCfg?.promptStarters
				});
				try {
					await ctx.sendActivity({
						type: "message",
						attachments: [{
							contentType: "application/vnd.microsoft.card.adaptive",
							content: card
						}]
					});
					deps.log.info("sent welcome card");
				} catch (err) {
					deps.log.debug?.("failed to send welcome card", { error: String(err) });
				}
			} else if (!isPersonal && msteamsCfg?.groupWelcomeCard === true) {
				const botName = ctx.activity?.recipient?.name ?? void 0;
				try {
					await ctx.sendActivity(buildGroupWelcomeText(botName));
					deps.log.info("sent group welcome message");
				} catch (err) {
					deps.log.debug?.("failed to send group welcome", { error: String(err) });
				}
			} else deps.log.debug?.("skipping welcome (disabled by config or conversation type)");
		} else deps.log.debug?.("member added", { member: member.id });
		await next();
	});
	return handler;
}
//#endregion
//#region extensions/msteams/src/webhook-timeouts.ts
const MSTEAMS_WEBHOOK_INACTIVITY_TIMEOUT_MS = 3e4;
const MSTEAMS_WEBHOOK_REQUEST_TIMEOUT_MS = 3e4;
const MSTEAMS_WEBHOOK_HEADERS_TIMEOUT_MS = 15e3;
function applyMSTeamsWebhookTimeouts(httpServer, opts) {
	const inactivityTimeoutMs = opts?.inactivityTimeoutMs ?? MSTEAMS_WEBHOOK_INACTIVITY_TIMEOUT_MS;
	const requestTimeoutMs = opts?.requestTimeoutMs ?? MSTEAMS_WEBHOOK_REQUEST_TIMEOUT_MS;
	const headersTimeoutMs = Math.min(opts?.headersTimeoutMs ?? MSTEAMS_WEBHOOK_HEADERS_TIMEOUT_MS, requestTimeoutMs);
	httpServer.setTimeout(inactivityTimeoutMs);
	httpServer.requestTimeout = requestTimeoutMs;
	httpServer.headersTimeout = headersTimeoutMs;
}
//#endregion
//#region extensions/msteams/src/monitor.ts
const MSTEAMS_WEBHOOK_MAX_BODY_BYTES = DEFAULT_WEBHOOK_MAX_BODY_BYTES;
async function monitorMSTeamsProvider(opts) {
	const core = getMSTeamsRuntime();
	const log = core.logging.getChildLogger({ name: "msteams" });
	let cfg = opts.cfg;
	let msteamsCfg = cfg.channels?.msteams;
	if (!msteamsCfg?.enabled) {
		log.debug?.("msteams provider disabled");
		return {
			app: null,
			shutdown: async () => {}
		};
	}
	const creds = resolveMSTeamsCredentials(msteamsCfg);
	if (!creds) {
		log.error("msteams credentials not configured");
		return {
			app: null,
			shutdown: async () => {}
		};
	}
	const appId = creds.appId;
	const runtime = opts.runtime ?? {
		log: console.log,
		error: console.error,
		exit: (code) => {
			throw new Error(`exit ${code}`);
		}
	};
	let allowFrom = msteamsCfg.allowFrom;
	let groupAllowFrom = msteamsCfg.groupAllowFrom;
	let teamsConfig = msteamsCfg.teams;
	const cleanAllowEntry = (entry) => entry.replace(/^(msteams|teams):/i, "").replace(/^user:/i, "").trim();
	const resolveAllowlistUsers = async (label, entries) => {
		if (entries.length === 0) return {
			additions: [],
			unresolved: []
		};
		const resolved = await resolveMSTeamsUserAllowlist({
			cfg,
			entries
		});
		const additions = [];
		const unresolved = [];
		for (const entry of resolved) if (entry.resolved && entry.id) additions.push(entry.id);
		else unresolved.push(entry.input);
		summarizeMapping(label, resolved.filter((entry) => entry.resolved && entry.id).map((entry) => `${entry.input}→${entry.id}`), unresolved, runtime);
		return {
			additions,
			unresolved
		};
	};
	try {
		const allowEntries = allowFrom?.map((entry) => cleanAllowEntry(String(entry))).filter((entry) => entry && entry !== "*") ?? [];
		if (allowEntries.length > 0) {
			const { additions } = await resolveAllowlistUsers("msteams users", allowEntries);
			allowFrom = mergeAllowlist({
				existing: allowFrom,
				additions
			});
		}
		if (Array.isArray(groupAllowFrom) && groupAllowFrom.length > 0) {
			const groupEntries = groupAllowFrom.map((entry) => cleanAllowEntry(String(entry))).filter((entry) => entry && entry !== "*");
			if (groupEntries.length > 0) {
				const { additions } = await resolveAllowlistUsers("msteams group users", groupEntries);
				groupAllowFrom = mergeAllowlist({
					existing: groupAllowFrom,
					additions
				});
			}
		}
		if (teamsConfig && Object.keys(teamsConfig).length > 0) {
			const entries = [];
			for (const [teamKey, teamCfg] of Object.entries(teamsConfig)) {
				if (teamKey === "*") continue;
				const channels = teamCfg?.channels ?? {};
				const channelKeys = Object.keys(channels).filter((key) => key !== "*");
				if (channelKeys.length === 0) {
					entries.push({
						input: teamKey,
						teamKey
					});
					continue;
				}
				for (const channelKey of channelKeys) entries.push({
					input: `${teamKey}/${channelKey}`,
					teamKey,
					channelKey
				});
			}
			if (entries.length > 0) {
				const resolved = await resolveMSTeamsChannelAllowlist({
					cfg,
					entries: entries.map((entry) => entry.input)
				});
				const mapping = [];
				const unresolved = [];
				const nextTeams = { ...teamsConfig };
				resolved.forEach((entry, idx) => {
					const source = entries[idx];
					if (!source) return;
					const sourceTeam = teamsConfig?.[source.teamKey] ?? {};
					if (!entry.resolved || !entry.teamId) {
						unresolved.push(entry.input);
						return;
					}
					mapping.push(entry.channelId ? `${entry.input}→${entry.teamId}/${entry.channelId}` : `${entry.input}→${entry.teamId}`);
					const existing = nextTeams[entry.teamId] ?? {};
					const mergedChannels = {
						...sourceTeam.channels,
						...existing.channels
					};
					const mergedTeam = {
						...sourceTeam,
						...existing,
						channels: mergedChannels
					};
					nextTeams[entry.teamId] = mergedTeam;
					if (source.channelKey && entry.channelId) {
						const sourceChannel = sourceTeam.channels?.[source.channelKey];
						if (sourceChannel) nextTeams[entry.teamId] = {
							...mergedTeam,
							channels: {
								...mergedChannels,
								[entry.channelId]: {
									...sourceChannel,
									...mergedChannels?.[entry.channelId]
								}
							}
						};
					}
				});
				teamsConfig = nextTeams;
				summarizeMapping("msteams channels", mapping, unresolved, runtime);
			}
		}
	} catch (err) {
		runtime.log?.(`msteams resolve failed; using config entries. ${String(err)}`);
	}
	msteamsCfg = {
		...msteamsCfg,
		allowFrom,
		groupAllowFrom,
		teams: teamsConfig
	};
	cfg = {
		...cfg,
		channels: {
			...cfg.channels,
			msteams: msteamsCfg
		}
	};
	const port = msteamsCfg.webhook?.port ?? 3978;
	const textLimit = core.channel.text.resolveTextChunkLimit(cfg, "msteams");
	const MB = 1024 * 1024;
	const agentDefaults = cfg.agents?.defaults;
	const mediaMaxBytes = typeof agentDefaults?.mediaMaxMb === "number" && agentDefaults.mediaMaxMb > 0 ? Math.floor(agentDefaults.mediaMaxMb * MB) : 8 * MB;
	const conversationStore = opts.conversationStore ?? createMSTeamsConversationStoreFs();
	const pollStore = opts.pollStore ?? createMSTeamsPollStoreFs();
	log.info(`starting provider (port ${port})`);
	const express = await import("express");
	const { sdk, app } = await loadMSTeamsSdkWithAuth(creds);
	const tokenProvider = createMSTeamsTokenProvider(app);
	const adapter = createMSTeamsAdapter(app, sdk);
	const handler = buildActivityHandler();
	registerMSTeamsHandlers(handler, {
		cfg,
		runtime,
		appId,
		adapter,
		tokenProvider,
		textLimit,
		mediaMaxBytes,
		conversationStore,
		pollStore,
		log
	});
	const expressApp = express.default();
	expressApp.use((req, res, next) => {
		const auth = req.headers.authorization;
		if (!auth || !auth.startsWith("Bearer ")) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}
		next();
	});
	expressApp.use(express.json({ limit: MSTEAMS_WEBHOOK_MAX_BODY_BYTES }));
	expressApp.use((err, _req, res, next) => {
		if (err && typeof err === "object" && "status" in err && err.status === 413) {
			res.status(413).json({ error: "Payload too large" });
			return;
		}
		next(err);
	});
	const jwtValidator = await createBotFrameworkJwtValidator(creds);
	expressApp.use((req, res, next) => {
		const authHeader = req.headers.authorization;
		const serviceUrl = req.body?.serviceUrl;
		jwtValidator.validate(authHeader, serviceUrl).then((valid) => {
			if (!valid) {
				log.debug?.("JWT validation failed");
				res.status(401).json({ error: "Unauthorized" });
				return;
			}
			next();
		}).catch((err) => {
			log.debug?.(`JWT validation error: ${String(err)}`);
			res.status(401).json({ error: "Unauthorized" });
		});
	});
	const configuredPath = msteamsCfg.webhook?.path ?? "/api/messages";
	const messageHandler = (req, res) => {
		adapter.process(req, res, (context) => handler.run(context)).catch((err) => {
			log.error("msteams webhook failed", { error: formatUnknownError(err) });
		});
	};
	expressApp.post(configuredPath, messageHandler);
	if (configuredPath !== "/api/messages") expressApp.post("/api/messages", messageHandler);
	log.debug?.("listening on paths", {
		primary: configuredPath,
		fallback: "/api/messages"
	});
	const httpServer = expressApp.listen(port);
	await new Promise((resolve, reject) => {
		const onListening = () => {
			httpServer.off("error", onError);
			log.info(`msteams provider started on port ${port}`);
			resolve();
		};
		const onError = (err) => {
			httpServer.off("listening", onListening);
			log.error("msteams server error", { error: String(err) });
			reject(err);
		};
		httpServer.once("listening", onListening);
		httpServer.once("error", onError);
	});
	applyMSTeamsWebhookTimeouts(httpServer);
	httpServer.on("error", (err) => {
		log.error("msteams server error", { error: String(err) });
	});
	const shutdown = async () => {
		log.info("shutting down msteams provider");
		return new Promise((resolve) => {
			httpServer.close((err) => {
				if (err) log.debug?.("msteams server close error", { error: String(err) });
				resolve();
			});
		});
	};
	await keepHttpServerTaskAlive({
		server: httpServer,
		abortSignal: opts.abortSignal,
		onAbort: shutdown
	});
	return {
		app: expressApp,
		shutdown
	};
}
/**
* Build a minimal ActivityHandler-compatible object that supports
* onMessage / onMembersAdded registration and a run() method.
*/
function buildActivityHandler() {
	const messageHandlers = [];
	const membersAddedHandlers = [];
	const reactionsAddedHandlers = [];
	const reactionsRemovedHandlers = [];
	const handler = {
		onMessage(cb) {
			messageHandlers.push(cb);
			return handler;
		},
		onMembersAdded(cb) {
			membersAddedHandlers.push(cb);
			return handler;
		},
		onReactionsAdded(cb) {
			reactionsAddedHandlers.push(cb);
			return handler;
		},
		onReactionsRemoved(cb) {
			reactionsRemovedHandlers.push(cb);
			return handler;
		},
		async run(context) {
			const ctx = context;
			const activityType = ctx?.activity?.type;
			const noop = async () => {};
			if (activityType === "message") for (const h of messageHandlers) await h(context, noop);
			else if (activityType === "conversationUpdate") for (const h of membersAddedHandlers) await h(context, noop);
			else if (activityType === "messageReaction") {
				const activity = ctx?.activity;
				if (activity?.reactionsAdded?.length) for (const h of reactionsAddedHandlers) await h(context, noop);
				if (activity?.reactionsRemoved?.length) for (const h of reactionsRemovedHandlers) await h(context, noop);
			}
		}
	};
	return handler;
}
//#endregion
export { monitorMSTeamsProvider };
