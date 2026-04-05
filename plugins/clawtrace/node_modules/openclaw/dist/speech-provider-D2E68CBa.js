import { C_ as normalizeSeed, S_ as normalizeLanguageCode, w_ as requireInRange, x_ as normalizeApplyTextNormalization } from "./auth-profiles-B5ypC5S-.js";
import { c as normalizeResolvedSecretInputString } from "./types.secrets-Rqz2qv-w.js";
import "./secret-input-CozdTJRh.js";
import { t as elevenLabsTTS } from "./tts-DD2ysXkj.js";
//#region extensions/elevenlabs/speech-provider.ts
const DEFAULT_ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";
const DEFAULT_ELEVENLABS_VOICE_ID = "pMsXgVXv3BLzUgSXRplE";
const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_ELEVENLABS_VOICE_SETTINGS = {
	stability: .5,
	similarityBoost: .75,
	style: 0,
	useSpeakerBoost: true,
	speed: 1
};
const ELEVENLABS_TTS_MODELS = [
	"eleven_multilingual_v2",
	"eleven_turbo_v2_5",
	"eleven_monolingual_v1"
];
function trimToUndefined(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function asNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function asBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
function asObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function parseBooleanValue(value) {
	const normalized = value.trim().toLowerCase();
	if ([
		"true",
		"1",
		"yes",
		"on"
	].includes(normalized)) return true;
	if ([
		"false",
		"0",
		"no",
		"off"
	].includes(normalized)) return false;
}
function parseNumberValue(value) {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function isValidVoiceId(voiceId) {
	return /^[a-zA-Z0-9]{10,40}$/.test(voiceId);
}
function normalizeElevenLabsBaseUrl(baseUrl) {
	return (baseUrl?.trim())?.replace(/\/+$/, "") || DEFAULT_ELEVENLABS_BASE_URL;
}
function normalizeElevenLabsProviderConfig(rawConfig) {
	const raw = asObject(asObject(rawConfig.providers)?.elevenlabs) ?? asObject(rawConfig.elevenlabs);
	const rawVoiceSettings = asObject(raw?.voiceSettings);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "messages.tts.providers.elevenlabs.apiKey"
		}),
		baseUrl: normalizeElevenLabsBaseUrl(trimToUndefined(raw?.baseUrl)),
		voiceId: trimToUndefined(raw?.voiceId) ?? DEFAULT_ELEVENLABS_VOICE_ID,
		modelId: trimToUndefined(raw?.modelId) ?? DEFAULT_ELEVENLABS_MODEL_ID,
		seed: asNumber(raw?.seed),
		applyTextNormalization: trimToUndefined(raw?.applyTextNormalization),
		languageCode: trimToUndefined(raw?.languageCode),
		voiceSettings: {
			stability: asNumber(rawVoiceSettings?.stability) ?? DEFAULT_ELEVENLABS_VOICE_SETTINGS.stability,
			similarityBoost: asNumber(rawVoiceSettings?.similarityBoost) ?? DEFAULT_ELEVENLABS_VOICE_SETTINGS.similarityBoost,
			style: asNumber(rawVoiceSettings?.style) ?? DEFAULT_ELEVENLABS_VOICE_SETTINGS.style,
			useSpeakerBoost: asBoolean(rawVoiceSettings?.useSpeakerBoost) ?? DEFAULT_ELEVENLABS_VOICE_SETTINGS.useSpeakerBoost,
			speed: asNumber(rawVoiceSettings?.speed) ?? DEFAULT_ELEVENLABS_VOICE_SETTINGS.speed
		}
	};
}
function readElevenLabsProviderConfig(config) {
	const defaults = normalizeElevenLabsProviderConfig({});
	const voiceSettings = asObject(config.voiceSettings);
	return {
		apiKey: trimToUndefined(config.apiKey) ?? defaults.apiKey,
		baseUrl: normalizeElevenLabsBaseUrl(trimToUndefined(config.baseUrl) ?? defaults.baseUrl),
		voiceId: trimToUndefined(config.voiceId) ?? defaults.voiceId,
		modelId: trimToUndefined(config.modelId) ?? defaults.modelId,
		seed: asNumber(config.seed) ?? defaults.seed,
		applyTextNormalization: trimToUndefined(config.applyTextNormalization) ?? defaults.applyTextNormalization,
		languageCode: trimToUndefined(config.languageCode) ?? defaults.languageCode,
		voiceSettings: {
			stability: asNumber(voiceSettings?.stability) ?? defaults.voiceSettings.stability,
			similarityBoost: asNumber(voiceSettings?.similarityBoost) ?? defaults.voiceSettings.similarityBoost,
			style: asNumber(voiceSettings?.style) ?? defaults.voiceSettings.style,
			useSpeakerBoost: asBoolean(voiceSettings?.useSpeakerBoost) ?? defaults.voiceSettings.useSpeakerBoost,
			speed: asNumber(voiceSettings?.speed) ?? defaults.voiceSettings.speed
		}
	};
}
function mergeVoiceSettingsOverride(ctx, next) {
	return {
		...ctx.currentOverrides ?? {},
		voiceSettings: {
			...asObject(ctx.currentOverrides?.voiceSettings) ?? {},
			...next
		}
	};
}
function parseDirectiveToken(ctx) {
	try {
		switch (ctx.key) {
			case "voiceid":
			case "voice_id":
			case "elevenlabs_voice":
			case "elevenlabsvoice":
				if (!ctx.policy.allowVoice) return { handled: true };
				if (!isValidVoiceId(ctx.value)) return {
					handled: true,
					warnings: [`invalid ElevenLabs voiceId "${ctx.value}"`]
				};
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides ?? {},
						voiceId: ctx.value
					}
				};
			case "model":
			case "modelid":
			case "model_id":
			case "elevenlabs_model":
			case "elevenlabsmodel":
				if (!ctx.policy.allowModelId) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides ?? {},
						modelId: ctx.value
					}
				};
			case "stability": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid stability value"]
				};
				requireInRange(value, 0, 1, "stability");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { stability: value })
				};
			}
			case "similarity":
			case "similarityboost":
			case "similarity_boost": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid similarityBoost value"]
				};
				requireInRange(value, 0, 1, "similarityBoost");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { similarityBoost: value })
				};
			}
			case "style": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid style value"]
				};
				requireInRange(value, 0, 1, "style");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { style: value })
				};
			}
			case "speed": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid speed value"]
				};
				requireInRange(value, .5, 2, "speed");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { speed: value })
				};
			}
			case "speakerboost":
			case "speaker_boost":
			case "usespeakerboost":
			case "use_speaker_boost": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseBooleanValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid useSpeakerBoost value"]
				};
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { useSpeakerBoost: value })
				};
			}
			case "normalize":
			case "applytextnormalization":
			case "apply_text_normalization":
				if (!ctx.policy.allowNormalization) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides ?? {},
						applyTextNormalization: normalizeApplyTextNormalization(ctx.value)
					}
				};
			case "language":
			case "languagecode":
			case "language_code":
				if (!ctx.policy.allowNormalization) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides ?? {},
						languageCode: normalizeLanguageCode(ctx.value)
					}
				};
			case "seed":
				if (!ctx.policy.allowSeed) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides ?? {},
						seed: normalizeSeed(Number.parseInt(ctx.value, 10))
					}
				};
			default: return { handled: false };
		}
	} catch (error) {
		return {
			handled: true,
			warnings: [error instanceof Error ? error.message : String(error)]
		};
	}
}
async function listElevenLabsVoices(params) {
	const res = await fetch(`${normalizeElevenLabsBaseUrl(params.baseUrl)}/v1/voices`, { headers: { "xi-api-key": params.apiKey } });
	if (!res.ok) throw new Error(`ElevenLabs voices API error (${res.status})`);
	const json = await res.json();
	return Array.isArray(json.voices) ? json.voices.map((voice) => ({
		id: voice.voice_id?.trim() ?? "",
		name: voice.name?.trim() || void 0,
		category: voice.category?.trim() || void 0,
		description: voice.description?.trim() || void 0
	})).filter((voice) => voice.id.length > 0) : [];
}
function buildElevenLabsSpeechProvider() {
	return {
		id: "elevenlabs",
		label: "ElevenLabs",
		autoSelectOrder: 20,
		models: ELEVENLABS_TTS_MODELS,
		resolveConfig: ({ rawConfig }) => normalizeElevenLabsProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeElevenLabsProviderConfig(baseTtsConfig);
			const talkVoiceSettings = asObject(talkProviderConfig.voiceSettings);
			return {
				...base,
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.elevenlabs.apiKey"
				}) },
				...trimToUndefined(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeElevenLabsBaseUrl(trimToUndefined(talkProviderConfig.baseUrl)) },
				...trimToUndefined(talkProviderConfig.voiceId) == null ? {} : { voiceId: trimToUndefined(talkProviderConfig.voiceId) },
				...trimToUndefined(talkProviderConfig.modelId) == null ? {} : { modelId: trimToUndefined(talkProviderConfig.modelId) },
				...asNumber(talkProviderConfig.seed) == null ? {} : { seed: asNumber(talkProviderConfig.seed) },
				...trimToUndefined(talkProviderConfig.applyTextNormalization) == null ? {} : { applyTextNormalization: normalizeApplyTextNormalization(trimToUndefined(talkProviderConfig.applyTextNormalization)) },
				...trimToUndefined(talkProviderConfig.languageCode) == null ? {} : { languageCode: normalizeLanguageCode(trimToUndefined(talkProviderConfig.languageCode)) },
				voiceSettings: {
					...base.voiceSettings,
					...asNumber(talkVoiceSettings?.stability) == null ? {} : { stability: asNumber(talkVoiceSettings?.stability) },
					...asNumber(talkVoiceSettings?.similarityBoost) == null ? {} : { similarityBoost: asNumber(talkVoiceSettings?.similarityBoost) },
					...asNumber(talkVoiceSettings?.style) == null ? {} : { style: asNumber(talkVoiceSettings?.style) },
					...asBoolean(talkVoiceSettings?.useSpeakerBoost) == null ? {} : { useSpeakerBoost: asBoolean(talkVoiceSettings?.useSpeakerBoost) },
					...asNumber(talkVoiceSettings?.speed) == null ? {} : { speed: asNumber(talkVoiceSettings?.speed) }
				}
			};
		},
		resolveTalkOverrides: ({ params }) => {
			const normalize = trimToUndefined(params.normalize);
			const language = trimToUndefined(params.language)?.toLowerCase();
			const voiceSettings = {
				...asNumber(params.speed) == null ? {} : { speed: asNumber(params.speed) },
				...asNumber(params.stability) == null ? {} : { stability: asNumber(params.stability) },
				...asNumber(params.similarity) == null ? {} : { similarityBoost: asNumber(params.similarity) },
				...asNumber(params.style) == null ? {} : { style: asNumber(params.style) },
				...asBoolean(params.speakerBoost) == null ? {} : { useSpeakerBoost: asBoolean(params.speakerBoost) }
			};
			return {
				...trimToUndefined(params.voiceId) == null ? {} : { voiceId: trimToUndefined(params.voiceId) },
				...trimToUndefined(params.modelId) == null ? {} : { modelId: trimToUndefined(params.modelId) },
				...trimToUndefined(params.outputFormat) == null ? {} : { outputFormat: trimToUndefined(params.outputFormat) },
				...asNumber(params.seed) == null ? {} : { seed: asNumber(params.seed) },
				...normalize == null ? {} : { applyTextNormalization: normalizeApplyTextNormalization(normalize) },
				...language == null ? {} : { languageCode: normalizeLanguageCode(language) },
				...Object.keys(voiceSettings).length === 0 ? {} : { voiceSettings }
			};
		},
		listVoices: async (req) => {
			const config = req.providerConfig ? readElevenLabsProviderConfig(req.providerConfig) : void 0;
			const apiKey = req.apiKey || config?.apiKey || process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY;
			if (!apiKey) throw new Error("ElevenLabs API key missing");
			return listElevenLabsVoices({
				apiKey,
				baseUrl: req.baseUrl ?? config?.baseUrl
			});
		},
		isConfigured: ({ providerConfig }) => Boolean(readElevenLabsProviderConfig(providerConfig).apiKey || process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY),
		synthesize: async (req) => {
			const config = readElevenLabsProviderConfig(req.providerConfig);
			const overrides = req.providerOverrides ?? {};
			const apiKey = config.apiKey || process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY;
			if (!apiKey) throw new Error("ElevenLabs API key missing");
			const outputFormat = trimToUndefined(overrides.outputFormat) ?? (req.target === "voice-note" ? "opus_48000_64" : "mp3_44100_128");
			const overrideVoiceSettings = asObject(overrides.voiceSettings);
			return {
				audioBuffer: await elevenLabsTTS({
					text: req.text,
					apiKey,
					baseUrl: config.baseUrl,
					voiceId: trimToUndefined(overrides.voiceId) ?? config.voiceId,
					modelId: trimToUndefined(overrides.modelId) ?? config.modelId,
					outputFormat,
					seed: asNumber(overrides.seed) ?? config.seed,
					applyTextNormalization: trimToUndefined(overrides.applyTextNormalization) ?? config.applyTextNormalization,
					languageCode: trimToUndefined(overrides.languageCode) ?? config.languageCode,
					voiceSettings: {
						...config.voiceSettings,
						...asNumber(overrideVoiceSettings?.stability) == null ? {} : { stability: asNumber(overrideVoiceSettings?.stability) },
						...asNumber(overrideVoiceSettings?.similarityBoost) == null ? {} : { similarityBoost: asNumber(overrideVoiceSettings?.similarityBoost) },
						...asNumber(overrideVoiceSettings?.style) == null ? {} : { style: asNumber(overrideVoiceSettings?.style) },
						...asBoolean(overrideVoiceSettings?.useSpeakerBoost) == null ? {} : { useSpeakerBoost: asBoolean(overrideVoiceSettings?.useSpeakerBoost) },
						...asNumber(overrideVoiceSettings?.speed) == null ? {} : { speed: asNumber(overrideVoiceSettings?.speed) }
					},
					timeoutMs: req.timeoutMs
				}),
				outputFormat,
				fileExtension: req.target === "voice-note" ? ".opus" : ".mp3",
				voiceCompatible: req.target === "voice-note"
			};
		},
		synthesizeTelephony: async (req) => {
			const config = readElevenLabsProviderConfig(req.providerConfig);
			const apiKey = config.apiKey || process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY;
			if (!apiKey) throw new Error("ElevenLabs API key missing");
			const outputFormat = "pcm_22050";
			return {
				audioBuffer: await elevenLabsTTS({
					text: req.text,
					apiKey,
					baseUrl: config.baseUrl,
					voiceId: config.voiceId,
					modelId: config.modelId,
					outputFormat,
					seed: config.seed,
					applyTextNormalization: config.applyTextNormalization,
					languageCode: config.languageCode,
					voiceSettings: config.voiceSettings,
					timeoutMs: req.timeoutMs
				}),
				outputFormat,
				sampleRate: 22050
			};
		}
	};
}
//#endregion
export { isValidVoiceId as n, listElevenLabsVoices as r, buildElevenLabsSpeechProvider as t };
