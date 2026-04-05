import { a as logWarn } from "./logger-Bps9nlrB.js";
import { n as hasEnvHttpProxyConfigured } from "./proxy-env-DHrI5l3m.js";
import { EnvHttpProxyAgent, ProxyAgent, fetch } from "undici";
//#region src/infra/net/proxy-fetch.ts
const PROXY_FETCH_PROXY_URL = Symbol.for("openclaw.proxyFetch.proxyUrl");
/**
* Create a fetch function that routes requests through the given HTTP proxy.
* Uses undici's ProxyAgent under the hood.
*/
function makeProxyFetch(proxyUrl) {
	let agent = null;
	const resolveAgent = () => {
		if (!agent) agent = new ProxyAgent(proxyUrl);
		return agent;
	};
	const proxyFetch = ((input, init) => fetch(input, {
		...init,
		dispatcher: resolveAgent()
	}));
	Object.defineProperty(proxyFetch, PROXY_FETCH_PROXY_URL, {
		value: proxyUrl,
		enumerable: false,
		configurable: false,
		writable: false
	});
	return proxyFetch;
}
function getProxyUrlFromFetch(fetchImpl) {
	const proxyUrl = fetchImpl?.[PROXY_FETCH_PROXY_URL];
	if (typeof proxyUrl !== "string") return;
	const trimmed = proxyUrl.trim();
	return trimmed ? trimmed : void 0;
}
/**
* Resolve a proxy-aware fetch from standard environment variables
* (HTTPS_PROXY, HTTP_PROXY, https_proxy, http_proxy).
* Respects NO_PROXY / no_proxy exclusions via undici's EnvHttpProxyAgent.
* Returns undefined when no proxy is configured.
* Gracefully returns undefined if the proxy URL is malformed.
*/
function resolveProxyFetchFromEnv(env = process.env) {
	if (!hasEnvHttpProxyConfigured("https", env)) return;
	try {
		const agent = new EnvHttpProxyAgent();
		return ((input, init) => fetch(input, {
			...init,
			dispatcher: agent
		}));
	} catch (err) {
		logWarn(`Proxy env var set but agent creation failed — falling back to direct fetch: ${err instanceof Error ? err.message : String(err)}`);
		return;
	}
}
//#endregion
export { resolveProxyFetchFromEnv as i, getProxyUrlFromFetch as n, makeProxyFetch as r, PROXY_FETCH_PROXY_URL as t };
