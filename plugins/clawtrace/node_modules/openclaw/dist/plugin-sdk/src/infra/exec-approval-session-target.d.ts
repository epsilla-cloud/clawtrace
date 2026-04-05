import type { OpenClawConfig } from "../config/config.js";
import type { ExecApprovalRequest } from "./exec-approvals.js";
export type ExecApprovalSessionTarget = {
    channel?: string;
    to: string;
    accountId?: string;
    threadId?: number;
};
export declare function resolveExecApprovalSessionTarget(params: {
    cfg: OpenClawConfig;
    request: ExecApprovalRequest;
    turnSourceChannel?: string | null;
    turnSourceTo?: string | null;
    turnSourceAccountId?: string | null;
    turnSourceThreadId?: string | number | null;
}): ExecApprovalSessionTarget | null;
