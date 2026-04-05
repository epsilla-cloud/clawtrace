/**
 * Mattermost native slash command support.
 *
 * Registers custom slash commands via the Mattermost REST API and handles
 * incoming command callbacks via an HTTP endpoint on the gateway.
 *
 * Architecture:
 * - On startup, registers commands with MM via POST /api/v4/commands
 * - MM sends HTTP POST to callbackUrl when a user invokes a command
 * - The callback handler reconstructs the text as `/<command> <args>` and
 *   routes it through the standard inbound reply pipeline
 * - On shutdown, cleans up registered commands via DELETE /api/v4/commands/{id}
 */
import type { MattermostClient } from "./client.js";
export type MattermostSlashCommandConfig = {
    /** Enable native slash commands. "auto" resolves to false for now (opt-in). */
    native: boolean | "auto";
    /** Also register skill-based commands. */
    nativeSkills: boolean | "auto";
    /** Path for the callback endpoint on the gateway HTTP server. */
    callbackPath: string;
    /**
     * Explicit callback URL override (e.g. behind a reverse proxy).
     * If not set, auto-derived from baseUrl + gateway port + callbackPath.
     */
    callbackUrl?: string;
};
export type MattermostCommandSpec = {
    trigger: string;
    description: string;
    autoComplete: boolean;
    autoCompleteHint?: string;
    /** Original command name (for skill commands that start with oc_) */
    originalName?: string;
};
export type MattermostRegisteredCommand = {
    id: string;
    trigger: string;
    teamId: string;
    token: string;
    /** True when this process created the command and should delete it on shutdown. */
    managed: boolean;
};
/**
 * Payload sent by Mattermost when a slash command is invoked.
 * Can arrive as application/x-www-form-urlencoded or application/json.
 */
export type MattermostSlashCommandPayload = {
    token: string;
    team_id: string;
    team_domain?: string;
    channel_id: string;
    channel_name?: string;
    user_id: string;
    user_name?: string;
    command: string;
    text: string;
    trigger_id?: string;
    response_url?: string;
};
/**
 * Response format for Mattermost slash command callbacks.
 */
export type MattermostSlashCommandResponse = {
    response_type?: "ephemeral" | "in_channel";
    text: string;
    username?: string;
    icon_url?: string;
    goto_location?: string;
    attachments?: unknown[];
};
type MattermostCommandCreate = {
    team_id: string;
    trigger: string;
    method: "P" | "G";
    url: string;
    description?: string;
    auto_complete: boolean;
    auto_complete_desc?: string;
    auto_complete_hint?: string;
    token?: string;
    creator_id?: string;
};
type MattermostCommandUpdate = {
    id: string;
    team_id: string;
    trigger: string;
    method: "P" | "G";
    url: string;
    description?: string;
    auto_complete: boolean;
    auto_complete_desc?: string;
    auto_complete_hint?: string;
};
type MattermostCommandResponse = {
    id: string;
    token: string;
    team_id: string;
    trigger: string;
    method: string;
    url: string;
    auto_complete: boolean;
    auto_complete_desc?: string;
    auto_complete_hint?: string;
    creator_id?: string;
    create_at?: number;
    update_at?: number;
    delete_at?: number;
};
/**
 * Built-in OpenClaw commands to register as native slash commands.
 * These mirror the text-based commands already handled by the gateway.
 */
export declare const DEFAULT_COMMAND_SPECS: MattermostCommandSpec[];
/**
 * List existing custom slash commands for a team.
 */
export declare function listMattermostCommands(client: MattermostClient, teamId: string): Promise<MattermostCommandResponse[]>;
/**
 * Create a custom slash command on a Mattermost team.
 */
export declare function createMattermostCommand(client: MattermostClient, params: MattermostCommandCreate): Promise<MattermostCommandResponse>;
/**
 * Delete a custom slash command.
 */
export declare function deleteMattermostCommand(client: MattermostClient, commandId: string): Promise<void>;
/**
 * Update an existing custom slash command.
 */
export declare function updateMattermostCommand(client: MattermostClient, params: MattermostCommandUpdate): Promise<MattermostCommandResponse>;
/**
 * Register all OpenClaw slash commands for a given team.
 * Skips commands that are already registered with the same trigger + callback URL.
 * Returns the list of newly created command IDs.
 */
export declare function registerSlashCommands(params: {
    client: MattermostClient;
    teamId: string;
    creatorUserId: string;
    callbackUrl: string;
    commands: MattermostCommandSpec[];
    log?: (msg: string) => void;
}): Promise<MattermostRegisteredCommand[]>;
/**
 * Clean up all registered slash commands.
 */
export declare function cleanupSlashCommands(params: {
    client: MattermostClient;
    commands: MattermostRegisteredCommand[];
    log?: (msg: string) => void;
}): Promise<void>;
/**
 * Parse a Mattermost slash command callback payload from a URL-encoded or JSON body.
 */
export declare function parseSlashCommandPayload(body: string, contentType?: string): MattermostSlashCommandPayload | null;
/**
 * Map the trigger word back to the original OpenClaw command name.
 * e.g. "oc_status" -> "/status", "oc_model" -> "/model"
 */
export declare function resolveCommandText(trigger: string, text: string, triggerMap?: ReadonlyMap<string, string>): string;
export declare function resolveSlashCommandConfig(raw?: Partial<MattermostSlashCommandConfig>): MattermostSlashCommandConfig;
export declare function isSlashCommandsEnabled(config: MattermostSlashCommandConfig): boolean;
/**
 * Build the callback URL that Mattermost will POST to when a command is invoked.
 */
export declare function resolveCallbackUrl(params: {
    config: MattermostSlashCommandConfig;
    gatewayPort: number;
    gatewayHost?: string;
}): string;
export {};
