import { Aw as coerceImageAssistantText, Dw as minimaxUnderstandImage, Ew as isMinimaxVlmModel, Go as resolveApiKeyForProvider, Vo as getApiKeyForModel, WP as ensureOpenClawModelsJson } from "./auth-profiles-B5ypC5S-.js";
import { u as normalizeModelRef } from "./model-selection-CMtvxDDg.js";
import { n as requireApiKey } from "./provider-auth-runtime-DQXKSr5V.js";
import { complete } from "@mariozechner/pi-ai";
//#region src/media-understanding/image.ts
let piModelDiscoveryRuntimePromise = null;
function loadPiModelDiscoveryRuntime() {
	piModelDiscoveryRuntimePromise ??= import("./agents/pi-model-discovery-runtime.js");
	return piModelDiscoveryRuntimePromise;
}
function resolveImageToolMaxTokens(modelMaxTokens, requestedMaxTokens = 4096) {
	if (typeof modelMaxTokens !== "number" || !Number.isFinite(modelMaxTokens) || modelMaxTokens <= 0) return requestedMaxTokens;
	return Math.min(requestedMaxTokens, modelMaxTokens);
}
async function resolveImageRuntime(params) {
	await ensureOpenClawModelsJson(params.cfg, params.agentDir);
	const { discoverAuthStorage, discoverModels } = await loadPiModelDiscoveryRuntime();
	const authStorage = discoverAuthStorage(params.agentDir);
	const modelRegistry = discoverModels(authStorage, params.agentDir);
	const resolvedRef = normalizeModelRef(params.provider, params.model);
	const model = modelRegistry.find(resolvedRef.provider, resolvedRef.model);
	if (!model) throw new Error(`Unknown model: ${resolvedRef.provider}/${resolvedRef.model}`);
	if (!model.input?.includes("image")) throw new Error(`Model does not support images: ${params.provider}/${params.model}`);
	const apiKey = requireApiKey(await getApiKeyForModel({
		model,
		cfg: params.cfg,
		agentDir: params.agentDir,
		profileId: params.profile,
		preferredProfile: params.preferredProfile
	}), model.provider);
	authStorage.setRuntimeApiKey(model.provider, apiKey);
	return {
		apiKey,
		model
	};
}
function buildImageContext(prompt, images) {
	return {
		systemPrompt: prompt,
		messages: [{
			role: "user",
			content: images.map((image) => ({
				type: "image",
				data: image.buffer.toString("base64"),
				mimeType: image.mime ?? "image/jpeg"
			})),
			timestamp: Date.now()
		}]
	};
}
async function describeImagesWithMinimax(params) {
	const responses = [];
	for (const [index, image] of params.images.entries()) {
		const prompt = params.images.length > 1 ? `${params.prompt}\n\nDescribe image ${index + 1} of ${params.images.length} independently.` : params.prompt;
		const text = await minimaxUnderstandImage({
			apiKey: params.apiKey,
			prompt,
			imageDataUrl: `data:${image.mime ?? "image/jpeg"};base64,${image.buffer.toString("base64")}`,
			modelBaseUrl: params.modelBaseUrl
		});
		responses.push(params.images.length > 1 ? `Image ${index + 1}:\n${text.trim()}` : text.trim());
	}
	return {
		text: responses.join("\n\n").trim(),
		model: params.modelId
	};
}
function isUnknownModelError(err) {
	return err instanceof Error && /^Unknown model:/i.test(err.message);
}
function resolveConfiguredProviderBaseUrl(cfg, provider) {
	const direct = cfg.models?.providers?.[provider];
	if (typeof direct?.baseUrl === "string" && direct.baseUrl.trim()) return direct.baseUrl.trim();
}
async function resolveMinimaxVlmFallbackRuntime(params) {
	return {
		apiKey: requireApiKey(await resolveApiKeyForProvider({
			provider: params.provider,
			cfg: params.cfg,
			profileId: params.profile,
			preferredProfile: params.preferredProfile,
			agentDir: params.agentDir
		}), params.provider),
		modelBaseUrl: resolveConfiguredProviderBaseUrl(params.cfg, params.provider)
	};
}
async function describeImagesWithModel(params) {
	const prompt = params.prompt ?? "Describe the image.";
	let apiKey;
	let model;
	try {
		const resolved = await resolveImageRuntime(params);
		apiKey = resolved.apiKey;
		model = resolved.model;
	} catch (err) {
		if (!isMinimaxVlmModel(params.provider, params.model) || !isUnknownModelError(err)) throw err;
		const fallback = await resolveMinimaxVlmFallbackRuntime(params);
		return await describeImagesWithMinimax({
			apiKey: fallback.apiKey,
			modelId: params.model,
			modelBaseUrl: fallback.modelBaseUrl,
			prompt,
			images: params.images
		});
	}
	if (isMinimaxVlmModel(model.provider, model.id)) return await describeImagesWithMinimax({
		apiKey,
		modelId: model.id,
		modelBaseUrl: model.baseUrl,
		prompt,
		images: params.images
	});
	const context = buildImageContext(prompt, params.images);
	const controller = new AbortController();
	const timeout = typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? setTimeout(() => controller.abort(), params.timeoutMs) : void 0;
	return {
		text: coerceImageAssistantText({
			message: await complete(model, context, {
				apiKey,
				maxTokens: resolveImageToolMaxTokens(model.maxTokens, params.maxTokens ?? 512),
				signal: controller.signal
			}).finally(() => {
				clearTimeout(timeout);
			}),
			provider: model.provider,
			model: model.id
		}),
		model: model.id
	};
}
async function describeImageWithModel(params) {
	return await describeImagesWithModel({
		images: [{
			buffer: params.buffer,
			fileName: params.fileName,
			mime: params.mime
		}],
		model: params.model,
		provider: params.provider,
		prompt: params.prompt,
		maxTokens: params.maxTokens,
		timeoutMs: params.timeoutMs,
		profile: params.profile,
		preferredProfile: params.preferredProfile,
		agentDir: params.agentDir,
		cfg: params.cfg
	});
}
//#endregion
export { describeImageWithModel, describeImagesWithModel };
