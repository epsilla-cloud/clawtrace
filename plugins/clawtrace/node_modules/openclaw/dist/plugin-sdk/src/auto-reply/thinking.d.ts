import type { ThinkLevel, ThinkingCatalogEntry } from "./thinking.shared.js";
export { formatXHighModelHint, normalizeElevatedLevel, normalizeFastMode, normalizeNoticeLevel, normalizeReasoningLevel, normalizeThinkLevel, normalizeUsageDisplay, normalizeVerboseLevel, resolveResponseUsageMode, resolveElevatedMode, } from "./thinking.shared.js";
export type { ElevatedLevel, ElevatedMode, NoticeLevel, ReasoningLevel, ThinkLevel, ThinkingCatalogEntry, UsageDisplayLevel, VerboseLevel, } from "./thinking.shared.js";
export declare function isBinaryThinkingProvider(provider?: string | null, model?: string | null): boolean;
export declare function supportsXHighThinking(provider?: string | null, model?: string | null): boolean;
export declare function listThinkingLevels(provider?: string | null, model?: string | null): ThinkLevel[];
export declare function listThinkingLevelLabels(provider?: string | null, model?: string | null): string[];
export declare function formatThinkingLevels(provider?: string | null, model?: string | null, separator?: string): string;
export declare function resolveThinkingDefaultForModel(params: {
    provider: string;
    model: string;
    catalog?: ThinkingCatalogEntry[];
}): ThinkLevel;
