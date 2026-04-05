import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { t as groqMediaUnderstandingProvider } from "../../media-understanding-provider-BvanoFZ6.js";
//#region extensions/groq/index.ts
var groq_default = definePluginEntry({
	id: "groq",
	name: "Groq Media Understanding",
	description: "Bundled Groq audio transcription provider",
	register(api) {
		api.registerMediaUnderstandingProvider(groqMediaUnderstandingProvider);
	}
});
//#endregion
export { groq_default as default };
