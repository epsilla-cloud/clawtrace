import { c as normalizeResolvedSecretInputString } from "./types.secrets-Rqz2qv-w.js";
import { A as postTrustedWebToolsJson, K as resolveCacheTtlMs, U as normalizeCacheKey, W as readCache, Y as writeCache, d as getScopedCredentialValue, g as setScopedCredentialValue, h as setProviderWebSearchPluginConfigValue, m as resolveProviderWebSearchPluginConfig, n as enablePluginInConfig } from "./provider-web-search-I-919IKa.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Caby3smH.js";
import "./secret-input-CozdTJRh.js";
import { c as wrapWebContent, s as wrapExternalContent } from "./external-content-YqO3ih3d.js";
import "./security-runtime--Ku03VxI.js";
import { Type } from "@sinclair/typebox";
//#region extensions/tavily/src/config.ts
const DEFAULT_TAVILY_BASE_URL = "https://api.tavily.com";
function resolveTavilySearchConfig(cfg) {
	const pluginWebSearch = (cfg?.plugins?.entries?.tavily?.config)?.webSearch;
	if (pluginWebSearch && typeof pluginWebSearch === "object" && !Array.isArray(pluginWebSearch)) return pluginWebSearch;
}
function normalizeConfiguredSecret(value, path) {
	return normalizeSecretInput(normalizeResolvedSecretInputString({
		value,
		path
	}));
}
function resolveTavilyApiKey(cfg) {
	return normalizeConfiguredSecret(resolveTavilySearchConfig(cfg)?.apiKey, "plugins.entries.tavily.config.webSearch.apiKey") || normalizeSecretInput(process.env.TAVILY_API_KEY) || void 0;
}
function resolveTavilyBaseUrl(cfg) {
	const search = resolveTavilySearchConfig(cfg);
	return (typeof search?.baseUrl === "string" ? search.baseUrl.trim() : "") || normalizeSecretInput(process.env.TAVILY_BASE_URL) || "https://api.tavily.com";
}
function resolveTavilySearchTimeoutSeconds(override) {
	if (typeof override === "number" && Number.isFinite(override) && override > 0) return Math.floor(override);
	return 30;
}
function resolveTavilyExtractTimeoutSeconds(override) {
	if (typeof override === "number" && Number.isFinite(override) && override > 0) return Math.floor(override);
	return 60;
}
//#endregion
//#region extensions/tavily/src/tavily-client.ts
const SEARCH_CACHE = /* @__PURE__ */ new Map();
const EXTRACT_CACHE = /* @__PURE__ */ new Map();
const DEFAULT_SEARCH_COUNT = 5;
function resolveEndpoint(baseUrl, pathname) {
	const trimmed = baseUrl.trim();
	if (!trimmed) return `${DEFAULT_TAVILY_BASE_URL}${pathname}`;
	try {
		const url = new URL(trimmed);
		url.pathname = url.pathname.replace(/\/$/, "") + pathname;
		return url.toString();
	} catch {
		return `${DEFAULT_TAVILY_BASE_URL}${pathname}`;
	}
}
async function runTavilySearch(params) {
	const apiKey = resolveTavilyApiKey(params.cfg);
	if (!apiKey) throw new Error("web_search (tavily) needs a Tavily API key. Set TAVILY_API_KEY in the Gateway environment, or configure plugins.entries.tavily.config.webSearch.apiKey.");
	const count = typeof params.maxResults === "number" && Number.isFinite(params.maxResults) ? Math.max(1, Math.min(20, Math.floor(params.maxResults))) : DEFAULT_SEARCH_COUNT;
	const timeoutSeconds = resolveTavilySearchTimeoutSeconds(params.timeoutSeconds);
	const baseUrl = resolveTavilyBaseUrl(params.cfg);
	const cacheKey = normalizeCacheKey(JSON.stringify({
		type: "tavily-search",
		q: params.query,
		count,
		baseUrl,
		searchDepth: params.searchDepth,
		topic: params.topic,
		includeAnswer: params.includeAnswer,
		timeRange: params.timeRange,
		includeDomains: params.includeDomains,
		excludeDomains: params.excludeDomains
	}));
	const cached = readCache(SEARCH_CACHE, cacheKey);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const body = {
		query: params.query,
		max_results: count
	};
	if (params.searchDepth) body.search_depth = params.searchDepth;
	if (params.topic) body.topic = params.topic;
	if (params.includeAnswer) body.include_answer = true;
	if (params.timeRange) body.time_range = params.timeRange;
	if (params.includeDomains?.length) body.include_domains = params.includeDomains;
	if (params.excludeDomains?.length) body.exclude_domains = params.excludeDomains;
	const start = Date.now();
	const payload = await postTrustedWebToolsJson({
		url: resolveEndpoint(baseUrl, "/search"),
		timeoutSeconds,
		apiKey,
		body,
		errorLabel: "Tavily Search",
		extraHeaders: { "X-Client-Source": "openclaw" }
	}, async (response) => await response.json());
	const results = (Array.isArray(payload.results) ? payload.results : []).map((r) => ({
		title: typeof r.title === "string" ? wrapWebContent(r.title, "web_search") : "",
		url: typeof r.url === "string" ? r.url : "",
		snippet: typeof r.content === "string" ? wrapWebContent(r.content, "web_search") : "",
		score: typeof r.score === "number" ? r.score : void 0,
		...typeof r.published_date === "string" ? { published: r.published_date } : {}
	}));
	const result = {
		query: params.query,
		provider: "tavily",
		count: results.length,
		tookMs: Date.now() - start,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: "tavily",
			wrapped: true
		},
		results
	};
	if (typeof payload.answer === "string" && payload.answer) result.answer = wrapWebContent(payload.answer, "web_search");
	writeCache(SEARCH_CACHE, cacheKey, result, resolveCacheTtlMs(void 0, 15));
	return result;
}
async function runTavilyExtract(params) {
	const apiKey = resolveTavilyApiKey(params.cfg);
	if (!apiKey) throw new Error("tavily_extract needs a Tavily API key. Set TAVILY_API_KEY in the Gateway environment, or configure plugins.entries.tavily.config.webSearch.apiKey.");
	const baseUrl = resolveTavilyBaseUrl(params.cfg);
	const timeoutSeconds = resolveTavilyExtractTimeoutSeconds(params.timeoutSeconds);
	const cacheKey = normalizeCacheKey(JSON.stringify({
		type: "tavily-extract",
		urls: params.urls,
		baseUrl,
		query: params.query,
		extractDepth: params.extractDepth,
		chunksPerSource: params.chunksPerSource,
		includeImages: params.includeImages
	}));
	const cached = readCache(EXTRACT_CACHE, cacheKey);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const body = { urls: params.urls };
	if (params.query) body.query = params.query;
	if (params.extractDepth) body.extract_depth = params.extractDepth;
	if (params.chunksPerSource) body.chunks_per_source = params.chunksPerSource;
	if (params.includeImages) body.include_images = true;
	const start = Date.now();
	const payload = await postTrustedWebToolsJson({
		url: resolveEndpoint(baseUrl, "/extract"),
		timeoutSeconds,
		apiKey,
		body,
		errorLabel: "Tavily Extract",
		extraHeaders: { "X-Client-Source": "openclaw" }
	}, async (response) => await response.json());
	const results = (Array.isArray(payload.results) ? payload.results : []).map((r) => ({
		url: typeof r.url === "string" ? r.url : "",
		rawContent: typeof r.raw_content === "string" ? wrapExternalContent(r.raw_content, {
			source: "web_fetch",
			includeWarning: false
		}) : "",
		...typeof r.content === "string" ? { content: wrapExternalContent(r.content, {
			source: "web_fetch",
			includeWarning: false
		}) } : {},
		...Array.isArray(r.images) ? { images: r.images.map((img) => wrapExternalContent(String(img), {
			source: "web_fetch",
			includeWarning: false
		})) } : {}
	}));
	const failedResults = Array.isArray(payload.failed_results) ? payload.failed_results : [];
	const result = {
		provider: "tavily",
		count: results.length,
		tookMs: Date.now() - start,
		externalContent: {
			untrusted: true,
			source: "web_fetch",
			provider: "tavily",
			wrapped: true
		},
		results,
		...failedResults.length > 0 ? { failedResults } : {}
	};
	writeCache(EXTRACT_CACHE, cacheKey, result, resolveCacheTtlMs(void 0, 15));
	return result;
}
//#endregion
//#region extensions/tavily/src/tavily-search-provider.ts
const GenericTavilySearchSchema = Type.Object({
	query: Type.String({ description: "Search query string." }),
	count: Type.Optional(Type.Number({
		description: "Number of results to return (1-20).",
		minimum: 1,
		maximum: 20
	}))
}, { additionalProperties: false });
function createTavilyWebSearchProvider() {
	return {
		id: "tavily",
		label: "Tavily Search",
		hint: "Structured results with domain filters and AI answer summaries",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Tavily API key",
		envVars: ["TAVILY_API_KEY"],
		placeholder: "tvly-...",
		signupUrl: "https://tavily.com/",
		docsUrl: "https://docs.openclaw.ai/tools/tavily",
		autoDetectOrder: 70,
		credentialPath: "plugins.entries.tavily.config.webSearch.apiKey",
		inactiveSecretPaths: ["plugins.entries.tavily.config.webSearch.apiKey"],
		getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "tavily"),
		setCredentialValue: (searchConfigTarget, value) => setScopedCredentialValue(searchConfigTarget, "tavily", value),
		getConfiguredCredentialValue: (config) => resolveProviderWebSearchPluginConfig(config, "tavily")?.apiKey,
		setConfiguredCredentialValue: (configTarget, value) => {
			setProviderWebSearchPluginConfigValue(configTarget, "tavily", "apiKey", value);
		},
		applySelectionConfig: (config) => enablePluginInConfig(config, "tavily").config,
		createTool: (ctx) => ({
			description: "Search the web using Tavily. Returns structured results with snippets. Use tavily_search for Tavily-specific options like search depth, topic filtering, or AI answers.",
			parameters: GenericTavilySearchSchema,
			execute: async (args) => await runTavilySearch({
				cfg: ctx.config,
				query: typeof args.query === "string" ? args.query : "",
				maxResults: typeof args.count === "number" ? args.count : void 0
			})
		})
	};
}
//#endregion
export { runTavilyExtract as n, runTavilySearch as r, createTavilyWebSearchProvider as t };
