import type { OpenClawConfig } from "../config/config.js";
import type { SecretDefaults } from "./models-config.providers.secrets.js";
type ModelsConfig = NonNullable<OpenClawConfig["models"]>;
export declare function enforceSourceManagedProviderSecrets(params: {
    providers: ModelsConfig["providers"];
    sourceProviders: ModelsConfig["providers"] | undefined;
    sourceSecretDefaults?: SecretDefaults;
    secretRefManagedProviders?: Set<string>;
}): ModelsConfig["providers"];
export {};
