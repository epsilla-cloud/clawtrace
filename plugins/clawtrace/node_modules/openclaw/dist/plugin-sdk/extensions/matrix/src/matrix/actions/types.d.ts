import type { CoreConfig } from "../../types.js";
import { type MatrixReactionEventContent } from "../reaction-common.js";
import type { MatrixClient, MessageEventContent } from "../sdk.js";
export type { MatrixRawEvent } from "../sdk.js";
export type { MatrixReactionSummary } from "../reaction-common.js";
export declare const MsgType: {
    readonly Text: "m.text";
};
export declare const RelationType: {
    readonly Replace: "m.replace";
    readonly Annotation: "m.annotation";
};
export declare const EventType: {
    readonly RoomMessage: "m.room.message";
    readonly RoomPinnedEvents: "m.room.pinned_events";
    readonly RoomTopic: "m.room.topic";
    readonly Reaction: "m.reaction";
};
export type RoomMessageEventContent = MessageEventContent & {
    msgtype: string;
    body: string;
    "m.new_content"?: RoomMessageEventContent;
    "m.relates_to"?: {
        rel_type?: string;
        event_id?: string;
        "m.in_reply_to"?: {
            event_id?: string;
        };
    };
};
export type ReactionEventContent = MatrixReactionEventContent;
export type RoomPinnedEventsEventContent = {
    pinned: string[];
};
export type RoomTopicEventContent = {
    topic?: string;
};
export type MatrixActionClientOpts = {
    client?: MatrixClient;
    cfg?: CoreConfig;
    mediaLocalRoots?: readonly string[];
    timeoutMs?: number;
    accountId?: string | null;
    readiness?: "none" | "prepared" | "started";
};
export type MatrixMessageSummary = {
    eventId?: string;
    sender?: string;
    body?: string;
    msgtype?: string;
    attachment?: MatrixMessageAttachmentSummary;
    timestamp?: number;
    relatesTo?: {
        relType?: string;
        eventId?: string;
        key?: string;
    };
};
export type MatrixMessageAttachmentKind = "audio" | "file" | "image" | "sticker" | "video";
export type MatrixMessageAttachmentSummary = {
    kind: MatrixMessageAttachmentKind;
    caption?: string;
    filename?: string;
};
export type MatrixActionClient = {
    client: MatrixClient;
    stopOnDone: boolean;
};
