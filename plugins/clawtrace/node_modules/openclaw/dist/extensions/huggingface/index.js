import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-dVvNnCb0.js";
import "../../provider-auth-api-key-A3ylU4FZ.js";
import { t as buildHuggingfaceProvider } from "../../provider-catalog-DoK5AbRY.js";
import { n as applyHuggingfaceConfig, t as HUGGINGFACE_DEFAULT_MODEL_REF } from "../../onboard-DSJrZTEJ.js";
//#region extensions/huggingface/index.ts
const PROVIDER_ID = "huggingface";
var huggingface_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "Hugging Face Provider",
	description: "Bundled Hugging Face provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Hugging Face",
			docsPath: "/providers/huggingface",
			envVars: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: PROVIDER_ID,
				methodId: "api-key",
				label: "Hugging Face API key",
				hint: "Inference API (HF token)",
				optionKey: "huggingfaceApiKey",
				flagName: "--huggingface-api-key",
				envVar: "HUGGINGFACE_HUB_TOKEN",
				promptMessage: "Enter Hugging Face API key",
				defaultModel: HUGGINGFACE_DEFAULT_MODEL_REF,
				expectedProviders: ["huggingface"],
				applyConfig: (cfg) => applyHuggingfaceConfig(cfg),
				wizard: {
					choiceId: "huggingface-api-key",
					choiceLabel: "Hugging Face API key",
					choiceHint: "Inference API (HF token)",
					groupId: "huggingface",
					groupLabel: "Hugging Face",
					groupHint: "Inference API (HF token)"
				}
			})],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const { apiKey, discoveryApiKey } = ctx.resolveProviderApiKey(PROVIDER_ID);
					if (!apiKey) return null;
					return { provider: {
						...await buildHuggingfaceProvider(discoveryApiKey),
						apiKey
					} };
				}
			}
		});
	}
});
//#endregion
export { huggingface_default as default };
