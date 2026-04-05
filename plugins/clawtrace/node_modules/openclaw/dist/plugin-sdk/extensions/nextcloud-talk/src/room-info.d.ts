import { type RuntimeEnv } from "../runtime-api.js";
import type { ResolvedNextcloudTalkAccount } from "./accounts.js";
export declare function resolveNextcloudTalkRoomKind(params: {
    account: ResolvedNextcloudTalkAccount;
    roomToken: string;
    runtime?: RuntimeEnv;
}): Promise<"direct" | "group" | undefined>;
