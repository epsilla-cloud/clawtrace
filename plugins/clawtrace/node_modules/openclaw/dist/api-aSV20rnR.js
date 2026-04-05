import { t as OPENCODE_GO_DEFAULT_MODEL_REF } from "./onboard-CQNkI04j.js";
//#region extensions/opencode-go/api.ts
function resolveCurrentPrimaryModel(model) {
	if (typeof model === "string") return model.trim() || void 0;
	if (model && typeof model === "object" && typeof model.primary === "string") return (model.primary || "").trim() || void 0;
}
function applyOpencodeGoModelDefault(cfg) {
	if (resolveCurrentPrimaryModel(cfg.agents?.defaults?.model) === "opencode-go/kimi-k2.5") return {
		next: cfg,
		changed: false
	};
	return {
		next: {
			...cfg,
			agents: {
				...cfg.agents,
				defaults: {
					...cfg.agents?.defaults,
					model: cfg.agents?.defaults?.model && typeof cfg.agents.defaults.model === "object" ? {
						...cfg.agents.defaults.model,
						primary: OPENCODE_GO_DEFAULT_MODEL_REF
					} : { primary: OPENCODE_GO_DEFAULT_MODEL_REF }
				}
			}
		},
		changed: true
	};
}
//#endregion
export { applyOpencodeGoModelDefault as t };
