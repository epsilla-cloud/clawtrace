import type { DimensionalFileInfo, EncryptedFile, MatrixClient } from "../sdk.js";
import { type MatrixMediaContent, type MatrixMediaInfo, type MatrixMediaMsgType, type MatrixRelation, type MediaKind } from "./types.js";
export declare function buildMatrixMediaInfo(params: {
    size: number;
    mimetype?: string;
    durationMs?: number;
    imageInfo?: DimensionalFileInfo;
}): MatrixMediaInfo | undefined;
export declare function buildMediaContent(params: {
    msgtype: MatrixMediaMsgType;
    body: string;
    url?: string;
    filename?: string;
    mimetype?: string;
    size: number;
    relation?: MatrixRelation;
    isVoice?: boolean;
    durationMs?: number;
    imageInfo?: DimensionalFileInfo;
    file?: EncryptedFile;
}): MatrixMediaContent;
export declare function prepareImageInfo(params: {
    buffer: Buffer;
    client: MatrixClient;
    encrypted?: boolean;
}): Promise<DimensionalFileInfo | undefined>;
export declare function resolveMediaDurationMs(params: {
    buffer: Buffer;
    contentType?: string;
    fileName?: string;
    kind: MediaKind;
}): Promise<number | undefined>;
/**
 * Upload media with optional encryption for E2EE rooms.
 */
export declare function uploadMediaMaybeEncrypted(client: MatrixClient, roomId: string, buffer: Buffer, params: {
    contentType?: string;
    filename?: string;
}): Promise<{
    url: string;
    file?: EncryptedFile;
}>;
