import type { CoreConfig, IrcAccountConfig } from "./types.js";
export type ResolvedIrcAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    configured: boolean;
    host: string;
    port: number;
    tls: boolean;
    nick: string;
    username: string;
    realname: string;
    password: string;
    passwordSource: "env" | "passwordFile" | "config" | "none";
    config: IrcAccountConfig;
};
declare const listIrcAccountIds: (cfg: import("openclaw/plugin-sdk/account-resolution").OpenClawConfig) => string[], resolveDefaultIrcAccountId: (cfg: import("openclaw/plugin-sdk/account-resolution").OpenClawConfig) => string;
export { listIrcAccountIds, resolveDefaultIrcAccountId };
export declare function resolveIrcAccount(params: {
    cfg: CoreConfig;
    accountId?: string | null;
}): ResolvedIrcAccount;
export declare function listEnabledIrcAccounts(cfg: CoreConfig): ResolvedIrcAccount[];
