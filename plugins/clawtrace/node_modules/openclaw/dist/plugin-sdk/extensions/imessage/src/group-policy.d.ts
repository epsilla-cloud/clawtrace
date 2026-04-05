import { type GroupToolPolicyConfig } from "openclaw/plugin-sdk/channel-policy";
import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
type IMessageGroupContext = {
    cfg: OpenClawConfig;
    accountId?: string | null;
    groupId?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
};
export declare function resolveIMessageGroupRequireMention(params: IMessageGroupContext): boolean;
export declare function resolveIMessageGroupToolPolicy(params: IMessageGroupContext): GroupToolPolicyConfig | undefined;
export {};
