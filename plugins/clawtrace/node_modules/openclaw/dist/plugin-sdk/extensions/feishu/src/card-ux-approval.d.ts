export declare const FEISHU_APPROVAL_REQUEST_ACTION = "feishu.quick_actions.request_approval";
export declare const FEISHU_APPROVAL_CONFIRM_ACTION = "feishu.approval.confirm";
export declare const FEISHU_APPROVAL_CANCEL_ACTION = "feishu.approval.cancel";
export declare function createApprovalCard(params: {
    operatorOpenId: string;
    chatId?: string;
    command: string;
    prompt: string;
    expiresAt: number;
    chatType?: "p2p" | "group";
    sessionKey?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}): Record<string, unknown>;
