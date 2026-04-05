import { type OpenClawConfig, type WizardPrompter } from "openclaw/plugin-sdk/setup";
import type { ChannelSetupAdapter } from "openclaw/plugin-sdk/setup";
import type { TelegramNetworkConfig } from "../runtime-api.js";
export declare const TELEGRAM_TOKEN_HELP_LINES: string[];
export declare const TELEGRAM_USER_ID_HELP_LINES: string[];
export declare function normalizeTelegramAllowFromInput(raw: string): string;
export declare function parseTelegramAllowFromId(raw: string): string | null;
export declare function resolveTelegramAllowFromEntries(params: {
    entries: string[];
    credentialValue?: string;
    apiRoot?: string;
    proxyUrl?: string;
    network?: TelegramNetworkConfig;
}): Promise<{
    input: string;
    resolved: boolean;
    id: string | null;
}[]>;
export declare function promptTelegramAllowFromForAccount(params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    accountId?: string;
}): Promise<OpenClawConfig>;
export declare const telegramSetupAdapter: ChannelSetupAdapter;
