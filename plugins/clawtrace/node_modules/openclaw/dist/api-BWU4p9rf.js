import { c as DOUBAO_MODEL_CATALOG, i as DOUBAO_CODING_MODEL_CATALOG, l as buildDoubaoModelDefinition, n as DOUBAO_CODING_BASE_URL, t as DOUBAO_BASE_URL } from "./models-CV31tr2t.js";
//#region extensions/volcengine/provider-catalog.ts
function buildDoubaoProvider() {
	return {
		baseUrl: DOUBAO_BASE_URL,
		api: "openai-completions",
		models: DOUBAO_MODEL_CATALOG.map(buildDoubaoModelDefinition)
	};
}
function buildDoubaoCodingProvider() {
	return {
		baseUrl: DOUBAO_CODING_BASE_URL,
		api: "openai-completions",
		models: DOUBAO_CODING_MODEL_CATALOG.map(buildDoubaoModelDefinition)
	};
}
//#endregion
export { buildDoubaoProvider as n, buildDoubaoCodingProvider as t };
