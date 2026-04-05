//#region extensions/modelstudio/models.ts
const MODELSTUDIO_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";
const MODELSTUDIO_GLOBAL_BASE_URL = MODELSTUDIO_BASE_URL;
const MODELSTUDIO_CN_BASE_URL = "https://coding.dashscope.aliyuncs.com/v1";
const MODELSTUDIO_STANDARD_CN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const MODELSTUDIO_STANDARD_GLOBAL_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const MODELSTUDIO_DEFAULT_MODEL_ID = "qwen3.5-plus";
const MODELSTUDIO_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const MODELSTUDIO_DEFAULT_MODEL_REF = `modelstudio/${MODELSTUDIO_DEFAULT_MODEL_ID}`;
const MODELSTUDIO_MODEL_CATALOG = [
	{
		id: "qwen3.5-plus",
		name: "qwen3.5-plus",
		reasoning: false,
		input: ["text", "image"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 1e6,
		maxTokens: 65536
	},
	{
		id: "qwen3-max-2026-01-23",
		name: "qwen3-max-2026-01-23",
		reasoning: false,
		input: ["text"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 262144,
		maxTokens: 65536
	},
	{
		id: "qwen3-coder-next",
		name: "qwen3-coder-next",
		reasoning: false,
		input: ["text"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 262144,
		maxTokens: 65536
	},
	{
		id: "qwen3-coder-plus",
		name: "qwen3-coder-plus",
		reasoning: false,
		input: ["text"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 1e6,
		maxTokens: 65536
	},
	{
		id: "MiniMax-M2.5",
		name: "MiniMax-M2.5",
		reasoning: true,
		input: ["text"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 1e6,
		maxTokens: 65536
	},
	{
		id: "glm-5",
		name: "glm-5",
		reasoning: false,
		input: ["text"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 202752,
		maxTokens: 16384
	},
	{
		id: "glm-4.7",
		name: "glm-4.7",
		reasoning: false,
		input: ["text"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 202752,
		maxTokens: 16384
	},
	{
		id: "kimi-k2.5",
		name: "kimi-k2.5",
		reasoning: false,
		input: ["text", "image"],
		cost: MODELSTUDIO_DEFAULT_COST,
		contextWindow: 262144,
		maxTokens: 32768
	}
];
function normalizeModelStudioBaseUrl(baseUrl) {
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
function isNativeModelStudioBaseUrl(baseUrl) {
	const normalized = normalizeModelStudioBaseUrl(baseUrl);
	return normalized === "https://coding-intl.dashscope.aliyuncs.com/v1" || normalized === "https://coding.dashscope.aliyuncs.com/v1" || normalized === "https://dashscope.aliyuncs.com/compatible-mode/v1" || normalized === "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
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
function applyModelStudioNativeStreamingUsageCompat(provider) {
	return isNativeModelStudioBaseUrl(provider.baseUrl) ? withStreamingUsageCompat(provider) : provider;
}
function buildModelStudioModelDefinition(params) {
	const catalog = MODELSTUDIO_MODEL_CATALOG.find((model) => model.id === params.id);
	return {
		id: params.id,
		name: params.name ?? catalog?.name ?? params.id,
		reasoning: params.reasoning ?? catalog?.reasoning ?? false,
		input: params.input ?? (catalog?.input ? [...catalog.input] : ["text"]),
		cost: params.cost ?? catalog?.cost ?? MODELSTUDIO_DEFAULT_COST,
		contextWindow: params.contextWindow ?? catalog?.contextWindow ?? 262144,
		maxTokens: params.maxTokens ?? catalog?.maxTokens ?? 65536
	};
}
function buildModelStudioDefaultModelDefinition() {
	return buildModelStudioModelDefinition({ id: MODELSTUDIO_DEFAULT_MODEL_ID });
}
//#endregion
export { MODELSTUDIO_DEFAULT_MODEL_REF as a, MODELSTUDIO_STANDARD_CN_BASE_URL as c, buildModelStudioDefaultModelDefinition as d, buildModelStudioModelDefinition as f, MODELSTUDIO_DEFAULT_MODEL_ID as i, MODELSTUDIO_STANDARD_GLOBAL_BASE_URL as l, MODELSTUDIO_CN_BASE_URL as n, MODELSTUDIO_GLOBAL_BASE_URL as o, isNativeModelStudioBaseUrl as p, MODELSTUDIO_DEFAULT_COST as r, MODELSTUDIO_MODEL_CATALOG as s, MODELSTUDIO_BASE_URL as t, applyModelStudioNativeStreamingUsageCompat as u };
