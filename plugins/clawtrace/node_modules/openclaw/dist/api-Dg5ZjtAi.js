import { d as createModelCatalogPresetAppliers } from "./provider-onboard-B0AuPavZ.js";
import { n as TOGETHER_MODEL_CATALOG, r as buildTogetherModelDefinition, t as TOGETHER_BASE_URL } from "./models-FKsv11WX.js";
//#region extensions/together/provider-catalog.ts
function buildTogetherProvider() {
	return {
		baseUrl: TOGETHER_BASE_URL,
		api: "openai-completions",
		models: TOGETHER_MODEL_CATALOG.map(buildTogetherModelDefinition)
	};
}
//#endregion
//#region extensions/together/onboard.ts
const TOGETHER_DEFAULT_MODEL_REF = "together/moonshotai/Kimi-K2.5";
const togetherPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: TOGETHER_DEFAULT_MODEL_REF,
	resolveParams: (_cfg) => ({
		providerId: "together",
		api: "openai-completions",
		baseUrl: TOGETHER_BASE_URL,
		catalogModels: TOGETHER_MODEL_CATALOG.map(buildTogetherModelDefinition),
		aliases: [{
			modelRef: TOGETHER_DEFAULT_MODEL_REF,
			alias: "Together AI"
		}]
	})
});
function applyTogetherProviderConfig(cfg) {
	return togetherPresetAppliers.applyProviderConfig(cfg);
}
function applyTogetherConfig(cfg) {
	return togetherPresetAppliers.applyConfig(cfg);
}
//#endregion
export { buildTogetherProvider as i, applyTogetherConfig as n, applyTogetherProviderConfig as r, TOGETHER_DEFAULT_MODEL_REF as t };
