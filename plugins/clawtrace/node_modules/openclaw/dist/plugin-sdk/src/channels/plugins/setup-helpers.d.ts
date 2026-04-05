import { type ZodType } from "zod";
import type { OpenClawConfig } from "../../config/config.js";
import type { ChannelSetupAdapter } from "./types.adapters.js";
import type { ChannelSetupInput } from "./types.core.js";
type ChannelSectionBase = {
    name?: string;
    defaultAccount?: string;
    accounts?: Record<string, Record<string, unknown>>;
};
export declare function applyAccountNameToChannelSection(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    name?: string;
    alwaysUseAccounts?: boolean;
}): OpenClawConfig;
export declare function migrateBaseNameToDefaultAccount(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    alwaysUseAccounts?: boolean;
}): OpenClawConfig;
export declare function prepareScopedSetupConfig(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    name?: string;
    alwaysUseAccounts?: boolean;
    migrateBaseName?: boolean;
}): OpenClawConfig;
export declare function applySetupAccountConfigPatch(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    patch: Record<string, unknown>;
}): OpenClawConfig;
export declare function createPatchedAccountSetupAdapter(params: {
    channelKey: string;
    alwaysUseAccounts?: boolean;
    ensureChannelEnabled?: boolean;
    ensureAccountEnabled?: boolean;
    validateInput?: ChannelSetupAdapter["validateInput"];
    buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
export declare function createZodSetupInputValidator<T extends ChannelSetupInput>(params: {
    schema: ZodType<T>;
    validate?: (params: {
        cfg: OpenClawConfig;
        accountId: string;
        input: T;
    }) => string | null;
}): NonNullable<ChannelSetupAdapter["validateInput"]>;
type SetupInputPresenceRequirement = {
    someOf: string[];
    message: string;
};
export declare function createSetupInputPresenceValidator(params: {
    defaultAccountOnlyEnvError?: string;
    whenNotUseEnv?: SetupInputPresenceRequirement[];
    validate?: (params: {
        cfg: OpenClawConfig;
        accountId: string;
        input: ChannelSetupInput;
    }) => string | null;
}): NonNullable<ChannelSetupAdapter["validateInput"]>;
export declare function createEnvPatchedAccountSetupAdapter(params: {
    channelKey: string;
    alwaysUseAccounts?: boolean;
    ensureChannelEnabled?: boolean;
    ensureAccountEnabled?: boolean;
    defaultAccountOnlyEnvError: string;
    missingCredentialError: string;
    hasCredentials: (input: ChannelSetupInput) => boolean;
    validateInput?: ChannelSetupAdapter["validateInput"];
    buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
export declare function patchScopedAccountConfig(params: {
    cfg: OpenClawConfig;
    channelKey: string;
    accountId: string;
    patch: Record<string, unknown>;
    accountPatch?: Record<string, unknown>;
    ensureChannelEnabled?: boolean;
    ensureAccountEnabled?: boolean;
    scopeDefaultToAccounts?: boolean;
}): OpenClawConfig;
export declare const MATRIX_SHARED_MULTI_ACCOUNT_DEFAULT_KEYS: Set<string>;
export declare function shouldMoveSingleAccountChannelKey(params: {
    channelKey: string;
    key: string;
}): boolean;
export declare function resolveSingleAccountKeysToMove(params: {
    channelKey: string;
    channel: Record<string, unknown>;
}): string[];
export declare function resolveSingleAccountPromotionTarget(params: {
    channelKey: string;
    channel: ChannelSectionBase;
}): string;
export declare function moveSingleAccountChannelSectionToDefaultAccount(params: {
    cfg: OpenClawConfig;
    channelKey: string;
}): OpenClawConfig;
export {};
