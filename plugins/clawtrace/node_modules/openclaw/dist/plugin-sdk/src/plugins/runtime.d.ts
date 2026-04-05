import type { PluginRegistry } from "./registry.js";
export declare function setActivePluginRegistry(registry: PluginRegistry, cacheKey?: string): void;
export declare function getActivePluginRegistry(): PluginRegistry | null;
export declare function requireActivePluginRegistry(): PluginRegistry;
export declare function pinActivePluginHttpRouteRegistry(registry: PluginRegistry): void;
export declare function releasePinnedPluginHttpRouteRegistry(registry?: PluginRegistry): void;
export declare function getActivePluginHttpRouteRegistry(): PluginRegistry | null;
export declare function getActivePluginHttpRouteRegistryVersion(): number;
export declare function requireActivePluginHttpRouteRegistry(): PluginRegistry;
export declare function resolveActivePluginHttpRouteRegistry(fallback: PluginRegistry): PluginRegistry;
/** Pin the channel registry so that subsequent `setActivePluginRegistry` calls
 *  do not replace the channel snapshot used by `getChannelPlugin`. Call at
 *  gateway startup after the initial plugin load so that config-schema reads
 *  and other non-primary registry loads cannot evict channel plugins. */
export declare function pinActivePluginChannelRegistry(registry: PluginRegistry): void;
export declare function releasePinnedPluginChannelRegistry(registry?: PluginRegistry): void;
/** Return the registry that should be used for channel plugin resolution.
 *  When pinned, this returns the startup registry regardless of subsequent
 *  `setActivePluginRegistry` calls. */
export declare function getActivePluginChannelRegistry(): PluginRegistry | null;
export declare function getActivePluginChannelRegistryVersion(): number;
export declare function requireActivePluginChannelRegistry(): PluginRegistry;
export declare function getActivePluginRegistryKey(): string | null;
export declare function getActivePluginRegistryVersion(): number;
export declare function resetPluginRuntimeStateForTest(): void;
