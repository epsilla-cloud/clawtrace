import { _ as OLLAMA_DEFAULT_COST, h as OLLAMA_DEFAULT_BASE_URL, v as OLLAMA_DEFAULT_MAX_TOKENS } from "./stream-CBdzTVlm.js";
//#region extensions/ollama/src/provider-models.ts
const OLLAMA_SHOW_CONCURRENCY = 8;
function resolveOllamaApiBase(configuredBaseUrl) {
	if (!configuredBaseUrl) return OLLAMA_DEFAULT_BASE_URL;
	return configuredBaseUrl.replace(/\/+$/, "").replace(/\/v1$/i, "");
}
async function queryOllamaContextWindow(apiBase, modelName) {
	try {
		const response = await fetch(`${apiBase}/api/show`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: modelName }),
			signal: AbortSignal.timeout(3e3)
		});
		if (!response.ok) return;
		const data = await response.json();
		if (!data.model_info) return;
		for (const [key, value] of Object.entries(data.model_info)) if (key.endsWith(".context_length") && typeof value === "number" && Number.isFinite(value)) {
			const contextWindow = Math.floor(value);
			if (contextWindow > 0) return contextWindow;
		}
		return;
	} catch {
		return;
	}
}
async function enrichOllamaModelsWithContext(apiBase, models, opts) {
	const concurrency = Math.max(1, Math.floor(opts?.concurrency ?? OLLAMA_SHOW_CONCURRENCY));
	const enriched = [];
	for (let index = 0; index < models.length; index += concurrency) {
		const batch = models.slice(index, index + concurrency);
		const batchResults = await Promise.all(batch.map(async (model) => ({
			...model,
			contextWindow: await queryOllamaContextWindow(apiBase, model.name)
		})));
		enriched.push(...batchResults);
	}
	return enriched;
}
function isReasoningModelHeuristic(modelId) {
	return /r1|reasoning|think|reason/i.test(modelId);
}
function buildOllamaModelDefinition(modelId, contextWindow) {
	return {
		id: modelId,
		name: modelId,
		reasoning: isReasoningModelHeuristic(modelId),
		input: ["text"],
		cost: OLLAMA_DEFAULT_COST,
		contextWindow: contextWindow ?? 128e3,
		maxTokens: OLLAMA_DEFAULT_MAX_TOKENS
	};
}
async function fetchOllamaModels(baseUrl) {
	try {
		const apiBase = resolveOllamaApiBase(baseUrl);
		const response = await fetch(`${apiBase}/api/tags`, { signal: AbortSignal.timeout(5e3) });
		if (!response.ok) return {
			reachable: true,
			models: []
		};
		return {
			reachable: true,
			models: ((await response.json()).models ?? []).filter((m) => m.name)
		};
	} catch {
		return {
			reachable: false,
			models: []
		};
	}
}
//#endregion
export { queryOllamaContextWindow as a, isReasoningModelHeuristic as i, enrichOllamaModelsWithContext as n, resolveOllamaApiBase as o, fetchOllamaModels as r, buildOllamaModelDefinition as t };
