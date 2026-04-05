import type { RuntimeEnv } from "./runtime-api.js";
import type { CoreConfig } from "./types.js";
export type MatrixSetupVerificationBootstrapResult = {
    attempted: boolean;
    success: boolean;
    recoveryKeyCreatedAt: string | null;
    backupVersion: string | null;
    error?: string;
};
export declare function maybeBootstrapNewEncryptedMatrixAccount(params: {
    previousCfg: CoreConfig;
    cfg: CoreConfig;
    accountId: string;
}): Promise<MatrixSetupVerificationBootstrapResult>;
export declare function runMatrixSetupBootstrapAfterConfigWrite(params: {
    previousCfg: CoreConfig;
    cfg: CoreConfig;
    accountId: string;
    runtime: RuntimeEnv;
}): Promise<void>;
