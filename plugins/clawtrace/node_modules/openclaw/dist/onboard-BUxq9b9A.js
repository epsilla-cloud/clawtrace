import { c as applyProviderConfigWithModelCatalogPreset } from "./provider-onboard-B0AuPavZ.js";
import { a as ZAI_DEFAULT_MODEL_ID, c as buildZaiModelDefinition, l as resolveZaiBaseUrl } from "./model-definitions-D9ngoDq-.js";
//#region extensions/zai/onboard.ts
const ZAI_DEFAULT_MODEL_REF = `zai/${ZAI_DEFAULT_MODEL_ID}`;
const ZAI_DEFAULT_MODELS = [
	buildZaiModelDefinition({ id: "glm-5" }),
	buildZaiModelDefinition({ id: "glm-5-turbo" }),
	buildZaiModelDefinition({ id: "glm-4.7" }),
	buildZaiModelDefinition({ id: "glm-4.7-flash" }),
	buildZaiModelDefinition({ id: "glm-4.7-flashx" }),
	buildZaiModelDefinition({ id: "glm-4.6" }),
	buildZaiModelDefinition({ id: "glm-4.6v" }),
	buildZaiModelDefinition({ id: "glm-4.5" }),
	buildZaiModelDefinition({ id: "glm-4.5-air" }),
	buildZaiModelDefinition({ id: "glm-4.5-flash" }),
	buildZaiModelDefinition({ id: "glm-4.5v" })
];
function resolveZaiPresetBaseUrl(cfg, endpoint) {
	const existingProvider = cfg.models?.providers?.zai;
	const existingBaseUrl = typeof existingProvider?.baseUrl === "string" ? existingProvider.baseUrl.trim() : "";
	return endpoint ? resolveZaiBaseUrl(endpoint) : existingBaseUrl || resolveZaiBaseUrl();
}
function applyZaiPreset(cfg, params, primaryModelRef) {
	const modelRef = `zai/${params?.modelId?.trim() || "glm-5"}`;
	return applyProviderConfigWithModelCatalogPreset(cfg, {
		providerId: "zai",
		api: "openai-completions",
		baseUrl: resolveZaiPresetBaseUrl(cfg, params?.endpoint),
		catalogModels: ZAI_DEFAULT_MODELS,
		aliases: [{
			modelRef,
			alias: "GLM"
		}],
		primaryModelRef
	});
}
function applyZaiProviderConfig(cfg, params) {
	return applyZaiPreset(cfg, params);
}
function applyZaiConfig(cfg, params) {
	const modelId = params?.modelId?.trim() || "glm-5";
	return applyZaiPreset(cfg, params, modelId === "glm-5" ? ZAI_DEFAULT_MODEL_REF : `zai/${modelId}`);
}
//#endregion
export { applyZaiConfig as n, applyZaiProviderConfig as r, ZAI_DEFAULT_MODEL_REF as t };
