import { z } from "zod";
import type { ConfigUiHints } from "../shared/config-ui-hints-types.js";
export type { ConfigUiHint, ConfigUiHints } from "../shared/config-ui-hints-types.js";
export declare function isPluginOwnedChannelHintPath(path: string): boolean;
export declare function isSensitiveConfigPath(path: string): boolean;
export declare function buildBaseHints(): ConfigUiHints;
export declare function applySensitiveHints(hints: ConfigUiHints, allowedKeys?: ReadonlySet<string>): ConfigUiHints;
export declare function mapSensitivePaths(schema: z.ZodType, path: string, hints: ConfigUiHints): ConfigUiHints;
/** @internal */
export declare const __test__: {
    mapSensitivePaths: typeof mapSensitivePaths;
};
