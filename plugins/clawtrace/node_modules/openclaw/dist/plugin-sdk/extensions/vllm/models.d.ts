import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
type ModelsConfig = NonNullable<OpenClawConfig["models"]>;
type ProviderConfig = NonNullable<ModelsConfig["providers"]>[string];
export declare function buildVllmProvider(params?: {
    baseUrl?: string;
    apiKey?: string;
}): Promise<ProviderConfig>;
export {};
