import { type ZaloBotInfo, type ZaloFetch } from "./api.js";
import type { BaseProbeResult } from "./runtime-api.js";
export type ZaloProbeResult = BaseProbeResult<string> & {
    bot?: ZaloBotInfo;
    elapsedMs: number;
};
export declare function probeZalo(token: string, timeoutMs?: number, fetcher?: ZaloFetch): Promise<ZaloProbeResult>;
