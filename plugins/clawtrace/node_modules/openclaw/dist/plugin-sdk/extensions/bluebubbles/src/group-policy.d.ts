import { type GroupToolPolicyConfig } from "openclaw/plugin-sdk/channel-policy";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
type BlueBubblesGroupContext = {
    cfg: OpenClawConfig;
    accountId?: string | null;
    groupId?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
};
export declare function resolveBlueBubblesGroupRequireMention(params: BlueBubblesGroupContext): boolean;
export declare function resolveBlueBubblesGroupToolPolicy(params: BlueBubblesGroupContext): GroupToolPolicyConfig | undefined;
export {};
