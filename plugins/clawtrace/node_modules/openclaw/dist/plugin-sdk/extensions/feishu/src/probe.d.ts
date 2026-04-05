import { type FeishuClientCredentials } from "./client.js";
import type { FeishuProbeResult } from "./types.js";
export declare const FEISHU_PROBE_REQUEST_TIMEOUT_MS = 10000;
export type ProbeFeishuOptions = {
    timeoutMs?: number;
    abortSignal?: AbortSignal;
};
export declare function probeFeishu(creds?: FeishuClientCredentials, options?: ProbeFeishuOptions): Promise<FeishuProbeResult>;
/** Clear the probe cache (for testing). */
export declare function clearProbeCache(): void;
