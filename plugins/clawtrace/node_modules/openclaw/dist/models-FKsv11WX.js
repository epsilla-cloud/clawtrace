//#region extensions/together/models.ts
const TOGETHER_BASE_URL = "https://api.together.xyz/v1";
const TOGETHER_MODEL_CATALOG = [
	{
		id: "zai-org/GLM-4.7",
		name: "GLM 4.7 Fp8",
		reasoning: false,
		input: ["text"],
		contextWindow: 202752,
		maxTokens: 8192,
		cost: {
			input: .45,
			output: 2,
			cacheRead: .45,
			cacheWrite: 2
		}
	},
	{
		id: "moonshotai/Kimi-K2.5",
		name: "Kimi K2.5",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: .5,
			output: 2.8,
			cacheRead: .5,
			cacheWrite: 2.8
		},
		contextWindow: 262144,
		maxTokens: 32768
	},
	{
		id: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
		name: "Llama 3.3 70B Instruct Turbo",
		reasoning: false,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 8192,
		cost: {
			input: .88,
			output: .88,
			cacheRead: .88,
			cacheWrite: .88
		}
	},
	{
		id: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
		name: "Llama 4 Scout 17B 16E Instruct",
		reasoning: false,
		input: ["text", "image"],
		contextWindow: 1e7,
		maxTokens: 32768,
		cost: {
			input: .18,
			output: .59,
			cacheRead: .18,
			cacheWrite: .18
		}
	},
	{
		id: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
		name: "Llama 4 Maverick 17B 128E Instruct FP8",
		reasoning: false,
		input: ["text", "image"],
		contextWindow: 2e7,
		maxTokens: 32768,
		cost: {
			input: .27,
			output: .85,
			cacheRead: .27,
			cacheWrite: .27
		}
	},
	{
		id: "deepseek-ai/DeepSeek-V3.1",
		name: "DeepSeek V3.1",
		reasoning: false,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 8192,
		cost: {
			input: .6,
			output: 1.25,
			cacheRead: .6,
			cacheWrite: .6
		}
	},
	{
		id: "deepseek-ai/DeepSeek-R1",
		name: "DeepSeek R1",
		reasoning: true,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 8192,
		cost: {
			input: 3,
			output: 7,
			cacheRead: 3,
			cacheWrite: 3
		}
	},
	{
		id: "moonshotai/Kimi-K2-Instruct-0905",
		name: "Kimi K2-Instruct 0905",
		reasoning: false,
		input: ["text"],
		contextWindow: 262144,
		maxTokens: 8192,
		cost: {
			input: 1,
			output: 3,
			cacheRead: 1,
			cacheWrite: 3
		}
	}
];
function buildTogetherModelDefinition(model) {
	return {
		id: model.id,
		name: model.name,
		api: "openai-completions",
		reasoning: model.reasoning,
		input: model.input,
		cost: model.cost,
		contextWindow: model.contextWindow,
		maxTokens: model.maxTokens
	};
}
//#endregion
export { TOGETHER_MODEL_CATALOG as n, buildTogetherModelDefinition as r, TOGETHER_BASE_URL as t };
