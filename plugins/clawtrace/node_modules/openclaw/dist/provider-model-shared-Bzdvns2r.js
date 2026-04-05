import "./moonshot-thinking-stream-wrappers-DJ9b-Vxi.js";
//#region src/plugins/provider-model-compat.ts
function extractModelCompat(modelOrCompat) {
	if (!modelOrCompat || typeof modelOrCompat !== "object") return;
	if ("compat" in modelOrCompat) {
		const compat = modelOrCompat.compat;
		return compat && typeof compat === "object" ? compat : void 0;
	}
	return modelOrCompat;
}
function applyModelCompatPatch(model, patch) {
	const nextCompat = {
		...model.compat,
		...patch
	};
	if (model.compat && Object.entries(patch).every(([key, value]) => model.compat?.[key] === value)) return model;
	return {
		...model,
		compat: nextCompat
	};
}
function hasToolSchemaProfile(modelOrCompat, profile) {
	return extractModelCompat(modelOrCompat)?.toolSchemaProfile === profile;
}
function hasNativeWebSearchTool(modelOrCompat) {
	return extractModelCompat(modelOrCompat)?.nativeWebSearchTool === true;
}
function resolveToolCallArgumentsEncoding(modelOrCompat) {
	return extractModelCompat(modelOrCompat)?.toolCallArgumentsEncoding;
}
function resolveUnsupportedToolSchemaKeywords(modelOrCompat) {
	const keywords = extractModelCompat(modelOrCompat)?.unsupportedToolSchemaKeywords ?? [];
	return new Set(keywords.filter((keyword) => typeof keyword === "string").map((keyword) => keyword.trim()).filter(Boolean));
}
function isOpenAiCompletionsModel(model) {
	return model.api === "openai-completions";
}
function isOpenAINativeEndpoint(baseUrl) {
	try {
		return new URL(baseUrl).hostname.toLowerCase() === "api.openai.com";
	} catch {
		return false;
	}
}
function isAnthropicMessagesModel(model) {
	return model.api === "anthropic-messages";
}
function normalizeAnthropicBaseUrl(baseUrl) {
	return baseUrl.replace(/\/v1\/?$/, "");
}
function normalizeModelCompat(model) {
	const baseUrl = model.baseUrl ?? "";
	if (isAnthropicMessagesModel(model) && baseUrl) {
		const normalized = normalizeAnthropicBaseUrl(baseUrl);
		if (normalized !== baseUrl) return {
			...model,
			baseUrl: normalized
		};
	}
	if (!isOpenAiCompletionsModel(model)) return model;
	const compat = model.compat ?? void 0;
	if (!(baseUrl ? !isOpenAINativeEndpoint(baseUrl) : false)) return model;
	const forcedDeveloperRole = compat?.supportsDeveloperRole === true;
	const hasStreamingUsageOverride = compat?.supportsUsageInStreaming !== void 0;
	const targetStrictMode = compat?.supportsStrictMode ?? false;
	if (compat?.supportsDeveloperRole !== void 0 && hasStreamingUsageOverride && compat?.supportsStrictMode !== void 0) return model;
	return {
		...model,
		compat: compat ? {
			...compat,
			supportsDeveloperRole: forcedDeveloperRole || false,
			...hasStreamingUsageOverride ? {} : { supportsUsageInStreaming: false },
			supportsStrictMode: targetStrictMode
		} : {
			supportsDeveloperRole: false,
			supportsUsageInStreaming: false,
			supportsStrictMode: false
		}
	};
}
//#endregion
//#region src/plugins/provider-model-helpers.ts
function matchesExactOrPrefix(id, values) {
	const normalizedId = id.trim().toLowerCase();
	return values.some((value) => {
		const normalizedValue = value.trim().toLowerCase();
		return normalizedId === normalizedValue || normalizedId.startsWith(normalizedValue);
	});
}
function cloneFirstTemplateModel(params) {
	const trimmedModelId = params.modelId.trim();
	for (const templateId of [...new Set(params.templateIds)].filter(Boolean)) {
		const template = params.ctx.modelRegistry.find(params.providerId, templateId);
		if (!template) continue;
		return normalizeModelCompat({
			...template,
			id: trimmedModelId,
			name: trimmedModelId,
			...params.patch
		});
	}
}
//#endregion
export { hasToolSchemaProfile as a, resolveUnsupportedToolSchemaKeywords as c, hasNativeWebSearchTool as i, matchesExactOrPrefix as n, normalizeModelCompat as o, applyModelCompatPatch as r, resolveToolCallArgumentsEncoding as s, cloneFirstTemplateModel as t };
