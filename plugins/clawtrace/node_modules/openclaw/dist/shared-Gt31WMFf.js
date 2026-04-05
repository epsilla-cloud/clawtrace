import { n as fetchWithSsrFGuard } from "./fetch-guard-dgUzueSW.js";
//#region src/media-understanding/shared.ts
const MAX_ERROR_CHARS = 300;
function normalizeBaseUrl(baseUrl, fallback) {
	return (baseUrl?.trim() || fallback).replace(/\/+$/, "");
}
async function fetchWithTimeoutGuarded(url, init, timeoutMs, fetchFn, options) {
	return await fetchWithSsrFGuard({
		url,
		fetchImpl: fetchFn,
		init,
		timeoutMs,
		policy: options?.ssrfPolicy,
		lookupFn: options?.lookupFn,
		pinDns: options?.pinDns
	});
}
async function postTranscriptionRequest(params) {
	return fetchWithTimeoutGuarded(params.url, {
		method: "POST",
		headers: params.headers,
		body: params.body
	}, params.timeoutMs, params.fetchFn, params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : void 0);
}
async function postJsonRequest(params) {
	return fetchWithTimeoutGuarded(params.url, {
		method: "POST",
		headers: params.headers,
		body: JSON.stringify(params.body)
	}, params.timeoutMs, params.fetchFn, params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : void 0);
}
async function readErrorResponse(res) {
	try {
		const collapsed = (await res.text()).replace(/\s+/g, " ").trim();
		if (!collapsed) return;
		if (collapsed.length <= MAX_ERROR_CHARS) return collapsed;
		return `${collapsed.slice(0, MAX_ERROR_CHARS)}…`;
	} catch {
		return;
	}
}
async function assertOkOrThrowHttpError(res, label) {
	if (res.ok) return;
	const detail = await readErrorResponse(res);
	const suffix = detail ? `: ${detail}` : "";
	throw new Error(`${label} (HTTP ${res.status})${suffix}`);
}
function requireTranscriptionText(value, missingMessage) {
	const text = value?.trim();
	if (!text) throw new Error(missingMessage);
	return text;
}
//#endregion
export { postTranscriptionRequest as a, postJsonRequest as i, fetchWithTimeoutGuarded as n, requireTranscriptionText as o, normalizeBaseUrl as r, assertOkOrThrowHttpError as t };
