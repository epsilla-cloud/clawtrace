import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { t as buildOpenAIProvider } from "../../openai-provider-DJgPe8PH.js";
import { t as buildOpenAICodexCliBackend } from "../../cli-backend-B85te5xL.js";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-fiOkT1Zi.js";
import { n as openaiCodexMediaUnderstandingProvider, r as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-CMTjP7wC.js";
import { t as buildOpenAICodexProviderPlugin } from "../../openai-codex-provider-vU-uhbck.js";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-D8IZiiXZ.js";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		api.registerCliBackend(buildOpenAICodexCliBackend());
		api.registerProvider(buildOpenAIProvider());
		api.registerProvider(buildOpenAICodexProviderPlugin());
		api.registerSpeechProvider(buildOpenAISpeechProvider());
		api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
		api.registerMediaUnderstandingProvider(openaiCodexMediaUnderstandingProvider);
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
	}
});
//#endregion
export { openai_default as default };
