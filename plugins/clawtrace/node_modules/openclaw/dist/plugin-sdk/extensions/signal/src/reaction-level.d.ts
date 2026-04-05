import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type ReactionLevel, type ResolvedReactionLevel } from "openclaw/plugin-sdk/text-runtime";
export type SignalReactionLevel = ReactionLevel;
export type ResolvedSignalReactionLevel = ResolvedReactionLevel;
/**
 * Resolve the effective reaction level and its implications for Signal.
 *
 * Levels:
 * - "off": No reactions at all
 * - "ack": Only automatic ack reactions (👀 when processing), no agent reactions
 * - "minimal": Agent can react, but sparingly (default)
 * - "extensive": Agent can react liberally
 */
export declare function resolveSignalReactionLevel(params: {
    cfg: OpenClawConfig;
    accountId?: string;
}): ResolvedSignalReactionLevel;
