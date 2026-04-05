import type { MattermostAccountConfig, MattermostChatMode, MattermostChatTypeKey, MattermostReplyToMode } from "../types.js";
import type { OpenClawConfig } from "./runtime-api.js";
export type MattermostTokenSource = "env" | "config" | "none";
export type MattermostBaseUrlSource = "env" | "config" | "none";
export type ResolvedMattermostAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    botToken?: string;
    baseUrl?: string;
    botTokenSource: MattermostTokenSource;
    baseUrlSource: MattermostBaseUrlSource;
    config: MattermostAccountConfig;
    chatmode?: MattermostChatMode;
    oncharPrefixes?: string[];
    requireMention?: boolean;
    textChunkLimit?: number;
    blockStreaming?: boolean;
    blockStreamingCoalesce?: MattermostAccountConfig["blockStreamingCoalesce"];
};
export declare function listMattermostAccountIds(cfg: OpenClawConfig): string[];
export declare function resolveDefaultMattermostAccountId(cfg: OpenClawConfig): string;
export declare function resolveMattermostAccount(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    allowUnresolvedSecretRef?: boolean;
}): ResolvedMattermostAccount;
/**
 * Resolve the effective replyToMode for a given chat type.
 * Mattermost auto-threading only applies to channel and group messages.
 */
export declare function resolveMattermostReplyToMode(account: ResolvedMattermostAccount, kind: MattermostChatTypeKey): MattermostReplyToMode;
export declare function listEnabledMattermostAccounts(cfg: OpenClawConfig): ResolvedMattermostAccount[];
