import { n as normalizeGoogleModelId } from "../../model-id-fXGzbdpZ.js";
import { a as normalizeGoogleApiBaseUrl, c as parseGeminiAuth, t as DEFAULT_GOOGLE_API_BASE_URL } from "../../api-BnzTE5Fb.js";
import { i as postJsonRequest, r as normalizeBaseUrl, t as assertOkOrThrowHttpError } from "../../shared-Gt31WMFf.js";
import { n as describeImageWithModel, r as describeImagesWithModel } from "../../media-understanding-BkLmgJ4A.js";
import "../../provider-http-bVkIpydz.js";
//#region extensions/google/media-understanding-provider.ts
const DEFAULT_GOOGLE_AUDIO_BASE_URL = DEFAULT_GOOGLE_API_BASE_URL;
const DEFAULT_GOOGLE_VIDEO_BASE_URL = DEFAULT_GOOGLE_API_BASE_URL;
const DEFAULT_GOOGLE_AUDIO_MODEL = "gemini-3-flash-preview";
const DEFAULT_GOOGLE_VIDEO_MODEL = "gemini-3-flash-preview";
const DEFAULT_GOOGLE_AUDIO_PROMPT = "Transcribe the audio.";
const DEFAULT_GOOGLE_VIDEO_PROMPT = "Describe the video.";
async function generateGeminiInlineDataText(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const baseUrl = normalizeBaseUrl(normalizeGoogleApiBaseUrl(params.baseUrl ?? params.defaultBaseUrl), DEFAULT_GOOGLE_API_BASE_URL);
	const allowPrivate = Boolean(params.baseUrl?.trim());
	const model = (() => {
		const trimmed = params.model?.trim();
		if (!trimmed) return params.defaultModel;
		return normalizeGoogleModelId(trimmed);
	})();
	const url = `${baseUrl}/models/${model}:generateContent`;
	const authHeaders = parseGeminiAuth(params.apiKey);
	const headers = new Headers(params.headers);
	for (const [key, value] of Object.entries(authHeaders.headers)) if (!headers.has(key)) headers.set(key, value);
	const { response: res, release } = await postJsonRequest({
		url,
		headers,
		body: { contents: [{
			role: "user",
			parts: [{ text: params.prompt?.trim() || params.defaultPrompt }, { inline_data: {
				mime_type: params.mime ?? params.defaultMime,
				data: params.buffer.toString("base64")
			} }]
		}] },
		timeoutMs: params.timeoutMs,
		fetchFn,
		allowPrivateNetwork: allowPrivate
	});
	try {
		await assertOkOrThrowHttpError(res, params.httpErrorLabel);
		const text = ((await res.json()).candidates?.[0]?.content?.parts ?? []).map((part) => part?.text?.trim()).filter(Boolean).join("\n");
		if (!text) throw new Error(params.missingTextError);
		return {
			text,
			model
		};
	} finally {
		await release();
	}
}
async function transcribeGeminiAudio(params) {
	const { text, model } = await generateGeminiInlineDataText({
		...params,
		defaultBaseUrl: DEFAULT_GOOGLE_AUDIO_BASE_URL,
		defaultModel: DEFAULT_GOOGLE_AUDIO_MODEL,
		defaultPrompt: DEFAULT_GOOGLE_AUDIO_PROMPT,
		defaultMime: "audio/wav",
		httpErrorLabel: "Audio transcription failed",
		missingTextError: "Audio transcription response missing text"
	});
	return {
		text,
		model
	};
}
async function describeGeminiVideo(params) {
	const { text, model } = await generateGeminiInlineDataText({
		...params,
		defaultBaseUrl: DEFAULT_GOOGLE_VIDEO_BASE_URL,
		defaultModel: DEFAULT_GOOGLE_VIDEO_MODEL,
		defaultPrompt: DEFAULT_GOOGLE_VIDEO_PROMPT,
		defaultMime: "video/mp4",
		httpErrorLabel: "Video description failed",
		missingTextError: "Video description response missing text"
	});
	return {
		text,
		model
	};
}
const googleMediaUnderstandingProvider = {
	id: "google",
	capabilities: [
		"image",
		"audio",
		"video"
	],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel,
	transcribeAudio: transcribeGeminiAudio,
	describeVideo: describeGeminiVideo
};
//#endregion
export { DEFAULT_GOOGLE_AUDIO_BASE_URL, DEFAULT_GOOGLE_VIDEO_BASE_URL, describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };
