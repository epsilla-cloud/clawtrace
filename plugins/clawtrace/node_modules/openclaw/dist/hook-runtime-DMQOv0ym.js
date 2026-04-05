import { r as logVerbose } from "./globals-0H99T-Tx.js";
import "./internal-hooks-Bsi5ta6U.js";
//#region src/hooks/fire-and-forget.ts
function fireAndForgetHook(task, label, logger = logVerbose) {
	task.catch((err) => {
		logger(`${label}: ${String(err)}`);
	});
}
//#endregion
//#region src/hooks/message-hook-mappers.ts
function deriveInboundMessageHookContext(ctx, overrides) {
	const content = overrides?.content ?? (typeof ctx.BodyForCommands === "string" ? ctx.BodyForCommands : typeof ctx.RawBody === "string" ? ctx.RawBody : typeof ctx.Body === "string" ? ctx.Body : "");
	const channelId = (ctx.OriginatingChannel ?? ctx.Surface ?? ctx.Provider ?? "").toLowerCase();
	const conversationId = ctx.OriginatingTo ?? ctx.To ?? ctx.From ?? void 0;
	const isGroup = Boolean(ctx.GroupSubject || ctx.GroupChannel);
	const mediaPaths = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths.filter((value) => typeof value === "string" && value.length > 0) : void 0;
	const mediaTypes = Array.isArray(ctx.MediaTypes) ? ctx.MediaTypes.filter((value) => typeof value === "string" && value.length > 0) : void 0;
	return {
		from: ctx.From ?? "",
		to: ctx.To,
		content,
		body: ctx.Body,
		bodyForAgent: ctx.BodyForAgent,
		transcript: ctx.Transcript,
		timestamp: typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp) ? ctx.Timestamp : void 0,
		channelId,
		accountId: ctx.AccountId,
		conversationId,
		messageId: overrides?.messageId ?? ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast,
		senderId: ctx.SenderId,
		senderName: ctx.SenderName,
		senderUsername: ctx.SenderUsername,
		senderE164: ctx.SenderE164,
		provider: ctx.Provider,
		surface: ctx.Surface,
		threadId: ctx.MessageThreadId,
		mediaPath: ctx.MediaPath ?? mediaPaths?.[0],
		mediaType: ctx.MediaType ?? mediaTypes?.[0],
		mediaPaths,
		mediaTypes,
		originatingChannel: ctx.OriginatingChannel,
		originatingTo: ctx.OriginatingTo,
		guildId: ctx.GroupSpace,
		channelName: ctx.GroupChannel,
		isGroup,
		groupId: isGroup ? conversationId : void 0
	};
}
function buildCanonicalSentMessageHookContext(params) {
	return {
		to: params.to,
		content: params.content,
		success: params.success,
		error: params.error,
		channelId: params.channelId,
		accountId: params.accountId,
		conversationId: params.conversationId ?? params.to,
		messageId: params.messageId,
		isGroup: params.isGroup,
		groupId: params.groupId
	};
}
function toPluginMessageContext(canonical) {
	return {
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId
	};
}
function stripChannelPrefix(value, channelId) {
	if (!value) return;
	for (const prefix of [
		"channel:",
		"chat:",
		"user:"
	]) if (value.startsWith(prefix)) return value.slice(prefix.length);
	const prefix = `${channelId}:`;
	return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}
