import type { OpenClawConfig } from "../config/config.js";
import { resolveProviderCapabilitiesWithPlugin as resolveProviderCapabilitiesWithPluginRuntime } from "../plugins/provider-runtime.js";
export type ProviderCapabilities = {
    anthropicToolSchemaMode: "native" | "openai-functions";
    anthropicToolChoiceMode: "native" | "openai-string-modes";
    openAiPayloadNormalizationMode: "default" | "moonshot-thinking";
    providerFamily: "default" | "openai" | "anthropic";
    preserveAnthropicThinkingSignatures: boolean;
    openAiCompatTurnValidation: boolean;
    geminiThoughtSignatureSanitization: boolean;
    transcriptToolCallIdMode: "default" | "strict9";
    transcriptToolCallIdModelHints: string[];
    geminiThoughtSignatureModelHints: string[];
    dropThinkingBlockModelHints: string[];
};
export type ProviderCapabilityLookupOptions = {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
};
declare const defaultResolveProviderCapabilitiesWithPlugin: typeof resolveProviderCapabilitiesWithPluginRuntime;
export declare const __testing: {
    setResolveProviderCapabilitiesWithPluginForTest(resolveProviderCapabilitiesWithPlugin?: typeof defaultResolveProviderCapabilitiesWithPlugin): void;
    resetDepsForTests(): void;
};
export declare function resolveProviderCapabilities(provider?: string | null, options?: ProviderCapabilityLookupOptions): ProviderCapabilities;
export declare function preservesAnthropicThinkingSignatures(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function requiresOpenAiCompatibleAnthropicToolPayload(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function usesOpenAiFunctionAnthropicToolSchema(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function usesOpenAiStringModeAnthropicToolChoice(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function supportsOpenAiCompatTurnValidation(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function usesMoonshotThinkingPayloadCompat(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function sanitizesGeminiThoughtSignatures(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function isOpenAiProviderFamily(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function isAnthropicProviderFamily(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function shouldDropThinkingBlocksForModel(params: {
    provider?: string | null;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function shouldSanitizeGeminiThoughtSignaturesForModel(params: {
    provider?: string | null;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function resolveTranscriptToolCallIdMode(provider?: string | null, modelId?: string | null, options?: ProviderCapabilityLookupOptions): "strict9" | undefined;
export {};
