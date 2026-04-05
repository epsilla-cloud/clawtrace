import { K as resolveCacheTtlMs, U as normalizeCacheKey, W as readCache, Y as writeCache, d as getScopedCredentialValue, g as setScopedCredentialValue, h as setProviderWebSearchPluginConfigValue, m as resolveProviderWebSearchPluginConfig, p as mergeScopedSearchConfig, q as resolveTimeoutSeconds, u as resolveWebSearchProviderCredential } from "./provider-web-search-I-919IKa.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import { d as readNumberParam, h as readStringParam } from "./common-B7JFWTj2.js";
import { a as resolveXaiWebSearchModel, i as resolveXaiInlineCitations, n as extractXaiWebSearchContent, r as requestXaiWebSearch, t as buildXaiWebSearchPayload } from "./web-search-shared-CN1UlZDw.js";
import { t as XAI_DEFAULT_X_SEARCH_MODEL } from "./x-search-shared-BXq5i1JU.js";
import { Type } from "@sinclair/typebox";
//#region extensions/xai/web-search.ts
const XAI_WEB_SEARCH_CACHE = /* @__PURE__ */ new Map();
const X_SEARCH_MODEL_OPTIONS = [{
	value: XAI_DEFAULT_X_SEARCH_MODEL,
	label: XAI_DEFAULT_X_SEARCH_MODEL,
	hint: "default · fast, no reasoning"
}, {
	value: "grok-4-1-fast",
	label: "grok-4-1-fast",
	hint: "fast with reasoning"
}];
function resolveXSearchConfigRecord(config) {
	const xSearch = config?.tools?.web?.x_search;
	return xSearch && typeof xSearch === "object" ? xSearch : void 0;
}
function applyXSearchSetupConfig(config, params) {
	return {
		...config,
		tools: {
			...config.tools,
			web: {
				...config.tools?.web,
				x_search: {
					...config.tools?.web?.x_search,
					enabled: params.enabled,
					model: params.model
				}
			}
		}
	};
}
async function runXaiSearchProviderSetup(ctx) {
	const existingXSearch = resolveXSearchConfigRecord(ctx.config);
	if (existingXSearch?.enabled === false) return ctx.config;
	await ctx.prompter.note([
		"x_search lets your agent search X (formerly Twitter) posts via xAI.",
		"It reuses the same xAI API key you just configured for Grok web search.",
		`You can change this later with ${formatCliCommand("openclaw configure --section web")}.`
	].join("\n"), "X search");
	if (await ctx.prompter.select({
		message: "Enable x_search too?",
		options: [{
			value: "yes",
			label: "Yes, enable x_search",
			hint: "Search X posts with the same xAI key"
		}, {
			value: "skip",
			label: "Skip for now",
			hint: "Keep Grok web_search only"
		}],
		initialValue: existingXSearch?.enabled === true || ctx.quickstartDefaults ? "yes" : "skip"
	}) === "skip") return ctx.config;
	const existingModel = typeof existingXSearch?.model === "string" && existingXSearch.model.trim() ? existingXSearch.model.trim() : "";
	const knownModel = X_SEARCH_MODEL_OPTIONS.find((entry) => entry.value === existingModel)?.value;
	const modelPick = await ctx.prompter.select({
		message: "Grok model for x_search",
		options: [...X_SEARCH_MODEL_OPTIONS, {
			value: "__custom__",
			label: "Enter custom model name",
			hint: ""
		}],
		initialValue: knownModel ?? "grok-4-1-fast-non-reasoning"
	});
	let model = modelPick;
	if (modelPick === "__custom__") model = (await ctx.prompter.text({
		message: "Custom Grok model name",
		initialValue: existingModel || "grok-4-1-fast-non-reasoning",
		placeholder: "grok-4-1-fast-non-reasoning"
	})).trim() || "grok-4-1-fast-non-reasoning";
	return applyXSearchSetupConfig(ctx.config, {
		enabled: true,
		model: model || "grok-4-1-fast-non-reasoning"
	});
}
function runXaiWebSearch(params) {
	const cacheKey = normalizeCacheKey(`grok:${params.model}:${String(params.inlineCitations)}:${params.query}`);
	const cached = readCache(XAI_WEB_SEARCH_CACHE, cacheKey);
	if (cached) return Promise.resolve({
		...cached.value,
		cached: true
	});
	return (async () => {
		const startedAt = Date.now();
		const result = await requestXaiWebSearch({
			query: params.query,
			model: params.model,
			apiKey: params.apiKey,
			timeoutSeconds: params.timeoutSeconds,
			inlineCitations: params.inlineCitations
		});
		const payload = buildXaiWebSearchPayload({
			query: params.query,
			provider: "grok",
			model: params.model,
			tookMs: Date.now() - startedAt,
			content: result.content,
			citations: result.citations,
			inlineCitations: result.inlineCitations
		});
		writeCache(XAI_WEB_SEARCH_CACHE, cacheKey, payload, params.cacheTtlMs);
		return payload;
	})();
}
function resolveXaiToolSearchConfig(ctx) {
	return mergeScopedSearchConfig(ctx.searchConfig, "grok", resolveProviderWebSearchPluginConfig(ctx.config, "xai"));
}
function resolveXaiWebSearchCredential(searchConfig) {
	return resolveWebSearchProviderCredential({
		credentialValue: getScopedCredentialValue(searchConfig, "grok"),
		path: "tools.web.search.grok.apiKey",
		envVars: ["XAI_API_KEY"]
	});
}
function createXaiWebSearchProvider() {
	return {
		id: "grok",
		label: "Grok (xAI)",
		hint: "Requires xAI API key · xAI web-grounded responses",
		onboardingScopes: ["text-inference"],
		credentialLabel: "xAI API key",
		envVars: ["XAI_API_KEY"],
		placeholder: "xai-...",
		signupUrl: "https://console.x.ai/",
		docsUrl: "https://docs.openclaw.ai/tools/web",
		autoDetectOrder: 30,
		credentialPath: "plugins.entries.xai.config.webSearch.apiKey",
		inactiveSecretPaths: ["plugins.entries.xai.config.webSearch.apiKey"],
		getCredentialValue: (searchConfig) => getScopedCredentialValue(searchConfig, "grok"),
		setCredentialValue: (searchConfigTarget, value) => setScopedCredentialValue(searchConfigTarget, "grok", value),
		getConfiguredCredentialValue: (config) => resolveProviderWebSearchPluginConfig(config, "xai")?.apiKey,
		setConfiguredCredentialValue: (configTarget, value) => {
			setProviderWebSearchPluginConfigValue(configTarget, "xai", "apiKey", value);
		},
		runSetup: runXaiSearchProviderSetup,
		createTool: (ctx) => {
			const searchConfig = resolveXaiToolSearchConfig(ctx);
			return {
				description: "Search the web using xAI Grok. Returns AI-synthesized answers with citations from real-time web search.",
				parameters: Type.Object({
					query: Type.String({ description: "Search query string." }),
					count: Type.Optional(Type.Number({
						description: "Number of results to return (1-10).",
						minimum: 1,
						maximum: 10
					}))
				}),
				execute: async (args) => {
					const apiKey = resolveXaiWebSearchCredential(searchConfig);
					if (!apiKey) return {
						error: "missing_xai_api_key",
						message: "web_search (grok) needs an xAI API key. Set XAI_API_KEY in the Gateway environment, or configure plugins.entries.xai.config.webSearch.apiKey.",
						docs: "https://docs.openclaw.ai/tools/web"
					};
					const query = readStringParam(args, "query", { required: true });
					readNumberParam(args, "count", { integer: true });
					return await runXaiWebSearch({
						query,
						model: resolveXaiWebSearchModel(searchConfig),
						apiKey,
						timeoutSeconds: resolveTimeoutSeconds(searchConfig?.timeoutSeconds ?? void 0, 30),
						inlineCitations: resolveXaiInlineCitations(searchConfig),
						cacheTtlMs: resolveCacheTtlMs(searchConfig?.cacheTtlMinutes ?? void 0, 15)
					});
				}
			};
		}
	};
}
const __testing = {
	buildXaiWebSearchPayload,
	extractXaiWebSearchContent,
	resolveXaiToolSearchConfig,
	resolveXaiInlineCitations,
	resolveXaiWebSearchCredential,
	resolveXaiWebSearchModel,
	requestXaiWebSearch
};
//#endregion
export { createXaiWebSearchProvider as n, __testing as t };
