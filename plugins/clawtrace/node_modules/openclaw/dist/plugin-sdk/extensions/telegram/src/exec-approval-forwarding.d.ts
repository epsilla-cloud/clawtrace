import { type ExecApprovalRequest } from "openclaw/plugin-sdk/approval-runtime";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
export declare function shouldSuppressTelegramExecApprovalForwardingFallback(params: {
    cfg: OpenClawConfig;
    target: {
        channel: string;
        accountId?: string | null;
    };
    request: ExecApprovalRequest;
}): boolean;
export declare function buildTelegramExecApprovalPendingPayload(params: {
    request: ExecApprovalRequest;
    nowMs: number;
}): import("openclaw/plugin-sdk").ReplyPayload;
