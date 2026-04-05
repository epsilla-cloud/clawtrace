import "./api-DNaE-3Yn.js";
import { t as normalizeXaiModelId } from "./model-id-VaIBLd62.js";
import { A as postTrustedWebToolsJson } from "./provider-web-search-I-919IKa.js";
import { c as wrapWebContent } from "./external-content-YqO3ih3d.js";
//#region extensions/xai/src/web-search-shared.ts
const XAI_WEB_SEARCH_ENDPOINT = "https://api.x.ai/v1/responses";
const XAI_DEFAULT_WEB_SEARCH_MODEL = "grok-4-1-fast";
function buildXaiWebSearchPayload(params) {
	return {
		query: params.query,
		provider: params.provider,
		model: params.model,
		tookMs: params.tookMs,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: params.provider,
			wrapped: true
		},
		content: wrapWebContent(params.content, "web_search"),
		citations: params.citations,
		...params.inlineCitations ? { inlineCitations: params.inlineCitations } : {}
	};
}
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function resolveXaiSearchConfig(searchConfig) {
	return asRecord(searchConfig?.grok) ?? {};
}
function resolveXaiWebSearchModel(searchConfig) {
	const config = resolveXaiSearchConfig(searchConfig);
	return typeof config.model === "string" && config.model.trim() ? normalizeXaiModelId(config.model.trim()) : XAI_DEFAULT_WEB_SEARCH_MODEL;
}
function resolveXaiInlineCitations(searchConfig) {
	return resolveXaiSearchConfig(searchConfig).inlineCitations === true;
}
function extractXaiWebSearchContent(data) {
	for (const output of data.output ?? []) {
		if (output.type === "message") {
			for (const block of output.content ?? []) if (block.type === "output_text" && typeof block.text === "string" && block.text) {
				const urls = (block.annotations ?? []).filter((annotation) => annotation.type === "url_citation" && typeof annotation.url === "string").map((annotation) => annotation.url);
				return {
					text: block.text,
					annotationCitations: [...new Set(urls)]
				};
			}
		}
		if (output.type === "output_text" && typeof output.text === "string" && output.text) {
			const urls = (output.annotations ?? []).filter((annotation) => annotation.type === "url_citation" && typeof annotation.url === "string").map((annotation) => annotation.url);
			return {
				text: output.text,
				annotationCitations: [...new Set(urls)]
			};
		}
	}
	return {
		text: typeof data.output_text === "string" ? data.output_text : void 0,
		annotationCitations: []
	};
}
async function requestXaiWebSearch(params) {
	return await postTrustedWebToolsJson({
		url: XAI_WEB_SEARCH_ENDPOINT,
		timeoutSeconds: params.timeoutSeconds,
		apiKey: params.apiKey,
		body: {
			model: params.model,
			input: [{
				role: "user",
				content: params.query
			}],
			tools: [{ type: "web_search" }]
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
export { resolveXaiWebSearchModel as a, resolveXaiInlineCitations as i, extractXaiWebSearchContent as n, requestXaiWebSearch as r, buildXaiWebSearchPayload as t };
