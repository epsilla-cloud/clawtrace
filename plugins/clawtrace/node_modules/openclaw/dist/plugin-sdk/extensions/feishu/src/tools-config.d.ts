import type { FeishuToolsConfig } from "./types.js";
/**
 * Default tool configuration.
 * - doc, chat, wiki, drive, scopes: enabled by default
 * - perm: disabled by default (sensitive operation)
 */
export declare const DEFAULT_TOOLS_CONFIG: Required<FeishuToolsConfig>;
/**
 * Resolve tools config with defaults.
 */
export declare function resolveToolsConfig(cfg?: FeishuToolsConfig): Required<FeishuToolsConfig>;
