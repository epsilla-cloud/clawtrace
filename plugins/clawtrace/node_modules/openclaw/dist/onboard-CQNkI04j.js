import { p as withAgentModelAliases, t as applyAgentDefaultModelPrimary } from "./provider-onboard-B0AuPavZ.js";
//#region extensions/opencode-go/onboard.ts
const OPENCODE_GO_DEFAULT_MODEL_REF = "opencode-go/kimi-k2.5";
const OPENCODE_GO_ALIAS_DEFAULTS = {
	"opencode-go/kimi-k2.5": "Kimi",
	"opencode-go/glm-5": "GLM",
	"opencode-go/minimax-m2.5": "MiniMax"
};
function applyOpencodeGoProviderConfig(cfg) {
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models: withAgentModelAliases(cfg.agents?.defaults?.models, Object.entries(OPENCODE_GO_ALIAS_DEFAULTS).map(([modelRef, alias]) => ({
					modelRef,
					alias
				})))
			}
		}
	};
}
function applyOpencodeGoConfig(cfg) {
	return applyAgentDefaultModelPrimary(applyOpencodeGoProviderConfig(cfg), OPENCODE_GO_DEFAULT_MODEL_REF);
}
//#endregion
export { applyOpencodeGoConfig as n, applyOpencodeGoProviderConfig as r, OPENCODE_GO_DEFAULT_MODEL_REF as t };
