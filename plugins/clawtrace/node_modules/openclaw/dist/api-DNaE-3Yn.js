import { o as normalizeModelCompat, r as applyModelCompatPatch } from "./provider-model-shared-Bzdvns2r.js";
import { t as XAI_UNSUPPORTED_SCHEMA_KEYWORDS } from "./provider-tools-COi0h95y.js";
import { f as resolveXaiCatalogEntry } from "./model-definitions-D8DlotH_.js";
import "./provider-catalog-DkEFVilE.js";
import "./onboard-Dpx9AZcO.js";
//#region extensions/xai/provider-models.ts
const XAI_MODERN_MODEL_PREFIXES = [
	"grok-3",
	"grok-4",
	"grok-code-fast"
];
function isModernXaiModel(modelId) {
	const lower = modelId.trim().toLowerCase();
	if (!lower || lower.includes("multi-agent")) return false;
	return XAI_MODERN_MODEL_PREFIXES.some((prefix) => lower.startsWith(prefix));
}
function resolveXaiForwardCompatModel(params) {
	const definition = resolveXaiCatalogEntry(params.ctx.modelId);
	if (!definition) return;
	return applyXaiModelCompat(normalizeModelCompat({
		id: definition.id,
		name: definition.name,
		api: params.ctx.providerConfig?.api ?? "openai-responses",
		provider: params.providerId,
		baseUrl: params.ctx.providerConfig?.baseUrl ?? "https://api.x.ai/v1",
		reasoning: definition.reasoning,
		input: definition.input,
		cost: definition.cost,
		contextWindow: definition.contextWindow,
		maxTokens: definition.maxTokens
	}));
}
//#endregion
//#region extensions/xai/api.ts
const XAI_TOOL_SCHEMA_PROFILE = "xai";
const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING = "html-entities";
function resolveXaiModelCompatPatch() {
	return {
		toolSchemaProfile: "xai",
		unsupportedToolSchemaKeywords: Array.from(XAI_UNSUPPORTED_SCHEMA_KEYWORDS),
		nativeWebSearchTool: true,
		toolCallArgumentsEncoding: HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING
	};
}
function applyXaiModelCompat(model) {
	return applyModelCompatPatch(model, resolveXaiModelCompatPatch());
}
//#endregion
export { isModernXaiModel as a, resolveXaiModelCompatPatch as i, XAI_TOOL_SCHEMA_PROFILE as n, resolveXaiForwardCompatModel as o, applyXaiModelCompat as r, HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING as t };
