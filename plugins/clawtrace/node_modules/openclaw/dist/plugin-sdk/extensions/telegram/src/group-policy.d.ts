import type { ChannelGroupContext } from "openclaw/plugin-sdk/channel-contract";
import { type GroupToolPolicyConfig } from "openclaw/plugin-sdk/channel-policy";
export declare function resolveTelegramGroupRequireMention(params: ChannelGroupContext): boolean | undefined;
export declare function resolveTelegramGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
