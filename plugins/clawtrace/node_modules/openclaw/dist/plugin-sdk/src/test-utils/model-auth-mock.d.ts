type ModelAuthMockModule = {
    resolveApiKeyForProvider: (...args: unknown[]) => unknown;
    requireApiKey: (auth: {
        apiKey?: string;
        mode?: string;
    }, provider: string) => string;
};
export declare function createModelAuthMockModule(): ModelAuthMockModule;
export {};
