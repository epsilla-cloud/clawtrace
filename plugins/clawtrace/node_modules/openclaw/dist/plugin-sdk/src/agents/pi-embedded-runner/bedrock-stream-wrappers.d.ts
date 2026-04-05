import type { StreamFn } from "@mariozechner/pi-agent-core";
export declare function createBedrockNoCacheWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
export declare function isAnthropicBedrockModel(modelId: string): boolean;
