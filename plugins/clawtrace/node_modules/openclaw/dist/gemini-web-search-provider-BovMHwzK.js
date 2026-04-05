import { t as DEFAULT_GOOGLE_API_BASE_URL } from "./api-BnzTE5Fb.js";
import { B as writeCachedSearchPayload, F as resolveSearchCount, I as resolveSearchTimeoutSeconds, M as readConfiguredSecretString, N as readProviderEnvValue, P as resolveSearchCacheTtlMs, T as buildUnsupportedSearchFilterResponse, X as resolveCitationRedirectUrl, d as getScopedCredentialValue, g as setScopedCredentialValue, h as setProviderWebSearchPluginConfigValue, j as readCachedSearchPayload, m as resolveProviderWebSearchPluginConfig, p as mergeScopedSearchConfig, w as buildSearchCacheKey, z as withTrustedWebSearchEndpoint } from "./provider-web-search-I-919IKa.js";
import { d as readNumberParam, h as readStringParam } from "./common-B7JFWTj2.js";
import { c as wrapWebContent } from "./external-content-YqO3ih3d.js";
import { Type } from "@sinclair/typebox";
//#region extensions/google/src/gemini-web-search-provider.ts
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_BASE = DEFAULT_GOOGLE_API_BASE_URL;
function resolveGeminiConfig(searchConfig) {
	const gemini = searchConfig?.gemini;
	return gemini && typeof gemini === "object" && !Array.isArray(gemini) ? gemini : {};
}
function resolveGeminiApiKey(gemini) {
	return readConfiguredSecretString(gemini?.apiKey, "tools.web.search.gemini.apiKey") ?? readProviderEnvValue(["GEMINI_API_KEY"]);
}
function resolveGeminiModel(gemini) {
	return (typeof gemini?.model === "string" ? gemini.model.trim() : "") || DEFAULT_GEMINI_MODEL;
}
async function runGeminiSearch(params) {
	return withTrustedWebSearchEndpoint({
		url: `${GEMINI_API_BASE}/models/${params.model}:generateContent`,
		timeoutSeconds: params.timeoutSeconds,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": params.apiKey
			},
			body: JSON.stringify({
				contents: [{ parts: [{ text: params.query }] }],
				tools: [{ google_search: {} }]
			})
		}
	}, async (res) => {
		if (!res.ok) {
			const safeDetail = (await res.text() || res.statusText).replace(/key=[^&\s]+/gi, "key=***");
			throw new Error(`Gemini API error (${res.status}): ${safeDetail}`);
		}
		let data;
		try {
			data = await res.json();
		} catch (error) {
			const safeError = String(error).replace(/key=[^&\s]+/gi, "key=***");
			throw new Error(`Gemini API returned invalid JSON: ${safeError}`, { cause: error });
		}
		if (data.error) {
			const rawMessage = data.error.message || data.error.status || "unknown";
			throw new Error(`Gemini API error (${data.error.code}): ${rawMessage.replace(/key=[^&\s]+/gi, "key=***")}`);
		}
		const candidate = data.candidates?.[0];
		const content = candidate?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n") ?? "No response";
		const rawCitations = (candidate?.groundingMetadata?.groundingChunks ?? []).filter((chunk) => chunk.web?.uri).map((chunk) => ({
			url: chunk.web.uri,
			title: chunk.web?.title || void 0
		}));
		const citations = [];
		for (let index = 0; index < rawCitations.length; index += 10) {
			const batch = rawCitations.slice(index, index + 10);
			const resolved = await Promise.all(batch.map(async (citation) => ({
				...citation,
				url: await resolveCitationRedirectUrl(citation.url)
			})));
			citations.push(...resolved);
		}
		return {
			content,
			citations
		};
	});
}
function createGeminiSchema() {
	return Type.Object({
		query: Type.String({ description: "Search query string." }),
		count: Type.Optional(Type.Number({
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		})),
		country: Type.Optional(Type.String({ description: "Not supported by Gemini." })),
		language: Type.Optional(Type.String({ description: "Not supported by Gemini." })),
		freshness: Type.Optional(Type.String({ description: "Not supported by Gemini." })),
		date_after: Type.Optional(Type.String({ description: "Not supported by Gemini." })),
		date_before: Type.Optional(Type.String({ description: "Not supported by Gemini." }))
	});
}
function createGeminiToolDefinition(searchConfig) {
	return {
		description: "Search the web using Gemini with Google Search grounding. Returns AI-synthesized answers with citations from Google Search.",
		parameters: createGeminiSchema(),
		execute: async (args) => {
			const params = args;
			const unsupportedResponse = buildUnsupportedSearchFilterResponse(params, "gemini");
			if (unsupportedResponse) return unsupportedResponse;
			const geminiConfig = resolveGeminiConfig(searchConfig);
			const apiKey = resolveGeminiApiKey(geminiConfig);
			if (!apiKey) return {
				error: "missing_gemini_api_key",
				message: "web_search (gemini) needs an API key. Set GEMINI_API_KEY in the Gateway environment, or configure tools.web.search.gemini.apiKey.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			const query = readStringParam(params, "query", { required: true });
			const count = readNumberParam(params, "count", { integer: true }) ?? searchConfig?.maxResults ?? void 0;
			const model = resolveGeminiModel(geminiConfig);
			const cacheKey = buildSearchCacheKey([
				"gemini",
				query,
				resolveSearchCount(count, 5),
				model
			]);
			const cached = readCachedSearchPayload(cacheKey);
			if (cached) return cached;
			const start = Date.now();
			const result = await runGeminiSearch({
				query,
				apiKey,
				model,
				timeoutSeconds: resolveSearchTimeoutSeconds(searchConfig)
			});
			const payload = {
				query,
				provider: "gemini",
				model,
				tookMs: Date.now() - start,
				externalContent: {
					untrusted: true,
					source: "web_search",
					provider: "gemini",
					wrapped: true
				},
				content: wrapWebContent(result.content),
				citations: result.citations
			};
			writeCachedSearchPayload(cacheKey, payload, resolveSearchCacheTtlMs(searchConfig));
			return payload;
		}
	};
}
function createGeminiWebSearchProvider() {
	return {
		id: "gemini",
		label: "Gemini (Google Search)",
		hint: "Requires Google Gemini API key · Google Search grounding",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Google Gemini API key",
		envVars: ["GEMINI_API_KEY"],
		placeholder: "AIza...",
		signupUrl: "https://aistudio.google.com/apikey",
		docsUrl: "https://docs.openclaw.ai/tools/web",
		autoDetectOrder: 20,
		credentialPath: "plugins.entries.google.config.webSearch.apiKey",
		inactiveSecretPaths: ["plugins.entries.google.config.webSearch.apiKey"],
		getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "gemini"),
		setCredentialValue: (searchConfigTarget, value) => setScopedCredentialValue(searchConfigTarget, "gemini", value),
		getConfiguredCredentialValue: (config) => resolveProviderWebSearchPluginConfig(config, "google")?.apiKey,
		setConfiguredCredentialValue: (configTarget, value) => {
			setProviderWebSearchPluginConfigValue(configTarget, "google", "apiKey", value);
		},
		createTool: (ctx) => createGeminiToolDefinition(mergeScopedSearchConfig(ctx.searchConfig, "gemini", resolveProviderWebSearchPluginConfig(ctx.config, "google")))
	};
}
//#endregion
export { createGeminiWebSearchProvider as t };
