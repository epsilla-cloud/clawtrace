import { b as resolveFoundryApi, g as normalizeFoundryEndpoint, i as PROVIDER_ID, l as buildFoundryModelCompat, m as isFoundryProviderApi, o as applyFoundryProfileBinding, p as extractFoundryEndpoint, s as applyFoundryProviderConfig, u as buildFoundryProviderBaseUrl, x as resolveFoundryTargetProfileId, y as resolveConfiguredModelNameHint } from "./shared-x9RbOMks.js";
import { n as entraIdAuthMethod, t as apiKeyAuthMethod } from "./auth-CG3hcunr.js";
import { t as prepareFoundryRuntimeAuth } from "./runtime-DhA2686B.js";
//#region extensions/microsoft-foundry/provider.ts
function buildMicrosoftFoundryProvider() {
	return {
		id: PROVIDER_ID,
		label: "Microsoft Foundry",
		docsPath: "/providers/models",
		envVars: ["AZURE_OPENAI_API_KEY", "AZURE_OPENAI_ENDPOINT"],
		auth: [entraIdAuthMethod, apiKeyAuthMethod],
		capabilities: { providerFamily: "openai" },
		onModelSelected: async (ctx) => {
			const providerConfig = ctx.config.models?.providers?.[PROVIDER_ID];
			if (!providerConfig || !ctx.model.startsWith(`microsoft-foundry/`)) return;
			const selectedModelId = ctx.model.slice(`${PROVIDER_ID}/`.length);
			const existingModel = providerConfig.models.find((model) => model.id === selectedModelId);
			const selectedModelNameHint = resolveConfiguredModelNameHint(selectedModelId, existingModel?.name);
			const providerEndpoint = normalizeFoundryEndpoint(providerConfig.baseUrl ?? "");
			const selectedModelApi = isFoundryProviderApi(existingModel?.api) ? existingModel.api : providerConfig.api;
			const selectedModelCompat = buildFoundryModelCompat(selectedModelId, selectedModelNameHint, selectedModelApi);
			const nextModels = providerConfig.models.map((model) => model.id === selectedModelId ? {
				...model,
				api: resolveFoundryApi(selectedModelId, selectedModelNameHint, selectedModelApi),
				...selectedModelCompat ? { compat: selectedModelCompat } : {}
			} : model);
			if (!nextModels.some((model) => model.id === selectedModelId)) nextModels.push({
				id: selectedModelId,
				name: selectedModelNameHint ?? selectedModelId,
				api: resolveFoundryApi(selectedModelId, selectedModelNameHint, selectedModelApi),
				reasoning: false,
				input: ["text"],
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0
				},
				contextWindow: 128e3,
				maxTokens: 16384,
				...selectedModelCompat ? { compat: selectedModelCompat } : {}
			});
			const nextProviderConfig = {
				...providerConfig,
				baseUrl: buildFoundryProviderBaseUrl(providerEndpoint, selectedModelId, selectedModelNameHint, selectedModelApi),
				api: resolveFoundryApi(selectedModelId, selectedModelNameHint, selectedModelApi),
				models: nextModels
			};
			const targetProfileId = resolveFoundryTargetProfileId(ctx.config);
			if (targetProfileId) applyFoundryProfileBinding(ctx.config, targetProfileId);
			applyFoundryProviderConfig(ctx.config, nextProviderConfig);
		},
		normalizeResolvedModel: ({ modelId, model }) => {
			const endpoint = extractFoundryEndpoint(String(model.baseUrl ?? ""));
			if (!endpoint) return model;
			const modelNameHint = resolveConfiguredModelNameHint(modelId, model.name);
			const configuredApi = isFoundryProviderApi(model.api) ? model.api : void 0;
			const compat = buildFoundryModelCompat(modelId, modelNameHint, configuredApi);
			return {
				...model,
				api: resolveFoundryApi(modelId, modelNameHint, configuredApi),
				baseUrl: buildFoundryProviderBaseUrl(endpoint, modelId, modelNameHint, configuredApi),
				...compat ? { compat } : {}
			};
		},
		prepareRuntimeAuth: prepareFoundryRuntimeAuth
	};
}
//#endregion
export { buildMicrosoftFoundryProvider as t };
