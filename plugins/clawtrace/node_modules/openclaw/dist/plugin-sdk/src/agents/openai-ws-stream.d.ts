/**
 * OpenAI WebSocket StreamFn Integration
 *
 * Wraps `OpenAIWebSocketManager` in a `StreamFn` that can be plugged into the
 * pi-embedded-runner agent in place of the default `streamSimple` HTTP function.
 *
 * Key behaviours:
 *  - Per-session `OpenAIWebSocketManager` (keyed by sessionId)
 *  - Tracks `previous_response_id` to send only incremental tool-result inputs
 *  - Falls back to `streamSimple` (HTTP) if the WebSocket connection fails
 *  - Cleanup helpers for releasing sessions after the run completes
 *
 * Complexity budget & risk mitigation:
 *  - **Transport aware**: respects `transport` (`auto` | `websocket` | `sse`)
 *  - **Transparent fallback in `auto` mode**: connect/send failures fall back to
 *    the existing HTTP `streamSimple`; forced `websocket` mode surfaces WS errors
 *  - **Zero shared state**: per-session registry; session cleanup on dispose prevents leaks
 *  - **Full parity**: all generation options (temperature, top_p, max_output_tokens,
 *    tool_choice, reasoning) forwarded identically to the HTTP path
 *
 * @see src/agents/openai-ws-connection.ts for the connection manager
 */
import type { StreamFn } from "@mariozechner/pi-agent-core";
import * as piAi from "@mariozechner/pi-ai";
import { OpenAIWebSocketManager, type OpenAIWebSocketManagerOptions } from "./openai-ws-connection.js";
type OpenAIWsStreamDeps = {
    createManager: (options?: OpenAIWebSocketManagerOptions) => OpenAIWebSocketManager;
    streamSimple: typeof piAi.streamSimple;
};
/**
 * Release and close the WebSocket session for the given sessionId.
 * Call this after the agent run completes to free the connection.
 */
export declare function releaseWsSession(sessionId: string): void;
/**
 * Returns true if a live WebSocket session exists for the given sessionId.
 */
export declare function hasWsSession(sessionId: string): boolean;
export { buildAssistantMessageFromResponse, convertMessagesToInputItems, convertTools, planTurnInput, } from "./openai-ws-message-conversion.js";
export interface OpenAIWebSocketStreamOptions {
    /** Manager options (url override, retry counts, etc.) */
    managerOptions?: OpenAIWebSocketManagerOptions;
    /** Abort signal forwarded from the run. */
    signal?: AbortSignal;
}
/**
 * Creates a `StreamFn` backed by a persistent WebSocket connection to the
 * OpenAI Responses API.  The first call for a given `sessionId` opens the
 * connection; subsequent calls reuse it, sending only incremental tool-result
 * inputs with `previous_response_id`.
 *
 * If the WebSocket connection is unavailable, the function falls back to the
 * standard `streamSimple` HTTP path and logs a warning.
 *
 * @param apiKey     OpenAI API key
 * @param sessionId  Agent session ID (used as the registry key)
 * @param opts       Optional manager + abort signal overrides
 */
export declare function createOpenAIWebSocketStreamFn(apiKey: string, sessionId: string, opts?: OpenAIWebSocketStreamOptions): StreamFn;
export declare const __testing: {
    setDepsForTest(overrides?: Partial<OpenAIWsStreamDeps>): void;
};
