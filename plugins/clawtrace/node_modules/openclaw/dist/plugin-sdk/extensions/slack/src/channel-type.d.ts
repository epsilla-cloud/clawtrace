import type { OpenClawConfig } from "./runtime-api.js";
export declare function resolveSlackChannelType(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    channelId: string;
}): Promise<"channel" | "group" | "dm" | "unknown">;
