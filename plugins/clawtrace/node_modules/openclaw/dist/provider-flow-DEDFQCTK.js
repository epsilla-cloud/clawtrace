import { Es as resolvePluginProviders } from "./auth-profiles-B5ypC5S-.js";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-CHjie4bD.js";
import { r as resolveProviderWizardOptions, t as resolveProviderModelPickerEntries } from "./provider-wizard-CtC_W3FW.js";
import { n as sortFlowContributionsByLabel, t as mergeFlowContributions } from "./types-DwENoHgr.js";
//#region src/flows/provider-flow.ts
const DEFAULT_PROVIDER_FLOW_SCOPE = "text-inference";
function includesProviderFlowScope(scopes, scope) {
	return scopes ? scopes.includes(scope) : scope === DEFAULT_PROVIDER_FLOW_SCOPE;
}
function resolveProviderDocsById(params) {
	return new Map(resolvePluginProviders({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params?.env,
		bundledProviderAllowlistCompat: true,
		bundledProviderVitestCompat: true
	}).filter((provider) => Boolean(provider.docsPath?.trim())).map((provider) => [provider.id, provider.docsPath.trim()]));
}
function resolveManifestProviderSetupFlowContributions(params) {
	const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
	const docsByProvider = resolveProviderDocsById(params ?? {});
	return resolveManifestProviderAuthChoices(params).filter((choice) => includesProviderFlowScope(choice.onboardingScopes, scope)).map((choice) => ({
		id: `provider:setup:${choice.choiceId}`,
		kind: "provider",
		surface: "setup",
		providerId: choice.providerId,
		pluginId: choice.pluginId,
		option: {
			value: choice.choiceId,
			label: choice.choiceLabel,
			...choice.choiceHint ? { hint: choice.choiceHint } : {},
			...choice.groupId && choice.groupLabel ? { group: {
				id: choice.groupId,
				label: choice.groupLabel,
				...choice.groupHint ? { hint: choice.groupHint } : {}
			} } : {},
			...docsByProvider.get(choice.providerId) ? { docs: { path: docsByProvider.get(choice.providerId) } } : {}
		},
		...choice.onboardingScopes ? { onboardingScopes: [...choice.onboardingScopes] } : {},
		source: "manifest"
	}));
}
function resolveRuntimeFallbackProviderSetupFlowContributions(params) {
	const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
	return resolveProviderWizardOptions(params ?? {}).filter((option) => includesProviderFlowScope(option.onboardingScopes, scope)).map((option) => ({
		id: `provider:setup:${option.value}`,
		kind: "provider",
		surface: "setup",
		providerId: option.groupId,
		option: {
			value: option.value,
			label: option.label,
			...option.hint ? { hint: option.hint } : {},
			group: {
				id: option.groupId,
				label: option.groupLabel,
				...option.groupHint ? { hint: option.groupHint } : {}
			}
		},
		...option.onboardingScopes ? { onboardingScopes: [...option.onboardingScopes] } : {},
		source: "runtime"
	}));
}
function resolveProviderSetupFlowContributions(params) {
	return sortFlowContributionsByLabel(mergeFlowContributions({
		primary: resolveManifestProviderSetupFlowContributions(params),
		fallbacks: resolveRuntimeFallbackProviderSetupFlowContributions(params)
	}));
}
function resolveProviderModelPickerFlowEntries(params) {
	return resolveProviderModelPickerFlowContributions(params).map((contribution) => contribution.option);
}
function resolveProviderModelPickerFlowContributions(params) {
	const docsByProvider = resolveProviderDocsById(params ?? {});
	return sortFlowContributionsByLabel(resolveProviderModelPickerEntries(params ?? {}).map((entry) => {
		const providerId = entry.value.startsWith("provider-plugin:") ? entry.value.slice(16).split(":")[0] : entry.value;
		return {
			id: `provider:model-picker:${entry.value}`,
			kind: "provider",
			surface: "model-picker",
			providerId,
			option: {
				value: entry.value,
				label: entry.label,
				...entry.hint ? { hint: entry.hint } : {},
				...docsByProvider.get(providerId) ? { docs: { path: docsByProvider.get(providerId) } } : {}
			},
			source: "runtime"
		};
	}));
}
//#endregion
export { resolveProviderSetupFlowContributions as i, resolveProviderModelPickerFlowContributions as n, resolveProviderModelPickerFlowEntries as r, resolveManifestProviderSetupFlowContributions as t };
