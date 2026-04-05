import type { OutboundSendDeps } from "../infra/outbound/send-deps.js";
/**
 * Lazy-loaded per-channel send functions, keyed by channel ID.
 * Values are proxy functions that dynamically import the real module on first use.
 */
export type CliDeps = {
    [channelId: string]: unknown;
};
export declare function createDefaultDeps(): CliDeps;
export declare function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps;
