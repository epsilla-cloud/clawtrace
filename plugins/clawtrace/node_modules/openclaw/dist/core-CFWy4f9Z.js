import "./subsystem-CJEvHE2o.js";
import { v as resolveUserPath } from "./utils-BfvDpbwh.js";
import "./paths-Y4UT24Of.js";
import { a as openVerifiedFileSync } from "./boundary-file-read-7v-hs51G.js";
import { t as getChatChannelMeta } from "./chat-meta-xAV2SRO1.js";
import { t as buildAccountScopedDmSecurityPolicy } from "./helpers-GKJz5Xrd.js";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-UJINc15Z.js";
import { n as emptyPluginConfigSchema } from "./config-schema-ChDT-7tK.js";
import "./delegate-CgOwM6KE.js";
import "./config-schema-DGr8UxxF.js";
import "./setup-helpers-D9SEfBub.js";
import "./typebox-D58sO6U5.js";
import { t as safeParseJsonWithSchema } from "./zod-parse-DgsspuWq.js";
import fsSync from "node:fs";
import { z } from "zod";
//#region src/channels/plugins/threading-helpers.ts
function createStaticReplyToModeResolver(mode) {
	return () => mode;
}
function createTopLevelChannelReplyToModeResolver(channelId) {
	return ({ cfg }) => {
		return (cfg.channels?.[channelId])?.replyToMode ?? "off";
	};
}
function createScopedAccountReplyToModeResolver(params) {
	return ({ cfg, accountId, chatType }) => params.resolveReplyToMode(params.resolveAccount(cfg, accountId), chatType) ?? params.fallback ?? "off";
}
//#endregion
//#region src/infra/secret-file.ts
const DEFAULT_SECRET_FILE_MAX_BYTES = 16 * 1024;
function normalizeSecretReadError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function loadSecretFileSync(filePath, label, options = {}) {
	const resolvedPath = resolveUserPath(filePath.trim());
	if (!resolvedPath) return {
		ok: false,
		message: `${label} file path is empty.`
	};
	const maxBytes = options.maxBytes ?? 16384;
	let previewStat;
	try {
		previewStat = fsSync.lstatSync(resolvedPath);
	} catch (error) {
		const normalized = normalizeSecretReadError(error);
		return {
			ok: false,
			resolvedPath,
			error: normalized,
			message: `Failed to inspect ${label} file at ${resolvedPath}: ${String(normalized)}`
		};
	}
	if (options.rejectSymlink && previewStat.isSymbolicLink()) return {
		ok: false,
		resolvedPath,
		message: `${label} file at ${resolvedPath} must not be a symlink.`
	};
	if (!previewStat.isFile()) return {
		ok: false,
		resolvedPath,
		message: `${label} file at ${resolvedPath} must be a regular file.`
	};
	if (previewStat.size > maxBytes) return {
		ok: false,
		resolvedPath,
		message: `${label} file at ${resolvedPath} exceeds ${maxBytes} bytes.`
	};
	const opened = openVerifiedFileSync({
		filePath: resolvedPath,
		rejectPathSymlink: options.rejectSymlink,
		maxBytes
	});
	if (!opened.ok) {
		const error = normalizeSecretReadError(opened.reason === "validation" ? /* @__PURE__ */ new Error("security validation failed") : opened.error);
		return {
			ok: false,
			resolvedPath,
			error,
			message: `Failed to read ${label} file at ${resolvedPath}: ${String(error)}`
		};
	}
	try {
		const secret = fsSync.readFileSync(opened.fd, "utf8").trim();
		if (!secret) return {
			ok: false,
			resolvedPath,
			message: `${label} file at ${resolvedPath} is empty.`
		};
		return {
			ok: true,
			secret,
			resolvedPath
		};
	} catch (error) {
		const normalized = normalizeSecretReadError(error);
		return {
			ok: false,
			resolvedPath,
			error: normalized,
			message: `Failed to read ${label} file at ${resolvedPath}: ${String(normalized)}`
		};
	} finally {
		fsSync.closeSync(opened.fd);
	}
}
function readSecretFileSync(filePath, label, options = {}) {
	const result = loadSecretFileSync(filePath, label, options);
	if (result.ok) return result.secret;
	throw new Error(result.message, result.error ? { cause: result.error } : void 0);
}
function tryReadSecretFileSync(filePath, label, options = {}) {
	if (!filePath?.trim()) return;
	const result = loadSecretFileSync(filePath, label, options);
	return result.ok ? result.secret : void 0;
}
//#endregion
//#region src/shared/gateway-bind-url.ts
function resolveGatewayBindUrl(params) {
	const bind = params.bind ?? "loopback";
	if (bind === "custom") {
		const host = params.customBindHost?.trim();
		if (host) return {
			url: `${params.scheme}://${host}:${params.port}`,
			source: "gateway.bind=custom"
		};
		return { error: "gateway.bind=custom requires gateway.customBindHost." };
	}
	if (bind === "tailnet") {
		const host = params.pickTailnetHost();
		if (host) return {
			url: `${params.scheme}://${host}:${params.port}`,
			source: "gateway.bind=tailnet"
		};
		return { error: "gateway.bind=tailnet set, but no tailnet IP was found." };
	}
	if (bind === "lan") {
		const host = params.pickLanHost();
		if (host) return {
			url: `${params.scheme}://${host}:${params.port}`,
			source: "gateway.bind=lan"
		};
		return { error: "gateway.bind=lan set, but no private LAN IP was found." };
	}
	return null;
}
//#endregion
//#region src/shared/tailscale-status.ts
const TAILSCALE_STATUS_COMMAND_CANDIDATES = ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
const TailscaleStatusSchema = z.object({ Self: z.object({
	DNSName: z.string().optional(),
	TailscaleIPs: z.array(z.string()).optional()
}).optional() });
function parsePossiblyNoisyStatus(raw) {
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start === -1 || end <= start) return null;
	return safeParseJsonWithSchema(TailscaleStatusSchema, raw.slice(start, end + 1));
}
function extractTailnetHostFromStatusJson(raw) {
	const parsed = parsePossiblyNoisyStatus(raw);
	const dns = parsed?.Self?.DNSName;
	if (dns && dns.length > 0) return dns.replace(/\.$/, "");
	const ips = parsed?.Self?.TailscaleIPs ?? [];
	return ips.length > 0 ? ips[0] ?? null : null;
}
async function resolveTailnetHostWithRunner(runCommandWithTimeout) {
	if (!runCommandWithTimeout) return null;
	for (const candidate of TAILSCALE_STATUS_COMMAND_CANDIDATES) try {
		const result = await runCommandWithTimeout([
			candidate,
			"status",
			"--json"
		], { timeoutMs: 5e3 });
		if (result.code !== 0) continue;
		const raw = result.stdout.trim();
		if (!raw) continue;
		const host = extractTailnetHostFromStatusJson(raw);
		if (host) return host;
	} catch {
		continue;
	}
	return null;
}
//#endregion
//#region src/plugin-sdk/core.ts
function createInlineTextPairingAdapter(params) {
	return {
		idLabel: params.idLabel,
		normalizeAllowEntry: params.normalizeAllowEntry,
		notifyApproval: async (ctx) => {
			await params.notify({
				...ctx,
				message: params.message
			});
		}
	};
}
/** Remove one of the known provider prefixes from a free-form target string. */
function stripChannelTargetPrefix(raw, ...providers) {
	const trimmed = raw.trim();
	for (const provider of providers) {
		const prefix = `${provider.toLowerCase()}:`;
		if (trimmed.toLowerCase().startsWith(prefix)) return trimmed.slice(prefix.length).trim();
	}
	return trimmed;
}
/** Remove generic target-kind prefixes such as `user:` or `group:`. */
function stripTargetKindPrefix(raw) {
	return raw.replace(/^(user|channel|group|conversation|room|dm):/i, "").trim();
}
/**
* Build the canonical outbound session route payload returned by channel
* message adapters.
*/
function buildChannelOutboundSessionRoute(params) {
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		peer: params.peer,
		chatType: params.chatType,
		from: params.from,
		to: params.to,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	};
}
/**
* Canonical entry helper for channel plugins.
*
* This wraps `definePluginEntry(...)`, registers the channel capability, and
* optionally exposes extra full-runtime registration such as tools or gateway
* handlers that only make sense outside setup-only registration modes.
*/
function defineChannelPluginEntry({ id, name, description, plugin, configSchema = emptyPluginConfigSchema, setRuntime, registerFull }) {
	return {
		id,
		name,
		description,
		configSchema: typeof configSchema === "function" ? configSchema() : configSchema,
		register(api) {
			setRuntime?.(api.runtime);
			api.registerChannel({ plugin });
			if (api.registrationMode !== "full") return;
			registerFull?.(api);
		},
		channelPlugin: plugin,
		...setRuntime ? { setChannelRuntime: setRuntime } : {}
	};
}
/**
* Minimal setup-entry helper for channels that ship a separate `setup-entry.ts`.
*
* The setup entry only needs to export `{ plugin }`, but using this helper
* keeps the shape explicit in examples and generated typings.
*/
function defineSetupPluginEntry(plugin) {
	return { plugin };
}
function createInlineAttachedChannelResultAdapter(params) {
	return {
		sendText: params.sendText ? async (ctx) => ({
			channel: params.channel,
			...await params.sendText(ctx)
		}) : void 0,
		sendMedia: params.sendMedia ? async (ctx) => ({
			channel: params.channel,
			...await params.sendMedia(ctx)
		}) : void 0,
		sendPoll: params.sendPoll ? async (ctx) => ({
			channel: params.channel,
			...await params.sendPoll(ctx)
		}) : void 0
	};
}
function resolveChatChannelSecurity(security) {
	if (!security) return;
	if (!("dm" in security)) return security;
	return {
		resolveDmPolicy: ({ cfg, accountId, account }) => buildAccountScopedDmSecurityPolicy({
			cfg,
			channelKey: security.dm.channelKey,
			accountId,
			fallbackAccountId: security.dm.resolveFallbackAccountId?.(account) ?? account.accountId,
			policy: security.dm.resolvePolicy(account),
			allowFrom: security.dm.resolveAllowFrom(account) ?? [],
			defaultPolicy: security.dm.defaultPolicy,
			allowFromPathSuffix: security.dm.allowFromPathSuffix,
			policyPathSuffix: security.dm.policyPathSuffix,
			approveChannelId: security.dm.approveChannelId,
			approveHint: security.dm.approveHint,
			normalizeEntry: security.dm.normalizeEntry
		}),
		...security.collectWarnings ? { collectWarnings: security.collectWarnings } : {}
	};
}
function resolveChatChannelPairing(pairing) {
	if (!pairing) return;
	if (!("text" in pairing)) return pairing;
	return createInlineTextPairingAdapter(pairing.text);
}
function resolveChatChannelThreading(threading) {
	if (!threading) return;
	if (!("topLevelReplyToMode" in threading) && !("scopedAccountReplyToMode" in threading)) return threading;
	let resolveReplyToMode;
	if ("topLevelReplyToMode" in threading) resolveReplyToMode = createTopLevelChannelReplyToModeResolver(threading.topLevelReplyToMode);
	else resolveReplyToMode = createScopedAccountReplyToModeResolver(threading.scopedAccountReplyToMode);
	return {
		...threading,
		resolveReplyToMode
	};
}
function resolveChatChannelOutbound(outbound) {
	if (!outbound) return;
	if (!("attachedResults" in outbound)) return outbound;
	return {
		...outbound.base,
		...createInlineAttachedChannelResultAdapter(outbound.attachedResults)
	};
}
function createChatChannelPlugin(params) {
	return {
		...params.base,
		conversationBindings: {
			supportsCurrentConversationBinding: true,
			...params.base.conversationBindings
		},
		...params.security ? { security: resolveChatChannelSecurity(params.security) } : {},
		...params.pairing ? { pairing: resolveChatChannelPairing(params.pairing) } : {},
		...params.threading ? { threading: resolveChatChannelThreading(params.threading) } : {},
		...params.outbound ? { outbound: resolveChatChannelOutbound(params.outbound) } : {}
	};
}
function createChannelPluginBase(params) {
	return {
		id: params.id,
		meta: {
			...getChatChannelMeta(params.id),
			...params.meta
		},
		...params.setupWizard ? { setupWizard: params.setupWizard } : {},
		...params.capabilities ? { capabilities: params.capabilities } : {},
		...params.agentPrompt ? { agentPrompt: params.agentPrompt } : {},
		...params.streaming ? { streaming: params.streaming } : {},
		...params.reload ? { reload: params.reload } : {},
		...params.gatewayMethods ? { gatewayMethods: params.gatewayMethods } : {},
		...params.configSchema ? { configSchema: params.configSchema } : {},
		...params.config ? { config: params.config } : {},
		...params.security ? { security: params.security } : {},
		...params.groups ? { groups: params.groups } : {},
		setup: params.setup
	};
}
//#endregion
export { defineSetupPluginEntry as a, resolveTailnetHostWithRunner as c, loadSecretFileSync as d, readSecretFileSync as f, createTopLevelChannelReplyToModeResolver as g, createStaticReplyToModeResolver as h, defineChannelPluginEntry as i, resolveGatewayBindUrl as l, createScopedAccountReplyToModeResolver as m, createChannelPluginBase as n, stripChannelTargetPrefix as o, tryReadSecretFileSync as p, createChatChannelPlugin as r, stripTargetKindPrefix as s, buildChannelOutboundSessionRoute as t, DEFAULT_SECRET_FILE_MAX_BYTES as u };
