import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { TelegramAccountConfig } from "../runtime-api.js";
export type TelegramCredentialStatus = "available" | "configured_unavailable" | "missing";
export type InspectedTelegramAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    token: string;
    tokenSource: "env" | "tokenFile" | "config" | "none";
    tokenStatus: TelegramCredentialStatus;
    configured: boolean;
    config: TelegramAccountConfig;
};
export declare function inspectTelegramAccount(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    envToken?: string | null;
}): InspectedTelegramAccount;
