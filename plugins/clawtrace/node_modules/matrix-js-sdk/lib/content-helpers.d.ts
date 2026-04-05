import { type MBeaconEventContent, type MBeaconInfoContent, type MBeaconInfoEventContent } from "./@types/beacon.ts";
import { LocationAssetType, type LocationEventWireContent, type MLocationEventContent, type MLocationContent, type LegacyLocationEventContent } from "./@types/location.ts";
import { type MRoomTopicEventContent } from "./@types/topic.ts";
import { type RoomMessageEventContent } from "./@types/events.ts";
/**
 * Generates the content for a HTML Message event
 * @param body - the plaintext body of the message
 * @param htmlBody - the HTML representation of the message
 * @returns
 */
export declare function makeHtmlMessage(body: string, htmlBody: string): RoomMessageEventContent;
/**
 * Generates the content for a HTML Notice event
 * @param body - the plaintext body of the notice
 * @param htmlBody - the HTML representation of the notice
 * @returns
 */
export declare function makeHtmlNotice(body: string, htmlBody: string): RoomMessageEventContent;
/**
 * Generates the content for a HTML Emote event
 * @param body - the plaintext body of the emote
 * @param htmlBody - the HTML representation of the emote
 * @returns
 */
export declare function makeHtmlEmote(body: string, htmlBody: string): RoomMessageEventContent;
/**
 * Generates the content for a Plaintext Message event
 * @param body - the plaintext body of the emote
 * @returns
 */
export declare function makeTextMessage(body: string): RoomMessageEventContent;
/**
 * Generates the content for a Plaintext Notice event
 * @param body - the plaintext body of the notice
 * @returns
 */
export declare function makeNotice(body: string): RoomMessageEventContent;
/**
 * Generates the content for a Plaintext Emote event
 * @param body - the plaintext body of the emote
 * @returns
 */
export declare function makeEmoteMessage(body: string): RoomMessageEventContent;
/** Location content helpers */
export declare const getTextForLocationEvent: (uri: string | undefined, assetType: LocationAssetType, timestamp?: number, description?: string | null) => string;
/**
 * Generates the content for a Location event
 * @param uri - a geo:// uri for the location
 * @param timestamp - the timestamp when the location was correct (milliseconds since the UNIX epoch)
 * @param description - the (optional) label for this location on the map
 * @param assetType - the (optional) asset type of this location e.g. "m.self"
 * @param text - optional. A text for the location
 */
export declare const makeLocationContent: (text?: string, uri?: string, timestamp?: number, description?: string | null, assetType?: LocationAssetType) => LegacyLocationEventContent & MLocationEventContent;
/**
 * Parse location event content and transform to
 * a backwards compatible modern m.location event format
 */
export declare const parseLocationEvent: (wireEventContent: LocationEventWireContent) => MLocationEventContent;
/**
 * Topic event helpers
 */
export type MakeTopicContent = (topic: string | null | undefined, htmlTopic?: string) => MRoomTopicEventContent;
export declare const makeTopicContent: MakeTopicContent;
export type TopicState = {
    text?: string;
    html?: string;
};
export declare const parseTopicContent: (content: MRoomTopicEventContent) => TopicState;
/**
 * Beacon event helpers
 */
export type MakeBeaconInfoContent = (timeout: number, isLive?: boolean, description?: string, assetType?: LocationAssetType, timestamp?: number) => MBeaconInfoEventContent;
export declare const makeBeaconInfoContent: MakeBeaconInfoContent;
export type BeaconInfoState = MBeaconInfoContent & {
    assetType?: LocationAssetType;
    timestamp?: number;
};
/**
 * Flatten beacon info event content
 */
export declare const parseBeaconInfoContent: (content: MBeaconInfoEventContent) => BeaconInfoState;
export type MakeBeaconContent = (uri: string, timestamp: number, beaconInfoEventId: string, description?: string) => MBeaconEventContent;
export declare const makeBeaconContent: MakeBeaconContent;
export type BeaconLocationState = Omit<MLocationContent, "uri"> & {
    uri?: string;
    timestamp?: number;
};
export declare const parseBeaconContent: (content: MBeaconEventContent) => BeaconLocationState;
//# sourceMappingURL=content-helpers.d.ts.map