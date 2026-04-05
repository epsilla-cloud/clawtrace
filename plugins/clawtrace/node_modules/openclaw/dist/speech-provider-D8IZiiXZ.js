import { c as normalizeResolvedSecretInputString } from "./types.secrets-Rqz2qv-w.js";
import "./secret-input-CozdTJRh.js";
import { a as isValidOpenAIVoice, i as isValidOpenAIModel, n as OPENAI_TTS_MODELS, o as normalizeOpenAITtsBaseUrl, r as OPENAI_TTS_VOICES, s as openaiTTS } from "./tts-BIKrj26D.js";
//#region extensions/openai/speech-provider.ts
function trimToUndefined(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function asNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function asObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function normalizeOpenAIProviderConfig(rawConfig) {
	const raw = asObject(asObject(rawConfig.providers)?.openai) ?? asObject(rawConfig.openai);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "messages.tts.providers.openai.apiKey"
		}),
		baseUrl: normalizeOpenAITtsBaseUrl(trimToUndefined(raw?.baseUrl) ?? trimToUndefined(process.env.OPENAI_TTS_BASE_URL) ?? "https://api.openai.com/v1"),
		model: trimToUndefined(raw?.model) ?? "gpt-4o-mini-tts",
		voice: trimToUndefined(raw?.voice) ?? "coral",
		speed: asNumber(raw?.speed),
		instructions: trimToUndefined(raw?.instructions)
	};
}
function readOpenAIProviderConfig(config) {
	const normalized = normalizeOpenAIProviderConfig({});
	return {
		apiKey: trimToUndefined(config.apiKey) ?? normalized.apiKey,
		baseUrl: trimToUndefined(config.baseUrl) ?? normalized.baseUrl,
		model: trimToUndefined(config.model) ?? normalized.model,
		voice: trimToUndefined(config.voice) ?? normalized.voice,
		speed: asNumber(config.speed) ?? normalized.speed,
		instructions: trimToUndefined(config.instructions) ?? normalized.instructions
	};
}
function readOpenAIOverrides(overrides) {
	if (!overrides) return {};
	return {
		model: trimToUndefined(overrides.model),
		voice: trimToUndefined(overrides.voice),
		speed: asNumber(overrides.speed)
	};
}
function parseDirectiveToken(ctx) {
	const baseUrl = trimToUndefined(ctx.providerConfig?.baseUrl);
	switch (ctx.key) {
		case "voice":
		case "openai_voice":
		case "openaivoice":
			if (!ctx.policy.allowVoice) return { handled: true };
			if (!isValidOpenAIVoice(ctx.value, baseUrl)) return {
				handled: true,
				warnings: [`invalid OpenAI voice "${ctx.value}"`]
			};
			return {
				handled: true,
				overrides: { voice: ctx.value }
			};
		case "model":
		case "openai_model":
		case "openaimodel":
			if (!ctx.policy.allowModelId) return { handled: true };
			if (!isValidOpenAIModel(ctx.value, baseUrl)) return { handled: false };
			return {
				handled: true,
				overrides: { model: ctx.value }
			};
		default: return { handled: false };
	}
}
function buildOpenAISpeechProvider() {
	return {
		id: "openai",
		label: "OpenAI",
		autoSelectOrder: 10,
		models: OPENAI_TTS_MODELS,
		voices: OPENAI_TTS_VOICES,
		resolveConfig: ({ rawConfig }) => normalizeOpenAIProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeOpenAIProviderConfig(baseTtsConfig),
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.openai.apiKey"
				}) },
				...trimToUndefined(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: trimToUndefined(talkProviderConfig.baseUrl) },
				...trimToUndefined(talkProviderConfig.modelId) == null ? {} : { model: trimToUndefined(talkProviderConfig.modelId) },
				...trimToUndefined(talkProviderConfig.voiceId) == null ? {} : { voice: trimToUndefined(talkProviderConfig.voiceId) },
				...asNumber(talkProviderConfig.speed) == null ? {} : { speed: asNumber(talkProviderConfig.speed) },
				...trimToUndefined(talkProviderConfig.instructions) == null ? {} : { instructions: trimToUndefined(talkProviderConfig.instructions) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...trimToUndefined(params.voiceId) == null ? {} : { voice: trimToUndefined(params.voiceId) },
			...trimToUndefined(params.modelId) == null ? {} : { model: trimToUndefined(params.modelId) },
			...asNumber(params.speed) == null ? {} : { speed: asNumber(params.speed) }
		}),
		listVoices: async () => OPENAI_TTS_VOICES.map((voice) => ({
			id: voice,
			name: voice
		})),
		isConfigured: ({ providerConfig }) => Boolean(readOpenAIProviderConfig(providerConfig).apiKey || process.env.OPENAI_API_KEY),
		synthesize: async (req) => {
			const config = readOpenAIProviderConfig(req.providerConfig);
			const overrides = readOpenAIOverrides(req.providerOverrides);
			const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
			if (!apiKey) throw new Error("OpenAI API key missing");
			const responseFormat = req.target === "voice-note" ? "opus" : "mp3";
			return {
				audioBuffer: await openaiTTS({
					text: req.text,
					apiKey,
					baseUrl: config.baseUrl,
					model: overrides.model ?? config.model,
					voice: overrides.voice ?? config.voice,
					speed: overrides.speed ?? config.speed,
					instructions: config.instructions,
					responseFormat,
					timeoutMs: req.timeoutMs
				}),
				outputFormat: responseFormat,
				fileExtension: responseFormat === "opus" ? ".opus" : ".mp3",
				voiceCompatible: req.target === "voice-note"
			};
		},
		synthesizeTelephony: async (req) => {
			const config = readOpenAIProviderConfig(req.providerConfig);
			const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
			if (!apiKey) throw new Error("OpenAI API key missing");
			const outputFormat = "pcm";
			return {
				audioBuffer: await openaiTTS({
					text: req.text,
					apiKey,
					baseUrl: config.baseUrl,
					model: config.model,
					voice: config.voice,
					speed: config.speed,
					instructions: config.instructions,
					responseFormat: outputFormat,
					timeoutMs: req.timeoutMs
				}),
				outputFormat,
				sampleRate: 24e3
			};
		}
	};
}
//#endregion
export { buildOpenAISpeechProvider as t };
