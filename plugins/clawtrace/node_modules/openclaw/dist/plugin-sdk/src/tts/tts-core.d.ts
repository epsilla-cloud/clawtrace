import { completeSimple } from "@mariozechner/pi-ai";
import { getApiKeyForModel, requireApiKey } from "../agents/model-auth.js";
import { resolveModelAsync } from "../agents/pi-embedded-runner/model.js";
import { prepareModelForSimpleCompletion } from "../agents/simple-completion-transport.js";
import type { OpenClawConfig } from "../config/config.js";
import type { ResolvedTtsConfig } from "./tts.js";
type SummarizeTextDeps = {
    completeSimple: typeof completeSimple;
    getApiKeyForModel: typeof getApiKeyForModel;
    prepareModelForSimpleCompletion: typeof prepareModelForSimpleCompletion;
    requireApiKey: typeof requireApiKey;
    resolveModelAsync: typeof resolveModelAsync;
};
export declare function requireInRange(value: number, min: number, max: number, label: string): void;
export declare function normalizeLanguageCode(code?: string): string | undefined;
export declare function normalizeApplyTextNormalization(mode?: string): "auto" | "on" | "off" | undefined;
export declare function normalizeSeed(seed?: number): number | undefined;
type SummarizeResult = {
    summary: string;
    latencyMs: number;
    inputLength: number;
    outputLength: number;
};
export declare function summarizeText(params: {
    text: string;
    targetLength: number;
    cfg: OpenClawConfig;
    config: ResolvedTtsConfig;
    timeoutMs: number;
}, deps?: SummarizeTextDeps): Promise<SummarizeResult>;
export declare function scheduleCleanup(tempDir: string, delayMs?: number): void;
export {};
