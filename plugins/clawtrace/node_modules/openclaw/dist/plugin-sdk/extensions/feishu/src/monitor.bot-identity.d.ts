import type { RuntimeEnv } from "../runtime-api.js";
import { type FeishuMonitorBotIdentity } from "./monitor.startup.js";
import type { ResolvedFeishuAccount } from "./types.js";
export declare const BOT_IDENTITY_RETRY_DELAYS_MS: number[];
export declare function applyBotIdentityState(accountId: string, identity: FeishuMonitorBotIdentity): {
    botOpenId?: string;
    botName?: string;
};
export declare function startBotIdentityRecovery(params: {
    account: ResolvedFeishuAccount;
    accountId: string;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
}): void;
