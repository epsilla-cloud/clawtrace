import { s as MODELSTUDIO_MODEL_CATALOG, t as MODELSTUDIO_BASE_URL } from "./models-DS5W-29W.js";
//#region extensions/modelstudio/provider-catalog.ts
function buildModelStudioProvider() {
	return {
		baseUrl: MODELSTUDIO_BASE_URL,
		api: "openai-completions",
		models: MODELSTUDIO_MODEL_CATALOG.map((model) => ({ ...model }))
	};
}
//#endregion
export { buildModelStudioProvider as t };
