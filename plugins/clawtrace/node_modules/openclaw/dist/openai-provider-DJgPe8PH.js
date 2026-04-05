import "./defaults-Dpv7c6Om.js";
import { n as matchesExactOrPrefix, o as normalizeModelCompat, t as cloneFirstTemplateModel } from "./provider-model-shared-Bzdvns2r.js";
import { r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
import { a as OPENAI_DEFAULT_MODEL, c as applyOpenAIConfig } from "./default-models-DFs7K_6q.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-dVvNnCb0.js";
import "./provider-auth-api-key-A3ylU4FZ.js";
import { a as createOpenAIAttributionHeadersWrapper, o as createOpenAIDefaultTransportWrapper } from "./provider-stream-B9iIzaRT.js";
import { r as findCatalogTemplate } from "./provider-catalog-shared-3VsF9z0G.js";
import { n as isOpenAIApiBaseUrl } from "./shared-CYYKtpjq.js";
//#region extensions/openai/openai-provider.ts
const PROVIDER_ID = "openai";
const OPENAI_GPT_54_MODEL_ID = "gpt-5.4";
const OPENAI_GPT_54_PRO_MODEL_ID = "gpt-5.4-pro";
const OPENAI_GPT_54_MINI_MODEL_ID = "gpt-5.4-mini";
const OPENAI_GPT_54_NANO_MODEL_ID = "gpt-5.4-nano";
const OPENAI_GPT_54_CONTEXT_TOKENS = 105e4;
const OPENAI_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_GPT_54_TEMPLATE_MODEL_IDS = ["gpt-5.2"];
const OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS = ["gpt-5.2-pro", "gpt-5.2"];
const OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS = ["gpt-5-mini"];
const OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS = ["gpt-5-nano", "gpt-5-mini"];
const OPENAI_XHIGH_MODEL_IDS = [
	"gpt-5.4",
	"gpt-5.4-pro",
	"gpt-5.4-mini",
	"gpt-5.4-nano",
	"gpt-5.2"
];
const OPENAI_MODERN_MODEL_IDS = [
	"gpt-5.4",
	"gpt-5.4-pro",
	"gpt-5.4-mini",
	"gpt-5.4-nano",
	"gpt-5.2"
];
const OPENAI_DIRECT_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
const SUPPRESSED_SPARK_PROVIDERS = new Set(["openai", "azure-openai-responses"]);
function normalizeOpenAITransport(model) {
	if (!(model.api === "openai-completions" && (!model.baseUrl || isOpenAIApiBaseUrl(model.baseUrl)))) return model;
	return {
		...model,
		api: "openai-responses"
	};
}
function resolveOpenAIGpt54ForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = trimmedModelId.toLowerCase();
	let templateIds;
	let patch;
	if (lower === OPENAI_GPT_54_MODEL_ID) {
		templateIds = OPENAI_GPT_54_TEMPLATE_MODEL_IDS;
		patch = {
			api: "openai-responses",
			provider: PROVIDER_ID,
			baseUrl: "https://api.openai.com/v1",
			reasoning: true,
			input: ["text", "image"],
			contextWindow: OPENAI_GPT_54_CONTEXT_TOKENS,
			maxTokens: OPENAI_GPT_54_MAX_TOKENS
		};
	} else if (lower === OPENAI_GPT_54_PRO_MODEL_ID) {
		templateIds = OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS;
		patch = {
			api: "openai-responses",
			provider: PROVIDER_ID,
			baseUrl: "https://api.openai.com/v1",
			reasoning: true,
			input: ["text", "image"],
			contextWindow: OPENAI_GPT_54_CONTEXT_TOKENS,
			maxTokens: OPENAI_GPT_54_MAX_TOKENS
		};
	} else if (lower === OPENAI_GPT_54_MINI_MODEL_ID) {
		templateIds = OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS;
		patch = {
			api: "openai-responses",
			provider: PROVIDER_ID,
			baseUrl: "https://api.openai.com/v1",
			reasoning: true,
			input: ["text", "image"]
		};
	} else if (lower === OPENAI_GPT_54_NANO_MODEL_ID) {
		templateIds = OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS;
		patch = {
			api: "openai-responses",
			provider: PROVIDER_ID,
			baseUrl: "https://api.openai.com/v1",
			reasoning: true,
			input: ["text", "image"]
		};
	} else return;
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: trimmedModelId,
		templateIds,
		ctx,
		patch
	}) ?? normalizeModelCompat({
		id: trimmedModelId,
		name: trimmedModelId,
		...patch,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: patch.contextWindow ?? 2e5,
		maxTokens: patch.maxTokens ?? 2e5
	});
}
function buildOpenAIProvider() {
	return {
		id: PROVIDER_ID,
		label: "OpenAI",
		docsPath: "/providers/models",
		envVars: ["OPENAI_API_KEY"],
		auth: [createProviderApiKeyAuthMethod({
			providerId: PROVIDER_ID,
			methodId: "api-key",
			label: "OpenAI API key",
			hint: "Direct OpenAI API key",
			optionKey: "openaiApiKey",
			flagName: "--openai-api-key",
			envVar: "OPENAI_API_KEY",
			promptMessage: "Enter OpenAI API key",
			defaultModel: OPENAI_DEFAULT_MODEL,
			expectedProviders: ["openai"],
			applyConfig: (cfg) => applyOpenAIConfig(cfg),
			wizard: {
				choiceId: "openai-api-key",
				choiceLabel: "OpenAI API key",
				groupId: "openai",
				groupLabel: "OpenAI",
				groupHint: "Codex OAuth + API key"
			}
		})],
		resolveDynamicModel: (ctx) => resolveOpenAIGpt54ForwardCompatModel(ctx),
		normalizeResolvedModel: (ctx) => {
			if (normalizeProviderId(ctx.provider) !== PROVIDER_ID) return;
			return normalizeOpenAITransport(ctx.model);
		},
		capabilities: { providerFamily: "openai" },
		wrapStreamFn: (ctx) => createOpenAIAttributionHeadersWrapper(createOpenAIDefaultTransportWrapper(ctx.streamFn)),
		supportsXHighThinking: ({ modelId }) => matchesExactOrPrefix(modelId, OPENAI_XHIGH_MODEL_IDS),
		isModernModelRef: ({ modelId }) => matchesExactOrPrefix(modelId, OPENAI_MODERN_MODEL_IDS),
		buildMissingAuthMessage: (ctx) => {
			if (ctx.provider !== PROVIDER_ID || ctx.listProfileIds("openai-codex").length === 0) return;
			return "No API key found for provider \"openai\". You are authenticated with OpenAI Codex OAuth. Use openai-codex/gpt-5.4 (OAuth) or set OPENAI_API_KEY to use openai/gpt-5.4.";
		},
		suppressBuiltInModel: (ctx) => {
			if (!SUPPRESSED_SPARK_PROVIDERS.has(normalizeProviderId(ctx.provider)) || ctx.modelId.toLowerCase() !== OPENAI_DIRECT_SPARK_MODEL_ID) return;
			return {
				suppress: true,
				errorMessage: `Unknown model: ${ctx.provider}/${OPENAI_DIRECT_SPARK_MODEL_ID}. ${OPENAI_DIRECT_SPARK_MODEL_ID} is only supported via openai-codex OAuth. Use openai-codex/${OPENAI_DIRECT_SPARK_MODEL_ID}.`
			};
		},
		augmentModelCatalog: (ctx) => {
			const openAiGpt54Template = findCatalogTemplate({
				entries: ctx.entries,
				providerId: PROVIDER_ID,
				templateIds: OPENAI_GPT_54_TEMPLATE_MODEL_IDS
			});
			const openAiGpt54ProTemplate = findCatalogTemplate({
				entries: ctx.entries,
				providerId: PROVIDER_ID,
				templateIds: OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS
			});
			const openAiGpt54MiniTemplate = findCatalogTemplate({
				entries: ctx.entries,
				providerId: PROVIDER_ID,
				templateIds: OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS
			});
			const openAiGpt54NanoTemplate = findCatalogTemplate({
				entries: ctx.entries,
				providerId: PROVIDER_ID,
				templateIds: OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS
			});
			return [
				openAiGpt54Template ? {
					...openAiGpt54Template,
					id: OPENAI_GPT_54_MODEL_ID,
					name: OPENAI_GPT_54_MODEL_ID
				} : void 0,
				openAiGpt54ProTemplate ? {
					...openAiGpt54ProTemplate,
					id: OPENAI_GPT_54_PRO_MODEL_ID,
					name: OPENAI_GPT_54_PRO_MODEL_ID
				} : void 0,
				openAiGpt54MiniTemplate ? {
					...openAiGpt54MiniTemplate,
					id: OPENAI_GPT_54_MINI_MODEL_ID,
					name: OPENAI_GPT_54_MINI_MODEL_ID
				} : void 0,
				openAiGpt54NanoTemplate ? {
					...openAiGpt54NanoTemplate,
					id: OPENAI_GPT_54_NANO_MODEL_ID,
					name: OPENAI_GPT_54_NANO_MODEL_ID
				} : void 0
			].filter((entry) => entry !== void 0);
		}
	};
}
//#endregion
export { buildOpenAIProvider as t };
