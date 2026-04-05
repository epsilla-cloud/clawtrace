import { $f as resolveTokenExpiryState, Qf as evaluateStoredCredentialEligibility, qL as resolveAuthProfileDisplayLabel } from "./auth-profiles-B5ypC5S-.js";
import { r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
//#region src/agents/auth-health.ts
const DEFAULT_OAUTH_WARN_MS = 1440 * 60 * 1e3;
function resolveAuthProfileSource(_profileId) {
	return "store";
}
function formatRemainingShort(remainingMs, opts) {
	if (remainingMs === void 0 || Number.isNaN(remainingMs)) return "unknown";
	if (remainingMs <= 0) return "0m";
	const roundedMinutes = Math.round(remainingMs / 6e4);
	if (roundedMinutes < 1) return opts?.underMinuteLabel ?? "1m";
	const minutes = roundedMinutes;
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.round(minutes / 60);
	if (hours < 48) return `${hours}h`;
	return `${Math.round(hours / 24)}d`;
}
function resolveOAuthStatus(expiresAt, now, warnAfterMs) {
	if (!expiresAt || !Number.isFinite(expiresAt) || expiresAt <= 0) return { status: "missing" };
	const remainingMs = expiresAt - now;
	if (remainingMs <= 0) return {
		status: "expired",
		remainingMs
	};
	if (remainingMs <= warnAfterMs) return {
		status: "expiring",
		remainingMs
	};
	return {
		status: "ok",
		remainingMs
	};
}
function buildProfileHealth(params) {
	const { profileId, credential, store, cfg, now, warnAfterMs } = params;
	const label = resolveAuthProfileDisplayLabel({
		cfg,
		store,
		profileId
	});
	const source = resolveAuthProfileSource(profileId);
	const provider = normalizeProviderId(credential.provider);
	if (credential.type === "api_key") return {
		profileId,
		provider,
		type: "api_key",
		status: "static",
		source,
		label
	};
	if (credential.type === "token") {
		const eligibility = evaluateStoredCredentialEligibility({
			credential,
			now
		});
		if (!eligibility.eligible) return {
			profileId,
			provider,
			type: "token",
			status: eligibility.reasonCode === "expired" ? "expired" : "missing",
			reasonCode: eligibility.reasonCode,
			source,
			label
		};
		const expiresAt = resolveTokenExpiryState(credential.expires, now) === "valid" ? credential.expires : void 0;
		if (!expiresAt) return {
			profileId,
			provider,
			type: "token",
			status: "static",
			source,
			label
		};
		const { status, remainingMs } = resolveOAuthStatus(expiresAt, now, warnAfterMs);
		return {
			profileId,
			provider,
			type: "token",
			status,
			reasonCode: status === "expired" ? "expired" : void 0,
			expiresAt,
			remainingMs,
			source,
			label
		};
	}
	const hasRefreshToken = typeof credential.refresh === "string" && credential.refresh.length > 0;
	const { status: rawStatus, remainingMs } = resolveOAuthStatus(credential.expires, now, warnAfterMs);
	return {
		profileId,
		provider,
		type: "oauth",
		status: hasRefreshToken && (rawStatus === "expired" || rawStatus === "expiring") ? "ok" : rawStatus,
		expiresAt: credential.expires,
		remainingMs,
		source,
		label
	};
}
function buildAuthHealthSummary(params) {
	const now = Date.now();
	const warnAfterMs = params.warnAfterMs ?? 864e5;
	const providerFilter = params.providers ? new Set(params.providers.map((p) => normalizeProviderId(p)).filter(Boolean)) : null;
	const profiles = Object.entries(params.store.profiles).filter(([_, cred]) => providerFilter ? providerFilter.has(normalizeProviderId(cred.provider)) : true).map(([profileId, credential]) => buildProfileHealth({
		profileId,
		credential,
		store: params.store,
		cfg: params.cfg,
		now,
		warnAfterMs
	})).toSorted((a, b) => {
		if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
		return a.profileId.localeCompare(b.profileId);
	});
	const providersMap = /* @__PURE__ */ new Map();
	for (const profile of profiles) {
		const existing = providersMap.get(profile.provider);
		if (!existing) providersMap.set(profile.provider, {
			provider: profile.provider,
			status: "missing",
			profiles: [profile]
		});
		else existing.profiles.push(profile);
	}
	if (providerFilter) {
		for (const provider of providerFilter) if (!providersMap.has(provider)) providersMap.set(provider, {
			provider,
			status: "missing",
			profiles: []
		});
	}
	for (const provider of providersMap.values()) {
		if (provider.profiles.length === 0) {
			provider.status = "missing";
			continue;
		}
		const oauthProfiles = provider.profiles.filter((p) => p.type === "oauth");
		const tokenProfiles = provider.profiles.filter((p) => p.type === "token");
		const apiKeyProfiles = provider.profiles.filter((p) => p.type === "api_key");
		const expirable = [...oauthProfiles, ...tokenProfiles];
		if (expirable.length === 0) {
			provider.status = apiKeyProfiles.length > 0 ? "static" : "missing";
			continue;
		}
		const expiryCandidates = expirable.map((p) => p.expiresAt).filter((v) => typeof v === "number" && Number.isFinite(v));
		if (expiryCandidates.length > 0) {
			provider.expiresAt = Math.min(...expiryCandidates);
			provider.remainingMs = provider.expiresAt - now;
		}
		const statuses = new Set(expirable.map((p) => p.status));
		if (statuses.has("expired") || statuses.has("missing")) provider.status = "expired";
		else if (statuses.has("expiring")) provider.status = "expiring";
		else provider.status = "ok";
	}
	return {
		now,
		warnAfterMs,
		profiles,
		providers: Array.from(providersMap.values()).toSorted((a, b) => a.provider.localeCompare(b.provider))
	};
}
//#endregion
export { buildAuthHealthSummary as n, formatRemainingShort as r, DEFAULT_OAUTH_WARN_MS as t };
