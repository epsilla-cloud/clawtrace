import type { BaseProbeResult } from "openclaw/plugin-sdk/channel-contract";
export type SignalProbe = BaseProbeResult & {
    status?: number | null;
    elapsedMs: number;
    version?: string | null;
};
export declare function probeSignal(baseUrl: string, timeoutMs: number): Promise<SignalProbe>;
