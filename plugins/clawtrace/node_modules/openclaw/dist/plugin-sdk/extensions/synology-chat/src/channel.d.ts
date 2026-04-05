/**
 * Synology Chat Channel Plugin for OpenClaw.
 *
 * Implements the ChannelPlugin interface following the LINE pattern.
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk/account-resolution";
import { type ChannelPlugin } from "openclaw/plugin-sdk/core";
import type { ResolvedSynologyChatAccount } from "./types.js";
declare const CHANNEL_ID = "synology-chat";
type SynologyChannelGatewayContext = {
    cfg: OpenClawConfig;
    accountId: string;
    abortSignal: AbortSignal;
    log?: {
        info: (message: string) => void;
        warn: (message: string) => void;
        error: (message: string) => void;
    };
};
type SynologyChannelOutboundContext = {
    cfg: OpenClawConfig;
    to: string;
    text?: string;
    mediaUrl?: string;
    accountId?: string | null;
};
type SynologyChannelSendTextContext = SynologyChannelOutboundContext & {
    text: string;
};
type SynologyChatOutboundResult = {
    channel: typeof CHANNEL_ID;
    messageId: string;
    chatId: string;
};
type SynologyChatPlugin = Omit<ChannelPlugin<ResolvedSynologyChatAccount>, "pairing" | "security" | "messaging" | "directory" | "outbound" | "gateway" | "agentPrompt"> & {
    pairing: {
        idLabel: string;
        normalizeAllowEntry?: (entry: string) => string;
        notifyApproval: (params: {
            cfg: OpenClawConfig;
            id: string;
        }) => Promise<void>;
    };
    security: {
        resolveDmPolicy: (params: {
            cfg: OpenClawConfig;
            account: ResolvedSynologyChatAccount;
        }) => {
            policy: string | null | undefined;
            allowFrom?: Array<string | number>;
            normalizeEntry?: (raw: string) => string;
        } | null;
        collectWarnings: (params: {
            cfg: OpenClawConfig;
            account: ResolvedSynologyChatAccount;
        }) => string[];
    };
    messaging: {
        normalizeTarget: (target: string) => string | undefined;
        targetResolver: {
            looksLikeId: (id: string) => boolean;
            hint: string;
        };
    };
    directory: {
        self?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["self"];
        listPeers?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["listPeers"];
        listGroups?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["listGroups"];
    };
    outbound: {
        deliveryMode: "gateway";
        textChunkLimit: number;
        sendText: (ctx: SynologyChannelSendTextContext) => Promise<SynologyChatOutboundResult>;
        sendMedia: (ctx: SynologyChannelOutboundContext) => Promise<SynologyChatOutboundResult>;
    };
    gateway: {
        startAccount: (ctx: SynologyChannelGatewayContext) => Promise<unknown>;
        stopAccount: (ctx: SynologyChannelGatewayContext) => Promise<void>;
    };
    agentPrompt: {
        messageToolHints: () => string[];
    };
};
export declare function createSynologyChatPlugin(): SynologyChatPlugin;
export declare const synologyChatPlugin: SynologyChatPlugin;
export {};
