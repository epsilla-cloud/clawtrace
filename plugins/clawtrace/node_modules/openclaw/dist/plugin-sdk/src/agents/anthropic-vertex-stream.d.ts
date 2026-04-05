import type { StreamFn } from "@mariozechner/pi-agent-core";
/**
 * Create a StreamFn that routes through pi-ai's `streamAnthropic` with an
 * injected `AnthropicVertex` client.  All streaming, message conversion, and
 * event handling is handled by pi-ai — we only supply the GCP-authenticated
 * client and map SimpleStreamOptions → AnthropicOptions.
 */
export declare function createAnthropicVertexStreamFn(projectId: string | undefined, region: string, baseURL?: string): StreamFn;
export declare function createAnthropicVertexStreamFnForModel(model: {
    baseUrl?: string;
}, env?: NodeJS.ProcessEnv): StreamFn;
