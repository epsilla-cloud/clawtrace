import { t as buildVercelAiGatewayProvider } from "../../api-BDCK7igT.js";
import { n as applyVercelAiGatewayConfig, t as VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF } from "../../onboard-BR8M5vMM.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-BTxkvN9h.js";
var vercel_ai_gateway_default = defineSingleProviderPluginEntry({
	id: "vercel-ai-gateway",
	name: "Vercel AI Gateway Provider",
	description: "Bundled Vercel AI Gateway provider plugin",
	provider: {
		label: "Vercel AI Gateway",
		docsPath: "/providers/vercel-ai-gateway",
		auth: [{
			methodId: "api-key",
			label: "Vercel AI Gateway API key",
			hint: "API key",
			optionKey: "aiGatewayApiKey",
			flagName: "--ai-gateway-api-key",
			envVar: "AI_GATEWAY_API_KEY",
			promptMessage: "Enter Vercel AI Gateway API key",
			defaultModel: VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyVercelAiGatewayConfig(cfg),
			wizard: {
				choiceId: "ai-gateway-api-key",
				groupId: "ai-gateway"
			}
		}],
		catalog: { buildProvider: buildVercelAiGatewayProvider }
	}
});
//#endregion
export { vercel_ai_gateway_default as default };
