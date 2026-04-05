import type { StreamFn } from "@mariozechner/pi-agent-core";
import type { TranscriptPolicy } from "../../transcript-policy.js";
export declare function wrapStreamFnTrimToolCallNames(baseFn: StreamFn, allowedToolNames?: Set<string>): StreamFn;
export declare function wrapStreamFnSanitizeMalformedToolCalls(baseFn: StreamFn, allowedToolNames?: Set<string>, transcriptPolicy?: Pick<TranscriptPolicy, "validateGeminiTurns" | "validateAnthropicTurns">): StreamFn;
