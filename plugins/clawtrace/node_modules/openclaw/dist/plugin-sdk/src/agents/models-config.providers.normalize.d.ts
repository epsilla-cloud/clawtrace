import type { OpenClawConfig } from "../config/config.js";
import type { SecretDefaults } from "./models-config.providers.secrets.js";
type ModelsConfig = NonNullable<OpenClawConfig["models"]>;
export declare function normalizeProviders(params: {
    providers: ModelsConfig["providers"];
    agentDir: string;
    env?: NodeJS.ProcessEnv;
    secretDefaults?: SecretDefaults;
    sourceProviders?: ModelsConfig["providers"];
    sourceSecretDefaults?: SecretDefaults;
    secretRefManagedProviders?: Set<string>;
}): ModelsConfig["providers"];
export {};
