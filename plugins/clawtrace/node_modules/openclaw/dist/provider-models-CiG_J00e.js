import { t as cloneFirstTemplateModel } from "./provider-model-shared-Bzdvns2r.js";
//#region extensions/google/provider-models.ts
const GEMINI_3_1_PRO_PREFIX = "gemini-3.1-pro";
const GEMINI_3_1_FLASH_LITE_PREFIX = "gemini-3.1-flash-lite";
const GEMINI_3_1_FLASH_PREFIX = "gemini-3.1-flash";
const GEMINI_3_1_PRO_TEMPLATE_IDS = ["gemini-3-pro-preview"];
const GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS = ["gemini-3.1-flash-lite-preview"];
const GEMINI_3_1_FLASH_TEMPLATE_IDS = ["gemini-3-flash-preview"];
function cloneFirstGoogleTemplateModel(params) {
	const templateProviderIds = [params.providerId, params.templateProviderId].map((providerId) => providerId?.trim()).filter((providerId) => Boolean(providerId));
	for (const templateProviderId of new Set(templateProviderIds)) {
		const model = cloneFirstTemplateModel({
			providerId: templateProviderId,
			modelId: params.modelId,
			templateIds: params.templateIds,
			ctx: params.ctx,
			patch: {
				...params.patch,
				provider: params.providerId
			}
		});
		if (model) return model;
	}
}
function resolveGoogle31ForwardCompatModel(params) {
	const trimmed = params.ctx.modelId.trim();
	const lower = trimmed.toLowerCase();
	let templateIds;
	if (lower.startsWith(GEMINI_3_1_PRO_PREFIX)) templateIds = GEMINI_3_1_PRO_TEMPLATE_IDS;
	else if (lower.startsWith(GEMINI_3_1_FLASH_LITE_PREFIX)) templateIds = GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS;
	else if (lower.startsWith(GEMINI_3_1_FLASH_PREFIX)) templateIds = GEMINI_3_1_FLASH_TEMPLATE_IDS;
	else return;
	return cloneFirstGoogleTemplateModel({
		providerId: params.providerId,
		templateProviderId: params.templateProviderId,
		modelId: trimmed,
		templateIds,
		ctx: params.ctx,
		patch: { reasoning: true }
	});
}
function isModernGoogleModel(modelId) {
	return modelId.trim().toLowerCase().startsWith("gemini-3");
}
//#endregion
export { resolveGoogle31ForwardCompatModel as n, isModernGoogleModel as t };
