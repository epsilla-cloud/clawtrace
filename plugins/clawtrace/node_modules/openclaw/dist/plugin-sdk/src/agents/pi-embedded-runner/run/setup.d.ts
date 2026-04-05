import type { Api, Model } from "@mariozechner/pi-ai";
import type { OpenClawConfig } from "../../../config/config.js";
import type { PluginHookBeforeAgentStartResult } from "../../../plugins/types.js";
type HookContext = {
    agentId?: string;
    sessionKey?: string;
    sessionId: string;
    workspaceDir: string;
    messageProvider?: string;
    trigger?: string;
    channelId?: string;
};
type HookRunnerLike = {
    hasHooks(hookName: string): boolean;
    runBeforeModelResolve(input: {
        prompt: string;
    }, context: HookContext): Promise<{
        providerOverride?: string;
        modelOverride?: string;
    } | undefined>;
    runBeforeAgentStart(input: {
        prompt: string;
    }, context: HookContext): Promise<PluginHookBeforeAgentStartResult | undefined>;
};
export declare function resolveHookModelSelection(params: {
    prompt: string;
    provider: string;
    modelId: string;
    hookRunner?: HookRunnerLike | null;
    hookContext: HookContext;
}): Promise<{
    provider: string;
    modelId: string;
    legacyBeforeAgentStartResult: PluginHookBeforeAgentStartResult | undefined;
}>;
export declare function resolveEffectiveRuntimeModel(params: {
    cfg: OpenClawConfig | undefined;
    provider: string;
    modelId: string;
    runtimeModel: Model<Api>;
}): {
    ctxInfo: import("../../context-window-guard.js").ContextWindowInfo;
    effectiveModel: Model<Api>;
};
export {};
