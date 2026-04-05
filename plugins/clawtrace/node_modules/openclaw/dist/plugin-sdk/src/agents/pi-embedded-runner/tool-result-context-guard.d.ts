export declare const CONTEXT_LIMIT_TRUNCATION_NOTICE = "[truncated: output exceeded context limit]";
export declare const PREEMPTIVE_TOOL_RESULT_COMPACTION_PLACEHOLDER = "[compacted: tool output removed to free context]";
export declare const PREEMPTIVE_CONTEXT_OVERFLOW_MESSAGE = "Preemptive context overflow: estimated context size exceeds safe threshold during tool loop";
type GuardableAgent = object;
export declare function installToolResultContextGuard(params: {
    agent: GuardableAgent;
    contextWindowTokens: number;
}): () => void;
export {};
