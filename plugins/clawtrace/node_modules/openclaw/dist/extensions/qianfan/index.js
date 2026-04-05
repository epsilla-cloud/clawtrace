import { r as buildQianfanProvider } from "../../provider-catalog-Cqya-EiE.js";
import { n as applyQianfanConfig, t as QIANFAN_DEFAULT_MODEL_REF } from "../../onboard-BOLJqwOT.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-BTxkvN9h.js";
var qianfan_default = defineSingleProviderPluginEntry({
	id: "qianfan",
	name: "Qianfan Provider",
	description: "Bundled Qianfan provider plugin",
	provider: {
		label: "Qianfan",
		docsPath: "/providers/qianfan",
		auth: [{
			methodId: "api-key",
			label: "Qianfan API key",
			hint: "API key",
			optionKey: "qianfanApiKey",
			flagName: "--qianfan-api-key",
			envVar: "QIANFAN_API_KEY",
			promptMessage: "Enter Qianfan API key",
			defaultModel: QIANFAN_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyQianfanConfig(cfg)
		}],
		catalog: { buildProvider: buildQianfanProvider }
	}
});
//#endregion
export { qianfan_default as default };
