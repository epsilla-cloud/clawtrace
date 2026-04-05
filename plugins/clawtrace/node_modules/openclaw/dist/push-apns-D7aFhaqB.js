import { Ap as sniffMimeFromBase64 } from "./auth-profiles-B5ypC5S-.js";
import { _ as resolveStateDir } from "./paths-Y4UT24Of.js";
import { n as readJsonFile, r as writeJsonAtomic, t as createAsyncLock } from "./json-files-DMrq2IfK.js";
import { o as estimateBase64DecodedBytes } from "./tool-images-DfIo7v26.js";
import { a as signDevicePayload, n as loadOrCreateDeviceIdentity } from "./device-identity-DpW8x6WV.js";
import { URL } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, createPrivateKey, sign } from "node:crypto";
import http2 from "node:http2";
//#region src/gateway/chat-attachments.ts
function normalizeMime(mime) {
	if (!mime) return;
	return mime.split(";")[0]?.trim().toLowerCase() || void 0;
}
function isImageMime(mime) {
	return typeof mime === "string" && mime.startsWith("image/");
}
function isValidBase64(value) {
	return value.length > 0 && value.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}
function normalizeAttachment(att, idx, opts) {
	const mime = att.mimeType ?? "";
	const content = att.content;
	const label = att.fileName || att.type || `attachment-${idx + 1}`;
	if (typeof content !== "string") throw new Error(`attachment ${label}: content must be base64 string`);
	if (opts.requireImageMime && !mime.startsWith("image/")) throw new Error(`attachment ${label}: only image/* supported`);
	let base64 = content.trim();
	if (opts.stripDataUrlPrefix) {
		const dataUrlMatch = /^data:[^;]+;base64,(.*)$/.exec(base64);
		if (dataUrlMatch) base64 = dataUrlMatch[1];
	}
	return {
		label,
		mime,
		base64
	};
}
function validateAttachmentBase64OrThrow(normalized, opts) {
	if (!isValidBase64(normalized.base64)) throw new Error(`attachment ${normalized.label}: invalid base64 content`);
	const sizeBytes = estimateBase64DecodedBytes(normalized.base64);
	if (sizeBytes <= 0 || sizeBytes > opts.maxBytes) throw new Error(`attachment ${normalized.label}: exceeds size limit (${sizeBytes} > ${opts.maxBytes} bytes)`);
	return sizeBytes;
}
/**
* Parse attachments and extract images as structured content blocks.
* Returns the message text and an array of image content blocks
* compatible with Claude API's image format.
*/
async function parseMessageWithAttachments(message, attachments, opts) {
	const maxBytes = opts?.maxBytes ?? 5e6;
	const log = opts?.log;
	if (!attachments || attachments.length === 0) return {
		message,
		images: []
	};
	const images = [];
	for (const [idx, att] of attachments.entries()) {
		if (!att) continue;
		const normalized = normalizeAttachment(att, idx, {
			stripDataUrlPrefix: true,
			requireImageMime: false
		});
		validateAttachmentBase64OrThrow(normalized, { maxBytes });
		const { base64: b64, label, mime } = normalized;
		const providedMime = normalizeMime(mime);
		const sniffedMime = normalizeMime(await sniffMimeFromBase64(b64));
		if (sniffedMime && !isImageMime(sniffedMime)) {
			log?.warn(`attachment ${label}: detected non-image (${sniffedMime}), dropping`);
			continue;
		}
		if (!sniffedMime && !isImageMime(providedMime)) {
			log?.warn(`attachment ${label}: unable to detect image mime type, dropping`);
			continue;
		}
		if (sniffedMime && providedMime && sniffedMime !== providedMime) log?.warn(`attachment ${label}: mime mismatch (${providedMime} -> ${sniffedMime}), using sniffed`);
		images.push({
			type: "image",
			data: b64,
			mimeType: sniffedMime ?? providedMime ?? mime
		});
	}
	return {
		message,
		images
	};
}
//#endregion
//#region src/gateway/server-methods/attachment-normalize.ts
function normalizeAttachmentContent(content) {
	if (typeof content === "string") return content;
	if (ArrayBuffer.isView(content)) return Buffer.from(content.buffer, content.byteOffset, content.byteLength).toString("base64");
	if (content instanceof ArrayBuffer) return Buffer.from(content).toString("base64");
}
function normalizeRpcAttachmentsToChatAttachments(attachments) {
	return attachments?.map((a) => {
		const sourceRecord = a?.source && typeof a.source === "object" ? a.source : void 0;
		const sourceType = typeof sourceRecord?.type === "string" ? sourceRecord.type : void 0;
		const sourceMimeType = typeof sourceRecord?.media_type === "string" ? sourceRecord.media_type : void 0;
		const sourceContent = sourceType === "base64" ? normalizeAttachmentContent(sourceRecord?.data) : void 0;
		return {
			type: typeof a?.type === "string" ? a.type : void 0,
			mimeType: typeof a?.mimeType === "string" ? a.mimeType : sourceMimeType,
			fileName: typeof a?.fileName === "string" ? a.fileName : void 0,
			content: normalizeAttachmentContent(a?.content) ?? sourceContent
		};
	}).filter((a) => a.content) ?? [];
}
//#endregion
//#region src/infra/push-apns.relay.ts
const DEFAULT_APNS_RELAY_TIMEOUT_MS = 1e4;
const GATEWAY_DEVICE_ID_HEADER = "x-openclaw-gateway-device-id";
const GATEWAY_SIGNATURE_HEADER = "x-openclaw-gateway-signature";
const GATEWAY_SIGNED_AT_HEADER = "x-openclaw-gateway-signed-at-ms";
function normalizeNonEmptyString$1(value) {
	const trimmed = value?.trim() ?? "";
	return trimmed.length > 0 ? trimmed : null;
}
function normalizeTimeoutMs(value) {
	const raw = typeof value === "number" ? value : typeof value === "string" ? value.trim() : void 0;
	if (raw === void 0 || raw === "") return DEFAULT_APNS_RELAY_TIMEOUT_MS;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) return DEFAULT_APNS_RELAY_TIMEOUT_MS;
	return Math.max(1e3, Math.trunc(parsed));
}
function readAllowHttp(value) {
	const normalized = value?.trim().toLowerCase();
	return normalized === "1" || normalized === "true" || normalized === "yes";
}
function isLoopbackRelayHostname(hostname) {
	const normalized = hostname.trim().toLowerCase();
	return normalized === "localhost" || normalized === "::1" || normalized === "[::1]" || /^127(?:\.\d{1,3}){3}$/.test(normalized);
}
function parseReason$1(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function buildRelayGatewaySignaturePayload(params) {
	return [
		"openclaw-relay-send-v1",
		params.gatewayDeviceId.trim(),
		String(Math.trunc(params.signedAtMs)),
		params.bodyJson
	].join("\n");
}
function resolveApnsRelayConfigFromEnv(env = process.env, gatewayConfig) {
	const configuredRelay = gatewayConfig?.push?.apns?.relay;
	const envBaseUrl = normalizeNonEmptyString$1(env.OPENCLAW_APNS_RELAY_BASE_URL);
	const configBaseUrl = normalizeNonEmptyString$1(configuredRelay?.baseUrl);
	const baseUrl = envBaseUrl ?? configBaseUrl;
	const baseUrlSource = envBaseUrl ? "OPENCLAW_APNS_RELAY_BASE_URL" : "gateway.push.apns.relay.baseUrl";
	if (!baseUrl) return {
		ok: false,
		error: "APNs relay config missing: set gateway.push.apns.relay.baseUrl or OPENCLAW_APNS_RELAY_BASE_URL"
	};
	try {
		const parsed = new URL(baseUrl);
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("unsupported protocol");
		if (!parsed.hostname) throw new Error("host required");
		if (parsed.protocol === "http:" && !readAllowHttp(env.OPENCLAW_APNS_RELAY_ALLOW_HTTP)) throw new Error("http relay URLs require OPENCLAW_APNS_RELAY_ALLOW_HTTP=true (development only)");
		if (parsed.protocol === "http:" && !isLoopbackRelayHostname(parsed.hostname)) throw new Error("http relay URLs are limited to loopback hosts");
		if (parsed.username || parsed.password) throw new Error("userinfo is not allowed");
		if (parsed.search || parsed.hash) throw new Error("query and fragment are not allowed");
		return {
			ok: true,
			value: {
				baseUrl: parsed.toString().replace(/\/+$/, ""),
				timeoutMs: normalizeTimeoutMs(env.OPENCLAW_APNS_RELAY_TIMEOUT_MS ?? configuredRelay?.timeoutMs)
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: `invalid ${baseUrlSource} (${baseUrl}): ${err instanceof Error ? err.message : String(err)}`
		};
	}
}
async function sendApnsRelayRequest(params) {
	const response = await fetch(`${params.relayConfig.baseUrl}/v1/push/send`, {
		method: "POST",
		redirect: "manual",
		headers: {
			authorization: `Bearer ${params.sendGrant}`,
			"content-type": "application/json",
			[GATEWAY_DEVICE_ID_HEADER]: params.gatewayDeviceId,
			[GATEWAY_SIGNATURE_HEADER]: params.signature,
			[GATEWAY_SIGNED_AT_HEADER]: String(params.signedAtMs)
		},
		body: params.bodyJson,
		signal: AbortSignal.timeout(params.relayConfig.timeoutMs)
	});
	if (response.status >= 300 && response.status < 400) return {
		ok: false,
		status: response.status,
		reason: "RelayRedirectNotAllowed",
		environment: "production"
	};
	let json = null;
	try {
		json = await response.json();
	} catch {
		json = null;
	}
	const body = json && typeof json === "object" && !Array.isArray(json) ? json : {};
	const status = typeof body.status === "number" && Number.isFinite(body.status) ? Math.trunc(body.status) : response.status;
	return {
		ok: typeof body.ok === "boolean" ? body.ok : response.ok && status >= 200 && status < 300,
		status,
		apnsId: parseReason$1(body.apnsId),
		reason: parseReason$1(body.reason),
		environment: "production",
		tokenSuffix: parseReason$1(body.tokenSuffix)
	};
}
async function sendApnsRelayPush(params) {
	const sender = params.requestSender ?? sendApnsRelayRequest;
	const gatewayIdentity = params.gatewayIdentity ?? loadOrCreateDeviceIdentity();
	const signedAtMs = Date.now();
	const bodyJson = JSON.stringify({
		relayHandle: params.relayHandle,
		pushType: params.pushType,
		priority: Number(params.priority),
		payload: params.payload
	});
	const signature = signDevicePayload(gatewayIdentity.privateKeyPem, buildRelayGatewaySignaturePayload({
		gatewayDeviceId: gatewayIdentity.deviceId,
		signedAtMs,
		bodyJson
	}));
	return await sender({
		relayConfig: params.relayConfig,
		sendGrant: params.sendGrant,
		relayHandle: params.relayHandle,
		gatewayDeviceId: gatewayIdentity.deviceId,
		signature,
		signedAtMs,
		bodyJson,
		pushType: params.pushType,
		priority: params.priority,
		payload: params.payload
	});
}
//#endregion
//#region src/infra/push-apns.ts
const APNS_STATE_FILENAME = "push/apns-registrations.json";
const APNS_JWT_TTL_MS = 3e3 * 1e3;
const DEFAULT_APNS_TIMEOUT_MS = 1e4;
const MAX_NODE_ID_LENGTH = 256;
const MAX_TOPIC_LENGTH = 255;
const MAX_APNS_TOKEN_HEX_LENGTH = 512;
const MAX_RELAY_IDENTIFIER_LENGTH = 256;
const MAX_SEND_GRANT_LENGTH = 1024;
const withLock = createAsyncLock();
let cachedJwt = null;
function resolveApnsRegistrationPath(baseDir) {
	const root = baseDir ?? resolveStateDir();
	return path.join(root, APNS_STATE_FILENAME);
}
function normalizeNodeId(value) {
	return value.trim();
}
function isValidNodeId(value) {
	return value.length > 0 && value.length <= MAX_NODE_ID_LENGTH;
}
function normalizeApnsToken(value) {
	return value.trim().replace(/[<>\s]/g, "").toLowerCase();
}
function normalizeRelayHandle(value) {
	return value.trim();
}
function normalizeInstallationId(value) {
	return value.trim();
}
function validateRelayIdentifier(value, fieldName, maxLength = MAX_RELAY_IDENTIFIER_LENGTH) {
	if (!value) throw new Error(`${fieldName} required`);
	if (value.length > maxLength) throw new Error(`${fieldName} too long`);
	if (/[^\x21-\x7e]/.test(value)) throw new Error(`${fieldName} invalid`);
	return value;
}
function normalizeTopic(value) {
	return value.trim();
}
function isValidTopic(value) {
	return value.length > 0 && value.length <= MAX_TOPIC_LENGTH;
}
function normalizeTokenDebugSuffix(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase().replace(/[^0-9a-z]/g, "");
	return normalized.length > 0 ? normalized.slice(-8) : void 0;
}
function isLikelyApnsToken(value) {
	return value.length <= MAX_APNS_TOKEN_HEX_LENGTH && /^[0-9a-f]{32,}$/i.test(value);
}
function parseReason(body) {
	const trimmed = body.trim();
	if (!trimmed) return;
	try {
		const parsed = JSON.parse(trimmed);
		return typeof parsed.reason === "string" && parsed.reason.trim().length > 0 ? parsed.reason.trim() : trimmed.slice(0, 200);
	} catch {
		return trimmed.slice(0, 200);
	}
}
function toBase64UrlBytes(value) {
	return Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function toBase64UrlJson(value) {
	return toBase64UrlBytes(Buffer.from(JSON.stringify(value)));
}
function getJwtCacheKey(auth) {
	const keyHash = createHash("sha256").update(auth.privateKey).digest("hex");
	return `${auth.teamId}:${auth.keyId}:${keyHash}`;
}
function getApnsBearerToken(auth, nowMs = Date.now()) {
	const cacheKey = getJwtCacheKey(auth);
	if (cachedJwt && cachedJwt.cacheKey === cacheKey && nowMs < cachedJwt.expiresAtMs) return cachedJwt.token;
	const iat = Math.floor(nowMs / 1e3);
	const signingInput = `${toBase64UrlJson({
		alg: "ES256",
		kid: auth.keyId,
		typ: "JWT"
	})}.${toBase64UrlJson({
		iss: auth.teamId,
		iat
	})}`;
	const token = `${signingInput}.${toBase64UrlBytes(sign("sha256", Buffer.from(signingInput, "utf8"), {
		key: createPrivateKey(auth.privateKey),
		dsaEncoding: "ieee-p1363"
	}))}`;
	cachedJwt = {
		cacheKey,
		token,
		expiresAtMs: nowMs + APNS_JWT_TTL_MS
	};
	return token;
}
function normalizePrivateKey(value) {
	return value.trim().replace(/\\n/g, "\n");
}
function normalizeNonEmptyString(value) {
	const trimmed = value?.trim() ?? "";
	return trimmed.length > 0 ? trimmed : null;
}
function normalizeDistribution(value) {
	if (typeof value !== "string") return null;
	return value.trim().toLowerCase() === "official" ? "official" : null;
}
function normalizeDirectRegistration(record) {
	if (typeof record.nodeId !== "string" || typeof record.token !== "string") return null;
	const nodeId = normalizeNodeId(record.nodeId);
	const token = normalizeApnsToken(record.token);
	const topic = normalizeTopic(typeof record.topic === "string" ? record.topic : "");
	const environment = normalizeApnsEnvironment(record.environment) ?? "sandbox";
	const updatedAtMs = typeof record.updatedAtMs === "number" && Number.isFinite(record.updatedAtMs) ? Math.trunc(record.updatedAtMs) : 0;
	if (!isValidNodeId(nodeId) || !isValidTopic(topic) || !isLikelyApnsToken(token)) return null;
	return {
		nodeId,
		transport: "direct",
		token,
		topic,
		environment,
		updatedAtMs
	};
}
function normalizeRelayRegistration(record) {
	if (typeof record.nodeId !== "string" || typeof record.relayHandle !== "string" || typeof record.sendGrant !== "string" || typeof record.installationId !== "string") return null;
	const nodeId = normalizeNodeId(record.nodeId);
	const relayHandle = normalizeRelayHandle(record.relayHandle);
	const sendGrant = record.sendGrant.trim();
	const installationId = normalizeInstallationId(record.installationId);
	const topic = normalizeTopic(typeof record.topic === "string" ? record.topic : "");
	const environment = normalizeApnsEnvironment(record.environment);
	const distribution = normalizeDistribution(record.distribution);
	const updatedAtMs = typeof record.updatedAtMs === "number" && Number.isFinite(record.updatedAtMs) ? Math.trunc(record.updatedAtMs) : 0;
	if (!isValidNodeId(nodeId) || !relayHandle || !sendGrant || !installationId || !isValidTopic(topic) || environment !== "production" || distribution !== "official") return null;
	return {
		nodeId,
		transport: "relay",
		relayHandle,
		sendGrant,
		installationId,
		topic,
		environment,
		distribution,
		updatedAtMs,
		tokenDebugSuffix: normalizeTokenDebugSuffix(record.tokenDebugSuffix)
	};
}
function normalizeStoredRegistration(record) {
	if (!record || typeof record !== "object" || Array.isArray(record)) return null;
	const candidate = record;
	if ((typeof candidate.transport === "string" ? candidate.transport.trim().toLowerCase() : "direct") === "relay") return normalizeRelayRegistration(candidate);
	return normalizeDirectRegistration(candidate);
}
async function loadRegistrationsState(baseDir) {
	const existing = await readJsonFile(resolveApnsRegistrationPath(baseDir));
	if (!existing || typeof existing !== "object") return { registrationsByNodeId: {} };
	const registrations = existing.registrationsByNodeId && typeof existing.registrationsByNodeId === "object" && !Array.isArray(existing.registrationsByNodeId) ? existing.registrationsByNodeId : {};
	const normalized = {};
	for (const [nodeId, record] of Object.entries(registrations)) {
		const registration = normalizeStoredRegistration(record);
		if (registration) {
			const normalizedNodeId = normalizeNodeId(nodeId);
			normalized[isValidNodeId(normalizedNodeId) ? normalizedNodeId : registration.nodeId] = registration;
		}
	}
	return { registrationsByNodeId: normalized };
}
async function persistRegistrationsState(state, baseDir) {
	await writeJsonAtomic(resolveApnsRegistrationPath(baseDir), state, {
		mode: 384,
		ensureDirMode: 448,
		trailingNewline: true
	});
}
function normalizeApnsEnvironment(value) {
	if (typeof value !== "string") return null;
	const normalized = value.trim().toLowerCase();
	if (normalized === "sandbox" || normalized === "production") return normalized;
	return null;
}
async function registerApnsRegistration(params) {
	const nodeId = normalizeNodeId(params.nodeId);
	const topic = normalizeTopic(params.topic);
	if (!isValidNodeId(nodeId)) throw new Error("nodeId required");
	if (!isValidTopic(topic)) throw new Error("topic required");
	return await withLock(async () => {
		const state = await loadRegistrationsState(params.baseDir);
		const updatedAtMs = Date.now();
		let next;
		if (params.transport === "relay") {
			const relayHandle = validateRelayIdentifier(normalizeRelayHandle(params.relayHandle), "relayHandle");
			const sendGrant = validateRelayIdentifier(params.sendGrant.trim(), "sendGrant", MAX_SEND_GRANT_LENGTH);
			const installationId = validateRelayIdentifier(normalizeInstallationId(params.installationId), "installationId");
			const environment = normalizeApnsEnvironment(params.environment);
			const distribution = normalizeDistribution(params.distribution);
			if (environment !== "production") throw new Error("relay registrations must use production environment");
			if (distribution !== "official") throw new Error("relay registrations must use official distribution");
			next = {
				nodeId,
				transport: "relay",
				relayHandle,
				sendGrant,
				installationId,
				topic,
				environment,
				distribution,
				updatedAtMs,
				tokenDebugSuffix: normalizeTokenDebugSuffix(params.tokenDebugSuffix)
			};
		} else {
			const token = normalizeApnsToken(params.token);
			const environment = normalizeApnsEnvironment(params.environment) ?? "sandbox";
			if (!isLikelyApnsToken(token)) throw new Error("invalid APNs token");
			next = {
				nodeId,
				transport: "direct",
				token,
				topic,
				environment,
				updatedAtMs
			};
		}
		state.registrationsByNodeId[nodeId] = next;
		await persistRegistrationsState(state, params.baseDir);
		return next;
	});
}
async function loadApnsRegistration(nodeId, baseDir) {
	const normalizedNodeId = normalizeNodeId(nodeId);
	if (!normalizedNodeId) return null;
	return (await loadRegistrationsState(baseDir)).registrationsByNodeId[normalizedNodeId] ?? null;
}
function isSameApnsRegistration(a, b) {
	if (a.nodeId !== b.nodeId || a.transport !== b.transport || a.topic !== b.topic || a.environment !== b.environment || a.updatedAtMs !== b.updatedAtMs) return false;
	if (a.transport === "direct" && b.transport === "direct") return a.token === b.token;
	if (a.transport === "relay" && b.transport === "relay") return a.relayHandle === b.relayHandle && a.sendGrant === b.sendGrant && a.installationId === b.installationId && a.distribution === b.distribution && a.tokenDebugSuffix === b.tokenDebugSuffix;
	return false;
}
async function clearApnsRegistrationIfCurrent(params) {
	const normalizedNodeId = normalizeNodeId(params.nodeId);
	if (!normalizedNodeId) return false;
	return await withLock(async () => {
		const state = await loadRegistrationsState(params.baseDir);
		const current = state.registrationsByNodeId[normalizedNodeId];
		if (!current || !isSameApnsRegistration(current, params.registration)) return false;
		delete state.registrationsByNodeId[normalizedNodeId];
		await persistRegistrationsState(state, params.baseDir);
		return true;
	});
}
function shouldInvalidateApnsRegistration(result) {
	if (result.status === 410) return true;
	return result.status === 400 && result.reason?.trim() === "BadDeviceToken";
}
function shouldClearStoredApnsRegistration(params) {
	if (params.registration.transport !== "direct") return false;
	if (params.overrideEnvironment && params.overrideEnvironment !== params.registration.environment) return false;
	return shouldInvalidateApnsRegistration(params.result);
}
async function resolveApnsAuthConfigFromEnv(env = process.env) {
	const teamId = normalizeNonEmptyString(env.OPENCLAW_APNS_TEAM_ID);
	const keyId = normalizeNonEmptyString(env.OPENCLAW_APNS_KEY_ID);
	if (!teamId || !keyId) return {
		ok: false,
		error: "APNs auth missing: set OPENCLAW_APNS_TEAM_ID and OPENCLAW_APNS_KEY_ID"
	};
	const inlineKeyRaw = normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY_P8) ?? normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY);
	if (inlineKeyRaw) return {
		ok: true,
		value: {
			teamId,
			keyId,
			privateKey: normalizePrivateKey(inlineKeyRaw)
		}
	};
	const keyPath = normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY_PATH);
	if (!keyPath) return {
		ok: false,
		error: "APNs private key missing: set OPENCLAW_APNS_PRIVATE_KEY_P8 or OPENCLAW_APNS_PRIVATE_KEY_PATH"
	};
	try {
		return {
			ok: true,
			value: {
				teamId,
				keyId,
				privateKey: normalizePrivateKey(await fs.readFile(keyPath, "utf8"))
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: `failed reading OPENCLAW_APNS_PRIVATE_KEY_PATH (${keyPath}): ${err instanceof Error ? err.message : String(err)}`
		};
	}
}
async function sendApnsRequest(params) {
	const authority = params.environment === "production" ? "https://api.push.apple.com" : "https://api.sandbox.push.apple.com";
	const body = JSON.stringify(params.payload);
	const requestPath = `/3/device/${params.token}`;
	return await new Promise((resolve, reject) => {
		const client = http2.connect(authority);
		let settled = false;
		const fail = (err) => {
			if (settled) return;
			settled = true;
			client.destroy();
			reject(err);
		};
		const finish = (result) => {
			if (settled) return;
			settled = true;
			client.close();
			resolve(result);
		};
		client.once("error", (err) => fail(err));
		const req = client.request({
			":method": "POST",
			":path": requestPath,
			authorization: `bearer ${params.bearerToken}`,
			"apns-topic": params.topic,
			"apns-push-type": params.pushType,
			"apns-priority": params.priority,
			"apns-expiration": "0",
			"content-type": "application/json",
			"content-length": Buffer.byteLength(body).toString()
		});
		let statusCode = 0;
		let apnsId;
		let responseBody = "";
		req.setEncoding("utf8");
		req.setTimeout(params.timeoutMs, () => {
			req.close(http2.constants.NGHTTP2_CANCEL);
			fail(/* @__PURE__ */ new Error(`APNs request timed out after ${params.timeoutMs}ms`));
		});
		req.on("response", (headers) => {
			const statusHeader = headers[":status"];
			statusCode = typeof statusHeader === "number" ? statusHeader : Number(statusHeader ?? 0);
			const idHeader = headers["apns-id"];
			if (typeof idHeader === "string" && idHeader.trim().length > 0) apnsId = idHeader.trim();
		});
		req.on("data", (chunk) => {
			if (typeof chunk === "string") responseBody += chunk;
		});
		req.on("end", () => {
			finish({
				status: statusCode,
				apnsId,
				body: responseBody
			});
		});
		req.on("error", (err) => fail(err));
		req.end(body);
	});
}
function resolveApnsTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.max(1e3, Math.trunc(timeoutMs)) : DEFAULT_APNS_TIMEOUT_MS;
}
function resolveDirectSendContext(params) {
	const token = normalizeApnsToken(params.registration.token);
	if (!isLikelyApnsToken(token)) throw new Error("invalid APNs token");
	const topic = normalizeTopic(params.registration.topic);
	if (!isValidTopic(topic)) throw new Error("topic required");
	return {
		token,
		topic,
		environment: params.registration.environment,
		bearerToken: getApnsBearerToken(params.auth)
	};
}
function toPushMetadata(params) {
	return {
		kind: params.kind,
		nodeId: params.nodeId,
		ts: Date.now(),
		...params.reason ? { reason: params.reason } : {}
	};
}
function resolveRegistrationDebugSuffix(registration, relayResult) {
	if (registration.transport === "direct") return registration.token.slice(-8);
	return relayResult?.tokenSuffix ?? registration.tokenDebugSuffix ?? registration.relayHandle.slice(-8);
}
function toPushResult(params) {
	const response = "body" in params.response ? {
		ok: params.response.status === 200,
		status: params.response.status,
		apnsId: params.response.apnsId,
		reason: parseReason(params.response.body),
		environment: params.registration.environment,
		tokenSuffix: params.tokenSuffix
	} : params.response;
	return {
		ok: response.ok,
		status: response.status,
		apnsId: response.apnsId,
		reason: response.reason,
		tokenSuffix: params.tokenSuffix ?? resolveRegistrationDebugSuffix(params.registration, "tokenSuffix" in response ? response : void 0),
		topic: params.registration.topic,
		environment: params.registration.transport === "relay" ? "production" : response.environment,
		transport: params.registration.transport
	};
}
async function sendDirectApnsPush(params) {
	const { token, topic, environment, bearerToken } = resolveDirectSendContext({
		auth: params.auth,
		registration: params.registration
	});
	const response = await (params.requestSender ?? sendApnsRequest)({
		token,
		topic,
		environment,
		bearerToken,
		payload: params.payload,
		timeoutMs: resolveApnsTimeoutMs(params.timeoutMs),
		pushType: params.pushType,
		priority: params.priority
	});
	return toPushResult({
		registration: params.registration,
		response,
		tokenSuffix: token.slice(-8)
	});
}
async function sendRelayApnsPush(params) {
	const response = await sendApnsRelayPush({
		relayConfig: params.relayConfig,
		sendGrant: params.registration.sendGrant,
		relayHandle: params.registration.relayHandle,
		payload: params.payload,
		pushType: params.pushType,
		priority: params.priority,
		gatewayIdentity: params.gatewayIdentity,
		requestSender: params.requestSender
	});
	return toPushResult({
		registration: params.registration,
		response
	});
}
function createAlertPayload(params) {
	return {
		aps: {
			alert: {
				title: params.title,
				body: params.body
			},
			sound: "default"
		},
		openclaw: toPushMetadata({
			kind: "push.test",
			nodeId: params.nodeId
		})
	};
}
function createBackgroundPayload(params) {
	return {
		aps: { "content-available": 1 },
		openclaw: toPushMetadata({
			kind: "node.wake",
			reason: params.wakeReason ?? "node.invoke",
			nodeId: params.nodeId
		})
	};
}
async function sendApnsAlert(params) {
	const payload = createAlertPayload({
		nodeId: params.nodeId,
		title: params.title,
		body: params.body
	});
	if (params.registration.transport === "relay") {
		const relayParams = params;
		return await sendRelayApnsPush({
			relayConfig: relayParams.relayConfig,
			registration: relayParams.registration,
			payload,
			pushType: "alert",
			priority: "10",
			gatewayIdentity: relayParams.relayGatewayIdentity,
			requestSender: relayParams.relayRequestSender
		});
	}
	const directParams = params;
	return await sendDirectApnsPush({
		auth: directParams.auth,
		registration: directParams.registration,
		payload,
		timeoutMs: directParams.timeoutMs,
		requestSender: directParams.requestSender,
		pushType: "alert",
		priority: "10"
	});
}
async function sendApnsBackgroundWake(params) {
	const payload = createBackgroundPayload({
		nodeId: params.nodeId,
		wakeReason: params.wakeReason
	});
	if (params.registration.transport === "relay") {
		const relayParams = params;
		return await sendRelayApnsPush({
			relayConfig: relayParams.relayConfig,
			registration: relayParams.registration,
			payload,
			pushType: "background",
			priority: "5",
			gatewayIdentity: relayParams.relayGatewayIdentity,
			requestSender: relayParams.relayRequestSender
		});
	}
	const directParams = params;
	return await sendDirectApnsPush({
		auth: directParams.auth,
		registration: directParams.registration,
		payload,
		timeoutMs: directParams.timeoutMs,
		requestSender: directParams.requestSender,
		pushType: "background",
		priority: "5"
	});
}
//#endregion
export { resolveApnsAuthConfigFromEnv as a, shouldClearStoredApnsRegistration as c, parseMessageWithAttachments as d, registerApnsRegistration as i, resolveApnsRelayConfigFromEnv as l, loadApnsRegistration as n, sendApnsAlert as o, normalizeApnsEnvironment as r, sendApnsBackgroundWake as s, clearApnsRegistrationIfCurrent as t, normalizeRpcAttachmentsToChatAttachments as u };
