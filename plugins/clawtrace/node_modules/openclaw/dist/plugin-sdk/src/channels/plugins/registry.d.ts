import type { ChannelId, ChannelPlugin } from "./types.js";
export declare function listChannelPlugins(): ChannelPlugin[];
export declare function getChannelPlugin(id: ChannelId): ChannelPlugin | undefined;
export declare function normalizeChannelId(raw?: string | null): ChannelId | null;
