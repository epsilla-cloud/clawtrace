import { QI as normalizeAlias, vg as CONTEXT_WINDOW_HARD_MIN_TOKENS } from "./auth-profiles-B5ypC5S-.js";
import { r as DEFAULT_PROVIDER } from "./defaults-Dpv7c6Om.js";
import { i as buildModelAliasIndex, l as modelKey } from "./model-selection-CMtvxDDg.js";
import { o as isSecretRef } from "./types.secrets-Rqz2qv-w.js";
import { n as normalizeSecretInput, t as normalizeOptionalSecretInput } from "./normalize-secret-input-Caby3smH.js";
import { r as fetchWithTimeout } from "./fetch-timeout-C6o4AXyo.js";
import { r as ensureApiKeyFromEnvOrPrompt } from "./provider-auth-helpers-Cn7_lVDp.js";
import "./stream-CBdzTVlm.js";
import "./sglang-CK5Z-04z.js";
import { t as applyPrimaryModel } from "./provider-model-primary-Bq4PxhgO.js";
import "./auth-choice.apply-helpers-N0X9l_6R.js";
import "./model-picker-Djs4mDr3.js";
//#region src/commands/onboard-custom.ts
const DEFAULT_CONTEXT_WINDOW = CONTEXT_WINDOW_HARD_MIN_TOKENS;
const DEFAULT_MAX_TOKENS = 4096;
const AZURE_DEFAULT_CONTEXT_WINDOW = 4e5;
const AZURE_DEFAULT_MAX_TOKENS = 16384;
const VERIFY_TIMEOUT_MS = 3e4;
function normalizeContextWindowForCustomModel(value) {
	const parsed = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : 0;
	return parsed >= 16e3 ? parsed : CONTEXT_WINDOW_HARD_MIN_TOKENS;
}
function isAzureFoundryUrl(baseUrl) {
	try {
		return new URL(baseUrl).hostname.toLowerCase().endsWith(".services.ai.azure.com");
	} catch {
		return false;
	}
}
function isAzureOpenAiUrl(baseUrl) {
	try {
		return new URL(baseUrl).hostname.toLowerCase().endsWith(".openai.azure.com");
	} catch {
		return false;
	}
}
function isAzureUrl(baseUrl) {
	return isAzureFoundryUrl(baseUrl) || isAzureOpenAiUrl(baseUrl);
}
/**
* Transforms an Azure AI Foundry/OpenAI URL to include the deployment path.
* Azure requires: https://host/openai/deployments/<model-id>/chat/completions?api-version=2024-xx-xx-preview
* But we can't add query params here, so we just add the path prefix.
* The api-version will be handled by the Azure OpenAI client or as a query param.
*
* Example:
*   https://my-resource.services.ai.azure.com + gpt-5-nano
*   => https://my-resource.services.ai.azure.com/openai/deployments/gpt-5-nano
*/
function transformAzureUrl(baseUrl, modelId) {
	const normalizedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	if (normalizedUrl.includes("/openai/deployments/")) return normalizedUrl;
	return `${normalizedUrl}/openai/deployments/${modelId}`;
}
/**
* Transforms an Azure URL into the base URL stored in config.
*
* Example:
*   https://my-resource.openai.azure.com
*   => https://my-resource.openai.azure.com/openai/v1
*/
function transformAzureConfigUrl(baseUrl) {
	const normalizedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	if (normalizedUrl.endsWith("/openai/v1")) return normalizedUrl;
	const deploymentIdx = normalizedUrl.indexOf("/openai/deployments/");
	return `${deploymentIdx !== -1 ? normalizedUrl.slice(0, deploymentIdx) : normalizedUrl}/openai/v1`;
}
function hasSameHost(a, b) {
	try {
		return new URL(a).hostname.toLowerCase() === new URL(b).hostname.toLowerCase();
	} catch {
		return false;
	}
}
var CustomApiError = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "CustomApiError";
		this.code = code;
	}
};
const COMPATIBILITY_OPTIONS = [
	{
		value: "openai",
		label: "OpenAI-compatible",
		hint: "Uses /chat/completions"
	},
	{
		value: "anthropic",
		label: "Anthropic-compatible",
		hint: "Uses /messages"
	},
	{
		value: "unknown",
		label: "Unknown (detect automatically)",
		hint: "Probes OpenAI then Anthropic endpoints"
	}
];
function normalizeEndpointId(raw) {
	const trimmed = raw.trim().toLowerCase();
	if (!trimmed) return "";
	return trimmed.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}
