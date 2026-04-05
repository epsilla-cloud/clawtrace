import type { StreamFn } from "@mariozechner/pi-agent-core";
export declare function wrapStreamFnRepairMalformedToolCallArguments(baseFn: StreamFn): StreamFn;
export declare function shouldRepairMalformedAnthropicToolCallArguments(provider?: string): boolean;
export declare function decodeHtmlEntitiesInObject(obj: unknown): unknown;
export declare function wrapStreamFnDecodeXaiToolCallArguments(baseFn: StreamFn): StreamFn;
