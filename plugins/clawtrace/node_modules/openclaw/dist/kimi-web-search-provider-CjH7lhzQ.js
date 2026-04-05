import { B as writeCachedSearchPayload, F as resolveSearchCount, I as resolveSearchTimeoutSeconds, M as readConfiguredSecretString, N as readProviderEnvValue, P as resolveSearchCacheTtlMs, T as buildUnsupportedSearchFilterResponse, d as getScopedCredentialValue, g as setScopedCredentialValue, h as setProviderWebSearchPluginConfigValue, j as readCachedSearchPayload, m as resolveProviderWebSearchPluginConfig, p as mergeScopedSearchConfig, w as buildSearchCacheKey, z as withTrustedWebSearchEndpoint } from "./provider-web-search-I-919IKa.js";
import { d as readNumberParam, h as readStringParam } from "./common-B7JFWTj2.js";
import { c as wrapWebContent } from "./external-content-YqO3ih3d.js";
import { Type } from "@sinclair/typebox";
//#region extensions/moonshot/src/kimi-web-search-provider.ts
const DEFAULT_KIMI_BASE_URL = "https://api.moonshot.ai/v1";
const DEFAULT_KIMI_MODEL = "moonshot-v1-128k";
const KIMI_WEB_SEARCH_TOOL = {
	type: "builtin_function",
	function: { name: "$web_search" }
};
function resolveKimiConfig(searchConfig) {
	const kimi = searchConfig?.kimi;
	return kimi && typeof kimi === "object" && !Array.isArray(kimi) ? kimi : {};
}
function resolveKimiApiKey(kimi) {
	return readConfiguredSecretString(kimi?.apiKey, "tools.web.search.kimi.apiKey") ?? readProviderEnvValue(["KIMI_API_KEY", "MOONSHOT_API_KEY"]);
}
function resolveKimiModel(kimi) {
	return (typeof kimi?.model === "string" ? kimi.model.trim() : "") || DEFAULT_KIMI_MODEL;
}
function resolveKimiBaseUrl(kimi) {
	return (typeof kimi?.baseUrl === "string" ? kimi.baseUrl.trim() : "") || DEFAULT_KIMI_BASE_URL;
}
function extractKimiMessageText(message) {
	const content = message?.content?.trim();
	if (content) return content;
	return message?.reasoning_content?.trim() || void 0;
}
function extractKimiCitations(data) {
	const citations = (data.search_results ?? []).map((entry) => entry.url?.trim()).filter((url) => Boolean(url));
	for (const toolCall of data.choices?.[0]?.message?.tool_calls ?? []) {
		const rawArguments = toolCall.function?.arguments;
		if (!rawArguments) continue;
		try {
			const parsed = JSON.parse(rawArguments);
			if (typeof parsed.url === "string" && parsed.url.trim()) citations.push(parsed.url.trim());
			for (const result of parsed.search_results ?? []) if (typeof result.url === "string" && result.url.trim()) citations.push(result.url.trim());
		} catch {}
	}
	return [...new Set(citations)];
}
function buildKimiToolResultContent(data) {
	return JSON.stringify({ search_results: (data.search_results ?? []).map((entry) => ({
		title: entry.title ?? "",
		url: entry.url ?? "",
		content: entry.content ?? ""
	})) });
}
async function runKimiSearch(params) {
	const endpoint = `${params.baseUrl.trim().replace(/\/$/, "")}/chat/completions`;
	const messages = [{
		role: "user",
		content: params.query
	}];
	const collectedCitations = /* @__PURE__ */ new Set();
	for (let round = 0; round < 3; round += 1) {
		const next = await withTrustedWebSearchEndpoint({
			url: endpoint,
			timeoutSeconds: params.timeoutSeconds,
			init: {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${params.apiKey}`
				},
				body: JSON.stringify({
					model: params.model,
					messages,
					tools: [KIMI_WEB_SEARCH_TOOL]
				})
			}
		}, async (res) => {
			if (!res.ok) {
				const detail = await res.text();
				throw new Error(`Kimi API error (${res.status}): ${detail || res.statusText}`);
			}
			const data = await res.json();
			for (const citation of extractKimiCitations(data)) collectedCitations.add(citation);
			const choice = data.choices?.[0];
			const message = choice?.message;
			const text = extractKimiMessageText(message);
			const toolCalls = message?.tool_calls ?? [];
			if (choice?.finish_reason !== "tool_calls" || toolCalls.length === 0) return {
				done: true,
				content: text ?? "No response",
				citations: [...collectedCitations]
			};
			messages.push({
				role: "assistant",
				content: message?.content ?? "",
				...message?.reasoning_content ? { reasoning_content: message.reasoning_content } : {},
				tool_calls: toolCalls
			});
			const toolContent = buildKimiToolResultContent(data);
			let pushed = false;
			for (const toolCall of toolCalls) {
				const toolCallId = toolCall.id?.trim();
				if (!toolCallId) continue;
				pushed = true;
				messages.push({
					role: "tool",
					tool_call_id: toolCallId,
					content: toolContent
				});
			}
			if (!pushed) return {
				done: true,
				content: text ?? "No response",
				citations: [...collectedCitations]
			};
			return { done: false };
		});
		if (next.done) return {
			content: next.content,
			citations: next.citations
		};
	}
	return {
		content: "Search completed but no final answer was produced.",
		citations: [...collectedCitations]
	};
}
function createKimiSchema() {
	return Type.Object({
		query: Type.String({ description: "Search query string." }),
		count: Type.Optional(Type.Number({
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		})),
		country: Type.Optional(Type.String({ description: "Not supported by Kimi." })),
		language: Type.Optional(Type.String({ description: "Not supported by Kimi." })),
		freshness: Type.Optional(Type.String({ description: "Not supported by Kimi." })),
		date_after: Type.Optional(Type.String({ description: "Not supported by Kimi." })),
		date_before: Type.Optional(Type.String({ description: "Not supported by Kimi." }))
	});
}
function createKimiToolDefinition(searchConfig) {
	return {
		description: "Search the web using Kimi by Moonshot. Returns AI-synthesized answers with citations from native $web_search.",
		parameters: createKimiSchema(),
		execute: async (args) => {
			const params = args;
			const unsupportedResponse = buildUnsupportedSearchFilterResponse(params, "kimi");
			if (unsupportedResponse) return unsupportedResponse;
			const kimiConfig = resolveKimiConfig(searchConfig);
			const apiKey = resolveKimiApiKey(kimiConfig);
			if (!apiKey) return {
				error: "missing_kimi_api_key",
				message: "web_search (kimi) needs a Moonshot API key. Set KIMI_API_KEY or MOONSHOT_API_KEY in the Gateway environment, or configure tools.web.search.kimi.apiKey.",
				docs: "https://docs.openclaw.ai/tools/web"
			};
			const query = readStringParam(params, "query", { required: true });
			const count = readNumberParam(params, "count", { integer: true }) ?? searchConfig?.maxResults ?? void 0;
			const model = resolveKimiModel(kimiConfig);
			const baseUrl = resolveKimiBaseUrl(kimiConfig);
			const cacheKey = buildSearchCacheKey([
				"kimi",
				query,
				resolveSearchCount(count, 5),
				baseUrl,
				model
			]);
			const cached = readCachedSearchPayload(cacheKey);
			if (cached) return cached;
			const start = Date.now();
			const result = await runKimiSearch({
				query,
				apiKey,
				baseUrl,
				model,
				timeoutSeconds: resolveSearchTimeoutSeconds(searchConfig)
			});
			const payload = {
				query,
				provider: "kimi",
				model,
				tookMs: Date.now() - start,
				externalContent: {
					untrusted: true,
					source: "web_search",
					provider: "kimi",
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
function createKimiWebSearchProvider() {
	return {
		id: "kimi",
		label: "Kimi (Moonshot)",
		hint: "Requires Moonshot / Kimi API key · Moonshot web search",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Moonshot / Kimi API key",
		envVars: ["KIMI_API_KEY", "MOONSHOT_API_KEY"],
		placeholder: "sk-...",
		signupUrl: "https://platform.moonshot.cn/",
		docsUrl: "https://docs.openclaw.ai/tools/web",
		autoDetectOrder: 40,
		credentialPath: "plugins.entries.moonshot.config.webSearch.apiKey",
		inactiveSecretPaths: ["plugins.entries.moonshot.config.webSearch.apiKey"],
		getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "kimi"),
		setCredentialValue: (searchConfigTarget, value) => setScopedCredentialValue(searchConfigTarget, "kimi", value),
		getConfiguredCredentialValue: (config) => resolveProviderWebSearchPluginConfig(config, "moonshot")?.apiKey,
		setConfiguredCredentialValue: (configTarget, value) => {
			setProviderWebSearchPluginConfigValue(configTarget, "moonshot", "apiKey", value);
		},
		createTool: (ctx) => createKimiToolDefinition(mergeScopedSearchConfig(ctx.searchConfig, "kimi", resolveProviderWebSearchPluginConfig(ctx.config, "moonshot")))
	};
}
const __testing = {
	resolveKimiApiKey,
	resolveKimiModel,
	resolveKimiBaseUrl,
	extractKimiCitations
};
//#endregion
export { createKimiWebSearchProvider as n, __testing as t };
