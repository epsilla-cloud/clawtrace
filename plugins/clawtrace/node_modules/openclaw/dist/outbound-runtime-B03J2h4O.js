import { v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { i as isAvatarHttpUrl, o as isPathWithinRoot, r as isAvatarDataUrl, s as isSupportedLocalAvatarExtension } from "./avatar-policy-CuJInP3G.js";
import { n as loadAgentIdentityFromWorkspace } from "./identity-file-C5OmkxzZ.js";
import { n as resolveAgentIdentity } from "./identity-DAzQ7qLa.js";
import fsSync from "node:fs";
import path from "node:path";
//#region src/agents/identity-avatar.ts
function normalizeAvatarValue(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}
function resolveAvatarSource(cfg, agentId) {
	const fromConfig = normalizeAvatarValue(resolveAgentIdentity(cfg, agentId)?.avatar);
	if (fromConfig) return fromConfig;
	return normalizeAvatarValue(loadAgentIdentityFromWorkspace(resolveAgentWorkspaceDir(cfg, agentId))?.avatar);
}
function resolveExistingPath(value) {
	try {
		return fsSync.realpathSync(value);
	} catch {
		return path.resolve(value);
	}
}
function resolveLocalAvatarPath(params) {
	const workspaceRoot = resolveExistingPath(params.workspaceDir);
	const raw = params.raw;
	const realPath = resolveExistingPath(raw.startsWith("~") || path.isAbsolute(raw) ? resolveUserPath(raw) : path.resolve(workspaceRoot, raw));
	if (!isPathWithinRoot(workspaceRoot, realPath)) return {
		ok: false,
		reason: "outside_workspace"
	};
	if (!isSupportedLocalAvatarExtension(realPath)) return {
		ok: false,
		reason: "unsupported_extension"
	};
	try {
		const stat = fsSync.statSync(realPath);
		if (!stat.isFile()) return {
			ok: false,
			reason: "missing"
		};
		if (stat.size > 2097152) return {
			ok: false,
			reason: "too_large"
		};
	} catch {
		return {
			ok: false,
			reason: "missing"
		};
	}
	return {
		ok: true,
		filePath: realPath
	};
}
function resolveAgentAvatar(cfg, agentId) {
	const source = resolveAvatarSource(cfg, agentId);
	if (!source) return {
		kind: "none",
		reason: "missing"
	};
	if (isAvatarHttpUrl(source)) return {
		kind: "remote",
		url: source
	};
	if (isAvatarDataUrl(source)) return {
		kind: "data",
		url: source
	};
	const resolved = resolveLocalAvatarPath({
		raw: source,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	});
	if (!resolved.ok) return {
		kind: "none",
		reason: resolved.reason
	};
	return {
		kind: "local",
		filePath: resolved.filePath
	};
}
//#endregion
//#region src/infra/outbound/send-deps.ts
const LEGACY_SEND_DEP_KEYS = {
	whatsapp: "sendWhatsApp",
	telegram: "sendTelegram",
	discord: "sendDiscord",
	slack: "sendSlack",
	signal: "sendSignal",
	imessage: "sendIMessage",
	matrix: "sendMatrix",
	msteams: "sendMSTeams"
};
function resolveOutboundSendDep(deps, channelId) {
	const dynamic = deps?.[channelId];
	if (dynamic !== void 0) return dynamic;
	const legacyKey = LEGACY_SEND_DEP_KEYS[channelId];
	return deps?.[legacyKey];
}
//#endregion
//#region src/infra/outbound/identity.ts
function normalizeOutboundIdentity(identity) {
	if (!identity) return;
	const name = identity.name?.trim() || void 0;
	const avatarUrl = identity.avatarUrl?.trim() || void 0;
	const emoji = identity.emoji?.trim() || void 0;
	const theme = identity.theme?.trim() || void 0;
	if (!name && !avatarUrl && !emoji && !theme) return;
	return {
		name,
		avatarUrl,
		emoji,
		theme
	};
}
function resolveAgentOutboundIdentity(cfg, agentId) {
	const agentIdentity = resolveAgentIdentity(cfg, agentId);
	const avatar = resolveAgentAvatar(cfg, agentId);
	return normalizeOutboundIdentity({
		name: agentIdentity?.name,
		emoji: agentIdentity?.emoji,
		avatarUrl: avatar.kind === "remote" ? avatar.url : void 0,
		theme: agentIdentity?.theme
	});
}
//#endregion
export { resolveAgentAvatar as i, resolveAgentOutboundIdentity as n, resolveOutboundSendDep as r, normalizeOutboundIdentity as t };
