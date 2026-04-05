import { d as isPrivateOrLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4, o as isIpInCidr, p as normalizeIpAddress, u as isLoopbackIpAddress } from "./ip-Bta3TOaV.js";
import os from "node:os";
import net from "node:net";
//#region src/infra/network-interfaces.ts
function normalizeNetworkInterfaceFamily(family) {
	if (family === "IPv4" || family === 4) return "IPv4";
	if (family === "IPv6" || family === 6) return "IPv6";
}
function readNetworkInterfaces(networkInterfaces = os.networkInterfaces) {
	return networkInterfaces();
}
function safeNetworkInterfaces(networkInterfaces = os.networkInterfaces) {
	try {
		return readNetworkInterfaces(networkInterfaces);
	} catch {
		return;
	}
}
function listExternalInterfaceAddresses(snapshot, family) {
	const addresses = [];
	if (!snapshot) return addresses;
	for (const [name, entries] of Object.entries(snapshot)) {
		if (!entries) continue;
		for (const entry of entries) {
			if (!entry || entry.internal) continue;
			const address = entry.address?.trim();
			if (!address) continue;
			const entryFamily = normalizeNetworkInterfaceFamily(entry.family);
			if (!entryFamily || family && entryFamily !== family) continue;
			addresses.push({
				name,
				address,
				family: entryFamily
			});
		}
	}
	return addresses;
}
function pickMatchingExternalInterfaceAddress(snapshot, params) {
	const { family, preferredNames = [], matches = () => true } = params;
	const addresses = listExternalInterfaceAddresses(snapshot, family);
	for (const name of preferredNames) {
		const preferred = addresses.find((entry) => entry.name === name && matches(entry.address));
		if (preferred) return preferred.address;
	}
	return addresses.find((entry) => matches(entry.address))?.address;
}
//#endregion
//#region src/infra/tailnet.ts
const TAILNET_IPV4_CIDR = "100.64.0.0/10";
const TAILNET_IPV6_CIDR = "fd7a:115c:a1e0::/48";
function isTailnetIPv4(address) {
	return isIpInCidr(address, TAILNET_IPV4_CIDR);
}
function isTailnetIPv6(address) {
	return isIpInCidr(address, TAILNET_IPV6_CIDR);
}
function listTailnetAddresses() {
	const ipv4 = [];
	const ipv6 = [];
	for (const { address, family } of listExternalInterfaceAddresses(readNetworkInterfaces())) {
		if (family === "IPv4" && isTailnetIPv4(address)) ipv4.push(address);
		if (family === "IPv6" && isTailnetIPv6(address)) ipv6.push(address);
	}
	return {
		ipv4: [...new Set(ipv4)],
		ipv6: [...new Set(ipv6)]
	};
}
function pickPrimaryTailnetIPv4() {
	return listTailnetAddresses().ipv4[0];
}
function pickPrimaryTailnetIPv6() {
	return listTailnetAddresses().ipv6[0];
}
//#endregion
//#region src/gateway/net.ts
/**
* Pick the primary non-internal IPv4 address (LAN IP).
* Prefers common interface names (en0, eth0) then falls back to any external IPv4.
*/
function pickPrimaryLanIPv4() {
	return pickMatchingExternalInterfaceAddress(readNetworkInterfaces(), {
		family: "IPv4",
		preferredNames: ["en0", "eth0"]
	});
}
function normalizeHostHeader(hostHeader) {
	return (hostHeader ?? "").trim().toLowerCase();
}
function resolveHostName(hostHeader) {
	const host = normalizeHostHeader(hostHeader);
	if (!host) return "";
	if (host.startsWith("[")) {
		const end = host.indexOf("]");
		if (end !== -1) return host.slice(1, end);
	}
	if (net.isIP(host) === 6) return host;
	const [name] = host.split(":");
	return name ?? "";
}
function isLoopbackAddress(ip) {
	return isLoopbackIpAddress(ip);
}
/**
* Returns true if the IP belongs to a private or loopback network range.
* Private ranges: RFC1918, link-local, ULA IPv6, and CGNAT (100.64/10), plus loopback.
*/
function isPrivateOrLoopbackAddress(ip) {
	return isPrivateOrLoopbackIpAddress(ip);
}
function normalizeIp(ip) {
	return normalizeIpAddress(ip);
}
function stripOptionalPort(ip) {
	if (ip.startsWith("[")) {
		const end = ip.indexOf("]");
		if (end !== -1) return ip.slice(1, end);
	}
	if (net.isIP(ip)) return ip;
	const lastColon = ip.lastIndexOf(":");
	if (lastColon > -1 && ip.includes(".") && ip.indexOf(":") === lastColon) {
		const candidate = ip.slice(0, lastColon);
		if (net.isIP(candidate) === 4) return candidate;
	}
	return ip;
}
function parseIpLiteral(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	const normalized = normalizeIp(stripOptionalPort(trimmed));
	if (!normalized || net.isIP(normalized) === 0) return;
	return normalized;
}
function parseRealIp(realIp) {
	return parseIpLiteral(realIp);
}
function resolveForwardedClientIp(params) {
	const { forwardedFor, trustedProxies } = params;
	if (!trustedProxies?.length) return;
	const forwardedChain = [];
	for (const entry of forwardedFor?.split(",") ?? []) {
		const normalized = parseIpLiteral(entry);
		if (normalized) forwardedChain.push(normalized);
	}
	if (forwardedChain.length === 0) return;
	for (let index = forwardedChain.length - 1; index >= 0; index -= 1) {
		const hop = forwardedChain[index];
		if (isLoopbackAddress(hop)) continue;
		if (!isTrustedProxyAddress(hop, trustedProxies)) return hop;
	}
}
function isTrustedProxyAddress(ip, trustedProxies) {
	const normalized = normalizeIp(ip);
	if (!normalized || !trustedProxies || trustedProxies.length === 0) return false;
	return trustedProxies.some((proxy) => {
		const candidate = proxy.trim();
		if (!candidate) return false;
		return isIpInCidr(normalized, candidate);
	});
}
function resolveClientIp(params) {
	const remote = normalizeIp(params.remoteAddr);
	if (!remote) return;
	if (!isTrustedProxyAddress(remote, params.trustedProxies)) return remote;
	const forwardedIp = resolveForwardedClientIp({
		forwardedFor: params.forwardedFor,
		trustedProxies: params.trustedProxies
	});
	if (forwardedIp) return forwardedIp;
	if (params.allowRealIpFallback) return parseRealIp(params.realIp);
}
function headerValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
function resolveRequestClientIp(req, trustedProxies, allowRealIpFallback = false) {
	if (!req) return;
	return resolveClientIp({
		remoteAddr: req.socket?.remoteAddress ?? "",
		forwardedFor: headerValue(req.headers?.["x-forwarded-for"]),
		realIp: headerValue(req.headers?.["x-real-ip"]),
		trustedProxies,
		allowRealIpFallback
	});
}
/**
* Resolves gateway bind host with fallback strategy.
*
* Modes:
* - loopback: 127.0.0.1 (rarely fails, but handled gracefully)
* - lan: always 0.0.0.0 (no fallback)
* - tailnet: Tailnet IPv4 if available, else loopback
* - auto: Loopback if available, else 0.0.0.0
* - custom: User-specified IP, fallback to 0.0.0.0 if unavailable
*
* @returns The bind address to use (never null)
*/
async function resolveGatewayBindHost(bind, customHost) {
	const mode = bind ?? "loopback";
	if (mode === "loopback") {
		if (await canBindToHost("127.0.0.1")) return "127.0.0.1";
		return "0.0.0.0";
	}
	if (mode === "tailnet") {
		const tailnetIP = pickPrimaryTailnetIPv4();
		if (tailnetIP && await canBindToHost(tailnetIP)) return tailnetIP;
		if (await canBindToHost("127.0.0.1")) return "127.0.0.1";
		return "0.0.0.0";
	}
	if (mode === "lan") return "0.0.0.0";
	if (mode === "custom") {
		const host = customHost?.trim();
		if (!host) return "0.0.0.0";
		if (isValidIPv4(host) && await canBindToHost(host)) return host;
		return "0.0.0.0";
	}
	if (mode === "auto") {
		if (await canBindToHost("127.0.0.1")) return "127.0.0.1";
		return "0.0.0.0";
	}
	return "0.0.0.0";
}
/**
* Test if we can bind to a specific host address.
* Creates a temporary server, attempts to bind, then closes it.
*
* @param host - The host address to test
* @returns True if we can successfully bind to this address
*/
async function canBindToHost(host) {
	return new Promise((resolve) => {
		const testServer = net.createServer();
		testServer.once("error", () => {
			resolve(false);
		});
		testServer.once("listening", () => {
			testServer.close();
			resolve(true);
		});
		testServer.listen(0, host);
	});
}
async function resolveGatewayListenHosts(bindHost, opts) {
	if (bindHost !== "127.0.0.1") return [bindHost];
	if (await (opts?.canBindToHost ?? canBindToHost)("::1")) return [bindHost, "::1"];
	return [bindHost];
}
/**
* Validate if a string is a valid IPv4 address.
*
* @param host - The string to validate
* @returns True if valid IPv4 format
*/
function isValidIPv4(host) {
	return isCanonicalDottedDecimalIPv4(host);
}
/**
* Check if a hostname or IP refers to the local machine.
* Handles: localhost, 127.x.x.x, ::1, [::1], ::ffff:127.x.x.x
* Note: 0.0.0.0 and :: are NOT loopback - they bind to all interfaces.
*/
function isLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	return isLoopbackAddress(parsed.unbracketedHost);
}
/**
* Local-facing host check for inbound requests:
* - loopback hosts (localhost/127.x/::1 and mapped forms)
* - Tailscale Serve/Funnel hostnames (*.ts.net)
*/
function isLocalishHost(hostHeader) {
	const host = resolveHostName(hostHeader);
	if (!host) return false;
	return isLoopbackHost(host) || host.endsWith(".ts.net");
}
/**
* Check if a hostname or IP refers to a private or loopback address.
* Handles the same hostname formats as isLoopbackHost, but also accepts
* RFC 1918, link-local, CGNAT, and IPv6 ULA/link-local addresses.
*/
function isPrivateOrLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const normalized = normalizeIp(parsed.unbracketedHost);
	if (!normalized || !isPrivateOrLoopbackAddress(normalized)) return false;
	if (net.isIP(normalized) === 6) {
		if (normalized.startsWith("ff")) return false;
		if (normalized === "::") return false;
	}
	return true;
}
function parseHostForAddressChecks(host) {
	if (!host) return null;
	const normalizedHost = host.trim().toLowerCase();
	if (normalizedHost === "localhost") return {
		isLocalhost: true,
		unbracketedHost: normalizedHost
	};
	return {
		isLocalhost: false,
		unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
	};
}
/**
* Security check for WebSocket URLs (CWE-319: Cleartext Transmission of Sensitive Information).
*
* Returns true if the URL is secure for transmitting data:
* - wss:// (TLS) is always secure
* - ws:// is secure only for loopback addresses by default
* - optional break-glass: private ws:// can be enabled for trusted networks
*
* All other ws:// URLs are considered insecure because both credentials
* AND chat/conversation data would be exposed to network interception.
*/
function isSecureWebSocketUrl(url, opts) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	const protocol = parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
	if (protocol === "wss:") return true;
	if (protocol !== "ws:") return false;
	if (isLoopbackHost(parsed.hostname)) return true;
	if (opts?.allowPrivateWs) {
		if (isPrivateOrLoopbackHost(parsed.hostname)) return true;
		const hostForIpCheck = parsed.hostname.startsWith("[") && parsed.hostname.endsWith("]") ? parsed.hostname.slice(1, -1) : parsed.hostname;
		return net.isIP(hostForIpCheck) === 0;
	}
	return false;
}
//#endregion
export { pickMatchingExternalInterfaceAddress as _, isSecureWebSocketUrl as a, normalizeHostHeader as c, resolveGatewayBindHost as d, resolveGatewayListenHosts as f, pickPrimaryTailnetIPv6 as g, pickPrimaryTailnetIPv4 as h, isPrivateOrLoopbackHost as i, pickPrimaryLanIPv4 as l, isTailnetIPv4 as m, isLoopbackAddress as n, isTrustedProxyAddress as o, resolveRequestClientIp as p, isLoopbackHost as r, isValidIPv4 as s, isLocalishHost as t, resolveClientIp as u, safeNetworkInterfaces as v };
