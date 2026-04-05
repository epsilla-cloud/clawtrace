import { type MsgType, type RelationType } from "./event.ts";
import { type FileInfo, type ImageInfo, type MediaEventContent } from "./media.ts";
import { type XOR } from "./common.ts";
interface BaseTimelineEvent {
    "body": string;
    "m.mentions"?: {
        user_ids?: string[];
        room?: boolean;
    };
}
interface ReplyEvent {
    "m.relates_to"?: {
        "m.in_reply_to"?: {
            event_id: string;
        };
    };
}
interface NoRelationEvent {
    "m.new_content"?: never;
    "m.relates_to"?: never;
}
/**
 * Partial content format of timeline events with rel_type `m.replace`
 *
 * @see https://spec.matrix.org/v1.9/client-server-api/#event-replacements
 */
export interface ReplacementEvent<T> {
    "m.new_content": T;
    "m.relates_to": {
        event_id: string;
        rel_type: RelationType.Replace;
    };
}
/**
 * Partial content format of timeline events with rel_type other than `m.replace`
 *
 * @see https://spec.matrix.org/v1.9/client-server-api/#forming-relationships-between-events
 */
export interface RelationEvent {
    "m.new_content"?: never;
    "m.relates_to": {
        event_id: string;
        rel_type: Exclude<RelationType, RelationType.Replace>;
    };
}
/**
 * Content format of timeline events with type `m.room.message` and `msgtype` `m.text`, `m.emote`, or `m.notice`
 *
 * @see https://spec.matrix.org/v1.9/client-server-api/#mroommessage
 */
export interface RoomMessageTextEventContent extends BaseTimelineEvent {
    msgtype: MsgType.Text | MsgType.Emote | MsgType.Notice;
    format?: "org.matrix.custom.html";
    formatted_body?: string;
}
/**
 * Content format of timeline events with type `m.room.message` and `msgtype` `m.location`
 *
 * @see https://spec.matrix.org/v1.9/client-server-api/#mlocation
 */
export interface RoomMessageLocationEventContent extends BaseTimelineEvent {
    body: string;
    geo_uri: string;
    info: Pick<FileInfo, "thumbnail_info" | "thumbnail_file" | "thumbnail_url">;
    msgtype: MsgType.Location;
}
type MessageEventContent = RoomMessageTextEventContent | RoomMessageLocationEventContent | MediaEventContent;
export type RoomMessageEventContent = BaseTimelineEvent & XOR<XOR<ReplacementEvent<MessageEventContent>, RelationEvent>, XOR<ReplyEvent, NoRelationEvent>> & MessageEventContent;
/**
 * Content format of timeline events with type `m.sticker`
 *
 * @see https://spec.matrix.org/v1.9/client-server-api/#msticker
 */
export interface StickerEventContent extends BaseTimelineEvent {
    body: string;
    info: ImageInfo;
    url: string;
}
/**
 * Content format of timeline events with type `m.reaction`
 *
 * @see https://spec.matrix.org/v1.9/client-server-api/#mreaction
 */
export interface ReactionEventContent {
    "m.relates_to": {
        event_id: string;
        key: string;
        rel_type: RelationType.Annotation;
    };
}
export {};
//# sourceMappingURL=events.d.ts.map