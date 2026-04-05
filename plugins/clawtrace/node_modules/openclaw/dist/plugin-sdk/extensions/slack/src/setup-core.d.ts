import { type OpenClawConfig } from "openclaw/plugin-sdk/setup";
import { type ChannelSetupAdapter, type ChannelSetupDmPolicy, type ChannelSetupWizard } from "openclaw/plugin-sdk/setup";
export declare const slackSetupAdapter: ChannelSetupAdapter;
export declare function createSlackSetupWizardBase(handlers: {
    promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
    resolveAllowFromEntries: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>;
    resolveGroupAllowlist: NonNullable<NonNullable<NonNullable<ChannelSetupWizard["groupAccess"]>["resolveAllowlist"]>>;
}): {
    channel: "slack";
    status: import("../../../src/channels/plugins/setup-wizard.ts").ChannelSetupWizardStatus;
    introNote: {
        title: string;
        lines: string[];
        shouldShow: ({ cfg, accountId }: {
            cfg: OpenClawConfig;
            accountId: string;
            credentialValues: Partial<Record<string, string>>;
        }) => boolean;
    };
    envShortcut: {
        prompt: string;
        preferredEnvVar: string;
        isAvailable: ({ cfg, accountId }: {
            cfg: OpenClawConfig;
            accountId: string;
        }) => boolean;
        apply: ({ cfg, accountId }: {
            cfg: OpenClawConfig;
            accountId: string;
        }) => OpenClawConfig;
    };
    credentials: {
        inputKey: "botToken" | "appToken";
        providerHint: "slack-bot" | "slack-app";
        credentialLabel: string;
        preferredEnvVar: "SLACK_BOT_TOKEN" | "SLACK_APP_TOKEN";
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
        applyUseEnv: ({ cfg, accountId }: {
            cfg: OpenClawConfig;
            accountId: string;
        }) => OpenClawConfig;
        applySet: ({ cfg, accountId, value, }: {
            cfg: OpenClawConfig;
            accountId: string;
            value: unknown;
        }) => OpenClawConfig;
    }[];
    dmPolicy: ChannelSetupDmPolicy;
    allowFrom: import("../../../src/channels/plugins/setup-wizard.ts").ChannelSetupWizardAllowFrom;
    groupAccess: import("../../../src/channels/plugins/setup-wizard.ts").ChannelSetupWizardGroupAccess;
    finalize: ({ cfg, accountId, options, prompter }: {
        cfg: OpenClawConfig;
        accountId: string;
        credentialValues: Partial<Record<string, string>>;
        runtime: import("../../../src/channels/plugins/setup-wizard-types.ts").ChannelSetupConfigureContext["runtime"];
        prompter: import("openclaw/plugin-sdk/setup").WizardPrompter;
        options?: import("../../../src/channels/plugins/setup-wizard-types.ts").ChannelSetupConfigureContext["options"];
        forceAllowFrom: boolean;
    }) => Promise<{
        cfg: OpenClawConfig;
    } | undefined>;
    disable: (cfg: OpenClawConfig) => OpenClawConfig;
};
export declare function createSlackSetupWizardProxy(loadWizard: () => Promise<{
    slackSetupWizard: ChannelSetupWizard;
}>): ChannelSetupWizard;
