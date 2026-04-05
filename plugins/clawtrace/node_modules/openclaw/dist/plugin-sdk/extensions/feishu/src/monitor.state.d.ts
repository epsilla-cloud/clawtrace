import * as http from "http";
import * as Lark from "@larksuiteoapi/node-sdk";
import { type RuntimeEnv } from "../runtime-api.js";
export declare const wsClients: Map<string, Lark.WSClient>;
export declare const httpServers: Map<string, http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>>;
export declare const botOpenIds: Map<string, string>;
export declare const botNames: Map<string, string>;
export declare const FEISHU_WEBHOOK_MAX_BODY_BYTES: number;
export declare const FEISHU_WEBHOOK_BODY_TIMEOUT_MS = 5000;
type WebhookRateLimitDefaults = {
    windowMs: number;
    maxRequests: number;
    maxTrackedKeys: number;
};
type WebhookAnomalyDefaults = {
    maxTrackedKeys: number;
    ttlMs: number;
    logEvery: number;
};
export declare function resolveFeishuWebhookRateLimitDefaultsForTest(defaults: unknown): WebhookRateLimitDefaults;
export declare function resolveFeishuWebhookAnomalyDefaultsForTest(defaults: unknown): WebhookAnomalyDefaults;
export declare const feishuWebhookRateLimiter: import("openclaw/plugin-sdk/webhook-memory-guards").FixedWindowRateLimiter;
export declare function clearFeishuWebhookRateLimitStateForTest(): void;
export declare function getFeishuWebhookRateLimitStateSizeForTest(): number;
export declare function isWebhookRateLimitedForTest(key: string, nowMs: number): boolean;
export declare function recordWebhookStatus(runtime: RuntimeEnv | undefined, accountId: string, path: string, statusCode: number): void;
export declare function stopFeishuMonitorState(accountId?: string): void;
export {};
