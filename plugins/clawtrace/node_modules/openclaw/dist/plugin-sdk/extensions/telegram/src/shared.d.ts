import { type ChannelPlugin, type OpenClawConfig } from "../runtime-api.js";
import { type ResolvedTelegramAccount } from "./accounts.js";
export declare const TELEGRAM_CHANNEL: "telegram";
export declare function findTelegramTokenOwnerAccountId(params: {
    cfg: OpenClawConfig;
    accountId: string;
}): string | null;
export declare function formatDuplicateTelegramTokenReason(params: {
    accountId: string;
    ownerAccountId: string;
}): string;
export declare const telegramConfigAdapter: {
    listAccountIds: (cfg: OpenClawConfig) => string[];
    resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedTelegramAccount;
    inspectAccount?: ((cfg: OpenClawConfig, accountId?: string | null) => unknown) | undefined;
    defaultAccountId?: ((cfg: OpenClawConfig) => string) | undefined;
    setAccountEnabled?: ((params: {
        cfg: OpenClawConfig;
        accountId: string;
        enabled: boolean;
    }) => OpenClawConfig) | undefined;
    deleteAccount?: ((params: {
        cfg: OpenClawConfig;
        accountId: string;
    }) => OpenClawConfig) | undefined;
    resolveAllowFrom?: ((params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => Array<string | number> | undefined) | undefined;
    formatAllowFrom?: ((params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        allowFrom: Array<string | number>;
    }) => string[]) | undefined;
    resolveDefaultTo?: ((params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => string | undefined) | undefined;
};
export declare function createTelegramPluginBase(params: {
    setupWizard: NonNullable<ChannelPlugin<ResolvedTelegramAccount>["setupWizard"]>;
    setup: NonNullable<ChannelPlugin<ResolvedTelegramAccount>["setup"]>;
}): Pick<ChannelPlugin<ResolvedTelegramAccount>, "id" | "meta" | "setupWizard" | "capabilities" | "reload" | "configSchema" | "config" | "setup">;