function deriveParentConversationId(canonical) {
	if (canonical.channelId !== "telegram") return;
	if (typeof canonical.threadId !== "number" && typeof canonical.threadId !== "string") return;
	return stripChannelPrefix(canonical.to ?? canonical.originatingTo ?? canonical.conversationId, "telegram");
}
function deriveConversationId(canonical) {
	if (canonical.channelId === "discord") {
		const rawTarget = canonical.to ?? canonical.originatingTo ?? canonical.conversationId;
		const rawSender = canonical.from;
		const senderUserId = rawSender?.startsWith("discord:user:") ? rawSender.slice(13) : rawSender?.startsWith("discord:") ? rawSender.slice(8) : void 0;
		if (!canonical.isGroup && senderUserId) return `user:${senderUserId}`;
		if (!rawTarget) return;
		if (rawTarget.startsWith("discord:channel:")) return `channel:${rawTarget.slice(16)}`;
		if (rawTarget.startsWith("discord:user:")) return `user:${rawTarget.slice(13)}`;
		if (rawTarget.startsWith("discord:")) return `user:${rawTarget.slice(8)}`;
		if (rawTarget.startsWith("channel:") || rawTarget.startsWith("user:")) return rawTarget;
	}
	const baseConversationId = stripChannelPrefix(canonical.to ?? canonical.originatingTo ?? canonical.conversationId, canonical.channelId);
	if (canonical.channelId === "telegram" && baseConversationId) {
		const threadId = typeof canonical.threadId === "number" || typeof canonical.threadId === "string" ? String(canonical.threadId).trim() : "";
		if (threadId) return `${baseConversationId}:topic:${threadId}`;
	}
	return baseConversationId;
}
function toPluginInboundClaimContext(canonical) {
	const conversationId = deriveConversationId(canonical);
	return {
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId,
		parentConversationId: deriveParentConversationId(canonical),
		senderId: canonical.senderId,
		messageId: canonical.messageId
	};
}
function toPluginInboundClaimEvent(canonical, extras) {
	const context = toPluginInboundClaimContext(canonical);
	return {
		content: canonical.content,
		body: canonical.body,
		bodyForAgent: canonical.bodyForAgent,
		transcript: canonical.transcript,
		timestamp: canonical.timestamp,
		channel: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: context.conversationId,
		parentConversationId: context.parentConversationId,
		senderId: canonical.senderId,
		senderName: canonical.senderName,
		senderUsername: canonical.senderUsername,
		threadId: canonical.threadId,
		messageId: canonical.messageId,
		isGroup: canonical.isGroup,
		commandAuthorized: extras?.commandAuthorized,
		wasMentioned: extras?.wasMentioned,
		metadata: {
			from: canonical.from,
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			originatingChannel: canonical.originatingChannel,
			originatingTo: canonical.originatingTo,
			senderE164: canonical.senderE164,
			mediaPath: canonical.mediaPath,
			mediaType: canonical.mediaType,
			mediaPaths: canonical.mediaPaths,
			mediaTypes: canonical.mediaTypes,
			guildId: canonical.guildId,
			channelName: canonical.channelName,
			groupId: canonical.groupId
		}
	};
}
function toPluginMessageReceivedEvent(canonical) {
	return {
		from: canonical.from,
		content: canonical.content,
		timestamp: canonical.timestamp,
		metadata: {
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			threadId: canonical.threadId,
			originatingChannel: canonical.originatingChannel,
			originatingTo: canonical.originatingTo,
			messageId: canonical.messageId,
			senderId: canonical.senderId,
			senderName: canonical.senderName,
			senderUsername: canonical.senderUsername,
			senderE164: canonical.senderE164,
			guildId: canonical.guildId,
			channelName: canonical.channelName
		}
	};
}
function toPluginMessageSentEvent(canonical) {
	return {
		to: canonical.to,
		content: canonical.content,
		success: canonical.success,
		...canonical.error ? { error: canonical.error } : {}
	};
}
function toInternalMessageReceivedContext(canonical) {
	return {
		from: canonical.from,
		content: canonical.content,
		timestamp: canonical.timestamp,
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		metadata: {
			to: canonical.to,
			provider: canonical.provider,
			surface: canonical.surface,
			threadId: canonical.threadId,
			senderId: canonical.senderId,
			senderName: canonical.senderName,
			senderUsername: canonical.senderUsername,
			senderE164: canonical.senderE164,
			guildId: canonical.guildId,
			channelName: canonical.channelName
		}
	};
}
function toInternalMessageTranscribedContext(canonical, cfg) {
	return {
		...toInternalInboundMessageHookContextBase(canonical),
		transcript: canonical.transcript ?? "",
		cfg
	};
}
function toInternalMessagePreprocessedContext(canonical, cfg) {
	return {
		...toInternalInboundMessageHookContextBase(canonical),
		transcript: canonical.transcript,
		isGroup: canonical.isGroup,
		groupId: canonical.groupId,
		cfg
	};
}
function toInternalInboundMessageHookContextBase(canonical) {
	return {
		from: canonical.from,
		to: canonical.to,
		body: canonical.body,
		bodyForAgent: canonical.bodyForAgent,
		timestamp: canonical.timestamp,
		channelId: canonical.channelId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		senderId: canonical.senderId,
		senderName: canonical.senderName,
		senderUsername: canonical.senderUsername,
		provider: canonical.provider,
		surface: canonical.surface,
		mediaPath: canonical.mediaPath,
		mediaType: canonical.mediaType
	};
}
function toInternalMessageSentContext(canonical) {
	return {
		to: canonical.to,
		content: canonical.content,
		success: canonical.success,
		...canonical.error ? { error: canonical.error } : {},
		channelId: canonical.channelId,
		accountId: canonical.accountId,
		conversationId: canonical.conversationId,
		messageId: canonical.messageId,
		...canonical.isGroup != null ? { isGroup: canonical.isGroup } : {},
		...canonical.groupId ? { groupId: canonical.groupId } : {}
	};
}
//#endregion
export { toInternalMessageSentContext as a, toPluginInboundClaimEvent as c, toPluginMessageSentEvent as d, fireAndForgetHook as f, toInternalMessageReceivedContext as i, toPluginMessageContext as l, deriveInboundMessageHookContext as n, toInternalMessageTranscribedContext as o, toInternalMessagePreprocessedContext as r, toPluginInboundClaimContext as s, buildCanonicalSentMessageHookContext as t, toPluginMessageReceivedEvent as u };
