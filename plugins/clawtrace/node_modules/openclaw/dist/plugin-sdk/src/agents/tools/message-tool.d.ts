import { resolveCommandSecretRefsViaGateway } from "../../cli/command-secret-gateway.js";
import type { OpenClawConfig } from "../../config/config.js";
import { runMessageAction } from "../../infra/outbound/message-action-runner.js";
import type { AnyAgentTool } from "./common.js";
type MessageToolOptions = {
    agentAccountId?: string;
    agentSessionKey?: string;
    sessionId?: string;
    config?: OpenClawConfig;
    loadConfig?: () => OpenClawConfig;
    resolveCommandSecretRefsViaGateway?: typeof resolveCommandSecretRefsViaGateway;
    runMessageAction?: typeof runMessageAction;
    currentChannelId?: string;
    currentChannelProvider?: string;
    currentThreadTs?: string;
    currentMessageId?: string | number;
    replyToMode?: "off" | "first" | "all";
    hasRepliedRef?: {
        value: boolean;
    };
    sandboxRoot?: string;
    requireExplicitTarget?: boolean;
    requesterSenderId?: string;
};
export declare function createMessageTool(options?: MessageToolOptions): AnyAgentTool;
export {};
