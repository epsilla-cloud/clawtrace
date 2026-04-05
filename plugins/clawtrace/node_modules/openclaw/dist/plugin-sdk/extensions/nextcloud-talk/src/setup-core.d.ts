import type { ChannelSetupAdapter } from "openclaw/plugin-sdk/channel-setup";
import { type ChannelSetupDmPolicy } from "openclaw/plugin-sdk/setup-runtime";
import type { CoreConfig } from "./types.js";
export declare function normalizeNextcloudTalkBaseUrl(value: string | undefined): string;
export declare function validateNextcloudTalkBaseUrl(value: string): string | undefined;
export declare function setNextcloudTalkAccountConfig(cfg: CoreConfig, accountId: string, updates: Record<string, unknown>): CoreConfig;
export declare function clearNextcloudTalkAccountFields(cfg: CoreConfig, accountId: string, fields: string[]): CoreConfig;
export declare const nextcloudTalkDmPolicy: ChannelSetupDmPolicy;
export declare const nextcloudTalkSetupAdapter: ChannelSetupAdapter;
