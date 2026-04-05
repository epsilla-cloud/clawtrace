import type { ProviderResolveDynamicModelContext, ProviderRuntimeModel } from "./types.js";
export declare function matchesExactOrPrefix(id: string, values: readonly string[]): boolean;
export declare function cloneFirstTemplateModel(params: {
    providerId: string;
    modelId: string;
    templateIds: readonly string[];
    ctx: ProviderResolveDynamicModelContext;
    patch?: Partial<ProviderRuntimeModel>;
}): ProviderRuntimeModel | undefined;
