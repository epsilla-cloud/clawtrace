import type { OpenClawConfig } from "../config/config.js";
import type { ChannelId } from "./plugins/types.js";
type DiscordInspectModule = typeof import("./read-only-account-inspect.discord.runtime.js");
type SlackInspectModule = typeof import("./read-only-account-inspect.slack.runtime.js");
type TelegramInspectModule = typeof import("./read-only-account-inspect.telegram.runtime.js");
export type ReadOnlyInspectedAccount = Awaited<ReturnType<DiscordInspectModule["inspectDiscordAccount"]>> | Awaited<ReturnType<SlackInspectModule["inspectSlackAccount"]>> | Awaited<ReturnType<TelegramInspectModule["inspectTelegramAccount"]>>;
export declare function inspectReadOnlyChannelAccount(params: {
    channelId: ChannelId;
    cfg: OpenClawConfig;
    accountId?: string | null;
}): Promise<ReadOnlyInspectedAccount | null>;
export {};
