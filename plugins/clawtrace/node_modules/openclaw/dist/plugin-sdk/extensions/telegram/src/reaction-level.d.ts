import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type ReactionLevel, type ResolvedReactionLevel as BaseResolvedReactionLevel } from "openclaw/plugin-sdk/text-runtime";
export type TelegramReactionLevel = ReactionLevel;
export type ResolvedReactionLevel = BaseResolvedReactionLevel;
/**
 * Resolve the effective reaction level and its implications.
 */
export declare function resolveTelegramReactionLevel(params: {
    cfg: OpenClawConfig;
    accountId?: string;
}): ResolvedReactionLevel;
