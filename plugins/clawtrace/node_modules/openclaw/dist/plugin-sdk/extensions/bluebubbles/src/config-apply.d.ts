import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
type BlueBubblesConfigPatch = {
    serverUrl?: string;
    password?: unknown;
    webhookPath?: string;
};
type AccountEnabledMode = boolean | "preserve-or-true";
export declare function applyBlueBubblesConnectionConfig(params: {
    cfg: OpenClawConfig;
    accountId: string;
    patch: BlueBubblesConfigPatch;
    onlyDefinedFields?: boolean;
    accountEnabled?: AccountEnabledMode;
}): OpenClawConfig;
export {};
