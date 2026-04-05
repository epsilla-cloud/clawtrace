import { getChatInfo as getChatInfoImpl, getChatMembers as getChatMembersImpl, getFeishuMemberInfo as getFeishuMemberInfoImpl } from "./chat.js";
import { listFeishuDirectoryGroupsLive as listFeishuDirectoryGroupsLiveImpl, listFeishuDirectoryPeersLive as listFeishuDirectoryPeersLiveImpl } from "./directory.js";
import { createPinFeishu as createPinFeishuImpl, listPinsFeishu as listPinsFeishuImpl, removePinFeishu as removePinFeishuImpl } from "./pins.js";
import { probeFeishu as probeFeishuImpl } from "./probe.js";
import { addReactionFeishu as addReactionFeishuImpl, listReactionsFeishu as listReactionsFeishuImpl, removeReactionFeishu as removeReactionFeishuImpl } from "./reactions.js";
import { editMessageFeishu as editMessageFeishuImpl, getMessageFeishu as getMessageFeishuImpl, sendCardFeishu as sendCardFeishuImpl, sendMessageFeishu as sendMessageFeishuImpl } from "./send.js";
export declare const feishuChannelRuntime: {
    listFeishuDirectoryGroupsLive: typeof listFeishuDirectoryGroupsLiveImpl;
    listFeishuDirectoryPeersLive: typeof listFeishuDirectoryPeersLiveImpl;
    feishuOutbound: {
        deliveryMode: "direct" | "gateway" | "hybrid";
        chunker?: ((text: string, limit: number) => string[]) | null;
        chunkerMode?: "text" | "markdown";
        textChunkLimit?: number;
        pollMaxOptions?: number;
        normalizePayload?: (params: {
            payload: import("openclaw/plugin-sdk").ReplyPayload;
        }) => import("openclaw/plugin-sdk").ReplyPayload | null;
        shouldSkipPlainTextSanitization?: (params: {
            payload: import("openclaw/plugin-sdk").ReplyPayload;
        }) => boolean;
        resolveEffectiveTextChunkLimit?: (params: {
            cfg: import("openclaw/plugin-sdk").OpenClawConfig;
            accountId?: string | null;
            fallbackLimit?: number;
        }) => number | undefined;
        resolveTarget?: (params: {
            cfg?: import("openclaw/plugin-sdk").OpenClawConfig;
            to?: string;
            allowFrom?: string[];
            accountId?: string | null;
            mode?: import("openclaw/plugin-sdk/channel-runtime").ChannelOutboundTargetMode;
        }) => {
            ok: true;
            to: string;
        } | {
            ok: false;
            error: Error;
        };
        sendPayload?: (ctx: import("../../../src/channels/plugins/types.adapters.ts").ChannelOutboundPayloadContext) => Promise<import("openclaw/plugin-sdk/twitch").OutboundDeliveryResult>;
        sendFormattedText?: (ctx: import("../../../src/channels/plugins/types.adapters.ts").ChannelOutboundFormattedContext) => Promise<import("openclaw/plugin-sdk/twitch").OutboundDeliveryResult[]>;
        sendFormattedMedia?: (ctx: import("../../../src/channels/plugins/types.adapters.ts").ChannelOutboundFormattedContext & {
            mediaUrl: string;
        }) => Promise<import("openclaw/plugin-sdk/twitch").OutboundDeliveryResult>;
        sendText?: (ctx: import("openclaw/plugin-sdk/channel-runtime").ChannelOutboundContext) => Promise<import("openclaw/plugin-sdk/twitch").OutboundDeliveryResult>;
        sendMedia?: (ctx: import("openclaw/plugin-sdk/channel-runtime").ChannelOutboundContext) => Promise<import("openclaw/plugin-sdk/twitch").OutboundDeliveryResult>;
        sendPoll?: (ctx: import("openclaw/plugin-sdk/channel-runtime").ChannelPollContext) => Promise<import("openclaw/plugin-sdk/channel-runtime").ChannelPollResult>;
    };
    createPinFeishu: typeof createPinFeishuImpl;
    listPinsFeishu: typeof listPinsFeishuImpl;
    removePinFeishu: typeof removePinFeishuImpl;
    probeFeishu: typeof probeFeishuImpl;
    addReactionFeishu: typeof addReactionFeishuImpl;
    listReactionsFeishu: typeof listReactionsFeishuImpl;
    removeReactionFeishu: typeof removeReactionFeishuImpl;
    getChatInfo: typeof getChatInfoImpl;
    getChatMembers: typeof getChatMembersImpl;
    getFeishuMemberInfo: typeof getFeishuMemberInfoImpl;
    editMessageFeishu: typeof editMessageFeishuImpl;
    getMessageFeishu: typeof getMessageFeishuImpl;
    sendCardFeishu: typeof sendCardFeishuImpl;
    sendMessageFeishu: typeof sendMessageFeishuImpl;
};
