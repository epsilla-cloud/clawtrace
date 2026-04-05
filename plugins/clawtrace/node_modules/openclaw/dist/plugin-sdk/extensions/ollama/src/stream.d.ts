import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { AssistantMessage } from "@mariozechner/pi-ai";
import type { OpenClawConfig, ProviderWrapStreamFnContext } from "openclaw/plugin-sdk/plugin-entry";
export declare const OLLAMA_NATIVE_BASE_URL = "http://127.0.0.1:11434";
export declare function resolveOllamaBaseUrlForRun(params: {
    modelBaseUrl?: string;
    providerBaseUrl?: string;
}): string;
export declare function isOllamaCompatProvider(model: {
    provider?: string;
    baseUrl?: string;
    api?: string;
}): boolean;
export declare function resolveOllamaCompatNumCtxEnabled(params: {
    config?: OpenClawConfig;
    providerId?: string;
}): boolean;
export declare function shouldInjectOllamaCompatNumCtx(params: {
    model: {
        api?: string;
        provider?: string;
        baseUrl?: string;
    };
    config?: OpenClawConfig;
    providerId?: string;
}): boolean;
export declare function wrapOllamaCompatNumCtx(baseFn: StreamFn | undefined, numCtx: number): StreamFn;
export declare function createConfiguredOllamaCompatStreamWrapper(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
export declare const createConfiguredOllamaCompatNumCtxWrapper: typeof createConfiguredOllamaCompatStreamWrapper;
export declare function buildOllamaChatRequest(params: {
    modelId: string;
    messages: OllamaChatMessage[];
    tools?: OllamaTool[];
    options?: Record<string, unknown>;
    stream?: boolean;
}): OllamaChatRequest;
type StreamModelDescriptor = {
    api: string;
    provider: string;
    id: string;
};
interface OllamaChatRequest {
    model: string;
    messages: OllamaChatMessage[];
    stream: boolean;
    tools?: OllamaTool[];
    options?: Record<string, unknown>;
    think?: boolean;
}
interface OllamaChatMessage {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    images?: string[];
    tool_calls?: OllamaToolCall[];
    tool_name?: string;
}
interface OllamaTool {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    };
}
interface OllamaToolCall {
    function: {
        name: string;
        arguments: Record<string, unknown>;
    };
}
interface OllamaChatResponse {
    model: string;
    created_at: string;
    message: {
        role: "assistant";
        content: string;
        thinking?: string;
        reasoning?: string;
        tool_calls?: OllamaToolCall[];
    };
    done: boolean;
    done_reason?: string;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
export declare function convertToOllamaMessages(messages: Array<{
    role: string;
    content: unknown;
}>, system?: string): OllamaChatMessage[];
export declare function buildAssistantMessage(response: OllamaChatResponse, modelInfo: StreamModelDescriptor): AssistantMessage;
export declare function parseNdjsonStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<OllamaChatResponse>;
export declare function createOllamaStreamFn(baseUrl: string, defaultHeaders?: Record<string, string>): StreamFn;
export declare function createConfiguredOllamaStreamFn(params: {
    model: {
        baseUrl?: string;
        headers?: unknown;
    };
    providerBaseUrl?: string;
}): StreamFn;
export {};
