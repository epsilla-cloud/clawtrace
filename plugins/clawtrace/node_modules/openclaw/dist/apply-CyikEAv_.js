import { FN as runCapability, MN as normalizeMediaAttachments, PN as resolveMediaAttachmentLocalRoots, jN as createMediaAttachmentCache, kN as buildProviderRegistry, qP as resolveAttachmentKind } from "./auth-profiles-B5ypC5S-.js";
import { a as shouldLogVerbose, r as logVerbose } from "./globals-0H99T-Tx.js";
import { r as isDeliverableMessageChannel } from "./message-channel-BaBrchOc.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-WjnEbeY8.js";
import { i as resolveConcurrency, t as finalizeInboundContext } from "./inbound-context-CaoGLQ0Y.js";
import { c as resolveInputFileLimits, i as extractFileContentFromSource, l as renderFileContextBlock, s as normalizeMimeType } from "./input-files-CHhz5FMK.js";
import path from "node:path";
//#region src/media-understanding/concurrency.ts
async function runWithConcurrency(tasks, limit) {
	const { results } = await runTasksWithConcurrency({
		tasks,
		limit,
		onTaskError(err) {
			if (shouldLogVerbose()) logVerbose(`Media understanding task failed: ${String(err)}`);
		}
	});
	return results;
}
//#endregion
//#region src/media-understanding/echo-transcript.ts
let deliverRuntimePromise = null;
function loadDeliverRuntime() {
	deliverRuntimePromise ??= import("./deliver-runtime-7XSXdQHF.js");
	return deliverRuntimePromise;
}
function formatEchoTranscript(transcript, format) {
	return format.replace("{transcript}", transcript);
}
/**
* Sends the transcript echo back to the originating chat.
* Best-effort: logs on failure, never throws.
*/
async function sendTranscriptEcho(params) {
	const { ctx, cfg, transcript } = params;
	const channel = ctx.Provider ?? ctx.Surface ?? "";
	const to = ctx.OriginatingTo ?? ctx.From ?? "";
	if (!channel || !to) {
		if (shouldLogVerbose()) logVerbose("media: echo-transcript skipped (no channel/to resolved from ctx)");
		return;
	}
	const normalizedChannel = channel.trim().toLowerCase();
	if (!isDeliverableMessageChannel(normalizedChannel)) {
		if (shouldLogVerbose()) logVerbose(`media: echo-transcript skipped (channel "${String(normalizedChannel)}" is not deliverable)`);
		return;
	}
	const text = formatEchoTranscript(transcript, params.format ?? "📝 \"{transcript}\"");
	try {
		const { deliverOutboundPayloads } = await loadDeliverRuntime();
		await deliverOutboundPayloads({
			cfg,
			channel: normalizedChannel,
			to,
			accountId: ctx.AccountId ?? void 0,
			threadId: ctx.MessageThreadId ?? void 0,
			payloads: [{ text }],
			bestEffort: true
		});
		if (shouldLogVerbose()) logVerbose(`media: echo-transcript sent to ${normalizedChannel}/${to}`);
	} catch (err) {
		logVerbose(`media: echo-transcript delivery failed: ${String(err)}`);
	}
}
//#endregion
//#region src/media-understanding/format.ts
const MEDIA_PLACEHOLDER_RE = /^<media:[^>]+>(\s*\([^)]*\))?$/i;
const MEDIA_PLACEHOLDER_TOKEN_RE = /^<media:[^>]+>(\s*\([^)]*\))?\s*/i;
function extractMediaUserText(body) {
	const trimmed = body?.trim() ?? "";
	if (!trimmed) return;
	if (MEDIA_PLACEHOLDER_RE.test(trimmed)) return;
	return trimmed.replace(MEDIA_PLACEHOLDER_TOKEN_RE, "").trim() || void 0;
}
function formatSection(title, kind, text, userText) {
	const lines = [`[${title}]`];
	if (userText) lines.push(`User text:\n${userText}`);
	lines.push(`${kind}:\n${text}`);
	return lines.join("\n");
}
function formatMediaUnderstandingBody(params) {
	const outputs = params.outputs.filter((output) => output.text.trim());
	if (outputs.length === 0) return params.body ?? "";
	const userText = extractMediaUserText(params.body);
	const sections = [];
	if (userText && outputs.length > 1) sections.push(`User text:\n${userText}`);
	const counts = /* @__PURE__ */ new Map();
	for (const output of outputs) counts.set(output.kind, (counts.get(output.kind) ?? 0) + 1);
	const seen = /* @__PURE__ */ new Map();
	for (const output of outputs) {
		const count = counts.get(output.kind) ?? 1;
		const next = (seen.get(output.kind) ?? 0) + 1;
		seen.set(output.kind, next);
		const suffix = count > 1 ? ` ${next}/${count}` : "";
		if (output.kind === "audio.transcription") {
			sections.push(formatSection(`Audio${suffix}`, "Transcript", output.text, outputs.length === 1 ? userText : void 0));
			continue;
		}
		if (output.kind === "image.description") {
			sections.push(formatSection(`Image${suffix}`, "Description", output.text, outputs.length === 1 ? userText : void 0));
			continue;
		}
		sections.push(formatSection(`Video${suffix}`, "Description", output.text, outputs.length === 1 ? userText : void 0));
	}
	return sections.join("\n\n").trim();
}
function formatAudioTranscripts(outputs) {
	if (outputs.length === 1) return outputs[0].text;
	return outputs.map((output, index) => `Audio ${index + 1}:\n${output.text}`).join("\n\n");
}
//#endregion
//#region src/media-understanding/apply.ts
const CAPABILITY_ORDER = [
	"image",
	"audio",
	"video"
];
const EXTRA_TEXT_MIMES = [
	"application/xml",
	"text/xml",
	"application/x-yaml",
	"text/yaml",
	"application/yaml",
	"application/javascript",
	"text/javascript",
	"text/tab-separated-values"
];
const TEXT_EXT_MIME = new Map([
	[".csv", "text/csv"],
	[".tsv", "text/tab-separated-values"],
	[".txt", "text/plain"],
	[".md", "text/markdown"],
	[".log", "text/plain"],
	[".ini", "text/plain"],
	[".cfg", "text/plain"],
	[".conf", "text/plain"],
	[".env", "text/plain"],
	[".json", "application/json"],
	[".yaml", "text/yaml"],
	[".yml", "text/yaml"],
	[".xml", "application/xml"]
]);
function sanitizeMimeType(value) {
	if (!value) return;
	const trimmed = value.trim().toLowerCase();
	if (!trimmed) return;
	return trimmed.match(/^([a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+)/)?.[1];
}
function resolveFileLimits(cfg) {
	const files = cfg.gateway?.http?.endpoints?.responses?.files;
	const allowedMimesConfigured = Boolean(files?.allowedMimes?.length);
	return {
		...resolveInputFileLimits(files),
		allowedMimesConfigured
	};
}
function appendFileBlocks(body, blocks) {
	if (!blocks || blocks.length === 0) return body ?? "";
	const base = typeof body === "string" ? body.trim() : "";
	const suffix = blocks.join("\n\n").trim();
	if (!base) return suffix;
	return `${base}\n\n${suffix}`.trim();
}
function resolveUtf16Charset(buffer) {
	if (!buffer || buffer.length < 2) return;
	const b0 = buffer[0];
	const b1 = buffer[1];
	if (b0 === 255 && b1 === 254) return "utf-16le";
	if (b0 === 254 && b1 === 255) return "utf-16be";
	const sampleLen = Math.min(buffer.length, 2048);
	let zeroEven = 0;
	let zeroOdd = 0;
	for (let i = 0; i < sampleLen; i += 1) {
		if (buffer[i] !== 0) continue;
		if (i % 2 === 0) zeroEven += 1;
		else zeroOdd += 1;
	}
	if ((zeroEven + zeroOdd) / sampleLen > .2) return zeroOdd >= zeroEven ? "utf-16le" : "utf-16be";
}
const WORDISH_CHAR = /[\p{L}\p{N}]/u;
const CP1252_MAP = [
	"€",
	void 0,
	"‚",
	"ƒ",
	"„",
	"…",
	"†",
	"‡",
	"ˆ",
	"‰",
	"Š",
	"‹",
	"Œ",
	void 0,
	"Ž",
	void 0,
	void 0,
	"‘",
	"’",
	"“",
	"”",
	"•",
	"–",
	"—",
	"˜",
	"™",
	"š",
	"›",
	"œ",
	void 0,
	"ž",
	"Ÿ"
];
function decodeLegacyText(buffer) {
	let output = "";
	for (const byte of buffer) {
		if (byte >= 128 && byte <= 159) {
			const mapped = CP1252_MAP[byte - 128];
			output += mapped ?? String.fromCharCode(byte);
			continue;
		}
		output += String.fromCharCode(byte);
	}
	return output;
}
function getTextStats(text) {
	if (!text) return {
		printableRatio: 0,
		wordishRatio: 0
	};
	let printable = 0;
	let control = 0;
	let wordish = 0;
	for (const char of text) {
		const code = char.codePointAt(0) ?? 0;
		if (code === 9 || code === 10 || code === 13 || code === 32) {
			printable += 1;
			wordish += 1;
			continue;
		}
		if (code < 32 || code >= 127 && code <= 159) {
			control += 1;
			continue;
		}
		printable += 1;
		if (WORDISH_CHAR.test(char)) wordish += 1;
	}
	const total = printable + control;
	if (total === 0) return {
		printableRatio: 0,
		wordishRatio: 0
	};
	return {
		printableRatio: printable / total,
		wordishRatio: wordish / total
	};
}
function isMostlyPrintable(text) {
	return getTextStats(text).printableRatio > .85;
}
function looksLikeLegacyTextBytes(buffer) {
	if (buffer.length === 0) return false;
	const { printableRatio, wordishRatio } = getTextStats(decodeLegacyText(buffer));
	return printableRatio > .95 && wordishRatio > .3;
}
function looksLikeUtf8Text(buffer) {
	if (!buffer || buffer.length === 0) return false;
	const sample = buffer.subarray(0, Math.min(buffer.length, 4096));
	try {
		return isMostlyPrintable(new TextDecoder("utf-8", { fatal: true }).decode(sample));
	} catch {
		return looksLikeLegacyTextBytes(sample);
	}
}
function decodeTextSample(buffer) {
	if (!buffer || buffer.length === 0) return "";
	const sample = buffer.subarray(0, Math.min(buffer.length, 8192));
	const utf16Charset = resolveUtf16Charset(sample);
	if (utf16Charset === "utf-16be") {
		const swapped = Buffer.alloc(sample.length);
		for (let i = 0; i + 1 < sample.length; i += 2) {
			swapped[i] = sample[i + 1];
			swapped[i + 1] = sample[i];
		}
		return new TextDecoder("utf-16le").decode(swapped);
	}
	if (utf16Charset === "utf-16le") return new TextDecoder("utf-16le").decode(sample);
	return new TextDecoder("utf-8").decode(sample);
}
function guessDelimitedMime(text) {
	if (!text) return;
	const line = text.split(/\r?\n/)[0] ?? "";
	const tabs = (line.match(/\t/g) ?? []).length;
	if ((line.match(/,/g) ?? []).length > 0) return "text/csv";
	if (tabs > 0) return "text/tab-separated-values";
}
function resolveTextMimeFromName(name) {
	if (!name) return;
	const ext = path.extname(name).toLowerCase();
	return TEXT_EXT_MIME.get(ext);
}
function isBinaryMediaMime(mime) {
	if (!mime) return false;
	if (mime.startsWith("image/") || mime.startsWith("audio/") || mime.startsWith("video/")) return true;
	if (mime === "application/octet-stream") return true;
	if (mime === "application/zip" || mime === "application/x-zip-compressed" || mime === "application/gzip" || mime === "application/x-gzip" || mime === "application/x-rar-compressed" || mime === "application/x-7z-compressed") return true;
	if (mime.startsWith("application/vnd.")) {
		if (mime.endsWith("+json") || mime.endsWith("+xml")) return false;
		return true;
	}
	return false;
}
async function extractFileBlocks(params) {
	const { attachments, cache, limits, skipAttachmentIndexes } = params;
	if (!attachments || attachments.length === 0) return [];
	const blocks = [];
	for (const attachment of attachments) {
		if (!attachment) continue;
		if (skipAttachmentIndexes?.has(attachment.index)) continue;
		const forcedTextMime = resolveTextMimeFromName(attachment.path ?? attachment.url ?? "");
		const kind = forcedTextMime ? "document" : resolveAttachmentKind(attachment);
		if (!forcedTextMime && (kind === "image" || kind === "video" || kind === "audio")) continue;
		if (!limits.allowUrl && attachment.url && !attachment.path) {
			if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (url disabled) index=${attachment.index}`);
			continue;
		}
		let bufferResult;
		try {
			bufferResult = await cache.getBuffer({
				attachmentIndex: attachment.index,
				maxBytes: limits.maxBytes,
				timeoutMs: limits.timeoutMs
			});
		} catch (err) {
			if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (buffer): ${String(err)}`);
			continue;
		}
		const nameHint = bufferResult?.fileName ?? attachment.path ?? attachment.url;
		const forcedTextMimeResolved = forcedTextMime ?? resolveTextMimeFromName(nameHint ?? "");
		const rawMime = bufferResult?.mime ?? attachment.mime;
		const normalizedRawMime = normalizeMimeType(rawMime);
		if (!forcedTextMimeResolved && isBinaryMediaMime(normalizedRawMime)) continue;
		const utf16Charset = resolveUtf16Charset(bufferResult?.buffer);
		const textSample = decodeTextSample(bufferResult?.buffer);
		const textLike = normalizedRawMime !== "application/pdf" && (Boolean(utf16Charset) || looksLikeUtf8Text(bufferResult?.buffer));
		const guessedDelimited = textLike ? guessDelimitedMime(textSample) : void 0;
		const textHint = forcedTextMimeResolved ?? guessedDelimited ?? (textLike ? "text/plain" : void 0);
		const mimeType = sanitizeMimeType(textHint ?? normalizeMimeType(rawMime));
		if (textHint && rawMime && !rawMime.startsWith("text/")) logVerbose(`media: MIME override from "${rawMime}" to "${textHint}" for index=${attachment.index}`);
		if (!mimeType) {
			if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (unknown mime) index=${attachment.index}`);
			continue;
		}
		const allowedMimes = new Set(limits.allowedMimes);
		if (!limits.allowedMimesConfigured) {
			for (const extra of EXTRA_TEXT_MIMES) allowedMimes.add(extra);
			if (mimeType.startsWith("text/")) allowedMimes.add(mimeType);
		}
		if (!allowedMimes.has(mimeType)) {
			if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (unsupported mime ${mimeType}) index=${attachment.index}`);
			continue;
		}
		let extracted;
		try {
			const mediaType = utf16Charset ? `${mimeType}; charset=${utf16Charset}` : mimeType;
			const { allowedMimesConfigured: _allowedMimesConfigured, ...baseLimits } = limits;
			extracted = await extractFileContentFromSource({
				source: {
					type: "base64",
					data: bufferResult.buffer.toString("base64"),
					mediaType,
					filename: bufferResult.fileName
				},
				limits: {
					...baseLimits,
					allowedMimes
				}
			});
		} catch (err) {
			if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (extract): ${String(err)}`);
			continue;
		}
		let blockText = extracted?.text?.trim() ?? "";
		if (!blockText) if (extracted?.images && extracted.images.length > 0) blockText = "[PDF content rendered to images; images not forwarded to model]";
		else blockText = "[No extractable text]";
		blocks.push(renderFileContextBlock({
			filename: bufferResult.fileName,
			fallbackName: `file-${attachment.index + 1}`,
			mimeType,
			content: blockText
		}));
	}
	return blocks;
}
async function applyMediaUnderstanding(params) {
	const { ctx, cfg } = params;
	const originalUserText = [
		ctx.CommandBody,
		ctx.RawBody,
		ctx.Body
	].map((value) => extractMediaUserText(value)).find((value) => value && value.trim()) ?? void 0;
	const attachments = normalizeMediaAttachments(ctx);
	const providerRegistry = buildProviderRegistry(params.providers, cfg);
	const cache = createMediaAttachmentCache(attachments, { localPathRoots: resolveMediaAttachmentLocalRoots({
		cfg,
		ctx
	}) });
	try {
		const results = await runWithConcurrency(CAPABILITY_ORDER.map((capability) => async () => {
			const config = cfg.tools?.media?.[capability];
			return await runCapability({
				capability,
				cfg,
				ctx,
				attachments: cache,
				media: attachments,
				agentDir: params.agentDir,
				providerRegistry,
				config,
				activeModel: params.activeModel
			});
		}), resolveConcurrency(cfg));
		const outputs = [];
		const decisions = [];
		for (const entry of results) {
			if (!entry) continue;
			for (const output of entry.outputs) outputs.push(output);
			decisions.push(entry.decision);
		}
		if (decisions.length > 0) ctx.MediaUnderstandingDecisions = [...ctx.MediaUnderstandingDecisions ?? [], ...decisions];
		if (outputs.length > 0) {
			ctx.Body = formatMediaUnderstandingBody({
				body: ctx.Body,
				outputs
			});
			const audioOutputs = outputs.filter((output) => output.kind === "audio.transcription");
			if (audioOutputs.length > 0) {
				const transcript = formatAudioTranscripts(audioOutputs);
				ctx.Transcript = transcript;
				if (originalUserText) {
					ctx.CommandBody = originalUserText;
					ctx.RawBody = originalUserText;
				} else {
					ctx.CommandBody = transcript;
					ctx.RawBody = transcript;
				}
				const audioCfg = cfg.tools?.media?.audio;
				if (audioCfg?.echoTranscript && transcript) await sendTranscriptEcho({
					ctx,
					cfg,
					transcript,
					format: audioCfg.echoFormat ?? "📝 \"{transcript}\""
				});
			} else if (originalUserText) {
				ctx.CommandBody = originalUserText;
				ctx.RawBody = originalUserText;
			}
			ctx.MediaUnderstanding = [...ctx.MediaUnderstanding ?? [], ...outputs];
		}
		const audioAttachmentIndexes = new Set(outputs.filter((output) => output.kind === "audio.transcription").map((output) => output.attachmentIndex));
		const fileBlocks = await extractFileBlocks({
			attachments,
			cache,
			limits: resolveFileLimits(cfg),
			skipAttachmentIndexes: audioAttachmentIndexes.size > 0 ? audioAttachmentIndexes : void 0
		});
		if (fileBlocks.length > 0) ctx.Body = appendFileBlocks(ctx.Body, fileBlocks);
		if (outputs.length > 0 || fileBlocks.length > 0) finalizeInboundContext(ctx, {
			forceBodyForAgent: true,
			forceBodyForCommands: outputs.length > 0 || fileBlocks.length > 0
		});
		return {
			outputs,
			decisions,
			appliedImage: outputs.some((output) => output.kind === "image.description"),
			appliedAudio: outputs.some((output) => output.kind === "audio.transcription"),
			appliedVideo: outputs.some((output) => output.kind === "video.description"),
			appliedFile: fileBlocks.length > 0
		};
	} finally {
		await cache.cleanup();
	}
}
//#endregion
export { applyMediaUnderstanding as t };
