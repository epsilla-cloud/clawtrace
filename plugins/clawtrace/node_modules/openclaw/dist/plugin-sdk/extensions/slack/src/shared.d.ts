import { type ResolvedSlackAccount } from "./accounts.js";
import { type ChannelPlugin, type OpenClawConfig } from "./runtime-api.js";
export declare const SLACK_CHANNEL: "slack";
export declare function buildSlackSetupLines(botName?: string): string[];
export declare function setSlackChannelAllowlist(cfg: OpenClawConfig, accountId: string, channelKeys: string[]): OpenClawConfig;
export declare function isSlackPluginAccountConfigured(account: ResolvedSlackAccount): boolean;
export declare function isSlackSetupAccountConfigured(account: ResolvedSlackAccount): boolean;
export declare const slackConfigAdapter: {
    listAccountIds: (cfg: OpenClawConfig) => string[];
    resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedSlackAccount;
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
export declare function createSlackPluginBase(params: {
    setupWizard: NonNullable<ChannelPlugin<ResolvedSlackAccount>["setupWizard"]>;
    setup: NonNullable<ChannelPlugin<ResolvedSlackAccount>["setup"]>;
}): Pick<ChannelPlugin<ResolvedSlackAccount>, "id" | "meta" | "setupWizard" | "capabilities" | "agentPrompt" | "streaming" | "reload" | "configSchema" | "config" | "setup">;
