import { c as updateAuthProfileStoreWithLock, n as ensureAuthProfileStore, s as saveAuthProfileStore } from "./store-BpAvd-ka.js";
import { i as normalizeProviderIdForAuth, r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
import { r as normalizeStringEntries } from "./string-normalization-D3Up2vqV.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Caby3smH.js";
//#region src/agents/auth-profiles/profiles.ts
function dedupeProfileIds(profileIds) {
	return [...new Set(profileIds)];
}
async function setAuthProfileOrder(params) {
	const providerKey = normalizeProviderId(params.provider);
	const deduped = dedupeProfileIds(params.order && Array.isArray(params.order) ? normalizeStringEntries(params.order) : []);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		updater: (store) => {
			store.order = store.order ?? {};
			if (deduped.length === 0) {
				if (!store.order[providerKey]) return false;
				delete store.order[providerKey];
				if (Object.keys(store.order).length === 0) store.order = void 0;
				return true;
			}
			store.order[providerKey] = deduped;
			return true;
		}
	});
}
function upsertAuthProfile(params) {
	const credential = params.credential.type === "api_key" ? {
		...params.credential,
		...typeof params.credential.key === "string" ? { key: normalizeSecretInput(params.credential.key) } : {}
	} : params.credential.type === "token" ? {
		...params.credential,
		token: normalizeSecretInput(params.credential.token)
	} : params.credential;
	const store = ensureAuthProfileStore(params.agentDir);
	store.profiles[params.profileId] = credential;
	saveAuthProfileStore(store, params.agentDir);
}
async function upsertAuthProfileWithLock(params) {
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		updater: (store) => {
			store.profiles[params.profileId] = params.credential;
			return true;
		}
	});
}
function listProfilesForProvider(store, provider) {
	const providerKey = normalizeProviderIdForAuth(provider);
	return Object.entries(store.profiles).filter(([, cred]) => normalizeProviderIdForAuth(cred.provider) === providerKey).map(([id]) => id);
}
async function markAuthProfileGood(params) {
	const { store, provider, profileId, agentDir } = params;
	const updated = await updateAuthProfileStoreWithLock({
		agentDir,
		updater: (freshStore) => {
			const profile = freshStore.profiles[profileId];
			if (!profile || profile.provider !== provider) return false;
			freshStore.lastGood = {
				...freshStore.lastGood,
				[provider]: profileId
			};
			return true;
		}
	});
	if (updated) {
		store.lastGood = updated.lastGood;
		return;
	}
	const profile = store.profiles[profileId];
	if (!profile || profile.provider !== provider) return;
	store.lastGood = {
		...store.lastGood,
		[provider]: profileId
	};
	saveAuthProfileStore(store, agentDir);
}
//#endregion
export { upsertAuthProfile as a, setAuthProfileOrder as i, listProfilesForProvider as n, upsertAuthProfileWithLock as o, markAuthProfileGood as r, dedupeProfileIds as t };
