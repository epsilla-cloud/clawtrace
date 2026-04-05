import type { ConfigUiHint, ConfigUiHints } from "./schema.hints.js";
export declare const CONFIG_TAGS: readonly ["security", "auth", "network", "access", "privacy", "observability", "performance", "reliability", "storage", "models", "media", "automation", "channels", "tools", "advanced"];
export type ConfigTag = (typeof CONFIG_TAGS)[number];
export declare function deriveTagsForPath(path: string, hint?: ConfigUiHint): ConfigTag[];
export declare function applyDerivedTags(hints: ConfigUiHints): ConfigUiHints;
