import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { EmbeddedRunAttemptParams, EmbeddedRunAttemptResult } from "./types.js";
export { appendAttemptCacheTtlIfNeeded, composeSystemPromptWithHookContext, resolveAttemptSpawnWorkspaceDir, } from "./attempt.thread-helpers.js";
export { buildAfterTurnRuntimeContext, prependSystemPromptAddition, resolveAttemptFsWorkspaceOnly, resolvePromptBuildHookResult, resolvePromptModeForSession, shouldInjectHeartbeatPrompt, } from "./attempt.prompt-helpers.js";
export { buildSessionsYieldContextMessage, persistSessionsYieldContextMessage, queueSessionsYieldInterruptMessage, stripSessionsYieldArtifacts, } from "./attempt.sessions-yield.js";
export { isOllamaCompatProvider, resolveOllamaCompatNumCtxEnabled, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx, } from "../../../plugin-sdk/ollama.js";
export { decodeHtmlEntitiesInObject, wrapStreamFnRepairMalformedToolCallArguments, } from "./attempt.tool-call-argument-repair.js";
export { wrapStreamFnSanitizeMalformedToolCalls, wrapStreamFnTrimToolCallNames, } from "./attempt.tool-call-normalization.js";
export declare function resolveEmbeddedAgentStreamFn(params: {
    currentStreamFn: StreamFn | undefined;
    providerStreamFn?: StreamFn;
    shouldUseWebSocketTransport: boolean;
    wsApiKey?: string;
    sessionId: string;
    signal?: AbortSignal;
    model: EmbeddedRunAttemptParams["model"];
}): StreamFn;
export declare function runEmbeddedAttempt(params: EmbeddedRunAttemptParams): Promise<EmbeddedRunAttemptResult>;
