import type { OpenClawConfig } from "../config/config.js";
import type { ProviderConfig } from "./models-config.providers.secrets.js";
type ImplicitProviderParams = {
    agentDir: string;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    workspaceDir?: string;
    explicitProviders?: Record<string, ProviderConfig> | null;
};
export declare function resolveImplicitProviders(params: ImplicitProviderParams): Promise<NonNullable<OpenClawConfig["models"]>["providers"]>;
export {};
