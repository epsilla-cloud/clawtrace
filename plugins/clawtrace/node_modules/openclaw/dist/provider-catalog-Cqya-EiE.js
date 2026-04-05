//#region extensions/qianfan/provider-catalog.ts
const QIANFAN_BASE_URL = "https://qianfan.baidubce.com/v2";
const QIANFAN_DEFAULT_MODEL_ID = "deepseek-v3.2";
const QIANFAN_DEFAULT_CONTEXT_WINDOW = 98304;
const QIANFAN_DEFAULT_MAX_TOKENS = 32768;
const QIANFAN_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
function buildQianfanProvider() {
	return {
		baseUrl: QIANFAN_BASE_URL,
		api: "openai-completions",
		models: [{
			id: QIANFAN_DEFAULT_MODEL_ID,
			name: "DEEPSEEK V3.2",
			reasoning: true,
			input: ["text"],
			cost: QIANFAN_DEFAULT_COST,
			contextWindow: QIANFAN_DEFAULT_CONTEXT_WINDOW,
			maxTokens: QIANFAN_DEFAULT_MAX_TOKENS
		}, {
			id: "ernie-5.0-thinking-preview",
			name: "ERNIE-5.0-Thinking-Preview",
			reasoning: true,
			input: ["text", "image"],
			cost: QIANFAN_DEFAULT_COST,
			contextWindow: 119e3,
			maxTokens: 64e3
		}]
	};
}
//#endregion
export { QIANFAN_DEFAULT_MODEL_ID as n, buildQianfanProvider as r, QIANFAN_BASE_URL as t };
