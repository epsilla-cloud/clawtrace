import type { CoreConfig, IrcProbe } from "./types.js";
export declare function probeIrc(cfg: CoreConfig, opts?: {
    accountId?: string;
    timeoutMs?: number;
}): Promise<IrcProbe>;
