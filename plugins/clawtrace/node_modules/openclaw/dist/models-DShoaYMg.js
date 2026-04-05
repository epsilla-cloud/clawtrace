import { o as normalizeModelCompat } from "./provider-model-shared-Bzdvns2r.js";
//#region extensions/github-copilot/models.ts
const PROVIDER_ID = "github-copilot";
const CODEX_GPT_54_MODEL_ID = "gpt-5.4";
const CODEX_TEMPLATE_MODEL_IDS = ["gpt-5.2-codex"];
const DEFAULT_CONTEXT_WINDOW = 128e3;
const DEFAULT_MAX_TOKENS = 8192;
function resolveCopilotForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	if (!trimmedModelId) return;
	if (ctx.modelRegistry.find("github-copilot", trimmedModelId.toLowerCase())) return;
	if (trimmedModelId.toLowerCase() === CODEX_GPT_54_MODEL_ID) for (const templateId of CODEX_TEMPLATE_MODEL_IDS) {
		const template = ctx.modelRegistry.find(PROVIDER_ID, templateId);
		if (!template) continue;
		return normalizeModelCompat({
			...template,
			id: trimmedModelId,
			name: trimmedModelId
		});
	}
	const lowerModelId = trimmedModelId.toLowerCase();
	return normalizeModelCompat({
		id: trimmedModelId,
		name: trimmedModelId,
		provider: PROVIDER_ID,
		api: "openai-responses",
		reasoning: /^o[13](\b|$)/.test(lowerModelId),
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_CONTEXT_WINDOW,
		maxTokens: DEFAULT_MAX_TOKENS
	});
}
//#endregion
export { resolveCopilotForwardCompatModel as n, PROVIDER_ID as t };
