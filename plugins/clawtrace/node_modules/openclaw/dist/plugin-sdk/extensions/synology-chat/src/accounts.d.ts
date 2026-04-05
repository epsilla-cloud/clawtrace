/**
 * Account resolution: reads config from channels.synology-chat,
 * merges per-account overrides, falls back to environment variables.
 */
import { type OpenClawConfig } from "openclaw/plugin-sdk/account-resolution";
import type { ResolvedSynologyChatAccount } from "./types.js";
/**
 * List all configured account IDs for this channel.
 * Returns ["default"] if there's a base config, plus any named accounts.
 */
export declare function listAccountIds(cfg: OpenClawConfig): string[];
/**
 * Resolve a specific account by ID with full defaults applied.
 * Falls back to env vars for the "default" account.
 */
export declare function resolveAccount(cfg: OpenClawConfig, accountId?: string | null): ResolvedSynologyChatAccount;
