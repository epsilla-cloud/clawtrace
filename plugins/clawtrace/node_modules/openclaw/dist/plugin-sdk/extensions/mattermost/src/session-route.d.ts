import { type ChannelOutboundSessionRouteParams } from "openclaw/plugin-sdk/core";
export declare function resolveMattermostOutboundSessionRoute(params: ChannelOutboundSessionRouteParams): {
    threadId?: string | number;
    sessionKey: string;
    baseSessionKey: string;
    peer: {
        kind: import("openclaw/plugin-sdk/channel-runtime").ChatType;
        id: string;
    };
    chatType: "direct" | "group" | "channel";
    from: string;
    to: string;
} | null;
