import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-Day5KPIY.js";
import { XP as renderQrPngBase64, dE as runPluginCommandWithTimeout } from "../../auth-profiles-B5ypC5S-.js";
import { u as resolveGatewayPort } from "../../paths-Y4UT24Of.js";
import { c as resolveTailnetHostWithRunner, l as resolveGatewayBindUrl } from "../../core-CFWy4f9Z.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { i as listDevicePairing, t as approveDevicePairing } from "../../device-pairing-DeNkV6bj.js";
import { a as PAIRING_SETUP_BOOTSTRAP_PROFILE, n as issueDeviceBootstrapToken, r as revokeDeviceBootstrapToken, t as clearDeviceBootstrapTokens } from "../../device-bootstrap-DKsEcfsd.js";
import "../../api-eLj2_Oo-.js";
import { i as registerPairingNotifierService, n as formatPendingRequests, r as handleNotifyCommand, t as armPairNotifyOnce } from "../../notify-CNN6KSVR.js";
import path from "node:path";
import os from "node:os";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
//#region extensions/device-pair/index.ts
async function renderQrDataUrl(data) {
	return `data:image/png;base64,${await renderQrPngBase64(data)}`;
}
async function writeQrPngTempFile(data) {
	const pngBase64 = await renderQrPngBase64(data);
	const tmpRoot = resolvePreferredOpenClawTmpDir();
	const qrDir = await mkdtemp(path.join(tmpRoot, "device-pair-qr-"));
	const filePath = path.join(qrDir, "pair-qr.png");
	await writeFile(filePath, Buffer.from(pngBase64, "base64"));
	return filePath;
}
function formatDurationMinutes(expiresAtMs) {
	const msRemaining = Math.max(0, expiresAtMs - Date.now());
	const minutes = Math.max(1, Math.ceil(msRemaining / 6e4));
	return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
function coerceQrSend(send) {
	return typeof send === "function" ? send : void 0;
}
const QR_CHANNEL_SENDERS = {
	telegram: {
		resolveSend: (api) => coerceQrSend(api.runtime?.channel?.telegram?.sendMessageTelegram),
		createOpts: ({ ctx, qrFilePath, mediaLocalRoots, accountId }) => ({
			mediaUrl: qrFilePath,
			mediaLocalRoots,
			...typeof ctx.messageThreadId === "number" ? { messageThreadId: ctx.messageThreadId } : {},
			...accountId ? { accountId } : {}
		})
	},
	discord: {
		resolveSend: (api) => coerceQrSend(api.runtime?.channel?.discord?.sendMessageDiscord),
		createOpts: ({ qrFilePath, mediaLocalRoots, accountId }) => ({
			mediaUrl: qrFilePath,
			mediaLocalRoots,
			...accountId ? { accountId } : {}
		})
	},
	slack: {
		resolveSend: (api) => coerceQrSend(api.runtime?.channel?.slack?.sendMessageSlack),
		createOpts: ({ ctx, qrFilePath, mediaLocalRoots, accountId }) => ({
			mediaUrl: qrFilePath,
			mediaLocalRoots,
			...ctx.messageThreadId != null ? { threadTs: String(ctx.messageThreadId) } : {},
			...accountId ? { accountId } : {}
		})
	},
	signal: {
		resolveSend: (api) => coerceQrSend(api.runtime?.channel?.signal?.sendMessageSignal),
		createOpts: ({ qrFilePath, mediaLocalRoots, accountId }) => ({
			mediaUrl: qrFilePath,
			mediaLocalRoots,
			...accountId ? { accountId } : {}
		})
	},
	imessage: {
		resolveSend: (api) => coerceQrSend(api.runtime?.channel?.imessage?.sendMessageIMessage),
		createOpts: ({ qrFilePath, mediaLocalRoots, accountId }) => ({
			mediaUrl: qrFilePath,
			mediaLocalRoots,
			...accountId ? { accountId } : {}
		})
	},
	whatsapp: {
		resolveSend: (api) => coerceQrSend(api.runtime?.channel?.whatsapp?.sendMessageWhatsApp),
		createOpts: ({ qrFilePath, mediaLocalRoots, accountId }) => ({
			verbose: false,
			mediaUrl: qrFilePath,
			mediaLocalRoots,
			...accountId ? { accountId } : {}
		})
	}
};
function normalizeUrl(raw, schemeFallback) {
	const candidate = raw.trim();
	if (!candidate) return null;
	const parsedUrl = parseNormalizedGatewayUrl(candidate);
	if (parsedUrl) return parsedUrl;
	const hostPort = candidate.split("/", 1)[0]?.trim() ?? "";
	return hostPort ? `${schemeFallback}://${hostPort}` : null;
}
function parseNormalizedGatewayUrl(raw) {
	try {
		const parsed = new URL(raw);
		const scheme = parsed.protocol.slice(0, -1);
		const normalizedScheme = scheme === "http" ? "ws" : scheme === "https" ? "wss" : scheme;
		if (!(normalizedScheme === "ws" || normalizedScheme === "wss")) return null;
		if (!parsed.hostname) return null;
		return `${normalizedScheme}://${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}`;
	} catch {
		return null;
	}
}
function resolveScheme(cfg, opts) {
	if (opts?.forceSecure) return "wss";
	return cfg.gateway?.tls?.enabled === true ? "wss" : "ws";
}
function parseIPv4Octets(address) {
	const parts = address.split(".");
	if (parts.length !== 4) return null;
	const octets = parts.map((part) => Number.parseInt(part, 10));
	if (octets.some((value) => !Number.isFinite(value) || value < 0 || value > 255)) return null;
	return octets;
}
function isPrivateIPv4(address) {
	const octets = parseIPv4Octets(address);
	if (!octets) return false;
	const [a, b] = octets;
	if (a === 10) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && b === 168) return true;
	return false;
}
function isTailnetIPv4(address) {
	const octets = parseIPv4Octets(address);
	if (!octets) return false;
	const [a, b] = octets;
	return a === 100 && b >= 64 && b <= 127;
}
function pickMatchingIPv4(predicate) {
	const nets = os.networkInterfaces();
	for (const entries of Object.values(nets)) {
		if (!entries) continue;
		for (const entry of entries) {
			const family = entry?.family;
			const isIpv4 = family === "IPv4" || String(family) === "4";
			if (!entry || entry.internal || !isIpv4) continue;
			const address = entry.address?.trim() ?? "";
			if (!address) continue;
			if (predicate(address)) return address;
		}
	}
	return null;
}
function pickLanIPv4() {
	return pickMatchingIPv4(isPrivateIPv4);
}
function pickTailnetIPv4() {
	return pickMatchingIPv4(isTailnetIPv4);
}
async function resolveTailnetHost() {
	return await resolveTailnetHostWithRunner((argv, opts) => runPluginCommandWithTimeout({
		argv,
		timeoutMs: opts.timeoutMs
	}));
}
function resolveAuthLabel(cfg) {
	const mode = cfg.gateway?.auth?.mode;
	const token = pickFirstDefined([process.env.OPENCLAW_GATEWAY_TOKEN, cfg.gateway?.auth?.token]) ?? void 0;
	const password = pickFirstDefined([process.env.OPENCLAW_GATEWAY_PASSWORD, cfg.gateway?.auth?.password]) ?? void 0;
	if (mode === "token" || mode === "password") return resolveRequiredAuthLabel(mode, {
		token,
		password
	});
	if (token) return { label: "token" };
	if (password) return { label: "password" };
	return { error: "Gateway auth is not configured (no token or password)." };
}
function pickFirstDefined(candidates) {
	for (const value of candidates) {
		if (typeof value !== "string") continue;
		const trimmed = value.trim();
		if (trimmed) return trimmed;
	}
	return null;
}
function resolveRequiredAuthLabel(mode, values) {
	if (mode === "token") return values.token ? { label: "token" } : { error: "Gateway auth is set to token, but no token is configured." };
	return values.password ? { label: "password" } : { error: "Gateway auth is set to password, but no password is configured." };
}
async function resolveGatewayUrl(api) {
	const cfg = api.config;
	const pluginCfg = api.pluginConfig ?? {};
	const scheme = resolveScheme(cfg);
	const port = resolveGatewayPort(cfg);
	if (typeof pluginCfg.publicUrl === "string" && pluginCfg.publicUrl.trim()) {
		const url = normalizeUrl(pluginCfg.publicUrl, scheme);
		if (url) return {
			url,
			source: "plugins.entries.device-pair.config.publicUrl"
		};
		return { error: "Configured publicUrl is invalid." };
	}
	const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
	if (tailscaleMode === "serve" || tailscaleMode === "funnel") {
		const host = await resolveTailnetHost();
		if (!host) return { error: "Tailscale Serve is enabled, but MagicDNS could not be resolved." };
		return {
			url: `wss://${host}`,
			source: `gateway.tailscale.mode=${tailscaleMode}`
		};
	}
	const remoteUrl = cfg.gateway?.remote?.url;
	if (typeof remoteUrl === "string" && remoteUrl.trim()) {
		const url = normalizeUrl(remoteUrl, scheme);
		if (url) return {
			url,
			source: "gateway.remote.url"
		};
	}
	const bindResult = resolveGatewayBindUrl({
		bind: cfg.gateway?.bind,
		customBindHost: cfg.gateway?.customBindHost,
		scheme,
		port,
		pickTailnetHost: pickTailnetIPv4,
		pickLanHost: pickLanIPv4
	});
	if (bindResult) return bindResult;
	return { error: "Gateway is only bound to loopback. Set gateway.bind=lan, enable tailscale serve, or configure plugins.entries.device-pair.config.publicUrl." };
}
function encodeSetupCode(payload) {
	const json = JSON.stringify(payload);
	return Buffer.from(json, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function buildPairingFlowLines(stepTwo) {
	return [
		"1) Open the iOS app → Settings → Gateway",
		`2) ${stepTwo}`,
		"3) Back here, run /pair approve",
		"4) If this code leaks or you are done, run /pair cleanup"
	];
}
function buildSecurityNoticeLines(params) {
	const cleanupCommand = params.markdown ? "`/pair cleanup`" : "/pair cleanup";
	const securityPrefix = params.markdown ? "- " : "";
	const importantLine = params.markdown ? `**Important:** Run ${cleanupCommand} after pairing finishes.` : `IMPORTANT: After pairing finishes, run ${cleanupCommand}.`;
	return [
		`${securityPrefix}Security: single-use bootstrap token`,
		`${securityPrefix}Expires: ${formatDurationMinutes(params.expiresAtMs)}`,
		"",
		importantLine,
		`If this ${params.kind} leaks, run ${cleanupCommand} immediately.`
	];
}
function buildQrFollowUpLines(autoNotifyArmed) {
	return autoNotifyArmed ? [
		"After scanning, wait here for the pairing request ping.",
		"I’ll auto-ping here when the pairing request arrives, then auto-disable.",
		"If the ping does not arrive, run `/pair approve latest` manually."
	] : ["After scanning, run `/pair approve` to complete pairing."];
}
function formatSetupReply(payload, authLabel) {
	const setupCode = encodeSetupCode(payload);
	return [
		"Pairing setup code generated.",
		"",
		...buildPairingFlowLines("Paste the setup code below and tap Connect"),
		"",
		"Setup code:",
		setupCode,
		"",
		`Gateway: ${payload.url}`,
		`Auth: ${authLabel}`,
		...buildSecurityNoticeLines({
			kind: "setup code",
			expiresAtMs: payload.expiresAtMs
		})
	].join("\n");
}
function formatSetupInstructions(expiresAtMs) {
	return [
		"Pairing setup code generated.",
		"",
		...buildPairingFlowLines("Paste the setup code from my next message and tap Connect"),
		"",
		...buildSecurityNoticeLines({
			kind: "setup code",
			expiresAtMs
		})
	].join("\n");
}
function buildQrInfoLines(params) {
	return [
		`Gateway: ${params.payload.url}`,
		`Auth: ${params.authLabel}`,
		...buildSecurityNoticeLines({
			kind: "QR code",
			expiresAtMs: params.expiresAtMs
		}),
		"",
		...buildQrFollowUpLines(params.autoNotifyArmed),
		"",
		"If your camera still won’t lock on, run `/pair` for a pasteable setup code."
	];
}
function formatQrInfoMarkdown(params) {
	return [
		`- Gateway: ${params.payload.url}`,
		`- Auth: ${params.authLabel}`,
		...buildSecurityNoticeLines({
			kind: "QR code",
			expiresAtMs: params.expiresAtMs,
			markdown: true
		}),
		"",
		...buildQrFollowUpLines(params.autoNotifyArmed),
		"",
		"If your camera still won’t lock on, run `/pair` for a pasteable setup code."
	].join("\n");
}
function canSendQrPngToChannel(channel) {
	return channel in QR_CHANNEL_SENDERS;
}
function resolveQrReplyTarget(ctx) {
	if (ctx.channel === "discord") {
		const senderId = ctx.senderId?.trim() ?? "";
		if (senderId) return senderId.startsWith("user:") || senderId.startsWith("channel:") ? senderId : `user:${senderId}`;
	}
	return ctx.senderId?.trim() || ctx.from?.trim() || ctx.to?.trim() || "";
}
async function issueSetupPayload(url) {
	const issuedBootstrap = await issueDeviceBootstrapToken({ profile: PAIRING_SETUP_BOOTSTRAP_PROFILE });
	return {
		url,
		bootstrapToken: issuedBootstrap.token,
		expiresAtMs: issuedBootstrap.expiresAtMs
	};
}
async function sendQrPngToSupportedChannel(params) {
	const mediaLocalRoots = [path.dirname(params.qrFilePath)];
	const accountId = params.ctx.accountId?.trim() || void 0;
	const sender = QR_CHANNEL_SENDERS[params.ctx.channel];
	if (!sender) return false;
	const send = sender.resolveSend(params.api);
	if (!send) return false;
	await send(params.target, params.caption, sender.createOpts({
		ctx: params.ctx,
		qrFilePath: params.qrFilePath,
		mediaLocalRoots,
		accountId
	}));
	return true;
}
var device_pair_default = definePluginEntry({
	id: "device-pair",
	name: "Device Pair",
	description: "QR/bootstrap pairing helpers for OpenClaw devices",
	register(api) {
		registerPairingNotifierService(api);
		api.registerCommand({
			name: "pair",
			description: "Generate setup codes and approve device pairing requests.",
			acceptsArgs: true,
			handler: async (ctx) => {
				const tokens = (ctx.args?.trim() ?? "").split(/\s+/).filter(Boolean);
				const action = tokens[0]?.toLowerCase() ?? "";
				const gatewayClientScopes = Array.isArray(ctx.gatewayClientScopes) ? ctx.gatewayClientScopes : null;
				api.logger.info?.(`device-pair: /pair invoked channel=${ctx.channel} sender=${ctx.senderId ?? "unknown"} action=${action || "new"}`);
				if (action === "status" || action === "pending") return { text: formatPendingRequests((await listDevicePairing()).pending) };
				if (action === "notify") return await handleNotifyCommand({
					api,
					ctx,
					action: tokens[1]?.trim().toLowerCase() ?? "status"
				});
				if (action === "approve") {
					if (gatewayClientScopes && !gatewayClientScopes.includes("operator.pairing") && !gatewayClientScopes.includes("operator.admin")) return { text: "⚠️ This command requires operator.pairing for internal gateway callers." };
					const requested = tokens[1]?.trim();
					const list = await listDevicePairing();
					if (list.pending.length === 0) return { text: "No pending device pairing requests." };
					let pending;
					if (requested) if (requested.toLowerCase() === "latest") pending = [...list.pending].toSorted((a, b) => (b.ts ?? 0) - (a.ts ?? 0))[0];
					else pending = list.pending.find((entry) => entry.requestId === requested);
					else if (list.pending.length === 1) pending = list.pending[0];
					else return { text: `${formatPendingRequests(list.pending)}\n\nMultiple pending requests found. Approve one explicitly:
/pair approve <requestId>
Or approve the most recent:
/pair approve latest` };
					if (!pending) return { text: "Pairing request not found." };
					const approved = gatewayClientScopes ? await approveDevicePairing(pending.requestId, { callerScopes: gatewayClientScopes }) : await approveDevicePairing(pending.requestId);
					if (!approved) return { text: "Pairing request not found." };
					if (approved.status === "forbidden") return { text: `⚠️ Cannot approve a request requiring ${approved.missingScope}.` };
					const label = approved.device.displayName?.trim() || approved.device.deviceId;
					const platform = approved.device.platform?.trim();
					return { text: `✅ Paired ${label}${platform ? ` (${platform})` : ""}.` };
				}
				if (action === "cleanup" || action === "clear" || action === "revoke") {
					const cleared = await clearDeviceBootstrapTokens();
					return { text: cleared.removed > 0 ? `Invalidated ${cleared.removed} unused setup code${cleared.removed === 1 ? "" : "s"}.` : "No unused setup codes were active." };
				}
				const authLabelResult = resolveAuthLabel(api.config);
				if (authLabelResult.error) return { text: `Error: ${authLabelResult.error}` };
				const urlResult = await resolveGatewayUrl(api);
				if (!urlResult.url) return { text: `Error: ${urlResult.error ?? "Gateway URL unavailable."}` };
				const authLabel = authLabelResult.label ?? "auth";
				if (action === "qr") {
					const channel = ctx.channel;
					const target = resolveQrReplyTarget(ctx);
					let autoNotifyArmed = false;
					if (channel === "telegram" && target) try {
						autoNotifyArmed = await armPairNotifyOnce({
							api,
							ctx
						});
					} catch (err) {
						api.logger.warn?.(`device-pair: failed to arm one-shot pairing notify (${String(err?.message ?? err)})`);
					}
					let payload = await issueSetupPayload(urlResult.url);
					let setupCode = encodeSetupCode(payload);
					const infoLines = buildQrInfoLines({
						payload,
						authLabel,
						autoNotifyArmed,
						expiresAtMs: payload.expiresAtMs
					});
					if (target && canSendQrPngToChannel(channel)) {
						let qrFilePath;
						try {
							qrFilePath = await writeQrPngTempFile(setupCode);
							if (await sendQrPngToSupportedChannel({
								api,
								ctx,
								target,
								caption: [
									"Scan this QR code with the OpenClaw iOS app:",
									"",
									...infoLines
								].join("\n"),
								qrFilePath
							})) return { text: `QR code sent above.\nExpires: ${formatDurationMinutes(payload.expiresAtMs)}\nIMPORTANT: Run /pair cleanup after pairing finishes.` };
						} catch (err) {
							api.logger.warn?.(`device-pair: QR image send failed channel=${channel}, falling back (${String(err?.message ?? err)})`);
							await revokeDeviceBootstrapToken({ token: payload.bootstrapToken }).catch(() => {});
							payload = await issueSetupPayload(urlResult.url);
							setupCode = encodeSetupCode(payload);
						} finally {
							if (qrFilePath) await rm(path.dirname(qrFilePath), {
								recursive: true,
								force: true
							}).catch(() => {});
						}
					}
					api.logger.info?.(`device-pair: QR fallback channel=${channel} target=${target}`);
					if (channel === "webchat") {
						let qrDataUrl;
						try {
							qrDataUrl = await renderQrDataUrl(setupCode);
						} catch (err) {
							api.logger.warn?.(`device-pair: webchat QR render failed, falling back (${String(err?.message ?? err)})`);
							await revokeDeviceBootstrapToken({ token: payload.bootstrapToken }).catch(() => {});
							payload = await issueSetupPayload(urlResult.url);
							return { text: "QR image delivery is not available on this channel right now, so I generated a pasteable setup code instead.\n\n" + formatSetupReply(payload, authLabel) };
						}
						return { text: [
							"Scan this QR code with the OpenClaw iOS app:",
							"",
							formatQrInfoMarkdown({
								payload,
								authLabel,
								autoNotifyArmed,
								expiresAtMs: payload.expiresAtMs
							}),
							"",
							`![OpenClaw pairing QR](${qrDataUrl})`
						].join("\n") };
					}
					return { text: "QR image delivery is not available on this channel, so I generated a pasteable setup code instead.\n\n" + formatSetupReply(payload, authLabel) };
				}
				const channel = ctx.channel;
				const target = ctx.senderId?.trim() || ctx.from?.trim() || ctx.to?.trim() || "";
				const payload = await issueSetupPayload(urlResult.url);
				if (channel === "telegram" && target) try {
					const runtimeKeys = Object.keys(api.runtime ?? {});
					const channelKeys = Object.keys(api.runtime?.channel ?? {});
					api.logger.debug?.(`device-pair: runtime keys=${runtimeKeys.join(",") || "none"} channel keys=${channelKeys.join(",") || "none"}`);
					const send = api.runtime?.channel?.telegram?.sendMessageTelegram;
					if (!send) throw new Error(`telegram runtime unavailable (runtime keys: ${runtimeKeys.join(",")}; channel keys: ${channelKeys.join(",")})`);
					await send(target, formatSetupInstructions(payload.expiresAtMs), {
						...typeof ctx.messageThreadId === "number" ? { messageThreadId: ctx.messageThreadId } : {},
						...ctx.accountId ? { accountId: ctx.accountId } : {}
					});
					api.logger.info?.(`device-pair: telegram split send ok target=${target} account=${ctx.accountId ?? "none"} thread=${ctx.messageThreadId ?? "none"}`);
					return { text: encodeSetupCode(payload) };
				} catch (err) {
					api.logger.warn?.(`device-pair: telegram split send failed, falling back to single message (${String(err?.message ?? err)})`);
				}
				return { text: formatSetupReply(payload, authLabel) };
			}
		});
	}
});
//#endregion
export { device_pair_default as default };
