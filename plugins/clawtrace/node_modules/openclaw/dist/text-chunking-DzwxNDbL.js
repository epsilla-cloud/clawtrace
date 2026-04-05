import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
//#region src/shared/text-chunking.ts
function chunkTextByBreakResolver(text, limit, resolveBreakIndex) {
	if (!text) return [];
	if (limit <= 0 || text.length <= limit) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > limit) {
		const candidateBreak = resolveBreakIndex(remaining.slice(0, limit));
		const breakIdx = Number.isFinite(candidateBreak) && candidateBreak > 0 && candidateBreak <= limit ? candidateBreak : limit;
		const chunk = remaining.slice(0, breakIdx).trimEnd();
		if (chunk.length > 0) chunks.push(chunk);
		const brokeOnSeparator = breakIdx < remaining.length && /\s/.test(remaining[breakIdx]);
		const nextStart = Math.min(remaining.length, breakIdx + (brokeOnSeparator ? 1 : 0));
		remaining = remaining.slice(nextStart).trimStart();
	}
	if (remaining.length) chunks.push(remaining);
	return chunks;
}
//#endregion
//#region src/channels/plugins/media-limits.ts
const MB = 1024 * 1024;
function resolveChannelMediaMaxBytes(params) {
	const accountId = normalizeAccountId(params.accountId);
	const channelLimit = params.resolveChannelLimitMb({
		cfg: params.cfg,
		accountId
	});
	if (channelLimit) return channelLimit * MB;
	if (params.cfg.agents?.defaults?.mediaMaxMb) return params.cfg.agents.defaults.mediaMaxMb * MB;
}
//#endregion
//#region src/plugin-sdk/inbound-envelope.ts
/** Create an envelope formatter bound to one resolved route and session store. */
function createInboundEnvelopeBuilder(params) {
	const storePath = params.resolveStorePath(params.sessionStore, { agentId: params.route.agentId });
	const envelopeOptions = params.resolveEnvelopeFormatOptions(params.cfg);
	return (input) => {
		const previousTimestamp = params.readSessionUpdatedAt({
			storePath,
			sessionKey: params.route.sessionKey
		});
		return {
			storePath,
			body: params.formatAgentEnvelope({
				channel: input.channel,
				from: input.from,
				timestamp: input.timestamp,
				previousTimestamp,
				envelope: envelopeOptions,
				body: input.body
			})
		};
	};
}
/** Resolve a route first, then return both the route and a formatter for future inbound messages. */
function resolveInboundRouteEnvelopeBuilder(params) {
	const route = params.resolveAgentRoute({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	return {
		route,
		buildEnvelope: createInboundEnvelopeBuilder({
			cfg: params.cfg,
			route,
			sessionStore: params.sessionStore,
			resolveStorePath: params.resolveStorePath,
			readSessionUpdatedAt: params.readSessionUpdatedAt,
			resolveEnvelopeFormatOptions: params.resolveEnvelopeFormatOptions,
			formatAgentEnvelope: params.formatAgentEnvelope
		})
	};
}
/** Runtime-driven variant of inbound envelope resolution for plugins that already expose grouped helpers. */
function resolveInboundRouteEnvelopeBuilderWithRuntime(params) {
	return resolveInboundRouteEnvelopeBuilder({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer,
		resolveAgentRoute: (routeParams) => params.runtime.routing.resolveAgentRoute(routeParams),
		sessionStore: params.sessionStore,
		resolveStorePath: params.runtime.session.resolveStorePath,
		readSessionUpdatedAt: params.runtime.session.readSessionUpdatedAt,
		resolveEnvelopeFormatOptions: params.runtime.reply.resolveEnvelopeFormatOptions,
		formatAgentEnvelope: params.runtime.reply.formatAgentEnvelope
	});
}
//#endregion
//#region src/channels/mention-gating.ts
function resolveMentionGating(params) {
	const implicit = params.implicitMention === true;
	const bypass = params.shouldBypassMention === true;
	const effectiveWasMentioned = params.wasMentioned || implicit || bypass;
	return {
		effectiveWasMentioned,
		shouldSkip: params.requireMention && params.canDetectMention && !effectiveWasMentioned
	};
}
function resolveMentionGatingWithBypass(params) {
	const shouldBypassMention = params.isGroup && params.requireMention && !params.wasMentioned && !(params.hasAnyMention ?? false) && params.allowTextCommands && params.commandAuthorized && params.hasControlCommand;
	return {
		...resolveMentionGating({
			requireMention: params.requireMention,
			canDetectMention: params.canDetectMention,
			wasMentioned: params.wasMentioned,
			implicitMention: params.implicitMention,
			shouldBypassMention
		}),
		shouldBypassMention
	};
}
//#endregion
//#region src/plugin-sdk/text-chunking.ts
/** Chunk outbound text while preferring newline boundaries over spaces. */
function chunkTextForOutbound(text, limit) {
	return chunkTextByBreakResolver(text, limit, (window) => {
		const lastNewline = window.lastIndexOf("\n");
		const lastSpace = window.lastIndexOf(" ");
		return lastNewline > 0 ? lastNewline : lastSpace;
	});
}
//#endregion
export { resolveChannelMediaMaxBytes as a, resolveInboundRouteEnvelopeBuilderWithRuntime as i, resolveMentionGating as n, chunkTextByBreakResolver as o, resolveMentionGatingWithBypass as r, chunkTextForOutbound as t };
