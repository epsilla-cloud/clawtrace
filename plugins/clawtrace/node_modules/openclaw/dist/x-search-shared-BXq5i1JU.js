import { t as normalizeXaiModelId } from "./model-id-VaIBLd62.js";
import { A as postTrustedWebToolsJson } from "./provider-web-search-I-919IKa.js";
import { c as wrapWebContent } from "./external-content-YqO3ih3d.js";
import "./provider-models-B_HWys7n.js";
import { n as extractXaiWebSearchContent } from "./web-search-shared-CN1UlZDw.js";
//#region extensions/xai/src/x-search-shared.ts
const XAI_X_SEARCH_ENDPOINT = "https://api.x.ai/v1/responses";
const XAI_DEFAULT_X_SEARCH_MODEL = "grok-4-1-fast-non-reasoning";
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function resolveXaiXSearchConfig(config) {
	return isRecord(config) ? config : {};
}
function resolveXaiXSearchModel(config) {
	const resolved = resolveXaiXSearchConfig(config);
	return typeof resolved.model === "string" && resolved.model.trim() ? normalizeXaiModelId(resolved.model.trim()) : XAI_DEFAULT_X_SEARCH_MODEL;
}
function resolveXaiXSearchInlineCitations(config) {
	return resolveXaiXSearchConfig(config).inlineCitations === true;
}
function resolveXaiXSearchMaxTurns(config) {
	const raw = resolveXaiXSearchConfig(config).maxTurns;
	if (typeof raw !== "number" || !Number.isFinite(raw)) return;
	const normalized = Math.trunc(raw);
	return normalized > 0 ? normalized : void 0;
}
function buildXSearchTool(options) {
	return {
		type: "x_search",
		...options.allowedXHandles?.length ? { allowed_x_handles: options.allowedXHandles } : {},
		...options.excludedXHandles?.length ? { excluded_x_handles: options.excludedXHandles } : {},
		...options.fromDate ? { from_date: options.fromDate } : {},
		...options.toDate ? { to_date: options.toDate } : {},
		...options.enableImageUnderstanding ? { enable_image_understanding: true } : {},
		...options.enableVideoUnderstanding ? { enable_video_understanding: true } : {}
	};
}
function buildXaiXSearchPayload(params) {
	return {
		query: params.query,
		provider: "xai",
		model: params.model,
		tookMs: params.tookMs,
		externalContent: {
			untrusted: true,
			source: "x_search",
			provider: "xai",
			wrapped: true
		},
		content: wrapWebContent(params.content, "web_search"),
		citations: params.citations,
		...params.inlineCitations ? { inlineCitations: params.inlineCitations } : {},
		...params.options?.allowedXHandles?.length ? { allowedXHandles: params.options.allowedXHandles } : {},
		...params.options?.excludedXHandles?.length ? { excludedXHandles: params.options.excludedXHandles } : {},
		...params.options?.fromDate ? { fromDate: params.options.fromDate } : {},
		...params.options?.toDate ? { toDate: params.options.toDate } : {},
		...params.options?.enableImageUnderstanding ? { enableImageUnderstanding: true } : {},
		...params.options?.enableVideoUnderstanding ? { enableVideoUnderstanding: true } : {}
	};
}
async function requestXaiXSearch(params) {
	return await postTrustedWebToolsJson({
		url: XAI_X_SEARCH_ENDPOINT,
		timeoutSeconds: params.timeoutSeconds,
		apiKey: params.apiKey,
		body: {
			model: params.model,
			input: [{
				role: "user",
				content: params.options.query
			}],
			tools: [buildXSearchTool(params.options)],
			...params.maxTurns ? { max_turns: params.maxTurns } : {}
		},
		errorLabel: "xAI"
	}, async (response) => {
		const data = await response.json();
		const { text, annotationCitations } = extractXaiWebSearchContent(data);
		const citations = Array.isArray(data.citations) && data.citations.length > 0 ? data.citations : annotationCitations;
		return {
			content: text ?? "No response",
			citations,
			inlineCitations: params.inlineCitations && Array.isArray(data.inline_citations) ? data.inline_citations : void 0
		};
	});
}
//#endregion
export { resolveXaiXSearchMaxTurns as a, resolveXaiXSearchInlineCitations as i, buildXaiXSearchPayload as n, resolveXaiXSearchModel as o, requestXaiXSearch as r, XAI_DEFAULT_X_SEARCH_MODEL as t };
