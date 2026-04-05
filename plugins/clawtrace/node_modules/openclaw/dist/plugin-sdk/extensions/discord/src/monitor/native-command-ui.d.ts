import { Button, Row, StringSelectMenu, type AutocompleteInteraction, type ButtonInteraction, type CommandInteraction, type ComponentData, type StringSelectMenuInteraction } from "@buape/carbon";
import { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgs } from "openclaw/plugin-sdk/command-auth";
import type { OpenClawConfig, loadConfig } from "openclaw/plugin-sdk/config-runtime";
import { type DiscordModelPickerCommandContext } from "./model-picker.js";
import type { ThreadBindingManager } from "./thread-bindings.js";
type DiscordConfig = NonNullable<OpenClawConfig["channels"]>["discord"];
export type DiscordCommandArgContext = {
    cfg: ReturnType<typeof loadConfig>;
    discordConfig: DiscordConfig;
    accountId: string;
    sessionPrefix: string;
    threadBindings: ThreadBindingManager;
};
export type DiscordModelPickerContext = DiscordCommandArgContext;
export type DispatchDiscordCommandInteractionParams = {
    interaction: CommandInteraction | ButtonInteraction | StringSelectMenuInteraction;
    prompt: string;
    command: ChatCommandDefinition;
    commandArgs?: CommandArgs;
    cfg: ReturnType<typeof loadConfig>;
    discordConfig: DiscordConfig;
    accountId: string;
    sessionPrefix: string;
    preferFollowUp: boolean;
    threadBindings: ThreadBindingManager;
    suppressReplies?: boolean;
};
export type DispatchDiscordCommandInteraction = (params: DispatchDiscordCommandInteractionParams) => Promise<void>;
export type SafeDiscordInteractionCall = <T>(label: string, fn: () => Promise<T>) => Promise<T | null>;
export declare function buildDiscordCommandArgCustomId(params: {
    command: string;
    arg: string;
    value: string;
    userId: string;
}): string;
export declare function shouldOpenDiscordModelPickerFromCommand(params: {
    command: ChatCommandDefinition;
    commandArgs?: CommandArgs;
}): DiscordModelPickerCommandContext | null;
export declare function resolveDiscordNativeChoiceContext(params: {
    interaction: AutocompleteInteraction;
    cfg: ReturnType<typeof loadConfig>;
    accountId: string;
    threadBindings: ThreadBindingManager;
}): Promise<{
    provider?: string;
    model?: string;
} | null>;
export declare function replyWithDiscordModelPickerProviders(params: {
    interaction: CommandInteraction | ButtonInteraction | StringSelectMenuInteraction;
    cfg: ReturnType<typeof loadConfig>;
    command: DiscordModelPickerCommandContext;
    userId: string;
    accountId: string;
    threadBindings: ThreadBindingManager;
    preferFollowUp: boolean;
    safeInteractionCall: SafeDiscordInteractionCall;
}): Promise<void>;
export declare function handleDiscordModelPickerInteraction(params: {
    interaction: ButtonInteraction | StringSelectMenuInteraction;
    data: ComponentData;
    ctx: DiscordModelPickerContext;
    safeInteractionCall: SafeDiscordInteractionCall;
    dispatchCommandInteraction: DispatchDiscordCommandInteraction;
}): Promise<void>;
export declare function handleDiscordCommandArgInteraction(params: {
    interaction: ButtonInteraction;
    data: ComponentData;
    ctx: DiscordCommandArgContext;
    safeInteractionCall: SafeDiscordInteractionCall;
    dispatchCommandInteraction: DispatchDiscordCommandInteraction;
}): Promise<void>;
export declare function buildDiscordCommandArgMenu(params: {
    command: ChatCommandDefinition;
    menu: {
        arg: CommandArgDefinition;
        choices: Array<{
            value: string;
            label: string;
        }>;
        title?: string;
    };
    interaction: CommandInteraction;
    ctx: DiscordCommandArgContext;
    safeInteractionCall: SafeDiscordInteractionCall;
    dispatchCommandInteraction: DispatchDiscordCommandInteraction;
}): {
    content: string;
    components: Row<Button>[];
};
export declare function createDiscordCommandArgFallbackButton(params: {
    ctx: DiscordCommandArgContext;
    safeInteractionCall: SafeDiscordInteractionCall;
    dispatchCommandInteraction: DispatchDiscordCommandInteraction;
}): Button;
export declare function createDiscordModelPickerFallbackButton(params: {
    ctx: DiscordModelPickerContext;
    safeInteractionCall: SafeDiscordInteractionCall;
    dispatchCommandInteraction: DispatchDiscordCommandInteraction;
}): Button;
export declare function createDiscordModelPickerFallbackSelect(params: {
    ctx: DiscordModelPickerContext;
    safeInteractionCall: SafeDiscordInteractionCall;
    dispatchCommandInteraction: DispatchDiscordCommandInteraction;
}): StringSelectMenu;
export {};
