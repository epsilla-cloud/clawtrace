import { _ as normalizeAccountId, g as DEFAULT_ACCOUNT_ID } from "./session-key-BhxcMJEE.js";
import { z } from "zod";
//#region src/channels/plugins/setup-helpers.ts
function channelHasAccounts(cfg, channelKey) {
	const base = cfg.channels?.[channelKey];
	return Boolean(base?.accounts && Object.keys(base.accounts).length > 0);
}
function shouldStoreNameInAccounts(params) {
	if (params.alwaysUseAccounts) return true;
	if (params.accountId !== "default") return true;
	return channelHasAccounts(params.cfg, params.channelKey);
}
function applyAccountNameToChannelSection(params) {
	const trimmed = params.name?.trim();
	if (!trimmed) return params.cfg;
	const accountId = normalizeAccountId(params.accountId);
	const baseConfig = params.cfg.channels?.[params.channelKey];
	const base = typeof baseConfig === "object" && baseConfig ? baseConfig : void 0;
	if (!shouldStoreNameInAccounts({
		cfg: params.cfg,
		channelKey: params.channelKey,
		accountId,
		alwaysUseAccounts: params.alwaysUseAccounts
	}) && accountId === "default") {
		const safeBase = base ?? {};
		return {
			...params.cfg,
			channels: {
				...params.cfg.channels,
				[params.channelKey]: {
					...safeBase,
					name: trimmed
				}
			}
		};
	}
	const baseAccounts = base?.accounts ?? {};
	const existingAccount = baseAccounts[accountId] ?? {};
	const baseWithoutName = accountId === "default" ? (({ name: _ignored, ...rest }) => rest)(base ?? {}) : base ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...baseWithoutName,
				accounts: {
					...baseAccounts,
					[accountId]: {
						...existingAccount,
						name: trimmed
					}
				}
			}
		}
	};
}
function migrateBaseNameToDefaultAccount(params) {
	if (params.alwaysUseAccounts) return params.cfg;
	const base = params.cfg.channels?.[params.channelKey];
	const baseName = base?.name?.trim();
	if (!baseName) return params.cfg;
	const accounts = { ...base?.accounts };
	const defaultAccount = accounts["default"] ?? {};
	if (!defaultAccount.name) accounts[DEFAULT_ACCOUNT_ID] = {
		...defaultAccount,
		name: baseName
	};
	const { name: _ignored, ...rest } = base ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...rest,
				accounts
			}
		}
	};
}
function prepareScopedSetupConfig(params) {
	const namedConfig = applyAccountNameToChannelSection({
		cfg: params.cfg,
		channelKey: params.channelKey,
		accountId: params.accountId,
		name: params.name,
		alwaysUseAccounts: params.alwaysUseAccounts
	});
	if (!params.migrateBaseName || normalizeAccountId(params.accountId) === "default") return namedConfig;
	return migrateBaseNameToDefaultAccount({
		cfg: namedConfig,
		channelKey: params.channelKey,
		alwaysUseAccounts: params.alwaysUseAccounts
	});
}
function applySetupAccountConfigPatch(params) {
	return patchScopedAccountConfig({
		cfg: params.cfg,
		channelKey: params.channelKey,
		accountId: params.accountId,
		patch: params.patch
	});
}
function createPatchedAccountSetupAdapter(params) {
	return {
		resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
		applyAccountName: ({ cfg, accountId, name }) => prepareScopedSetupConfig({
			cfg,
			channelKey: params.channelKey,
			accountId,
			name,
			alwaysUseAccounts: params.alwaysUseAccounts
		}),
		validateInput: params.validateInput,
		applyAccountConfig: ({ cfg, accountId, input }) => {
			const next = prepareScopedSetupConfig({
				cfg,
				channelKey: params.channelKey,
				accountId,
				name: input.name,
				alwaysUseAccounts: params.alwaysUseAccounts,
				migrateBaseName: !params.alwaysUseAccounts
			});
			const patch = params.buildPatch(input);
			return patchScopedAccountConfig({
				cfg: next,
				channelKey: params.channelKey,
				accountId,
				patch,
				accountPatch: patch,
				ensureChannelEnabled: params.ensureChannelEnabled ?? !params.alwaysUseAccounts,
				ensureAccountEnabled: params.ensureAccountEnabled ?? true,
				scopeDefaultToAccounts: params.alwaysUseAccounts
			});
		}
	};
}
function createZodSetupInputValidator(params) {
	return (inputParams) => {
		const parsed = params.schema.safeParse(inputParams.input);
		if (!parsed.success) return parsed.error.issues[0]?.message ?? "invalid input";
		return params.validate?.({
			...inputParams,
			input: parsed.data
		}) ?? null;
	};
}
const GenericSetupInputSchema = z.object({ useEnv: z.boolean().optional() }).passthrough();
function hasPresentSetupValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== void 0 && value !== null;
}
function createSetupInputPresenceValidator(params) {
	return createZodSetupInputValidator({
		schema: GenericSetupInputSchema,
		validate: (inputParams) => {
			if (params.defaultAccountOnlyEnvError && inputParams.input.useEnv && inputParams.accountId !== "default") return params.defaultAccountOnlyEnvError;
			if (!inputParams.input.useEnv) {
				const inputRecord = inputParams.input;
				for (const requirement of params.whenNotUseEnv ?? []) {
					if (requirement.someOf.some((key) => hasPresentSetupValue(inputRecord[key]))) continue;
					return requirement.message;
				}
			}
			return params.validate?.(inputParams) ?? null;
		}
	});
}
function createEnvPatchedAccountSetupAdapter(params) {
	return createPatchedAccountSetupAdapter({
		channelKey: params.channelKey,
		alwaysUseAccounts: params.alwaysUseAccounts,
		ensureChannelEnabled: params.ensureChannelEnabled,
		ensureAccountEnabled: params.ensureAccountEnabled,
		validateInput: (inputParams) => {
			if (inputParams.input.useEnv && inputParams.accountId !== "default") return params.defaultAccountOnlyEnvError;
			if (!inputParams.input.useEnv && !params.hasCredentials(inputParams.input)) return params.missingCredentialError;
			return params.validateInput?.(inputParams) ?? null;
		},
		buildPatch: params.buildPatch
	});
}
function patchScopedAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId);
	const channelConfig = params.cfg.channels?.[params.channelKey];
	const base = typeof channelConfig === "object" && channelConfig ? channelConfig : void 0;
	const ensureChannelEnabled = params.ensureChannelEnabled ?? true;
	const ensureAccountEnabled = params.ensureAccountEnabled ?? ensureChannelEnabled;
	const patch = params.patch;
	const accountPatch = params.accountPatch ?? patch;
	if (accountId === "default" && !params.scopeDefaultToAccounts) return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...base,
				...ensureChannelEnabled ? { enabled: true } : {},
				...patch
			}
		}
	};
	const accounts = base?.accounts ?? {};
	const existingAccount = accounts[accountId] ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...base,
				...ensureChannelEnabled ? { enabled: true } : {},
				accounts: {
					...accounts,
					[accountId]: {
						...existingAccount,
						...ensureAccountEnabled ? { enabled: typeof existingAccount.enabled === "boolean" ? existingAccount.enabled : true } : {},
						...accountPatch
					}
				}
			}
		}
	};
}
const COMMON_SINGLE_ACCOUNT_KEYS_TO_MOVE = new Set([
	"name",
	"token",
	"tokenFile",
	"botToken",
	"appToken",
	"account",
	"signalNumber",
	"authDir",
	"cliPath",
	"dbPath",
	"httpUrl",
	"httpHost",
	"httpPort",
	"webhookPath",
	"webhookUrl",
	"webhookSecret",
	"service",
	"region",
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceName",
	"url",
	"code",
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom",
	"defaultTo"
]);
const SINGLE_ACCOUNT_KEYS_TO_MOVE_BY_CHANNEL = {
	matrix: new Set([
		"deviceId",
		"avatarUrl",
		"initialSyncLimit",
		"encryption",
		"allowlistOnly",
		"allowBots",
		"replyToMode",
		"threadReplies",
		"textChunkLimit",
		"chunkMode",
		"responsePrefix",
		"ackReaction",
		"ackReactionScope",
		"reactionNotifications",
		"threadBindings",
		"startupVerification",
		"startupVerificationCooldownHours",
		"mediaMaxMb",
		"autoJoin",
		"autoJoinAllowlist",
		"dm",
		"groups",
		"rooms",
		"actions"
	]),
	telegram: new Set(["streaming"])
};
const MATRIX_NAMED_ACCOUNT_PROMOTION_KEYS = new Set([
	"name",
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceId",
	"deviceName",
	"avatarUrl",
	"initialSyncLimit",
	"encryption"
]);
function shouldMoveSingleAccountChannelKey(params) {
	if (COMMON_SINGLE_ACCOUNT_KEYS_TO_MOVE.has(params.key)) return true;
	return SINGLE_ACCOUNT_KEYS_TO_MOVE_BY_CHANNEL[params.channelKey]?.has(params.key) ?? false;
}
function resolveSingleAccountKeysToMove(params) {
	const hasNamedAccounts = Object.keys(params.channel.accounts ?? {}).filter(Boolean).length > 0;
	return Object.entries(params.channel).filter(([key, value]) => {
		if (key === "accounts" || key === "enabled" || value === void 0) return false;
		if (!shouldMoveSingleAccountChannelKey({
			channelKey: params.channelKey,
			key
		})) return false;
		if (params.channelKey === "matrix" && hasNamedAccounts && !MATRIX_NAMED_ACCOUNT_PROMOTION_KEYS.has(key)) return false;
		return true;
	}).map(([key]) => key);
}
function resolveSingleAccountPromotionTarget(params) {
	if (params.channelKey !== "matrix") return DEFAULT_ACCOUNT_ID;
	const accounts = params.channel.accounts ?? {};
	const normalizedDefaultAccount = typeof params.channel.defaultAccount === "string" && params.channel.defaultAccount.trim() ? normalizeAccountId(params.channel.defaultAccount) : void 0;
	if (normalizedDefaultAccount) {
		if (normalizedDefaultAccount !== "default") {
			const matchedAccountId = Object.entries(accounts).find(([accountId, value]) => accountId && value && typeof value === "object" && normalizeAccountId(accountId) === normalizedDefaultAccount)?.[0];
			if (matchedAccountId) return matchedAccountId;
		}
		return DEFAULT_ACCOUNT_ID;
	}
	const namedAccounts = Object.entries(accounts).filter(([accountId, value]) => accountId && typeof value === "object" && value);
	if (namedAccounts.length === 1) return namedAccounts[0][0];
	if (namedAccounts.length > 1 && accounts["default"] && typeof accounts["default"] === "object") return DEFAULT_ACCOUNT_ID;
	return DEFAULT_ACCOUNT_ID;
}
function cloneIfObject(value) {
	if (value && typeof value === "object") return structuredClone(value);
	return value;
}
function moveSingleAccountKeysIntoAccount(params) {
	const nextAccount = { ...params.baseAccount };
	for (const key of params.keysToMove) nextAccount[key] = cloneIfObject(params.channel[key]);
	const nextChannel = { ...params.channel };
	for (const key of params.keysToMove) delete nextChannel[key];
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...nextChannel,
				accounts: {
					...params.accounts,
					[params.targetAccountId]: nextAccount
				}
			}
		}
	};
}
function moveSingleAccountChannelSectionToDefaultAccount(params) {
	const baseConfig = params.cfg.channels?.[params.channelKey];
	const base = typeof baseConfig === "object" && baseConfig ? baseConfig : void 0;
	if (!base) return params.cfg;
	const accounts = base.accounts ?? {};
	if (Object.keys(accounts).length > 0) {
		if (params.channelKey !== "matrix") return params.cfg;
		const keysToMove = resolveSingleAccountKeysToMove({
			channelKey: params.channelKey,
			channel: base
		});
		if (keysToMove.length === 0) return params.cfg;
		const targetAccountId = resolveSingleAccountPromotionTarget({
			channelKey: params.channelKey,
			channel: base
		});
		return moveSingleAccountKeysIntoAccount({
			cfg: params.cfg,
			channelKey: params.channelKey,
			channel: base,
			accounts,
			keysToMove,
			targetAccountId,
			baseAccount: accounts[targetAccountId]
		});
	}
	const keysToMove = resolveSingleAccountKeysToMove({
		channelKey: params.channelKey,
		channel: base
	});
	return moveSingleAccountKeysIntoAccount({
		cfg: params.cfg,
		channelKey: params.channelKey,
		channel: base,
		accounts,
		keysToMove,
		targetAccountId: DEFAULT_ACCOUNT_ID
	});
}
//#endregion
export { createSetupInputPresenceValidator as a, moveSingleAccountChannelSectionToDefaultAccount as c, shouldMoveSingleAccountChannelKey as d, createPatchedAccountSetupAdapter as i, patchScopedAccountConfig as l, applySetupAccountConfigPatch as n, createZodSetupInputValidator as o, createEnvPatchedAccountSetupAdapter as r, migrateBaseNameToDefaultAccount as s, applyAccountNameToChannelSection as t, prepareScopedSetupConfig as u };
