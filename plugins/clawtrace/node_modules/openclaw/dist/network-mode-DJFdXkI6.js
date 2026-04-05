//#region src/agents/sandbox/network-mode.ts
function normalizeNetworkMode(network) {
	return network?.trim().toLowerCase() || void 0;
}
function getBlockedNetworkModeReason(params) {
	const normalized = normalizeNetworkMode(params.network);
	if (!normalized) return null;
	if (normalized === "host") return "host";
	if (normalized.startsWith("container:") && params.allowContainerNamespaceJoin !== true) return "container_namespace_join";
	return null;
}
function isDangerousNetworkMode(network) {
	const normalized = normalizeNetworkMode(network);
	return normalized === "host" || normalized?.startsWith("container:") === true;
}
//#endregion
export { isDangerousNetworkMode as n, normalizeNetworkMode as r, getBlockedNetworkModeReason as t };
