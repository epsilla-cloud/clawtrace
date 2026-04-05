import type { OpenClawConfig, TtsAutoMode, TtsConfig, TtsMode, TtsModelOverrideConfig, TtsProvider } from "openclaw/plugin-sdk/config-runtime";
import type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
import { parseTtsDirectives, summarizeText, type SpeechModelOverridePolicy, type SpeechProviderConfig, type SpeechVoiceOption, type TtsDirectiveOverrides, type TtsDirectiveParseResult } from "../api.js";
export type { TtsDirectiveOverrides, TtsDirectiveParseResult };
export type ResolvedTtsConfig = {
    auto: TtsAutoMode;
    mode: TtsMode;
    provider: TtsProvider;
    providerSource: "config" | "default";
    summaryModel?: string;
    modelOverrides: ResolvedTtsModelOverrides;
    providerConfigs: Record<string, SpeechProviderConfig>;
    prefsPath?: string;
    maxTextLength: number;
    timeoutMs: number;
    rawConfig?: TtsConfig;
    sourceConfig?: OpenClawConfig;
};
export type ResolvedTtsModelOverrides = SpeechModelOverridePolicy;
export type TtsResult = {
    success: boolean;
    audioPath?: string;
    error?: string;
    latencyMs?: number;
    provider?: string;
    outputFormat?: string;
    voiceCompatible?: boolean;
};
export type TtsSynthesisResult = {
    success: boolean;
    audioBuffer?: Buffer;
    error?: string;
    latencyMs?: number;
    provider?: string;
    outputFormat?: string;
    voiceCompatible?: boolean;
    fileExtension?: string;
};
export type TtsTelephonyResult = {
    success: boolean;
    audioBuffer?: Buffer;
    error?: string;
    latencyMs?: number;
    provider?: string;
    outputFormat?: string;
    sampleRate?: number;
};
type TtsStatusEntry = {
    timestamp: number;
    success: boolean;
    textLength: number;
    summarized: boolean;
    provider?: string;
    latencyMs?: number;
    error?: string;
};
declare function resolveModelOverridePolicy(overrides: TtsModelOverrideConfig | undefined): ResolvedTtsModelOverrides;
export declare function getResolvedSpeechProviderConfig(config: ResolvedTtsConfig, providerId: string, cfg?: OpenClawConfig): SpeechProviderConfig;
export declare function resolveTtsConfig(cfg: OpenClawConfig): ResolvedTtsConfig;
export declare function resolveTtsPrefsPath(config: ResolvedTtsConfig): string;
export declare function resolveTtsAutoMode(params: {
    config: ResolvedTtsConfig;
    prefsPath: string;
    sessionAuto?: string;
}): TtsAutoMode;
export declare function buildTtsSystemPromptHint(cfg: OpenClawConfig): string | undefined;
export declare function isTtsEnabled(config: ResolvedTtsConfig, prefsPath: string, sessionAuto?: string): boolean;
export declare function setTtsAutoMode(prefsPath: string, mode: TtsAutoMode): void;
export declare function setTtsEnabled(prefsPath: string, enabled: boolean): void;
export declare function getTtsProvider(config: ResolvedTtsConfig, prefsPath: string): TtsProvider;
export declare function setTtsProvider(prefsPath: string, provider: TtsProvider): void;
export declare function getTtsMaxLength(prefsPath: string): number;
export declare function setTtsMaxLength(prefsPath: string, maxLength: number): void;
export declare function isSummarizationEnabled(prefsPath: string): boolean;
export declare function setSummarizationEnabled(prefsPath: string, enabled: boolean): void;
export declare function getLastTtsAttempt(): TtsStatusEntry | undefined;
export declare function setLastTtsAttempt(entry: TtsStatusEntry | undefined): void;
export declare function resolveTtsProviderOrder(primary: TtsProvider, cfg?: OpenClawConfig): TtsProvider[];
export declare function isTtsProviderConfigured(config: ResolvedTtsConfig, provider: TtsProvider, cfg?: OpenClawConfig): boolean;
export declare function textToSpeech(params: {
    text: string;
    cfg: OpenClawConfig;
    prefsPath?: string;
    channel?: string;
    overrides?: TtsDirectiveOverrides;
    disableFallback?: boolean;
}): Promise<TtsResult>;
export declare function synthesizeSpeech(params: {
    text: string;
    cfg: OpenClawConfig;
    prefsPath?: string;
    channel?: string;
    overrides?: TtsDirectiveOverrides;
    disableFallback?: boolean;
}): Promise<TtsSynthesisResult>;
export declare function textToSpeechTelephony(params: {
    text: string;
    cfg: OpenClawConfig;
    prefsPath?: string;
}): Promise<TtsTelephonyResult>;
export declare function listSpeechVoices(params: {
    provider: string;
    cfg?: OpenClawConfig;
    config?: ResolvedTtsConfig;
    apiKey?: string;
    baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
export declare function maybeApplyTtsToPayload(params: {
    payload: ReplyPayload;
    cfg: OpenClawConfig;
    channel?: string;
    kind?: "tool" | "block" | "final";
    inboundAudio?: boolean;
    ttsAuto?: string;
}): Promise<ReplyPayload>;
export declare const _test: {
    parseTtsDirectives: typeof parseTtsDirectives;
    resolveModelOverridePolicy: typeof resolveModelOverridePolicy;
    summarizeText: typeof summarizeText;
    getResolvedSpeechProviderConfig: typeof getResolvedSpeechProviderConfig;
};
