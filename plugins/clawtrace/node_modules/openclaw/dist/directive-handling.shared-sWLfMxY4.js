import { IF as prefixSystemMessage, Lf as resolveModelDirectiveSelection, PF as SYSTEM_MARK } from "./auth-profiles-B5ypC5S-.js";
import { n as ensureAuthProfileStore } from "./store-BpAvd-ka.js";
import { i as normalizeProviderIdForAuth } from "./provider-id-Bd9aU9Z8.js";
import { l as modelKey, v as resolveModelRefFromString } from "./model-selection-CMtvxDDg.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import { o as isInternalMessageChannel } from "./message-channel-BaBrchOc.js";
//#region src/auto-reply/reply/directive-handling.auth-profile.ts
function resolveProfileOverride(params) {
	const raw = params.rawProfile?.trim();
	if (!raw) return {};
	const profile = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }).profiles[raw];
	if (!profile) return { error: `Auth profile "${raw}" not found.` };
	if (profile.provider !== params.provider) return { error: `Auth profile "${raw}" is for ${profile.provider}, not ${params.provider}.` };
	return { profileId: raw };
}
//#endregion
//#region src/auto-reply/reply/directive-handling.model-selection.ts
function resolveStoredNumericProfileModelDirective(params) {
	const trimmed = params.raw.trim();
	const lastSlash = trimmed.lastIndexOf("/");
	const profileDelimiter = trimmed.indexOf("@", lastSlash + 1);
	if (profileDelimiter <= 0) return null;
	const profileId = trimmed.slice(profileDelimiter + 1).trim();
	if (!/^\d{8}$/.test(profileId)) return null;
	const modelRaw = trimmed.slice(0, profileDelimiter).trim();
	if (!modelRaw) return null;
	const profile = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }).profiles[profileId];
	if (!profile) return null;
	return {
		modelRaw,
		profileId,
		profileProvider: profile.provider
	};
}
function resolveModelSelectionFromDirective(params) {
	if (!params.directives.hasModelDirective || !params.directives.rawModelDirective) {
		if (params.directives.rawModelProfile) return { errorText: "Auth profile override requires a model selection." };
		return {};
	}
	const raw = params.directives.rawModelDirective.trim();
	const storedNumericProfile = params.directives.rawModelProfile === void 0 ? resolveStoredNumericProfileModelDirective({
		raw,
		agentDir: params.agentDir
	}) : null;
	const storedNumericProfileSelection = storedNumericProfile ? resolveModelDirectiveSelection({
		raw: storedNumericProfile.modelRaw,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		aliasIndex: params.aliasIndex,
		allowedModelKeys: params.allowedModelKeys
	}) : null;
	const useStoredNumericProfile = Boolean(storedNumericProfileSelection?.selection) && normalizeProviderIdForAuth(storedNumericProfileSelection?.selection?.provider ?? "") === normalizeProviderIdForAuth(storedNumericProfile?.profileProvider ?? "");
	const modelRaw = useStoredNumericProfile && storedNumericProfile ? storedNumericProfile.modelRaw : raw;
	let modelSelection;
	if (/^[0-9]+$/.test(raw)) return { errorText: [
		"Numeric model selection is not supported in chat.",
		"",
		"Browse: /models or /models <provider>",
		"Switch: /model <provider/model>"
	].join("\n") };
	const explicit = resolveModelRefFromString({
		raw: modelRaw,
		defaultProvider: params.defaultProvider,
		aliasIndex: params.aliasIndex
	});
	if (explicit) {
		const explicitKey = modelKey(explicit.ref.provider, explicit.ref.model);
		if (params.allowedModelKeys.size === 0 || params.allowedModelKeys.has(explicitKey)) modelSelection = {
			provider: explicit.ref.provider,
			model: explicit.ref.model,
			isDefault: explicit.ref.provider === params.defaultProvider && explicit.ref.model === params.defaultModel,
			...explicit.alias ? { alias: explicit.alias } : {}
		};
	}
	if (!modelSelection) {
		const resolved = resolveModelDirectiveSelection({
			raw: modelRaw,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel,
			aliasIndex: params.aliasIndex,
			allowedModelKeys: params.allowedModelKeys
		});
		if (resolved.error) return { errorText: resolved.error };
		if (resolved.selection) modelSelection = resolved.selection;
	}
	let profileOverride;
	const rawProfile = params.directives.rawModelProfile ?? (useStoredNumericProfile ? storedNumericProfile?.profileId : void 0);
	if (modelSelection && rawProfile) {
		const profileResolved = resolveProfileOverride({
			rawProfile,
			provider: modelSelection.provider,
			cfg: params.cfg,
			agentDir: params.agentDir
		});
		if (profileResolved.error) return { errorText: profileResolved.error };
		profileOverride = profileResolved.profileId;
	}
	return {
		modelSelection,
		profileOverride
	};
}
//#endregion
//#region src/auto-reply/reply/directive-handling.shared.ts
const formatDirectiveAck = (text) => {
	return prefixSystemMessage(text);
};
const formatOptionsLine = (options) => `Options: ${options}.`;
const withOptions = (line, options) => `${line}\n${formatOptionsLine(options)}`;
const formatElevatedRuntimeHint = () => `${SYSTEM_MARK} Runtime is direct; sandboxing does not apply.`;
const formatInternalExecPersistenceDeniedText = () => "Exec defaults require operator.admin for internal gateway callers; skipped persistence.";
const formatInternalVerbosePersistenceDeniedText = () => "Verbose defaults require operator.admin for internal gateway callers; skipped persistence.";
const formatInternalVerboseCurrentReplyOnlyText = () => "Verbose logging set for the current reply only.";
function canPersistInternalDirective(params) {
	if (!isInternalMessageChannel(isInternalMessageChannel(params.messageProvider) ? params.messageProvider : params.surface)) return true;
	return (params.gatewayClientScopes ?? []).includes("operator.admin");
}
const canPersistInternalExecDirective = canPersistInternalDirective;
const canPersistInternalVerboseDirective = canPersistInternalDirective;
const formatElevatedEvent = (level) => {
	if (level === "full") return "Elevated FULL — exec runs on host with auto-approval.";
	if (level === "ask" || level === "on") return "Elevated ASK — exec runs on host; approvals may still apply.";
	return "Elevated OFF — exec stays in sandbox.";
};
const formatReasoningEvent = (level) => {
	if (level === "stream") return "Reasoning STREAM — emit live <think>.";
	if (level === "on") return "Reasoning ON — include <think>.";
	return "Reasoning OFF — hide <think>.";
};
function enqueueModeSwitchEvents(params) {
	if (params.elevatedChanged) {
		const nextElevated = params.sessionEntry.elevatedLevel ?? "off";
		params.enqueueSystemEvent(formatElevatedEvent(nextElevated), {
			sessionKey: params.sessionKey,
			contextKey: "mode:elevated"
		});
	}
	if (params.reasoningChanged) {
		const nextReasoning = params.sessionEntry.reasoningLevel ?? "off";
		params.enqueueSystemEvent(formatReasoningEvent(nextReasoning), {
			sessionKey: params.sessionKey,
			contextKey: "mode:reasoning"
		});
	}
}
function formatElevatedUnavailableText(params) {
	const lines = [];
	lines.push(`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`);
	const failures = params.failures ?? [];
	if (failures.length > 0) lines.push(`Failing gates: ${failures.map((f) => `${f.gate} (${f.key})`).join(", ")}`);
	else lines.push("Fix-it keys: tools.elevated.enabled, tools.elevated.allowFrom.<provider>, agents.list[].tools.elevated.*");
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`openclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { formatElevatedRuntimeHint as a, formatInternalVerboseCurrentReplyOnlyText as c, resolveModelSelectionFromDirective as d, formatDirectiveAck as i, formatInternalVerbosePersistenceDeniedText as l, canPersistInternalVerboseDirective as n, formatElevatedUnavailableText as o, enqueueModeSwitchEvents as r, formatInternalExecPersistenceDeniedText as s, canPersistInternalExecDirective as t, withOptions as u };
