export type OutboundMediaLoadParams = {
    maxBytes?: number;
    mediaLocalRoots?: readonly string[];
    optimizeImages?: boolean;
};
export type OutboundMediaLoadOptions = {
    maxBytes?: number;
    localRoots?: readonly string[];
    optimizeImages?: boolean;
};
export declare function resolveOutboundMediaLocalRoots(mediaLocalRoots?: readonly string[]): readonly string[] | undefined;
export declare function buildOutboundMediaLoadOptions(params?: OutboundMediaLoadParams): OutboundMediaLoadOptions;
