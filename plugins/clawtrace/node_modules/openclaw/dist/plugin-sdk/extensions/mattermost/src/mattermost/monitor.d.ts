import { type MattermostEventPayload, type MattermostWebSocketFactory } from "./monitor-websocket.js";
import type { ChannelAccountSnapshot, ChatType, OpenClawConfig, RuntimeEnv } from "./runtime-api.js";
export { evaluateMattermostMentionGate, mapMattermostChannelTypeToChatType, } from "./monitor-gating.js";
export type { MattermostMentionGateInput, MattermostRequireMentionResolverInput, } from "./monitor-gating.js";
export type MonitorMattermostOpts = {
    botToken?: string;
    baseUrl?: string;
    accountId?: string;
    config?: OpenClawConfig;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    statusSink?: (patch: Partial<ChannelAccountSnapshot>) => void;
    webSocketFactory?: MattermostWebSocketFactory;
};
export declare function resolveMattermostReplyRootId(params: {
    threadRootId?: string;
    replyToId?: string;
}): string | undefined;
export declare function resolveMattermostEffectiveReplyToId(params: {
    kind: ChatType;
    postId?: string | null;
    replyToMode: "off" | "first" | "all";
    threadRootId?: string | null;
}): string | undefined;
export declare function resolveMattermostThreadSessionContext(params: {
    baseSessionKey: string;
    kind: ChatType;
    postId?: string | null;
    replyToMode: "off" | "first" | "all";
    threadRootId?: string | null;
}): {
    effectiveReplyToId?: string;
    sessionKey: string;
    parentSessionKey?: string;
};
export declare function resolveMattermostReactionChannelId(payload: Pick<MattermostEventPayload, "broadcast" | "data">): string | undefined;
export declare function monitorMattermostProvider(opts?: MonitorMattermostOpts): Promise<void>;
