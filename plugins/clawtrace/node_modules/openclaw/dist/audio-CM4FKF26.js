import { a as postTranscriptionRequest, o as requireTranscriptionText, r as normalizeBaseUrl, t as assertOkOrThrowHttpError } from "./shared-Gt31WMFf.js";
import "./provider-http-bVkIpydz.js";
//#region extensions/deepgram/audio.ts
const DEFAULT_DEEPGRAM_AUDIO_BASE_URL = "https://api.deepgram.com/v1";
const DEFAULT_DEEPGRAM_AUDIO_MODEL = "nova-3";
function resolveModel(model) {
	return model?.trim() || "nova-3";
}
async function transcribeDeepgramAudio(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const baseUrl = normalizeBaseUrl(params.baseUrl, DEFAULT_DEEPGRAM_AUDIO_BASE_URL);
	const allowPrivate = Boolean(params.baseUrl?.trim());
	const model = resolveModel(params.model);
	const url = new URL(`${baseUrl}/listen`);
	url.searchParams.set("model", model);
	if (params.language?.trim()) url.searchParams.set("language", params.language.trim());
	if (params.query) for (const [key, value] of Object.entries(params.query)) {
		if (value === void 0) continue;
		url.searchParams.set(key, String(value));
	}
	const headers = new Headers(params.headers);
	if (!headers.has("authorization")) headers.set("authorization", `Token ${params.apiKey}`);
	if (!headers.has("content-type")) headers.set("content-type", params.mime ?? "application/octet-stream");
	const body = new Uint8Array(params.buffer);
	const { response: res, release } = await postTranscriptionRequest({
		url: url.toString(),
		headers,
		body,
		timeoutMs: params.timeoutMs,
		fetchFn,
		allowPrivateNetwork: allowPrivate
	});
	try {
		await assertOkOrThrowHttpError(res, "Audio transcription failed");
		return {
			text: requireTranscriptionText((await res.json()).results?.channels?.[0]?.alternatives?.[0]?.transcript, "Audio transcription response missing transcript"),
			model
		};
	} finally {
		await release();
	}
}
//#endregion
export { DEFAULT_DEEPGRAM_AUDIO_MODEL as n, transcribeDeepgramAudio as r, DEFAULT_DEEPGRAM_AUDIO_BASE_URL as t };
