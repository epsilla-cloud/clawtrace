import type { OpenClawConfig } from "../config/config.js";
export declare const OPENAI_DEFAULT_MODEL = "openai/gpt-5.4";
export declare const OPENAI_CODEX_DEFAULT_MODEL = "openai-codex/gpt-5.4";
export declare const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-1";
export declare const OPENAI_DEFAULT_TTS_MODEL = "gpt-4o-mini-tts";
export declare const OPENAI_DEFAULT_TTS_VOICE = "alloy";
export declare const OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
export declare const OPENAI_DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
export declare const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
export declare const OPENCODE_GO_DEFAULT_MODEL_REF = "opencode-go/kimi-k2.5";
export declare const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-4-6";
export declare function applyGoogleGeminiModelDefault(cfg: OpenClawConfig): {
    next: OpenClawConfig;
    changed: boolean;
};
export declare function applyOpenAIProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpenAIConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpencodeGoModelDefault(cfg: OpenClawConfig): {
    next: OpenClawConfig;
    changed: boolean;
};
export declare function applyOpencodeZenModelDefault(cfg: OpenClawConfig): {
    next: OpenClawConfig;
    changed: boolean;
};
