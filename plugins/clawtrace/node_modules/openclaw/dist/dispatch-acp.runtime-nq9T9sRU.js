import { CP as getSessionBindingService, Dd as clampPositiveInteger, Dh as routeReply, GP as normalizeAttachmentPath, HT as resolveToolDisplay, IF as prefixSystemMessage, KD as getAcpSessionManager, KP as normalizeAttachments, Mg as maybeApplyTtsToPayload, Od as resolveEffectiveBlockStreamingConfig, Pg as resolveTtsConfig, VT as formatToolSummary, gm as resolveAcpThreadSessionDetailLines, kh as EmbeddedBlockChunker, oO as isSessionIdentityPending, qD as readAcpSessionEntry, sO as resolveSessionIdentityFromMeta, tw as runMessageAction, uO as toAcpRuntimeError, vm as resolveAcpAgentPolicyError, ym as resolveAcpDispatchPolicyError } from "./auth-profiles-B5ypC5S-.js";
import { u as resolveAgentIdFromSessionKey } from "./session-key-BhxcMJEE.js";
import { r as logVerbose } from "./globals-0H99T-Tx.js";
import { n as generateSecureUuid } from "./secure-random-DJI032Bq.js";
import { s as hasOutboundReplyContent } from "./reply-payload-CJqP_sJ6.js";
import { a as isCommandEnabled, f as maybeResolveTextAlias, y as shouldHandleTextCommands } from "./commands-registry-OqaQyye7.js";
import { r as createBlockReplyPipeline } from "./block-reply-pipeline-DwNuD3om.js";
import { t as formatAcpRuntimeErrorText } from "./error-text-CqUIzhgX.js";
import { t as applyMediaUnderstanding } from "./apply-CyikEAv_.js";
import fs from "node:fs/promises";
//#region src/auto-reply/reply/acp-stream-settings.ts
const DEFAULT_ACP_STREAM_COALESCE_IDLE_MS = 350;
const DEFAULT_ACP_STREAM_MAX_CHUNK_CHARS = 1800;
const DEFAULT_ACP_REPEAT_SUPPRESSION = true;
const DEFAULT_ACP_DELIVERY_MODE = "final_only";
const DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR = "paragraph";
const DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR_LIVE = "space";
const DEFAULT_ACP_MAX_OUTPUT_CHARS = 24e3;
const DEFAULT_ACP_MAX_SESSION_UPDATE_CHARS = 320;
const ACP_TAG_VISIBILITY_DEFAULTS = {
	agent_message_chunk: true,
	tool_call: false,
	tool_call_update: false,
	usage_update: false,
	available_commands_update: false,
	current_mode_update: false,
	config_option_update: false,
	session_info_update: false,
	plan: false,
	agent_thought_chunk: false
};
function clampBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function resolveAcpDeliveryMode(value) {
	if (value === "live" || value === "final_only") return value;
	return DEFAULT_ACP_DELIVERY_MODE;
}
function resolveAcpHiddenBoundarySeparator(value, fallback) {
	if (value === "none" || value === "space" || value === "newline" || value === "paragraph") return value;
	return fallback;
}
function resolveAcpStreamCoalesceIdleMs(cfg) {
	return clampPositiveInteger(cfg.acp?.stream?.coalesceIdleMs, DEFAULT_ACP_STREAM_COALESCE_IDLE_MS, {
		min: 0,
		max: 5e3
	});
}
function resolveAcpStreamMaxChunkChars(cfg) {
	return clampPositiveInteger(cfg.acp?.stream?.maxChunkChars, DEFAULT_ACP_STREAM_MAX_CHUNK_CHARS, {
		min: 50,
		max: 4e3
	});
}
function resolveAcpProjectionSettings(cfg) {
	const stream = cfg.acp?.stream;
	const deliveryMode = resolveAcpDeliveryMode(stream?.deliveryMode);
	const hiddenBoundaryFallback = deliveryMode === "live" ? DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR_LIVE : DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR;
	return {
		deliveryMode,
		hiddenBoundarySeparator: resolveAcpHiddenBoundarySeparator(stream?.hiddenBoundarySeparator, hiddenBoundaryFallback),
		repeatSuppression: clampBoolean(stream?.repeatSuppression, DEFAULT_ACP_REPEAT_SUPPRESSION),
		maxOutputChars: clampPositiveInteger(stream?.maxOutputChars, DEFAULT_ACP_MAX_OUTPUT_CHARS, {
			min: 1,
			max: 5e5
		}),
		maxSessionUpdateChars: clampPositiveInteger(stream?.maxSessionUpdateChars, DEFAULT_ACP_MAX_SESSION_UPDATE_CHARS, {
			min: 64,
			max: 8e3
		}),
		tagVisibility: stream?.tagVisibility ?? {}
	};
}
function resolveAcpStreamingConfig(params) {
	const resolved = resolveEffectiveBlockStreamingConfig({
		cfg: params.cfg,
		provider: params.provider,
		accountId: params.accountId,
		maxChunkChars: resolveAcpStreamMaxChunkChars(params.cfg),
		coalesceIdleMs: resolveAcpStreamCoalesceIdleMs(params.cfg)
	});
	if (params.deliveryMode === "live") return {
		chunking: {
			...resolved.chunking,
			minChars: 1
		},
		coalescing: {
			...resolved.coalescing,
			minChars: 1,
			joiner: ""
		}
	};
	return resolved;
}
function isAcpTagVisible(settings, tag) {
	if (!tag) return true;
	const override = settings.tagVisibility[tag];
	if (typeof override === "boolean") return override;
	if (Object.prototype.hasOwnProperty.call(ACP_TAG_VISIBILITY_DEFAULTS, tag)) return ACP_TAG_VISIBILITY_DEFAULTS[tag];
	return true;
}
//#endregion
//#region src/auto-reply/reply/acp-projector.ts
const ACP_BLOCK_REPLY_TIMEOUT_MS = 15e3;
const ACP_LIVE_IDLE_FLUSH_FLOOR_MS = 750;
const ACP_LIVE_IDLE_MIN_CHARS = 80;
const ACP_LIVE_SOFT_FLUSH_CHARS = 220;
const ACP_LIVE_HARD_FLUSH_CHARS = 480;
const TERMINAL_TOOL_STATUSES = new Set([
	"completed",
	"failed",
	"cancelled",
	"done",
	"error"
]);
const HIDDEN_BOUNDARY_TAGS = new Set(["tool_call", "tool_call_update"]);
function truncateText(input, maxChars) {
	if (input.length <= maxChars) return input;
	if (maxChars <= 1) return input.slice(0, maxChars);
	return `${input.slice(0, maxChars - 1)}…`;
}
function hashText(text) {
	return text.trim();
}
function normalizeToolStatus(status) {
	if (!status) return;
	return status.trim().toLowerCase() || void 0;
}
function resolveHiddenBoundarySeparatorText(mode) {
	if (mode === "space") return " ";
	if (mode === "newline") return "\n";
	if (mode === "paragraph") return "\n\n";
	return "";
}
function shouldInsertSeparator(params) {
	if (!params.separator) return false;
	if (!params.nextText) return false;
	const firstChar = params.nextText[0];
	if (typeof firstChar === "string" && /\s/.test(firstChar)) return false;
	const tail = params.previousTail ?? "";
	if (!tail) return false;
	if (params.separator === " " && /\s$/.test(tail)) return false;
	if ((params.separator === "\n" || params.separator === "\n\n") && tail.endsWith("\n")) return false;
	return true;
}
function shouldFlushLiveBufferOnBoundary(text) {
	if (!text) return false;
	if (text.length >= ACP_LIVE_HARD_FLUSH_CHARS) return true;
	if (text.endsWith("\n\n")) return true;
	if (/[.!?][)"'`]*\s$/.test(text)) return true;
	if (text.length >= ACP_LIVE_SOFT_FLUSH_CHARS && /\s$/.test(text)) return true;
	return false;
}
function shouldFlushLiveBufferOnIdle(text) {
	if (!text) return false;
	if (text.length >= ACP_LIVE_IDLE_MIN_CHARS) return true;
	if (/[.!?][)"'`]*$/.test(text.trimEnd())) return true;
	if (text.includes("\n")) return true;
	return false;
}
function renderToolSummaryText(event) {
	const detailParts = [];
	const title = event.title?.trim();
	if (title) detailParts.push(title);
	const status = event.status?.trim();
	if (status) detailParts.push(`status=${status}`);
	const fallback = event.text?.trim();
	if (detailParts.length === 0 && fallback) detailParts.push(fallback);
	return formatToolSummary(resolveToolDisplay({
		name: "tool_call",
		meta: detailParts.join(" · ") || "tool call"
	}));
}
function createAcpReplyProjector(params) {
	const settings = resolveAcpProjectionSettings(params.cfg);
	const streaming = resolveAcpStreamingConfig({
		cfg: params.cfg,
		provider: params.provider,
		accountId: params.accountId,
		deliveryMode: settings.deliveryMode
	});
	const createTurnBlockReplyPipeline = () => createBlockReplyPipeline({
		onBlockReply: async (payload) => {
			await params.deliver("block", payload);
		},
		timeoutMs: ACP_BLOCK_REPLY_TIMEOUT_MS,
		coalescing: settings.deliveryMode === "live" ? void 0 : streaming.coalescing
	});
	let blockReplyPipeline = createTurnBlockReplyPipeline();
	const chunker = new EmbeddedBlockChunker(streaming.chunking);
	const liveIdleFlushMs = Math.max(streaming.coalescing.idleMs, ACP_LIVE_IDLE_FLUSH_FLOOR_MS);
	let emittedOutputChars = 0;
	let truncationNoticeEmitted = false;
	let lastStatusHash;
	let lastToolHash;
	let lastUsageTuple;
	let lastVisibleOutputTail;
	let pendingHiddenBoundary = false;
	let liveBufferText = "";
	let liveIdleTimer;
	const pendingToolDeliveries = [];
	const toolLifecycleById = /* @__PURE__ */ new Map();
	const clearLiveIdleTimer = () => {
		if (!liveIdleTimer) return;
		clearTimeout(liveIdleTimer);
		liveIdleTimer = void 0;
	};
	const drainChunker = (force) => {
		if (settings.deliveryMode === "final_only" && !force) return;
		chunker.drain({
			force,
			emit: (chunk) => {
				blockReplyPipeline.enqueue({ text: chunk });
			}
		});
	};
	const flushLiveBuffer = (opts) => {
		if (settings.deliveryMode !== "live") return;
		if (!liveBufferText) return;
		if (opts?.idle && !shouldFlushLiveBufferOnIdle(liveBufferText)) return;
		const text = liveBufferText;
		liveBufferText = "";
		chunker.append(text);
		drainChunker(opts?.force === true);
	};
	const scheduleLiveIdleFlush = () => {
		if (settings.deliveryMode !== "live") return;
		if (liveIdleFlushMs <= 0 || !liveBufferText) return;
		clearLiveIdleTimer();
		liveIdleTimer = setTimeout(() => {
			flushLiveBuffer({
				force: true,
				idle: true
			});
			if (liveBufferText) scheduleLiveIdleFlush();
		}, liveIdleFlushMs);
	};
	const resetTurnState = () => {
		clearLiveIdleTimer();
		blockReplyPipeline.stop();
		blockReplyPipeline = createTurnBlockReplyPipeline();
		emittedOutputChars = 0;
		truncationNoticeEmitted = false;
		lastStatusHash = void 0;
		lastToolHash = void 0;
		lastUsageTuple = void 0;
		lastVisibleOutputTail = void 0;
		pendingHiddenBoundary = false;
		liveBufferText = "";
		pendingToolDeliveries.length = 0;
		toolLifecycleById.clear();
	};
	const flushBufferedToolDeliveries = async (force) => {
		if (!(settings.deliveryMode === "final_only" && force)) return;
		for (const entry of pendingToolDeliveries.splice(0, pendingToolDeliveries.length)) await params.deliver("tool", entry.payload, entry.meta);
	};
	const flush = async (force = false) => {
		if (settings.deliveryMode === "live") {
			clearLiveIdleTimer();
			flushLiveBuffer({ force: true });
		}
		await flushBufferedToolDeliveries(force);
		drainChunker(force);
		await blockReplyPipeline.flush({ force });
	};
	const emitSystemStatus = async (text, meta, opts) => {
		if (!params.shouldSendToolSummaries) return;
		const bounded = truncateText(text.trim(), settings.maxSessionUpdateChars);
		if (!bounded) return;
		const formatted = prefixSystemMessage(bounded);
		const hash = hashText(formatted);
		if (settings.repeatSuppression && opts?.dedupe !== false && lastStatusHash === hash) return;
		if (settings.deliveryMode === "final_only") pendingToolDeliveries.push({
			payload: { text: formatted },
			meta
		});
		else {
			await flush(true);
			await params.deliver("tool", { text: formatted }, meta);
		}
		lastStatusHash = hash;
	};
	const emitToolSummary = async (event) => {
		if (!params.shouldSendToolSummaries) return;
		if (!isAcpTagVisible(settings, event.tag)) return;
		const renderedToolSummary = renderToolSummaryText(event);
		const toolSummary = truncateText(renderedToolSummary, settings.maxSessionUpdateChars);
		const hash = hashText(renderedToolSummary);
		const toolCallId = event.toolCallId?.trim() || void 0;
		const status = normalizeToolStatus(event.status);
		const isTerminal = status ? TERMINAL_TOOL_STATUSES.has(status) : false;
		const isStart = status === "in_progress" || event.tag === "tool_call";
		if (settings.repeatSuppression) {
			if (toolCallId) {
				const state = toolLifecycleById.get(toolCallId) ?? {
					started: false,
					terminal: false
				};
				if (isTerminal && state.terminal) return;
				if (isStart && state.started) return;
				if (state.lastRenderedHash === hash) return;
				if (isStart) state.started = true;
				if (isTerminal) state.terminal = true;
				state.lastRenderedHash = hash;
				toolLifecycleById.set(toolCallId, state);
			} else if (lastToolHash === hash) return;
		}
		const deliveryMeta = {
			...event.tag ? { tag: event.tag } : {},
			...toolCallId ? { toolCallId } : {},
			...status ? { toolStatus: status } : {},
			allowEdit: Boolean(toolCallId && event.tag === "tool_call_update")
		};
		if (settings.deliveryMode === "final_only") pendingToolDeliveries.push({
			payload: { text: toolSummary },
			meta: deliveryMeta
		});
		else {
			await flush(true);
			await params.deliver("tool", { text: toolSummary }, deliveryMeta);
		}
		lastToolHash = hash;
	};
	const emitTruncationNotice = async () => {
		if (truncationNoticeEmitted) return;
		truncationNoticeEmitted = true;
		await emitSystemStatus("output truncated", { tag: "session_info_update" }, { dedupe: false });
	};
	const onEvent = async (event) => {
		if (event.type === "text_delta") {
			if (event.stream && event.stream !== "output") return;
			if (!isAcpTagVisible(settings, event.tag)) return;
			let text = event.text;
			if (!text) return;
			if (pendingHiddenBoundary && shouldInsertSeparator({
				separator: resolveHiddenBoundarySeparatorText(settings.hiddenBoundarySeparator),
				previousTail: lastVisibleOutputTail,
				nextText: text
			})) text = `${resolveHiddenBoundarySeparatorText(settings.hiddenBoundarySeparator)}${text}`;
			pendingHiddenBoundary = false;
			if (emittedOutputChars >= settings.maxOutputChars) {
				await emitTruncationNotice();
				return;
			}
			const remaining = settings.maxOutputChars - emittedOutputChars;
			const accepted = remaining < text.length ? text.slice(0, remaining) : text;
			if (accepted.length > 0) {
				emittedOutputChars += accepted.length;
				lastVisibleOutputTail = accepted.slice(-1);
				if (settings.deliveryMode === "live") {
					liveBufferText += accepted;
					if (shouldFlushLiveBufferOnBoundary(liveBufferText)) {
						clearLiveIdleTimer();
						flushLiveBuffer({ force: true });
					} else scheduleLiveIdleFlush();
				} else {
					chunker.append(accepted);
					drainChunker(false);
				}
			}
			if (accepted.length < text.length) await emitTruncationNotice();
			return;
		}
		if (event.type === "status") {
			if (!isAcpTagVisible(settings, event.tag)) return;
			if (event.tag === "usage_update" && settings.repeatSuppression) {
				const usageTuple = typeof event.used === "number" && typeof event.size === "number" ? `${event.used}/${event.size}` : hashText(event.text);
				if (usageTuple === lastUsageTuple) return;
				lastUsageTuple = usageTuple;
			}
			await emitSystemStatus(event.text, event.tag ? { tag: event.tag } : void 0, { dedupe: true });
			return;
		}
		if (event.type === "tool_call") {
			if (!isAcpTagVisible(settings, event.tag)) {
				if (event.tag && HIDDEN_BOUNDARY_TAGS.has(event.tag)) {
					const status = normalizeToolStatus(event.status);
					const isTerminal = status ? TERMINAL_TOOL_STATUSES.has(status) : false;
					pendingHiddenBoundary = pendingHiddenBoundary || event.tag === "tool_call" || isTerminal;
				}
				return;
			}
			await emitToolSummary(event);
			return;
		}
		if (event.type === "done" || event.type === "error") {
			await flush(true);
			resetTurnState();
		}
	};
	return {
		onEvent,
		flush
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp-delivery.ts
function normalizeDeliveryChannel(value) {
	return value?.trim().toLowerCase() || void 0;
}
function shouldTreatDeliveredTextAsVisible(params) {
	if (!params.text?.trim()) return false;
	if (params.kind === "final") return true;
	return normalizeDeliveryChannel(params.channel) === "telegram";
}
function createAcpDispatchDeliveryCoordinator(params) {
	const state = {
		startedReplyLifecycle: false,
		accumulatedBlockText: "",
		blockCount: 0,
		deliveredFinalReply: false,
		deliveredVisibleText: false,
		failedVisibleTextDelivery: false,
		queuedDirectVisibleTextDeliveries: 0,
		settledDirectVisibleText: false,
		routedCounts: {
			tool: 0,
			block: 0,
			final: 0
		},
		toolMessageByCallId: /* @__PURE__ */ new Map()
	};
	const directChannel = normalizeDeliveryChannel(params.ctx.Provider ?? params.ctx.Surface);
	const routedChannel = normalizeDeliveryChannel(params.originatingChannel);
	const settleDirectVisibleText = async () => {
		if (state.settledDirectVisibleText || state.queuedDirectVisibleTextDeliveries === 0) return;
		state.settledDirectVisibleText = true;
		await params.dispatcher.waitForIdle();
		const failedCounts = params.dispatcher.getFailedCounts();
		const failedVisibleCount = failedCounts.block + failedCounts.final;
		if (failedVisibleCount > 0) state.failedVisibleTextDelivery = true;
		if (state.queuedDirectVisibleTextDeliveries > failedVisibleCount) state.deliveredVisibleText = true;
	};
	const startReplyLifecycleOnce = async () => {
		if (state.startedReplyLifecycle) return;
		state.startedReplyLifecycle = true;
		await params.onReplyStart?.();
	};
	const tryEditToolMessage = async (payload, toolCallId) => {
		if (!params.shouldRouteToOriginating || !params.originatingChannel || !params.originatingTo) return false;
		const handle = state.toolMessageByCallId.get(toolCallId);
		if (!handle?.messageId) return false;
		const message = payload.text?.trim();
		if (!message) return false;
		try {
			await runMessageAction({
				cfg: params.cfg,
				action: "edit",
				params: {
					channel: handle.channel,
					accountId: handle.accountId,
					to: handle.to,
					threadId: handle.threadId,
					messageId: handle.messageId,
					message
				},
				sessionKey: params.ctx.SessionKey
			});
			state.routedCounts.tool += 1;
			return true;
		} catch (error) {
			logVerbose(`dispatch-acp: tool message edit failed for ${toolCallId}: ${error instanceof Error ? error.message : String(error)}`);
			return false;
		}
	};
	const deliver = async (kind, payload, meta) => {
		if (kind === "block" && payload.text?.trim()) {
			if (state.accumulatedBlockText.length > 0) state.accumulatedBlockText += "\n";
			state.accumulatedBlockText += payload.text;
			state.blockCount += 1;
		}
		if (hasOutboundReplyContent(payload, { trimText: true })) await startReplyLifecycleOnce();
		const ttsPayload = meta?.skipTts ? payload : await maybeApplyTtsToPayload({
			payload,
			cfg: params.cfg,
			channel: params.ttsChannel,
			kind,
			inboundAudio: params.inboundAudio,
			ttsAuto: params.sessionTtsAuto
		});
		if (params.shouldRouteToOriginating && params.originatingChannel && params.originatingTo) {
			const toolCallId = meta?.toolCallId?.trim();
			if (kind === "tool" && meta?.allowEdit === true && toolCallId) {
				if (await tryEditToolMessage(ttsPayload, toolCallId)) return true;
			}
			const tracksVisibleText = shouldTreatDeliveredTextAsVisible({
				channel: routedChannel,
				kind,
				text: ttsPayload.text
			});
			const result = await routeReply({
				payload: ttsPayload,
				channel: params.originatingChannel,
				to: params.originatingTo,
				sessionKey: params.ctx.SessionKey,
				accountId: params.ctx.AccountId,
				threadId: params.ctx.MessageThreadId,
				cfg: params.cfg
			});
			if (!result.ok) {
				if (tracksVisibleText) state.failedVisibleTextDelivery = true;
				logVerbose(`dispatch-acp: route-reply (acp/${kind}) failed: ${result.error ?? "unknown error"}`);
				return false;
			}
			if (kind === "tool" && meta?.toolCallId && result.messageId) state.toolMessageByCallId.set(meta.toolCallId, {
				channel: params.originatingChannel,
				accountId: params.ctx.AccountId,
				to: params.originatingTo,
				...params.ctx.MessageThreadId != null ? { threadId: params.ctx.MessageThreadId } : {},
				messageId: result.messageId
			});
			if (kind === "final") state.deliveredFinalReply = true;
			if (tracksVisibleText) state.deliveredVisibleText = true;
			state.routedCounts[kind] += 1;
			return true;
		}
		const tracksVisibleText = shouldTreatDeliveredTextAsVisible({
			channel: directChannel,
			kind,
			text: ttsPayload.text
		});
		const delivered = kind === "tool" ? params.dispatcher.sendToolResult(ttsPayload) : kind === "block" ? params.dispatcher.sendBlockReply(ttsPayload) : params.dispatcher.sendFinalReply(ttsPayload);
		if (kind === "final" && delivered) state.deliveredFinalReply = true;
		if (delivered && tracksVisibleText) {
			state.queuedDirectVisibleTextDeliveries += 1;
			state.settledDirectVisibleText = false;
		} else if (!delivered && tracksVisibleText) state.failedVisibleTextDelivery = true;
		return delivered;
	};
	return {
		startReplyLifecycle: startReplyLifecycleOnce,
		deliver,
		getBlockCount: () => state.blockCount,
		getAccumulatedBlockText: () => state.accumulatedBlockText,
		settleVisibleText: settleDirectVisibleText,
		hasDeliveredFinalReply: () => state.deliveredFinalReply,
		hasDeliveredVisibleText: () => state.deliveredVisibleText,
		hasFailedVisibleTextDelivery: () => state.failedVisibleTextDelivery,
		getRoutedCounts: () => ({ ...state.routedCounts }),
		applyRoutedCounts: (counts) => {
			counts.tool += state.routedCounts.tool;
			counts.block += state.routedCounts.block;
			counts.final += state.routedCounts.final;
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp.ts
function resolveFirstContextText(ctx, keys) {
	for (const key of keys) {
		const value = ctx[key];
		if (typeof value === "string") return value;
	}
	return "";
}
function resolveAcpPromptText(ctx) {
	return resolveFirstContextText(ctx, [
		"BodyForAgent",
		"BodyForCommands",
		"CommandBody",
		"RawBody",
		"Body"
	]).trim();
}
const ACP_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
async function resolveAcpAttachments(ctx) {
	const mediaAttachments = normalizeAttachments(ctx);
	const results = [];
	for (const attachment of mediaAttachments) {
		const mediaType = attachment.mime ?? "application/octet-stream";
		if (!mediaType.startsWith("image/")) continue;
		const filePath = normalizeAttachmentPath(attachment.path);
		if (!filePath) continue;
		try {
			const stat = await fs.stat(filePath);
			if (stat.size > ACP_ATTACHMENT_MAX_BYTES) {
				logVerbose(`dispatch-acp: skipping attachment ${filePath} (${stat.size} bytes exceeds ${ACP_ATTACHMENT_MAX_BYTES} byte limit)`);
				continue;
			}
			const buf = await fs.readFile(filePath);
			results.push({
				mediaType,
				data: buf.toString("base64")
			});
		} catch {}
	}
	return results;
}
function resolveCommandCandidateText(ctx) {
	return resolveFirstContextText(ctx, [
		"CommandBody",
		"BodyForCommands",
		"RawBody",
		"Body"
	]).trim();
}
function shouldBypassAcpDispatchForCommand(ctx, cfg) {
	const candidate = resolveCommandCandidateText(ctx);
	if (!candidate) return false;
	const allowTextCommands = shouldHandleTextCommands({
		cfg,
		surface: ctx.Surface ?? ctx.Provider ?? "",
		commandSource: ctx.CommandSource
	});
	if (maybeResolveTextAlias(candidate, cfg) != null) return allowTextCommands;
	if (!candidate.trim().startsWith("!")) return false;
	if (!ctx.CommandAuthorized) return false;
	if (!isCommandEnabled(cfg, "bash")) return false;
	return allowTextCommands;
}
function resolveAcpRequestId(ctx) {
	const id = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	if (typeof id === "string" && id.trim()) return id.trim();
	if (typeof id === "number" || typeof id === "bigint") return String(id);
	return generateSecureUuid();
}
function hasBoundConversationForSession(params) {
	const channel = String(params.channelRaw ?? "").trim().toLowerCase();
	if (!channel) return false;
	const normalizedAccountId = String(params.accountIdRaw ?? "").trim().toLowerCase() || "default";
	return getSessionBindingService().listBySession(params.sessionKey).some((binding) => {
		const bindingChannel = String(binding.conversation.channel ?? "").trim().toLowerCase();
		const bindingAccountId = String(binding.conversation.accountId ?? "").trim().toLowerCase();
		const conversationId = String(binding.conversation.conversationId ?? "").trim();
		return bindingChannel === channel && (bindingAccountId || "default") === normalizedAccountId && conversationId.length > 0;
	});
}
const ACP_STALE_BINDING_UNBIND_REASON = "acp-session-init-failed";
function isStaleSessionInitError(params) {
	if (params.code !== "ACP_SESSION_INIT_FAILED") return false;
	return /(ACP (session )?metadata is missing|missing ACP metadata|Session is not ACP-enabled|Resource not found)/i.test(params.message);
}
async function maybeUnbindStaleBoundConversations(params) {
	if (!isStaleSessionInitError(params.error)) return;
	try {
		const removed = await getSessionBindingService().unbind({
			targetSessionKey: params.targetSessionKey,
			reason: ACP_STALE_BINDING_UNBIND_REASON
		});
		if (removed.length > 0) logVerbose(`dispatch-acp: removed ${removed.length} stale bound conversation(s) for ${params.targetSessionKey} after ${params.error.code}: ${params.error.message}`);
	} catch (error) {
		logVerbose(`dispatch-acp: failed to unbind stale bound conversations for ${params.targetSessionKey}: ${error instanceof Error ? error.message : String(error)}`);
	}
}
async function finalizeAcpTurnOutput(params) {
	await params.delivery.settleVisibleText();
	let queuedFinal = params.delivery.hasDeliveredVisibleText() && !params.delivery.hasFailedVisibleTextDelivery();
	const ttsMode = resolveTtsConfig(params.cfg).mode ?? "final";
	const accumulatedBlockText = params.delivery.getAccumulatedBlockText();
	const hasAccumulatedBlockText = accumulatedBlockText.trim().length > 0;
	let finalMediaDelivered = false;
	if (ttsMode === "final" && hasAccumulatedBlockText) try {
		const ttsSyntheticReply = await maybeApplyTtsToPayload({
			payload: { text: accumulatedBlockText },
			cfg: params.cfg,
			channel: params.ttsChannel,
			kind: "final",
			inboundAudio: params.inboundAudio,
			ttsAuto: params.sessionTtsAuto
		});
		if (ttsSyntheticReply.mediaUrl) {
			const delivered = await params.delivery.deliver("final", {
				mediaUrl: ttsSyntheticReply.mediaUrl,
				audioAsVoice: ttsSyntheticReply.audioAsVoice
			});
			queuedFinal = queuedFinal || delivered;
			finalMediaDelivered = delivered;
		}
	} catch (err) {
		logVerbose(`dispatch-acp: accumulated ACP block TTS failed: ${err instanceof Error ? err.message : String(err)}`);
	}
	if (ttsMode !== "all" && hasAccumulatedBlockText && !finalMediaDelivered && !params.delivery.hasDeliveredFinalReply() && (!params.delivery.hasDeliveredVisibleText() || params.delivery.hasFailedVisibleTextDelivery())) {
		const delivered = await params.delivery.deliver("final", { text: accumulatedBlockText }, { skipTts: true });
		queuedFinal = queuedFinal || delivered;
	}
	if (params.shouldEmitResolvedIdentityNotice) {
		const currentMeta = readAcpSessionEntry({
			cfg: params.cfg,
			sessionKey: params.sessionKey
		})?.acp;
		if (!isSessionIdentityPending(resolveSessionIdentityFromMeta(currentMeta))) {
			const resolvedDetails = resolveAcpThreadSessionDetailLines({
				sessionKey: params.sessionKey,
				meta: currentMeta
			});
			if (resolvedDetails.length > 0) {
				const delivered = await params.delivery.deliver("final", { text: prefixSystemMessage(["Session ids resolved.", ...resolvedDetails].join("\n")) });
				queuedFinal = queuedFinal || delivered;
			}
		}
	}
	return queuedFinal;
}
async function tryDispatchAcpReply(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey || params.bypassForCommand) return null;
	const acpManager = getAcpSessionManager();
	const acpResolution = acpManager.resolveSession({
		cfg: params.cfg,
		sessionKey
	});
	if (acpResolution.kind === "none") return null;
	const canonicalSessionKey = acpResolution.sessionKey;
	let queuedFinal = false;
	const delivery = createAcpDispatchDeliveryCoordinator({
		cfg: params.cfg,
		ctx: params.ctx,
		dispatcher: params.dispatcher,
		inboundAudio: params.inboundAudio,
		sessionTtsAuto: params.sessionTtsAuto,
		ttsChannel: params.ttsChannel,
		shouldRouteToOriginating: params.shouldRouteToOriginating,
		originatingChannel: params.originatingChannel,
		originatingTo: params.originatingTo,
		onReplyStart: params.onReplyStart
	});
	const shouldEmitResolvedIdentityNotice = isSessionIdentityPending(resolveSessionIdentityFromMeta(acpResolution.kind === "ready" ? acpResolution.meta : void 0)) && (Boolean(params.ctx.MessageThreadId != null && String(params.ctx.MessageThreadId).trim()) || hasBoundConversationForSession({
		sessionKey: canonicalSessionKey,
		channelRaw: params.ctx.OriginatingChannel ?? params.ctx.Surface ?? params.ctx.Provider,
		accountIdRaw: params.ctx.AccountId
	}));
	const resolvedAcpAgent = acpResolution.kind === "ready" ? (acpResolution.meta.agent?.trim() || params.cfg.acp?.defaultAgent?.trim() || resolveAgentIdFromSessionKey(canonicalSessionKey)).trim() : resolveAgentIdFromSessionKey(canonicalSessionKey);
	const projector = createAcpReplyProjector({
		cfg: params.cfg,
		shouldSendToolSummaries: params.shouldSendToolSummaries,
		deliver: delivery.deliver,
		provider: params.ctx.Surface ?? params.ctx.Provider,
		accountId: params.ctx.AccountId
	});
	const acpDispatchStartedAt = Date.now();
	try {
		const dispatchPolicyError = resolveAcpDispatchPolicyError(params.cfg);
		if (dispatchPolicyError) throw dispatchPolicyError;
		if (acpResolution.kind === "stale") {
			await maybeUnbindStaleBoundConversations({
				targetSessionKey: canonicalSessionKey,
				error: acpResolution.error
			});
			const delivered = await delivery.deliver("final", {
				text: formatAcpRuntimeErrorText(acpResolution.error),
				isError: true
			});
			const counts = params.dispatcher.getQueuedCounts();
			delivery.applyRoutedCounts(counts);
			const acpStats = acpManager.getObservabilitySnapshot(params.cfg);
			logVerbose(`acp-dispatch: session=${sessionKey} outcome=error code=${acpResolution.error.code} latencyMs=${Date.now() - acpDispatchStartedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
			params.recordProcessed("completed", { reason: `acp_error:${acpResolution.error.code.toLowerCase()}` });
			params.markIdle("message_completed");
			return {
				queuedFinal: delivered,
				counts
			};
		}
		const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, resolvedAcpAgent);
		if (agentPolicyError) throw agentPolicyError;
		if (!params.ctx.MediaUnderstanding?.length) try {
			await applyMediaUnderstanding({
				ctx: params.ctx,
				cfg: params.cfg
			});
		} catch (err) {
			logVerbose(`dispatch-acp: media understanding failed, proceeding with raw content: ${err instanceof Error ? err.message : String(err)}`);
		}
		const promptText = resolveAcpPromptText(params.ctx);
		const attachments = await resolveAcpAttachments(params.ctx);
		if (!promptText && attachments.length === 0) {
			const counts = params.dispatcher.getQueuedCounts();
			delivery.applyRoutedCounts(counts);
			params.recordProcessed("completed", { reason: "acp_empty_prompt" });
			params.markIdle("message_completed");
			return {
				queuedFinal: false,
				counts
			};
		}
		try {
			await delivery.startReplyLifecycle();
		} catch (error) {
			logVerbose(`dispatch-acp: start reply lifecycle failed: ${error instanceof Error ? error.message : String(error)}`);
		}
		await acpManager.runTurn({
			cfg: params.cfg,
			sessionKey: canonicalSessionKey,
			text: promptText,
			attachments: attachments.length > 0 ? attachments : void 0,
			mode: "prompt",
			requestId: resolveAcpRequestId(params.ctx),
			...params.abortSignal ? { signal: params.abortSignal } : {},
			onEvent: async (event) => await projector.onEvent(event)
		});
		await projector.flush(true);
		queuedFinal = await finalizeAcpTurnOutput({
			cfg: params.cfg,
			sessionKey: canonicalSessionKey,
			delivery,
			inboundAudio: params.inboundAudio,
			sessionTtsAuto: params.sessionTtsAuto,
			ttsChannel: params.ttsChannel,
			shouldEmitResolvedIdentityNotice
		}) || queuedFinal;
		const counts = params.dispatcher.getQueuedCounts();
		delivery.applyRoutedCounts(counts);
		const acpStats = acpManager.getObservabilitySnapshot(params.cfg);
		logVerbose(`acp-dispatch: session=${sessionKey} outcome=ok latencyMs=${Date.now() - acpDispatchStartedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
		params.recordProcessed("completed", { reason: "acp_dispatch" });
		params.markIdle("message_completed");
		return {
			queuedFinal,
			counts
		};
	} catch (err) {
		await projector.flush(true);
		const acpError = toAcpRuntimeError({
			error: err,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "ACP turn failed before completion."
		});
		await maybeUnbindStaleBoundConversations({
			targetSessionKey: canonicalSessionKey,
			error: acpError
		});
		const delivered = await delivery.deliver("final", {
			text: formatAcpRuntimeErrorText(acpError),
			isError: true
		});
		queuedFinal = queuedFinal || delivered;
		const counts = params.dispatcher.getQueuedCounts();
		delivery.applyRoutedCounts(counts);
		const acpStats = acpManager.getObservabilitySnapshot(params.cfg);
		logVerbose(`acp-dispatch: session=${sessionKey} outcome=error code=${acpError.code} latencyMs=${Date.now() - acpDispatchStartedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
		params.recordProcessed("completed", { reason: `acp_error:${acpError.code.toLowerCase()}` });
		params.markIdle("message_completed");
		return {
			queuedFinal,
			counts
		};
	}
}
//#endregion
export { shouldBypassAcpDispatchForCommand, tryDispatchAcpReply };
