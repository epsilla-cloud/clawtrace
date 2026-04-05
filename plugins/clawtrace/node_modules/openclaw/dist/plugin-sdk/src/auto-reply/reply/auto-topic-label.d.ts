import type { OpenClawConfig } from "../../config/config.js";
export { resolveAutoTopicLabelConfig } from "./auto-topic-label-config.js";
export type { AutoTopicLabelConfig } from "../../config/types.telegram.js";
export type AutoTopicLabelParams = {
    /** The user's first message text. */
    userMessage: string;
    /** System prompt for the LLM. */
    prompt: string;
    /** The full config object. */
    cfg: OpenClawConfig;
    /** Agent ID for model resolution. */
    agentId?: string;
    /** Routed agent directory for model/auth resolution. */
    agentDir?: string;
};
/**
 * Generate a topic label using LLM.
 * Returns the generated label or null on failure.
 */
export declare function generateTopicLabel(params: {
    userMessage: string;
    prompt: string;
    cfg: OpenClawConfig;
    agentId?: string;
    agentDir?: string;
}): Promise<string | null>;
