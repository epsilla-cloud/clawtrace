import { type Api, type Model } from "@mariozechner/pi-ai";
import type { OpenClawConfig } from "../../config/config.js";
import type { ImageModelConfig } from "./image-tool.helpers.js";
import type { ToolModelConfig } from "./model-config.helpers.js";
type TextToolAttempt = {
    provider: string;
    model: string;
    error: string;
};
type TextToolResult = {
    text: string;
    provider: string;
    model: string;
    attempts: TextToolAttempt[];
};
export declare function applyImageModelConfigDefaults(cfg: OpenClawConfig | undefined, imageModelConfig: ImageModelConfig): OpenClawConfig | undefined;
export declare function applyImageGenerationModelConfigDefaults(cfg: OpenClawConfig | undefined, imageGenerationModelConfig: ToolModelConfig): OpenClawConfig | undefined;
export declare function resolveMediaToolLocalRoots(workspaceDirRaw: string | undefined, options?: {
    workspaceOnly?: boolean;
}, mediaSources?: readonly string[]): string[];
export declare function resolvePromptAndModelOverride(args: Record<string, unknown>, defaultPrompt: string): {
    prompt: string;
    modelOverride?: string;
};
export declare function buildTextToolResult(result: TextToolResult, extraDetails: Record<string, unknown>): {
    content: Array<{
        type: "text";
        text: string;
    }>;
    details: Record<string, unknown>;
};
export declare function resolveModelFromRegistry(params: {
    modelRegistry: {
        find: (provider: string, modelId: string) => unknown;
    };
    provider: string;
    modelId: string;
}): Model<Api>;
export declare function resolveModelRuntimeApiKey(params: {
    model: Model<Api>;
    cfg: OpenClawConfig | undefined;
    agentDir: string;
    authStorage: {
        setRuntimeApiKey: (provider: string, apiKey: string) => void;
    };
}): Promise<string>;
export {};
