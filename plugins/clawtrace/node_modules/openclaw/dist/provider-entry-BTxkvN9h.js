import { t as definePluginEntry } from "./plugin-entry-BFhzQSoP.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-dVvNnCb0.js";
import { n as buildSingleProviderApiKeyCatalog } from "./provider-catalog-shared-3VsF9z0G.js";
//#region src/plugin-sdk/provider-entry.ts
function resolveWizardSetup(params) {
	if (params.auth.wizard === false) return;
	const wizard = params.auth.wizard ?? {};
	const methodId = params.auth.methodId.trim();
	return {
		choiceId: wizard.choiceId ?? `${params.providerId}-${methodId}`,
		choiceLabel: wizard.choiceLabel ?? params.auth.label,
		...wizard.choiceHint ? { choiceHint: wizard.choiceHint } : {},
		groupId: wizard.groupId ?? params.providerId,
		groupLabel: wizard.groupLabel ?? params.providerLabel,
		...wizard.groupHint ?? params.auth.hint ? { groupHint: wizard.groupHint ?? params.auth.hint } : {},
		methodId,
		...wizard.onboardingScopes ? { onboardingScopes: wizard.onboardingScopes } : {},
		...wizard.modelAllowlist ? { modelAllowlist: wizard.modelAllowlist } : {}
	};
}
function resolveEnvVars(params) {
	const combined = [...params.envVars ?? [], ...(params.auth ?? []).map((entry) => entry.envVar).filter(Boolean)].map((value) => value.trim()).filter(Boolean);
	return combined.length > 0 ? [...new Set(combined)] : void 0;
}
function defineSingleProviderPluginEntry(options) {
	return definePluginEntry({
		id: options.id,
		name: options.name,
		description: options.description,
		...options.kind ? { kind: options.kind } : {},
		...options.configSchema ? { configSchema: options.configSchema } : {},
		register(api) {
			const provider = options.provider;
			if (provider) {
				const providerId = provider.id ?? options.id;
				const envVars = resolveEnvVars({
					envVars: provider.envVars,
					auth: provider.auth
				});
				const auth = (provider.auth ?? []).map((entry) => {
					const { wizard: _wizard, ...authParams } = entry;
					const wizard = resolveWizardSetup({
						providerId,
						providerLabel: provider.label,
						auth: entry
					});
					return createProviderApiKeyAuthMethod({
						...authParams,
						providerId,
						expectedProviders: entry.expectedProviders ?? [providerId],
						...wizard ? { wizard } : {}
					});
				});
				api.registerProvider({
					id: providerId,
					label: provider.label,
					docsPath: provider.docsPath,
					...provider.aliases ? { aliases: provider.aliases } : {},
					...envVars ? { envVars } : {},
					auth,
					catalog: {
						order: "simple",
						run: (ctx) => buildSingleProviderApiKeyCatalog({
							ctx,
							providerId,
							buildProvider: provider.catalog.buildProvider,
							...provider.catalog.allowExplicitBaseUrl ? { allowExplicitBaseUrl: true } : {}
						})
					},
					...Object.fromEntries(Object.entries(provider).filter(([key]) => ![
						"id",
						"label",
						"docsPath",
						"aliases",
						"envVars",
						"auth",
						"catalog"
					].includes(key)))
				});
			}
			options.register?.(api);
		}
	});
}
//#endregion
export { defineSingleProviderPluginEntry as t };
