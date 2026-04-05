import type { RuntimeEnv } from "../runtime-api.js";
import type { ResolvedFeishuAccount } from "./types.js";
export declare const FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS: number;
type FetchBotOpenIdOptions = {
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    timeoutMs?: number;
};
export type FeishuMonitorBotIdentity = {
    botOpenId?: string;
    botName?: string;
};
export declare function fetchBotIdentityForMonitor(account: ResolvedFeishuAccount, options?: FetchBotOpenIdOptions): Promise<FeishuMonitorBotIdentity>;
export declare function fetchBotOpenIdForMonitor(account: ResolvedFeishuAccount, options?: FetchBotOpenIdOptions): Promise<string | undefined>;
export {};
