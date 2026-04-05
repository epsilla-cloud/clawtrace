import { type SynologyInboundMessage } from "./inbound-context.js";
import type { ResolvedSynologyChatAccount } from "./types.js";
type SynologyChannelLog = {
    info?: (...args: unknown[]) => void;
};
export declare function dispatchSynologyChatInboundTurn(params: {
    account: ResolvedSynologyChatAccount;
    msg: SynologyInboundMessage;
    log?: SynologyChannelLog;
}): Promise<null>;
export {};
