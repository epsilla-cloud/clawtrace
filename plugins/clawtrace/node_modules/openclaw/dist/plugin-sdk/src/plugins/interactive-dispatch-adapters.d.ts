import type { PluginInteractiveDiscordHandlerContext, PluginInteractiveDiscordHandlerRegistration, PluginInteractiveSlackHandlerContext, PluginInteractiveSlackHandlerRegistration, PluginInteractiveTelegramHandlerContext, PluginInteractiveTelegramHandlerRegistration } from "./types.js";
type RegisteredInteractiveMetadata = {
    pluginId: string;
    pluginName?: string;
    pluginRoot?: string;
};
export type TelegramInteractiveDispatchContext = Omit<PluginInteractiveTelegramHandlerContext, "callback" | "respond" | "channel" | "requestConversationBinding" | "detachConversationBinding" | "getCurrentConversationBinding"> & {
    callbackMessage: {
        messageId: number;
        chatId: string;
        messageText?: string;
    };
};
export type DiscordInteractiveDispatchContext = Omit<PluginInteractiveDiscordHandlerContext, "interaction" | "respond" | "channel" | "requestConversationBinding" | "detachConversationBinding" | "getCurrentConversationBinding"> & {
    interaction: Omit<PluginInteractiveDiscordHandlerContext["interaction"], "data" | "namespace" | "payload">;
};
export type SlackInteractiveDispatchContext = Omit<PluginInteractiveSlackHandlerContext, "interaction" | "respond" | "channel" | "requestConversationBinding" | "detachConversationBinding" | "getCurrentConversationBinding"> & {
    interaction: Omit<PluginInteractiveSlackHandlerContext["interaction"], "data" | "namespace" | "payload">;
};
export declare function dispatchTelegramInteractiveHandler(params: {
    registration: PluginInteractiveTelegramHandlerRegistration & RegisteredInteractiveMetadata;
    data: string;
    namespace: string;
    payload: string;
    ctx: TelegramInteractiveDispatchContext;
    respond: PluginInteractiveTelegramHandlerContext["respond"];
}): import("./types.js").PluginInteractiveTelegramHandlerResult | Promise<import("./types.js").PluginInteractiveTelegramHandlerResult>;
export declare function dispatchDiscordInteractiveHandler(params: {
    registration: PluginInteractiveDiscordHandlerRegistration & RegisteredInteractiveMetadata;
    data: string;
    namespace: string;
    payload: string;
    ctx: DiscordInteractiveDispatchContext;
    respond: PluginInteractiveDiscordHandlerContext["respond"];
}): import("./types.js").PluginInteractiveDiscordHandlerResult | Promise<import("./types.js").PluginInteractiveDiscordHandlerResult>;
export declare function dispatchSlackInteractiveHandler(params: {
    registration: PluginInteractiveSlackHandlerRegistration & RegisteredInteractiveMetadata;
    data: string;
    namespace: string;
    payload: string;
    ctx: SlackInteractiveDispatchContext;
    respond: PluginInteractiveSlackHandlerContext["respond"];
}): import("./types.js").PluginInteractiveSlackHandlerResult | Promise<import("./types.js").PluginInteractiveSlackHandlerResult>;
export {};
