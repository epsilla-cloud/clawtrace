//#region extensions/moonshot/provider-catalog.ts
const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
const MOONSHOT_DEFAULT_MODEL_ID = "kimi-k2.5";
const MOONSHOT_DEFAULT_CONTEXT_WINDOW = 262144;
const MOONSHOT_DEFAULT_MAX_TOKENS = 262144;
const MOONSHOT_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const MOONSHOT_MODEL_CATALOG = [
	{
		id: "kimi-k2.5",
		name: "Kimi K2.5",
		reasoning: false,
		input: ["text", "image"],
		cost: MOONSHOT_DEFAULT_COST,
		contextWindow: MOONSHOT_DEFAULT_CONTEXT_WINDOW,
		maxTokens: MOONSHOT_DEFAULT_MAX_TOKENS
	},
	{
		id: "kimi-k2-thinking",
		name: "Kimi K2 Thinking",
		reasoning: true,
		input: ["text"],
		cost: MOONSHOT_DEFAULT_COST,
		contextWindow: 262144,
		maxTokens: 262144
	},
	{
		id: "kimi-k2-thinking-turbo",
		name: "Kimi K2 Thinking Turbo",
		reasoning: true,
		input: ["text"],
		cost: MOONSHOT_DEFAULT_COST,
		contextWindow: 262144,
		maxTokens: 262144
	},
	{
		id: "kimi-k2-turbo",
		name: "Kimi K2 Turbo",
		reasoning: false,
		input: ["text"],
		cost: MOONSHOT_DEFAULT_COST,
		contextWindow: 256e3,
		maxTokens: 16384
	}
];
function normalizeMoonshotBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return "";
	try {
		const url = new URL(trimmed);
		url.hash = "";
		url.search = "";
		return url.toString().replace(/\/+$/, "").toLowerCase();
	} catch {
		return trimmed.replace(/\/+$/, "").toLowerCase();
	}
}
function isNativeMoonshotBaseUrl(baseUrl) {
	const normalized = normalizeMoonshotBaseUrl(baseUrl);
	return normalized === "https://api.moonshot.ai/v1" || normalized === "https://api.moonshot.cn/v1";
}
function withStreamingUsageCompat(provider) {
	if (!Array.isArray(provider.models) || provider.models.length === 0) return provider;
	let changed = false;
	const models = provider.models.map((model) => {
		if (model.compat?.supportsUsageInStreaming !== void 0) return model;
		changed = true;
		return {
			...model,
			compat: {
				...model.compat,
				supportsUsageInStreaming: true
			}
		};
	});
	return changed ? {
		...provider,
		models
	} : provider;
}
function applyMoonshotNativeStreamingUsageCompat(provider) {
	return isNativeMoonshotBaseUrl(provider.baseUrl) ? withStreamingUsageCompat(provider) : provider;
}
function buildMoonshotProvider() {
	return {
		baseUrl: MOONSHOT_BASE_URL,
		api: "openai-completions",
		models: MOONSHOT_MODEL_CATALOG.map((model) => ({
			...model,
			input: [...model.input]
		}))
	};
}
//#endregion
export { buildMoonshotProvider as a, applyMoonshotNativeStreamingUsageCompat as i, MOONSHOT_CN_BASE_URL as n, isNativeMoonshotBaseUrl as o, MOONSHOT_DEFAULT_MODEL_ID as r, MOONSHOT_BASE_URL as t };
