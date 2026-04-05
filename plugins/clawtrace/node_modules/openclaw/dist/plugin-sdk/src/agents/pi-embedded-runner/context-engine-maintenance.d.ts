import type { ContextEngine, ContextEngineMaintenanceResult, ContextEngineRuntimeContext } from "../../context-engine/types.js";
import { rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite.js";
/**
 * Attach runtime-owned transcript rewrite helpers to an existing
 * context-engine runtime context payload.
 */
export declare function buildContextEngineMaintenanceRuntimeContext(params: {
    sessionId: string;
    sessionKey?: string;
    sessionFile: string;
    sessionManager?: Parameters<typeof rewriteTranscriptEntriesInSessionManager>[0]["sessionManager"];
    runtimeContext?: ContextEngineRuntimeContext;
}): ContextEngineRuntimeContext;
/**
 * Run optional context-engine transcript maintenance and normalize the result.
 */
export declare function runContextEngineMaintenance(params: {
    contextEngine?: ContextEngine;
    sessionId: string;
    sessionKey?: string;
    sessionFile: string;
    reason: "bootstrap" | "compaction" | "turn";
    sessionManager?: Parameters<typeof rewriteTranscriptEntriesInSessionManager>[0]["sessionManager"];
    runtimeContext?: ContextEngineRuntimeContext;
}): Promise<ContextEngineMaintenanceResult | undefined>;
