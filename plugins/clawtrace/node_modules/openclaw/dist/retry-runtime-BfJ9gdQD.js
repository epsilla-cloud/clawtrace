import { r as formatErrorMessage } from "./errors-BxyFnvP3.js";
import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { n as retryAsync, t as resolveRetryConfig } from "./retry-Dy9LmPnX.js";
//#region src/infra/retry-policy.ts
const TELEGRAM_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 400,
	maxDelayMs: 3e4,
	jitter: .1
};
const TELEGRAM_RETRY_RE = /429|timeout|connect|reset|closed|unavailable|temporarily/i;
const log = createSubsystemLogger("retry-policy");
function resolveTelegramShouldRetry(params) {
	if (!params.shouldRetry) return (err) => TELEGRAM_RETRY_RE.test(formatErrorMessage(err));
	if (params.strictShouldRetry) return params.shouldRetry;
	return (err) => params.shouldRetry?.(err) || TELEGRAM_RETRY_RE.test(formatErrorMessage(err));
}
function getTelegramRetryAfterMs(err) {
	if (!err || typeof err !== "object") return;
	const candidate = "parameters" in err && err.parameters && typeof err.parameters === "object" ? err.parameters.retry_after : "response" in err && err.response && typeof err.response === "object" && "parameters" in err.response ? err.response.parameters?.retry_after : "error" in err && err.error && typeof err.error === "object" && "parameters" in err.error ? err.error.parameters?.retry_after : void 0;
	return typeof candidate === "number" && Number.isFinite(candidate) ? candidate * 1e3 : void 0;
}
function createRateLimitRetryRunner(params) {
	const retryConfig = resolveRetryConfig(params.defaults, {
		...params.configRetry,
		...params.retry
	});
	return (fn, label) => retryAsync(fn, {
		...retryConfig,
		label,
		shouldRetry: params.shouldRetry,
		retryAfterMs: params.retryAfterMs,
		onRetry: params.verbose ? (info) => {
			const labelText = info.label ?? "request";
			const maxRetries = Math.max(1, info.maxAttempts - 1);
			log.warn(`${params.logLabel} ${labelText} rate limited, retry ${info.attempt}/${maxRetries} in ${info.delayMs}ms`);
		} : void 0
	});
}
function createTelegramRetryRunner(params) {
	const retryConfig = resolveRetryConfig(TELEGRAM_RETRY_DEFAULTS, {
		...params.configRetry,
		...params.retry
	});
	const shouldRetry = resolveTelegramShouldRetry(params);
	return (fn, label) => retryAsync(fn, {
		...retryConfig,
		label,
		shouldRetry,
		retryAfterMs: getTelegramRetryAfterMs,
		onRetry: params.verbose ? (info) => {
			const maxRetries = Math.max(1, info.maxAttempts - 1);
			log.warn(`telegram send retry ${info.attempt}/${maxRetries} for ${info.label ?? label ?? "request"} in ${info.delayMs}ms: ${formatErrorMessage(info.err)}`);
		} : void 0
	});
}
//#endregion
export { createRateLimitRetryRunner as n, createTelegramRetryRunner as r, TELEGRAM_RETRY_DEFAULTS as t };
