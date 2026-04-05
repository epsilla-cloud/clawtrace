import { type OpenClawConfig, type WizardPrompter, type ChannelSetupAdapter, type ChannelSetupWizard, type ChannelSetupWizardTextInput } from "openclaw/plugin-sdk/setup-runtime";
export declare function normalizeSignalAccountInput(value: string | null | undefined): string | null;
export declare function parseSignalAllowFromEntries(raw: string): {
    entries: string[];
    error?: string;
};
export declare function promptSignalAllowFrom(params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    accountId?: string;
}): Promise<OpenClawConfig>;
export declare const signalDmPolicy: import("openclaw/plugin-sdk/setup-runtime").ChannelSetupDmPolicy;
export declare function createSignalCliPathTextInput(shouldPrompt: NonNullable<ChannelSetupWizardTextInput["shouldPrompt"]>): ChannelSetupWizardTextInput;
export declare const signalNumberTextInput: ChannelSetupWizardTextInput;
export declare const signalCompletionNote: {
    title: string;
    lines: string[];
};
export declare const signalSetupAdapter: ChannelSetupAdapter;
export declare function createSignalSetupWizardProxy(loadWizard: () => Promise<ChannelSetupWizard>): ChannelSetupWizard;
