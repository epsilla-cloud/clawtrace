export { applyOpencodeZenConfig, applyOpencodeZenProviderConfig, OPENCODE_ZEN_DEFAULT_MODEL_REF, } from "./onboard.js";
export declare const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-4-6";
export declare function applyOpencodeZenModelDefault(cfg: import("openclaw/plugin-sdk/provider-onboard").OpenClawConfig): {
    next: import("openclaw/plugin-sdk/provider-onboard").OpenClawConfig;
    changed: boolean;
};
