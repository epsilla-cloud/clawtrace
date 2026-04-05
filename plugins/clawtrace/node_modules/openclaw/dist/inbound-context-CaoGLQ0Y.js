import { r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
import { a as shouldLogVerbose, r as logVerbose } from "./globals-0H99T-Tx.js";
import "./model-selection-CMtvxDDg.js";
import { t as normalizeChatType } from "./chat-type-DIvDbfK5.js";
//#region src/channels/conversation-label.ts
function extractConversationId(from) {
	const trimmed = from?.trim();
	if (!trimmed) return;
	const parts = trimmed.split(":").filter(Boolean);
	return parts.length > 0 ? parts[parts.length - 1] : trimmed;
}
function shouldAppendId(id) {
	if (/^[0-9]+$/.test(id)) return true;
	if (id.includes("@g.us")) return true;
	return false;
}
function resolveConversationLabel(ctx) {
	const explicit = ctx.ConversationLabel?.trim();
	if (explicit) return explicit;
	const threadLabel = ctx.ThreadLabel?.trim();
	if (threadLabel) return threadLabel;
	if (normalizeChatType(ctx.ChatType) === "direct") return ctx.SenderName?.trim() || ctx.From?.trim() || void 0;
	const base = ctx.GroupChannel?.trim() || ctx.GroupSubject?.trim() || ctx.GroupSpace?.trim() || ctx.From?.trim() || "";
	if (!base) return;
	const id = extractConversationId(ctx.From);
	if (!id) return base;
	if (!shouldAppendId(id)) return base;
	if (base === id) return base;
	if (base.includes(id)) return base;
	if (base.toLowerCase().includes(" id:")) return base;
	if (base.startsWith("#") || base.startsWith("@")) return base;
	return `${base} id:${id}`;
}
//#endregion
//#region src/media-understanding/defaults.ts
const MB = 1024 * 1024;
const DEFAULT_MAX_CHARS = 500;
const DEFAULT_MAX_CHARS_BY_CAPABILITY = {
	image: 500,
	audio: void 0,
	video: 500
};
const DEFAULT_MAX_BYTES = {
	image: 10 * MB,
	audio: 20 * MB,
	video: 50 * MB
};
const DEFAULT_TIMEOUT_SECONDS = {
	image: 60,
	audio: 60,
	video: 120
};
const DEFAULT_PROMPT = {
	image: "Describe the image.",
	audio: "Transcribe the audio.",
	video: "Describe the video."
};
const DEFAULT_VIDEO_MAX_BASE64_BYTES = 70 * MB;
const DEFAULT_AUDIO_MODELS = {
	groq: "whisper-large-v3-turbo",
	openai: "gpt-4o-mini-transcribe",
	deepgram: "nova-3",
	mistral: "voxtral-mini-latest"
};
const AUTO_AUDIO_KEY_PROVIDERS = [
	"openai",
	"groq",
	"deepgram",
	"google",
	"mistral"
];
const AUTO_IMAGE_KEY_PROVIDERS = [
	"openai",
	"anthropic",
	"google",
	"minimax",
	"minimax-portal",
	"zai"
];
const AUTO_VIDEO_KEY_PROVIDERS = ["google", "moonshot"];
const DEFAULT_IMAGE_MODELS = {
	openai: "gpt-5-mini",
	anthropic: "claude-opus-4-6",
	google: "gemini-3-flash-preview",
	minimax: "MiniMax-VL-01",
	"minimax-portal": "MiniMax-VL-01",
	zai: "glm-4.6v"
};
const CLI_OUTPUT_MAX_BUFFER = 5 * MB;
const DEFAULT_MEDIA_CONCURRENCY = 2;
/**
* Minimum audio file size in bytes below which transcription is skipped.
* Files smaller than this threshold are almost certainly empty or corrupt
* and would cause unhelpful API errors from Whisper/transcription providers.
*/
const MIN_AUDIO_FILE_BYTES = 1024;
//#endregion
//#region src/media-understanding/provider-id.ts
function normalizeMediaProviderId(id) {
	const normalized = normalizeProviderId(id);
	if (normalized === "gemini") return "google";
	return normalized;
}
//#endregion
//#region src/media-understanding/scope.ts
function normalizeDecision(value) {
	const normalized = value?.trim().toLowerCase();
	if (normalized === "allow") return "allow";
	if (normalized === "deny") return "deny";
}
function normalizeMatch(value) {
	return value?.trim().toLowerCase() || void 0;
}
function normalizeMediaUnderstandingChatType(raw) {
	return normalizeChatType(raw ?? void 0);
}
function resolveMediaUnderstandingScope(params) {
	const scope = params.scope;
	if (!scope) return "allow";
	const channel = normalizeMatch(params.channel);
	const chatType = normalizeMediaUnderstandingChatType(params.chatType);
	const sessionKey = normalizeMatch(params.sessionKey) ?? "";
	for (const rule of scope.rules ?? []) {
		if (!rule) continue;
		const action = normalizeDecision(rule.action) ?? "allow";
		const match = rule.match ?? {};
		const matchChannel = normalizeMatch(match.channel);
		const matchChatType = normalizeMediaUnderstandingChatType(match.chatType);
		const matchPrefix = normalizeMatch(match.keyPrefix);
		if (matchChannel && matchChannel !== channel) continue;
		if (matchChatType && matchChatType !== chatType) continue;
		if (matchPrefix && !sessionKey.startsWith(matchPrefix)) continue;
		return action;
	}
	return normalizeDecision(scope.default) ?? "allow";
}
//#endregion
//#region src/media-understanding/resolve.ts
function resolveTimeoutMs(seconds, fallbackSeconds) {
	return Math.max(1e3, Math.floor((typeof seconds === "number" && Number.isFinite(seconds) ? seconds : fallbackSeconds) * 1e3));
}
function resolvePrompt(capability, prompt, maxChars) {
	const base = prompt?.trim() || DEFAULT_PROMPT[capability];
	if (!maxChars || capability === "audio") return base;
	return `${base} Respond in at most ${maxChars} characters.`;
}
function resolveMaxChars(params) {
	const { capability, entry, cfg } = params;
	const configured = entry.maxChars ?? params.config?.maxChars ?? cfg.tools?.media?.[capability]?.maxChars;
	if (typeof configured === "number") return configured;
	return DEFAULT_MAX_CHARS_BY_CAPABILITY[capability];
}
function resolveMaxBytes(params) {
	const configured = params.entry.maxBytes ?? params.config?.maxBytes ?? params.cfg.tools?.media?.[params.capability]?.maxBytes;
	if (typeof configured === "number") return configured;
	return DEFAULT_MAX_BYTES[params.capability];
}
function resolveScopeDecision(params) {
	return resolveMediaUnderstandingScope({
		scope: params.scope,
		sessionKey: params.ctx.SessionKey,
		channel: params.ctx.Surface ?? params.ctx.Provider,
		chatType: normalizeMediaUnderstandingChatType(params.ctx.ChatType)
	});
}
function resolveEntryCapabilities(params) {
	if ((params.entry.type ?? (params.entry.command ? "cli" : "provider")) === "cli") return;
	const providerId = normalizeMediaProviderId(params.entry.provider ?? "");
	if (!providerId) return;
	return params.providerRegistry.get(providerId)?.capabilities;
}
function resolveModelEntries(params) {
	const { cfg, capability, config } = params;
	const sharedModels = cfg.tools?.media?.models ?? [];
	const entries = [...(config?.models ?? []).map((entry) => ({
		entry,
		source: "capability"
	})), ...sharedModels.map((entry) => ({
		entry,
		source: "shared"
	}))];
	if (entries.length === 0) return [];
	return entries.filter(({ entry, source }) => {
		const caps = entry.capabilities && entry.capabilities.length > 0 ? entry.capabilities : source === "shared" ? resolveEntryCapabilities({
			entry,
			providerRegistry: params.providerRegistry
		}) : void 0;
		if (!caps || caps.length === 0) {
			if (source === "shared") {
				if (shouldLogVerbose()) logVerbose(`Skipping shared media model without capabilities: ${entry.provider ?? entry.command ?? "unknown"}`);
				return false;
			}
			return true;
		}
		return caps.includes(capability);
	}).map(({ entry }) => entry);
}
function resolveConcurrency(cfg) {
	const configured = cfg.tools?.media?.concurrency;
	if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) return Math.floor(configured);
	return 2;
}
//#endregion
//#region src/auto-reply/templating.ts
function formatTemplateValue(value) {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (typeof value === "symbol" || typeof value === "function") return value.toString();
	if (Array.isArray(value)) return value.flatMap((entry) => {
		if (entry == null) return [];
		if (typeof entry === "string") return [entry];
		if (typeof entry === "number" || typeof entry === "boolean" || typeof entry === "bigint") return [String(entry)];
		return [];
	}).join(",");
	if (typeof value === "object") return "";
	return "";
}
function applyTemplate(str, ctx) {
	if (!str) return "";
	return str.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
		const value = ctx[key];
		return formatTemplateValue(value);
	});
}
//#endregion
//#region src/auto-reply/reply/inbound-text.ts
function normalizeInboundTextNewlines(input) {
	return input.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}
