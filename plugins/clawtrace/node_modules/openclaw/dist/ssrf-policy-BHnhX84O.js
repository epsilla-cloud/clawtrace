import { c as isPrivateIpAddress, d as resolvePinnedHostnameWithPolicy, s as isBlockedHostnameOrIp } from "./ssrf-BkIVE4hp.js";
//#region src/plugin-sdk/ssrf-policy.ts
function ssrfPolicyFromAllowPrivateNetwork(allowPrivateNetwork) {
	return allowPrivateNetwork ? { allowPrivateNetwork: true } : void 0;
}
async function assertHttpUrlTargetsPrivateNetwork(url, params = {}) {
	const parsed = new URL(url);
	if (parsed.protocol !== "http:") return;
	const errorMessage = params.errorMessage ?? "HTTP URL must target a trusted private/internal host";
	const { hostname } = parsed;
	if (!hostname) throw new Error(errorMessage);
	if (isBlockedHostnameOrIp(hostname)) return;
	if (params.allowPrivateNetwork !== true) throw new Error(errorMessage);
	if (!(await resolvePinnedHostnameWithPolicy(hostname, {
		lookupFn: params.lookupFn,
		policy: ssrfPolicyFromAllowPrivateNetwork(true)
	})).addresses.every((address) => isPrivateIpAddress(address))) throw new Error(errorMessage);
}
function normalizeHostnameSuffix(value) {
	const trimmed = value.trim().toLowerCase();
	if (!trimmed) return "";
	if (trimmed === "*" || trimmed === "*.") return "*";
	return trimmed.replace(/^\*\.?/, "").replace(/^\.+/, "").replace(/\.+$/, "");
}
function isHostnameAllowedBySuffixAllowlist(hostname, allowlist) {
	if (allowlist.includes("*")) return true;
	const normalized = hostname.toLowerCase();
	return allowlist.some((entry) => normalized === entry || normalized.endsWith(`.${entry}`));
}
/** Normalize suffix-style host allowlists into lowercase canonical entries with wildcard collapse. */
function normalizeHostnameSuffixAllowlist(input, defaults) {
	const source = input && input.length > 0 ? input : defaults;
	if (!source || source.length === 0) return [];
	const normalized = source.map(normalizeHostnameSuffix).filter(Boolean);
	if (normalized.includes("*")) return ["*"];
	return Array.from(new Set(normalized));
}
/** Check whether a URL is HTTPS and its hostname matches the normalized suffix allowlist. */
function isHttpsUrlAllowedByHostnameSuffixAllowlist(url, allowlist) {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:") return false;
		return isHostnameAllowedBySuffixAllowlist(parsed.hostname, allowlist);
	} catch {
		return false;
	}
}
/**
* Converts suffix-style host allowlists (for example "example.com") into SSRF
* hostname allowlist patterns used by the shared fetch guard.
*
* Suffix semantics:
* - "example.com" allows "example.com" and "*.example.com"
* - "*" disables hostname allowlist restrictions
*/
function buildHostnameAllowlistPolicyFromSuffixAllowlist(allowHosts) {
	const normalizedAllowHosts = normalizeHostnameSuffixAllowlist(allowHosts);
	if (normalizedAllowHosts.length === 0) return;
	const patterns = /* @__PURE__ */ new Set();
	for (const normalized of normalizedAllowHosts) {
		if (normalized === "*") return;
		patterns.add(normalized);
		patterns.add(`*.${normalized}`);
	}
	if (patterns.size === 0) return;
	return { hostnameAllowlist: Array.from(patterns) };
}
//#endregion
export { ssrfPolicyFromAllowPrivateNetwork as a, normalizeHostnameSuffixAllowlist as i, buildHostnameAllowlistPolicyFromSuffixAllowlist as n, isHttpsUrlAllowedByHostnameSuffixAllowlist as r, assertHttpUrlTargetsPrivateNetwork as t };
