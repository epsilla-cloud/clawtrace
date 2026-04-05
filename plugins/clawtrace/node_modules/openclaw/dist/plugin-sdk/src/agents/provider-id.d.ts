export declare function normalizeProviderId(provider: string): string;
/** Normalize provider ID for auth lookup. Coding-plan variants share auth with base. */
export declare function normalizeProviderIdForAuth(provider: string): string;
export declare function findNormalizedProviderValue<T>(entries: Record<string, T> | undefined, provider: string): T | undefined;
export declare function findNormalizedProviderKey(entries: Record<string, unknown> | undefined, provider: string): string | undefined;
