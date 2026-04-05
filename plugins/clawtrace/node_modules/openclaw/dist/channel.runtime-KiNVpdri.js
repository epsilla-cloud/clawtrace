import { r as resolveOutboundSendDep } from "./outbound-runtime-B03J2h4O.js";
import { i as createAttachedChannelResultAdapter } from "./channel-send-result-RbMxgkKK.js";
import { t as chunkTextForOutbound } from "./text-chunking-DzwxNDbL.js";
import "./runtime-api-CMECrhfj.js";
import { a as listChannelsForTeam, c as postGraphBetaJson, i as fetchGraphJson, l as postGraphJson, n as deleteGraphRequest, o as listTeamsByName, r as escapeOData, s as normalizeQuery, t as searchGraphUsers, u as resolveGraphToken } from "./graph-users-DrDnmDGP.js";
import { S as createMSTeamsConversationStoreFs, a as sendMessageMSTeams, b as createMSTeamsPollStoreFs, i as sendAdaptiveCardMSTeams, n as deleteMessageMSTeams, o as sendPollMSTeams, r as editMessageMSTeams, t as probeMSTeams } from "./probe-EcuO21_J.js";
//#region extensions/msteams/src/directory-live.ts
async function listMSTeamsDirectoryPeersLive(params) {
	const query = normalizeQuery(params.query);
	if (!query) return [];
	return (await searchGraphUsers({
		token: await resolveGraphToken(params.cfg),
		query,
		top: typeof params.limit === "number" && params.limit > 0 ? params.limit : 20
	})).map((user) => {
		const id = user.id?.trim();
		if (!id) return null;
		const name = user.displayName?.trim();
		const handle = user.userPrincipalName?.trim() || user.mail?.trim();
		return {
			kind: "user",
			id: `user:${id}`,
			name: name || void 0,
			handle: handle ? `@${handle}` : void 0,
			raw: user
		};
	}).filter(Boolean);
}
async function listMSTeamsDirectoryGroupsLive(params) {
	const rawQuery = normalizeQuery(params.query);
	if (!rawQuery) return [];
	const token = await resolveGraphToken(params.cfg);
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
	const [teamQuery, channelQuery] = rawQuery.includes("/") ? rawQuery.split("/", 2).map((part) => part.trim()).filter(Boolean) : [rawQuery, null];
	const teams = await listTeamsByName(token, teamQuery);
	const results = [];
	for (const team of teams) {
		const teamId = team.id?.trim();
		if (!teamId) continue;
		const teamName = team.displayName?.trim() || teamQuery;
		if (!channelQuery) {
			results.push({
				kind: "group",
				id: `team:${teamId}`,
				name: teamName,
				handle: teamName ? `#${teamName}` : void 0,
				raw: team
			});
			if (results.length >= limit) return results;
			continue;
		}
		const channels = await listChannelsForTeam(token, teamId);
		for (const channel of channels) {
			const name = channel.displayName?.trim();
			if (!name) continue;
			if (!name.toLowerCase().includes(channelQuery.toLowerCase())) continue;
			results.push({
				kind: "group",
				id: `conversation:${channel.id}`,
				name: `${teamName}/${name}`,
				handle: `#${name}`,
				raw: channel
			});
			if (results.length >= limit) return results;
		}
	}
	return results;
}
//#endregion
//#region extensions/msteams/src/graph-messages.ts
/**
* Resolve the Graph API path prefix for a conversation.
* If `to` contains "/" it's a `teamId/channelId` (channel path),
* otherwise it's a chat ID.
*/
/**
* Strip common target prefixes (`conversation:`, `user:`) so raw
* conversation IDs can be used directly in Graph paths.
*/
function stripTargetPrefix(raw) {
	const trimmed = raw.trim();
	if (/^conversation:/i.test(trimmed)) return trimmed.slice(13).trim();
	if (/^user:/i.test(trimmed)) return trimmed.slice(5).trim();
	return trimmed;
}
/**
* Resolve a target to a Graph-compatible conversation ID.
* `user:<aadId>` targets are looked up in the conversation store to find the
* actual `19:xxx@thread.*` chat ID that Graph API requires.
* Conversation IDs and `teamId/channelId` pairs pass through unchanged.
*/
async function resolveGraphConversationId(to) {
	const trimmed = to.trim();
	const isUserTarget = /^user:/i.test(trimmed);
	const cleaned = stripTargetPrefix(trimmed);
	if (!isUserTarget) return cleaned;
	const found = await createMSTeamsConversationStoreFs().findPreferredDmByUserId(cleaned);
	if (!found) throw new Error(`No conversation found for user:${cleaned}. The bot must receive a message from this user before Graph API operations work.`);
	if (found.reference.graphChatId) return found.reference.graphChatId;
	if (found.conversationId.startsWith("19:")) return found.conversationId;
	throw new Error(`Conversation for user:${cleaned} uses a Bot Framework ID (${found.conversationId}) that Graph API does not accept. Send a message to this user first so the Graph chat ID is cached.`);
}
function resolveConversationPath(to) {
	const cleaned = stripTargetPrefix(to);
	if (cleaned.includes("/")) {
		const [teamId, channelId] = cleaned.split("/", 2);
		return {
			kind: "channel",
			basePath: `/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}`,
			teamId,
			channelId
		};
	}
	return {
		kind: "chat",
		basePath: `/chats/${encodeURIComponent(cleaned)}`,
		chatId: cleaned
	};
}
/**
* Retrieve a single message by ID from a chat or channel via Graph API.
*/
async function getMessageMSTeams(params) {
	const token = await resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const msg = await fetchGraphJson({
		token,
		path: `${basePath}/messages/${encodeURIComponent(params.messageId)}`
	});
	return {
		id: msg.id ?? params.messageId,
		text: msg.body?.content,
		from: msg.from,
		createdAt: msg.createdDateTime
	};
}
/**
* Pin a message in a chat conversation via Graph API.
* Channel pinning uses a different endpoint (beta) handled separately.
*/
async function pinMessageMSTeams(params) {
	const token = await resolveGraphToken(params.cfg);
	const conv = resolveConversationPath(await resolveGraphConversationId(params.to));
	if (conv.kind === "channel") {
		await postGraphJson({
			token,
			path: `${conv.basePath}/pinnedMessages`,
			body: { message: { id: params.messageId } }
		});
		return { ok: true };
	}
	return {
		ok: true,
		pinnedMessageId: (await postGraphJson({
			token,
			path: `${conv.basePath}/pinnedMessages`,
			body: { message: { id: params.messageId } }
		})).id
	};
}
/**
* Unpin a message in a chat conversation via Graph API.
* `pinnedMessageId` is the pinned-message resource ID (from pin or list-pins),
* not the underlying chat message ID.
*/
async function unpinMessageMSTeams(params) {
	await deleteGraphRequest({
		token: await resolveGraphToken(params.cfg),
		path: `${resolveConversationPath(await resolveGraphConversationId(params.to)).basePath}/pinnedMessages/${encodeURIComponent(params.pinnedMessageId)}`
	});
	return { ok: true };
}
/**
* List all pinned messages in a chat conversation via Graph API.
*/
async function listPinsMSTeams(params) {
	return { pins: ((await fetchGraphJson({
		token: await resolveGraphToken(params.cfg),
		path: `${resolveConversationPath(await resolveGraphConversationId(params.to)).basePath}/pinnedMessages?$expand=message`
	})).value ?? []).map((pin) => ({
		id: pin.id ?? "",
		pinnedMessageId: pin.id ?? "",
		messageId: pin.message?.id,
		text: pin.message?.body?.content
	})) };
}
const TEAMS_REACTION_TYPES = [
	"like",
	"heart",
	"laugh",
	"surprised",
	"sad",
	"angry"
];
function validateReactionType(raw) {
	const normalized = raw.toLowerCase().trim();
	if (!TEAMS_REACTION_TYPES.includes(normalized)) throw new Error(`Invalid reaction type "${raw}". Valid types: ${TEAMS_REACTION_TYPES.join(", ")}`);
	return normalized;
}
/**
* Add an emoji reaction to a message via Graph API (beta).
*/
async function reactMessageMSTeams(params) {
	const reactionType = validateReactionType(params.reactionType);
	const token = await resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	await postGraphBetaJson({
		token,
		path: `${basePath}/messages/${encodeURIComponent(params.messageId)}/setReaction`,
		body: { reactionType }
	});
	return { ok: true };
}
/**
* Remove an emoji reaction from a message via Graph API (beta).
*/
async function unreactMessageMSTeams(params) {
	const reactionType = validateReactionType(params.reactionType);
	const token = await resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	await postGraphBetaJson({
		token,
		path: `${basePath}/messages/${encodeURIComponent(params.messageId)}/unsetReaction`,
		body: { reactionType }
	});
	return { ok: true };
}
/**
* List reactions on a message, grouped by type.
* Uses Graph v1.0 (reactions are included in the message resource).
*/
async function listReactionsMSTeams(params) {
	const token = await resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const msg = await fetchGraphJson({
		token,
		path: `${basePath}/messages/${encodeURIComponent(params.messageId)}`
	});
	const grouped = /* @__PURE__ */ new Map();
	for (const reaction of msg.reactions ?? []) {
		const type = reaction.reactionType ?? "unknown";
		if (!grouped.has(type)) grouped.set(type, []);
		if (reaction.user?.id) grouped.get(type).push({
			id: reaction.user.id,
			displayName: reaction.user.displayName
		});
	}
	return { reactions: Array.from(grouped.entries()).map(([type, users]) => ({
		reactionType: type,
		count: users.length,
		users
	})) };
}
const SEARCH_DEFAULT_LIMIT = 25;
const SEARCH_MAX_LIMIT = 50;
/**
* Search messages in a chat or channel by content via Graph API.
* Uses `$search` for full-text body search and optional `$filter` for sender.
*/
async function searchMessagesMSTeams(params) {
	const token = await resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const rawLimit = params.limit ?? SEARCH_DEFAULT_LIMIT;
	const top = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), SEARCH_MAX_LIMIT) : SEARCH_DEFAULT_LIMIT;
	const sanitizedQuery = params.query.replace(/"/g, "");
	const parts = [`$search=${encodeURIComponent(`"${sanitizedQuery}"`)}`];
	parts.push(`$top=${top}`);
	if (params.from) parts.push(`$filter=${encodeURIComponent(`from/user/displayName eq '${escapeOData(params.from)}'`)}`);
	return { messages: ((await fetchGraphJson({
		token,
		path: `${basePath}/messages?${parts.join("&")}`,
		headers: { ConsistencyLevel: "eventual" }
	})).value ?? []).map((msg) => ({
		id: msg.id ?? "",
		text: msg.body?.content,
		from: msg.from,
		createdAt: msg.createdDateTime
	})) };
}
//#endregion
//#region extensions/msteams/src/channel.runtime.ts
const msTeamsChannelRuntime = {
	deleteMessageMSTeams,
	editMessageMSTeams,
	getMessageMSTeams,
	listPinsMSTeams,
	listReactionsMSTeams,
	pinMessageMSTeams,
	reactMessageMSTeams,
	searchMessagesMSTeams,
	unpinMessageMSTeams,
	unreactMessageMSTeams,
	listMSTeamsDirectoryGroupsLive,
	listMSTeamsDirectoryPeersLive,
	msteamsOutbound: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "markdown",
		textChunkLimit: 4e3,
		pollMaxOptions: 12,
		...createAttachedChannelResultAdapter({
			channel: "msteams",
			sendText: async ({ cfg, to, text, deps }) => {
				return await (resolveOutboundSendDep(deps, "msteams") ?? ((to, text) => sendMessageMSTeams({
					cfg,
					to,
					text
				})))(to, text);
			},
			sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, deps }) => {
				return await (resolveOutboundSendDep(deps, "msteams") ?? ((to, text, opts) => sendMessageMSTeams({
					cfg,
					to,
					text,
					mediaUrl: opts?.mediaUrl,
					mediaLocalRoots: opts?.mediaLocalRoots
				})))(to, text, {
					mediaUrl,
					mediaLocalRoots
				});
			},
			sendPoll: async ({ cfg, to, poll }) => {
				const maxSelections = poll.maxSelections ?? 1;
				const result = await sendPollMSTeams({
					cfg,
					to,
					question: poll.question,
					options: poll.options,
					maxSelections
				});
				await createMSTeamsPollStoreFs().createPoll({
					id: result.pollId,
					question: poll.question,
					options: poll.options,
					maxSelections,
					createdAt: (/* @__PURE__ */ new Date()).toISOString(),
					conversationId: result.conversationId,
					messageId: result.messageId,
					votes: {}
				});
				return result;
			}
		})
	},
	probeMSTeams,
	sendAdaptiveCardMSTeams,
	sendMessageMSTeams
};
//#endregion
export { msTeamsChannelRuntime };
