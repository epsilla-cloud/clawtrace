import { type ResolvedTelegramAccount } from "./accounts.js";
import * as probeModule from "./probe.js";
export declare const telegramPlugin: import("openclaw/plugin-sdk/core").ChannelPlugin<ResolvedTelegramAccount, probeModule.TelegramProbe, unknown>;
