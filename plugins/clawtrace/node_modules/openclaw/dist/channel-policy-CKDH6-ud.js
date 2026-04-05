import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { t as resolveAccountEntry } from "./account-lookup-DdMcO0BU.js";
import { u as createScopedDmSecurityResolver } from "./channel-config-helpers-pbEU_d5U.js";
import { i as resolveOpenProviderRuntimeGroupPolicy, n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "./runtime-group-policy-Bde7-o8k.js";
import "./dm-policy-shared-C8YuyjhK.js";
//#region src/channels/plugins/group-policy-warnings.ts
function composeWarningCollectors(...collectors) {
	return (params) => collectors.flatMap((collector) => collector?.(params) ?? []);
}
function projectWarningCollector(project, collector) {
	return (params) => collector(project(params));
}
function projectConfigWarningCollector(collector) {
	return projectWarningCollector((params) => ({ cfg: params.cfg }), collector);
}
function projectConfigAccountIdWarningCollector(collector) {
	return projectWarningCollector((params) => ({
		cfg: params.cfg,
		accountId: params.accountId
	}), collector);
}
function projectAccountWarningCollector(collector) {
	return projectWarningCollector((params) => params.account, collector);
}
function projectAccountConfigWarningCollector(projectCfg, collector) {
	return projectWarningCollector((params) => ({
		account: params.account,
		cfg: projectCfg(params.cfg)
	}), collector);
}
function createConditionalWarningCollector(...collectors) {
	return (params) => collectors.flatMap((collector) => {
		const next = collector(params);
		if (!next) return [];
		return Array.isArray(next) ? next : [next];
	});
}
function composeAccountWarningCollectors(baseCollector, ...collectors) {
	return composeWarningCollectors(baseCollector, createConditionalWarningCollector(...collectors.map((collector) => ({ account }) => collector(account))));
}
function buildOpenGroupPolicyWarning(params) {
	return `- ${params.surface}: groupPolicy="open" ${params.openBehavior}. ${params.remediation}.`;
}
function buildOpenGroupPolicyRestrictSendersWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} to restrict senders`
	});
}
function buildOpenGroupPolicyNoRouteAllowlistWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `with no ${params.routeAllowlistPath} allowlist; any ${params.routeScope} can add + ping${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} or configure ${params.routeAllowlistPath}`
	});
}
function buildOpenGroupPolicyConfigureRouteAllowlistWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" and configure ${params.routeAllowlistPath}`
	});
}
function collectOpenGroupPolicyRestrictSendersWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	return [buildOpenGroupPolicyRestrictSendersWarning(params)];
}
function collectAllowlistProviderRestrictSendersWarnings(params) {
	return collectAllowlistProviderGroupPolicyWarnings({
		cfg: params.cfg,
		providerConfigPresent: params.providerConfigPresent,
		configuredGroupPolicy: params.configuredGroupPolicy,
		collect: (groupPolicy) => collectOpenGroupPolicyRestrictSendersWarnings({
			groupPolicy,
			surface: params.surface,
			openScope: params.openScope,
			groupPolicyPath: params.groupPolicyPath,
			groupAllowFromPath: params.groupAllowFromPath,
			mentionGated: params.mentionGated
		})
	});
}
/** Build an account-aware allowlist-provider warning collector for sender-restricted groups. */
function createAllowlistProviderRestrictSendersWarningCollector(params) {
	return createAllowlistProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ groupPolicy }) => collectOpenGroupPolicyRestrictSendersWarnings({
			groupPolicy,
			surface: params.surface,
			openScope: params.openScope,
			groupPolicyPath: params.groupPolicyPath,
			groupAllowFromPath: params.groupAllowFromPath,
			mentionGated: params.mentionGated
		})
	});
}
/** Build a direct account-aware warning collector when the policy already lives on the account. */
function createOpenGroupPolicyRestrictSendersWarningCollector(params) {
	return (account) => collectOpenGroupPolicyRestrictSendersWarnings({
		groupPolicy: params.resolveGroupPolicy(account) ?? params.defaultGroupPolicy ?? "allowlist",
		surface: params.surface,
		openScope: params.openScope,
		groupPolicyPath: params.groupPolicyPath,
		groupAllowFromPath: params.groupAllowFromPath,
		mentionGated: params.mentionGated
	});
}
function collectAllowlistProviderGroupPolicyWarnings(params) {
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.configuredGroupPolicy ?? void 0,
		defaultGroupPolicy
	});
	return params.collect(groupPolicy);
}
/** Build a config-aware allowlist-provider warning collector from an arbitrary policy resolver. */
function createAllowlistProviderGroupPolicyWarningCollector(params) {
	return (runtime) => collectAllowlistProviderGroupPolicyWarnings({
		cfg: runtime.cfg,
		providerConfigPresent: params.providerConfigPresent(runtime.cfg),
		configuredGroupPolicy: params.resolveGroupPolicy(runtime),
		collect: (groupPolicy) => params.collect({
			...runtime,
			groupPolicy
		})
	});
}
function collectOpenProviderGroupPolicyWarnings(params) {
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.configuredGroupPolicy ?? void 0,
		defaultGroupPolicy
	});
	return params.collect(groupPolicy);
}
/** Build a config-aware open-provider warning collector from an arbitrary policy resolver. */
function createOpenProviderGroupPolicyWarningCollector(params) {
	return (runtime) => collectOpenProviderGroupPolicyWarnings({
		cfg: runtime.cfg,
		providerConfigPresent: params.providerConfigPresent(runtime.cfg),
		configuredGroupPolicy: params.resolveGroupPolicy(runtime),
		collect: (groupPolicy) => params.collect({
			...runtime,
			groupPolicy
		})
	});
}
/** Build an account-aware allowlist-provider warning collector for simple open-policy warnings. */
function createAllowlistProviderOpenWarningCollector(params) {
	return createAllowlistProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ groupPolicy }) => groupPolicy === "open" ? [buildOpenGroupPolicyWarning(params.buildOpenWarning)] : []
	});
}
function collectOpenGroupPolicyRouteAllowlistWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	if (params.routeAllowlistConfigured) return [buildOpenGroupPolicyRestrictSendersWarning(params.restrictSenders)];
	return [buildOpenGroupPolicyNoRouteAllowlistWarning(params.noRouteAllowlist)];
}
/** Build an account-aware allowlist-provider warning collector for route-allowlisted groups. */
function createAllowlistProviderRouteAllowlistWarningCollector(params) {
	return createAllowlistProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ account, groupPolicy }) => collectOpenGroupPolicyRouteAllowlistWarnings({
			groupPolicy,
			routeAllowlistConfigured: params.resolveRouteAllowlistConfigured(account),
			restrictSenders: params.restrictSenders,
			noRouteAllowlist: params.noRouteAllowlist
		})
	});
}
function collectOpenGroupPolicyConfiguredRouteWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	if (params.routeAllowlistConfigured) return [buildOpenGroupPolicyConfigureRouteAllowlistWarning(params.configureRouteAllowlist)];
	return [buildOpenGroupPolicyWarning(params.missingRouteAllowlist)];
}
/** Build an account-aware open-provider warning collector for configured-route channels. */
function createOpenProviderConfiguredRouteWarningCollector(params) {
	return createOpenProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ account, groupPolicy }) => collectOpenGroupPolicyConfiguredRouteWarnings({
			groupPolicy,
			routeAllowlistConfigured: params.resolveRouteAllowlistConfigured(account),
			configureRouteAllowlist: params.configureRouteAllowlist,
			missingRouteAllowlist: params.missingRouteAllowlist
		})
	});
}
//#endregion
//#region src/config/types.tools.ts
const TOOLS_BY_SENDER_KEY_TYPES = [
	"id",
	"e164",
	"username",
	"name"
];
function parseToolsBySenderTypedKey(rawKey) {
	const trimmed = rawKey.trim();
	if (!trimmed) return;
	const lowered = trimmed.toLowerCase();
	for (const type of TOOLS_BY_SENDER_KEY_TYPES) {
		const prefix = `${type}:`;
		if (!lowered.startsWith(prefix)) continue;
		return {
			type,
			value: trimmed.slice(prefix.length)
		};
	}
}
//#endregion
//#region src/config/group-policy.ts
function resolveChannelGroupConfig(groups, groupId, caseInsensitive = false) {
	if (!groups) return;
	const direct = groups[groupId];
	if (direct) return direct;
	if (!caseInsensitive) return;
	const target = groupId.toLowerCase();
	const matchedKey = Object.keys(groups).find((key) => key !== "*" && key.toLowerCase() === target);
	if (!matchedKey) return;
	return groups[matchedKey];
}
const warnedLegacyToolsBySenderKeys = /* @__PURE__ */ new Set();
const compiledToolsBySenderCache = /* @__PURE__ */ new WeakMap();
function normalizeSenderKey(value, options = {}) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	return (options.stripLeadingAt && trimmed.startsWith("@") ? trimmed.slice(1) : trimmed).toLowerCase();
}
function normalizeTypedSenderKey(value, type) {
	return normalizeSenderKey(value, { stripLeadingAt: type === "username" });
}
function normalizeLegacySenderKey(value) {
	return normalizeSenderKey(value, { stripLeadingAt: true });
}
function warnLegacyToolsBySenderKey(rawKey) {
	const trimmed = rawKey.trim();
	if (!trimmed || warnedLegacyToolsBySenderKeys.has(trimmed)) return;
	warnedLegacyToolsBySenderKeys.add(trimmed);
	process.emitWarning(`toolsBySender key "${trimmed}" is deprecated. Use explicit prefixes (id:, e164:, username:, name:). Legacy unprefixed keys are matched as id only.`, {
		type: "DeprecationWarning",
		code: "OPENCLAW_TOOLS_BY_SENDER_UNTYPED_KEY"
	});
}
function parseSenderPolicyKey(rawKey) {
	const trimmed = rawKey.trim();
	if (!trimmed) return;
	if (trimmed === "*") return { kind: "wildcard" };
	const typed = parseToolsBySenderTypedKey(trimmed);
	if (typed) {
		const key = normalizeTypedSenderKey(typed.value, typed.type);
		if (!key) return;
		return {
			kind: "typed",
			type: typed.type,
			key
		};
	}
	warnLegacyToolsBySenderKey(trimmed);
	const key = normalizeLegacySenderKey(trimmed);
	if (!key) return;
	return {
		kind: "typed",
		type: "id",
		key
	};
}
function createSenderPolicyBuckets() {
	return {
		id: /* @__PURE__ */ new Map(),
		e164: /* @__PURE__ */ new Map(),
		username: /* @__PURE__ */ new Map(),
		name: /* @__PURE__ */ new Map()
	};
}
function compileToolsBySenderPolicy(toolsBySender) {
	const entries = Object.entries(toolsBySender);
	if (entries.length === 0) return;
	const buckets = createSenderPolicyBuckets();
	let wildcard;
	for (const [rawKey, policy] of entries) {
		if (!policy) continue;
		const parsed = parseSenderPolicyKey(rawKey);
		if (!parsed) continue;
		if (parsed.kind === "wildcard") {
			wildcard = policy;
			continue;
		}
		const bucket = buckets[parsed.type];
		if (!bucket.has(parsed.key)) bucket.set(parsed.key, policy);
	}
	return {
		buckets,
		wildcard
	};
}
function resolveCompiledToolsBySenderPolicy(toolsBySender) {
	const cached = compiledToolsBySenderCache.get(toolsBySender);
	if (cached) return cached;
	const compiled = compileToolsBySenderPolicy(toolsBySender);
	if (!compiled) return;
	compiledToolsBySenderCache.set(toolsBySender, compiled);
	return compiled;
}
function normalizeCandidate(value, type) {
	const trimmed = value?.trim();
	if (!trimmed) return "";
	return normalizeTypedSenderKey(trimmed, type);
}
function normalizeSenderIdCandidates(value) {
	const trimmed = value?.trim();
	if (!trimmed) return [];
	const typed = normalizeTypedSenderKey(trimmed, "id");
	const legacy = normalizeLegacySenderKey(trimmed);
	if (!typed) return legacy ? [legacy] : [];
	if (!legacy || legacy === typed) return [typed];
	return [typed, legacy];
}
function matchToolsBySenderPolicy(compiled, params) {
	for (const senderIdCandidate of normalizeSenderIdCandidates(params.senderId)) {
		const match = compiled.buckets.id.get(senderIdCandidate);
		if (match) return match;
	}
	const senderE164 = normalizeCandidate(params.senderE164, "e164");
	if (senderE164) {
		const match = compiled.buckets.e164.get(senderE164);
		if (match) return match;
	}
	const senderUsername = normalizeCandidate(params.senderUsername, "username");
	if (senderUsername) {
		const match = compiled.buckets.username.get(senderUsername);
		if (match) return match;
	}
	const senderName = normalizeCandidate(params.senderName, "name");
	if (senderName) {
		const match = compiled.buckets.name.get(senderName);
		if (match) return match;
	}
	return compiled.wildcard;
}
function resolveToolsBySender(params) {
	const toolsBySender = params.toolsBySender;
	if (!toolsBySender) return;
	const compiled = resolveCompiledToolsBySenderPolicy(toolsBySender);
	if (!compiled) return;
	return matchToolsBySenderPolicy(compiled, params);
}
function resolveChannelGroups(cfg, channel, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelConfig = cfg.channels?.[channel];
	if (!channelConfig) return;
	return resolveAccountEntry(channelConfig.accounts, normalizedAccountId)?.groups ?? channelConfig.groups;
}
function resolveChannelGroupPolicyMode(cfg, channel, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelConfig = cfg.channels?.[channel];
	if (!channelConfig) return;
	return resolveAccountEntry(channelConfig.accounts, normalizedAccountId)?.groupPolicy ?? channelConfig.groupPolicy;
}
function resolveChannelGroupPolicy(params) {
	const { cfg, channel } = params;
	const groups = resolveChannelGroups(cfg, channel, params.accountId);
	const groupPolicy = resolveChannelGroupPolicyMode(cfg, channel, params.accountId);
	const hasGroups = Boolean(groups && Object.keys(groups).length > 0);
	const allowlistEnabled = groupPolicy === "allowlist" || hasGroups;
	const normalizedId = params.groupId?.trim();
	const groupConfig = normalizedId ? resolveChannelGroupConfig(groups, normalizedId, params.groupIdCaseInsensitive) : void 0;
	const defaultConfig = groups?.["*"];
	const allowAll = allowlistEnabled && Boolean(groups && Object.hasOwn(groups, "*"));
	const senderFilterBypass = groupPolicy === "allowlist" && !hasGroups && Boolean(params.hasGroupAllowFrom);
	return {
		allowlistEnabled,
		allowed: groupPolicy === "disabled" ? false : !allowlistEnabled || allowAll || Boolean(groupConfig) || senderFilterBypass,
		groupConfig,
		defaultConfig
	};
}
function resolveChannelGroupRequireMention(params) {
	const { requireMentionOverride, overrideOrder = "after-config" } = params;
	const { groupConfig, defaultConfig } = resolveChannelGroupPolicy(params);
	const configMention = typeof groupConfig?.requireMention === "boolean" ? groupConfig.requireMention : typeof defaultConfig?.requireMention === "boolean" ? defaultConfig.requireMention : void 0;
	if (overrideOrder === "before-config" && typeof requireMentionOverride === "boolean") return requireMentionOverride;
	if (typeof configMention === "boolean") return configMention;
	if (overrideOrder !== "before-config" && typeof requireMentionOverride === "boolean") return requireMentionOverride;
	return true;
}
function resolveChannelGroupToolsPolicy(params) {
	const { groupConfig, defaultConfig } = resolveChannelGroupPolicy(params);
	const groupSenderPolicy = resolveToolsBySender({
		toolsBySender: groupConfig?.toolsBySender,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	if (groupSenderPolicy) return groupSenderPolicy;
	if (groupConfig?.tools) return groupConfig.tools;
	const defaultSenderPolicy = resolveToolsBySender({
		toolsBySender: defaultConfig?.toolsBySender,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	if (defaultSenderPolicy) return defaultSenderPolicy;
	if (defaultConfig?.tools) return defaultConfig.tools;
}
//#endregion
//#region src/plugin-sdk/channel-policy.ts
/** Compose the common DM policy resolver with restrict-senders group warnings. */
function createRestrictSendersChannelSecurity(params) {
	return {
		resolveDmPolicy: createScopedDmSecurityResolver({
			channelKey: params.channelKey,
			resolvePolicy: params.resolveDmPolicy,
			resolveAllowFrom: params.resolveDmAllowFrom,
			resolveFallbackAccountId: params.resolveFallbackAccountId,
			defaultPolicy: params.defaultDmPolicy,
			allowFromPathSuffix: params.allowFromPathSuffix,
			policyPathSuffix: params.policyPathSuffix,
			approveChannelId: params.approveChannelId,
			approveHint: params.approveHint,
			normalizeEntry: params.normalizeDmEntry
		}),
		collectWarnings: createAllowlistProviderRestrictSendersWarningCollector({
			providerConfigPresent: params.providerConfigPresent ?? ((cfg) => cfg.channels?.[params.channelKey] !== void 0),
			resolveGroupPolicy: params.resolveGroupPolicy,
			surface: params.surface,
			openScope: params.openScope,
			groupPolicyPath: params.groupPolicyPath,
			groupAllowFromPath: params.groupAllowFromPath,
			mentionGated: params.mentionGated
		})
	};
}
//#endregion
export { projectWarningCollector as A, createOpenGroupPolicyRestrictSendersWarningCollector as C, projectAccountWarningCollector as D, projectAccountConfigWarningCollector as E, projectConfigAccountIdWarningCollector as O, createConditionalWarningCollector as S, createOpenProviderGroupPolicyWarningCollector as T, composeWarningCollectors as _, resolveToolsBySender as a, createAllowlistProviderRestrictSendersWarningCollector as b, buildOpenGroupPolicyConfigureRouteAllowlistWarning as c, collectAllowlistProviderGroupPolicyWarnings as d, collectAllowlistProviderRestrictSendersWarnings as f, composeAccountWarningCollectors as g, collectOpenProviderGroupPolicyWarnings as h, resolveChannelGroupToolsPolicy as i, projectConfigWarningCollector as k, buildOpenGroupPolicyRestrictSendersWarning as l, collectOpenGroupPolicyRouteAllowlistWarnings as m, resolveChannelGroupPolicy as n, TOOLS_BY_SENDER_KEY_TYPES as o, collectOpenGroupPolicyRestrictSendersWarnings as p, resolveChannelGroupRequireMention as r, parseToolsBySenderTypedKey as s, createRestrictSendersChannelSecurity as t, buildOpenGroupPolicyWarning as u, createAllowlistProviderGroupPolicyWarningCollector as v, createOpenProviderConfiguredRouteWarningCollector as w, createAllowlistProviderRouteAllowlistWarningCollector as x, createAllowlistProviderOpenWarningCollector as y };
