import type { PluginRuntime } from "../../plugins/runtime/types.js";
import type { ChannelId, ChannelPlugin } from "./types.js";
export declare const bundledChannelPlugins: ChannelPlugin[];
export declare const bundledChannelSetupPlugins: ChannelPlugin[];
export declare function getBundledChannelPlugin(id: ChannelId): ChannelPlugin | undefined;
export declare function requireBundledChannelPlugin(id: ChannelId): ChannelPlugin;
export declare function setBundledChannelRuntime(id: ChannelId, runtime: PluginRuntime): void;
