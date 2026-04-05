import type { ChannelAgentTool, ChannelMessageActionName } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
type ChannelAgentToolMeta = {
    channelId: string;
};
export declare function getChannelAgentToolMeta(tool: ChannelAgentTool): ChannelAgentToolMeta | undefined;
export declare function copyChannelAgentToolMeta(source: ChannelAgentTool, target: ChannelAgentTool): void;
/**
 * Get the list of supported message actions for a specific channel.
 * Returns an empty array if channel is not found or has no actions configured.
 */
export declare function listChannelSupportedActions(params: {
    cfg?: OpenClawConfig;
    channel?: string;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
}): ChannelMessageActionName[];
/**
 * Get the list of all supported message actions across all configured channels.
 */
export declare function listAllChannelSupportedActions(params: {
    cfg?: OpenClawConfig;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
}): ChannelMessageActionName[];
export declare function listChannelAgentTools(params: {
    cfg?: OpenClawConfig;
}): ChannelAgentTool[];
export declare function resolveChannelMessageToolHints(params: {
    cfg?: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
}): string[];
export declare const __testing: {
    resetLoggedListActionErrors(): void;
};
export {};
