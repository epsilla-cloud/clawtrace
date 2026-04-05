import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-Day5KPIY.js";
import { wF as isVoiceCompatibleAudio } from "./auth-profiles-B5ypC5S-.js";
import "./llm-task-DlJyNbo_.js";
import { n as inferEdgeExtension, t as edgeTTS } from "./tts-BV_WaiDP.js";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { CHROMIUM_FULL_VERSION, TRUSTED_CLIENT_TOKEN, generateSecMsGecToken } from "node-edge-tts/dist/drm.js";
//#region extensions/microsoft/speech-provider.ts
const DEFAULT_EDGE_VOICE = "en-US-MichelleNeural";
const DEFAULT_EDGE_LANG = "en-US";
const DEFAULT_EDGE_OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";
function trimToUndefined(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function asBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
function asNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function asObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function normalizeMicrosoftProviderConfig(rawConfig) {
	const providers = asObject(rawConfig.providers);
	const rawEdge = asObject(rawConfig.edge);
	const rawMicrosoft = asObject(rawConfig.microsoft);
	const rawProvider = asObject(providers?.microsoft);
	const raw = {
		...rawEdge ?? {},
		...rawMicrosoft ?? {},
		...rawProvider ?? {}
	};
	const outputFormat = trimToUndefined(raw.outputFormat);
	return {
		enabled: asBoolean(raw.enabled) ?? true,
		voice: trimToUndefined(raw.voice) ?? DEFAULT_EDGE_VOICE,
		lang: trimToUndefined(raw.lang) ?? DEFAULT_EDGE_LANG,
		outputFormat: outputFormat ?? DEFAULT_EDGE_OUTPUT_FORMAT,
		outputFormatConfigured: Boolean(outputFormat),
		pitch: trimToUndefined(raw.pitch),
		rate: trimToUndefined(raw.rate),
		volume: trimToUndefined(raw.volume),
		saveSubtitles: asBoolean(raw.saveSubtitles) ?? false,
		proxy: trimToUndefined(raw.proxy),
		timeoutMs: asNumber(raw.timeoutMs)
	};
}
function readMicrosoftProviderConfig(config) {
	const defaults = normalizeMicrosoftProviderConfig({});
	return {
		enabled: asBoolean(config.enabled) ?? defaults.enabled,
		voice: trimToUndefined(config.voice) ?? defaults.voice,
		lang: trimToUndefined(config.lang) ?? defaults.lang,
		outputFormat: trimToUndefined(config.outputFormat) ?? defaults.outputFormat,
		outputFormatConfigured: asBoolean(config.outputFormatConfigured) ?? defaults.outputFormatConfigured,
		pitch: trimToUndefined(config.pitch) ?? defaults.pitch,
		rate: trimToUndefined(config.rate) ?? defaults.rate,
		volume: trimToUndefined(config.volume) ?? defaults.volume,
		saveSubtitles: asBoolean(config.saveSubtitles) ?? defaults.saveSubtitles,
		proxy: trimToUndefined(config.proxy) ?? defaults.proxy,
		timeoutMs: asNumber(config.timeoutMs) ?? defaults.timeoutMs
	};
}
function buildMicrosoftVoiceHeaders() {
	const major = CHROMIUM_FULL_VERSION.split(".")[0] || "0";
	return {
		Authority: "speech.platform.bing.com",
		Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
		Accept: "*/*",
		"User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36 Edg/${major}.0.0.0`,
		"Sec-MS-GEC": generateSecMsGecToken(),
		"Sec-MS-GEC-Version": `1-${CHROMIUM_FULL_VERSION}`
	};
}
function formatMicrosoftVoiceDescription(entry) {
	const personalities = entry.VoiceTag?.VoicePersonalities?.filter(Boolean) ?? [];
	return personalities.length > 0 ? personalities.join(", ") : void 0;
}
async function listMicrosoftVoices() {
	const response = await fetch(`https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`, { headers: buildMicrosoftVoiceHeaders() });
	if (!response.ok) throw new Error(`Microsoft voices API error (${response.status})`);
	const voices = await response.json();
	return Array.isArray(voices) ? voices.map((voice) => ({
		id: voice.ShortName?.trim() ?? "",
		name: voice.FriendlyName?.trim() || voice.ShortName?.trim() || void 0,
		category: voice.VoiceTag?.ContentCategories?.find((value) => value.trim().length > 0),
		description: formatMicrosoftVoiceDescription(voice),
		locale: voice.Locale?.trim() || void 0,
		gender: voice.Gender?.trim() || void 0,
		personalities: voice.VoiceTag?.VoicePersonalities?.filter((value) => value.trim().length > 0)
	})).filter((voice) => voice.id.length > 0) : [];
}
function buildMicrosoftSpeechProvider() {
	return {
		id: "microsoft",
		label: "Microsoft",
		aliases: ["edge"],
		autoSelectOrder: 30,
		resolveConfig: ({ rawConfig }) => normalizeMicrosoftProviderConfig(rawConfig),
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeMicrosoftProviderConfig(baseTtsConfig),
				enabled: true,
				...trimToUndefined(talkProviderConfig.voiceId) == null ? {} : { voice: trimToUndefined(talkProviderConfig.voiceId) },
				...trimToUndefined(talkProviderConfig.languageCode) == null ? {} : { lang: trimToUndefined(talkProviderConfig.languageCode) },
				...trimToUndefined(talkProviderConfig.outputFormat) == null ? {} : { outputFormat: trimToUndefined(talkProviderConfig.outputFormat) },
				...trimToUndefined(talkProviderConfig.pitch) == null ? {} : { pitch: trimToUndefined(talkProviderConfig.pitch) },
				...trimToUndefined(talkProviderConfig.rate) == null ? {} : { rate: trimToUndefined(talkProviderConfig.rate) },
				...trimToUndefined(talkProviderConfig.volume) == null ? {} : { volume: trimToUndefined(talkProviderConfig.volume) },
				...trimToUndefined(talkProviderConfig.proxy) == null ? {} : { proxy: trimToUndefined(talkProviderConfig.proxy) },
				...asNumber(talkProviderConfig.timeoutMs) == null ? {} : { timeoutMs: asNumber(talkProviderConfig.timeoutMs) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...trimToUndefined(params.voiceId) == null ? {} : { voice: trimToUndefined(params.voiceId) },
			...trimToUndefined(params.outputFormat) == null ? {} : { outputFormat: trimToUndefined(params.outputFormat) }
		}),
		listVoices: async () => await listMicrosoftVoices(),
		isConfigured: ({ providerConfig }) => readMicrosoftProviderConfig(providerConfig).enabled,
		synthesize: async (req) => {
			const config = readMicrosoftProviderConfig(req.providerConfig);
			const tempRoot = resolvePreferredOpenClawTmpDir();
			mkdirSync(tempRoot, {
				recursive: true,
				mode: 448
			});
			const tempDir = mkdtempSync(path.join(tempRoot, "tts-microsoft-"));
			const overrideVoice = trimToUndefined(req.providerOverrides?.voice);
			let outputFormat = trimToUndefined(req.providerOverrides?.outputFormat) ?? config.outputFormat;
			const fallbackOutputFormat = outputFormat !== DEFAULT_EDGE_OUTPUT_FORMAT ? DEFAULT_EDGE_OUTPUT_FORMAT : void 0;
			try {
				const runEdge = async (format) => {
					const fileExtension = inferEdgeExtension(format);
					const outputPath = path.join(tempDir, `speech${fileExtension}`);
					await edgeTTS({
						text: req.text,
						outputPath,
						config: {
							...config,
							voice: overrideVoice ?? config.voice,
							outputFormat: format
						},
						timeoutMs: req.timeoutMs
					});
					return {
						audioBuffer: readFileSync(outputPath),
						outputFormat: format,
						fileExtension,
						voiceCompatible: isVoiceCompatibleAudio({ fileName: outputPath })
					};
				};
				try {
					return await runEdge(outputFormat);
				} catch (error) {
					if (!fallbackOutputFormat || fallbackOutputFormat === outputFormat) throw error;
					outputFormat = fallbackOutputFormat;
					return await runEdge(outputFormat);
				}
			} finally {
				rmSync(tempDir, {
					recursive: true,
					force: true
				});
			}
		}
	};
}
//#endregion
export { listMicrosoftVoices as n, buildMicrosoftSpeechProvider as t };
