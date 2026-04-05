import { type OpenClawConfig, type WizardPrompter } from "openclaw/plugin-sdk/setup";
import type { ChannelSetupAdapter, ChannelSetupWizard, ChannelSetupWizardTextInput } from "openclaw/plugin-sdk/setup";
export declare function parseIMessageAllowFromEntries(raw: string): {
    entries: string[];
    error?: string;
};
export declare function promptIMessageAllowFrom(params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    accountId?: string;
}): Promise<OpenClawConfig>;
export declare const imessageDmPolicy: import("openclaw/plugin-sdk/setup").ChannelSetupDmPolicy;
export declare function createIMessageCliPathTextInput(shouldPrompt: NonNullable<ChannelSetupWizardTextInput["shouldPrompt"]>): ChannelSetupWizardTextInput;
export declare const imessageCompletionNote: {
    title: string;
    lines: string[];
};
export declare const imessageSetupAdapter: ChannelSetupAdapter;
export declare const imessageSetupStatusBase: {
    configuredLabel: string;
    unconfiguredLabel: string;
    configuredHint: string;
    unconfiguredHint: string;
    configuredScore: number;
    unconfiguredScore: number;
    resolveConfigured: ({ cfg }: {
        cfg: OpenClawConfig;
    }) => boolean;
};
export declare function createIMessageSetupWizardProxy(loadWizard: () => Promise<ChannelSetupWizard>): ChannelSetupWizard;
