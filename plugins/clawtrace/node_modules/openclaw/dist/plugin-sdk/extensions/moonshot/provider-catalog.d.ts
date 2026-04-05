import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
export declare const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
export declare const MOONSHOT_DEFAULT_MODEL_ID = "kimi-k2.5";
export declare function isNativeMoonshotBaseUrl(baseUrl: string | undefined): boolean;
export declare function applyMoonshotNativeStreamingUsageCompat(provider: ModelProviderConfig): ModelProviderConfig;
export declare function buildMoonshotProvider(): ModelProviderConfig;
