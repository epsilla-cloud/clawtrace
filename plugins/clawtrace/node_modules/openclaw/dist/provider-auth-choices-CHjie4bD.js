import { i as normalizeProviderIdForAuth } from "./provider-id-Bd9aU9Z8.js";
import "./model-selection-CMtvxDDg.js";
import { n as loadPluginManifestRegistry } from "./manifest-registry-BYS0nlrs.js";
//#region src/plugins/provider-auth-choices.ts
function resolveManifestProviderAuthChoices(params) {
	return loadPluginManifestRegistry({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params?.env
	}).plugins.flatMap((plugin) => (plugin.providerAuthChoices ?? []).map((choice) => ({
		pluginId: plugin.id,
		providerId: choice.provider,
		methodId: choice.method,
		choiceId: choice.choiceId,
		choiceLabel: choice.choiceLabel ?? choice.choiceId,
		...choice.choiceHint ? { choiceHint: choice.choiceHint } : {},
		...choice.deprecatedChoiceIds ? { deprecatedChoiceIds: choice.deprecatedChoiceIds } : {},
		...choice.groupId ? { groupId: choice.groupId } : {},
		...choice.groupLabel ? { groupLabel: choice.groupLabel } : {},
		...choice.groupHint ? { groupHint: choice.groupHint } : {},
		...choice.optionKey ? { optionKey: choice.optionKey } : {},
		...choice.cliFlag ? { cliFlag: choice.cliFlag } : {},
		...choice.cliOption ? { cliOption: choice.cliOption } : {},
		...choice.cliDescription ? { cliDescription: choice.cliDescription } : {},
		...choice.onboardingScopes ? { onboardingScopes: choice.onboardingScopes } : {}
	})));
}
function resolveManifestProviderAuthChoice(choiceId, params) {
	const normalized = choiceId.trim();
	if (!normalized) return;
	return resolveManifestProviderAuthChoices(params).find((choice) => choice.choiceId === normalized);
}
function resolveManifestProviderApiKeyChoice(params) {
	const normalizedProviderId = normalizeProviderIdForAuth(params.providerId);
	if (!normalizedProviderId) return;
	return resolveManifestProviderAuthChoices(params).find((choice) => {
		if (!choice.optionKey) return false;
		return normalizeProviderIdForAuth(choice.providerId) === normalizedProviderId;
	});
}
function resolveManifestDeprecatedProviderAuthChoice(choiceId, params) {
	const normalized = choiceId.trim();
	if (!normalized) return;
	return resolveManifestProviderAuthChoices(params).find((choice) => choice.deprecatedChoiceIds?.includes(normalized));
}
function resolveManifestProviderOnboardAuthFlags(params) {
	const flags = [];
	const seen = /* @__PURE__ */ new Set();
	for (const choice of resolveManifestProviderAuthChoices(params)) {
		if (!choice.optionKey || !choice.cliFlag || !choice.cliOption) continue;
		const dedupeKey = `${choice.optionKey}::${choice.cliFlag}`;
		if (seen.has(dedupeKey)) continue;
		seen.add(dedupeKey);
		flags.push({
			optionKey: choice.optionKey,
			authChoice: choice.choiceId,
			cliFlag: choice.cliFlag,
			cliOption: choice.cliOption,
			description: choice.cliDescription ?? choice.choiceLabel
		});
	}
	return flags;
}
//#endregion
export { resolveManifestProviderOnboardAuthFlags as a, resolveManifestProviderAuthChoices as i, resolveManifestProviderApiKeyChoice as n, resolveManifestProviderAuthChoice as r, resolveManifestDeprecatedProviderAuthChoice as t };
