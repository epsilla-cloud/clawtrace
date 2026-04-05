import { listSlackDirectoryGroupsLive as listSlackDirectoryGroupsLiveImpl, listSlackDirectoryPeersLive as listSlackDirectoryPeersLiveImpl, monitorSlackProvider as monitorSlackProviderImpl, probeSlack as probeSlackImpl, resolveSlackChannelAllowlist as resolveSlackChannelAllowlistImpl, resolveSlackUserAllowlist as resolveSlackUserAllowlistImpl, sendMessageSlack as sendMessageSlackImpl, handleSlackAction as handleSlackActionImpl } from "../../plugin-sdk/slack.js";
export declare const runtimeSlackOps: {
    listDirectoryGroupsLive: typeof listSlackDirectoryGroupsLiveImpl;
    listDirectoryPeersLive: typeof listSlackDirectoryPeersLiveImpl;
    probeSlack: typeof probeSlackImpl;
    resolveChannelAllowlist: typeof resolveSlackChannelAllowlistImpl;
    resolveUserAllowlist: typeof resolveSlackUserAllowlistImpl;
    sendMessageSlack: typeof sendMessageSlackImpl;
    monitorSlackProvider: typeof monitorSlackProviderImpl;
    handleSlackAction: typeof handleSlackActionImpl;
};
