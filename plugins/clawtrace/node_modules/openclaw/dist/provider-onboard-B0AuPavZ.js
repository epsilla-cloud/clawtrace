//#region src/plugin-sdk/provider-onboard.ts
const DEFAULT_PROVIDER = "anthropic";
function normalizeProviderId(provider) {
	const normalized = provider.trim().toLowerCase();
	if (normalized === "z.ai" || normalized === "z-ai") return "zai";
	if (normalized === "opencode-zen") return "opencode";
	if (normalized === "opencode-go-auth") return "opencode-go";
	if (normalized === "kimi" || normalized === "kimi-code" || normalized === "kimi-coding") return "kimi";
	if (normalized === "bedrock" || normalized === "aws-bedrock") return "amazon-bedrock";
	if (normalized === "bytedance" || normalized === "doubao") return "volcengine";
	return normalized;
}
function findNormalizedProviderKey(entries, provider) {
	if (!entries) return;
	const providerKey = normalizeProviderId(provider);
	return Object.keys(entries).find((key) => normalizeProviderId(key) === providerKey);
}
function modelKey(provider, model) {
	const providerId = provider.trim();
	const modelId = model.trim();
	if (!providerId) return modelId;
	if (!modelId) return providerId;
	return modelId.toLowerCase().startsWith(`${providerId.toLowerCase()}/`) ? modelId : `${providerId}/${modelId}`;
}
function parseModelRef(raw, defaultProvider) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const slash = trimmed.indexOf("/");
	if (slash === -1) return {
		provider: normalizeProviderId(defaultProvider),
		model: trimmed
	};
	const providerRaw = trimmed.slice(0, slash).trim();
	const model = trimmed.slice(slash + 1).trim();
	if (!providerRaw || !model) return null;
	return {
		provider: normalizeProviderId(providerRaw),
		model
	};
}
function resolveAllowlistModelKey(raw, defaultProvider) {
	const parsed = parseModelRef(raw, defaultProvider);
	if (!parsed) return null;
	return modelKey(parsed.provider, parsed.model);
}
function extractAgentDefaultModelFallbacks(model) {
	if (!model || typeof model !== "object") return;
	if (!("fallbacks" in model)) return;
	const fallbacks = model.fallbacks;
	return Array.isArray(fallbacks) ? fallbacks.map((value) => String(value)) : void 0;
}
function normalizeAgentModelAliasEntry(entry) {
	if (typeof entry === "string") return { modelRef: entry };
	return entry;
}
function resolveProviderModelMergeState(cfg, providerId) {
	const providers = { ...cfg.models?.providers };
	const existingProviderKey = findNormalizedProviderKey(providers, providerId);
	const existingProvider = existingProviderKey !== void 0 ? providers[existingProviderKey] : void 0;
	const existingModels = Array.isArray(existingProvider?.models) ? existingProvider.models : [];
	if (existingProviderKey && existingProviderKey !== providerId) delete providers[existingProviderKey];
	return {
		providers,
		existingProvider,
		existingModels
	};
}
function buildProviderConfig(params) {
	const { apiKey: existingApiKey, ...existingProviderRest } = params.existingProvider ?? {};
	const normalizedApiKey = typeof existingApiKey === "string" ? existingApiKey.trim() : void 0;
	return {
		...existingProviderRest,
		baseUrl: params.baseUrl,
		api: params.api,
		...normalizedApiKey ? { apiKey: normalizedApiKey } : {},
		models: params.mergedModels.length > 0 ? params.mergedModels : params.fallbackModels
	};
}
function applyProviderConfigWithMergedModels(cfg, params) {
	params.providerState.providers[params.providerId] = buildProviderConfig({
		existingProvider: params.providerState.existingProvider,
		api: params.api,
		baseUrl: params.baseUrl,
		mergedModels: params.mergedModels,
		fallbackModels: params.fallbackModels
	});
	return applyOnboardAuthAgentModelsAndProviders(cfg, {
		agentModels: params.agentModels,
		providers: params.providerState.providers
	});
}
function createProviderPresetAppliers(params) {
	return {
		applyProviderConfig(cfg, ...args) {
			const resolved = params.resolveParams(cfg, ...args);
			return resolved ? params.applyPreset(cfg, resolved) : cfg;
		},
		applyConfig(cfg, ...args) {
			const resolved = params.resolveParams(cfg, ...args);
			if (!resolved) return cfg;
			return params.applyPreset(cfg, {
				...resolved,
				primaryModelRef: params.primaryModelRef
			});
		}
	};
}
function withAgentModelAliases(existing, aliases) {
	const next = { ...existing };
	for (const entry of aliases) {
		const normalized = normalizeAgentModelAliasEntry(entry);
		next[normalized.modelRef] = {
			...next[normalized.modelRef],
			...normalized.alias ? { alias: next[normalized.modelRef]?.alias ?? normalized.alias } : {}
		};
	}
	return next;
}
function applyOnboardAuthAgentModelsAndProviders(cfg, params) {
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models: params.agentModels
			}
		},
		models: {
			mode: cfg.models?.mode ?? "merge",
			providers: params.providers
		}
	};
}
function applyAgentDefaultModelPrimary(cfg, primary) {
	const existingFallbacks = extractAgentDefaultModelFallbacks(cfg.agents?.defaults?.model);
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				model: {
					...existingFallbacks ? { fallbacks: existingFallbacks } : void 0,
					primary
				}
			}
		}
	};
}
function applyProviderConfigWithDefaultModels(cfg, params) {
	const providerState = resolveProviderModelMergeState(cfg, params.providerId);
	const defaultModels = params.defaultModels;
	const defaultModelId = params.defaultModelId ?? defaultModels[0]?.id;
	const hasDefaultModel = defaultModelId ? providerState.existingModels.some((model) => model.id === defaultModelId) : true;
	const mergedModels = providerState.existingModels.length > 0 ? hasDefaultModel || defaultModels.length === 0 ? providerState.existingModels : [...providerState.existingModels, ...defaultModels] : defaultModels;
	return applyProviderConfigWithMergedModels(cfg, {
		agentModels: params.agentModels,
		providerId: params.providerId,
		providerState,
		api: params.api,
		baseUrl: params.baseUrl,
		mergedModels,
		fallbackModels: defaultModels
	});
}
function applyProviderConfigWithDefaultModel(cfg, params) {
	return applyProviderConfigWithDefaultModels(cfg, {
		agentModels: params.agentModels,
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		defaultModels: [params.defaultModel],
		defaultModelId: params.defaultModelId ?? params.defaultModel.id
	});
}
function applyProviderConfigWithDefaultModelPreset(cfg, params) {
	const next = applyProviderConfigWithDefaultModel(cfg, {
		agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		defaultModel: params.defaultModel,
		defaultModelId: params.defaultModelId
	});
	return params.primaryModelRef ? applyAgentDefaultModelPrimary(next, params.primaryModelRef) : next;
}
function createDefaultModelPresetAppliers(params) {
	return createProviderPresetAppliers({
		resolveParams: params.resolveParams,
		applyPreset: applyProviderConfigWithDefaultModelPreset,
		primaryModelRef: params.primaryModelRef
	});
}
function applyProviderConfigWithDefaultModelsPreset(cfg, params) {
	const next = applyProviderConfigWithDefaultModels(cfg, {
		agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		defaultModels: params.defaultModels,
		defaultModelId: params.defaultModelId
	});
	return params.primaryModelRef ? applyAgentDefaultModelPrimary(next, params.primaryModelRef) : next;
}
function createDefaultModelsPresetAppliers(params) {
	return createProviderPresetAppliers({
		resolveParams: params.resolveParams,
		applyPreset: applyProviderConfigWithDefaultModelsPreset,
		primaryModelRef: params.primaryModelRef
	});
}
function applyProviderConfigWithModelCatalog(cfg, params) {
	const providerState = resolveProviderModelMergeState(cfg, params.providerId);
	const catalogModels = params.catalogModels;
	const mergedModels = providerState.existingModels.length > 0 ? [...providerState.existingModels, ...catalogModels.filter((model) => !providerState.existingModels.some((existing) => existing.id === model.id))] : catalogModels;
	return applyProviderConfigWithMergedModels(cfg, {
		agentModels: params.agentModels,
		providerId: params.providerId,
		providerState,
		api: params.api,
		baseUrl: params.baseUrl,
		mergedModels,
		fallbackModels: catalogModels
	});
}
function applyProviderConfigWithModelCatalogPreset(cfg, params) {
	const next = applyProviderConfigWithModelCatalog(cfg, {
		agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
		providerId: params.providerId,
		api: params.api,
		baseUrl: params.baseUrl,
		catalogModels: params.catalogModels
	});
	return params.primaryModelRef ? applyAgentDefaultModelPrimary(next, params.primaryModelRef) : next;
}
function createModelCatalogPresetAppliers(params) {
	return createProviderPresetAppliers({
		resolveParams: params.resolveParams,
		applyPreset: applyProviderConfigWithModelCatalogPreset,
		primaryModelRef: params.primaryModelRef
	});
}
function ensureModelAllowlistEntry(params) {
	const rawModelRef = params.modelRef.trim();
	if (!rawModelRef) return params.cfg;
	const models = { ...params.cfg.agents?.defaults?.models };
	const keySet = new Set([rawModelRef]);
	const canonicalKey = resolveAllowlistModelKey(rawModelRef, params.defaultProvider ?? DEFAULT_PROVIDER);
	if (canonicalKey) keySet.add(canonicalKey);
	for (const key of keySet) models[key] = { ...models[key] };
	return {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			defaults: {
				...params.cfg.agents?.defaults,
				models
			}
		}
	};
}
//#endregion
export { applyProviderConfigWithDefaultModels as a, applyProviderConfigWithModelCatalogPreset as c, createModelCatalogPresetAppliers as d, ensureModelAllowlistEntry as f, applyProviderConfigWithDefaultModelPreset as i, createDefaultModelPresetAppliers as l, applyOnboardAuthAgentModelsAndProviders as n, applyProviderConfigWithDefaultModelsPreset as o, withAgentModelAliases as p, applyProviderConfigWithDefaultModel as r, applyProviderConfigWithModelCatalog as s, applyAgentDefaultModelPrimary as t, createDefaultModelsPresetAppliers as u };
