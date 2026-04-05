import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { TelegramExecApprovalConfig } from "openclaw/plugin-sdk/config-runtime";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
export declare function resolveTelegramExecApprovalConfig(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
}): TelegramExecApprovalConfig | undefined;
export declare function getTelegramExecApprovalApprovers(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
}): string[];
export declare function isTelegramExecApprovalClientEnabled(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
}): boolean;
export declare function isTelegramExecApprovalApprover(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
}): boolean;
export declare function resolveTelegramExecApprovalTarget(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
}): "dm" | "channel" | "both";
export declare function shouldInjectTelegramExecApprovalButtons(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    to: string;
}): boolean;
export declare function shouldEnableTelegramExecApprovalButtons(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    to: string;
}): boolean;
export declare function shouldSuppressLocalTelegramExecApprovalPrompt(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    payload: ReplyPayload;
}): boolean;
