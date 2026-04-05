import { type LookupFn } from "../../runtime-api.js";
import type { CoreConfig } from "../../types.js";
import type { MatrixAuth, MatrixResolvedConfig } from "./types.js";
type MatrixEnvConfig = {
    homeserver: string;
    userId: string;
    accessToken?: string;
    password?: string;
    deviceId?: string;
    deviceName?: string;
};
export { getMatrixScopedEnvVarNames } from "../../env-vars.js";
export declare function resolveMatrixEnvAuthReadiness(accountId: string, env?: NodeJS.ProcessEnv): {
    ready: boolean;
    homeserver?: string;
    userId?: string;
    sourceHint: string;
    missingMessage: string;
};
export declare function resolveScopedMatrixEnvConfig(accountId: string, env?: NodeJS.ProcessEnv): MatrixEnvConfig;
export declare function hasReadyMatrixEnvAuth(config: {
    homeserver?: string;
    userId?: string;
    accessToken?: string;
    password?: string;
}): boolean;
export declare function validateMatrixHomeserverUrl(homeserver: string, opts?: {
    allowPrivateNetwork?: boolean;
}): string;
export declare function resolveValidatedMatrixHomeserverUrl(homeserver: string, opts?: {
    allowPrivateNetwork?: boolean;
    lookupFn?: LookupFn;
}): Promise<string>;
export declare function resolveMatrixConfig(cfg?: CoreConfig, env?: NodeJS.ProcessEnv): MatrixResolvedConfig;
export declare function resolveMatrixConfigForAccount(cfg: CoreConfig, accountId: string, env?: NodeJS.ProcessEnv): MatrixResolvedConfig;
export declare function resolveImplicitMatrixAccountId(cfg: CoreConfig, _env?: NodeJS.ProcessEnv): string | null;
export declare function resolveMatrixAuthContext(params?: {
    cfg?: CoreConfig;
    env?: NodeJS.ProcessEnv;
    accountId?: string | null;
}): {
    cfg: CoreConfig;
    env: NodeJS.ProcessEnv;
    accountId: string;
    resolved: MatrixResolvedConfig;
};
export declare function resolveMatrixAuth(params?: {
    cfg?: CoreConfig;
    env?: NodeJS.ProcessEnv;
    accountId?: string | null;
}): Promise<MatrixAuth>;
