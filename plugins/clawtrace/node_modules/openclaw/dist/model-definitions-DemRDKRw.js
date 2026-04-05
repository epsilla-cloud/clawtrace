//#region extensions/mistral/model-definitions.ts
const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";
const MISTRAL_DEFAULT_MODEL_ID = "mistral-large-latest";
const MISTRAL_DEFAULT_MODEL_REF = `mistral/${MISTRAL_DEFAULT_MODEL_ID}`;
const MISTRAL_DEFAULT_CONTEXT_WINDOW = 262144;
const MISTRAL_DEFAULT_MAX_TOKENS = 16384;
const MISTRAL_DEFAULT_COST = {
	input: .5,
	output: 1.5,
	cacheRead: 0,
	cacheWrite: 0
};
const MISTRAL_MODEL_CATALOG = [
	{
		id: "codestral-latest",
		name: "Codestral (latest)",
		reasoning: false,
		input: ["text"],
		cost: {
			input: .3,
			output: .9,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 256e3,
		maxTokens: 4096
	},
	{
		id: "devstral-medium-latest",
		name: "Devstral 2 (latest)",
		reasoning: false,
		input: ["text"],
		cost: {
			input: .4,
			output: 2,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 262144,
		maxTokens: 32768
	},
	{
		id: "magistral-small",
		name: "Magistral Small",
		reasoning: true,
		input: ["text"],
		cost: {
			input: .5,
			output: 1.5,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 128e3,
		maxTokens: 4e4
	},
	{
		id: "mistral-large-latest",
		name: "Mistral Large (latest)",
		reasoning: false,
		input: ["text", "image"],
		cost: MISTRAL_DEFAULT_COST,
		contextWindow: MISTRAL_DEFAULT_CONTEXT_WINDOW,
		maxTokens: MISTRAL_DEFAULT_MAX_TOKENS
	},
	{
		id: "mistral-medium-2508",
		name: "Mistral Medium 3.1",
		reasoning: false,
		input: ["text", "image"],
		cost: {
			input: .4,
			output: 2,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 262144,
		maxTokens: 8192
	},
	{
		id: "mistral-small-latest",
		name: "Mistral Small (latest)",
		reasoning: false,
		input: ["text", "image"],
		cost: {
			input: .1,
			output: .3,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 128e3,
		maxTokens: 16384
	},
	{
		id: "pixtral-large-latest",
		name: "Pixtral Large (latest)",
		reasoning: false,
		input: ["text", "image"],
		cost: {
			input: 2,
			output: 6,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 128e3,
		maxTokens: 32768
	}
];
function buildMistralModelDefinition() {
	return MISTRAL_MODEL_CATALOG.find((model) => model.id === "mistral-large-latest") ?? {
		id: "mistral-large-latest",
		name: "Mistral Large",
		reasoning: false,
		input: ["text", "image"],
		cost: MISTRAL_DEFAULT_COST,
		contextWindow: 262144,
		maxTokens: 16384
	};
}
function buildMistralCatalogModels() {
	return MISTRAL_MODEL_CATALOG.map((model) => ({
		...model,
		input: [...model.input]
	}));
}
//#endregion
export { MISTRAL_DEFAULT_MODEL_ID as a, buildMistralModelDefinition as c, MISTRAL_DEFAULT_MAX_TOKENS as i, MISTRAL_DEFAULT_CONTEXT_WINDOW as n, MISTRAL_DEFAULT_MODEL_REF as o, MISTRAL_DEFAULT_COST as r, buildMistralCatalogModels as s, MISTRAL_BASE_URL as t };
