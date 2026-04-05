import type { AuthProfileCredential, OAuthCredential } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/config.js";
import type { ModelProviderConfig } from "../config/types.js";
import type { ProviderAuthDoctorHintContext, ProviderAugmentModelCatalogContext, ProviderBuildMissingAuthMessageContext, ProviderBuildUnknownModelHintContext, ProviderBuiltInModelSuppressionContext, ProviderCacheTtlEligibilityContext, ProviderCreateEmbeddingProviderContext, ProviderResolveSyntheticAuthContext, ProviderCreateStreamFnContext, ProviderDefaultThinkingPolicyContext, ProviderFetchUsageSnapshotContext, ProviderNormalizeConfigContext, ProviderNormalizeModelIdContext, ProviderNormalizeTransportContext, ProviderModernModelPolicyContext, ProviderPrepareExtraParamsContext, ProviderPrepareDynamicModelContext, ProviderPrepareRuntimeAuthContext, ProviderResolveConfigApiKeyContext, ProviderResolveUsageAuthContext, ProviderPlugin, ProviderResolveDynamicModelContext, ProviderRuntimeModel, ProviderThinkingPolicyContext, ProviderWrapStreamFnContext } from "./types.js";
export declare function clearProviderRuntimeHookCache(): void;
export declare function resetProviderRuntimeHookCacheForTest(): void;
export declare function resolveProviderRuntimePlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ProviderPlugin | undefined;
export declare function runProviderDynamicModel(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
export declare function prepareProviderDynamicModel(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderPrepareDynamicModelContext;
}): Promise<void>;
export declare function normalizeProviderResolvedModelWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: {
        config?: OpenClawConfig;
        agentDir?: string;
        workspaceDir?: string;
        provider: string;
        modelId: string;
        model: ProviderRuntimeModel;
    };
}): ProviderRuntimeModel | undefined;
export declare function normalizeProviderModelIdWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderNormalizeModelIdContext;
}): string | undefined;
export declare function normalizeProviderTransportWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderNormalizeTransportContext;
}): {
    api?: string | null;
    baseUrl?: string;
} | undefined;
export declare function normalizeProviderConfigWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderNormalizeConfigContext;
}): ModelProviderConfig | undefined;
export declare function applyProviderNativeStreamingUsageCompatWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderNormalizeConfigContext;
}): ModelProviderConfig | undefined;
export declare function resolveProviderConfigApiKeyWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderResolveConfigApiKeyContext;
}): string | undefined;
export declare function resolveProviderCapabilitiesWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): Partial<import("../agents/provider-capabilities.ts").ProviderCapabilities> | undefined;
export declare function prepareProviderExtraParams(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderPrepareExtraParamsContext;
}): Record<string, unknown> | undefined;
export declare function resolveProviderStreamFn(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderCreateStreamFnContext;
}): import("@mariozechner/pi-agent-core").StreamFn | undefined;
export declare function wrapProviderStreamFn(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderWrapStreamFnContext;
}): import("@mariozechner/pi-agent-core").StreamFn | undefined;
export declare function createProviderEmbeddingProvider(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderCreateEmbeddingProviderContext;
}): Promise<import("./types.js").PluginEmbeddingProvider | null | undefined>;
export declare function prepareProviderRuntimeAuth(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderPrepareRuntimeAuthContext;
}): Promise<import("./types.js").ProviderPreparedRuntimeAuth | null | undefined>;
export declare function resolveProviderUsageAuthWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderResolveUsageAuthContext;
}): Promise<import("./types.js").ProviderResolvedUsageAuth | null | undefined>;
export declare function resolveProviderUsageSnapshotWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderFetchUsageSnapshotContext;
}): Promise<import("../infra/provider-usage.types.ts").ProviderUsageSnapshot | null | undefined>;
export declare function formatProviderAuthProfileApiKeyWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: AuthProfileCredential;
}): string | undefined;
export declare function refreshProviderOAuthCredentialWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: OAuthCredential;
}): Promise<OAuthCredential | undefined>;
export declare function buildProviderAuthDoctorHintWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderAuthDoctorHintContext;
}): Promise<string | null | undefined>;
export declare function resolveProviderCacheTtlEligibility(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderCacheTtlEligibilityContext;
}): boolean | undefined;
export declare function resolveProviderBinaryThinking(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderThinkingPolicyContext;
}): boolean | undefined;
export declare function resolveProviderXHighThinking(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderThinkingPolicyContext;
}): boolean | undefined;
export declare function resolveProviderDefaultThinkingLevel(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderDefaultThinkingPolicyContext;
}): "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | null | undefined;
export declare function resolveProviderModernModelRef(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderModernModelPolicyContext;
}): boolean | undefined;
export declare function buildProviderMissingAuthMessageWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderBuildMissingAuthMessageContext;
}): string | undefined;
export declare function buildProviderUnknownModelHintWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderBuildUnknownModelHintContext;
}): string | undefined;
export declare function resolveProviderSyntheticAuthWithPlugin(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderResolveSyntheticAuthContext;
}): import("./types.js").ProviderSyntheticAuthResult | undefined;
export declare function resolveProviderBuiltInModelSuppression(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderBuiltInModelSuppressionContext;
}): import("./types.js").ProviderBuiltInModelSuppressionResult | undefined;
export declare function augmentModelCatalogWithProviderPlugins(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    context: ProviderAugmentModelCatalogContext;
}): Promise<import("../agents/model-catalog.ts").ModelCatalogEntry[]>;
