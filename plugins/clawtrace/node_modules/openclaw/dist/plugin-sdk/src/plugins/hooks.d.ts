/**
 * Plugin Hook Runner
 *
 * Provides utilities for executing plugin lifecycle hooks with proper
 * error handling, priority ordering, and async support.
 */
import type { PluginRegistry } from "./registry.js";
import type { PluginHookAfterCompactionEvent, PluginHookAfterToolCallEvent, PluginHookAgentContext, PluginHookAgentEndEvent, PluginHookBeforeAgentStartEvent, PluginHookBeforeAgentStartResult, PluginHookBeforeDispatchContext, PluginHookBeforeDispatchEvent, PluginHookBeforeDispatchResult, PluginHookBeforeModelResolveEvent, PluginHookBeforeModelResolveResult, PluginHookBeforePromptBuildEvent, PluginHookBeforePromptBuildResult, PluginHookBeforeCompactionEvent, PluginHookInboundClaimContext, PluginHookInboundClaimEvent, PluginHookInboundClaimResult, PluginHookLlmInputEvent, PluginHookLlmOutputEvent, PluginHookBeforeResetEvent, PluginHookBeforeToolCallEvent, PluginHookBeforeToolCallResult, PluginHookGatewayContext, PluginHookGatewayStartEvent, PluginHookGatewayStopEvent, PluginHookMessageContext, PluginHookMessageReceivedEvent, PluginHookMessageSendingEvent, PluginHookMessageSendingResult, PluginHookMessageSentEvent, PluginHookName, PluginHookSessionContext, PluginHookSessionEndEvent, PluginHookSessionStartEvent, PluginHookSubagentContext, PluginHookSubagentDeliveryTargetEvent, PluginHookSubagentDeliveryTargetResult, PluginHookSubagentSpawningEvent, PluginHookSubagentSpawningResult, PluginHookSubagentEndedEvent, PluginHookSubagentSpawnedEvent, PluginHookToolContext, PluginHookToolResultPersistContext, PluginHookToolResultPersistEvent, PluginHookToolResultPersistResult, PluginHookBeforeMessageWriteEvent, PluginHookBeforeMessageWriteResult } from "./types.js";
export type { PluginHookAgentContext, PluginHookBeforeAgentStartEvent, PluginHookBeforeAgentStartResult, PluginHookBeforeDispatchContext, PluginHookBeforeDispatchEvent, PluginHookBeforeDispatchResult, PluginHookBeforeModelResolveEvent, PluginHookBeforeModelResolveResult, PluginHookBeforePromptBuildEvent, PluginHookBeforePromptBuildResult, PluginHookLlmInputEvent, PluginHookLlmOutputEvent, PluginHookAgentEndEvent, PluginHookBeforeCompactionEvent, PluginHookBeforeResetEvent, PluginHookInboundClaimContext, PluginHookInboundClaimEvent, PluginHookInboundClaimResult, PluginHookAfterCompactionEvent, PluginHookMessageContext, PluginHookMessageReceivedEvent, PluginHookMessageSendingEvent, PluginHookMessageSendingResult, PluginHookMessageSentEvent, PluginHookToolContext, PluginHookBeforeToolCallEvent, PluginHookBeforeToolCallResult, PluginHookAfterToolCallEvent, PluginHookToolResultPersistContext, PluginHookToolResultPersistEvent, PluginHookToolResultPersistResult, PluginHookBeforeMessageWriteEvent, PluginHookBeforeMessageWriteResult, PluginHookSessionContext, PluginHookSessionStartEvent, PluginHookSessionEndEvent, PluginHookSubagentContext, PluginHookSubagentDeliveryTargetEvent, PluginHookSubagentDeliveryTargetResult, PluginHookSubagentSpawningEvent, PluginHookSubagentSpawningResult, PluginHookSubagentSpawnedEvent, PluginHookSubagentEndedEvent, PluginHookGatewayContext, PluginHookGatewayStartEvent, PluginHookGatewayStopEvent, };
export type HookRunnerLogger = {
    debug?: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
};
export type HookRunnerOptions = {
    logger?: HookRunnerLogger;
    /** If true, errors in hooks will be caught and logged instead of thrown */
    catchErrors?: boolean;
};
export type PluginTargetedInboundClaimOutcome = {
    status: "handled";
    result: PluginHookInboundClaimResult;
} | {
    status: "missing_plugin";
} | {
    status: "no_handler";
} | {
    status: "declined";
} | {
    status: "error";
    error: string;
};
/**
 * Create a hook runner for a specific registry.
 */
