import { createProviderApiKeyAuthMethod } from "../plugins/provider-api-key-auth.js";
import type { ProviderPlugin, ProviderPluginWizardSetup } from "../plugins/types.js";
import type { OpenClawPluginApi, OpenClawPluginConfigSchema, OpenClawPluginDefinition } from "./plugin-entry.js";
import { buildSingleProviderApiKeyCatalog } from "./provider-catalog-shared.js";
type ApiKeyAuthMethodOptions = Parameters<typeof createProviderApiKeyAuthMethod>[0];
export type SingleProviderPluginApiKeyAuthOptions = Omit<ApiKeyAuthMethodOptions, "providerId" | "expectedProviders" | "wizard"> & {
    expectedProviders?: string[];
    wizard?: false | ProviderPluginWizardSetup;
};
export type SingleProviderPluginCatalogOptions = {
    buildProvider: Parameters<typeof buildSingleProviderApiKeyCatalog>[0]["buildProvider"];
    allowExplicitBaseUrl?: boolean;
};
export type SingleProviderPluginOptions = {
    id: string;
    name: string;
    description: string;
    kind?: OpenClawPluginDefinition["kind"];
    configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
    provider?: {
        id?: string;
        label: string;
        docsPath: string;
        aliases?: string[];
        envVars?: string[];
        auth?: SingleProviderPluginApiKeyAuthOptions[];
        catalog: SingleProviderPluginCatalogOptions;
    } & Omit<ProviderPlugin, "id" | "label" | "docsPath" | "aliases" | "envVars" | "auth" | "catalog">;
    register?: (api: OpenClawPluginApi) => void;
};
export declare function defineSingleProviderPluginEntry(options: SingleProviderPluginOptions): {
    id: string;
    name: string;
    description: string;
    configSchema: OpenClawPluginConfigSchema;
    register: NonNullable<OpenClawPluginDefinition["register"]>;
} & Pick<OpenClawPluginDefinition, "kind">;
export {};
