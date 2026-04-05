import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveAgentRoute } from "openclaw/plugin-sdk/routing";
export declare function resolveIMessageConversationRoute(params: {
    cfg: OpenClawConfig;
    accountId: string;
    isGroup: boolean;
    peerId: string;
    sender: string;
    chatId?: number;
}): ReturnType<typeof resolveAgentRoute>;
