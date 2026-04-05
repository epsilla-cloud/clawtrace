import type { AnyAgentTool, CliBackendPlugin, ImageGenerationProviderPlugin, MediaUnderstandingProviderPlugin, OpenClawPluginApi, ProviderPlugin, SpeechProviderPlugin, WebSearchProviderPlugin } from "./types.js";
export type CapturedPluginRegistration = {
    api: OpenClawPluginApi;
    providers: ProviderPlugin[];
    cliBackends: CliBackendPlugin[];
    speechProviders: SpeechProviderPlugin[];
    mediaUnderstandingProviders: MediaUnderstandingProviderPlugin[];
    imageGenerationProviders: ImageGenerationProviderPlugin[];
    webSearchProviders: WebSearchProviderPlugin[];
    tools: AnyAgentTool[];
};
export declare function createCapturedPluginRegistration(): CapturedPluginRegistration;
export declare function capturePluginRegistration(params: {
    register(api: OpenClawPluginApi): void;
}): CapturedPluginRegistration;
