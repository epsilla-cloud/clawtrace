import "./model-definitions-DemRDKRw.js";
import "./provider-catalog-Cmahejk_.js";
import "./onboard-C2OZysTY.js";
//#region extensions/mistral/api.ts
const MISTRAL_MAX_TOKENS_FIELD = "max_tokens";
function applyMistralModelCompat(model) {
	const patch = {
		supportsStore: false,
		supportsReasoningEffort: false,
		maxTokensField: MISTRAL_MAX_TOKENS_FIELD
	};
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	if (compat && Object.entries(patch).every(([key, value]) => compat[key] === value)) return model;
	return {
		...model,
		compat: {
			...compat,
			...patch
		}
	};
}
//#endregion
export { applyMistralModelCompat as t };
