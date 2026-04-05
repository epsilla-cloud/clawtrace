import { g as mapAllowFromEntries } from "./channel-config-helpers-pbEU_d5U.js";
//#region src/shared/string-sample.ts
function summarizeStringEntries(params) {
	const entries = params.entries ?? [];
	if (entries.length === 0) return params.emptyText ?? "";
	const limit = Math.max(1, Math.floor(params.limit ?? 6));
	const sample = entries.slice(0, limit);
	const suffix = entries.length > sample.length ? ` (+${entries.length - sample.length})` : "";
	return `${sample.join(", ")}${suffix}`;
}
//#endregion
//#region src/channels/allowlists/resolve-utils.ts
function dedupeAllowlistEntries(entries) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const entry of entries) {
		const normalized = entry.trim();
		if (!normalized) continue;
		const key = normalized.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(normalized);
	}
	return deduped;
}
function mergeAllowlist(params) {
	return dedupeAllowlistEntries([...mapAllowFromEntries(params.existing), ...params.additions]);
}
function buildAllowlistResolutionSummary(resolvedUsers, opts) {
	const resolvedMap = new Map(resolvedUsers.map((entry) => [entry.input, entry]));
	const resolvedOk = (entry) => Boolean(entry.resolved && entry.id);
	const formatResolved = opts?.formatResolved ?? ((entry) => `${entry.input}→${entry.id}`);
	const formatUnresolved = opts?.formatUnresolved ?? ((entry) => entry.input);
	const mapping = resolvedUsers.filter(resolvedOk).map(formatResolved);
	const additions = resolvedUsers.filter(resolvedOk).map((entry) => entry.id).filter((entry) => Boolean(entry));
	return {
		resolvedMap,
		mapping,
		unresolved: resolvedUsers.filter((entry) => !resolvedOk(entry)).map(formatUnresolved),
		additions
	};
}
function resolveAllowlistIdAdditions(params) {
	const additions = [];
	for (const entry of params.existing) {
		const trimmed = String(entry).trim();
		const resolved = params.resolvedMap.get(trimmed);
		if (resolved?.resolved && resolved.id) additions.push(resolved.id);
	}
	return additions;
}
function canonicalizeAllowlistWithResolvedIds(params) {
	const canonicalized = [];
	for (const entry of params.existing ?? []) {
		const trimmed = String(entry).trim();
		if (!trimmed) continue;
		if (trimmed === "*") {
			canonicalized.push(trimmed);
			continue;
		}
		const resolved = params.resolvedMap.get(trimmed);
		canonicalized.push(resolved?.resolved && resolved.id ? resolved.id : trimmed);
	}
	return dedupeAllowlistEntries(canonicalized);
}
function patchAllowlistUsersInConfigEntries(params) {
	const nextEntries = { ...params.entries };
	for (const [entryKey, entryConfig] of Object.entries(params.entries)) {
		if (!entryConfig || typeof entryConfig !== "object") continue;
		const users = entryConfig.users;
		if (!Array.isArray(users) || users.length === 0) continue;
		const resolvedUsers = params.strategy === "canonicalize" ? canonicalizeAllowlistWithResolvedIds({
			existing: users,
			resolvedMap: params.resolvedMap
		}) : mergeAllowlist({
			existing: users,
			additions: resolveAllowlistIdAdditions({
				existing: users,
				resolvedMap: params.resolvedMap
			})
		});
		nextEntries[entryKey] = {
			...entryConfig,
			users: resolvedUsers
		};
	}
	return nextEntries;
}
function addAllowlistUserEntriesFromConfigEntry(target, entry) {
	if (!entry || typeof entry !== "object") return;
	const users = entry.users;
	if (!Array.isArray(users)) return;
	for (const value of users) {
		const trimmed = String(value).trim();
		if (trimmed && trimmed !== "*") target.add(trimmed);
	}
}
function summarizeMapping(label, mapping, unresolved, runtime) {
	const lines = [];
	if (mapping.length > 0) lines.push(`${label} resolved: ${summarizeStringEntries({
		entries: mapping,
		limit: 6
	})}`);
	if (unresolved.length > 0) lines.push(`${label} unresolved: ${summarizeStringEntries({
		entries: unresolved,
		limit: 6
	})}`);
	if (lines.length > 0) runtime.log?.(lines.join("\n"));
}
//#endregion
//#region src/plugin-sdk/allow-from.ts
/** Lowercase and optionally strip prefixes from allowlist entries before sender comparisons. */
function formatAllowFromLowercase(params) {
	return params.allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map((entry) => params.stripPrefixRe ? entry.replace(params.stripPrefixRe, "") : entry).map((entry) => entry.toLowerCase());
}
/** Normalize allowlist entries through a channel-provided parser or canonicalizer. */
function formatNormalizedAllowFromEntries(params) {
	return params.allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map((entry) => params.normalizeEntry(entry)).filter((entry) => Boolean(entry));
}
/** Check whether a sender id matches a simple normalized allowlist with wildcard support. */
function isNormalizedSenderAllowed(params) {
	const normalizedAllow = formatAllowFromLowercase({
		allowFrom: params.allowFrom,
		stripPrefixRe: params.stripPrefixRe
	});
	if (normalizedAllow.length === 0) return false;
	if (normalizedAllow.includes("*")) return true;
	const sender = String(params.senderId).trim().toLowerCase();
	return normalizedAllow.includes(sender);
}
/** Match chat-aware allowlist entries against sender, chat id, guid, or identifier fields. */
function isAllowedParsedChatSender(params) {
	const allowFrom = params.allowFrom.map((entry) => String(entry).trim());
	if (allowFrom.length === 0) return false;
	if (allowFrom.includes("*")) return true;
	const senderNormalized = params.normalizeSender(params.sender);
	const chatId = params.chatId ?? void 0;
	const chatGuid = params.chatGuid?.trim();
	const chatIdentifier = params.chatIdentifier?.trim();
	for (const entry of allowFrom) {
		if (!entry) continue;
		const parsed = params.parseAllowTarget(entry);
		if (parsed.kind === "chat_id" && chatId !== void 0) {
			if (parsed.chatId === chatId) return true;
		} else if (parsed.kind === "chat_guid" && chatGuid) {
			if (parsed.chatGuid === chatGuid) return true;
		} else if (parsed.kind === "chat_identifier" && chatIdentifier) {
			if (parsed.chatIdentifier === chatIdentifier) return true;
		} else if (parsed.kind === "handle" && senderNormalized) {
			if (parsed.handle === senderNormalized) return true;
		}
	}
	return false;
}
/** Clone allowlist resolution entries into a plain serializable shape for UI and docs output. */
function mapBasicAllowlistResolutionEntries(entries) {
	return entries.map((entry) => ({
		input: entry.input,
		resolved: entry.resolved,
		id: entry.id,
		name: entry.name,
		note: entry.note
	}));
}
/** Map allowlist inputs sequentially so resolver side effects stay ordered and predictable. */
async function mapAllowlistResolutionInputs(params) {
	const results = [];
	for (const input of params.inputs) results.push(await params.mapInput(input));
	return results;
}
//#endregion
export { mapAllowlistResolutionInputs as a, buildAllowlistResolutionSummary as c, patchAllowlistUsersInConfigEntries as d, summarizeMapping as f, isNormalizedSenderAllowed as i, canonicalizeAllowlistWithResolvedIds as l, formatNormalizedAllowFromEntries as n, mapBasicAllowlistResolutionEntries as o, summarizeStringEntries as p, isAllowedParsedChatSender as r, addAllowlistUserEntriesFromConfigEntry as s, formatAllowFromLowercase as t, mergeAllowlist as u };
