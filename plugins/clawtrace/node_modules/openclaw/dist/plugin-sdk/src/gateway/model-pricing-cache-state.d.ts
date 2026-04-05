export type CachedModelPricing = {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare function replaceGatewayModelPricingCache(nextPricing: Map<string, CachedModelPricing>, nextCachedAt?: number): void;
export declare function clearGatewayModelPricingCacheState(): void;
export declare function getCachedGatewayModelPricing(params: {
    provider?: string;
    model?: string;
}): CachedModelPricing | undefined;
export declare function getGatewayModelPricingCacheMeta(): {
    cachedAt: number;
    ttlMs: number;
    size: number;
};
export declare function __resetGatewayModelPricingCacheForTest(): void;
export declare function __setGatewayModelPricingForTest(entries: Array<{
    provider: string;
    model: string;
    pricing: CachedModelPricing;
}>): void;
