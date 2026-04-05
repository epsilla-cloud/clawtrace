import { a as registerUnhandledRejectionHandler } from "./unhandled-rejections-CDJ8dOVP.js";
import { i as getChildLogger } from "./logger-BCzP_yik.js";
import { m as defaultRuntime, t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { _ as resolveJidToE164, d as isSelfChatMode, f as jidToE164, p as normalizeE164, w as toWhatsappJid } from "./utils-BfvDpbwh.js";
import { $j as resolveInboundDebounceMs, AM as recordChannelActivity, Aj as resolveInboundSessionEnvelopeContext, FI as resolveGroupSessionKey, Fj as hasControlCommand, Gb as createConnectedChannelStatusPatch, KC as normalizeGroupActivation, Mj as toLocationContext, Qj as createInboundDebouncer, Rj as shouldComputeCommandAuthorized, UI as resolveMarkdownTableMode, Uj as formatInboundEnvelope, cF as saveMediaBuffer, f as loadConfig, fN as loadSessionStore, fc as checkInboundAccessControl, fd as getReplyFromConfig, id as dispatchReplyWithBufferedBlockDispatcher, jj as formatLocationText, mN as recordSessionMetaFromInbound, nI as resolveTextChunkLimit, qC as parseActivationCommand, tI as resolveChunkMode } from "./auth-profiles-B5ypC5S-.js";
import { a as buildGroupHistoryKey, c as normalizeAgentId, n as DEFAULT_MAIN_KEY, r as buildAgentMainSessionKey } from "./session-key-BhxcMJEE.js";
import { a as shouldLogVerbose, n as info, o as success, r as logVerbose, t as danger } from "./globals-0H99T-Tx.js";
import { r as logInfo } from "./logger-Bps9nlrB.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import "./core-CFWy4f9Z.js";
import { a as resolveAgentRoute, n as buildAgentSessionKey, o as resolveInboundLastRouteSessionKey, r as deriveLastRoutePolicy } from "./base-session-key-UJINc15Z.js";
import { t as createDedupeCache } from "./dedupe-BKm1HFA-.js";
import { n as resolveChannelGroupPolicy, r as resolveChannelGroupRequireMention } from "./channel-policy-CKDH6-ud.js";
import { a as resolveDmGroupAccessWithCommandGate, c as resolvePinnedMainDmOwnerFromAllowlist, n as readStoreAllowFromForDmPolicy } from "./dm-policy-shared-C8YuyjhK.js";
import "./routing-LZlQ54P8.js";
import { o as resolveIdentityNamePrefix, s as resolveMessagePrefix } from "./identity-DAzQ7qLa.js";
import { l as resolveWhatsAppMediaMaxBytes, s as resolveWhatsAppAccount } from "./accounts-BmTz4gps.js";
import { l as resolveStorePath } from "./paths-CFxPq48L.js";
import { r as shouldAckReactionForWhatsApp } from "./ack-reactions-EQgNefBf.js";
import { t as finalizeInboundContext } from "./inbound-context-CaoGLQ0Y.js";
import { r as enqueueSystemEvent } from "./system-events-BdYO0Ful.js";
import { n as resolveMentionGating } from "./text-chunking-DzwxNDbL.js";
import { c as getAgentScopedMediaLocalRoots } from "./web-media-BN6zO1RF.js";
import { p as resolveSendableOutboundReplyParts } from "./reply-payload-CJqP_sJ6.js";
import { d as sleepWithAbort, u as computeBackoff } from "./runtime-env-5bDkE44b.js";
import { r as formatDurationPrecise } from "./format-duration-QPQGNRFx.js";
import { t as createChannelReplyPipeline } from "./channel-reply-pipeline-DFacxqeY.js";
import { f as buildMentionRegexes, h as normalizeMentionText, r as buildHistoryContextFromEntries, u as recordPendingHistoryEntryIfEnabled } from "./reply-history-Zf0VECih.js";
import "./security-runtime--Ku03VxI.js";
import { t as waitForever } from "./wait-CRsXDYXY.js";
import "./cli-runtime-BnYvpUgb.js";
import { _ as getSenderIdentity, c as readWebSelfId, f as getComparableIdentityValues, g as getSelfIdentity, h as getReplyContext, i as logoutWeb, l as readWebSelfIdentity, m as getPrimaryIdentityId, n as getWebAuthAgeMs, p as getMentionIdentities, v as identitiesOverlap, y as resolveComparableIdentity } from "./auth-store-98jWycU0.js";
import { i as setActiveWebListener } from "./active-listener-Bi2_x85P.js";
import { r as sendReactionWhatsApp } from "./send-DtEayToE.js";
import { n as getStatusCode, t as formatError } from "./session-errors-C0GNlAbI.js";
import { a as updateLastRouteInBackground, c as whatsappLog, d as resolveHeartbeatSeconds, f as resolveReconnectPolicy, i as trackBackgroundTask, l as whatsappOutboundLog, n as elide, o as whatsappHeartbeatLog, r as isLikelyWhatsAppCryptoError, s as whatsappInboundLog, t as deliverWebReply, u as newConnectionId } from "./deliver-reply-CCZOVb0X.js";
import { a as waitForWaConnection, c as getContentType, d as DisconnectReason, i as waitForCredsSaveQueueWithTimeout, l as normalizeMessageContent, o as downloadMediaMessage, s as extractMessageContent, t as createWaSocket, u as isJidGroup } from "./session-Db9ql_Z9.js";
//#region extensions/whatsapp/src/inbound/dedupe.ts
const RECENT_WEB_MESSAGE_TTL_MS = 20 * 6e4;
const RECENT_WEB_MESSAGE_MAX = 5e3;
const RECENT_OUTBOUND_MESSAGE_TTL_MS = 20 * 6e4;
const RECENT_OUTBOUND_MESSAGE_MAX = 5e3;
const recentInboundMessages = createDedupeCache({
	ttlMs: RECENT_WEB_MESSAGE_TTL_MS,
	maxSize: RECENT_WEB_MESSAGE_MAX
});
const recentOutboundMessages = createDedupeCache({
	ttlMs: RECENT_OUTBOUND_MESSAGE_TTL_MS,
	maxSize: RECENT_OUTBOUND_MESSAGE_MAX
});
function buildMessageKey(params) {
	const accountId = params.accountId.trim();
	const remoteJid = params.remoteJid.trim();
	const messageId = params.messageId.trim();
	if (!accountId || !remoteJid || !messageId || messageId === "unknown") return null;
	return `${accountId}:${remoteJid}:${messageId}`;
}
function resetWebInboundDedupe() {
	recentInboundMessages.clear();
	recentOutboundMessages.clear();
}
function isRecentInboundMessage(key) {
	return recentInboundMessages.check(key);
}
function rememberRecentOutboundMessage(params) {
	const key = buildMessageKey(params);
	if (!key) return;
	recentOutboundMessages.check(key);
}
function isRecentOutboundMessage(params) {
	const key = buildMessageKey(params);
	if (!key) return false;
	return recentOutboundMessages.peek(key);
}
//#endregion
//#region extensions/whatsapp/src/vcard.ts
const ALLOWED_VCARD_KEYS = new Set([
	"FN",
	"N",
	"TEL"
]);
function parseVcard(vcard) {
	if (!vcard) return { phones: [] };
	const lines = vcard.split(/\r?\n/);
	let nameFromN;
	let nameFromFn;
	const phones = [];
	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line) continue;
		const colonIndex = line.indexOf(":");
		if (colonIndex === -1) continue;
		const key = line.slice(0, colonIndex).toUpperCase();
		const rawValue = line.slice(colonIndex + 1).trim();
		if (!rawValue) continue;
		const baseKey = normalizeVcardKey(key);
		if (!baseKey || !ALLOWED_VCARD_KEYS.has(baseKey)) continue;
		const value = cleanVcardValue(rawValue);
		if (!value) continue;
		if (baseKey === "FN" && !nameFromFn) {
			nameFromFn = normalizeVcardName(value);
			continue;
		}
		if (baseKey === "N" && !nameFromN) {
			nameFromN = normalizeVcardName(value);
			continue;
		}
		if (baseKey === "TEL") {
			const phone = normalizeVcardPhone(value);
			if (phone) phones.push(phone);
		}
	}
	return {
		name: nameFromFn ?? nameFromN,
		phones
	};
}
function normalizeVcardKey(key) {
	const [primary] = key.split(";");
	if (!primary) return;
	const segments = primary.split(".");
	return segments[segments.length - 1] || void 0;
}
function cleanVcardValue(value) {
	return value.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").trim();
}
function normalizeVcardName(value) {
	return value.replace(/;/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeVcardPhone(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (trimmed.toLowerCase().startsWith("tel:")) return trimmed.slice(4).trim();
	return trimmed;
}
//#endregion
//#region extensions/whatsapp/src/inbound/extract.ts
const MESSAGE_WRAPPER_KEYS = [
	"botInvokeMessage",
	"ephemeralMessage",
	"viewOnceMessage",
	"viewOnceMessageV2",
	"viewOnceMessageV2Extension",
	"documentWithCaptionMessage",
	"groupMentionedMessage"
];
const MESSAGE_CONTENT_KEYS = [
	"conversation",
	"extendedTextMessage",
	"imageMessage",
	"videoMessage",
	"audioMessage",
	"documentMessage",
	"stickerMessage",
	"locationMessage",
	"liveLocationMessage",
	"contactMessage",
	"contactsArrayMessage",
	"buttonsResponseMessage",
	"listResponseMessage",
	"templateButtonReplyMessage",
	"interactiveResponseMessage",
	"buttonsMessage",
	"listMessage"
];
function fallbackNormalizeMessageContent(message) {
	let current = message;
	while (current && typeof current === "object") {
		let unwrapped = false;
		for (const key of MESSAGE_WRAPPER_KEYS) {
			const candidate = current[key];
			if (candidate && typeof candidate === "object" && "message" in candidate && candidate.message) {
				current = candidate.message;
				unwrapped = true;
				break;
			}
		}
		if (!unwrapped) break;
	}
	return current;
}
function normalizeMessage(message) {
	if (typeof normalizeMessageContent === "function") return normalizeMessageContent(message);
	return fallbackNormalizeMessageContent(message);
}
function fallbackGetContentType(message) {
	const normalized = fallbackNormalizeMessageContent(message);
	if (!normalized || typeof normalized !== "object") return;
	for (const key of MESSAGE_CONTENT_KEYS) if (normalized[key] != null) return key;
}
function getMessageContentType(message) {
	if (typeof getContentType === "function") return getContentType(message);
	return fallbackGetContentType(message);
}
function extractMessage(message) {
	if (typeof extractMessageContent === "function") return extractMessageContent(message);
	const normalized = fallbackNormalizeMessageContent(message);
	const contentType = fallbackGetContentType(normalized);
	if (!normalized || !contentType || contentType === "conversation") return normalized;
	const candidate = normalized[contentType];
	return candidate && typeof candidate === "object" ? candidate : normalized;
}
function getFutureProofInnerMessage(message) {
	const contentType = getMessageContentType(message);
	const candidate = contentType ? message[contentType] : void 0;
	if (candidate && typeof candidate === "object" && "message" in candidate && candidate.message && typeof candidate.message === "object") {
		const inner = normalizeMessage(candidate.message);
		if (inner) {
			const innerType = getMessageContentType(inner);
			if (innerType && innerType !== contentType) return inner;
		}
	}
}
function buildMessageChain(message) {
	const chain = [];
	let current = normalizeMessage(message);
	while (current && chain.length < 4) {
		chain.push(current);
		current = getFutureProofInnerMessage(current);
	}
	return chain;
}
function unwrapMessage$1(message) {
	return buildMessageChain(message).at(-1);
}
function extractContextInfoFromMessage(message) {
	const contentType = getMessageContentType(message);
	const candidate = contentType ? message[contentType] : void 0;
	const contextInfo = candidate && typeof candidate === "object" && "contextInfo" in candidate ? candidate.contextInfo : void 0;
	if (contextInfo) return contextInfo;
	const fallback = message.extendedTextMessage?.contextInfo ?? message.imageMessage?.contextInfo ?? message.videoMessage?.contextInfo ?? message.documentMessage?.contextInfo ?? message.audioMessage?.contextInfo ?? message.stickerMessage?.contextInfo ?? message.buttonsResponseMessage?.contextInfo ?? message.listResponseMessage?.contextInfo ?? message.templateButtonReplyMessage?.contextInfo ?? message.interactiveResponseMessage?.contextInfo ?? message.buttonsMessage?.contextInfo ?? message.listMessage?.contextInfo;
	if (fallback) return fallback;
	for (const value of Object.values(message)) {
		if (!value || typeof value !== "object") continue;
		if ("contextInfo" in value) {
			const candidateContext = value.contextInfo;
			if (candidateContext) return candidateContext;
		}
		if ("message" in value) {
			const inner = value.message;
			if (inner) {
				const innerCtx = extractContextInfo(inner);
				if (innerCtx) return innerCtx;
			}
		}
	}
}
function extractContextInfo(message) {
	for (const candidate of buildMessageChain(message)) {
		const contextInfo = extractContextInfoFromMessage(candidate);
		if (contextInfo) return contextInfo;
	}
}
function extractMentionedJids(rawMessage) {
	const message = unwrapMessage$1(rawMessage);
	if (!message) return;
	const flattened = [
		message.extendedTextMessage?.contextInfo?.mentionedJid,
		message.imageMessage?.contextInfo?.mentionedJid,
		message.videoMessage?.contextInfo?.mentionedJid,
		message.documentMessage?.contextInfo?.mentionedJid,
		message.audioMessage?.contextInfo?.mentionedJid,
		message.stickerMessage?.contextInfo?.mentionedJid,
		message.buttonsResponseMessage?.contextInfo?.mentionedJid,
		message.listResponseMessage?.contextInfo?.mentionedJid
	].flatMap((arr) => arr ?? []).filter(Boolean);
	if (flattened.length === 0) return;
	return Array.from(new Set(flattened));
}
function extractText(rawMessage) {
	const message = unwrapMessage$1(rawMessage);
	if (!message) return;
	const extracted = extractMessage(message);
	const candidates = [message, extracted && extracted !== message ? extracted : void 0];
	for (const candidate of candidates) {
		if (!candidate) continue;
		if (typeof candidate.conversation === "string" && candidate.conversation.trim()) return candidate.conversation.trim();
		const extended = candidate.extendedTextMessage?.text;
		if (extended?.trim()) return extended.trim();
		const caption = candidate.imageMessage?.caption ?? candidate.videoMessage?.caption ?? candidate.documentMessage?.caption;
		if (caption?.trim()) return caption.trim();
	}
	const contactPlaceholder = extractContactPlaceholder(message) ?? (extracted && extracted !== message ? extractContactPlaceholder(extracted) : void 0);
	if (contactPlaceholder) return contactPlaceholder;
}
function extractMediaPlaceholder(rawMessage) {
	const message = unwrapMessage$1(rawMessage);
	if (!message) return;
	if (message.imageMessage) return "<media:image>";
	if (message.videoMessage) return "<media:video>";
	if (message.audioMessage) return "<media:audio>";
	if (message.documentMessage) return "<media:document>";
	if (message.stickerMessage) return "<media:sticker>";
}
function extractContactPlaceholder(rawMessage) {
	const message = unwrapMessage$1(rawMessage);
	if (!message) return;
	const contact = message.contactMessage ?? void 0;
	if (contact) {
		const { name, phones } = describeContact({
			displayName: contact.displayName,
			vcard: contact.vcard
		});
		return formatContactPlaceholder(name, phones);
	}
	const contactsArray = message.contactsArrayMessage?.contacts ?? void 0;
	if (!contactsArray || contactsArray.length === 0) return;
	return formatContactsPlaceholder(contactsArray.map((entry) => describeContact({
		displayName: entry.displayName,
		vcard: entry.vcard
	})).map((entry) => formatContactLabel(entry.name, entry.phones)).filter((value) => Boolean(value)), contactsArray.length);
}
function describeContact(input) {
	const displayName = (input.displayName ?? "").trim();
	const parsed = parseVcard(input.vcard ?? void 0);
	return {
		name: displayName || parsed.name,
		phones: parsed.phones
	};
}
function formatContactPlaceholder(name, phones) {
	const label = formatContactLabel(name, phones);
	if (!label) return "<contact>";
	return `<contact: ${label}>`;
}
function formatContactsPlaceholder(labels, total) {
	const cleaned = labels.map((label) => label.trim()).filter(Boolean);
	if (cleaned.length === 0) return `<contacts: ${total} ${total === 1 ? "contact" : "contacts"}>`;
	const remaining = Math.max(total - cleaned.length, 0);
	const suffix = remaining > 0 ? ` +${remaining} more` : "";
	return `<contacts: ${cleaned.join(", ")}${suffix}>`;
}
function formatContactLabel(name, phones) {
	const parts = [name, formatPhoneList(phones)].filter((value) => Boolean(value));
	if (parts.length === 0) return;
	return parts.join(", ");
}
function formatPhoneList(phones) {
	const cleaned = phones?.map((phone) => phone.trim()).filter(Boolean) ?? [];
	if (cleaned.length === 0) return;
	const { shown, remaining } = summarizeList(cleaned, cleaned.length, 1);
	const [primary] = shown;
	if (!primary) return;
	if (remaining === 0) return primary;
	return `${primary} (+${remaining} more)`;
}
function summarizeList(values, total, maxShown) {
	const shown = values.slice(0, maxShown);
	return {
		shown,
		remaining: Math.max(total - shown.length, 0)
	};
}
function extractLocationData(rawMessage) {
	const message = unwrapMessage$1(rawMessage);
	if (!message) return null;
	const live = message.liveLocationMessage ?? void 0;
	if (live) {
		const latitudeRaw = live.degreesLatitude;
		const longitudeRaw = live.degreesLongitude;
		if (latitudeRaw != null && longitudeRaw != null) {
			const latitude = Number(latitudeRaw);
			const longitude = Number(longitudeRaw);
			if (Number.isFinite(latitude) && Number.isFinite(longitude)) return {
				latitude,
				longitude,
				accuracy: live.accuracyInMeters ?? void 0,
				caption: live.caption ?? void 0,
				source: "live",
				isLive: true
			};
		}
	}
	const location = message.locationMessage ?? void 0;
	if (location) {
		const latitudeRaw = location.degreesLatitude;
		const longitudeRaw = location.degreesLongitude;
		if (latitudeRaw != null && longitudeRaw != null) {
			const latitude = Number(latitudeRaw);
			const longitude = Number(longitudeRaw);
			if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
				const isLive = Boolean(location.isLive);
				return {
					latitude,
					longitude,
					accuracy: location.accuracyInMeters ?? void 0,
					name: location.name ?? void 0,
					address: location.address ?? void 0,
					caption: location.comment ?? void 0,
					source: isLive ? "live" : location.name || location.address ? "place" : "pin",
					isLive
				};
			}
		}
	}
	return null;
}
function describeReplyContext(rawMessage) {
	const message = unwrapMessage$1(rawMessage);
	if (!message) return null;
	const contextInfo = extractContextInfo(message);
	const quoted = normalizeMessage(contextInfo?.quotedMessage);
	if (!quoted) return null;
	const location = extractLocationData(quoted);
	const locationText = location ? formatLocationText(location) : void 0;
	let body = [extractText(quoted), locationText].filter(Boolean).join("\n").trim();
	if (!body) body = extractMediaPlaceholder(quoted);
	if (!body) {
		const quotedType = quoted ? getMessageContentType(quoted) : void 0;
		logVerbose(`Quoted message missing extractable body${quotedType ? ` (type ${quotedType})` : ""}`);
		return null;
	}
	const senderJid = contextInfo?.participant ?? void 0;
	const sender = resolveComparableIdentity({
		jid: senderJid,
		label: senderJid ? jidToE164(senderJid) ?? senderJid : "unknown sender"
	});
	return {
		id: contextInfo?.stanzaId ? String(contextInfo.stanzaId) : void 0,
		body,
		sender
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/lifecycle.ts
function attachEmitterListener(emitter, event, listener) {
	emitter.on(event, listener);
	return () => {
		if (typeof emitter.off === "function") {
			emitter.off(event, listener);
			return;
		}
		if (typeof emitter.removeListener === "function") emitter.removeListener(event, listener);
	};
}
function closeInboundMonitorSocket(sock) {
	sock.ws?.close?.();
}
//#endregion
//#region extensions/whatsapp/src/inbound/media.ts
function unwrapMessage(message) {
	return normalizeMessageContent(message);
}
/**
* Resolve the MIME type for an inbound media message.
* Falls back to WhatsApp's standard formats when Baileys omits the MIME.
*/
function resolveMediaMimetype(message) {
	const explicit = message.imageMessage?.mimetype ?? message.videoMessage?.mimetype ?? message.documentMessage?.mimetype ?? message.audioMessage?.mimetype ?? message.stickerMessage?.mimetype ?? void 0;
	if (explicit) return explicit;
	if (message.audioMessage) return "audio/ogg; codecs=opus";
	if (message.imageMessage) return "image/jpeg";
	if (message.videoMessage) return "video/mp4";
	if (message.stickerMessage) return "image/webp";
}
async function downloadInboundMedia(msg, sock) {
	const message = unwrapMessage(msg.message);
	if (!message) return;
	const mimetype = resolveMediaMimetype(message);
	const fileName = message.documentMessage?.fileName ?? void 0;
	if (!message.imageMessage && !message.videoMessage && !message.documentMessage && !message.audioMessage && !message.stickerMessage) return;
	try {
		return {
			buffer: await downloadMediaMessage(msg, "buffer", {}, {
				reuploadRequest: sock.updateMediaMessage,
				logger: sock.logger
			}),
			mimetype,
			fileName
		};
	} catch (err) {
		logVerbose(`downloadMediaMessage failed: ${String(err)}`);
		return;
	}
}
//#endregion
//#region extensions/whatsapp/src/inbound/send-api.ts
function recordWhatsAppOutbound(accountId) {
	recordChannelActivity({
		channel: "whatsapp",
		accountId,
		direction: "outbound"
	});
}
function resolveOutboundMessageId(result) {
	return typeof result === "object" && result && "key" in result ? String(result.key?.id ?? "unknown") : "unknown";
}
function createWebSendApi(params) {
	return {
		sendMessage: async (to, text, mediaBuffer, mediaType, sendOptions) => {
			const jid = toWhatsappJid(to);
			let payload;
			if (mediaBuffer && mediaType) if (mediaType.startsWith("image/")) payload = {
				image: mediaBuffer,
				caption: text || void 0,
				mimetype: mediaType
			};
			else if (mediaType.startsWith("audio/")) payload = {
				audio: mediaBuffer,
				ptt: true,
				mimetype: mediaType
			};
			else if (mediaType.startsWith("video/")) {
				const gifPlayback = sendOptions?.gifPlayback;
				payload = {
					video: mediaBuffer,
					caption: text || void 0,
					mimetype: mediaType,
					...gifPlayback ? { gifPlayback: true } : {}
				};
			} else payload = {
				document: mediaBuffer,
				fileName: sendOptions?.fileName?.trim() || "file",
				caption: text || void 0,
				mimetype: mediaType
			};
			else payload = { text };
			const result = await params.sock.sendMessage(jid, payload);
			recordWhatsAppOutbound(sendOptions?.accountId ?? params.defaultAccountId);
			return { messageId: resolveOutboundMessageId(result) };
		},
		sendPoll: async (to, poll) => {
			const jid = toWhatsappJid(to);
			const result = await params.sock.sendMessage(jid, { poll: {
				name: poll.question,
				values: poll.options,
				selectableCount: poll.maxSelections ?? 1
			} });
			recordWhatsAppOutbound(params.defaultAccountId);
			return { messageId: resolveOutboundMessageId(result) };
		},
		sendReaction: async (chatJid, messageId, emoji, fromMe, participant) => {
			const jid = toWhatsappJid(chatJid);
			await params.sock.sendMessage(jid, { react: {
				text: emoji,
				key: {
					remoteJid: jid,
					id: messageId,
					fromMe,
					participant: participant ? toWhatsappJid(participant) : void 0
				}
			} });
		},
		sendComposingTo: async (to) => {
			const jid = toWhatsappJid(to);
			await params.sock.sendPresenceUpdate("composing", jid);
		}
	};
}
//#endregion
//#region extensions/whatsapp/src/inbound/monitor.ts
const LOGGED_OUT_STATUS$1 = DisconnectReason?.loggedOut ?? 401;
function isGroupJid(jid) {
	return (typeof isJidGroup === "function" ? isJidGroup(jid) : jid.endsWith("@g.us")) === true;
}
async function monitorWebInbox(options) {
	const inboundLogger = getChildLogger({ module: "web-inbound" });
	const inboundConsoleLog = createSubsystemLogger("gateway/channels/whatsapp").child("inbound");
	const sock = await createWaSocket(false, options.verbose, { authDir: options.authDir });
	await waitForWaConnection(sock);
	const connectedAtMs = Date.now();
	let onCloseResolve = null;
	const onClose = new Promise((resolve) => {
		onCloseResolve = resolve;
	});
	const resolveClose = (reason) => {
		if (!onCloseResolve) return;
		const resolver = onCloseResolve;
		onCloseResolve = null;
		resolver(reason);
	};
	try {
		await sock.sendPresenceUpdate("available");
		if (shouldLogVerbose()) logVerbose("Sent global 'available' presence on connect");
	} catch (err) {
		logVerbose(`Failed to send 'available' presence on connect: ${String(err)}`);
	}
	const self = await readWebSelfIdentity(options.authDir, sock.user);
	const debouncer = createInboundDebouncer({
		debounceMs: options.debounceMs ?? 0,
		buildKey: (msg) => {
			const sender = msg.sender;
			const senderKey = msg.chatType === "group" ? getPrimaryIdentityId(sender ?? null) ?? msg.senderJid ?? msg.senderE164 ?? msg.senderName ?? msg.from : msg.from;
			if (!senderKey) return null;
			const conversationKey = msg.chatType === "group" ? msg.chatId : msg.from;
			return `${msg.accountId}:${conversationKey}:${senderKey}`;
		},
		shouldDebounce: options.shouldDebounce,
		onFlush: async (entries) => {
			const last = entries.at(-1);
			if (!last) return;
			if (entries.length === 1) {
				await options.onMessage(last);
				return;
			}
			const mentioned = /* @__PURE__ */ new Set();
			for (const entry of entries) for (const jid of entry.mentions ?? entry.mentionedJids ?? []) mentioned.add(jid);
			const combinedBody = entries.map((entry) => entry.body).filter(Boolean).join("\n");
			const combinedMessage = {
				...last,
				body: combinedBody,
				mentions: mentioned.size > 0 ? Array.from(mentioned) : void 0,
				mentionedJids: mentioned.size > 0 ? Array.from(mentioned) : void 0
			};
			await options.onMessage(combinedMessage);
		},
		onError: (err) => {
			inboundLogger.error({ error: String(err) }, "failed handling inbound web message");
			inboundConsoleLog.error(`Failed handling inbound web message: ${String(err)}`);
		}
	});
	const groupMetaCache = /* @__PURE__ */ new Map();
	const GROUP_META_TTL_MS = 300 * 1e3;
	const lidLookup = sock.signalRepository?.lidMapping;
	const resolveInboundJid = async (jid) => resolveJidToE164(jid, {
		authDir: options.authDir,
		lidLookup
	});
	const rememberOutboundMessage = (remoteJid, result) => {
		const messageId = typeof result === "object" && result && "key" in result ? String(result.key?.id ?? "") : "";
		if (!messageId) return;
		rememberRecentOutboundMessage({
			accountId: options.accountId,
			remoteJid,
			messageId
		});
	};
	const sendTrackedMessage = async (jid, content) => {
		const result = await sock.sendMessage(jid, content);
		rememberOutboundMessage(jid, result);
		return result;
	};
	const getGroupMeta = async (jid) => {
		const cached = groupMetaCache.get(jid);
		if (cached && cached.expires > Date.now()) return cached;
		try {
			const meta = await sock.groupMetadata(jid);
			const participants = (await Promise.all(meta.participants?.map(async (p) => {
				return await resolveInboundJid(p.id) ?? p.id;
			}) ?? [])).filter(Boolean) ?? [];
			const entry = {
				subject: meta.subject,
				participants,
				expires: Date.now() + GROUP_META_TTL_MS
			};
			groupMetaCache.set(jid, entry);
			return entry;
		} catch (err) {
			logVerbose(`Failed to fetch group metadata for ${jid}: ${String(err)}`);
			return { expires: Date.now() + GROUP_META_TTL_MS };
		}
	};
	const normalizeInboundMessage = async (msg) => {
		const id = msg.key?.id ?? void 0;
		const remoteJid = msg.key?.remoteJid;
		if (!remoteJid) return null;
		if (remoteJid.endsWith("@status") || remoteJid.endsWith("@broadcast")) return null;
		const group = isGroupJid(remoteJid);
		if (Boolean(msg.key?.fromMe) && id && isRecentOutboundMessage({
			accountId: options.accountId,
			remoteJid,
			messageId: id
		})) {
			logVerbose(`Skipping recent outbound WhatsApp echo ${id} for ${remoteJid}`);
			return null;
		}
		if (id) {
			if (isRecentInboundMessage(`${options.accountId}:${remoteJid}:${id}`)) return null;
		}
		const participantJid = msg.key?.participant ?? void 0;
		const from = group ? remoteJid : await resolveInboundJid(remoteJid);
		if (!from) return null;
		const senderE164 = group ? participantJid ? await resolveInboundJid(participantJid) : null : from;
		let groupSubject;
		let groupParticipants;
		if (group) {
			const meta = await getGroupMeta(remoteJid);
			groupSubject = meta.subject;
			groupParticipants = meta.participants;
		}
		const messageTimestampMs = msg.messageTimestamp ? Number(msg.messageTimestamp) * 1e3 : void 0;
		const access = await checkInboundAccessControl({
			accountId: options.accountId,
			from,
			selfE164: self.e164 ?? null,
			senderE164,
			group,
			pushName: msg.pushName ?? void 0,
			isFromMe: Boolean(msg.key?.fromMe),
			messageTimestampMs,
			connectedAtMs,
			sock: { sendMessage: (jid, content) => sendTrackedMessage(jid, content) },
			remoteJid
		});
		if (!access.allowed) return null;
		return {
			id,
			remoteJid,
			group,
			participantJid,
			from,
			senderE164,
			groupSubject,
			groupParticipants,
			messageTimestampMs,
			access
		};
	};
	const maybeMarkInboundAsRead = async (inbound) => {
		const { id, remoteJid, participantJid, access } = inbound;
		if (id && !access.isSelfChat && options.sendReadReceipts !== false) try {
			await sock.readMessages([{
				remoteJid,
				id,
				participant: participantJid,
				fromMe: false
			}]);
			if (shouldLogVerbose()) logVerbose(`Marked message ${id} as read for ${remoteJid}${participantJid ? ` (participant ${participantJid})` : ""}`);
		} catch (err) {
			logVerbose(`Failed to mark message ${id} read: ${String(err)}`);
		}
		else if (id && access.isSelfChat && shouldLogVerbose()) logVerbose(`Self-chat mode: skipping read receipt for ${id}`);
	};
	const enrichInboundMessage = async (msg) => {
		const location = extractLocationData(msg.message ?? void 0);
		const locationText = location ? formatLocationText(location) : void 0;
		let body = extractText(msg.message ?? void 0);
		if (locationText) body = [body, locationText].filter(Boolean).join("\n").trim();
		if (!body) {
			body = extractMediaPlaceholder(msg.message ?? void 0);
			if (!body) return null;
		}
		const replyContext = describeReplyContext(msg.message);
		let mediaPath;
		let mediaType;
		let mediaFileName;
		try {
			const inboundMedia = await downloadInboundMedia(msg, sock);
			if (inboundMedia) {
				const maxBytes = (typeof options.mediaMaxMb === "number" && options.mediaMaxMb > 0 ? options.mediaMaxMb : 50) * 1024 * 1024;
				mediaPath = (await saveMediaBuffer(inboundMedia.buffer, inboundMedia.mimetype, "inbound", maxBytes, inboundMedia.fileName)).path;
				mediaType = inboundMedia.mimetype;
				mediaFileName = inboundMedia.fileName;
			}
		} catch (err) {
			logVerbose(`Inbound media download failed: ${String(err)}`);
		}
		return {
			body,
			location: location ?? void 0,
			replyContext,
			mediaPath,
			mediaType,
			mediaFileName
		};
	};
	const enqueueInboundMessage = async (msg, inbound, enriched) => {
		const chatJid = inbound.remoteJid;
		const sendComposing = async () => {
			try {
				await sock.sendPresenceUpdate("composing", chatJid);
			} catch (err) {
				logVerbose(`Presence update failed: ${String(err)}`);
			}
		};
		const reply = async (text) => {
			await sendTrackedMessage(chatJid, { text });
		};
		const sendMedia = async (payload) => {
			await sendTrackedMessage(chatJid, payload);
		};
		const timestamp = inbound.messageTimestampMs;
		const mentionedJids = extractMentionedJids(msg.message);
		const senderName = msg.pushName ?? void 0;
		inboundLogger.info({
			from: inbound.from,
			to: self.e164 ?? "me",
			body: enriched.body,
			mediaPath: enriched.mediaPath,
			mediaType: enriched.mediaType,
			mediaFileName: enriched.mediaFileName,
			timestamp
		}, "inbound message");
		const inboundMessage = {
			id: inbound.id,
			from: inbound.from,
			conversationId: inbound.from,
			to: self.e164 ?? "me",
			accountId: inbound.access.resolvedAccountId,
			body: enriched.body,
			pushName: senderName,
			timestamp,
			chatType: inbound.group ? "group" : "direct",
			chatId: inbound.remoteJid,
			sender: resolveComparableIdentity({
				jid: inbound.participantJid,
				e164: inbound.senderE164 ?? void 0,
				name: senderName
			}),
			senderJid: inbound.participantJid,
			senderE164: inbound.senderE164 ?? void 0,
			senderName,
			replyTo: enriched.replyContext ?? void 0,
			replyToId: enriched.replyContext?.id,
			replyToBody: enriched.replyContext?.body,
			replyToSender: enriched.replyContext?.sender?.label ?? void 0,
			replyToSenderJid: enriched.replyContext?.sender?.jid ?? void 0,
			replyToSenderE164: enriched.replyContext?.sender?.e164 ?? void 0,
			groupSubject: inbound.groupSubject,
			groupParticipants: inbound.groupParticipants,
			mentions: mentionedJids ?? void 0,
			mentionedJids: mentionedJids ?? void 0,
			self,
			selfJid: self.jid ?? void 0,
			selfLid: self.lid ?? void 0,
			selfE164: self.e164 ?? void 0,
			fromMe: Boolean(msg.key?.fromMe),
			location: enriched.location ?? void 0,
			sendComposing,
			reply,
			sendMedia,
			mediaPath: enriched.mediaPath,
			mediaType: enriched.mediaType,
			mediaFileName: enriched.mediaFileName
		};
		try {
			Promise.resolve(debouncer.enqueue(inboundMessage)).catch((err) => {
				inboundLogger.error({ error: String(err) }, "failed handling inbound web message");
				inboundConsoleLog.error(`Failed handling inbound web message: ${String(err)}`);
			});
		} catch (err) {
			inboundLogger.error({ error: String(err) }, "failed handling inbound web message");
			inboundConsoleLog.error(`Failed handling inbound web message: ${String(err)}`);
		}
	};
	const handleMessagesUpsert = async (upsert) => {
		if (upsert.type !== "notify" && upsert.type !== "append") return;
		for (const msg of upsert.messages ?? []) {
			recordChannelActivity({
				channel: "whatsapp",
				accountId: options.accountId,
				direction: "inbound"
			});
			const inbound = await normalizeInboundMessage(msg);
			if (!inbound) continue;
			await maybeMarkInboundAsRead(inbound);
			if (upsert.type === "append") {
				const APPEND_RECENT_GRACE_MS = 6e4;
				const msgTsRaw = msg.messageTimestamp;
				const msgTsNum = msgTsRaw != null ? Number(msgTsRaw) : NaN;
				if ((Number.isFinite(msgTsNum) ? msgTsNum * 1e3 : 0) < connectedAtMs - APPEND_RECENT_GRACE_MS) continue;
			}
			const enriched = await enrichInboundMessage(msg);
			if (!enriched) continue;
			await enqueueInboundMessage(msg, inbound, enriched);
		}
	};
	const handleConnectionUpdate = (update) => {
		try {
			if (update.connection === "close") {
				const status = getStatusCode(update.lastDisconnect?.error);
				resolveClose({
					status,
					isLoggedOut: status === LOGGED_OUT_STATUS$1,
					error: update.lastDisconnect?.error
				});
			}
		} catch (err) {
			inboundLogger.error({ error: String(err) }, "connection.update handler error");
			resolveClose({
				status: void 0,
				isLoggedOut: false,
				error: err
			});
		}
	};
	const detachMessagesUpsert = attachEmitterListener(sock.ev, "messages.upsert", handleMessagesUpsert);
	const detachConnectionUpdate = attachEmitterListener(sock.ev, "connection.update", handleConnectionUpdate);
	return {
		close: async () => {
			try {
				detachMessagesUpsert();
				detachConnectionUpdate();
				closeInboundMonitorSocket(sock);
			} catch (err) {
				logVerbose(`Socket close failed: ${String(err)}`);
			}
		},
		onClose,
		signalClose: (reason) => {
			resolveClose(reason ?? {
				status: void 0,
				isLoggedOut: false,
				error: "closed"
			});
		},
		...createWebSendApi({
			sock: {
				sendMessage: (jid, content) => sendTrackedMessage(jid, content),
				sendPresenceUpdate: (presence, jid) => sock.sendPresenceUpdate(presence, jid)
			},
			defaultAccountId: options.accountId
		})
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/mentions.ts
function buildMentionConfig(cfg, agentId) {
	return {
		mentionRegexes: buildMentionRegexes(cfg, agentId),
		allowFrom: cfg.channels?.whatsapp?.allowFrom
	};
}
function resolveMentionTargets(msg, authDir) {
	return {
		normalizedMentions: getMentionIdentities(msg, authDir),
		self: getSelfIdentity(msg, authDir)
	};
}
function isBotMentionedFromTargets(msg, mentionCfg, targets) {
	const clean = (text) => normalizeMentionText(text);
	const isSelfChat = isSelfChatMode(targets.self.e164, mentionCfg.allowFrom);
	const hasMentions = targets.normalizedMentions.length > 0;
	if (hasMentions && !isSelfChat) {
		for (const mention of targets.normalizedMentions) if (identitiesOverlap(targets.self, mention)) return true;
		return false;
	} else if (hasMentions && isSelfChat) {}
	const bodyClean = clean(msg.body);
	if (mentionCfg.mentionRegexes.some((re) => re.test(bodyClean))) return true;
	if (targets.self.e164) {
		const selfDigits = targets.self.e164.replace(/\D/g, "");
		if (selfDigits) {
			if (bodyClean.replace(/[^\d]/g, "").includes(selfDigits)) return true;
			const bodyNoSpace = msg.body.replace(/[\s-]/g, "");
			if (new RegExp(`\\+?${selfDigits}`, "i").test(bodyNoSpace)) return true;
		}
	}
	return false;
}
function debugMention(msg, mentionCfg, authDir) {
	const mentionTargets = resolveMentionTargets(msg, authDir);
	return {
		wasMentioned: isBotMentionedFromTargets(msg, mentionCfg, mentionTargets),
		details: {
			from: msg.from,
			body: msg.body,
			bodyClean: normalizeMentionText(msg.body),
			mentionedJids: msg.mentions ?? msg.mentionedJids ?? null,
			normalizedMentionedJids: mentionTargets.normalizedMentions.length ? mentionTargets.normalizedMentions.map((identity) => getComparableIdentityValues(identity)) : null,
			selfJid: msg.self?.jid ?? msg.selfJid ?? null,
			selfLid: msg.self?.lid ?? msg.selfLid ?? null,
			selfE164: msg.self?.e164 ?? msg.selfE164 ?? null,
			resolvedSelf: mentionTargets.self
		}
	};
}
function resolveOwnerList(mentionCfg, selfE164) {
	const allowFrom = mentionCfg.allowFrom;
	return (Array.isArray(allowFrom) && allowFrom.length > 0 ? allowFrom : selfE164 ? [selfE164] : []).filter((entry) => Boolean(entry && entry !== "*")).map((entry) => normalizeE164(entry)).filter((entry) => Boolean(entry));
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor-state.ts
function cloneStatus(status) {
	return {
		...status,
		lastDisconnect: status.lastDisconnect ? { ...status.lastDisconnect } : null
	};
}
function isTerminalHealthState(healthState) {
	return healthState === "conflict" || healthState === "logged-out" || healthState === "stopped";
}
function createWebChannelStatusController(statusSink) {
	const status = {
		running: true,
		connected: false,
		reconnectAttempts: 0,
		lastConnectedAt: null,
		lastDisconnect: null,
		lastInboundAt: null,
		lastMessageAt: null,
		lastEventAt: null,
		lastError: null,
		healthState: "starting"
	};
	const emit = () => {
		statusSink?.(cloneStatus(status));
	};
	return {
		emit,
		snapshot: () => status,
		noteConnected(at = Date.now()) {
			Object.assign(status, createConnectedChannelStatusPatch(at));
			status.lastError = null;
			status.healthState = "healthy";
			emit();
		},
		noteInbound(at = Date.now()) {
			status.lastInboundAt = at;
			status.lastMessageAt = at;
			status.lastEventAt = at;
			if (status.connected) status.healthState = "healthy";
			emit();
		},
		noteWatchdogStale(at = Date.now()) {
			status.lastEventAt = at;
			if (status.connected) status.healthState = "stale";
			emit();
		},
		noteReconnectAttempts(reconnectAttempts) {
			status.reconnectAttempts = reconnectAttempts;
			emit();
		},
		noteClose(params) {
			const at = params.at ?? Date.now();
			status.connected = false;
			status.lastEventAt = at;
			status.lastDisconnect = {
				at,
				status: params.statusCode,
				error: params.error,
				loggedOut: Boolean(params.loggedOut)
			};
			status.lastError = params.error ?? null;
			status.reconnectAttempts = params.reconnectAttempts;
			status.healthState = params.healthState;
			emit();
		},
		markStopped(at = Date.now()) {
			status.running = false;
			status.connected = false;
			status.lastEventAt = at;
			if (!isTerminalHealthState(status.healthState)) status.healthState = "stopped";
			emit();
		}
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/echo.ts
function createEchoTracker(params) {
	const recentlySent = /* @__PURE__ */ new Set();
	const maxItems = Math.max(1, params.maxItems ?? 100);
	const buildCombinedKey = (p) => `combined:${p.sessionKey}:${p.combinedBody}`;
	const trim = () => {
		while (recentlySent.size > maxItems) {
			const firstKey = recentlySent.values().next().value;
			if (!firstKey) break;
			recentlySent.delete(firstKey);
		}
	};
	const rememberText = (text, opts) => {
		if (!text) return;
		recentlySent.add(text);
		if (opts.combinedBody && opts.combinedBodySessionKey) recentlySent.add(buildCombinedKey({
			sessionKey: opts.combinedBodySessionKey,
			combinedBody: opts.combinedBody
		}));
		if (opts.logVerboseMessage) params.logVerbose?.(`Added to echo detection set (size now: ${recentlySent.size}): ${text.substring(0, 50)}...`);
		trim();
	};
	return {
		rememberText,
		has: (key) => recentlySent.has(key),
		forget: (key) => {
			recentlySent.delete(key);
		},
		buildCombinedKey
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/broadcast.ts
function buildBroadcastRouteKeys(params) {
	const sessionKey = buildAgentSessionKey({
		agentId: params.agentId,
		channel: "whatsapp",
		accountId: params.route.accountId,
		peer: {
			kind: params.msg.chatType === "group" ? "group" : "direct",
			id: params.peerId
		},
		dmScope: params.cfg.session?.dmScope,
		identityLinks: params.cfg.session?.identityLinks
	});
	const mainSessionKey = buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: DEFAULT_MAIN_KEY
	});
	return {
		sessionKey,
		mainSessionKey,
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey,
			mainSessionKey
		})
	};
}
async function maybeBroadcastMessage(params) {
	const broadcastAgents = params.cfg.broadcast?.[params.peerId];
	if (!broadcastAgents || !Array.isArray(broadcastAgents)) return false;
	if (broadcastAgents.length === 0) return false;
	const strategy = params.cfg.broadcast?.strategy || "parallel";
	whatsappInboundLog.info(`Broadcasting message to ${broadcastAgents.length} agents (${strategy})`);
	const agentIds = params.cfg.agents?.list?.map((agent) => normalizeAgentId(agent.id));
	const hasKnownAgents = (agentIds?.length ?? 0) > 0;
	const groupHistorySnapshot = params.msg.chatType === "group" ? params.groupHistories.get(params.groupHistoryKey) ?? [] : void 0;
	const processForAgent = async (agentId) => {
		const normalizedAgentId = normalizeAgentId(agentId);
		if (hasKnownAgents && !agentIds?.includes(normalizedAgentId)) {
			whatsappInboundLog.warn(`Broadcast agent ${agentId} not found in agents.list; skipping`);
			return false;
		}
		const routeKeys = buildBroadcastRouteKeys({
			cfg: params.cfg,
			msg: params.msg,
			route: params.route,
			peerId: params.peerId,
			agentId: normalizedAgentId
		});
		const agentRoute = {
			...params.route,
			agentId: normalizedAgentId,
			...routeKeys
		};
		try {
			return await params.processMessage(params.msg, agentRoute, params.groupHistoryKey, {
				groupHistory: groupHistorySnapshot,
				suppressGroupHistoryClear: true
			});
		} catch (err) {
			whatsappInboundLog.error(`Broadcast agent ${agentId} failed: ${formatError(err)}`);
			return false;
		}
	};
	if (strategy === "sequential") for (const agentId of broadcastAgents) await processForAgent(agentId);
	else await Promise.allSettled(broadcastAgents.map(processForAgent));
	if (params.msg.chatType === "group") params.groupHistories.set(params.groupHistoryKey, []);
	return true;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/commands.ts
function stripMentionsForCommand(text, mentionRegexes, selfE164) {
	let result = text;
	for (const re of mentionRegexes) result = result.replace(re, " ");
	if (selfE164) {
		const digits = selfE164.replace(/\D/g, "");
		if (digits) {
			const pattern = new RegExp(`\\+?${digits}`, "g");
			result = result.replace(pattern, " ");
		}
	}
	return result.replace(/\s+/g, " ").trim();
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/group-activation.ts
function resolveGroupPolicyFor(cfg, conversationId) {
	const groupId = resolveGroupSessionKey({
		From: conversationId,
		ChatType: "group",
		Provider: "whatsapp"
	})?.id;
	const whatsappCfg = cfg.channels?.whatsapp;
	const hasGroupAllowFrom = Boolean(whatsappCfg?.groupAllowFrom?.length || whatsappCfg?.allowFrom?.length);
	return resolveChannelGroupPolicy({
		cfg,
		channel: "whatsapp",
		groupId: groupId ?? conversationId,
		hasGroupAllowFrom
	});
}
function resolveGroupRequireMentionFor(cfg, conversationId) {
	const groupId = resolveGroupSessionKey({
		From: conversationId,
		ChatType: "group",
		Provider: "whatsapp"
	})?.id;
	return resolveChannelGroupRequireMention({
		cfg,
		channel: "whatsapp",
		groupId: groupId ?? conversationId
	});
}
function resolveGroupActivationFor(params) {
	const entry = loadSessionStore(resolveStorePath(params.cfg.session?.store, { agentId: params.agentId }))[params.sessionKey];
	const defaultActivation = !resolveGroupRequireMentionFor(params.cfg, params.conversationId) ? "always" : "mention";
	return normalizeGroupActivation(entry?.groupActivation) ?? defaultActivation;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/group-members.ts
function appendNormalizedUnique(entries, seen, ordered) {
	for (const entry of entries) {
		const normalized = normalizeE164(entry) ?? entry;
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		ordered.push(normalized);
	}
}
function noteGroupMember(groupMemberNames, conversationId, e164, name) {
	if (!e164 || !name) return;
	const key = normalizeE164(e164) ?? e164;
	if (!key) return;
	let roster = groupMemberNames.get(conversationId);
	if (!roster) {
		roster = /* @__PURE__ */ new Map();
		groupMemberNames.set(conversationId, roster);
	}
	roster.set(key, name);
}
function formatGroupMembers(params) {
	const { participants, roster, fallbackE164 } = params;
	const seen = /* @__PURE__ */ new Set();
	const ordered = [];
	if (participants?.length) appendNormalizedUnique(participants, seen, ordered);
	if (roster) appendNormalizedUnique(roster.keys(), seen, ordered);
	if (ordered.length === 0 && fallbackE164) {
		const normalized = normalizeE164(fallbackE164) ?? fallbackE164;
		if (normalized) ordered.push(normalized);
	}
	if (ordered.length === 0) return;
	return ordered.map((entry) => {
		const name = roster?.get(entry);
		return name ? `${name} (${entry})` : entry;
	}).join(", ");
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/group-gating.ts
function isOwnerSender(baseMentionConfig, msg) {
	const sender = normalizeE164(getSenderIdentity(msg).e164 ?? "");
	if (!sender) return false;
	return resolveOwnerList(baseMentionConfig, getSelfIdentity(msg).e164 ?? void 0).includes(sender);
}
function recordPendingGroupHistoryEntry(params) {
	const senderIdentity = getSenderIdentity(params.msg);
	const sender = senderIdentity.name && senderIdentity.e164 ? `${senderIdentity.name} (${senderIdentity.e164})` : senderIdentity.name ?? senderIdentity.e164 ?? getPrimaryIdentityId(senderIdentity) ?? "Unknown";
	recordPendingHistoryEntryIfEnabled({
		historyMap: params.groupHistories,
		historyKey: params.groupHistoryKey,
		limit: params.groupHistoryLimit,
		entry: {
			sender,
			body: params.msg.body,
			timestamp: params.msg.timestamp,
			id: params.msg.id,
			senderJid: senderIdentity.jid ?? params.msg.senderJid
		}
	});
}
function skipGroupMessageAndStoreHistory(params, verboseMessage) {
	params.logVerbose(verboseMessage);
	recordPendingGroupHistoryEntry({
		msg: params.msg,
		groupHistories: params.groupHistories,
		groupHistoryKey: params.groupHistoryKey,
		groupHistoryLimit: params.groupHistoryLimit
	});
	return { shouldProcess: false };
}
function applyGroupGating(params) {
	const sender = getSenderIdentity(params.msg);
	const self = getSelfIdentity(params.msg, params.authDir);
	const groupPolicy = resolveGroupPolicyFor(params.cfg, params.conversationId);
	if (groupPolicy.allowlistEnabled && !groupPolicy.allowed) {
		params.logVerbose(`Skipping group message ${params.conversationId} (not in allowlist)`);
		return { shouldProcess: false };
	}
	noteGroupMember(params.groupMemberNames, params.groupHistoryKey, sender.e164 ?? void 0, sender.name ?? void 0);
	const mentionConfig = buildMentionConfig(params.cfg, params.agentId);
	const commandBody = stripMentionsForCommand(params.msg.body, mentionConfig.mentionRegexes, self.e164);
	const activationCommand = parseActivationCommand(commandBody);
	const owner = isOwnerSender(params.baseMentionConfig, params.msg);
	const shouldBypassMention = owner && hasControlCommand(commandBody, params.cfg);
	if (activationCommand.hasCommand && !owner) return skipGroupMessageAndStoreHistory(params, `Ignoring /activation from non-owner in group ${params.conversationId}`);
	const mentionDebug = debugMention(params.msg, mentionConfig, params.authDir);
	params.replyLogger.debug({
		conversationId: params.conversationId,
		wasMentioned: mentionDebug.wasMentioned,
		...mentionDebug.details
	}, "group mention debug");
	const wasMentioned = mentionDebug.wasMentioned;
	const requireMention = resolveGroupActivationFor({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		conversationId: params.conversationId
	}) !== "always";
	const mentionGate = resolveMentionGating({
		requireMention,
		canDetectMention: true,
		wasMentioned,
		implicitMention: identitiesOverlap(self, getReplyContext(params.msg, params.authDir)?.sender),
		shouldBypassMention
	});
	params.msg.wasMentioned = mentionGate.effectiveWasMentioned;
	if (!shouldBypassMention && requireMention && mentionGate.shouldSkip) return skipGroupMessageAndStoreHistory(params, `Group message stored for context (no mention detected) in ${params.conversationId}: ${params.msg.body}`);
	return { shouldProcess: true };
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/peer.ts
function resolvePeerId(msg) {
	if (msg.chatType === "group") return msg.conversationId ?? msg.from;
	const sender = getSenderIdentity(msg);
	if (sender.e164) return normalizeE164(sender.e164) ?? sender.e164;
	if (msg.from.includes("@")) return jidToE164(msg.from) ?? msg.from;
	return normalizeE164(msg.from) ?? msg.from;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/ack-reaction.ts
function maybeSendAckReaction(params) {
	if (!params.msg.id) return;
	const ackConfig = params.cfg.channels?.whatsapp?.ackReaction;
	const emoji = (ackConfig?.emoji ?? "").trim();
	const directEnabled = ackConfig?.direct ?? true;
	const groupMode = ackConfig?.group ?? "mentions";
	const conversationIdForCheck = params.msg.conversationId ?? params.msg.from;
	const activation = params.msg.chatType === "group" ? resolveGroupActivationFor({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		conversationId: conversationIdForCheck
	}) : null;
	const shouldSendReaction = () => shouldAckReactionForWhatsApp({
		emoji,
		isDirect: params.msg.chatType === "direct",
		isGroup: params.msg.chatType === "group",
		directEnabled,
		groupMode,
		wasMentioned: params.msg.wasMentioned === true,
		groupActivated: activation === "always"
	});
	if (!shouldSendReaction()) return;
	params.info({
		chatId: params.msg.chatId,
		messageId: params.msg.id,
		emoji
	}, "sending ack reaction");
	const sender = getSenderIdentity(params.msg);
	sendReactionWhatsApp(params.msg.chatId, params.msg.id, emoji, {
		verbose: params.verbose,
		fromMe: false,
		participant: sender.jid ?? void 0,
		accountId: params.accountId
	}).catch((err) => {
		params.warn({
			error: formatError(err),
			chatId: params.msg.chatId,
			messageId: params.msg.id
		}, "failed to send ack reaction");
		logVerbose(`WhatsApp ack reaction failed for chat ${params.msg.chatId}: ${formatError(err)}`);
	});
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/message-line.ts
function formatReplyContext(msg) {
	const replyTo = getReplyContext(msg);
	if (!replyTo?.body) return null;
	return `[Replying to ${replyTo.sender?.label ?? replyTo.sender?.e164 ?? "unknown sender"}${replyTo.id ? ` id:${replyTo.id}` : ""}]\n${replyTo.body}\n[/Replying]`;
}
function buildInboundLine(params) {
	const { cfg, msg, agentId, previousTimestamp, envelope } = params;
	const messagePrefix = resolveMessagePrefix(cfg, agentId, {
		configured: cfg.channels?.whatsapp?.messagePrefix,
		hasAllowFrom: (cfg.channels?.whatsapp?.allowFrom?.length ?? 0) > 0
	});
	const prefixStr = messagePrefix ? `${messagePrefix} ` : "";
	const replyContext = formatReplyContext(msg);
	const baseLine = `${prefixStr}${msg.body}${replyContext ? `\n\n${replyContext}` : ""}`;
	const sender = getSenderIdentity(msg);
	return formatInboundEnvelope({
		channel: "WhatsApp",
		from: msg.chatType === "group" ? msg.from : msg.from?.replace(/^whatsapp:/, ""),
		timestamp: msg.timestamp,
		body: baseLine,
		chatType: msg.chatType,
		sender: {
			name: sender.name ?? void 0,
			e164: sender.e164 ?? void 0,
			id: getPrimaryIdentityId(sender) ?? void 0
		},
		previousTimestamp,
		envelope,
		fromMe: msg.fromMe
	});
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/process-message.ts
async function resolveWhatsAppCommandAuthorized(params) {
	const useAccessGroups = params.cfg.commands?.useAccessGroups !== false;
	if (!useAccessGroups) return true;
	const isGroup = params.msg.chatType === "group";
	const sender = getSenderIdentity(params.msg);
	const self = getSelfIdentity(params.msg);
	const senderE164 = normalizeE164(isGroup ? sender.e164 ?? "" : sender.e164 ?? params.msg.from ?? "");
	if (!senderE164) return false;
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.msg.accountId
	});
	const dmPolicy = account.dmPolicy ?? "pairing";
	const groupPolicy = account.groupPolicy ?? "allowlist";
	const configuredAllowFrom = account.allowFrom ?? [];
	const configuredGroupAllowFrom = account.groupAllowFrom ?? (configuredAllowFrom.length > 0 ? configuredAllowFrom : void 0);
	const storeAllowFrom = isGroup ? [] : await readStoreAllowFromForDmPolicy({
		provider: "whatsapp",
		accountId: params.msg.accountId,
		dmPolicy
	});
	return resolveDmGroupAccessWithCommandGate({
		isGroup,
		dmPolicy,
		groupPolicy,
		allowFrom: configuredAllowFrom.length > 0 ? configuredAllowFrom : self.e164 ? [self.e164] : [],
		groupAllowFrom: configuredGroupAllowFrom,
		storeAllowFrom,
		isSenderAllowed: (allowEntries) => {
			if (allowEntries.includes("*")) return true;
			return allowEntries.map((entry) => normalizeE164(String(entry))).filter((entry) => Boolean(entry)).includes(senderE164);
		},
		command: {
			useAccessGroups,
			allowTextCommands: true,
			hasControlCommand: true
		}
	}).commandAuthorized;
}
function resolvePinnedMainDmRecipient(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.msg.accountId
	});
	return resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: params.cfg.session?.dmScope,
		allowFrom: account.allowFrom,
		normalizeEntry: (entry) => normalizeE164(entry)
	});
}
async function processMessage(params) {
	const conversationId = params.msg.conversationId ?? params.msg.from;
	const { storePath, envelopeOptions, previousTimestamp } = resolveInboundSessionEnvelopeContext({
		cfg: params.cfg,
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey
	});
	let combinedBody = buildInboundLine({
		cfg: params.cfg,
		msg: params.msg,
		agentId: params.route.agentId,
		previousTimestamp,
		envelope: envelopeOptions
	});
	let shouldClearGroupHistory = false;
	if (params.msg.chatType === "group") {
		const history = params.groupHistory ?? params.groupHistories.get(params.groupHistoryKey) ?? [];
		if (history.length > 0) combinedBody = buildHistoryContextFromEntries({
			entries: history.map((m) => ({
				sender: m.sender,
				body: m.body,
				timestamp: m.timestamp
			})),
			currentMessage: combinedBody,
			excludeLast: false,
			formatEntry: (entry) => {
				return formatInboundEnvelope({
					channel: "WhatsApp",
					from: conversationId,
					timestamp: entry.timestamp,
					body: entry.body,
					chatType: "group",
					senderLabel: entry.sender,
					envelope: envelopeOptions
				});
			}
		});
		shouldClearGroupHistory = !(params.suppressGroupHistoryClear ?? false);
	}
	const combinedEchoKey = params.buildCombinedEchoKey({
		sessionKey: params.route.sessionKey,
		combinedBody
	});
	if (params.echoHas(combinedEchoKey)) {
		logVerbose("Skipping auto-reply: detected echo for combined message");
		params.echoForget(combinedEchoKey);
		return false;
	}
	maybeSendAckReaction({
		cfg: params.cfg,
		msg: params.msg,
		agentId: params.route.agentId,
		sessionKey: params.route.sessionKey,
		conversationId,
		verbose: params.verbose,
		accountId: params.route.accountId,
		info: params.replyLogger.info.bind(params.replyLogger),
		warn: params.replyLogger.warn.bind(params.replyLogger)
	});
	const correlationId = params.msg.id ?? newConnectionId();
	params.replyLogger.info({
		connectionId: params.connectionId,
		correlationId,
		from: params.msg.chatType === "group" ? conversationId : params.msg.from,
		to: params.msg.to,
		body: elide(combinedBody, 240),
		mediaType: params.msg.mediaType ?? null,
		mediaPath: params.msg.mediaPath ?? null
	}, "inbound web message");
	const fromDisplay = params.msg.chatType === "group" ? conversationId : params.msg.from;
	const kindLabel = params.msg.mediaType ? `, ${params.msg.mediaType}` : "";
	whatsappInboundLog.info(`Inbound message ${fromDisplay} -> ${params.msg.to} (${params.msg.chatType}${kindLabel}, ${combinedBody.length} chars)`);
	if (shouldLogVerbose()) whatsappInboundLog.debug(`Inbound body: ${elide(combinedBody, 400)}`);
	const sender = getSenderIdentity(params.msg);
	const self = getSelfIdentity(params.msg);
	const replyTo = getReplyContext(params.msg);
	const dmRouteTarget = params.msg.chatType !== "group" ? (() => {
		if (sender.e164) return normalizeE164(sender.e164);
		if (params.msg.from.includes("@")) return jidToE164(params.msg.from);
		return normalizeE164(params.msg.from);
	})() : void 0;
	const textLimit = params.maxMediaTextChunkLimit ?? resolveTextChunkLimit(params.cfg, "whatsapp");
	const chunkMode = resolveChunkMode(params.cfg, "whatsapp", params.route.accountId);
	const tableMode = resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "whatsapp",
		accountId: params.route.accountId
	});
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(params.cfg, params.route.agentId);
	let didLogHeartbeatStrip = false;
	let didSendReply = false;
	const commandAuthorized = shouldComputeCommandAuthorized(params.msg.body, params.cfg) ? await resolveWhatsAppCommandAuthorized({
		cfg: params.cfg,
		msg: params.msg
	}) : void 0;
	const configuredResponsePrefix = params.cfg.messages?.responsePrefix;
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg: params.cfg,
		agentId: params.route.agentId,
		channel: "whatsapp",
		accountId: params.route.accountId
	});
	const isSelfChat = params.msg.chatType !== "group" && Boolean(self.e164) && normalizeE164(params.msg.from) === normalizeE164(self.e164 ?? "");
	const responsePrefix = replyPipeline.responsePrefix ?? (configuredResponsePrefix === void 0 && isSelfChat ? resolveIdentityNamePrefix(params.cfg, params.route.agentId) : void 0);
	const inboundHistory = params.msg.chatType === "group" ? (params.groupHistory ?? params.groupHistories.get(params.groupHistoryKey) ?? []).map((entry) => ({
		sender: entry.sender,
		body: entry.body,
		timestamp: entry.timestamp
	})) : void 0;
	const ctxPayload = finalizeInboundContext({
		Body: combinedBody,
		BodyForAgent: params.msg.body,
		InboundHistory: inboundHistory,
		RawBody: params.msg.body,
		CommandBody: params.msg.body,
		From: params.msg.from,
		To: params.msg.to,
		SessionKey: params.route.sessionKey,
		AccountId: params.route.accountId,
		MessageSid: params.msg.id,
		ReplyToId: replyTo?.id,
		ReplyToBody: replyTo?.body,
		ReplyToSender: replyTo?.sender?.label,
		MediaPath: params.msg.mediaPath,
		MediaUrl: params.msg.mediaUrl,
		MediaType: params.msg.mediaType,
		ChatType: params.msg.chatType,
		ConversationLabel: params.msg.chatType === "group" ? conversationId : params.msg.from,
		GroupSubject: params.msg.groupSubject,
		GroupMembers: formatGroupMembers({
			participants: params.msg.groupParticipants,
			roster: params.groupMemberNames.get(params.groupHistoryKey),
			fallbackE164: sender.e164 ?? void 0
		}),
		SenderName: sender.name ?? void 0,
		SenderId: getPrimaryIdentityId(sender) ?? void 0,
		SenderE164: sender.e164 ?? void 0,
		CommandAuthorized: commandAuthorized,
		WasMentioned: params.msg.wasMentioned,
		...params.msg.location ? toLocationContext(params.msg.location) : {},
		Provider: "whatsapp",
		Surface: "whatsapp",
		OriginatingChannel: "whatsapp",
		OriginatingTo: params.msg.from
	});
	const pinnedMainDmRecipient = resolvePinnedMainDmRecipient({
		cfg: params.cfg,
		msg: params.msg
	});
	const shouldUpdateMainLastRoute = !pinnedMainDmRecipient || pinnedMainDmRecipient === dmRouteTarget;
	const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
		route: params.route,
		sessionKey: params.route.sessionKey
	});
	if (dmRouteTarget && inboundLastRouteSessionKey === params.route.mainSessionKey && shouldUpdateMainLastRoute) updateLastRouteInBackground({
		cfg: params.cfg,
		backgroundTasks: params.backgroundTasks,
		storeAgentId: params.route.agentId,
		sessionKey: params.route.mainSessionKey,
		channel: "whatsapp",
		to: dmRouteTarget,
		accountId: params.route.accountId,
		ctx: ctxPayload,
		warn: params.replyLogger.warn.bind(params.replyLogger)
	});
	else if (dmRouteTarget && inboundLastRouteSessionKey === params.route.mainSessionKey && pinnedMainDmRecipient) logVerbose(`Skipping main-session last route update for ${dmRouteTarget} (pinned owner ${pinnedMainDmRecipient})`);
	const metaTask = recordSessionMetaFromInbound({
		storePath,
		sessionKey: params.route.sessionKey,
		ctx: ctxPayload
	}).catch((err) => {
		params.replyLogger.warn({
			error: formatError(err),
			storePath,
			sessionKey: params.route.sessionKey
		}, "failed updating session meta");
	});
	trackBackgroundTask(params.backgroundTasks, metaTask);
	const { queuedFinal } = await dispatchReplyWithBufferedBlockDispatcher({
		ctx: ctxPayload,
		cfg: params.cfg,
		replyResolver: params.replyResolver,
		dispatcherOptions: {
			...replyPipeline,
			responsePrefix,
			onHeartbeatStrip: () => {
				if (!didLogHeartbeatStrip) {
					didLogHeartbeatStrip = true;
					logVerbose("Stripped stray HEARTBEAT_OK token from web reply");
				}
			},
			deliver: async (payload, info) => {
				if (info.kind !== "final") return;
				await deliverWebReply({
					replyResult: payload,
					msg: params.msg,
					mediaLocalRoots,
					maxMediaBytes: params.maxMediaBytes,
					textLimit,
					chunkMode,
					replyLogger: params.replyLogger,
					connectionId: params.connectionId,
					skipLog: false,
					tableMode
				});
				didSendReply = true;
				const shouldLog = payload.text ? true : void 0;
				params.rememberSentText(payload.text, {
					combinedBody,
					combinedBodySessionKey: params.route.sessionKey,
					logVerboseMessage: shouldLog
				});
				const fromDisplay = params.msg.chatType === "group" ? conversationId : params.msg.from ?? "unknown";
				const reply = resolveSendableOutboundReplyParts(payload);
				const hasMedia = reply.hasMedia;
				whatsappOutboundLog.info(`Auto-replied to ${fromDisplay}${hasMedia ? " (media)" : ""}`);
				if (shouldLogVerbose()) {
					const preview = payload.text != null ? elide(reply.text, 400) : "<media>";
					whatsappOutboundLog.debug(`Reply body: ${preview}${hasMedia ? " (media)" : ""}`);
				}
			},
			onError: (err, info) => {
				const label = info.kind === "tool" ? "tool update" : info.kind === "block" ? "block update" : "auto-reply";
				whatsappOutboundLog.error(`Failed sending web ${label} to ${params.msg.from ?? conversationId}: ${formatError(err)}`);
			},
			onReplyStart: params.msg.sendComposing
		},
		replyOptions: {
			disableBlockStreaming: true,
			onModelSelected
		}
	});
	if (!queuedFinal) {
		if (shouldClearGroupHistory) params.groupHistories.set(params.groupHistoryKey, []);
		logVerbose("Skipping auto-reply: silent token or no text/media returned from resolver");
		return false;
	}
	if (shouldClearGroupHistory) params.groupHistories.set(params.groupHistoryKey, []);
	return didSendReply;
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/on-message.ts
function createWebOnMessageHandler(params) {
	const processForRoute = async (msg, route, groupHistoryKey, opts) => processMessage({
		cfg: params.cfg,
		msg,
		route,
		groupHistoryKey,
		groupHistories: params.groupHistories,
		groupMemberNames: params.groupMemberNames,
		connectionId: params.connectionId,
		verbose: params.verbose,
		maxMediaBytes: params.maxMediaBytes,
		replyResolver: params.replyResolver,
		replyLogger: params.replyLogger,
		backgroundTasks: params.backgroundTasks,
		rememberSentText: params.echoTracker.rememberText,
		echoHas: params.echoTracker.has,
		echoForget: params.echoTracker.forget,
		buildCombinedEchoKey: params.echoTracker.buildCombinedKey,
		groupHistory: opts?.groupHistory,
		suppressGroupHistoryClear: opts?.suppressGroupHistoryClear
	});
	return async (msg) => {
		const conversationId = msg.conversationId ?? msg.from;
		const peerId = resolvePeerId(msg);
		const route = resolveAgentRoute({
			cfg: loadConfig(),
			channel: "whatsapp",
			accountId: msg.accountId,
			peer: {
				kind: msg.chatType === "group" ? "group" : "direct",
				id: peerId
			}
		});
		const groupHistoryKey = msg.chatType === "group" ? buildGroupHistoryKey({
			channel: "whatsapp",
			accountId: route.accountId,
			peerKind: "group",
			peerId
		}) : route.sessionKey;
		if (msg.from === msg.to) logVerbose(`📱 Same-phone mode detected (from === to: ${msg.from})`);
		if (params.echoTracker.has(msg.body)) {
			logVerbose("Skipping auto-reply: detected echo (message matches recently sent text)");
			params.echoTracker.forget(msg.body);
			return;
		}
		if (msg.chatType === "group") {
			const sender = getSenderIdentity(msg);
			const metaCtx = {
				From: msg.from,
				To: msg.to,
				SessionKey: route.sessionKey,
				AccountId: route.accountId,
				ChatType: msg.chatType,
				ConversationLabel: conversationId,
				GroupSubject: msg.groupSubject,
				SenderName: sender.name ?? void 0,
				SenderId: getPrimaryIdentityId(sender) ?? void 0,
				SenderE164: sender.e164 ?? void 0,
				Provider: "whatsapp",
				Surface: "whatsapp",
				OriginatingChannel: "whatsapp",
				OriginatingTo: conversationId
			};
			updateLastRouteInBackground({
				cfg: params.cfg,
				backgroundTasks: params.backgroundTasks,
				storeAgentId: route.agentId,
				sessionKey: route.sessionKey,
				channel: "whatsapp",
				to: conversationId,
				accountId: route.accountId,
				ctx: metaCtx,
				warn: params.replyLogger.warn.bind(params.replyLogger)
			});
			if (!applyGroupGating({
				cfg: params.cfg,
				msg,
				conversationId,
				groupHistoryKey,
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				baseMentionConfig: params.baseMentionConfig,
				authDir: params.account.authDir,
				groupHistories: params.groupHistories,
				groupHistoryLimit: params.groupHistoryLimit,
				groupMemberNames: params.groupMemberNames,
				logVerbose,
				replyLogger: params.replyLogger
			}).shouldProcess) return;
		} else if (!msg.sender?.e164 && !msg.senderE164 && peerId && peerId.startsWith("+")) {
			const normalized = normalizeE164(peerId);
			if (normalized) {
				msg.sender = {
					...msg.sender ?? {},
					e164: normalized
				};
				msg.senderE164 = normalized;
			}
		}
		if (await maybeBroadcastMessage({
			cfg: params.cfg,
			msg,
			peerId,
			route,
			groupHistoryKey,
			groupHistories: params.groupHistories,
			processMessage: processForRoute
		})) return;
		await processForRoute(msg, route, groupHistoryKey);
	};
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor.ts
function isNonRetryableWebCloseStatus(statusCode) {
	return statusCode === 440;
}
function createActiveConnectionRun(lastInboundAt) {
	return {
		connectionId: newConnectionId(),
		startedAt: Date.now(),
		heartbeat: null,
		watchdogTimer: null,
		lastInboundAt,
		handledMessages: 0,
		unregisterUnhandled: null,
		backgroundTasks: /* @__PURE__ */ new Set()
	};
}
async function monitorWebChannel(verbose, listenerFactory = monitorWebInbox, keepAlive = true, replyResolver = getReplyFromConfig, runtime = defaultRuntime, abortSignal, tuning = {}) {
	const runId = newConnectionId();
	const replyLogger = getChildLogger({
		module: "web-auto-reply",
		runId
	});
	const heartbeatLogger = getChildLogger({
		module: "web-heartbeat",
		runId
	});
	const reconnectLogger = getChildLogger({
		module: "web-reconnect",
		runId
	});
	const statusController = createWebChannelStatusController(tuning.statusSink);
	const status = statusController.snapshot();
	statusController.emit();
	const baseCfg = loadConfig();
	const account = resolveWhatsAppAccount({
		cfg: baseCfg,
		accountId: tuning.accountId
	});
	const cfg = {
		...baseCfg,
		channels: {
			...baseCfg.channels,
			whatsapp: {
				...baseCfg.channels?.whatsapp,
				ackReaction: account.ackReaction,
				messagePrefix: account.messagePrefix,
				allowFrom: account.allowFrom,
				groupAllowFrom: account.groupAllowFrom,
				groupPolicy: account.groupPolicy,
				textChunkLimit: account.textChunkLimit,
				chunkMode: account.chunkMode,
				mediaMaxMb: account.mediaMaxMb,
				blockStreaming: account.blockStreaming,
				groups: account.groups
			}
		}
	};
	const maxMediaBytes = resolveWhatsAppMediaMaxBytes(account);
	const heartbeatSeconds = resolveHeartbeatSeconds(cfg, tuning.heartbeatSeconds);
	const reconnectPolicy = resolveReconnectPolicy(cfg, tuning.reconnect);
	const baseMentionConfig = buildMentionConfig(cfg);
	const groupHistoryLimit = cfg.channels?.whatsapp?.accounts?.[tuning.accountId ?? ""]?.historyLimit ?? cfg.channels?.whatsapp?.historyLimit ?? cfg.messages?.groupChat?.historyLimit ?? 50;
	const groupHistories = /* @__PURE__ */ new Map();
	const groupMemberNames = /* @__PURE__ */ new Map();
	const echoTracker = createEchoTracker({
		maxItems: 100,
		logVerbose
	});
	const sleep = tuning.sleep ?? ((ms, signal) => sleepWithAbort(ms, signal ?? abortSignal));
	const stopRequested = () => abortSignal?.aborted === true;
	const abortPromise = abortSignal && new Promise((resolve) => abortSignal.addEventListener("abort", () => resolve("aborted"), { once: true }));
	const currentMaxListeners = process.getMaxListeners?.() ?? 10;
	if (process.setMaxListeners && currentMaxListeners < 50) process.setMaxListeners(50);
	let sigintStop = false;
	const handleSigint = () => {
		sigintStop = true;
	};
	process.once("SIGINT", handleSigint);
	let reconnectAttempts = 0;
	while (true) {
		if (stopRequested()) break;
		const active = createActiveConnectionRun(status.lastInboundAt ?? status.lastMessageAt ?? null);
		const MESSAGE_TIMEOUT_MS = tuning.messageTimeoutMs ?? 1800 * 1e3;
		const WATCHDOG_CHECK_MS = tuning.watchdogCheckMs ?? 60 * 1e3;
		const onMessage = createWebOnMessageHandler({
			cfg,
			verbose,
			connectionId: active.connectionId,
			maxMediaBytes,
			groupHistoryLimit,
			groupHistories,
			groupMemberNames,
			echoTracker,
			backgroundTasks: active.backgroundTasks,
			replyResolver: replyResolver ?? getReplyFromConfig,
			replyLogger,
			baseMentionConfig,
			account
		});
		const inboundDebounceMs = resolveInboundDebounceMs({
			cfg,
			channel: "whatsapp"
		});
		const shouldDebounce = (msg) => {
			if (msg.mediaPath || msg.mediaType) return false;
			if (msg.location) return false;
			if (msg.replyToId || msg.replyToBody) return false;
			return !hasControlCommand(msg.body, cfg);
		};
		const listener = await (listenerFactory ?? monitorWebInbox)({
			verbose,
			accountId: account.accountId,
			authDir: account.authDir,
			mediaMaxMb: account.mediaMaxMb,
			sendReadReceipts: account.sendReadReceipts,
			debounceMs: inboundDebounceMs,
			shouldDebounce,
			onMessage: async (msg) => {
				active.handledMessages += 1;
				active.lastInboundAt = Date.now();
				statusController.noteInbound(active.lastInboundAt);
				await onMessage(msg);
			}
		});
		statusController.noteConnected();
		const { e164: selfE164 } = readWebSelfId(account.authDir);
		const connectRoute = resolveAgentRoute({
			cfg,
			channel: "whatsapp",
			accountId: account.accountId
		});
		enqueueSystemEvent(`WhatsApp gateway connected${selfE164 ? ` as ${selfE164}` : ""}.`, { sessionKey: connectRoute.sessionKey });
		setActiveWebListener(account.accountId, listener);
		active.unregisterUnhandled = registerUnhandledRejectionHandler((reason) => {
			if (!isLikelyWhatsAppCryptoError(reason)) return false;
			const errorStr = formatError(reason);
			reconnectLogger.warn({
				connectionId: active.connectionId,
				error: errorStr
			}, "web reconnect: unhandled rejection from WhatsApp socket; forcing reconnect");
			listener.signalClose?.({
				status: 499,
				isLoggedOut: false,
				error: reason
			});
			return true;
		});
		const closeListener = async () => {
			setActiveWebListener(account.accountId, null);
			if (active.unregisterUnhandled) {
				active.unregisterUnhandled();
				active.unregisterUnhandled = null;
			}
			if (active.heartbeat) clearInterval(active.heartbeat);
			if (active.watchdogTimer) clearInterval(active.watchdogTimer);
			if (active.backgroundTasks.size > 0) {
				await Promise.allSettled(active.backgroundTasks);
				active.backgroundTasks.clear();
			}
			try {
				await listener.close();
			} catch (err) {
				logVerbose(`Socket close failed: ${formatError(err)}`);
			}
		};
		if (keepAlive) {
			active.heartbeat = setInterval(() => {
				const authAgeMs = getWebAuthAgeMs(account.authDir);
				const minutesSinceLastMessage = active.lastInboundAt ? Math.floor((Date.now() - active.lastInboundAt) / 6e4) : null;
				const logData = {
					connectionId: active.connectionId,
					reconnectAttempts,
					messagesHandled: active.handledMessages,
					lastInboundAt: active.lastInboundAt,
					authAgeMs,
					uptimeMs: Date.now() - active.startedAt,
					...minutesSinceLastMessage !== null && minutesSinceLastMessage > 30 ? { minutesSinceLastMessage } : {}
				};
				if (minutesSinceLastMessage && minutesSinceLastMessage > 30) heartbeatLogger.warn(logData, "⚠️ web gateway heartbeat - no messages in 30+ minutes");
				else heartbeatLogger.info(logData, "web gateway heartbeat");
			}, heartbeatSeconds * 1e3);
			active.watchdogTimer = setInterval(() => {
				if (!active.lastInboundAt) return;
				const timeSinceLastMessage = Date.now() - active.lastInboundAt;
				if (timeSinceLastMessage <= MESSAGE_TIMEOUT_MS) return;
				const minutesSinceLastMessage = Math.floor(timeSinceLastMessage / 6e4);
				statusController.noteWatchdogStale();
				heartbeatLogger.warn({
					connectionId: active.connectionId,
					minutesSinceLastMessage,
					lastInboundAt: new Date(active.lastInboundAt),
					messagesHandled: active.handledMessages
				}, "Message timeout detected - forcing reconnect");
				whatsappHeartbeatLog.warn(`No messages received in ${minutesSinceLastMessage}m - restarting connection`);
				closeListener().catch((err) => {
					logVerbose(`Close listener failed: ${formatError(err)}`);
				});
				listener.signalClose?.({
					status: 499,
					isLoggedOut: false,
					error: "watchdog-timeout"
				});
			}, WATCHDOG_CHECK_MS);
		}
		whatsappLog.info("Listening for personal WhatsApp inbound messages.");
		if (process.stdout.isTTY || process.stderr.isTTY) whatsappLog.raw("Ctrl+C to stop.");
		if (!keepAlive) {
			await closeListener();
			process.removeListener("SIGINT", handleSigint);
			return;
		}
		const reason = await Promise.race([listener.onClose?.catch((err) => {
			reconnectLogger.error({ error: formatError(err) }, "listener.onClose rejected");
			return {
				status: 500,
				isLoggedOut: false,
				error: err
			};
		}) ?? waitForever(), abortPromise ?? waitForever()]);
		if (Date.now() - active.startedAt > heartbeatSeconds * 1e3) reconnectAttempts = 0;
		statusController.noteReconnectAttempts(reconnectAttempts);
		if (stopRequested() || sigintStop || reason === "aborted") {
			await closeListener();
			break;
		}
		const statusCode = (typeof reason === "object" && reason && "status" in reason ? reason.status : void 0) ?? "unknown";
		const loggedOut = typeof reason === "object" && reason && "isLoggedOut" in reason && reason.isLoggedOut;
		const errorStr = formatError(reason);
		const numericStatusCode = typeof statusCode === "number" ? statusCode : void 0;
		reconnectLogger.info({
			connectionId: active.connectionId,
			status: statusCode,
			loggedOut,
			reconnectAttempts,
			error: errorStr
		}, "web reconnect: connection closed");
		enqueueSystemEvent(`WhatsApp gateway disconnected (status ${statusCode ?? "unknown"})`, { sessionKey: connectRoute.sessionKey });
		if (loggedOut) {
			statusController.noteClose({
				statusCode: numericStatusCode,
				loggedOut: true,
				error: errorStr,
				reconnectAttempts,
				healthState: "logged-out"
			});
			runtime.error(`WhatsApp session logged out. Run \`${formatCliCommand("openclaw channels login --channel web")}\` to relink.`);
			await closeListener();
			break;
		}
		if (isNonRetryableWebCloseStatus(statusCode)) {
			statusController.noteClose({
				statusCode: numericStatusCode,
				error: errorStr,
				reconnectAttempts,
				healthState: "conflict"
			});
			reconnectLogger.warn({
				connectionId: active.connectionId,
				status: statusCode,
				error: errorStr
			}, "web reconnect: non-retryable close status; stopping monitor");
			runtime.error(`WhatsApp Web connection closed (status ${statusCode}: session conflict). Resolve conflicting WhatsApp Web sessions, then relink with \`${formatCliCommand("openclaw channels login --channel web")}\`. Stopping web monitoring.`);
			await closeListener();
			break;
		}
		reconnectAttempts += 1;
		if (reconnectPolicy.maxAttempts > 0 && reconnectAttempts >= reconnectPolicy.maxAttempts) {
			statusController.noteClose({
				statusCode: numericStatusCode,
				error: errorStr,
				reconnectAttempts,
				healthState: "stopped"
			});
			reconnectLogger.warn({
				connectionId: active.connectionId,
				status: statusCode,
				reconnectAttempts,
				maxAttempts: reconnectPolicy.maxAttempts
			}, "web reconnect: max attempts reached; continuing in degraded mode");
			runtime.error(`WhatsApp Web reconnect: max attempts reached (${reconnectAttempts}/${reconnectPolicy.maxAttempts}). Stopping web monitoring.`);
			await closeListener();
			break;
		}
		statusController.noteClose({
			statusCode: numericStatusCode,
			error: errorStr,
			reconnectAttempts,
			healthState: "reconnecting"
		});
		const delay = computeBackoff(reconnectPolicy, reconnectAttempts);
		reconnectLogger.info({
			connectionId: active.connectionId,
			status: statusCode,
			reconnectAttempts,
			maxAttempts: reconnectPolicy.maxAttempts || "unlimited",
			delayMs: delay
		}, "web reconnect: scheduling retry");
		runtime.error(`WhatsApp Web connection closed (status ${statusCode}). Retry ${reconnectAttempts}/${reconnectPolicy.maxAttempts || "∞"} in ${formatDurationPrecise(delay)}… (${errorStr})`);
		await closeListener();
		try {
			await sleep(delay, abortSignal);
		} catch {
			break;
		}
	}
	statusController.markStopped();
	process.removeListener("SIGINT", handleSigint);
}
//#endregion
//#region extensions/whatsapp/src/login.ts
const LOGGED_OUT_STATUS = DisconnectReason?.loggedOut ?? 401;
async function loginWeb(verbose, waitForConnection, runtime = defaultRuntime, accountId) {
	const wait = waitForConnection ?? waitForWaConnection;
	const account = resolveWhatsAppAccount({
		cfg: loadConfig(),
		accountId
	});
	const sock = await createWaSocket(true, verbose, { authDir: account.authDir });
	logInfo("Waiting for WhatsApp connection...", runtime);
	try {
		await wait(sock);
		console.log(success("✅ Linked! Credentials saved for future sends."));
	} catch (err) {
		const code = getStatusCode(err);
		if (code === 515) {
			console.log(info("WhatsApp asked for a restart after pairing (code 515); waiting for creds to save…"));
			try {
				sock.ws?.close();
			} catch {}
			await waitForCredsSaveQueueWithTimeout(account.authDir);
			const retry = await createWaSocket(false, verbose, { authDir: account.authDir });
			try {
				await wait(retry);
				console.log(success("✅ Linked after restart; web session ready."));
				return;
			} finally {
				setTimeout(() => retry.ws?.close(), 500);
			}
		}
		if (code === LOGGED_OUT_STATUS) {
			await logoutWeb({
				authDir: account.authDir,
				isLegacyAuthDir: account.isLegacyAuthDir,
				runtime
			});
			console.error(danger(`WhatsApp reported the session is logged out. Cleared cached web session; please rerun ${formatCliCommand("openclaw channels login")} and scan the QR again.`));
			throw new Error("Session logged out; cache cleared. Re-run login.", { cause: err });
		}
		const formatted = formatError(err);
		console.error(danger(`WhatsApp Web connection ended before fully opening. ${formatted}`));
		throw new Error(formatted, { cause: err });
	} finally {
		setTimeout(() => {
			try {
				sock.ws?.close();
			} catch {}
		}, 500);
	}
}
//#endregion
export { extractMediaPlaceholder as a, extractLocationData as i, monitorWebChannel as n, extractText as o, monitorWebInbox as r, resetWebInboundDedupe as s, loginWeb as t };
