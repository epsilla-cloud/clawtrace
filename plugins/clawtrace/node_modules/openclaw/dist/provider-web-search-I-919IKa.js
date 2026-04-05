import { u as isRecord$1 } from "./utils-BfvDpbwh.js";
import { t as isBlockedObjectKey } from "./prototype-keys-DECjSrxt.js";
import { c as normalizeResolvedSecretInputString, d as resolveSecretInputRef, l as normalizeSecretInputString } from "./types.secrets-Rqz2qv-w.js";
import { t as isSafeExecutableValue } from "./exec-safety-BD1FUk_z.js";
import { r as normalizeChatChannelId } from "./chat-meta-xAV2SRO1.js";
import "./registry-M0RVxNlg.js";
import { o as BUNDLED_WEB_SEARCH_PROVIDER_PLUGIN_IDS } from "./bundled-capability-metadata-CsnlKsfe.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Caby3smH.js";
import "./common-B7JFWTj2.js";
import { i as withTrustedEnvProxyGuardedFetchMode, n as fetchWithSsrFGuard, r as withStrictGuardedFetchMode } from "./fetch-guard-dgUzueSW.js";
import "./external-content-YqO3ih3d.js";
//#region src/config/legacy.shared.ts
const getRecord = (value) => isRecord$1(value) ? value : null;
const ensureRecord$1 = (root, key) => {
	const existing = root[key];
	if (isRecord$1(existing)) return existing;
	const next = {};
	root[key] = next;
	return next;
};
const mergeMissing = (target, source) => {
	for (const [key, value] of Object.entries(source)) {
		if (value === void 0 || isBlockedObjectKey(key)) continue;
		const existing = target[key];
		if (existing === void 0) {
			target[key] = value;
			continue;
		}
		if (isRecord$1(existing) && isRecord$1(value)) mergeMissing(existing, value);
	}
};
const mapLegacyAudioTranscription = (value) => {
	const transcriber = getRecord(value);
	const command = Array.isArray(transcriber?.command) ? transcriber?.command : null;
	if (!command || command.length === 0) return null;
	if (typeof command[0] !== "string") return null;
	if (!command.every((part) => typeof part === "string")) return null;
	const rawExecutable = command[0].trim();
	if (!rawExecutable) return null;
	if (!isSafeExecutableValue(rawExecutable)) return null;
	const args = command.slice(1);
	const timeoutSeconds = typeof transcriber?.timeoutSeconds === "number" ? transcriber?.timeoutSeconds : void 0;
	const result = {
		command: rawExecutable,
		type: "cli"
	};
	if (args.length > 0) result.args = args;
	if (timeoutSeconds !== void 0) result.timeoutSeconds = timeoutSeconds;
	return result;
};
const defineLegacyConfigMigration = (migration) => migration;
//#endregion
//#region src/agents/tools/web-guarded-fetch.ts
const WEB_TOOLS_TRUSTED_NETWORK_SSRF_POLICY = {
	dangerouslyAllowPrivateNetwork: true,
	allowRfc2544BenchmarkRange: true
};
function resolveTimeoutMs(params) {
	if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) return params.timeoutMs;
	if (typeof params.timeoutSeconds === "number" && Number.isFinite(params.timeoutSeconds)) return params.timeoutSeconds * 1e3;
}
async function fetchWithWebToolsNetworkGuard(params) {
	const { timeoutSeconds, useEnvProxy, ...rest } = params;
	const resolved = {
		...rest,
		timeoutMs: resolveTimeoutMs({
			timeoutMs: rest.timeoutMs,
			timeoutSeconds
		})
	};
	return fetchWithSsrFGuard(useEnvProxy ? withTrustedEnvProxyGuardedFetchMode(resolved) : withStrictGuardedFetchMode(resolved));
}
async function withWebToolsNetworkGuard(params, run) {
	const { response, finalUrl, release } = await fetchWithWebToolsNetworkGuard(params);
	try {
		return await run({
			response,
			finalUrl
		});
	} finally {
		await release();
	}
}
async function withTrustedWebToolsEndpoint(params, run) {
	return await withWebToolsNetworkGuard({
		...params,
		policy: WEB_TOOLS_TRUSTED_NETWORK_SSRF_POLICY,
		useEnvProxy: true
	}, run);
}
async function withStrictWebToolsEndpoint(params, run) {
	return await withWebToolsNetworkGuard(params, run);
}
//#endregion
//#region src/agents/tools/web-search-citation-redirect.ts
const REDIRECT_TIMEOUT_MS = 5e3;
/**
* Resolve a citation redirect URL to its final destination using a HEAD request.
* Returns the original URL if resolution fails or times out.
*/
async function resolveCitationRedirectUrl(url) {
	try {
		return await withStrictWebToolsEndpoint({
			url,
			init: { method: "HEAD" },
			timeoutMs: REDIRECT_TIMEOUT_MS
		}, async ({ finalUrl }) => finalUrl || url);
	} catch {
		return url;
	}
}
//#endregion
//#region src/agents/tools/web-shared.ts
const DEFAULT_TIMEOUT_SECONDS = 30;
const DEFAULT_CACHE_TTL_MINUTES = 15;
const DEFAULT_CACHE_MAX_ENTRIES = 100;
function resolveTimeoutSeconds(value, fallback) {
	return Math.max(1, Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback));
}
function resolveCacheTtlMs(value, fallbackMinutes) {
	return Math.round((typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallbackMinutes) * 6e4);
}
function normalizeCacheKey(value) {
	return value.trim().toLowerCase();
}
function readCache(cache, key) {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		cache.delete(key);
		return null;
	}
	return {
		value: entry.value,
		cached: true
	};
}
function writeCache(cache, key, value, ttlMs) {
	if (ttlMs <= 0) return;
	if (cache.size >= DEFAULT_CACHE_MAX_ENTRIES) {
		const oldest = cache.keys().next();
		if (!oldest.done) cache.delete(oldest.value);
	}
	cache.set(key, {
		value,
		expiresAt: Date.now() + ttlMs,
		insertedAt: Date.now()
	});
}
function withTimeout(signal, timeoutMs) {
	if (timeoutMs <= 0) return signal ?? new AbortController().signal;
	const controller = new AbortController();
	const timer = setTimeout(controller.abort.bind(controller), timeoutMs);
	if (signal) signal.addEventListener("abort", () => {
		clearTimeout(timer);
		controller.abort();
	}, { once: true });
	controller.signal.addEventListener("abort", () => {
		clearTimeout(timer);
	}, { once: true });
	return controller.signal;
}
async function readResponseText(res, options) {
	const maxBytesRaw = options?.maxBytes;
	const maxBytes = typeof maxBytesRaw === "number" && Number.isFinite(maxBytesRaw) && maxBytesRaw > 0 ? Math.floor(maxBytesRaw) : void 0;
	const body = res.body;
	if (maxBytes && body && typeof body === "object" && "getReader" in body && typeof body.getReader === "function") {
		const reader = body.getReader();
		const decoder = new TextDecoder();
		let bytesRead = 0;
		let truncated = false;
		const parts = [];
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				if (!value || value.byteLength === 0) continue;
				let chunk = value;
				if (bytesRead + chunk.byteLength > maxBytes) {
					const remaining = Math.max(0, maxBytes - bytesRead);
					if (remaining <= 0) {
						truncated = true;
						break;
					}
					chunk = chunk.subarray(0, remaining);
					truncated = true;
				}
				bytesRead += chunk.byteLength;
				parts.push(decoder.decode(chunk, { stream: true }));
				if (truncated || bytesRead >= maxBytes) {
					truncated = true;
					break;
				}
			}
		} catch {} finally {
			if (truncated) try {
				await reader.cancel();
			} catch {}
		}
		parts.push(decoder.decode());
		return {
			text: parts.join(""),
			truncated,
			bytesRead
		};
	}
	try {
		const text = await res.text();
		return {
			text,
			truncated: false,
			bytesRead: text.length
		};
	} catch {
		return {
			text: "",
			truncated: false,
			bytesRead: 0
		};
	}
}
//#endregion
//#region src/agents/tools/web-search-provider-common.ts
const DEFAULT_SEARCH_COUNT = 5;
const MAX_SEARCH_COUNT = 10;
const SEARCH_CACHE_KEY = Symbol.for("openclaw.web-search.cache");
function getSharedSearchCache() {
	const root = globalThis;
	const existing = root[SEARCH_CACHE_KEY];
	if (existing instanceof Map) return existing;
	const next = /* @__PURE__ */ new Map();
	root[SEARCH_CACHE_KEY] = next;
	return next;
}
const SEARCH_CACHE = getSharedSearchCache();
function resolveSearchTimeoutSeconds(searchConfig) {
	return resolveTimeoutSeconds(searchConfig?.timeoutSeconds, 30);
}
function resolveSearchCacheTtlMs(searchConfig) {
	return resolveCacheTtlMs(searchConfig?.cacheTtlMinutes, 15);
}
function resolveSearchCount(value, fallback) {
	return Math.max(1, Math.min(10, Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback)));
}
function readConfiguredSecretString(value, path) {
	return normalizeSecretInput(normalizeResolvedSecretInputString({
		value,
		path
	})) || void 0;
}
function readProviderEnvValue(envVars) {
	for (const envVar of envVars) {
		const value = normalizeSecretInput(process.env[envVar]);
		if (value) return value;
	}
}
async function withTrustedWebSearchEndpoint(params, run) {
	return withTrustedWebToolsEndpoint({
		url: params.url,
		init: params.init,
		timeoutSeconds: params.timeoutSeconds
	}, async ({ response }) => run(response));
}
async function postTrustedWebToolsJson(params, parseResponse) {
	return withTrustedWebToolsEndpoint({
		url: params.url,
		timeoutSeconds: params.timeoutSeconds,
		init: {
			method: "POST",
			headers: {
				...params.extraHeaders,
				Accept: "application/json",
				Authorization: `Bearer ${params.apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(params.body)
		}
	}, async ({ response }) => {
		if (!response.ok) {
			const detail = await readResponseText(response, { maxBytes: params.maxErrorBytes ?? 64e3 });
			throw new Error(`${params.errorLabel} API error (${response.status}): ${detail.text || response.statusText}`);
		}
		return await parseResponse(response);
	});
}
async function throwWebSearchApiError(res, providerLabel) {
	const detail = (await readResponseText(res, { maxBytes: 64e3 })).text;
	throw new Error(`${providerLabel} API error (${res.status}): ${detail || res.statusText}`);
}
function resolveSiteName(url) {
	if (!url) return;
	try {
		return new URL(url).hostname;
	} catch {
		return;
	}
}
const BRAVE_FRESHNESS_SHORTCUTS = new Set([
	"pd",
	"pw",
	"pm",
	"py"
]);
const BRAVE_FRESHNESS_RANGE = /^(\d{4}-\d{2}-\d{2})to(\d{4}-\d{2}-\d{2})$/;
const PERPLEXITY_RECENCY_VALUES = new Set([
	"day",
	"week",
	"month",
	"year"
]);
const FRESHNESS_TO_RECENCY = {
	pd: "day",
	pw: "week",
	pm: "month",
	py: "year"
};
const RECENCY_TO_FRESHNESS = {
	day: "pd",
	week: "pw",
	month: "pm",
	year: "py"
};
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PERPLEXITY_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
function isValidIsoDate(value) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
	if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return false;
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function isoToPerplexityDate(iso) {
	const match = iso.match(ISO_DATE_PATTERN);
	if (!match) return;
	const [, year, month, day] = match;
	return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
}
function normalizeToIsoDate(value) {
	const trimmed = value.trim();
	if (ISO_DATE_PATTERN.test(trimmed)) return isValidIsoDate(trimmed) ? trimmed : void 0;
	const match = trimmed.match(PERPLEXITY_DATE_PATTERN);
	if (match) {
		const [, month, day, year] = match;
		const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
		return isValidIsoDate(iso) ? iso : void 0;
	}
}
function parseIsoDateRange(params) {
	const docs = params.docs ?? "https://docs.openclaw.ai/tools/web";
	const dateAfter = params.rawDateAfter ? normalizeToIsoDate(params.rawDateAfter) : void 0;
	if (params.rawDateAfter && !dateAfter) return {
		error: "invalid_date",
		message: params.invalidDateAfterMessage,
		docs
	};
	const dateBefore = params.rawDateBefore ? normalizeToIsoDate(params.rawDateBefore) : void 0;
	if (params.rawDateBefore && !dateBefore) return {
		error: "invalid_date",
		message: params.invalidDateBeforeMessage,
		docs
	};
	if (dateAfter && dateBefore && dateAfter > dateBefore) return {
		error: "invalid_date_range",
		message: params.invalidDateRangeMessage,
		docs
	};
	return {
		dateAfter,
		dateBefore
	};
}
function normalizeFreshness(value, provider) {
	if (!value) return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const lower = trimmed.toLowerCase();
	if (BRAVE_FRESHNESS_SHORTCUTS.has(lower)) return provider === "brave" ? lower : FRESHNESS_TO_RECENCY[lower];
	if (PERPLEXITY_RECENCY_VALUES.has(lower)) return provider === "perplexity" ? lower : RECENCY_TO_FRESHNESS[lower];
	if (provider === "brave") {
		const match = trimmed.match(BRAVE_FRESHNESS_RANGE);
		if (match) {
			const [, start, end] = match;
			if (isValidIsoDate(start) && isValidIsoDate(end) && start <= end) return `${start}to${end}`;
		}
	}
}
function readCachedSearchPayload(cacheKey) {
	const cached = readCache(SEARCH_CACHE, cacheKey);
	return cached ? {
		...cached.value,
		cached: true
	} : void 0;
}
function buildSearchCacheKey(parts) {
	return normalizeCacheKey(parts.map((part) => part === void 0 ? "default" : String(part)).join(":"));
}
function writeCachedSearchPayload(cacheKey, payload, ttlMs) {
	writeCache(SEARCH_CACHE, cacheKey, payload, ttlMs);
}
function readUnsupportedSearchFilter(params) {
	for (const name of [
		"country",
		"language",
		"freshness",
		"date_after",
		"date_before"
	]) {
		const value = params[name];
		if (typeof value === "string" && value.trim()) return name;
	}
}
function describeUnsupportedSearchFilter(name) {
	switch (name) {
		case "country": return "country filtering";
		case "language": return "language filtering";
		case "freshness": return "freshness filtering";
		case "date_after":
		case "date_before": return "date_after/date_before filtering";
	}
}
function buildUnsupportedSearchFilterResponse(params, provider, docs = "https://docs.openclaw.ai/tools/web") {
	const unsupported = readUnsupportedSearchFilter(params);
	if (!unsupported) return;
	const label = describeUnsupportedSearchFilter(unsupported);
	const supportedLabel = unsupported === "date_after" || unsupported === "date_before" ? "date filtering" : label;
	return {
		error: unsupported.startsWith("date_") ? "unsupported_date_filter" : `unsupported_${unsupported}`,
		message: `${label} is not supported by the ${provider} provider. Only Brave and Perplexity support ${supportedLabel}.`,
		docs
	};
}
//#endregion
//#region src/config/legacy-web-search.ts
const GENERIC_WEB_SEARCH_KEYS = new Set([
	"enabled",
	"provider",
	"maxResults",
	"timeoutSeconds",
	"cacheTtlMinutes"
]);
const NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS = new Set(["tavily"]);
const LEGACY_WEB_SEARCH_PROVIDER_PLUGIN_IDS = Object.fromEntries(Object.entries(BUNDLED_WEB_SEARCH_PROVIDER_PLUGIN_IDS).filter(([providerId]) => !NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS.has(providerId)));
const LEGACY_WEB_SEARCH_PROVIDER_IDS = Object.keys(LEGACY_WEB_SEARCH_PROVIDER_PLUGIN_IDS);
const LEGACY_WEB_SEARCH_PROVIDER_ID_SET = new Set(LEGACY_WEB_SEARCH_PROVIDER_IDS);
const LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID = "brave";
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function cloneRecord(value) {
	return { ...value };
}
function ensureRecord(target, key) {
	const current = target[key];
	if (isRecord(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
function resolveLegacySearchConfig(raw) {
	if (!isRecord(raw)) return;
	const tools = isRecord(raw.tools) ? raw.tools : void 0;
	const web = isRecord(tools?.web) ? tools.web : void 0;
	return isRecord(web?.search) ? web.search : void 0;
}
function copyLegacyProviderConfig(search, providerKey) {
	const current = search[providerKey];
	return isRecord(current) ? cloneRecord(current) : void 0;
}
function hasOwnKey(target, key) {
	return Object.prototype.hasOwnProperty.call(target, key);
}
function hasMappedLegacyWebSearchConfig(raw) {
	const search = resolveLegacySearchConfig(raw);
	if (!search) return false;
	if (hasOwnKey(search, "apiKey")) return true;
	return LEGACY_WEB_SEARCH_PROVIDER_IDS.some((providerId) => isRecord(search[providerId]));
}
function resolveLegacyGlobalWebSearchMigration(search) {
	const legacyProviderConfig = copyLegacyProviderConfig(search, LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID);
	const payload = legacyProviderConfig ?? {};
	const hasLegacyApiKey = hasOwnKey(search, "apiKey");
	if (hasLegacyApiKey) payload.apiKey = search.apiKey;
	if (Object.keys(payload).length === 0) return null;
	const pluginId = LEGACY_WEB_SEARCH_PROVIDER_PLUGIN_IDS[LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID] ?? LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID;
	return {
		pluginId,
		payload,
		legacyPath: hasLegacyApiKey ? "tools.web.search.apiKey" : `tools.web.search.${LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID}`,
		targetPath: hasLegacyApiKey && !legacyProviderConfig ? `plugins.entries.${pluginId}.config.webSearch.apiKey` : `plugins.entries.${pluginId}.config.webSearch`
	};
}
function migratePluginWebSearchConfig(params) {
	const entry = ensureRecord(ensureRecord(ensureRecord(params.root, "plugins"), "entries"), params.pluginId);
	const config = ensureRecord(entry, "config");
	const hadEnabled = entry.enabled !== void 0;
	const existing = isRecord(config.webSearch) ? cloneRecord(config.webSearch) : void 0;
	if (!hadEnabled) entry.enabled = true;
	if (!existing) {
		config.webSearch = cloneRecord(params.payload);
		params.changes.push(`Moved ${params.legacyPath} → ${params.targetPath}.`);
		return;
	}
	const merged = cloneRecord(existing);
	mergeMissing(merged, params.payload);
	const changed = JSON.stringify(merged) !== JSON.stringify(existing) || !hadEnabled;
	config.webSearch = merged;
	if (changed) {
		params.changes.push(`Merged ${params.legacyPath} → ${params.targetPath} (filled missing fields from legacy; kept explicit plugin config values).`);
		return;
	}
	params.changes.push(`Removed ${params.legacyPath} (${params.targetPath} already set).`);
}
function listLegacyWebSearchConfigPaths(raw) {
	const search = resolveLegacySearchConfig(raw);
	if (!search) return [];
	const paths = [];
	if ("apiKey" in search) paths.push("tools.web.search.apiKey");
	for (const providerId of LEGACY_WEB_SEARCH_PROVIDER_IDS) {
		const scoped = search[providerId];
		if (isRecord(scoped)) for (const key of Object.keys(scoped)) paths.push(`tools.web.search.${providerId}.${key}`);
	}
	return paths;
}
function normalizeLegacyWebSearchConfig(raw) {
	if (!isRecord(raw)) return raw;
	if (!resolveLegacySearchConfig(raw)) return raw;
	return normalizeLegacyWebSearchConfigRecord(raw).config;
}
function migrateLegacyWebSearchConfig(raw) {
	if (!isRecord(raw)) return {
		config: raw,
		changes: []
	};
	if (!hasMappedLegacyWebSearchConfig(raw)) return {
		config: raw,
		changes: []
	};
	return normalizeLegacyWebSearchConfigRecord(raw);
}
function normalizeLegacyWebSearchConfigRecord(raw) {
	const nextRoot = cloneRecord(raw);
	const web = ensureRecord(ensureRecord(nextRoot, "tools"), "web");
	const search = resolveLegacySearchConfig(nextRoot);
	if (!search) return {
		config: raw,
		changes: []
	};
	const nextSearch = {};
	const changes = [];
	for (const [key, value] of Object.entries(search)) {
		if (key === "apiKey") continue;
		if (LEGACY_WEB_SEARCH_PROVIDER_ID_SET.has(key) && isRecord(value)) continue;
		if (GENERIC_WEB_SEARCH_KEYS.has(key) || !isRecord(value)) nextSearch[key] = value;
	}
	web.search = nextSearch;
	const globalSearchMigration = resolveLegacyGlobalWebSearchMigration(search);
	if (globalSearchMigration) migratePluginWebSearchConfig({
		root: nextRoot,
		legacyPath: globalSearchMigration.legacyPath,
		targetPath: globalSearchMigration.targetPath,
		pluginId: globalSearchMigration.pluginId,
		payload: globalSearchMigration.payload,
		changes
	});
	for (const providerId of LEGACY_WEB_SEARCH_PROVIDER_IDS) {
		if (providerId === LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID) continue;
		const scoped = copyLegacyProviderConfig(search, providerId);
		if (!scoped || Object.keys(scoped).length === 0) continue;
		const pluginId = LEGACY_WEB_SEARCH_PROVIDER_PLUGIN_IDS[providerId];
		if (!pluginId) continue;
		migratePluginWebSearchConfig({
			root: nextRoot,
			legacyPath: `tools.web.search.${providerId}`,
			targetPath: `plugins.entries.${pluginId}.config.webSearch`,
			pluginId,
			payload: scoped,
			changes
		});
	}
	return {
		config: nextRoot,
		changes
	};
}
function resolvePluginWebSearchConfig(config, pluginId) {
	const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
	if (!isRecord(pluginConfig)) return;
	const webSearch = pluginConfig.webSearch;
	return isRecord(webSearch) ? webSearch : void 0;
}
//#endregion
//#region src/agents/tools/web-search-provider-config.ts
function getTopLevelCredentialValue(searchConfig) {
	return searchConfig?.apiKey;
}
function setTopLevelCredentialValue(searchConfigTarget, value) {
	searchConfigTarget.apiKey = value;
}
function getScopedCredentialValue(searchConfig, key) {
	const scoped = searchConfig?.[key];
	if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) return;
	return scoped.apiKey;
}
function setScopedCredentialValue(searchConfigTarget, key, value) {
	const scoped = searchConfigTarget[key];
	if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
		searchConfigTarget[key] = { apiKey: value };
		return;
	}
	scoped.apiKey = value;
}
function mergeScopedSearchConfig(searchConfig, key, pluginConfig, options) {
	if (!pluginConfig) return searchConfig;
	const currentScoped = searchConfig?.[key] && typeof searchConfig[key] === "object" && !Array.isArray(searchConfig[key]) ? searchConfig[key] : {};
	const next = {
		...searchConfig,
		[key]: {
			...currentScoped,
			...pluginConfig
		}
	};
	if (options?.mirrorApiKeyToTopLevel && pluginConfig.apiKey !== void 0) next.apiKey = pluginConfig.apiKey;
	return next;
}
function resolveProviderWebSearchPluginConfig(config, pluginId) {
	return resolvePluginWebSearchConfig(config, pluginId);
}
function ensureObject(target, key) {
	const current = target[key];
	if (current && typeof current === "object" && !Array.isArray(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
function setProviderWebSearchPluginConfigValue(configTarget, pluginId, key, value) {
	const entry = ensureObject(ensureObject(ensureObject(configTarget, "plugins"), "entries"), pluginId);
	if (entry.enabled === void 0) entry.enabled = true;
	const webSearch = ensureObject(ensureObject(entry, "config"), "webSearch");
	webSearch[key] = value;
}
//#endregion
//#region src/agents/tools/web-search-provider-credentials.ts
function resolveWebSearchProviderCredential(params) {
	const fromConfig = normalizeSecretInput(normalizeSecretInputString(params.credentialValue));
	if (fromConfig) return fromConfig;
	const credentialRef = resolveSecretInputRef({ value: params.credentialValue }).ref;
	if (credentialRef?.source === "env") {
		const fromEnvRef = normalizeSecretInput(process.env[credentialRef.id]);
		if (fromEnvRef) return fromEnvRef;
	}
	for (const envVar of params.envVars) {
		const fromEnv = normalizeSecretInput(process.env[envVar]);
		if (fromEnv) return fromEnv;
	}
}
//#endregion
//#region src/agents/tools/web-fetch-visibility.ts
const HIDDEN_STYLE_PATTERNS = [
	["display", /^\s*none\s*$/i],
	["visibility", /^\s*hidden\s*$/i],
	["opacity", /^\s*0\s*$/],
	["font-size", /^\s*0(px|em|rem|pt|%)?\s*$/i],
	["text-indent", /^\s*-\d{4,}px\s*$/],
	["color", /^\s*transparent\s*$/i],
	["color", /^\s*rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(?:\.0+)?\s*\)\s*$/i],
	["color", /^\s*hsla\s*\(\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*0(?:\.0+)?\s*\)\s*$/i]
];
const HIDDEN_CLASS_NAMES = new Set([
	"sr-only",
	"visually-hidden",
	"d-none",
	"hidden",
	"invisible",
	"screen-reader-only",
	"offscreen"
]);
function hasHiddenClass(className) {
	return className.toLowerCase().split(/\s+/).some((cls) => HIDDEN_CLASS_NAMES.has(cls));
}
function isStyleHidden(style) {
	for (const [prop, pattern] of HIDDEN_STYLE_PATTERNS) {
		const escapedProp = prop.replace(/-/g, "\\-");
		const match = style.match(new RegExp(`(?:^|;)\\s*${escapedProp}\\s*:\\s*([^;]+)`, "i"));
		if (match && pattern.test(match[1])) return true;
	}
	const clipPath = style.match(/(?:^|;)\s*clip-path\s*:\s*([^;]+)/i);
	if (clipPath && !/^\s*none\s*$/i.test(clipPath[1])) {
		if (/inset\s*\(\s*(?:0*\.\d+|[1-9]\d*(?:\.\d+)?)%/i.test(clipPath[1])) return true;
	}
	const transform = style.match(/(?:^|;)\s*transform\s*:\s*([^;]+)/i);
	if (transform) {
		if (/scale\s*\(\s*0\s*\)/i.test(transform[1])) return true;
		if (/translateX\s*\(\s*-\d{4,}px\s*\)/i.test(transform[1])) return true;
		if (/translateY\s*\(\s*-\d{4,}px\s*\)/i.test(transform[1])) return true;
	}
	const width = style.match(/(?:^|;)\s*width\s*:\s*([^;]+)/i);
	const height = style.match(/(?:^|;)\s*height\s*:\s*([^;]+)/i);
	const overflow = style.match(/(?:^|;)\s*overflow\s*:\s*([^;]+)/i);
	if (width && /^\s*0(px)?\s*$/i.test(width[1]) && height && /^\s*0(px)?\s*$/i.test(height[1]) && overflow && /^\s*hidden\s*$/i.test(overflow[1])) return true;
	const left = style.match(/(?:^|;)\s*left\s*:\s*([^;]+)/i);
	const top = style.match(/(?:^|;)\s*top\s*:\s*([^;]+)/i);
	if (left && /^\s*-\d{4,}px\s*$/i.test(left[1])) return true;
	if (top && /^\s*-\d{4,}px\s*$/i.test(top[1])) return true;
	return false;
}
function shouldRemoveElement(element) {
	const tagName = element.tagName.toLowerCase();
	if ([
		"meta",
		"template",
		"svg",
		"canvas",
		"iframe",
		"object",
		"embed"
	].includes(tagName)) return true;
	if (tagName === "input" && element.getAttribute("type")?.toLowerCase() === "hidden") return true;
	if (element.getAttribute("aria-hidden") === "true") return true;
	if (element.hasAttribute("hidden")) return true;
	if (hasHiddenClass(element.getAttribute("class") ?? "")) return true;
	const style = element.getAttribute("style") ?? "";
	if (style && isStyleHidden(style)) return true;
	return false;
}
async function sanitizeHtml(html) {
	let sanitized = html.replace(/<!--[\s\S]*?-->/g, "");
	let document;
	try {
		const { parseHTML } = await import("linkedom");
		({document} = parseHTML(sanitized));
	} catch {
		return sanitized;
	}
	const all = Array.from(document.querySelectorAll("*"));
	for (let i = all.length - 1; i >= 0; i--) {
		const el = all[i];
		if (shouldRemoveElement(el)) el.parentNode?.removeChild(el);
	}
	return document.toString();
}
const INVISIBLE_UNICODE_RE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\u{E0000}-\u{E007F}]/gu;
function stripInvisibleUnicode(text) {
	return text.replace(INVISIBLE_UNICODE_RE, "");
}
//#endregion
//#region src/agents/tools/web-fetch-utils.ts
const READABILITY_MAX_HTML_CHARS = 1e6;
const READABILITY_MAX_ESTIMATED_NESTING_DEPTH = 3e3;
let readabilityDepsPromise;
async function loadReadabilityDeps() {
	if (!readabilityDepsPromise) readabilityDepsPromise = Promise.all([import("@mozilla/readability"), import("linkedom")]).then(([readability, linkedom]) => ({
		Readability: readability.Readability,
		parseHTML: linkedom.parseHTML
	}));
	try {
		return await readabilityDepsPromise;
	} catch (error) {
		readabilityDepsPromise = void 0;
		throw error;
	}
}
function decodeEntities(value) {
	return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16))).replace(/&#(\d+);/gi, (_, dec) => String.fromCharCode(Number.parseInt(dec, 10)));
}
function stripTags(value) {
	return decodeEntities(value.replace(/<[^>]+>/g, ""));
}
function normalizeWhitespace(value) {
	return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function htmlToMarkdown(html) {
	const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	const title = titleMatch ? normalizeWhitespace(stripTags(titleMatch[1])) : void 0;
	let text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
	text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, body) => {
		const label = normalizeWhitespace(stripTags(body));
		if (!label) return href;
		return `[${label}](${href})`;
	});
	text = text.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, body) => {
		return `\n${"#".repeat(Math.max(1, Math.min(6, Number.parseInt(level, 10))))} ${normalizeWhitespace(stripTags(body))}\n`;
	});
	text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, body) => {
		const label = normalizeWhitespace(stripTags(body));
		return label ? `\n- ${label}` : "";
	});
	text = text.replace(/<(br|hr)\s*\/?>/gi, "\n").replace(/<\/(p|div|section|article|header|footer|table|tr|ul|ol)>/gi, "\n");
	text = stripTags(text);
	text = normalizeWhitespace(text);
	return {
		text,
		title
	};
}
function markdownToText(markdown) {
	let text = markdown;
	text = text.replace(/!\[[^\]]*]\([^)]+\)/g, "");
	text = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
	text = text.replace(/```[\s\S]*?```/g, (block) => block.replace(/```[^\n]*\n?/g, "").replace(/```/g, ""));
	text = text.replace(/`([^`]+)`/g, "$1");
	text = text.replace(/^#{1,6}\s+/gm, "");
	text = text.replace(/^\s*[-*+]\s+/gm, "");
	text = text.replace(/^\s*\d+\.\s+/gm, "");
	return normalizeWhitespace(text);
}
function truncateText(value, maxChars) {
	if (value.length <= maxChars) return {
		text: value,
		truncated: false
	};
	return {
		text: value.slice(0, maxChars),
		truncated: true
	};
}
function exceedsEstimatedHtmlNestingDepth(html, maxDepth) {
	const voidTags = new Set([
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	]);
	let depth = 0;
	const len = html.length;
	for (let i = 0; i < len; i++) {
		if (html.charCodeAt(i) !== 60) continue;
		const next = html.charCodeAt(i + 1);
		if (next === 33 || next === 63) continue;
		let j = i + 1;
		let closing = false;
		if (html.charCodeAt(j) === 47) {
			closing = true;
			j += 1;
		}
		while (j < len && html.charCodeAt(j) <= 32) j += 1;
		const nameStart = j;
		while (j < len) {
			const c = html.charCodeAt(j);
			if (!(c >= 65 && c <= 90 || c >= 97 && c <= 122 || c >= 48 && c <= 57 || c === 58 || c === 45)) break;
			j += 1;
		}
		const tagName = html.slice(nameStart, j).toLowerCase();
		if (!tagName) continue;
		if (closing) {
			depth = Math.max(0, depth - 1);
			continue;
		}
		if (voidTags.has(tagName)) continue;
		let selfClosing = false;
		for (let k = j; k < len && k < j + 200; k++) if (html.charCodeAt(k) === 62) {
			if (html.charCodeAt(k - 1) === 47) selfClosing = true;
			break;
		}
		if (selfClosing) continue;
		depth += 1;
		if (depth > maxDepth) return true;
	}
	return false;
}
async function extractBasicHtmlContent(params) {
	const cleanHtml = await sanitizeHtml(params.html);
	const rendered = htmlToMarkdown(cleanHtml);
	if (params.extractMode === "text") {
		const text = stripInvisibleUnicode(markdownToText(rendered.text)) || stripInvisibleUnicode(normalizeWhitespace(stripTags(cleanHtml)));
		return text ? {
			text,
			title: rendered.title
		} : null;
	}
	const text = stripInvisibleUnicode(rendered.text);
	return text ? {
		text,
		title: rendered.title
	} : null;
}
async function extractReadableContent(params) {
	const cleanHtml = await sanitizeHtml(params.html);
	if (cleanHtml.length > READABILITY_MAX_HTML_CHARS || exceedsEstimatedHtmlNestingDepth(cleanHtml, READABILITY_MAX_ESTIMATED_NESTING_DEPTH)) return null;
	try {
		const { Readability, parseHTML } = await loadReadabilityDeps();
		const { document } = parseHTML(cleanHtml);
		try {
			document.baseURI = params.url;
		} catch {}
		const parsed = new Readability(document, { charThreshold: 0 }).parse();
		if (!parsed?.content) return null;
		const title = parsed.title || void 0;
		if (params.extractMode === "text") {
			const text = stripInvisibleUnicode(normalizeWhitespace(parsed.textContent ?? ""));
			return text ? {
				text,
				title
			} : null;
		}
		const rendered = htmlToMarkdown(parsed.content);
		const text = stripInvisibleUnicode(rendered.text);
		return text ? {
			text,
			title: title ?? rendered.title
		} : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/config/plugins-allowlist.ts
function ensurePluginAllowlisted(cfg, pluginId) {
	const allow = cfg.plugins?.allow;
	if (!Array.isArray(allow) || allow.includes(pluginId)) return cfg;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			allow: [...allow, pluginId]
		}
	};
}
//#endregion
//#region src/plugins/toggle-config.ts
function setPluginEnabledInConfig(config, pluginId, enabled) {
	const builtInChannelId = normalizeChatChannelId(pluginId);
	const resolvedId = builtInChannelId ?? pluginId;
	const next = {
		...config,
		plugins: {
			...config.plugins,
			entries: {
				...config.plugins?.entries,
				[resolvedId]: {
					...config.plugins?.entries?.[resolvedId],
					enabled
				}
			}
		}
	};
	if (!builtInChannelId) return next;
	const existing = config.channels?.[builtInChannelId];
	const existingRecord = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...next,
		channels: {
			...config.channels,
			[builtInChannelId]: {
				...existingRecord,
				enabled
			}
		}
	};
}
//#endregion
//#region src/plugins/enable.ts
function enablePluginInConfig(cfg, pluginId) {
	const resolvedId = normalizeChatChannelId(pluginId) ?? pluginId;
	if (cfg.plugins?.enabled === false) return {
		config: cfg,
		enabled: false,
		reason: "plugins disabled"
	};
	if (cfg.plugins?.deny?.includes(pluginId) || cfg.plugins?.deny?.includes(resolvedId)) return {
		config: cfg,
		enabled: false,
		reason: "blocked by denylist"
	};
	let next = setPluginEnabledInConfig(cfg, resolvedId, true);
	next = ensurePluginAllowlisted(next, resolvedId);
	return {
		config: next,
		enabled: true
	};
}
//#endregion
//#region src/plugin-sdk/provider-web-search.ts
/**
* @deprecated Implement provider-owned `createTool(...)` directly on the
* returned WebSearchProviderPlugin instead of routing through core.
*/
function createPluginBackedWebSearchProvider(provider) {
	return {
		...provider,
		createTool: () => {
			throw new Error(`createPluginBackedWebSearchProvider(${provider.id}) is no longer supported. Define provider-owned createTool(...) directly in the extension's WebSearchProviderPlugin.`);
		}
	};
}
//#endregion
export { withTrustedWebToolsEndpoint as $, postTrustedWebToolsJson as A, writeCachedSearchPayload as B, MAX_SEARCH_COUNT as C, normalizeFreshness as D, isoToPerplexityDate as E, resolveSearchCount as F, readResponseText as G, DEFAULT_TIMEOUT_SECONDS as H, resolveSearchTimeoutSeconds as I, withTimeout as J, resolveCacheTtlMs as K, resolveSiteName as L, readConfiguredSecretString as M, readProviderEnvValue as N, normalizeToIsoDate as O, resolveSearchCacheTtlMs as P, withStrictWebToolsEndpoint as Q, throwWebSearchApiError as R, FRESHNESS_TO_RECENCY as S, buildUnsupportedSearchFilterResponse as T, normalizeCacheKey as U, DEFAULT_CACHE_TTL_MINUTES as V, readCache as W, resolveCitationRedirectUrl as X, writeCache as Y, fetchWithWebToolsNetworkGuard as Z, setTopLevelCredentialValue as _, extractBasicHtmlContent as a, normalizeLegacyWebSearchConfig as b, markdownToText as c, getScopedCredentialValue as d, defineLegacyConfigMigration as et, getTopLevelCredentialValue as f, setScopedCredentialValue as g, setProviderWebSearchPluginConfigValue as h, ensurePluginAllowlisted as i, mergeMissing as it, readCachedSearchPayload as j, parseIsoDateRange as k, truncateText as l, resolveProviderWebSearchPluginConfig as m, enablePluginInConfig as n, getRecord as nt, extractReadableContent as o, mergeScopedSearchConfig as p, resolveTimeoutSeconds as q, setPluginEnabledInConfig as r, mapLegacyAudioTranscription as rt, htmlToMarkdown as s, createPluginBackedWebSearchProvider as t, ensureRecord$1 as tt, resolveWebSearchProviderCredential as u, listLegacyWebSearchConfigPaths as v, buildSearchCacheKey as w, DEFAULT_SEARCH_COUNT as x, migrateLegacyWebSearchConfig as y, withTrustedWebSearchEndpoint as z };
