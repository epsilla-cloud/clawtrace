import { type Room } from "./room.ts";
/**
 * Determine the order of two events in a room.
 *
 * In principle this should use the same order as the server, but in practice
 * this is difficult for events that were not received over the Sync API. See
 * MSC4033 for details.
 *
 * This implementation leans on the order of events within their timelines, and
 * falls back to comparing event timestamps when they are in different
 * timelines.
 *
 * See https://github.com/matrix-org/matrix-js-sdk/issues/3325 for where we are
 * tracking the work to fix this.
 *
 * @param room - the room we are looking in
 * @param leftEventId - the id of the first event
 * @param rightEventId - the id of the second event

 * @returns -1 if left \< right, 1 if left \> right, 0 if left == right, null if
 *          we can't tell (because we can't find the events).
 */
export declare function compareEventOrdering(room: Room, leftEventId: string, rightEventId: string): number | null;
//# sourceMappingURL=compare-event-ordering.d.ts.map