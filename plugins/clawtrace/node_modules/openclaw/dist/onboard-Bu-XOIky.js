import { d as createModelCatalogPresetAppliers } from "./provider-onboard-B0AuPavZ.js";
import { a as MODELSTUDIO_DEFAULT_MODEL_REF, c as MODELSTUDIO_STANDARD_CN_BASE_URL, l as MODELSTUDIO_STANDARD_GLOBAL_BASE_URL, n as MODELSTUDIO_CN_BASE_URL, o as MODELSTUDIO_GLOBAL_BASE_URL } from "./models-DS5W-29W.js";
import { t as buildModelStudioProvider } from "./provider-catalog-DYi0SrBt.js";
//#region extensions/modelstudio/onboard.ts
const modelStudioPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: MODELSTUDIO_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, baseUrl) => {
		const provider = buildModelStudioProvider();
		return {
			providerId: "modelstudio",
			api: provider.api ?? "openai-completions",
			baseUrl,
			catalogModels: provider.models ?? [],
			aliases: [...(provider.models ?? []).map((model) => `modelstudio/${model.id}`), {
				modelRef: MODELSTUDIO_DEFAULT_MODEL_REF,
				alias: "Qwen"
			}]
		};
	}
});
function applyModelStudioProviderConfig(cfg) {
	return modelStudioPresetAppliers.applyProviderConfig(cfg, MODELSTUDIO_GLOBAL_BASE_URL);
}
function applyModelStudioProviderConfigCn(cfg) {
	return modelStudioPresetAppliers.applyProviderConfig(cfg, MODELSTUDIO_CN_BASE_URL);
}
function applyModelStudioConfig(cfg) {
	return modelStudioPresetAppliers.applyConfig(cfg, MODELSTUDIO_GLOBAL_BASE_URL);
}
function applyModelStudioConfigCn(cfg) {
	return modelStudioPresetAppliers.applyConfig(cfg, MODELSTUDIO_CN_BASE_URL);
}
function applyModelStudioStandardProviderConfig(cfg) {
	return modelStudioPresetAppliers.applyProviderConfig(cfg, MODELSTUDIO_STANDARD_GLOBAL_BASE_URL);
}
function applyModelStudioStandardProviderConfigCn(cfg) {
	return modelStudioPresetAppliers.applyProviderConfig(cfg, MODELSTUDIO_STANDARD_CN_BASE_URL);
}
function applyModelStudioStandardConfig(cfg) {
	return modelStudioPresetAppliers.applyConfig(cfg, MODELSTUDIO_STANDARD_GLOBAL_BASE_URL);
}
function applyModelStudioStandardConfigCn(cfg) {
	return modelStudioPresetAppliers.applyConfig(cfg, MODELSTUDIO_STANDARD_CN_BASE_URL);
}
//#endregion
export { applyModelStudioStandardConfig as a, applyModelStudioStandardProviderConfigCn as c, applyModelStudioProviderConfigCn as i, applyModelStudioConfigCn as n, applyModelStudioStandardConfigCn as o, applyModelStudioProviderConfig as r, applyModelStudioStandardProviderConfig as s, applyModelStudioConfig as t };
