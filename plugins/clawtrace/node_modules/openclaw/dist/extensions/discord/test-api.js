import { Nc as buildDiscordInboundAccessContext, Pc as discordOutbound } from "../../auth-profiles-B5ypC5S-.js";
import { t as finalizeInboundContext } from "../../inbound-context-CaoGLQ0Y.js";
//#region extensions/discord/src/monitor/inbound-context.test-helpers.ts
function buildFinalizedDiscordDirectInboundContext() {
	const { groupSystemPrompt, ownerAllowFrom, untrustedContext } = buildDiscordInboundAccessContext({
		channelConfig: null,
		guildInfo: null,
		sender: {
			id: "U1",
			name: "Alice",
			tag: "alice"
		},
		isGuild: false
	});
	return finalizeInboundContext({
		Body: "hi",
		BodyForAgent: "hi",
		RawBody: "hi",
		CommandBody: "hi",
		From: "discord:U1",
		To: "user:U1",
		SessionKey: "agent:main:discord:direct:u1",
		AccountId: "default",
		ChatType: "direct",
		ConversationLabel: "Alice",
		SenderName: "Alice",
		SenderId: "U1",
		SenderUsername: "alice",
		GroupSystemPrompt: groupSystemPrompt,
		OwnerAllowFrom: ownerAllowFrom,
		UntrustedContext: untrustedContext,
		Provider: "discord",
		Surface: "discord",
		WasMentioned: false,
		MessageSid: "m1",
		CommandAuthorized: true,
		OriginatingChannel: "discord",
		OriginatingTo: "user:U1"
	});
}
//#endregion
export { buildFinalizedDiscordDirectInboundContext, discordOutbound };
