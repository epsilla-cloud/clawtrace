import { n as fetchWithSsrFGuard } from "./fetch-guard-dgUzueSW.js";
import "./ssrf-runtime-B5xa5qYU.js";
import { s as DEFAULT_FETCH_TIMEOUT_MS } from "./oauth.shared-BjYaMKe5.js";
//#region extensions/google/oauth.http.ts
async function fetchWithTimeout(url, init, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) {
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init,
		timeoutMs
	});
	try {
		const body = await response.arrayBuffer();
		return new Response(body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	} finally {
		await release();
	}
}
//#endregion
export { fetchWithTimeout as t };
