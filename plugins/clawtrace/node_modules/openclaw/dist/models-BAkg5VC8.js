//#region extensions/deepseek/models.ts
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEEPSEEK_V3_2_COST = {
	input: .28,
	output: .42,
	cacheRead: .028,
	cacheWrite: 0
};
const DEEPSEEK_MODEL_CATALOG = [{
	id: "deepseek-chat",
	name: "DeepSeek Chat",
	reasoning: false,
	input: ["text"],
	contextWindow: 131072,
	maxTokens: 8192,
	cost: DEEPSEEK_V3_2_COST,
	compat: { supportsUsageInStreaming: true }
}, {
	id: "deepseek-reasoner",
	name: "DeepSeek Reasoner",
	reasoning: true,
	input: ["text"],
	contextWindow: 131072,
	maxTokens: 65536,
	cost: DEEPSEEK_V3_2_COST,
	compat: { supportsUsageInStreaming: true }
}];
function buildDeepSeekModelDefinition(model) {
	return {
		...model,
		api: "openai-completions"
	};
}
//#endregion
export { DEEPSEEK_MODEL_CATALOG as n, buildDeepSeekModelDefinition as r, DEEPSEEK_BASE_URL as t };
