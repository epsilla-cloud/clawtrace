import type { CoreConfig, NextcloudTalkAccountConfig } from "./types.js";
export type ResolvedNextcloudTalkAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    baseUrl: string;
    secret: string;
    secretSource: "env" | "secretFile" | "config" | "none";
    config: NextcloudTalkAccountConfig;
};
declare const resolveDefaultNextcloudTalkAccountId: (cfg: import("openclaw/plugin-sdk/account-resolution").OpenClawConfig) => string;
export { resolveDefaultNextcloudTalkAccountId };
export declare function listNextcloudTalkAccountIds(cfg: CoreConfig): string[];
export declare function resolveNextcloudTalkAccount(params: {
    cfg: CoreConfig;
    accountId?: string | null;
}): ResolvedNextcloudTalkAccount;
export declare function listEnabledNextcloudTalkAccounts(cfg: CoreConfig): ResolvedNextcloudTalkAccount[];
