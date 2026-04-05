import type { ClawdbotConfig, RuntimeEnv } from "../runtime-api.js";
import { resolveReactionSyntheticEvent, type FeishuReactionCreatedEvent } from "./monitor.account.js";
import { clearFeishuWebhookRateLimitStateForTest, getFeishuWebhookRateLimitStateSizeForTest, isWebhookRateLimitedForTest } from "./monitor.state.js";
export type MonitorFeishuOpts = {
    config?: ClawdbotConfig;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    accountId?: string;
};
export { clearFeishuWebhookRateLimitStateForTest, getFeishuWebhookRateLimitStateSizeForTest, isWebhookRateLimitedForTest, resolveReactionSyntheticEvent, };
export type { FeishuReactionCreatedEvent };
export declare function monitorFeishuProvider(opts?: MonitorFeishuOpts): Promise<void>;
export declare function stopFeishuMonitor(accountId?: string): void;
