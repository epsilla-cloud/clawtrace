import { t as applyAgentDefaultModelPrimary } from "./provider-onboard-B0AuPavZ.js";
import { n as normalizeGoogleModelId, t as normalizeAntigravityModelId } from "./model-id-fXGzbdpZ.js";
//#region extensions/google/api.ts
const DEFAULT_GOOGLE_API_HOST = "generativelanguage.googleapis.com";
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
function trimTrailingSlashes(value) {
	return value.replace(/\/+$/, "");
}
function normalizeGoogleApiBaseUrl(baseUrl) {
	const raw = trimTrailingSlashes(baseUrl?.trim() || "https://generativelanguage.googleapis.com/v1beta");
	try {
		const url = new URL(raw);
		url.hash = "";
		url.search = "";
		if (url.hostname.toLowerCase() === DEFAULT_GOOGLE_API_HOST && trimTrailingSlashes(url.pathname || "") === "") url.pathname = "/v1beta";
		return trimTrailingSlashes(url.toString());
	} catch {
		if (/^https:\/\/generativelanguage\.googleapis\.com\/?$/i.test(raw)) return DEFAULT_GOOGLE_API_BASE_URL;
		return raw;
	}
}
function isGoogleGenerativeAiApi(api) {
	return api === "google-generative-ai";
}
function normalizeGoogleGenerativeAiBaseUrl(baseUrl) {
	return baseUrl ? normalizeGoogleApiBaseUrl(baseUrl) : baseUrl;
}
function resolveGoogleGenerativeAiTransport(params) {
	return {
		api: params.api,
		baseUrl: isGoogleGenerativeAiApi(params.api) ? normalizeGoogleGenerativeAiBaseUrl(params.baseUrl) : params.baseUrl
	};
}
function resolveGoogleGenerativeAiApiOrigin(baseUrl) {
	return normalizeGoogleApiBaseUrl(baseUrl).replace(/\/v1beta$/i, "");
}
function shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, provider) {
	if (providerKey === "google" || providerKey === "google-vertex") return true;
	if (isGoogleGenerativeAiApi(provider.api)) return true;
	return provider.models?.some((model) => isGoogleGenerativeAiApi(model?.api)) ?? false;
}
function shouldNormalizeGoogleProviderConfig(providerKey, provider) {
	return providerKey === "google-antigravity" || shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, provider);
}
function normalizeProviderModels(provider, normalizeId) {
	const models = provider.models;
	if (!Array.isArray(models) || models.length === 0) return provider;
	let mutated = false;
	const nextModels = models.map((model) => {
		const nextId = normalizeId(model.id);
		if (nextId === model.id) return model;
		mutated = true;
		return {
			...model,
			id: nextId
		};
	});
	return mutated ? {
		...provider,
		models: nextModels
	} : provider;
}
function normalizeGoogleProviderConfig(providerKey, provider) {
	let nextProvider = provider;
	if (shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, nextProvider)) {
		const modelNormalized = normalizeProviderModels(nextProvider, normalizeGoogleModelId);
		const normalizedBaseUrl = normalizeGoogleGenerativeAiBaseUrl(modelNormalized.baseUrl);
		nextProvider = normalizedBaseUrl !== modelNormalized.baseUrl ? {
			...modelNormalized,
			baseUrl: normalizedBaseUrl ?? modelNormalized.baseUrl
		} : modelNormalized;
	}
	if (providerKey === "google-antigravity") nextProvider = normalizeProviderModels(nextProvider, normalizeAntigravityModelId);
	return nextProvider;
}
function parseGeminiAuth(apiKey) {
	if (apiKey.startsWith("{")) try {
		const parsed = JSON.parse(apiKey);
		if (typeof parsed.token === "string" && parsed.token) return { headers: {
			Authorization: `Bearer ${parsed.token}`,
			"Content-Type": "application/json"
		} };
	} catch {}
	return { headers: {
		"x-goog-api-key": apiKey,
		"Content-Type": "application/json"
	} };
}
const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
function applyGoogleGeminiModelDefault(cfg) {
	const current = cfg.agents?.defaults?.model;
	if ((typeof current === "string" ? current.trim() || void 0 : current && typeof current === "object" && typeof current.primary === "string" ? (current.primary || "").trim() || void 0 : void 0) === "google/gemini-3.1-pro-preview") return {
		next: cfg,
		changed: false
	};
	return {
		next: applyAgentDefaultModelPrimary(cfg, GOOGLE_GEMINI_DEFAULT_MODEL),
		changed: true
	};
}
//#endregion
export { normalizeGoogleApiBaseUrl as a, parseGeminiAuth as c, shouldNormalizeGoogleGenerativeAiProviderConfig as d, shouldNormalizeGoogleProviderConfig as f, isGoogleGenerativeAiApi as i, resolveGoogleGenerativeAiApiOrigin as l, GOOGLE_GEMINI_DEFAULT_MODEL as n, normalizeGoogleGenerativeAiBaseUrl as o, applyGoogleGeminiModelDefault as r, normalizeGoogleProviderConfig as s, DEFAULT_GOOGLE_API_BASE_URL as t, resolveGoogleGenerativeAiTransport as u };
