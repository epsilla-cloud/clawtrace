import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { ThinkLevel } from "../../auto-reply/thinking.js";
export declare function sanitizeGoogleThinkingPayload(params: {
    payload: unknown;
    modelId?: string;
    thinkingLevel?: ThinkLevel;
}): void;
export declare function createGoogleThinkingPayloadWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: ThinkLevel): StreamFn;
