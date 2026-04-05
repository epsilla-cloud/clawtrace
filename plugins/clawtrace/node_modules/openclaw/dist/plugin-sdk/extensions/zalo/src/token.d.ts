import type { BaseTokenResolution } from "./runtime-api.js";
import type { ZaloConfig } from "./types.js";
export type ZaloTokenResolution = BaseTokenResolution & {
    source: "env" | "config" | "configFile" | "none";
};
export declare function resolveZaloToken(config: ZaloConfig | undefined, accountId?: string | null, options?: {
    allowUnresolvedSecretRef?: boolean;
}): ZaloTokenResolution;
