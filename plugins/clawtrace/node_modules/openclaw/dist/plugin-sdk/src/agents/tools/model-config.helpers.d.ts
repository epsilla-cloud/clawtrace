import type { OpenClawConfig } from "../../config/config.js";
import type { AgentModelConfig } from "../../config/types.agents-shared.js";
export type ToolModelConfig = {
    primary?: string;
    fallbacks?: string[];
};
export declare function hasToolModelConfig(model: ToolModelConfig | undefined): boolean;
export declare function resolveDefaultModelRef(cfg?: OpenClawConfig): {
    provider: string;
    model: string;
};
export declare function hasAuthForProvider(params: {
    provider: string;
    agentDir?: string;
}): boolean;
export declare function coerceToolModelConfig(model?: AgentModelConfig): ToolModelConfig;
export declare function buildToolModelConfigFromCandidates(params: {
    explicit: ToolModelConfig;
    agentDir?: string;
    candidates: Array<string | null | undefined>;
}): ToolModelConfig | null;
