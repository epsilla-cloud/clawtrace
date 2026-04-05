import type { OpenClawConfig } from "../config/config.js";
export declare function hasMeaningfulChannelConfig(value: unknown): boolean;
export declare function listPotentialConfiguredChannelIds(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): string[];
export declare function hasPotentialConfiguredChannels(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): boolean;
