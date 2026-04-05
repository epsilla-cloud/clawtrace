export { applyOpencodeGoConfig, applyOpencodeGoProviderConfig, OPENCODE_GO_DEFAULT_MODEL_REF, } from "./onboard.js";
export declare function applyOpencodeGoModelDefault(cfg: import("openclaw/plugin-sdk/provider-onboard").OpenClawConfig): {
    next: import("openclaw/plugin-sdk/provider-onboard").OpenClawConfig;
    changed: boolean;
};
