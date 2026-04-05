import { type MattermostChannel, type MattermostClient, type MattermostUser } from "./client.js";
import { type MattermostInteractionResponse } from "./interactions.js";
export type MattermostMediaKind = "image" | "audio" | "video" | "document" | "unknown";
export type MattermostMediaInfo = {
    path: string;
    contentType?: string;
    kind: MattermostMediaKind;
};
type FetchRemoteMedia = (params: {
    url: string;
    requestInit?: RequestInit;
    filePathHint?: string;
    maxBytes: number;
    ssrfPolicy?: {
        allowedHostnames?: string[];
    };
}) => Promise<{
    buffer: Uint8Array;
    contentType?: string | null;
}>;
type SaveMediaBuffer = (buffer: Uint8Array, contentType: string | undefined, direction: "inbound" | "outbound", maxBytes: number) => Promise<{
    path: string;
    contentType?: string | null;
}>;
export declare function createMattermostMonitorResources(params: {
    accountId: string;
    callbackUrl: string;
    client: MattermostClient;
    logger: {
        debug?: (...args: unknown[]) => void;
    };
    mediaMaxBytes: number;
    fetchRemoteMedia: FetchRemoteMedia;
    saveMediaBuffer: SaveMediaBuffer;
    mediaKindFromMime: (contentType?: string) => MattermostMediaKind | null | undefined;
}): {
    resolveMattermostMedia: (fileIds?: string[] | null) => Promise<MattermostMediaInfo[]>;
    sendTypingIndicator: (channelId: string, parentId?: string) => Promise<void>;
    resolveChannelInfo: (channelId: string) => Promise<MattermostChannel | null>;
    resolveUserInfo: (userId: string) => Promise<MattermostUser | null>;
    updateModelPickerPost: (params: {
        channelId: string;
        postId: string;
        message: string;
        buttons?: Array<unknown>;
    }) => Promise<MattermostInteractionResponse>;
};
export {};
