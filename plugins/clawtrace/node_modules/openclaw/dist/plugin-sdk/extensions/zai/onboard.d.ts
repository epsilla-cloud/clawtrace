import { type OpenClawConfig } from "openclaw/plugin-sdk/provider-onboard";
export declare const ZAI_DEFAULT_MODEL_REF = "zai/glm-5";
export declare function applyZaiProviderConfig(cfg: OpenClawConfig, params?: {
    endpoint?: string;
    modelId?: string;
}): OpenClawConfig;
export declare function applyZaiConfig(cfg: OpenClawConfig, params?: {
    endpoint?: string;
    modelId?: string;
}): OpenClawConfig;
