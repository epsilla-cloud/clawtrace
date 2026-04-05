import type { OpenClawConfig } from "../config/config.js";
export type MatrixStoredCredentials = {
    homeserver: string;
    userId: string;
    accessToken: string;
    deviceId?: string;
};
export type MatrixMigrationAccountTarget = {
    accountId: string;
    homeserver: string;
    userId: string;
    accessToken: string;
    rootDir: string;
    storedDeviceId: string | null;
};
export type MatrixLegacyFlatStoreTarget = MatrixMigrationAccountTarget & {
    selectionNote?: string;
};
type MatrixLegacyFlatStoreKind = "state" | "encrypted state";
export declare function resolveMatrixMigrationConfigFields(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    accountId: string;
}): {
    homeserver: string;
    userId: string;
    accessToken: string;
};
export declare function loadStoredMatrixCredentials(env: NodeJS.ProcessEnv, accountId: string): MatrixStoredCredentials | null;
export declare function credentialsMatchResolvedIdentity(stored: MatrixStoredCredentials | null, identity: {
    homeserver: string;
    userId: string;
    accessToken: string;
}): stored is MatrixStoredCredentials;
export declare function resolveMatrixMigrationAccountTarget(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    accountId: string;
}): MatrixMigrationAccountTarget | null;
export declare function resolveLegacyMatrixFlatStoreTarget(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    detectedPath: string;
    detectedKind: MatrixLegacyFlatStoreKind;
}): MatrixLegacyFlatStoreTarget | {
    warning: string;
};
export {};
