export type { ChannelPlugin } from "./channel-plugin-common.js";
export { DEFAULT_ACCOUNT_ID, buildChannelConfigSchema, deleteAccountFromConfigSection, getChatChannelMeta, setAccountEnabledInConfigSection, } from "./channel-plugin-common.js";
export { formatTrimmedAllowFromEntries, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, } from "./channel-config-helpers.js";
export { IMessageConfigSchema } from "../config/zod-schema.providers-core.js";
export { normalizeIMessageHandle, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow, resolveServicePrefixedAllowTarget, resolveServicePrefixedTarget, type ParsedChatTarget, } from "./imessage-targets.js";
export declare function normalizeIMessageAcpConversationId(conversationId: string): {
    conversationId: string;
} | null;
export declare function matchIMessageAcpConversation(params: {
    bindingConversationId: string;
    conversationId: string;
}): {
    conversationId: string;
    matchPriority: number;
} | null;
export declare function resolveIMessageConversationIdFromTarget(target: string): string | undefined;
