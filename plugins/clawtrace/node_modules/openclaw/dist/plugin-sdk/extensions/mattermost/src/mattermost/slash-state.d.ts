/**
 * Shared state for Mattermost slash commands.
 *
 * Bridges the plugin registration phase (HTTP route) with the monitor phase
 * (command registration with MM API). The HTTP handler needs to know which
 * tokens are valid, and the monitor needs to store registered command IDs.
 *
 * State is kept per-account so that multi-account deployments don't
 * overwrite each other's tokens, registered commands, or handlers.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import type { ResolvedMattermostAccount } from "./accounts.js";
import type { OpenClawPluginApi } from "./runtime-api.js";
import { type MattermostRegisteredCommand } from "./slash-commands.js";
export type SlashCommandAccountState = {
    /** Tokens from registered commands, used for validation. */
    commandTokens: Set<string>;
    /** Registered command IDs for cleanup on shutdown. */
    registeredCommands: MattermostRegisteredCommand[];
    /** Current HTTP handler for this account. */
    handler: ((req: IncomingMessage, res: ServerResponse) => Promise<void>) | null;
    /** The account that activated slash commands. */
    account: ResolvedMattermostAccount;
    /** Map from trigger to original command name (for skill commands that start with oc_). */
    triggerMap: Map<string, string>;
};
export declare function resolveSlashHandlerForToken(token: string): {
    kind: "none" | "single" | "ambiguous";
    handler?: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    accountIds?: string[];
};
/**
 * Get the slash command state for a specific account, or null if not activated.
 */
export declare function getSlashCommandState(accountId: string): SlashCommandAccountState | null;
/**
 * Get all active slash command account states.
 */
export declare function getAllSlashCommandStates(): ReadonlyMap<string, SlashCommandAccountState>;
/**
 * Activate slash commands for a specific account.
 * Called from the monitor after bot connects.
 */
export declare function activateSlashCommands(params: {
    account: ResolvedMattermostAccount;
    commandTokens: string[];
    registeredCommands: MattermostRegisteredCommand[];
    triggerMap?: Map<string, string>;
    api: {
        cfg: import("./runtime-api.js").OpenClawConfig;
        runtime: import("./runtime-api.js").RuntimeEnv;
    };
    log?: (msg: string) => void;
}): void;
/**
 * Deactivate slash commands for a specific account (on shutdown/disconnect).
 */
export declare function deactivateSlashCommands(accountId?: string): void;
/**
 * Register the HTTP route for slash command callbacks.
 * Called during plugin registration.
 *
 * The single HTTP route dispatches to the correct per-account handler
 * by matching the inbound token against each account's registered tokens.
 */
export declare function registerSlashCommandRoute(api: OpenClawPluginApi): void;
