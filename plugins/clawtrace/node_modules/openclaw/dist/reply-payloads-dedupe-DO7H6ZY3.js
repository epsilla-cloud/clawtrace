import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { T as truncateUtf16Safe } from "./utils-BfvDpbwh.js";
import { u as normalizeThinkLevel } from "./thinking.shared-CA9NbpNW.js";
import { v as normalizeOptionalAccountId } from "./session-key-BhxcMJEE.js";
import { v as resolveSessionAgentId } from "./agent-scope-BSOSJbA_.js";
import { n as getActivePluginChannelRegistryVersion } from "./runtime-DgxFwo8V.js";
import { r as normalizeChatChannelId } from "./chat-meta-xAV2SRO1.js";
import "./registry-M0RVxNlg.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import { r as normalizeChannelId, t as getChannelPlugin } from "./plugins-BQ9CTy5q.js";
import { t as sanitizeContentBlocksImages } from "./tool-images-DfIo7v26.js";
import { n as resolveAgentMainSessionKey, t as canonicalizeMainSessionAlias } from "./main-session-CAdsCHMn.js";
import { i as classifyToolAgainstSandboxToolPolicy, n as resolveSandboxConfigForAgent, o as resolveSandboxToolPolicyForAgent } from "./config-BWw9Yn0D.js";
import "./thinking-BIe_TekB.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/agents/pi-embedded-helpers/bootstrap.ts
function isBase64Signature(value) {
	const trimmed = value.trim();
	if (!trimmed) return false;
	const compact = trimmed.replace(/\s+/g, "");
	if (!/^[A-Za-z0-9+/=_-]+$/.test(compact)) return false;
	const isUrl = compact.includes("-") || compact.includes("_");
	try {
		const buf = Buffer.from(compact, isUrl ? "base64url" : "base64");
		if (buf.length === 0) return false;
		const encoded = buf.toString(isUrl ? "base64url" : "base64");
		const normalize = (input) => input.replace(/=+$/g, "");
		return normalize(encoded) === normalize(compact);
	} catch {
		return false;
	}
}
/**
* Strips Claude-style thought_signature fields from content blocks.
*
* Gemini expects thought signatures as base64-encoded bytes, but Claude stores message ids
* like "msg_abc123...". We only strip "msg_*" to preserve any provider-valid signatures.
*/
function stripThoughtSignatures(content, options) {
	if (!Array.isArray(content)) return content;
	const allowBase64Only = options?.allowBase64Only ?? false;
	const includeCamelCase = options?.includeCamelCase ?? false;
	const shouldStripSignature = (value) => {
		if (!allowBase64Only) return typeof value === "string" && value.startsWith("msg_");
		return typeof value !== "string" || !isBase64Signature(value);
	};
	return content.map((block) => {
		if (!block || typeof block !== "object") return block;
		const rec = block;
		const stripSnake = shouldStripSignature(rec.thought_signature);
		const stripCamel = includeCamelCase ? shouldStripSignature(rec.thoughtSignature) : false;
		if (!stripSnake && !stripCamel) return block;
		const next = { ...rec };
		if (stripSnake) delete next.thought_signature;
		if (stripCamel) delete next.thoughtSignature;
		return next;
	});
}
const DEFAULT_BOOTSTRAP_MAX_CHARS = 2e4;
const DEFAULT_BOOTSTRAP_TOTAL_MAX_CHARS = 15e4;
const DEFAULT_BOOTSTRAP_PROMPT_TRUNCATION_WARNING_MODE = "once";
const MIN_BOOTSTRAP_FILE_BUDGET_CHARS = 64;
const BOOTSTRAP_HEAD_RATIO = .7;
const BOOTSTRAP_TAIL_RATIO = .2;
function resolveBootstrapMaxChars(cfg) {
	const raw = cfg?.agents?.defaults?.bootstrapMaxChars;
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return DEFAULT_BOOTSTRAP_MAX_CHARS;
}
function resolveBootstrapTotalMaxChars(cfg) {
	const raw = cfg?.agents?.defaults?.bootstrapTotalMaxChars;
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return DEFAULT_BOOTSTRAP_TOTAL_MAX_CHARS;
}
function resolveBootstrapPromptTruncationWarningMode(cfg) {
	const raw = cfg?.agents?.defaults?.bootstrapPromptTruncationWarning;
	if (raw === "off" || raw === "once" || raw === "always") return raw;
	return DEFAULT_BOOTSTRAP_PROMPT_TRUNCATION_WARNING_MODE;
}
function trimBootstrapContent(content, fileName, maxChars) {
	const trimmed = content.trimEnd();
	if (trimmed.length <= maxChars) return {
		content: trimmed,
		truncated: false,
		maxChars,
		originalLength: trimmed.length
	};
	const headChars = Math.floor(maxChars * BOOTSTRAP_HEAD_RATIO);
	const tailChars = Math.floor(maxChars * BOOTSTRAP_TAIL_RATIO);
	const head = trimmed.slice(0, headChars);
	const tail = trimmed.slice(-tailChars);
	return {
		content: [
			head,
			[
				"",
				`[...truncated, read ${fileName} for full content...]`,
				`…(truncated ${fileName}: kept ${headChars}+${tailChars} chars of ${trimmed.length})…`,
				""
			].join("\n"),
			tail
		].join("\n"),
		truncated: true,
		maxChars,
		originalLength: trimmed.length
	};
}
function clampToBudget(content, budget) {
	if (budget <= 0) return "";
	if (content.length <= budget) return content;
	if (budget <= 3) return truncateUtf16Safe(content, budget);
	return `${truncateUtf16Safe(content, budget - 1)}…`;
}
async function ensureSessionHeader(params) {
	const file = params.sessionFile;
	try {
		await fs.stat(file);
		return;
	} catch {}
	await fs.mkdir(path.dirname(file), { recursive: true });
	const entry = {
		type: "session",
		version: 2,
		id: params.sessionId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		cwd: params.cwd
	};
	await fs.writeFile(file, `${JSON.stringify(entry)}\n`, "utf-8");
}
function buildBootstrapContextFiles(files, opts) {
	const maxChars = opts?.maxChars ?? 2e4;
	let remainingTotalChars = Math.max(1, Math.floor(opts?.totalMaxChars ?? Math.max(maxChars, 15e4)));
	const result = [];
	for (const file of files) {
		if (remainingTotalChars <= 0) break;
		const pathValue = typeof file.path === "string" ? file.path.trim() : "";
		if (!pathValue) {
			opts?.warn?.(`skipping bootstrap file "${file.name}" — missing or invalid "path" field (hook may have used "filePath" instead)`);
			continue;
		}
		if (file.missing) {
			const cappedMissingText = clampToBudget(`[MISSING] Expected at: ${pathValue}`, remainingTotalChars);
			if (!cappedMissingText) break;
			remainingTotalChars = Math.max(0, remainingTotalChars - cappedMissingText.length);
			result.push({
				path: pathValue,
				content: cappedMissingText
			});
			continue;
		}
		if (remainingTotalChars < MIN_BOOTSTRAP_FILE_BUDGET_CHARS) {
			opts?.warn?.(`remaining bootstrap budget is ${remainingTotalChars} chars (<${MIN_BOOTSTRAP_FILE_BUDGET_CHARS}); skipping additional bootstrap files`);
			break;
		}
		const fileMaxChars = Math.max(1, Math.min(maxChars, remainingTotalChars));
		const trimmed = trimBootstrapContent(file.content ?? "", file.name, fileMaxChars);
		const contentWithinBudget = clampToBudget(trimmed.content, remainingTotalChars);
		if (!contentWithinBudget) continue;
		if (trimmed.truncated || contentWithinBudget.length < trimmed.content.length) opts?.warn?.(`workspace bootstrap file ${file.name} is ${trimmed.originalLength} chars (limit ${trimmed.maxChars}); truncating in injected context`);
		remainingTotalChars = Math.max(0, remainingTotalChars - contentWithinBudget.length);
		result.push({
			path: pathValue,
			content: contentWithinBudget
		});
	}
	return result;
}
function sanitizeGoogleTurnOrdering(messages) {
	const GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT = "(session bootstrap)";
	const first = messages[0];
	const role = first?.role;
	const content = first?.content;
	if (role === "user" && typeof content === "string" && content.trim() === GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT) return messages;
	if (role !== "assistant") return messages;
	return [{
		role: "user",
		content: GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT,
		timestamp: Date.now()
	}, ...messages];
}
//#endregion
//#region src/shared/assistant-error-format.ts
const ERROR_PAYLOAD_PREFIX_RE = /^(?:error|(?:[a-z][\w-]*\s+)?api\s*error|apierror|openai\s*error|anthropic\s*error|gateway\s*error|codex\s*error)(?:\s+\d{3})?[:\s-]+/i;
const HTTP_STATUS_DELIMITER_RE = /(?:\s*:\s*|\s+)/;
const HTTP_STATUS_PREFIX_RE = new RegExp(`^(?:http\\s*)?(\\d{3})${HTTP_STATUS_DELIMITER_RE.source}(.+)$`, "i");
const HTTP_STATUS_CODE_PREFIX_RE = new RegExp(`^(?:http\\s*)?(\\d{3})(?:${HTTP_STATUS_DELIMITER_RE.source}([\\s\\S]+))?$`, "i");
const HTML_ERROR_PREFIX_RE = /^\s*(?:<!doctype\s+html\b|<html\b)/i;
const CLOUDFLARE_HTML_ERROR_CODES = new Set([
	521,
	522,
	523,
	524,
	525,
	526,
	530
]);
function isErrorPayloadObject(payload) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
	const record = payload;
	if (record.type === "error") return true;
	if (typeof record.request_id === "string" || typeof record.requestId === "string") return true;
	if ("error" in record) {
		const err = record.error;
		if (err && typeof err === "object" && !Array.isArray(err)) {
			const errRecord = err;
			if (typeof errRecord.message === "string" || typeof errRecord.type === "string" || typeof errRecord.code === "string") return true;
		}
	}
	return false;
}
function parseApiErrorPayload(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const candidates = [trimmed];
	if (ERROR_PAYLOAD_PREFIX_RE.test(trimmed)) candidates.push(trimmed.replace(ERROR_PAYLOAD_PREFIX_RE, "").trim());
	for (const candidate of candidates) {
		if (!candidate.startsWith("{") || !candidate.endsWith("}")) continue;
		try {
			const parsed = JSON.parse(candidate);
			if (isErrorPayloadObject(parsed)) return parsed;
		} catch {}
	}
	return null;
}
function extractLeadingHttpStatus(raw) {
	const match = raw.match(HTTP_STATUS_CODE_PREFIX_RE);
	if (!match) return null;
	const code = Number(match[1]);
	if (!Number.isFinite(code)) return null;
	return {
		code,
		rest: (match[2] ?? "").trim()
	};
}
function isCloudflareOrHtmlErrorPage(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	const status = extractLeadingHttpStatus(trimmed);
	if (!status || status.code < 500) return false;
	if (CLOUDFLARE_HTML_ERROR_CODES.has(status.code)) return true;
	return status.code < 600 && HTML_ERROR_PREFIX_RE.test(status.rest) && /<\/html>/i.test(status.rest);
}
function parseApiErrorInfo(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	let httpCode;
	let candidate = trimmed;
	const httpPrefixMatch = candidate.match(/^(\d{3})\s+(.+)$/s);
	if (httpPrefixMatch) {
		httpCode = httpPrefixMatch[1];
		candidate = httpPrefixMatch[2].trim();
	}
	const payload = parseApiErrorPayload(candidate);
	if (!payload) return null;
	const requestId = typeof payload.request_id === "string" ? payload.request_id : typeof payload.requestId === "string" ? payload.requestId : void 0;
	const topType = typeof payload.type === "string" ? payload.type : void 0;
	const topMessage = typeof payload.message === "string" ? payload.message : void 0;
	let errType;
	let errMessage;
	if (payload.error && typeof payload.error === "object" && !Array.isArray(payload.error)) {
		const err = payload.error;
		if (typeof err.type === "string") errType = err.type;
		if (typeof err.code === "string" && !errType) errType = err.code;
		if (typeof err.message === "string") errMessage = err.message;
	}
	return {
		httpCode,
		type: errType ?? topType,
		message: errMessage ?? topMessage,
		requestId
	};
}
function formatRawAssistantErrorForUi(raw) {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) return "LLM request failed with an unknown error.";
	const leadingStatus = extractLeadingHttpStatus(trimmed);
	if (leadingStatus && isCloudflareOrHtmlErrorPage(trimmed)) return `The AI service is temporarily unavailable (HTTP ${leadingStatus.code}). Please try again in a moment.`;
	const httpMatch = trimmed.match(HTTP_STATUS_PREFIX_RE);
	if (httpMatch) {
		const rest = httpMatch[2].trim();
		if (!rest.startsWith("{")) return `HTTP ${httpMatch[1]}: ${rest}`;
	}
	const info = parseApiErrorInfo(trimmed);
	if (info?.message) return `${info.httpCode ? `HTTP ${info.httpCode}` : "LLM error"}${info.type ? ` ${info.type}` : ""}: ${info.message}`;
	return trimmed.length > 600 ? `${trimmed.slice(0, 600)}…` : trimmed;
}
//#endregion
//#region src/agents/sandbox/runtime-status.ts
function shouldSandboxSession(cfg, sessionKey, mainSessionKey) {
	if (cfg.mode === "off") return false;
	if (cfg.mode === "all") return true;
	return sessionKey.trim() !== mainSessionKey.trim();
}
function resolveMainSessionKeyForSandbox(params) {
	if (params.cfg?.session?.scope === "global") return "global";
	return resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
}
function resolveComparableSessionKeyForSandbox(params) {
	return canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
}
function resolveSandboxRuntimeStatus(params) {
	const sessionKey = params.sessionKey?.trim() ?? "";
	const agentId = resolveSessionAgentId({
		sessionKey,
		config: params.cfg
	});
	const cfg = params.cfg;
	const sandboxCfg = resolveSandboxConfigForAgent(cfg, agentId);
	const mainSessionKey = resolveMainSessionKeyForSandbox({
		cfg,
		agentId
	});
	const sandboxed = sessionKey ? shouldSandboxSession(sandboxCfg, resolveComparableSessionKeyForSandbox({
		cfg,
		agentId,
		sessionKey
	}), mainSessionKey) : false;
	return {
		agentId,
		sessionKey,
		mainSessionKey,
		mode: sandboxCfg.mode,
		sandboxed,
		toolPolicy: resolveSandboxToolPolicyForAgent(cfg, agentId)
	};
}
function sanitizeForSingleLineDisplay(value) {
	return Array.from(value, (char) => {
		if (char === "\n") return "\\n";
		if (char === "\r") return "\\r";
		if (char === "	") return "\\t";
		const codePoint = char.codePointAt(0) ?? 0;
		if (codePoint < 32 || codePoint === 127) return `\\x${codePoint.toString(16).padStart(2, "0")}`;
		return char;
	}).join("");
}
function hasUnsafeControlChars(value) {
	return Array.from(value).some((char) => {
		const codePoint = char.codePointAt(0) ?? 0;
		return codePoint < 32 || codePoint === 127;
	});
}
function redactSessionKey(value) {
	const trimmed = value.trim();
	if (!trimmed) return "(unknown)";
	if (trimmed.length <= 12) return "(redacted)";
	return `${sanitizeForSingleLineDisplay(trimmed.slice(0, 6))}…${sanitizeForSingleLineDisplay(trimmed.slice(-6))}`;
}
function shellEscapeSingleArg(value) {
	return `'${value.replaceAll("'", `'\\''`)}'`;
}
function formatSandboxToolPolicyBlockedMessage(params) {
	const tool = params.toolName.trim().toLowerCase();
	if (!tool) return;
	const runtime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	});
	if (!runtime.sandboxed) return;
	const { blockedByDeny, blockedByAllow } = classifyToolAgainstSandboxToolPolicy(tool, runtime.toolPolicy);
	if (!blockedByDeny && !blockedByAllow) return;
	const reasons = [];
	const fixes = [];
	if (blockedByDeny) {
		reasons.push("deny list");
		fixes.push(`Remove "${tool}" from ${runtime.toolPolicy.sources.deny.key}.`);
	}
	if (blockedByAllow) {
		reasons.push("allow list");
		fixes.push(`Add "${tool}" to ${runtime.toolPolicy.sources.allow.key} (or set it to [] to allow all).`);
	}
	const lines = [];
	lines.push(`Tool "${tool}" blocked by sandbox tool policy (mode=${runtime.mode}).`);
	lines.push(`Session: ${redactSessionKey(runtime.sessionKey)}`);
	lines.push(`Reason: ${reasons.join(" + ")}`);
	lines.push("Fix:");
	lines.push(`- agents.defaults.sandbox.mode=off (disable sandbox)`);
	for (const fix of fixes) lines.push(`- ${fix}`);
	if (runtime.mode === "non-main") lines.push("- Use the agent main session instead of a non-main session.");
	const explainCommand = runtime.sessionKey ? hasUnsafeControlChars(runtime.sessionKey) ? `openclaw sandbox explain --agent ${runtime.agentId}` : `openclaw sandbox explain --session ${shellEscapeSingleArg(runtime.sessionKey)}` : "openclaw sandbox explain";
	lines.push(`- See: ${formatCliCommand(explainCommand)}`);
	return lines.join("\n");
}
//#endregion
//#region src/agents/stable-stringify.ts
function stableStringify(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (Array.isArray(value)) return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).toSorted().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}
//#endregion
//#region src/agents/pi-embedded-helpers/failover-matches.ts
const PERIODIC_USAGE_LIMIT_RE = /\b(?:daily|weekly|monthly)(?:\/(?:daily|weekly|monthly))* (?:usage )?limit(?:s)?(?: (?:exhausted|reached|exceeded))?\b/i;
const ERROR_PATTERNS = {
	rateLimit: [
		/rate[_ ]limit|too many requests|429/,
		"model_cooldown",
		"exceeded your current quota",
		"resource has been exhausted",
		"quota exceeded",
		"resource_exhausted",
		"usage limit",
		/\btpm\b/i,
		"tokens per minute",
		"tokens per day"
	],
	overloaded: [
		/overloaded_error|"type"\s*:\s*"overloaded_error"/i,
		"overloaded",
		/service[_ ]unavailable.*(?:overload|capacity|high[_ ]demand)|(?:overload|capacity|high[_ ]demand).*service[_ ]unavailable/i,
		"high demand"
	],
	serverError: [
		"an error occurred while processing",
		"internal server error",
		"internal_error",
		"server_error",
		"service temporarily unavailable",
		"service_unavailable",
		"bad gateway",
		"gateway timeout",
		"upstream error",
		"upstream connect error",
		"connection reset"
	],
	timeout: [
		"timeout",
		"timed out",
		"service unavailable",
		"deadline exceeded",
		"context deadline exceeded",
		"connection error",
		"network error",
		"network request failed",
		"fetch failed",
		"socket hang up",
		/\beconn(?:refused|reset|aborted)\b/i,
		/\benetunreach\b/i,
		/\behostunreach\b/i,
		/\behostdown\b/i,
		/\benetreset\b/i,
		/\betimedout\b/i,
		/\besockettimedout\b/i,
		/\bepipe\b/i,
		/\benotfound\b/i,
		/\beai_again\b/i,
		/without sending (?:any )?chunks?/i,
		/\bstop reason:\s*(?:abort|error|malformed_response|network_error)\b/i,
		/\breason:\s*(?:abort|error|malformed_response|network_error)\b/i,
		/\bunhandled stop reason:\s*(?:abort|error|malformed_response|network_error)\b/i
	],
	billing: [
		/["']?(?:status|code)["']?\s*[:=]\s*402\b|\bhttp\s*402\b|\berror(?:\s+code)?\s*[:=]?\s*402\b|\b(?:got|returned|received)\s+(?:a\s+)?402\b|^\s*402\s+payment/i,
		"payment required",
		"insufficient credits",
		/insufficient[_ ]quota/i,
		"credit balance",
		"plans & billing",
		"insufficient balance",
		"insufficient usd or diem balance",
		/requires?\s+more\s+credits/i
	],
	authPermanent: [
		/api[_ ]?key[_ ]?(?:revoked|invalid|deactivated|deleted)/i,
		"invalid_api_key",
		"key has been disabled",
		"key has been revoked",
		"account has been deactivated",
		/could not (?:authenticate|validate).*(?:api[_ ]?key|credentials)/i,
		"permission_error",
		"not allowed for this organization"
	],
	auth: [
		/invalid[_ ]?api[_ ]?key/,
		"incorrect api key",
		"invalid token",
		"authentication",
		"re-authenticate",
		"oauth token refresh failed",
		"unauthorized",
		"forbidden",
		"access denied",
		"insufficient permissions",
		"insufficient permission",
		/missing scopes?:/i,
		"expired",
		"token has expired",
		/\b401\b/,
		/\b403\b/,
		"no credentials found",
		"no api key found",
		/\bfailed to (?:extract|parse|validate|decode)\b.*\btoken\b/
	],
	format: [
		"string should match pattern",
		"tool_use.id",
		"tool_use_id",
		"messages.1.content.1.tool_use.id",
		"invalid request format",
		/tool call id was.*must be/i
	]
};
const BILLING_ERROR_HEAD_RE = /^(?:error[:\s-]+)?billing(?:\s+error)?(?:[:\s-]+|$)|^(?:error[:\s-]+)?(?:credit balance|insufficient credits?|payment required|http\s*402\b)/i;
const BILLING_ERROR_HARD_402_RE = /["']?(?:status|code)["']?\s*[:=]\s*402\b|\bhttp\s*402\b|\berror(?:\s+code)?\s*[:=]?\s*402\b|^\s*402\s+payment/i;
const BILLING_ERROR_MAX_LENGTH = 512;
function matchesErrorPatterns(raw, patterns) {
	if (!raw) return false;
	const value = raw.toLowerCase();
	return patterns.some((pattern) => pattern instanceof RegExp ? pattern.test(value) : value.includes(pattern));
}
function matchesFormatErrorPattern(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.format);
}
function isRateLimitErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.rateLimit);
}
function isTimeoutErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.timeout);
}
function isPeriodicUsageLimitErrorMessage(raw) {
	return PERIODIC_USAGE_LIMIT_RE.test(raw);
}
function isBillingErrorMessage(raw) {
	const value = raw.toLowerCase();
	if (!value) return false;
	if (raw.length > BILLING_ERROR_MAX_LENGTH) return BILLING_ERROR_HARD_402_RE.test(value);
	if (matchesErrorPatterns(value, ERROR_PATTERNS.billing)) return true;
	if (!BILLING_ERROR_HEAD_RE.test(raw)) return false;
	return value.includes("upgrade") || value.includes("credits") || value.includes("payment") || value.includes("plan");
}
function isAuthPermanentErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.authPermanent);
}
function isAuthErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.auth);
}
function isOverloadedErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.overloaded);
}
function isServerErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.serverError);
}
//#endregion
//#region src/agents/pi-embedded-helpers/errors.ts
const log = createSubsystemLogger("errors");
function formatBillingErrorMessage(provider, model) {
	const providerName = provider?.trim();
	const modelName = model?.trim();
	const providerLabel = providerName && modelName ? `${providerName} (${modelName})` : providerName || void 0;
	if (providerLabel) return `⚠️ ${providerLabel} returned a billing error — your API key has run out of credits or has an insufficient balance. Check your ${providerName} billing dashboard and top up or switch to a different API key.`;
	return "⚠️ API provider returned a billing error — your API key has run out of credits or has an insufficient balance. Check your provider's billing dashboard and top up or switch to a different API key.";
}
const BILLING_ERROR_USER_MESSAGE = formatBillingErrorMessage();
const RATE_LIMIT_ERROR_USER_MESSAGE = "⚠️ API rate limit reached. Please try again later.";
const OVERLOADED_ERROR_USER_MESSAGE = "The AI service is temporarily overloaded. Please try again in a moment.";
/**
* Check whether the raw rate-limit error contains provider-specific details
* worth surfacing (e.g. reset times, plan names, quota info).  Bare status
* codes like "429" or generic phrases like "rate limit exceeded" are not
* considered specific enough.
*/
const RATE_LIMIT_SPECIFIC_HINT_RE = /\bmin(ute)?s?\b|\bhours?\b|\bseconds?\b|\btry again in\b|\breset\b|\bplan\b|\bquota\b/i;
function extractProviderRateLimitMessage(raw) {
	const withoutPrefix = raw.replace(ERROR_PREFIX_RE, "").trim();
	const candidate = (parseApiErrorInfo(raw) ?? parseApiErrorInfo(withoutPrefix))?.message ?? (extractLeadingHttpStatus(withoutPrefix)?.rest || withoutPrefix);
	if (!candidate || !RATE_LIMIT_SPECIFIC_HINT_RE.test(candidate)) return;
	if (isCloudflareOrHtmlErrorPage(withoutPrefix)) return;
	const trimmed = candidate.trim();
	if (trimmed.length > 300 || trimmed.startsWith("{") || /^(?:<!doctype\s+html\b|<html\b)/i.test(trimmed)) return;
	return `⚠️ ${trimmed}`;
}
function formatRateLimitOrOverloadedErrorCopy(raw) {
	if (isRateLimitErrorMessage(raw)) return extractProviderRateLimitMessage(raw) ?? RATE_LIMIT_ERROR_USER_MESSAGE;
	if (isOverloadedErrorMessage(raw)) return OVERLOADED_ERROR_USER_MESSAGE;
}
function formatTransportErrorCopy(raw) {
	if (!raw) return;
	const lower = raw.toLowerCase();
	if (/\beconnrefused\b/i.test(raw) || lower.includes("connection refused") || lower.includes("actively refused")) return "LLM request failed: connection refused by the provider endpoint.";
	if (/\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i.test(raw) || lower.includes("socket hang up") || lower.includes("connection reset") || lower.includes("connection aborted")) return "LLM request failed: network connection was interrupted.";
	if (/\benotfound\b|\beai_again\b/i.test(raw) || lower.includes("getaddrinfo") || lower.includes("no such host") || lower.includes("dns")) return "LLM request failed: DNS lookup for the provider endpoint failed.";
	if (/\benetunreach\b|\behostunreach\b|\behostdown\b/i.test(raw) || lower.includes("network is unreachable") || lower.includes("host is unreachable")) return "LLM request failed: the provider endpoint is unreachable from this host.";
	if (lower.includes("fetch failed") || lower.includes("connection error") || lower.includes("network request failed")) return "LLM request failed: network connection error.";
}
function isReasoningConstraintErrorMessage(raw) {
	if (!raw) return false;
	const lower = raw.toLowerCase();
	return lower.includes("reasoning is mandatory") || lower.includes("reasoning is required") || lower.includes("requires reasoning") || lower.includes("reasoning") && lower.includes("cannot be disabled");
}
function hasRateLimitTpmHint(raw) {
	const lower = raw.toLowerCase();
	return /\btpm\b/i.test(lower) || lower.includes("tokens per minute");
}
function isContextOverflowError(errorMessage) {
	if (!errorMessage) return false;
	const lower = errorMessage.toLowerCase();
	if (hasRateLimitTpmHint(errorMessage)) return false;
	if (isReasoningConstraintErrorMessage(errorMessage)) return false;
	const hasRequestSizeExceeds = lower.includes("request size exceeds");
	const hasContextWindow = lower.includes("context window") || lower.includes("context length") || lower.includes("maximum context length");
	return lower.includes("request_too_large") || lower.includes("request exceeds the maximum size") || lower.includes("context length exceeded") || lower.includes("maximum context length") || lower.includes("prompt is too long") || lower.includes("prompt too long") || lower.includes("exceeds model context window") || lower.includes("model token limit") || hasRequestSizeExceeds && hasContextWindow || lower.includes("context overflow:") || lower.includes("exceed context limit") || lower.includes("exceeds the model's maximum context") || lower.includes("max_tokens") && lower.includes("exceed") && lower.includes("context") || lower.includes("input length") && lower.includes("exceed") && lower.includes("context") || lower.includes("413") && lower.includes("too large") || lower.includes("context_window_exceeded") || errorMessage.includes("上下文过长") || errorMessage.includes("上下文超出") || errorMessage.includes("上下文长度超") || errorMessage.includes("超出最大上下文") || errorMessage.includes("请压缩上下文");
}
const CONTEXT_WINDOW_TOO_SMALL_RE = /context window.*(too small|minimum is)/i;
const CONTEXT_OVERFLOW_HINT_RE = /context.*overflow|context window.*(too (?:large|long)|exceed|over|limit|max(?:imum)?|requested|sent|tokens)|prompt.*(too (?:large|long)|exceed|over|limit|max(?:imum)?)|(?:request|input).*(?:context|window|length|token).*(too (?:large|long)|exceed|over|limit|max(?:imum)?)/i;
const RATE_LIMIT_HINT_RE = /rate limit|too many requests|requests per (?:minute|hour|day)|quota|throttl|429\b|tokens per day/i;
function isLikelyContextOverflowError(errorMessage) {
	if (!errorMessage) return false;
	if (hasRateLimitTpmHint(errorMessage)) return false;
	if (isReasoningConstraintErrorMessage(errorMessage)) return false;
	if (isBillingErrorMessage(errorMessage)) return false;
	if (CONTEXT_WINDOW_TOO_SMALL_RE.test(errorMessage)) return false;
	if (isRateLimitErrorMessage(errorMessage)) return false;
	if (isContextOverflowError(errorMessage)) return true;
	if (RATE_LIMIT_HINT_RE.test(errorMessage)) return false;
	return CONTEXT_OVERFLOW_HINT_RE.test(errorMessage);
}
function isCompactionFailureError(errorMessage) {
	if (!errorMessage) return false;
	const lower = errorMessage.toLowerCase();
	if (!(lower.includes("summarization failed") || lower.includes("auto-compaction") || lower.includes("compaction failed") || lower.includes("compaction"))) return false;
	if (isLikelyContextOverflowError(errorMessage)) return true;
	return lower.includes("context overflow");
}
const OBSERVED_OVERFLOW_TOKEN_PATTERNS = [
	/prompt is too long:\s*([\d,]+)\s+tokens\s*>\s*[\d,]+\s+maximum/i,
	/requested\s+([\d,]+)\s+tokens/i,
	/resulted in\s+([\d,]+)\s+tokens/i
];
function extractObservedOverflowTokenCount(errorMessage) {
	if (!errorMessage) return;
	for (const pattern of OBSERVED_OVERFLOW_TOKEN_PATTERNS) {
		const rawCount = errorMessage.match(pattern)?.[1]?.replaceAll(",", "");
		if (!rawCount) continue;
		const parsed = Number(rawCount);
		if (Number.isFinite(parsed) && parsed > 0) return Math.floor(parsed);
	}
}
const FINAL_TAG_RE = /<\s*\/?\s*final\s*>/gi;
const ERROR_PREFIX_RE = /^(?:error|(?:[a-z][\w-]*\s+)?api\s*error|openai\s*error|anthropic\s*error|gateway\s*error|codex\s*error|request failed|failed|exception)(?:\s+\d{3})?[:\s-]+/i;
const CONTEXT_OVERFLOW_ERROR_HEAD_RE = /^(?:context overflow:|request_too_large\b|request size exceeds\b|request exceeds the maximum size\b|context length exceeded\b|maximum context length\b|prompt is too long\b|exceeds model context window\b)/i;
const TRANSIENT_HTTP_ERROR_CODES = new Set([
	499,
	500,
	502,
	503,
	504,
	521,
	522,
	523,
	524,
	529
]);
const HTTP_ERROR_HINTS = [
	"error",
	"bad request",
	"not found",
	"unauthorized",
	"forbidden",
	"internal server",
	"service unavailable",
	"gateway",
	"rate limit",
	"overloaded",
	"timeout",
	"timed out",
	"invalid",
	"too many requests",
	"permission"
];
const BILLING_402_HINTS = [
	"insufficient credits",
	"insufficient quota",
	"credit balance",
	"insufficient balance",
	"plans & billing",
	"add more credits",
	"top up"
];
const BILLING_402_PLAN_HINTS = [
	"upgrade your plan",
	"upgrade plan",
	"current plan",
	"subscription"
];
const PERIODIC_402_HINTS = [
	"daily",
	"weekly",
	"monthly"
];
const RETRYABLE_402_RETRY_HINTS = [
	"try again",
	"retry",
	"temporary",
	"cooldown"
];
const RETRYABLE_402_LIMIT_HINTS = [
	"usage limit",
	"rate limit",
	"organization usage"
];
const RETRYABLE_402_SCOPED_HINTS = ["organization", "workspace"];
const RETRYABLE_402_SCOPED_RESULT_HINTS = [
	"billing period",
	"exceeded",
	"reached",
	"exhausted"
];
const RAW_402_MARKER_RE = /["']?(?:status|code)["']?\s*[:=]\s*402\b|\bhttp\s*402\b|\berror(?:\s+code)?\s*[:=]?\s*402\b|\b(?:got|returned|received)\s+(?:a\s+)?402\b|^\s*402\s+payment required\b|^\s*402\s+.*used up your points\b/i;
const LEADING_402_WRAPPER_RE = /^(?:error[:\s-]+)?(?:(?:http\s*)?402(?:\s+payment required)?|payment required)(?:[:\s-]+|$)/i;
function includesAnyHint(text, hints) {
	return hints.some((hint) => text.includes(hint));
}
function hasExplicit402BillingSignal(text) {
	return includesAnyHint(text, BILLING_402_HINTS) || includesAnyHint(text, BILLING_402_PLAN_HINTS) && text.includes("limit") || text.includes("billing hard limit") || text.includes("hard limit reached") || text.includes("maximum allowed") && text.includes("limit");
}
function hasQuotaRefreshWindowSignal(text) {
	return text.includes("subscription quota limit") && (text.includes("automatic quota refresh") || text.includes("rolling time window"));
}
function hasRetryable402TransientSignal(text) {
	const hasPeriodicHint = includesAnyHint(text, PERIODIC_402_HINTS);
	const hasSpendLimit = text.includes("spend limit") || text.includes("spending limit");
	const hasScopedHint = includesAnyHint(text, RETRYABLE_402_SCOPED_HINTS);
	return includesAnyHint(text, RETRYABLE_402_RETRY_HINTS) && includesAnyHint(text, RETRYABLE_402_LIMIT_HINTS) || hasPeriodicHint && (text.includes("usage limit") || hasSpendLimit) || hasPeriodicHint && text.includes("limit") && text.includes("reset") || hasScopedHint && text.includes("limit") && (hasSpendLimit || includesAnyHint(text, RETRYABLE_402_SCOPED_RESULT_HINTS));
}
function normalize402Message(raw) {
	return raw.trim().toLowerCase().replace(LEADING_402_WRAPPER_RE, "").trim();
}
function classify402Message(message) {
	const normalized = normalize402Message(message);
	if (!normalized) return "billing";
	if (hasQuotaRefreshWindowSignal(normalized)) return "rate_limit";
	if (hasExplicit402BillingSignal(normalized)) return "billing";
	if (isRateLimitErrorMessage(normalized)) return "rate_limit";
	if (hasRetryable402TransientSignal(normalized)) return "rate_limit";
	return "billing";
}
function classifyFailoverReasonFrom402Text(raw) {
	if (!RAW_402_MARKER_RE.test(raw)) return null;
	return classify402Message(raw);
}
function isTransientHttpError(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	const status = extractLeadingHttpStatus(trimmed);
	if (!status) return false;
	return TRANSIENT_HTTP_ERROR_CODES.has(status.code);
}
function classifyFailoverReasonFromHttpStatus(status, message) {
	if (typeof status !== "number" || !Number.isFinite(status)) return null;
	if (status === 402) return message ? classify402Message(message) : "billing";
	if (status === 429) return "rate_limit";
	if (status === 401 || status === 403) {
		if (message && isAuthPermanentErrorMessage(message)) return "auth_permanent";
		return "auth";
	}
	if (status === 408) return "timeout";
	if (status === 410) {
		if (message && isCliSessionExpiredErrorMessage(message)) return "session_expired";
		if (message && isBillingErrorMessage(message)) return "billing";
		if (message && isAuthPermanentErrorMessage(message)) return "auth_permanent";
		if (message && isAuthErrorMessage(message)) return "auth";
		return "timeout";
	}
	if (status === 503) {
		if (message && isOverloadedErrorMessage(message)) return "overloaded";
		return "timeout";
	}
	if (status === 499) {
		if (message && isOverloadedErrorMessage(message)) return "overloaded";
		return "timeout";
	}
	if (status === 500 || status === 502 || status === 504) return "timeout";
	if (status === 529) return "overloaded";
	if (status === 400 || status === 422) {
		if (message && isBillingErrorMessage(message)) return "billing";
		return "format";
	}
	return null;
}
function stripFinalTagsFromText(text) {
	if (!text) return text;
	return text.replace(FINAL_TAG_RE, "");
}
function collapseConsecutiveDuplicateBlocks(text) {
	const trimmed = text.trim();
	if (!trimmed) return text;
	const blocks = trimmed.split(/\n{2,}/);
	if (blocks.length < 2) return text;
	const normalizeBlock = (value) => value.trim().replace(/\s+/g, " ");
	const result = [];
	let lastNormalized = null;
	for (const block of blocks) {
		const normalized = normalizeBlock(block);
		if (lastNormalized && normalized === lastNormalized) continue;
		result.push(block.trim());
		lastNormalized = normalized;
	}
	if (result.length === blocks.length) return text;
	return result.join("\n\n");
}
function isLikelyHttpErrorText(raw) {
	if (isCloudflareOrHtmlErrorPage(raw)) return true;
	const status = extractLeadingHttpStatus(raw);
	if (!status) return false;
	if (status.code < 400) return false;
	const message = status.rest.toLowerCase();
	return HTTP_ERROR_HINTS.some((hint) => message.includes(hint));
}
function shouldRewriteContextOverflowText(raw) {
	if (!isContextOverflowError(raw)) return false;
	return isRawApiErrorPayload(raw) || isLikelyHttpErrorText(raw) || ERROR_PREFIX_RE.test(raw) || CONTEXT_OVERFLOW_ERROR_HEAD_RE.test(raw);
}
function getApiErrorPayloadFingerprint(raw) {
	if (!raw) return null;
	const payload = parseApiErrorPayload(raw);
	if (!payload) return null;
	return stableStringify(payload);
}
function isRawApiErrorPayload(raw) {
	return getApiErrorPayloadFingerprint(raw) !== null;
}
function isLikelyProviderErrorType(type) {
	const normalized = type?.trim().toLowerCase();
	if (!normalized) return false;
	return normalized.endsWith("_error");
}
const NON_ERROR_PROVIDER_PAYLOAD_MAX_LENGTH = 16384;
const NON_ERROR_PROVIDER_PAYLOAD_PREFIX_RE = /^codex\s*error(?:\s+\d{3})?[:\s-]+/i;
function shouldRewriteRawPayloadWithoutErrorContext(raw) {
	if (raw.length > NON_ERROR_PROVIDER_PAYLOAD_MAX_LENGTH) return false;
	if (!NON_ERROR_PROVIDER_PAYLOAD_PREFIX_RE.test(raw)) return false;
	const info = parseApiErrorInfo(raw);
	if (!info) return false;
	if (isLikelyProviderErrorType(info.type)) return true;
	if (info.httpCode) {
		const parsedCode = Number(info.httpCode);
		if (Number.isFinite(parsedCode) && parsedCode >= 400) return true;
	}
	return false;
}
function formatAssistantErrorText(msg, opts) {
	const raw = (msg.errorMessage ?? "").trim();
	if (msg.stopReason !== "error" && !raw) return;
	if (!raw) return "LLM request failed with an unknown error.";
	const unknownTool = raw.match(/unknown tool[:\s]+["']?([a-z0-9_-]+)["']?/i) ?? raw.match(/tool\s+["']?([a-z0-9_-]+)["']?\s+(?:not found|is not available)/i);
	if (unknownTool?.[1]) {
		const rewritten = formatSandboxToolPolicyBlockedMessage({
			cfg: opts?.cfg,
			sessionKey: opts?.sessionKey,
			toolName: unknownTool[1]
		});
		if (rewritten) return rewritten;
	}
	if (isContextOverflowError(raw)) return "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model.";
	if (isReasoningConstraintErrorMessage(raw)) return "Reasoning is required for this model endpoint. Use /think minimal (or any non-off level) and try again.";
	if (/incorrect role information|roles must alternate|400.*role|"message".*role.*information/i.test(raw)) return "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
	if (isMissingToolCallInputError(raw)) return "Session history looks corrupted (tool call input missing). Use /new to start a fresh session. If this keeps happening, reset the session or delete the corrupted session transcript.";
	const invalidRequest = raw.match(/"type":"invalid_request_error".*?"message":"([^"]+)"/);
	if (invalidRequest?.[1]) return `LLM request rejected: ${invalidRequest[1]}`;
	const transientCopy = formatRateLimitOrOverloadedErrorCopy(raw);
	if (transientCopy) return transientCopy;
	const transportCopy = formatTransportErrorCopy(raw);
	if (transportCopy) return transportCopy;
	if (isTimeoutErrorMessage(raw)) return "LLM request timed out.";
	if (isBillingErrorMessage(raw)) return formatBillingErrorMessage(opts?.provider, opts?.model ?? msg.model);
	if (isLikelyHttpErrorText(raw) || isRawApiErrorPayload(raw)) return formatRawAssistantErrorForUi(raw);
	if (raw.length > 600) log.warn(`Long error truncated: ${raw.slice(0, 200)}`);
	return raw.length > 600 ? `${raw.slice(0, 600)}…` : raw;
}
function sanitizeUserFacingText(text, opts) {
	if (!text) return text;
	const errorContext = opts?.errorContext ?? false;
	const stripped = stripFinalTagsFromText(text);
	const trimmed = stripped.trim();
	if (!trimmed) return "";
	if (!errorContext && shouldRewriteRawPayloadWithoutErrorContext(trimmed)) return formatRawAssistantErrorForUi(trimmed);
	if (errorContext) {
		if (/incorrect role information|roles must alternate/i.test(trimmed)) return "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
		if (shouldRewriteContextOverflowText(trimmed)) return "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model.";
		if (isBillingErrorMessage(trimmed)) return BILLING_ERROR_USER_MESSAGE;
		if (isRawApiErrorPayload(trimmed) || isLikelyHttpErrorText(trimmed)) return formatRawAssistantErrorForUi(trimmed);
		if (ERROR_PREFIX_RE.test(trimmed)) {
			const prefixedCopy = formatRateLimitOrOverloadedErrorCopy(trimmed);
			if (prefixedCopy) return prefixedCopy;
			const transportCopy = formatTransportErrorCopy(trimmed);
			if (transportCopy) return transportCopy;
			if (isTimeoutErrorMessage(trimmed)) return "LLM request timed out.";
			return formatRawAssistantErrorForUi(trimmed);
		}
	}
	return collapseConsecutiveDuplicateBlocks(stripped.replace(/^(?:[ \t]*\r?\n)+/, ""));
}
function isRateLimitAssistantError(msg) {
	if (!msg || msg.stopReason !== "error") return false;
	return isRateLimitErrorMessage(msg.errorMessage ?? "");
}
const TOOL_CALL_INPUT_MISSING_RE = /tool_(?:use|call)\.(?:input|arguments).*?(?:field required|required)/i;
const TOOL_CALL_INPUT_PATH_RE = /messages\.\d+\.content\.\d+\.tool_(?:use|call)\.(?:input|arguments)/i;
const IMAGE_DIMENSION_ERROR_RE = /image dimensions exceed max allowed size for many-image requests:\s*(\d+)\s*pixels/i;
const IMAGE_DIMENSION_PATH_RE = /messages\.(\d+)\.content\.(\d+)\.image/i;
const IMAGE_SIZE_ERROR_RE = /image exceeds\s*(\d+(?:\.\d+)?)\s*mb/i;
function isMissingToolCallInputError(raw) {
	if (!raw) return false;
	return TOOL_CALL_INPUT_MISSING_RE.test(raw) || TOOL_CALL_INPUT_PATH_RE.test(raw);
}
function isBillingAssistantError(msg) {
	if (!msg || msg.stopReason !== "error") return false;
	return isBillingErrorMessage(msg.errorMessage ?? "");
}
const API_ERROR_TRANSIENT_SIGNALS_RE = /internal server error|overload|temporarily unavailable|service unavailable|unknown error|server error|bad gateway|gateway timeout|upstream error|backend error|try again later|temporarily.+unable/i;
function isJsonApiInternalServerError(raw) {
	if (!raw) return false;
	if (!raw.toLowerCase().includes("\"type\":\"api_error\"")) return false;
	if (isBillingErrorMessage(raw) || isAuthErrorMessage(raw) || isAuthPermanentErrorMessage(raw)) return false;
	return API_ERROR_TRANSIENT_SIGNALS_RE.test(raw);
}
function parseImageDimensionError(raw) {
	if (!raw) return null;
	if (!raw.toLowerCase().includes("image dimensions exceed max allowed size")) return null;
	const limitMatch = raw.match(IMAGE_DIMENSION_ERROR_RE);
	const pathMatch = raw.match(IMAGE_DIMENSION_PATH_RE);
	return {
		maxDimensionPx: limitMatch?.[1] ? Number.parseInt(limitMatch[1], 10) : void 0,
		messageIndex: pathMatch?.[1] ? Number.parseInt(pathMatch[1], 10) : void 0,
		contentIndex: pathMatch?.[2] ? Number.parseInt(pathMatch[2], 10) : void 0,
		raw
	};
}
function isImageDimensionErrorMessage(raw) {
	return Boolean(parseImageDimensionError(raw));
}
function parseImageSizeError(raw) {
	if (!raw) return null;
	const lower = raw.toLowerCase();
	if (!lower.includes("image exceeds") || !lower.includes("mb")) return null;
	const match = raw.match(IMAGE_SIZE_ERROR_RE);
	return {
		maxMb: match?.[1] ? Number.parseFloat(match[1]) : void 0,
		raw
	};
}
function isImageSizeError(errorMessage) {
	if (!errorMessage) return false;
	return Boolean(parseImageSizeError(errorMessage));
}
function isCloudCodeAssistFormatError(raw) {
	return !isImageDimensionErrorMessage(raw) && matchesFormatErrorPattern(raw);
}
function isAuthAssistantError(msg) {
	if (!msg || msg.stopReason !== "error") return false;
	return isAuthErrorMessage(msg.errorMessage ?? "");
}
function isModelNotFoundErrorMessage(raw) {
	if (!raw) return false;
	const lower = raw.toLowerCase();
	if (lower.includes("unknown model") || lower.includes("model not found") || lower.includes("model_not_found") || lower.includes("not_found_error") || lower.includes("does not exist") && lower.includes("model") || lower.includes("invalid model") && !lower.includes("invalid model reference")) return true;
	if (/models\/[^\s]+ is not found/i.test(raw)) return true;
	if (/\b404\b/.test(raw) && /not[-_ ]?found/i.test(raw)) return true;
	return false;
}
function isCliSessionExpiredErrorMessage(raw) {
	if (!raw) return false;
	const lower = raw.toLowerCase();
	return lower.includes("session not found") || lower.includes("session does not exist") || lower.includes("session expired") || lower.includes("session invalid") || lower.includes("conversation not found") || lower.includes("conversation does not exist") || lower.includes("conversation expired") || lower.includes("conversation invalid") || lower.includes("no such session") || lower.includes("invalid session") || lower.includes("session id not found") || lower.includes("conversation id not found");
}
function classifyFailoverReason(raw) {
	if (isImageDimensionErrorMessage(raw)) return null;
	if (isImageSizeError(raw)) return null;
	if (isCliSessionExpiredErrorMessage(raw)) return "session_expired";
	if (isModelNotFoundErrorMessage(raw)) return "model_not_found";
	const trimmed = raw.trim();
	const leadingStatus = extractLeadingHttpStatus(trimmed);
	if (leadingStatus?.code === 410) return classifyFailoverReasonFromHttpStatus(leadingStatus.code, leadingStatus.rest);
	const reasonFrom402Text = classifyFailoverReasonFrom402Text(raw);
	if (reasonFrom402Text) return reasonFrom402Text;
	if (isPeriodicUsageLimitErrorMessage(raw)) return isBillingErrorMessage(raw) ? "billing" : "rate_limit";
	if (isRateLimitErrorMessage(raw)) return "rate_limit";
	if (isOverloadedErrorMessage(raw)) return "overloaded";
	if (isTransientHttpError(raw)) {
		if (extractLeadingHttpStatus(trimmed)?.code === 529) return "overloaded";
		return "timeout";
	}
	if (isBillingErrorMessage(raw)) return "billing";
	if (isAuthPermanentErrorMessage(raw)) return "auth_permanent";
	if (isAuthErrorMessage(raw)) return "auth";
	if (isServerErrorMessage(raw)) return "timeout";
	if (isJsonApiInternalServerError(raw)) return "timeout";
	if (isCloudCodeAssistFormatError(raw)) return "format";
	if (isTimeoutErrorMessage(raw)) return "timeout";
	return null;
}
function isFailoverErrorMessage(raw) {
	return classifyFailoverReason(raw) !== null;
}
function isFailoverAssistantError(msg) {
	if (!msg || msg.stopReason !== "error") return false;
	return isFailoverErrorMessage(msg.errorMessage ?? "");
}
//#endregion
//#region src/agents/pi-embedded-helpers/google.ts
function isGoogleModelApi(api) {
	return api === "google-gemini-cli" || api === "google-generative-ai";
}
//#endregion
//#region src/agents/pi-embedded-helpers/openai.ts
function parseOpenAIReasoningSignature(value) {
	if (!value) return null;
	let candidate = null;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
		try {
			candidate = JSON.parse(trimmed);
		} catch {
			return null;
		}
	} else if (typeof value === "object") candidate = value;
	if (!candidate) return null;
	const id = typeof candidate.id === "string" ? candidate.id : "";
	const type = typeof candidate.type === "string" ? candidate.type : "";
	if (!id.startsWith("rs_")) return null;
	if (type === "reasoning" || type.startsWith("reasoning.")) return {
		id,
		type
	};
	return null;
}
function hasFollowingNonThinkingBlock(content, index) {
	for (let i = index + 1; i < content.length; i++) {
		const block = content[i];
		if (!block || typeof block !== "object") return true;
		if (block.type !== "thinking") return true;
	}
	return false;
}
function splitOpenAIFunctionCallPairing(id) {
	const separator = id.indexOf("|");
	if (separator <= 0 || separator >= id.length - 1) return { callId: id };
	return {
		callId: id.slice(0, separator),
		itemId: id.slice(separator + 1)
	};
}
function isOpenAIToolCallType(type) {
	return type === "toolCall" || type === "toolUse" || type === "functionCall";
}
/**
* OpenAI can reject replayed `function_call` items with an `fc_*` id if the
* matching `reasoning` item is absent in the same assistant turn.
*
* When that pairing is missing, strip the `|fc_*` suffix from tool call ids so
* pi-ai omits `function_call.id` on replay.
*/
function downgradeOpenAIFunctionCallReasoningPairs(messages) {
	let changed = false;
	const rewrittenMessages = [];
	let pendingRewrittenIds = null;
	for (const msg of messages) {
		if (!msg || typeof msg !== "object") {
			pendingRewrittenIds = null;
			rewrittenMessages.push(msg);
			continue;
		}
		const role = msg.role;
		if (role === "assistant") {
			const assistantMsg = msg;
			if (!Array.isArray(assistantMsg.content)) {
				pendingRewrittenIds = null;
				rewrittenMessages.push(msg);
				continue;
			}
			const localRewrittenIds = /* @__PURE__ */ new Map();
			let seenReplayableReasoning = false;
			let assistantChanged = false;
			const nextContent = assistantMsg.content.map((block) => {
				if (!block || typeof block !== "object") return block;
				const thinkingBlock = block;
				if (thinkingBlock.type === "thinking" && parseOpenAIReasoningSignature(thinkingBlock.thinkingSignature)) {
					seenReplayableReasoning = true;
					return block;
				}
				const toolCallBlock = block;
				if (!isOpenAIToolCallType(toolCallBlock.type) || typeof toolCallBlock.id !== "string") return block;
				const pairing = splitOpenAIFunctionCallPairing(toolCallBlock.id);
				if (seenReplayableReasoning || !pairing.itemId || !pairing.itemId.startsWith("fc_")) return block;
				assistantChanged = true;
				localRewrittenIds.set(toolCallBlock.id, pairing.callId);
				return {
					...block,
					id: pairing.callId
				};
			});
			pendingRewrittenIds = localRewrittenIds.size > 0 ? localRewrittenIds : null;
			if (!assistantChanged) {
				rewrittenMessages.push(msg);
				continue;
			}
			changed = true;
			rewrittenMessages.push({
				...assistantMsg,
				content: nextContent
			});
			continue;
		}
		if (role === "toolResult" && pendingRewrittenIds && pendingRewrittenIds.size > 0) {
			const toolResult = msg;
			let toolResultChanged = false;
			const updates = {};
			if (typeof toolResult.toolCallId === "string") {
				const nextToolCallId = pendingRewrittenIds.get(toolResult.toolCallId);
				if (nextToolCallId && nextToolCallId !== toolResult.toolCallId) {
					updates.toolCallId = nextToolCallId;
					toolResultChanged = true;
				}
			}
			if (typeof toolResult.toolUseId === "string") {
				const nextToolUseId = pendingRewrittenIds.get(toolResult.toolUseId);
				if (nextToolUseId && nextToolUseId !== toolResult.toolUseId) {
					updates.toolUseId = nextToolUseId;
					toolResultChanged = true;
				}
			}
			if (!toolResultChanged) {
				rewrittenMessages.push(msg);
				continue;
			}
			changed = true;
			rewrittenMessages.push({
				...toolResult,
				...updates
			});
			continue;
		}
		pendingRewrittenIds = null;
		rewrittenMessages.push(msg);
	}
	return changed ? rewrittenMessages : messages;
}
/**
* OpenAI Responses API can reject transcripts that contain a standalone `reasoning` item id
* without the required following item.
*
* OpenClaw persists provider-specific reasoning metadata in `thinkingSignature`; if that metadata
* is incomplete, drop the block to keep history usable.
*/
function downgradeOpenAIReasoningBlocks(messages) {
	const out = [];
	for (const msg of messages) {
		if (!msg || typeof msg !== "object") {
			out.push(msg);
			continue;
		}
		if (msg.role !== "assistant") {
			out.push(msg);
			continue;
		}
		const assistantMsg = msg;
		if (!Array.isArray(assistantMsg.content)) {
			out.push(msg);
			continue;
		}
		let changed = false;
		const nextContent = [];
		for (let i = 0; i < assistantMsg.content.length; i++) {
			const block = assistantMsg.content[i];
			if (!block || typeof block !== "object") {
				nextContent.push(block);
				continue;
			}
			const record = block;
			if (record.type !== "thinking") {
				nextContent.push(block);
				continue;
			}
			if (!parseOpenAIReasoningSignature(record.thinkingSignature)) {
				nextContent.push(block);
				continue;
			}
			if (hasFollowingNonThinkingBlock(assistantMsg.content, i)) {
				nextContent.push(block);
				continue;
			}
			changed = true;
		}
		if (!changed) {
			out.push(msg);
			continue;
		}
		if (nextContent.length === 0) continue;
		out.push({
			...assistantMsg,
			content: nextContent
		});
	}
	return out;
}
//#endregion
//#region src/agents/tool-call-id.ts
const STRICT9_LEN = 9;
const TOOL_CALL_TYPES = new Set([
	"toolCall",
	"toolUse",
	"functionCall"
]);
/**
* Sanitize a tool call ID to be compatible with various providers.
*
* - "strict" mode: only [a-zA-Z0-9]
* - "strict9" mode: only [a-zA-Z0-9], length 9 (Mistral tool call requirement)
*/
function sanitizeToolCallId(id, mode = "strict") {
	if (!id || typeof id !== "string") {
		if (mode === "strict9") return "defaultid";
		return "defaulttoolid";
	}
	if (mode === "strict9") {
		const alphanumericOnly = id.replace(/[^a-zA-Z0-9]/g, "");
		if (alphanumericOnly.length >= STRICT9_LEN) return alphanumericOnly.slice(0, STRICT9_LEN);
		if (alphanumericOnly.length > 0) return shortHash(alphanumericOnly, STRICT9_LEN);
		return shortHash("sanitized", STRICT9_LEN);
	}
	const alphanumericOnly = id.replace(/[^a-zA-Z0-9]/g, "");
	return alphanumericOnly.length > 0 ? alphanumericOnly : "sanitizedtoolid";
}
function extractToolCallsFromAssistant(msg) {
	const content = msg.content;
	if (!Array.isArray(content)) return [];
	const toolCalls = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const rec = block;
		if (typeof rec.id !== "string" || !rec.id) continue;
		if (typeof rec.type === "string" && TOOL_CALL_TYPES.has(rec.type)) toolCalls.push({
			id: rec.id,
			name: typeof rec.name === "string" ? rec.name : void 0
		});
	}
	return toolCalls;
}
function extractToolResultId(msg) {
	const toolCallId = msg.toolCallId;
	if (typeof toolCallId === "string" && toolCallId) return toolCallId;
	const toolUseId = msg.toolUseId;
	if (typeof toolUseId === "string" && toolUseId) return toolUseId;
	return null;
}
function shortHash(text, length = 8) {
	return createHash("sha256").update(text).digest("hex").slice(0, length);
}
function makeUniqueToolId(params) {
	if (params.mode === "strict9") {
		const base = sanitizeToolCallId(params.id, params.mode);
		const candidate = base.length >= STRICT9_LEN ? base.slice(0, STRICT9_LEN) : "";
		if (candidate && !params.used.has(candidate)) return candidate;
		for (let i = 0; i < 1e3; i += 1) {
			const hashed = shortHash(`${params.id}:${i}`, STRICT9_LEN);
			if (!params.used.has(hashed)) return hashed;
		}
		return shortHash(`${params.id}:${Date.now()}`, STRICT9_LEN);
	}
	const MAX_LEN = 40;
	const base = sanitizeToolCallId(params.id, params.mode).slice(0, MAX_LEN);
	if (!params.used.has(base)) return base;
	const hash = shortHash(params.id);
	const separator = params.mode === "strict" ? "" : "_";
	const maxBaseLen = MAX_LEN - separator.length - hash.length;
	const candidate = `${base.length > maxBaseLen ? base.slice(0, maxBaseLen) : base}${separator}${hash}`;
	if (!params.used.has(candidate)) return candidate;
	for (let i = 2; i < 1e3; i += 1) {
		const suffix = params.mode === "strict" ? `x${i}` : `_${i}`;
		const next = `${candidate.slice(0, MAX_LEN - suffix.length)}${suffix}`;
		if (!params.used.has(next)) return next;
	}
	const ts = params.mode === "strict" ? `t${Date.now()}` : `_${Date.now()}`;
	return `${candidate.slice(0, MAX_LEN - ts.length)}${ts}`;
}
function createOccurrenceAwareResolver(mode) {
	const used = /* @__PURE__ */ new Set();
	const assistantOccurrences = /* @__PURE__ */ new Map();
	const orphanToolResultOccurrences = /* @__PURE__ */ new Map();
	const pendingByRawId = /* @__PURE__ */ new Map();
	const allocate = (seed) => {
		const next = makeUniqueToolId({
			id: seed,
			used,
			mode
		});
		used.add(next);
		return next;
	};
	const resolveAssistantId = (id) => {
		const occurrence = (assistantOccurrences.get(id) ?? 0) + 1;
		assistantOccurrences.set(id, occurrence);
		const next = allocate(occurrence === 1 ? id : `${id}:${occurrence}`);
		const pending = pendingByRawId.get(id);
		if (pending) pending.push(next);
		else pendingByRawId.set(id, [next]);
		return next;
	};
	const resolveToolResultId = (id) => {
		const pending = pendingByRawId.get(id);
		if (pending && pending.length > 0) {
			const next = pending.shift();
			if (pending.length === 0) pendingByRawId.delete(id);
			return next;
		}
		const occurrence = (orphanToolResultOccurrences.get(id) ?? 0) + 1;
		orphanToolResultOccurrences.set(id, occurrence);
		return allocate(`${id}:tool_result:${occurrence}`);
	};
	return {
		resolveAssistantId,
		resolveToolResultId
	};
}
function rewriteAssistantToolCallIds(params) {
	const content = params.message.content;
	if (!Array.isArray(content)) return params.message;
	let changed = false;
	const next = content.map((block) => {
		if (!block || typeof block !== "object") return block;
		const rec = block;
		const type = rec.type;
		const id = rec.id;
		if (type !== "functionCall" && type !== "toolUse" && type !== "toolCall" || typeof id !== "string" || !id) return block;
		const nextId = params.resolveId(id);
		if (nextId === id) return block;
		changed = true;
		return {
			...block,
			id: nextId
		};
	});
	if (!changed) return params.message;
	return {
		...params.message,
		content: next
	};
}
function rewriteToolResultIds(params) {
	const toolCallId = typeof params.message.toolCallId === "string" && params.message.toolCallId ? params.message.toolCallId : void 0;
	const toolUseId = params.message.toolUseId;
	const toolUseIdStr = typeof toolUseId === "string" && toolUseId ? toolUseId : void 0;
	const sharedRawId = toolCallId && toolUseIdStr && toolCallId === toolUseIdStr ? toolCallId : void 0;
	const sharedResolvedId = sharedRawId ? params.resolveId(sharedRawId) : void 0;
	const nextToolCallId = sharedResolvedId ?? (toolCallId ? params.resolveId(toolCallId) : void 0);
	const nextToolUseId = sharedResolvedId ?? (toolUseIdStr ? params.resolveId(toolUseIdStr) : void 0);
	if (nextToolCallId === toolCallId && nextToolUseId === toolUseIdStr) return params.message;
	return {
		...params.message,
		...nextToolCallId && { toolCallId: nextToolCallId },
		...nextToolUseId && { toolUseId: nextToolUseId }
	};
}
/**
* Sanitize tool call IDs for provider compatibility.
*
* @param messages - The messages to sanitize
* @param mode - "strict" (alphanumeric only) or "strict9" (alphanumeric length 9)
*/
function sanitizeToolCallIdsForCloudCodeAssist(messages, mode = "strict") {
	const { resolveAssistantId, resolveToolResultId } = createOccurrenceAwareResolver(mode);
	let changed = false;
	const out = messages.map((msg) => {
		if (!msg || typeof msg !== "object") return msg;
		const role = msg.role;
		if (role === "assistant") {
			const next = rewriteAssistantToolCallIds({
				message: msg,
				resolveId: resolveAssistantId
			});
			if (next !== msg) changed = true;
			return next;
		}
		if (role === "toolResult") {
			const next = rewriteToolResultIds({
				message: msg,
				resolveId: resolveToolResultId
			});
			if (next !== msg) changed = true;
			return next;
		}
		return msg;
	});
	return changed ? out : messages;
}
//#endregion
//#region src/agents/pi-embedded-helpers/images.ts
function isThinkingOrRedactedBlock(block) {
	if (!block || typeof block !== "object") return false;
	const rec = block;
	return rec.type === "thinking" || rec.type === "redacted_thinking";
}
async function sanitizeSessionMessagesImages(messages, label, options) {
	const allowNonImageSanitization = (options?.sanitizeMode ?? "full") === "full";
	const imageSanitization = {
		maxDimensionPx: options?.maxDimensionPx,
		maxBytes: options?.maxBytes
	};
	const sanitizedIds = options?.sanitizeToolCallIds === true ? sanitizeToolCallIdsForCloudCodeAssist(messages, options.toolCallIdMode) : messages;
	const out = [];
	for (const msg of sanitizedIds) {
		if (!msg || typeof msg !== "object") {
			out.push(msg);
			continue;
		}
		const role = msg.role;
		if (role === "toolResult") {
			const toolMsg = msg;
			const nextContent = await sanitizeContentBlocksImages(Array.isArray(toolMsg.content) ? toolMsg.content : [], label, imageSanitization);
			out.push({
				...toolMsg,
				content: nextContent
			});
			continue;
		}
		if (role === "user") {
			const userMsg = msg;
			const content = userMsg.content;
			if (Array.isArray(content)) {
				const nextContent = await sanitizeContentBlocksImages(content, label, imageSanitization);
				out.push({
					...userMsg,
					content: nextContent
				});
				continue;
			}
		}
		if (role === "assistant") {
			const assistantMsg = msg;
			if (assistantMsg.stopReason === "error") {
				const content = assistantMsg.content;
				if (Array.isArray(content)) {
					const nextContent = await sanitizeContentBlocksImages(content, label, imageSanitization);
					out.push({
						...assistantMsg,
						content: nextContent
					});
				} else out.push(assistantMsg);
				continue;
			}
			const content = assistantMsg.content;
			if (Array.isArray(content)) {
				if (!allowNonImageSanitization) {
					const nextContent = await sanitizeContentBlocksImages(content, label, imageSanitization);
					out.push({
						...assistantMsg,
						content: nextContent
					});
					continue;
				}
				const strippedContent = options?.preserveSignatures ? content : stripThoughtSignatures(content, options?.sanitizeThoughtSignatures);
				const finalContent = await sanitizeContentBlocksImages(options?.preserveSignatures && strippedContent.some((block) => isThinkingOrRedactedBlock(block)) ? strippedContent : strippedContent.filter((block) => {
					if (!block || typeof block !== "object") return true;
					const rec = block;
					if (rec.type !== "text" || typeof rec.text !== "string") return true;
					return rec.text.trim().length > 0;
				}), label, imageSanitization);
				if (finalContent.length === 0) continue;
				out.push({
					...assistantMsg,
					content: finalContent
				});
				continue;
			}
		}
		out.push(msg);
	}
	return out;
}
//#endregion
//#region src/agents/pi-embedded-helpers/messaging-dedupe.ts
const MIN_DUPLICATE_TEXT_LENGTH = 10;
/**
* Normalize text for duplicate comparison.
* - Trims whitespace
* - Lowercases
* - Strips emoji (Emoji_Presentation and Extended_Pictographic)
* - Collapses multiple spaces to single space
*/
function normalizeTextForComparison(text) {
	return text.trim().toLowerCase().replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, "").replace(/\s+/g, " ").trim();
}
function isMessagingToolDuplicateNormalized(normalized, normalizedSentTexts) {
	if (normalizedSentTexts.length === 0) return false;
	if (!normalized || normalized.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
	return normalizedSentTexts.some((normalizedSent) => {
		if (!normalizedSent || normalizedSent.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
		return normalized.includes(normalizedSent) || normalizedSent.includes(normalized);
	});
}
function isMessagingToolDuplicate(text, sentTexts) {
	if (sentTexts.length === 0) return false;
	const normalized = normalizeTextForComparison(text);
	if (!normalized || normalized.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
	return isMessagingToolDuplicateNormalized(normalized, sentTexts.map(normalizeTextForComparison));
}
//#endregion
//#region src/agents/pi-embedded-helpers/thinking.ts
function extractSupportedValues(raw) {
	const match = raw.match(/supported values are:\s*([^\n.]+)/i) ?? raw.match(/supported values:\s*([^\n.]+)/i);
	if (!match?.[1]) return [];
	const fragment = match[1];
	const quoted = Array.from(fragment.matchAll(/['"]([^'"]+)['"]/g)).map((entry) => entry[1]?.trim());
	if (quoted.length > 0) return quoted.filter((entry) => Boolean(entry));
	return fragment.split(/,|\band\b/gi).map((entry) => entry.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "").trim()).filter(Boolean);
}
function pickFallbackThinkingLevel(params) {
	const raw = params.message?.trim();
	if (!raw) return;
	const supported = extractSupportedValues(raw);
	if (supported.length === 0) {
		if (/not supported/i.test(raw) && !params.attempted.has("off")) return "off";
		return;
	}
	for (const entry of supported) {
		const normalized = normalizeThinkLevel(entry);
		if (!normalized) continue;
		if (params.attempted.has(normalized)) continue;
		return normalized;
	}
}
//#endregion
//#region src/agents/pi-embedded-helpers/turns.ts
/**
* Strips dangling tool_use blocks from assistant messages when the immediately
* following user message does not contain a matching tool_result block.
* This fixes the "tool_use ids found without tool_result blocks" error from Anthropic.
*/
function stripDanglingAnthropicToolUses(messages) {
	const result = [];
	for (let i = 0; i < messages.length; i++) {
		const msg = messages[i];
		if (!msg || typeof msg !== "object") {
			result.push(msg);
			continue;
		}
		if (msg.role !== "assistant") {
			result.push(msg);
			continue;
		}
		const assistantMsg = msg;
		const nextMsg = messages[i + 1];
		if ((nextMsg && typeof nextMsg === "object" ? nextMsg.role : void 0) !== "user") {
			result.push(msg);
			continue;
		}
		const nextUserMsg = nextMsg;
		const validToolUseIds = /* @__PURE__ */ new Set();
		if (Array.isArray(nextUserMsg.content)) {
			for (const block of nextUserMsg.content) if (block && block.type === "toolResult" && block.toolUseId) validToolUseIds.add(block.toolUseId);
		}
		const originalContent = Array.isArray(assistantMsg.content) ? assistantMsg.content : [];
		const filteredContent = originalContent.filter((block) => {
			if (!block) return false;
			if (block.type !== "toolUse") return true;
			return validToolUseIds.has(block.id || "");
		});
		if (originalContent.length > 0 && filteredContent.length === 0) result.push({
			...assistantMsg,
			content: [{
				type: "text",
				text: "[tool calls omitted]"
			}]
		});
		else result.push({
			...assistantMsg,
			content: filteredContent
		});
	}
	return result;
}
function validateTurnsWithConsecutiveMerge(params) {
	const { messages, role, merge } = params;
	if (!Array.isArray(messages) || messages.length === 0) return messages;
	const result = [];
	let lastRole;
	for (const msg of messages) {
		if (!msg || typeof msg !== "object") {
			result.push(msg);
			continue;
		}
		const msgRole = msg.role;
		if (!msgRole) {
			result.push(msg);
			continue;
		}
		if (msgRole === lastRole && lastRole === role) {
			const lastMsg = result[result.length - 1];
			const currentMsg = msg;
			if (lastMsg && typeof lastMsg === "object") {
				const lastTyped = lastMsg;
				result[result.length - 1] = merge(lastTyped, currentMsg);
				continue;
			}
		}
		result.push(msg);
		lastRole = msgRole;
	}
	return result;
}
function mergeConsecutiveAssistantTurns(previous, current) {
	const mergedContent = [...Array.isArray(previous.content) ? previous.content : [], ...Array.isArray(current.content) ? current.content : []];
	return {
		...previous,
		content: mergedContent,
		...current.usage && { usage: current.usage },
		...current.stopReason && { stopReason: current.stopReason },
		...current.errorMessage && { errorMessage: current.errorMessage }
	};
}
/**
* Validates and fixes conversation turn sequences for Gemini API.
* Gemini requires strict alternating user→assistant→tool→user pattern.
* Merges consecutive assistant messages together.
*/
function validateGeminiTurns(messages) {
	return validateTurnsWithConsecutiveMerge({
		messages,
		role: "assistant",
		merge: mergeConsecutiveAssistantTurns
	});
}
function mergeConsecutiveUserTurns(previous, current) {
	const mergedContent = [...Array.isArray(previous.content) ? previous.content : [], ...Array.isArray(current.content) ? current.content : []];
	return {
		...current,
		content: mergedContent,
		timestamp: current.timestamp ?? previous.timestamp
	};
}
/**
* Validates and fixes conversation turn sequences for Anthropic API.
* Anthropic requires strict alternating user→assistant pattern.
* Merges consecutive user messages together.
* Also strips dangling tool_use blocks that lack corresponding tool_result blocks.
*/
function validateAnthropicTurns(messages) {
	return validateTurnsWithConsecutiveMerge({
		messages: stripDanglingAnthropicToolUses(messages),
		role: "user",
		merge: mergeConsecutiveUserTurns
	});
}
//#endregion
//#region src/infra/outbound/target-normalization.ts
function normalizeChannelTargetInput(raw) {
	return raw.trim();
}
const targetNormalizerCacheByChannelId = /* @__PURE__ */ new Map();
function resolveTargetNormalizer(channelId) {
	const version = getActivePluginChannelRegistryVersion();
	const cached = targetNormalizerCacheByChannelId.get(channelId);
	if (cached?.version === version) return cached.normalizer;
	const normalizer = getChannelPlugin(channelId)?.messaging?.normalizeTarget;
	targetNormalizerCacheByChannelId.set(channelId, {
		version,
		normalizer
	});
	return normalizer;
}
function normalizeTargetForProvider(provider, raw) {
	if (!raw) return;
	const fallback = raw.trim() || void 0;
	if (!fallback) return;
	const providerId = normalizeChannelId(provider);
	return ((providerId ? resolveTargetNormalizer(providerId) : void 0)?.(raw) ?? fallback) || void 0;
}
function buildTargetResolverSignature(channel) {
	const resolver = getChannelPlugin(channel)?.messaging?.targetResolver;
	const hint = resolver?.hint ?? "";
	const looksLike = resolver?.looksLikeId;
	return hashSignature(`${hint}|${looksLike ? looksLike.toString() : ""}`);
}
function hashSignature(value) {
	let hash = 5381;
	for (let i = 0; i < value.length; i += 1) hash = (hash << 5) + hash ^ value.charCodeAt(i);
	return (hash >>> 0).toString(36);
}
//#endregion
//#region src/channels/plugins/target-parsing.ts
function parseWithPlugin(rawChannel, rawTarget) {
	const channel = normalizeChatChannelId(rawChannel) ?? normalizeChannelId(rawChannel);
	if (!channel) return null;
	return getChannelPlugin(channel)?.messaging?.parseExplicitTarget?.({ raw: rawTarget }) ?? null;
}
function parseExplicitTargetForChannel(channel, rawTarget) {
	return parseWithPlugin(channel, rawTarget);
}
//#endregion
//#region src/auto-reply/reply/reply-payloads-dedupe.ts
function filterMessagingToolDuplicates(params) {
	const { payloads, sentTexts } = params;
	if (sentTexts.length === 0) return payloads;
	return payloads.filter((payload) => !isMessagingToolDuplicate(payload.text ?? "", sentTexts));
}
function filterMessagingToolMediaDuplicates(params) {
	const normalizeMediaForDedupe = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return "";
		if (!trimmed.toLowerCase().startsWith("file://")) return trimmed;
		try {
			const parsed = new URL(trimmed);
			if (parsed.protocol === "file:") return decodeURIComponent(parsed.pathname || "");
		} catch {}
		return trimmed.replace(/^file:\/\//i, "");
	};
	const { payloads, sentMediaUrls } = params;
	if (sentMediaUrls.length === 0) return payloads;
	const sentSet = new Set(sentMediaUrls.map(normalizeMediaForDedupe).filter(Boolean));
	return payloads.map((payload) => {
		const mediaUrl = payload.mediaUrl;
		const mediaUrls = payload.mediaUrls;
		const stripSingle = mediaUrl && sentSet.has(normalizeMediaForDedupe(mediaUrl));
		const filteredUrls = mediaUrls?.filter((u) => !sentSet.has(normalizeMediaForDedupe(u)));
		if (!stripSingle && (!mediaUrls || filteredUrls?.length === mediaUrls.length)) return payload;
		return {
			...payload,
			mediaUrl: stripSingle ? void 0 : mediaUrl,
			mediaUrls: filteredUrls?.length ? filteredUrls : void 0
		};
	});
}
const PROVIDER_ALIAS_MAP = { lark: "feishu" };
function normalizeProviderForComparison(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	const lowered = trimmed.toLowerCase();
	const normalizedChannel = normalizeChannelId(trimmed);
	if (normalizedChannel) return normalizedChannel;
	return PROVIDER_ALIAS_MAP[lowered] ?? lowered;
}
function normalizeThreadIdForComparison(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (/^-?\d+$/.test(trimmed)) return String(Number.parseInt(trimmed, 10));
	return trimmed.toLowerCase();
}
function resolveTargetProviderForComparison(params) {
	const targetProvider = normalizeProviderForComparison(params.targetProvider);
	if (!targetProvider || targetProvider === "message") return params.currentProvider;
	return targetProvider;
}
function targetsMatchForSuppression(params) {
	if (params.provider !== "telegram") return params.targetKey === params.originTarget;
	const origin = parseExplicitTargetForChannel("telegram", params.originTarget);
	const target = parseExplicitTargetForChannel("telegram", params.targetKey);
	if (!origin || !target) return params.targetKey === params.originTarget;
	const targetThreadId = normalizeThreadIdForComparison(params.targetThreadId) ?? (target.threadId != null ? String(target.threadId) : void 0);
	const originThreadId = origin.threadId != null ? String(origin.threadId) : void 0;
	if (origin.to.trim().toLowerCase() !== target.to.trim().toLowerCase()) return false;
	if (originThreadId && targetThreadId != null) return originThreadId === targetThreadId;
	if (originThreadId && targetThreadId == null) return false;
	if (!originThreadId && targetThreadId != null) return false;
	return true;
}
function shouldSuppressMessagingToolReplies(params) {
	const provider = normalizeProviderForComparison(params.messageProvider);
	if (!provider) return false;
	const originTarget = normalizeTargetForProvider(provider, params.originatingTo);
	if (!originTarget) return false;
	const originAccount = normalizeOptionalAccountId(params.accountId);
	const sentTargets = params.messagingToolSentTargets ?? [];
	if (sentTargets.length === 0) return false;
	return sentTargets.some((target) => {
		const targetProvider = resolveTargetProviderForComparison({
			currentProvider: provider,
			targetProvider: target?.provider
		});
		if (targetProvider !== provider) return false;
		const targetKey = normalizeTargetForProvider(targetProvider, target.to);
		if (!targetKey) return false;
		const targetAccount = normalizeOptionalAccountId(target.accountId);
		if (originAccount && targetAccount && originAccount !== targetAccount) return false;
		return targetsMatchForSuppression({
			provider,
			originTarget,
			targetKey,
			targetThreadId: target.threadId
		});
	});
}
//#endregion
export { resolveBootstrapTotalMaxChars as $, isCompactionFailureError as A, sanitizeUserFacingText as B, extractObservedOverflowTokenCount as C, isAuthAssistantError as D, getApiErrorPayloadFingerprint as E, isRateLimitAssistantError as F, stableStringify as G, isOverloadedErrorMessage as H, isRawApiErrorPayload as I, parseApiErrorInfo as J, resolveSandboxRuntimeStatus as K, isTransientHttpError as L, isFailoverAssistantError as M, isFailoverErrorMessage as N, isBillingAssistantError as O, isLikelyContextOverflowError as P, resolveBootstrapPromptTruncationWarningMode as Q, parseImageDimensionError as R, classifyFailoverReasonFromHttpStatus as S, formatBillingErrorMessage as T, isRateLimitErrorMessage as U, isBillingErrorMessage as V, isTimeoutErrorMessage as W, ensureSessionHeader as X, buildBootstrapContextFiles as Y, resolveBootstrapMaxChars as Z, downgradeOpenAIFunctionCallReasoningPairs as _, buildTargetResolverSignature as a, BILLING_ERROR_USER_MESSAGE as b, validateAnthropicTurns as c, isMessagingToolDuplicateNormalized as d, sanitizeGoogleTurnOrdering as et, normalizeTextForComparison as f, sanitizeToolCallIdsForCloudCodeAssist as g, extractToolResultId as h, parseExplicitTargetForChannel as i, isContextOverflowError as j, isCloudCodeAssistFormatError as k, validateGeminiTurns as l, extractToolCallsFromAssistant as m, filterMessagingToolMediaDuplicates as n, normalizeChannelTargetInput as o, sanitizeSessionMessagesImages as p, formatRawAssistantErrorForUi as q, shouldSuppressMessagingToolReplies as r, normalizeTargetForProvider as s, filterMessagingToolDuplicates as t, pickFallbackThinkingLevel as u, downgradeOpenAIReasoningBlocks as v, formatAssistantErrorText as w, classifyFailoverReason as x, isGoogleModelApi as y, parseImageSizeError as z };
