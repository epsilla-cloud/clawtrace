import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-dVvNnCb0.js";
import "../../provider-auth-api-key-A3ylU4FZ.js";
import { n as applyOpencodeGoConfig, t as OPENCODE_GO_DEFAULT_MODEL_REF } from "../../onboard-CQNkI04j.js";
//#region extensions/opencode-go/index.ts
const PROVIDER_ID = "opencode-go";
var opencode_go_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "OpenCode Go Provider",
	description: "Bundled OpenCode Go provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "OpenCode Go",
			docsPath: "/providers/models",
			envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: PROVIDER_ID,
				methodId: "api-key",
				label: "OpenCode Go catalog",
				hint: "Shared API key for Zen + Go catalogs",
				optionKey: "opencodeGoApiKey",
				flagName: "--opencode-go-api-key",
				envVar: "OPENCODE_API_KEY",
				promptMessage: "Enter OpenCode API key",
				profileIds: ["opencode:default", "opencode-go:default"],
				defaultModel: OPENCODE_GO_DEFAULT_MODEL_REF,
				expectedProviders: ["opencode", "opencode-go"],
				applyConfig: (cfg) => applyOpencodeGoConfig(cfg),
				noteMessage: [
					"OpenCode uses one API key across the Zen and Go catalogs.",
					"Go focuses on Kimi, GLM, and MiniMax coding models.",
					"Get your API key at: https://opencode.ai/auth"
				].join("\n"),
				noteTitle: "OpenCode",
				wizard: {
					choiceId: "opencode-go",
					choiceLabel: "OpenCode Go catalog",
					groupId: "opencode",
					groupLabel: "OpenCode",
					groupHint: "Shared API key for Zen + Go catalogs"
				}
			})],
			capabilities: {
				openAiCompatTurnValidation: false,
				geminiThoughtSignatureSanitization: true,
				geminiThoughtSignatureModelHints: ["gemini"]
			},
			isModernModelRef: () => true
		});
	}
});
//#endregion
export { opencode_go_default as default };
