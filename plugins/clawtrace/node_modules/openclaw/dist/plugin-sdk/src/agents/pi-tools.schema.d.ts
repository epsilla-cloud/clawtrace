import type { ModelCompatConfig } from "../config/types.models.js";
import type { AnyAgentTool } from "./pi-tools.types.js";
export declare function normalizeToolParameters(tool: AnyAgentTool, options?: {
    modelProvider?: string;
    modelId?: string;
    modelCompat?: ModelCompatConfig;
}): AnyAgentTool;
/**
 * @deprecated Use normalizeToolParameters with modelProvider instead.
 * This function should only be used for Gemini providers.
 */
export declare function cleanToolSchemaForGemini(schema: Record<string, unknown>): unknown;
