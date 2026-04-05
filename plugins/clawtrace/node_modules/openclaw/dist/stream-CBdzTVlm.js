import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import "./defaults-Dpv7c6Om.js";
import "./provider-model-shared-Bzdvns2r.js";
import { r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
import { n as resolveMoonshotThinkingType, r as streamWithPayloadPatch, t as createMoonshotThinkingWrapper } from "./moonshot-thinking-stream-wrappers-DJ9b-Vxi.js";
import { d as isNonSecretApiKeyMarker } from "./model-auth-env-QeMWu7zp.js";
import "./runtime-shvBB17a.js";
import "./provider-stream-B9iIzaRT.js";
import "./provider-auth-Bd38MUDZ.js";
import { createAssistantMessageEventStream, streamSimple } from "@mariozechner/pi-ai";
import { randomUUID } from "node:crypto";
//#region extensions/ollama/src/defaults.ts
const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const OLLAMA_DEFAULT_CONTEXT_WINDOW = 128e3;
const OLLAMA_DEFAULT_MAX_TOKENS = 8192;
const OLLAMA_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const OLLAMA_DEFAULT_MODEL = "glm-4.7-flash";
//#endregion
//#region extensions/ollama/src/stream.ts
const log = createSubsystemLogger("ollama-stream");
const OLLAMA_NATIVE_BASE_URL = OLLAMA_DEFAULT_BASE_URL;
function resolveOllamaBaseUrlForRun(params) {
	const providerBaseUrl = params.providerBaseUrl?.trim();
	if (providerBaseUrl) return providerBaseUrl;
	const modelBaseUrl = params.modelBaseUrl?.trim();
	if (modelBaseUrl) return modelBaseUrl;
	return OLLAMA_NATIVE_BASE_URL;
}
function resolveConfiguredOllamaProviderConfig(params) {
	const providerId = params.providerId?.trim();
	if (!providerId) return;
	const providers = params.config?.models?.providers;
	if (!providers) return;
	const direct = providers[providerId];
	if (direct) return direct;
	const normalized = normalizeProviderId(providerId);
	for (const [candidateId, candidate] of Object.entries(providers)) if (normalizeProviderId(candidateId) === normalized) return candidate;
}
function isOllamaCompatProvider(model) {
	const providerId = normalizeProviderId(model.provider ?? "");
	if (providerId === "ollama") return true;
	if (!model.baseUrl) return false;
	try {
		const parsed = new URL(model.baseUrl);
		const hostname = parsed.hostname.toLowerCase();
		if ((hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]") && parsed.port === "11434") return true;
		const providerHintsOllama = providerId.includes("ollama");
		const isOllamaPort = parsed.port === "11434";
		const isOllamaCompatPath = parsed.pathname === "/" || /^\/v1\/?$/i.test(parsed.pathname);
		return providerHintsOllama && isOllamaPort && isOllamaCompatPath;
	} catch {
		return false;
	}
}
function resolveOllamaCompatNumCtxEnabled(params) {
	return resolveConfiguredOllamaProviderConfig(params)?.injectNumCtxForOpenAICompat ?? true;
}
function shouldInjectOllamaCompatNumCtx(params) {
	if (params.model.api !== "openai-completions") return false;
	if (!isOllamaCompatProvider(params.model)) return false;
	return resolveOllamaCompatNumCtxEnabled({
		config: params.config,
		providerId: params.providerId
	});
}
function wrapOllamaCompatNumCtx(baseFn, numCtx) {
	const streamFn = baseFn ?? streamSimple;
	return (model, context, options) => streamWithPayloadPatch(streamFn, model, context, options, (payloadRecord) => {
		if (!payloadRecord.options || typeof payloadRecord.options !== "object") payloadRecord.options = {};
		payloadRecord.options.num_ctx = numCtx;
	});
}
function createOllamaThinkingOffWrapper(baseFn) {
	const streamFn = baseFn ?? streamSimple;
	return (model, context, options) => {
		if (model.api !== "ollama") return streamFn(model, context, options);
		return streamWithPayloadPatch(streamFn, model, context, options, (payloadRecord) => {
			payloadRecord.think = false;
		});
	};
}
function resolveOllamaCompatNumCtx(model) {
	return Math.max(1, Math.floor(model.contextWindow ?? model.maxTokens ?? 2e5));
}
function isOllamaCloudKimiModelRef(modelId) {
	const normalizedModelId = modelId.trim().toLowerCase();
	return normalizedModelId.startsWith("kimi-k") && normalizedModelId.includes(":cloud");
}
function createConfiguredOllamaCompatStreamWrapper(ctx) {
	let streamFn = ctx.streamFn;
	const model = ctx.model;
	let injectNumCtx = false;
	if (model) {
		const providerId = typeof model.provider === "string" && model.provider.trim().length > 0 ? model.provider : ctx.provider;
		if (shouldInjectOllamaCompatNumCtx({
			model,
			config: ctx.config,
			providerId
		})) injectNumCtx = true;
	}
	if (injectNumCtx && model) streamFn = wrapOllamaCompatNumCtx(streamFn, resolveOllamaCompatNumCtx(model));
	if (ctx.thinkingLevel === "off") streamFn = createOllamaThinkingOffWrapper(streamFn);
	if (normalizeProviderId(ctx.provider) === "ollama" && isOllamaCloudKimiModelRef(ctx.modelId)) {
		const thinkingType = resolveMoonshotThinkingType({
			configuredThinking: ctx.extraParams?.thinking,
			thinkingLevel: ctx.thinkingLevel
		});
		streamFn = createMoonshotThinkingWrapper(streamFn, thinkingType);
	}
	return streamFn;
}
const createConfiguredOllamaCompatNumCtxWrapper = createConfiguredOllamaCompatStreamWrapper;
function buildOllamaChatRequest(params) {
	return {
		model: params.modelId,
		messages: params.messages,
		stream: params.stream ?? true,
		...params.tools && params.tools.length > 0 ? { tools: params.tools } : {},
		...params.options ? { options: params.options } : {}
	};
}
function buildUsageWithNoCost(params) {
	const input = params.input ?? 0;
	const output = params.output ?? 0;
	return {
		input,
		output,
		cacheRead: params.cacheRead ?? 0,
		cacheWrite: params.cacheWrite ?? 0,
		totalTokens: params.totalTokens ?? input + output,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
function buildStreamAssistantMessage(params) {
	return {
		role: "assistant",
		content: params.content,
		stopReason: params.stopReason,
		api: params.model.api,
		provider: params.model.provider,
		model: params.model.id,
		usage: params.usage,
		timestamp: params.timestamp ?? Date.now()
	};
}
function buildStreamErrorAssistantMessage(params) {
	return {
		...buildStreamAssistantMessage({
			model: params.model,
			content: [],
			stopReason: "error",
			usage: buildUsageWithNoCost({}),
			timestamp: params.timestamp
		}),
		stopReason: "error",
		errorMessage: params.errorMessage
	};
}
const MAX_SAFE_INTEGER_ABS_STR = String(Number.MAX_SAFE_INTEGER);
function isAsciiDigit(ch) {
	return ch !== void 0 && ch >= "0" && ch <= "9";
}
function parseJsonNumberToken(input, start) {
	let idx = start;
	if (input[idx] === "-") idx += 1;
	if (idx >= input.length) return null;
	if (input[idx] === "0") idx += 1;
	else if (isAsciiDigit(input[idx]) && input[idx] !== "0") while (isAsciiDigit(input[idx])) idx += 1;
	else return null;
	let isInteger = true;
	if (input[idx] === ".") {
		isInteger = false;
		idx += 1;
		if (!isAsciiDigit(input[idx])) return null;
		while (isAsciiDigit(input[idx])) idx += 1;
	}
	if (input[idx] === "e" || input[idx] === "E") {
		isInteger = false;
		idx += 1;
		if (input[idx] === "+" || input[idx] === "-") idx += 1;
		if (!isAsciiDigit(input[idx])) return null;
		while (isAsciiDigit(input[idx])) idx += 1;
	}
	return {
		token: input.slice(start, idx),
		end: idx,
		isInteger
	};
}
function isUnsafeIntegerLiteral(token) {
	const digits = token[0] === "-" ? token.slice(1) : token;
	if (digits.length < MAX_SAFE_INTEGER_ABS_STR.length) return false;
	if (digits.length > MAX_SAFE_INTEGER_ABS_STR.length) return true;
	return digits > MAX_SAFE_INTEGER_ABS_STR;
}
function quoteUnsafeIntegerLiterals(input) {
	let out = "";
	let inString = false;
	let escaped = false;
	let idx = 0;
	while (idx < input.length) {
		const ch = input[idx] ?? "";
		if (inString) {
			out += ch;
			if (escaped) escaped = false;
			else if (ch === "\\") escaped = true;
			else if (ch === "\"") inString = false;
			idx += 1;
			continue;
		}
		if (ch === "\"") {
			inString = true;
			out += ch;
			idx += 1;
			continue;
		}
		if (ch === "-" || isAsciiDigit(ch)) {
			const parsed = parseJsonNumberToken(input, idx);
			if (parsed) {
				if (parsed.isInteger && isUnsafeIntegerLiteral(parsed.token)) out += `"${parsed.token}"`;
				else out += parsed.token;
				idx = parsed.end;
				continue;
			}
		}
		out += ch;
		idx += 1;
	}
	return out;
}
function parseJsonPreservingUnsafeIntegers(input) {
	return JSON.parse(quoteUnsafeIntegerLiterals(input));
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.filter((part) => part.type === "text").map((part) => part.text).join("");
}
function extractOllamaImages(content) {
	if (!Array.isArray(content)) return [];
	return content.filter((part) => part.type === "image").map((part) => part.data);
}
function extractToolCalls(content) {
	if (!Array.isArray(content)) return [];
	const parts = content;
	const result = [];
	for (const part of parts) if (part.type === "toolCall") result.push({ function: {
		name: part.name,
		arguments: part.arguments
	} });
	else if (part.type === "tool_use") result.push({ function: {
		name: part.name,
		arguments: part.input
	} });
	return result;
}
function convertToOllamaMessages(messages, system) {
	const result = [];
	if (system) result.push({
		role: "system",
		content: system
	});
	for (const msg of messages) {
		if (msg.role === "user") {
			const text = extractTextContent(msg.content);
			const images = extractOllamaImages(msg.content);
			result.push({
				role: "user",
				content: text,
				...images.length > 0 ? { images } : {}
			});
			continue;
		}
		if (msg.role === "assistant") {
			const text = extractTextContent(msg.content);
			const toolCalls = extractToolCalls(msg.content);
			result.push({
				role: "assistant",
				content: text,
				...toolCalls.length > 0 ? { tool_calls: toolCalls } : {}
			});
			continue;
		}
		if (msg.role === "tool" || msg.role === "toolResult") {
			const text = extractTextContent(msg.content);
			const toolName = typeof msg.toolName === "string" ? msg.toolName : void 0;
			result.push({
				role: "tool",
				content: text,
				...toolName ? { tool_name: toolName } : {}
			});
		}
	}
	return result;
}
function extractOllamaTools(tools) {
	if (!tools || !Array.isArray(tools)) return [];
	const result = [];
	for (const tool of tools) {
		if (typeof tool.name !== "string" || !tool.name) continue;
		result.push({
			type: "function",
			function: {
				name: tool.name,
				description: typeof tool.description === "string" ? tool.description : "",
				parameters: tool.parameters ?? {}
			}
		});
	}
	return result;
}
function buildAssistantMessage(response, modelInfo) {
	const content = [];
	const text = response.message.content || "";
	if (text) content.push({
		type: "text",
		text
	});
	const toolCalls = response.message.tool_calls;
	if (toolCalls && toolCalls.length > 0) for (const toolCall of toolCalls) content.push({
		type: "toolCall",
		id: `ollama_call_${randomUUID()}`,
		name: toolCall.function.name,
		arguments: toolCall.function.arguments
	});
	return buildStreamAssistantMessage({
		model: modelInfo,
		content,
		stopReason: toolCalls && toolCalls.length > 0 ? "toolUse" : "stop",
		usage: buildUsageWithNoCost({
			input: response.prompt_eval_count ?? 0,
			output: response.eval_count ?? 0
		})
	});
}
async function* parseNdjsonStream(reader) {
	const decoder = new TextDecoder();
	let buffer = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			try {
				yield parseJsonPreservingUnsafeIntegers(trimmed);
			} catch {
				log.warn(`Skipping malformed NDJSON line: ${trimmed.slice(0, 120)}`);
			}
		}
	}
	if (buffer.trim()) try {
		yield parseJsonPreservingUnsafeIntegers(buffer.trim());
	} catch {
		log.warn(`Skipping malformed trailing data: ${buffer.trim().slice(0, 120)}`);
	}
}
function resolveOllamaChatUrl(baseUrl) {
	return `${baseUrl.trim().replace(/\/+$/, "").replace(/\/v1$/i, "") || OLLAMA_NATIVE_BASE_URL}/api/chat`;
}
function resolveOllamaModelHeaders(model) {
	if (!model.headers || typeof model.headers !== "object" || Array.isArray(model.headers)) return;
	return model.headers;
}
function createOllamaStreamFn(baseUrl, defaultHeaders) {
	const chatUrl = resolveOllamaChatUrl(baseUrl);
	return (model, context, options) => {
		const stream = createAssistantMessageEventStream();
		const run = async () => {
			try {
				const ollamaMessages = convertToOllamaMessages(context.messages ?? [], context.systemPrompt);
				const ollamaTools = extractOllamaTools(context.tools);
				const ollamaOptions = { num_ctx: model.contextWindow ?? 65536 };
				if (typeof options?.temperature === "number") ollamaOptions.temperature = options.temperature;
				if (typeof options?.maxTokens === "number") ollamaOptions.num_predict = options.maxTokens;
				const body = buildOllamaChatRequest({
					modelId: model.id,
					messages: ollamaMessages,
					stream: true,
					tools: ollamaTools,
					options: ollamaOptions
				});
				options?.onPayload?.(body, model);
				const headers = {
					"Content-Type": "application/json",
					...defaultHeaders,
					...options?.headers
				};
				if (options?.apiKey && (!headers.Authorization || !isNonSecretApiKeyMarker(options.apiKey))) headers.Authorization = `Bearer ${options.apiKey}`;
				const response = await fetch(chatUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
					signal: options?.signal
				});
				if (!response.ok) {
					const errorText = await response.text().catch(() => "unknown error");
					throw new Error(`${response.status} ${errorText}`);
				}
				if (!response.body) throw new Error("Ollama API returned empty response body");
				const reader = response.body.getReader();
				let accumulatedContent = "";
				const accumulatedToolCalls = [];
				let finalResponse;
				const modelInfo = {
					api: model.api,
					provider: model.provider,
					id: model.id
				};
				let streamStarted = false;
				let textBlockClosed = false;
				const closeTextBlock = () => {
					if (!streamStarted || textBlockClosed) return;
					textBlockClosed = true;
					const partial = buildStreamAssistantMessage({
						model: modelInfo,
						content: [{
							type: "text",
							text: accumulatedContent
						}],
						stopReason: "stop",
						usage: buildUsageWithNoCost({})
					});
					stream.push({
						type: "text_end",
						contentIndex: 0,
						content: accumulatedContent,
						partial
					});
				};
				for await (const chunk of parseNdjsonStream(reader)) {
					if (chunk.message?.content) {
						const delta = chunk.message.content;
						if (!streamStarted) {
							streamStarted = true;
							const emptyPartial = buildStreamAssistantMessage({
								model: modelInfo,
								content: [],
								stopReason: "stop",
								usage: buildUsageWithNoCost({})
							});
							stream.push({
								type: "start",
								partial: emptyPartial
							});
							stream.push({
								type: "text_start",
								contentIndex: 0,
								partial: emptyPartial
							});
						}
						accumulatedContent += delta;
						const partial = buildStreamAssistantMessage({
							model: modelInfo,
							content: [{
								type: "text",
								text: accumulatedContent
							}],
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "text_delta",
							contentIndex: 0,
							delta,
							partial
						});
					}
					if (chunk.message?.tool_calls) {
						closeTextBlock();
						accumulatedToolCalls.push(...chunk.message.tool_calls);
					}
					if (chunk.done) {
						finalResponse = chunk;
						break;
					}
				}
				if (!finalResponse) throw new Error("Ollama API stream ended without a final response");
				finalResponse.message.content = accumulatedContent;
				if (accumulatedToolCalls.length > 0) finalResponse.message.tool_calls = accumulatedToolCalls;
				const assistantMessage = buildAssistantMessage(finalResponse, modelInfo);
				closeTextBlock();
				stream.push({
					type: "done",
					reason: assistantMessage.stopReason === "toolUse" ? "toolUse" : "stop",
					message: assistantMessage
				});
			} catch (err) {
				stream.push({
					type: "error",
					reason: "error",
					error: buildStreamErrorAssistantMessage({
						model,
						errorMessage: err instanceof Error ? err.message : String(err)
					})
				});
			} finally {
				stream.end();
			}
		};
		queueMicrotask(() => void run());
		return stream;
	};
}
function createConfiguredOllamaStreamFn(params) {
	return createOllamaStreamFn(resolveOllamaBaseUrlForRun({
		modelBaseUrl: typeof params.model.baseUrl === "string" ? params.model.baseUrl : void 0,
		providerBaseUrl: params.providerBaseUrl
	}), resolveOllamaModelHeaders(params.model));
}
//#endregion
export { OLLAMA_DEFAULT_COST as _, createConfiguredOllamaCompatNumCtxWrapper as a, createOllamaStreamFn as c, resolveOllamaBaseUrlForRun as d, resolveOllamaCompatNumCtxEnabled as f, OLLAMA_DEFAULT_CONTEXT_WINDOW as g, OLLAMA_DEFAULT_BASE_URL as h, convertToOllamaMessages as i, isOllamaCompatProvider as l, wrapOllamaCompatNumCtx as m, buildAssistantMessage as n, createConfiguredOllamaCompatStreamWrapper as o, shouldInjectOllamaCompatNumCtx as p, buildOllamaChatRequest as r, createConfiguredOllamaStreamFn as s, OLLAMA_NATIVE_BASE_URL as t, parseNdjsonStream as u, OLLAMA_DEFAULT_MAX_TOKENS as v, OLLAMA_DEFAULT_MODEL as y };