function buildEndpointIdFromUrl(baseUrl) {
	try {
		const url = new URL(baseUrl);
		return normalizeEndpointId(`custom-${url.hostname.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}${url.port ? `-${url.port}` : ""}`) || "custom";
	} catch {
		return "custom";
	}
}
function resolveUniqueEndpointId(params) {
	const normalized = normalizeEndpointId(params.requestedId) || "custom";
	const existing = params.providers[normalized];
	if (!existing?.baseUrl || existing.baseUrl === params.baseUrl || isAzureUrl(params.baseUrl) && hasSameHost(existing.baseUrl, params.baseUrl)) return {
		providerId: normalized,
		renamed: false
	};
	let suffix = 2;
	let candidate = `${normalized}-${suffix}`;
	while (params.providers[candidate]) {
		suffix += 1;
		candidate = `${normalized}-${suffix}`;
	}
	return {
		providerId: candidate,
		renamed: true
	};
}
function resolveAliasError(params) {
	const trimmed = params.raw.trim();
	if (!trimmed) return;
	let normalized;
	try {
		normalized = normalizeAlias(trimmed);
	} catch (err) {
		return err instanceof Error ? err.message : "Alias is invalid.";
	}
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const aliasKey = normalized.toLowerCase();
	const existing = aliasIndex.byAlias.get(aliasKey);
	if (!existing) return;
	const existingKey = modelKey(existing.ref.provider, existing.ref.model);
	if (existingKey === params.modelRef) return;
	return `Alias ${normalized} already points to ${existingKey}.`;
}
function buildAzureOpenAiHeaders(apiKey) {
	const headers = {};
	if (apiKey) headers["api-key"] = apiKey;
	return headers;
}
function buildOpenAiHeaders(apiKey) {
	const headers = {};
	if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
	return headers;
}
function buildAnthropicHeaders(apiKey) {
	const headers = { "anthropic-version": "2023-06-01" };
	if (apiKey) headers["x-api-key"] = apiKey;
	return headers;
}
function formatVerificationError(error) {
	if (!error) return "unknown error";
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error);
	} catch {
		return "unknown error";
	}
}
function normalizeOptionalProviderApiKey(value) {
	if (isSecretRef(value)) return value;
	return normalizeOptionalSecretInput(value);
}
function resolveVerificationEndpoint(params) {
	const resolvedUrl = isAzureUrl(params.baseUrl) ? transformAzureUrl(params.baseUrl, params.modelId) : params.baseUrl;
	const endpointUrl = new URL(params.endpointPath, resolvedUrl.endsWith("/") ? resolvedUrl : `${resolvedUrl}/`);
	if (isAzureUrl(params.baseUrl)) endpointUrl.searchParams.set("api-version", "2024-10-21");
	return endpointUrl.href;
}
async function requestVerification(params) {
	try {
		const res = await fetchWithTimeout(params.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...params.headers
			},
			body: JSON.stringify(params.body)
		}, VERIFY_TIMEOUT_MS);
		return {
			ok: res.ok,
			status: res.status
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
async function requestOpenAiVerification(params) {
	const headers = isAzureUrl(params.baseUrl) ? buildAzureOpenAiHeaders(params.apiKey) : buildOpenAiHeaders(params.apiKey);
	if (isAzureOpenAiUrl(params.baseUrl)) {
		const endpoint = new URL("responses", transformAzureConfigUrl(params.baseUrl).replace(/\/?$/, "/")).href;
		return await requestVerification({
			endpoint,
			headers,
			body: {
				model: params.modelId,
				input: "Hi",
				max_output_tokens: 16,
				stream: false
			}
		});
	} else return await requestVerification({
		endpoint: resolveVerificationEndpoint({
			baseUrl: params.baseUrl,
			modelId: params.modelId,
			endpointPath: "chat/completions"
		}),
		headers,
		body: {
			model: params.modelId,
			messages: [{
				role: "user",
				content: "Hi"
			}],
			max_tokens: 1,
			stream: false
		}
	});
}
async function requestAnthropicVerification(params) {
	return await requestVerification({
		endpoint: resolveVerificationEndpoint({
			baseUrl: /\/v1\/?$/.test(params.baseUrl.trim()) ? params.baseUrl.trim() : params.baseUrl.trim().replace(/\/?$/, "") + "/v1",
			modelId: params.modelId,
			endpointPath: "messages"
		}),
		headers: buildAnthropicHeaders(params.apiKey),
		body: {
			model: params.modelId,
			max_tokens: 1,
			messages: [{
				role: "user",
				content: "Hi"
			}],
			stream: false
		}
	});
}
async function promptBaseUrlAndKey(params) {
	const baseUrl = (await params.prompter.text({
		message: "API Base URL",
		initialValue: params.initialBaseUrl ?? "http://127.0.0.1:11434",
		placeholder: "https://api.example.com/v1",
		validate: (val) => {
			try {
				new URL(val);
				return;
			} catch {
				return "Please enter a valid URL (e.g. http://...)";
			}
		}
	})).trim();
	const providerHint = buildEndpointIdFromUrl(baseUrl) || "custom";
	let apiKeyInput;
	const resolvedApiKey = await ensureApiKeyFromEnvOrPrompt({
		config: params.config,
		provider: providerHint,
		envLabel: "CUSTOM_API_KEY",
		promptMessage: "API Key (leave blank if not required)",
		normalize: normalizeSecretInput,
		validate: () => void 0,
		prompter: params.prompter,
		secretInputMode: params.secretInputMode,
		setCredential: async (apiKey) => {
			apiKeyInput = apiKey;
		}
	});
	return {
		baseUrl,
		apiKey: normalizeOptionalProviderApiKey(apiKeyInput),
		resolvedApiKey: normalizeSecretInput(resolvedApiKey)
	};
}
async function promptCustomApiRetryChoice(prompter) {
	return await prompter.select({
		message: "What would you like to change?",
		options: [
			{
				value: "baseUrl",
				label: "Change base URL"
			},
			{
				value: "model",
				label: "Change model"
			},
			{
				value: "both",
				label: "Change base URL and model"
			}
		]
	});
}
async function promptCustomApiModelId(prompter) {
	return (await prompter.text({
		message: "Model ID",
		placeholder: "e.g. llama3, claude-3-7-sonnet",
		validate: (val) => val.trim() ? void 0 : "Model ID is required"
	})).trim();
}
async function applyCustomApiRetryChoice(params) {
	let { baseUrl, apiKey, resolvedApiKey, modelId } = params.current;
	if (params.retryChoice === "baseUrl" || params.retryChoice === "both") {
		const retryInput = await promptBaseUrlAndKey({
			prompter: params.prompter,
			config: params.config,
			secretInputMode: params.secretInputMode,
			initialBaseUrl: baseUrl
		});
		baseUrl = retryInput.baseUrl;
		apiKey = retryInput.apiKey;
		resolvedApiKey = retryInput.resolvedApiKey;
	}
	if (params.retryChoice === "model" || params.retryChoice === "both") modelId = await promptCustomApiModelId(params.prompter);
	return {
		baseUrl,
		apiKey,
		resolvedApiKey,
		modelId
	};
}
function resolveProviderApi(compatibility) {
	return compatibility === "anthropic" ? "anthropic-messages" : "openai-completions";
}
function parseCustomApiCompatibility(raw) {
	const compatibilityRaw = raw?.trim().toLowerCase();
	if (!compatibilityRaw) return "openai";
	if (compatibilityRaw !== "openai" && compatibilityRaw !== "anthropic") throw new CustomApiError("invalid_compatibility", "Invalid --custom-compatibility (use \"openai\" or \"anthropic\").");
	return compatibilityRaw;
}
function resolveCustomProviderId(params) {
	const providers = params.config.models?.providers ?? {};
	const baseUrl = params.baseUrl.trim();
	const explicitProviderId = params.providerId?.trim();
	if (explicitProviderId && !normalizeEndpointId(explicitProviderId)) throw new CustomApiError("invalid_provider_id", "Custom provider ID must include letters, numbers, or hyphens.");
	const requestedProviderId = explicitProviderId || buildEndpointIdFromUrl(baseUrl);
	const providerIdResult = resolveUniqueEndpointId({
		requestedId: requestedProviderId,
		baseUrl,
		providers
	});
	return {
		providerId: providerIdResult.providerId,
		...providerIdResult.renamed ? { providerIdRenamedFrom: normalizeEndpointId(requestedProviderId) || "custom" } : {}
	};
}
function parseNonInteractiveCustomApiFlags(params) {
	const baseUrl = params.baseUrl?.trim() ?? "";
	const modelId = params.modelId?.trim() ?? "";
	if (!baseUrl || !modelId) throw new CustomApiError("missing_required", ["Auth choice \"custom-api-key\" requires a base URL and model ID.", "Use --custom-base-url and --custom-model-id."].join("\n"));
	const apiKey = params.apiKey?.trim();
	const providerId = params.providerId?.trim();
	if (providerId && !normalizeEndpointId(providerId)) throw new CustomApiError("invalid_provider_id", "Custom provider ID must include letters, numbers, or hyphens.");
	return {
		baseUrl,
		modelId,
		compatibility: parseCustomApiCompatibility(params.compatibility),
		...apiKey ? { apiKey } : {},
		...providerId ? { providerId } : {}
	};
}
function applyCustomApiConfig(params) {
	const baseUrl = params.baseUrl.trim();
	try {
		new URL(baseUrl);
	} catch {
		throw new CustomApiError("invalid_base_url", "Custom provider base URL must be a valid URL.");
	}
	if (params.compatibility !== "openai" && params.compatibility !== "anthropic") throw new CustomApiError("invalid_compatibility", "Custom provider compatibility must be \"openai\" or \"anthropic\".");
	const modelId = params.modelId.trim();
	if (!modelId) throw new CustomApiError("invalid_model_id", "Custom provider model ID is required.");
	const isAzure = isAzureUrl(baseUrl);
	const isAzureOpenAi = isAzureOpenAiUrl(baseUrl);
	const resolvedBaseUrl = isAzure ? transformAzureConfigUrl(baseUrl) : baseUrl;
	const providerIdResult = resolveCustomProviderId({
		config: params.config,
		baseUrl: resolvedBaseUrl,
		providerId: params.providerId
	});
	const providerId = providerIdResult.providerId;
	const providers = params.config.models?.providers ?? {};
	const modelRef = modelKey(providerId, modelId);
	const alias = params.alias?.trim() ?? "";
	const aliasError = resolveAliasError({
		raw: alias,
		cfg: params.config,
		modelRef
	});
	if (aliasError) throw new CustomApiError("invalid_alias", aliasError);
	const existingProvider = providers[providerId];
	const existingModels = Array.isArray(existingProvider?.models) ? existingProvider.models : [];
	const hasModel = existingModels.some((model) => model.id === modelId);
	const isLikelyReasoningModel = isAzure && /\b(o[134]|gpt-([5-9]|\d{2,}))\b/i.test(modelId);
	const nextModel = isAzure ? {
		id: modelId,
		name: `${modelId} (Custom Provider)`,
		contextWindow: AZURE_DEFAULT_CONTEXT_WINDOW,
		maxTokens: AZURE_DEFAULT_MAX_TOKENS,
		input: isLikelyReasoningModel ? ["text", "image"] : ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		reasoning: isLikelyReasoningModel,
		compat: { supportsStore: false }
	} : {
		id: modelId,
		name: `${modelId} (Custom Provider)`,
		contextWindow: DEFAULT_CONTEXT_WINDOW,
		maxTokens: DEFAULT_MAX_TOKENS,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		reasoning: false
	};
	const mergedModels = hasModel ? existingModels.map((model) => model.id === modelId ? {
		...model,
		...isAzure ? nextModel : {},
		name: model.name ?? nextModel.name,
		cost: model.cost ?? nextModel.cost,
		contextWindow: normalizeContextWindowForCustomModel(model.contextWindow),
		maxTokens: model.maxTokens ?? nextModel.maxTokens
	} : model) : [...existingModels, nextModel];
	const { apiKey: existingApiKey, ...existingProviderRest } = existingProvider ?? {};
	const normalizedApiKey = normalizeOptionalProviderApiKey(params.apiKey) ?? normalizeOptionalProviderApiKey(existingApiKey);
	const providerApi = isAzureOpenAi ? "openai-responses" : resolveProviderApi(params.compatibility);
	const azureHeaders = isAzure && normalizedApiKey ? { "api-key": normalizedApiKey } : void 0;
	let config = {
		...params.config,
		models: {
			...params.config.models,
			mode: params.config.models?.mode ?? "merge",
			providers: {
				...providers,
				[providerId]: {
					...existingProviderRest,
					baseUrl: resolvedBaseUrl,
					api: providerApi,
					...normalizedApiKey ? { apiKey: normalizedApiKey } : {},
					...isAzure ? { authHeader: false } : {},
					...azureHeaders ? { headers: azureHeaders } : {},
					models: mergedModels.length > 0 ? mergedModels : [nextModel]
				}
			}
		}
	};
	config = applyPrimaryModel(config, modelRef);
	if (isAzure && isLikelyReasoningModel) {
		if (!config.agents?.defaults?.models?.[modelRef]?.params?.thinking) config = {
			...config,
			agents: {
				...config.agents,
				defaults: {
					...config.agents?.defaults,
					models: {
						...config.agents?.defaults?.models,
						[modelRef]: {
							...config.agents?.defaults?.models?.[modelRef],
							params: {
								...config.agents?.defaults?.models?.[modelRef]?.params,
								thinking: "medium"
							}
						}
					}
				}
			}
		};
	}
	if (alias) config = {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				models: {
					...config.agents?.defaults?.models,
					[modelRef]: {
						...config.agents?.defaults?.models?.[modelRef],
						alias
					}
				}
			}
		}
	};
	return {
		config,
		providerId,
		modelId,
		...providerIdResult.providerIdRenamedFrom ? { providerIdRenamedFrom: providerIdResult.providerIdRenamedFrom } : {}
	};
}
async function promptCustomApiConfig(params) {
	const { prompter, runtime, config } = params;
	const baseInput = await promptBaseUrlAndKey({
		prompter,
		config,
		secretInputMode: params.secretInputMode
	});
	let baseUrl = baseInput.baseUrl;
	let apiKey = baseInput.apiKey;
	let resolvedApiKey = baseInput.resolvedApiKey;
	const compatibilityChoice = await prompter.select({
		message: "Endpoint compatibility",
		options: COMPATIBILITY_OPTIONS.map((option) => ({
			value: option.value,
			label: option.label,
			hint: option.hint
		}))
	});
	let modelId = await promptCustomApiModelId(prompter);
	let compatibility = compatibilityChoice === "unknown" ? null : compatibilityChoice;
	while (true) {
		let verifiedFromProbe = false;
		if (!compatibility) {
			const probeSpinner = prompter.progress("Detecting endpoint type...");
			if ((await requestOpenAiVerification({
				baseUrl,
				apiKey: resolvedApiKey,
				modelId
			})).ok) {
				probeSpinner.stop("Detected OpenAI-compatible endpoint.");
				compatibility = "openai";
				verifiedFromProbe = true;
			} else if ((await requestAnthropicVerification({
				baseUrl,
				apiKey: resolvedApiKey,
				modelId
			})).ok) {
				probeSpinner.stop("Detected Anthropic-compatible endpoint.");
				compatibility = "anthropic";
				verifiedFromProbe = true;
			} else {
				probeSpinner.stop("Could not detect endpoint type.");
				await prompter.note("This endpoint did not respond to OpenAI or Anthropic style requests.", "Endpoint detection");
				const retryChoice = await promptCustomApiRetryChoice(prompter);
				({baseUrl, apiKey, resolvedApiKey, modelId} = await applyCustomApiRetryChoice({
					prompter,
					config,
					secretInputMode: params.secretInputMode,
					retryChoice,
					current: {
						baseUrl,
						apiKey,
						resolvedApiKey,
						modelId
					}
				}));
				continue;
			}
		}
		if (verifiedFromProbe) break;
		const verifySpinner = prompter.progress("Verifying...");
		const result = compatibility === "anthropic" ? await requestAnthropicVerification({
			baseUrl,
			apiKey: resolvedApiKey,
			modelId
		}) : await requestOpenAiVerification({
			baseUrl,
			apiKey: resolvedApiKey,
			modelId
		});
		if (result.ok) {
			verifySpinner.stop("Verification successful.");
			break;
		}
		if (result.status !== void 0) verifySpinner.stop(`Verification failed: status ${result.status}`);
		else verifySpinner.stop(`Verification failed: ${formatVerificationError(result.error)}`);
		const retryChoice = await promptCustomApiRetryChoice(prompter);
		({baseUrl, apiKey, resolvedApiKey, modelId} = await applyCustomApiRetryChoice({
			prompter,
			config,
			secretInputMode: params.secretInputMode,
			retryChoice,
			current: {
				baseUrl,
				apiKey,
				resolvedApiKey,
				modelId
			}
		}));
		if (compatibilityChoice === "unknown") compatibility = null;
	}
	const providers = config.models?.providers ?? {};
	const suggestedId = buildEndpointIdFromUrl(baseUrl);
	const providerIdInput = await prompter.text({
		message: "Endpoint ID",
		initialValue: suggestedId,
		placeholder: "custom",
		validate: (value) => {
			if (!normalizeEndpointId(value)) return "Endpoint ID is required.";
		}
	});
	const aliasInput = await prompter.text({
		message: "Model alias (optional)",
		placeholder: "e.g. local, ollama",
		initialValue: "",
		validate: (value) => {
			return resolveAliasError({
				raw: value,
				cfg: config,
				modelRef: modelKey(resolveUniqueEndpointId({
					requestedId: normalizeEndpointId(providerIdInput) || "custom",
					baseUrl,
					providers
				}).providerId, modelId)
			});
		}
	});
	const result = applyCustomApiConfig({
		config,
		baseUrl,
		modelId,
		compatibility: compatibility ?? "openai",
		apiKey,
		providerId: providerIdInput,
		alias: aliasInput
	});
	if (result.providerIdRenamedFrom && result.providerId) await prompter.note(`Endpoint ID "${result.providerIdRenamedFrom}" already exists for a different base URL. Using "${result.providerId}".`, "Endpoint ID");
	runtime.log(`Configured custom provider: ${result.providerId}/${result.modelId}`);
	return result;
}
//#endregion
export { resolveCustomProviderId as a, promptCustomApiConfig as i, applyCustomApiConfig as n, parseNonInteractiveCustomApiFlags as r, CustomApiError as t };