const BRACKETED_SYSTEM_TAG_RE = /\[\s*(System\s*Message|System|Assistant|Internal)\s*\]/gi;
const LINE_SYSTEM_PREFIX_RE = /^(\s*)System:(?=\s|$)/gim;
/**
* Neutralize user-controlled strings that spoof internal system markers.
*/
function sanitizeInboundSystemTags(input) {
	return input.replace(BRACKETED_SYSTEM_TAG_RE, (_match, tag) => `(${tag})`).replace(LINE_SYSTEM_PREFIX_RE, "$1System (untrusted):");
}
//#endregion
//#region src/auto-reply/reply/inbound-context.ts
const DEFAULT_MEDIA_TYPE = "application/octet-stream";
function normalizeTextField(value) {
	if (typeof value !== "string") return;
	return sanitizeInboundSystemTags(normalizeInboundTextNewlines(value));
}
function normalizeMediaType(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function countMediaEntries(ctx) {
	const pathCount = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths.length : 0;
	const urlCount = Array.isArray(ctx.MediaUrls) ? ctx.MediaUrls.length : 0;
	const single = ctx.MediaPath || ctx.MediaUrl ? 1 : 0;
	return Math.max(pathCount, urlCount, single);
}
function finalizeInboundContext(ctx, opts = {}) {
	const normalized = ctx;
	normalized.Body = sanitizeInboundSystemTags(normalizeInboundTextNewlines(typeof normalized.Body === "string" ? normalized.Body : ""));
	normalized.RawBody = normalizeTextField(normalized.RawBody);
	normalized.CommandBody = normalizeTextField(normalized.CommandBody);
	normalized.Transcript = normalizeTextField(normalized.Transcript);
	normalized.ThreadStarterBody = normalizeTextField(normalized.ThreadStarterBody);
	normalized.ThreadHistoryBody = normalizeTextField(normalized.ThreadHistoryBody);
	if (Array.isArray(normalized.UntrustedContext)) normalized.UntrustedContext = normalized.UntrustedContext.map((entry) => sanitizeInboundSystemTags(normalizeInboundTextNewlines(entry))).filter((entry) => Boolean(entry));
	const chatType = normalizeChatType(normalized.ChatType);
	if (chatType && (opts.forceChatType || normalized.ChatType !== chatType)) normalized.ChatType = chatType;
	normalized.BodyForAgent = sanitizeInboundSystemTags(normalizeInboundTextNewlines(opts.forceBodyForAgent ? normalized.Body : normalized.BodyForAgent ?? normalized.CommandBody ?? normalized.RawBody ?? normalized.Body));
	normalized.BodyForCommands = sanitizeInboundSystemTags(normalizeInboundTextNewlines(opts.forceBodyForCommands ? normalized.CommandBody ?? normalized.RawBody ?? normalized.Body : normalized.BodyForCommands ?? normalized.CommandBody ?? normalized.RawBody ?? normalized.Body));
	const explicitLabel = normalized.ConversationLabel?.trim();
	if (opts.forceConversationLabel || !explicitLabel) {
		const resolved = resolveConversationLabel(normalized)?.trim();
		if (resolved) normalized.ConversationLabel = resolved;
	} else normalized.ConversationLabel = explicitLabel;
	normalized.CommandAuthorized = normalized.CommandAuthorized === true;
	const mediaCount = countMediaEntries(normalized);
	if (mediaCount > 0) {
		const mediaType = normalizeMediaType(normalized.MediaType);
		const normalizedMediaTypes = (Array.isArray(normalized.MediaTypes) ? normalized.MediaTypes : void 0)?.map((entry) => normalizeMediaType(entry));
		let mediaTypesFinal;
		if (normalizedMediaTypes && normalizedMediaTypes.length > 0) {
			const filled = normalizedMediaTypes.slice();
			while (filled.length < mediaCount) filled.push(void 0);
			mediaTypesFinal = filled.map((entry) => entry ?? DEFAULT_MEDIA_TYPE);
		} else if (mediaType) {
			mediaTypesFinal = [mediaType];
			while (mediaTypesFinal.length < mediaCount) mediaTypesFinal.push(DEFAULT_MEDIA_TYPE);
		} else mediaTypesFinal = Array.from({ length: mediaCount }, () => DEFAULT_MEDIA_TYPE);
		normalized.MediaTypes = mediaTypesFinal;
		normalized.MediaType = mediaType ?? mediaTypesFinal[0] ?? DEFAULT_MEDIA_TYPE;
	}
	return normalized;
}
//#endregion
export { DEFAULT_MEDIA_CONCURRENCY as C, MIN_AUDIO_FILE_BYTES as D, DEFAULT_VIDEO_MAX_BASE64_BYTES as E, resolveConversationLabel as O, DEFAULT_MAX_CHARS_BY_CAPABILITY as S, DEFAULT_TIMEOUT_SECONDS as T, CLI_OUTPUT_MAX_BUFFER as _, resolveMaxBytes as a, DEFAULT_MAX_BYTES as b, resolvePrompt as c, normalizeMediaUnderstandingChatType as d, resolveMediaUnderstandingScope as f, AUTO_VIDEO_KEY_PROVIDERS as g, AUTO_IMAGE_KEY_PROVIDERS as h, resolveConcurrency as i, resolveScopeDecision as l, AUTO_AUDIO_KEY_PROVIDERS as m, normalizeInboundTextNewlines as n, resolveMaxChars as o, normalizeMediaProviderId as p, applyTemplate as r, resolveModelEntries as s, finalizeInboundContext as t, resolveTimeoutMs as u, DEFAULT_AUDIO_MODELS as v, DEFAULT_PROMPT as w, DEFAULT_MAX_CHARS as x, DEFAULT_IMAGE_MODELS as y };
