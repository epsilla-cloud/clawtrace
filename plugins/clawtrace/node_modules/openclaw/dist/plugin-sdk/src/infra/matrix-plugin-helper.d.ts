import type { OpenClawConfig } from "../config/config.js";
export declare const MATRIX_LEGACY_CRYPTO_INSPECTOR_UNAVAILABLE_MESSAGE = "Legacy Matrix encrypted state was detected, but the Matrix plugin helper is unavailable. Install or repair @openclaw/matrix so OpenClaw can inspect the old rust crypto store before upgrading.";
type MatrixLegacyCryptoInspectorParams = {
    cryptoRootDir: string;
    userId: string;
    deviceId: string;
    log?: (message: string) => void;
};
type MatrixLegacyCryptoInspectorResult = {
    deviceId: string | null;
    roomKeyCounts: {
        total: number;
        backedUp: number;
    } | null;
    backupVersion: string | null;
    decryptionKeyBase64: string | null;
};
export type MatrixLegacyCryptoInspector = (params: MatrixLegacyCryptoInspectorParams) => Promise<MatrixLegacyCryptoInspectorResult>;
export declare function isMatrixLegacyCryptoInspectorAvailable(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    workspaceDir?: string;
}): boolean;
export declare function loadMatrixLegacyCryptoInspector(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    workspaceDir?: string;
}): Promise<MatrixLegacyCryptoInspector>;
export {};
