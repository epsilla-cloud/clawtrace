import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
import type { AllowlistMatch, ChannelGroupContext, GroupToolPolicyConfig } from "../runtime-api.js";
import type { FeishuConfig, FeishuGroupConfig } from "./types.js";
export type FeishuAllowlistMatch = AllowlistMatch<"wildcard" | "id">;
export declare function resolveFeishuAllowlistMatch(params: {
    allowFrom: Array<string | number>;
    senderId: string;
    senderIds?: Array<string | null | undefined>;
    senderName?: string | null;
}): FeishuAllowlistMatch;
export declare function resolveFeishuGroupConfig(params: {
    cfg?: FeishuConfig;
    groupId?: string | null;
}): FeishuGroupConfig | undefined;
export declare function resolveFeishuGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
export declare function isFeishuGroupAllowed(params: {
    groupPolicy: "open" | "allowlist" | "disabled" | "allowall";
    allowFrom: Array<string | number>;
    senderId: string;
    senderIds?: Array<string | null | undefined>;
    senderName?: string | null;
}): boolean;
export declare function resolveFeishuReplyPolicy(params: {
    isDirectMessage: boolean;
    cfg: OpenClawConfig;
    accountId?: string | null;
    groupId?: string | null;
    /**
     * Effective group policy resolved for this chat. When "open", requireMention
     * defaults to false so that non-text messages (e.g. images) that cannot carry
     * @-mentions are still delivered to the agent.
     */
    groupPolicy?: "open" | "allowlist" | "disabled" | "allowall";
}): {
    requireMention: boolean;
};
