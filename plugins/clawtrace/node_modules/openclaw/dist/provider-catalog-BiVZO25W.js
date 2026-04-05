import { a as SYNTHETIC_MODEL_CATALOG, o as buildSyntheticModelDefinition, t as SYNTHETIC_BASE_URL } from "./models-De_dCg--.js";
//#region extensions/synthetic/provider-catalog.ts
function buildSyntheticProvider() {
	return {
		baseUrl: SYNTHETIC_BASE_URL,
		api: "anthropic-messages",
		models: SYNTHETIC_MODEL_CATALOG.map(buildSyntheticModelDefinition)
	};
}
//#endregion
export { buildSyntheticProvider as t };
