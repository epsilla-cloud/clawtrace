import type { AssistantMessage } from "@mariozechner/pi-ai";
import type { OpenClawConfig } from "../../config/config.js";
import { type ToolModelConfig } from "./model-config.helpers.js";
export type ImageModelConfig = ToolModelConfig;
export declare function decodeDataUrl(dataUrl: string): {
    buffer: Buffer;
    mimeType: string;
    kind: "image";
};
export declare function coerceImageAssistantText(params: {
    message: AssistantMessage;
    provider: string;
    model: string;
}): string;
export declare function coerceImageModelConfig(cfg?: OpenClawConfig): ImageModelConfig;
export declare function resolveProviderVisionModelFromConfig(params: {
    cfg?: OpenClawConfig;
    provider: string;
}): string | null;
