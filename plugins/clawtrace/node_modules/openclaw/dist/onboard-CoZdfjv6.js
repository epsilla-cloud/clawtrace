import { s as applyProviderConfigWithModelCatalog, t as applyAgentDefaultModelPrimary } from "./provider-onboard-B0AuPavZ.js";
import { n as DEEPSEEK_MODEL_CATALOG, r as buildDeepSeekModelDefinition, t as DEEPSEEK_BASE_URL } from "./models-BAkg5VC8.js";
//#region extensions/deepseek/onboard.ts
const DEEPSEEK_DEFAULT_MODEL_REF = "deepseek/deepseek-chat";
function applyDeepSeekProviderConfig(cfg) {
	const models = { ...cfg.agents?.defaults?.models };
	models[DEEPSEEK_DEFAULT_MODEL_REF] = {
		...models[DEEPSEEK_DEFAULT_MODEL_REF],
		alias: models["deepseek/deepseek-chat"]?.alias ?? "DeepSeek"
	};
	return applyProviderConfigWithModelCatalog(cfg, {
		agentModels: models,
		providerId: "deepseek",
		api: "openai-completions",
		baseUrl: DEEPSEEK_BASE_URL,
		catalogModels: DEEPSEEK_MODEL_CATALOG.map(buildDeepSeekModelDefinition)
	});
}
function applyDeepSeekConfig(cfg) {
	return applyAgentDefaultModelPrimary(applyDeepSeekProviderConfig(cfg), DEEPSEEK_DEFAULT_MODEL_REF);
}
//#endregion
export { applyDeepSeekConfig as n, applyDeepSeekProviderConfig as r, DEEPSEEK_DEFAULT_MODEL_REF as t };
