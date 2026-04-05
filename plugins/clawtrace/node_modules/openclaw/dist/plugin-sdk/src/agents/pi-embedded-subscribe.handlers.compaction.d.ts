import type { AgentEvent } from "@mariozechner/pi-agent-core";
import type { EmbeddedPiSubscribeContext } from "./pi-embedded-subscribe.handlers.types.js";
export declare function handleAutoCompactionStart(ctx: EmbeddedPiSubscribeContext): void;
export declare function handleAutoCompactionEnd(ctx: EmbeddedPiSubscribeContext, evt: AgentEvent & {
    willRetry?: unknown;
    result?: unknown;
    aborted?: unknown;
}): void;
export declare function reconcileSessionStoreCompactionCountAfterSuccess(params: {
    sessionKey?: string;
    agentId?: string;
    configStore?: string;
    observedCompactionCount: number;
    now?: number;
}): Promise<number | undefined>;
