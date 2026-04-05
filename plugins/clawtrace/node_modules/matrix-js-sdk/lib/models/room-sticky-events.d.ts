import { type MatrixEvent } from "./event.ts";
import { TypedEventEmitter } from "./typed-event-emitter.ts";
export declare enum RoomStickyEventsEvent {
    Update = "RoomStickyEvents.Update"
}
export type StickyMatrixEvent = MatrixEvent & {
    unstableStickyExpiresAt: number;
};
export type RoomStickyEventsMap = {
    /**
     * Fires when any sticky event changes happen in a room.
     * @param added Any new sticky events with no predecessor events (matching sender, type, and sticky_key)
     * @param updated Any sticky events that supersede an existing event (matching sender, type, and sticky_key)
     * @param removed The events that were removed from the map due to expiry.
     */
    [RoomStickyEventsEvent.Update]: (added: StickyMatrixEvent[], updated: {
        current: StickyMatrixEvent;
        previous: StickyMatrixEvent;
    }[], removed: StickyMatrixEvent[]) => void;
};
/**
 * Tracks sticky events on behalf of one room, and fires an event
 * whenever a sticky event is updated or replaced.
 */
export declare class RoomStickyEventsStore extends TypedEventEmitter<RoomStickyEventsEvent, RoomStickyEventsMap> {
    /**
     * Sticky event map is a nested map of:
     *  eventType -> `content.sticky_key sender` -> StickyMatrixEvent[]
     *
     * The events are ordered in latest to earliest expiry, so that the first event
     * in the array will always be the "current" one.
     */
    private readonly stickyEventsMap;
    /**
     * These are sticky events that have no sticky key and therefore exist outside the tuple
     * system above. They are just held in this Set until they expire.
     */
    private readonly unkeyedStickyEvents;
    private stickyEventTimer?;
    private nextStickyEventExpiryTs;
    /**
     * Sort two sticky events by order of expiry. This assumes the sticky events have the same
     * `type`, `sticky_key` and `sender`.
     * @returns A positive value if event A will expire sooner, or a negative value if event B will expire sooner.
     */
    private static sortStickyEvent;
    /**
     * Generate the correct key for an event to be found in the inner maps of `stickyEventsMap`.
     * @param stickyKey The sticky key of an event.
     * @param sender The sender of the event.
     */
    private static stickyMapKey;
    /**
     * Get all sticky events that are currently active.
     * @returns An iterable set of events.
     */
    getStickyEvents(): Iterable<StickyMatrixEvent>;
    /**
     * Get an active sticky event that match the given `type`, `sender`, and `stickyKey`
     * @param type The event `type`.
     * @param sender The sender of the sticky event.
     * @param stickyKey The sticky key used by the event.
     * @returns A matching active sticky event, or undefined.
     */
    getKeyedStickyEvent(sender: string, type: string, stickyKey: string): StickyMatrixEvent | undefined;
    /**
     * Get active sticky events without a sticky key that match the given `type` and `sender`.
     * @param type The event `type`.
     * @param sender The sender of the sticky event.
     * @returns An array of matching sticky events.
     */
    getUnkeyedStickyEvent(sender: string, type: string): StickyMatrixEvent[];
    /**
     * Adds a sticky event into the local sticky event map.
     *
     * NOTE: This will not cause `RoomEvent.StickyEvents` to be emitted.
     *
     * @throws If the `event` does not contain valid sticky data.
     * @param event The MatrixEvent that contains sticky data.
     * @returns An object describing whether the event was added to the map,
     *          and the previous event it may have replaced.
     */
    private addStickyEvent;
    /**
     * Add a series of sticky events, emitting `RoomEvent.StickyEvents` if any
     * changes were made.
     * @param events A set of new sticky events.
     */
    addStickyEvents(events: MatrixEvent[]): void;
    /**
     * Schedule the sticky event expiry timer. The timer will
     * run immediately if an event has already expired.
     */
    private scheduleStickyTimer;
    /**
     * Clean out any expired sticky events.
     */
    private readonly cleanExpiredStickyEvents;
    /**
     * Handles incoming event redactions. Checks the sticky map
     * for any active sticky events being redacted.
     * @param redactedEvent The MatrixEvent OR event ID of the event being redacted. MAY not be a sticky event.
     */
    handleRedaction(redactedEvent: MatrixEvent | string): void;
    /**
     * Clear all events and stop the timer from firing.
     */
    clear(): void;
}
//# sourceMappingURL=room-sticky-events.d.ts.map