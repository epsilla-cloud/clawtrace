import { t as DEFAULT_CONTEXT_TOKENS } from "../../defaults-Dpv7c6Om.js";
import { o as normalizeModelCompat } from "../../provider-model-shared-Bzdvns2r.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { t as normalizeOptionalSecretInput } from "../../normalize-secret-input-Caby3smH.js";
import { a as upsertAuthProfile } from "../../profiles-BPdDUT-J.js";
import { i as ensureApiKeyFromOptionEnvOrPrompt, l as validateApiKeyInput, n as buildApiKeyCredential, o as normalizeApiKeyInput, t as applyAuthProfileConfig } from "../../provider-auth-helpers-Cn7_lVDp.js";
import "../../provider-auth-api-key-A3ylU4FZ.js";
import { i as createZaiToolStreamWrapper } from "../../provider-stream-B9iIzaRT.js";
import { p as resolveLegacyPiAgentAccessToken, t as fetchZaiUsage } from "../../provider-usage.fetch-8FvUl8iv.js";
import "../../provider-usage-Cj3kwOGM.js";
import { n as applyZaiConfig, r as applyZaiProviderConfig, t as ZAI_DEFAULT_MODEL_REF } from "../../onboard-BUxq9b9A.js";
import { t as detectZaiEndpoint } from "../../detect-umFUbpXF.js";
import { t as zaiMediaUnderstandingProvider } from "../../media-understanding-provider-Cnc2CuTs.js";
//#region extensions/zai/index.ts
const PROVIDER_ID = "zai";
const GLM5_MODEL_ID = "glm-5";
const GLM5_TEMPLATE_MODEL_ID = "glm-4.7";
const PROFILE_ID = "zai:default";
function resolveGlm5ForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = trimmedModelId.toLowerCase();
	if (lower !== GLM5_MODEL_ID && !lower.startsWith(`${GLM5_MODEL_ID}-`)) return;
	const template = ctx.modelRegistry.find(PROVIDER_ID, GLM5_TEMPLATE_MODEL_ID);
	if (template) return normalizeModelCompat({
		...template,
		id: trimmedModelId,
		name: trimmedModelId,
		reasoning: true
	});
	return normalizeModelCompat({
		id: trimmedModelId,
		name: trimmedModelId,
		api: "openai-completions",
		provider: PROVIDER_ID,
		reasoning: true,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_CONTEXT_TOKENS,
		maxTokens: DEFAULT_CONTEXT_TOKENS
	});
}
function resolveZaiDefaultModel(modelIdOverride) {
	return modelIdOverride ? `zai/${modelIdOverride}` : ZAI_DEFAULT_MODEL_REF;
}
async function promptForZaiEndpoint(ctx) {
	return await ctx.prompter.select({
		message: "Select Z.AI endpoint",
		initialValue: "global",
		options: [
			{
				value: "global",
				label: "Global",
				hint: "Z.AI Global (api.z.ai)"
			},
			{
				value: "cn",
				label: "CN",
				hint: "Z.AI CN (open.bigmodel.cn)"
			},
			{
				value: "coding-global",
				label: "Coding-Plan-Global",
				hint: "GLM Coding Plan Global (api.z.ai)"
			},
			{
				value: "coding-cn",
				label: "Coding-Plan-CN",
				hint: "GLM Coding Plan CN (open.bigmodel.cn)"
			}
		]
	});
}
async function runZaiApiKeyAuth(ctx, endpoint) {
	let capturedSecretInput;
	let capturedCredential = false;
	let capturedMode;
	const apiKey = await ensureApiKeyFromOptionEnvOrPrompt({
		token: normalizeOptionalSecretInput(ctx.opts?.zaiApiKey) ?? normalizeOptionalSecretInput(ctx.opts?.token),
		tokenProvider: normalizeOptionalSecretInput(ctx.opts?.zaiApiKey) ? PROVIDER_ID : normalizeOptionalSecretInput(ctx.opts?.tokenProvider),
		secretInputMode: ctx.allowSecretRefPrompt === false ? ctx.secretInputMode ?? "plaintext" : ctx.secretInputMode,
		config: ctx.config,
		expectedProviders: [PROVIDER_ID, "z-ai"],
		provider: PROVIDER_ID,
		envLabel: "ZAI_API_KEY",
		promptMessage: "Enter Z.AI API key",
		normalize: normalizeApiKeyInput,
		validate: validateApiKeyInput,
		prompter: ctx.prompter,
		setCredential: async (key, mode) => {
			capturedSecretInput = key;
			capturedCredential = true;
			capturedMode = mode;
		}
	});
	if (!capturedCredential) throw new Error("Missing Z.AI API key.");
	const credentialInput = capturedSecretInput ?? "";
	const detected = await detectZaiEndpoint({
		apiKey,
		...endpoint ? { endpoint } : {}
	});
	const modelIdOverride = detected?.modelId;
	const nextEndpoint = detected?.endpoint ?? endpoint ?? await promptForZaiEndpoint(ctx);
	return {
		profiles: [{
			profileId: PROFILE_ID,
			credential: buildApiKeyCredential(PROVIDER_ID, credentialInput, void 0, capturedMode ? { secretInputMode: capturedMode } : void 0)
		}],
		configPatch: applyZaiProviderConfig(ctx.config, {
			...nextEndpoint ? { endpoint: nextEndpoint } : {},
			...modelIdOverride ? { modelId: modelIdOverride } : {}
		}),
		defaultModel: resolveZaiDefaultModel(modelIdOverride),
		...detected?.note ? { notes: [detected.note] } : {}
	};
}
async function runZaiApiKeyAuthNonInteractive(ctx, endpoint) {
	const resolved = await ctx.resolveApiKey({
		provider: PROVIDER_ID,
		flagValue: normalizeOptionalSecretInput(ctx.opts.zaiApiKey),
		flagName: "--zai-api-key",
		envVar: "ZAI_API_KEY"
	});
	if (!resolved) return null;
	const detected = await detectZaiEndpoint({
		apiKey: resolved.key,
		...endpoint ? { endpoint } : {}
	});
	const modelIdOverride = detected?.modelId;
	const nextEndpoint = detected?.endpoint ?? endpoint;
	if (resolved.source !== "profile") {
		const credential = ctx.toApiKeyCredential({
			provider: PROVIDER_ID,
			resolved
		});
		if (!credential) return null;
		upsertAuthProfile({
			profileId: PROFILE_ID,
			credential,
			agentDir: ctx.agentDir
		});
	}
	return applyZaiConfig(applyAuthProfileConfig(ctx.config, {
		profileId: PROFILE_ID,
		provider: PROVIDER_ID,
		mode: "api_key"
	}), {
		...nextEndpoint ? { endpoint: nextEndpoint } : {},
		...modelIdOverride ? { modelId: modelIdOverride } : {}
	});
}
function buildZaiApiKeyMethod(params) {
	return {
		id: params.id,
		label: params.choiceLabel,
		hint: params.choiceHint,
		kind: "api_key",
		wizard: {
			choiceId: params.choiceId,
			choiceLabel: params.choiceLabel,
			...params.choiceHint ? { choiceHint: params.choiceHint } : {},
			groupId: "zai",
			groupLabel: "Z.AI",
			groupHint: "GLM Coding Plan / Global / CN"
		},
		run: async (ctx) => await runZaiApiKeyAuth(ctx, params.endpoint),
		runNonInteractive: async (ctx) => await runZaiApiKeyAuthNonInteractive(ctx, params.endpoint)
	};
}
var zai_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "Z.AI Provider",
	description: "Bundled Z.AI provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Z.AI",
			aliases: ["z-ai", "z.ai"],
			docsPath: "/providers/models",
			envVars: ["ZAI_API_KEY", "Z_AI_API_KEY"],
			auth: [
				buildZaiApiKeyMethod({
					id: "api-key",
					choiceId: "zai-api-key",
					choiceLabel: "Z.AI API key"
				}),
				buildZaiApiKeyMethod({
					id: "coding-global",
					choiceId: "zai-coding-global",
					choiceLabel: "Coding-Plan-Global",
					choiceHint: "GLM Coding Plan Global (api.z.ai)",
					endpoint: "coding-global"
				}),
				buildZaiApiKeyMethod({
					id: "coding-cn",
					choiceId: "zai-coding-cn",
					choiceLabel: "Coding-Plan-CN",
					choiceHint: "GLM Coding Plan CN (open.bigmodel.cn)",
					endpoint: "coding-cn"
				}),
				buildZaiApiKeyMethod({
					id: "global",
					choiceId: "zai-global",
					choiceLabel: "Global",
					choiceHint: "Z.AI Global (api.z.ai)",
					endpoint: "global"
				}),
				buildZaiApiKeyMethod({
					id: "cn",
					choiceId: "zai-cn",
					choiceLabel: "CN",
					choiceHint: "Z.AI CN (open.bigmodel.cn)",
					endpoint: "cn"
				})
			],
			resolveDynamicModel: (ctx) => resolveGlm5ForwardCompatModel(ctx),
			prepareExtraParams: (ctx) => {
				if (ctx.extraParams?.tool_stream !== void 0) return ctx.extraParams;
				return {
					...ctx.extraParams,
					tool_stream: true
				};
			},
			wrapStreamFn: (ctx) => createZaiToolStreamWrapper(ctx.streamFn, ctx.extraParams?.tool_stream !== false),
			isBinaryThinking: () => true,
			isModernModelRef: ({ modelId }) => {
				const lower = modelId.trim().toLowerCase();
				return lower.startsWith("glm-5") || lower.startsWith("glm-4.7") || lower.startsWith("glm-4.7-flash") || lower.startsWith("glm-4.7-flashx");
			},
			resolveUsageAuth: async (ctx) => {
				const apiKey = ctx.resolveApiKeyFromConfigAndStore({
					providerIds: [PROVIDER_ID, "z-ai"],
					envDirect: [ctx.env.ZAI_API_KEY, ctx.env.Z_AI_API_KEY]
				});
				if (apiKey) return { token: apiKey };
				const legacyToken = resolveLegacyPiAgentAccessToken(ctx.env, ["z-ai", "zai"]);
				return legacyToken ? { token: legacyToken } : null;
			},
			fetchUsageSnapshot: async (ctx) => await fetchZaiUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn),
			isCacheTtlEligible: () => true
		});
		api.registerMediaUnderstandingProvider(zaiMediaUnderstandingProvider);
	}
});
//#endregion
export { zai_default as default };
