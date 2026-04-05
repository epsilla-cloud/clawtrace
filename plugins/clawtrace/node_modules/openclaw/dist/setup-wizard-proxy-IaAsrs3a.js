import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { c as moveSingleAccountChannelSectionToDefaultAccount, l as patchScopedAccountConfig } from "./setup-helpers-D9SEfBub.js";
import { t as detectBinary } from "./setup-binary-KLZwkyo2.js";
import { t as resolveSecretInputModeForEnvSelection } from "./provider-auth-mode-DdP_8HfA.js";
//#region src/channels/plugins/setup-wizard-helpers.ts
let providerAuthInputPromise;
function loadProviderAuthInput() {
	providerAuthInputPromise ??= import("./provider-auth-ref-CgD6MYMF.js");
	return providerAuthInputPromise;
}
const promptAccountId = async (params) => {
	const existingIds = params.listAccountIds(params.cfg);
	const initial = params.currentId?.trim() || params.defaultAccountId || "default";
	const choice = await params.prompter.select({
		message: `${params.label} account`,
		options: [...existingIds.map((id) => ({
			value: id,
			label: id === "default" ? "default (primary)" : id
		})), {
			value: "__new__",
			label: "Add a new account"
		}],
		initialValue: initial
	});
	if (choice !== "__new__") return normalizeAccountId(choice);
	const entered = await params.prompter.text({
		message: `New ${params.label} account id`,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const normalized = normalizeAccountId(String(entered));
	if (String(entered).trim() !== normalized) await params.prompter.note(`Normalized account id to "${normalized}".`, `${params.label} account`);
	return normalized;
};
function addWildcardAllowFrom(allowFrom) {
	const next = (allowFrom ?? []).map((v) => String(v).trim()).filter(Boolean);
	if (!next.includes("*")) next.push("*");
	return next;
}
function mergeAllowFromEntries(current, additions) {
	const merged = [...current ?? [], ...additions].map((v) => String(v).trim()).filter(Boolean);
	return [...new Set(merged)];
}
function splitSetupEntries(raw) {
	return raw.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
}
function parseSetupEntriesWithParser(raw, parseEntry) {
	const parts = splitSetupEntries(String(raw ?? ""));
	const entries = [];
	for (const part of parts) {
		const parsed = parseEntry(part);
		if ("error" in parsed) return {
			entries: [],
			error: parsed.error
		};
		entries.push(parsed.value);
	}
	return { entries: normalizeAllowFromEntries(entries) };
}
function parseSetupEntriesAllowingWildcard(raw, parseEntry) {
	return parseSetupEntriesWithParser(raw, (entry) => {
		if (entry === "*") return { value: "*" };
		return parseEntry(entry);
	});
}
function parseMentionOrPrefixedId(params) {
	const trimmed = params.value.trim();
	if (!trimmed) return null;
	const mentionMatch = trimmed.match(params.mentionPattern);
	if (mentionMatch?.[1]) return params.normalizeId ? params.normalizeId(mentionMatch[1]) : mentionMatch[1];
	const stripped = params.prefixPattern ? trimmed.replace(params.prefixPattern, "") : trimmed;
	if (!params.idPattern.test(stripped)) return null;
	return params.normalizeId ? params.normalizeId(stripped) : stripped;
}
function normalizeAllowFromEntries(entries, normalizeEntry) {
	const normalized = entries.map((entry) => String(entry).trim()).filter(Boolean).map((entry) => {
		if (entry === "*") return "*";
		if (!normalizeEntry) return entry;
		const value = normalizeEntry(entry);
		return typeof value === "string" ? value.trim() : "";
	}).filter(Boolean);
	return [...new Set(normalized)];
}
function createStandardChannelSetupStatus(params) {
	const status = {
		configuredLabel: params.configuredLabel,
		unconfiguredLabel: params.unconfiguredLabel,
		resolveConfigured: params.resolveConfigured,
		...params.configuredHint ? { configuredHint: params.configuredHint } : {},
		...params.unconfiguredHint ? { unconfiguredHint: params.unconfiguredHint } : {},
		...typeof params.configuredScore === "number" ? { configuredScore: params.configuredScore } : {},
		...typeof params.unconfiguredScore === "number" ? { unconfiguredScore: params.unconfiguredScore } : {}
	};
	if (params.includeStatusLine || params.resolveExtraStatusLines) status.resolveStatusLines = async ({ cfg, configured }) => {
		const lines = params.includeStatusLine ? [`${params.channelLabel}: ${configured ? params.configuredLabel : params.unconfiguredLabel}`] : [];
		const extraLines = await params.resolveExtraStatusLines?.({
			cfg,
			configured
		}) ?? [];
		return [...lines, ...extraLines];
	};
	return status;
}
function resolveSetupAccountId(params) {
	return params.accountId?.trim() ? normalizeAccountId(params.accountId) : params.defaultAccountId;
}
async function resolveAccountIdForConfigure(params) {
	const override = params.accountOverride?.trim();
	let accountId = override ? normalizeAccountId(override) : params.defaultAccountId;
	if (params.shouldPromptAccountIds && !override) accountId = await promptAccountId({
		cfg: params.cfg,
		prompter: params.prompter,
		label: params.label,
		currentId: accountId,
		listAccountIds: params.listAccountIds,
		defaultAccountId: params.defaultAccountId
	});
	return accountId;
}
function setAccountAllowFromForChannel(params) {
	const { cfg, channel, accountId, allowFrom } = params;
	return patchConfigForScopedAccount({
		cfg,
		channel,
		accountId,
		patch: { allowFrom },
		ensureEnabled: false
	});
}
function patchTopLevelChannelConfigSection(params) {
	const channelConfig = { ...params.cfg.channels?.[params.channel] };
	for (const field of params.clearFields ?? []) delete channelConfig[field];
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channel]: {
				...channelConfig,
				...params.enabled ? { enabled: true } : {},
				...params.patch
			}
		}
	};
}
function patchNestedChannelConfigSection(params) {
	const channelConfig = { ...params.cfg.channels?.[params.channel] };
	const sectionConfig = { ...channelConfig[params.section] };
	for (const field of params.clearFields ?? []) delete sectionConfig[field];
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channel]: {
				...channelConfig,
				...params.enabled ? { enabled: true } : {},
				[params.section]: {
					...sectionConfig,
					...params.patch
				}
			}
		}
	};
}
function setTopLevelChannelAllowFrom(params) {
	return patchTopLevelChannelConfigSection({
		cfg: params.cfg,
		channel: params.channel,
		enabled: params.enabled,
		patch: { allowFrom: params.allowFrom }
	});
}
function setNestedChannelAllowFrom(params) {
	return patchNestedChannelConfigSection({
		cfg: params.cfg,
		channel: params.channel,
		section: params.section,
		enabled: params.enabled,
		patch: { allowFrom: params.allowFrom }
	});
}
function setTopLevelChannelDmPolicyWithAllowFrom(params) {
	const channelConfig = params.cfg.channels?.[params.channel] ?? {};
	const existingAllowFrom = params.getAllowFrom?.(params.cfg) ?? channelConfig.allowFrom ?? void 0;
	const allowFrom = params.dmPolicy === "open" ? addWildcardAllowFrom(existingAllowFrom) : void 0;
	return patchTopLevelChannelConfigSection({
		cfg: params.cfg,
		channel: params.channel,
		patch: {
			dmPolicy: params.dmPolicy,
			...allowFrom ? { allowFrom } : {}
		}
	});
}
function setNestedChannelDmPolicyWithAllowFrom(params) {
	const sectionConfig = (params.cfg.channels?.[params.channel] ?? {})[params.section] ?? {};
	const existingAllowFrom = params.getAllowFrom?.(params.cfg) ?? sectionConfig.allowFrom ?? void 0;
	const allowFrom = params.dmPolicy === "open" ? addWildcardAllowFrom(existingAllowFrom) : void 0;
	return patchNestedChannelConfigSection({
		cfg: params.cfg,
		channel: params.channel,
		section: params.section,
		enabled: params.enabled,
		patch: {
			policy: params.dmPolicy,
			...allowFrom ? { allowFrom } : {}
		}
	});
}
function setTopLevelChannelGroupPolicy(params) {
	return patchTopLevelChannelConfigSection({
		cfg: params.cfg,
		channel: params.channel,
		enabled: params.enabled,
		patch: { groupPolicy: params.groupPolicy }
	});
}
function createTopLevelChannelDmPolicy(params) {
	const setPolicy = createTopLevelChannelDmPolicySetter({
		channel: params.channel,
		getAllowFrom: params.getAllowFrom
	});
	return {
		label: params.label,
		channel: params.channel,
		policyKey: params.policyKey,
		allowFromKey: params.allowFromKey,
		getCurrent: params.getCurrent,
		setPolicy,
		...params.promptAllowFrom ? { promptAllowFrom: params.promptAllowFrom } : {}
	};
}
function createNestedChannelDmPolicy(params) {
	const setPolicy = createNestedChannelDmPolicySetter({
		channel: params.channel,
		section: params.section,
		getAllowFrom: params.getAllowFrom,
		enabled: params.enabled
	});
	return {
		label: params.label,
		channel: params.channel,
		policyKey: params.policyKey,
		allowFromKey: params.allowFromKey,
		getCurrent: params.getCurrent,
		setPolicy,
		...params.promptAllowFrom ? { promptAllowFrom: params.promptAllowFrom } : {}
	};
}
function createTopLevelChannelDmPolicySetter(params) {
	return (cfg, dmPolicy) => setTopLevelChannelDmPolicyWithAllowFrom({
		cfg,
		channel: params.channel,
		dmPolicy,
		getAllowFrom: params.getAllowFrom
	});
}
function createNestedChannelDmPolicySetter(params) {
	return (cfg, dmPolicy) => setNestedChannelDmPolicyWithAllowFrom({
		cfg,
		channel: params.channel,
		section: params.section,
		dmPolicy,
		getAllowFrom: params.getAllowFrom,
		enabled: params.enabled
	});
}
function createTopLevelChannelAllowFromSetter(params) {
	return (cfg, allowFrom) => setTopLevelChannelAllowFrom({
		cfg,
		channel: params.channel,
		allowFrom,
		enabled: params.enabled
	});
}
function createNestedChannelAllowFromSetter(params) {
	return (cfg, allowFrom) => setNestedChannelAllowFrom({
		cfg,
		channel: params.channel,
		section: params.section,
		allowFrom,
		enabled: params.enabled
	});
}
function createTopLevelChannelGroupPolicySetter(params) {
	return (cfg, groupPolicy) => setTopLevelChannelGroupPolicy({
		cfg,
		channel: params.channel,
		groupPolicy,
		enabled: params.enabled
	});
}
function setChannelDmPolicyWithAllowFrom(params) {
	const { cfg, channel, dmPolicy } = params;
	const allowFrom = dmPolicy === "open" ? addWildcardAllowFrom(cfg.channels?.[channel]?.allowFrom) : void 0;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			[channel]: {
				...cfg.channels?.[channel],
				dmPolicy,
				...allowFrom ? { allowFrom } : {}
			}
		}
	};
}
function setLegacyChannelDmPolicyWithAllowFrom(params) {
	const channelConfig = params.cfg.channels?.[params.channel] ?? {
		allowFrom: void 0,
		dm: void 0
	};
	const existingAllowFrom = channelConfig.allowFrom ?? channelConfig.dm?.allowFrom;
	const allowFrom = params.dmPolicy === "open" ? addWildcardAllowFrom(existingAllowFrom) : void 0;
	return patchLegacyDmChannelConfig({
		cfg: params.cfg,
		channel: params.channel,
		patch: {
			dmPolicy: params.dmPolicy,
			...allowFrom ? { allowFrom } : {}
		}
	});
}
function setLegacyChannelAllowFrom(params) {
	return patchLegacyDmChannelConfig({
		cfg: params.cfg,
		channel: params.channel,
		patch: { allowFrom: params.allowFrom }
	});
}
function setAccountGroupPolicyForChannel(params) {
	return patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		patch: { groupPolicy: params.groupPolicy }
	});
}
function setAccountDmAllowFromForChannel(params) {
	return patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		patch: {
			dmPolicy: "allowlist",
			allowFrom: params.allowFrom
		}
	});
}
function createLegacyCompatChannelDmPolicy(params) {
	return {
		label: params.label,
		channel: params.channel,
		policyKey: `channels.${params.channel}.dmPolicy`,
		allowFromKey: `channels.${params.channel}.allowFrom`,
		getCurrent: (cfg) => (cfg.channels?.[params.channel])?.dmPolicy ?? (cfg.channels?.[params.channel])?.dm?.policy ?? "pairing",
		setPolicy: (cfg, policy) => setLegacyChannelDmPolicyWithAllowFrom({
			cfg,
			channel: params.channel,
			dmPolicy: policy
		}),
		...params.promptAllowFrom ? { promptAllowFrom: params.promptAllowFrom } : {}
	};
}
async function resolveGroupAllowlistWithLookupNotes(params) {
	try {
		return await params.resolve();
	} catch (error) {
		await noteChannelLookupFailure({
			prompter: params.prompter,
			label: params.label,
			error
		});
		await noteChannelLookupSummary({
			prompter: params.prompter,
			label: params.label,
			resolvedSections: [],
			unresolved: params.entries
		});
		return params.fallback;
	}
}
function createAccountScopedAllowFromSection(params) {
	return {
		...params.helpTitle ? { helpTitle: params.helpTitle } : {},
		...params.helpLines ? { helpLines: params.helpLines } : {},
		...params.credentialInputKey ? { credentialInputKey: params.credentialInputKey } : {},
		message: params.message,
		placeholder: params.placeholder,
		invalidWithoutCredentialNote: params.invalidWithoutCredentialNote,
		parseId: params.parseId,
		resolveEntries: params.resolveEntries,
		apply: ({ cfg, accountId, allowFrom }) => setAccountDmAllowFromForChannel({
			cfg,
			channel: params.channel,
			accountId,
			allowFrom
		})
	};
}
function createAccountScopedGroupAccessSection(params) {
	return {
		label: params.label,
		placeholder: params.placeholder,
		...params.helpTitle ? { helpTitle: params.helpTitle } : {},
		...params.helpLines ? { helpLines: params.helpLines } : {},
		...params.skipAllowlistEntries ? { skipAllowlistEntries: true } : {},
		currentPolicy: params.currentPolicy,
		currentEntries: params.currentEntries,
		updatePrompt: params.updatePrompt,
		setPolicy: ({ cfg, accountId, policy }) => setAccountGroupPolicyForChannel({
			cfg,
			channel: params.channel,
			accountId,
			groupPolicy: policy
		}),
		...params.resolveAllowlist ? { resolveAllowlist: ({ cfg, accountId, credentialValues, entries, prompter }) => resolveGroupAllowlistWithLookupNotes({
			label: params.label,
			prompter,
			entries,
			fallback: params.fallbackResolved(entries),
			resolve: async () => await params.resolveAllowlist({
				cfg,
				accountId,
				credentialValues,
				entries,
				prompter
			})
		}) } : {},
		applyAllowlist: ({ cfg, accountId, resolved }) => params.applyAllowlist({
			cfg,
			accountId,
			resolved
		})
	};
}
function patchLegacyDmChannelConfig(params) {
	const { cfg, channel, patch } = params;
	const channelConfig = cfg.channels?.[channel] ?? {};
	const dmConfig = channelConfig.dm ?? {};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			[channel]: {
				...channelConfig,
				...patch,
				dm: {
					...dmConfig,
					enabled: typeof dmConfig.enabled === "boolean" ? dmConfig.enabled : true
				}
			}
		}
	};
}
function setSetupChannelEnabled(cfg, channel, enabled) {
	const channelConfig = cfg.channels?.[channel] ?? {};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			[channel]: {
				...channelConfig,
				enabled
			}
		}
	};
}
function patchConfigForScopedAccount(params) {
	const { cfg, channel, accountId, patch, ensureEnabled } = params;
	return patchScopedAccountConfig({
		cfg: accountId === "default" ? cfg : moveSingleAccountChannelSectionToDefaultAccount({
			cfg,
			channelKey: channel
		}),
		channelKey: channel,
		accountId,
		patch,
		ensureChannelEnabled: ensureEnabled,
		ensureAccountEnabled: ensureEnabled
	});
}
function patchChannelConfigForAccount(params) {
	return patchConfigForScopedAccount({
		...params,
		ensureEnabled: true
	});
}
function buildSingleChannelSecretPromptState(params) {
	return {
		accountConfigured: params.accountConfigured,
		hasConfigToken: params.hasConfigToken,
		canUseEnv: params.allowEnv && Boolean(params.envValue?.trim()) && !params.hasConfigToken
	};
}
async function promptSingleChannelToken(params) {
	const promptToken = async () => String(await params.prompter.text({
		message: params.inputPrompt,
		validate: (value) => value?.trim() ? void 0 : "Required"
	})).trim();
	if (params.canUseEnv) {
		if (await params.prompter.confirm({
			message: params.envPrompt,
			initialValue: true
		})) return {
			useEnv: true,
			token: null
		};
		return {
			useEnv: false,
			token: await promptToken()
		};
	}
	if (params.hasConfigToken && params.accountConfigured) {
		if (await params.prompter.confirm({
			message: params.keepPrompt,
			initialValue: true
		})) return {
			useEnv: false,
			token: null
		};
	}
	return {
		useEnv: false,
		token: await promptToken()
	};
}
async function runSingleChannelSecretStep(params) {
	const promptState = buildSingleChannelSecretPromptState({
		accountConfigured: params.accountConfigured,
		hasConfigToken: params.hasConfigToken,
		allowEnv: params.allowEnv,
		envValue: params.envValue
	});
	if (!promptState.accountConfigured && params.onMissingConfigured) await params.onMissingConfigured();
	const result = await promptSingleChannelSecretInput({
		cfg: params.cfg,
		prompter: params.prompter,
		providerHint: params.providerHint,
		credentialLabel: params.credentialLabel,
		secretInputMode: params.secretInputMode,
		accountConfigured: promptState.accountConfigured,
		canUseEnv: promptState.canUseEnv,
		hasConfigToken: promptState.hasConfigToken,
		envPrompt: params.envPrompt,
		keepPrompt: params.keepPrompt,
		inputPrompt: params.inputPrompt,
		preferredEnvVar: params.preferredEnvVar
	});
	if (result.action === "use-env") return {
		cfg: params.applyUseEnv ? await params.applyUseEnv(params.cfg) : params.cfg,
		action: result.action,
		resolvedValue: params.envValue?.trim() || void 0
	};
	if (result.action === "set") return {
		cfg: params.applySet ? await params.applySet(params.cfg, result.value, result.resolvedValue) : params.cfg,
		action: result.action,
		resolvedValue: result.resolvedValue
	};
	return {
		cfg: params.cfg,
		action: result.action
	};
}
async function promptSingleChannelSecretInput(params) {
	if (await resolveSecretInputModeForEnvSelection({
		prompter: params.prompter,
		explicitMode: params.secretInputMode,
		copy: {
			modeMessage: `How do you want to provide this ${params.credentialLabel}?`,
			plaintextLabel: `Enter ${params.credentialLabel}`,
			plaintextHint: "Stores the credential directly in OpenClaw config",
			refLabel: "Use external secret provider",
			refHint: "Stores a reference to env or configured external secret providers"
		}
	}) === "plaintext") {
		const plainResult = await promptSingleChannelToken({
			prompter: params.prompter,
			accountConfigured: params.accountConfigured,
			canUseEnv: params.canUseEnv,
			hasConfigToken: params.hasConfigToken,
			envPrompt: params.envPrompt,
			keepPrompt: params.keepPrompt,
			inputPrompt: params.inputPrompt
		});
		if (plainResult.useEnv) return { action: "use-env" };
		if (plainResult.token) return {
			action: "set",
			value: plainResult.token,
			resolvedValue: plainResult.token
		};
		return { action: "keep" };
	}
	if (params.hasConfigToken && params.accountConfigured) {
		if (await params.prompter.confirm({
			message: params.keepPrompt,
			initialValue: true
		})) return { action: "keep" };
	}
	const { promptSecretRefForSetup } = await loadProviderAuthInput();
	const resolved = await promptSecretRefForSetup({
		provider: params.providerHint,
		config: params.cfg,
		prompter: params.prompter,
		preferredEnvVar: params.preferredEnvVar,
		copy: {
			sourceMessage: `Where is this ${params.credentialLabel} stored?`,
			envVarPlaceholder: params.preferredEnvVar ?? "OPENCLAW_SECRET",
			envVarFormatError: "Use an env var name like \"OPENCLAW_SECRET\" (uppercase letters, numbers, underscores).",
			noProvidersMessage: "No file/exec secret providers are configured yet. Add one under secrets.providers, or select Environment variable."
		}
	});
	return {
		action: "set",
		value: resolved.ref,
		resolvedValue: resolved.resolvedValue
	};
}
async function promptParsedAllowFromForAccount(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: params.defaultAccountId
	});
	const existing = params.getExistingAllowFrom({
		cfg: params.cfg,
		accountId
	});
	if (params.noteTitle && params.noteLines && params.noteLines.length > 0) await params.prompter.note(params.noteLines.join("\n"), params.noteTitle);
	const entry = await params.prompter.text({
		message: params.message,
		placeholder: params.placeholder,
		initialValue: existing[0] ? String(existing[0]) : void 0,
		validate: (value) => {
			const raw = String(value ?? "").trim();
			if (!raw) return "Required";
			return params.parseEntries(raw).error;
		}
	});
	const parsed = params.parseEntries(String(entry));
	const unique = params.mergeEntries?.({
		existing,
		parsed: parsed.entries
	}) ?? mergeAllowFromEntries(void 0, parsed.entries);
	return await params.applyAllowFrom({
		cfg: params.cfg,
		accountId,
		allowFrom: unique
	});
}
function createPromptParsedAllowFromForAccount(params) {
	return async ({ cfg, prompter, accountId }) => await promptParsedAllowFromForAccount({
		cfg,
		accountId,
		defaultAccountId: typeof params.defaultAccountId === "function" ? params.defaultAccountId(cfg) : params.defaultAccountId,
		prompter,
		...params.noteTitle ? { noteTitle: params.noteTitle } : {},
		...params.noteLines ? { noteLines: params.noteLines } : {},
		message: params.message,
		placeholder: params.placeholder,
		parseEntries: params.parseEntries,
		getExistingAllowFrom: params.getExistingAllowFrom,
		...params.mergeEntries ? { mergeEntries: params.mergeEntries } : {},
		applyAllowFrom: params.applyAllowFrom
	});
}
async function promptParsedAllowFromForScopedChannel(params) {
	return await promptParsedAllowFromForAccount({
		cfg: params.cfg,
		accountId: params.accountId,
		defaultAccountId: params.defaultAccountId,
		prompter: params.prompter,
		noteTitle: params.noteTitle,
		noteLines: params.noteLines,
		message: params.message,
		placeholder: params.placeholder,
		parseEntries: params.parseEntries,
		getExistingAllowFrom: params.getExistingAllowFrom,
		applyAllowFrom: ({ cfg, accountId, allowFrom }) => setAccountAllowFromForChannel({
			cfg,
			channel: params.channel,
			accountId,
			allowFrom
		})
	});
}
function createTopLevelChannelParsedAllowFromPrompt(params) {
	const setAllowFrom = createTopLevelChannelAllowFromSetter({
		channel: params.channel,
		...params.enabled ? { enabled: true } : {}
	});
	return createPromptParsedAllowFromForAccount({
		defaultAccountId: params.defaultAccountId,
		...params.noteTitle ? { noteTitle: params.noteTitle } : {},
		...params.noteLines ? { noteLines: params.noteLines } : {},
		message: params.message,
		placeholder: params.placeholder,
		parseEntries: params.parseEntries,
		getExistingAllowFrom: ({ cfg }) => params.getExistingAllowFrom?.(cfg) ?? (cfg.channels?.[params.channel])?.allowFrom ?? [],
		...params.mergeEntries ? { mergeEntries: params.mergeEntries } : {},
		applyAllowFrom: ({ cfg, allowFrom }) => setAllowFrom(cfg, allowFrom)
	});
}
function createNestedChannelParsedAllowFromPrompt(params) {
	const setAllowFrom = createNestedChannelAllowFromSetter({
		channel: params.channel,
		section: params.section,
		...params.enabled ? { enabled: true } : {}
	});
	return createPromptParsedAllowFromForAccount({
		defaultAccountId: params.defaultAccountId,
		...params.noteTitle ? { noteTitle: params.noteTitle } : {},
		...params.noteLines ? { noteLines: params.noteLines } : {},
		message: params.message,
		placeholder: params.placeholder,
		parseEntries: params.parseEntries,
		getExistingAllowFrom: ({ cfg }) => params.getExistingAllowFrom?.(cfg) ?? ((cfg.channels?.[params.channel])?.[params.section])?.allowFrom ?? [],
		...params.mergeEntries ? { mergeEntries: params.mergeEntries } : {},
		applyAllowFrom: ({ cfg, allowFrom }) => setAllowFrom(cfg, allowFrom)
	});
}
function resolveParsedAllowFromEntries(params) {
	return params.entries.map((entry) => {
		const id = params.parseId(entry);
		return {
			input: entry,
			resolved: Boolean(id),
			id
		};
	});
}
function createAllowFromSection(params) {
	return {
		...params.helpTitle ? { helpTitle: params.helpTitle } : {},
		...params.helpLines ? { helpLines: params.helpLines } : {},
		...params.credentialInputKey ? { credentialInputKey: params.credentialInputKey } : {},
		message: params.message,
		placeholder: params.placeholder,
		invalidWithoutCredentialNote: params.invalidWithoutCredentialNote,
		...params.parseInputs ? { parseInputs: params.parseInputs } : {},
		parseId: params.parseId,
		resolveEntries: params.resolveEntries ?? (async ({ entries }) => resolveParsedAllowFromEntries({
			entries,
			parseId: params.parseId
		})),
		apply: params.apply
	};
}
async function noteChannelLookupSummary(params) {
	const lines = [];
	for (const section of params.resolvedSections) {
		if (section.values.length === 0) continue;
		lines.push(`${section.title}: ${section.values.join(", ")}`);
	}
	if (params.unresolved && params.unresolved.length > 0) lines.push(`Unresolved (kept as typed): ${params.unresolved.join(", ")}`);
	if (lines.length > 0) await params.prompter.note(lines.join("\n"), params.label);
}
async function noteChannelLookupFailure(params) {
	await params.prompter.note(`Channel lookup failed; keeping entries as typed. ${String(params.error)}`, params.label);
}
async function resolveEntriesWithOptionalToken(params) {
	const token = params.token?.trim();
	if (!token) return params.entries.map(params.buildWithoutToken);
	return await params.resolveEntries({
		token,
		entries: params.entries
	});
}
async function promptResolvedAllowFrom(params) {
	while (true) {
		const entry = await params.prompter.text({
			message: params.message,
			placeholder: params.placeholder,
			initialValue: params.existing[0] ? String(params.existing[0]) : void 0,
			validate: (value) => String(value ?? "").trim() ? void 0 : "Required"
		});
		const parts = params.parseInputs(String(entry));
		if (!params.token) {
			const ids = parts.map(params.parseId).filter(Boolean);
			if (ids.length !== parts.length) {
				await params.prompter.note(params.invalidWithoutTokenNote, params.label);
				continue;
			}
			return mergeAllowFromEntries(params.existing, ids);
		}
		const results = await params.resolveEntries({
			token: params.token,
			entries: parts
		}).catch(() => null);
		if (!results) {
			await params.prompter.note("Failed to resolve usernames. Try again.", params.label);
			continue;
		}
		const unresolved = results.filter((res) => !res.resolved || !res.id);
		if (unresolved.length > 0) {
			await params.prompter.note(`Could not resolve: ${unresolved.map((res) => res.input).join(", ")}`, params.label);
			continue;
		}
		const ids = results.map((res) => res.id);
		return mergeAllowFromEntries(params.existing, ids);
	}
}
async function promptLegacyChannelAllowFrom(params) {
	await params.prompter.note(params.noteLines.join("\n"), params.noteTitle);
	const unique = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: params.existing,
		token: params.token,
		message: params.message,
		placeholder: params.placeholder,
		label: params.noteTitle,
		parseInputs: splitSetupEntries,
		parseId: params.parseId,
		invalidWithoutTokenNote: params.invalidWithoutTokenNote,
		resolveEntries: params.resolveEntries
	});
	return setLegacyChannelAllowFrom({
		cfg: params.cfg,
		channel: params.channel,
		allowFrom: unique
	});
}
async function promptLegacyChannelAllowFromForAccount(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: params.defaultAccountId
	});
	const account = params.resolveAccount(params.cfg, accountId);
	return await promptLegacyChannelAllowFrom({
		cfg: params.cfg,
		channel: params.channel,
		prompter: params.prompter,
		existing: params.resolveExisting(account, params.cfg),
		token: params.resolveToken(account),
		noteTitle: params.noteTitle,
		noteLines: params.noteLines,
		message: params.message,
		placeholder: params.placeholder,
		parseId: params.parseId,
		invalidWithoutTokenNote: params.invalidWithoutTokenNote,
		resolveEntries: params.resolveEntries
	});
}
//#endregion
//#region src/channels/plugins/setup-wizard-binary.ts
function createDetectedBinaryStatus(params) {
	const detectBinary$1 = params.detectBinary ?? detectBinary;
	return {
		configuredLabel: params.configuredLabel,
		unconfiguredLabel: params.unconfiguredLabel,
		configuredHint: params.configuredHint,
		unconfiguredHint: params.unconfiguredHint,
		configuredScore: params.configuredScore,
		unconfiguredScore: params.unconfiguredScore,
		resolveConfigured: params.resolveConfigured,
		async resolveStatusLines({ cfg, configured }) {
			const binaryPath = params.resolveBinaryPath({ cfg });
			const detected = await detectBinary$1(binaryPath);
			return [`${params.channelLabel}: ${configured ? params.configuredLabel : params.unconfiguredLabel}`, `${params.binaryLabel}: ${detected ? "found" : "missing"} (${binaryPath})`];
		},
		async resolveSelectionHint({ cfg }) {
			return await detectBinary$1(params.resolveBinaryPath({ cfg })) ? params.configuredHint : params.unconfiguredHint;
		},
		async resolveQuickstartScore({ cfg }) {
			return await detectBinary$1(params.resolveBinaryPath({ cfg })) ? params.configuredScore : params.unconfiguredScore;
		}
	};
}
function createCliPathTextInput(params) {
	return {
		inputKey: params.inputKey,
		message: params.message,
		currentValue: params.resolvePath,
		initialValue: params.resolvePath,
		shouldPrompt: params.shouldPrompt,
		confirmCurrentValue: false,
		applyCurrentValue: true,
		...params.helpTitle ? { helpTitle: params.helpTitle } : {},
		...params.helpLines ? { helpLines: params.helpLines } : {}
	};
}
function createDelegatedSetupWizardStatusResolvers(loadWizard) {
	return {
		async resolveStatusLines(params) {
			return (await loadWizard()).status.resolveStatusLines?.(params) ?? [];
		},
		async resolveSelectionHint(params) {
			return await (await loadWizard()).status.resolveSelectionHint?.(params);
		},
		async resolveQuickstartScore(params) {
			return await (await loadWizard()).status.resolveQuickstartScore?.(params);
		}
	};
}
function createDelegatedTextInputShouldPrompt(params) {
	return async (inputParams) => {
		return await ((await params.loadWizard()).textInputs?.find((entry) => entry.inputKey === params.inputKey))?.shouldPrompt?.(inputParams) ?? false;
	};
}
//#endregion
//#region src/channels/plugins/setup-wizard-proxy.ts
function createDelegatedResolveConfigured(loadWizard) {
	return async ({ cfg }) => await (await loadWizard()).status.resolveConfigured({ cfg });
}
function createDelegatedPrepare(loadWizard) {
	return async (params) => await (await loadWizard()).prepare?.(params);
}
function createDelegatedFinalize(loadWizard) {
	return async (params) => await (await loadWizard()).finalize?.(params);
}
function createDelegatedSetupWizardProxy(params) {
	return {
		channel: params.channel,
		status: {
			...params.status,
			resolveConfigured: createDelegatedResolveConfigured(params.loadWizard),
			...createDelegatedSetupWizardStatusResolvers(params.loadWizard)
		},
		...params.resolveShouldPromptAccountIds ? { resolveShouldPromptAccountIds: params.resolveShouldPromptAccountIds } : {},
		...params.delegatePrepare ? { prepare: createDelegatedPrepare(params.loadWizard) } : {},
		credentials: params.credentials ?? [],
		...params.textInputs ? { textInputs: params.textInputs } : {},
		...params.delegateFinalize ? { finalize: createDelegatedFinalize(params.loadWizard) } : {},
		...params.completionNote ? { completionNote: params.completionNote } : {},
		...params.dmPolicy ? { dmPolicy: params.dmPolicy } : {},
		...params.disable ? { disable: params.disable } : {},
		...params.onAccountRecorded ? { onAccountRecorded: params.onAccountRecorded } : {}
	};
}
function createAllowlistSetupWizardProxy(params) {
	return params.createBase({
		promptAllowFrom: async ({ cfg, prompter, accountId }) => {
			const wizard = await params.loadWizard();
			if (!wizard.dmPolicy?.promptAllowFrom) return cfg;
			return await wizard.dmPolicy.promptAllowFrom({
				cfg,
				prompter,
				accountId
			});
		},
		resolveAllowFromEntries: async ({ cfg, accountId, credentialValues, entries }) => {
			const wizard = await params.loadWizard();
			if (!wizard.allowFrom) return entries.map((input) => ({
				input,
				resolved: false,
				id: null
			}));
			return await wizard.allowFrom.resolveEntries({
				cfg,
				accountId,
				credentialValues,
				entries
			});
		},
		resolveGroupAllowlist: async ({ cfg, accountId, credentialValues, entries, prompter }) => {
			const wizard = await params.loadWizard();
			if (!wizard.groupAccess?.resolveAllowlist) return params.fallbackResolvedGroupAllowlist(entries);
			return await wizard.groupAccess.resolveAllowlist({
				cfg,
				accountId,
				credentialValues,
				entries,
				prompter
			});
		}
	});
}
//#endregion
export { setChannelDmPolicyWithAllowFrom as $, noteChannelLookupSummary as A, promptParsedAllowFromForAccount as B, createTopLevelChannelDmPolicy as C, mergeAllowFromEntries as D, createTopLevelChannelParsedAllowFromPrompt as E, patchNestedChannelConfigSection as F, resolveEntriesWithOptionalToken as G, promptResolvedAllowFrom as H, patchTopLevelChannelConfigSection as I, resolveSetupAccountId as J, resolveGroupAllowlistWithLookupNotes as K, promptAccountId as L, parseSetupEntriesAllowingWildcard as M, parseSetupEntriesWithParser as N, normalizeAllowFromEntries as O, patchChannelConfigForAccount as P, setAccountGroupPolicyForChannel as Q, promptLegacyChannelAllowFrom as R, createTopLevelChannelAllowFromSetter as S, createTopLevelChannelGroupPolicySetter as T, promptSingleChannelSecretInput as U, promptParsedAllowFromForScopedChannel as V, resolveAccountIdForConfigure as W, setAccountAllowFromForChannel as X, runSingleChannelSecretStep as Y, setAccountDmAllowFromForChannel as Z, createNestedChannelDmPolicy as _, createDelegatedSetupWizardProxy as a, setTopLevelChannelDmPolicyWithAllowFrom as at, createPromptParsedAllowFromForAccount as b, createDelegatedTextInputShouldPrompt as c, buildSingleChannelSecretPromptState as d, setLegacyChannelDmPolicyWithAllowFrom as et, createAccountScopedAllowFromSection as f, createNestedChannelAllowFromSetter as g, createLegacyCompatChannelDmPolicy as h, createDelegatedResolveConfigured as i, setTopLevelChannelAllowFrom as it, parseMentionOrPrefixedId as j, noteChannelLookupFailure as k, createDetectedBinaryStatus as l, createAllowFromSection as m, createDelegatedFinalize as n, setNestedChannelDmPolicyWithAllowFrom as nt, createCliPathTextInput as o, setTopLevelChannelGroupPolicy as ot, createAccountScopedGroupAccessSection as p, resolveParsedAllowFromEntries as q, createDelegatedPrepare as r, setSetupChannelEnabled as rt, createDelegatedSetupWizardStatusResolvers as s, splitSetupEntries as st, createAllowlistSetupWizardProxy as t, setNestedChannelAllowFrom as tt, addWildcardAllowFrom as u, createNestedChannelDmPolicySetter as v, createTopLevelChannelDmPolicySetter as w, createStandardChannelSetupStatus as x, createNestedChannelParsedAllowFromPrompt as y, promptLegacyChannelAllowFromForAccount as z };
