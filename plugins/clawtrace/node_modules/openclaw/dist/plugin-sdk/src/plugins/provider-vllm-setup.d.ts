import type { OpenClawConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { applyProviderDefaultModel } from "./provider-self-hosted-setup.js";
export { VLLM_DEFAULT_BASE_URL } from "../plugin-sdk/vllm.js";
export declare const VLLM_DEFAULT_CONTEXT_WINDOW = 128000;
export declare const VLLM_DEFAULT_MAX_TOKENS = 8192;
export declare const VLLM_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare function promptAndConfigureVllm(params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
}): Promise<{
    config: OpenClawConfig;
    modelId: string;
    modelRef: string;
}>;
export { applyProviderDefaultModel as applyVllmDefaultModel };
