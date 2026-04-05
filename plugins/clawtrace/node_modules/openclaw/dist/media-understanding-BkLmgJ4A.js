import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-D7Gi17j0.js";
import { a as postTranscriptionRequest, o as requireTranscriptionText, r as normalizeBaseUrl, t as assertOkOrThrowHttpError } from "./shared-Gt31WMFf.js";
import path from "node:path";
//#region src/media-understanding/image-runtime.ts
const bindImageRuntime = createLazyRuntimeMethodBinder(createLazyRuntimeModule(() => import("./image-JDpvEij4.js")));
const describeImageWithModel = bindImageRuntime((runtime) => runtime.describeImageWithModel);
const describeImagesWithModel = bindImageRuntime((runtime) => runtime.describeImagesWithModel);
//#endregion
//#region src/media-understanding/openai-compatible-audio.ts
function resolveModel(model, fallback) {
	return model?.trim() || fallback;
}
async function transcribeOpenAiCompatibleAudio(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const baseUrl = normalizeBaseUrl(params.baseUrl, params.defaultBaseUrl);
	const allowPrivate = Boolean(params.baseUrl?.trim());
	const url = `${baseUrl}/audio/transcriptions`;
	const model = resolveModel(params.model, params.defaultModel);
	const form = new FormData();
	const fileName = params.fileName?.trim() || path.basename(params.fileName) || "audio";
	const bytes = new Uint8Array(params.buffer);
	const blob = new Blob([bytes], { type: params.mime ?? "application/octet-stream" });
	form.append("file", blob, fileName);
	form.append("model", model);
	if (params.language?.trim()) form.append("language", params.language.trim());
	if (params.prompt?.trim()) form.append("prompt", params.prompt.trim());
	const headers = new Headers(params.headers);
	if (!headers.has("authorization")) headers.set("authorization", `Bearer ${params.apiKey}`);
	const { response: res, release } = await postTranscriptionRequest({
		url,
		headers,
		body: form,
		timeoutMs: params.timeoutMs,
		fetchFn,
		allowPrivateNetwork: allowPrivate
	});
	try {
		await assertOkOrThrowHttpError(res, "Audio transcription failed");
		return {
			text: requireTranscriptionText((await res.json()).text, "Audio transcription response missing text"),
			model
		};
	} finally {
		await release();
	}
}
//#endregion
export { describeImageWithModel as n, describeImagesWithModel as r, transcribeOpenAiCompatibleAudio as t };
