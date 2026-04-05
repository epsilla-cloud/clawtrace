import { a as hasErrnoCode, r as formatErrorMessage } from "./errors-BxyFnvP3.js";
import { i as getChildLogger, y as normalizeLogLevel } from "./logger-BCzP_yik.js";
import { m as defaultRuntime, t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { n as resolveGlobalSingleton } from "./global-singleton-BuWJMSMa.js";
import { l as escapeRegExp } from "./utils-BfvDpbwh.js";
import { $F as chunkText, $c as resolveThreadBindingIdleTimeoutMs, $j as resolveInboundDebounceMs, $s as sendPollWhatsApp, AM as recordChannelActivity, Ab as CommandLane, CM as resolveHeartbeatVisibility, Fb as setTelegramThreadBindingIdleTimeoutBySessionKey, Fd as createReplyDispatcherWithTyping, Fj as hasControlCommand, GF as convertMarkdownTables, Gj as resolveEnvelopeFormatOptions, Hc as setThreadBindingIdleTimeoutBySessionKey, Hj as formatAgentEnvelope, Hs as loginWeb, Ib as setTelegramThreadBindingMaxAgeBySessionKey, Ip as listWebSearchProviders, Jc as getThreadBindingManager, Js as readWebSelfId, Lj as isControlCommandMessage, Lp as runWebSearch, Ls as getWebAuthAgeMs, Mw as listRuntimeImageGenerationProviders, Nd as withReplyDispatcher, Nh as onAgentEvent, OM as resolveIndicatorType, PM as buildTemplateMessageFromPayload, Ps as getActiveWebListener, QF as chunkMarkdownTextWithMode, Qj as createInboundDebouncer, Qs as sendMessageWhatsApp, Rj as shouldComputeCommandAuthorized, Rs as handleWhatsAppAction, SI as evaluateSessionFreshness, TC as signalMessageActions, UI as resolveMarkdownTableMode, Uc as setThreadBindingMaxAgeBySessionKey, Uj as formatInboundEnvelope, Us as logoutWeb, Vs as logWebSelfId, Wc as unbindThreadBindingsBySessionKey, Ws as monitorWebChannel, XF as chunkByNewline, YM as probeLineBot, ZF as chunkMarkdownText, _N as updateLastRoute, ac as loadPluginBoundaryModuleWithJiti, aw as resolveHeartbeatSenderContext, bM as resolveDefaultLineAccountId, cC as probeSignal, cF as saveMediaBuffer, ck as areHeartbeatsEnabled, cw as buildOutboundSessionContext, dC as sendMessageSignal, dM as pushMessagesLine, dO as resolveAgentTimeoutMs, eI as chunkTextWithMode, el as resolveThreadBindingInactivityExpiresAt, f as loadConfig, fM as pushTemplateMessage, fN as loadSessionStore, fd as getReplyFromConfig, fg as onSessionTranscriptUpdate, fi as sendMessageIMessage, fk as resolveHeartbeatReasonKind, gN as saveSessionStore, hM as sendMessageLine, ic as webAuthExists, id as dispatchReplyWithBufferedBlockDispatcher, iw as resolveHeartbeatDeliveryTarget, jw as generateImage, kM as getChannelActivity, kd as resolveHeartbeatReplyPayload, ks as createRuntimeWhatsAppLoginTool, lM as pushLocationMessage, lk as requestHeartbeatNow, lw as deliverOutboundPayloads, mN as recordSessionMetaFromInbound, nC as resolveTelegramToken, nI as resolveTextChunkLimit, nl as resolveThreadBindingMaxAgeMs, oc as resolvePluginRuntimeModulePath, ol as discordMessageActions, pM as pushTextMessageWithQuickReplies, pN as readSessionUpdatedAt, pi as probeIMessage, qb as telegramMessageActions, rM as createQuickReplyItems, rc as waitForWebLogin, sM as pushFlexMessage, sc as resolvePluginRuntimeRecord, tI as resolveChunkMode, tN as dispatchReplyFromConfig, tc as startWebLoginWithQr, tf as monitorLineProvider, tl as resolveThreadBindingMaxAgeExpiresAt, uC as monitorSignalProvider, uM as pushMessageLine, ui as monitorIMessageProvider, uk as setHeartbeatWakeHandler, vM as listLineAccountIds, vN as updateSessionStore, wF as isVoiceCompatibleAudio, wI as resolveSessionResetPolicy, wM as emitHeartbeatEvent, wb as getQueueSize, x as writeConfigFile, xL as appendCronStyleCurrentTimeLine, xM as resolveLineAccount, xg as clearBootstrapSnapshotOnSessionRollover, yC as recordInboundSession, yM as normalizeAccountId } from "./auth-profiles-B5ypC5S-.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Dpv7c6Om.js";
import { _ as resolveStateDir } from "./paths-Y4UT24Of.js";
import { T as parseAgentSessionKey, c as normalizeAgentId, h as toAgentStoreSessionKey, u as resolveAgentIdFromSessionKey } from "./session-key-BhxcMJEE.js";
import { a as shouldLogVerbose } from "./globals-0H99T-Tx.js";
import { a as resolveAgentDir, i as resolveAgentConfig, m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { a as logWarn } from "./logger-Bps9nlrB.js";
import { n as runCommandWithTimeout } from "./exec-CLVZ7JOg.js";
import { d as ensureAgentWorkspace, i as DEFAULT_HEARTBEAT_FILENAME } from "./workspace-CFIQ0-q3.js";
import { S as resolveThinkingDefault } from "./model-selection-CMtvxDDg.js";
import { n as VERSION } from "./version-CIMrqUx3.js";
import { a as resolveAgentRoute, n as buildAgentSessionKey } from "./base-session-key-UJINc15Z.js";
import { i as buildPairingReply } from "./channel-pairing-cpi9_8zd.js";
import { n as resolveChannelGroupPolicy, r as resolveChannelGroupRequireMention } from "./channel-policy-CKDH6-ud.js";
import { l as resolveCommandAuthorizedFromAuthorizers } from "./dm-policy-shared-C8YuyjhK.js";
import { t as getChannelPlugin } from "./plugins-BQ9CTy5q.js";
import { a as readChannelAllowFromStore, d as upsertChannelPairingRequest } from "./pairing-store-CzypyvoV.js";
import { a as createLazyRuntimeSurface, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-D7Gi17j0.js";
import { i as resolveUserTimezone } from "./date-time-D9hbzpz-.js";
import { i as resolveHumanDelayConfig, n as resolveAgentIdentity, r as resolveEffectiveMessagesConfig } from "./identity-DAzQ7qLa.js";
import { m as mediaKindFromMime, t as detectMime } from "./mime-BFjhBApy.js";
import { c as resizeToJpeg, i as getImageMetadata } from "./image-ops-CdQKlwD6.js";
import { l as resolveStorePath, r as resolveSessionFilePath } from "./paths-CFxPq48L.js";
import { n as shouldAckReaction, t as removeAckReactionAfterReply } from "./ack-reactions-EQgNefBf.js";
import { t as finalizeInboundContext } from "./inbound-context-CaoGLQ0Y.js";
import { n as resolveAgentMainSessionKey, t as canonicalizeMainSessionAlias } from "./main-session-CAdsCHMn.js";
import { f as isHeartbeatContentEffectivelyEmpty, h as HEARTBEAT_TOKEN, l as resolveSystemEventDeliveryContext, m as stripHeartbeatToken, o as peekSystemEventEntries, p as resolveHeartbeatPrompt$1, r as enqueueSystemEvent } from "./system-events-BdYO0Ful.js";
import { h as fetchRemoteMedia, t as loadWebMedia } from "./web-media-BN6zO1RF.js";
import { p as resolveSendableOutboundReplyParts, s as hasOutboundReplyContent } from "./reply-payload-CJqP_sJ6.js";
import "./logging-S_1ymJjU.js";
import { f as buildMentionRegexes, m as matchesMentionWithExplicit, p as matchesMentionPatterns } from "./reply-history-Zf0VECih.js";
import { y as shouldHandleTextCommands } from "./commands-registry-OqaQyye7.js";
import { n as collectTelegramUnmentionedGroupIds } from "./audit-B8mjM6l3.js";
import "./line-runtime-arx2agkd.js";
import { n as resolveHeartbeatIntervalMs, t as isHeartbeatEnabledForAgent } from "./heartbeat-summary-D8q5XYz6.js";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/plugins/runtime/runtime-cache.ts
function defineCachedValue(target, key, create) {
	let cached;
	let ready = false;
	Object.defineProperty(target, key, {
		configurable: true,
		enumerable: true,
		get() {
			if (!ready) {
				cached = create();
				ready = true;
			}
			return cached;
		}
	});
}
//#endregion
//#region src/plugins/runtime/runtime-agent.ts
const loadEmbeddedPiRuntime = createLazyRuntimeModule(() => import("./runtime-embedded-pi.runtime-CaAT7TlP.js"));
function createRuntimeAgent() {
	const agentRuntime = {
		defaults: {
			model: DEFAULT_MODEL,
			provider: DEFAULT_PROVIDER
		},
		resolveAgentDir,
		resolveAgentWorkspaceDir,
		resolveAgentIdentity,
		resolveThinkingDefault,
		resolveAgentTimeoutMs,
		ensureAgentWorkspace
	};
	defineCachedValue(agentRuntime, "runEmbeddedPiAgent", () => createLazyRuntimeMethod(loadEmbeddedPiRuntime, (runtime) => runtime.runEmbeddedPiAgent));
	defineCachedValue(agentRuntime, "session", () => ({
		resolveStorePath,
		loadSessionStore,
		saveSessionStore,
		resolveSessionFilePath
	}));
	return agentRuntime;
}
//#endregion
//#region src/plugins/runtime/runtime-discord-typing.ts
const DEFAULT_DISCORD_TYPING_INTERVAL_MS = 8e3;
async function createDiscordTypingLease(params) {
	const intervalMs = typeof params.intervalMs === "number" && Number.isFinite(params.intervalMs) ? Math.max(1e3, Math.floor(params.intervalMs)) : DEFAULT_DISCORD_TYPING_INTERVAL_MS;
	let stopped = false;
	let timer = null;
	const pulse = async () => {
		if (stopped) return;
		await params.pulse({
			channelId: params.channelId,
			accountId: params.accountId,
			cfg: params.cfg
		});
	};
	await pulse();
	timer = setInterval(() => {
		pulse().catch((err) => {
			logWarn(`plugins: discord typing pulse failed: ${String(err)}`);
		});
	}, intervalMs);
	timer.unref?.();
	return {
		refresh: async () => {
			await pulse();
		},
		stop: () => {
			stopped = true;
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-discord.ts
const bindDiscordRuntimeMethod = createLazyRuntimeMethodBinder(createLazyRuntimeSurface(() => import("./runtime-discord-ops.runtime-Bnub97HB.js"), ({ runtimeDiscordOps }) => runtimeDiscordOps));
const auditChannelPermissionsLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.auditChannelPermissions);
const listDirectoryGroupsLiveLazy$1 = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.listDirectoryGroupsLive);
const listDirectoryPeersLiveLazy$1 = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.listDirectoryPeersLive);
const probeDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.probeDiscord);
const resolveChannelAllowlistLazy$1 = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.resolveChannelAllowlist);
const resolveUserAllowlistLazy$1 = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.resolveUserAllowlist);
const sendComponentMessageLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.sendComponentMessage);
const sendMessageDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.sendMessageDiscord);
const sendPollDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.sendPollDiscord);
const monitorDiscordProviderLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.monitorDiscordProvider);
const sendTypingDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.typing.pulse);
const editMessageDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.conversationActions.editMessage);
const deleteMessageDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.conversationActions.deleteMessage);
const pinMessageDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.conversationActions.pinMessage);
const unpinMessageDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.conversationActions.unpinMessage);
const createThreadDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.conversationActions.createThread);
const editChannelDiscordLazy = bindDiscordRuntimeMethod((runtimeDiscordOps) => runtimeDiscordOps.conversationActions.editChannel);
function createRuntimeDiscord() {
	return {
		messageActions: discordMessageActions,
		auditChannelPermissions: auditChannelPermissionsLazy,
		listDirectoryGroupsLive: listDirectoryGroupsLiveLazy$1,
		listDirectoryPeersLive: listDirectoryPeersLiveLazy$1,
		probeDiscord: probeDiscordLazy,
		resolveChannelAllowlist: resolveChannelAllowlistLazy$1,
		resolveUserAllowlist: resolveUserAllowlistLazy$1,
		sendComponentMessage: sendComponentMessageLazy,
		sendMessageDiscord: sendMessageDiscordLazy,
		sendPollDiscord: sendPollDiscordLazy,
		monitorDiscordProvider: monitorDiscordProviderLazy,
		threadBindings: {
			getManager: getThreadBindingManager,
			resolveIdleTimeoutMs: resolveThreadBindingIdleTimeoutMs,
			resolveInactivityExpiresAt: resolveThreadBindingInactivityExpiresAt,
			resolveMaxAgeMs: resolveThreadBindingMaxAgeMs,
			resolveMaxAgeExpiresAt: resolveThreadBindingMaxAgeExpiresAt,
			setIdleTimeoutBySessionKey: setThreadBindingIdleTimeoutBySessionKey,
			setMaxAgeBySessionKey: setThreadBindingMaxAgeBySessionKey,
			unbindBySessionKey: unbindThreadBindingsBySessionKey
		},
		typing: {
			pulse: sendTypingDiscordLazy,
			start: async ({ channelId, accountId, cfg, intervalMs }) => await createDiscordTypingLease({
				channelId,
				accountId,
				cfg,
				intervalMs,
				pulse: async ({ channelId, accountId, cfg }) => void await sendTypingDiscordLazy(channelId, {
					accountId,
					cfg
				})
			})
		},
		conversationActions: {
			editMessage: editMessageDiscordLazy,
			deleteMessage: deleteMessageDiscordLazy,
			pinMessage: pinMessageDiscordLazy,
			unpinMessage: unpinMessageDiscordLazy,
			createThread: createThreadDiscordLazy,
			editChannel: editChannelDiscordLazy
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-imessage.ts
function createRuntimeIMessage() {
	return {
		monitorIMessageProvider,
		probeIMessage,
		sendMessageIMessage
	};
}
//#endregion
//#region src/plugins/runtime/runtime-matrix-boundary.ts
const MATRIX_PLUGIN_ID = "matrix";
let cachedModulePath = null;
let cachedModule = null;
const jitiLoaders = /* @__PURE__ */ new Map();
function resolveMatrixPluginRecord() {
	return resolvePluginRuntimeRecord(MATRIX_PLUGIN_ID);
}
function resolveMatrixRuntimeModulePath(record) {
	return resolvePluginRuntimeModulePath(record, "runtime-api");
}
function loadMatrixModule() {
	const record = resolveMatrixPluginRecord();
	if (!record) return null;
	const modulePath = resolveMatrixRuntimeModulePath(record);
	if (!modulePath) return null;
	if (cachedModule && cachedModulePath === modulePath) return cachedModule;
	const loaded = loadPluginBoundaryModuleWithJiti(modulePath, jitiLoaders);
	cachedModulePath = modulePath;
	cachedModule = loaded;
	return loaded;
}
function setMatrixThreadBindingIdleTimeoutBySessionKey(...args) {
	const fn = loadMatrixModule()?.setMatrixThreadBindingIdleTimeoutBySessionKey;
	if (typeof fn !== "function") return [];
	return fn(...args);
}
function setMatrixThreadBindingMaxAgeBySessionKey(...args) {
	const fn = loadMatrixModule()?.setMatrixThreadBindingMaxAgeBySessionKey;
	if (typeof fn !== "function") return [];
	return fn(...args);
}
//#endregion
//#region src/plugins/runtime/runtime-matrix.ts
function createRuntimeMatrix() {
	return { threadBindings: {
		setIdleTimeoutBySessionKey: setMatrixThreadBindingIdleTimeoutBySessionKey,
		setMaxAgeBySessionKey: setMatrixThreadBindingMaxAgeBySessionKey
	} };
}
//#endregion
//#region src/plugins/runtime/runtime-signal.ts
function createRuntimeSignal() {
	return {
		probeSignal,
		sendMessageSignal,
		monitorSignalProvider,
		messageActions: signalMessageActions
	};
}
//#endregion
//#region src/plugins/runtime/runtime-slack.ts
const bindSlackRuntimeMethod = createLazyRuntimeMethodBinder(createLazyRuntimeSurface(() => import("./runtime-slack-ops.runtime-Do4S1oGp.js"), ({ runtimeSlackOps }) => runtimeSlackOps));
const listDirectoryGroupsLiveLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.listDirectoryGroupsLive);
const listDirectoryPeersLiveLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.listDirectoryPeersLive);
const probeSlackLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.probeSlack);
const resolveChannelAllowlistLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.resolveChannelAllowlist);
const resolveUserAllowlistLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.resolveUserAllowlist);
const sendMessageSlackLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.sendMessageSlack);
const monitorSlackProviderLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.monitorSlackProvider);
const handleSlackActionLazy = bindSlackRuntimeMethod((runtimeSlackOps) => runtimeSlackOps.handleSlackAction);
function createRuntimeSlack() {
	return {
		listDirectoryGroupsLive: listDirectoryGroupsLiveLazy,
		listDirectoryPeersLive: listDirectoryPeersLiveLazy,
		probeSlack: probeSlackLazy,
		resolveChannelAllowlist: resolveChannelAllowlistLazy,
		resolveUserAllowlist: resolveUserAllowlistLazy,
		sendMessageSlack: sendMessageSlackLazy,
		monitorSlackProvider: monitorSlackProviderLazy,
		handleSlackAction: handleSlackActionLazy
	};
}
//#endregion
//#region src/plugins/runtime/runtime-telegram-typing.ts
async function createTelegramTypingLease(params) {
	const intervalMs = typeof params.intervalMs === "number" && Number.isFinite(params.intervalMs) ? Math.max(1e3, Math.floor(params.intervalMs)) : 4e3;
	let stopped = false;
	const refresh = async () => {
		if (stopped) return;
		await params.pulse({
			to: params.to,
			accountId: params.accountId,
			cfg: params.cfg,
			messageThreadId: params.messageThreadId
		});
	};
	await refresh();
	const timer = setInterval(() => {
		refresh().catch((err) => {
			logWarn(`plugins: telegram typing pulse failed: ${String(err)}`);
		});
	}, intervalMs);
	timer.unref?.();
	return {
		refresh,
		stop: () => {
			if (stopped) return;
			stopped = true;
			clearInterval(timer);
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-telegram.ts
const bindTelegramRuntimeMethod = createLazyRuntimeMethodBinder(createLazyRuntimeSurface(() => import("./runtime-telegram-ops.runtime-CxGcwGM0.js"), ({ runtimeTelegramOps }) => runtimeTelegramOps));
const auditGroupMembershipLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.auditGroupMembership);
const probeTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.probeTelegram);
const sendMessageTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.sendMessageTelegram);
const sendPollTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.sendPollTelegram);
const monitorTelegramProviderLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.monitorTelegramProvider);
const sendTypingTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.typing.pulse);
const editMessageTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.conversationActions.editMessage);
const editMessageReplyMarkupTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.conversationActions.editReplyMarkup);
const deleteMessageTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.conversationActions.deleteMessage);
const renameForumTopicTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.conversationActions.renameTopic);
const pinMessageTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.conversationActions.pinMessage);
const unpinMessageTelegramLazy = bindTelegramRuntimeMethod((runtimeTelegramOps) => runtimeTelegramOps.conversationActions.unpinMessage);
function createRuntimeTelegram() {
	return {
		auditGroupMembership: auditGroupMembershipLazy,
		collectUnmentionedGroupIds: collectTelegramUnmentionedGroupIds,
		probeTelegram: probeTelegramLazy,
		resolveTelegramToken,
		sendMessageTelegram: sendMessageTelegramLazy,
		sendPollTelegram: sendPollTelegramLazy,
		monitorTelegramProvider: monitorTelegramProviderLazy,
		messageActions: telegramMessageActions,
		threadBindings: {
			setIdleTimeoutBySessionKey: setTelegramThreadBindingIdleTimeoutBySessionKey,
			setMaxAgeBySessionKey: setTelegramThreadBindingMaxAgeBySessionKey
		},
		typing: {
			pulse: sendTypingTelegramLazy,
			start: async ({ to, accountId, cfg, intervalMs, messageThreadId }) => await createTelegramTypingLease({
				to,
				accountId,
				cfg,
				intervalMs,
				messageThreadId,
				pulse: async ({ to, accountId, cfg, messageThreadId }) => await sendTypingTelegramLazy(to, {
					accountId,
					cfg,
					messageThreadId
				})
			})
		},
		conversationActions: {
			editMessage: editMessageTelegramLazy,
			editReplyMarkup: editMessageReplyMarkupTelegramLazy,
			clearReplyMarkup: async (chatIdInput, messageIdInput, opts = {}) => await editMessageReplyMarkupTelegramLazy(chatIdInput, messageIdInput, [], opts),
			deleteMessage: deleteMessageTelegramLazy,
			renameTopic: renameForumTopicTelegramLazy,
			pinMessage: pinMessageTelegramLazy,
			unpinMessage: unpinMessageTelegramLazy
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-whatsapp.ts
function createRuntimeWhatsApp() {
	return {
		getActiveWebListener,
		getWebAuthAgeMs,
		logoutWeb,
		logWebSelfId,
		readWebSelfId,
		webAuthExists,
		sendMessageWhatsApp,
		sendPollWhatsApp,
		loginWeb,
		startWebLoginWithQr,
		waitForWebLogin,
		monitorWebChannel,
		handleWhatsAppAction,
		createLoginTool: createRuntimeWhatsAppLoginTool
	};
}
//#endregion
//#region src/plugins/runtime/runtime-channel.ts
function createRuntimeChannel() {
	const channelRuntime = {
		text: {
			chunkByNewline,
			chunkMarkdownText,
			chunkMarkdownTextWithMode,
			chunkText,
			chunkTextWithMode,
			resolveChunkMode,
			resolveTextChunkLimit,
			hasControlCommand,
			resolveMarkdownTableMode,
			convertMarkdownTables
		},
		reply: {
			dispatchReplyWithBufferedBlockDispatcher,
			createReplyDispatcherWithTyping,
			resolveEffectiveMessagesConfig,
			resolveHumanDelayConfig,
			dispatchReplyFromConfig,
			withReplyDispatcher,
			finalizeInboundContext,
			formatAgentEnvelope,
			formatInboundEnvelope,
			resolveEnvelopeFormatOptions
		},
		routing: {
			buildAgentSessionKey,
			resolveAgentRoute
		},
		pairing: {
			buildPairingReply,
			readAllowFromStore: ({ channel, accountId, env }) => readChannelAllowFromStore(channel, env, accountId),
			upsertPairingRequest: ({ channel, id, accountId, meta, env, pairingAdapter }) => upsertChannelPairingRequest({
				channel,
				id,
				accountId,
				meta,
				env,
				pairingAdapter
			})
		},
		media: {
			fetchRemoteMedia,
			saveMediaBuffer
		},
		activity: {
			record: recordChannelActivity,
			get: getChannelActivity
		},
		session: {
			resolveStorePath,
			readSessionUpdatedAt,
			recordSessionMetaFromInbound,
			recordInboundSession,
			updateLastRoute
		},
		mentions: {
			buildMentionRegexes,
			matchesMentionPatterns,
			matchesMentionWithExplicit
		},
		reactions: {
			shouldAckReaction,
			removeAckReactionAfterReply
		},
		groups: {
			resolveGroupPolicy: resolveChannelGroupPolicy,
			resolveRequireMention: resolveChannelGroupRequireMention
		},
		debounce: {
			createInboundDebouncer,
			resolveInboundDebounceMs
		},
		commands: {
			resolveCommandAuthorizedFromAuthorizers,
			isControlCommandMessage,
			shouldComputeCommandAuthorized,
			shouldHandleTextCommands
		},
		line: {
			listLineAccountIds,
			resolveDefaultLineAccountId,
			resolveLineAccount,
			normalizeAccountId,
			probeLineBot,
			sendMessageLine,
			pushMessageLine,
			pushMessagesLine,
			pushFlexMessage,
			pushTemplateMessage,
			pushLocationMessage,
			pushTextMessageWithQuickReplies,
			createQuickReplyItems,
			buildTemplateMessageFromPayload,
			monitorLineProvider
		}
	};
	defineCachedValue(channelRuntime, "discord", createRuntimeDiscord);
	defineCachedValue(channelRuntime, "slack", createRuntimeSlack);
	defineCachedValue(channelRuntime, "telegram", createRuntimeTelegram);
	defineCachedValue(channelRuntime, "matrix", createRuntimeMatrix);
	defineCachedValue(channelRuntime, "signal", createRuntimeSignal);
	defineCachedValue(channelRuntime, "imessage", createRuntimeIMessage);
	defineCachedValue(channelRuntime, "whatsapp", createRuntimeWhatsApp);
	return channelRuntime;
}
//#endregion
//#region src/plugins/runtime/runtime-config.ts
function createRuntimeConfig() {
	return {
		loadConfig,
		writeConfigFile
	};
}
//#endregion
//#region src/plugins/runtime/runtime-events.ts
function createRuntimeEvents() {
	return {
		onAgentEvent,
		onSessionTranscriptUpdate
	};
}
//#endregion
//#region src/plugins/runtime/runtime-logging.ts
function createRuntimeLogging() {
	return {
		shouldLogVerbose,
		getChildLogger: (bindings, opts) => {
			const logger = getChildLogger(bindings, { level: opts?.level ? normalizeLogLevel(opts.level) : void 0 });
			return {
				debug: (message) => logger.debug?.(message),
				info: (message) => logger.info(message),
				warn: (message) => logger.warn(message),
				error: (message) => logger.error(message)
			};
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-media.ts
function createRuntimeMedia() {
	return {
		loadWebMedia,
		detectMime,
		mediaKindFromMime,
		isVoiceCompatibleAudio,
		getImageMetadata,
		resizeToJpeg
	};
}
//#endregion
//#region src/cron/isolated-agent/session.ts
function resolveCronSession(params) {
	const sessionCfg = params.cfg.session;
	const storePath = resolveStorePath(sessionCfg?.store, { agentId: params.agentId });
	const store = loadSessionStore(storePath);
	const entry = store[params.sessionKey];
	let sessionId;
	let isNewSession;
	let systemSent;
	if (!params.forceNew && entry?.sessionId) {
		const resetPolicy = resolveSessionResetPolicy({
			sessionCfg,
			resetType: "direct"
		});
		if (evaluateSessionFreshness({
			updatedAt: entry.updatedAt,
			now: params.nowMs,
			policy: resetPolicy
		}).fresh) {
			sessionId = entry.sessionId;
			isNewSession = false;
			systemSent = entry.systemSent ?? false;
		} else {
			sessionId = crypto.randomUUID();
			isNewSession = true;
			systemSent = false;
		}
	} else {
		sessionId = crypto.randomUUID();
		isNewSession = true;
		systemSent = false;
	}
	clearBootstrapSnapshotOnSessionRollover({
		sessionKey: params.sessionKey,
		previousSessionId: isNewSession ? entry?.sessionId : void 0
	});
	return {
		storePath,
		store,
		sessionEntry: {
			...entry,
			sessionId,
			updatedAt: params.nowMs,
			systemSent,
			...isNewSession && {
				lastChannel: void 0,
				lastTo: void 0,
				lastAccountId: void 0,
				lastThreadId: void 0,
				deliveryContext: void 0
			}
		},
		systemSent,
		isNewSession
	};
}
//#endregion
//#region src/infra/heartbeat-active-hours.ts
const ACTIVE_HOURS_TIME_PATTERN = /^(?:([01]\d|2[0-3]):([0-5]\d)|24:00)$/;
function resolveActiveHoursTimezone(cfg, raw) {
	const trimmed = raw?.trim();
	if (!trimmed || trimmed === "user") return resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
	if (trimmed === "local") return Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() || "UTC";
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format(/* @__PURE__ */ new Date());
		return trimmed;
	} catch {
		return resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
	}
}
function parseActiveHoursTime(opts, raw) {
	if (!raw || !ACTIVE_HOURS_TIME_PATTERN.test(raw)) return null;
	const [hourStr, minuteStr] = raw.split(":");
	const hour = Number(hourStr);
	const minute = Number(minuteStr);
	if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
	if (hour === 24) {
		if (!opts.allow24 || minute !== 0) return null;
		return 1440;
	}
	return hour * 60 + minute;
}
function resolveMinutesInTimeZone(nowMs, timeZone) {
	try {
		const parts = new Intl.DateTimeFormat("en-US", {
			timeZone,
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23"
		}).formatToParts(new Date(nowMs));
		const map = {};
		for (const part of parts) if (part.type !== "literal") map[part.type] = part.value;
		const hour = Number(map.hour);
		const minute = Number(map.minute);
		if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
		return hour * 60 + minute;
	} catch {
		return null;
	}
}
function isWithinActiveHours(cfg, heartbeat, nowMs) {
	const active = heartbeat?.activeHours;
	if (!active) return true;
	const startMin = parseActiveHoursTime({ allow24: false }, active.start);
	const endMin = parseActiveHoursTime({ allow24: true }, active.end);
	if (startMin === null || endMin === null) return true;
	if (startMin === endMin) return false;
	const timeZone = resolveActiveHoursTimezone(cfg, active.timezone);
	const currentMin = resolveMinutesInTimeZone(nowMs ?? Date.now(), timeZone);
	if (currentMin === null) return true;
	if (endMin > startMin) return currentMin >= startMin && currentMin < endMin;
	return currentMin >= startMin || currentMin < endMin;
}
//#endregion
//#region src/infra/heartbeat-events-filter.ts
function buildCronEventPrompt(pendingEvents, opts) {
	const deliverToUser = opts?.deliverToUser ?? true;
	const eventText = pendingEvents.join("\n").trim();
	if (!eventText) {
		if (!deliverToUser) return "A scheduled cron event was triggered, but no event content was found. Handle this internally and reply HEARTBEAT_OK when nothing needs user-facing follow-up.";
		return "A scheduled cron event was triggered, but no event content was found. Reply HEARTBEAT_OK.";
	}
	if (!deliverToUser) return "A scheduled reminder has been triggered. The reminder content is:\n\n" + eventText + "\n\nHandle this reminder internally. Do not relay it to the user unless explicitly requested.";
	return "A scheduled reminder has been triggered. The reminder content is:\n\n" + eventText + "\n\nPlease relay this reminder to the user in a helpful and friendly way.";
}
function buildExecEventPrompt(opts) {
	if (!(opts?.deliverToUser ?? true)) return "An async command you ran earlier has completed. The result is shown in the system messages above. Handle the result internally. Do not relay it to the user unless explicitly requested.";
	return "An async command you ran earlier has completed. The result is shown in the system messages above. Please relay the command output to the user in a helpful way. If the command succeeded, share the relevant output. If it failed, explain what went wrong.";
}
const HEARTBEAT_OK_PREFIX = HEARTBEAT_TOKEN.toLowerCase();
function isHeartbeatAckEvent(evt) {
	const trimmed = evt.trim();
	if (!trimmed) return false;
	const lower = trimmed.toLowerCase();
	if (!lower.startsWith(HEARTBEAT_OK_PREFIX)) return false;
	const suffix = lower.slice(HEARTBEAT_OK_PREFIX.length);
	if (suffix.length === 0) return true;
	return !/[a-z0-9_]/.test(suffix[0]);
}
function isHeartbeatNoiseEvent(evt) {
	const lower = evt.trim().toLowerCase();
	if (!lower) return false;
	return isHeartbeatAckEvent(lower) || lower.includes("heartbeat poll") || lower.includes("heartbeat wake");
}
function isExecCompletionEvent(evt) {
	return evt.toLowerCase().includes("exec finished");
}
function isCronSystemEvent(evt) {
	if (!evt.trim()) return false;
	return !isHeartbeatNoiseEvent(evt) && !isExecCompletionEvent(evt);
}
//#endregion
//#region src/infra/heartbeat-runner.ts
const log = createSubsystemLogger("gateway/heartbeat");
function hasExplicitHeartbeatAgents(cfg) {
	return (cfg.agents?.list ?? []).some((entry) => Boolean(entry?.heartbeat));
}
function resolveHeartbeatConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.heartbeat;
	if (!agentId) return defaults;
	const overrides = resolveAgentConfig(cfg, agentId)?.heartbeat;
	if (!defaults && !overrides) return overrides;
	return {
		...defaults,
		...overrides
	};
}
function resolveHeartbeatAgents(cfg) {
	const list = cfg.agents?.list ?? [];
	if (hasExplicitHeartbeatAgents(cfg)) return list.filter((entry) => entry?.heartbeat).map((entry) => {
		const id = normalizeAgentId(entry.id);
		return {
			agentId: id,
			heartbeat: resolveHeartbeatConfig(cfg, id)
		};
	}).filter((entry) => entry.agentId);
	const fallbackId = resolveDefaultAgentId(cfg);
	return [{
		agentId: fallbackId,
		heartbeat: resolveHeartbeatConfig(cfg, fallbackId)
	}];
}
function resolveHeartbeatPrompt(cfg, heartbeat) {
	return resolveHeartbeatPrompt$1(heartbeat?.prompt ?? cfg.agents?.defaults?.heartbeat?.prompt);
}
function resolveHeartbeatAckMaxChars(cfg, heartbeat) {
	return Math.max(0, heartbeat?.ackMaxChars ?? cfg.agents?.defaults?.heartbeat?.ackMaxChars ?? 300);
}
function resolveHeartbeatSession(cfg, agentId, heartbeat, forcedSessionKey) {
	const sessionCfg = cfg.session;
	const scope = sessionCfg?.scope ?? "per-sender";
	const resolvedAgentId = normalizeAgentId(agentId ?? resolveDefaultAgentId(cfg));
	const mainSessionKey = scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId: resolvedAgentId
	});
	const storeAgentId = scope === "global" ? resolveDefaultAgentId(cfg) : resolvedAgentId;
	const storePath = resolveStorePath(sessionCfg?.store, { agentId: storeAgentId });
	const store = loadSessionStore(storePath);
	const mainEntry = store[mainSessionKey];
	if (scope === "global") return {
		sessionKey: mainSessionKey,
		storePath,
		store,
		entry: mainEntry
	};
	const forced = forcedSessionKey?.trim();
	if (forced) {
		const forcedCanonical = canonicalizeMainSessionAlias({
			cfg,
			agentId: resolvedAgentId,
			sessionKey: toAgentStoreSessionKey({
				agentId: resolvedAgentId,
				requestKey: forced,
				mainKey: cfg.session?.mainKey
			})
		});
		if (forcedCanonical !== "global") {
			if (resolveAgentIdFromSessionKey(forcedCanonical) === normalizeAgentId(resolvedAgentId)) return {
				sessionKey: forcedCanonical,
				storePath,
				store,
				entry: store[forcedCanonical]
			};
		}
	}
	const trimmed = heartbeat?.session?.trim() ?? "";
	if (!trimmed) return {
		sessionKey: mainSessionKey,
		storePath,
		store,
		entry: mainEntry
	};
	const normalized = trimmed.toLowerCase();
	if (normalized === "main" || normalized === "global") return {
		sessionKey: mainSessionKey,
		storePath,
		store,
		entry: mainEntry
	};
	const canonical = canonicalizeMainSessionAlias({
		cfg,
		agentId: resolvedAgentId,
		sessionKey: toAgentStoreSessionKey({
			agentId: resolvedAgentId,
			requestKey: trimmed,
			mainKey: cfg.session?.mainKey
		})
	});
	if (canonical !== "global") {
		if (resolveAgentIdFromSessionKey(canonical) === normalizeAgentId(resolvedAgentId)) return {
			sessionKey: canonical,
			storePath,
			store,
			entry: store[canonical]
		};
	}
	return {
		sessionKey: mainSessionKey,
		storePath,
		store,
		entry: mainEntry
	};
}
function resolveHeartbeatReasoningPayloads(replyResult) {
	return (Array.isArray(replyResult) ? replyResult : replyResult ? [replyResult] : []).filter((payload) => {
		return (typeof payload.text === "string" ? payload.text : "").trimStart().startsWith("Reasoning:");
	});
}
async function restoreHeartbeatUpdatedAt(params) {
	const { storePath, sessionKey, updatedAt } = params;
	if (typeof updatedAt !== "number") return;
	const entry = loadSessionStore(storePath)[sessionKey];
	if (!entry) return;
	const nextUpdatedAt = Math.max(entry.updatedAt ?? 0, updatedAt);
	if (entry.updatedAt === nextUpdatedAt) return;
	await updateSessionStore(storePath, (nextStore) => {
		const nextEntry = nextStore[sessionKey] ?? entry;
		if (!nextEntry) return;
		const resolvedUpdatedAt = Math.max(nextEntry.updatedAt ?? 0, updatedAt);
		if (nextEntry.updatedAt === resolvedUpdatedAt) return;
		nextStore[sessionKey] = {
			...nextEntry,
			updatedAt: resolvedUpdatedAt
		};
	});
}
/**
* Prune heartbeat transcript entries by truncating the file back to a previous size.
* This removes the user+assistant turns that were written during a HEARTBEAT_OK run,
* preventing context pollution from zero-information exchanges.
*/
async function pruneHeartbeatTranscript(params) {
	const { transcriptPath, preHeartbeatSize } = params;
	if (!transcriptPath || typeof preHeartbeatSize !== "number" || preHeartbeatSize < 0) return;
	try {
		if ((await fs.stat(transcriptPath)).size > preHeartbeatSize) await fs.truncate(transcriptPath, preHeartbeatSize);
	} catch {}
}
/**
* Get the transcript file path and its current size before a heartbeat run.
* Returns undefined values if the session or transcript doesn't exist yet.
*/
async function captureTranscriptState(params) {
	const { storePath, sessionKey, agentId } = params;
	try {
		const entry = loadSessionStore(storePath)[sessionKey];
		if (!entry?.sessionId) return {};
		const transcriptPath = resolveSessionFilePath(entry.sessionId, entry, {
			agentId,
			sessionsDir: path.dirname(storePath)
		});
		return {
			transcriptPath,
			preHeartbeatSize: (await fs.stat(transcriptPath)).size
		};
	} catch {
		return {};
	}
}
function stripLeadingHeartbeatResponsePrefix(text, responsePrefix) {
	const normalizedPrefix = responsePrefix?.trim();
	if (!normalizedPrefix) return text;
	const prefixPattern = new RegExp(`^${escapeRegExp(normalizedPrefix)}(?=$|\\s|[\\p{P}\\p{S}])\\s*`, "iu");
	return text.replace(prefixPattern, "");
}
function normalizeHeartbeatReply(payload, responsePrefix, ackMaxChars) {
	const stripped = stripHeartbeatToken(stripLeadingHeartbeatResponsePrefix(typeof payload.text === "string" ? payload.text : "", responsePrefix), {
		mode: "heartbeat",
		maxAckChars: ackMaxChars
	});
	const hasMedia = resolveSendableOutboundReplyParts(payload).hasMedia;
	if (stripped.shouldSkip && !hasMedia) return {
		shouldSkip: true,
		text: "",
		hasMedia
	};
	let finalText = stripped.text;
	if (responsePrefix && finalText && !finalText.startsWith(responsePrefix)) finalText = `${responsePrefix} ${finalText}`;
	return {
		shouldSkip: false,
		text: finalText,
		hasMedia
	};
}
function resolveHeartbeatReasonFlags(reason) {
	const reasonKind = resolveHeartbeatReasonKind(reason);
	return {
		isExecEventReason: reasonKind === "exec-event",
		isCronEventReason: reasonKind === "cron",
		isWakeReason: reasonKind === "wake" || reasonKind === "hook"
	};
}
async function resolveHeartbeatPreflight(params) {
	const reasonFlags = resolveHeartbeatReasonFlags(params.reason);
	const session = resolveHeartbeatSession(params.cfg, params.agentId, params.heartbeat, params.forcedSessionKey);
	const pendingEventEntries = peekSystemEventEntries(session.sessionKey);
	const turnSourceDeliveryContext = resolveSystemEventDeliveryContext(pendingEventEntries);
	const hasTaggedCronEvents = pendingEventEntries.some((event) => event.contextKey?.startsWith("cron:"));
	const shouldInspectPendingEvents = reasonFlags.isExecEventReason || reasonFlags.isCronEventReason || hasTaggedCronEvents;
	const shouldBypassFileGates = reasonFlags.isExecEventReason || reasonFlags.isCronEventReason || reasonFlags.isWakeReason || hasTaggedCronEvents;
	const basePreflight = {
		...reasonFlags,
		session,
		pendingEventEntries,
		turnSourceDeliveryContext,
		hasTaggedCronEvents,
		shouldInspectPendingEvents
	};
	if (shouldBypassFileGates) return basePreflight;
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const heartbeatFilePath = path.join(workspaceDir, DEFAULT_HEARTBEAT_FILENAME);
	try {
		if (isHeartbeatContentEffectivelyEmpty(await fs.readFile(heartbeatFilePath, "utf-8"))) return {
			...basePreflight,
			skipReason: "empty-heartbeat-file"
		};
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return basePreflight;
	}
	return basePreflight;
}
function appendHeartbeatWorkspacePathHint(prompt, workspaceDir) {
	if (!/heartbeat\.md/i.test(prompt)) return prompt;
	const hint = `When reading HEARTBEAT.md, use workspace file ${path.join(workspaceDir, DEFAULT_HEARTBEAT_FILENAME).replace(/\\/g, "/")} (exact case). Do not read docs/heartbeat.md.`;
	if (prompt.includes(hint)) return prompt;
	return `${prompt}\n${hint}`;
}
function resolveHeartbeatRunPrompt(params) {
	const pendingEventEntries = params.preflight.pendingEventEntries;
	const pendingEvents = params.preflight.shouldInspectPendingEvents ? pendingEventEntries.map((event) => event.text) : [];
	const cronEvents = pendingEventEntries.filter((event) => (params.preflight.isCronEventReason || event.contextKey?.startsWith("cron:")) && isCronSystemEvent(event.text)).map((event) => event.text);
	const hasExecCompletion = pendingEvents.some(isExecCompletionEvent);
	const hasCronEvents = cronEvents.length > 0;
	return {
		prompt: appendHeartbeatWorkspacePathHint(hasExecCompletion ? buildExecEventPrompt({ deliverToUser: params.canRelayToUser }) : hasCronEvents ? buildCronEventPrompt(cronEvents, { deliverToUser: params.canRelayToUser }) : resolveHeartbeatPrompt(params.cfg, params.heartbeat), params.workspaceDir),
		hasExecCompletion,
		hasCronEvents
	};
}
async function runHeartbeatOnce(opts) {
	const cfg = opts.cfg ?? loadConfig();
	const explicitAgentId = typeof opts.agentId === "string" ? opts.agentId.trim() : "";
	const forcedSessionAgentId = explicitAgentId.length > 0 ? void 0 : parseAgentSessionKey(opts.sessionKey)?.agentId;
	const agentId = normalizeAgentId(explicitAgentId || forcedSessionAgentId || resolveDefaultAgentId(cfg));
	const heartbeat = opts.heartbeat ?? resolveHeartbeatConfig(cfg, agentId);
	if (!areHeartbeatsEnabled()) return {
		status: "skipped",
		reason: "disabled"
	};
	if (!isHeartbeatEnabledForAgent(cfg, agentId)) return {
		status: "skipped",
		reason: "disabled"
	};
	if (!resolveHeartbeatIntervalMs(cfg, void 0, heartbeat)) return {
		status: "skipped",
		reason: "disabled"
	};
	const startedAt = opts.deps?.nowMs?.() ?? Date.now();
	if (!isWithinActiveHours(cfg, heartbeat, startedAt)) return {
		status: "skipped",
		reason: "quiet-hours"
	};
	if ((opts.deps?.getQueueSize ?? getQueueSize)(CommandLane.Main) > 0) return {
		status: "skipped",
		reason: "requests-in-flight"
	};
	const preflight = await resolveHeartbeatPreflight({
		cfg,
		agentId,
		heartbeat,
		forcedSessionKey: opts.sessionKey,
		reason: opts.reason
	});
	if (preflight.skipReason) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: preflight.skipReason,
			durationMs: Date.now() - startedAt
		});
		return {
			status: "skipped",
			reason: preflight.skipReason
		};
	}
	const { entry, sessionKey, storePath } = preflight.session;
	const previousUpdatedAt = entry?.updatedAt;
	const useIsolatedSession = heartbeat?.isolatedSession === true;
	let runSessionKey = sessionKey;
	let runStorePath = storePath;
	if (useIsolatedSession) {
		const isolatedKey = `${sessionKey}:heartbeat`;
		const cronSession = resolveCronSession({
			cfg,
			sessionKey: isolatedKey,
			agentId,
			nowMs: startedAt,
			forceNew: true
		});
		cronSession.store[isolatedKey] = cronSession.sessionEntry;
		await saveSessionStore(cronSession.storePath, cronSession.store);
		runSessionKey = isolatedKey;
		runStorePath = cronSession.storePath;
	}
	const delivery = resolveHeartbeatDeliveryTarget({
		cfg,
		entry,
		heartbeat,
		turnSource: useIsolatedSession ? void 0 : preflight.turnSourceDeliveryContext
	});
	const heartbeatAccountId = heartbeat?.accountId?.trim();
	if (delivery.reason === "unknown-account") log.warn("heartbeat: unknown accountId", {
		accountId: delivery.accountId ?? heartbeatAccountId ?? null,
		target: heartbeat?.target ?? "none"
	});
	else if (heartbeatAccountId) log.info("heartbeat: using explicit accountId", {
		accountId: delivery.accountId ?? heartbeatAccountId,
		target: heartbeat?.target ?? "none",
		channel: delivery.channel
	});
	const visibility = delivery.channel !== "none" ? resolveHeartbeatVisibility({
		cfg,
		channel: delivery.channel,
		accountId: delivery.accountId
	}) : {
		showOk: false,
		showAlerts: true,
		useIndicator: true
	};
	const { sender } = resolveHeartbeatSenderContext({
		cfg,
		entry,
		delivery
	});
	const responsePrefix = resolveEffectiveMessagesConfig(cfg, agentId, {
		channel: delivery.channel !== "none" ? delivery.channel : void 0,
		accountId: delivery.accountId
	}).responsePrefix;
	const { prompt, hasExecCompletion, hasCronEvents } = resolveHeartbeatRunPrompt({
		cfg,
		heartbeat,
		preflight,
		canRelayToUser: Boolean(delivery.channel !== "none" && delivery.to && visibility.showAlerts),
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	});
	const ctx = {
		Body: appendCronStyleCurrentTimeLine(prompt, cfg, startedAt),
		From: sender,
		To: sender,
		OriginatingChannel: delivery.channel !== "none" ? delivery.channel : void 0,
		OriginatingTo: delivery.to,
		AccountId: delivery.accountId,
		MessageThreadId: delivery.threadId,
		Provider: hasExecCompletion ? "exec-event" : hasCronEvents ? "cron-event" : "heartbeat",
		SessionKey: runSessionKey
	};
	if (!visibility.showAlerts && !visibility.showOk && !visibility.useIndicator) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: "alerts-disabled",
			durationMs: Date.now() - startedAt,
			channel: delivery.channel !== "none" ? delivery.channel : void 0,
			accountId: delivery.accountId
		});
		return {
			status: "skipped",
			reason: "alerts-disabled"
		};
	}
	const heartbeatOkText = responsePrefix ? `${responsePrefix} ${HEARTBEAT_TOKEN}` : HEARTBEAT_TOKEN;
	const outboundSession = buildOutboundSessionContext({
		cfg,
		agentId,
		sessionKey
	});
	const canAttemptHeartbeatOk = Boolean(visibility.showOk && delivery.channel !== "none" && delivery.to);
	const maybeSendHeartbeatOk = async () => {
		if (!canAttemptHeartbeatOk || delivery.channel === "none" || !delivery.to) return false;
		const heartbeatPlugin = getChannelPlugin(delivery.channel);
		if (heartbeatPlugin?.heartbeat?.checkReady) {
			if (!(await heartbeatPlugin.heartbeat.checkReady({
				cfg,
				accountId: delivery.accountId,
				deps: opts.deps
			})).ok) return false;
		}
		await deliverOutboundPayloads({
			cfg,
			channel: delivery.channel,
			to: delivery.to,
			accountId: delivery.accountId,
			threadId: delivery.threadId,
			payloads: [{ text: heartbeatOkText }],
			session: outboundSession,
			deps: opts.deps
		});
		return true;
	};
	try {
		const transcriptState = await captureTranscriptState({
			storePath: runStorePath,
			sessionKey: runSessionKey,
			agentId
		});
		const heartbeatModelOverride = heartbeat?.model?.trim() || void 0;
		const suppressToolErrorWarnings = heartbeat?.suppressToolErrorWarnings === true;
		const bootstrapContextMode = heartbeat?.lightContext === true ? "lightweight" : void 0;
		const replyResult = await getReplyFromConfig(ctx, heartbeatModelOverride ? {
			isHeartbeat: true,
			heartbeatModelOverride,
			suppressToolErrorWarnings,
			bootstrapContextMode
		} : {
			isHeartbeat: true,
			suppressToolErrorWarnings,
			bootstrapContextMode
		}, cfg);
		const replyPayload = resolveHeartbeatReplyPayload(replyResult);
		const reasoningPayloads = heartbeat?.includeReasoning === true ? resolveHeartbeatReasoningPayloads(replyResult).filter((payload) => payload !== replyPayload) : [];
		if (!replyPayload || !hasOutboundReplyContent(replyPayload)) {
			await restoreHeartbeatUpdatedAt({
				storePath,
				sessionKey,
				updatedAt: previousUpdatedAt
			});
			await pruneHeartbeatTranscript(transcriptState);
			const okSent = await maybeSendHeartbeatOk();
			emitHeartbeatEvent({
				status: "ok-empty",
				reason: opts.reason,
				durationMs: Date.now() - startedAt,
				channel: delivery.channel !== "none" ? delivery.channel : void 0,
				accountId: delivery.accountId,
				silent: !okSent,
				indicatorType: visibility.useIndicator ? resolveIndicatorType("ok-empty") : void 0
			});
			return {
				status: "ran",
				durationMs: Date.now() - startedAt
			};
		}
		const normalized = normalizeHeartbeatReply(replyPayload, responsePrefix, resolveHeartbeatAckMaxChars(cfg, heartbeat));
		const execFallbackText = hasExecCompletion && !normalized.text.trim() && replyPayload.text?.trim() ? replyPayload.text.trim() : null;
		if (execFallbackText) {
			normalized.text = execFallbackText;
			normalized.shouldSkip = false;
		}
		const shouldSkipMain = normalized.shouldSkip && !normalized.hasMedia && !hasExecCompletion;
		if (shouldSkipMain && reasoningPayloads.length === 0) {
			await restoreHeartbeatUpdatedAt({
				storePath,
				sessionKey,
				updatedAt: previousUpdatedAt
			});
			await pruneHeartbeatTranscript(transcriptState);
			const okSent = await maybeSendHeartbeatOk();
			emitHeartbeatEvent({
				status: "ok-token",
				reason: opts.reason,
				durationMs: Date.now() - startedAt,
				channel: delivery.channel !== "none" ? delivery.channel : void 0,
				accountId: delivery.accountId,
				silent: !okSent,
				indicatorType: visibility.useIndicator ? resolveIndicatorType("ok-token") : void 0
			});
			return {
				status: "ran",
				durationMs: Date.now() - startedAt
			};
		}
		const mediaUrls = resolveSendableOutboundReplyParts(replyPayload).mediaUrls;
		const prevHeartbeatText = typeof entry?.lastHeartbeatText === "string" ? entry.lastHeartbeatText : "";
		const prevHeartbeatAt = typeof entry?.lastHeartbeatSentAt === "number" ? entry.lastHeartbeatSentAt : void 0;
		if (!shouldSkipMain && !mediaUrls.length && Boolean(prevHeartbeatText.trim()) && normalized.text.trim() === prevHeartbeatText.trim() && typeof prevHeartbeatAt === "number" && startedAt - prevHeartbeatAt < 1440 * 60 * 1e3) {
			await restoreHeartbeatUpdatedAt({
				storePath,
				sessionKey,
				updatedAt: previousUpdatedAt
			});
			await pruneHeartbeatTranscript(transcriptState);
			emitHeartbeatEvent({
				status: "skipped",
				reason: "duplicate",
				preview: normalized.text.slice(0, 200),
				durationMs: Date.now() - startedAt,
				hasMedia: false,
				channel: delivery.channel !== "none" ? delivery.channel : void 0,
				accountId: delivery.accountId
			});
			return {
				status: "ran",
				durationMs: Date.now() - startedAt
			};
		}
		const previewText = shouldSkipMain ? reasoningPayloads.map((payload) => payload.text).filter((text) => Boolean(text?.trim())).join("\n") : normalized.text;
		if (delivery.channel === "none" || !delivery.to) {
			emitHeartbeatEvent({
				status: "skipped",
				reason: delivery.reason ?? "no-target",
				preview: previewText?.slice(0, 200),
				durationMs: Date.now() - startedAt,
				hasMedia: mediaUrls.length > 0,
				accountId: delivery.accountId
			});
			return {
				status: "ran",
				durationMs: Date.now() - startedAt
			};
		}
		if (!visibility.showAlerts) {
			await restoreHeartbeatUpdatedAt({
				storePath,
				sessionKey,
				updatedAt: previousUpdatedAt
			});
			emitHeartbeatEvent({
				status: "skipped",
				reason: "alerts-disabled",
				preview: previewText?.slice(0, 200),
				durationMs: Date.now() - startedAt,
				channel: delivery.channel,
				hasMedia: mediaUrls.length > 0,
				accountId: delivery.accountId,
				indicatorType: visibility.useIndicator ? resolveIndicatorType("sent") : void 0
			});
			return {
				status: "ran",
				durationMs: Date.now() - startedAt
			};
		}
		const deliveryAccountId = delivery.accountId;
		const heartbeatPlugin = getChannelPlugin(delivery.channel);
		if (heartbeatPlugin?.heartbeat?.checkReady) {
			const readiness = await heartbeatPlugin.heartbeat.checkReady({
				cfg,
				accountId: deliveryAccountId,
				deps: opts.deps
			});
			if (!readiness.ok) {
				emitHeartbeatEvent({
					status: "skipped",
					reason: readiness.reason,
					preview: previewText?.slice(0, 200),
					durationMs: Date.now() - startedAt,
					hasMedia: mediaUrls.length > 0,
					channel: delivery.channel,
					accountId: delivery.accountId
				});
				log.info("heartbeat: channel not ready", {
					channel: delivery.channel,
					reason: readiness.reason
				});
				return {
					status: "skipped",
					reason: readiness.reason
				};
			}
		}
		await deliverOutboundPayloads({
			cfg,
			channel: delivery.channel,
			to: delivery.to,
			accountId: deliveryAccountId,
			session: outboundSession,
			threadId: delivery.threadId,
			payloads: [...reasoningPayloads, ...shouldSkipMain ? [] : [{
				text: normalized.text,
				mediaUrls
			}]],
			deps: opts.deps
		});
		if (!shouldSkipMain && normalized.text.trim()) {
			const store = loadSessionStore(storePath);
			const current = store[sessionKey];
			if (current) {
				store[sessionKey] = {
					...current,
					lastHeartbeatText: normalized.text,
					lastHeartbeatSentAt: startedAt
				};
				await saveSessionStore(storePath, store);
			}
		}
		emitHeartbeatEvent({
			status: "sent",
			to: delivery.to,
			preview: previewText?.slice(0, 200),
			durationMs: Date.now() - startedAt,
			hasMedia: mediaUrls.length > 0,
			channel: delivery.channel,
			accountId: delivery.accountId,
			indicatorType: visibility.useIndicator ? resolveIndicatorType("sent") : void 0
		});
		return {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
	} catch (err) {
		const reason = formatErrorMessage(err);
		emitHeartbeatEvent({
			status: "failed",
			reason,
			durationMs: Date.now() - startedAt,
			channel: delivery.channel !== "none" ? delivery.channel : void 0,
			accountId: delivery.accountId,
			indicatorType: visibility.useIndicator ? resolveIndicatorType("failed") : void 0
		});
		log.error(`heartbeat failed: ${reason}`, { error: reason });
		return {
			status: "failed",
			reason
		};
	}
}
function startHeartbeatRunner(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const runOnce = opts.runOnce ?? runHeartbeatOnce;
	const state = {
		cfg: opts.cfg ?? loadConfig(),
		runtime,
		agents: /* @__PURE__ */ new Map(),
		timer: null,
		stopped: false
	};
	let initialized = false;
	const resolveNextDue = (now, intervalMs, prevState) => {
		if (typeof prevState?.lastRunMs === "number") return prevState.lastRunMs + intervalMs;
		if (prevState && prevState.intervalMs === intervalMs && prevState.nextDueMs > now) return prevState.nextDueMs;
		return now + intervalMs;
	};
	const advanceAgentSchedule = (agent, now) => {
		agent.lastRunMs = now;
		agent.nextDueMs = now + agent.intervalMs;
	};
	const scheduleNext = () => {
		if (state.stopped) return;
		if (state.timer) {
			clearTimeout(state.timer);
			state.timer = null;
		}
		if (state.agents.size === 0) return;
		const now = Date.now();
		let nextDue = Number.POSITIVE_INFINITY;
		for (const agent of state.agents.values()) if (agent.nextDueMs < nextDue) nextDue = agent.nextDueMs;
		if (!Number.isFinite(nextDue)) return;
		const delay = Math.max(0, nextDue - now);
		state.timer = setTimeout(() => {
			state.timer = null;
			requestHeartbeatNow({
				reason: "interval",
				coalesceMs: 0
			});
		}, delay);
		state.timer.unref?.();
	};
	const updateConfig = (cfg) => {
		if (state.stopped) return;
		const now = Date.now();
		const prevAgents = state.agents;
		const prevEnabled = prevAgents.size > 0;
		const nextAgents = /* @__PURE__ */ new Map();
		const intervals = [];
		for (const agent of resolveHeartbeatAgents(cfg)) {
			const intervalMs = resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat);
			if (!intervalMs) continue;
			intervals.push(intervalMs);
			const prevState = prevAgents.get(agent.agentId);
			const nextDueMs = resolveNextDue(now, intervalMs, prevState);
			nextAgents.set(agent.agentId, {
				agentId: agent.agentId,
				heartbeat: agent.heartbeat,
				intervalMs,
				lastRunMs: prevState?.lastRunMs,
				nextDueMs
			});
		}
		state.cfg = cfg;
		state.agents = nextAgents;
		const nextEnabled = nextAgents.size > 0;
		if (!initialized) {
			if (!nextEnabled) log.info("heartbeat: disabled", { enabled: false });
			else log.info("heartbeat: started", { intervalMs: Math.min(...intervals) });
			initialized = true;
		} else if (prevEnabled !== nextEnabled) if (!nextEnabled) log.info("heartbeat: disabled", { enabled: false });
		else log.info("heartbeat: started", { intervalMs: Math.min(...intervals) });
		scheduleNext();
	};
	const run = async (params) => {
		if (state.stopped) return {
			status: "skipped",
			reason: "disabled"
		};
		if (!areHeartbeatsEnabled()) return {
			status: "skipped",
			reason: "disabled"
		};
		if (state.agents.size === 0) return {
			status: "skipped",
			reason: "disabled"
		};
		const reason = params?.reason;
		const requestedAgentId = params?.agentId ? normalizeAgentId(params.agentId) : void 0;
		const requestedSessionKey = params?.sessionKey?.trim() || void 0;
		const isInterval = reason === "interval";
		const startedAt = Date.now();
		const now = startedAt;
		let ran = false;
		let requestsInFlight = false;
		try {
			if (requestedSessionKey || requestedAgentId) {
				const targetAgentId = requestedAgentId ?? resolveAgentIdFromSessionKey(requestedSessionKey);
				const targetAgent = state.agents.get(targetAgentId);
				if (!targetAgent) return {
					status: "skipped",
					reason: "disabled"
				};
				try {
					const res = await runOnce({
						cfg: state.cfg,
						agentId: targetAgent.agentId,
						heartbeat: targetAgent.heartbeat,
						reason,
						sessionKey: requestedSessionKey,
						deps: { runtime: state.runtime }
					});
					if (res.status !== "skipped" || res.reason !== "disabled") advanceAgentSchedule(targetAgent, now);
					return res.status === "ran" ? {
						status: "ran",
						durationMs: Date.now() - startedAt
					} : res;
				} catch (err) {
					const errMsg = formatErrorMessage(err);
					log.error(`heartbeat runner: targeted runOnce threw unexpectedly: ${errMsg}`, { error: errMsg });
					advanceAgentSchedule(targetAgent, now);
					return {
						status: "failed",
						reason: errMsg
					};
				}
			}
			for (const agent of state.agents.values()) {
				if (isInterval && now < agent.nextDueMs) continue;
				let res;
				try {
					res = await runOnce({
						cfg: state.cfg,
						agentId: agent.agentId,
						heartbeat: agent.heartbeat,
						reason,
						deps: { runtime: state.runtime }
					});
				} catch (err) {
					const errMsg = formatErrorMessage(err);
					log.error(`heartbeat runner: runOnce threw unexpectedly: ${errMsg}`, { error: errMsg });
					advanceAgentSchedule(agent, now);
					continue;
				}
				if (res.status === "skipped" && res.reason === "requests-in-flight") {
					requestsInFlight = true;
					return res;
				}
				if (res.status !== "skipped" || res.reason !== "disabled") advanceAgentSchedule(agent, now);
				if (res.status === "ran") ran = true;
			}
			if (ran) return {
				status: "ran",
				durationMs: Date.now() - startedAt
			};
			return {
				status: "skipped",
				reason: isInterval ? "not-due" : "disabled"
			};
		} finally {
			if (!requestsInFlight) scheduleNext();
		}
	};
	const wakeHandler = async (params) => run({
		reason: params.reason,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const disposeWakeHandler = setHeartbeatWakeHandler(wakeHandler);
	updateConfig(state.cfg);
	const cleanup = () => {
		if (state.stopped) return;
		state.stopped = true;
		disposeWakeHandler();
		if (state.timer) clearTimeout(state.timer);
		state.timer = null;
	};
	opts.abortSignal?.addEventListener("abort", cleanup, { once: true });
	return {
		stop: cleanup,
		updateConfig
	};
}
//#endregion
//#region src/plugins/runtime/native-deps.ts
function formatNativeDependencyHint(params) {
	const manager = params.manager ?? "pnpm";
	const rebuildCommand = params.rebuildCommand ?? (manager === "npm" ? `npm rebuild ${params.packageName}` : manager === "yarn" ? `yarn rebuild ${params.packageName}` : `pnpm rebuild ${params.packageName}`);
	const steps = [
		params.approveBuildsCommand ?? (manager === "pnpm" ? `pnpm approve-builds (select ${params.packageName})` : void 0),
		rebuildCommand,
		params.downloadCommand
	].filter((step) => Boolean(step));
	if (steps.length === 0) return `Install ${params.packageName} and rebuild its native module.`;
	return `Install ${params.packageName} and rebuild its native module (${steps.join("; ")}).`;
}
//#endregion
//#region src/plugins/runtime/runtime-system.ts
function createRuntimeSystem() {
	return {
		enqueueSystemEvent,
		requestHeartbeatNow,
		runHeartbeatOnce: (opts) => {
			const { reason, agentId, sessionKey, heartbeat } = opts ?? {};
			return runHeartbeatOnce({
				reason,
				agentId,
				sessionKey,
				heartbeat: heartbeat ? { target: heartbeat.target } : void 0
			});
		},
		runCommandWithTimeout,
		formatNativeDependencyHint
	};
}
//#endregion
//#region src/plugins/runtime/index.ts
const loadTtsRuntime = createLazyRuntimeModule(() => import("./runtime-tts.runtime-BpOy9Yih.js"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("./runtime-media-understanding.runtime-BiReeUTr.js"));
const loadModelAuthRuntime = createLazyRuntimeModule(() => import("./runtime-model-auth.runtime-DmLPBuuZ.js"));
function createRuntimeTts() {
	const bindTtsRuntime = createLazyRuntimeMethodBinder(loadTtsRuntime);
	return {
		textToSpeech: bindTtsRuntime((runtime) => runtime.textToSpeech),
		textToSpeechTelephony: bindTtsRuntime((runtime) => runtime.textToSpeechTelephony),
		listVoices: bindTtsRuntime((runtime) => runtime.listSpeechVoices)
	};
}
function createRuntimeMediaUnderstandingFacade() {
	const bindMediaUnderstandingRuntime = createLazyRuntimeMethodBinder(loadMediaUnderstandingRuntime);
	return {
		runFile: bindMediaUnderstandingRuntime((runtime) => runtime.runMediaUnderstandingFile),
		describeImageFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFile),
		describeImageFileWithModel: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFileWithModel),
		describeVideoFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeVideoFile),
		transcribeAudioFile: bindMediaUnderstandingRuntime((runtime) => runtime.transcribeAudioFile)
	};
}
function createRuntimeModelAuth() {
	const getApiKeyForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getApiKeyForModel);
	const resolveApiKeyForProvider = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.resolveApiKeyForProvider);
	return {
		getApiKeyForModel: (params) => getApiKeyForModel({
			model: params.model,
			cfg: params.cfg
		}),
		resolveApiKeyForProvider: (params) => resolveApiKeyForProvider({
			provider: params.provider,
			cfg: params.cfg
		})
	};
}
function createUnavailableSubagentRuntime() {
	const unavailable = () => {
		throw new Error("Plugin runtime subagent methods are only available during a gateway request.");
	};
	return {
		run: unavailable,
		waitForRun: unavailable,
		getSessionMessages: unavailable,
		getSession: unavailable,
		deleteSession: unavailable
	};
}
const gatewaySubagentState = resolveGlobalSingleton(Symbol.for("openclaw.plugin.gatewaySubagentRuntime"), () => ({ subagent: void 0 }));
/**
* Set the process-global gateway subagent runtime.
* Called during gateway startup so that gateway-bindable plugin runtimes can
* resolve subagent methods dynamically even when their registry was cached
* before the gateway finished loading plugins.
*/
function setGatewaySubagentRuntime(subagent) {
	gatewaySubagentState.subagent = subagent;
}
/**
* Reset the process-global gateway subagent runtime.
* Used by tests to avoid leaking gateway state across module reloads.
*/
function clearGatewaySubagentRuntime() {
	gatewaySubagentState.subagent = void 0;
}
/**
* Create a late-binding subagent that resolves to:
* 1. An explicitly provided subagent (from runtimeOptions), OR
* 2. The process-global gateway subagent when the caller explicitly opts in, OR
* 3. The unavailable fallback (throws with a clear error message).
*/
function createLateBindingSubagent(explicit, allowGatewaySubagentBinding = false) {
	if (explicit) return explicit;
	const unavailable = createUnavailableSubagentRuntime();
	if (!allowGatewaySubagentBinding) return unavailable;
	return new Proxy(unavailable, { get(_target, prop, _receiver) {
		const resolved = gatewaySubagentState.subagent ?? unavailable;
		return Reflect.get(resolved, prop, resolved);
	} });
}
function createPluginRuntime(_options = {}) {
	const mediaUnderstanding = createRuntimeMediaUnderstandingFacade();
	const runtime = {
		version: VERSION,
		config: createRuntimeConfig(),
		agent: createRuntimeAgent(),
		subagent: createLateBindingSubagent(_options.subagent, _options.allowGatewaySubagentBinding === true),
		system: createRuntimeSystem(),
		media: createRuntimeMedia(),
		imageGeneration: {
			generate: generateImage,
			listProviders: listRuntimeImageGenerationProviders
		},
		webSearch: {
			listProviders: listWebSearchProviders,
			search: runWebSearch
		},
		channel: createRuntimeChannel(),
		events: createRuntimeEvents(),
		logging: createRuntimeLogging(),
		state: { resolveStateDir }
	};
	defineCachedValue(runtime, "tts", createRuntimeTts);
	defineCachedValue(runtime, "mediaUnderstanding", () => mediaUnderstanding);
	defineCachedValue(runtime, "stt", () => ({ transcribeAudioFile: mediaUnderstanding.transcribeAudioFile }));
	defineCachedValue(runtime, "modelAuth", createRuntimeModelAuth);
	return runtime;
}
//#endregion
export { startHeartbeatRunner as a, runHeartbeatOnce as i, createPluginRuntime as n, resolveCronSession as o, setGatewaySubagentRuntime as r, clearGatewaySubagentRuntime as t };
