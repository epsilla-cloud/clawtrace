import { BedrockClient } from "@aws-sdk/client-bedrock";
import type { BedrockDiscoveryConfig, ModelDefinitionConfig, ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare function resetBedrockDiscoveryCacheForTest(): void;
export declare function resolveBedrockConfigApiKey(env?: NodeJS.ProcessEnv): string;
export declare function discoverBedrockModels(params: {
    region: string;
    config?: BedrockDiscoveryConfig;
    now?: () => number;
    clientFactory?: (region: string) => BedrockClient;
}): Promise<ModelDefinitionConfig[]>;
export declare function resolveImplicitBedrockProvider(params: {
    config?: {
        models?: {
            bedrockDiscovery?: BedrockDiscoveryConfig;
        };
    };
    env?: NodeJS.ProcessEnv;
}): Promise<ModelProviderConfig | null>;
export declare function mergeImplicitBedrockProvider(params: {
    existing: ModelProviderConfig | undefined;
    implicit: ModelProviderConfig;
}): ModelProviderConfig;
