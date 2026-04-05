import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";
//#region extensions/anthropic-vertex/region.ts
const ANTHROPIC_VERTEX_DEFAULT_REGION = "global";
const ANTHROPIC_VERTEX_REGION_RE = /^[a-z0-9-]+$/;
const GCP_VERTEX_CREDENTIALS_MARKER$1 = "gcp-vertex-credentials";
const GCLOUD_DEFAULT_ADC_PATH = join(homedir(), ".config", "gcloud", "application_default_credentials.json");
function normalizeOptionalSecretInput(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function resolveAnthropicVertexRegion(env = process.env) {
	const region = normalizeOptionalSecretInput(env.GOOGLE_CLOUD_LOCATION) || normalizeOptionalSecretInput(env.CLOUD_ML_REGION);
	return region && ANTHROPIC_VERTEX_REGION_RE.test(region) ? region : ANTHROPIC_VERTEX_DEFAULT_REGION;
}
function resolveAnthropicVertexProjectId(env = process.env) {
	return normalizeOptionalSecretInput(env.ANTHROPIC_VERTEX_PROJECT_ID) || normalizeOptionalSecretInput(env.GOOGLE_CLOUD_PROJECT) || normalizeOptionalSecretInput(env.GOOGLE_CLOUD_PROJECT_ID) || resolveAnthropicVertexProjectIdFromAdc(env);
}
function resolveAnthropicVertexRegionFromBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return;
	try {
		const host = new URL(trimmed).hostname.toLowerCase();
		if (host === "aiplatform.googleapis.com") return "global";
		return /^([a-z0-9-]+)-aiplatform\.googleapis\.com$/.exec(host)?.[1];
	} catch {
		return;
	}
}
function resolveAnthropicVertexClientRegion(params) {
	return resolveAnthropicVertexRegionFromBaseUrl(params?.baseUrl) || resolveAnthropicVertexRegion(params?.env);
}
function hasAnthropicVertexMetadataServerAdc(env = process.env) {
	const explicitMetadataOptIn = normalizeOptionalSecretInput(env.ANTHROPIC_VERTEX_USE_GCP_METADATA);
	return explicitMetadataOptIn === "1" || explicitMetadataOptIn?.toLowerCase() === "true";
}
function resolveAnthropicVertexDefaultAdcPath(env = process.env) {
	return platform() === "win32" ? join(env.APPDATA ?? join(homedir(), "AppData", "Roaming"), "gcloud", "application_default_credentials.json") : GCLOUD_DEFAULT_ADC_PATH;
}
function resolveAnthropicVertexAdcCredentialsPath(env = process.env) {
	const explicitCredentialsPath = normalizeOptionalSecretInput(env.GOOGLE_APPLICATION_CREDENTIALS);
	if (explicitCredentialsPath) return existsSync(explicitCredentialsPath) ? explicitCredentialsPath : void 0;
	const defaultAdcPath = resolveAnthropicVertexDefaultAdcPath(env);
	return existsSync(defaultAdcPath) ? defaultAdcPath : void 0;
}
function resolveAnthropicVertexProjectIdFromAdc(env = process.env) {
	const credentialsPath = resolveAnthropicVertexAdcCredentialsPath(env);
	if (!credentialsPath) return;
	try {
		const parsed = JSON.parse(readFileSync(credentialsPath, "utf8"));
		return normalizeOptionalSecretInput(parsed.project_id) || normalizeOptionalSecretInput(parsed.quota_project_id);
	} catch {
		return;
	}
}
function hasAnthropicVertexCredentials(env = process.env) {
	return hasAnthropicVertexMetadataServerAdc(env) || resolveAnthropicVertexAdcCredentialsPath(env) !== void 0;
}
function hasAnthropicVertexAvailableAuth(env = process.env) {
	return hasAnthropicVertexCredentials(env);
}
function resolveAnthropicVertexConfigApiKey(env = process.env) {
	return hasAnthropicVertexAvailableAuth(env) ? GCP_VERTEX_CREDENTIALS_MARKER$1 : void 0;
}
//#endregion
//#region extensions/anthropic-vertex/provider-catalog.ts
const ANTHROPIC_VERTEX_DEFAULT_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW = 1e6;
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
function buildAnthropicVertexModel(params) {
	return {
		id: params.id,
		name: params.name,
		reasoning: params.reasoning,
		input: params.input,
		cost: params.cost,
		contextWindow: ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW,
		maxTokens: params.maxTokens
	};
}
function buildAnthropicVertexCatalog() {
	return [buildAnthropicVertexModel({
		id: "claude-opus-4-6",
		name: "Claude Opus 4.6",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 5,
			output: 25,
			cacheRead: .5,
			cacheWrite: 6.25
		},
		maxTokens: 128e3
	}), buildAnthropicVertexModel({
		id: ANTHROPIC_VERTEX_DEFAULT_MODEL_ID,
		name: "Claude Sonnet 4.6",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 3,
			output: 15,
			cacheRead: .3,
			cacheWrite: 3.75
		},
		maxTokens: 128e3
	})];
}
function buildAnthropicVertexProvider(params) {
	const region = resolveAnthropicVertexRegion(params?.env);
	return {
		baseUrl: region.toLowerCase() === "global" ? "https://aiplatform.googleapis.com" : `https://${region}-aiplatform.googleapis.com`,
		api: "anthropic-messages",
		apiKey: GCP_VERTEX_CREDENTIALS_MARKER,
		models: buildAnthropicVertexCatalog()
	};
}
//#endregion
//#region extensions/anthropic-vertex/api.ts
function mergeImplicitAnthropicVertexProvider(params) {
	const { existing, implicit } = params;
	if (!existing) return implicit;
	return {
		...implicit,
		...existing,
		models: Array.isArray(existing.models) && existing.models.length > 0 ? existing.models : implicit.models
	};
}
function resolveImplicitAnthropicVertexProvider(params) {
	const env = params?.env ?? process.env;
	if (!hasAnthropicVertexAvailableAuth(env)) return null;
	return buildAnthropicVertexProvider({ env });
}
//#endregion
export { hasAnthropicVertexAvailableAuth as a, resolveAnthropicVertexConfigApiKey as c, resolveAnthropicVertexRegionFromBaseUrl as d, buildAnthropicVertexProvider as i, resolveAnthropicVertexProjectId as l, resolveImplicitAnthropicVertexProvider as n, hasAnthropicVertexCredentials as o, ANTHROPIC_VERTEX_DEFAULT_MODEL_ID as r, resolveAnthropicVertexClientRegion as s, mergeImplicitAnthropicVertexProvider as t, resolveAnthropicVertexRegion as u };
