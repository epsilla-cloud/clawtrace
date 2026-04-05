import { type RuntimeEnv } from "../runtime-api.js";
import type { ResolvedNextcloudTalkAccount } from "./accounts.js";
import type { CoreConfig, NextcloudTalkInboundMessage } from "./types.js";
export declare function handleNextcloudTalkInbound(params: {
    message: NextcloudTalkInboundMessage;
    account: ResolvedNextcloudTalkAccount;
    config: CoreConfig;
    runtime: RuntimeEnv;
    statusSink?: (patch: {
        lastInboundAt?: number;
        lastOutboundAt?: number;
    }) => void;
}): Promise<void>;
