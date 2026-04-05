import { t as applyAgentDefaultModelPrimary } from "./provider-onboard-B0AuPavZ.js";
//#region extensions/vercel-ai-gateway/onboard.ts
const VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF = "vercel-ai-gateway/anthropic/claude-opus-4.6";
function applyVercelAiGatewayProviderConfig(cfg) {
	const models = { ...cfg.agents?.defaults?.models };
	models[VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF] = {
		...models[VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF],
		alias: models["vercel-ai-gateway/anthropic/claude-opus-4.6"]?.alias ?? "Vercel AI Gateway"
	};
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models
			}
		}
	};
}
function applyVercelAiGatewayConfig(cfg) {
	return applyAgentDefaultModelPrimary(applyVercelAiGatewayProviderConfig(cfg), VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF);
}
//#endregion
export { applyVercelAiGatewayConfig as n, applyVercelAiGatewayProviderConfig as r, VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF as t };
