//#region src/channels/draft-stream-loop.ts
function createDraftStreamLoop(params) {
	let lastSentAt = 0;
	let pendingText = "";
	let inFlightPromise;
	let timer;
	const flush = async () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		while (!params.isStopped()) {
			if (inFlightPromise) {
				await inFlightPromise;
				continue;
			}
			const text = pendingText;
			if (!text.trim()) {
				pendingText = "";
				return;
			}
			pendingText = "";
			const current = params.sendOrEditStreamMessage(text).finally(() => {
				if (inFlightPromise === current) inFlightPromise = void 0;
			});
			inFlightPromise = current;
			if (await current === false) {
				pendingText = text;
				return;
			}
			lastSentAt = Date.now();
			if (!pendingText) return;
		}
	};
	const schedule = () => {
		if (timer) return;
		const delay = Math.max(0, params.throttleMs - (Date.now() - lastSentAt));
		timer = setTimeout(() => {
			flush();
		}, delay);
	};
	return {
		update: (text) => {
			if (params.isStopped()) return;
			pendingText = text;
			if (inFlightPromise) {
				schedule();
				return;
			}
			if (!timer && Date.now() - lastSentAt >= params.throttleMs) {
				flush();
				return;
			}
			schedule();
		},
		flush,
		stop: () => {
			pendingText = "";
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		},
		resetPending: () => {
			pendingText = "";
		},
		resetThrottleWindow: () => {
			lastSentAt = 0;
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		},
		waitForInFlight: async () => {
			if (inFlightPromise) await inFlightPromise;
		}
	};
}
//#endregion
//#region src/channels/draft-stream-controls.ts
function createFinalizableDraftStreamControls(params) {
	const loop = createDraftStreamLoop({
		throttleMs: params.throttleMs,
		isStopped: params.isStopped,
		sendOrEditStreamMessage: params.sendOrEditStreamMessage
	});
	const update = (text) => {
		if (params.isStopped() || params.isFinal()) return;
		loop.update(text);
	};
	const stop = async () => {
		params.markFinal();
		await loop.flush();
	};
	const stopForClear = async () => {
		params.markStopped();
		loop.stop();
		await loop.waitForInFlight();
	};
	return {
		loop,
		update,
		stop,
		stopForClear
	};
}
function createFinalizableDraftStreamControlsForState(params) {
	return createFinalizableDraftStreamControls({
		throttleMs: params.throttleMs,
		isStopped: () => params.state.stopped,
		isFinal: () => params.state.final,
		markStopped: () => {
			params.state.stopped = true;
		},
		markFinal: () => {
			params.state.final = true;
		},
		sendOrEditStreamMessage: params.sendOrEditStreamMessage
	});
}
async function takeMessageIdAfterStop(params) {
	await params.stopForClear();
	const messageId = params.readMessageId();
	params.clearMessageId();
	return messageId;
}
async function clearFinalizableDraftMessage(params) {
	const messageId = await takeMessageIdAfterStop({
		stopForClear: params.stopForClear,
		readMessageId: params.readMessageId,
		clearMessageId: params.clearMessageId
	});
	if (!params.isValidMessageId(messageId)) return;
	try {
		await params.deleteMessage(messageId);
		params.onDeleteSuccess?.(messageId);
	} catch (err) {
		params.warn?.(`${params.warnPrefix}: ${err instanceof Error ? err.message : String(err)}`);
	}
}
function createFinalizableDraftLifecycle(params) {
	const controls = createFinalizableDraftStreamControlsForState({
		throttleMs: params.throttleMs,
		state: params.state,
		sendOrEditStreamMessage: params.sendOrEditStreamMessage
	});
	const clear = async () => {
		await clearFinalizableDraftMessage({
			stopForClear: controls.stopForClear,
			readMessageId: params.readMessageId,
			clearMessageId: params.clearMessageId,
			isValidMessageId: params.isValidMessageId,
			deleteMessage: params.deleteMessage,
			onDeleteSuccess: params.onDeleteSuccess,
			warn: params.warn,
			warnPrefix: params.warnPrefix
		});
	};
	return {
		...controls,
		clear
	};
}
//#endregion
//#region src/channels/run-state-machine.ts
const DEFAULT_RUN_ACTIVITY_HEARTBEAT_MS = 6e4;
function createRunStateMachine(params) {
	const heartbeatMs = params.heartbeatMs ?? DEFAULT_RUN_ACTIVITY_HEARTBEAT_MS;
	const now = params.now ?? Date.now;
	let activeRuns = 0;
	let runActivityHeartbeat = null;
	let lifecycleActive = !params.abortSignal?.aborted;
	const publish = () => {
		if (!lifecycleActive) return;
		params.setStatus?.({
			activeRuns,
			busy: activeRuns > 0,
			lastRunActivityAt: now()
		});
	};
	const clearHeartbeat = () => {
		if (!runActivityHeartbeat) return;
		clearInterval(runActivityHeartbeat);
		runActivityHeartbeat = null;
	};
	const ensureHeartbeat = () => {
		if (runActivityHeartbeat || activeRuns <= 0 || !lifecycleActive) return;
		runActivityHeartbeat = setInterval(() => {
			if (!lifecycleActive || activeRuns <= 0) {
				clearHeartbeat();
				return;
			}
			publish();
		}, heartbeatMs);
		runActivityHeartbeat.unref?.();
	};
	const deactivate = () => {
		lifecycleActive = false;
		clearHeartbeat();
	};
	const onAbort = () => {
		deactivate();
	};
	if (params.abortSignal?.aborted) onAbort();
	else params.abortSignal?.addEventListener("abort", onAbort, { once: true });
	if (lifecycleActive) params.setStatus?.({
		activeRuns: 0,
		busy: false
	});
	return {
		isActive() {
			return lifecycleActive;
		},
		onRunStart() {
			activeRuns += 1;
			publish();
			ensureHeartbeat();
		},
		onRunEnd() {
			activeRuns = Math.max(0, activeRuns - 1);
			if (activeRuns <= 0) clearHeartbeat();
			publish();
		},
		deactivate
	};
}
//#endregion
//#region src/channels/transport/stall-watchdog.ts
function createArmableStallWatchdog(params) {
	const timeoutMs = Math.max(1, Math.floor(params.timeoutMs));
	const checkIntervalMs = Math.max(100, Math.floor(params.checkIntervalMs ?? Math.min(5e3, Math.max(250, timeoutMs / 6))));
	let armed = false;
	let stopped = false;
	let lastActivityAt = Date.now();
	let timer = null;
	const clearTimer = () => {
		if (!timer) return;
		clearInterval(timer);
		timer = null;
	};
	const disarm = () => {
		armed = false;
	};
	const stop = () => {
		if (stopped) return;
		stopped = true;
		disarm();
		clearTimer();
		params.abortSignal?.removeEventListener("abort", stop);
	};
	const arm = (atMs) => {
		if (stopped) return;
		lastActivityAt = atMs ?? Date.now();
		armed = true;
	};
	const touch = (atMs) => {
		if (stopped) return;
		lastActivityAt = atMs ?? Date.now();
	};
	const check = () => {
		if (!armed || stopped) return;
		const idleMs = Date.now() - lastActivityAt;
		if (idleMs < timeoutMs) return;
		disarm();
		params.runtime?.error?.(`[${params.label}] transport watchdog timeout: idle ${Math.round(idleMs / 1e3)}s (limit ${Math.round(timeoutMs / 1e3)}s)`);
		params.onTimeout({
			idleMs,
			timeoutMs
		});
	};
	if (params.abortSignal?.aborted) stop();
	else {
		params.abortSignal?.addEventListener("abort", stop, { once: true });
		timer = setInterval(check, checkIntervalMs);
		timer.unref?.();
	}
	return {
		arm,
		touch,
		disarm,
		stop,
		isArmed: () => armed
	};
}
//#endregion
//#region src/plugin-sdk/channel-lifecycle.ts
/** Bind a fixed account id into a status writer so lifecycle code can emit partial snapshots. */
function createAccountStatusSink(params) {
	return (patch) => {
		params.setStatus({
			accountId: params.accountId,
			...patch
		});
	};
}
/**
* Return a promise that resolves when the signal is aborted.
*
* If no signal is provided, the promise stays pending forever. When provided,
* `onAbort` runs once before the promise resolves.
*/
function waitUntilAbort(signal, onAbort) {
	return new Promise((resolve, reject) => {
		const complete = () => {
			Promise.resolve(onAbort?.()).then(() => resolve(), reject);
		};
		if (!signal) return;
		if (signal.aborted) {
			complete();
			return;
		}
		signal.addEventListener("abort", complete, { once: true });
	});
}
/**
* Keep a passive account task alive until abort, then run optional cleanup.
*/
async function runPassiveAccountLifecycle(params) {
	const handle = await params.start();
	try {
		await waitUntilAbort(params.abortSignal);
	} finally {
		await params.stop?.(handle);
		await params.onStop?.();
	}
}
/**
* Keep a channel/provider task pending until the HTTP server closes.
*
* When an abort signal is provided, `onAbort` is invoked once and should
* trigger server shutdown. The returned promise resolves only after `close`.
*/
async function keepHttpServerTaskAlive(params) {
	const { server, abortSignal, onAbort } = params;
	let abortTask = Promise.resolve();
	let abortTriggered = false;
	const triggerAbort = () => {
		if (abortTriggered) return;
		abortTriggered = true;
		abortTask = Promise.resolve(onAbort?.()).then(() => void 0);
	};
	const onAbortSignal = () => {
		triggerAbort();
	};
	if (abortSignal) if (abortSignal.aborted) triggerAbort();
	else abortSignal.addEventListener("abort", onAbortSignal, { once: true });
	await new Promise((resolve) => {
		server.once("close", () => resolve());
	});
	if (abortSignal) abortSignal.removeEventListener("abort", onAbortSignal);
	await abortTask;
}
//#endregion
export { createArmableStallWatchdog as a, createFinalizableDraftLifecycle as c, takeMessageIdAfterStop as d, createDraftStreamLoop as f, waitUntilAbort as i, createFinalizableDraftStreamControls as l, keepHttpServerTaskAlive as n, createRunStateMachine as o, runPassiveAccountLifecycle as r, clearFinalizableDraftMessage as s, createAccountStatusSink as t, createFinalizableDraftStreamControlsForState as u };
