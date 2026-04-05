import type { CoreConfig, MatrixConfig } from "../types.js";
export type ResolvedMatrixAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    configured: boolean;
    homeserver?: string;
    userId?: string;
    config: MatrixConfig;
};
export declare function listMatrixAccountIds(cfg: CoreConfig): string[];
export declare function resolveDefaultMatrixAccountId(cfg: CoreConfig): string;
export declare function resolveConfiguredMatrixBotUserIds(params: {
    cfg: CoreConfig;
    accountId?: string | null;
    env?: NodeJS.ProcessEnv;
}): Set<string>;
export declare function resolveMatrixAccount(params: {
    cfg: CoreConfig;
    accountId?: string | null;
    env?: NodeJS.ProcessEnv;
}): ResolvedMatrixAccount;
export declare function resolveMatrixAccountConfig(params: {
    cfg: CoreConfig;
    accountId?: string | null;
}): MatrixConfig;
