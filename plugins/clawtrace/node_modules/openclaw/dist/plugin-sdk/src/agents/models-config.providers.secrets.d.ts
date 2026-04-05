import type { OpenClawConfig } from "../config/config.js";
import { ensureAuthProfileStore } from "./auth-profiles/store.js";
type ModelsConfig = NonNullable<OpenClawConfig["models"]>;
export type ProviderConfig = NonNullable<ModelsConfig["providers"]>[string];
export type SecretDefaults = {
    env?: string;
    file?: string;
    exec?: string;
};
export type ProfileApiKeyResolution = {
    apiKey: string;
    source: "plaintext" | "env-ref" | "non-env-ref";
    discoveryApiKey?: string;
};
export type ProviderApiKeyResolver = (provider: string) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
};
export type ProviderAuthResolver = (provider: string, options?: {
    oauthMarker?: string;
}) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
    mode: "api_key" | "oauth" | "token" | "none";
    source: "env" | "profile" | "none";
    profileId?: string;
};
export declare function normalizeApiKeyConfig(value: string): string;
export declare function toDiscoveryApiKey(value: string | undefined): string | undefined;
export declare function resolveEnvApiKeyVarName(provider: string, env?: NodeJS.ProcessEnv): string | undefined;
export declare function resolveAwsSdkApiKeyVarName(env?: NodeJS.ProcessEnv): string;
export declare function normalizeHeaderValues(params: {
    headers: ProviderConfig["headers"] | undefined;
    secretDefaults: SecretDefaults | undefined;
}): {
    headers: ProviderConfig["headers"] | undefined;
    mutated: boolean;
};
export declare function resolveApiKeyFromCredential(cred: ReturnType<typeof ensureAuthProfileStore>["profiles"][string] | undefined, env?: NodeJS.ProcessEnv): ProfileApiKeyResolution | undefined;
export declare function resolveApiKeyFromProfiles(params: {
    provider: string;
    store: ReturnType<typeof ensureAuthProfileStore>;
    env?: NodeJS.ProcessEnv;
}): ProfileApiKeyResolution | undefined;
export declare function normalizeConfiguredProviderApiKey(params: {
    providerKey: string;
    provider: ProviderConfig;
    secretDefaults: SecretDefaults | undefined;
    profileApiKey: ProfileApiKeyResolution | undefined;
    secretRefManagedProviders?: Set<string>;
}): ProviderConfig;
export declare function normalizeResolvedEnvApiKey(params: {
    providerKey: string;
    provider: ProviderConfig;
    env: NodeJS.ProcessEnv;
    secretRefManagedProviders?: Set<string>;
}): ProviderConfig;
export declare function resolveMissingProviderApiKey(params: {
    providerKey: string;
    provider: ProviderConfig;
    env: NodeJS.ProcessEnv;
    profileApiKey: ProfileApiKeyResolution | undefined;
    secretRefManagedProviders?: Set<string>;
    providerApiKeyResolver?: (env: NodeJS.ProcessEnv) => string | undefined;
}): ProviderConfig;
export declare function createProviderApiKeyResolver(env: NodeJS.ProcessEnv, authStore: ReturnType<typeof ensureAuthProfileStore>, config?: OpenClawConfig): ProviderApiKeyResolver;
export declare function createProviderAuthResolver(env: NodeJS.ProcessEnv, authStore: ReturnType<typeof ensureAuthProfileStore>, config?: OpenClawConfig): ProviderAuthResolver;
export {};
