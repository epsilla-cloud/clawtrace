export declare function resolveMatrixEnvAccountToken(accountId: string): string;
export declare function getMatrixScopedEnvVarNames(accountId: string): {
    homeserver: string;
    userId: string;
    accessToken: string;
    password: string;
    deviceId: string;
    deviceName: string;
};
export declare function listMatrixEnvAccountIds(env?: NodeJS.ProcessEnv): string[];
