import { n as ensureAuthProfileStore } from "./store-BpAvd-ka.js";
import "./provider-auth-Bd38MUDZ.js";
import { m as isFoundryProviderApi, p as extractFoundryEndpoint, u as buildFoundryProviderBaseUrl, y as resolveConfiguredModelNameHint } from "./shared-x9RbOMks.js";
import { o as getAccessTokenResultAsync } from "./cli-DZe1grdn.js";
import { t as getFoundryTokenCacheKey } from "./shared-runtime-Cs2FtR9K.js";
//#region extensions/microsoft-foundry/runtime.ts
const cachedTokens = /* @__PURE__ */ new Map();
const refreshPromises = /* @__PURE__ */ new Map();
function resetFoundryRuntimeAuthCaches() {
	cachedTokens.clear();
	refreshPromises.clear();
}
async function refreshEntraToken(params) {
	const result = await getAccessTokenResultAsync(params);
	const rawExpiry = result.expiresOn ? new Date(result.expiresOn).getTime() : NaN;
	const expiresAt = Number.isFinite(rawExpiry) ? rawExpiry : Date.now() + 3300 * 1e3;
	cachedTokens.set(getFoundryTokenCacheKey(params), {
		token: result.accessToken,
		expiresAt
	});
	return {
		apiKey: result.accessToken,
		expiresAt
	};
}
async function prepareFoundryRuntimeAuth(ctx) {
	if (ctx.apiKey !== "__entra_id_dynamic__") return null;
	try {
		const authStore = ensureAuthProfileStore(ctx.agentDir, { allowKeychainPrompt: false });
		const credential = ctx.profileId ? authStore.profiles[ctx.profileId] : void 0;
		const metadata = credential?.type === "api_key" ? credential.metadata : void 0;
		const modelId = typeof ctx.modelId === "string" && ctx.modelId.trim().length > 0 ? ctx.modelId.trim() : typeof metadata?.modelId === "string" && metadata.modelId.trim().length > 0 ? metadata.modelId.trim() : ctx.modelId;
		const activeModelNameHint = ctx.modelId === metadata?.modelId ? metadata?.modelName : void 0;
		const modelNameHint = resolveConfiguredModelNameHint(modelId, ctx.model.name ?? activeModelNameHint);
		const configuredApi = typeof metadata?.api === "string" && isFoundryProviderApi(metadata.api) ? metadata.api : isFoundryProviderApi(ctx.model.api) ? ctx.model.api : void 0;
		const endpoint = typeof metadata?.endpoint === "string" && metadata.endpoint.trim().length > 0 ? metadata.endpoint.trim() : extractFoundryEndpoint(ctx.model.baseUrl ?? "");
		const baseUrl = endpoint ? buildFoundryProviderBaseUrl(endpoint, modelId, modelNameHint, configuredApi) : void 0;
		const cacheKey = getFoundryTokenCacheKey({
			subscriptionId: metadata?.subscriptionId,
			tenantId: metadata?.tenantId
		});
		const cachedToken = cachedTokens.get(cacheKey);
		if (cachedToken && cachedToken.expiresAt > Date.now() + 3e5) return {
			apiKey: cachedToken.token,
			expiresAt: cachedToken.expiresAt,
			...baseUrl ? { baseUrl } : {}
		};
		let refreshPromise = refreshPromises.get(cacheKey);
		if (!refreshPromise) {
			refreshPromise = refreshEntraToken({
				subscriptionId: metadata?.subscriptionId,
				tenantId: metadata?.tenantId
			}).finally(() => {
				refreshPromises.delete(cacheKey);
			});
			refreshPromises.set(cacheKey, refreshPromise);
		}
		return {
			...await refreshPromise,
			...baseUrl ? { baseUrl } : {}
		};
	} catch (err) {
		const details = err instanceof Error ? err.message : String(err);
		throw new Error(`Failed to refresh Azure Entra ID token via az CLI: ${details}`);
	}
}
//#endregion
export { resetFoundryRuntimeAuthCaches as n, prepareFoundryRuntimeAuth as t };
