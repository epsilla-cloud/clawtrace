import { i as MINIMAX_TEXT_MODEL_ORDER, r as MINIMAX_TEXT_MODEL_CATALOG } from "./provider-models-DzG8uiWj2.js";
//#region extensions/minimax/provider-catalog.ts
const MINIMAX_PORTAL_BASE_URL = "https://api.minimax.io/anthropic";
const MINIMAX_DEFAULT_CONTEXT_WINDOW = 204800;
const MINIMAX_DEFAULT_MAX_TOKENS = 131072;
const MINIMAX_API_COST = {
	input: .3,
	output: 1.2,
	cacheRead: .06,
	cacheWrite: .375
};
function buildMinimaxModel(params) {
	return {
		id: params.id,
		name: params.name,
		reasoning: params.reasoning,
		input: params.input,
		cost: MINIMAX_API_COST,
		contextWindow: MINIMAX_DEFAULT_CONTEXT_WINDOW,
		maxTokens: MINIMAX_DEFAULT_MAX_TOKENS
	};
}
function buildMinimaxTextModel(params) {
	return buildMinimaxModel({
		...params,
		input: ["text"]
	});
}
function buildMinimaxCatalog() {
	return MINIMAX_TEXT_MODEL_ORDER.map((id) => {
		const model = MINIMAX_TEXT_MODEL_CATALOG[id];
		return buildMinimaxTextModel({
			id,
			name: model.name,
			reasoning: model.reasoning
		});
	});
}
function buildMinimaxProvider() {
	return {
		baseUrl: MINIMAX_PORTAL_BASE_URL,
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
function buildMinimaxPortalProvider() {
	return {
		baseUrl: MINIMAX_PORTAL_BASE_URL,
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
//#endregion
export { buildMinimaxProvider as n, buildMinimaxPortalProvider as t };
