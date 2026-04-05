export declare function resolveAnthropicVertexRegion(env?: NodeJS.ProcessEnv): string;
export declare function resolveAnthropicVertexProjectId(env?: NodeJS.ProcessEnv): string | undefined;
export declare function resolveAnthropicVertexRegionFromBaseUrl(baseUrl?: string): string | undefined;
export declare function resolveAnthropicVertexClientRegion(params?: {
    baseUrl?: string;
    env?: NodeJS.ProcessEnv;
}): string;
export declare function hasAnthropicVertexCredentials(env?: NodeJS.ProcessEnv): boolean;
export declare function hasAnthropicVertexAvailableAuth(env?: NodeJS.ProcessEnv): boolean;
export declare function resolveAnthropicVertexConfigApiKey(env?: NodeJS.ProcessEnv): string | undefined;
