import { u as createDefaultModelsPresetAppliers } from "./provider-onboard-B0AuPavZ.js";
import { a as XAI_DEFAULT_MODEL_ID, t as XAI_BASE_URL, u as buildXaiCatalogModels } from "./model-definitions-D8DlotH_.js";
//#region extensions/xai/onboard.ts
const XAI_DEFAULT_MODEL_REF = `xai/${XAI_DEFAULT_MODEL_ID}`;
const xaiPresetAppliers = createDefaultModelsPresetAppliers({
	primaryModelRef: XAI_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, api) => ({
		providerId: "xai",
		api,
		baseUrl: XAI_BASE_URL,
		defaultModels: buildXaiCatalogModels(),
		defaultModelId: XAI_DEFAULT_MODEL_ID,
		aliases: [{
			modelRef: XAI_DEFAULT_MODEL_REF,
			alias: "Grok"
		}]
	})
});
function applyXaiProviderConfig(cfg) {
	return xaiPresetAppliers.applyProviderConfig(cfg, "openai-responses");
}
function applyXaiResponsesApiConfig(cfg) {
	return xaiPresetAppliers.applyProviderConfig(cfg, "openai-responses");
}
function applyXaiConfig(cfg) {
	return xaiPresetAppliers.applyConfig(cfg, "openai-responses");
}
//#endregion
export { applyXaiResponsesApiConfig as i, applyXaiConfig as n, applyXaiProviderConfig as r, XAI_DEFAULT_MODEL_REF as t };
