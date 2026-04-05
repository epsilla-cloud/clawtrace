import { u as getRuntimeConfigSnapshot } from "./auth-profiles-B5ypC5S-.js";
import { t as normalizeXaiModelId } from "./model-id-VaIBLd62.js";
import { A as postTrustedWebToolsJson, M as readConfiguredSecretString, N as readProviderEnvValue, m as resolveProviderWebSearchPluginConfig } from "./provider-web-search-I-919IKa.js";
import { c as jsonResult, h as readStringParam } from "./common-B7JFWTj2.js";
import "./provider-models-B_HWys7n.js";
import { n as extractXaiWebSearchContent } from "./web-search-shared-CN1UlZDw.js";
import { Type } from "@sinclair/typebox";
//#region extensions/xai/src/code-execution-shared.ts
const XAI_CODE_EXECUTION_ENDPOINT = "https://api.x.ai/v1/responses";
const XAI_DEFAULT_CODE_EXECUTION_MODEL = "grok-4-1-fast";
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function resolveXaiCodeExecutionConfig(config) {
	return isRecord(config) ? config : {};
}
function resolveXaiCodeExecutionModel(config) {
	const resolved = resolveXaiCodeExecutionConfig(config);
	return typeof resolved.model === "string" && resolved.model.trim() ? normalizeXaiModelId(resolved.model.trim()) : XAI_DEFAULT_CODE_EXECUTION_MODEL;
}
function resolveXaiCodeExecutionMaxTurns(config) {
	const raw = resolveXaiCodeExecutionConfig(config).maxTurns;
	if (typeof raw !== "number" || !Number.isFinite(raw)) return;
	const normalized = Math.trunc(raw);
	return normalized > 0 ? normalized : void 0;
}
function buildXaiCodeExecutionPayload(params) {
	return {
		task: params.task,
		provider: "xai",
		model: params.model,
		tookMs: params.tookMs,
		content: params.content,
		citations: params.citations,
		usedCodeExecution: params.usedCodeExecution,
		outputTypes: params.outputTypes
	};
}
async function requestXaiCodeExecution(params) {
	return await postTrustedWebToolsJson({
		url: XAI_CODE_EXECUTION_ENDPOINT,
		timeoutSeconds: params.timeoutSeconds,
		apiKey: params.apiKey,
		body: {
			model: params.model,
			input: [{
				role: "user",
				content: params.task
			}],
			tools: [{ type: "code_interpreter" }],
			...params.maxTurns ? { max_turns: params.maxTurns } : {}
		},
		errorLabel: "xAI"
	}, async (response) => {
		const data = await response.json();
		const { text, annotationCitations } = extractXaiWebSearchContent(data);
		const outputTypes = Array.isArray(data.output) ? [...new Set(data.output.map((entry) => entry?.type).filter((value) => Boolean(value)))] : [];
		const citations = Array.isArray(data.citations) && data.citations.length > 0 ? data.citations : annotationCitations;
		return {
			content: text ?? "No response",
			citations,
			usedCodeExecution: outputTypes.includes("code_interpreter_call"),
			outputTypes
		};
	});
}
//#endregion
//#region extensions/xai/code-execution.ts
function readCodeExecutionConfigRecord(config) {
	return config && typeof config === "object" ? config : void 0;
}
function readLegacyGrokApiKey(cfg) {
	const search = cfg?.tools?.web?.search;
	if (!search || typeof search !== "object") return;
	const grok = search.grok;
	return readConfiguredSecretString(grok && typeof grok === "object" ? grok.apiKey : void 0, "tools.web.search.grok.apiKey");
}
function readPluginCodeExecutionConfig(cfg) {
	const entries = cfg?.plugins?.entries;
	if (!entries || typeof entries !== "object") return;
	const xaiEntry = entries.xai;
	if (!xaiEntry || typeof xaiEntry !== "object") return;
	const config = xaiEntry.config;
	if (!config || typeof config !== "object") return;
	const codeExecution = config.codeExecution;
	if (!codeExecution || typeof codeExecution !== "object") return;
	return codeExecution;
}
function resolveFallbackXaiApiKey(cfg) {
	return readConfiguredSecretString(resolveProviderWebSearchPluginConfig(cfg, "xai")?.apiKey, "plugins.entries.xai.config.webSearch.apiKey") ?? readLegacyGrokApiKey(cfg);
}
function resolveCodeExecutionEnabled(params) {
	if (readCodeExecutionConfigRecord(params.config)?.enabled === false) return false;
	return Boolean(resolveFallbackXaiApiKey(params.runtimeConfig) ?? resolveFallbackXaiApiKey(params.sourceConfig) ?? readProviderEnvValue(["XAI_API_KEY"]));
}
function createCodeExecutionTool(options) {
	const runtimeConfig = options?.runtimeConfig ?? getRuntimeConfigSnapshot();
	const codeExecutionConfig = readPluginCodeExecutionConfig(runtimeConfig ?? void 0) ?? readPluginCodeExecutionConfig(options?.config);
	if (!resolveCodeExecutionEnabled({
		sourceConfig: options?.config,
		runtimeConfig: runtimeConfig ?? void 0,
		config: codeExecutionConfig
	})) return null;
	return {
		label: "Code Execution",
		name: "code_execution",
		description: "Run sandboxed Python analysis with xAI. Use for calculations, tabulation, summaries, and chart-style analysis without local machine access.",
		parameters: Type.Object({ task: Type.String({ description: "The full analysis task for xAI's remote Python sandbox. Include any data to analyze directly in the task." }) }),
		execute: async (_toolCallId, args) => {
			const apiKey = resolveFallbackXaiApiKey(runtimeConfig ?? void 0) ?? resolveFallbackXaiApiKey(options?.config) ?? readProviderEnvValue(["XAI_API_KEY"]);
			if (!apiKey) return jsonResult({
				error: "missing_xai_api_key",
				message: "code_execution needs an xAI API key. Set XAI_API_KEY in the Gateway environment, or configure plugins.entries.xai.config.webSearch.apiKey.",
				docs: "https://docs.openclaw.ai/tools/code-execution"
			});
			const task = readStringParam(args, "task", { required: true });
			const codeExecutionConfigRecord = readCodeExecutionConfigRecord(codeExecutionConfig);
			const model = resolveXaiCodeExecutionModel(codeExecutionConfigRecord);
			const maxTurns = resolveXaiCodeExecutionMaxTurns(codeExecutionConfigRecord);
			const timeoutSeconds = typeof codeExecutionConfigRecord?.timeoutSeconds === "number" && Number.isFinite(codeExecutionConfigRecord.timeoutSeconds) ? codeExecutionConfigRecord.timeoutSeconds : 30;
			const startedAt = Date.now();
			const result = await requestXaiCodeExecution({
				apiKey,
				model,
				timeoutSeconds,
				maxTurns,
				task
			});
			return jsonResult(buildXaiCodeExecutionPayload({
				task,
				model,
				tookMs: Date.now() - startedAt,
				content: result.content,
				citations: result.citations,
				usedCodeExecution: result.usedCodeExecution,
				outputTypes: result.outputTypes
			}));
		}
	};
}
//#endregion
export { createCodeExecutionTool as t };
