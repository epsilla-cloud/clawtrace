import { Capability } from "..";
export declare enum EventKind {
    Event = "event",
    State = "state_event",
    ToDevice = "to_device",
    RoomAccount = "room_account"
}
export declare enum EventDirection {
    Send = "send",
    Receive = "receive"
}
export declare class WidgetEventCapability {
    readonly direction: EventDirection;
    readonly eventType: string;
    readonly kind: EventKind;
    readonly keyStr: string | null;
    readonly raw: string;
    private constructor();
    matchesAsStateEvent(direction: EventDirection, eventType: string, stateKey: string | null): boolean;
    matchesAsToDeviceEvent(direction: EventDirection, eventType: string): boolean;
    matchesAsRoomEvent(direction: EventDirection, eventType: string, msgtype?: string | null): boolean;
    matchesAsRoomAccountData(direction: EventDirection, eventType: string): boolean;
    static forStateEvent(direction: EventDirection, eventType: string, stateKey?: string): WidgetEventCapability;
    static forToDeviceEvent(direction: EventDirection, eventType: string): WidgetEventCapability;
    static forRoomEvent(direction: EventDirection, eventType: string): WidgetEventCapability;
    static forRoomMessageEvent(direction: EventDirection, msgtype?: string): WidgetEventCapability;
    static forRoomAccountData(direction: EventDirection, eventType: string): WidgetEventCapability;
    /**
     * Parses a capabilities request to find all the event capability requests.
     * @param {Iterable<Capability>} capabilities The capabilities requested/to parse.
     * @returns {WidgetEventCapability[]} An array of event capability requests. May be empty, but never null.
     */
    static findEventCapabilities(capabilities: Iterable<Capability>): WidgetEventCapability[];
}
