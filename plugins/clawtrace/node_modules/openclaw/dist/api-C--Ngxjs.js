import { c as BYTEPLUS_MODEL_CATALOG, i as BYTEPLUS_CODING_MODEL_CATALOG, l as buildBytePlusModelDefinition, n as BYTEPLUS_CODING_BASE_URL, t as BYTEPLUS_BASE_URL } from "./models-BjQSyoRv.js";
//#region extensions/byteplus/provider-catalog.ts
function buildBytePlusProvider() {
	return {
		baseUrl: BYTEPLUS_BASE_URL,
		api: "openai-completions",
		models: BYTEPLUS_MODEL_CATALOG.map(buildBytePlusModelDefinition)
	};
}
function buildBytePlusCodingProvider() {
	return {
		baseUrl: BYTEPLUS_CODING_BASE_URL,
		api: "openai-completions",
		models: BYTEPLUS_CODING_MODEL_CATALOG.map(buildBytePlusModelDefinition)
	};
}
//#endregion
export { buildBytePlusProvider as n, buildBytePlusCodingProvider as t };
