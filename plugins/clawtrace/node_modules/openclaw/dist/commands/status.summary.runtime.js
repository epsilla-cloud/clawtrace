import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "../defaults-Dpv7c6Om.js";
import { r as normalizeProviderId } from "../provider-id-Bd9aU9Z8.js";
import { n as resolveAgentModelPrimaryValue } from "../model-input-C3klK9XF.js";
import { t as resolveConfiguredProviderFallback } from "../configured-provider-fallback-lx3MEHWS.js";
//#region src/commands/status.summary.runtime.ts
function parseStatusModelRef(raw, defaultProvider) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const slash = trimmed.indexOf("/");
	if (slash === -1) return {
		provider: defaultProvider,
		model: trimmed
	};
	const provider = trimmed.slice(0, slash).trim();
	const model = trimmed.slice(slash + 1).trim();
	if (!provider || !model) return null;
	return {
		provider,
		model
	};
}
function resolveStatusModelRefFromRaw(params) {
	const trimmed = params.rawModel.trim();
	if (!trimmed) return null;
	const configuredModels = params.cfg.agents?.defaults?.models ?? {};
	if (!trimmed.includes("/")) {
		const aliasKey = trimmed.toLowerCase();
		for (const [modelKey, entry] of Object.entries(configuredModels)) {
			const aliasValue = entry?.alias;
			const alias = typeof aliasValue === "string" ? aliasValue.trim() : "";
			if (!alias || alias.toLowerCase() !== aliasKey) continue;
			const parsed = parseStatusModelRef(modelKey, params.defaultProvider);
			if (parsed) return parsed;
		}
		return {
			provider: "anthropic",
			model: trimmed
		};
	}
	return parseStatusModelRef(trimmed, params.defaultProvider);
}
function resolveConfiguredStatusModelRef(params) {
	const agentRawModel = params.agentId ? resolveAgentModelPrimaryValue(params.cfg.agents?.list?.find((entry) => entry?.id === params.agentId)?.model) : void 0;
	if (agentRawModel) {
		const parsed = resolveStatusModelRefFromRaw({
			cfg: params.cfg,
			rawModel: agentRawModel,
			defaultProvider: params.defaultProvider
		});
		if (parsed) return parsed;
	}
	const defaultsRawModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model);
	if (defaultsRawModel) {
		const parsed = resolveStatusModelRefFromRaw({
			cfg: params.cfg,
			rawModel: defaultsRawModel,
			defaultProvider: params.defaultProvider
		});
		if (parsed) return parsed;
	}
	const fallbackProvider = resolveConfiguredProviderFallback({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider
	});
	if (fallbackProvider) return fallbackProvider;
	return {
		provider: params.defaultProvider,
		model: params.defaultModel
	};
}
function resolveConfiguredProviderContextWindow(cfg, provider, model) {
	const providers = cfg?.models?.providers;
	if (!providers || typeof providers !== "object") return;
	const providerKey = normalizeProviderId(provider);
	for (const [id, providerConfig] of Object.entries(providers)) {
		if (normalizeProviderId(id) !== providerKey || !Array.isArray(providerConfig?.models)) continue;
		for (const entry of providerConfig.models) if (typeof entry?.id === "string" && entry.id === model && typeof entry.contextWindow === "number" && entry.contextWindow > 0) return entry.contextWindow;
	}
}
function classifySessionKey(key, entry) {
	if (key === "global") return "global";
	if (key === "unknown") return "unknown";
	if (entry?.chatType === "group" || entry?.chatType === "channel") return "group";
	if (key.includes(":group:") || key.includes(":channel:")) return "group";
	return "direct";
}
function resolveSessionModelRef(cfg, entry, agentId) {
	const resolved = resolveConfiguredStatusModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		agentId
	});
	let provider = resolved.provider;
	let model = resolved.model;
	const runtimeModel = entry?.model?.trim();
	const runtimeProvider = entry?.modelProvider?.trim();
	if (runtimeModel) {
		if (runtimeProvider) return {
			provider: runtimeProvider,
			model: runtimeModel
		};
		const parsedRuntime = parseStatusModelRef(runtimeModel, provider || "anthropic");
		if (parsedRuntime) {
			provider = parsedRuntime.provider;
			model = parsedRuntime.model;
		} else model = runtimeModel;
		return {
			provider,
			model
		};
	}
	const storedModelOverride = entry?.modelOverride?.trim();
	if (storedModelOverride) {
		const overrideProvider = entry?.providerOverride?.trim() || provider || "anthropic";
		const parsedOverride = parseStatusModelRef(storedModelOverride, overrideProvider);
		if (parsedOverride) {
			provider = parsedOverride.provider;
			model = parsedOverride.model;
		} else {
			provider = overrideProvider;
			model = storedModelOverride;
		}
	}
	return {
		provider,
		model
	};
}
function resolveContextTokensForModel(params) {
	params.allowAsyncLoad;
	if (typeof params.contextTokensOverride === "number" && params.contextTokensOverride > 0) return params.contextTokensOverride;
	if (params.provider && params.model) {
		const configuredWindow = resolveConfiguredProviderContextWindow(params.cfg, params.provider, params.model);
		if (configuredWindow !== void 0) return configuredWindow;
	}
	return params.fallbackContextTokens ?? 2e5;
}
const statusSummaryRuntime = {
	resolveContextTokensForModel,
	classifySessionKey,
	resolveSessionModelRef,
	resolveConfiguredStatusModelRef
};
//#endregion
export { statusSummaryRuntime };
