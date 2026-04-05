import { d as createModelCatalogPresetAppliers } from "./provider-onboard-B0AuPavZ.js";
import { i as buildHuggingfaceModelDefinition, n as HUGGINGFACE_MODEL_CATALOG, t as HUGGINGFACE_BASE_URL } from "./models-DvjaYXOq.js";
//#region extensions/huggingface/onboard.ts
const HUGGINGFACE_DEFAULT_MODEL_REF = "huggingface/deepseek-ai/DeepSeek-R1";
const huggingfacePresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: HUGGINGFACE_DEFAULT_MODEL_REF,
	resolveParams: (_cfg) => ({
		providerId: "huggingface",
		api: "openai-completions",
		baseUrl: HUGGINGFACE_BASE_URL,
		catalogModels: HUGGINGFACE_MODEL_CATALOG.map(buildHuggingfaceModelDefinition),
		aliases: [{
			modelRef: HUGGINGFACE_DEFAULT_MODEL_REF,
			alias: "Hugging Face"
		}]
	})
});
function applyHuggingfaceProviderConfig(cfg) {
	return huggingfacePresetAppliers.applyProviderConfig(cfg);
}
function applyHuggingfaceConfig(cfg) {
	return huggingfacePresetAppliers.applyConfig(cfg);
}
//#endregion
export { applyHuggingfaceConfig as n, applyHuggingfaceProviderConfig as r, HUGGINGFACE_DEFAULT_MODEL_REF as t };
