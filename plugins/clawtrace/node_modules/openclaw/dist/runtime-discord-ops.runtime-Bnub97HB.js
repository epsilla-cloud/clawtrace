import { Ec as probeDiscord, Fu as listDiscordDirectoryGroupsLive, Iu as listDiscordDirectoryPeersLive, Ol as sendTypingDiscord, Ou as editChannelDiscord, Sl as auditDiscordChannelPermissions, Xl as sendPollDiscord, Yl as sendMessageDiscord, _c as monitorDiscordProvider, bc as resolveDiscordChannelAllowlist, jl as sendDiscordComponentMessage, nu as deleteMessageDiscord, ru as editMessageDiscord, su as pinMessageDiscord, tu as createThreadDiscord, uu as unpinMessageDiscord, yc as resolveDiscordUserAllowlist } from "./auth-profiles-B5ypC5S-.js";
//#region src/plugins/runtime/runtime-discord-ops.runtime.ts
const runtimeDiscordOps = {
	auditChannelPermissions: auditDiscordChannelPermissions,
	listDirectoryGroupsLive: listDiscordDirectoryGroupsLive,
	listDirectoryPeersLive: listDiscordDirectoryPeersLive,
	probeDiscord,
	resolveChannelAllowlist: resolveDiscordChannelAllowlist,
	resolveUserAllowlist: resolveDiscordUserAllowlist,
	sendComponentMessage: sendDiscordComponentMessage,
	sendMessageDiscord,
	sendPollDiscord,
	monitorDiscordProvider,
	typing: { pulse: sendTypingDiscord },
	conversationActions: {
		editMessage: editMessageDiscord,
		deleteMessage: deleteMessageDiscord,
		pinMessage: pinMessageDiscord,
		unpinMessage: unpinMessageDiscord,
		createThread: createThreadDiscord,
		editChannel: editChannelDiscord
	}
};
//#endregion
export { runtimeDiscordOps };
