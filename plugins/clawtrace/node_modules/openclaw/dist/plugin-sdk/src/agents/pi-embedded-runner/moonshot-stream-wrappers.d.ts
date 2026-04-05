import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { ThinkLevel } from "../../auto-reply/thinking.js";
export { createMoonshotThinkingWrapper, resolveMoonshotThinkingType, } from "./moonshot-thinking-stream-wrappers.js";
export declare function shouldApplySiliconFlowThinkingOffCompat(params: {
    provider: string;
    modelId: string;
    thinkingLevel?: ThinkLevel;
}): boolean;
export declare function shouldApplyMoonshotPayloadCompat(params: {
    provider: string;
    modelId: string;
}): boolean;
export declare function createSiliconFlowThinkingWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
