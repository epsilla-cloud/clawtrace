import type { ChannelConfigRuntimeSchema, ChannelConfigSchema } from "../channels/plugins/types.plugin.js";
type BundledChannelRuntimeMap = ReadonlyMap<string, ChannelConfigRuntimeSchema>;
type BundledChannelConfigSchemaMap = ReadonlyMap<string, ChannelConfigSchema>;
export declare function getBundledChannelRuntimeMap(): BundledChannelRuntimeMap;
export declare function getBundledChannelConfigSchemaMap(): BundledChannelConfigSchemaMap;
export {};
