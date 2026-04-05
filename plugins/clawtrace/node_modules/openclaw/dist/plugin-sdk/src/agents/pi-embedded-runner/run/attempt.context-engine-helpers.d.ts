import type { AgentMessage } from "@mariozechner/pi-agent-core";
import type { ContextEngine, ContextEngineRuntimeContext } from "../../../context-engine/types.js";
export type AttemptContextEngine = ContextEngine;
export declare function runAttemptContextEngineBootstrap(params: {
    hadSessionFile: boolean;
    contextEngine?: AttemptContextEngine;
    sessionId: string;
    sessionKey?: string;
    sessionFile: string;
    sessionManager: unknown;
    runtimeContext?: ContextEngineRuntimeContext;
    runMaintenance: (params: {
        contextEngine?: unknown;
        sessionId: string;
        sessionKey?: string;
        sessionFile: string;
        reason: "bootstrap";
        sessionManager: unknown;
        runtimeContext?: ContextEngineRuntimeContext;
    }) => Promise<unknown>;
    warn: (message: string) => void;
}): Promise<void>;
export declare function assembleAttemptContextEngine(params: {
    contextEngine?: AttemptContextEngine;
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[];
    tokenBudget?: number;
    modelId: string;
    prompt?: string;
}): Promise<import("../../../context-engine/types.js").AssembleResult | undefined>;
export declare function finalizeAttemptContextEngineTurn(params: {
    contextEngine?: AttemptContextEngine;
    promptError: boolean;
    aborted: boolean;
    yieldAborted: boolean;
    sessionIdUsed: string;
    sessionKey?: string;
    sessionFile: string;
    messagesSnapshot: AgentMessage[];
    prePromptMessageCount: number;
    tokenBudget?: number;
    runtimeContext?: ContextEngineRuntimeContext;
    runMaintenance: (params: {
        contextEngine?: unknown;
        sessionId: string;
        sessionKey?: string;
        sessionFile: string;
        reason: "turn";
        sessionManager: unknown;
        runtimeContext?: ContextEngineRuntimeContext;
    }) => Promise<unknown>;
    sessionManager: unknown;
    warn: (message: string) => void;
}): Promise<{
    postTurnFinalizationSucceeded: boolean;
}>;
