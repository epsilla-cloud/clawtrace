import type { OpenClawConfig } from "../config/config.js";
import { writeJsonFileAtomically as writeJsonFileAtomicallyImpl } from "../plugin-sdk/json-store.js";
import { type MatrixLegacyCryptoInspector } from "./matrix-plugin-helper.js";
type MatrixLegacyCryptoPlan = {
    accountId: string;
    rootDir: string;
    recoveryKeyPath: string;
    statePath: string;
    legacyCryptoPath: string;
    homeserver: string;
    userId: string;
    accessToken: string;
    deviceId: string | null;
};
type MatrixLegacyCryptoDetection = {
    plans: MatrixLegacyCryptoPlan[];
    warnings: string[];
};
type MatrixLegacyCryptoPreparationResult = {
    migrated: boolean;
    changes: string[];
    warnings: string[];
};
type MatrixLegacyCryptoPrepareDeps = {
    inspectLegacyStore: MatrixLegacyCryptoInspector;
    writeJsonFileAtomically: typeof writeJsonFileAtomicallyImpl;
};
export declare function detectLegacyMatrixCrypto(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): MatrixLegacyCryptoDetection;
export declare function autoPrepareLegacyMatrixCrypto(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    log?: {
        info?: (message: string) => void;
        warn?: (message: string) => void;
    };
    deps?: Partial<MatrixLegacyCryptoPrepareDeps>;
}): Promise<MatrixLegacyCryptoPreparationResult>;
export {};
