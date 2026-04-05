//#region src/agents/provider-id.ts
function normalizeProviderId(provider) {
	const normalized = provider.trim().toLowerCase();
	if (normalized === "z.ai" || normalized === "z-ai") return "zai";
	if (normalized === "opencode-zen") return "opencode";
	if (normalized === "opencode-go-auth") return "opencode-go";
	if (normalized === "kimi" || normalized === "kimi-code" || normalized === "kimi-coding") return "kimi";
	if (normalized === "bedrock" || normalized === "aws-bedrock") return "amazon-bedrock";
	if (normalized === "bytedance" || normalized === "doubao") return "volcengine";
	return normalized;
}
/** Normalize provider ID for auth lookup. Coding-plan variants share auth with base. */
function normalizeProviderIdForAuth(provider) {
	const normalized = normalizeProviderId(provider);
	if (normalized === "volcengine-plan") return "volcengine";
	if (normalized === "byteplus-plan") return "byteplus";
	return normalized;
}
function findNormalizedProviderValue(entries, provider) {
	if (!entries) return;
	const providerKey = normalizeProviderId(provider);
	for (const [key, value] of Object.entries(entries)) if (normalizeProviderId(key) === providerKey) return value;
}
function findNormalizedProviderKey(entries, provider) {
	if (!entries) return;
	const providerKey = normalizeProviderId(provider);
	return Object.keys(entries).find((key) => normalizeProviderId(key) === providerKey);
}
//#endregion
export { normalizeProviderIdForAuth as i, findNormalizedProviderValue as n, normalizeProviderId as r, findNormalizedProviderKey as t };
