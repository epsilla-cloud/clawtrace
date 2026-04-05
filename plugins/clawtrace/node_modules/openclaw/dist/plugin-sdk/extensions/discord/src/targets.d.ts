import { type MessagingTarget, type MessagingTargetKind, type MessagingTargetParseOptions } from "openclaw/plugin-sdk/channel-targets";
import type { DirectoryConfigParams } from "openclaw/plugin-sdk/directory-runtime";
export type DiscordTargetKind = MessagingTargetKind;
export type DiscordTarget = MessagingTarget;
type DiscordTargetParseOptions = MessagingTargetParseOptions;
export declare function parseDiscordTarget(raw: string, options?: DiscordTargetParseOptions): DiscordTarget | undefined;
export declare function resolveDiscordChannelId(raw: string): string;
/**
 * Resolve a Discord username to user ID using the directory lookup.
 * This enables sending DMs by username instead of requiring explicit user IDs.
 *
 * @param raw - The username or raw target string (e.g., "john.doe")
 * @param options - Directory configuration params (cfg, accountId, limit)
 * @param parseOptions - Messaging target parsing options (defaults, ambiguity message)
 * @returns Parsed MessagingTarget with user ID, or undefined if not found
 */
export declare function resolveDiscordTarget(raw: string, options: DirectoryConfigParams, parseOptions?: DiscordTargetParseOptions): Promise<MessagingTarget | undefined>;
export {};
