import { createDedupeCache, formatInboundFromLabel as formatInboundFromLabelShared, rawDataToString, type OpenClawConfig } from "./runtime-api.js";
export { createDedupeCache, rawDataToString };
export type ResponsePrefixContext = {
    model?: string;
    modelFull?: string;
    provider?: string;
    thinkingLevel?: string;
    identityName?: string;
};
export declare function extractShortModelName(fullModel: string): string;
export declare const formatInboundFromLabel: typeof formatInboundFromLabelShared;
export declare function resolveIdentityName(cfg: OpenClawConfig, agentId: string): string | undefined;
export declare function resolveThreadSessionKeys(params: {
    baseSessionKey: string;
    threadId?: string | null;
    parentSessionKey?: string;
    useSuffix?: boolean;
}): {
    sessionKey: string;
    parentSessionKey?: string;
};
/**
 * Strip bot mention from message text while preserving newlines and
 * block-level Markdown formatting (headings, lists, blockquotes).
 */
export declare function normalizeMention(text: string, mention: string | undefined): string;
