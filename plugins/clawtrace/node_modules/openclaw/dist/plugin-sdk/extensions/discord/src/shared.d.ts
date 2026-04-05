import { type ResolvedDiscordAccount } from "./accounts.js";
import { type ChannelPlugin } from "./runtime-api.js";
export declare const DISCORD_CHANNEL: "discord";
export declare const discordSetupWizard: import("openclaw/plugin-sdk").ChannelSetupWizard;
export declare const discordConfigAdapter: {
    listAccountIds: (cfg: import("openclaw/plugin-sdk/core").OpenClawConfig) => string[];
    resolveAccount: (cfg: import("openclaw/plugin-sdk/core").OpenClawConfig, accountId?: string | null) => ResolvedDiscordAccount;
    inspectAccount?: ((cfg: import("openclaw/plugin-sdk/core").OpenClawConfig, accountId?: string | null) => unknown) | undefined;
    defaultAccountId?: ((cfg: import("openclaw/plugin-sdk/core").OpenClawConfig) => string) | undefined;
    setAccountEnabled?: ((params: {
        cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
        accountId: string;
        enabled: boolean;
    }) => import("openclaw/plugin-sdk/core").OpenClawConfig) | undefined;
    deleteAccount?: ((params: {
        cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
        accountId: string;
    }) => import("openclaw/plugin-sdk/core").OpenClawConfig) | undefined;
    resolveAllowFrom?: ((params: {
        cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
        accountId?: string | null;
    }) => Array<string | number> | undefined) | undefined;
    formatAllowFrom?: ((params: {
        cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
        accountId?: string | null;
        allowFrom: Array<string | number>;
    }) => string[]) | undefined;
    resolveDefaultTo?: ((params: {
        cfg: import("openclaw/plugin-sdk/core").OpenClawConfig;
        accountId?: string | null;
    }) => string | undefined) | undefined;
};
export declare function createDiscordPluginBase(params: {
    setup: NonNullable<ChannelPlugin<ResolvedDiscordAccount>["setup"]>;
}): Pick<ChannelPlugin<ResolvedDiscordAccount>, "id" | "meta" | "setupWizard" | "capabilities" | "streaming" | "reload" | "configSchema" | "config" | "setup">;
