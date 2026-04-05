import type { ResolvedIrcAccount } from "./accounts.js";
import { type RuntimeEnv } from "./runtime-api.js";
import type { CoreConfig, IrcInboundMessage } from "./types.js";
declare function resolveIrcEffectiveAllowlists(params: {
    configAllowFrom: string[];
    configGroupAllowFrom: string[];
    storeAllowList: string[];
    dmPolicy: string;
}): {
    effectiveAllowFrom: string[];
    effectiveGroupAllowFrom: string[];
};
export declare function handleIrcInbound(params: {
    message: IrcInboundMessage;
    account: ResolvedIrcAccount;
    config: CoreConfig;
    runtime: RuntimeEnv;
    connectedNick?: string;
    sendReply?: (target: string, text: string, replyToId?: string) => Promise<void>;
    statusSink?: (patch: {
        lastInboundAt?: number;
        lastOutboundAt?: number;
    }) => void;
}): Promise<void>;
export declare const __testing: {
    resolveIrcEffectiveAllowlists: typeof resolveIrcEffectiveAllowlists;
};
export {};
