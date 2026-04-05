/**
 * Inbound webhook handler for Synology Chat outgoing webhooks.
 * Parses form-urlencoded/JSON body, validates security, delivers to agent.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import type { ResolvedSynologyChatAccount } from "./types.js";
export declare function clearSynologyWebhookRateLimiterStateForTest(): void;
export declare function getSynologyWebhookRateLimiterCountForTest(): number;
export interface WebhookHandlerDeps {
    account: ResolvedSynologyChatAccount;
    deliver: (msg: import("./inbound-context.js").SynologyInboundMessage) => Promise<string | null>;
    log?: {
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
        error: (...args: unknown[]) => void;
    };
}
export declare function createWebhookHandler(deps: WebhookHandlerDeps): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
