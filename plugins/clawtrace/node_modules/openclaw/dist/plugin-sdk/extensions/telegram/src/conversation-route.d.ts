import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type ConfiguredBindingRouteResult } from "openclaw/plugin-sdk/conversation-runtime";
import { resolveAgentRoute } from "openclaw/plugin-sdk/routing";
export declare function resolveTelegramConversationRoute(params: {
    cfg: OpenClawConfig;
    accountId: string;
    chatId: number | string;
    isGroup: boolean;
    resolvedThreadId?: number;
    replyThreadId?: number;
    senderId?: string | number | null;
    topicAgentId?: string | null;
}): {
    route: ReturnType<typeof resolveAgentRoute>;
    configuredBinding: ConfiguredBindingRouteResult["bindingResolution"];
    configuredBindingSessionKey: string;
};
export declare function resolveTelegramConversationBaseSessionKey(params: {
    cfg: OpenClawConfig;
    route: Pick<ReturnType<typeof resolveTelegramConversationRoute>["route"], "agentId" | "accountId" | "matchedBy" | "sessionKey">;
    chatId: number | string;
    isGroup: boolean;
    senderId?: string | number | null;
}): string;
