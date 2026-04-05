type MatrixEnvConfig = {
    homeserver: string;
    userId: string;
    accessToken?: string;
    password?: string;
    deviceId?: string;
    deviceName?: string;
};
export declare function resolveScopedMatrixEnvConfig(accountId: string, env?: NodeJS.ProcessEnv): MatrixEnvConfig;
export declare function hasReadyMatrixEnvAuth(config: {
    homeserver?: string;
    userId?: string;
    accessToken?: string;
    password?: string;
}): boolean;
export declare function resolveMatrixEnvAuthReadiness(accountId: string, env?: NodeJS.ProcessEnv): {
    ready: boolean;
    homeserver?: string;
    userId?: string;
    sourceHint: string;
    missingMessage: string;
};
export {};
