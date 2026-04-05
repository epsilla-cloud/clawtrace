import type { CoreConfig } from "../../types.js";
import { type MatrixReactionEventContent } from "../reaction-common.js";
import type { DimensionalFileInfo, EncryptedFile, FileWithThumbnailInfo, MessageEventContent, TextualMessageEventContent, TimedFileInfo, VideoFileInfo } from "../sdk.js";
export declare const MsgType: {
    readonly Text: "m.text";
    readonly Image: "m.image";
    readonly Audio: "m.audio";
    readonly Video: "m.video";
    readonly File: "m.file";
    readonly Notice: "m.notice";
};
export declare const RelationType: {
    readonly Annotation: "m.annotation";
    readonly Replace: "m.replace";
    readonly Thread: "m.thread";
};
export declare const EventType: {
    readonly Direct: "m.direct";
    readonly Reaction: "m.reaction";
    readonly RoomMessage: "m.room.message";
};
export type MatrixDirectAccountData = Record<string, string[]>;
export type MatrixReplyRelation = {
    "m.in_reply_to": {
        event_id: string;
    };
};
export type MatrixThreadRelation = {
    rel_type: typeof RelationType.Thread;
    event_id: string;
    is_falling_back?: boolean;
    "m.in_reply_to"?: {
        event_id: string;
    };
};
export type MatrixRelation = MatrixReplyRelation | MatrixThreadRelation;
export type MatrixReplyMeta = {
    "m.relates_to"?: MatrixRelation;
};
export type MatrixMediaInfo = FileWithThumbnailInfo | DimensionalFileInfo | TimedFileInfo | VideoFileInfo;
export type MatrixTextContent = TextualMessageEventContent & MatrixReplyMeta;
export type MatrixMediaContent = MessageEventContent & MatrixReplyMeta & {
    info?: MatrixMediaInfo;
    url?: string;
    file?: EncryptedFile;
    filename?: string;
    "org.matrix.msc3245.voice"?: Record<string, never>;
    "org.matrix.msc1767.audio"?: {
        duration: number;
    };
};
export type MatrixOutboundContent = MatrixTextContent | MatrixMediaContent;
export type ReactionEventContent = MatrixReactionEventContent;
export type MatrixSendResult = {
    messageId: string;
    roomId: string;
};
export type MatrixSendOpts = {
    client?: import("../sdk.js").MatrixClient;
    cfg?: CoreConfig;
    mediaUrl?: string;
    mediaLocalRoots?: readonly string[];
    accountId?: string;
    replyToId?: string;
    threadId?: string | number | null;
    timeoutMs?: number;
    /** Send audio as voice message instead of audio file. Defaults to false. */
    audioAsVoice?: boolean;
};
export type MatrixMediaMsgType = typeof MsgType.Image | typeof MsgType.Audio | typeof MsgType.Video | typeof MsgType.File;
export type MediaKind = "image" | "audio" | "video" | "document" | "unknown";
export type MatrixFormattedContent = MessageEventContent & {
    format?: string;
    formatted_body?: string;
};
