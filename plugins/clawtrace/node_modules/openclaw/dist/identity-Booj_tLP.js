//#region src/agents/auth-profiles/identity.ts
function trimOptionalString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function resolveStoredMetadata(store, profileId) {
	const profile = store?.profiles[profileId];
	if (!profile) return {};
	return {
		displayName: "displayName" in profile ? trimOptionalString(profile.displayName) : void 0,
		email: "email" in profile ? trimOptionalString(profile.email) : void 0
	};
}
function buildAuthProfileId(params) {
	return `${trimOptionalString(params.profilePrefix) ?? params.providerId}:${trimOptionalString(params.profileName) ?? "default"}`;
}
function resolveAuthProfileMetadata(params) {
	const configured = params.cfg?.auth?.profiles?.[params.profileId];
	const stored = resolveStoredMetadata(params.store, params.profileId);
	return {
		displayName: trimOptionalString(configured?.displayName) ?? stored.displayName,
		email: trimOptionalString(configured?.email) ?? stored.email
	};
}
//#endregion
export { resolveAuthProfileMetadata as n, buildAuthProfileId as t };
