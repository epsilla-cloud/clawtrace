import type { ChannelMessageActionName } from "openclaw/plugin-sdk/channel-contract";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { ChannelToolSend } from "openclaw/plugin-sdk/tool-send";
export declare function listSlackMessageActions(cfg: OpenClawConfig): ChannelMessageActionName[];
export declare function extractSlackToolSend(args: Record<string, unknown>): ChannelToolSend | null;
