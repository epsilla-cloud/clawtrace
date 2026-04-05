import { t as buildMistralProvider } from "../../provider-catalog-Cmahejk_.js";
import { n as applyMistralConfig, t as MISTRAL_DEFAULT_MODEL_REF } from "../../onboard-C2OZysTY.js";
import { t as applyMistralModelCompat } from "../../api-D5EVKNBN.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-BTxkvN9h.js";
import { t as mistralMediaUnderstandingProvider } from "../../media-understanding-provider-BtCgjDip.js";
var mistral_default = defineSingleProviderPluginEntry({
	id: "mistral",
	name: "Mistral Provider",
	description: "Bundled Mistral provider plugin",
	provider: {
		label: "Mistral",
		docsPath: "/providers/models",
		auth: [{
			methodId: "api-key",
			label: "Mistral API key",
			hint: "API key",
			optionKey: "mistralApiKey",
			flagName: "--mistral-api-key",
			envVar: "MISTRAL_API_KEY",
			promptMessage: "Enter Mistral API key",
			defaultModel: MISTRAL_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyMistralConfig(cfg),
			wizard: { groupLabel: "Mistral AI" }
		}],
		catalog: {
			buildProvider: buildMistralProvider,
			allowExplicitBaseUrl: true
		},
		normalizeResolvedModel: ({ model }) => applyMistralModelCompat(model),
		capabilities: {
			transcriptToolCallIdMode: "strict9",
			transcriptToolCallIdModelHints: [
				"mistral",
				"mixtral",
				"codestral",
				"pixtral",
				"devstral",
				"ministral",
				"mistralai"
			]
		}
	},
	register(api) {
		api.registerMediaUnderstandingProvider(mistralMediaUnderstandingProvider);
	}
});
//#endregion
export { mistral_default as default };
