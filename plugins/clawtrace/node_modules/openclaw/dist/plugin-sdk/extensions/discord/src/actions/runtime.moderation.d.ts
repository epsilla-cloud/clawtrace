import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { type ActionGate, type DiscordActionConfig } from "../runtime-api.js";
import { banMemberDiscord, hasAnyGuildPermissionDiscord, kickMemberDiscord, timeoutMemberDiscord } from "../send.js";
export declare const discordModerationActionRuntime: {
    banMemberDiscord: typeof banMemberDiscord;
    hasAnyGuildPermissionDiscord: typeof hasAnyGuildPermissionDiscord;
    kickMemberDiscord: typeof kickMemberDiscord;
    timeoutMemberDiscord: typeof timeoutMemberDiscord;
};
export declare function handleDiscordModerationAction(action: string, params: Record<string, unknown>, isActionEnabled: ActionGate<DiscordActionConfig>): Promise<AgentToolResult<unknown>>;
