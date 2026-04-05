import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { S as sleep, r as clamp } from "./utils-BfvDpbwh.js";
import { GF as convertMarkdownTables, QF as chunkMarkdownTextWithMode, WF as markdownToWhatsApp, _N as updateLastRoute } from "./auth-profiles-B5ypC5S-.js";
import { a as shouldLogVerbose, r as logVerbose } from "./globals-0H99T-Tx.js";
import { l as resolveStorePath } from "./paths-CFxPq48L.js";
import { t as loadWebMedia } from "./web-media-BN6zO1RF.js";
import { d as resolveOutboundMediaUrls, h as sendMediaWithLeadingCaption } from "./reply-payload-CJqP_sJ6.js";
import "./runtime-env-5bDkE44b.js";
import "./send-DtEayToE.js";
import { t as formatError } from "./session-errors-C0GNlAbI.js";
import "./session-Db9ql_Z9.js";
import { randomUUID } from "node:crypto";
const DEFAULT_RECONNECT_POLICY = {
	initialMs: 2e3,
	maxMs: 3e4,
	factor: 1.8,
	jitter: .25,
	maxAttempts: 12
};
function resolveHeartbeatSeconds(cfg, overrideSeconds) {
	const candidate = overrideSeconds ?? cfg.web?.heartbeatSeconds;
	if (typeof candidate === "number" && candidate > 0) return candidate;
	return 60;
}
function resolveReconnectPolicy(cfg, overrides) {
	const reconnectOverrides = cfg.web?.reconnect ?? {};
	const overrideConfig = overrides ?? {};
	const merged = {
		...DEFAULT_RECONNECT_POLICY,
		...reconnectOverrides,
		...overrideConfig
	};
	merged.initialMs = Math.max(250, merged.initialMs);
	merged.maxMs = Math.max(merged.initialMs, merged.maxMs);
	merged.factor = clamp(merged.factor, 1.1, 10);
	merged.jitter = clamp(merged.jitter, 0, 1);
	merged.maxAttempts = Math.max(0, Math.floor(merged.maxAttempts));
	return merged;
}
function newConnectionId() {
	return randomUUID();
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/loggers.ts
const whatsappLog = createSubsystemLogger("gateway/channels/whatsapp");
const whatsappInboundLog = whatsappLog.child("inbound");
const whatsappOutboundLog = whatsappLog.child("outbound");
const whatsappHeartbeatLog = whatsappLog.child("heartbeat");
//#endregion
//#region extensions/whatsapp/src/auto-reply/monitor/last-route.ts
function trackBackgroundTask(backgroundTasks, task) {
	backgroundTasks.add(task);
	task.finally(() => {
		backgroundTasks.delete(task);
	});
}
function updateLastRouteInBackground(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.storeAgentId });
	const task = updateLastRoute({
		storePath,
		sessionKey: params.sessionKey,
		deliveryContext: {
			channel: params.channel,
			to: params.to,
			accountId: params.accountId
		},
		ctx: params.ctx
	}).catch((err) => {
		params.warn({
			error: formatError(err),
			storePath,
			sessionKey: params.sessionKey,
			to: params.to
		}, "failed updating last route");
	});
	trackBackgroundTask(params.backgroundTasks, task);
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/util.ts
function elide(text, limit = 400) {
	if (!text) return text;
	if (text.length <= limit) return text;
	return `${text.slice(0, limit)}… (truncated ${text.length - limit} chars)`;
}
function isLikelyWhatsAppCryptoError(reason) {
	const formatReason = (value) => {
		if (value == null) return "";
		if (typeof value === "string") return value;
		if (value instanceof Error) return `${value.message}\n${value.stack ?? ""}`;
		if (typeof value === "object") try {
			return JSON.stringify(value);
		} catch {
			return Object.prototype.toString.call(value);
		}
		if (typeof value === "number") return String(value);
		if (typeof value === "boolean") return String(value);
		if (typeof value === "bigint") return String(value);
		if (typeof value === "symbol") return value.description ?? value.toString();
		if (typeof value === "function") return value.name ? `[function ${value.name}]` : "[function]";
		return Object.prototype.toString.call(value);
	};
	const haystack = (reason instanceof Error ? `${reason.message}\n${reason.stack ?? ""}` : formatReason(reason)).toLowerCase();
	if (!(haystack.includes("unsupported state or unable to authenticate data") || haystack.includes("bad mac"))) return false;
	return haystack.includes("@whiskeysockets/baileys") || haystack.includes("baileys") || haystack.includes("noise-handler") || haystack.includes("aesdecryptgcm");
}
//#endregion
//#region extensions/whatsapp/src/auto-reply/deliver-reply.ts
const REASONING_PREFIX = "reasoning:";
function shouldSuppressReasoningReply(payload) {
	if (payload.isReasoning === true) return true;
	const text = payload.text;
	if (typeof text !== "string") return false;
	return text.trimStart().toLowerCase().startsWith(REASONING_PREFIX);
}
async function deliverWebReply(params) {
	const { replyResult, msg, maxMediaBytes, textLimit, replyLogger, connectionId, skipLog } = params;
	const replyStarted = Date.now();
	if (shouldSuppressReasoningReply(replyResult)) {
		whatsappOutboundLog.debug(`Suppressed reasoning payload to ${msg.from}`);
		return;
	}
	const tableMode = params.tableMode ?? "code";
	const chunkMode = params.chunkMode ?? "length";
	const textChunks = chunkMarkdownTextWithMode(markdownToWhatsApp(convertMarkdownTables(replyResult.text || "", tableMode)), textLimit, chunkMode);
	const mediaList = resolveOutboundMediaUrls(replyResult);
	const sendWithRetry = async (fn, label, maxAttempts = 3) => {
		let lastErr;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) try {
			return await fn();
		} catch (err) {
			lastErr = err;
			const errText = formatError(err);
			const isLast = attempt === maxAttempts;
			if (!/closed|reset|timed\s*out|disconnect/i.test(errText) || isLast) throw err;
			const backoffMs = 500 * attempt;
			logVerbose(`Retrying ${label} to ${msg.from} after failure (${attempt}/${maxAttempts - 1}) in ${backoffMs}ms: ${errText}`);
			await sleep(backoffMs);
		}
		throw lastErr;
	};
	if (mediaList.length === 0 && textChunks.length) {
		const totalChunks = textChunks.length;
		for (const [index, chunk] of textChunks.entries()) {
			const chunkStarted = Date.now();
			await sendWithRetry(() => msg.reply(chunk), "text");
			if (!skipLog) {
				const durationMs = Date.now() - chunkStarted;
				whatsappOutboundLog.debug(`Sent chunk ${index + 1}/${totalChunks} to ${msg.from} (${durationMs.toFixed(0)}ms)`);
			}
		}
		replyLogger.info({
			correlationId: msg.id ?? newConnectionId(),
			connectionId: connectionId ?? null,
			to: msg.from,
			from: msg.to,
			text: elide(replyResult.text, 240),
			mediaUrl: null,
			mediaSizeBytes: null,
			mediaKind: null,
			durationMs: Date.now() - replyStarted
		}, "auto-reply sent (text)");
		return;
	}
	const remainingText = [...textChunks];
	await sendMediaWithLeadingCaption({
		mediaUrls: mediaList,
		caption: remainingText.shift() || "",
		send: async ({ mediaUrl, caption }) => {
			const media = await loadWebMedia(mediaUrl, {
				maxBytes: maxMediaBytes,
				localRoots: params.mediaLocalRoots
			});
			if (shouldLogVerbose()) {
				logVerbose(`Web auto-reply media size: ${(media.buffer.length / (1024 * 1024)).toFixed(2)}MB`);
				logVerbose(`Web auto-reply media source: ${mediaUrl} (kind ${media.kind})`);
			}
			if (media.kind === "image") await sendWithRetry(() => msg.sendMedia({
				image: media.buffer,
				caption,
				mimetype: media.contentType
			}), "media:image");
			else if (media.kind === "audio") await sendWithRetry(() => msg.sendMedia({
				audio: media.buffer,
				ptt: true,
				mimetype: media.contentType,
				caption
			}), "media:audio");
			else if (media.kind === "video") await sendWithRetry(() => msg.sendMedia({
				video: media.buffer,
				caption,
				mimetype: media.contentType
			}), "media:video");
			else {
				const fileName = media.fileName ?? mediaUrl.split("/").pop() ?? "file";
				const mimetype = media.contentType ?? "application/octet-stream";
				await sendWithRetry(() => msg.sendMedia({
					document: media.buffer,
					fileName,
					caption,
					mimetype
				}), "media:document");
			}
			whatsappOutboundLog.info(`Sent media reply to ${msg.from} (${(media.buffer.length / (1024 * 1024)).toFixed(2)}MB)`);
			replyLogger.info({
				correlationId: msg.id ?? newConnectionId(),
				connectionId: connectionId ?? null,
				to: msg.from,
				from: msg.to,
				text: caption ?? null,
				mediaUrl,
				mediaSizeBytes: media.buffer.length,
				mediaKind: media.kind,
				durationMs: Date.now() - replyStarted
			}, "auto-reply sent (media)");
		},
		onError: async ({ error, mediaUrl, caption, isFirst }) => {
			whatsappOutboundLog.error(`Failed sending web media to ${msg.from}: ${formatError(error)}`);
			replyLogger.warn({
				err: error,
				mediaUrl
			}, "failed to send web media reply");
			if (!isFirst) return;
			const warning = error instanceof Error ? `⚠️ Media failed: ${error.message}` : "⚠️ Media failed.";
			const fallbackText = [remainingText.shift() ?? caption ?? "", warning].filter(Boolean).join("\n");
			if (!fallbackText) return;
			whatsappOutboundLog.warn(`Media skipped; sent text-only to ${msg.from}`);
			await msg.reply(fallbackText);
		}
	});
	for (const chunk of remainingText) await msg.reply(chunk);
}
//#endregion
export { updateLastRouteInBackground as a, whatsappLog as c, resolveHeartbeatSeconds as d, resolveReconnectPolicy as f, trackBackgroundTask as i, whatsappOutboundLog as l, elide as n, whatsappHeartbeatLog as o, isLikelyWhatsAppCryptoError as r, whatsappInboundLog as s, deliverWebReply as t, newConnectionId as u };
