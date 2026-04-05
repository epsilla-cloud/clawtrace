import type { ChatType, OpenClawConfig } from "./runtime-api.js";
export declare function mapMattermostChannelTypeToChatType(channelType?: string | null): ChatType;
export type MattermostRequireMentionResolverInput = {
    cfg: OpenClawConfig;
    channel: "mattermost";
    accountId: string;
    groupId: string;
    requireMentionOverride?: boolean;
};
export type MattermostMentionGateInput = {
    kind: ChatType;
    cfg: OpenClawConfig;
    accountId: string;
    channelId: string;
    threadRootId?: string;
    requireMentionOverride?: boolean;
    resolveRequireMention: (params: MattermostRequireMentionResolverInput) => boolean;
    wasMentioned: boolean;
    isControlCommand: boolean;
    commandAuthorized: boolean;
    oncharEnabled: boolean;
    oncharTriggered: boolean;
    canDetectMention: boolean;
};
type MattermostMentionGateDecision = {
    shouldRequireMention: boolean;
    shouldBypassMention: boolean;
    effectiveWasMentioned: boolean;
    dropReason: "onchar-not-triggered" | "missing-mention" | null;
};
export declare function evaluateMattermostMentionGate(params: MattermostMentionGateInput): MattermostMentionGateDecision;
export {};
