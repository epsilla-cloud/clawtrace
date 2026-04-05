export type OutboundMediaLoadOptions = {
    maxBytes?: number;
    mediaLocalRoots?: readonly string[];
};
/** Load outbound media from a remote URL or approved local path using the shared web-media policy. */
export declare function loadOutboundMediaFromUrl(mediaUrl: string, options?: OutboundMediaLoadOptions): Promise<import("./web-media.js").WebMediaResult>;
