import "../../auth-profiles-B5ypC5S-.js";
import { _ as normalizeAccountId, g as DEFAULT_ACCOUNT_ID } from "../../session-key-BhxcMJEE.js";
import { h as createStaticReplyToModeResolver, i as defineChannelPluginEntry, r as createChatChannelPlugin } from "../../core-CFWy4f9Z.js";
import { u as createScopedDmSecurityResolver } from "../../channel-config-helpers-pbEU_d5U.js";
import { t as createAccountStatusSink } from "../../channel-lifecycle-CSsB8ys6.js";
import { o as createPairingPrefixStripper } from "../../channel-pairing-cpi9_8zd.js";
import { d as createDefaultChannelRuntimeState, l as createAsyncComputedAccountStatusAdapter } from "../../status-helpers-CH_H6L7d.js";
import { a as createEmptyChannelResult, o as createRawChannelSendResultAdapter } from "../../channel-send-result-RbMxgkKK.js";
import { t as chunkTextForOutbound } from "../../text-chunking-DzwxNDbL.js";
import { l as isNumericTargetId, y as sendPayloadWithChunkedTextAndMedia } from "../../reply-payload-CJqP_sJ6.js";
import { n as isDangerousNameMatchingEnabled } from "../../dangerous-name-matching-BgMtk6C_.js";
import { i as coerceStatusIssueAccountId, n as buildPassiveProbedChannelStatusSummary, o as readStatusIssueFields } from "../../extension-shared-CssxQFGc.js";
import "../../runtime-api-I7yZkEIc.js";
import { a as listZaloGroupMembers, b as waitForZaloQrLogin, c as logoutZaloProfile, i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, t as checkZaloAuthenticated, y as startZaloQrLogin } from "../../zalo-js-B3-1bwTS.js";
import { i as resolveZalouserAccountSync, n as listZalouserAccountIds, t as getZcaUserInfo } from "../../accounts-C3Ee3KOs.js";
import { a as resolveZalouserReactionMessageIds, n as setZalouserRuntime, o as buildZalouserGroupCandidates, s as findZalouserGroupEntry, t as getZalouserRuntime } from "../../runtime-zsOmKBd2.js";
import { n as zalouserSetupAdapter, r as writeQrDataUrlToTempFile, t as zalouserSetupWizard } from "../../setup-surface-BMOrzP0A.js";
import { a as sendReactionZalouser, i as sendMessageZalouser, n as sendImageZalouser, r as sendLinkZalouser } from "../../send-UoIQecVV.js";
import { i as resolveZalouserOutboundSessionRoute, n as parseZalouserDirectoryGroupId, r as parseZalouserOutboundTarget, t as normalizeZalouserTarget } from "../../session-route-DISmfIWu.js";
import { t as createZalouserPluginBase } from "../../shared-BgXfCnvl.js";
import { Type } from "@sinclair/typebox";
//#region extensions/zalouser/src/probe.ts
async function probeZalouser(profile, timeoutMs) {
	try {
		const user = timeoutMs ? await Promise.race([getZaloUserInfo(profile), new Promise((resolve) => setTimeout(() => resolve(null), Math.max(timeoutMs, 1e3)))]) : await getZaloUserInfo(profile);
		if (!user) return {
			ok: false,
			error: "Not authenticated"
		};
		return {
			ok: true,
			user
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}
//#endregion
//#region extensions/zalouser/src/status-issues.ts
const ZALOUSER_STATUS_FIELDS = [
	"accountId",
	"enabled",
	"configured",
	"dmPolicy",
	"lastError"
];
function collectZalouserStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readStatusIssueFields(entry, ZALOUSER_STATUS_FIELDS);
		if (!account) continue;
		const accountId = coerceStatusIssueAccountId(account.accountId) ?? "default";
		if (!(account.enabled !== false)) continue;
		if (!(account.configured === true)) {
			issues.push({
				channel: "zalouser",
				accountId,
				kind: "auth",
				message: "Not authenticated (no saved Zalo session).",
				fix: "Run: openclaw channels login --channel zalouser"
			});
			continue;
		}
		if (account.dmPolicy === "open") issues.push({
			channel: "zalouser",
			accountId,
			kind: "config",
			message: "Zalo Personal dmPolicy is \"open\", allowing any user to message the bot without pairing.",
			fix: "Set channels.zalouser.dmPolicy to \"pairing\" or \"allowlist\" to restrict access."
		});
	}
	return issues;
}
//#endregion
//#region extensions/zalouser/src/channel.ts
const ZALOUSER_TEXT_CHUNK_LIMIT = 2e3;
const zalouserRawSendResultAdapter = createRawChannelSendResultAdapter({
	channel: "zalouser",
	sendText: async ({ to, text, accountId, cfg }) => {
		const account = resolveZalouserAccountSync({
			cfg,
			accountId
		});
		const target = parseZalouserOutboundTarget(to);
		return await sendMessageZalouser(target.threadId, text, {
			profile: account.profile,
			isGroup: target.isGroup,
			textMode: "markdown",
			textChunkMode: resolveZalouserOutboundChunkMode(cfg, account.accountId),
			textChunkLimit: resolveZalouserOutboundTextChunkLimit(cfg, account.accountId)
		});
	},
	sendMedia: async ({ to, text, mediaUrl, accountId, cfg, mediaLocalRoots }) => {
		const account = resolveZalouserAccountSync({
			cfg,
			accountId
		});
		const target = parseZalouserOutboundTarget(to);
		return await sendMessageZalouser(target.threadId, text, {
			profile: account.profile,
			isGroup: target.isGroup,
			mediaUrl,
			mediaLocalRoots,
			textMode: "markdown",
			textChunkMode: resolveZalouserOutboundChunkMode(cfg, account.accountId),
			textChunkLimit: resolveZalouserOutboundTextChunkLimit(cfg, account.accountId)
		});
	}
});
function resolveZalouserQrProfile(accountId) {
	const normalized = normalizeAccountId(accountId);
	if (!normalized || normalized === "default") return process.env.ZALOUSER_PROFILE?.trim() || process.env.ZCA_PROFILE?.trim() || "default";
	return normalized;
}
function resolveZalouserOutboundChunkMode(cfg, accountId) {
	return getZalouserRuntime().channel.text.resolveChunkMode(cfg, "zalouser", accountId);
}
function resolveZalouserOutboundTextChunkLimit(cfg, accountId) {
	return getZalouserRuntime().channel.text.resolveTextChunkLimit(cfg, "zalouser", accountId, { fallbackLimit: ZALOUSER_TEXT_CHUNK_LIMIT });
}
function mapUser(params) {
	return {
		kind: "user",
		id: params.id,
		name: params.name ?? void 0,
		avatarUrl: params.avatarUrl ?? void 0,
		raw: params.raw
	};
}
function mapGroup(params) {
	return {
		kind: "group",
		id: params.id,
		name: params.name ?? void 0,
		raw: params.raw
	};
}
function resolveZalouserGroupPolicyEntry(params) {
	const account = resolveZalouserAccountSync({
		cfg: params.cfg,
		accountId: params.accountId ?? void 0
	});
	return findZalouserGroupEntry(account.config.groups ?? {}, buildZalouserGroupCandidates({
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		includeWildcard: true,
		allowNameMatching: isDangerousNameMatchingEnabled(account.config)
	}));
}
function resolveZalouserGroupToolPolicy(params) {
	return resolveZalouserGroupPolicyEntry(params)?.tools;
}
function resolveZalouserRequireMention(params) {
	const entry = resolveZalouserGroupPolicyEntry(params);
	if (typeof entry?.requireMention === "boolean") return entry.requireMention;
	return true;
}
const resolveZalouserDmPolicy = createScopedDmSecurityResolver({
	channelKey: "zalouser",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => raw.trim().replace(/^(zalouser|zlu):/i, "")
});
const zalouserMessageActions = {
	describeMessageTool: ({ cfg }) => {
		if (listZalouserAccountIds(cfg).map((accountId) => resolveZalouserAccountSync({
			cfg,
			accountId
		})).filter((account) => account.enabled).length === 0) return null;
		return { actions: ["react"] };
	},
	supportsAction: ({ action }) => action === "react",
	handleAction: async ({ action, params, cfg, accountId, toolContext }) => {
		if (action !== "react") throw new Error(`Zalouser action ${action} not supported`);
		const account = resolveZalouserAccountSync({
			cfg,
			accountId
		});
		const threadId = (typeof params.threadId === "string" ? params.threadId.trim() : "") || (typeof params.to === "string" ? params.to.trim() : "") || (typeof params.chatId === "string" ? params.chatId.trim() : "") || (toolContext?.currentChannelId?.trim() ?? "");
		if (!threadId) throw new Error("Zalouser react requires threadId (or to/chatId).");
		const emoji = typeof params.emoji === "string" ? params.emoji.trim() : "";
		if (!emoji) throw new Error("Zalouser react requires emoji.");
		const ids = resolveZalouserReactionMessageIds({
			messageId: typeof params.messageId === "string" ? params.messageId : void 0,
			cliMsgId: typeof params.cliMsgId === "string" ? params.cliMsgId : void 0,
			currentMessageId: toolContext?.currentMessageId
		});
		if (!ids) throw new Error("Zalouser react requires messageId + cliMsgId (or a current message context id).");
		const result = await sendReactionZalouser({
			profile: account.profile,
			threadId,
			isGroup: params.isGroup === true,
			msgId: ids.msgId,
			cliMsgId: ids.cliMsgId,
			emoji,
			remove: params.remove === true
		});
		if (!result.ok) throw new Error(result.error || "Failed to react on Zalo message");
		return {
			content: [{
				type: "text",
				text: params.remove === true ? `Removed reaction ${emoji} from ${ids.msgId}` : `Reacted ${emoji} on ${ids.msgId}`
			}],
			details: {
				messageId: ids.msgId,
				cliMsgId: ids.cliMsgId,
				threadId
			}
		};
	}
};
const zalouserPlugin = createChatChannelPlugin({
	base: {
		...createZalouserPluginBase({
			setupWizard: zalouserSetupWizard,
			setup: zalouserSetupAdapter
		}),
		groups: {
			resolveRequireMention: resolveZalouserRequireMention,
			resolveToolPolicy: resolveZalouserGroupToolPolicy
		},
		actions: zalouserMessageActions,
		messaging: {
			normalizeTarget: (raw) => normalizeZalouserTarget(raw),
			resolveOutboundSessionRoute: (params) => resolveZalouserOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: (raw) => {
					const normalized = normalizeZalouserTarget(raw);
					if (!normalized) return false;
					if (/^group:[^\s]+$/i.test(normalized) || /^user:[^\s]+$/i.test(normalized)) return true;
					return isNumericTargetId(normalized);
				},
				hint: "<user:id|group:id>"
			}
		},
		directory: {
			self: async ({ cfg, accountId }) => {
				const parsed = await getZaloUserInfo(resolveZalouserAccountSync({
					cfg,
					accountId
				}).profile);
				if (!parsed?.userId) return null;
				return mapUser({
					id: String(parsed.userId),
					name: parsed.displayName ?? null,
					avatarUrl: parsed.avatar ?? null,
					raw: parsed
				});
			},
			listPeers: async ({ cfg, accountId, query, limit }) => {
				const rows = (await listZaloFriendsMatching(resolveZalouserAccountSync({
					cfg,
					accountId
				}).profile, query)).map((friend) => mapUser({
					id: String(friend.userId),
					name: friend.displayName ?? null,
					avatarUrl: friend.avatar ?? null,
					raw: friend
				}));
				return typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows;
			},
			listGroups: async ({ cfg, accountId, query, limit }) => {
				const rows = (await listZaloGroupsMatching(resolveZalouserAccountSync({
					cfg,
					accountId
				}).profile, query)).map((group) => mapGroup({
					id: `group:${String(group.groupId)}`,
					name: group.name ?? null,
					raw: group
				}));
				return typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows;
			},
			listGroupMembers: async ({ cfg, accountId, groupId, limit }) => {
				const account = resolveZalouserAccountSync({
					cfg,
					accountId
				});
				const normalizedGroupId = parseZalouserDirectoryGroupId(groupId);
				const rows = (await listZaloGroupMembers(account.profile, normalizedGroupId)).map((member) => mapUser({
					id: member.userId,
					name: member.displayName,
					avatarUrl: member.avatar ?? null,
					raw: member
				}));
				return typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows;
			}
		},
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind, runtime }) => {
			const results = [];
			for (const input of inputs) {
				const trimmed = input.trim();
				if (!trimmed) {
					results.push({
						input,
						resolved: false,
						note: "empty input"
					});
					continue;
				}
				if (/^\d+$/.test(trimmed)) {
					results.push({
						input,
						resolved: true,
						id: trimmed
					});
					continue;
				}
				try {
					const account = resolveZalouserAccountSync({
						cfg,
						accountId: accountId ?? "default"
					});
					if (kind === "user") {
						const friends = await listZaloFriendsMatching(account.profile, trimmed);
						const best = friends[0];
						results.push({
							input,
							resolved: Boolean(best?.userId),
							id: best?.userId,
							name: best?.displayName,
							note: friends.length > 1 ? "multiple matches; chose first" : void 0
						});
					} else {
						const groups = await listZaloGroupsMatching(account.profile, trimmed);
						const best = groups.find((group) => group.name.toLowerCase() === trimmed.toLowerCase()) ?? groups[0];
						results.push({
							input,
							resolved: Boolean(best?.groupId),
							id: best?.groupId,
							name: best?.name,
							note: groups.length > 1 ? "multiple matches; chose first" : void 0
						});
					}
				} catch (err) {
					runtime.error?.(`zalouser resolve failed: ${String(err)}`);
					results.push({
						input,
						resolved: false,
						note: "lookup failed"
					});
				}
			}
			return results;
		} },
		auth: { login: async ({ cfg, accountId, runtime }) => {
			const account = resolveZalouserAccountSync({
				cfg,
				accountId: accountId ?? "default"
			});
			runtime.log(`Generating QR login for Zalo Personal (account: ${account.accountId}, profile: ${account.profile})...`);
			const started = await startZaloQrLogin({
				profile: account.profile,
				timeoutMs: 35e3
			});
			if (!started.qrDataUrl) throw new Error(started.message || "Failed to start QR login");
			const qrPath = await writeQrDataUrlToTempFile(started.qrDataUrl, account.profile);
			if (qrPath) runtime.log(`Scan QR image: ${qrPath}`);
			else runtime.log("QR generated but could not be written to a temp file.");
			const waited = await waitForZaloQrLogin({
				profile: account.profile,
				timeoutMs: 18e4
			});
			if (!waited.connected) throw new Error(waited.message || "Zalouser login failed");
			runtime.log(waited.message);
		} },
		status: createAsyncComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: collectZalouserStatusIssues,
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot),
			probeAccount: async ({ account, timeoutMs }) => probeZalouser(account.profile, timeoutMs),
			resolveAccountSnapshot: async ({ account, runtime }) => {
				const configured = await checkZaloAuthenticated(account.profile);
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured,
					extra: {
						dmPolicy: account.config.dmPolicy ?? "pairing",
						lastError: configured ? runtime?.lastError ?? null : runtime?.lastError ?? "not authenticated"
					}
				};
			}
		}),
		gateway: {
			startAccount: async (ctx) => {
				const account = ctx.account;
				let userLabel = "";
				try {
					const userInfo = await getZcaUserInfo(account.profile);
					if (userInfo?.displayName) userLabel = ` (${userInfo.displayName})`;
					ctx.setStatus({
						accountId: account.accountId,
						profile: userInfo
					});
				} catch {}
				const statusSink = createAccountStatusSink({
					accountId: ctx.accountId,
					setStatus: ctx.setStatus
				});
				ctx.log?.info(`[${account.accountId}] starting zalouser provider${userLabel}`);
				const { monitorZalouserProvider } = await import("../../monitor-D7q92-Dz.js");
				return monitorZalouserProvider({
					account,
					config: ctx.cfg,
					runtime: ctx.runtime,
					abortSignal: ctx.abortSignal,
					statusSink
				});
			},
			loginWithQrStart: async (params) => {
				return await startZaloQrLogin({
					profile: resolveZalouserQrProfile(params.accountId),
					force: params.force,
					timeoutMs: params.timeoutMs
				});
			},
			loginWithQrWait: async (params) => {
				return await waitForZaloQrLogin({
					profile: resolveZalouserQrProfile(params.accountId),
					timeoutMs: params.timeoutMs
				});
			},
			logoutAccount: async (ctx) => await logoutZaloProfile(ctx.account.profile || resolveZalouserQrProfile(ctx.accountId))
		}
	},
	security: { resolveDmPolicy: resolveZalouserDmPolicy },
	threading: { resolveReplyToMode: createStaticReplyToModeResolver("off") },
	pairing: { text: {
		idLabel: "zalouserUserId",
		message: "Your pairing request has been approved.",
		normalizeAllowEntry: createPairingPrefixStripper(/^(zalouser|zlu):/i),
		notify: async ({ cfg, id, message }) => {
			const account = resolveZalouserAccountSync({ cfg });
			if (!await checkZaloAuthenticated(account.profile)) throw new Error("Zalouser not authenticated");
			await sendMessageZalouser(id, message, { profile: account.profile });
		}
	} },
	outbound: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "markdown",
		sendPayload: async (ctx) => await sendPayloadWithChunkedTextAndMedia({
			ctx,
			sendText: (nextCtx) => zalouserRawSendResultAdapter.sendText(nextCtx),
			sendMedia: (nextCtx) => zalouserRawSendResultAdapter.sendMedia(nextCtx),
			emptyResult: createEmptyChannelResult("zalouser")
		}),
		...zalouserRawSendResultAdapter
	}
});
//#endregion
//#region extensions/zalouser/src/tool.ts
const ACTIONS = [
	"send",
	"image",
	"link",
	"friends",
	"groups",
	"me",
	"status"
];
function stringEnum(values, options = {}) {
	return Type.Unsafe({
		type: "string",
		enum: [...values],
		...options
	});
}
const ZalouserToolSchema = Type.Object({
	action: stringEnum(ACTIONS, { description: `Action to perform: ${ACTIONS.join(", ")}` }),
	threadId: Type.Optional(Type.String({ description: "Thread ID for messaging" })),
	message: Type.Optional(Type.String({ description: "Message text" })),
	isGroup: Type.Optional(Type.Boolean({ description: "Is group chat" })),
	profile: Type.Optional(Type.String({ description: "Profile name" })),
	query: Type.Optional(Type.String({ description: "Search query" })),
	url: Type.Optional(Type.String({ description: "URL for media/link" }))
}, { additionalProperties: false });
function json(payload) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(payload, null, 2)
		}],
		details: payload
	};
}
function resolveAmbientZalouserTarget(context) {
	const deliveryContext = context?.deliveryContext;
	const rawTarget = deliveryContext?.to;
	if ((deliveryContext?.channel === void 0 || deliveryContext.channel === "zalouser") && typeof rawTarget === "string" && rawTarget.trim()) try {
		return parseZalouserOutboundTarget(rawTarget);
	} catch {}
	if (deliveryContext?.channel && deliveryContext.channel !== "zalouser") return {};
	const ambientThreadId = deliveryContext?.threadId;
	if (typeof ambientThreadId === "string" && ambientThreadId.trim()) return { threadId: ambientThreadId.trim() };
	if (typeof ambientThreadId === "number" && Number.isFinite(ambientThreadId)) return { threadId: String(ambientThreadId) };
	return {};
}
function resolveZalouserSendTarget(params, context) {
	const explicitThreadId = typeof params.threadId === "string" ? params.threadId.trim() : "";
	const ambientTarget = resolveAmbientZalouserTarget(context);
	return {
		threadId: explicitThreadId || ambientTarget.threadId,
		isGroup: typeof params.isGroup === "boolean" ? params.isGroup : ambientTarget.isGroup
	};
}
async function executeZalouserTool(_toolCallId, params, _signal, _onUpdate, context) {
	try {
		switch (params.action) {
			case "send": {
				const target = resolveZalouserSendTarget(params, context);
				if (!target.threadId || !params.message) throw new Error("threadId and message required for send action");
				const result = await sendMessageZalouser(target.threadId, params.message, {
					profile: params.profile,
					isGroup: target.isGroup
				});
				if (!result.ok) throw new Error(result.error || "Failed to send message");
				return json({
					success: true,
					messageId: result.messageId
				});
			}
			case "image": {
				const target = resolveZalouserSendTarget(params, context);
				if (!target.threadId) throw new Error("threadId required for image action");
				if (!params.url) throw new Error("url required for image action");
				const result = await sendImageZalouser(target.threadId, params.url, {
					profile: params.profile,
					caption: params.message,
					isGroup: target.isGroup
				});
				if (!result.ok) throw new Error(result.error || "Failed to send image");
				return json({
					success: true,
					messageId: result.messageId
				});
			}
			case "link": {
				const target = resolveZalouserSendTarget(params, context);
				if (!target.threadId || !params.url) throw new Error("threadId and url required for link action");
				const result = await sendLinkZalouser(target.threadId, params.url, {
					profile: params.profile,
					caption: params.message,
					isGroup: target.isGroup
				});
				if (!result.ok) throw new Error(result.error || "Failed to send link");
				return json({
					success: true,
					messageId: result.messageId
				});
			}
			case "friends": return json(await listZaloFriendsMatching(params.profile, params.query));
			case "groups": return json(await listZaloGroupsMatching(params.profile, params.query));
			case "me": return json(await getZaloUserInfo(params.profile) ?? { error: "Not authenticated" });
			case "status": {
				const authenticated = await checkZaloAuthenticated(params.profile);
				return json({
					authenticated,
					output: authenticated ? "authenticated" : "not authenticated"
				});
			}
			default:
				params.action;
				throw new Error(`Unknown action: ${String(params.action)}. Valid actions: send, image, link, friends, groups, me, status`);
		}
	} catch (err) {
		return json({ error: err instanceof Error ? err.message : String(err) });
	}
}
function createZalouserTool(context) {
	return {
		name: "zalouser",
		label: "Zalo Personal",
		description: "Send messages and access data via Zalo personal account. Actions: send (text message), image (send image URL), link (send link), friends (list/search friends), groups (list groups), me (profile info), status (auth check).",
		parameters: ZalouserToolSchema,
		execute: async (toolCallId, params, signal, onUpdate) => await executeZalouserTool(toolCallId, params, signal, onUpdate, context)
	};
}
//#endregion
//#region extensions/zalouser/index.ts
var zalouser_default = defineChannelPluginEntry({
	id: "zalouser",
	name: "Zalo Personal",
	description: "Zalo personal account messaging via native zca-js integration",
	plugin: zalouserPlugin,
	setRuntime: setZalouserRuntime,
	registerFull(api) {
		api.registerTool((ctx) => createZalouserTool(ctx), { name: "zalouser" });
	}
});
//#endregion
export { zalouser_default as default, setZalouserRuntime, zalouserPlugin };
