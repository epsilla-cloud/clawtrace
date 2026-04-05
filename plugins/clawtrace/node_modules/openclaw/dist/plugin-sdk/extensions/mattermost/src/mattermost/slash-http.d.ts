/**
 * HTTP callback handler for Mattermost slash commands.
 *
 * Receives POST requests from Mattermost when a slash command is invoked,
 * validates the token, and routes the command through the standard inbound pipeline.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import type { ResolvedMattermostAccount } from "../mattermost/accounts.js";
import { type OpenClawConfig, type RuntimeEnv } from "./runtime-api.js";
type SlashHttpHandlerParams = {
    account: ResolvedMattermostAccount;
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    /** Expected token from registered commands (for validation). */
    commandTokens: Set<string>;
    /** Map from trigger to original command name (for skill commands that start with oc_). */
    triggerMap?: ReadonlyMap<string, string>;
    log?: (msg: string) => void;
};
/**
 * Create the HTTP request handler for Mattermost slash command callbacks.
 *
 * This handler is registered as a plugin HTTP route and receives POSTs
 * from the Mattermost server when a user invokes a registered slash command.
 */
export declare function createSlashCommandHttpHandler(params: SlashHttpHandlerParams): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export {};
