import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
import { r as streamWithPayloadPatch } from "./moonshot-thinking-stream-wrappers-DJ9b-Vxi.js";
import { _ as resolveStateDir } from "./paths-Y4UT24Of.js";
import { s as resolveRuntimeServiceVersion } from "./version-CIMrqUx3.js";
import { i as resolveProxyFetchFromEnv } from "./proxy-fetch-Bp45Pwna.js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { streamSimple } from "@mariozechner/pi-ai";
//#region src/agents/pi-embedded-runner/bedrock-stream-wrappers.ts
function createBedrockNoCacheWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => underlying(model, context, {
		...options,
		cacheRetention: "none"
	});
}
function isAnthropicBedrockModel(modelId) {
	const normalized = modelId.toLowerCase();
	return normalized.includes("anthropic.claude") || normalized.includes("anthropic/claude");
}
//#endregion
//#region src/agents/pi-embedded-runner/google-stream-wrappers.ts
function isGemini31Model(modelId) {
	const normalized = modelId.toLowerCase();
	return normalized.includes("gemini-3.1-pro") || normalized.includes("gemini-3.1-flash");
}
function mapThinkLevelToGoogleThinkingLevel(thinkingLevel) {
	switch (thinkingLevel) {
		case "minimal": return "MINIMAL";
		case "low": return "LOW";
		case "medium":
		case "adaptive": return "MEDIUM";
		case "high":
		case "xhigh": return "HIGH";
		default: return;
	}
}
function sanitizeGoogleThinkingPayload(params) {
	if (!params.payload || typeof params.payload !== "object") return;
	const config = params.payload.config;
	if (!config || typeof config !== "object") return;
	const thinkingConfig = config.thinkingConfig;
	if (!thinkingConfig || typeof thinkingConfig !== "object") return;
	const thinkingConfigObj = thinkingConfig;
	const thinkingBudget = thinkingConfigObj.thinkingBudget;
	if (typeof thinkingBudget !== "number" || thinkingBudget >= 0) return;
	delete thinkingConfigObj.thinkingBudget;
	if (typeof params.modelId === "string" && isGemini31Model(params.modelId) && params.thinkingLevel && params.thinkingLevel !== "off" && thinkingConfigObj.thinkingLevel === void 0) {
		const mappedLevel = mapThinkLevelToGoogleThinkingLevel(params.thinkingLevel);
		if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
	}
}
function createGoogleThinkingPayloadWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (model.api === "google-generative-ai") sanitizeGoogleThinkingPayload({
				payload,
				modelId: model.id,
				thinkingLevel
			});
		});
	};
}
//#endregion
//#region src/agents/provider-attribution.ts
const OPENCLAW_ATTRIBUTION_PRODUCT = "OpenClaw";
const OPENCLAW_ATTRIBUTION_ORIGINATOR = "openclaw";
function resolveProviderAttributionIdentity(env = process.env) {
	return {
		product: OPENCLAW_ATTRIBUTION_PRODUCT,
		version: resolveRuntimeServiceVersion(env)
	};
}
function buildOpenRouterAttributionPolicy(env = process.env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "openrouter",
		enabledByDefault: true,
		verification: "vendor-documented",
		hook: "request-headers",
		docsUrl: "https://openrouter.ai/docs/app-attribution",
		reviewNote: "Documented app attribution headers. Verified in OpenClaw runtime wrapper.",
		...identity,
		headers: {
			"HTTP-Referer": "https://openclaw.ai",
			"X-OpenRouter-Title": identity.product,
			"X-OpenRouter-Categories": "cli-agent"
		}
	};
}
function buildOpenAIAttributionPolicy(env = process.env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "openai",
		enabledByDefault: true,
		verification: "vendor-hidden-api-spec",
		hook: "request-headers",
		reviewNote: "OpenAI native traffic supports hidden originator/User-Agent attribution. Verified against the Codex wire contract.",
		...identity,
		headers: {
			originator: OPENCLAW_ATTRIBUTION_ORIGINATOR,
			version: identity.version,
			"User-Agent": `${OPENCLAW_ATTRIBUTION_ORIGINATOR}/${identity.version}`
		}
	};
}
function buildOpenAICodexAttributionPolicy(env = process.env) {
	const identity = resolveProviderAttributionIdentity(env);
	return {
		provider: "openai-codex",
		enabledByDefault: true,
		verification: "vendor-hidden-api-spec",
		hook: "request-headers",
		reviewNote: "OpenAI Codex ChatGPT-backed traffic supports the same hidden originator/User-Agent attribution contract.",
		...identity,
		headers: {
			originator: OPENCLAW_ATTRIBUTION_ORIGINATOR,
			version: identity.version,
			"User-Agent": `${OPENCLAW_ATTRIBUTION_ORIGINATOR}/${identity.version}`
		}
	};
}
function buildSdkHookOnlyPolicy(provider, hook, reviewNote, env = process.env) {
	return {
		provider,
		enabledByDefault: false,
		verification: "vendor-sdk-hook-only",
		hook,
		reviewNote,
		...resolveProviderAttributionIdentity(env)
	};
}
function listProviderAttributionPolicies(env = process.env) {
	return [
		buildOpenRouterAttributionPolicy(env),
		buildOpenAIAttributionPolicy(env),
		buildOpenAICodexAttributionPolicy(env),
		buildSdkHookOnlyPolicy("anthropic", "default-headers", "Anthropic JS SDK exposes defaultHeaders, but app attribution is not yet verified.", env),
		buildSdkHookOnlyPolicy("google", "user-agent-extra", "Google GenAI JS SDK exposes userAgentExtra/httpOptions, but provider-side attribution is not yet verified.", env),
		buildSdkHookOnlyPolicy("groq", "default-headers", "Groq JS SDK exposes defaultHeaders, but app attribution is not yet verified.", env),
		buildSdkHookOnlyPolicy("mistral", "custom-user-agent", "Mistral JS SDK exposes a custom userAgent option, but app attribution is not yet verified.", env),
		buildSdkHookOnlyPolicy("together", "default-headers", "Together JS SDK exposes defaultHeaders, but app attribution is not yet verified.", env)
	];
}
function resolveProviderAttributionPolicy(provider, env = process.env) {
	const normalized = normalizeProviderId(provider ?? "");
	return listProviderAttributionPolicies(env).find((policy) => policy.provider === normalized);
}
function resolveProviderAttributionHeaders(provider, env = process.env) {
	const policy = resolveProviderAttributionPolicy(provider, env);
	if (!policy?.enabledByDefault) return;
	return policy.headers;
}
//#endregion
//#region src/agents/pi-embedded-runner/proxy-stream-wrappers.ts
const KILOCODE_FEATURE_HEADER = "X-KILOCODE-FEATURE";
const KILOCODE_FEATURE_DEFAULT = "openclaw";
const KILOCODE_FEATURE_ENV_VAR = "KILOCODE_FEATURE";
function resolveKilocodeAppHeaders() {
	const feature = process.env[KILOCODE_FEATURE_ENV_VAR]?.trim() || KILOCODE_FEATURE_DEFAULT;
	return { [KILOCODE_FEATURE_HEADER]: feature };
}
function isOpenRouterAnthropicModel(provider, modelId) {
	return provider.toLowerCase() === "openrouter" && modelId.toLowerCase().startsWith("anthropic/");
}
function mapThinkingLevelToOpenRouterReasoningEffort(thinkingLevel) {
	if (thinkingLevel === "off") return "none";
	if (thinkingLevel === "adaptive") return "medium";
	return thinkingLevel;
}
function normalizeProxyReasoningPayload(payload, thinkingLevel) {
	if (!payload || typeof payload !== "object") return;
	const payloadObj = payload;
	delete payloadObj.reasoning_effort;
	if (!thinkingLevel || thinkingLevel === "off") return;
	const existingReasoning = payloadObj.reasoning;
	if (existingReasoning && typeof existingReasoning === "object" && !Array.isArray(existingReasoning)) {
		const reasoningObj = existingReasoning;
		if (!("max_tokens" in reasoningObj) && !("effort" in reasoningObj)) reasoningObj.effort = mapThinkingLevelToOpenRouterReasoningEffort(thinkingLevel);
	} else if (!existingReasoning) payloadObj.reasoning = { effort: mapThinkingLevelToOpenRouterReasoningEffort(thinkingLevel) };
}
function createOpenRouterSystemCacheWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (typeof model.provider !== "string" || typeof model.id !== "string" || !isOpenRouterAnthropicModel(model.provider, model.id)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			const messages = payloadObj.messages;
			if (Array.isArray(messages)) for (const msg of messages) {
				if (msg.role !== "system" && msg.role !== "developer") continue;
				if (typeof msg.content === "string") msg.content = [{
					type: "text",
					text: msg.content,
					cache_control: { type: "ephemeral" }
				}];
				else if (Array.isArray(msg.content) && msg.content.length > 0) {
					const last = msg.content[msg.content.length - 1];
					if (last && typeof last === "object") last.cache_control = { type: "ephemeral" };
				}
			}
		});
	};
}
function createOpenRouterWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const attributionHeaders = resolveProviderAttributionHeaders("openrouter");
		return streamWithPayloadPatch(underlying, model, context, {
			...options,
			headers: {
				...attributionHeaders,
				...options?.headers
			}
		}, (payload) => {
			normalizeProxyReasoningPayload(payload, thinkingLevel);
		});
	};
}
function isProxyReasoningUnsupported(modelId) {
	return modelId.toLowerCase().startsWith("x-ai/");
}
function createKilocodeWrapper(baseStreamFn, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		return streamWithPayloadPatch(underlying, model, context, {
			...options,
			headers: {
				...options?.headers,
				...resolveKilocodeAppHeaders()
			}
		}, (payload) => {
			normalizeProxyReasoningPayload(payload, thinkingLevel);
		});
	};
}
//#endregion
//#region src/agents/pi-embedded-runner/logger.ts
const log$1 = createSubsystemLogger("agent/embedded");
//#endregion
//#region src/agents/pi-embedded-runner/openai-stream-wrappers.ts
const OPENAI_RESPONSES_APIS = new Set(["openai-responses"]);
const OPENAI_RESPONSES_PROVIDERS = new Set([
	"openai",
	"azure-openai",
	"azure-openai-responses"
]);
function isDirectOpenAIBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string" || !baseUrl.trim()) return false;
	try {
		const host = new URL(baseUrl).hostname.toLowerCase();
		return host === "api.openai.com" || host === "chatgpt.com" || host.endsWith(".openai.azure.com");
	} catch {
		const normalized = baseUrl.toLowerCase();
		return normalized.includes("api.openai.com") || normalized.includes("chatgpt.com") || normalized.includes(".openai.azure.com");
	}
}
function isOpenAIPublicApiBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string" || !baseUrl.trim()) return false;
	try {
		return new URL(baseUrl).hostname.toLowerCase() === "api.openai.com";
	} catch {
		return baseUrl.toLowerCase().includes("api.openai.com");
	}
}
function isOpenAICodexBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string" || !baseUrl.trim()) return false;
	try {
		return new URL(baseUrl).hostname.toLowerCase() === "chatgpt.com";
	} catch {
		return baseUrl.toLowerCase().includes("chatgpt.com");
	}
}
function shouldApplyOpenAIAttributionHeaders(model) {
	if (model.provider === "openai" && (model.api === "openai-completions" || model.api === "openai-responses") && isOpenAIPublicApiBaseUrl(model.baseUrl)) return "openai";
	if (model.provider === "openai-codex" && (model.api === "openai-codex-responses" || model.api === "openai-responses") && isOpenAICodexBaseUrl(model.baseUrl)) return "openai-codex";
}
function shouldForceResponsesStore(model) {
	if (model.compat?.supportsStore === false) return false;
	if (typeof model.api !== "string" || typeof model.provider !== "string") return false;
	if (!OPENAI_RESPONSES_APIS.has(model.api)) return false;
	if (!OPENAI_RESPONSES_PROVIDERS.has(model.provider)) return false;
	return isDirectOpenAIBaseUrl(model.baseUrl);
}
function parsePositiveInteger(value) {
	if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
	if (typeof value === "string") {
		const parsed = Number.parseInt(value, 10);
		if (Number.isFinite(parsed) && parsed > 0) return parsed;
	}
}
function resolveOpenAIResponsesCompactThreshold(model) {
	const contextWindow = parsePositiveInteger(model.contextWindow);
	if (contextWindow) return Math.max(1e3, Math.floor(contextWindow * .7));
	return 8e4;
}
function shouldEnableOpenAIResponsesServerCompaction(model, extraParams) {
	const configured = extraParams?.responsesServerCompaction;
	if (configured === false) return false;
	if (!shouldForceResponsesStore(model)) return false;
	if (configured === true) return true;
	return model.provider === "openai";
}
function shouldStripResponsesStore(model, forceStore) {
	if (forceStore) return false;
	if (typeof model.api !== "string") return false;
	return OPENAI_RESPONSES_APIS.has(model.api) && model.compat?.supportsStore === false;
}
function shouldStripResponsesPromptCache(model) {
	if (typeof model.api !== "string" || !OPENAI_RESPONSES_APIS.has(model.api)) return false;
	if (typeof model.baseUrl !== "string" || !model.baseUrl.trim()) return false;
	return !isDirectOpenAIBaseUrl(model.baseUrl);
}
function applyOpenAIResponsesPayloadOverrides(params) {
	if (params.forceStore) params.payloadObj.store = true;
	if (params.stripStore) delete params.payloadObj.store;
	if (params.stripPromptCache) {
		delete params.payloadObj.prompt_cache_key;
		delete params.payloadObj.prompt_cache_retention;
	}
	if (params.useServerCompaction && params.payloadObj.context_management === void 0) params.payloadObj.context_management = [{
		type: "compaction",
		compact_threshold: params.compactThreshold
	}];
}
function normalizeOpenAIServiceTier(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase();
	if (normalized === "auto" || normalized === "default" || normalized === "flex" || normalized === "priority") return normalized;
}
function resolveOpenAIServiceTier(extraParams) {
	const raw = extraParams?.serviceTier ?? extraParams?.service_tier;
	const normalized = normalizeOpenAIServiceTier(raw);
	if (raw !== void 0 && normalized === void 0) {
		const rawSummary = typeof raw === "string" ? raw : typeof raw;
		log$1.warn(`ignoring invalid OpenAI service tier param: ${rawSummary}`);
	}
	return normalized;
}
function normalizeOpenAIFastMode(value) {
	if (typeof value === "boolean") return value;
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase();
	if (normalized === "on" || normalized === "true" || normalized === "yes" || normalized === "1" || normalized === "fast") return true;
	if (normalized === "off" || normalized === "false" || normalized === "no" || normalized === "0" || normalized === "normal") return false;
}
function resolveOpenAIFastMode(extraParams) {
	const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
	const normalized = normalizeOpenAIFastMode(raw);
	if (raw !== void 0 && normalized === void 0) {
		const rawSummary = typeof raw === "string" ? raw : typeof raw;
		log$1.warn(`ignoring invalid OpenAI fast mode param: ${rawSummary}`);
	}
	return normalized;
}
function resolveFastModeReasoningEffort(modelId) {
	if (typeof modelId !== "string") return "low";
	if (modelId.trim().toLowerCase().startsWith("gpt-5")) return "low";
	return "low";
}
function applyOpenAIFastModePayloadOverrides(params) {
	if (params.payloadObj.reasoning === void 0) params.payloadObj.reasoning = { effort: resolveFastModeReasoningEffort(params.model.id) };
	const existingText = params.payloadObj.text;
	if (existingText === void 0) params.payloadObj.text = { verbosity: "low" };
	else if (existingText && typeof existingText === "object" && !Array.isArray(existingText)) {
		const textObj = existingText;
		if (textObj.verbosity === void 0) textObj.verbosity = "low";
	}
	if (params.model.provider === "openai" && params.payloadObj.service_tier === void 0 && isOpenAIPublicApiBaseUrl(params.model.baseUrl)) params.payloadObj.service_tier = "priority";
}
function createOpenAIResponsesContextManagementWrapper(baseStreamFn, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const forceStore = shouldForceResponsesStore(model);
		const useServerCompaction = shouldEnableOpenAIResponsesServerCompaction(model, extraParams);
		const stripStore = shouldStripResponsesStore(model, forceStore);
		const stripPromptCache = shouldStripResponsesPromptCache(model);
		if (!forceStore && !useServerCompaction && !stripStore && !stripPromptCache) return underlying(model, context, options);
		const compactThreshold = parsePositiveInteger(extraParams?.responsesCompactThreshold) ?? resolveOpenAIResponsesCompactThreshold(model);
		const originalOnPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload: (payload) => {
				if (payload && typeof payload === "object") applyOpenAIResponsesPayloadOverrides({
					payloadObj: payload,
					forceStore,
					stripStore,
					stripPromptCache,
					useServerCompaction,
					compactThreshold
				});
				return originalOnPayload?.(payload, model);
			}
		});
	};
}
function createOpenAIFastModeWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.api !== "openai-responses" && model.api !== "openai-codex-responses" || model.provider !== "openai" && model.provider !== "openai-codex") return underlying(model, context, options);
		const originalOnPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload: (payload) => {
				if (payload && typeof payload === "object") applyOpenAIFastModePayloadOverrides({
					payloadObj: payload,
					model
				});
				return originalOnPayload?.(payload, model);
			}
		});
	};
}
function createOpenAIServiceTierWrapper(baseStreamFn, serviceTier) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.api !== "openai-responses" || model.provider !== "openai" || !isOpenAIPublicApiBaseUrl(model.baseUrl)) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			if (payloadObj.service_tier === void 0) payloadObj.service_tier = serviceTier;
		});
	};
}
function createOpenAIDefaultTransportWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const typedOptions = options;
		return underlying(model, context, {
			...options,
			transport: options?.transport ?? "auto",
			openaiWsWarmup: typedOptions?.openaiWsWarmup ?? false
		});
	};
}
function createOpenAIAttributionHeadersWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const attributionProvider = shouldApplyOpenAIAttributionHeaders(model);
		if (!attributionProvider) return underlying(model, context, options);
		return underlying(model, context, {
			...options,
			headers: {
				...options?.headers,
				...resolveProviderAttributionHeaders(attributionProvider)
			}
		});
	};
}
//#endregion
//#region src/agents/pi-embedded-runner/zai-stream-wrappers.ts
/**
* Inject `tool_stream=true` so tool-call deltas stream in real time.
* Providers can disable this by setting `params.tool_stream=false`.
*/
function createToolStreamWrapper(baseStreamFn, enabled) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!enabled) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			payloadObj.tool_stream = true;
		});
	};
}
const createZaiToolStreamWrapper = createToolStreamWrapper;
//#endregion
//#region src/agents/pi-embedded-runner/openrouter-model-capabilities.ts
/**
* Runtime OpenRouter model capability detection.
*
* When an OpenRouter model is not in the built-in static list, we look up its
* actual capabilities from a cached copy of the OpenRouter model catalog.
*
* Cache layers (checked in order):
* 1. In-memory Map (instant, cleared on process restart)
* 2. On-disk JSON file (<stateDir>/cache/openrouter-models.json)
* 3. OpenRouter API fetch (populates both layers)
*
* Model capabilities are assumed stable — the cache has no TTL expiry.
* A background refresh is triggered only when a model is not found in
* the cache (i.e. a newly added model on OpenRouter).
*
* Sync callers can read whatever is already cached. Async callers can await a
* one-time fetch so the first unknown-model lookup resolves with real
* capabilities instead of the text-only fallback.
*/
const log = createSubsystemLogger("openrouter-model-capabilities");
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const FETCH_TIMEOUT_MS = 1e4;
const DISK_CACHE_FILENAME = "openrouter-models.json";
function resolveDiskCacheDir() {
	return join(resolveStateDir(), "cache");
}
function resolveDiskCachePath() {
	return join(resolveDiskCacheDir(), DISK_CACHE_FILENAME);
}
function writeDiskCache(map) {
	try {
		const cacheDir = resolveDiskCacheDir();
		if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
		const payload = { models: Object.fromEntries(map) };
		writeFileSync(resolveDiskCachePath(), JSON.stringify(payload), "utf-8");
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		log.debug(`Failed to write OpenRouter disk cache: ${message}`);
	}
}
function isValidCapabilities(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.name === "string" && Array.isArray(record.input) && typeof record.reasoning === "boolean" && typeof record.contextWindow === "number" && typeof record.maxTokens === "number";
}
function readDiskCache() {
	try {
		const cachePath = resolveDiskCachePath();
		if (!existsSync(cachePath)) return;
		const raw = readFileSync(cachePath, "utf-8");
		const payload = JSON.parse(raw);
		if (!payload || typeof payload !== "object") return;
		const models = payload.models;
		if (!models || typeof models !== "object") return;
		const map = /* @__PURE__ */ new Map();
		for (const [id, caps] of Object.entries(models)) if (isValidCapabilities(caps)) map.set(id, caps);
		return map.size > 0 ? map : void 0;
	} catch {
		return;
	}
}
let cache;
let fetchInFlight;
const skipNextMissRefresh = /* @__PURE__ */ new Set();
function parseModel(model) {
	const input = ["text"];
	if (((model.architecture?.modality ?? model.modality ?? "").split("->")[0] ?? "").includes("image")) input.push("image");
	return {
		name: model.name || model.id,
		input,
		reasoning: model.supported_parameters?.includes("reasoning") ?? false,
		contextWindow: model.context_length || 128e3,
		maxTokens: model.top_provider?.max_completion_tokens ?? model.max_completion_tokens ?? model.max_output_tokens ?? 8192,
		cost: {
			input: parseFloat(model.pricing?.prompt || "0") * 1e6,
			output: parseFloat(model.pricing?.completion || "0") * 1e6,
			cacheRead: parseFloat(model.pricing?.input_cache_read || "0") * 1e6,
			cacheWrite: parseFloat(model.pricing?.input_cache_write || "0") * 1e6
		}
	};
}
async function doFetch() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		const response = await (resolveProxyFetchFromEnv() ?? globalThis.fetch)(OPENROUTER_MODELS_URL, { signal: controller.signal });
		if (!response.ok) {
			log.warn(`OpenRouter models API returned ${response.status}`);
			return;
		}
		const models = (await response.json()).data ?? [];
		const map = /* @__PURE__ */ new Map();
		for (const model of models) {
			if (!model.id) continue;
			map.set(model.id, parseModel(model));
		}
		cache = map;
		writeDiskCache(map);
		log.debug(`Cached ${map.size} OpenRouter models from API`);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		log.warn(`Failed to fetch OpenRouter models: ${message}`);
	} finally {
		clearTimeout(timeout);
	}
}
function triggerFetch() {
	if (fetchInFlight) return;
	fetchInFlight = doFetch().finally(() => {
		fetchInFlight = void 0;
	});
}
/**
* Ensure the cache is populated. Checks in-memory first, then disk, then
* triggers a background API fetch as a last resort.
* Does not block — returns immediately.
*/
function ensureOpenRouterModelCache() {
	if (cache) return;
	const disk = readDiskCache();
	if (disk) {
		cache = disk;
		log.debug(`Loaded ${disk.size} OpenRouter models from disk cache`);
		return;
	}
	triggerFetch();
}
/**
* Ensure capabilities for a specific model are available before first use.
*
* Known cached entries return immediately. Unknown entries wait for at most
* one catalog fetch, then leave sync resolution to read from the populated
* cache on the same request.
*/
async function loadOpenRouterModelCapabilities(modelId) {
	ensureOpenRouterModelCache();
	if (cache?.has(modelId)) return;
	let fetchPromise = fetchInFlight;
	if (!fetchPromise) {
		triggerFetch();
		fetchPromise = fetchInFlight;
	}
	await fetchPromise;
	if (!cache?.has(modelId)) skipNextMissRefresh.add(modelId);
}
/**
* Synchronously look up model capabilities from the cache.
*
* If a model is not found but the cache exists, a background refresh is
* triggered in case it's a newly added model not yet in the cache.
*/
function getOpenRouterModelCapabilities(modelId) {
	ensureOpenRouterModelCache();
	const result = cache?.get(modelId);
	if (!result && skipNextMissRefresh.delete(modelId)) return;
	if (!result && cache && !fetchInFlight) triggerFetch();
	return result;
}
//#endregion
export { resolveProviderAttributionHeaders as _, createOpenAIAttributionHeadersWrapper as a, createBedrockNoCacheWrapper as b, createOpenAIResponsesContextManagementWrapper as c, resolveOpenAIServiceTier as d, log$1 as f, isProxyReasoningUnsupported as g, createOpenRouterWrapper as h, createZaiToolStreamWrapper as i, createOpenAIServiceTierWrapper as l, createOpenRouterSystemCacheWrapper as m, loadOpenRouterModelCapabilities as n, createOpenAIDefaultTransportWrapper as o, createKilocodeWrapper as p, createToolStreamWrapper as r, createOpenAIFastModeWrapper as s, getOpenRouterModelCapabilities as t, resolveOpenAIFastMode as u, createGoogleThinkingPayloadWrapper as v, isAnthropicBedrockModel as x, sanitizeGoogleThinkingPayload as y };
