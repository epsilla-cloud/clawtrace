import { type Direction, EventTimeline } from "./models/event-timeline.ts";
import { type MatrixClient } from "./client.ts";
import { type EventTimelineSet } from "./models/event-timeline-set.ts";
import { type MatrixEvent } from "./models/event.ts";
interface IOpts {
    /**
     * Maximum number of events to keep in the window. If more events are retrieved via pagination requests,
     * excess events will be dropped from the other end of the window.
     */
    windowLimit?: number;
}
export declare class TimelineWindow {
    private readonly client;
    private readonly timelineSet;
    private readonly windowLimit;
    private start?;
    private end?;
    private eventCount;
    /**
     * Construct a TimelineWindow.
     *
     * <p>This abstracts the separate timelines in a Matrix {@link Room} into a single iterable thing.
     * It keeps track of the start and endpoints of the window, which can be advanced with the help
     * of pagination requests.
     *
     * <p>Before the window is useful, it must be initialised by calling {@link TimelineWindow#load}.
     *
     * <p>Note that the window will not automatically extend itself when new events
     * are received from /sync; you should arrange to call {@link TimelineWindow#paginate}
     * on {@link RoomEvent.Timeline} events.
     *
     * <p>Note that constructing an instance of this class for a room adds a
     * listener for RoomEvent.Timeline events which is never removed. In theory
     * this should not cause a leak since the EventEmitter uses weak mappings.
     *
     * @param client -   MatrixClient to be used for context/pagination
     *   requests.
     *
     * @param timelineSet -  The timelineSet to track
     *
     * @param opts - Configuration options for this window
     */
    constructor(client: MatrixClient, timelineSet: EventTimelineSet, opts?: IOpts);
    /**
     * Initialise the window to point at a given event, or the live timeline
     *
     * @param initialEventId -   If given, the window will contain the
     *    given event
     * @param initialWindowSize -   Size of the initial window
     */
    load(initialEventId?: string, initialWindowSize?: number): Promise<void>;
    /**
     * Get the TimelineIndex of the window in the given direction.
     *
     * @param direction -   EventTimeline.BACKWARDS to get the TimelineIndex
     * at the start of the window; EventTimeline.FORWARDS to get the TimelineIndex at
     * the end.
     *
     * @returns The requested timeline index if one exists, null
     * otherwise.
     */
    getTimelineIndex(direction: Direction): TimelineIndex | null;
    /**
     * Try to extend the window using events that are already in the underlying
     * TimelineIndex.
     *
     * @param direction -   EventTimeline.BACKWARDS to try extending it
     *   backwards; EventTimeline.FORWARDS to try extending it forwards.
     * @param size -   number of events to try to extend by.
     *
     * @returns true if the window was extended, false otherwise.
     */
    extend(direction: Direction, size: number): boolean;
    private onTimelineEvent;
    /**
     * If an event was removed, meaning this window is longer than the timeline,
     * shorten the window.
     */
    private onEventRemoved;
    /**
     * Check if this window can be extended
     *
     * <p>This returns true if we either have more events, or if we have a
     * pagination token which means we can paginate in that direction. It does not
     * necessarily mean that there are more events available in that direction at
     * this time.
     *
     * @param direction -   EventTimeline.BACKWARDS to check if we can
     *   paginate backwards; EventTimeline.FORWARDS to check if we can go forwards
     *
     * @returns true if we can paginate in the given direction
     */
    canPaginate(direction: Direction): boolean;
    /**
     * Attempt to extend the window
     *
     * @param direction -   EventTimeline.BACKWARDS to extend the window
     *    backwards (towards older events); EventTimeline.FORWARDS to go forwards.
     *
     * @param size -   number of events to try to extend by. If fewer than this
     *    number are immediately available, then we return immediately rather than
     *    making an API call.
     *
     * @param makeRequest - whether we should make API calls to
     *    fetch further events if we don't have any at all. (This has no effect if
     *    the room already knows about additional events in the relevant direction,
     *    even if there are fewer than 'size' of them, as we will just return those
     *    we already know about.)
     *
     * @param requestLimit - limit for the number of API requests we
     *    should make.
     *
     * @returns Promise which resolves to a boolean which is true if more events
     *    were successfully retrieved.
     */
    paginate(direction: Direction, size: number, makeRequest?: boolean, requestLimit?: number): Promise<boolean>;
    /**
     * Remove `delta` events from the start or end of the timeline.
     *
     * @param delta - number of events to remove from the timeline
     * @param startOfTimeline - if events should be removed from the start
     *     of the timeline.
     */
    unpaginate(delta: number, startOfTimeline: boolean): void;
    /**
     * Get a list of the events currently in the window
     *
     * @returns the events in the window
     */
    getEvents(): MatrixEvent[];
}
/**
 * A thing which contains a timeline reference, and an index into it.
 * @internal
 */
export declare class TimelineIndex {
    timeline: EventTimeline;
    index: number;
    pendingPaginate?: Promise<boolean>;
    constructor(timeline: EventTimeline, index: number);
    /**
     * @returns the minimum possible value for the index in the current
     *    timeline
     */
    minIndex(): number;
    /**
     * @returns the maximum possible value for the index in the current
     *    timeline (exclusive - ie, it actually returns one more than the index
     *    of the last element).
     */
    maxIndex(): number;
    /**
     * Try move the index forward, or into the neighbouring timeline
     *
     * @param delta -  number of events to advance by
     * @returns number of events successfully advanced by
     */
    advance(delta: number): number;
    /**
     * Try move the index backwards, or into the neighbouring timeline
     *
     * @param delta -  number of events to retreat by
     * @returns number of events successfully retreated by
     */
    retreat(delta: number): number;
}
export {};
//# sourceMappingURL=timeline-window.d.ts.map