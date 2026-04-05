import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { ChannelSetupAdapter, ChannelSetupDmPolicy, ChannelSetupWizard } from "openclaw/plugin-sdk/setup-runtime";
export declare const DISCORD_TOKEN_HELP_LINES: string[];
export declare function setDiscordGuildChannelAllowlist(cfg: OpenClawConfig, accountId: string, entries: Array<{
    guildKey: string;
    channelKey?: string;
}>): OpenClawConfig;
export declare function parseDiscordAllowFromId(value: string): string | null;
export declare const discordSetupAdapter: ChannelSetupAdapter;
export declare function createDiscordSetupWizardBase(handlers: {
    promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
    resolveAllowFromEntries: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>;
    resolveGroupAllowlist: NonNullable<NonNullable<NonNullable<ChannelSetupWizard["groupAccess"]>["resolveAllowlist"]>>;
}): {
    channel: "discord";
    status: import("../../../src/channels/plugins/setup-wizard.ts").ChannelSetupWizardStatus;
    credentials: {
        inputKey: "token";
        providerHint: "discord";
        credentialLabel: string;
        preferredEnvVar: string;
        helpTitle: string;
        helpLines: string[];
        envPrompt: string;
        keepPrompt: string;
        inputPrompt: string;
        allowEnv: ({ accountId }: {
            accountId: string;
        }) => boolean;
        inspect: ({ cfg, accountId }: {
            cfg: OpenClawConfig;
            accountId: string;
        }) => {
            accountConfigured: boolean;
            hasConfiguredValue: boolean;
            resolvedValue: string | undefined;
            envValue: string | undefined;
        };
    }[];
    groupAccess: import("../../../src/channels/plugins/setup-wizard.ts").ChannelSetupWizardGroupAccess;
    allowFrom: import("../../../src/channels/plugins/setup-wizard.ts").ChannelSetupWizardAllowFrom;
    dmPolicy: ChannelSetupDmPolicy;
    disable: (cfg: OpenClawConfig) => OpenClawConfig;
};
export declare function createDiscordSetupWizardProxy(loadWizard: () => Promise<ChannelSetupWizard>): ChannelSetupWizard;
