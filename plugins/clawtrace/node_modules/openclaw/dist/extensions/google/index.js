import { n as normalizeGoogleModelId } from "../../model-id-fXGzbdpZ.js";
import { n as GOOGLE_GEMINI_DEFAULT_MODEL, r as applyGoogleGeminiModelDefault, s as normalizeGoogleProviderConfig, u as resolveGoogleGenerativeAiTransport } from "../../api-BnzTE5Fb.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-dVvNnCb0.js";
import "../../provider-auth-api-key-A3ylU4FZ.js";
import { v as createGoogleThinkingPayloadWrapper } from "../../provider-stream-B9iIzaRT.js";
import { t as buildGoogleGeminiCliBackend } from "../../cli-backend-DaOLrZ6s.js";
import { n as resolveGoogle31ForwardCompatModel, t as isModernGoogleModel } from "../../provider-models-CiG_J00e.js";
import { t as createGeminiWebSearchProvider } from "../../gemini-web-search-provider-BovMHwzK.js";
//#region extensions/google/index.ts
const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
const GOOGLE_GEMINI_CLI_PROVIDER_LABEL = "Gemini CLI OAuth";
const GOOGLE_GEMINI_CLI_ENV_VARS = [
	"OPENCLAW_GEMINI_OAUTH_CLIENT_ID",
	"OPENCLAW_GEMINI_OAUTH_CLIENT_SECRET",
	"GEMINI_CLI_OAUTH_CLIENT_ID",
	"GEMINI_CLI_OAUTH_CLIENT_SECRET"
];
let googleGeminiCliProviderPromise = null;
let googleImageGenerationProviderPromise = null;
let googleMediaUnderstandingProviderPromise = null;
function formatGoogleOauthApiKey(cred) {
	if (cred.type !== "oauth" || typeof cred.access !== "string" || !cred.access.trim()) return "";
	return JSON.stringify({
		token: cred.access,
		projectId: cred.projectId
	});
}
async function loadGoogleGeminiCliProvider() {
	if (!googleGeminiCliProviderPromise) googleGeminiCliProviderPromise = import("./gemini-cli-provider.js").then((mod) => {
		let provider;
		mod.registerGoogleGeminiCliProvider({ registerProvider(entry) {
			provider = entry;
		} });
		if (!provider) throw new Error("google gemini cli provider missing provider registration");
		return provider;
	});
	return await googleGeminiCliProviderPromise;
}
async function loadGoogleImageGenerationProvider() {
	if (!googleImageGenerationProviderPromise) googleImageGenerationProviderPromise = import("./image-generation-provider.js").then((mod) => mod.buildGoogleImageGenerationProvider());
	return await googleImageGenerationProviderPromise;
}
async function loadGoogleMediaUnderstandingProvider() {
	if (!googleMediaUnderstandingProviderPromise) googleMediaUnderstandingProviderPromise = import("./media-understanding-provider.js").then((mod) => mod.googleMediaUnderstandingProvider);
	return await googleMediaUnderstandingProviderPromise;
}
async function loadGoogleRequiredMediaUnderstandingProvider() {
	const provider = await loadGoogleMediaUnderstandingProvider();
	if (!provider.describeImage || !provider.describeImages || !provider.transcribeAudio || !provider.describeVideo) throw new Error("google media understanding provider missing required handlers");
	return provider;
}
function createLazyGoogleGeminiCliProvider() {
	return {
		id: GOOGLE_GEMINI_CLI_PROVIDER_ID,
		label: GOOGLE_GEMINI_CLI_PROVIDER_LABEL,
		docsPath: "/providers/models",
		aliases: ["gemini-cli"],
		envVars: [...GOOGLE_GEMINI_CLI_ENV_VARS],
		auth: [{
			id: "oauth",
			label: "Google OAuth",
			hint: "PKCE + localhost callback",
			kind: "oauth",
			run: async (ctx) => {
				const authMethod = (await loadGoogleGeminiCliProvider()).auth?.[0];
				if (!authMethod || authMethod.kind !== "oauth") return { profiles: [] };
				return await authMethod.run(ctx);
			}
		}],
		wizard: { setup: {
			choiceId: "google-gemini-cli",
			choiceLabel: "Gemini CLI OAuth",
			choiceHint: "Google OAuth with project-aware token payload",
			methodId: "oauth"
		} },
		normalizeModelId: ({ modelId }) => normalizeGoogleModelId(modelId),
		resolveDynamicModel: (ctx) => resolveGoogle31ForwardCompatModel({
			providerId: GOOGLE_GEMINI_CLI_PROVIDER_ID,
			ctx
		}),
		isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId),
		formatApiKey: (cred) => formatGoogleOauthApiKey(cred),
		resolveUsageAuth: async (ctx) => {
			return await (await loadGoogleGeminiCliProvider()).resolveUsageAuth?.(ctx);
		},
		fetchUsageSnapshot: async (ctx) => {
			const provider = await loadGoogleGeminiCliProvider();
			if (!provider.fetchUsageSnapshot) throw new Error("google gemini cli provider missing usage snapshot handler");
			return await provider.fetchUsageSnapshot(ctx);
		}
	};
}
function createLazyGoogleImageGenerationProvider() {
	return {
		id: "google",
		label: "Google",
		defaultModel: "gemini-3.1-flash-image-preview",
		models: ["gemini-3.1-flash-image-preview", "gemini-3-pro-image-preview"],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: 5,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			geometry: {
				sizes: [
					"1024x1024",
					"1024x1536",
					"1536x1024",
					"1024x1792",
					"1792x1024"
				],
				aspectRatios: [
					"1:1",
					"2:3",
					"3:2",
					"3:4",
					"4:3",
					"4:5",
					"5:4",
					"9:16",
					"16:9",
					"21:9"
				],
				resolutions: [
					"1K",
					"2K",
					"4K"
				]
			}
		},
		generateImage: async (req) => (await loadGoogleImageGenerationProvider()).generateImage(req)
	};
}
function createLazyGoogleMediaUnderstandingProvider() {
	return {
		id: "google",
		capabilities: [
			"image",
			"audio",
			"video"
		],
		describeImage: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).describeImage(...args),
		describeImages: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).describeImages(...args),
		transcribeAudio: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).transcribeAudio(...args),
		describeVideo: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).describeVideo(...args)
	};
}
var google_default = definePluginEntry({
	id: "google",
	name: "Google Plugin",
	description: "Bundled Google plugin",
	register(api) {
		api.registerProvider({
			id: "google",
			label: "Google AI Studio",
			docsPath: "/providers/models",
			hookAliases: ["google-antigravity", "google-vertex"],
			envVars: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: "google",
				methodId: "api-key",
				label: "Google Gemini API key",
				hint: "AI Studio / Gemini API key",
				optionKey: "geminiApiKey",
				flagName: "--gemini-api-key",
				envVar: "GEMINI_API_KEY",
				promptMessage: "Enter Gemini API key",
				defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
				expectedProviders: ["google"],
				applyConfig: (cfg) => applyGoogleGeminiModelDefault(cfg).next,
				wizard: {
					choiceId: "gemini-api-key",
					choiceLabel: "Google Gemini API key",
					groupId: "google",
					groupLabel: "Google",
					groupHint: "Gemini API key + OAuth"
				}
			})],
			normalizeTransport: ({ api, baseUrl }) => resolveGoogleGenerativeAiTransport({
				api,
				baseUrl
			}),
			normalizeConfig: ({ provider, providerConfig }) => normalizeGoogleProviderConfig(provider, providerConfig),
			normalizeModelId: ({ modelId }) => normalizeGoogleModelId(modelId),
			resolveDynamicModel: (ctx) => resolveGoogle31ForwardCompatModel({
				providerId: ctx.provider,
				templateProviderId: GOOGLE_GEMINI_CLI_PROVIDER_ID,
				ctx
			}),
			wrapStreamFn: (ctx) => createGoogleThinkingPayloadWrapper(ctx.streamFn, ctx.thinkingLevel),
			isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId)
		});
		api.registerCliBackend(buildGoogleGeminiCliBackend());
		api.registerProvider(createLazyGoogleGeminiCliProvider());
		api.registerImageGenerationProvider(createLazyGoogleImageGenerationProvider());
		api.registerMediaUnderstandingProvider(createLazyGoogleMediaUnderstandingProvider());
		api.registerWebSearchProvider(createGeminiWebSearchProvider());
	}
});
//#endregion
export { google_default as default };
