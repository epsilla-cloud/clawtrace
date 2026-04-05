//#region src/channels/logging.ts
function logInboundDrop(params) {
	const target = params.target ? ` target=${params.target}` : "";
	params.log(`${params.channel}: drop ${params.reason}${target}`);
}
function logTypingFailure(params) {
	const target = params.target ? ` target=${params.target}` : "";
	const action = params.action ? ` action=${params.action}` : "";
	params.log(`${params.channel} typing${action} failed${target}: ${String(params.error)}`);
}
function logAckFailure(params) {
	const target = params.target ? ` target=${params.target}` : "";
	params.log(`${params.channel} ack cleanup failed${target}: ${String(params.error)}`);
}
//#endregion
//#region src/channels/status-reactions.ts
const DEFAULT_EMOJIS = {
	queued: "👀",
	thinking: "🤔",
	tool: "🔥",
	coding: "👨‍💻",
	web: "⚡",
	done: "👍",
	error: "😱",
	stallSoft: "🥱",
	stallHard: "😨",
	compacting: "✍"
};
const DEFAULT_TIMING = {
	debounceMs: 700,
	stallSoftMs: 1e4,
	stallHardMs: 3e4,
	doneHoldMs: 1500,
	errorHoldMs: 2500
};
const CODING_TOOL_TOKENS = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"session_status",
	"bash"
];
const WEB_TOOL_TOKENS = [
	"web_search",
	"web-search",
	"web_fetch",
	"web-fetch",
	"browser"
];
/**
* Resolve the appropriate emoji for a tool invocation.
*/
function resolveToolEmoji(toolName, emojis) {
	const normalized = toolName?.trim().toLowerCase() ?? "";
	if (!normalized) return emojis.tool;
	if (WEB_TOOL_TOKENS.some((token) => normalized.includes(token))) return emojis.web;
	if (CODING_TOOL_TOKENS.some((token) => normalized.includes(token))) return emojis.coding;
	return emojis.tool;
}
/**
* Create a status reaction controller.
*
* Features:
* - Promise chain serialization (prevents concurrent API calls)
* - Debouncing (intermediate states debounce, terminal states are immediate)
* - Stall timers (soft/hard warnings on inactivity)
* - Terminal state protection (done/error mark finished, subsequent updates ignored)
*/
function createStatusReactionController(params) {
	const { enabled, adapter, initialEmoji, onError } = params;
	const emojis = {
		...DEFAULT_EMOJIS,
		queued: params.emojis?.queued ?? initialEmoji,
		...params.emojis
	};
	const timing = {
		...DEFAULT_TIMING,
		...params.timing
	};
	let currentEmoji = "";
	let pendingEmoji = "";
	let debounceTimer = null;
	let stallSoftTimer = null;
	let stallHardTimer = null;
	let finished = false;
	let chainPromise = Promise.resolve();
	const knownEmojis = new Set([
		initialEmoji,
		emojis.queued,
		emojis.thinking,
		emojis.tool,
		emojis.coding,
		emojis.web,
		emojis.done,
		emojis.error,
		emojis.stallSoft,
		emojis.stallHard,
		emojis.compacting
	]);
	/**
	* Serialize async operations to prevent race conditions.
	*/
	function enqueue(fn) {
		chainPromise = chainPromise.then(fn, fn);
		return chainPromise;
	}
	/**
	* Clear all timers.
	*/
	function clearAllTimers() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		if (stallSoftTimer) {
			clearTimeout(stallSoftTimer);
			stallSoftTimer = null;
		}
		if (stallHardTimer) {
			clearTimeout(stallHardTimer);
			stallHardTimer = null;
		}
	}
	/**
	* Clear debounce timer only (used during phase transitions).
	*/
	function clearDebounceTimer() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
	}
	/**
	* Reset stall timers (called on each phase change).
	*/
	function resetStallTimers() {
		if (stallSoftTimer) clearTimeout(stallSoftTimer);
		if (stallHardTimer) clearTimeout(stallHardTimer);
		stallSoftTimer = setTimeout(() => {
			scheduleEmoji(emojis.stallSoft, {
				immediate: true,
				skipStallReset: true
			});
		}, timing.stallSoftMs);
		stallHardTimer = setTimeout(() => {
			scheduleEmoji(emojis.stallHard, {
				immediate: true,
				skipStallReset: true
			});
		}, timing.stallHardMs);
	}
	/**
	* Apply an emoji: set new reaction and optionally remove old one.
	*/
	async function applyEmoji(newEmoji) {
		if (!enabled) return;
		try {
			const previousEmoji = currentEmoji;
			await adapter.setReaction(newEmoji);
			if (adapter.removeReaction && previousEmoji && previousEmoji !== newEmoji) await adapter.removeReaction(previousEmoji);
			currentEmoji = newEmoji;
		} catch (err) {
			if (onError) onError(err);
		}
	}
	/**
	* Schedule an emoji change (debounced or immediate).
	*/
	function scheduleEmoji(emoji, options = {}) {
		if (!enabled || finished) return;
		if (emoji === currentEmoji || emoji === pendingEmoji) {
			if (!options.skipStallReset) resetStallTimers();
			return;
		}
		pendingEmoji = emoji;
		clearDebounceTimer();
		if (options.immediate) enqueue(async () => {
			await applyEmoji(emoji);
			pendingEmoji = "";
		});
		else debounceTimer = setTimeout(() => {
			enqueue(async () => {
				await applyEmoji(emoji);
				pendingEmoji = "";
			});
		}, timing.debounceMs);
		if (!options.skipStallReset) resetStallTimers();
	}
	function setQueued() {
		scheduleEmoji(emojis.queued, { immediate: true });
	}
	function setThinking() {
		scheduleEmoji(emojis.thinking);
	}
	function setTool(toolName) {
		scheduleEmoji(resolveToolEmoji(toolName, emojis));
	}
	function setCompacting() {
		scheduleEmoji(emojis.compacting);
	}
	function cancelPending() {
		clearDebounceTimer();
		pendingEmoji = "";
	}
	function finishWithEmoji(emoji) {
		if (!enabled) return Promise.resolve();
		finished = true;
		clearAllTimers();
		return enqueue(async () => {
			await applyEmoji(emoji);
			pendingEmoji = "";
		});
	}
	function setDone() {
		return finishWithEmoji(emojis.done);
	}
	function setError() {
		return finishWithEmoji(emojis.error);
	}
	async function clear() {
		if (!enabled) return;
		clearAllTimers();
		finished = true;
		await enqueue(async () => {
			if (adapter.removeReaction) {
				const emojisToRemove = Array.from(knownEmojis);
				for (const emoji of emojisToRemove) try {
					await adapter.removeReaction(emoji);
				} catch (err) {
					if (onError) onError(err);
				}
			}
			currentEmoji = "";
			pendingEmoji = "";
		});
	}
	async function restoreInitial() {
		if (!enabled) return;
		clearAllTimers();
		await enqueue(async () => {
			await applyEmoji(initialEmoji);
			pendingEmoji = "";
		});
	}
	return {
		setQueued,
		setThinking,
		setTool,
		setCompacting,
		cancelPending,
		setDone,
		setError,
		clear,
		restoreInitial
	};
}
//#endregion
export { createStatusReactionController as a, logInboundDrop as c, WEB_TOOL_TOKENS as i, logTypingFailure as l, DEFAULT_EMOJIS as n, resolveToolEmoji as o, DEFAULT_TIMING as r, logAckFailure as s, CODING_TOOL_TOKENS as t };
