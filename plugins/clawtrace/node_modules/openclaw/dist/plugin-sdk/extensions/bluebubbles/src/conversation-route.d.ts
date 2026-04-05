import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveAgentRoute } from "openclaw/plugin-sdk/routing";
export declare function resolveBlueBubblesConversationRoute(params: {
    cfg: OpenClawConfig;
    accountId: string;
    isGroup: boolean;
    peerId: string;
    sender: string;
    chatId?: number | null;
    chatGuid?: string | null;
    chatIdentifier?: string | null;
}): ReturnType<typeof resolveAgentRoute>;
