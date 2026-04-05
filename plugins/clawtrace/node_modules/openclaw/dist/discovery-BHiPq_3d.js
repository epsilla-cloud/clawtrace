import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import "./core-CFWy4f9Z.js";
import { r as resolveAwsSdkEnvVarName } from "./provider-auth-runtime-DQXKSr5V.js";
import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";
//#region extensions/amazon-bedrock/discovery.ts
const log = createSubsystemLogger("bedrock-discovery");
const DEFAULT_REFRESH_INTERVAL_SECONDS = 3600;
const DEFAULT_CONTEXT_WINDOW = 32e3;
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const discoveryCache = /* @__PURE__ */ new Map();
let hasLoggedBedrockError = false;
function normalizeProviderFilter(filter) {
	if (!filter || filter.length === 0) return [];
	const normalized = new Set(filter.map((entry) => entry.trim().toLowerCase()).filter((entry) => entry.length > 0));
	return Array.from(normalized).toSorted();
}
function buildCacheKey(params) {
	return JSON.stringify(params);
}
function includesTextModalities(modalities) {
	return (modalities ?? []).some((entry) => entry.toLowerCase() === "text");
}
function isActive(summary) {
	const status = summary.modelLifecycle?.status;
	return typeof status === "string" ? status.toUpperCase() === "ACTIVE" : false;
}
function mapInputModalities(summary) {
	const inputs = summary.inputModalities ?? [];
	const mapped = /* @__PURE__ */ new Set();
	for (const modality of inputs) {
		const lower = modality.toLowerCase();
		if (lower === "text") mapped.add("text");
		if (lower === "image") mapped.add("image");
	}
	if (mapped.size === 0) mapped.add("text");
	return Array.from(mapped);
}
function inferReasoningSupport(summary) {
	const haystack = `${summary.modelId ?? ""} ${summary.modelName ?? ""}`.toLowerCase();
	return haystack.includes("reasoning") || haystack.includes("thinking");
}
function resolveDefaultContextWindow(config) {
	const value = Math.floor(config?.defaultContextWindow ?? DEFAULT_CONTEXT_WINDOW);
	return value > 0 ? value : DEFAULT_CONTEXT_WINDOW;
}
function resolveDefaultMaxTokens(config) {
	const value = Math.floor(config?.defaultMaxTokens ?? DEFAULT_MAX_TOKENS);
	return value > 0 ? value : DEFAULT_MAX_TOKENS;
}
function matchesProviderFilter(summary, filter) {
	if (filter.length === 0) return true;
	const normalized = (summary.providerName ?? (typeof summary.modelId === "string" ? summary.modelId.split(".")[0] : void 0))?.trim().toLowerCase();
	if (!normalized) return false;
	return filter.includes(normalized);
}
function shouldIncludeSummary(summary, filter) {
	if (!summary.modelId?.trim()) return false;
	if (!matchesProviderFilter(summary, filter)) return false;
	if (summary.responseStreamingSupported !== true) return false;
	if (!includesTextModalities(summary.outputModalities)) return false;
	if (!isActive(summary)) return false;
	return true;
}
function toModelDefinition(summary, defaults) {
	const id = summary.modelId?.trim() ?? "";
	return {
		id,
		name: summary.modelName?.trim() || id,
		reasoning: inferReasoningSupport(summary),
		input: mapInputModalities(summary),
		cost: DEFAULT_COST,
		contextWindow: defaults.contextWindow,
		maxTokens: defaults.maxTokens
	};
}
function resetBedrockDiscoveryCacheForTest() {
	discoveryCache.clear();
	hasLoggedBedrockError = false;
}
function resolveBedrockConfigApiKey(env = process.env) {
	return resolveAwsSdkEnvVarName(env) ?? "AWS_PROFILE";
}
async function discoverBedrockModels(params) {
	const refreshIntervalSeconds = Math.max(0, Math.floor(params.config?.refreshInterval ?? DEFAULT_REFRESH_INTERVAL_SECONDS));
	const providerFilter = normalizeProviderFilter(params.config?.providerFilter);
	const defaultContextWindow = resolveDefaultContextWindow(params.config);
	const defaultMaxTokens = resolveDefaultMaxTokens(params.config);
	const cacheKey = buildCacheKey({
		region: params.region,
		providerFilter,
		refreshIntervalSeconds,
		defaultContextWindow,
		defaultMaxTokens
	});
	const now = params.now?.() ?? Date.now();
	if (refreshIntervalSeconds > 0) {
		const cached = discoveryCache.get(cacheKey);
		if (cached?.value && cached.expiresAt > now) return cached.value;
		if (cached?.inFlight) return cached.inFlight;
	}
	const client = (params.clientFactory ?? ((region) => new BedrockClient({ region })))(params.region);
	const discoveryPromise = (async () => {
		const response = await client.send(new ListFoundationModelsCommand({}));
		const discovered = [];
		for (const summary of response.modelSummaries ?? []) {
			if (!shouldIncludeSummary(summary, providerFilter)) continue;
			discovered.push(toModelDefinition(summary, {
				contextWindow: defaultContextWindow,
				maxTokens: defaultMaxTokens
			}));
		}
		return discovered.toSorted((a, b) => a.name.localeCompare(b.name));
	})();
	if (refreshIntervalSeconds > 0) discoveryCache.set(cacheKey, {
		expiresAt: now + refreshIntervalSeconds * 1e3,
		inFlight: discoveryPromise
	});
	try {
		const value = await discoveryPromise;
		if (refreshIntervalSeconds > 0) discoveryCache.set(cacheKey, {
			expiresAt: now + refreshIntervalSeconds * 1e3,
			value
		});
		return value;
	} catch (error) {
		if (refreshIntervalSeconds > 0) discoveryCache.delete(cacheKey);
		if (!hasLoggedBedrockError) {
			hasLoggedBedrockError = true;
			log.warn("Failed to discover Bedrock models", { error: error instanceof Error ? error.message : String(error) });
		}
		return [];
	}
}
async function resolveImplicitBedrockProvider(params) {
	const env = params.env ?? process.env;
	const discoveryConfig = params.config?.models?.bedrockDiscovery;
	const enabled = discoveryConfig?.enabled;
	const hasAwsCreds = resolveAwsSdkEnvVarName(env) !== void 0;
	if (enabled === false) return null;
	if (enabled !== true && !hasAwsCreds) return null;
	const region = discoveryConfig?.region ?? env.AWS_REGION ?? env.AWS_DEFAULT_REGION ?? "us-east-1";
	const models = await discoverBedrockModels({
		region,
		config: discoveryConfig
	});
	if (models.length === 0) return null;
	return {
		baseUrl: `https://bedrock-runtime.${region}.amazonaws.com`,
		api: "bedrock-converse-stream",
		auth: "aws-sdk",
		models
	};
}
function mergeImplicitBedrockProvider(params) {
	const { existing, implicit } = params;
	if (!existing) return implicit;
	return {
		...implicit,
		...existing,
		models: Array.isArray(existing.models) && existing.models.length > 0 ? existing.models : implicit.models
	};
}
//#endregion
export { resolveImplicitBedrockProvider as a, resolveBedrockConfigApiKey as i, mergeImplicitBedrockProvider as n, resetBedrockDiscoveryCacheForTest as r, discoverBedrockModels as t };
