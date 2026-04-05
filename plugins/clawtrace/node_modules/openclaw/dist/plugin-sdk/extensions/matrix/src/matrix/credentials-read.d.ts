export type MatrixStoredCredentials = {
    homeserver: string;
    userId: string;
    accessToken: string;
    deviceId?: string;
    createdAt: string;
    lastUsedAt?: string;
};
export declare function resolveMatrixCredentialsDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
export declare function resolveMatrixCredentialsPath(env?: NodeJS.ProcessEnv, accountId?: string | null): string;
export declare function loadMatrixCredentials(env?: NodeJS.ProcessEnv, accountId?: string | null): MatrixStoredCredentials | null;
export declare function clearMatrixCredentials(env?: NodeJS.ProcessEnv, accountId?: string | null): void;
export declare function credentialsMatchConfig(stored: MatrixStoredCredentials, config: {
    homeserver: string;
    userId: string;
    accessToken?: string;
}): boolean;
