import type { RuntimeVersionEnv } from "../version.js";
export type ProviderAttributionVerification = "vendor-documented" | "vendor-hidden-api-spec" | "vendor-sdk-hook-only" | "internal-runtime";
export type ProviderAttributionHook = "request-headers" | "default-headers" | "user-agent-extra" | "custom-user-agent";
export type ProviderAttributionPolicy = {
    provider: string;
    enabledByDefault: boolean;
    verification: ProviderAttributionVerification;
    hook?: ProviderAttributionHook;
    docsUrl?: string;
    reviewNote?: string;
    product: string;
    version: string;
    headers?: Record<string, string>;
};
export type ProviderAttributionIdentity = Pick<ProviderAttributionPolicy, "product" | "version">;
export declare function resolveProviderAttributionIdentity(env?: RuntimeVersionEnv): ProviderAttributionIdentity;
export declare function listProviderAttributionPolicies(env?: RuntimeVersionEnv): ProviderAttributionPolicy[];
export declare function resolveProviderAttributionPolicy(provider?: string | null, env?: RuntimeVersionEnv): ProviderAttributionPolicy | undefined;
export declare function resolveProviderAttributionHeaders(provider?: string | null, env?: RuntimeVersionEnv): Record<string, string> | undefined;
