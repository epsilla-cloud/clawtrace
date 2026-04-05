import type { ProviderDefaultThinkingPolicyContext, ProviderThinkingPolicyContext } from "./types.js";
type ThinkingHookParams<TContext> = {
    provider: string;
    context: TContext;
};
export declare function resolveProviderBinaryThinking(params: ThinkingHookParams<ProviderThinkingPolicyContext>): boolean | undefined;
export declare function resolveProviderXHighThinking(params: ThinkingHookParams<ProviderThinkingPolicyContext>): boolean | undefined;
export declare function resolveProviderDefaultThinkingLevel(params: ThinkingHookParams<ProviderDefaultThinkingPolicyContext>): "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | null | undefined;
export {};
