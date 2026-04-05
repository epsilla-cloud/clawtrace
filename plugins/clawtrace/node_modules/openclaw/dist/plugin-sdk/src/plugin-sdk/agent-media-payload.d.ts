export type AgentMediaPayload = {
    MediaPath?: string;
    MediaType?: string;
    MediaUrl?: string;
    MediaPaths?: string[];
    MediaUrls?: string[];
    MediaTypes?: string[];
};
/** Convert outbound media descriptors into the legacy agent payload field layout. */
export declare function buildAgentMediaPayload(mediaList: Array<{
    path: string;
    contentType?: string | null;
}>): AgentMediaPayload;
