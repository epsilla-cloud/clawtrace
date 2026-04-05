import { a as MODELSTUDIO_DEFAULT_MODEL_REF, u as applyModelStudioNativeStreamingUsageCompat } from "../../models-DS5W-29W.js";
import { t as buildModelStudioProvider } from "../../provider-catalog-DYi0SrBt.js";
import "../../api-DIew_gcy.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-BTxkvN9h.js";
import { a as applyModelStudioStandardConfig, n as applyModelStudioConfigCn, o as applyModelStudioStandardConfigCn, t as applyModelStudioConfig } from "../../onboard-Bu-XOIky.js";
var modelstudio_default = defineSingleProviderPluginEntry({
	id: "modelstudio",
	name: "Model Studio Provider",
	description: "Bundled Model Studio provider plugin",
	provider: {
		label: "Model Studio",
		docsPath: "/providers/models",
		auth: [
			{
				methodId: "standard-api-key-cn",
				label: "Standard API Key for China (pay-as-you-go)",
				hint: "Endpoint: dashscope.aliyuncs.com",
				optionKey: "modelstudioStandardApiKeyCn",
				flagName: "--modelstudio-standard-api-key-cn",
				envVar: "MODELSTUDIO_API_KEY",
				promptMessage: "Enter Alibaba Cloud Model Studio API key (China)",
				defaultModel: MODELSTUDIO_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyModelStudioStandardConfigCn(cfg),
				noteMessage: [
					"Get your API key at: https://bailian.console.aliyun.com/",
					"Endpoint: dashscope.aliyuncs.com/compatible-mode/v1",
					"Models: qwen3.5-plus, qwen3-coder-plus, qwen3-coder-next, etc."
				].join("\n"),
				noteTitle: "Alibaba Cloud Model Studio Standard (China)",
				wizard: {
					choiceHint: "Endpoint: dashscope.aliyuncs.com",
					groupLabel: "Qwen (Alibaba Cloud Model Studio)",
					groupHint: "Standard / Coding Plan (CN / Global)"
				}
			},
			{
				methodId: "standard-api-key",
				label: "Standard API Key for Global/Intl (pay-as-you-go)",
				hint: "Endpoint: dashscope-intl.aliyuncs.com",
				optionKey: "modelstudioStandardApiKey",
				flagName: "--modelstudio-standard-api-key",
				envVar: "MODELSTUDIO_API_KEY",
				promptMessage: "Enter Alibaba Cloud Model Studio API key (Global/Intl)",
				defaultModel: MODELSTUDIO_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyModelStudioStandardConfig(cfg),
				noteMessage: [
					"Get your API key at: https://modelstudio.console.alibabacloud.com/",
					"Endpoint: dashscope-intl.aliyuncs.com/compatible-mode/v1",
					"Models: qwen3.5-plus, qwen3-coder-plus, qwen3-coder-next, etc."
				].join("\n"),
				noteTitle: "Alibaba Cloud Model Studio Standard (Global/Intl)",
				wizard: {
					choiceHint: "Endpoint: dashscope-intl.aliyuncs.com",
					groupLabel: "Qwen (Alibaba Cloud Model Studio)",
					groupHint: "Standard / Coding Plan (CN / Global)"
				}
			},
			{
				methodId: "api-key-cn",
				label: "Coding Plan API Key for China (subscription)",
				hint: "Endpoint: coding.dashscope.aliyuncs.com",
				optionKey: "modelstudioApiKeyCn",
				flagName: "--modelstudio-api-key-cn",
				envVar: "MODELSTUDIO_API_KEY",
				promptMessage: "Enter Alibaba Cloud Model Studio Coding Plan API key (China)",
				defaultModel: MODELSTUDIO_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyModelStudioConfigCn(cfg),
				noteMessage: [
					"Get your API key at: https://bailian.console.aliyun.com/",
					"Endpoint: coding.dashscope.aliyuncs.com",
					"Models: qwen3.5-plus, glm-5, kimi-k2.5, MiniMax-M2.5, etc."
				].join("\n"),
				noteTitle: "Alibaba Cloud Model Studio Coding Plan (China)",
				wizard: {
					choiceHint: "Endpoint: coding.dashscope.aliyuncs.com",
					groupLabel: "Qwen (Alibaba Cloud Model Studio)",
					groupHint: "Standard / Coding Plan (CN / Global)"
				}
			},
			{
				methodId: "api-key",
				label: "Coding Plan API Key for Global/Intl (subscription)",
				hint: "Endpoint: coding-intl.dashscope.aliyuncs.com",
				optionKey: "modelstudioApiKey",
				flagName: "--modelstudio-api-key",
				envVar: "MODELSTUDIO_API_KEY",
				promptMessage: "Enter Alibaba Cloud Model Studio Coding Plan API key (Global/Intl)",
				defaultModel: MODELSTUDIO_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyModelStudioConfig(cfg),
				noteMessage: [
					"Get your API key at: https://bailian.console.aliyun.com/",
					"Endpoint: coding-intl.dashscope.aliyuncs.com",
					"Models: qwen3.5-plus, glm-5, kimi-k2.5, MiniMax-M2.5, etc."
				].join("\n"),
				noteTitle: "Alibaba Cloud Model Studio Coding Plan (Global/Intl)",
				wizard: {
					choiceHint: "Endpoint: coding-intl.dashscope.aliyuncs.com",
					groupLabel: "Qwen (Alibaba Cloud Model Studio)",
					groupHint: "Standard / Coding Plan (CN / Global)"
				}
			}
		],
		catalog: {
			buildProvider: buildModelStudioProvider,
			allowExplicitBaseUrl: true
		},
		applyNativeStreamingUsageCompat: ({ providerConfig }) => applyModelStudioNativeStreamingUsageCompat(providerConfig)
	}
});
//#endregion
export { modelstudio_default as default };
