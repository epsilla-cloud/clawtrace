import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-onboard";
export type OllamaTagModel = {
    name: string;
    modified_at?: string;
    size?: number;
    digest?: string;
    remote_host?: string;
    details?: {
        family?: string;
        parameter_size?: string;
    };
};
export type OllamaTagsResponse = {
    models?: OllamaTagModel[];
};
export type OllamaModelWithContext = OllamaTagModel & {
    contextWindow?: number;
};
export declare function resolveOllamaApiBase(configuredBaseUrl?: string): string;
export declare function queryOllamaContextWindow(apiBase: string, modelName: string): Promise<number | undefined>;
export declare function enrichOllamaModelsWithContext(apiBase: string, models: OllamaTagModel[], opts?: {
    concurrency?: number;
}): Promise<OllamaModelWithContext[]>;
export declare function isReasoningModelHeuristic(modelId: string): boolean;
export declare function buildOllamaModelDefinition(modelId: string, contextWindow?: number): ModelDefinitionConfig;
export declare function fetchOllamaModels(baseUrl: string): Promise<{
    reachable: boolean;
    models: OllamaTagModel[];
}>;
