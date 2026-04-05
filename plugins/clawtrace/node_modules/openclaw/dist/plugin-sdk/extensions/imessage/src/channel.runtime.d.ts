import type { ResolvedIMessageAccount } from "./accounts.js";
import { imessageSetupWizard } from "./setup-surface.js";
export declare function sendIMessageOutbound(params: {
    cfg: Parameters<typeof import("./accounts.js").resolveIMessageAccount>[0]["cfg"];
    to: string;
    text: string;
    mediaUrl?: string;
    mediaLocalRoots?: readonly string[];
    accountId?: string;
    deps?: {
        [channelId: string]: unknown;
    };
    replyToId?: string;
}): Promise<import("./send.ts").IMessageSendResult>;
export declare function notifyIMessageApproval(id: string): Promise<void>;
export declare function probeIMessageAccount(timeoutMs?: number): Promise<import("./probe.js").IMessageProbe>;
export declare function startIMessageGatewayAccount(ctx: Parameters<NonNullable<NonNullable<import("../runtime-api.js").ChannelPlugin<ResolvedIMessageAccount>["gateway"]>["startAccount"]>>[0]): Promise<void>;
export { imessageSetupWizard };
