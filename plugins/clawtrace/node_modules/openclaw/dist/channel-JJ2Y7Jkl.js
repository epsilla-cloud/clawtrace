import { Jj as dispatchInboundDirectDmWithRuntime, Yj as resolveInboundDirectDmAccessWithRuntime, qj as createPreCryptoDirectDmAuthorizer } from "./auth-profiles-B5ypC5S-.js";
import { g as DEFAULT_ACCOUNT_ID } from "./session-key-BhxcMJEE.js";
import { n as formatPairingApproveHint } from "./helpers-GKJz5Xrd.js";
import { o as stripChannelTargetPrefix, r as createChatChannelPlugin, t as buildChannelOutboundSessionRoute } from "./core-CFWy4f9Z.js";
import { r as buildChannelConfigSchema } from "./config-schema-DGr8UxxF.js";
import { n as describeAccountSnapshot } from "./account-helpers-DklgKoS9.js";
import { d as createTopLevelChannelConfigAdapter, u as createScopedDmSecurityResolver } from "./channel-config-helpers-pbEU_d5U.js";
import { n as createChannelPairingController } from "./channel-pairing-cpi9_8zd.js";
import { c as collectStatusIssuesFromLastError, d as createDefaultChannelRuntimeState, u as createComputedAccountStatusAdapter } from "./status-helpers-CH_H6L7d.js";
import { t as attachChannelToResult } from "./channel-send-result-RbMxgkKK.js";
import { r as buildTrafficStatusSummary, t as buildPassiveChannelStatusSummary } from "./extension-shared-CssxQFGc.js";
import "./runtime-api-BDR8cE3p.js";
import { a as resolveNostrAccount, c as getNostrRuntime, i as resolveDefaultNostrAccountId, n as nostrSetupWizard, o as normalizePubkey, p as NostrConfigSchema, r as listNostrAccountIds, s as startNostrBus, t as nostrSetupAdapter } from "./setup-surface-Bo2Apft_.js";
//#region extensions/nostr/src/session-route.ts
function resolveNostrOutboundSessionRoute(params) {
	const target = stripChannelTargetPrefix(params.target, "nostr");
	if (!target) return null;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "nostr",
		accountId: params.accountId,
		peer: {
			kind: "direct",
			id: target
		},
		chatType: "direct",
		from: `nostr:${target}`,
		to: `nostr:${target}`
	});
}
//#endregion
//#region extensions/nostr/src/channel.ts
const activeBuses = /* @__PURE__ */ new Map();
const metricsSnapshots = /* @__PURE__ */ new Map();
function normalizeNostrAllowEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed) return null;
	if (trimmed === "*") return "*";
	try {
		return normalizePubkey(trimmed.replace(/^nostr:/i, ""));
	} catch {
		return null;
	}
}
function isNostrSenderAllowed(senderPubkey, allowFrom) {
	const normalizedSender = normalizePubkey(senderPubkey);
	for (const entry of allowFrom) {
		const normalized = normalizeNostrAllowEntry(entry);
		if (normalized === "*") return true;
		if (normalized === normalizedSender) return true;
	}
	return false;
}
async function resolveNostrDirectAccess(params) {
	return resolveInboundDirectDmAccessWithRuntime({
		cfg: params.cfg,
		channel: "nostr",
		accountId: params.accountId,
		dmPolicy: params.dmPolicy,
		allowFrom: params.allowFrom,
		senderId: params.senderPubkey,
		rawBody: params.rawBody,
		isSenderAllowed: isNostrSenderAllowed,
		runtime: params.runtime,
		modeWhenAccessGroupsOff: "configured"
	});
}
const resolveNostrDmPolicy = createScopedDmSecurityResolver({
	channelKey: "nostr",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	defaultPolicy: "pairing",
	approveHint: formatPairingApproveHint("nostr"),
	normalizeEntry: (raw) => {
		try {
			return normalizePubkey(raw.trim().replace(/^nostr:/i, ""));
		} catch {
			return raw.trim();
		}
	}
});
const nostrConfigAdapter = createTopLevelChannelConfigAdapter({
	sectionKey: "nostr",
	resolveAccount: (cfg) => resolveNostrAccount({ cfg }),
	listAccountIds: listNostrAccountIds,
	defaultAccountId: resolveDefaultNostrAccountId,
	deleteMode: "clear-fields",
	clearBaseFields: [
		"name",
		"defaultAccount",
		"privateKey",
		"relays",
		"dmPolicy",
		"allowFrom",
		"profile"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map((entry) => {
		if (entry === "*") return "*";
		try {
			return normalizePubkey(entry);
		} catch {
			return entry;
		}
	}).filter(Boolean)
});
const nostrPlugin = createChatChannelPlugin({
	base: {
		id: "nostr",
		meta: {
			id: "nostr",
			label: "Nostr",
			selectionLabel: "Nostr",
			docsPath: "/channels/nostr",
			docsLabel: "nostr",
			blurb: "Decentralized DMs via Nostr relays (NIP-04)",
			order: 100
		},
		capabilities: {
			chatTypes: ["direct"],
			media: false
		},
		reload: { configPrefixes: ["channels.nostr"] },
		configSchema: buildChannelConfigSchema(NostrConfigSchema),
		setup: nostrSetupAdapter,
		setupWizard: nostrSetupWizard,
		config: {
			...nostrConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured,
				extra: { publicKey: account.publicKey }
			})
		},
		messaging: {
			normalizeTarget: (target) => {
				const cleaned = target.trim().replace(/^nostr:/i, "");
				try {
					return normalizePubkey(cleaned);
				} catch {
					return cleaned;
				}
			},
			targetResolver: {
				looksLikeId: (input) => {
					const trimmed = input.trim();
					return trimmed.startsWith("npub1") || /^[0-9a-fA-F]{64}$/.test(trimmed);
				},
				hint: "<npub|hex pubkey|nostr:npub...>"
			},
			resolveOutboundSessionRoute: (params) => resolveNostrOutboundSessionRoute(params)
		},
		status: { ...createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("nostr", accounts),
			buildChannelSummary: ({ snapshot }) => buildPassiveChannelStatusSummary(snapshot, { publicKey: snapshot.publicKey ?? null }),
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					publicKey: account.publicKey,
					profile: account.profile,
					...buildTrafficStatusSummary(runtime)
				}
			})
		}) },
		gateway: { startAccount: async (ctx) => {
			const account = ctx.account;
			ctx.setStatus({
				accountId: account.accountId,
				publicKey: account.publicKey
			});
			ctx.log?.info(`[${account.accountId}] starting Nostr provider (pubkey: ${account.publicKey})`);
			if (!account.configured) throw new Error("Nostr private key not configured");
			const runtime = getNostrRuntime();
			const pairing = createChannelPairingController({
				core: runtime,
				channel: "nostr",
				accountId: account.accountId
			});
			const resolveInboundAccess = async (senderPubkey, rawBody) => await resolveNostrDirectAccess({
				cfg: ctx.cfg,
				accountId: account.accountId,
				dmPolicy: account.config.dmPolicy ?? "pairing",
				allowFrom: account.config.allowFrom,
				senderPubkey,
				rawBody,
				runtime: {
					shouldComputeCommandAuthorized: runtime.channel.commands.shouldComputeCommandAuthorized,
					resolveCommandAuthorizedFromAuthorizers: runtime.channel.commands.resolveCommandAuthorizedFromAuthorizers
				}
			});
			let busHandle = null;
			const authorizeSender = createPreCryptoDirectDmAuthorizer({
				resolveAccess: async (senderPubkey) => await resolveInboundAccess(senderPubkey, ""),
				issuePairingChallenge: async ({ senderId, reply }) => {
					await pairing.issueChallenge({
						senderId,
						senderIdLine: `Your Nostr pubkey: ${senderId}`,
						sendPairingReply: reply,
						onCreated: () => {
							ctx.log?.debug?.(`[${account.accountId}] nostr pairing request sender=${senderId}`);
						},
						onReplyError: (err) => {
							ctx.log?.warn?.(`[${account.accountId}] nostr pairing reply failed for ${senderId}: ${String(err)}`);
						}
					});
				},
				onBlocked: ({ senderId, reason }) => {
					ctx.log?.debug?.(`[${account.accountId}] blocked Nostr sender ${senderId} (${reason})`);
				}
			});
			const bus = await startNostrBus({
				accountId: account.accountId,
				privateKey: account.privateKey,
				relays: account.relays,
				authorizeSender: async ({ senderPubkey, reply }) => await authorizeSender({
					senderId: senderPubkey,
					reply
				}),
				onMessage: async (senderPubkey, text, reply, meta) => {
					const resolvedAccess = await resolveInboundAccess(senderPubkey, text);
					if (resolvedAccess.access.decision !== "allow") {
						ctx.log?.warn?.(`[${account.accountId}] dropping Nostr DM after preflight drift (${senderPubkey}, ${resolvedAccess.access.reason})`);
						return;
					}
					await dispatchInboundDirectDmWithRuntime({
						cfg: ctx.cfg,
						runtime,
						channel: "nostr",
						channelLabel: "Nostr",
						accountId: account.accountId,
						peer: {
							kind: "direct",
							id: senderPubkey
						},
						senderId: senderPubkey,
						senderAddress: `nostr:${senderPubkey}`,
						recipientAddress: `nostr:${account.publicKey}`,
						conversationLabel: senderPubkey,
						rawBody: text,
						messageId: meta.eventId,
						timestamp: meta.createdAt * 1e3,
						commandAuthorized: resolvedAccess.commandAuthorized,
						deliver: async (payload) => {
							const outboundText = payload && typeof payload === "object" && "text" in payload ? String(payload.text ?? "") : "";
							if (!outboundText.trim()) return;
							const tableMode = runtime.channel.text.resolveMarkdownTableMode({
								cfg: ctx.cfg,
								channel: "nostr",
								accountId: account.accountId
							});
							await reply(runtime.channel.text.convertMarkdownTables(outboundText, tableMode));
						},
						onRecordError: (err) => {
							ctx.log?.error?.(`[${account.accountId}] failed recording Nostr inbound session: ${String(err)}`);
						},
						onDispatchError: (err, info) => {
							ctx.log?.error?.(`[${account.accountId}] Nostr ${info.kind} reply failed: ${String(err)}`);
						}
					});
				},
				onError: (error, context) => {
					ctx.log?.error?.(`[${account.accountId}] Nostr error (${context}): ${error.message}`);
				},
				onConnect: (relay) => {
					ctx.log?.debug?.(`[${account.accountId}] Connected to relay: ${relay}`);
				},
				onDisconnect: (relay) => {
					ctx.log?.debug?.(`[${account.accountId}] Disconnected from relay: ${relay}`);
				},
				onEose: (relays) => {
					ctx.log?.debug?.(`[${account.accountId}] EOSE received from relays: ${relays}`);
				},
				onMetric: (event) => {
					if (event.name.startsWith("event.rejected.")) ctx.log?.debug?.(`[${account.accountId}] Metric: ${event.name} ${JSON.stringify(event.labels)}`);
					else if (event.name === "relay.circuit_breaker.open") ctx.log?.warn?.(`[${account.accountId}] Circuit breaker opened for relay: ${event.labels?.relay}`);
					else if (event.name === "relay.circuit_breaker.close") ctx.log?.info?.(`[${account.accountId}] Circuit breaker closed for relay: ${event.labels?.relay}`);
					else if (event.name === "relay.error") ctx.log?.debug?.(`[${account.accountId}] Relay error: ${event.labels?.relay}`);
					if (busHandle) metricsSnapshots.set(account.accountId, busHandle.getMetrics());
				}
			});
			busHandle = bus;
			activeBuses.set(account.accountId, bus);
			ctx.log?.info(`[${account.accountId}] Nostr provider started, connected to ${account.relays.length} relay(s)`);
			return { stop: () => {
				bus.close();
				activeBuses.delete(account.accountId);
				metricsSnapshots.delete(account.accountId);
				ctx.log?.info(`[${account.accountId}] Nostr provider stopped`);
			} };
		} }
	},
	pairing: { text: {
		idLabel: "nostrPubkey",
		message: "Your pairing request has been approved!",
		normalizeAllowEntry: (entry) => {
			try {
				return normalizePubkey(entry.trim().replace(/^nostr:/i, ""));
			} catch {
				return entry.trim();
			}
		},
		notify: async ({ id, message }) => {
			const bus = activeBuses.get(DEFAULT_ACCOUNT_ID);
			if (bus) await bus.sendDm(id, message);
		}
	} },
	security: { resolveDmPolicy: resolveNostrDmPolicy },
	outbound: {
		deliveryMode: "direct",
		textChunkLimit: 4e3,
		sendText: async ({ cfg, to, text, accountId }) => {
			const core = getNostrRuntime();
			const aid = accountId ?? "default";
			const bus = activeBuses.get(aid);
			if (!bus) throw new Error(`Nostr bus not running for account ${aid}`);
			const tableMode = core.channel.text.resolveMarkdownTableMode({
				cfg,
				channel: "nostr",
				accountId: aid
			});
			const message = core.channel.text.convertMarkdownTables(text ?? "", tableMode);
			const normalizedTo = normalizePubkey(to);
			await bus.sendDm(normalizedTo, message);
			return attachChannelToResult("nostr", {
				to: normalizedTo,
				messageId: `nostr-${Date.now()}`
			});
		}
	}
});
/**
* Publish a profile (kind:0) for a Nostr account.
* @param accountId - Account ID (defaults to "default")
* @param profile - Profile data to publish
* @returns Publish results with successes and failures
* @throws Error if account is not running
*/
async function publishNostrProfile(accountId = DEFAULT_ACCOUNT_ID, profile) {
	const bus = activeBuses.get(accountId);
	if (!bus) throw new Error(`Nostr bus not running for account ${accountId}`);
	return bus.publishProfile(profile);
}
/**
* Get profile publish state for a Nostr account.
* @param accountId - Account ID (defaults to "default")
* @returns Profile publish state or null if account not running
*/
async function getNostrProfileState(accountId = DEFAULT_ACCOUNT_ID) {
	const bus = activeBuses.get(accountId);
	if (!bus) return null;
	return bus.getProfileState();
}
//#endregion
export { nostrPlugin as n, publishNostrProfile as r, getNostrProfileState as t };
