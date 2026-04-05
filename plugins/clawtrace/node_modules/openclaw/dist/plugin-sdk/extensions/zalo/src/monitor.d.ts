import type { IncomingMessage, ServerResponse } from "node:http";
import type { ResolvedZaloAccount } from "./accounts.js";
import { type ZaloFetch } from "./api.js";
import { evaluateZaloGroupAccess, resolveZaloRuntimeGroupPolicy } from "./group-access.js";
import { clearZaloWebhookSecurityStateForTest, getZaloWebhookRateLimitStateSizeForTest, getZaloWebhookStatusCounterSizeForTest, type ZaloWebhookTarget } from "./monitor.webhook.js";
import type { OpenClawConfig } from "./runtime-api.js";
export type ZaloRuntimeEnv = {
    log?: (message: string) => void;
    error?: (message: string) => void;
};
export type ZaloMonitorOptions = {
    token: string;
    account: ResolvedZaloAccount;
    config: OpenClawConfig;
    runtime: ZaloRuntimeEnv;
    abortSignal: AbortSignal;
    useWebhook?: boolean;
    webhookUrl?: string;
    webhookSecret?: string;
    webhookPath?: string;
    fetcher?: ZaloFetch;
    statusSink?: (patch: {
        lastInboundAt?: number;
        lastOutboundAt?: number;
    }) => void;
};
export declare function registerZaloWebhookTarget(target: ZaloWebhookTarget): () => void;
export { clearZaloWebhookSecurityStateForTest, getZaloWebhookRateLimitStateSizeForTest, getZaloWebhookStatusCounterSizeForTest, };
export declare function handleZaloWebhookRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
export declare function monitorZaloProvider(options: ZaloMonitorOptions): Promise<void>;
export declare const __testing: {
    evaluateZaloGroupAccess: typeof evaluateZaloGroupAccess;
    resolveZaloRuntimeGroupPolicy: typeof resolveZaloRuntimeGroupPolicy;
};
