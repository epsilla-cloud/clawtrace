import type { OpenClawConfig } from "../config/config.js";
import type { SpeechProviderPlugin } from "../plugins/types.js";
import type { SpeechModelOverridePolicy, SpeechProviderConfig, TtsDirectiveParseResult } from "./provider-types.js";
type ParseTtsDirectiveOptions = {
    cfg?: OpenClawConfig;
    providers?: readonly SpeechProviderPlugin[];
    providerConfigs?: Record<string, SpeechProviderConfig>;
};
export declare function parseTtsDirectives(text: string, policy: SpeechModelOverridePolicy, options?: ParseTtsDirectiveOptions): TtsDirectiveParseResult;
export {};
