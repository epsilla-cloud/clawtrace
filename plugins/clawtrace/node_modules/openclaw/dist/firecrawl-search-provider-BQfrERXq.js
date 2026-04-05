import { c as normalizeResolvedSecretInputString } from "./types.secrets-Rqz2qv-w.js";
import { A as postTrustedWebToolsJson, K as resolveCacheTtlMs, U as normalizeCacheKey, W as readCache, Y as writeCache, c as markdownToText, d as getScopedCredentialValue, g as setScopedCredentialValue, h as setProviderWebSearchPluginConfigValue, l as truncateText, m as resolveProviderWebSearchPluginConfig, n as enablePluginInConfig } from "./provider-web-search-I-919IKa.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Caby3smH.js";
import "./secret-input-CozdTJRh.js";
import { c as wrapWebContent, s as wrapExternalContent } from "./external-content-YqO3ih3d.js";
import "./security-runtime--Ku03VxI.js";
import { Type } from "@sinclair/typebox";
const DEFAULT_FIRECRAWL_MAX_AGE_MS = 1728e5;
function resolveSearchConfig(cfg) {
	const search = cfg?.tools?.web?.search;
	if (!search || typeof search !== "object") return;
	return search;
}
function resolveFetchConfig(cfg) {
	const fetch = cfg?.tools?.web?.fetch;
	if (!fetch || typeof fetch !== "object") return;
	return fetch;
}
function resolveFirecrawlSearchConfig(cfg) {
	const pluginWebSearch = (cfg?.plugins?.entries?.firecrawl?.config)?.webSearch;
	if (pluginWebSearch && typeof pluginWebSearch === "object" && !Array.isArray(pluginWebSearch)) return pluginWebSearch;
	const search = resolveSearchConfig(cfg);
	if (!search || typeof search !== "object") return;
	const firecrawl = "firecrawl" in search ? search.firecrawl : void 0;
	if (!firecrawl || typeof firecrawl !== "object") return;
	return firecrawl;
}
function resolveFirecrawlFetchConfig(cfg) {
	const fetch = resolveFetchConfig(cfg);
	if (!fetch || typeof fetch !== "object") return;
	const firecrawl = "firecrawl" in fetch ? fetch.firecrawl : void 0;
	if (!firecrawl || typeof firecrawl !== "object") return;
	return firecrawl;
}
function normalizeConfiguredSecret(value, path) {
	return normalizeSecretInput(normalizeResolvedSecretInputString({
		value,
		path
	}));
}
function resolveFirecrawlApiKey(cfg) {
	const search = resolveFirecrawlSearchConfig(cfg);
	const fetch = resolveFirecrawlFetchConfig(cfg);
	return normalizeConfiguredSecret(search?.apiKey, "plugins.entries.firecrawl.config.webSearch.apiKey") || normalizeConfiguredSecret(search?.apiKey, "tools.web.search.firecrawl.apiKey") || normalizeConfiguredSecret(fetch?.apiKey, "tools.web.fetch.firecrawl.apiKey") || normalizeSecretInput(process.env.FIRECRAWL_API_KEY) || void 0;
}
function resolveFirecrawlBaseUrl(cfg) {
	const search = resolveFirecrawlSearchConfig(cfg);
	const fetch = resolveFirecrawlFetchConfig(cfg);
	return (typeof search?.baseUrl === "string" ? search.baseUrl.trim() : "") || (typeof fetch?.baseUrl === "string" ? fetch.baseUrl.trim() : "") || normalizeSecretInput(process.env.FIRECRAWL_BASE_URL) || "https://api.firecrawl.dev";
}
function resolveFirecrawlOnlyMainContent(cfg, override) {
	if (typeof override === "boolean") return override;
	const fetch = resolveFirecrawlFetchConfig(cfg);
	if (typeof fetch?.onlyMainContent === "boolean") return fetch.onlyMainContent;
	return true;
}
function resolveFirecrawlMaxAgeMs(cfg, override) {
	if (typeof override === "number" && Number.isFinite(override) && override >= 0) return Math.floor(override);
	const fetch = resolveFirecrawlFetchConfig(cfg);
	if (typeof fetch?.maxAgeMs === "number" && Number.isFinite(fetch.maxAgeMs) && fetch.maxAgeMs >= 0) return Math.floor(fetch.maxAgeMs);
	return DEFAULT_FIRECRAWL_MAX_AGE_MS;
}
function resolveFirecrawlScrapeTimeoutSeconds(cfg, override) {
	if (typeof override === "number" && Number.isFinite(override) && override > 0) return Math.floor(override);
	const fetch = resolveFirecrawlFetchConfig(cfg);
	if (typeof fetch?.timeoutSeconds === "number" && Number.isFinite(fetch.timeoutSeconds) && fetch.timeoutSeconds > 0) return Math.floor(fetch.timeoutSeconds);
	return 60;
}
function resolveFirecrawlSearchTimeoutSeconds(override) {
	if (typeof override === "number" && Number.isFinite(override) && override > 0) return Math.floor(override);
	return 30;
}
//#endregion
//#region extensions/firecrawl/src/firecrawl-client.ts
const SEARCH_CACHE = /* @__PURE__ */ new Map();
const SCRAPE_CACHE = /* @__PURE__ */ new Map();
const DEFAULT_SEARCH_COUNT = 5;
const DEFAULT_SCRAPE_MAX_CHARS = 5e4;
function resolveEndpoint(baseUrl, pathname) {
	const trimmed = baseUrl.trim();
	if (!trimmed) return new URL(pathname, "https://api.firecrawl.dev").toString();
	try {
		const url = new URL(trimmed);
		if (url.pathname && url.pathname !== "/") return url.toString();
		url.pathname = pathname;
		return url.toString();
	} catch {
		return new URL(pathname, "https://api.firecrawl.dev").toString();
	}
}
function resolveSiteName(urlRaw) {
	try {
		return new URL(urlRaw).hostname.replace(/^www\./, "") || void 0;
	} catch {
		return;
	}
}
function resolveSearchItems(payload) {
	const rawItems = [
		payload.data,
		payload.results,
		payload.data?.results,
		payload.data?.data,
		payload.data?.web,
		payload.web?.results
	].find((candidate) => Array.isArray(candidate));
	if (!Array.isArray(rawItems)) return [];
	const items = [];
	for (const entry of rawItems) {
		if (!entry || typeof entry !== "object") continue;
		const record = entry;
		const metadata = record.metadata && typeof record.metadata === "object" ? record.metadata : void 0;
		const url = typeof record.url === "string" && record.url || typeof record.sourceURL === "string" && record.sourceURL || typeof record.sourceUrl === "string" && record.sourceUrl || typeof metadata?.sourceURL === "string" && metadata.sourceURL || "";
		if (!url) continue;
		const title = typeof record.title === "string" && record.title || typeof metadata?.title === "string" && metadata.title || "";
		const description = typeof record.description === "string" && record.description || typeof record.snippet === "string" && record.snippet || typeof record.summary === "string" && record.summary || void 0;
		const content = typeof record.markdown === "string" && record.markdown || typeof record.content === "string" && record.content || typeof record.text === "string" && record.text || void 0;
		const published = typeof record.publishedDate === "string" && record.publishedDate || typeof record.published === "string" && record.published || typeof metadata?.publishedTime === "string" && metadata.publishedTime || typeof metadata?.publishedDate === "string" && metadata.publishedDate || void 0;
		items.push({
			title,
			url,
			description,
			content,
			published,
			siteName: resolveSiteName(url)
		});
	}
	return items;
}
function buildSearchPayload(params) {
	return {
		query: params.query,
		provider: params.provider,
		count: params.items.length,
		tookMs: params.tookMs,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: params.provider,
			wrapped: true
		},
		results: params.items.map((entry) => ({
			title: entry.title ? wrapWebContent(entry.title, "web_search") : "",
			url: entry.url,
			description: entry.description ? wrapWebContent(entry.description, "web_search") : "",
			...entry.published ? { published: entry.published } : {},
			...entry.siteName ? { siteName: entry.siteName } : {},
			...params.scrapeResults && entry.content ? { content: wrapWebContent(entry.content, "web_search") } : {}
		}))
	};
}
async function runFirecrawlSearch(params) {
	const apiKey = resolveFirecrawlApiKey(params.cfg);
	if (!apiKey) throw new Error("web_search (firecrawl) needs a Firecrawl API key. Set FIRECRAWL_API_KEY in the Gateway environment, or configure plugins.entries.firecrawl.config.webSearch.apiKey.");
	const count = typeof params.count === "number" && Number.isFinite(params.count) ? Math.max(1, Math.min(10, Math.floor(params.count))) : DEFAULT_SEARCH_COUNT;
	const timeoutSeconds = resolveFirecrawlSearchTimeoutSeconds(params.timeoutSeconds);
	const scrapeResults = params.scrapeResults === true;
	const sources = Array.isArray(params.sources) ? params.sources.filter(Boolean) : [];
	const categories = Array.isArray(params.categories) ? params.categories.filter(Boolean) : [];
	const baseUrl = resolveFirecrawlBaseUrl(params.cfg);
	const cacheKey = normalizeCacheKey(JSON.stringify({
		type: "firecrawl-search",
		q: params.query,
		count,
		baseUrl,
		sources,
		categories,
		scrapeResults
	}));
	const cached = readCache(SEARCH_CACHE, cacheKey);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const body = {
		query: params.query,
		limit: count
	};
	if (sources.length > 0) body.sources = sources;
	if (categories.length > 0) body.categories = categories;
	if (scrapeResults) body.scrapeOptions = { formats: ["markdown"] };
	const start = Date.now();
	const payload = await postTrustedWebToolsJson({
		url: resolveEndpoint(baseUrl, "/v2/search"),
		timeoutSeconds,
		apiKey,
		body,
		errorLabel: "Firecrawl Search"
	}, async (response) => {
		const payload = await response.json();
		if (payload.success === false) {
			const error = typeof payload.error === "string" ? payload.error : typeof payload.message === "string" ? payload.message : "unknown error";
			throw new Error(`Firecrawl Search API error: ${error}`);
		}
		return payload;
	});
	const result = buildSearchPayload({
		query: params.query,
		provider: "firecrawl",
		items: resolveSearchItems(payload),
		tookMs: Date.now() - start,
		scrapeResults
	});
	writeCache(SEARCH_CACHE, cacheKey, result, resolveCacheTtlMs(void 0, 15));
	return result;
}
function resolveScrapeData(payload) {
	const data = payload.data;
	if (data && typeof data === "object") return data;
	return {};
}
function parseFirecrawlScrapePayload(params) {
	const data = resolveScrapeData(params.payload);
	const metadata = data.metadata && typeof data.metadata === "object" ? data.metadata : void 0;
	const markdown = typeof data.markdown === "string" && data.markdown || typeof data.content === "string" && data.content || "";
	if (!markdown) throw new Error("Firecrawl scrape returned no content.");
	const rawText = params.extractMode === "text" ? markdownToText(markdown) : markdown;
	const truncated = truncateText(rawText, params.maxChars);
	return {
		url: params.url,
		finalUrl: typeof metadata?.sourceURL === "string" && metadata.sourceURL || typeof data.url === "string" && data.url || params.url,
		status: typeof metadata?.statusCode === "number" && metadata.statusCode || typeof data.statusCode === "number" && data.statusCode || void 0,
		title: typeof metadata?.title === "string" && metadata.title ? wrapExternalContent(metadata.title, {
			source: "web_fetch",
			includeWarning: false
		}) : void 0,
		extractor: "firecrawl",
		extractMode: params.extractMode,
		externalContent: {
			untrusted: true,
			source: "web_fetch",
			wrapped: true
		},
		truncated: truncated.truncated,
		rawLength: rawText.length,
		wrappedLength: wrapExternalContent(truncated.text, {
			source: "web_fetch",
			includeWarning: false
		}).length,
		text: wrapExternalContent(truncated.text, {
			source: "web_fetch",
			includeWarning: false
		}),
		warning: typeof params.payload.warning === "string" && params.payload.warning ? wrapExternalContent(params.payload.warning, {
			source: "web_fetch",
			includeWarning: false
		}) : void 0
	};
}
async function runFirecrawlScrape(params) {
	const apiKey = resolveFirecrawlApiKey(params.cfg);
	if (!apiKey) throw new Error("firecrawl_scrape needs a Firecrawl API key. Set FIRECRAWL_API_KEY in the Gateway environment, or configure tools.web.fetch.firecrawl.apiKey.");
	const baseUrl = resolveFirecrawlBaseUrl(params.cfg);
	const timeoutSeconds = resolveFirecrawlScrapeTimeoutSeconds(params.cfg, params.timeoutSeconds);
	const onlyMainContent = resolveFirecrawlOnlyMainContent(params.cfg, params.onlyMainContent);
	const maxAgeMs = resolveFirecrawlMaxAgeMs(params.cfg, params.maxAgeMs);
	const proxy = params.proxy ?? "auto";
	const storeInCache = params.storeInCache ?? true;
	const maxChars = typeof params.maxChars === "number" && Number.isFinite(params.maxChars) && params.maxChars > 0 ? Math.floor(params.maxChars) : DEFAULT_SCRAPE_MAX_CHARS;
	const cacheKey = normalizeCacheKey(JSON.stringify({
		type: "firecrawl-scrape",
		url: params.url,
		extractMode: params.extractMode,
		baseUrl,
		onlyMainContent,
		maxAgeMs,
		proxy,
		storeInCache,
		maxChars
	}));
	const cached = readCache(SCRAPE_CACHE, cacheKey);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const result = parseFirecrawlScrapePayload({
		payload: await postTrustedWebToolsJson({
			url: resolveEndpoint(baseUrl, "/v2/scrape"),
			timeoutSeconds,
			apiKey,
			errorLabel: "Firecrawl",
			body: {
				url: params.url,
				formats: ["markdown"],
				onlyMainContent,
				timeout: timeoutSeconds * 1e3,
				maxAge: maxAgeMs,
				proxy,
				storeInCache
			}
		}, async (response) => await response.json()),
		url: params.url,
		extractMode: params.extractMode,
		maxChars
	});
	writeCache(SCRAPE_CACHE, cacheKey, result, resolveCacheTtlMs(void 0, 15));
	return result;
}
//#endregion
//#region extensions/firecrawl/src/firecrawl-search-provider.ts
const GenericFirecrawlSearchSchema = Type.Object({
	query: Type.String({ description: "Search query string." }),
	count: Type.Optional(Type.Number({
		description: "Number of results to return (1-10).",
		minimum: 1,
		maximum: 10
	}))
}, { additionalProperties: false });
function createFirecrawlWebSearchProvider() {
	return {
		id: "firecrawl",
		label: "Firecrawl Search",
		hint: "Structured results with optional result scraping",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Firecrawl API key",
		envVars: ["FIRECRAWL_API_KEY"],
		placeholder: "fc-...",
		signupUrl: "https://www.firecrawl.dev/",
		docsUrl: "https://docs.openclaw.ai/tools/firecrawl",
		autoDetectOrder: 60,
		credentialPath: "plugins.entries.firecrawl.config.webSearch.apiKey",
		inactiveSecretPaths: ["plugins.entries.firecrawl.config.webSearch.apiKey"],
		getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "firecrawl"),
		setCredentialValue: (searchConfigTarget, value) => setScopedCredentialValue(searchConfigTarget, "firecrawl", value),
		getConfiguredCredentialValue: (config) => resolveProviderWebSearchPluginConfig(config, "firecrawl")?.apiKey,
		setConfiguredCredentialValue: (configTarget, value) => {
			setProviderWebSearchPluginConfigValue(configTarget, "firecrawl", "apiKey", value);
		},
		applySelectionConfig: (config) => enablePluginInConfig(config, "firecrawl").config,
		createTool: (ctx) => ({
			description: "Search the web using Firecrawl. Returns structured results with snippets from Firecrawl Search. Use firecrawl_search for Firecrawl-specific knobs like sources or categories.",
			parameters: GenericFirecrawlSearchSchema,
			execute: async (args) => await runFirecrawlSearch({
				cfg: ctx.config,
				query: typeof args.query === "string" ? args.query : "",
				count: typeof args.count === "number" ? args.count : void 0
			})
		})
	};
}
//#endregion
export { runFirecrawlScrape as n, runFirecrawlSearch as r, createFirecrawlWebSearchProvider as t };
