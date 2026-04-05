import type { MatrixAuth } from "./types.js";
import type { MatrixStoragePaths } from "./types.js";
export declare const DEFAULT_ACCOUNT_KEY = "default";
export declare function resolveMatrixStoragePaths(params: {
    homeserver: string;
    userId: string;
    accessToken: string;
    accountId?: string | null;
    deviceId?: string | null;
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
}): MatrixStoragePaths;
export declare function resolveMatrixStateFilePath(params: {
    auth: MatrixAuth;
    filename: string;
    accountId?: string | null;
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
}): string;
export declare function maybeMigrateLegacyStorage(params: {
    storagePaths: MatrixStoragePaths;
    env?: NodeJS.ProcessEnv;
}): Promise<void>;
export declare function writeStorageMeta(params: {
    storagePaths: MatrixStoragePaths;
    homeserver: string;
    userId: string;
    accountId?: string | null;
    deviceId?: string | null;
}): void;
