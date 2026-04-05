import { type RoutePeer } from "openclaw/plugin-sdk/routing";
import type { OpenClawConfig } from "./runtime-api.js";
export type ResolveDiscordOutboundSessionRouteParams = {
    cfg: OpenClawConfig;
    agentId: string;
    accountId?: string | null;
    target: string;
    resolvedTarget?: {
        kind: string;
    };
    replyToId?: string | null;
    threadId?: string | number | null;
};
export declare function resolveDiscordOutboundSessionRoute(params: ResolveDiscordOutboundSessionRouteParams): {
    sessionKey: string;
    baseSessionKey: string;
    peer: RoutePeer;
    chatType: "direct" | "channel";
    from: string;
    to: string;
    threadId: string | undefined;
} | null;
