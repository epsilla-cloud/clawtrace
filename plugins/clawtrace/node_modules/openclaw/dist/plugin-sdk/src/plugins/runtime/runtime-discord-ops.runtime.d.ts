import { auditDiscordChannelPermissions as auditDiscordChannelPermissionsImpl, listDiscordDirectoryGroupsLive as listDiscordDirectoryGroupsLiveImpl, listDiscordDirectoryPeersLive as listDiscordDirectoryPeersLiveImpl, monitorDiscordProvider as monitorDiscordProviderImpl, probeDiscord as probeDiscordImpl, resolveDiscordChannelAllowlist as resolveDiscordChannelAllowlistImpl, resolveDiscordUserAllowlist as resolveDiscordUserAllowlistImpl } from "../../plugin-sdk/discord.js";
import { createThreadDiscord as createThreadDiscordImpl, deleteMessageDiscord as deleteMessageDiscordImpl, editChannelDiscord as editChannelDiscordImpl, editMessageDiscord as editMessageDiscordImpl, pinMessageDiscord as pinMessageDiscordImpl, sendDiscordComponentMessage as sendDiscordComponentMessageImpl, sendMessageDiscord as sendMessageDiscordImpl, sendPollDiscord as sendPollDiscordImpl, sendTypingDiscord as sendTypingDiscordImpl, unpinMessageDiscord as unpinMessageDiscordImpl } from "../../plugin-sdk/discord.js";
export declare const runtimeDiscordOps: {
    auditChannelPermissions: typeof auditDiscordChannelPermissionsImpl;
    listDirectoryGroupsLive: typeof listDiscordDirectoryGroupsLiveImpl;
    listDirectoryPeersLive: typeof listDiscordDirectoryPeersLiveImpl;
    probeDiscord: typeof probeDiscordImpl;
    resolveChannelAllowlist: typeof resolveDiscordChannelAllowlistImpl;
    resolveUserAllowlist: typeof resolveDiscordUserAllowlistImpl;
    sendComponentMessage: typeof sendDiscordComponentMessageImpl;
    sendMessageDiscord: typeof sendMessageDiscordImpl;
    sendPollDiscord: typeof sendPollDiscordImpl;
    monitorDiscordProvider: typeof monitorDiscordProviderImpl;
    typing: {
        pulse: typeof sendTypingDiscordImpl;
    };
    conversationActions: {
        editMessage: typeof editMessageDiscordImpl;
        deleteMessage: typeof deleteMessageDiscordImpl;
        pinMessage: typeof pinMessageDiscordImpl;
        unpinMessage: typeof unpinMessageDiscordImpl;
        createThread: typeof createThreadDiscordImpl;
        editChannel: typeof editChannelDiscordImpl;
    };
};
