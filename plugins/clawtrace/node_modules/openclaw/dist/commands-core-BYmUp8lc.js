import { DP as getGlobalHookRunner, oN as resolveSendPolicy, wC as resetConfiguredBindingTargetInPlace } from "./auth-profiles-B5ypC5S-.js";
import { u as resolveAgentIdFromSessionKey, x as isAcpSessionKey } from "./session-key-BhxcMJEE.js";
import { r as logVerbose } from "./globals-0H99T-Tx.js";
import { n as createInternalHookEvent, p as triggerInternalHook } from "./internal-hooks-Bsi5ta6U.js";
import { y as shouldHandleTextCommands } from "./commands-registry-OqaQyye7.js";
import { n as resolveBoundAcpThreadSessionKey } from "./targets-BLKeVQj1.js";
import fs from "node:fs/promises";
//#region src/auto-reply/reply/commands-core.ts
let routeReplyRuntimePromise = null;
let commandHandlersRuntimePromise = null;
function loadRouteReplyRuntime() {
	routeReplyRuntimePromise ??= import("./route-reply.runtime-B4yx5mC2.js");
	return routeReplyRuntimePromise;
}
function loadCommandHandlersRuntime() {
	commandHandlersRuntimePromise ??= import("./commands-handlers.runtime-BwcRLsd3.js");
	return commandHandlersRuntimePromise;
}
let HANDLERS = null;
async function emitResetCommandHooks(params) {
	const hookEvent = createInternalHookEvent("command", params.action, params.sessionKey ?? "", {
		sessionEntry: params.sessionEntry,
		previousSessionEntry: params.previousSessionEntry,
		commandSource: params.command.surface,
		senderId: params.command.senderId,
		workspaceDir: params.workspaceDir,
		cfg: params.cfg
	});
	await triggerInternalHook(hookEvent);
	params.command.resetHookTriggered = true;
	if (hookEvent.messages.length > 0) {
		const channel = params.ctx.OriginatingChannel || params.command.channel;
		const to = params.ctx.OriginatingTo || params.command.from || params.command.to;
		if (channel && to) {
			const { routeReply } = await loadRouteReplyRuntime();
			await routeReply({
				payload: { text: hookEvent.messages.join("\n\n") },
				channel,
				to,
				sessionKey: params.sessionKey,
				accountId: params.ctx.AccountId,
				threadId: params.ctx.MessageThreadId,
				cfg: params.cfg
			});
		}
	}
	const hookRunner = getGlobalHookRunner();
	if (hookRunner?.hasHooks("before_reset")) {
		const prevEntry = params.previousSessionEntry;
		const sessionFile = prevEntry?.sessionFile;
		(async () => {
			try {
				const messages = [];
				if (sessionFile) {
					const content = await fs.readFile(sessionFile, "utf-8");
					for (const line of content.split("\n")) {
						if (!line.trim()) continue;
						try {
							const entry = JSON.parse(line);
							if (entry.type === "message" && entry.message) messages.push(entry.message);
						} catch {}
					}
				} else logVerbose("before_reset: no session file available, firing hook with empty messages");
				await hookRunner.runBeforeReset({
					sessionFile,
					messages,
					reason: params.action
				}, {
					agentId: resolveAgentIdFromSessionKey(params.sessionKey),
					sessionKey: params.sessionKey,
					sessionId: prevEntry?.sessionId,
					workspaceDir: params.workspaceDir
				});
			} catch (err) {
				logVerbose(`before_reset hook failed: ${String(err)}`);
			}
		})();
	}
}
function applyAcpResetTailContext(ctx, resetTail) {
	const mutableCtx = ctx;
	mutableCtx.Body = resetTail;
	mutableCtx.RawBody = resetTail;
	mutableCtx.CommandBody = resetTail;
	mutableCtx.BodyForCommands = resetTail;
	mutableCtx.BodyForAgent = resetTail;
	mutableCtx.BodyStripped = resetTail;
	mutableCtx.AcpDispatchTailAfterReset = true;
}
function resolveSessionEntryForHookSessionKey(sessionStore, sessionKey) {
	if (!sessionStore) return;
	const directEntry = sessionStore[sessionKey];
	if (directEntry) return directEntry;
	const normalizedTarget = sessionKey.trim().toLowerCase();
	if (!normalizedTarget) return;
	for (const [candidateKey, candidateEntry] of Object.entries(sessionStore)) if (candidateKey.trim().toLowerCase() === normalizedTarget) return candidateEntry;
}
async function handleCommands(params) {
	if (HANDLERS === null) HANDLERS = (await loadCommandHandlersRuntime()).loadCommandHandlers();
	const resetMatch = params.command.commandBodyNormalized.match(/^\/(new|reset)(?:\s|$)/);
	const resetRequested = Boolean(resetMatch);
	if (resetRequested && !params.command.isAuthorizedSender) {
		logVerbose(`Ignoring /reset from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return { shouldContinue: false };
	}
	if (resetRequested && params.command.isAuthorizedSender) {
		const commandAction = resetMatch?.[1] === "reset" ? "reset" : "new";
		const resetTail = resetMatch != null ? params.command.commandBodyNormalized.slice(resetMatch[0].length).trimStart() : "";
		const boundAcpSessionKey = resolveBoundAcpThreadSessionKey(params);
		const boundAcpKey = boundAcpSessionKey && isAcpSessionKey(boundAcpSessionKey) ? boundAcpSessionKey.trim() : void 0;
		if (boundAcpKey) {
			const resetResult = await resetConfiguredBindingTargetInPlace({
				cfg: params.cfg,
				sessionKey: boundAcpKey,
				reason: commandAction
			});
			if (!resetResult.ok && !resetResult.skipped) logVerbose(`acp reset-in-place failed for ${boundAcpKey}: ${resetResult.error ?? "unknown error"}`);
			if (resetResult.ok) {
				const hookSessionEntry = boundAcpKey === params.sessionKey ? params.sessionEntry : resolveSessionEntryForHookSessionKey(params.sessionStore, boundAcpKey);
				const hookPreviousSessionEntry = boundAcpKey === params.sessionKey ? params.previousSessionEntry : resolveSessionEntryForHookSessionKey(params.sessionStore, boundAcpKey);
				await emitResetCommandHooks({
					action: commandAction,
					ctx: params.ctx,
					cfg: params.cfg,
					command: params.command,
					sessionKey: boundAcpKey,
					sessionEntry: hookSessionEntry,
					previousSessionEntry: hookPreviousSessionEntry,
					workspaceDir: params.workspaceDir
				});
				if (resetTail) {
					applyAcpResetTailContext(params.ctx, resetTail);
					if (params.rootCtx && params.rootCtx !== params.ctx) applyAcpResetTailContext(params.rootCtx, resetTail);
					return { shouldContinue: false };
				}
				return {
					shouldContinue: false,
					reply: { text: "✅ ACP session reset in place." }
				};
			}
			if (resetResult.skipped) return {
				shouldContinue: false,
				reply: { text: "⚠️ ACP session reset unavailable for this bound conversation. Rebind with /acp bind or /acp spawn." }
			};
			return {
				shouldContinue: false,
				reply: { text: "⚠️ ACP session reset failed. Check /acp status and try again." }
			};
		}
		await emitResetCommandHooks({
			action: commandAction,
			ctx: params.ctx,
			cfg: params.cfg,
			command: params.command,
			sessionKey: params.sessionKey,
			sessionEntry: params.sessionEntry,
			previousSessionEntry: params.previousSessionEntry,
			workspaceDir: params.workspaceDir
		});
	}
	const allowTextCommands = shouldHandleTextCommands({
		cfg: params.cfg,
		surface: params.command.surface,
		commandSource: params.ctx.CommandSource
	});
	for (const handler of HANDLERS) {
		const result = await handler(params, allowTextCommands);
		if (result) return result;
	}
	if (resolveSendPolicy({
		cfg: params.cfg,
		entry: params.sessionEntry,
		sessionKey: params.sessionKey,
		channel: params.sessionEntry?.channel ?? params.command.channel,
		chatType: params.sessionEntry?.chatType
	}) === "deny") {
		logVerbose(`Send blocked by policy for session ${params.sessionKey ?? "unknown"}`);
		return { shouldContinue: false };
	}
	return { shouldContinue: true };
}
//#endregion
export { handleCommands as n, emitResetCommandHooks as t };
