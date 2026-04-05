import { type GroupToolPolicyConfig } from "openclaw/plugin-sdk/channel-policy";
import type { OpenClawConfig } from "./runtime-api.js";
type WhatsAppGroupContext = {
    cfg: OpenClawConfig;
    accountId?: string | null;
    groupId?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
};
export declare function resolveWhatsAppGroupRequireMention(params: WhatsAppGroupContext): boolean;
export declare function resolveWhatsAppGroupToolPolicy(params: WhatsAppGroupContext): GroupToolPolicyConfig | undefined;
export {};
