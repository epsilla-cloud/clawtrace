import { BC as markdownToSignalTextChunks, EN as createScopedChannelMediaMaxBytesResolver, UI as resolveMarkdownTableMode, dC as sendMessageSignal, nI as resolveTextChunkLimit } from "../../auth-profiles-B5ypC5S-.js";
import { r as resolveOutboundSendDep } from "../../outbound-runtime-B03J2h4O.js";
import { i as createAttachedChannelResultAdapter, n as attachChannelToResults, t as attachChannelToResult } from "../../channel-send-result-RbMxgkKK.js";
//#region extensions/signal/src/outbound-adapter.ts
function resolveSignalSender(deps) {
	return resolveOutboundSendDep(deps, "signal") ?? sendMessageSignal;
}
const resolveSignalMaxBytes = createScopedChannelMediaMaxBytesResolver("signal");
function inferSignalTableMode(params) {
	return resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "signal",
		accountId: params.accountId ?? void 0
	});
}
const signalOutbound = {
	deliveryMode: "direct",
	chunker: (text, _limit) => text.split(/\n{2,}/).flatMap((chunk) => chunk ? [chunk] : []),
	chunkerMode: "text",
	textChunkLimit: 4e3,
	sendFormattedText: async ({ cfg, to, text, accountId, deps, abortSignal }) => {
		const send = resolveSignalSender(deps);
		const maxBytes = resolveSignalMaxBytes({
			cfg,
			accountId: accountId ?? void 0
		});
		const limit = resolveTextChunkLimit(cfg, "signal", accountId ?? void 0, { fallbackLimit: 4e3 });
		const tableMode = inferSignalTableMode({
			cfg,
			accountId
		});
		let chunks = limit === void 0 ? markdownToSignalTextChunks(text, Number.POSITIVE_INFINITY, { tableMode }) : markdownToSignalTextChunks(text, limit, { tableMode });
		if (chunks.length === 0 && text) chunks = [{
			text,
			styles: []
		}];
		const results = [];
		for (const chunk of chunks) {
			abortSignal?.throwIfAborted();
			const result = await send(to, chunk.text, {
				cfg,
				maxBytes,
				accountId: accountId ?? void 0,
				textMode: "plain",
				textStyles: chunk.styles
			});
			results.push(result);
		}
		return attachChannelToResults("signal", results);
	},
	sendFormattedMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, accountId, deps, abortSignal }) => {
		abortSignal?.throwIfAborted();
		const send = resolveSignalSender(deps);
		const maxBytes = resolveSignalMaxBytes({
			cfg,
			accountId: accountId ?? void 0
		});
		const tableMode = inferSignalTableMode({
			cfg,
			accountId
		});
		const formatted = markdownToSignalTextChunks(text, Number.POSITIVE_INFINITY, { tableMode })[0] ?? {
			text,
			styles: []
		};
		return attachChannelToResult("signal", await send(to, formatted.text, {
			cfg,
			mediaUrl,
			maxBytes,
			accountId: accountId ?? void 0,
			textMode: "plain",
			textStyles: formatted.styles,
			mediaLocalRoots
		}));
	},
	...createAttachedChannelResultAdapter({
		channel: "signal",
		sendText: async ({ cfg, to, text, accountId, deps }) => {
			return await resolveSignalSender(deps)(to, text, {
				cfg,
				maxBytes: resolveSignalMaxBytes({
					cfg,
					accountId: accountId ?? void 0
				}),
				accountId: accountId ?? void 0
			});
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, accountId, deps }) => {
			return await resolveSignalSender(deps)(to, text, {
				cfg,
				mediaUrl,
				maxBytes: resolveSignalMaxBytes({
					cfg,
					accountId: accountId ?? void 0
				}),
				accountId: accountId ?? void 0,
				mediaLocalRoots
			});
		}
	})
};
//#endregion
export { signalOutbound };
