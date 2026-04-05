import { r as __exportAll } from "./chunk-iyeSoAlh.js";
import { i as testRegexWithBoundedInput, n as compileSafeRegexDetailed, r as hasNestedRepetition, t as compileSafeRegex } from "./safe-regex-tLlDZYfM.js";
import { a as resolveDmGroupAccessWithCommandGate, c as resolvePinnedMainDmOwnerFromAllowlist, i as resolveDmGroupAccessDecision, n as readStoreAllowFromForDmPolicy, o as resolveDmGroupAccessWithLists, r as resolveDmAllowState, s as resolveEffectiveAllowFromLists, t as DM_GROUP_ACCESS_REASON } from "./dm-policy-shared-C8YuyjhK.js";
import { a as mapHookExternalContentSource, c as wrapWebContent, i as isExternalHookSession, n as detectSuspiciousPatterns, o as resolveHookExternalContentSource, r as getHookType, s as wrapExternalContent, t as buildSafeExternalPrompt } from "./external-content-YqO3ih3d.js";
//#region src/security/channel-metadata.ts
const DEFAULT_MAX_CHARS = 800;
const DEFAULT_MAX_ENTRY_CHARS = 400;
function normalizeEntry(entry) {
	return entry.replace(/\s+/g, " ").trim();
}
function truncateText(value, maxChars) {
	if (maxChars <= 0) return "";
	if (value.length <= maxChars) return value;
	return `${value.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...`;
}
function buildUntrustedChannelMetadata(params) {
	const deduped = params.entries.map((entry) => typeof entry === "string" ? normalizeEntry(entry) : "").filter((entry) => Boolean(entry)).map((entry) => truncateText(entry, DEFAULT_MAX_ENTRY_CHARS)).filter((entry, index, list) => list.indexOf(entry) === index);
	if (deduped.length === 0) return;
	const body = deduped.join("\n");
	return wrapExternalContent(truncateText(`${`UNTRUSTED channel metadata (${params.source})`}\n${`${params.label}:\n${body}`}`, params.maxChars ?? DEFAULT_MAX_CHARS), {
		source: "channel_metadata",
		includeWarning: false
	});
}
//#endregion
//#region src/plugin-sdk/security-runtime.ts
var security_runtime_exports = /* @__PURE__ */ __exportAll({
	DM_GROUP_ACCESS_REASON: () => DM_GROUP_ACCESS_REASON,
	buildSafeExternalPrompt: () => buildSafeExternalPrompt,
	buildUntrustedChannelMetadata: () => buildUntrustedChannelMetadata,
	compileSafeRegex: () => compileSafeRegex,
	compileSafeRegexDetailed: () => compileSafeRegexDetailed,
	detectSuspiciousPatterns: () => detectSuspiciousPatterns,
	getHookType: () => getHookType,
	hasNestedRepetition: () => hasNestedRepetition,
	isExternalHookSession: () => isExternalHookSession,
	mapHookExternalContentSource: () => mapHookExternalContentSource,
	readStoreAllowFromForDmPolicy: () => readStoreAllowFromForDmPolicy,
	resolveDmAllowState: () => resolveDmAllowState,
	resolveDmGroupAccessDecision: () => resolveDmGroupAccessDecision,
	resolveDmGroupAccessWithCommandGate: () => resolveDmGroupAccessWithCommandGate,
	resolveDmGroupAccessWithLists: () => resolveDmGroupAccessWithLists,
	resolveEffectiveAllowFromLists: () => resolveEffectiveAllowFromLists,
	resolveHookExternalContentSource: () => resolveHookExternalContentSource,
	resolvePinnedMainDmOwnerFromAllowlist: () => resolvePinnedMainDmOwnerFromAllowlist,
	testRegexWithBoundedInput: () => testRegexWithBoundedInput,
	wrapExternalContent: () => wrapExternalContent,
	wrapWebContent: () => wrapWebContent
});
//#endregion
export { buildUntrustedChannelMetadata as n, security_runtime_exports as t };
