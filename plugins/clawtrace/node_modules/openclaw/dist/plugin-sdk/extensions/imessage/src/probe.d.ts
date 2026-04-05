import type { BaseProbeResult } from "openclaw/plugin-sdk/channel-contract";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
export { DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS } from "./constants.js";
export type IMessageProbe = BaseProbeResult & {
    fatal?: boolean;
};
export type IMessageProbeOptions = {
    cliPath?: string;
    dbPath?: string;
    runtime?: RuntimeEnv;
};
/**
 * Probe iMessage RPC availability.
 * @param timeoutMs - Explicit timeout in ms. If undefined, uses config or default.
 * @param opts - Additional options (cliPath, dbPath, runtime).
 */
export declare function probeIMessage(timeoutMs?: number, opts?: IMessageProbeOptions): Promise<IMessageProbe>;
