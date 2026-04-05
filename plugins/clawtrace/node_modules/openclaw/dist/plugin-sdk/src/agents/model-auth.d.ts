import { type Api, type Model } from "@mariozechner/pi-ai";
import { type OpenClawConfig } from "../config/config.js";
import { type AuthProfileStore } from "./auth-profiles.js";
import { type ResolvedProviderAuth } from "./model-auth-runtime-shared.js";
export { ensureAuthProfileStore, resolveAuthProfileOrder } from "./auth-profiles.js";
export { requireApiKey, resolveAwsSdkEnvVarName } from "./model-auth-runtime-shared.js";
export type { ResolvedProviderAuth } from "./model-auth-runtime-shared.js";
export declare function getCustomProviderApiKey(cfg: OpenClawConfig | undefined, provider: string): string | undefined;
type ResolvedCustomProviderApiKey = {
    apiKey: string;
    source: string;
};
export declare function resolveUsableCustomProviderApiKey(params: {
    cfg: OpenClawConfig | undefined;
    provider: string;
    env?: NodeJS.ProcessEnv;
}): ResolvedCustomProviderApiKey | null;
export declare function hasUsableCustomProviderApiKey(cfg: OpenClawConfig | undefined, provider: string, env?: NodeJS.ProcessEnv): boolean;
export declare function resolveApiKeyForProvider(params: {
    provider: string;
    cfg?: OpenClawConfig;
    profileId?: string;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
}): Promise<ResolvedProviderAuth>;
export type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
export { resolveEnvApiKey } from "./model-auth-env.js";
export type { EnvApiKeyResult } from "./model-auth-env.js";
export declare function resolveModelAuthMode(provider?: string, cfg?: OpenClawConfig, store?: AuthProfileStore): ModelAuthMode | undefined;
export declare function hasAvailableAuthForProvider(params: {
    provider: string;
    cfg?: OpenClawConfig;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
}): Promise<boolean>;
export declare function getApiKeyForModel(params: {
    model: Model<Api>;
    cfg?: OpenClawConfig;
    profileId?: string;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
}): Promise<ResolvedProviderAuth>;
export declare function applyLocalNoAuthHeaderOverride<T extends Model<Api>>(model: T, auth: ResolvedProviderAuth | null | undefined): T;
