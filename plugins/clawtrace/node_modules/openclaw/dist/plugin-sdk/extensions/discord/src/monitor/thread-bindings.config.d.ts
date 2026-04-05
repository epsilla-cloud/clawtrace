import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { resolveThreadBindingIdleTimeoutMs, resolveThreadBindingMaxAgeMs, resolveThreadBindingsEnabled } from "openclaw/plugin-sdk/conversation-runtime";
export { resolveThreadBindingIdleTimeoutMs, resolveThreadBindingMaxAgeMs, resolveThreadBindingsEnabled, };
export declare function resolveDiscordThreadBindingIdleTimeoutMs(params: {
    cfg: OpenClawConfig;
    accountId?: string;
}): number;
export declare function resolveDiscordThreadBindingMaxAgeMs(params: {
    cfg: OpenClawConfig;
    accountId?: string;
}): number;
