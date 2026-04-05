import { Symbols } from "../Symbols";
export declare enum MatrixCapabilities {
    Screenshots = "m.capability.screenshot",
    StickerSending = "m.sticker",
    AlwaysOnScreen = "m.always_on_screen",
    /**
     * @deprecated It is not recommended to rely on this existing - it can be removed without notice.
     * Ask Element to not give the option to move the widget into a separate tab.
     */
    RequiresClient = "io.element.requires_client",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC2931Navigate = "org.matrix.msc2931.navigate",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC3846TurnServers = "town.robin.msc3846.turn_servers",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC3973UserDirectorySearch = "org.matrix.msc3973.user_directory_search",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC4039UploadFile = "org.matrix.msc4039.upload_file",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC4039DownloadFile = "org.matrix.msc4039.download_file",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC4157SendDelayedEvent = "org.matrix.msc4157.send.delayed_event",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC4157UpdateDelayedEvent = "org.matrix.msc4157.update_delayed_event",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC4407SendStickyEvent = "org.matrix.msc4407.send.sticky_event",
    /**
     * @experimental It is not recommended to rely on this existing - it can be removed without notice.
     */
    MSC4407ReceiveStickyEvent = "org.matrix.msc4407.receive.sticky_event"
}
export type Capability = MatrixCapabilities | string;
export declare const StickerpickerCapabilities: Capability[];
export declare const VideoConferenceCapabilities: Capability[];
/**
 * Determines if a capability is a capability for a timeline.
 * @param {Capability} capability The capability to test.
 * @returns {boolean} True if a timeline capability, false otherwise.
 */
export declare function isTimelineCapability(capability: Capability): boolean;
/**
 * Determines if a capability is a timeline capability for the given room.
 * @param {Capability} capability The capability to test.
 * @param {string | Symbols.AnyRoom} roomId The room ID, or `Symbols.AnyRoom` for that designation.
 * @returns {boolean} True if a matching capability, false otherwise.
 */
export declare function isTimelineCapabilityFor(capability: Capability, roomId: string | Symbols.AnyRoom): boolean;
/**
 * Gets the room ID described by a timeline capability.
 * @param {string} capability The capability to parse.
 * @returns {string} The room ID.
 */
export declare function getTimelineRoomIDFromCapability(capability: Capability): string;
