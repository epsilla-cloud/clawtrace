import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
export declare function maybePersistResolvedTelegramTarget(params: {
    cfg: OpenClawConfig;
    rawTarget: string;
    resolvedChatId: string;
    verbose?: boolean;
    gatewayClientScopes?: readonly string[];
}): Promise<void>;
