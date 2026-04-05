import { t as getChannelPlugin } from "./plugins-BQ9CTy5q.js";
import { a as resolveIdentityName, r as resolveEffectiveMessagesConfig } from "./identity-DAzQ7qLa.js";
//#region src/auto-reply/reply/response-prefix-template.ts
const TEMPLATE_VAR_PATTERN = /\{([a-zA-Z][a-zA-Z0-9.]*)\}/g;
/**
* Interpolate template variables in a response prefix string.
*
* @param template - The template string with `{variable}` placeholders
* @param context - Context object with values for interpolation
* @returns The interpolated string, or undefined if template is undefined
*
* @example
* resolveResponsePrefixTemplate("[{model} | think:{thinkingLevel}]", {
*   model: "gpt-5.2",
*   thinkingLevel: "high"
* })
* // Returns: "[gpt-5.2 | think:high]"
*/
function resolveResponsePrefixTemplate(template, context) {
	if (!template) return;
	return template.replace(TEMPLATE_VAR_PATTERN, (match, varName) => {
		switch (varName.toLowerCase()) {
			case "model": return context.model ?? match;
			case "modelfull": return context.modelFull ?? match;
			case "provider": return context.provider ?? match;
			case "thinkinglevel":
			case "think": return context.thinkingLevel ?? match;
			case "identity.name":
			case "identityname": return context.identityName ?? match;
			default: return match;
		}
	});
}
/**
* Extract short model name from a full model string.
*
* Strips:
* - Provider prefix (e.g., "openai/" from "openai/gpt-5.2")
* - Date suffixes (e.g., "-20260205" from "claude-opus-4-6-20260205")
* - Common version suffixes (e.g., "-latest")
*
* @example
* extractShortModelName("openai-codex/gpt-5.2") // "gpt-5.2"
* extractShortModelName("claude-opus-4-6-20260205") // "claude-opus-4-6"
* extractShortModelName("gpt-5.2-latest") // "gpt-5.2"
*/
function extractShortModelName(fullModel) {
	const slash = fullModel.lastIndexOf("/");
	return (slash >= 0 ? fullModel.slice(slash + 1) : fullModel).replace(/-\d{8}$/, "").replace(/-latest$/, "");
}
//#endregion
//#region src/channels/reply-prefix.ts
function createReplyPrefixContext(params) {
	const { cfg, agentId } = params;
	const prefixContext = { identityName: resolveIdentityName(cfg, agentId) };
	const onModelSelected = (ctx) => {
		prefixContext.provider = ctx.provider;
		prefixContext.model = extractShortModelName(ctx.model);
		prefixContext.modelFull = `${ctx.provider}/${ctx.model}`;
		prefixContext.thinkingLevel = ctx.thinkLevel ?? "off";
	};
	return {
		prefixContext,
		responsePrefix: resolveEffectiveMessagesConfig(cfg, agentId, {
			channel: params.channel,
			accountId: params.accountId
		}).responsePrefix,
		enableSlackInteractiveReplies: params.channel ? getChannelPlugin(params.channel)?.messaging?.enableInteractiveReplies?.({
			cfg,
			accountId: params.accountId
		}) ?? void 0 : void 0,
		responsePrefixContextProvider: () => prefixContext,
		onModelSelected
	};
}
function createReplyPrefixOptions(params) {
	const { responsePrefix, enableSlackInteractiveReplies, responsePrefixContextProvider, onModelSelected } = createReplyPrefixContext(params);
	return {
		responsePrefix,
		enableSlackInteractiveReplies,
		responsePrefixContextProvider,
		onModelSelected
	};
}
//#endregion
//#region src/channels/typing-lifecycle.ts
function createTypingKeepaliveLoop(params) {
	let timer;
	let tickInFlight = false;
	const tick = async () => {
		if (tickInFlight) return;
		tickInFlight = true;
		try {
			await params.onTick();
		} finally {
			tickInFlight = false;
		}
	};
	const start = () => {
		if (params.intervalMs <= 0 || timer) return;
		timer = setInterval(() => {
			tick();
		}, params.intervalMs);
	};
	const stop = () => {
		if (!timer) return;
		clearInterval(timer);
		timer = void 0;
		tickInFlight = false;
	};
	const isRunning = () => timer !== void 0;
	return {
		tick,
		start,
		stop,
		isRunning
	};
}
//#endregion
//#region src/channels/typing-start-guard.ts
function createTypingStartGuard(params) {
	const maxConsecutiveFailures = typeof params.maxConsecutiveFailures === "number" && params.maxConsecutiveFailures > 0 ? Math.floor(params.maxConsecutiveFailures) : void 0;
	let consecutiveFailures = 0;
	let tripped = false;
	const isBlocked = () => {
		if (params.isSealed()) return true;
		if (tripped) return true;
		return params.shouldBlock?.() === true;
	};
	const run = async (start) => {
		if (isBlocked()) return "skipped";
		try {
			await start();
			consecutiveFailures = 0;
			return "started";
		} catch (err) {
			consecutiveFailures += 1;
			params.onStartError?.(err);
			if (params.rethrowOnError) throw err;
			if (maxConsecutiveFailures && consecutiveFailures >= maxConsecutiveFailures) {
				tripped = true;
				params.onTrip?.();
				return "tripped";
			}
			return "failed";
		}
	};
	return {
		run,
		reset: () => {
			consecutiveFailures = 0;
			tripped = false;
		},
		isTripped: () => tripped
	};
}
//#endregion
//#region src/channels/typing.ts
function createTypingCallbacks(params) {
	const stop = params.stop;
	const keepaliveIntervalMs = params.keepaliveIntervalMs ?? 3e3;
	const maxConsecutiveFailures = Math.max(1, params.maxConsecutiveFailures ?? 2);
	const maxDurationMs = params.maxDurationMs ?? 6e4;
	let stopSent = false;
	let closed = false;
	let ttlTimer;
	const startGuard = createTypingStartGuard({
		isSealed: () => closed,
		onStartError: params.onStartError,
		maxConsecutiveFailures,
		onTrip: () => {
			keepaliveLoop.stop();
		}
	});
	const fireStart = async () => {
		await startGuard.run(() => params.start());
	};
	const keepaliveLoop = createTypingKeepaliveLoop({
		intervalMs: keepaliveIntervalMs,
		onTick: fireStart
	});
	const startTtlTimer = () => {
		if (maxDurationMs <= 0) return;
		clearTtlTimer();
		ttlTimer = setTimeout(() => {
			if (!closed) {
				console.warn(`[typing] TTL exceeded (${maxDurationMs}ms), auto-stopping typing indicator`);
				fireStop();
			}
		}, maxDurationMs);
	};
	const clearTtlTimer = () => {
		if (ttlTimer) {
			clearTimeout(ttlTimer);
			ttlTimer = void 0;
		}
	};
	const onReplyStart = async () => {
		if (closed) return;
		stopSent = false;
		startGuard.reset();
		keepaliveLoop.stop();
		clearTtlTimer();
		await fireStart();
		if (startGuard.isTripped()) return;
		keepaliveLoop.start();
		startTtlTimer();
	};
	const fireStop = () => {
		closed = true;
		keepaliveLoop.stop();
		clearTtlTimer();
		if (!stop || stopSent) return;
		stopSent = true;
		stop().catch((err) => (params.onStopError ?? params.onStartError)(err));
	};
	return {
		onReplyStart,
		onIdle: fireStop,
		onCleanup: fireStop
	};
}
//#endregion
//#region src/plugin-sdk/channel-reply-pipeline.ts
function createChannelReplyPipeline(params) {
	return {
		...createReplyPrefixOptions({
			cfg: params.cfg,
			agentId: params.agentId,
			channel: params.channel,
			accountId: params.accountId
		}),
		...params.typingCallbacks ? { typingCallbacks: params.typingCallbacks } : params.typing ? { typingCallbacks: createTypingCallbacks(params.typing) } : {}
	};
}
//#endregion
export { createReplyPrefixContext as a, createTypingKeepaliveLoop as i, createTypingCallbacks as n, createReplyPrefixOptions as o, createTypingStartGuard as r, resolveResponsePrefixTemplate as s, createChannelReplyPipeline as t };
