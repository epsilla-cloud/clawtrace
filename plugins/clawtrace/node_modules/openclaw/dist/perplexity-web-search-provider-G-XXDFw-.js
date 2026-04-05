import { B as writeCachedSearchPayload, D as normalizeFreshness, E as isoToPerplexityDate, F as resolveSearchCount, I as resolveSearchTimeoutSeconds, L as resolveSiteName, M as readConfiguredSecretString, N as readProviderEnvValue, O as normalizeToIsoDate, P as resolveSearchCacheTtlMs, R as throwWebSearchApiError, d as getScopedCredentialValue, g as setScopedCredentialValue, h as setProviderWebSearchPluginConfigValue, j as readCachedSearchPayload, m as resolveProviderWebSearchPluginConfig, p as mergeScopedSearchConfig, w as buildSearchCacheKey, z as withTrustedWebSearchEndpoint } from "./provider-web-search-I-919IKa.js";
import { d as readNumberParam, h as readStringParam, p as readStringArrayParam } from "./common-B7JFWTj2.js";
import { c as wrapWebContent } from "./external-content-YqO3ih3d.js";
import { Type } from "@sinclair/typebox";
//#region extensions/perplexity/src/perplexity-web-search-provider.ts
const DEFAULT_PERPLEXITY_BASE_URL = "https://openrouter.ai/api/v1";
const PERPLEXITY_DIRECT_BASE_URL = "https://api.perplexity.ai";
const PERPLEXITY_SEARCH_ENDPOINT = "https://api.perplexity.ai/search";
const DEFAULT_PERPLEXITY_MODEL = "perplexity/sonar-pro";
const PERPLEXITY_KEY_PREFIXES = ["pplx-"];
const OPENROUTER_KEY_PREFIXES = ["sk-or-"];
function resolvePerplexityConfig(searchConfig) {
	const perplexity = searchConfig?.perplexity;
	return perplexity && typeof perplexity === "object" && !Array.isArray(perplexity) ? perplexity : {};
}
function inferPerplexityBaseUrlFromApiKey(apiKey) {
	if (!apiKey) return;
	const normalized = apiKey.toLowerCase();
	if (PERPLEXITY_KEY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return "direct";
	if (OPENROUTER_KEY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return "openrouter";
}
function resolvePerplexityApiKey(perplexity) {
	const fromConfig = readConfiguredSecretString(perplexity?.apiKey, "tools.web.search.perplexity.apiKey");
	if (fromConfig) return {
		apiKey: fromConfig,
		source: "config"
	};
	const fromPerplexityEnv = readProviderEnvValue(["PERPLEXITY_API_KEY"]);
	if (fromPerplexityEnv) return {
		apiKey: fromPerplexityEnv,
		source: "perplexity_env"
	};
	const fromOpenRouterEnv = readProviderEnvValue(["OPENROUTER_API_KEY"]);
	if (fromOpenRouterEnv) return {
		apiKey: fromOpenRouterEnv,
		source: "openrouter_env"
	};
	return {
		apiKey: void 0,
		source: "none"
	};
}
function resolvePerplexityBaseUrl(perplexity, authSource = "none", configuredKey) {
	const fromConfig = typeof perplexity?.baseUrl === "string" ? perplexity.baseUrl.trim() : "";
	if (fromConfig) return fromConfig;
	if (authSource === "perplexity_env") return PERPLEXITY_DIRECT_BASE_URL;
	if (authSource === "openrouter_env") return DEFAULT_PERPLEXITY_BASE_URL;
	if (authSource === "config") return inferPerplexityBaseUrlFromApiKey(configuredKey) === "openrouter" ? DEFAULT_PERPLEXITY_BASE_URL : PERPLEXITY_DIRECT_BASE_URL;
	return DEFAULT_PERPLEXITY_BASE_URL;
}
function resolvePerplexityModel(perplexity) {
	return (typeof perplexity?.model === "string" ? perplexity.model.trim() : "") || DEFAULT_PERPLEXITY_MODEL;
}
function isDirectPerplexityBaseUrl(baseUrl) {
	try {
		return new URL(baseUrl.trim()).hostname.toLowerCase() === "api.perplexity.ai";
	} catch {
		return false;
	}
}
function resolvePerplexityRequestModel(baseUrl, model) {
	if (!isDirectPerplexityBaseUrl(baseUrl)) return model;
	return model.startsWith("perplexity/") ? model.slice(11) : model;
}
function resolvePerplexityTransport(perplexity) {
	const auth = resolvePerplexityApiKey(perplexity);
	const baseUrl = resolvePerplexityBaseUrl(perplexity, auth.source, auth.apiKey);
	const model = resolvePerplexityModel(perplexity);
	const hasLegacyOverride = Boolean(perplexity?.baseUrl && perplexity.baseUrl.trim() || perplexity?.model && perplexity.model.trim());
	return {
		...auth,
		baseUrl,
		model,
		transport: hasLegacyOverride || !isDirectPerplexityBaseUrl(baseUrl) ? "chat_completions" : "search_api"
	};
}
function extractPerplexityCitations(data) {
	const topLevel = (data.citations ?? []).filter((url) => typeof url === "string" && Boolean(url.trim()));
	if (topLevel.length > 0) return [...new Set(topLevel)];
	const citations = [];
	for (const choice of data.choices ?? []) for (const annotation of choice.message?.annotations ?? []) {
		if (annotation.type !== "url_citation") continue;
		const url = typeof annotation.url_citation?.url === "string" ? annotation.url_citation.url : typeof annotation.url === "string" ? annotation.url : void 0;
		if (url?.trim()) citations.push(url.trim());
	}
	return [...new Set(citations)];
}
async function runPerplexitySearchApi(params) {
	const body = {
		query: params.query,
		max_results: params.count
	};
	if (params.country) body.country = params.country;
	if (params.searchDomainFilter?.length) body.search_domain_filter = params.searchDomainFilter;
	if (params.searchRecencyFilter) body.search_recency_filter = params.searchRecencyFilter;
	if (params.searchLanguageFilter?.length) body.search_language_filter = params.searchLanguageFilter;
	if (params.searchAfterDate) body.search_after_date = params.searchAfterDate;
	if (params.searchBeforeDate) body.search_before_date = params.searchBeforeDate;
	if (params.maxTokens !== void 0) body.max_tokens = params.maxTokens;
	if (params.maxTokensPerPage !== void 0) body.max_tokens_per_page = params.maxTokensPerPage;
	return withTrustedWebSearchEndpoint({
		url: PERPLEXITY_SEARCH_ENDPOINT,
		timeoutSeconds: params.timeoutSeconds,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${params.apiKey}`,
				"HTTP-Referer": "https://openclaw.ai",
				"X-Title": "OpenClaw Web Search"
			},
			body: JSON.stringify(body)
		}
	}, async (res) => {
		if (!res.ok) return await throwWebSearchApiError(res, "Perplexity Search");
		return ((await res.json()).results ?? []).map((entry) => ({
			title: entry.title ? wrapWebContent(entry.title, "web_search") : "",
			url: entry.url ?? "",
			description: entry.snippet ? wrapWebContent(entry.snippet, "web_search") : "",
			published: entry.date ?? void 0,
			siteName: resolveSiteName(entry.url) || void 0
		}));
	});
}
async function runPerplexitySearch(params) {
	const endpoint = `${params.baseUrl.trim().replace(/\/$/, "")}/chat/completions`;
	const body = {
		model: resolvePerplexityRequestModel(params.baseUrl, params.model),
		messages: [{
			role: "user",
			content: params.query
		}]
	};
	if (params.freshness) body.search_recency_filter = params.freshness;
	return withTrustedWebSearchEndpoint({
		url: endpoint,
		timeoutSeconds: params.timeoutSeconds,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${params.apiKey}`,
				"HTTP-Referer": "https://openclaw.ai",
				"X-Title": "OpenClaw Web Search"
			},
			body: JSON.stringify(body)
		}
	}, async (res) => {
		if (!res.ok) return await throwWebSearchApiError(res, "Perplexity");
		const data = await res.json();
		return {
			content: data.choices?.[0]?.message?.content ?? "No response",
			citations: extractPerplexityCitations(data)
		};
	});
}
function resolveRuntimeTransport(params) {
	const perplexity = params.searchConfig?.perplexity;
	const scoped = perplexity && typeof perplexity === "object" && !Array.isArray(perplexity) ? perplexity : void 0;
	const configuredBaseUrl = typeof scoped?.baseUrl === "string" ? scoped.baseUrl.trim() : "";
	const configuredModel = typeof scoped?.model === "string" ? scoped.model.trim() : "";
	const baseUrl = (() => {
		if (configuredBaseUrl) return configuredBaseUrl;
		if (params.keySource === "env") {
			if (params.fallbackEnvVar === "PERPLEXITY_API_KEY") return PERPLEXITY_DIRECT_BASE_URL;
			if (params.fallbackEnvVar === "OPENROUTER_API_KEY") return DEFAULT_PERPLEXITY_BASE_URL;
		}
		if ((params.keySource === "config" || params.keySource === "secretRef") && params.resolvedKey) return inferPerplexityBaseUrlFromApiKey(params.resolvedKey) === "openrouter" ? DEFAULT_PERPLEXITY_BASE_URL : PERPLEXITY_DIRECT_BASE_URL;
		return DEFAULT_PERPLEXITY_BASE_URL;
	})();
	return configuredBaseUrl || configuredModel || !isDirectPerplexityBaseUrl(baseUrl) ? "chat_completions" : "search_api";
}
function createPerplexitySchema(transport) {
	const querySchema = {
		query: Type.String({ description: "Search query string." }),
		count: Type.Optional(Type.Number({
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		})),
		freshness: Type.Optional(Type.String({ description: "Filter by time: 'day' (24h), 'week', 'month', or 'year'." }))
	};
	if (transport === "chat_completions") return Type.Object(querySchema);
	return Type.Object({
		...querySchema,
		country: Type.Optional(Type.String({ description: "Native Perplexity Search API only. 2-letter country code." })),
		language: Type.Optional(Type.String({ description: "Native Perplexity Search API only. ISO 639-1 language code." })),
		date_after: Type.Optional(Type.String({ description: "Native Perplexity Search API only. Only results published after this date (YYYY-MM-DD)." })),
		date_before: Type.Optional(Type.String({ description: "Native Perplexity Search API only. Only results published before this date (YYYY-MM-DD)." })),
		domain_filter: Type.Optional(Type.Array(Type.String(), { description: "Native Perplexity Search API only. Domain filter (max 20)." })),
		max_tokens: Type.Optional(Type.Number({
			description: "Native Perplexity Search API only. Total content budget across all results.",
			minimum: 1,
			maximum: 1e6
		})),
		max_tokens_per_page: Type.Optional(Type.Number({
			description: "Native Perplexity Search API only. Max tokens extracted per page.",
			minimum: 1
		}))
	});
}
function createPerplexityToolDefinition(searchConfig, runtimeTransport) {
	const perplexityConfig = resolvePerplexityConfig(searchConfig);
	const schemaTransport = runtimeTransport ?? (perplexityConfig.baseUrl || perplexityConfig.model ? "chat_completions" : void 0);
	return {
		description: schemaTransport === "chat_completions" ? "Search the web using Perplexity Sonar via Perplexity/OpenRouter chat completions. Returns AI-synthesized answers with citations from web-grounded search." : "Search the web using Perplexity. Runtime routing decides between native Search API and Sonar chat-completions compatibility. Structured filters are available on the native Search API path.",
		parameters: createPerplexitySchema(schemaTransport),
		execute: async (args) => {
			const runtime = resolvePerplexityTransport(perplexityConfig);
			if (!runtime.apiKey) return {
				error: "missing_perplexity_api_key",
				message: "web_search (perplexity) needs an API key. Set PERPLEXITY_API_KEY or OPENROUTER_API_KEY in the Gateway environment, or configure tools.web.search.perplexity.apiKey.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			const params = args;
			const query = readStringParam(params, "query", { required: true });
			const count = readNumberParam(params, "count", { integer: true }) ?? searchConfig?.maxResults ?? void 0;
			const rawFreshness = readStringParam(params, "freshness");
			const freshness = rawFreshness ? normalizeFreshness(rawFreshness, "perplexity") : void 0;
			if (rawFreshness && !freshness) return {
				error: "invalid_freshness",
				message: "freshness must be day, week, month, or year.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			const structured = runtime.transport === "search_api";
			const country = readStringParam(params, "country");
			const language = readStringParam(params, "language");
			const rawDateAfter = readStringParam(params, "date_after");
			const rawDateBefore = readStringParam(params, "date_before");
			const domainFilter = readStringArrayParam(params, "domain_filter");
			const maxTokens = readNumberParam(params, "max_tokens", { integer: true });
			const maxTokensPerPage = readNumberParam(params, "max_tokens_per_page", { integer: true });
			if (!structured) {
				if (country) return {
					error: "unsupported_country",
					message: "country filtering is only supported by the native Perplexity Search API path. Remove Perplexity baseUrl/model overrides or use a direct PERPLEXITY_API_KEY to enable it.",
					docs: "https://docs.openclaw.ai/tools/web"
				};
				if (language) return {
					error: "unsupported_language",
					message: "language filtering is only supported by the native Perplexity Search API path. Remove Perplexity baseUrl/model overrides or use a direct PERPLEXITY_API_KEY to enable it.",
					docs: "https://docs.openclaw.ai/tools/web"
				};
				if (rawDateAfter || rawDateBefore) return {
					error: "unsupported_date_filter",
					message: "date_after/date_before are only supported by the native Perplexity Search API path. Remove Perplexity baseUrl/model overrides or use a direct PERPLEXITY_API_KEY to enable them.",
					docs: "https://docs.openclaw.ai/tools/web"
				};
				if (domainFilter?.length) return {
					error: "unsupported_domain_filter",
					message: "domain_filter is only supported by the native Perplexity Search API path. Remove Perplexity baseUrl/model overrides or use a direct PERPLEXITY_API_KEY to enable it.",
					docs: "https://docs.openclaw.ai/tools/web"
				};
				if (maxTokens !== void 0 || maxTokensPerPage !== void 0) return {
					error: "unsupported_content_budget",
					message: "max_tokens and max_tokens_per_page are only supported by the native Perplexity Search API path. Remove Perplexity baseUrl/model overrides or use a direct PERPLEXITY_API_KEY to enable them.",
					docs: "https://docs.openclaw.ai/tools/web"
				};
			}
			if (language && !/^[a-z]{2}$/i.test(language)) return {
				error: "invalid_language",
				message: "language must be a 2-letter ISO 639-1 code like 'en', 'de', or 'fr'.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			if (rawFreshness && (rawDateAfter || rawDateBefore)) return {
				error: "conflicting_time_filters",
				message: "freshness and date_after/date_before cannot be used together. Use either freshness (day/week/month/year) or a date range (date_after/date_before), not both.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			const dateAfter = rawDateAfter ? normalizeToIsoDate(rawDateAfter) : void 0;
			const dateBefore = rawDateBefore ? normalizeToIsoDate(rawDateBefore) : void 0;
			if (rawDateAfter && !dateAfter) return {
				error: "invalid_date",
				message: "date_after must be YYYY-MM-DD format.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			if (rawDateBefore && !dateBefore) return {
				error: "invalid_date",
				message: "date_before must be YYYY-MM-DD format.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			if (dateAfter && dateBefore && dateAfter > dateBefore) return {
				error: "invalid_date_range",
				message: "date_after must be before date_before.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			if (domainFilter?.length) {
				const hasDeny = domainFilter.some((entry) => entry.startsWith("-"));
				const hasAllow = domainFilter.some((entry) => !entry.startsWith("-"));
				if (hasDeny && hasAllow) return {
					error: "invalid_domain_filter",
					message: "domain_filter cannot mix allowlist and denylist entries. Use either all positive entries (allowlist) or all entries prefixed with '-' (denylist).",
					docs: "https://docs.openclaw.ai/tools/web"
				};
				if (domainFilter.length > 20) return {
					error: "invalid_domain_filter",
					message: "domain_filter supports a maximum of 20 domains.",
					docs: "https://docs.openclaw.ai/tools/web"
				};
			}
			const cacheKey = buildSearchCacheKey([
				"perplexity",
				runtime.transport,
				runtime.baseUrl,
				runtime.model,
				query,
				resolveSearchCount(count, 5),
				country,
				language,
				freshness,
				dateAfter,
				dateBefore,
				domainFilter?.join(","),
				maxTokens,
				maxTokensPerPage
			]);
			const cached = readCachedSearchPayload(cacheKey);
			if (cached) return cached;
			const start = Date.now();
			const timeoutSeconds = resolveSearchTimeoutSeconds(searchConfig);
			const payload = runtime.transport === "chat_completions" ? {
				query,
				provider: "perplexity",
				model: runtime.model,
				tookMs: Date.now() - start,
				externalContent: {
					untrusted: true,
					source: "web_search",
					provider: "perplexity",
					wrapped: true
				},
				...await (async () => {
					const result = await runPerplexitySearch({
						query,
						apiKey: runtime.apiKey,
						baseUrl: runtime.baseUrl,
						model: runtime.model,
						timeoutSeconds,
						freshness
					});
					return {
						content: wrapWebContent(result.content, "web_search"),
						citations: result.citations
					};
				})()
			} : {
				query,
				provider: "perplexity",
				count: 0,
				tookMs: Date.now() - start,
				externalContent: {
					untrusted: true,
					source: "web_search",
					provider: "perplexity",
					wrapped: true
				},
				results: await runPerplexitySearchApi({
					query,
					apiKey: runtime.apiKey,
					count: resolveSearchCount(count, 5),
					timeoutSeconds,
					country: country ?? void 0,
					searchDomainFilter: domainFilter,
					searchRecencyFilter: freshness,
					searchLanguageFilter: language ? [language] : void 0,
					searchAfterDate: dateAfter ? isoToPerplexityDate(dateAfter) : void 0,
					searchBeforeDate: dateBefore ? isoToPerplexityDate(dateBefore) : void 0,
					maxTokens: maxTokens ?? void 0,
					maxTokensPerPage: maxTokensPerPage ?? void 0
				})
			};
			if (Array.isArray(payload.results)) {
				payload.count = payload.results.length;
				payload.tookMs = Date.now() - start;
			} else payload.tookMs = Date.now() - start;
			writeCachedSearchPayload(cacheKey, payload, resolveSearchCacheTtlMs(searchConfig));
			return payload;
		}
	};
}
function createPerplexityWebSearchProvider() {
	return {
		id: "perplexity",
		label: "Perplexity Search",
		hint: "Requires Perplexity API key or OpenRouter API key · structured results",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Perplexity API key",
		envVars: ["PERPLEXITY_API_KEY", "OPENROUTER_API_KEY"],
		placeholder: "pplx-...",
		signupUrl: "https://www.perplexity.ai/settings/api",
		docsUrl: "https://docs.openclaw.ai/perplexity",
		autoDetectOrder: 50,
		credentialPath: "plugins.entries.perplexity.config.webSearch.apiKey",
		inactiveSecretPaths: ["plugins.entries.perplexity.config.webSearch.apiKey"],
		getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "perplexity"),
		setCredentialValue: (searchConfigTarget, value) => setScopedCredentialValue(searchConfigTarget, "perplexity", value),
		getConfiguredCredentialValue: (config) => resolveProviderWebSearchPluginConfig(config, "perplexity")?.apiKey,
		setConfiguredCredentialValue: (configTarget, value) => {
			setProviderWebSearchPluginConfigValue(configTarget, "perplexity", "apiKey", value);
		},
		resolveRuntimeMetadata: (ctx) => ({ perplexityTransport: resolveRuntimeTransport({
			searchConfig: mergeScopedSearchConfig(ctx.searchConfig, "perplexity", resolveProviderWebSearchPluginConfig(ctx.config, "perplexity")),
			resolvedKey: ctx.resolvedCredential?.value,
			keySource: ctx.resolvedCredential?.source ?? "missing",
			fallbackEnvVar: ctx.resolvedCredential?.fallbackEnvVar
		}) }),
		createTool: (ctx) => createPerplexityToolDefinition(mergeScopedSearchConfig(ctx.searchConfig, "perplexity", resolveProviderWebSearchPluginConfig(ctx.config, "perplexity")), ctx.runtimeMetadata?.perplexityTransport)
	};
}
const __testing = {
	inferPerplexityBaseUrlFromApiKey,
	resolvePerplexityBaseUrl,
	resolvePerplexityModel,
	resolvePerplexityTransport,
	isDirectPerplexityBaseUrl,
	resolvePerplexityRequestModel,
	resolvePerplexityApiKey,
	normalizeToIsoDate,
	isoToPerplexityDate
};
//#endregion
export { createPerplexityWebSearchProvider as n, __testing as t };
