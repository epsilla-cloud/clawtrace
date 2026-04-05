import { c as discoverVercelAiGatewayModels, t as VERCEL_AI_GATEWAY_BASE_URL } from "./models-Dsu05WD0.js";
//#region extensions/vercel-ai-gateway/provider-catalog.ts
async function buildVercelAiGatewayProvider() {
	return {
		baseUrl: VERCEL_AI_GATEWAY_BASE_URL,
		api: "anthropic-messages",
		models: await discoverVercelAiGatewayModels()
	};
}
//#endregion
export { buildVercelAiGatewayProvider as t };
