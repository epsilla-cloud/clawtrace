import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
import { type BlueBubblesAccountConfig } from "./types.js";
export type ResolvedBlueBubblesAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    config: BlueBubblesAccountConfig;
    configured: boolean;
    baseUrl?: string;
};
declare const listBlueBubblesAccountIds: (cfg: OpenClawConfig) => string[], resolveDefaultBlueBubblesAccountId: (cfg: OpenClawConfig) => string;
export { listBlueBubblesAccountIds, resolveDefaultBlueBubblesAccountId };
export declare function resolveBlueBubblesAccount(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
}): ResolvedBlueBubblesAccount;
export declare function listEnabledBlueBubblesAccounts(cfg: OpenClawConfig): ResolvedBlueBubblesAccount[];
