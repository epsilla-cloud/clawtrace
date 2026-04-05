import type { loadConfig } from "openclaw/plugin-sdk/config-runtime";
export declare function resolveGroupPolicyFor(cfg: ReturnType<typeof loadConfig>, conversationId: string): import("openclaw/plugin-sdk/config-runtime").ChannelGroupPolicy;
export declare function resolveGroupRequireMentionFor(cfg: ReturnType<typeof loadConfig>, conversationId: string): boolean;
export declare function resolveGroupActivationFor(params: {
    cfg: ReturnType<typeof loadConfig>;
    agentId: string;
    sessionKey: string;
    conversationId: string;
}): import("../../../../../src/auto-reply/group-activation.ts").GroupActivationMode;
