import { Di as parseChatTargetPrefixesOrThrow, Ei as parseChatAllowTargetPrefixes, Mi as matchIMessageAcpConversation, Ni as normalizeIMessageAcpConversationId, Oi as resolveServicePrefixedAllowTarget, Pi as resolveIMessageConversationIdFromTarget, Si as normalizeIMessageHandle, ji as resolveServicePrefixedTarget } from "../auth-profiles-B5ypC5S-.js";
import { g as DEFAULT_ACCOUNT_ID } from "../session-key-BhxcMJEE.js";
import { i as IMessageConfigSchema } from "../zod-schema.providers-core-BV8OcGxh.js";
import { t as getChatChannelMeta } from "../chat-meta-xAV2SRO1.js";
import { r as buildChannelConfigSchema } from "../config-schema-DGr8UxxF.js";
import { n as deleteAccountFromConfigSection, r as setAccountEnabledInConfigSection } from "../config-helpers-B4WWN23j.js";
import { m as formatTrimmedAllowFromEntries, v as resolveIMessageConfigAllowFrom, y as resolveIMessageConfigDefaultTo } from "../channel-config-helpers-pbEU_d5U.js";
export { DEFAULT_ACCOUNT_ID, IMessageConfigSchema, buildChannelConfigSchema, deleteAccountFromConfigSection, formatTrimmedAllowFromEntries, getChatChannelMeta, matchIMessageAcpConversation, normalizeIMessageAcpConversationId, normalizeIMessageHandle, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, resolveIMessageConversationIdFromTarget, resolveServicePrefixedAllowTarget, resolveServicePrefixedTarget, setAccountEnabledInConfigSection };
