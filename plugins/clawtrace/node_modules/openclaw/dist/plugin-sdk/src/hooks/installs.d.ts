import type { OpenClawConfig } from "../config/config.js";
import type { HookInstallRecord } from "../config/types.hooks.js";
export type HookInstallUpdate = HookInstallRecord & {
    hookId: string;
};
export declare function recordHookInstall(cfg: OpenClawConfig, update: HookInstallUpdate): OpenClawConfig;
