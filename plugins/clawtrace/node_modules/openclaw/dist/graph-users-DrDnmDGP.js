import { s as __toESM } from "./chunk-iyeSoAlh.js";
import { a as hasConfiguredSecretInput, c as normalizeResolvedSecretInputString, l as normalizeSecretInputString } from "./types.secrets-Rqz2qv-w.js";
import { c as isPrivateIpAddress } from "./ssrf-BkIVE4hp.js";
import { i as normalizeHostnameSuffixAllowlist, n as buildHostnameAllowlistPolicyFromSuffixAllowlist, r as isHttpsUrlAllowedByHostnameSuffixAllowlist } from "./ssrf-policy-BHnhX84O.js";
import { t as createPluginRuntimeStore } from "./runtime-store-Ds4nzsRU.js";
import "./runtime-api-CMECrhfj.js";
import { createRequire } from "node:module";
import { lookup } from "node:dns/promises";
//#region extensions/msteams/src/attachments/shared.ts
const IMAGE_EXT_RE = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;
const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
const ATTACHMENT_TAG_RE = /<attachment[^>]+id=["']([^"']+)["'][^>]*>/gi;
const DEFAULT_MEDIA_HOST_ALLOWLIST = [
	"graph.microsoft.com",
	"graph.microsoft.us",
	"graph.microsoft.de",
	"graph.microsoft.cn",
	"sharepoint.com",
	"sharepoint.us",
	"sharepoint.de",
	"sharepoint.cn",
	"sharepoint-df.com",
	"1drv.ms",
	"onedrive.com",
	"teams.microsoft.com",
	"teams.cdn.office.net",
	"statics.teams.cdn.office.net",
	"office.com",
	"office.net",
	"asm.skype.com",
	"ams.skype.com",
	"media.ams.skype.com",
	"trafficmanager.net",
	"blob.core.windows.net",
	"azureedge.net",
	"microsoft.com"
];
const DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST = [
	"api.botframework.com",
	"botframework.com",
	"smba.trafficmanager.net",
	"graph.microsoft.com",
	"graph.microsoft.us",
	"graph.microsoft.de",
	"graph.microsoft.cn"
];
const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function resolveRequestUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	if (typeof input === "object" && input && "url" in input && typeof input.url === "string") return input.url;
	return String(input);
}
function normalizeContentType(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function inferPlaceholder(params) {
	const mime = params.contentType?.toLowerCase() ?? "";
	const name = params.fileName?.toLowerCase() ?? "";
	const fileType = params.fileType?.toLowerCase() ?? "";
	return mime.startsWith("image/") || IMAGE_EXT_RE.test(name) || IMAGE_EXT_RE.test(`x.${fileType}`) ? "<media:image>" : "<media:document>";
}
function isLikelyImageAttachment(att) {
	const contentType = normalizeContentType(att.contentType) ?? "";
	const name = typeof att.name === "string" ? att.name : "";
	if (contentType.startsWith("image/")) return true;
	if (IMAGE_EXT_RE.test(name)) return true;
	if (contentType === "application/vnd.microsoft.teams.file.download.info" && isRecord(att.content)) {
		const fileType = typeof att.content.fileType === "string" ? att.content.fileType : "";
		if (fileType && IMAGE_EXT_RE.test(`x.${fileType}`)) return true;
		const fileName = typeof att.content.fileName === "string" ? att.content.fileName : "";
		if (fileName && IMAGE_EXT_RE.test(fileName)) return true;
	}
	return false;
}
/**
* Returns true if the attachment can be downloaded (any file type).
* Used when downloading all files, not just images.
*/
function isDownloadableAttachment(att) {
	if ((normalizeContentType(att.contentType) ?? "") === "application/vnd.microsoft.teams.file.download.info" && isRecord(att.content) && typeof att.content.downloadUrl === "string") return true;
	if (typeof att.contentUrl === "string" && att.contentUrl.trim()) return true;
	return false;
}
function isHtmlAttachment(att) {
	return (normalizeContentType(att.contentType) ?? "").startsWith("text/html");
}
function extractHtmlFromAttachment(att) {
	if (!isHtmlAttachment(att)) return;
	if (typeof att.content === "string") return att.content;
	if (!isRecord(att.content)) return;
	return typeof att.content.text === "string" ? att.content.text : typeof att.content.body === "string" ? att.content.body : typeof att.content.content === "string" ? att.content.content : void 0;
}
function decodeDataImage(src) {
	const match = /^data:(image\/[a-z0-9.+-]+)?(;base64)?,(.*)$/i.exec(src);
	if (!match) return null;
	const contentType = match[1]?.toLowerCase();
	if (!Boolean(match[2])) return null;
	const payload = match[3] ?? "";
	if (!payload) return null;
	try {
		return {
			kind: "data",
			data: Buffer.from(payload, "base64"),
			contentType,
			placeholder: "<media:image>"
		};
	} catch {
		return null;
	}
}
function fileHintFromUrl(src) {
	try {
		return new URL(src).pathname.split("/").pop() || void 0;
	} catch {
		return;
	}
}
function extractInlineImageCandidates(attachments) {
	const out = [];
	for (const att of attachments) {
		const html = extractHtmlFromAttachment(att);
		if (!html) continue;
		IMG_SRC_RE.lastIndex = 0;
		let match = IMG_SRC_RE.exec(html);
		while (match) {
			const src = match[1]?.trim();
			if (src && !src.startsWith("cid:")) if (src.startsWith("data:")) {
				const decoded = decodeDataImage(src);
				if (decoded) out.push(decoded);
			} else out.push({
				kind: "url",
				url: src,
				fileHint: fileHintFromUrl(src),
				placeholder: "<media:image>"
			});
			match = IMG_SRC_RE.exec(html);
		}
	}
	return out;
}
function safeHostForUrl(url) {
	try {
		return new URL(url).hostname.toLowerCase();
	} catch {
		return "invalid-url";
	}
}
function resolveAllowedHosts(input) {
	return normalizeHostnameSuffixAllowlist(input, DEFAULT_MEDIA_HOST_ALLOWLIST);
}
function resolveAuthAllowedHosts(input) {
	return normalizeHostnameSuffixAllowlist(input, DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST);
}
function resolveAttachmentFetchPolicy(params) {
	return {
		allowHosts: resolveAllowedHosts(params?.allowHosts),
		authAllowHosts: resolveAuthAllowedHosts(params?.authAllowHosts)
	};
}
function isUrlAllowed(url, allowlist) {
	return isHttpsUrlAllowedByHostnameSuffixAllowlist(url, allowlist);
}
function applyAuthorizationHeaderForUrl(params) {
	if (!params.bearerToken) {
		params.headers.delete("Authorization");
		return;
	}
	if (isUrlAllowed(params.url, params.authAllowHosts)) {
		params.headers.set("Authorization", `Bearer ${params.bearerToken}`);
		return;
	}
	params.headers.delete("Authorization");
}
function resolveMediaSsrfPolicy(allowHosts) {
	return buildHostnameAllowlistPolicyFromSuffixAllowlist(allowHosts);
}
/**
* Returns true if the given IPv4 or IPv6 address is in a private, loopback,
* or link-local range that must never be reached from media downloads.
*
* Delegates to the SDK's `isPrivateIpAddress` which handles IPv4-mapped IPv6,
* expanded notation, NAT64, 6to4, Teredo, octal IPv4, and fails closed on
* parse errors.
*/
const isPrivateOrReservedIP = isPrivateIpAddress;
/**
* Resolve a hostname via DNS and reject private/reserved IPs.
* Throws if the resolved IP is private or resolution fails.
*/
async function resolveAndValidateIP(hostname, resolveFn) {
	const resolve = resolveFn ?? lookup;
	let resolved;
	try {
		resolved = await resolve(hostname);
	} catch {
		throw new Error(`DNS resolution failed for "${hostname}"`);
	}
	if (isPrivateOrReservedIP(resolved.address)) throw new Error(`Hostname "${hostname}" resolves to private/reserved IP (${resolved.address})`);
	return resolved.address;
}
/** Maximum number of redirects to follow in safeFetch. */
const MAX_SAFE_REDIRECTS = 5;
/**
* Fetch a URL with redirect: "manual", validating each redirect target
* against the hostname allowlist and optional DNS-resolved IP (anti-SSRF).
*
* This prevents:
* - Auto-following redirects to non-allowlisted hosts
* - DNS rebinding attacks when a lookup function is provided
*/
async function safeFetch(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const resolveFn = params.resolveFn;
	const hasDispatcher = Boolean(params.requestInit && typeof params.requestInit === "object" && "dispatcher" in params.requestInit);
	const currentHeaders = new Headers(params.requestInit?.headers);
	let currentUrl = params.url;
	if (!isUrlAllowed(currentUrl, params.allowHosts)) throw new Error(`Initial download URL blocked: ${currentUrl}`);
	if (resolveFn) try {
		const initialHost = new URL(currentUrl).hostname;
		await resolveAndValidateIP(initialHost, resolveFn);
	} catch {
		throw new Error(`Initial download URL blocked: ${currentUrl}`);
	}
	for (let i = 0; i <= MAX_SAFE_REDIRECTS; i++) {
		const res = await fetchFn(currentUrl, {
			...params.requestInit,
			headers: currentHeaders,
			redirect: "manual"
		});
		if (![
			301,
			302,
			303,
			307,
			308
		].includes(res.status)) return res;
		const location = res.headers.get("location");
		if (!location) return res;
		let redirectUrl;
		try {
			redirectUrl = new URL(location, currentUrl).toString();
		} catch {
			throw new Error(`Invalid redirect URL: ${location}`);
		}
		if (!isUrlAllowed(redirectUrl, params.allowHosts)) throw new Error(`Media redirect target blocked by allowlist: ${redirectUrl}`);
		if (currentHeaders.has("authorization") && params.authorizationAllowHosts && !isUrlAllowed(redirectUrl, params.authorizationAllowHosts)) currentHeaders.delete("authorization");
		if (hasDispatcher) return res;
		if (resolveFn) {
			const redirectHost = new URL(redirectUrl).hostname;
			await resolveAndValidateIP(redirectHost, resolveFn);
		}
		currentUrl = redirectUrl;
	}
	throw new Error(`Too many redirects (>${MAX_SAFE_REDIRECTS})`);
}
async function safeFetchWithPolicy(params) {
	return await safeFetch({
		url: params.url,
		allowHosts: params.policy.allowHosts,
		authorizationAllowHosts: params.policy.authAllowHosts,
		fetchFn: params.fetchFn,
		requestInit: params.requestInit,
		resolveFn: params.resolveFn
	});
}
//#endregion
//#region extensions/msteams/src/runtime.ts
const { setRuntime: setMSTeamsRuntime, getRuntime: getMSTeamsRuntime } = createPluginRuntimeStore("MSTeams runtime not initialized");
//#endregion
//#region extensions/msteams/src/user-agent.ts
let cachedUserAgent;
function resolveTeamsSdkVersion() {
	try {
		return createRequire(import.meta.url)("@microsoft/teams.apps/package.json").version ?? "unknown";
	} catch {
		return "unknown";
	}
}
function resolveOpenClawVersion() {
	try {
		return getMSTeamsRuntime().version;
	} catch {
		return "unknown";
	}
}
function buildUserAgent() {
	if (cachedUserAgent) return cachedUserAgent;
	cachedUserAgent = `teams.ts[apps]/${resolveTeamsSdkVersion()} OpenClaw/${resolveOpenClawVersion()}`;
	return cachedUserAgent;
}
//#endregion
//#region extensions/msteams/src/sdk.ts
async function loadMSTeamsSdk() {
	const [appsModule, apiModule] = await Promise.all([import("./dist-DvU6bazB.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)), import("./dist-BK3ZTzz7.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1))]);
	return {
		App: appsModule.App,
		Client: apiModule.Client
	};
}
/**
* Create a Teams SDK App instance from credentials. The App manages token
* acquisition, JWT validation, and the HTTP server lifecycle.
*
* This replaces the previous CloudAdapter + MsalTokenProvider + authorizeJWT
* from @microsoft/agents-hosting.
*/
function createMSTeamsApp(creds, sdk) {
	return new sdk.App({
		clientId: creds.appId,
		clientSecret: creds.appPassword,
		tenantId: creds.tenantId
	});
}
/**
* Build a token provider that uses the Teams SDK App for token acquisition.
*/
function createMSTeamsTokenProvider(app) {
	return { async getAccessToken(scope) {
		if (scope.includes("graph.microsoft.com")) {
			const token = await app.getAppGraphToken();
			return token ? String(token) : "";
		}
		const token = await app.getBotToken();
		return token ? String(token) : "";
	} };
}
function createBotTokenGetter(app) {
	return async () => {
		const token = await app.getBotToken();
		return token ? String(token) : void 0;
	};
}
function createApiClient(sdk, serviceUrl, getToken) {
	return new sdk.Client(serviceUrl, {
		token: async () => await getToken() || void 0,
		headers: { "User-Agent": buildUserAgent() }
	});
}
function normalizeOutboundActivity(textOrActivity) {
	return typeof textOrActivity === "string" ? {
		type: "message",
		text: textOrActivity
	} : textOrActivity;
}
function createSendContext(params) {
	const apiClient = params.serviceUrl && params.conversationId ? createApiClient(params.sdk, params.serviceUrl, params.getToken) : void 0;
	return {
		async sendActivity(textOrActivity) {
			const msg = normalizeOutboundActivity(textOrActivity);
			if (params.treatInvokeResponseAsNoop && msg.type === "invokeResponse") return { id: "invokeResponse" };
			if (!apiClient || !params.conversationId) return { id: "unknown" };
			return await apiClient.conversations.activities(params.conversationId).create({
				type: "message",
				...msg,
				from: params.bot?.id ? {
					id: params.bot.id,
					name: params.bot.name ?? "",
					role: "bot"
				} : void 0,
				conversation: {
					id: params.conversationId,
					conversationType: params.conversationType ?? "personal"
				},
				...params.replyToActivityId && !msg.replyToId ? { replyToId: params.replyToActivityId } : {}
			});
		},
		async updateActivity(activityUpdate) {
			const nextActivity = activityUpdate;
			const activityId = nextActivity.id;
			if (!activityId) throw new Error("updateActivity requires an activity id");
			if (!params.serviceUrl || !params.conversationId) return { id: "unknown" };
			return await updateActivityViaRest({
				serviceUrl: params.serviceUrl,
				conversationId: params.conversationId,
				activityId,
				activity: nextActivity,
				token: await params.getToken()
			});
		},
		async deleteActivity(activityId) {
			if (!activityId) throw new Error("deleteActivity requires an activity id");
			if (!params.serviceUrl || !params.conversationId) return;
			await deleteActivityViaRest({
				serviceUrl: params.serviceUrl,
				conversationId: params.conversationId,
				activityId,
				token: await params.getToken()
			});
		}
	};
}
function createProcessContext(params) {
	const serviceUrl = params.activity?.serviceUrl;
	const conversationId = (params.activity?.conversation)?.id;
	const conversationType = (params.activity?.conversation)?.conversationType;
	const replyToActivityId = params.activity?.id;
	const bot = params.activity?.recipient && typeof params.activity.recipient === "object" ? {
		id: params.activity.recipient.id,
		name: params.activity.recipient.name
	} : void 0;
	const sendContext = createSendContext({
		sdk: params.sdk,
		serviceUrl,
		conversationId,
		conversationType,
		bot,
		replyToActivityId,
		getToken: params.getToken,
		treatInvokeResponseAsNoop: true
	});
	return {
		activity: params.activity,
		...sendContext,
		async sendActivities(activities) {
			const results = [];
			for (const activity of activities) results.push(await sendContext.sendActivity(activity));
			return results;
		}
	};
}
/**
* Update an existing activity via the Bot Framework REST API.
* PUT /v3/conversations/{conversationId}/activities/{activityId}
*/
async function updateActivityViaRest(params) {
	const { serviceUrl, conversationId, activityId, activity, token } = params;
	const url = `${serviceUrl.replace(/\/+$/, "")}/v3/conversations/${encodeURIComponent(conversationId)}/activities/${encodeURIComponent(activityId)}`;
	const headers = {
		"Content-Type": "application/json",
		"User-Agent": buildUserAgent()
	};
	if (token) headers.Authorization = `Bearer ${token}`;
	const response = await fetch(url, {
		method: "PUT",
		headers,
		body: JSON.stringify({
			type: "message",
			...activity,
			id: activityId
		})
	});
	if (!response.ok) {
		const body = await response.text().catch(() => "");
		throw Object.assign(/* @__PURE__ */ new Error(`updateActivity failed: HTTP ${response.status} ${body}`), { statusCode: response.status });
	}
	return await response.json().catch(() => ({ id: activityId }));
}
/**
* Delete an existing activity via the Bot Framework REST API.
* DELETE /v3/conversations/{conversationId}/activities/{activityId}
*/
async function deleteActivityViaRest(params) {
	const { serviceUrl, conversationId, activityId, token } = params;
	const url = `${serviceUrl.replace(/\/+$/, "")}/v3/conversations/${encodeURIComponent(conversationId)}/activities/${encodeURIComponent(activityId)}`;
	const headers = { "User-Agent": buildUserAgent() };
	if (token) headers.Authorization = `Bearer ${token}`;
	const response = await fetch(url, {
		method: "DELETE",
		headers
	});
	if (!response.ok) {
		const body = await response.text().catch(() => "");
		throw Object.assign(/* @__PURE__ */ new Error(`deleteActivity failed: HTTP ${response.status} ${body}`), { statusCode: response.status });
	}
}
/**
* Build a CloudAdapter-compatible adapter using the Teams SDK REST client.
*
* This replaces the previous CloudAdapter from @microsoft/agents-hosting.
* For incoming requests: the App's HttpPlugin handles JWT validation.
* For proactive sends: uses the Bot Framework REST API via
* @microsoft/teams.api Client.
*/
function createMSTeamsAdapter(app, sdk) {
	return {
		async continueConversation(_appId, reference, logic) {
			const serviceUrl = reference.serviceUrl;
			if (!serviceUrl) throw new Error("Missing serviceUrl in conversation reference");
			const conversationId = reference.conversation?.id;
			if (!conversationId) throw new Error("Missing conversation.id in conversation reference");
			await logic(createSendContext({
				sdk,
				serviceUrl,
				conversationId,
				conversationType: reference.conversation?.conversationType,
				bot: reference.agent ?? void 0,
				getToken: createBotTokenGetter(app)
			}));
		},
		async process(req, res, logic) {
			const request = req;
			const response = res;
			const activity = request.body;
			const isInvoke = activity?.type === "invoke";
			try {
				const context = createProcessContext({
					sdk,
					activity,
					getToken: createBotTokenGetter(app)
				});
				if (isInvoke) response.status(200).send();
				await logic(context);
				if (!isInvoke) response.status(200).send();
			} catch (err) {
				if (!isInvoke) response.status(500).send({ error: String(err) });
			}
		},
		async updateActivity(_context, activity) {},
		async deleteActivity(_context, _reference) {}
	};
}
async function loadMSTeamsSdkWithAuth(creds) {
	const sdk = await loadMSTeamsSdk();
	return {
		sdk,
		app: createMSTeamsApp(creds, sdk)
	};
}
/**
* Create a Bot Framework JWT validator with strict multi-issuer support.
*
* During Microsoft's transition, inbound service tokens can be signed by either:
* - Legacy Bot Framework issuer/JWKS
* - Entra issuer/JWKS
*
* Security invariants are preserved for both paths:
* - signature verification (issuer-specific JWKS)
* - audience validation (appId)
* - issuer validation (strict allowlist)
* - expiration validation (Teams SDK defaults)
*/
async function createBotFrameworkJwtValidator(creds) {
	const { JwtValidator } = await import("./jwt-validator-BlddLNep.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
	const botFrameworkValidator = new JwtValidator({
		clientId: creds.appId,
		tenantId: creds.tenantId,
		validateIssuer: { allowedIssuer: "https://api.botframework.com" },
		jwksUriOptions: {
			type: "uri",
			uri: "https://login.botframework.com/v1/.well-known/keys"
		}
	});
	const entraValidator = new JwtValidator({
		clientId: creds.appId,
		tenantId: creds.tenantId,
		validateIssuer: { allowedTenantIds: [creds.tenantId] },
		jwksUriOptions: {
			type: "uri",
			uri: "https://login.microsoftonline.com/common/discovery/v2.0/keys"
		}
	});
	async function validateWithFallback(token, overrides) {
		for (const validator of [botFrameworkValidator, entraValidator]) try {
			if (await validator.validateAccessToken(token, overrides) != null) return true;
		} catch {
			continue;
		}
		return false;
	}
	return { async validate(authHeader, serviceUrl) {
		const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
		if (!token) return false;
		return await validateWithFallback(token, serviceUrl ? { validateServiceUrl: { expectedServiceUrl: serviceUrl } } : void 0);
	} };
}
//#endregion
//#region extensions/msteams/src/token-response.ts
function readAccessToken(value) {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const token = value.accessToken ?? value.token;
		return typeof token === "string" ? token : null;
	}
	return null;
}
//#endregion
//#region extensions/msteams/src/token.ts
function hasConfiguredMSTeamsCredentials(cfg) {
	return Boolean(normalizeSecretInputString(cfg?.appId) && hasConfiguredSecretInput(cfg?.appPassword) && normalizeSecretInputString(cfg?.tenantId));
}
function resolveMSTeamsCredentials(cfg) {
	const appId = normalizeSecretInputString(cfg?.appId) || normalizeSecretInputString(process.env.MSTEAMS_APP_ID);
	const appPassword = normalizeResolvedSecretInputString({
		value: cfg?.appPassword,
		path: "channels.msteams.appPassword"
	}) || normalizeSecretInputString(process.env.MSTEAMS_APP_PASSWORD);
	const tenantId = normalizeSecretInputString(cfg?.tenantId) || normalizeSecretInputString(process.env.MSTEAMS_TENANT_ID);
	if (!appId || !appPassword || !tenantId) return;
	return {
		appId,
		appPassword,
		tenantId
	};
}
//#endregion
//#region extensions/msteams/src/graph.ts
const GRAPH_BETA = "https://graph.microsoft.com/beta";
function normalizeQuery(value) {
	return value?.trim() ?? "";
}
function escapeOData(value) {
	return value.replace(/'/g, "''");
}
async function requestGraph(params) {
	const hasBody = params.body !== void 0;
	const res = await fetch(`${params.root ?? "https://graph.microsoft.com/v1.0"}${params.path}`, {
		method: params.method,
		headers: {
			"User-Agent": buildUserAgent(),
			Authorization: `Bearer ${params.token}`,
			...hasBody ? { "Content-Type": "application/json" } : {},
			...params.headers
		},
		body: hasBody ? JSON.stringify(params.body) : void 0
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`${params.errorPrefix ?? "Graph"} ${params.path} failed (${res.status}): ${text || "unknown error"}`);
	}
	return res;
}
async function readOptionalGraphJson(res) {
	if (res.status === 204 || res.headers.get("content-length") === "0") return;
	return await res.json();
}
async function fetchGraphJson(params) {
	return await (await requestGraph({
		token: params.token,
		path: params.path,
		headers: params.headers
	})).json();
}
async function resolveGraphToken(cfg) {
	const creds = resolveMSTeamsCredentials(cfg?.channels?.msteams);
	if (!creds) throw new Error("MS Teams credentials missing");
	const { app } = await loadMSTeamsSdkWithAuth(creds);
	const accessToken = readAccessToken(await createMSTeamsTokenProvider(app).getAccessToken("https://graph.microsoft.com"));
	if (!accessToken) throw new Error("MS Teams graph token unavailable");
	return accessToken;
}
async function listTeamsByName(token, query) {
	const filter = `resourceProvisioningOptions/Any(x:x eq 'Team') and startsWith(displayName,'${escapeOData(query)}')`;
	return (await fetchGraphJson({
		token,
		path: `/groups?$filter=${encodeURIComponent(filter)}&$select=id,displayName`
	})).value ?? [];
}
async function postGraphJson(params) {
	return readOptionalGraphJson(await requestGraph({
		token: params.token,
		path: params.path,
		method: "POST",
		body: params.body,
		errorPrefix: "Graph POST"
	}));
}
async function postGraphBetaJson(params) {
	return readOptionalGraphJson(await requestGraph({
		token: params.token,
		path: params.path,
		method: "POST",
		root: GRAPH_BETA,
		body: params.body,
		errorPrefix: "Graph beta POST"
	}));
}
async function deleteGraphRequest(params) {
	await requestGraph({
		token: params.token,
		path: params.path,
		method: "DELETE",
		errorPrefix: "Graph DELETE"
	});
}
async function listChannelsForTeam(token, teamId) {
	return (await fetchGraphJson({
		token,
		path: `/teams/${encodeURIComponent(teamId)}/channels?$select=id,displayName`
	})).value ?? [];
}
//#endregion
//#region extensions/msteams/src/graph-users.ts
async function searchGraphUsers(params) {
	const query = params.query.trim();
	if (!query) return [];
	if (query.includes("@")) {
		const escaped = escapeOData(query);
		const filter = `(mail eq '${escaped}' or userPrincipalName eq '${escaped}')`;
		const path = `/users?$filter=${encodeURIComponent(filter)}&$select=id,displayName,mail,userPrincipalName`;
		return (await fetchGraphJson({
			token: params.token,
			path
		})).value ?? [];
	}
	const top = typeof params.top === "number" && params.top > 0 ? params.top : 10;
	const path = `/users?$search=${encodeURIComponent(`"displayName:${query}"`)}&$select=id,displayName,mail,userPrincipalName&$top=${top}`;
	return (await fetchGraphJson({
		token: params.token,
		path,
		headers: { ConsistencyLevel: "eventual" }
	})).value ?? [];
}
//#endregion
export { isRecord as A, IMG_SRC_RE as C, inferPlaceholder as D, extractInlineImageCandidates as E, resolveRequestUrl as F, safeFetchWithPolicy as I, safeHostForUrl as L, normalizeContentType as M, resolveAttachmentFetchPolicy as N, isDownloadableAttachment as O, resolveMediaSsrfPolicy as P, GRAPH_ROOT as S, extractHtmlFromAttachment as T, loadMSTeamsSdkWithAuth as _, listChannelsForTeam as a, setMSTeamsRuntime as b, postGraphBetaJson as c, hasConfiguredMSTeamsCredentials as d, resolveMSTeamsCredentials as f, createMSTeamsTokenProvider as g, createMSTeamsAdapter as h, fetchGraphJson as i, isUrlAllowed as j, isLikelyImageAttachment as k, postGraphJson as l, createBotFrameworkJwtValidator as m, deleteGraphRequest as n, listTeamsByName as o, readAccessToken as p, escapeOData as r, normalizeQuery as s, searchGraphUsers as t, resolveGraphToken as u, buildUserAgent as v, applyAuthorizationHeaderForUrl as w, ATTACHMENT_TAG_RE as x, getMSTeamsRuntime as y };
