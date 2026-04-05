//#region src/agents/configured-provider-fallback.ts
function resolveConfiguredProviderFallback(params) {
	const configuredProviders = params.cfg.models?.providers;
	if (!configuredProviders || typeof configuredProviders !== "object") return null;
	if (configuredProviders[params.defaultProvider]) return null;
	const availableProvider = Object.entries(configuredProviders).find(([, providerCfg]) => providerCfg && Array.isArray(providerCfg.models) && providerCfg.models.length > 0 && providerCfg.models[0]?.id);
	if (!availableProvider) return null;
	const [provider, providerCfg] = availableProvider;
	return {
		provider,
		model: providerCfg.models[0].id
	};
}
//#endregion
export { resolveConfiguredProviderFallback as t };
