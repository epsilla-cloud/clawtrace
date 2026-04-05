import { type EitherAnd } from "matrix-events-sdk";
import { UnstableValue } from "../NamespacedValue.ts";
import { type M_TEXT } from "./extensible_events.ts";
export declare enum LocationAssetType {
    Self = "m.self",
    Pin = "m.pin"
}
export declare const M_ASSET: UnstableValue<"m.asset", "org.matrix.msc3488.asset">;
export type MAssetContent = {
    type: LocationAssetType;
};
/**
 * The event definition for an m.asset event (in content)
 */
export type MAssetEvent = EitherAnd<{
    [M_ASSET.name]: MAssetContent;
}, {
    [M_ASSET.altName]: MAssetContent;
}>;
export declare const M_TIMESTAMP: UnstableValue<"m.ts", "org.matrix.msc3488.ts">;
/**
 * The event definition for an m.ts event (in content)
 */
export type MTimestampEvent = EitherAnd<{
    [M_TIMESTAMP.name]: number;
}, {
    [M_TIMESTAMP.altName]: number;
}>;
export declare const M_LOCATION: UnstableValue<"m.location", "org.matrix.msc3488.location">;
export type MLocationContent = {
    uri: string;
    description?: string | null;
};
export type MLocationEvent = EitherAnd<{
    [M_LOCATION.name]: MLocationContent;
}, {
    [M_LOCATION.altName]: MLocationContent;
}>;
export type MTextEvent = EitherAnd<{
    [M_TEXT.name]: string;
}, {
    [M_TEXT.altName]: string;
}>;
type OptionalTimestampEvent = MTimestampEvent | undefined;
/**
 * The content for an m.location event
 */
export type MLocationEventContent = MLocationEvent & MAssetEvent & MTextEvent & OptionalTimestampEvent;
export type LegacyLocationEventContent = {
    body: string;
    msgtype: string;
    geo_uri: string;
};
/**
 * Possible content for location events as sent over the wire
 */
export type LocationEventWireContent = Partial<LegacyLocationEventContent & MLocationEventContent>;
export type ILocationContent = MLocationEventContent & LegacyLocationEventContent;
export {};
//# sourceMappingURL=location.d.ts.map