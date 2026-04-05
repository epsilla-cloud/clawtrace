import { type DiscordInteractiveDispatchContext, type SlackInteractiveDispatchContext, type TelegramInteractiveDispatchContext } from "./interactive-dispatch-adapters.js";
import type { PluginInteractiveDiscordHandlerContext, PluginInteractiveButtons, PluginInteractiveHandlerRegistration, PluginInteractiveSlackHandlerContext } from "./types.js";
type InteractiveRegistrationResult = {
    ok: boolean;
    error?: string;
};
type InteractiveDispatchResult = {
    matched: false;
    handled: false;
    duplicate: false;
} | {
    matched: true;
    handled: boolean;
    duplicate: boolean;
};
export declare function registerPluginInteractiveHandler(pluginId: string, registration: PluginInteractiveHandlerRegistration, opts?: {
    pluginName?: string;
    pluginRoot?: string;
}): InteractiveRegistrationResult;
export declare function clearPluginInteractiveHandlers(): void;
export declare function clearPluginInteractiveHandlersForPlugin(pluginId: string): void;
export declare function dispatchPluginInteractiveHandler(params: {
    channel: "telegram";
    data: string;
    callbackId: string;
    ctx: TelegramInteractiveDispatchContext;
    respond: {
        reply: (params: {
            text: string;
            buttons?: PluginInteractiveButtons;
        }) => Promise<void>;
        editMessage: (params: {
            text: string;
            buttons?: PluginInteractiveButtons;
        }) => Promise<void>;
        editButtons: (params: {
            buttons: PluginInteractiveButtons;
        }) => Promise<void>;
        clearButtons: () => Promise<void>;
        deleteMessage: () => Promise<void>;
    };
    onMatched?: () => Promise<void> | void;
}): Promise<InteractiveDispatchResult>;
export declare function dispatchPluginInteractiveHandler(params: {
    channel: "discord";
    data: string;
    interactionId: string;
    ctx: DiscordInteractiveDispatchContext;
    respond: PluginInteractiveDiscordHandlerContext["respond"];
    onMatched?: () => Promise<void> | void;
}): Promise<InteractiveDispatchResult>;
export declare function dispatchPluginInteractiveHandler(params: {
    channel: "slack";
    data: string;
    interactionId: string;
    ctx: SlackInteractiveDispatchContext;
    respond: PluginInteractiveSlackHandlerContext["respond"];
    onMatched?: () => Promise<void> | void;
}): Promise<InteractiveDispatchResult>;
export {};
