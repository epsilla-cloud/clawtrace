export declare function sanitizeMatrixPathSegment(value: string): string;
export declare function resolveMatrixHomeserverKey(homeserver: string): string;
export declare function hashMatrixAccessToken(accessToken: string): string;
export declare function resolveMatrixCredentialsFilename(accountId?: string | null): string;
export declare function resolveMatrixCredentialsDir(stateDir: string): string;
export declare function resolveMatrixCredentialsPath(params: {
    stateDir: string;
    accountId?: string | null;
}): string;
export declare function resolveMatrixLegacyFlatStoreRoot(stateDir: string): string;
export declare function resolveMatrixLegacyFlatStoragePaths(stateDir: string): {
    rootDir: string;
    storagePath: string;
    cryptoPath: string;
};
export declare function resolveMatrixAccountStorageRoot(params: {
    stateDir: string;
    homeserver: string;
    userId: string;
    accessToken: string;
    accountId?: string | null;
}): {
    rootDir: string;
    accountKey: string;
    tokenHash: string;
};
