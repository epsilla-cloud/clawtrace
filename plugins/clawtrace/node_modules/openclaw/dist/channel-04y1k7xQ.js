import { g as DEFAULT_ACCOUNT_ID } from "./session-key-BhxcMJEE.js";
import { o as stripChannelTargetPrefix, r as createChatChannelPlugin, s as stripTargetKindPrefix, t as buildChannelOutboundSessionRoute } from "./core-CFWy4f9Z.js";
import { n as describeAccountSnapshot } from "./account-helpers-DklgKoS9.js";
import { d as createTopLevelChannelConfigAdapter } from "./channel-config-helpers-pbEU_d5U.js";
import { o as createPairingPrefixStripper } from "./channel-pairing-cpi9_8zd.js";
import { k as projectConfigWarningCollector, v as createAllowlistProviderGroupPolicyWarningCollector } from "./channel-policy-CKDH6-ud.js";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-D7Gi17j0.js";
import { d as createDefaultChannelRuntimeState, i as buildProbeChannelStatusSummary, u as createComputedAccountStatusAdapter } from "./status-helpers-CH_H6L7d.js";
import "./outbound-runtime-B03J2h4O.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-Do23OhS-.js";
import { t as createChannelDirectoryAdapter } from "./directory-runtime-0gCmSUmT.js";
import { a as listDirectoryEntriesFromSources } from "./directory-config-helpers-BVyMAz1Y.js";
import { n as createRuntimeOutboundDelegates, t as createRuntimeDirectoryLiveAdapter } from "./runtime-forwarders-Bmshy5pE.js";
import { t as chunkTextForOutbound } from "./text-chunking-DzwxNDbL.js";
import { t as formatAllowFromLowercase } from "./allow-from-C4_uNVuH.js";
import { n as createMessageToolCardSchema } from "./channel-actions-DUX29rZ_.js";
import "./runtime-api-CMECrhfj.js";
import { t as MSTeamsChannelConfigSchema } from "./config-schema-CBopEWyn.js";
import { r as resolveMSTeamsGroupToolPolicy } from "./policy-DS8LR3d-.js";
import { f as resolveMSTeamsCredentials } from "./graph-users-DrDnmDGP.js";
import { i as parseMSTeamsTeamChannelInput, n as normalizeMSTeamsUserInput, o as resolveMSTeamsChannelAllowlist, r as parseMSTeamsConversationId, s as resolveMSTeamsUserAllowlist, t as normalizeMSTeamsMessagingTarget } from "./resolve-allowlist-Dp10HjSj.js";
import { n as msteamsSetupAdapter, t as msteamsSetupWizard } from "./setup-surface-CGRZGZ2V.js";
//#region extensions/msteams/src/session-route.ts
function resolveMSTeamsOutboundSessionRoute(params) {
	let trimmed = stripChannelTargetPrefix(params.target, "msteams", "teams");
	if (!trimmed) return null;
	const isUser = trimmed.toLowerCase().startsWith("user:");
	const rawId = stripTargetKindPrefix(trimmed);
	if (!rawId) return null;
	const conversationId = rawId.split(";")[0] ?? rawId;
	const isChannel = !isUser && /@thread\.tacv2/i.test(conversationId);
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "msteams",
		accountId: params.accountId,
		peer: {
			kind: isUser ? "direct" : isChannel ? "channel" : "group",
			id: conversationId
		},
		chatType: isUser ? "direct" : isChannel ? "channel" : "group",
		from: isUser ? `msteams:${conversationId}` : isChannel ? `msteams:channel:${conversationId}` : `msteams:group:${conversationId}`,
		to: isUser ? `user:${conversationId}` : `conversation:${conversationId}`
	});
}
//#endregion
//#region extensions/msteams/src/channel.ts
const meta = {
	id: "msteams",
	label: "Microsoft Teams",
	selectionLabel: "Microsoft Teams (Bot Framework)",
	docsPath: "/channels/msteams",
	docsLabel: "msteams",
	blurb: "Teams SDK; enterprise support.",
	aliases: ["teams"],
	order: 60
};
const TEAMS_GRAPH_PERMISSION_HINTS = {
	"ChannelMessage.Read.All": "channel history",
	"Chat.Read.All": "chat history",
	"Channel.ReadBasic.All": "channel list",
	"Team.ReadBasic.All": "team list",
	"TeamsActivity.Read.All": "teams activity",
	"Sites.Read.All": "files (SharePoint)",
	"Files.Read.All": "files (OneDrive)"
};
const collectMSTeamsSecurityWarnings = createAllowlistProviderGroupPolicyWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.msteams !== void 0,
	resolveGroupPolicy: ({ cfg }) => cfg.channels?.msteams?.groupPolicy,
	collect: ({ groupPolicy }) => groupPolicy === "open" ? ["- MS Teams groups: groupPolicy=\"open\" allows any member to trigger (mention-gated). Set channels.msteams.groupPolicy=\"allowlist\" + channels.msteams.groupAllowFrom to restrict senders."] : []
});
const loadMSTeamsChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-KiNVpdri.js"), "msTeamsChannelRuntime");
const resolveMSTeamsChannelConfig = (cfg) => ({
	allowFrom: cfg.channels?.msteams?.allowFrom,
	defaultTo: cfg.channels?.msteams?.defaultTo
});
const msteamsConfigAdapter = createTopLevelChannelConfigAdapter({
	sectionKey: "msteams",
	resolveAccount: (cfg) => ({
		accountId: DEFAULT_ACCOUNT_ID,
		enabled: cfg.channels?.msteams?.enabled !== false,
		configured: Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams))
	}),
	resolveAccessorAccount: ({ cfg }) => resolveMSTeamsChannelConfig(cfg),
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
	resolveDefaultTo: (account) => account.defaultTo
});
function jsonActionResult(data) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(data)
		}],
		details: data
	};
}
function jsonMSTeamsActionResult(action, data = {}) {
	return jsonActionResult({
		channel: "msteams",
		action,
		...data
	});
}
function jsonMSTeamsOkActionResult(action, data = {}) {
	return jsonActionResult({
		ok: true,
		channel: "msteams",
		action,
		...data
	});
}
function jsonMSTeamsConversationResult(conversationId) {
	return jsonActionResultWithDetails({
		ok: true,
		channel: "msteams",
		conversationId
	}, {
		ok: true,
		channel: "msteams"
	});
}
function jsonActionResultWithDetails(contentData, details) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(contentData)
		}],
		details
	};
}
const MSTEAMS_REACTION_TYPES = [
	"like",
	"heart",
	"laugh",
	"surprised",
	"sad",
	"angry"
];
function actionError(message) {
	return {
		isError: true,
		content: [{
			type: "text",
			text: message
		}],
		details: { error: message }
	};
}
function resolveActionTarget(params, currentChannelId) {
	return typeof params.to === "string" ? params.to.trim() : typeof params.target === "string" ? params.target.trim() : currentChannelId?.trim() ?? "";
}
function resolveActionMessageId(params) {
	return typeof params.messageId === "string" ? params.messageId.trim() : "";
}
function resolveActionPinnedMessageId(params) {
	return typeof params.pinnedMessageId === "string" ? params.pinnedMessageId.trim() : typeof params.messageId === "string" ? params.messageId.trim() : "";
}
function resolveActionQuery(params) {
	return typeof params.query === "string" ? params.query.trim() : "";
}
function resolveActionContent(params) {
	return typeof params.text === "string" ? params.text : typeof params.content === "string" ? params.content : typeof params.message === "string" ? params.message : "";
}
function readOptionalTrimmedString(params, key) {
	return typeof params[key] === "string" ? params[key].trim() || void 0 : void 0;
}
function resolveActionUploadFilePath(params) {
	for (const key of [
		"filePath",
		"path",
		"media"
	]) if (typeof params[key] === "string") {
		const value = params[key];
		if (value.trim()) return value;
	}
}
function resolveRequiredActionTarget(params) {
	const to = resolveActionTarget(params.toolParams, params.currentChannelId);
	if (!to) return actionError(`${params.actionLabel} requires a target (to).`);
	return to;
}
function resolveRequiredActionMessageTarget(params) {
	const to = resolveActionTarget(params.toolParams, params.currentChannelId);
	const messageId = resolveActionMessageId(params.toolParams);
	if (!to || !messageId) return actionError(`${params.actionLabel} requires a target (to) and messageId.`);
	return {
		to,
		messageId
	};
}
function resolveRequiredActionPinnedMessageTarget(params) {
	const to = resolveActionTarget(params.toolParams, params.currentChannelId);
	const pinnedMessageId = resolveActionPinnedMessageId(params.toolParams);
	if (!to || !pinnedMessageId) return actionError(`${params.actionLabel} requires a target (to) and pinnedMessageId.`);
	return {
		to,
		pinnedMessageId
	};
}
async function runWithRequiredActionTarget(params) {
	const to = resolveRequiredActionTarget({
		actionLabel: params.actionLabel,
		toolParams: params.toolParams,
		currentChannelId: params.currentChannelId
	});
	if (typeof to !== "string") return to;
	return await params.run(to);
}
async function runWithRequiredActionMessageTarget(params) {
	const target = resolveRequiredActionMessageTarget({
		actionLabel: params.actionLabel,
		toolParams: params.toolParams,
		currentChannelId: params.currentChannelId
	});
	if ("isError" in target) return target;
	return await params.run(target);
}
async function runWithRequiredActionPinnedMessageTarget(params) {
	const target = resolveRequiredActionPinnedMessageTarget({
		actionLabel: params.actionLabel,
		toolParams: params.toolParams,
		currentChannelId: params.currentChannelId
	});
	if ("isError" in target) return target;
	return await params.run(target);
}
function describeMSTeamsMessageTool({ cfg }) {
	const enabled = cfg.channels?.msteams?.enabled !== false && Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams));
	return {
		actions: enabled ? [
			"upload-file",
			"poll",
			"edit",
			"delete",
			"pin",
			"unpin",
			"list-pins",
			"read",
			"react",
			"reactions",
			"search"
		] : [],
		capabilities: enabled ? ["cards"] : [],
		schema: enabled ? { properties: { card: createMessageToolCardSchema() } } : null
	};
}
const msteamsPlugin = createChatChannelPlugin({
	base: {
		id: "msteams",
		meta: {
			...meta,
			aliases: [...meta.aliases]
		},
		setupWizard: msteamsSetupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"channel",
				"thread"
			],
			polls: true,
			threads: true,
			media: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		agentPrompt: { messageToolHints: () => ["- Adaptive Cards supported. Use `action=send` with `card={type,version,body}` to send rich cards.", "- MSTeams targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:ID` or `user:Display Name` (requires Graph API) for DMs, `conversation:19:...@thread.tacv2` for groups/channels. Prefer IDs over display names for speed."] },
		groups: { resolveToolPolicy: resolveMSTeamsGroupToolPolicy },
		reload: { configPrefixes: ["channels.msteams"] },
		configSchema: MSTeamsChannelConfigSchema,
		config: {
			...msteamsConfigAdapter,
			isConfigured: (_account, cfg) => Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams)),
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured
			})
		},
		setup: msteamsSetupAdapter,
		messaging: {
			normalizeTarget: normalizeMSTeamsMessagingTarget,
			resolveOutboundSessionRoute: (params) => resolveMSTeamsOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: (raw) => {
					const trimmed = raw.trim();
					if (!trimmed) return false;
					if (/^conversation:/i.test(trimmed)) return true;
					if (/^user:/i.test(trimmed)) {
						const id = trimmed.slice(5).trim();
						return /^[0-9a-fA-F-]{16,}$/.test(id);
					}
					return trimmed.includes("@thread");
				},
				hint: "<conversationId|user:ID|conversation:ID>"
			}
		},
		directory: createChannelDirectoryAdapter({
			self: async ({ cfg }) => {
				const creds = resolveMSTeamsCredentials(cfg.channels?.msteams);
				if (!creds) return null;
				return {
					kind: "user",
					id: creds.appId,
					name: creds.appId
				};
			},
			listPeers: async ({ cfg, query, limit }) => listDirectoryEntriesFromSources({
				kind: "user",
				sources: [cfg.channels?.msteams?.allowFrom ?? [], Object.keys(cfg.channels?.msteams?.dms ?? {})],
				query,
				limit,
				normalizeId: (raw) => {
					const normalized = normalizeMSTeamsMessagingTarget(raw) ?? raw;
					const lowered = normalized.toLowerCase();
					if (lowered.startsWith("user:") || lowered.startsWith("conversation:")) return normalized;
					return `user:${normalized}`;
				}
			}),
			listGroups: async ({ cfg, query, limit }) => listDirectoryEntriesFromSources({
				kind: "group",
				sources: [Object.values(cfg.channels?.msteams?.teams ?? {}).flatMap((team) => Object.keys(team.channels ?? {}))],
				query,
				limit,
				normalizeId: (raw) => `conversation:${raw.replace(/^conversation:/i, "").trim()}`
			}),
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadMSTeamsChannelRuntime,
				listPeersLive: (runtime) => runtime.listMSTeamsDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listMSTeamsDirectoryGroupsLive
			})
		}),
		resolver: { resolveTargets: async ({ cfg, inputs, kind, runtime }) => {
			const results = inputs.map((input) => ({
				input,
				resolved: false,
				id: void 0,
				name: void 0,
				note: void 0
			}));
			const stripPrefix = (value) => normalizeMSTeamsUserInput(value);
			const markPendingLookupFailed = (pending) => {
				pending.forEach(({ index }) => {
					const entry = results[index];
					if (entry) entry.note = "lookup failed";
				});
			};
			const resolvePending = async (pending, resolveEntries, applyResolvedEntry) => {
				if (pending.length === 0) return;
				try {
					(await resolveEntries(pending.map((entry) => entry.query))).forEach((entry, idx) => {
						const target = results[pending[idx]?.index ?? -1];
						if (!target) return;
						applyResolvedEntry(target, entry);
					});
				} catch (err) {
					runtime.error?.(`msteams resolve failed: ${String(err)}`);
					markPendingLookupFailed(pending);
				}
			};
			if (kind === "user") {
				const pending = [];
				results.forEach((entry, index) => {
					const trimmed = entry.input.trim();
					if (!trimmed) {
						entry.note = "empty input";
						return;
					}
					const cleaned = stripPrefix(trimmed);
					if (/^[0-9a-fA-F-]{16,}$/.test(cleaned) || cleaned.includes("@")) {
						entry.resolved = true;
						entry.id = cleaned;
						return;
					}
					pending.push({
						input: entry.input,
						query: cleaned,
						index
					});
				});
				await resolvePending(pending, (entries) => resolveMSTeamsUserAllowlist({
					cfg,
					entries
				}), (target, entry) => {
					target.resolved = entry.resolved;
					target.id = entry.id;
					target.name = entry.name;
					target.note = entry.note;
				});
				return results;
			}
			const pending = [];
			results.forEach((entry, index) => {
				const trimmed = entry.input.trim();
				if (!trimmed) {
					entry.note = "empty input";
					return;
				}
				const conversationId = parseMSTeamsConversationId(trimmed);
				if (conversationId !== null) {
					entry.resolved = Boolean(conversationId);
					entry.id = conversationId || void 0;
					entry.note = conversationId ? "conversation id" : "empty conversation id";
					return;
				}
				const parsed = parseMSTeamsTeamChannelInput(trimmed);
				if (!parsed.team) {
					entry.note = "missing team";
					return;
				}
				const query = parsed.channel ? `${parsed.team}/${parsed.channel}` : parsed.team;
				pending.push({
					input: entry.input,
					query,
					index
				});
			});
			await resolvePending(pending, (entries) => resolveMSTeamsChannelAllowlist({
				cfg,
				entries
			}), (target, entry) => {
				if (!entry.resolved || !entry.teamId) {
					target.resolved = false;
					target.note = entry.note;
					return;
				}
				target.resolved = true;
				if (entry.channelId) {
					target.id = `${entry.teamId}/${entry.channelId}`;
					target.name = entry.channelName && entry.teamName ? `${entry.teamName}/${entry.channelName}` : entry.channelName ?? entry.teamName;
				} else {
					target.id = entry.teamId;
					target.name = entry.teamName;
					target.note = "team id";
				}
				if (entry.note) target.note = entry.note;
			});
			return results;
		} },
		actions: {
			describeMessageTool: describeMSTeamsMessageTool,
			handleAction: async (ctx) => {
				if (ctx.action === "send" && ctx.params.card) {
					const card = ctx.params.card;
					return await runWithRequiredActionTarget({
						actionLabel: "Card send",
						toolParams: ctx.params,
						run: async (to) => {
							const { sendAdaptiveCardMSTeams } = await loadMSTeamsChannelRuntime();
							const result = await sendAdaptiveCardMSTeams({
								cfg: ctx.cfg,
								to,
								card
							});
							return jsonActionResultWithDetails({
								ok: true,
								channel: "msteams",
								messageId: result.messageId,
								conversationId: result.conversationId
							}, {
								ok: true,
								channel: "msteams",
								messageId: result.messageId
							});
						}
					});
				}
				if (ctx.action === "upload-file") {
					const mediaUrl = resolveActionUploadFilePath(ctx.params);
					if (!mediaUrl) return actionError("Upload-file requires media, filePath, or path.");
					return await runWithRequiredActionTarget({
						actionLabel: "Upload-file",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const { sendMessageMSTeams } = await loadMSTeamsChannelRuntime();
							const result = await sendMessageMSTeams({
								cfg: ctx.cfg,
								to,
								text: resolveActionContent(ctx.params),
								mediaUrl,
								filename: readOptionalTrimmedString(ctx.params, "filename") ?? readOptionalTrimmedString(ctx.params, "title"),
								mediaLocalRoots: ctx.mediaLocalRoots
							});
							return jsonActionResultWithDetails({
								ok: true,
								channel: "msteams",
								action: "upload-file",
								messageId: result.messageId,
								conversationId: result.conversationId,
								...result.pendingUploadId ? { pendingUploadId: result.pendingUploadId } : {}
							}, {
								ok: true,
								channel: "msteams",
								messageId: result.messageId,
								...result.pendingUploadId ? { pendingUploadId: result.pendingUploadId } : {}
							});
						}
					});
				}
				if (ctx.action === "edit") {
					const content = resolveActionContent(ctx.params);
					if (!content) return actionError("Edit requires content.");
					return await runWithRequiredActionMessageTarget({
						actionLabel: "Edit",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (target) => {
							const { editMessageMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsConversationResult((await editMessageMSTeams({
								cfg: ctx.cfg,
								to: target.to,
								activityId: target.messageId,
								text: content
							})).conversationId);
						}
					});
				}
				if (ctx.action === "delete") return await runWithRequiredActionMessageTarget({
					actionLabel: "Delete",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (target) => {
						const { deleteMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsConversationResult((await deleteMessageMSTeams({
							cfg: ctx.cfg,
							to: target.to,
							activityId: target.messageId
						})).conversationId);
					}
				});
				if (ctx.action === "read") return await runWithRequiredActionMessageTarget({
					actionLabel: "Read",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (target) => {
						const { getMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("read", { message: await getMessageMSTeams({
							cfg: ctx.cfg,
							to: target.to,
							messageId: target.messageId
						}) });
					}
				});
				if (ctx.action === "pin") return await runWithRequiredActionMessageTarget({
					actionLabel: "Pin",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (target) => {
						const { pinMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsActionResult("pin", await pinMessageMSTeams({
							cfg: ctx.cfg,
							to: target.to,
							messageId: target.messageId
						}));
					}
				});
				if (ctx.action === "unpin") return await runWithRequiredActionPinnedMessageTarget({
					actionLabel: "Unpin",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (target) => {
						const { unpinMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsActionResult("unpin", await unpinMessageMSTeams({
							cfg: ctx.cfg,
							to: target.to,
							pinnedMessageId: target.pinnedMessageId
						}));
					}
				});
				if (ctx.action === "list-pins") return await runWithRequiredActionTarget({
					actionLabel: "List-pins",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (to) => {
						const { listPinsMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("list-pins", await listPinsMSTeams({
							cfg: ctx.cfg,
							to
						}));
					}
				});
				if (ctx.action === "react") return await runWithRequiredActionMessageTarget({
					actionLabel: "React",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (target) => {
						const emoji = typeof ctx.params.emoji === "string" ? ctx.params.emoji.trim() : "";
						const remove = typeof ctx.params.remove === "boolean" ? ctx.params.remove : false;
						if (!emoji) return {
							isError: true,
							content: [{
								type: "text",
								text: `React requires an emoji (reaction type). Valid types: ${MSTEAMS_REACTION_TYPES.join(", ")}.`
							}],
							details: {
								error: "React requires an emoji (reaction type).",
								validTypes: [...MSTEAMS_REACTION_TYPES]
							}
						};
						if (remove) {
							const { unreactMessageMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsActionResult("react", {
								removed: true,
								reactionType: emoji,
								...await unreactMessageMSTeams({
									cfg: ctx.cfg,
									to: target.to,
									messageId: target.messageId,
									reactionType: emoji
								})
							});
						}
						const { reactMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsActionResult("react", {
							reactionType: emoji,
							...await reactMessageMSTeams({
								cfg: ctx.cfg,
								to: target.to,
								messageId: target.messageId,
								reactionType: emoji
							})
						});
					}
				});
				if (ctx.action === "reactions") return await runWithRequiredActionMessageTarget({
					actionLabel: "Reactions",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (target) => {
						const { listReactionsMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("reactions", await listReactionsMSTeams({
							cfg: ctx.cfg,
							to: target.to,
							messageId: target.messageId
						}));
					}
				});
				if (ctx.action === "search") return await runWithRequiredActionTarget({
					actionLabel: "Search",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (to) => {
						const query = resolveActionQuery(ctx.params);
						if (!query) return actionError("Search requires a target (to) and query.");
						const limit = typeof ctx.params.limit === "number" ? ctx.params.limit : void 0;
						const from = typeof ctx.params.from === "string" ? ctx.params.from.trim() : void 0;
						const { searchMessagesMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("search", await searchMessagesMSTeams({
							cfg: ctx.cfg,
							to,
							query,
							from: from || void 0,
							limit
						}));
					}
				});
				return null;
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, { port: null }),
			buildChannelSummary: ({ snapshot }) => buildProbeChannelStatusSummary(snapshot, { port: snapshot.port ?? null }),
			probeAccount: async ({ cfg }) => await (await loadMSTeamsChannelRuntime()).probeMSTeams(cfg.channels?.msteams),
			formatCapabilitiesProbe: ({ probe }) => {
				const teamsProbe = probe;
				const lines = [];
				const appId = typeof teamsProbe?.appId === "string" ? teamsProbe.appId.trim() : "";
				if (appId) lines.push({ text: `App: ${appId}` });
				const graph = teamsProbe?.graph;
				if (graph) {
					const roles = Array.isArray(graph.roles) ? graph.roles.map((role) => String(role).trim()).filter(Boolean) : [];
					const scopes = Array.isArray(graph.scopes) ? graph.scopes.map((scope) => String(scope).trim()).filter(Boolean) : [];
					const formatPermission = (permission) => {
						const hint = TEAMS_GRAPH_PERMISSION_HINTS[permission];
						return hint ? `${permission} (${hint})` : permission;
					};
					if (graph.ok === false) lines.push({
						text: `Graph: ${graph.error ?? "failed"}`,
						tone: "error"
					});
					else if (roles.length > 0 || scopes.length > 0) {
						if (roles.length > 0) lines.push({ text: `Graph roles: ${roles.map(formatPermission).join(", ")}` });
						if (scopes.length > 0) lines.push({ text: `Graph scopes: ${scopes.map(formatPermission).join(", ")}` });
					} else if (graph.ok === true) lines.push({ text: "Graph: ok" });
				}
				return lines;
			},
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				enabled: account.enabled,
				configured: account.configured,
				extra: { port: runtime?.port ?? null }
			})
		}),
		gateway: { startAccount: async (ctx) => {
			const { monitorMSTeamsProvider } = await import("./src-cE0yAYZb.js");
			const port = ctx.cfg.channels?.msteams?.webhook?.port ?? 3978;
			ctx.setStatus({
				accountId: ctx.accountId,
				port
			});
			ctx.log?.info(`starting provider (port ${port})`);
			return monitorMSTeamsProvider({
				cfg: ctx.cfg,
				runtime: ctx.runtime,
				abortSignal: ctx.abortSignal
			});
		} }
	},
	security: { collectWarnings: projectConfigWarningCollector(collectMSTeamsSecurityWarnings) },
	pairing: { text: {
		idLabel: "msteamsUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^(msteams|user):/i),
		notify: async ({ cfg, id, message }) => {
			const { sendMessageMSTeams } = await loadMSTeamsChannelRuntime();
			await sendMessageMSTeams({
				cfg,
				to: id,
				text: message
			});
		}
	} },
	threading: { buildToolContext: ({ context, hasRepliedRef }) => ({
		currentChannelId: context.To?.trim() || void 0,
		currentThreadTs: context.ReplyToId,
		hasRepliedRef
	}) },
	outbound: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "markdown",
		textChunkLimit: 4e3,
		pollMaxOptions: 12,
		...createRuntimeOutboundDelegates({
			getRuntime: loadMSTeamsChannelRuntime,
			sendText: { resolve: (runtime) => runtime.msteamsOutbound.sendText },
			sendMedia: { resolve: (runtime) => runtime.msteamsOutbound.sendMedia },
			sendPoll: { resolve: (runtime) => runtime.msteamsOutbound.sendPoll }
		})
	}
});
//#endregion
export { msteamsPlugin as t };
