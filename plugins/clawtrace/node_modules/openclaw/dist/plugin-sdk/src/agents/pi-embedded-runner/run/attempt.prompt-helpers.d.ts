import type { OpenClawConfig } from "../../../config/config.js";
import type { PluginHookAgentContext, PluginHookBeforeAgentStartResult, PluginHookBeforePromptBuildResult } from "../../../plugins/types.js";
import type { CompactEmbeddedPiSessionParams } from "../compact.js";
import type { EmbeddedRunAttemptParams } from "./types.js";
export type PromptBuildHookRunner = {
    hasHooks: (hookName: "before_prompt_build" | "before_agent_start") => boolean;
    runBeforePromptBuild: (event: {
        prompt: string;
        messages: unknown[];
    }, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | undefined>;
    runBeforeAgentStart: (event: {
        prompt: string;
        messages: unknown[];
    }, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentStartResult | undefined>;
};
export declare function resolvePromptBuildHookResult(params: {
    prompt: string;
    messages: unknown[];
    hookCtx: PluginHookAgentContext;
    hookRunner?: PromptBuildHookRunner | null;
    legacyBeforeAgentStartResult?: PluginHookBeforeAgentStartResult;
}): Promise<PluginHookBeforePromptBuildResult>;
export declare function resolvePromptModeForSession(sessionKey?: string): "minimal" | "full";
export declare function shouldInjectHeartbeatPrompt(params: {
    isDefaultAgent: boolean;
    trigger?: EmbeddedRunAttemptParams["trigger"];
}): boolean;
export declare function resolveAttemptFsWorkspaceOnly(params: {
    config?: OpenClawConfig;
    sessionAgentId: string;
}): boolean;
export declare function prependSystemPromptAddition(params: {
    systemPrompt: string;
    systemPromptAddition?: string;
}): string;
/** Build runtime context passed into context-engine afterTurn hooks. */
export declare function buildAfterTurnRuntimeContext(params: {
    attempt: Pick<EmbeddedRunAttemptParams, "sessionKey" | "messageChannel" | "messageProvider" | "agentAccountId" | "currentChannelId" | "currentThreadTs" | "currentMessageId" | "config" | "skillsSnapshot" | "senderIsOwner" | "senderId" | "provider" | "modelId" | "thinkLevel" | "reasoningLevel" | "bashElevated" | "extraSystemPrompt" | "ownerNumbers" | "authProfileId">;
    workspaceDir: string;
    agentDir: string;
}): Partial<CompactEmbeddedPiSessionParams>;