export declare function createHookRunner(registry: PluginRegistry, options?: HookRunnerOptions): {
    runBeforeModelResolve: (event: PluginHookBeforeModelResolveEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeModelResolveResult | undefined>;
    runBeforePromptBuild: (event: PluginHookBeforePromptBuildEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | undefined>;
    runBeforeAgentStart: (event: PluginHookBeforeAgentStartEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentStartResult | undefined>;
    runLlmInput: (event: PluginHookLlmInputEvent, ctx: PluginHookAgentContext) => Promise<void>;
    runLlmOutput: (event: PluginHookLlmOutputEvent, ctx: PluginHookAgentContext) => Promise<void>;
    runAgentEnd: (event: PluginHookAgentEndEvent, ctx: PluginHookAgentContext) => Promise<void>;
    runBeforeCompaction: (event: PluginHookBeforeCompactionEvent, ctx: PluginHookAgentContext) => Promise<void>;
    runAfterCompaction: (event: PluginHookAfterCompactionEvent, ctx: PluginHookAgentContext) => Promise<void>;
    runBeforeReset: (event: PluginHookBeforeResetEvent, ctx: PluginHookAgentContext) => Promise<void>;
    runInboundClaim: (event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
    runInboundClaimForPlugin: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
    runInboundClaimForPluginOutcome: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginTargetedInboundClaimOutcome>;
    runMessageReceived: (event: PluginHookMessageReceivedEvent, ctx: PluginHookMessageContext) => Promise<void>;
    runBeforeDispatch: (event: PluginHookBeforeDispatchEvent, ctx: PluginHookBeforeDispatchContext) => Promise<PluginHookBeforeDispatchResult | undefined>;
    runMessageSending: (event: PluginHookMessageSendingEvent, ctx: PluginHookMessageContext) => Promise<PluginHookMessageSendingResult | undefined>;
    runMessageSent: (event: PluginHookMessageSentEvent, ctx: PluginHookMessageContext) => Promise<void>;
    runBeforeToolCall: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => Promise<PluginHookBeforeToolCallResult | undefined>;
    runAfterToolCall: (event: PluginHookAfterToolCallEvent, ctx: PluginHookToolContext) => Promise<void>;
    runToolResultPersist: (event: PluginHookToolResultPersistEvent, ctx: PluginHookToolResultPersistContext) => PluginHookToolResultPersistResult | undefined;
    runBeforeMessageWrite: (event: PluginHookBeforeMessageWriteEvent, ctx: {
        agentId?: string;
        sessionKey?: string;
    }) => PluginHookBeforeMessageWriteResult | undefined;
    runSessionStart: (event: PluginHookSessionStartEvent, ctx: PluginHookSessionContext) => Promise<void>;
    runSessionEnd: (event: PluginHookSessionEndEvent, ctx: PluginHookSessionContext) => Promise<void>;
    runSubagentSpawning: (event: PluginHookSubagentSpawningEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentSpawningResult | undefined>;
    runSubagentDeliveryTarget: (event: PluginHookSubagentDeliveryTargetEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentDeliveryTargetResult | undefined>;
    runSubagentSpawned: (event: PluginHookSubagentSpawnedEvent, ctx: PluginHookSubagentContext) => Promise<void>;
    runSubagentEnded: (event: PluginHookSubagentEndedEvent, ctx: PluginHookSubagentContext) => Promise<void>;
    runGatewayStart: (event: PluginHookGatewayStartEvent, ctx: PluginHookGatewayContext) => Promise<void>;
    runGatewayStop: (event: PluginHookGatewayStopEvent, ctx: PluginHookGatewayContext) => Promise<void>;
    hasHooks: (hookName: PluginHookName) => boolean;
    getHookCount: (hookName: PluginHookName) => number;
};
export type HookRunner = ReturnType<typeof createHookRunner>;
