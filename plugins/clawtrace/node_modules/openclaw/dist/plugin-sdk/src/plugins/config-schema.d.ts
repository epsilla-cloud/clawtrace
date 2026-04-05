import { type ZodTypeAny } from "zod";
import type { PluginConfigUiHint, OpenClawPluginConfigSchema } from "./types.js";
type BuildPluginConfigSchemaOptions = {
    uiHints?: Record<string, PluginConfigUiHint>;
    safeParse?: OpenClawPluginConfigSchema["safeParse"];
};
export declare function buildPluginConfigSchema(schema: ZodTypeAny, options?: BuildPluginConfigSchemaOptions): OpenClawPluginConfigSchema;
export declare function emptyPluginConfigSchema(): OpenClawPluginConfigSchema;
export {};
