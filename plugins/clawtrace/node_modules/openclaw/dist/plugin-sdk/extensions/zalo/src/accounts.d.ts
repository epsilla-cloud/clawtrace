import type { OpenClawConfig } from "./runtime-api.js";
import type { ResolvedZaloAccount } from "./types.js";
export type { ResolvedZaloAccount };
declare const listZaloAccountIds: (cfg: OpenClawConfig) => string[], resolveDefaultZaloAccountId: (cfg: OpenClawConfig) => string;
export { listZaloAccountIds, resolveDefaultZaloAccountId };
export declare function resolveZaloAccount(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    allowUnresolvedSecretRef?: boolean;
}): ResolvedZaloAccount;
export declare function listEnabledZaloAccounts(cfg: OpenClawConfig): ResolvedZaloAccount[];
