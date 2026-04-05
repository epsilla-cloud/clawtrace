import { t as OPENCODE_ZEN_DEFAULT_MODEL_REF } from "./onboard-2T33NEQ3.js";
//#region extensions/opencode/api.ts
const LEGACY_OPENCODE_ZEN_DEFAULT_MODELS = new Set(["opencode/claude-opus-4-5", "opencode-zen/claude-opus-4-5"]);
const OPENCODE_ZEN_DEFAULT_MODEL = OPENCODE_ZEN_DEFAULT_MODEL_REF;
function resolveCurrentPrimaryModel(model) {
	if (typeof model === "string") return model.trim() || void 0;
	if (model && typeof model === "object" && typeof model.primary === "string") return (model.primary || "").trim() || void 0;
}
function applyOpencodeZenModelDefault(cfg) {
	const current = resolveCurrentPrimaryModel(cfg.agents?.defaults?.model);
	if ((current && LEGACY_OPENCODE_ZEN_DEFAULT_MODELS.has(current) ? OPENCODE_ZEN_DEFAULT_MODEL : current) === OPENCODE_ZEN_DEFAULT_MODEL) return {
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
						primary: OPENCODE_ZEN_DEFAULT_MODEL
					} : { primary: OPENCODE_ZEN_DEFAULT_MODEL }
				}
			}
		},
		changed: true
	};
}
//#endregion
export { applyOpencodeZenModelDefault as n, OPENCODE_ZEN_DEFAULT_MODEL as t };
