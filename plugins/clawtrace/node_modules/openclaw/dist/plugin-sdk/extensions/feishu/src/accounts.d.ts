import { coerceSecretRef } from "openclaw/plugin-sdk/config-runtime";
import type { ClawdbotConfig } from "../runtime-api.js";
import type { FeishuConfig, FeishuDefaultAccountSelectionSource, FeishuDomain, ResolvedFeishuAccount } from "./types.js";
declare const listFeishuAccountIds: (cfg: ClawdbotConfig) => string[];
export { listFeishuAccountIds };
type FeishuCredentialResolutionMode = "inspect" | "strict";
type FeishuResolvedSecretRef = NonNullable<ReturnType<typeof coerceSecretRef>>;
export declare class FeishuSecretRefUnavailableError extends Error {
    path: string;
    constructor(path: string, ref: FeishuResolvedSecretRef);
}
export declare function isFeishuSecretRefUnavailableError(error: unknown): error is FeishuSecretRefUnavailableError;
/**
 * Resolve the default account selection and its source.
 */
export declare function resolveDefaultFeishuAccountSelection(cfg: ClawdbotConfig): {
    accountId: string;
    source: FeishuDefaultAccountSelectionSource;
};
/**
 * Resolve the default account ID.
 */
export declare function resolveDefaultFeishuAccountId(cfg: ClawdbotConfig): string;
/**
 * Resolve Feishu credentials from a config.
 */
export declare function resolveFeishuCredentials(cfg?: FeishuConfig): {
    appId: string;
    appSecret: string;
    encryptKey?: string;
    verificationToken?: string;
    domain: FeishuDomain;
} | null;
export declare function resolveFeishuCredentials(cfg: FeishuConfig | undefined, options: {
    mode?: FeishuCredentialResolutionMode;
    allowUnresolvedSecretRef?: boolean;
}): {
    appId: string;
    appSecret: string;
    encryptKey?: string;
    verificationToken?: string;
    domain: FeishuDomain;
} | null;
export declare function inspectFeishuCredentials(cfg?: FeishuConfig): {
    appId: string;
    appSecret: string;
    encryptKey?: string;
    verificationToken?: string;
    domain: FeishuDomain;
} | null;
/**
 * Resolve a read-only Feishu account snapshot for CLI/config surfaces.
 * Unresolved SecretRefs are treated as unavailable instead of throwing.
 */
export declare function resolveFeishuAccount(params: {
    cfg: ClawdbotConfig;
    accountId?: string | null;
}): ResolvedFeishuAccount;
/**
 * Resolve a runtime Feishu account.
 * Required app credentials stay strict; event-only secrets can be required by callers.
 */
export declare function resolveFeishuRuntimeAccount(params: {
    cfg: ClawdbotConfig;
    accountId?: string | null;
}, options?: {
    requireEventSecrets?: boolean;
}): ResolvedFeishuAccount;
/**
 * List all enabled and configured accounts.
 */
export declare function listEnabledFeishuAccounts(cfg: ClawdbotConfig): ResolvedFeishuAccount[];
