import { Ed as isDirectiveOnly } from "./auth-profiles-B5ypC5S-.js";
import { t as handleDirectiveOnly } from "./directive-handling.impl-B8Gv3fE8.js";
import { t as resolveCurrentDirectiveLevels } from "./directive-handling.levels-D-jvEfe2.js";
//#region src/auto-reply/reply/directive-handling.fast-lane.ts
async function applyInlineDirectivesFastLane(params) {
	const { directives, commandAuthorized, ctx, cfg, agentId, isGroup, sessionEntry, sessionStore, sessionKey, storePath, elevatedEnabled, elevatedAllowed, elevatedFailures, messageProviderKey, defaultProvider, defaultModel, aliasIndex, allowedModelKeys, allowedModelCatalog, resetModelOverride, formatModelSwitchEvent, modelState } = params;
	let { provider, model } = params;
	if (!commandAuthorized || isDirectiveOnly({
		directives,
		cleanedBody: directives.cleaned,
		ctx,
		cfg,
		agentId,
		isGroup
	})) return {
		directiveAck: void 0,
		provider,
		model
	};
	const agentCfg = params.agentCfg;
	const { currentThinkLevel, currentFastMode, currentVerboseLevel, currentReasoningLevel, currentElevatedLevel } = await resolveCurrentDirectiveLevels({
		sessionEntry,
		agentCfg,
		resolveDefaultThinkingLevel: () => modelState.resolveDefaultThinkingLevel()
	});
	const directiveAck = await handleDirectiveOnly({
		cfg,
		directives,
		sessionEntry,
		sessionStore,
		sessionKey,
		storePath,
		elevatedEnabled,
		elevatedAllowed,
		elevatedFailures,
		messageProviderKey,
		defaultProvider,
		defaultModel,
		aliasIndex,
		allowedModelKeys,
		allowedModelCatalog,
		resetModelOverride,
		provider,
		model,
		initialModelLabel: params.initialModelLabel,
		formatModelSwitchEvent,
		currentThinkLevel,
		currentFastMode,
		currentVerboseLevel,
		currentReasoningLevel,
		currentElevatedLevel,
		surface: ctx.Surface,
		gatewayClientScopes: ctx.GatewayClientScopes
	});
	if (sessionEntry?.providerOverride) provider = sessionEntry.providerOverride;
	if (sessionEntry?.modelOverride) model = sessionEntry.modelOverride;
	return {
		directiveAck,
		provider,
		model
	};
}
//#endregion
export { applyInlineDirectivesFastLane };
