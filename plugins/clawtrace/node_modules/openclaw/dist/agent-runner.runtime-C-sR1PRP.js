import { m as defaultRuntime } from "./subsystem-CJEvHE2o.js";
import { Ao as setCliSessionBinding, BI as loadCronStore, Cp as resolveOriginMessageProvider, Dh as routeReply, Do as runCliAgent, Eh as isRoutableChannel, FI as resolveGroupSessionKey, Gh as queueEmbeddedPiMessage, Hm as readSessionMessages, Ko as resolveModelAuthMode, Lh as resolveBootstrapWarningSignaturesSeen, Od as resolveEffectiveBlockStreamingConfig, Oh as runEmbeddedPiAgent, Oo as getCliSessionBinding, Ow as isFallbackSummaryError, Ph as registerAgentRunContext, Rh as LiveSessionModelSwitchError, Sh as enqueueFollowupRun, Sp as resolveOriginAccountId, Sw as parseReplyDirectives, Th as refreshQueuedFollowupSession, Tp as resolveRunAuthProfile, VI as resolveCronStorePath, Yh as compactEmbeddedPiSession, ag as readPostCompactionContext, bp as isBunFetchSocketError, dh as resolveFallbackTransition, eg as derivePromptTokens, f as loadConfig, fN as loadSessionStore, fw as applyReplyTagsToPayload, gh as resolveModelCostConfig, gw as resolveReplyToMode, hh as formatUsd, hw as createReplyToModeFilterForChannel, ig as estimateMessagesTokens, j_ as ensureSandboxWorkspaceForSession, jh as emitAgentEvent, jo as setCliSessionId, kw as runWithModelFallback, lh as buildFallbackClearedNotice, mh as formatTokenCount, mw as isRenderablePayload, ng as hasNonzeroUsage, ph as estimateUsageCost, pw as applyReplyThreading, rg as normalizeUsage, tg as deriveSessionTotalTokens, uh as buildFallbackNotice, vN as updateSessionStore, vd as createTypingSignaler, vp as buildEmbeddedRunExecutionParams, wh as scheduleFollowupDrain, wp as resolveOriginMessageTo, xp as resolveModelFallbackOptions, yN as updateSessionStoreEntry, yh as lookupContextTokens, yp as formatBunFetchSocketError, zk as resolvePathFromInput } from "./auth-profiles-B5ypC5S-.js";
import "./defaults-Dpv7c6Om.js";
import { f as normalizeVerboseLevel, p as resolveResponseUsageMode } from "./thinking.shared-CA9NbpNW.js";
import { u as resolveAgentIdFromSessionKey } from "./session-key-BhxcMJEE.js";
import { r as logVerbose } from "./globals-0H99T-Tx.js";
import { _ as resolveRunModelFallbacksOverride, v as resolveSessionAgentId } from "./agent-scope-BSOSJbA_.js";
import { s as isCliProvider } from "./model-selection-CMtvxDDg.js";
import { n as generateSecureUuid } from "./secure-random-DJI032Bq.js";
import { o as isInternalMessageChannel, p as resolveMessageChannel, s as isMarkdownCapableMessageChannel } from "./message-channel-BaBrchOc.js";
import { a as isAudioFileName } from "./mime-BFjhBApy.js";
import { a as resolveSessionTranscriptPath, i as resolveSessionFilePathOptions, r as resolveSessionFilePath } from "./paths-CFxPq48L.js";
import { N as resolveFreshSessionTotalTokens, g as SILENT_REPLY_TOKEN, m as stripHeartbeatToken, r as enqueueSystemEvent, v as isSilentReplyPrefixText, y as isSilentReplyText } from "./system-events-BdYO0Ful.js";
import { n as isDiagnosticsEnabled, t as emitDiagnosticEvent } from "./diagnostic-events-DfaLQ618.js";
import { f as resolveEffectiveToolFsWorkspaceOnly } from "./web-media-BN6zO1RF.js";
import { u as resolveMemoryFlushPlan } from "./memory-state-CKh9RZhV.js";
import { p as resolveSendableOutboundReplyParts, s as hasOutboundReplyContent } from "./reply-payload-CJqP_sJ6.js";
import { A as isCompactionFailureError, B as sanitizeUserFacingText, H as isOverloadedErrorMessage, K as resolveSandboxRuntimeStatus, L as isTransientHttpError, P as isLikelyContextOverflowError, U as isRateLimitErrorMessage, V as isBillingErrorMessage, b as BILLING_ERROR_USER_MESSAGE, j as isContextOverflowError, n as filterMessagingToolMediaDuplicates, r as shouldSuppressMessagingToolReplies, t as filterMessagingToolDuplicates } from "./reply-payloads-dedupe-DO7H6ZY3.js";
import { n as resolveSandboxConfigForAgent } from "./config-BWw9Yn0D.js";
import "./thinking-BIe_TekB.js";
import { a as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./discord-core-B4Argznh.js";
import { n as createBlockReplyContentKey, r as createBlockReplyPipeline, t as createAudioAsVoiceBuffer } from "./block-reply-pipeline-DwNuD3om.js";
import { n as incrementCompactionCount } from "./session-updates-BqfbWtYW.js";
import fsSync from "node:fs";
import crypto from "node:crypto";
//#region src/auto-reply/reply/reply-delivery.ts
function normalizeReplyPayloadDirectives(params) {
	const parseMode = params.parseMode ?? "always";
	const silentToken = params.silentToken ?? "NO_REPLY";
	const sourceText = params.payload.text ?? "";
	const parsed = parseMode === "always" || parseMode === "auto" && (sourceText.includes("[[") || sourceText.includes("MEDIA:") || sourceText.includes(silentToken)) ? parseReplyDirectives(sourceText, {
		currentMessageId: params.currentMessageId,
		silentToken
	}) : void 0;
	let text = parsed ? parsed.text || void 0 : params.payload.text || void 0;
	if (params.trimLeadingWhitespace && text) text = text.trimStart() || void 0;
	const mediaUrls = params.payload.mediaUrls ?? parsed?.mediaUrls;
	const mediaUrl = params.payload.mediaUrl ?? parsed?.mediaUrl ?? mediaUrls?.[0];
	return {
		payload: {
			...params.payload,
			text,
			mediaUrls,
			mediaUrl,
			replyToId: params.payload.replyToId ?? parsed?.replyToId,
			replyToTag: params.payload.replyToTag || parsed?.replyToTag,
			replyToCurrent: params.payload.replyToCurrent || parsed?.replyToCurrent,
			audioAsVoice: Boolean(params.payload.audioAsVoice || parsed?.audioAsVoice)
		},
		isSilent: parsed?.isSilent ?? false
	};
}
function createBlockReplyDeliveryHandler(params) {
	return async (payload) => {
		const { text, skip } = params.normalizeStreamingText(payload);
		if (skip && !resolveSendableOutboundReplyParts(payload).hasMedia) return;
		const taggedPayload = applyReplyTagsToPayload({
			...payload,
			text,
			mediaUrl: payload.mediaUrl ?? payload.mediaUrls?.[0],
			replyToId: payload.replyToId ?? (payload.replyToCurrent === false ? void 0 : params.currentMessageId)
		}, params.currentMessageId);
		if (!isRenderablePayload(taggedPayload) && !payload.audioAsVoice) return;
		const normalized = normalizeReplyPayloadDirectives({
			payload: taggedPayload,
			currentMessageId: params.currentMessageId,
			silentToken: SILENT_REPLY_TOKEN,
			trimLeadingWhitespace: true,
			parseMode: "auto"
		});
		const mediaNormalizedPayload = params.normalizeMediaPaths ? await params.normalizeMediaPaths(normalized.payload) : normalized.payload;
		const blockPayload = params.applyReplyToMode(mediaNormalizedPayload);
		const blockHasMedia = resolveSendableOutboundReplyParts(blockPayload).hasMedia;
		if (!blockPayload.text && !blockHasMedia && !blockPayload.audioAsVoice) return;
		if (normalized.isSilent && !blockHasMedia) return;
		if (blockPayload.text) params.typingSignals.signalTextDelta(blockPayload.text).catch((err) => {
			logVerbose(`block reply typing signal failed: ${String(err)}`);
		});
		if (params.blockStreamingEnabled && params.blockReplyPipeline) params.blockReplyPipeline.enqueue(blockPayload);
		else if (params.blockStreamingEnabled) {
			params.directlySentBlockKeys.add(createBlockReplyContentKey(blockPayload));
			await params.onBlockReply(blockPayload);
		} else if (blockHasMedia) {
			params.directlySentBlockKeys.add(createBlockReplyContentKey(blockPayload));
			await params.onBlockReply({
				...blockPayload,
				text: void 0
			});
		}
	};
}
//#endregion
//#region src/auto-reply/reply/reply-media-paths.ts
const HTTP_URL_RE = /^https?:\/\//i;
const FILE_URL_RE = /^file:\/\//i;
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const HAS_FILE_EXT_RE = /\.\w{1,10}$/;
function isLikelyLocalMediaSource(media) {
	return FILE_URL_RE.test(media) || media.startsWith("/") || media.startsWith("./") || media.startsWith("../") || media.startsWith("~") || WINDOWS_DRIVE_RE.test(media) || media.startsWith("\\\\") || !SCHEME_RE.test(media) && (media.includes("/") || media.includes("\\") || HAS_FILE_EXT_RE.test(media));
}
function getPayloadMediaList(payload) {
	return resolveSendableOutboundReplyParts(payload).mediaUrls;
}
function createReplyMediaPathNormalizer(params) {
	const agentId = params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	}) : void 0;
	const workspaceOnly = resolveEffectiveToolFsWorkspaceOnly({
		cfg: params.cfg,
		agentId
	});
	let sandboxRootPromise;
	const resolveSandboxRoot = async () => {
		if (!sandboxRootPromise) sandboxRootPromise = ensureSandboxWorkspaceForSession({
			config: params.cfg,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir
		}).then((sandbox) => sandbox?.workspaceDir);
		return await sandboxRootPromise;
	};
	const normalizeMediaSource = async (raw) => {
		const media = raw.trim();
		if (!media) return media;
		assertMediaNotDataUrl(media);
		if (HTTP_URL_RE.test(media)) return media;
		const sandboxRoot = await resolveSandboxRoot();
		if (sandboxRoot) try {
			return await resolveSandboxedMediaSource({
				media,
				sandboxRoot
			});
		} catch (err) {
			if (workspaceOnly || !isLikelyLocalMediaSource(media)) throw err;
			if (FILE_URL_RE.test(media)) return media;
			return resolvePathFromInput(media, params.workspaceDir);
		}
		if (!isLikelyLocalMediaSource(media)) return media;
		if (FILE_URL_RE.test(media)) return media;
		return resolvePathFromInput(media, params.workspaceDir);
	};
	return async (payload) => {
		const mediaList = getPayloadMediaList(payload);
		if (mediaList.length === 0) return payload;
		const normalizedMedia = [];
		const seen = /* @__PURE__ */ new Set();
		for (const media of mediaList) {
			const normalized = await normalizeMediaSource(media);
			if (!normalized || seen.has(normalized)) continue;
			seen.add(normalized);
			normalizedMedia.push(normalized);
		}
		if (normalizedMedia.length === 0) return {
			...payload,
			mediaUrl: void 0,
			mediaUrls: void 0
		};
		return {
			...payload,
			mediaUrl: normalizedMedia[0],
			mediaUrls: normalizedMedia
		};
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-execution.ts
/**
* Build a human-friendly rate-limit message from a FallbackSummaryError.
* Includes a countdown when the soonest cooldown expiry is known.
*/
function buildRateLimitCooldownMessage(err) {
	if (!isFallbackSummaryError(err)) return "⚠️ All models are temporarily rate-limited. Please try again in a few minutes.";
	const expiry = err.soonestCooldownExpiry;
	const now = Date.now();
	if (typeof expiry === "number" && expiry > now) {
		const secsLeft = Math.max(1, Math.ceil((expiry - now) / 1e3));
		if (secsLeft <= 60) return `⚠️ Rate-limited — ready in ~${secsLeft}s. Please wait a moment.`;
		return `⚠️ Rate-limited — ready in ~${Math.ceil(secsLeft / 60)} min. Please try again shortly.`;
	}
	return "⚠️ All models are temporarily rate-limited. Please try again in a few minutes.";
}
function isPureTransientRateLimitSummary(err) {
	return isFallbackSummaryError(err) && err.attempts.length > 0 && err.attempts.every((attempt) => {
		const reason = attempt.reason;
		return reason === "rate_limit" || reason === "overloaded";
	});
}
async function runAgentTurnWithFallback(params) {
	const TRANSIENT_HTTP_RETRY_DELAY_MS = 2500;
	let didLogHeartbeatStrip = false;
	let autoCompactionCount = 0;
	const directlySentBlockKeys = /* @__PURE__ */ new Set();
	const runId = params.opts?.runId ?? crypto.randomUUID();
	const normalizeReplyMediaPaths = createReplyMediaPathNormalizer({
		cfg: params.followupRun.run.config,
		sessionKey: params.sessionKey,
		workspaceDir: params.followupRun.run.workspaceDir
	});
	let didNotifyAgentRunStart = false;
	const notifyAgentRunStart = () => {
		if (didNotifyAgentRunStart) return;
		didNotifyAgentRunStart = true;
		params.opts?.onAgentRunStart?.(runId);
	};
	const shouldSurfaceToControlUi = isInternalMessageChannel(params.followupRun.run.messageProvider ?? params.sessionCtx.Surface ?? params.sessionCtx.Provider);
	if (params.sessionKey) registerAgentRunContext(runId, {
		sessionKey: params.sessionKey,
		verboseLevel: params.resolvedVerboseLevel,
		isHeartbeat: params.isHeartbeat,
		isControlUiVisible: shouldSurfaceToControlUi
	});
	let runResult;
	let fallbackProvider = params.followupRun.run.provider;
	let fallbackModel = params.followupRun.run.model;
	let fallbackAttempts = [];
	let didResetAfterCompactionFailure = false;
	let didRetryTransientHttpError = false;
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(params.getActiveSessionEntry()?.systemPromptReport);
	while (true) try {
		const normalizeStreamingText = (payload) => {
			let text = payload.text;
			const reply = resolveSendableOutboundReplyParts(payload);
			if (!params.isHeartbeat && text?.includes("HEARTBEAT_OK")) {
				const stripped = stripHeartbeatToken(text, { mode: "message" });
				if (stripped.didStrip && !didLogHeartbeatStrip) {
					didLogHeartbeatStrip = true;
					logVerbose("Stripped stray HEARTBEAT_OK token from reply");
				}
				if (stripped.shouldSkip && !reply.hasMedia) return { skip: true };
				text = stripped.text;
			}
			if (isSilentReplyText(text, "NO_REPLY")) return { skip: true };
			if (isSilentReplyPrefixText(text, "NO_REPLY") || isSilentReplyPrefixText(text, "HEARTBEAT_OK")) return { skip: true };
			if (!text) {
				if (reply.hasMedia) return {
					text: void 0,
					skip: false
				};
				return { skip: true };
			}
			const sanitized = sanitizeUserFacingText(text, { errorContext: Boolean(payload.isError) });
			if (!sanitized.trim()) return { skip: true };
			return {
				text: sanitized,
				skip: false
			};
		};
		const handlePartialForTyping = async (payload) => {
			if (isSilentReplyPrefixText(payload.text, "NO_REPLY")) return;
			const { text, skip } = normalizeStreamingText(payload);
			if (skip || !text) return;
			await params.typingSignals.signalTextDelta(text);
			return text;
		};
		const blockReplyPipeline = params.blockReplyPipeline;
		const blockReplyHandler = params.opts?.onBlockReply ? createBlockReplyDeliveryHandler({
			onBlockReply: params.opts.onBlockReply,
			currentMessageId: params.sessionCtx.MessageSidFull ?? params.sessionCtx.MessageSid,
			normalizeStreamingText,
			applyReplyToMode: params.applyReplyToMode,
			normalizeMediaPaths: normalizeReplyMediaPaths,
			typingSignals: params.typingSignals,
			blockStreamingEnabled: params.blockStreamingEnabled,
			blockReplyPipeline,
			directlySentBlockKeys
		}) : void 0;
		const onToolResult = params.opts?.onToolResult;
		const fallbackResult = await runWithModelFallback({
			...resolveModelFallbackOptions(params.followupRun.run),
			runId,
			run: (provider, model, runOptions) => {
				params.opts?.onModelSelected?.({
					provider,
					model,
					thinkLevel: params.followupRun.run.thinkLevel
				});
				if (isCliProvider(provider, params.followupRun.run.config)) {
					const startedAt = Date.now();
					notifyAgentRunStart();
					emitAgentEvent({
						runId,
						stream: "lifecycle",
						data: {
							phase: "start",
							startedAt
						}
					});
					const cliSessionBinding = getCliSessionBinding(params.getActiveSessionEntry(), provider);
					const authProfileId = provider === params.followupRun.run.provider ? params.followupRun.run.authProfileId : void 0;
					return (async () => {
						let lifecycleTerminalEmitted = false;
						try {
							const result = await runCliAgent({
								sessionId: params.followupRun.run.sessionId,
								sessionKey: params.sessionKey,
								agentId: params.followupRun.run.agentId,
								sessionFile: params.followupRun.run.sessionFile,
								workspaceDir: params.followupRun.run.workspaceDir,
								config: params.followupRun.run.config,
								prompt: params.commandBody,
								provider,
								model,
								thinkLevel: params.followupRun.run.thinkLevel,
								timeoutMs: params.followupRun.run.timeoutMs,
								runId,
								extraSystemPrompt: params.followupRun.run.extraSystemPrompt,
								ownerNumbers: params.followupRun.run.ownerNumbers,
								cliSessionId: cliSessionBinding?.sessionId,
								cliSessionBinding,
								authProfileId,
								bootstrapPromptWarningSignaturesSeen,
								bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
								images: params.opts?.images
							});
							bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
							const cliText = result.payloads?.[0]?.text?.trim();
							if (cliText) emitAgentEvent({
								runId,
								stream: "assistant",
								data: { text: cliText }
							});
							emitAgentEvent({
								runId,
								stream: "lifecycle",
								data: {
									phase: "end",
									startedAt,
									endedAt: Date.now()
								}
							});
							lifecycleTerminalEmitted = true;
							return result;
						} catch (err) {
							emitAgentEvent({
								runId,
								stream: "lifecycle",
								data: {
									phase: "error",
									startedAt,
									endedAt: Date.now(),
									error: String(err)
								}
							});
							lifecycleTerminalEmitted = true;
							throw err;
						} finally {
							if (!lifecycleTerminalEmitted) emitAgentEvent({
								runId,
								stream: "lifecycle",
								data: {
									phase: "error",
									startedAt,
									endedAt: Date.now(),
									error: "CLI run completed without lifecycle terminal event"
								}
							});
						}
					})();
				}
				const { embeddedContext, senderContext, runBaseParams } = buildEmbeddedRunExecutionParams({
					run: params.followupRun.run,
					sessionCtx: params.sessionCtx,
					hasRepliedRef: params.opts?.hasRepliedRef,
					provider,
					runId,
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
					model
				});
				return (async () => {
					let attemptCompactionCount = 0;
					try {
						const result = await runEmbeddedPiAgent({
							...embeddedContext,
							allowGatewaySubagentBinding: true,
							trigger: params.isHeartbeat ? "heartbeat" : "user",
							groupId: resolveGroupSessionKey(params.sessionCtx)?.id,
							groupChannel: params.sessionCtx.GroupChannel?.trim() ?? params.sessionCtx.GroupSubject?.trim(),
							groupSpace: params.sessionCtx.GroupSpace?.trim() ?? void 0,
							...senderContext,
							...runBaseParams,
							prompt: params.commandBody,
							extraSystemPrompt: params.followupRun.run.extraSystemPrompt,
							toolResultFormat: (() => {
								const channel = resolveMessageChannel(params.sessionCtx.Surface, params.sessionCtx.Provider);
								if (!channel) return "markdown";
								return isMarkdownCapableMessageChannel(channel) ? "markdown" : "plain";
							})(),
							suppressToolErrorWarnings: params.opts?.suppressToolErrorWarnings,
							bootstrapContextMode: params.opts?.bootstrapContextMode,
							bootstrapContextRunKind: params.opts?.isHeartbeat ? "heartbeat" : "default",
							images: params.opts?.images,
							abortSignal: params.opts?.abortSignal,
							blockReplyBreak: params.resolvedBlockStreamingBreak,
							blockReplyChunking: params.blockReplyChunking,
							onPartialReply: async (payload) => {
								const textForTyping = await handlePartialForTyping(payload);
								if (!params.opts?.onPartialReply || textForTyping === void 0) return;
								await params.opts.onPartialReply({
									text: textForTyping,
									mediaUrls: payload.mediaUrls
								});
							},
							onAssistantMessageStart: async () => {
								await params.typingSignals.signalMessageStart();
								await params.opts?.onAssistantMessageStart?.();
							},
							onReasoningStream: params.typingSignals.shouldStartOnReasoning || params.opts?.onReasoningStream ? async (payload) => {
								await params.typingSignals.signalReasoningDelta();
								await params.opts?.onReasoningStream?.({
									text: payload.text,
									mediaUrls: payload.mediaUrls
								});
							} : void 0,
							onReasoningEnd: params.opts?.onReasoningEnd,
							onAgentEvent: async (evt) => {
								const hasLifecyclePhase = evt.stream === "lifecycle" && typeof evt.data.phase === "string";
								if (evt.stream !== "lifecycle" || hasLifecyclePhase) notifyAgentRunStart();
								if (evt.stream === "tool") {
									const phase = typeof evt.data.phase === "string" ? evt.data.phase : "";
									const name = typeof evt.data.name === "string" ? evt.data.name : void 0;
									if (phase === "start" || phase === "update") {
										await params.typingSignals.signalToolStart();
										await params.opts?.onToolStart?.({
											name,
											phase
										});
									}
								}
								if (evt.stream === "compaction") {
									const phase = typeof evt.data.phase === "string" ? evt.data.phase : "";
									if (phase === "start") {
										if (params.opts?.onCompactionStart) await params.opts.onCompactionStart();
										else if (params.opts?.onBlockReply) {
											const currentMessageId = params.sessionCtx.MessageSidFull ?? params.sessionCtx.MessageSid;
											const noticePayload = params.applyReplyToMode({
												text: "🧹 Compacting context...",
												replyToId: currentMessageId,
												replyToCurrent: true,
												isCompactionNotice: true
											});
											try {
												await params.opts.onBlockReply(noticePayload);
											} catch (err) {
												logVerbose(`compaction start notice delivery failed (non-fatal): ${String(err)}`);
											}
										}
									}
									const completed = evt.data?.completed === true;
									if (phase === "end" && completed) {
										attemptCompactionCount += 1;
										await params.opts?.onCompactionEnd?.();
									}
								}
							},
							onBlockReply: blockReplyHandler,
							onBlockReplyFlush: params.blockStreamingEnabled && blockReplyPipeline ? async () => {
								await blockReplyPipeline.flush({ force: true });
							} : void 0,
							shouldEmitToolResult: params.shouldEmitToolResult,
							shouldEmitToolOutput: params.shouldEmitToolOutput,
							bootstrapPromptWarningSignaturesSeen,
							bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
							onToolResult: onToolResult ? (() => {
								let toolResultChain = Promise.resolve();
								return (payload) => {
									toolResultChain = toolResultChain.then(async () => {
										const { text, skip } = normalizeStreamingText(payload);
										if (skip) return;
										if (text !== void 0) await params.typingSignals.signalTextDelta(text);
										await onToolResult({
											...payload,
											text
										});
									}).catch((err) => {
										logVerbose(`tool result delivery failed: ${String(err)}`);
									});
									const task = toolResultChain.finally(() => {
										params.pendingToolTasks.delete(task);
									});
									params.pendingToolTasks.add(task);
								};
							})() : void 0
						});
						bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
						const resultCompactionCount = Math.max(0, result.meta?.agentMeta?.compactionCount ?? 0);
						attemptCompactionCount = Math.max(attemptCompactionCount, resultCompactionCount);
						return result;
					} finally {
						autoCompactionCount += attemptCompactionCount;
					}
				})();
			}
		});
		runResult = fallbackResult.result;
		fallbackProvider = fallbackResult.provider;
		fallbackModel = fallbackResult.model;
		fallbackAttempts = Array.isArray(fallbackResult.attempts) ? fallbackResult.attempts.map((attempt) => ({
			provider: String(attempt.provider ?? ""),
			model: String(attempt.model ?? ""),
			error: String(attempt.error ?? ""),
			reason: attempt.reason ? String(attempt.reason) : void 0,
			status: typeof attempt.status === "number" ? attempt.status : void 0,
			code: attempt.code ? String(attempt.code) : void 0
		})) : [];
		const embeddedError = runResult.meta?.error;
		if (embeddedError && isContextOverflowError(embeddedError.message) && !didResetAfterCompactionFailure && await params.resetSessionAfterCompactionFailure(embeddedError.message)) {
			didResetAfterCompactionFailure = true;
			return {
				kind: "final",
				payload: { text: "⚠️ Context limit exceeded. I've reset our conversation to start fresh - please try again.\n\nTo prevent this, increase your compaction buffer by setting `agents.defaults.compaction.reserveTokensFloor` to 20000 or higher in your config." }
			};
		}
		if (embeddedError?.kind === "role_ordering") {
			if (await params.resetSessionAfterRoleOrderingConflict(embeddedError.message)) return {
				kind: "final",
				payload: { text: "⚠️ Message ordering conflict. I've reset the conversation - please try again." }
			};
		}
		break;
	} catch (err) {
		if (err instanceof LiveSessionModelSwitchError) {
			params.followupRun.run.provider = err.provider;
			params.followupRun.run.model = err.model;
			params.followupRun.run.authProfileId = err.authProfileId;
			params.followupRun.run.authProfileIdSource = err.authProfileId ? err.authProfileIdSource : void 0;
			fallbackProvider = err.provider;
			fallbackModel = err.model;
			continue;
		}
		const message = err instanceof Error ? err.message : String(err);
		const isBilling = isBillingErrorMessage(message);
		const isContextOverflow = !isBilling && isLikelyContextOverflowError(message);
		const isCompactionFailure = !isBilling && isCompactionFailureError(message);
		const isSessionCorruption = /function call turn comes immediately after/i.test(message);
		const isRoleOrderingError = /incorrect role information|roles must alternate/i.test(message);
		const isTransientHttp = isTransientHttpError(message);
		if (isCompactionFailure && !didResetAfterCompactionFailure && await params.resetSessionAfterCompactionFailure(message)) {
			didResetAfterCompactionFailure = true;
			return {
				kind: "final",
				payload: { text: "⚠️ Context limit exceeded during compaction. I've reset our conversation to start fresh - please try again.\n\nTo prevent this, increase your compaction buffer by setting `agents.defaults.compaction.reserveTokensFloor` to 20000 or higher in your config." }
			};
		}
		if (isRoleOrderingError) {
			if (await params.resetSessionAfterRoleOrderingConflict(message)) return {
				kind: "final",
				payload: { text: "⚠️ Message ordering conflict. I've reset the conversation - please try again." }
			};
		}
		if (isSessionCorruption && params.sessionKey && params.activeSessionStore && params.storePath) {
			const sessionKey = params.sessionKey;
			const corruptedSessionId = params.getActiveSessionEntry()?.sessionId;
			defaultRuntime.error(`Session history corrupted (Gemini function call ordering). Resetting session: ${params.sessionKey}`);
			try {
				if (corruptedSessionId) {
					const transcriptPath = resolveSessionTranscriptPath(corruptedSessionId);
					try {
						fsSync.unlinkSync(transcriptPath);
					} catch {}
				}
				delete params.activeSessionStore[sessionKey];
				await updateSessionStore(params.storePath, (store) => {
					delete store[sessionKey];
				});
			} catch (cleanupErr) {
				defaultRuntime.error(`Failed to reset corrupted session ${params.sessionKey}: ${String(cleanupErr)}`);
			}
			return {
				kind: "final",
				payload: { text: "⚠️ Session history was corrupted. I've reset the conversation - please try again!" }
			};
		}
		if (isTransientHttp && !didRetryTransientHttpError) {
			didRetryTransientHttpError = true;
			defaultRuntime.error(`Transient HTTP provider error before reply (${message}). Retrying once in ${TRANSIENT_HTTP_RETRY_DELAY_MS}ms.`);
			await new Promise((resolve) => {
				setTimeout(resolve, TRANSIENT_HTTP_RETRY_DELAY_MS);
			});
			continue;
		}
		defaultRuntime.error(`Embedded agent failed before reply: ${message}`);
		const isRateLimit = isFallbackSummaryError(err) ? isPureTransientRateLimitSummary(err) : isRateLimitErrorMessage(message);
		const trimmedMessage = (isTransientHttp ? sanitizeUserFacingText(message, { errorContext: true }) : message).replace(/\.\s*$/, "");
		return {
			kind: "final",
			payload: { text: isBilling ? BILLING_ERROR_USER_MESSAGE : isRateLimit ? buildRateLimitCooldownMessage(err) : isContextOverflow ? "⚠️ Context overflow — prompt too large for this model. Try a shorter message or a larger-context model." : isRoleOrderingError ? "⚠️ Message ordering conflict - please try again. If this persists, use /new to start a fresh session." : `⚠️ Agent failed before reply: ${trimmedMessage}.\nLogs: openclaw logs --follow` }
		};
	}
	const finalEmbeddedError = runResult?.meta?.error;
	const hasPayloadText = runResult?.payloads?.some((p) => p.text?.trim());
	if (finalEmbeddedError && !hasPayloadText) {
		if (isContextOverflowError(finalEmbeddedError.message ?? "")) return {
			kind: "final",
			payload: { text: "⚠️ Context overflow — this conversation is too large for the model. Use /new to start a fresh session." }
		};
	}
	if (runResult) {
		if (!runResult.payloads?.some((p) => !p.isError && !p.isReasoning && hasOutboundReplyContent(p, { trimText: true }))) {
			const metaErrorMsg = finalEmbeddedError?.message ?? "";
			const rawErrorPayloadText = runResult.payloads?.find((p) => p.isError && p.text?.trim() && !p.text.startsWith("⚠️"))?.text ?? "";
			const errorCandidate = metaErrorMsg || rawErrorPayloadText;
			if (errorCandidate && (isRateLimitErrorMessage(errorCandidate) || isOverloadedErrorMessage(errorCandidate))) runResult.payloads = [{
				text: "⚠️ API rate limit reached — the model couldn't generate a response. Please try again in a moment.",
				isError: true
			}];
		}
	}
	return {
		kind: "success",
		runId,
		runResult,
		fallbackProvider,
		fallbackModel,
		fallbackAttempts,
		didLogHeartbeatStrip,
		autoCompactionCount,
		directlySentBlockKeys: directlySentBlockKeys.size > 0 ? directlySentBlockKeys : void 0
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-helpers.ts
const hasAudioMedia = (urls) => Boolean(urls?.some((url) => isAudioFileName(url)));
const isAudioPayload = (payload) => hasAudioMedia(resolveSendableOutboundReplyParts(payload).mediaUrls);
function resolveCurrentVerboseLevel(params) {
	if (!params.sessionKey || !params.storePath) return;
	try {
		const entry = loadSessionStore(params.storePath)[params.sessionKey];
		return normalizeVerboseLevel(String(entry?.verboseLevel ?? ""));
	} catch {
		return;
	}
}
function createVerboseGate(params, shouldEmit) {
	const fallbackVerbose = normalizeVerboseLevel(String(params.resolvedVerboseLevel ?? "")) ?? "off";
	return () => {
		return shouldEmit(resolveCurrentVerboseLevel(params) ?? fallbackVerbose);
	};
}
const createShouldEmitToolResult = (params) => {
	return createVerboseGate(params, (level) => level !== "off");
};
const createShouldEmitToolOutput = (params) => {
	return createVerboseGate(params, (level) => level === "full");
};
const finalizeWithFollowup = (value, queueKey, runFollowupTurn) => {
	scheduleFollowupDrain(queueKey, runFollowupTurn);
	return value;
};
const signalTypingIfNeeded = async (payloads, typingSignals) => {
	if (payloads.some((payload) => hasOutboundReplyContent(payload, { trimText: true }))) await typingSignals.signalRunStart();
};
//#endregion
//#region src/auto-reply/reply/memory-flush.ts
function resolveMemoryFlushContextWindowTokens(params) {
	return lookupContextTokens(params.modelId, { allowAsyncLoad: false }) ?? params.agentCfgContextTokens ?? 2e5;
}
function resolvePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function resolveMemoryFlushGateState(params) {
	if (!params.entry) return null;
	const totalTokens = resolvePositiveTokenCount(params.tokenCount) ?? resolveFreshSessionTotalTokens(params.entry);
	if (!totalTokens || totalTokens <= 0) return null;
	const contextWindow = Math.max(1, Math.floor(params.contextWindowTokens));
	const reserveTokens = Math.max(0, Math.floor(params.reserveTokensFloor));
	const softThreshold = Math.max(0, Math.floor(params.softThresholdTokens));
	const threshold = Math.max(0, contextWindow - reserveTokens - softThreshold);
	if (threshold <= 0) return null;
	return {
		entry: params.entry,
		totalTokens,
		threshold
	};
}
function shouldRunMemoryFlush(params) {
	const state = resolveMemoryFlushGateState(params);
	if (!state || state.totalTokens < state.threshold) return false;
	if (hasAlreadyFlushedForCurrentCompaction(state.entry)) return false;
	return true;
}
function shouldRunPreflightCompaction(params) {
	const state = resolveMemoryFlushGateState(params);
	return Boolean(state && state.totalTokens >= state.threshold);
}
/**
* Returns true when a memory flush has already been performed for the current
* compaction cycle. This prevents repeated flush runs within the same cycle —
* important for both the token-based and transcript-size–based trigger paths.
*/
function hasAlreadyFlushedForCurrentCompaction(entry) {
	const compactionCount = entry.compactionCount ?? 0;
	const lastFlushAt = entry.memoryFlushCompactionCount;
	return typeof lastFlushAt === "number" && lastFlushAt === compactionCount;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-memory.ts
function estimatePromptTokensForMemoryFlush(prompt) {
	const trimmed = prompt?.trim();
	if (!trimmed) return;
	const tokens = estimateMessagesTokens([{
		role: "user",
		content: trimmed,
		timestamp: Date.now()
	}]);
	if (!Number.isFinite(tokens) || tokens <= 0) return;
	return Math.ceil(tokens);
}
function resolveEffectivePromptTokens(basePromptTokens, lastOutputTokens, promptTokenEstimate) {
	const base = Math.max(0, basePromptTokens ?? 0);
	const output = Math.max(0, lastOutputTokens ?? 0);
	const estimate = Math.max(0, promptTokenEstimate ?? 0);
	return base + output + estimate;
}
const TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS = 8192;
const TRANSCRIPT_TAIL_CHUNK_BYTES = 64 * 1024;
function parseUsageFromTranscriptLine(line) {
	const trimmed = line.trim();
	if (!trimmed) return;
	try {
		const parsed = JSON.parse(trimmed);
		const usage = normalizeUsage(parsed.message?.usage ?? parsed.usage);
		if (usage && hasNonzeroUsage(usage)) return usage;
	} catch {}
}
function resolveSessionLogPath(sessionId, sessionEntry, sessionKey, opts) {
	if (!sessionId) return;
	try {
		const transcriptPath = sessionEntry?.transcriptPath?.trim();
		const sessionFile = sessionEntry?.sessionFile?.trim() || transcriptPath;
		const pathOpts = resolveSessionFilePathOptions({
			agentId: resolveAgentIdFromSessionKey(sessionKey),
			storePath: opts?.storePath
		});
		return resolveSessionFilePath(sessionId, sessionFile ? { sessionFile } : sessionEntry, pathOpts);
	} catch {
		return;
	}
}
function deriveTranscriptUsageSnapshot(usage) {
	if (!usage) return;
	const promptTokens = derivePromptTokens(usage);
	const outputRaw = usage.output;
	const outputTokens = typeof outputRaw === "number" && Number.isFinite(outputRaw) && outputRaw > 0 ? outputRaw : void 0;
	if (!(typeof promptTokens === "number") && !(typeof outputTokens === "number")) return;
	return {
		promptTokens,
		outputTokens
	};
}
async function appendPostCompactionRefreshPrompt(params) {
	const refreshPrompt = await readPostCompactionContext(params.followupRun.run.workspaceDir, params.cfg);
	if (!refreshPrompt) return;
	const existingPrompt = params.followupRun.run.extraSystemPrompt?.trim();
	if (existingPrompt?.includes(refreshPrompt)) return;
	params.followupRun.run.extraSystemPrompt = [existingPrompt, refreshPrompt].filter(Boolean).join("\n\n");
}
async function readSessionLogSnapshot(params) {
	const logPath = resolveSessionLogPath(params.sessionId, params.sessionEntry, params.sessionKey, params.opts);
	if (!logPath) return {};
	const snapshot = {};
	if (params.includeByteSize) try {
		const stat = await fsSync.promises.stat(logPath);
		const size = Math.floor(stat.size);
		snapshot.byteSize = Number.isFinite(size) && size >= 0 ? size : void 0;
	} catch {
		snapshot.byteSize = void 0;
	}
	if (params.includeUsage) try {
		snapshot.usage = deriveTranscriptUsageSnapshot(await readLastNonzeroUsageFromSessionLog(logPath));
	} catch {
		snapshot.usage = void 0;
	}
	return snapshot;
}
async function readLastNonzeroUsageFromSessionLog(logPath) {
	const handle = await fsSync.promises.open(logPath, "r");
	try {
		let position = (await handle.stat()).size;
		let leadingPartial = "";
		while (position > 0) {
			const chunkSize = Math.min(TRANSCRIPT_TAIL_CHUNK_BYTES, position);
			const start = position - chunkSize;
			const buffer = Buffer.allocUnsafe(chunkSize);
			const { bytesRead } = await handle.read(buffer, 0, chunkSize, start);
			if (bytesRead <= 0) break;
			const lines = `${buffer.toString("utf-8", 0, bytesRead)}${leadingPartial}`.split(/\n+/);
			leadingPartial = lines.shift() ?? "";
			for (let i = lines.length - 1; i >= 0; i -= 1) {
				const usage = parseUsageFromTranscriptLine(lines[i] ?? "");
				if (usage) return usage;
			}
			position = start;
		}
		return parseUsageFromTranscriptLine(leadingPartial);
	} finally {
		await handle.close();
	}
}
function estimatePromptTokensFromSessionTranscript(params) {
	const sessionId = params.sessionId?.trim();
	if (!sessionId) return;
	try {
		const messages = readSessionMessages(sessionId, params.storePath, params.sessionFile);
		if (messages.length === 0) return;
		const estimatedTokens = estimateMessagesTokens(messages);
		if (!Number.isFinite(estimatedTokens) || estimatedTokens <= 0) return;
		return Math.ceil(estimatedTokens);
	} catch {
		return;
	}
}
async function runPreflightCompactionIfNeeded(params) {
	if (!params.sessionKey) return params.sessionEntry;
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (!entry?.sessionId) return entry ?? params.sessionEntry;
	const isCli = isCliProvider(params.followupRun.run.provider, params.cfg);
	if (params.isHeartbeat || isCli) return entry ?? params.sessionEntry;
	const contextWindowTokens = resolveMemoryFlushContextWindowTokens({
		modelId: params.followupRun.run.model ?? params.defaultModel,
		agentCfgContextTokens: params.agentCfgContextTokens
	});
	const memoryFlushPlan = resolveMemoryFlushPlan({ cfg: params.cfg });
	const reserveTokensFloor = memoryFlushPlan?.reserveTokensFloor ?? params.cfg.agents?.defaults?.compaction?.reserveTokensFloor ?? 2e4;
	const softThresholdTokens = memoryFlushPlan?.softThresholdTokens ?? 4e3;
	const freshPersistedTokens = resolveFreshSessionTotalTokens(entry);
	const persistedTotalTokens = entry.totalTokens;
	const hasPersistedTotalTokens = typeof persistedTotalTokens === "number" && Number.isFinite(persistedTotalTokens) && persistedTotalTokens > 0;
	if (!(entry.totalTokensFresh === false || !hasPersistedTotalTokens)) return entry ?? params.sessionEntry;
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const transcriptPromptTokens = typeof freshPersistedTokens === "number" ? void 0 : estimatePromptTokensFromSessionTranscript({
		sessionId: entry.sessionId,
		storePath: params.storePath,
		sessionFile: entry.sessionFile ?? params.followupRun.run.sessionFile
	});
	const projectedTokenCount = typeof transcriptPromptTokens === "number" ? resolveEffectivePromptTokens(transcriptPromptTokens, void 0, promptTokenEstimate) : void 0;
	const tokenCountForCompaction = typeof projectedTokenCount === "number" && Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	const threshold = contextWindowTokens - reserveTokensFloor - softThresholdTokens;
	logVerbose(`preflightCompaction check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${threshold} isHeartbeat=${params.isHeartbeat} isCli=${isCli} persistedFresh=${entry?.totalTokensFresh === true} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} promptTokensEst=${promptTokenEstimate ?? "undefined"}`);
	if (!shouldRunPreflightCompaction({
		entry,
		tokenCount: tokenCountForCompaction,
		contextWindowTokens,
		reserveTokensFloor,
		softThresholdTokens
	})) return entry ?? params.sessionEntry;
	logVerbose(`preflightCompaction triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} threshold=${threshold}`);
	const sessionFile = resolveSessionLogPath(entry.sessionId, entry.sessionFile ? entry : {
		...entry,
		sessionFile: params.followupRun.run.sessionFile
	}, params.sessionKey ?? params.followupRun.run.sessionKey, { storePath: params.storePath });
	const result = await compactEmbeddedPiSession({
		sessionId: entry.sessionId,
		sessionKey: params.sessionKey,
		allowGatewaySubagentBinding: true,
		messageChannel: params.followupRun.run.messageProvider,
		groupId: entry.groupId ?? params.followupRun.run.groupId,
		groupChannel: entry.groupChannel ?? params.followupRun.run.groupChannel,
		groupSpace: entry.space ?? params.followupRun.run.groupSpace,
		sessionFile: sessionFile ?? params.followupRun.run.sessionFile,
		workspaceDir: params.followupRun.run.workspaceDir,
		agentDir: params.followupRun.run.agentDir,
		config: params.cfg,
		skillsSnapshot: entry.skillsSnapshot ?? params.followupRun.run.skillsSnapshot,
		provider: params.followupRun.run.provider,
		model: params.followupRun.run.model,
		thinkLevel: params.followupRun.run.thinkLevel,
		bashElevated: params.followupRun.run.bashElevated,
		trigger: "budget",
		currentTokenCount: tokenCountForCompaction,
		senderIsOwner: params.followupRun.run.senderIsOwner,
		ownerNumbers: params.followupRun.run.ownerNumbers
	});
	if (!result?.ok || !result.compacted) {
		logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} reason=${result?.reason ?? "not_compacted"}`);
		return entry ?? params.sessionEntry;
	}
	await incrementCompactionCount({
		sessionEntry: entry,
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		tokensAfter: result.result?.tokensAfter
	});
	await appendPostCompactionRefreshPrompt({
		cfg: params.cfg,
		followupRun: params.followupRun
	});
	entry = params.sessionStore?.[params.sessionKey] ?? entry;
	return entry ?? params.sessionEntry;
}
async function runMemoryFlushIfNeeded(params) {
	const memoryFlushPlan = resolveMemoryFlushPlan({ cfg: params.cfg });
	if (!memoryFlushPlan) return params.sessionEntry;
	const memoryFlushWritable = (() => {
		if (!params.sessionKey) return true;
		const runtime = resolveSandboxRuntimeStatus({
			cfg: params.cfg,
			sessionKey: params.sessionKey
		});
		if (!runtime.sandboxed) return true;
		return resolveSandboxConfigForAgent(params.cfg, runtime.agentId).workspaceAccess === "rw";
	})();
	const isCli = isCliProvider(params.followupRun.run.provider, params.cfg);
	const canAttemptFlush = memoryFlushWritable && !params.isHeartbeat && !isCli;
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	const contextWindowTokens = resolveMemoryFlushContextWindowTokens({
		modelId: params.followupRun.run.model ?? params.defaultModel,
		agentCfgContextTokens: params.agentCfgContextTokens
	});
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const persistedPromptTokensRaw = entry?.totalTokens;
	const persistedPromptTokens = typeof persistedPromptTokensRaw === "number" && Number.isFinite(persistedPromptTokensRaw) && persistedPromptTokensRaw > 0 ? persistedPromptTokensRaw : void 0;
	const hasFreshPersistedPromptTokens = typeof persistedPromptTokens === "number" && entry?.totalTokensFresh === true;
	const flushThreshold = contextWindowTokens - memoryFlushPlan.reserveTokensFloor - memoryFlushPlan.softThresholdTokens;
	const shouldReadTranscriptForOutput = canAttemptFlush && entry && hasFreshPersistedPromptTokens && typeof promptTokenEstimate === "number" && Number.isFinite(promptTokenEstimate) && flushThreshold > 0 && (persistedPromptTokens ?? 0) + promptTokenEstimate >= flushThreshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const shouldReadTranscript = Boolean(canAttemptFlush && entry && (!hasFreshPersistedPromptTokens || shouldReadTranscriptForOutput));
	const forceFlushTranscriptBytes = memoryFlushPlan.forceFlushTranscriptBytes;
	const shouldCheckTranscriptSizeForForcedFlush = Boolean(canAttemptFlush && entry && Number.isFinite(forceFlushTranscriptBytes) && forceFlushTranscriptBytes > 0);
	const sessionLogSnapshot = shouldReadTranscript || shouldCheckTranscriptSizeForForcedFlush ? await readSessionLogSnapshot({
		sessionId: params.followupRun.run.sessionId,
		sessionEntry: entry,
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		opts: { storePath: params.storePath },
		includeByteSize: shouldCheckTranscriptSizeForForcedFlush,
		includeUsage: shouldReadTranscript
	}) : void 0;
	const transcriptByteSize = sessionLogSnapshot?.byteSize;
	const shouldForceFlushByTranscriptSize = typeof transcriptByteSize === "number" && transcriptByteSize >= forceFlushTranscriptBytes;
	const transcriptUsageSnapshot = sessionLogSnapshot?.usage;
	const transcriptPromptTokens = transcriptUsageSnapshot?.promptTokens;
	const transcriptOutputTokens = transcriptUsageSnapshot?.outputTokens;
	const hasReliableTranscriptPromptTokens = typeof transcriptPromptTokens === "number" && Number.isFinite(transcriptPromptTokens) && transcriptPromptTokens > 0;
	if (entry && hasReliableTranscriptPromptTokens && (!hasFreshPersistedPromptTokens || (transcriptPromptTokens ?? 0) > (persistedPromptTokens ?? 0))) {
		const nextEntry = {
			...entry,
			totalTokens: transcriptPromptTokens,
			totalTokensFresh: true
		};
		entry = nextEntry;
		if (params.sessionKey && params.sessionStore) params.sessionStore[params.sessionKey] = nextEntry;
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await updateSessionStoreEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				update: async () => ({
					totalTokens: transcriptPromptTokens,
					totalTokensFresh: true
				})
			});
			if (updatedEntry) {
				entry = updatedEntry;
				if (params.sessionStore) params.sessionStore[params.sessionKey] = updatedEntry;
			}
		} catch (err) {
			logVerbose(`failed to persist derived prompt totalTokens: ${String(err)}`);
		}
	}
	const promptTokensSnapshot = Math.max(hasFreshPersistedPromptTokens ? persistedPromptTokens ?? 0 : 0, hasReliableTranscriptPromptTokens ? transcriptPromptTokens ?? 0 : 0);
	const projectedTokenCount = promptTokensSnapshot > 0 && (hasFreshPersistedPromptTokens || hasReliableTranscriptPromptTokens) ? resolveEffectivePromptTokens(promptTokensSnapshot, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const tokenCountForFlush = typeof projectedTokenCount === "number" && Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	logVerbose(`memoryFlush check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${flushThreshold} isHeartbeat=${params.isHeartbeat} isCli=${isCli} memoryFlushWritable=${memoryFlushWritable} compactionCount=${entry?.compactionCount ?? 0} memoryFlushCompactionCount=${entry?.memoryFlushCompactionCount ?? "undefined"} persistedPromptTokens=${persistedPromptTokens ?? "undefined"} persistedFresh=${entry?.totalTokensFresh === true} promptTokensEst=${promptTokenEstimate ?? "undefined"} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptOutputTokens=${transcriptOutputTokens ?? "undefined"} projectedTokenCount=${projectedTokenCount ?? "undefined"} transcriptBytes=${transcriptByteSize ?? "undefined"} forceFlushTranscriptBytes=${forceFlushTranscriptBytes} forceFlushByTranscriptSize=${shouldForceFlushByTranscriptSize}`);
	if (!(memoryFlushWritable && !params.isHeartbeat && !isCli && shouldRunMemoryFlush({
		entry,
		tokenCount: tokenCountForFlush,
		contextWindowTokens,
		reserveTokensFloor: memoryFlushPlan.reserveTokensFloor,
		softThresholdTokens: memoryFlushPlan.softThresholdTokens
	}) || shouldForceFlushByTranscriptSize && entry != null && !hasAlreadyFlushedForCurrentCompaction(entry))) return entry ?? params.sessionEntry;
	logVerbose(`memoryFlush triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} threshold=${flushThreshold}`);
	let activeSessionEntry = entry ?? params.sessionEntry;
	const activeSessionStore = params.sessionStore;
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(activeSessionEntry?.systemPromptReport ?? (params.sessionKey ? activeSessionStore?.[params.sessionKey]?.systemPromptReport : void 0));
	const flushRunId = crypto.randomUUID();
	if (params.sessionKey) registerAgentRunContext(flushRunId, {
		sessionKey: params.sessionKey,
		verboseLevel: params.resolvedVerboseLevel
	});
	let memoryCompactionCompleted = false;
	const memoryFlushNowMs = Date.now();
	const activeMemoryFlushPlan = resolveMemoryFlushPlan({
		cfg: params.cfg,
		nowMs: memoryFlushNowMs
	}) ?? memoryFlushPlan;
	const memoryFlushWritePath = activeMemoryFlushPlan.relativePath;
	const flushSystemPrompt = [params.followupRun.run.extraSystemPrompt, activeMemoryFlushPlan.systemPrompt].filter(Boolean).join("\n\n");
	let postCompactionSessionId;
	try {
		await runWithModelFallback({
			...resolveModelFallbackOptions(params.followupRun.run),
			runId: flushRunId,
			run: async (provider, model, runOptions) => {
				const { embeddedContext, senderContext, runBaseParams } = buildEmbeddedRunExecutionParams({
					run: params.followupRun.run,
					sessionCtx: params.sessionCtx,
					hasRepliedRef: params.opts?.hasRepliedRef,
					provider,
					model,
					runId: flushRunId,
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe
				});
				const result = await runEmbeddedPiAgent({
					...embeddedContext,
					...senderContext,
					...runBaseParams,
					allowGatewaySubagentBinding: true,
					trigger: "memory",
					memoryFlushWritePath,
					prompt: activeMemoryFlushPlan.prompt,
					extraSystemPrompt: flushSystemPrompt,
					bootstrapPromptWarningSignaturesSeen,
					bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
					onAgentEvent: (evt) => {
						if (evt.stream === "compaction") {
							if ((typeof evt.data.phase === "string" ? evt.data.phase : "") === "end") memoryCompactionCompleted = true;
						}
					}
				});
				if (result.meta?.agentMeta?.sessionId) postCompactionSessionId = result.meta.agentMeta.sessionId;
				bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
				return result;
			}
		});
		let memoryFlushCompactionCount = activeSessionEntry?.compactionCount ?? (params.sessionKey ? activeSessionStore?.[params.sessionKey]?.compactionCount : 0) ?? 0;
		if (memoryCompactionCompleted) {
			const previousSessionId = activeSessionEntry?.sessionId ?? params.followupRun.run.sessionId;
			const nextCount = await incrementCompactionCount({
				sessionEntry: activeSessionEntry,
				sessionStore: activeSessionStore,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				newSessionId: postCompactionSessionId
			});
			const updatedEntry = params.sessionKey ? activeSessionStore?.[params.sessionKey] : void 0;
			if (updatedEntry) {
				activeSessionEntry = updatedEntry;
				params.followupRun.run.sessionId = updatedEntry.sessionId;
				if (updatedEntry.sessionFile) params.followupRun.run.sessionFile = updatedEntry.sessionFile;
				const queueKey = params.followupRun.run.sessionKey ?? params.sessionKey;
				if (queueKey) refreshQueuedFollowupSession({
					key: queueKey,
					previousSessionId,
					nextSessionId: updatedEntry.sessionId,
					nextSessionFile: updatedEntry.sessionFile
				});
			}
			if (typeof nextCount === "number") memoryFlushCompactionCount = nextCount;
		}
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await updateSessionStoreEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				update: async () => ({
					memoryFlushAt: Date.now(),
					memoryFlushCompactionCount
				})
			});
			if (updatedEntry) {
				activeSessionEntry = updatedEntry;
				params.followupRun.run.sessionId = updatedEntry.sessionId;
				if (updatedEntry.sessionFile) params.followupRun.run.sessionFile = updatedEntry.sessionFile;
			}
		} catch (err) {
			logVerbose(`failed to persist memory flush metadata: ${String(err)}`);
		}
	} catch (err) {
		logVerbose(`memory flush run failed: ${String(err)}`);
	}
	return activeSessionEntry;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-payloads.ts
let replyPayloadsDedupeRuntimePromise = null;
function loadReplyPayloadsDedupeRuntime() {
	replyPayloadsDedupeRuntimePromise ??= import("./reply-payloads-dedupe.runtime-GCl5A1TU.js");
	return replyPayloadsDedupeRuntimePromise;
}
async function normalizeReplyPayloadMedia(params) {
	if (!params.normalizeMediaPaths || !resolveSendableOutboundReplyParts(params.payload).hasMedia) return params.payload;
	try {
		return await params.normalizeMediaPaths(params.payload);
	} catch (err) {
		logVerbose(`reply payload media normalization failed: ${String(err)}`);
		return {
			...params.payload,
			mediaUrl: void 0,
			mediaUrls: void 0,
			audioAsVoice: false
		};
	}
}
async function normalizeSentMediaUrlsForDedupe(params) {
	if (params.sentMediaUrls.length === 0 || !params.normalizeMediaPaths) return params.sentMediaUrls;
	const normalizedUrls = [];
	const seen = /* @__PURE__ */ new Set();
	for (const raw of params.sentMediaUrls) {
		const trimmed = raw.trim();
		if (!trimmed) continue;
		if (!seen.has(trimmed)) {
			seen.add(trimmed);
			normalizedUrls.push(trimmed);
		}
		try {
			const normalizedMediaUrls = resolveSendableOutboundReplyParts(await params.normalizeMediaPaths({
				mediaUrl: trimmed,
				mediaUrls: [trimmed]
			})).mediaUrls;
			for (const mediaUrl of normalizedMediaUrls) {
				const candidate = mediaUrl.trim();
				if (!candidate || seen.has(candidate)) continue;
				seen.add(candidate);
				normalizedUrls.push(candidate);
			}
		} catch (err) {
			logVerbose(`messaging tool sent-media normalization failed: ${String(err)}`);
		}
	}
	return normalizedUrls;
}
async function buildReplyPayloads(params) {
	let didLogHeartbeatStrip = params.didLogHeartbeatStrip;
	const sanitizedPayloads = params.isHeartbeat ? params.payloads : params.payloads.flatMap((payload) => {
		let text = payload.text;
		if (payload.isError && text && isBunFetchSocketError(text)) text = formatBunFetchSocketError(text);
		if (!text || !text.includes("HEARTBEAT_OK")) return [{
			...payload,
			text
		}];
		const stripped = stripHeartbeatToken(text, { mode: "message" });
		if (stripped.didStrip && !didLogHeartbeatStrip) {
			didLogHeartbeatStrip = true;
			logVerbose("Stripped stray HEARTBEAT_OK token from reply");
		}
		const hasMedia = resolveSendableOutboundReplyParts(payload).hasMedia;
		if (stripped.shouldSkip && !hasMedia) return [];
		return [{
			...payload,
			text: stripped.text
		}];
	});
	const replyTaggedPayloads = (await Promise.all(applyReplyThreading({
		payloads: sanitizedPayloads,
		replyToMode: params.replyToMode,
		replyToChannel: params.replyToChannel,
		currentMessageId: params.currentMessageId
	}).map(async (payload) => {
		const parsed = normalizeReplyPayloadDirectives({
			payload,
			currentMessageId: params.currentMessageId,
			silentToken: SILENT_REPLY_TOKEN,
			parseMode: "always"
		}).payload;
		return await normalizeReplyPayloadMedia({
			payload: parsed,
			normalizeMediaPaths: params.normalizeMediaPaths
		});
	}))).filter(isRenderablePayload);
	const shouldDropFinalPayloads = params.blockStreamingEnabled && Boolean(params.blockReplyPipeline?.didStream()) && !params.blockReplyPipeline?.isAborted();
	const messagingToolSentTexts = params.messagingToolSentTexts ?? [];
	const messagingToolSentTargets = params.messagingToolSentTargets ?? [];
	const dedupeRuntime = messagingToolSentTexts.length > 0 || (params.messagingToolSentMediaUrls?.length ?? 0) > 0 || messagingToolSentTargets.length > 0 ? await loadReplyPayloadsDedupeRuntime() : null;
	const suppressMessagingToolReplies = dedupeRuntime?.shouldSuppressMessagingToolReplies({
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: params.originatingChannel,
			provider: params.messageProvider
		}),
		messagingToolSentTargets,
		originatingTo: resolveOriginMessageTo({ originatingTo: params.originatingTo }),
		accountId: resolveOriginAccountId({ originatingAccountId: params.accountId })
	}) ?? false;
	const dedupeMessagingToolPayloads = suppressMessagingToolReplies || messagingToolSentTargets.length === 0;
	const messagingToolSentMediaUrls = dedupeMessagingToolPayloads ? await normalizeSentMediaUrlsForDedupe({
		sentMediaUrls: params.messagingToolSentMediaUrls ?? [],
		normalizeMediaPaths: params.normalizeMediaPaths
	}) : params.messagingToolSentMediaUrls ?? [];
	const dedupedPayloads = dedupeMessagingToolPayloads ? (dedupeRuntime ?? await loadReplyPayloadsDedupeRuntime()).filterMessagingToolDuplicates({
		payloads: replyTaggedPayloads,
		sentTexts: messagingToolSentTexts
	}) : replyTaggedPayloads;
	const mediaFilteredPayloads = dedupeMessagingToolPayloads ? (dedupeRuntime ?? await loadReplyPayloadsDedupeRuntime()).filterMessagingToolMediaDuplicates({
		payloads: dedupedPayloads,
		sentMediaUrls: messagingToolSentMediaUrls
	}) : dedupedPayloads;
	const filteredPayloads = shouldDropFinalPayloads ? [] : params.blockStreamingEnabled ? mediaFilteredPayloads.filter((payload) => !params.blockReplyPipeline?.hasSentPayload(payload)) : params.directlySentBlockKeys?.size ? mediaFilteredPayloads.filter((payload) => !params.directlySentBlockKeys.has(createBlockReplyContentKey(payload))) : mediaFilteredPayloads;
	return {
		replyPayloads: suppressMessagingToolReplies ? [] : filteredPayloads,
		didLogHeartbeatStrip
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-reminder-guard.ts
const UNSCHEDULED_REMINDER_NOTE = "Note: I did not schedule a reminder in this turn, so this will not trigger automatically.";
const REMINDER_COMMITMENT_PATTERNS = [/\b(?:i\s*['’]?ll|i will)\s+(?:make sure to\s+)?(?:remember|remind|ping|follow up|follow-up|check back|circle back)\b/i, /\b(?:i\s*['’]?ll|i will)\s+(?:set|create|schedule)\s+(?:a\s+)?reminder\b/i];
function hasUnbackedReminderCommitment(text) {
	const normalized = text.toLowerCase();
	if (!normalized.trim()) return false;
	if (normalized.includes("Note: I did not schedule a reminder in this turn, so this will not trigger automatically.".toLowerCase())) return false;
	return REMINDER_COMMITMENT_PATTERNS.some((pattern) => pattern.test(text));
}
/**
* Returns true when the cron store has at least one enabled job that shares the
* current session key. Used to suppress the "no reminder scheduled" guard note
* when an existing cron (created in a prior turn) already covers the commitment.
*/
async function hasSessionRelatedCronJobs(params) {
	try {
		const store = await loadCronStore(resolveCronStorePath(params.cronStorePath));
		if (store.jobs.length === 0) return false;
		if (params.sessionKey) return store.jobs.some((job) => job.enabled && job.sessionKey === params.sessionKey);
		return false;
	} catch {
		return false;
	}
}
function appendUnscheduledReminderNote(payloads) {
	let appended = false;
	return payloads.map((payload) => {
		if (appended || payload.isError || typeof payload.text !== "string") return payload;
		if (!hasUnbackedReminderCommitment(payload.text)) return payload;
		appended = true;
		const trimmed = payload.text.trimEnd();
		return {
			...payload,
			text: `${trimmed}\n\n${UNSCHEDULED_REMINDER_NOTE}`
		};
	});
}
//#endregion
//#region src/auto-reply/reply/agent-runner-usage-line.ts
const formatResponseUsageLine = (params) => {
	const usage = params.usage;
	if (!usage) return null;
	const input = usage.input;
	const output = usage.output;
	if (typeof input !== "number" && typeof output !== "number") return null;
	const inputLabel = typeof input === "number" ? formatTokenCount(input) : "?";
	const outputLabel = typeof output === "number" ? formatTokenCount(output) : "?";
	const cost = params.showCost && typeof input === "number" && typeof output === "number" ? estimateUsageCost({
		usage: {
			input,
			output,
			cacheRead: usage.cacheRead,
			cacheWrite: usage.cacheWrite
		},
		cost: params.costConfig
	}) : void 0;
	const costLabel = params.showCost ? formatUsd(cost) : void 0;
	return `Usage: ${inputLabel} in / ${outputLabel} out${costLabel ? ` · est ${costLabel}` : ""}`;
};
const appendUsageLine = (payloads, line) => {
	let index = -1;
	for (let i = payloads.length - 1; i >= 0; i -= 1) if (payloads[i]?.text) {
		index = i;
		break;
	}
	if (index === -1) return [...payloads, { text: line }];
	const existing = payloads[index];
	const existingText = existing.text ?? "";
	const separator = existingText.endsWith("\n") ? "" : "\n";
	const next = {
		...existing,
		text: `${existingText}${separator}${line}`
	};
	const updated = payloads.slice();
	updated[index] = next;
	return updated;
};
//#endregion
//#region src/auto-reply/reply/session-usage.ts
function applyCliSessionIdToSessionPatch(params, entry, patch) {
	const cliProvider = params.providerUsed ?? entry.modelProvider;
	if (params.cliSessionBinding && cliProvider) {
		const nextEntry = {
			...entry,
			...patch
		};
		setCliSessionBinding(nextEntry, cliProvider, params.cliSessionBinding);
		return {
			...patch,
			cliSessionIds: nextEntry.cliSessionIds,
			cliSessionBindings: nextEntry.cliSessionBindings,
			claudeCliSessionId: nextEntry.claudeCliSessionId
		};
	}
	if (params.cliSessionId && cliProvider) {
		const nextEntry = {
			...entry,
			...patch
		};
		setCliSessionId(nextEntry, cliProvider, params.cliSessionId);
		return {
			...patch,
			cliSessionIds: nextEntry.cliSessionIds,
			cliSessionBindings: nextEntry.cliSessionBindings,
			claudeCliSessionId: nextEntry.claudeCliSessionId
		};
	}
	return patch;
}
function resolveNonNegativeNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function estimateSessionRunCostUsd(params) {
	if (!hasNonzeroUsage(params.usage)) return;
	const cost = resolveModelCostConfig({
		provider: params.providerUsed,
		model: params.modelUsed,
		config: params.cfg
	});
	return resolveNonNegativeNumber(estimateUsageCost({
		usage: params.usage,
		cost
	}));
}
async function persistSessionUsageUpdate(params) {
	const { storePath, sessionKey } = params;
	if (!storePath || !sessionKey) return;
	const label = params.logLabel ? `${params.logLabel} ` : "";
	const cfg = params.cfg ?? loadConfig();
	const hasUsage = hasNonzeroUsage(params.usage);
	const hasPromptTokens = typeof params.promptTokens === "number" && Number.isFinite(params.promptTokens) && params.promptTokens > 0;
	const hasFreshContextSnapshot = Boolean(params.lastCallUsage) || hasPromptTokens || params.usageIsContextSnapshot === true;
	if (hasUsage || hasFreshContextSnapshot) {
		try {
			await updateSessionStoreEntry({
				storePath,
				sessionKey,
				update: async (entry) => {
					const resolvedContextTokens = params.contextTokensUsed ?? entry.contextTokens;
					const usageForContext = params.lastCallUsage ?? (params.usageIsContextSnapshot === true ? params.usage : void 0);
					const totalTokens = hasFreshContextSnapshot ? deriveSessionTotalTokens({
						usage: usageForContext,
						contextTokens: resolvedContextTokens,
						promptTokens: params.promptTokens
					}) : void 0;
					const runEstimatedCostUsd = estimateSessionRunCostUsd({
						cfg,
						usage: params.usage,
						providerUsed: params.providerUsed ?? entry.modelProvider,
						modelUsed: params.modelUsed ?? entry.model
					});
					const existingEstimatedCostUsd = resolveNonNegativeNumber(entry.estimatedCostUsd) ?? 0;
					const patch = {
						modelProvider: params.providerUsed ?? entry.modelProvider,
						model: params.modelUsed ?? entry.model,
						contextTokens: resolvedContextTokens,
						systemPromptReport: params.systemPromptReport ?? entry.systemPromptReport,
						updatedAt: Date.now()
					};
					if (hasUsage) {
						patch.inputTokens = params.usage?.input ?? 0;
						patch.outputTokens = params.usage?.output ?? 0;
						const cacheUsage = params.lastCallUsage ?? params.usage;
						patch.cacheRead = cacheUsage?.cacheRead ?? 0;
						patch.cacheWrite = cacheUsage?.cacheWrite ?? 0;
					}
					if (runEstimatedCostUsd !== void 0) patch.estimatedCostUsd = existingEstimatedCostUsd + runEstimatedCostUsd;
					else if (entry.estimatedCostUsd !== void 0) patch.estimatedCostUsd = entry.estimatedCostUsd;
					patch.totalTokens = totalTokens;
					patch.totalTokensFresh = typeof totalTokens === "number";
					return applyCliSessionIdToSessionPatch(params, entry, patch);
				}
			});
		} catch (err) {
			logVerbose(`failed to persist ${label}usage update: ${String(err)}`);
		}
		return;
	}
	if (params.modelUsed || params.contextTokensUsed) try {
		await updateSessionStoreEntry({
			storePath,
			sessionKey,
			update: async (entry) => {
				return applyCliSessionIdToSessionPatch(params, entry, {
					modelProvider: params.providerUsed ?? entry.modelProvider,
					model: params.modelUsed ?? entry.model,
					contextTokens: params.contextTokensUsed ?? entry.contextTokens,
					systemPromptReport: params.systemPromptReport ?? entry.systemPromptReport,
					updatedAt: Date.now()
				});
			}
		});
	} catch (err) {
		logVerbose(`failed to persist ${label}model/context update: ${String(err)}`);
	}
}
//#endregion
//#region src/auto-reply/reply/session-run-accounting.ts
async function persistRunSessionUsage(params) {
	await persistSessionUsageUpdate(params);
}
async function incrementRunCompactionCount(params) {
	const tokensAfterCompaction = params.lastCallUsage ? deriveSessionTotalTokens({
		usage: params.lastCallUsage,
		contextTokens: params.contextTokensUsed
	}) : void 0;
	return incrementCompactionCount({
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		amount: params.amount,
		tokensAfter: tokensAfterCompaction,
		newSessionId: params.newSessionId
	});
}
//#endregion
//#region src/auto-reply/reply/followup-runner.ts
function createFollowupRunner(params) {
	const { opts, typing, typingMode, sessionEntry, sessionStore, sessionKey, storePath, defaultModel, agentCfgContextTokens } = params;
	const typingSignals = createTypingSignaler({
		typing,
		mode: typingMode,
		isHeartbeat: opts?.isHeartbeat === true
	});
	/**
	* Sends followup payloads, routing to the originating channel if set.
	*
	* When originatingChannel/originatingTo are set on the queued run,
	* replies are routed directly to that provider instead of using the
	* session's current dispatcher. This ensures replies go back to
	* where the message originated.
	*/
	const sendFollowupPayloads = async (payloads, queued) => {
		const { originatingChannel, originatingTo } = queued;
		const shouldRouteToOriginating = isRoutableChannel(originatingChannel) && originatingTo;
		if (!shouldRouteToOriginating && !opts?.onBlockReply) {
			logVerbose("followup queue: no onBlockReply handler; dropping payloads");
			return;
		}
		for (const payload of payloads) {
			if (!payload || !hasOutboundReplyContent(payload)) continue;
			if (isSilentReplyText(payload.text, "NO_REPLY") && !resolveSendableOutboundReplyParts(payload).hasMedia) continue;
			await typingSignals.signalTextDelta(payload.text);
			if (shouldRouteToOriginating) {
				const result = await routeReply({
					payload,
					channel: originatingChannel,
					to: originatingTo,
					sessionKey: queued.run.sessionKey,
					accountId: queued.originatingAccountId,
					threadId: queued.originatingThreadId,
					cfg: queued.run.config
				});
				if (!result.ok) {
					logVerbose(`followup queue: route-reply failed: ${result.error ?? "unknown error"}`);
					const provider = resolveOriginMessageProvider({ provider: queued.run.messageProvider });
					const origin = resolveOriginMessageProvider({ originatingChannel });
					if (opts?.onBlockReply && origin && origin === provider) await opts.onBlockReply(payload);
				}
			} else if (opts?.onBlockReply) await opts.onBlockReply(payload);
		}
	};
	return async (queued) => {
		try {
			const runId = crypto.randomUUID();
			const shouldSurfaceToControlUi = isInternalMessageChannel(resolveOriginMessageProvider({
				originatingChannel: queued.originatingChannel,
				provider: queued.run.messageProvider
			}));
			if (queued.run.sessionKey) registerAgentRunContext(runId, {
				sessionKey: queued.run.sessionKey,
				verboseLevel: queued.run.verboseLevel,
				isControlUiVisible: shouldSurfaceToControlUi
			});
			let autoCompactionCount = 0;
			let runResult;
			let fallbackProvider = queued.run.provider;
			let fallbackModel = queued.run.model;
			let activeSessionEntry = (sessionKey ? sessionStore?.[sessionKey] : void 0) ?? sessionEntry;
			activeSessionEntry = await runPreflightCompactionIfNeeded({
				cfg: queued.run.config,
				followupRun: queued,
				promptForEstimate: queued.prompt,
				defaultModel,
				agentCfgContextTokens,
				sessionEntry: activeSessionEntry,
				sessionStore,
				sessionKey,
				storePath,
				isHeartbeat: opts?.isHeartbeat === true
			});
			let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(activeSessionEntry?.systemPromptReport);
			try {
				const fallbackResult = await runWithModelFallback({
					cfg: queued.run.config,
					provider: queued.run.provider,
					model: queued.run.model,
					runId,
					agentDir: queued.run.agentDir,
					fallbacksOverride: resolveRunModelFallbacksOverride({
						cfg: queued.run.config,
						agentId: queued.run.agentId,
						sessionKey: queued.run.sessionKey
					}),
					run: async (provider, model, runOptions) => {
						const authProfile = resolveRunAuthProfile(queued.run, provider);
						let attemptCompactionCount = 0;
						try {
							const result = await runEmbeddedPiAgent({
								allowGatewaySubagentBinding: true,
								sessionId: queued.run.sessionId,
								sessionKey: queued.run.sessionKey,
								agentId: queued.run.agentId,
								trigger: "user",
								messageChannel: queued.originatingChannel ?? void 0,
								messageProvider: queued.run.messageProvider,
								agentAccountId: queued.run.agentAccountId,
								messageTo: queued.originatingTo,
								messageThreadId: queued.originatingThreadId,
								currentChannelId: queued.originatingTo,
								currentThreadTs: queued.originatingThreadId != null ? String(queued.originatingThreadId) : void 0,
								groupId: queued.run.groupId,
								groupChannel: queued.run.groupChannel,
								groupSpace: queued.run.groupSpace,
								senderId: queued.run.senderId,
								senderName: queued.run.senderName,
								senderUsername: queued.run.senderUsername,
								senderE164: queued.run.senderE164,
								senderIsOwner: queued.run.senderIsOwner,
								sessionFile: queued.run.sessionFile,
								agentDir: queued.run.agentDir,
								workspaceDir: queued.run.workspaceDir,
								config: queued.run.config,
								skillsSnapshot: queued.run.skillsSnapshot,
								prompt: queued.prompt,
								extraSystemPrompt: queued.run.extraSystemPrompt,
								ownerNumbers: queued.run.ownerNumbers,
								enforceFinalTag: queued.run.enforceFinalTag,
								provider,
								model,
								...authProfile,
								thinkLevel: queued.run.thinkLevel,
								verboseLevel: queued.run.verboseLevel,
								reasoningLevel: queued.run.reasoningLevel,
								suppressToolErrorWarnings: opts?.suppressToolErrorWarnings,
								execOverrides: queued.run.execOverrides,
								bashElevated: queued.run.bashElevated,
								timeoutMs: queued.run.timeoutMs,
								runId,
								allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
								blockReplyBreak: queued.run.blockReplyBreak,
								bootstrapPromptWarningSignaturesSeen,
								bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
								onAgentEvent: (evt) => {
									if (evt.stream !== "compaction") return;
									const phase = typeof evt.data.phase === "string" ? evt.data.phase : "";
									const completed = evt.data?.completed === true;
									if (phase === "end" && completed) attemptCompactionCount += 1;
								}
							});
							bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
							const resultCompactionCount = Math.max(0, result.meta?.agentMeta?.compactionCount ?? 0);
							attemptCompactionCount = Math.max(attemptCompactionCount, resultCompactionCount);
							return result;
						} finally {
							autoCompactionCount += attemptCompactionCount;
						}
					}
				});
				runResult = fallbackResult.result;
				fallbackProvider = fallbackResult.provider;
				fallbackModel = fallbackResult.model;
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				defaultRuntime.error?.(`Followup agent failed before reply: ${message}`);
				return;
			}
			const usage = runResult.meta?.agentMeta?.usage;
			const promptTokens = runResult.meta?.agentMeta?.promptTokens;
			const modelUsed = runResult.meta?.agentMeta?.model ?? fallbackModel ?? defaultModel;
			const contextTokensUsed = agentCfgContextTokens ?? lookupContextTokens(modelUsed) ?? sessionEntry?.contextTokens ?? 2e5;
			if (storePath && sessionKey) await persistRunSessionUsage({
				storePath,
				sessionKey,
				cfg: queued.run.config,
				usage,
				lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
				promptTokens,
				modelUsed,
				providerUsed: fallbackProvider,
				contextTokensUsed,
				systemPromptReport: runResult.meta?.systemPromptReport,
				cliSessionBinding: runResult.meta?.agentMeta?.cliSessionBinding,
				usageIsContextSnapshot: isCliProvider(fallbackProvider ?? queued.run.provider, queued.run.config),
				logLabel: "followup"
			});
			const payloadArray = runResult.payloads ?? [];
			if (payloadArray.length === 0) return;
			const sanitizedPayloads = payloadArray.flatMap((payload) => {
				const text = payload.text;
				if (!text || !text.includes("HEARTBEAT_OK")) return [payload];
				const stripped = stripHeartbeatToken(text, { mode: "message" });
				const hasMedia = resolveSendableOutboundReplyParts(payload).hasMedia;
				if (stripped.shouldSkip && !hasMedia) return [];
				return [{
					...payload,
					text: stripped.text
				}];
			});
			const replyToChannel = resolveOriginMessageProvider({
				originatingChannel: queued.originatingChannel,
				provider: queued.run.messageProvider
			});
			const mediaFilteredPayloads = filterMessagingToolMediaDuplicates({
				payloads: filterMessagingToolDuplicates({
					payloads: applyReplyThreading({
						payloads: sanitizedPayloads,
						replyToMode: resolveReplyToMode(queued.run.config, replyToChannel, queued.originatingAccountId, queued.originatingChatType),
						replyToChannel
					}),
					sentTexts: runResult.messagingToolSentTexts ?? []
				}),
				sentMediaUrls: runResult.messagingToolSentMediaUrls ?? []
			});
			const finalPayloads = shouldSuppressMessagingToolReplies({
				messageProvider: resolveOriginMessageProvider({
					originatingChannel: queued.originatingChannel,
					provider: queued.run.messageProvider
				}),
				messagingToolSentTargets: runResult.messagingToolSentTargets,
				originatingTo: resolveOriginMessageTo({ originatingTo: queued.originatingTo }),
				accountId: resolveOriginAccountId({
					originatingAccountId: queued.originatingAccountId,
					accountId: queued.run.agentAccountId
				})
			}) ? [] : mediaFilteredPayloads;
			if (finalPayloads.length === 0) return;
			if (autoCompactionCount > 0) {
				const previousSessionId = queued.run.sessionId;
				const count = await incrementRunCompactionCount({
					sessionEntry,
					sessionStore,
					sessionKey,
					storePath,
					amount: autoCompactionCount,
					lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
					contextTokensUsed,
					newSessionId: runResult.meta?.agentMeta?.sessionId
				});
				const refreshedSessionEntry = sessionKey && sessionStore ? sessionStore[sessionKey] : void 0;
				if (refreshedSessionEntry) {
					const queueKey = queued.run.sessionKey ?? sessionKey;
					if (queueKey) refreshQueuedFollowupSession({
						key: queueKey,
						previousSessionId,
						nextSessionId: refreshedSessionEntry.sessionId,
						nextSessionFile: refreshedSessionEntry.sessionFile
					});
				}
				if (queued.run.verboseLevel && queued.run.verboseLevel !== "off") {
					const suffix = typeof count === "number" ? ` (count ${count})` : "";
					finalPayloads.unshift({ text: `🧹 Auto-compaction complete${suffix}.` });
				}
			}
			await sendFollowupPayloads(finalPayloads, queued);
		} finally {
			typing.markRunComplete();
			typing.markDispatchIdle();
		}
	};
}
//#endregion
//#region src/auto-reply/reply/queue-policy.ts
function resolveActiveRunQueueAction(params) {
	if (!params.isActive) return "run-now";
	if (params.isHeartbeat) return "drop";
	if (params.shouldFollowup || params.queueMode === "steer") return "enqueue-followup";
	return "run-now";
}
//#endregion
//#region src/auto-reply/reply/agent-runner.ts
const BLOCK_REPLY_SEND_TIMEOUT_MS = 15e3;
async function runReplyAgent(params) {
	const { commandBody, followupRun, queueKey, resolvedQueue, shouldSteer, shouldFollowup, isActive, isRunActive, isStreaming, opts, typing, sessionEntry, sessionStore, sessionKey, storePath, defaultModel, agentCfgContextTokens, resolvedVerboseLevel, isNewSession, blockStreamingEnabled, blockReplyChunking, resolvedBlockStreamingBreak, sessionCtx, shouldInjectGroupIntro, typingMode } = params;
	let activeSessionEntry = sessionEntry;
	const activeSessionStore = sessionStore;
	let activeIsNewSession = isNewSession;
	const isHeartbeat = opts?.isHeartbeat === true;
	const typingSignals = createTypingSignaler({
		typing,
		mode: typingMode,
		isHeartbeat
	});
	const shouldEmitToolResult = createShouldEmitToolResult({
		sessionKey,
		storePath,
		resolvedVerboseLevel
	});
	const shouldEmitToolOutput = createShouldEmitToolOutput({
		sessionKey,
		storePath,
		resolvedVerboseLevel
	});
	const pendingToolTasks = /* @__PURE__ */ new Set();
	const blockReplyTimeoutMs = opts?.blockReplyTimeoutMs ?? BLOCK_REPLY_SEND_TIMEOUT_MS;
	const replyToChannel = resolveOriginMessageProvider({
		originatingChannel: sessionCtx.OriginatingChannel,
		provider: sessionCtx.Surface ?? sessionCtx.Provider
	});
	const replyToMode = resolveReplyToMode(followupRun.run.config, replyToChannel, sessionCtx.AccountId, sessionCtx.ChatType);
	const applyReplyToMode = createReplyToModeFilterForChannel(replyToMode, replyToChannel);
	const cfg = followupRun.run.config;
	const normalizeReplyMediaPaths = createReplyMediaPathNormalizer({
		cfg,
		sessionKey,
		workspaceDir: followupRun.run.workspaceDir
	});
	const blockReplyCoalescing = blockStreamingEnabled && opts?.onBlockReply ? resolveEffectiveBlockStreamingConfig({
		cfg,
		provider: sessionCtx.Provider,
		accountId: sessionCtx.AccountId,
		chunking: blockReplyChunking
	}).coalescing : void 0;
	const blockReplyPipeline = blockStreamingEnabled && opts?.onBlockReply ? createBlockReplyPipeline({
		onBlockReply: opts.onBlockReply,
		timeoutMs: blockReplyTimeoutMs,
		coalescing: blockReplyCoalescing,
		buffer: createAudioAsVoiceBuffer({ isAudioPayload })
	}) : null;
	const touchActiveSessionEntry = async () => {
		if (!activeSessionEntry || !activeSessionStore || !sessionKey) return;
		const updatedAt = Date.now();
		activeSessionEntry.updatedAt = updatedAt;
		activeSessionStore[sessionKey] = activeSessionEntry;
		if (storePath) await updateSessionStoreEntry({
			storePath,
			sessionKey,
			update: async () => ({ updatedAt })
		});
	};
	if (shouldSteer && isStreaming) {
		if (queueEmbeddedPiMessage(followupRun.run.sessionId, followupRun.prompt) && !shouldFollowup) {
			await touchActiveSessionEntry();
			typing.cleanup();
			return;
		}
	}
	const activeRunQueueAction = resolveActiveRunQueueAction({
		isActive,
		isHeartbeat,
		shouldFollowup,
		queueMode: resolvedQueue.mode
	});
	const queuedRunFollowupTurn = createFollowupRunner({
		opts,
		typing,
		typingMode,
		sessionEntry: activeSessionEntry,
		sessionStore: activeSessionStore,
		sessionKey,
		storePath,
		defaultModel,
		agentCfgContextTokens
	});
	if (activeRunQueueAction === "drop") {
		typing.cleanup();
		return;
	}
	if (activeRunQueueAction === "enqueue-followup") {
		enqueueFollowupRun(queueKey, followupRun, resolvedQueue, "message-id", queuedRunFollowupTurn, false);
		if (!isRunActive?.()) finalizeWithFollowup(void 0, queueKey, queuedRunFollowupTurn);
		await touchActiveSessionEntry();
		typing.cleanup();
		return;
	}
	await typingSignals.signalRunStart();
	activeSessionEntry = await runPreflightCompactionIfNeeded({
		cfg,
		followupRun,
		promptForEstimate: followupRun.prompt,
		defaultModel,
		agentCfgContextTokens,
		sessionEntry: activeSessionEntry,
		sessionStore: activeSessionStore,
		sessionKey,
		storePath,
		isHeartbeat
	});
	activeSessionEntry = await runMemoryFlushIfNeeded({
		cfg,
		followupRun,
		promptForEstimate: followupRun.prompt,
		sessionCtx,
		opts,
		defaultModel,
		agentCfgContextTokens,
		resolvedVerboseLevel,
		sessionEntry: activeSessionEntry,
		sessionStore: activeSessionStore,
		sessionKey,
		storePath,
		isHeartbeat
	});
	const runFollowupTurn = createFollowupRunner({
		opts,
		typing,
		typingMode,
		sessionEntry: activeSessionEntry,
		sessionStore: activeSessionStore,
		sessionKey,
		storePath,
		defaultModel,
		agentCfgContextTokens
	});
	let responseUsageLine;
	const resetSession = async ({ failureLabel, buildLogMessage, cleanupTranscripts }) => {
		if (!sessionKey || !activeSessionStore || !storePath) return false;
		const prevEntry = activeSessionStore[sessionKey] ?? activeSessionEntry;
		if (!prevEntry) return false;
		const prevSessionId = cleanupTranscripts ? prevEntry.sessionId : void 0;
		const nextSessionId = generateSecureUuid();
		const nextEntry = {
			...prevEntry,
			sessionId: nextSessionId,
			updatedAt: Date.now(),
			systemSent: false,
			abortedLastRun: false,
			modelProvider: void 0,
			model: void 0,
			inputTokens: void 0,
			outputTokens: void 0,
			totalTokens: void 0,
			totalTokensFresh: false,
			estimatedCostUsd: void 0,
			cacheRead: void 0,
			cacheWrite: void 0,
			contextTokens: void 0,
			systemPromptReport: void 0,
			fallbackNoticeSelectedModel: void 0,
			fallbackNoticeActiveModel: void 0,
			fallbackNoticeReason: void 0
		};
		const agentId = resolveAgentIdFromSessionKey(sessionKey);
		const nextSessionFile = resolveSessionTranscriptPath(nextSessionId, agentId, sessionCtx.MessageThreadId);
		nextEntry.sessionFile = nextSessionFile;
		activeSessionStore[sessionKey] = nextEntry;
		try {
			await updateSessionStore(storePath, (store) => {
				store[sessionKey] = nextEntry;
			});
		} catch (err) {
			defaultRuntime.error(`Failed to persist session reset after ${failureLabel} (${sessionKey}): ${String(err)}`);
		}
		followupRun.run.sessionId = nextSessionId;
		followupRun.run.sessionFile = nextSessionFile;
		refreshQueuedFollowupSession({
			key: queueKey,
			previousSessionId: prevEntry.sessionId,
			nextSessionId,
			nextSessionFile
		});
		activeSessionEntry = nextEntry;
		activeIsNewSession = true;
		defaultRuntime.error(buildLogMessage(nextSessionId));
		if (cleanupTranscripts && prevSessionId) {
			const transcriptCandidates = /* @__PURE__ */ new Set();
			const resolved = resolveSessionFilePath(prevSessionId, prevEntry, resolveSessionFilePathOptions({
				agentId,
				storePath
			}));
			if (resolved) transcriptCandidates.add(resolved);
			transcriptCandidates.add(resolveSessionTranscriptPath(prevSessionId, agentId));
			for (const candidate of transcriptCandidates) try {
				fsSync.unlinkSync(candidate);
			} catch {}
		}
		return true;
	};
	const resetSessionAfterCompactionFailure = async (reason) => resetSession({
		failureLabel: "compaction failure",
		buildLogMessage: (nextSessionId) => `Auto-compaction failed (${reason}). Restarting session ${sessionKey} -> ${nextSessionId} and retrying.`
	});
	const resetSessionAfterRoleOrderingConflict = async (reason) => resetSession({
		failureLabel: "role ordering conflict",
		buildLogMessage: (nextSessionId) => `Role ordering conflict (${reason}). Restarting session ${sessionKey} -> ${nextSessionId}.`,
		cleanupTranscripts: true
	});
	try {
		const runStartedAt = Date.now();
		const runOutcome = await runAgentTurnWithFallback({
			commandBody,
			followupRun,
			sessionCtx,
			opts,
			typingSignals,
			blockReplyPipeline,
			blockStreamingEnabled,
			blockReplyChunking,
			resolvedBlockStreamingBreak,
			applyReplyToMode,
			shouldEmitToolResult,
			shouldEmitToolOutput,
			pendingToolTasks,
			resetSessionAfterCompactionFailure,
			resetSessionAfterRoleOrderingConflict,
			isHeartbeat,
			sessionKey,
			getActiveSessionEntry: () => activeSessionEntry,
			activeSessionStore,
			storePath,
			resolvedVerboseLevel
		});
		if (runOutcome.kind === "final") return finalizeWithFollowup(runOutcome.payload, queueKey, runFollowupTurn);
		const { runId, runResult, fallbackProvider, fallbackModel, fallbackAttempts, directlySentBlockKeys } = runOutcome;
		let { didLogHeartbeatStrip, autoCompactionCount } = runOutcome;
		if (shouldInjectGroupIntro && activeSessionEntry && activeSessionStore && sessionKey && activeSessionEntry.groupActivationNeedsSystemIntro) {
			const updatedAt = Date.now();
			activeSessionEntry.groupActivationNeedsSystemIntro = false;
			activeSessionEntry.updatedAt = updatedAt;
			activeSessionStore[sessionKey] = activeSessionEntry;
			if (storePath) await updateSessionStoreEntry({
				storePath,
				sessionKey,
				update: async () => ({
					groupActivationNeedsSystemIntro: false,
					updatedAt
				})
			});
		}
		const payloadArray = runResult.payloads ?? [];
		if (blockReplyPipeline) {
			await blockReplyPipeline.flush({ force: true });
			blockReplyPipeline.stop();
		}
		if (pendingToolTasks.size > 0) await Promise.allSettled(pendingToolTasks);
		const usage = runResult.meta?.agentMeta?.usage;
		const promptTokens = runResult.meta?.agentMeta?.promptTokens;
		const modelUsed = runResult.meta?.agentMeta?.model ?? fallbackModel ?? defaultModel;
		const providerUsed = runResult.meta?.agentMeta?.provider ?? fallbackProvider ?? followupRun.run.provider;
		const verboseEnabled = resolvedVerboseLevel !== "off";
		const selectedProvider = followupRun.run.provider;
		const selectedModel = followupRun.run.model;
		const fallbackStateEntry = activeSessionEntry ?? (sessionKey ? activeSessionStore?.[sessionKey] : void 0);
		const fallbackTransition = resolveFallbackTransition({
			selectedProvider,
			selectedModel,
			activeProvider: providerUsed,
			activeModel: modelUsed,
			attempts: fallbackAttempts,
			state: fallbackStateEntry
		});
		if (fallbackTransition.stateChanged) {
			if (fallbackStateEntry) {
				fallbackStateEntry.fallbackNoticeSelectedModel = fallbackTransition.nextState.selectedModel;
				fallbackStateEntry.fallbackNoticeActiveModel = fallbackTransition.nextState.activeModel;
				fallbackStateEntry.fallbackNoticeReason = fallbackTransition.nextState.reason;
				fallbackStateEntry.updatedAt = Date.now();
				activeSessionEntry = fallbackStateEntry;
			}
			if (sessionKey && fallbackStateEntry && activeSessionStore) activeSessionStore[sessionKey] = fallbackStateEntry;
			if (sessionKey && storePath) await updateSessionStoreEntry({
				storePath,
				sessionKey,
				update: async () => ({
					fallbackNoticeSelectedModel: fallbackTransition.nextState.selectedModel,
					fallbackNoticeActiveModel: fallbackTransition.nextState.activeModel,
					fallbackNoticeReason: fallbackTransition.nextState.reason
				})
			});
		}
		const cliSessionId = isCliProvider(providerUsed, cfg) ? runResult.meta?.agentMeta?.sessionId?.trim() : void 0;
		const cliSessionBinding = isCliProvider(providerUsed, cfg) ? runResult.meta?.agentMeta?.cliSessionBinding : void 0;
		const contextTokensUsed = agentCfgContextTokens ?? lookupContextTokens(modelUsed) ?? activeSessionEntry?.contextTokens ?? 2e5;
		await persistRunSessionUsage({
			storePath,
			sessionKey,
			cfg,
			usage,
			lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
			promptTokens,
			modelUsed,
			providerUsed,
			contextTokensUsed,
			systemPromptReport: runResult.meta?.systemPromptReport,
			cliSessionId,
			cliSessionBinding,
			usageIsContextSnapshot: isCliProvider(providerUsed, cfg)
		});
		if (payloadArray.length === 0) return finalizeWithFollowup(void 0, queueKey, runFollowupTurn);
		const payloadResult = await buildReplyPayloads({
			payloads: payloadArray,
			isHeartbeat,
			didLogHeartbeatStrip,
			blockStreamingEnabled,
			blockReplyPipeline,
			directlySentBlockKeys,
			replyToMode,
			replyToChannel,
			currentMessageId: sessionCtx.MessageSidFull ?? sessionCtx.MessageSid,
			messageProvider: followupRun.run.messageProvider,
			messagingToolSentTexts: runResult.messagingToolSentTexts,
			messagingToolSentMediaUrls: runResult.messagingToolSentMediaUrls,
			messagingToolSentTargets: runResult.messagingToolSentTargets,
			originatingChannel: sessionCtx.OriginatingChannel,
			originatingTo: resolveOriginMessageTo({
				originatingTo: sessionCtx.OriginatingTo,
				to: sessionCtx.To
			}),
			accountId: sessionCtx.AccountId,
			normalizeMediaPaths: normalizeReplyMediaPaths
		});
		const { replyPayloads } = payloadResult;
		didLogHeartbeatStrip = payloadResult.didLogHeartbeatStrip;
		if (replyPayloads.length === 0) return finalizeWithFollowup(void 0, queueKey, runFollowupTurn);
		const successfulCronAdds = runResult.successfulCronAdds ?? 0;
		const hasReminderCommitment = replyPayloads.some((payload) => !payload.isError && typeof payload.text === "string" && hasUnbackedReminderCommitment(payload.text));
		const coveredByExistingCron = hasReminderCommitment && successfulCronAdds === 0 ? await hasSessionRelatedCronJobs({
			cronStorePath: cfg.cron?.store,
			sessionKey
		}) : false;
		const guardedReplyPayloads = hasReminderCommitment && successfulCronAdds === 0 && !coveredByExistingCron ? appendUnscheduledReminderNote(replyPayloads) : replyPayloads;
		await signalTypingIfNeeded(guardedReplyPayloads, typingSignals);
		if (isDiagnosticsEnabled(cfg) && hasNonzeroUsage(usage)) {
			const input = usage.input ?? 0;
			const output = usage.output ?? 0;
			const cacheRead = usage.cacheRead ?? 0;
			const cacheWrite = usage.cacheWrite ?? 0;
			const promptTokens = input + cacheRead + cacheWrite;
			const totalTokens = usage.total ?? promptTokens + output;
			const costUsd = estimateUsageCost({
				usage,
				cost: resolveModelCostConfig({
					provider: providerUsed,
					model: modelUsed,
					config: cfg
				})
			});
			emitDiagnosticEvent({
				type: "model.usage",
				sessionKey,
				sessionId: followupRun.run.sessionId,
				channel: replyToChannel,
				provider: providerUsed,
				model: modelUsed,
				usage: {
					input,
					output,
					cacheRead,
					cacheWrite,
					promptTokens,
					total: totalTokens
				},
				lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
				context: {
					limit: contextTokensUsed,
					used: totalTokens
				},
				costUsd,
				durationMs: Date.now() - runStartedAt
			});
		}
		const responseUsageMode = resolveResponseUsageMode(activeSessionEntry?.responseUsage ?? (sessionKey ? activeSessionStore?.[sessionKey]?.responseUsage : void 0));
		if (responseUsageMode !== "off" && hasNonzeroUsage(usage)) {
			const showCost = resolveModelAuthMode(providerUsed, cfg) === "api-key";
			let formatted = formatResponseUsageLine({
				usage,
				showCost,
				costConfig: showCost ? resolveModelCostConfig({
					provider: providerUsed,
					model: modelUsed,
					config: cfg
				}) : void 0
			});
			if (formatted && responseUsageMode === "full" && sessionKey) formatted = `${formatted} · session \`${sessionKey}\``;
			if (formatted) responseUsageLine = formatted;
		}
		let finalPayloads = guardedReplyPayloads;
		const verboseNotices = [];
		if (verboseEnabled && activeIsNewSession) verboseNotices.push({ text: `🧭 New session: ${followupRun.run.sessionId}` });
		if (fallbackTransition.fallbackTransitioned) {
			emitAgentEvent({
				runId,
				sessionKey,
				stream: "lifecycle",
				data: {
					phase: "fallback",
					selectedProvider,
					selectedModel,
					activeProvider: providerUsed,
					activeModel: modelUsed,
					reasonSummary: fallbackTransition.reasonSummary,
					attemptSummaries: fallbackTransition.attemptSummaries,
					attempts: fallbackAttempts
				}
			});
			if (verboseEnabled) {
				const fallbackNotice = buildFallbackNotice({
					selectedProvider,
					selectedModel,
					activeProvider: providerUsed,
					activeModel: modelUsed,
					attempts: fallbackAttempts
				});
				if (fallbackNotice) verboseNotices.push({ text: fallbackNotice });
			}
		}
		if (fallbackTransition.fallbackCleared) {
			emitAgentEvent({
				runId,
				sessionKey,
				stream: "lifecycle",
				data: {
					phase: "fallback_cleared",
					selectedProvider,
					selectedModel,
					activeProvider: providerUsed,
					activeModel: modelUsed,
					previousActiveModel: fallbackTransition.previousState.activeModel
				}
			});
			if (verboseEnabled) verboseNotices.push({ text: buildFallbackClearedNotice({
				selectedProvider,
				selectedModel,
				previousActiveModel: fallbackTransition.previousState.activeModel
			}) });
		}
		if (autoCompactionCount > 0) {
			const previousSessionId = activeSessionEntry?.sessionId ?? followupRun.run.sessionId;
			const count = await incrementRunCompactionCount({
				sessionEntry: activeSessionEntry,
				sessionStore: activeSessionStore,
				sessionKey,
				storePath,
				amount: autoCompactionCount,
				lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
				contextTokensUsed,
				newSessionId: runResult.meta?.agentMeta?.sessionId
			});
			const refreshedSessionEntry = sessionKey && activeSessionStore ? activeSessionStore[sessionKey] : void 0;
			if (refreshedSessionEntry) {
				activeSessionEntry = refreshedSessionEntry;
				refreshQueuedFollowupSession({
					key: queueKey,
					previousSessionId,
					nextSessionId: refreshedSessionEntry.sessionId,
					nextSessionFile: refreshedSessionEntry.sessionFile
				});
			}
			if (sessionKey) readPostCompactionContext(process.cwd(), cfg).then((contextContent) => {
				if (contextContent) enqueueSystemEvent(contextContent, { sessionKey });
			}).catch(() => {});
			if (verboseEnabled) {
				const suffix = typeof count === "number" ? ` (count ${count})` : "";
				verboseNotices.push({ text: `🧹 Auto-compaction complete${suffix}.` });
			}
		}
		if (verboseNotices.length > 0) finalPayloads = [...verboseNotices, ...finalPayloads];
		if (responseUsageLine) finalPayloads = appendUsageLine(finalPayloads, responseUsageLine);
		return finalizeWithFollowup(finalPayloads.length === 1 ? finalPayloads[0] : finalPayloads, queueKey, runFollowupTurn);
	} catch (error) {
		finalizeWithFollowup(void 0, queueKey, runFollowupTurn);
		throw error;
	} finally {
		blockReplyPipeline?.stop();
		typing.markRunComplete();
		typing.markDispatchIdle();
	}
}
//#endregion
export { runReplyAgent };
