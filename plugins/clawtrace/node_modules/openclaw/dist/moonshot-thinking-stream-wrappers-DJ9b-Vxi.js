import { streamSimple } from "@mariozechner/pi-ai";
//#region src/agents/pi-embedded-runner/stream-payload-utils.ts
function streamWithPayloadPatch(underlying, model, context, options, patchPayload) {
	const originalOnPayload = options?.onPayload;
	return underlying(model, context, {
		...options,
		onPayload: (payload) => {
			if (payload && typeof payload === "object") patchPayload(payload);
			return originalOnPayload?.(payload, model);
		}
	});
}
//#endregion
//#region src/agents/pi-embedded-runner/moonshot-thinking-stream-wrappers.ts
function normalizeMoonshotThinkingType(value) {
	if (typeof value === "boolean") return value ? "enabled" : "disabled";
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if ([
			"enabled",
			"enable",
			"on",
			"true"
		].includes(normalized)) return "enabled";
		if ([
			"disabled",
			"disable",
			"off",
			"false"
		].includes(normalized)) return "disabled";
		return;
	}
	if (value && typeof value === "object" && !Array.isArray(value)) return normalizeMoonshotThinkingType(value.type);
}
function isMoonshotToolChoiceCompatible(toolChoice) {
	if (toolChoice == null || toolChoice === "auto" || toolChoice === "none") return true;
	if (typeof toolChoice === "object" && !Array.isArray(toolChoice)) {
		const typeValue = toolChoice.type;
		return typeValue === "auto" || typeValue === "none";
	}
	return false;
}
function isPinnedToolChoice(toolChoice) {
	if (!toolChoice || typeof toolChoice !== "object" || Array.isArray(toolChoice)) return false;
	const typeValue = toolChoice.type;
	return typeValue === "tool" || typeValue === "function";
}
function resolveMoonshotThinkingType(params) {
	const configured = normalizeMoonshotThinkingType(params.configuredThinking);
	if (configured) return configured;
	if (!params.thinkingLevel) return;
	return params.thinkingLevel === "off" ? "disabled" : "enabled";
}
function createMoonshotThinkingWrapper(baseStreamFn, thinkingType) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
		let effectiveThinkingType = normalizeMoonshotThinkingType(payloadObj.thinking);
		if (thinkingType) {
			payloadObj.thinking = { type: thinkingType };
			effectiveThinkingType = thinkingType;
		}
		if (effectiveThinkingType === "enabled" && !isMoonshotToolChoiceCompatible(payloadObj.tool_choice)) {
			if (payloadObj.tool_choice === "required") payloadObj.tool_choice = "auto";
			else if (isPinnedToolChoice(payloadObj.tool_choice)) payloadObj.thinking = { type: "disabled" };
		}
	});
}
//#endregion
export { resolveMoonshotThinkingType as n, streamWithPayloadPatch as r, createMoonshotThinkingWrapper as t };
