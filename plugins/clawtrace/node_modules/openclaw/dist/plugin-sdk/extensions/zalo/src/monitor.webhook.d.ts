import type { IncomingMessage, ServerResponse } from "node:http";
import type { ResolvedZaloAccount } from "./accounts.js";
import type { ZaloFetch, ZaloUpdate } from "./api.js";
import type { ZaloRuntimeEnv } from "./monitor.js";
import { type RegisterWebhookTargetOptions, type RegisterWebhookPluginRouteOptions, type OpenClawConfig } from "./runtime-api.js";
export type ZaloWebhookTarget = {
    token: string;
    account: ResolvedZaloAccount;
    config: OpenClawConfig;
    runtime: ZaloRuntimeEnv;
    core: unknown;
    secret: string;
    path: string;
    mediaMaxMb: number;
    statusSink?: (patch: {
        lastInboundAt?: number;
        lastOutboundAt?: number;
    }) => void;
    fetcher?: ZaloFetch;
};
export type ZaloWebhookProcessUpdate = (params: {
    update: ZaloUpdate;
    target: ZaloWebhookTarget;
}) => Promise<void>;
export declare function clearZaloWebhookSecurityStateForTest(): void;
export declare function getZaloWebhookRateLimitStateSizeForTest(): number;
export declare function getZaloWebhookStatusCounterSizeForTest(): number;
export declare function registerZaloWebhookTarget(target: ZaloWebhookTarget, opts?: {
    route?: RegisterWebhookPluginRouteOptions;
} & Pick<RegisterWebhookTargetOptions<ZaloWebhookTarget>, "onFirstPathTarget" | "onLastPathTargetRemoved">): () => void;
export declare function handleZaloWebhookRequest(req: IncomingMessage, res: ServerResponse, processUpdate: ZaloWebhookProcessUpdate): Promise<boolean>;
