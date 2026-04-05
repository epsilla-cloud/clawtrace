import { type ChannelPlugin, type OpenClawConfig } from "./runtime-api.js";
import { sendMessageZalo } from "./send.js";
export declare function notifyZaloPairingApproval(params: {
    cfg: OpenClawConfig;
    id: string;
}): Promise<void>;
export declare function sendZaloText(params: Parameters<typeof sendMessageZalo>[2] & {
    to: string;
    text: string;
}): Promise<import("./send.js").ZaloSendResult>;
export declare function probeZaloAccount(params: {
    account: import("./accounts.js").ResolvedZaloAccount;
    timeoutMs?: number;
}): Promise<import("./probe.js").ZaloProbeResult>;
export declare function startZaloGatewayAccount(ctx: Parameters<NonNullable<NonNullable<ChannelPlugin["gateway"]>["startAccount"]>>[0]): Promise<void>;
