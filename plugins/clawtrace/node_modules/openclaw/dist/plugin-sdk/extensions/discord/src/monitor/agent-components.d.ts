import { Button, ChannelSelectMenu, MentionableSelectMenu, Modal, RoleSelectMenu, StringSelectMenu, UserSelectMenu, type ButtonInteraction, type ComponentData, type StringSelectMenuInteraction } from "@buape/carbon";
import type { APIStringSelectComponent } from "discord-api-types/v10";
import { ButtonStyle } from "discord-api-types/v10";
import { type AgentComponentContext } from "./agent-components-helpers.js";
export declare class AgentComponentButton extends Button {
    label: string;
    customId: string;
    style: ButtonStyle;
    private ctx;
    constructor(ctx: AgentComponentContext);
    run(interaction: ButtonInteraction, data: ComponentData): Promise<void>;
}
export declare class AgentSelectMenu extends StringSelectMenu {
    customId: string;
    options: APIStringSelectComponent["options"];
    private ctx;
    constructor(ctx: AgentComponentContext);
    run(interaction: StringSelectMenuInteraction, data: ComponentData): Promise<void>;
}
export declare function createAgentComponentButton(ctx: AgentComponentContext): Button;
export declare function createAgentSelectMenu(ctx: AgentComponentContext): StringSelectMenu;
export declare function createDiscordComponentButton(ctx: AgentComponentContext): Button;
export declare function createDiscordComponentStringSelect(ctx: AgentComponentContext): StringSelectMenu;
export declare function createDiscordComponentUserSelect(ctx: AgentComponentContext): UserSelectMenu;
export declare function createDiscordComponentRoleSelect(ctx: AgentComponentContext): RoleSelectMenu;
export declare function createDiscordComponentMentionableSelect(ctx: AgentComponentContext): MentionableSelectMenu;
export declare function createDiscordComponentChannelSelect(ctx: AgentComponentContext): ChannelSelectMenu;
export declare function createDiscordComponentModal(ctx: AgentComponentContext): Modal;
