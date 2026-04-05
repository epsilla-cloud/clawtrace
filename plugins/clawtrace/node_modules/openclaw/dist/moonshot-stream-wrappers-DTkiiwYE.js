import { r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
import { r as streamWithPayloadPatch } from "./moonshot-thinking-stream-wrappers-DJ9b-Vxi.js";
import { streamSimple } from "@mariozechner/pi-ai";
//#region src/agents/moonshot-provider-compat.ts
const MOONSHOT_THINKING_PAYLOAD_COMPAT_PROVIDERS = new Set(["moonshot", "kimi"]);
function usesMoonshotThinkingPayloadCompatStatic(provider) {
	return provider != null && MOONSHOT_THINKING_PAYLOAD_COMPAT_PROVIDERS.has(provider);
}
//#endregion
//#region src/agents/pi-embedded-runner/moonshot-stream-wrappers.ts
function shouldApplySiliconFlowThinkingOffCompat(params) {
	return params.provider === "siliconflow" && params.thinkingLevel === "off" && params.modelId.startsWith("Pro/");
}
function shouldApplyMoonshotPayloadCompat(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const normalizedModelId = params.modelId.trim().toLowerCase();
	if (usesMoonshotThinkingPayloadCompatStatic(normalizedProvider)) return true;
	return normalizedProvider === "ollama" && normalizedModelId.startsWith("kimi-k") && normalizedModelId.includes(":cloud");
}
function createSiliconFlowThinkingWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
		if (payloadObj.thinking === "off") payloadObj.thinking = null;
	});
}
//#endregion
export { shouldApplyMoonshotPayloadCompat as n, shouldApplySiliconFlowThinkingOffCompat as r, createSiliconFlowThinkingWrapper as t };
