import type { ChannelResolveKind, ChannelResolveResult, RuntimeEnv } from "./runtime-api.js";
export declare function resolveMatrixTargets(params: {
    cfg: unknown;
    accountId?: string | null;
    inputs: string[];
    kind: ChannelResolveKind;
    runtime?: RuntimeEnv;
}): Promise<ChannelResolveResult[]>;
