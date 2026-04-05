import type { ResolvedSynologyChatAccount } from "./types.js";
export type SynologyInboundMessage = {
    body: string;
    from: string;
    senderName: string;
    provider: string;
    chatType: string;
    accountId: string;
    commandAuthorized: boolean;
    chatUserId?: string;
};
export declare function buildSynologyChatInboundContext<TContext>(params: {
    finalizeInboundContext: (ctx: Record<string, unknown>) => TContext;
    account: ResolvedSynologyChatAccount;
    msg: SynologyInboundMessage;
    sessionKey: string;
}): TContext;
