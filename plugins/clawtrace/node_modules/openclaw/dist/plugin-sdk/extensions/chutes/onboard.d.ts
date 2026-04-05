import { type OpenClawConfig } from "openclaw/plugin-sdk/provider-onboard";
import { CHUTES_DEFAULT_MODEL_REF } from "./api.js";
export { CHUTES_DEFAULT_MODEL_REF };
/**
 * Apply Chutes provider configuration without changing the default model.
 * Registers all catalog models and sets provider aliases (chutes-fast, etc.).
 */
export declare function applyChutesProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
/**
 * Apply Chutes provider configuration AND set Chutes as the default model.
 */
export declare function applyChutesConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyChutesApiKeyConfig(cfg: OpenClawConfig): OpenClawConfig;
