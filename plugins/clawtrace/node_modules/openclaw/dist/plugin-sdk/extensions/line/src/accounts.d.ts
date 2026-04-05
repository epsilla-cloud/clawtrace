import type { OpenClawConfig } from "openclaw/plugin-sdk/account-resolution";
import type { ResolvedLineAccount } from "./types.js";
export { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
export declare function resolveLineAccount(params: {
    cfg: OpenClawConfig;
    accountId?: string;
}): ResolvedLineAccount;
export declare function listLineAccountIds(cfg: OpenClawConfig): string[];
export declare function resolveDefaultLineAccountId(cfg: OpenClawConfig): string;
export declare function normalizeAccountId(accountId: string | undefined): string;
