//#region extensions/openai/openai-codex-catalog.ts
const OPENAI_CODEX_BASE_URL = "https://chatgpt.com/backend-api";
function buildOpenAICodexProvider() {
	return {
		baseUrl: OPENAI_CODEX_BASE_URL,
		api: "openai-codex-responses",
		models: []
	};
}
//#endregion
export { buildOpenAICodexProvider as n, OPENAI_CODEX_BASE_URL as t };
