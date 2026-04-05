import { type ChannelPlugin } from "../runtime-api.js";
import { type ResolvedTelegramAccount } from "./accounts.js";
import type { TelegramProbe } from "./probe.js";
export declare const telegramSetupPlugin: ChannelPlugin<ResolvedTelegramAccount, TelegramProbe>;
