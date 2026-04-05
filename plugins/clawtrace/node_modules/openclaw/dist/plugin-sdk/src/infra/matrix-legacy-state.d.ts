import type { OpenClawConfig } from "../config/config.js";
export type MatrixLegacyStateMigrationResult = {
    migrated: boolean;
    changes: string[];
    warnings: string[];
};
type MatrixLegacyStatePlan = {
    accountId: string;
    legacyStoragePath: string;
    legacyCryptoPath: string;
    targetRootDir: string;
    targetStoragePath: string;
    targetCryptoPath: string;
    selectionNote?: string;
};
export declare function detectLegacyMatrixState(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): MatrixLegacyStatePlan | {
    warning: string;
} | null;
export declare function autoMigrateLegacyMatrixState(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    log?: {
        info?: (message: string) => void;
        warn?: (message: string) => void;
    };
}): Promise<MatrixLegacyStateMigrationResult>;
export {};
