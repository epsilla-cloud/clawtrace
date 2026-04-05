import { type ExecApprovalRequest, type ExecApprovalResolved } from "openclaw/plugin-sdk/approval-runtime";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import { editMessageReplyMarkupTelegram, sendMessageTelegram, sendTypingTelegram } from "./send.js";
export type TelegramExecApprovalHandlerOpts = {
    token: string;
    accountId: string;
    cfg: OpenClawConfig;
    gatewayUrl?: string;
    runtime?: RuntimeEnv;
};
export type TelegramExecApprovalHandlerDeps = {
    nowMs?: () => number;
    sendTyping?: typeof sendTypingTelegram;
    sendMessage?: typeof sendMessageTelegram;
    editReplyMarkup?: typeof editMessageReplyMarkupTelegram;
};
export declare class TelegramExecApprovalHandler {
    private readonly opts;
    private gatewayClient;
    private pending;
    private started;
    private readonly nowMs;
    private readonly sendTyping;
    private readonly sendMessage;
    private readonly editReplyMarkup;
    constructor(opts: TelegramExecApprovalHandlerOpts, deps?: TelegramExecApprovalHandlerDeps);
    shouldHandle(request: ExecApprovalRequest): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    handleRequested(request: ExecApprovalRequest): Promise<void>;
    handleResolved(resolved: ExecApprovalResolved): Promise<void>;
    private handleGatewayEvent;
}
