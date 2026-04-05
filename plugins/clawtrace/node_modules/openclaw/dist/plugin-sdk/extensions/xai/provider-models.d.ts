import type { ProviderResolveDynamicModelContext, ProviderRuntimeModel } from "openclaw/plugin-sdk/core";
export declare function isModernXaiModel(modelId: string): boolean;
export declare function resolveXaiForwardCompatModel(params: {
    providerId: string;
    ctx: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
